const memoryStorage = new Map();

function safeStorageGet(key, fallback = null) {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    }
  } catch {
    // fallback
  }
  if (memoryStorage.has(key)) {
    return memoryStorage.get(key);
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
  memoryStorage.set(key, value);
}

const STORAGE_KEY_DISMISSED = 'ielts_smart_recommendation_dismissed_date';
const STORAGE_KEY_CURRENT_INDEX = 'ielts_smart_recommendation_index';

/**
 * Check if the recommendation banner was dismissed for today
 */
export function isRecommendationDismissedToday() {
  const dismissedDate = safeStorageGet(STORAGE_KEY_DISMISSED, '');
  const todayStr = new Date().toISOString().slice(0, 10);
  return dismissedDate === todayStr;
}

/**
 * Dismiss recommendation banner for today
 */
export function dismissRecommendationForToday() {
  const todayStr = new Date().toISOString().slice(0, 10);
  safeStorageSet(STORAGE_KEY_DISMISSED, todayStr);
}

/**
 * Reset dismissal (allow reopening)
 */
export function resetRecommendationDismissal() {
  safeStorageSet(STORAGE_KEY_DISMISSED, '');
}

/**
 * Generate prioritized smart daily recommendations
 * 
 * @param {Object} options
 * @param {Array} options.submissions - List of past essay submissions
 * @param {Array} options.mistakes - List of logged mistakes
 * @param {Array} options.vocabList - List of saved vocabulary items
 * @param {string|number} options.targetBand - User's target band score (e.g. 6.5, 7.5)
 * @param {Array} options.allTasks - List of all tasks available in library
 * @param {string} options.currentTaskId - ID of current active task
 * @returns {Array<Object>} List of prioritized recommendations
 */
