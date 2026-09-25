import { supabase } from './supabaseClient.js';

/**
 * Service to sync user submissions and vocab notebook with Supabase Cloud
 */

// --- SUBMISSIONS SYNC ---

export async function fetchUserSubmissions(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('user_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map database rows to application submission model
    return (data || []).map(row => ({
      id: row.id,
      task: row.task,
      essayText: row.essay_text,
      evaluation: row.evaluation,
      stats: row.stats,
      date: new Date(row.created_at).toLocaleDateString('vi-VN', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    }));
  } catch (err) {
    console.error('Error fetching submissions from Supabase:', err);
    return [];
  }
}

export async function saveUserSubmission(userId, submission) {
  if (!userId || !submission) return null;
  try {
    const row = {
      id: submission.id || `sub-${Date.now()}`,
      user_id: userId,
      task: submission.task,
      essay_text: submission.essayText,
      evaluation: submission.evaluation,
      stats: submission.stats,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_submissions')
      .upsert(row);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving submission to Supabase:', err);
    return null;
  }
}

export async function deleteUserSubmission(userId, submissionId) {
  if (!userId || !submissionId) return;
  try {
    const { error } = await supabase
      .from('user_submissions')
      .delete()
      .eq('id', submissionId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting submission from Supabase:', err);
  }
}

// --- VOCAB NOTEBOOK SYNC ---

export async function fetchUserVocab(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('user_vocab')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || [])
      .filter(row => row.topic !== '_mastered_meta')
      .map(row => ({
        id: row.id,
        phrase: row.phrase,
        meaningVi: row.meaning_vi,
        example: row.example,
        topic: row.topic
      }));
  } catch (err) {
    console.error('Error fetching vocab from Supabase:', err);
    return [];
  }
}

export async function saveUserVocabItem(userId, vocabItem) {
  if (!userId || !vocabItem) return null;
  try {
    const row = {
      id: vocabItem.id || `v-${Date.now()}`,
      user_id: userId,
      phrase: vocabItem.phrase,
      meaning_vi: vocabItem.meaningVi || '',
      example: vocabItem.example || '',
      topic: vocabItem.topic || 'general',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_vocab')
      .upsert(row);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving vocab to Supabase:', err);
    return null;
  }
}

export async function deleteUserVocabItem(userId, vocabId) {
  if (!userId || !vocabId) return;
  try {
    const { error } = await supabase
      .from('user_vocab')
      .delete()
      .eq('id', vocabId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting vocab from Supabase:', err);
  }
}

// --- CUSTOM & COMMUNITY TASKS SYNC ---

export async function fetchUserCustomTasks(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('user_custom_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      ...row.task_data,
      id: row.id,
      isPublic: row.is_public,
      creatorEmail: row.creator_email,
      isOwnTask: true
    }));
  } catch (err) {
    console.error('Error fetching user custom tasks from Supabase:', err);
    return [];
  }
}

export async function fetchPublicTasks() {
  try {
    const { data, error } = await supabase
      .from('user_custom_tasks')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) throw error;

    return (data || [])
      .filter(row => !row.id.startsWith('custom-drill-') && !row.id.startsWith('drill-') && (!row.task_data || !row.task_data.isDrill))
      .map(row => ({
        ...row.task_data,
        id: row.id,
        isPublic: true,
        creatorEmail: row.creator_email,
        isCommunity: true
      }));
  } catch (err) {
    console.error('Error fetching public community tasks:', err);
    return [];
  }
}

/**
 * Fetch all public community micro-drills from Supabase Cloud
 */
export async function fetchPublicDrills() {
  try {
    const { data, error } = await supabase
      .from('user_custom_tasks')
      .select('*')
      .eq('is_public', true)
      .or('id.like.custom-drill-%,id.like.drill-%')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return (data || []).map(row => ({
      ...row.task_data,
      id: row.id,
      isPublic: true,
      isCommunity: true,
      creatorEmail: row.creator_email || 'Cộng Đồng IELTS'
    }));
  } catch (err) {
    console.error('Error fetching public community drills:', err);
    return [];
  }
}

/**
 * Save an AI-generated micro-drill to Supabase Cloud for all visitors
 */
