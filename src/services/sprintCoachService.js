/**
 * Adaptive 30-Min Sprint Coach Service
 * 
 * Automatically analyzes learner's submission history, logged mistakes,
 * and target band to synthesize a personalized, high-intensity 30-minute daily sprint:
 * - Stage 1 (7 mins): Accuracy & Error Elimination Warm-up (SRS mini-drills)
 * - Stage 2 (15 mins): Core Skill Intensive (Targeting primary bottleneck)
 * - Stage 3 (8 mins): Lexical & Academic Consolidation (C1/C2 collocations + review)
 */

import { DEFAULT_IELTS_TRAPS } from './prescriptionService.js';

export const SPRINT_STORAGE_KEY_PROGRESS = 'ielts_adaptive_sprint_today_progress';
export const SPRINT_STORAGE_KEY_HISTORY = 'ielts_adaptive_sprint_history';
export const SPRINT_STORAGE_KEY_STREAK = 'ielts_adaptive_sprint_streak';

const memoryStore = new Map();

function safeStorageGet(key, fallback = null) {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    }
  } catch {}
  if (memoryStore.has(key)) {
    return memoryStore.get(key);
  }
  return fallback;
}

function safeStorageSet(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }
  } catch {}
  memoryStore.set(key, value);
}

/**
 * Curated C1/C2 Academic Collocations for Stage 3 Consolidation
 */
export const SPRINT_LEXICAL_BANK = [
  {
    phrase: 'exert a profound influence on',
    bandLevel: '8.0+',
    meaningVi: 'tạo ra ảnh hưởng sâu rộng lên',
    example: 'Technological advancements exert a profound influence on modern pedagogical methods.',
    category: 'academic_writing'
  },
  {
    phrase: 'incur substantial expenditure',
    bandLevel: '8.0+',
    meaningVi: 'phát sinh chi phí đáng kể',
    example: 'Municipal authorities often incur substantial expenditure on public transit infrastructure.',
    category: 'task1_task2'
  },
  {
    phrase: 'corroborate empirical evidence',
    bandLevel: '8.5+',
    meaningVi: 'chứng thực các bằng chứng thực nghiệm',
    example: 'Recent scientific trials corroborate empirical evidence regarding climate shifts.',
    category: 'academic_collocation'
  },
  {
    phrase: 'give rise to fierce contention',
    bandLevel: '7.5+',
    meaningVi: 'làm dấy lên sự tranh cãi gay gắt',
    example: 'The introduction of automated toll booths has given rise to fierce contention.',
    category: 'task2_argument'
  },
  {
    phrase: 'play a pivotal role in',
    bandLevel: '7.5+',
    meaningVi: 'đóng vai trò nòng cốt then chốt trong',
    example: 'Early childhood education plays a pivotal role in cognitive development.',
    category: 'universal'
  },
  {
    phrase: 'stem from a lack of foresight',
    bandLevel: '8.0+',
    meaningVi: 'bắt nguồn từ sự thiếu nhìn xa trông rộng',
    example: 'Urban traffic congestion predominantly stems from a lack of long-term foresight.',
    category: 'task2_cause_effect'
  }
];

/**
 * Diagnoses learner profile to find primary learning bottleneck
 * @returns {object} { bottleneck: string, focusSkill: string, diagnosisText: string, urgencyScore: number }
 */
export function diagnoseLearnerProfile({
  submissions = [],
  mistakes = [],
  vocabList = [],
  targetBand = '7.0'
} = {}) {
  const target = parseFloat(targetBand) || 7.0;
  const recentSubs = Array.isArray(submissions) ? submissions.slice(0, 10) : [];
  const mistakeCount = Array.isArray(mistakes) ? mistakes.length : 0;

  // 1. Check if unhandled grammar/vocabulary errors are accumulating
  if (mistakeCount >= 4) {
    return {
      bottleneck: 'accuracy_traps',
      focusSkill: 'all',
      urgencyScore: 92,
      diagnosisText: `Bạn đang có ${mistakeCount} lỗi sai trong Sổ lỗi chưa được triệt tiêu. Cần ưu tiên làm sạch ngữ pháp và mạo từ trước khi tăng tốc viết bài dài.`
    };
  }

  // 2. Count submissions per skill
  const writingCount = recentSubs.filter(s => s.type?.includes('task') || s.taskNumber || s.essayText).length;
  const speakingCount = recentSubs.filter(s => s.speakingTopic || s.sttTranscript || s.audioBlob).length;

  // If speaking has been neglected
  if (speakingCount === 0 || speakingCount < writingCount / 2) {
    return {
      bottleneck: 'speaking_fluency',
      focusSkill: 'speaking',
      urgencyScore: 88,
      diagnosisText: `Lịch sử cho thấy bạn đang dành phần lớn thời gian cho bài viết và chưa kích hoạt phản xạ Nói Part 2/3. Hôm nay Huấn luyện viên kích hoạt phiên Speaking Reflex Sprint.`
    };
  }

  // If writing Task 2 argument needs strengthening
  if (target >= 7.0) {
    return {
      bottleneck: 'writing_coherence',
      focusSkill: 'writing',
      urgencyScore: 85,
      diagnosisText: `Mục tiêu Band ${target} đòi hỏi chuỗi lập luận PEEL không có bước nhảy cóc. Hôm nay Sprint sẽ tập trung vào phát triển đoạn thân bài logic chặt chẽ.`
    };
  }

  // Balanced default
  return {
    bottleneck: 'balanced_pace',
    focusSkill: 'writing',
    urgencyScore: 80,
    diagnosisText: `Lộ trình hôm nay cân bằng giữa sửa bẫy ngữ pháp, tăng tốc phản xạ câu và mở rộng vốn từ vựng học thuật C1.`
  };
}

