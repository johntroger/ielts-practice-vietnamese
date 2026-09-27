/**
 * IELTS Web - AI Content Deduplication & Anti-Redundancy Engine
 * 
 * Provides:
 * 1. Standard IELTS exam rubric stripping for accurate semantic comparison.
 * 2. Lexical & semantic duplicate detection.
 * 3. Automatic cleaning & pruning of duplicate/near-identical AI-generated tasks and questions.
 * 4. Automatic startup & runtime sanitization for LocalStorage and Cloud sync.
 */

import { calculateLexicalOverlap } from './geminiService.js';

/**
 * Common Cambridge rubrics and tags to strip before comparing semantic essence
 */
const CAMBRIDGE_BOILERPLATE_PATTERNS = [
  /summarise the information by selecting and reporting the main features,?\s*(and make comparisons where relevant\.?)?/gi,
  /summarize the information by selecting and reporting the main features,?\s*(and make comparisons where relevant\.?)?/gi,
  /give reasons for your answer and include any relevant examples from your own knowledge or experience\.?/gi,
  /write at least (150|250) words\.?/gi,
  /to what extent do you agree or disagree\??/gi,
  /discuss both views and give your own opinion\.?/gi,
  /do the advantages outweigh the disadvantages\??/gi,
  /what are the advantages and disadvantages\??/gi,
  /what are the causes of this,?\s*and what solutions can be implemented\??/gi,
  /you should say:?/gi,
  /describe a(n)?/gi,
  /[✨⭐\[\]\(\)]/g,
  /ai cộng đồng/gi,
  /cộng đồng ielts/gi
];

/**
 * Cleans text to focus strictly on semantic subject matter
 */
export function stripStandardIeltsBoilerplate(text) {
  if (!text || typeof text !== 'string') return '';
  let cleaned = text;
  for (const pattern of CAMBRIDGE_BOILERPLATE_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  return cleaned.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Checks if two items (tasks, questions, or topics) are semantic duplicates
 */
export function isSemanticDuplicate(item1, item2, threshold = 0.75) {
  if (!item1 || !item2) return false;

  const title1 = stripStandardIeltsBoilerplate(item1.title || item1.topic || '');
  const title2 = stripStandardIeltsBoilerplate(item2.title || item2.topic || '');

  // Exact match on stripped title
  if (title1 && title2 && title1 === title2) {
    return true;
  }

  // Lexical overlap on titles
  if (title1 && title2) {
    const titleOverlap = calculateLexicalOverlap(title1, title2);
    if (titleOverlap >= threshold) {
      return true;
    }
  }

  // Check prompt / question text if present
  const prompt1 = stripStandardIeltsBoilerplate(item1.prompt || item1.question || '');
  const prompt2 = stripStandardIeltsBoilerplate(item2.prompt || item2.question || '');

  if (prompt1 && prompt2) {
    if (prompt1 === prompt2) return true;
    const promptOverlap = calculateLexicalOverlap(prompt1, prompt2);
    if (promptOverlap >= threshold) {
      return true;
    }
  }

  return false;
}

/**
 * Deduplicates an array of Writing tasks.
 * Keeps official tasks always; for custom/AI tasks, drops any task that matches an earlier retained task.
 */
export function deduplicateWritingTasks(tasks, threshold = 0.75) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return { cleanedTasks: [], removedCount: 0, removedTasks: [] };
  }

  const cleanedTasks = [];
  const removedTasks = [];

  for (const task of tasks) {
    if (!task) continue;

    // Check if task is duplicate of any already retained task
    const duplicateOf = cleanedTasks.find(existing => {
      // Must be same taskNumber (Task 1 vs Task 2 never duplicate each other)
      if (Number(existing.taskNumber) !== Number(task.taskNumber)) return false;
      return isSemanticDuplicate(existing, task, threshold);
    });

    if (duplicateOf) {
      // If the incoming task is official/initial and the existing is custom, swap to keep official
      const isIncomingOfficial = !task.isAiGenerated && !task.isCustom && !task.id?.startsWith('ai-');
      const isExistingOfficial = !duplicateOf.isAiGenerated && !duplicateOf.isCustom && !duplicateOf.id?.startsWith('ai-');

      if (isIncomingOfficial && !isExistingOfficial) {
        const index = cleanedTasks.indexOf(duplicateOf);
        cleanedTasks[index] = task;
        removedTasks.push({ task: duplicateOf, duplicateOf: task.id, reason: 'Replaced with official standard' });
      } else {
        removedTasks.push({ task, duplicateOf: duplicateOf.id, reason: 'Duplicate of ' + (duplicateOf.title || duplicateOf.id) });
      }
    } else {
      cleanedTasks.push(task);
    }
  }

  return {
    cleanedTasks,
    removedCount: removedTasks.length,
    removedTasks
  };
}