export async function savePublicDrill(drill) {
  if (!drill || !drill.id) return null;
  try {
    const row = {
      id: drill.id,
      task_data: { ...drill, isDrill: true },
      is_public: true,
      creator_email: drill.creatorEmail || 'Cộng Đồng IELTS',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_custom_tasks')
      .upsert(row);

    if (error) {
      console.warn('Could not sync drill to Supabase cloud:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error saving public drill to Supabase:', err);
    return null;
  }
}

/**
 * Delete / unpublish a public micro-drill from Supabase Cloud
 */
export async function deletePublicDrill(drillId) {
  if (!drillId) return;
  try {
    await supabase.from('user_custom_tasks').delete().eq('id', drillId);
  } catch (err) {
    console.warn('Error deleting public drill from Supabase:', err);
  }
}

export async function saveUserCustomTask(userId = null, task, isPublic = false, creatorEmail = '') {
  if (!task) return null;
  // If not logged in and not public, don't attempt to sync private tasks of anonymous users to cloud
  if (!userId && !isPublic) return null;
  try {
    const row = {
      id: task.id || `task-${Date.now()}`,
      task_data: task,
      is_public: Boolean(isPublic),
      creator_email: creatorEmail || (userId ? 'Thành viên' : 'Cộng đồng'),
      created_at: new Date().toISOString()
    };
    if (userId) {
      row.user_id = userId;
    }

    const { data, error } = await supabase
      .from('user_custom_tasks')
      .upsert(row);

    if (error) {
      console.warn('Supabase cloud task sync notice (RLS or offline):', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error saving custom task to Supabase:', err);
    return null;
  }
}

export async function toggleTaskPublicity(userId, taskId, isPublic) {
  if (!userId || !taskId) return;
  try {
    const { error } = await supabase
      .from('user_custom_tasks')
      .update({ is_public: isPublic })
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('Error toggling task publicity:', err);
  }
}

export async function deleteUserCustomTask(userId, taskId) {
  if (!taskId) return;
  try {
    let query = supabase.from('user_custom_tasks').delete().eq('id', taskId);
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }
    const { error } = await query;
    if (error) {
      console.warn('Supabase delete custom task notice:', error.message);
    }
  } catch (err) {
    console.warn('Error deleting custom task from Supabase:', err);
  }
}

/**
 * Fetch list of mastered task/drill IDs for authenticated user from Supabase Cloud
 */
export async function fetchUserMasteredItems(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('user_vocab')
      .select('phrase')
      .eq('user_id', userId)
      .eq('topic', '_mastered_meta')
      .maybeSingle();

    if (error) {
      console.warn('Could not fetch mastered items from Cloud:', error.message);
      return [];
    }
    if (data?.phrase) {
      return JSON.parse(data.phrase);
    }
    return [];
  } catch (err) {
    console.warn('Error fetching mastered items:', err);
    return [];
  }
}

/**
 * Save list of mastered task/drill IDs for authenticated user to Supabase Cloud
 */
export async function saveUserMasteredItems(userId, masteredIds = []) {
  if (!userId) return null;
  try {
    const row = {
      id: `mastered-${userId}`,
      user_id: userId,
      phrase: JSON.stringify(masteredIds),
      meaning_vi: 'Danh sách đề thi và câu hỏi đã thuộc',
      topic: '_mastered_meta',
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('user_vocab')
      .upsert(row);

    if (error) {
      console.warn('Could not save mastered items to Cloud:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error saving mastered items to Cloud:', err);
    return null;
  }
}

/**
 * Fetch public AI-generated spelling traps, grammar drills, and flashcards from Supabase Cloud
 */
export async function fetchPublicVocabGrammarItems() {
  try {
    const { data, error } = await supabase
      .from('user_custom_tasks')
      .select('*')
      .eq('is_public', true)
      .or('id.like.ai-sp-%,id.like.ai-gr-%,id.like.ai-card-%')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    return (data || []).map(row => ({
      ...row.task_data,
      id: row.id,
      isPublic: true,
      isCommunity: true,
      creatorEmail: row.creator_email || 'Cộng Đồng IELTS'
    }));
  } catch (err) {
    console.error('Error fetching public vocab/grammar items:', err);
    return [];
  }
}

/**
 * Save an AI-generated spelling trap, grammar drill or flashcard to Supabase Cloud for all visitors
 */
export async function savePublicVocabGrammarItem(item) {
  if (!item || !item.id) return null;
  try {
    const row = {
      id: item.id,
      task_data: item,
      is_public: true,
      creator_email: item.creatorEmail || 'Cộng Đồng IELTS',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_custom_tasks')
      .upsert(row);

    if (error) {
      console.warn('Could not sync vocab/grammar item to Supabase cloud:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Error saving public vocab/grammar item to Supabase:', err);
    return null;
  }
}

/**
 * Delete / unpublish a public vocab/grammar item from Supabase Cloud
 */
export async function deletePublicVocabGrammarItem(itemId) {
  if (!itemId) return;
  try {
    await supabase.from('user_custom_tasks').delete().eq('id', itemId);
  } catch (err) {
    console.warn('Error deleting public vocab/grammar item from Supabase:', err);
  }
}
