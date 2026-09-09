import { supabase } from './supabaseClient';

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

    return (data || []).map(row => ({
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
      .limit(50);

    if (error) throw error;

    return (data || []).map(row => ({
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

export async function saveUserCustomTask(userId, task, isPublic = false, creatorEmail = '') {
  if (!userId || !task) return null;
  try {
    const row = {
      id: task.id || `task-${Date.now()}`,
      user_id: userId,
      task_data: task,
      is_public: isPublic,
      creator_email: creatorEmail || 'Anonymous',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_custom_tasks')
      .upsert(row);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error saving custom task to Supabase:', err);
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
  if (!userId || !taskId) return;
  try {
    const { error } = await supabase
      .from('user_custom_tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('Error deleting custom task from Supabase:', err);
  }
}