/**
 * Generates an adaptive 3-stage, 30-minute sprint plan for today
 */
export function generateDaily30MinSprint({
  submissions = [],
  mistakes = [],
  vocabList = [],
  targetBand = '7.0'
} = {}) {
  const todayDate = new Date().toISOString().slice(0, 10);
  const diagnosis = diagnoseLearnerProfile({ submissions, mistakes, vocabList, targetBand });

  // Stage 1: Accuracy & Error Warm-up (7 mins)
  let stage1Questions = [];
  if (Array.isArray(mistakes) && mistakes.length >= 3) {
    stage1Questions = mistakes.slice(0, 3).map((m, idx) => ({
      id: `err-${m.id || idx}`,
      title: m.category || 'Lỗi từ vựng/ngữ pháp cá nhân',
      question: m.errorSentence || m.title || 'Phát hiện lỗi sai trong câu sau:',
      options: [
        m.errorSentence || 'Câu có lỗi sai',
        m.correctedSentence || m.replacement || 'Câu đã sửa chuẩn xác',
        'Cả hai cách đều sai'
      ],
      correctIndex: 1,
      explanation: m.explanation || 'Quy tắc: Luôn chú ý thì của động từ và mạo từ xác định.'
    }));
  } else {
    stage1Questions = DEFAULT_IELTS_TRAPS.slice(0, 3).map(trap => ({
      id: trap.id,
      title: trap.title,
      question: trap.quiz?.question || trap.title,
      options: trap.quiz?.options || trap.options,
      correctIndex: trap.quiz?.correctIndex ?? trap.correctIndex ?? 0,
      explanation: trap.explanation
    }));
  }

  const stage1 = {
    index: 0,
    id: 'stage-1-accuracy',
    title: 'Chặng 1: Khởi Động & Xóa Bẫy Lỗi Sai',
    subtitle: 'Triệt tiêu các bẫy ngữ pháp và mạo từ hay mất điểm',
    durationMinutes: 7,
    durationSeconds: 7 * 60,
    type: 'error_quiz',
    questions: stage1Questions,
    badge: '🎯 7 Phút Khởi Động'
  };

  // Stage 2: Core Skill Intensive (15 mins)
  let stage2 = null;
  if (diagnosis.bottleneck === 'speaking_fluency') {
    stage2 = {
      index: 1,
      id: 'stage-2-speaking-reflex',
      title: 'Chặng 2: Nước Rút Phản Xạ Speaking Part 2',
      subtitle: 'Thực hành dàn ý 4 ô trong 60s và nói trọn vẹn 2 phút',
      durationMinutes: 15,
      durationSeconds: 15 * 60,
      type: 'speaking_cuecard',
      cueCard: {
        topic: 'Describe a challenging project you successfully completed',
        prompts: [
          'What the project was',
          'Who you worked with or did it alone',
          'What difficulties you encountered',
          'And explain why you felt proud of completing it'
        ],
        strategy: 'Áp dụng công thức 4 ô: Context ➔ Action ➔ Overcoming Obstacles ➔ Reflection.'
      },
      badge: '🎙️ 15 Phút Speaking'
    };
  } else {
    stage2 = {
      index: 1,
      id: 'stage-2-writing-peel',
      title: 'Chặng 2: Luyện Thân Bài Chuẩn Mạch Lạc PEEL',
      subtitle: 'Xây dựng 1 đoạn Body Paragraph hoàn chỉnh theo chuẩn Cambridge',
      durationMinutes: 15,
      durationSeconds: 15 * 60,
      type: 'writing_paragraph',
      taskPrompt: 'Some people believe that governments should spend money on space exploration, while others argue that public funds should be prioritized for immediate issues on Earth.',
      requiredFramework: 'PEEL (Point ➔ Explanation ➔ Evidence ➔ Link)',
      suggestedTopicSentence: 'Allocating substantial expenditure to space ventures yields long-term technological and economic dividends.',
      badge: '✍️ 15 Phút Writing PEEL'
    };
  }

  // Stage 3: Lexical & Academic Consolidation (8 mins)
  const availableLexical = SPRINT_LEXICAL_BANK.slice(0, 3);
  const stage3 = {
    index: 2,
    id: 'stage-3-lexical-consolidation',
    title: 'Chặng 3: Nạp Từ Vựng C1/C2 & Tổng Kết',
    subtitle: 'Nâng cấp 3 cụm Collocations học thuật vào bài và ghi nhớ',
    durationMinutes: 8,
    durationSeconds: 8 * 60,
    type: 'lexical_consolidation',
    vocabItems: availableLexical,
    badge: '💎 8 Phút Từ Vựng'
  };

  return {
    sprintId: `sprint-${todayDate}`,
    date: todayDate,
    targetBand,
    totalMinutes: 30,
    diagnosis,
    stages: [stage1, stage2, stage3]
  };
}