export function getSmartDailyRecommendations({
  submissions = [],
  mistakes = [],
  vocabList = [],
  targetBand = '6.5',
  allTasks = [],
  currentTaskId = ''
} = {}) {
  const recommendations = [];
  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Analyze recent submissions
  const recentSubmissions = Array.isArray(submissions) ? submissions.slice(0, 5) : [];
  const submittedToday = recentSubmissions.some(s => {
    const d = s.timestamp || s.date || '';
    return typeof d === 'string' && d.includes(todayStr);
  });

  const recentTask1Count = recentSubmissions.filter(s => s.taskNumber === 1 || s.type?.includes('task1')).length;
  const recentTask2Count = recentSubmissions.filter(s => s.taskNumber === 2 || s.type?.includes('task2')).length;

  // Find candidate Task 1 and Task 2 from allTasks
  const task1Candidates = allTasks.filter(t => (t.taskNumber === 1 || t.type?.includes('task1')) && t.id !== currentTaskId);
  const task2Candidates = allTasks.filter(t => (t.taskNumber === 2 || t.type?.includes('task2')) && t.id !== currentTaskId);

  const suggestedTask1 = task1Candidates[0] || allTasks.find(t => t.taskNumber === 1) || null;
  const suggestedTask2 = task2Candidates[0] || allTasks.find(t => t.taskNumber === 2) || null;

  // RULE A: Balance Task 1 vs Task 2
  // If recent submissions are skewed towards Task 2 (>= 2 Task 2 and 0 Task 1)
  if (recentSubmissions.length >= 2 && recentTask2Count >= 2 && recentTask1Count === 0 && suggestedTask1) {
    recommendations.push({
      id: 'rec-balance-task1',
      priority: 95,
      type: 'balance_task1',
      badge: '⚖️ Cân Bằng Kỹ Năng',
      badgeColor: 'blue',
      title: 'Luyện 1 bài Task 1 để bảo toàn 33% tổng điểm',
      description: `Bạn đã hoàn thành liên tiếp ${recentTask2Count} bài Task 2. Dành 20 phút phân tích ${suggestedTask1.title || 'biểu đồ Task 1'} giúp duy trì phản xạ mô tả số liệu và cấu trúc so sánh.`,
      actionType: 'select_task',
      actionPayload: suggestedTask1,
      actionLabel: `Luyện đề: ${suggestedTask1.title?.slice(0, 24) || 'Task 1'}...`,
      estimatedMinutes: 20
    });
  }

  // RULE B: Focus on Task 2 if learner neglected Task 2
  if (recentSubmissions.length >= 2 && recentTask1Count >= 2 && recentTask2Count === 0 && suggestedTask2) {
    recommendations.push({
      id: 'rec-balance-task2',
      priority: 90,
      type: 'balance_task2',
      badge: '🏆 Trọng Số 66% Điểm',
      badgeColor: 'rose',
      title: 'Tập trung phát triển luận điểm Task 2',
      description: `Task 2 chiếm trọng số gấp đôi Task 1. Hãy thử sức với đề "${suggestedTask2.title || 'IELTS Task 2'}" để rèn luyện lập luận đa chiều chuẩn Band ${targetBand}.`,
      actionType: 'select_task',
      actionPayload: suggestedTask2,
      actionLabel: `Luyện đề: ${suggestedTask2.title?.slice(0, 24) || 'Task 2'}...`,
      estimatedMinutes: 40
    });
  }

  // RULE C: Target Weakness & Logged Mistakes
  if (Array.isArray(mistakes) && mistakes.length > 0) {
    recommendations.push({
      id: 'rec-fix-mistakes',
      priority: 88,
      type: 'fix_mistakes',
      badge: '💊 Khắc Phục Điểm Yếu',
      badgeColor: 'amber',
      title: `Triệt tiêu ${mistakes.length} bẫy lỗi sai thường gặp`,
      description: 'Sổ tay ghi nhận các lỗi sai ngữ pháp và dùng từ gần đây. Hoàn thành 1 đơn thuốc lỗi SRS (3 phút) để xóa bỏ hoàn toàn các lỗi này.',
      actionType: 'open_modal',
      actionPayload: 'prescription',
      actionLabel: 'Uống đơn thuốc lỗi SRS (3p)',
      estimatedMinutes: 3
    });
  }

  // RULE D: Academic Vocabulary Expansion (AWL & Collocations)
  if (parseFloat(targetBand) >= 7.0 || (Array.isArray(vocabList) && vocabList.length > 0)) {
    recommendations.push({
      id: 'rec-expand-vocab',
      priority: 82,
      type: 'expand_vocab',
      badge: '💎 Nâng Cấp Từ Vựng C1/C2',
      badgeColor: 'purple',
      title: `Luyện Collocations & Paraphrase cho mục tiêu Band ${targetBand}`,
      description: 'Sử dụng các cấu trúc nâng cao (Họ từ học thuật AWL, liên từ chỉ hệ quả, đảo ngữ) để tạo ấn tượng mạnh với giám khảo.',
      actionType: 'open_modal',
      actionPayload: 'vocabGrammar',
      actionLabel: 'Mở Kho Từ Vựng & Ngữ Pháp',
      estimatedMinutes: 5
    });
  }

  // RULE E: Quick Warm-up Micro-Drill (Especially if no submission today)
  if (!submittedToday) {
    recommendations.push({
      id: 'rec-quick-micro-drill',
      priority: 86,
      type: 'micro_drill',
      badge: '⚡ Khởi Động Nhanh 3 Phút',
      badgeColor: 'emerald',
      title: 'Khởi động phản xạ với Micro-Drills Studio',
      description: 'Chưa có nhiều thời gian hôm nay? Làm 1 bài phản xạ nhanh 3 phút (Paraphrase câu luận đề hoặc GRA Heatmap) để duy trì mạch học.',
      actionType: 'open_modal',
      actionPayload: 'microDrills',
      actionLabel: 'Vào Phòng Micro-Drills',
      estimatedMinutes: 3
    });
  }

  // RULE F: Full Mock Exam Challenge
  if (recentSubmissions.length >= 3) {
    recommendations.push({
      id: 'rec-mock-exam',
      priority: 75,
      type: 'mock_test',
      badge: '⏱️ Thử Thách Phòng Thi',
      badgeColor: 'red',
      title: 'Thi thử Writing trọn gói 60 phút (Task 1 + 2)',
      description: 'Bạn đã có đà luyện tập tốt! Hãy thử thách bản thân với phòng thi mô phỏng CD-IELTS 60 phút để kiểm tra khả năng phân bổ thời gian.',
      actionType: 'open_modal',
      actionPayload: 'mockTest',
      actionLabel: 'Vào Phòng Thi Thử (60p)',
      estimatedMinutes: 60
    });
  }

  // Default Fallback Recommendation if list is empty
  if (recommendations.length === 0) {
    const defaultTask = suggestedTask2 || suggestedTask1 || allTasks[0];
    recommendations.push({
      id: 'rec-default-daily',
      priority: 70,
      type: 'daily_practice',
      badge: '🎯 Luyện Tập Trọng Tâm',
      badgeColor: 'indigo',
      title: `Bắt đầu bài tập hướng tới Band ${targetBand}`,
      description: defaultTask 
        ? `Luyện viết bài "${defaultTask.title}" để rèn phản xạ viết và nhận điểm chấm chi tiết từ AI.`
        : 'Chọn một đề bài trong thư viện và bắt đầu bài tập hôm nay.',
      actionType: defaultTask ? 'select_task' : 'open_modal',
      actionPayload: defaultTask || 'library',
      actionLabel: defaultTask ? `Bắt đầu viết (${defaultTask.timeLimit || 40}p)` : 'Mở Thư Viện Đề',
      estimatedMinutes: defaultTask?.timeLimit || 40
    });
  }

  // Sort strictly by priority descending
  return recommendations.sort((a, b) => b.priority - a.priority);
}

/**
 * Get active recommendation index from storage or 0
 */
export function getSavedRecommendationIndex() {
  const idx = parseInt(safeStorageGet(STORAGE_KEY_CURRENT_INDEX, '0'), 10);
  return isNaN(idx) ? 0 : idx;
}

/**
 * Save active recommendation index
 */
export function saveRecommendationIndex(idx) {
  safeStorageSet(STORAGE_KEY_CURRENT_INDEX, String(idx));
}