/**
 * Deduplicates Speaking Part 1 Topics and cleans duplicate questions inside topics
 */
export function deduplicateSpeakingP1Topics(topics, threshold = 0.75) {
  if (!Array.isArray(topics) || topics.length === 0) {
    return { cleanedTopics: [], removedCount: 0, removedQuestionsCount: 0, removedTopics: [] };
  }

  const cleanedTopics = [];
  const removedTopics = [];
  let removedQuestionsCount = 0;

  for (const topic of topics) {
    if (!topic) continue;

    const duplicateOf = cleanedTopics.find(existing => isSemanticDuplicate(existing, topic, threshold));

    if (duplicateOf) {
      removedTopics.push({ topic, duplicateOf: duplicateOf.id });
    } else {
      // Also deduplicate questions within this topic
      const cleanedQuestions = [];
      const questions = topic.questions || [];
      for (const q of questions) {
        const qDup = cleanedQuestions.find(existingQ => {
          const s1 = stripStandardIeltsBoilerplate(existingQ.question);
          const s2 = stripStandardIeltsBoilerplate(q.question);
          return s1 === s2 || calculateLexicalOverlap(s1, s2) >= threshold;
        });
        if (qDup) {
          removedQuestionsCount++;
        } else {
          cleanedQuestions.push(q);
        }
      }

      cleanedTopics.push({
        ...topic,
        questions: cleanedQuestions
      });
    }
  }

  return {
    cleanedTopics,
    removedCount: removedTopics.length,
    removedQuestionsCount,
    removedTopics
  };
}

/**
 * Deduplicates Speaking Part 2 Cue Cards
 */
export function deduplicateSpeakingP2Cards(cards, threshold = 0.75) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return { cleanedCards: [], removedCount: 0, removedCards: [] };
  }

  const cleanedCards = [];
  const removedCards = [];

  for (const card of cards) {
    if (!card) continue;
    const duplicateOf = cleanedCards.find(existing => isSemanticDuplicate(existing, card, threshold));
    if (duplicateOf) {
      removedCards.push({ card, duplicateOf: duplicateOf.id });
    } else {
      cleanedCards.push(card);
    }
  }

  return {
    cleanedCards,
    removedCount: removedCards.length,
    removedCards
  };
}

/**
 * Deduplicates Speaking Part 3 Discussion Sets
 */
export function deduplicateSpeakingP3Sets(sets, threshold = 0.75) {
  if (!Array.isArray(sets) || sets.length === 0) {
    return { cleanedSets: [], removedCount: 0, removedSets: [] };
  }

  const cleanedSets = [];
  const removedSets = [];

  for (const set of sets) {
    if (!set) continue;
    const duplicateOf = cleanedSets.find(existing => {
      const topic1 = stripStandardIeltsBoilerplate(existing.topic || '');
      const topic2 = stripStandardIeltsBoilerplate(set.topic || '');
      return topic1 === topic2 || calculateLexicalOverlap(topic1, topic2) >= threshold;
    });

    if (duplicateOf) {
      removedSets.push({ set, duplicateOf: duplicateOf.id || duplicateOf.linkedPart2Id });
    } else {
      cleanedSets.push(set);
    }
  }

  return {
    cleanedSets,
    removedCount: removedSets.length,
    removedSets
  };
}

/**
 * Comprehensive Website Content Audit & Automated Cleanup
 * Scans LocalStorage, cleans up duplicates, and writes back sanitized data.
 */