/**
 * Retrieves today's current sprint progress from storage
 */
export function getTodaySprintProgress() {
  const todayDate = new Date().toISOString().slice(0, 10);
  const saved = safeStorageGet(SPRINT_STORAGE_KEY_PROGRESS, null);

  if (saved && saved.date === todayDate) {
    return saved;
  }

  // Initial fresh progress for today
  return {
    date: todayDate,
    currentStageIndex: 0,
    isCompleted: false,
    stageCompletedStatus: [false, false, false],
    timeSpentSeconds: [0, 0, 0],
    completedAt: null
  };
}

/**
 * Saves updated sprint progress for today
 */
export function saveTodaySprintProgress(progress) {
  const todayDate = new Date().toISOString().slice(0, 10);
  safeStorageSet(SPRINT_STORAGE_KEY_PROGRESS, {
    ...progress,
    date: todayDate
  });
}

/**
 * Records sprint completion, updates streak counter, and appends to history log
 */
export function recordSprintCompletion(sprintData = {}) {
  const todayDate = new Date().toISOString().slice(0, 10);
  
  // 1. Update streak
  const streakData = safeStorageGet(SPRINT_STORAGE_KEY_STREAK, { currentStreak: 0, lastDate: '' });
  let nextStreak = 1;

  if (streakData.lastDate) {
    const last = new Date(streakData.lastDate);
    const today = new Date(todayDate);
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      nextStreak = (streakData.currentStreak || 0) + 1;
    } else if (diffDays === 0) {
      nextStreak = streakData.currentStreak || 1;
    }
  }

  const updatedStreak = {
    currentStreak: nextStreak,
    lastDate: todayDate
  };
  safeStorageSet(SPRINT_STORAGE_KEY_STREAK, updatedStreak);

  // 2. Append to history log
  const history = safeStorageGet(SPRINT_STORAGE_KEY_HISTORY, []);
  const entry = {
    id: `sprint-hist-${Date.now()}`,
    date: todayDate,
    completedAt: new Date().toISOString(),
    totalMinutes: 30,
    primaryFocus: sprintData.diagnosis?.bottleneck || 'balanced',
    ...sprintData
  };
  
  const updatedHistory = [entry, ...history.filter(h => h.date !== todayDate)].slice(0, 30);
  safeStorageSet(SPRINT_STORAGE_KEY_HISTORY, updatedHistory);

  // 3. Mark today progress as complete
  const todayProgress = getTodaySprintProgress();
  todayProgress.isCompleted = true;
  todayProgress.stageCompletedStatus = [true, true, true];
  todayProgress.completedAt = new Date().toISOString();
  saveTodaySprintProgress(todayProgress);

  return {
    streak: nextStreak,
    historyEntry: entry
  };
}

/**
 * Returns streak and historical sprint summary
 */
export function getSprintStats() {
  const streakData = safeStorageGet(SPRINT_STORAGE_KEY_STREAK, { currentStreak: 0, lastDate: '' });
  const history = safeStorageGet(SPRINT_STORAGE_KEY_HISTORY, []);
  
  return {
    currentStreak: streakData.currentStreak || 0,
    totalSprintsCompleted: history.length,
    totalMinutesTrained: history.length * 30
  };
}