export function auditAndCleanWebsiteContent(threshold = 0.75) {
  const auditReport = {
    writing: { initialCount: 0, cleanedCount: 0, removedCount: 0, removedTitles: [] },
    speakingP1: { initialCount: 0, cleanedCount: 0, removedCount: 0, removedTitles: [] },
    speakingP2: { initialCount: 0, cleanedCount: 0, removedCount: 0, removedTitles: [] },
    speakingP3: { initialCount: 0, cleanedCount: 0, removedCount: 0, removedTitles: [] },
    totalRemoved: 0,
    hasDuplicates: false
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    return auditReport;
  }

  // 1. Audit Writing Tasks
  try {
    const rawTasks = window.localStorage.getItem('ielts_all_tasks');
    if (rawTasks) {
      const parsedTasks = JSON.parse(rawTasks);
      if (Array.isArray(parsedTasks)) {
        auditReport.writing.initialCount = parsedTasks.length;
        const res = deduplicateWritingTasks(parsedTasks, threshold);
        auditReport.writing.cleanedCount = res.cleanedTasks.length;
        auditReport.writing.removedCount = res.removedCount;
        auditReport.writing.removedTitles = res.removedTasks.map(r => r.task.title || r.task.prompt);
        if (res.removedCount > 0) {
          window.localStorage.setItem('ielts_all_tasks', JSON.stringify(res.cleanedTasks));
        }
      }
    }
  } catch (err) {
    console.warn('Error auditing writing tasks:', err);
  }

  // 2. Audit Speaking Part 1
  try {
    const rawP1 = window.localStorage.getItem('ielts_speaking_custom_p1_topics');
    if (rawP1) {
      const parsedP1 = JSON.parse(rawP1);
      if (Array.isArray(parsedP1)) {
        auditReport.speakingP1.initialCount = parsedP1.length;
        const res = deduplicateSpeakingP1Topics(parsedP1, threshold);
        auditReport.speakingP1.cleanedCount = res.cleanedTopics.length;
        auditReport.speakingP1.removedCount = res.removedCount;
        auditReport.speakingP1.removedTitles = res.removedTopics.map(r => r.topic.title);
        if (res.removedCount > 0) {
          window.localStorage.setItem('ielts_speaking_custom_p1_topics', JSON.stringify(res.cleanedTopics));
        }
      }
    }
  } catch (err) {
    console.warn('Error auditing speaking P1:', err);
  }

  // 3. Audit Speaking Part 2
  try {
    const rawP2 = window.localStorage.getItem('ielts_speaking_custom_p2_cards');
    if (rawP2) {
      const parsedP2 = JSON.parse(rawP2);
      if (Array.isArray(parsedP2)) {
        auditReport.speakingP2.initialCount = parsedP2.length;
        const res = deduplicateSpeakingP2Cards(parsedP2, threshold);
        auditReport.speakingP2.cleanedCount = res.cleanedCards.length;
        auditReport.speakingP2.removedCount = res.removedCount;
        auditReport.speakingP2.removedTitles = res.removedCards.map(r => r.card.title || r.card.prompt);
        if (res.removedCount > 0) {
          window.localStorage.setItem('ielts_speaking_custom_p2_cards', JSON.stringify(res.cleanedCards));
        }
      }
    }
  } catch (err) {
    console.warn('Error auditing speaking P2:', err);
  }

  // 4. Audit Speaking Part 3
  try {
    const rawP3 = window.localStorage.getItem('ielts_speaking_custom_p3_sets');
    if (rawP3) {
      const parsedP3 = JSON.parse(rawP3);
      if (Array.isArray(parsedP3)) {
        auditReport.speakingP3.initialCount = parsedP3.length;
        const res = deduplicateSpeakingP3Sets(parsedP3, threshold);
        auditReport.speakingP3.cleanedCount = res.cleanedSets.length;
        auditReport.speakingP3.removedCount = res.removedCount;
        auditReport.speakingP3.removedTitles = res.removedSets.map(r => r.set.topic);
        if (res.removedCount > 0) {
          window.localStorage.setItem('ielts_speaking_custom_p3_sets', JSON.stringify(res.cleanedSets));
        }
      }
    }
  } catch (err) {
    console.warn('Error auditing speaking P3:', err);
  }

  auditReport.totalRemoved = 
    auditReport.writing.removedCount + 
    auditReport.speakingP1.removedCount + 
    auditReport.speakingP2.removedCount + 
    auditReport.speakingP3.removedCount;

  auditReport.hasDuplicates = auditReport.totalRemoved > 0;

  return auditReport;
}
