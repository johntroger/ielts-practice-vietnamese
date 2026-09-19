/**
 * Spaced Repetition Service (SuperMemo-2 SM-2 Standard)
 * Implements research-backed cognitive interval spacing for IELTS Vocabulary & Mistakes.
 * 
 * Quality Rating Scale (Grade 1 - 5):
 * 1: Hoàn toàn quên (Blackout / Total failure to recall)
 * 2: Nhớ sai hoặc lúng túng nghiêm trọng (Wrong response / Very hesitation)
 * 3: Nhớ được nhưng khó khăn, tốn nhiều thời gian (Hard / Serious difficulty)
 * 4: Nhớ tốt, phản xạ tự nhiên sau thoáng nghĩ (Good / Hesitation)
 * 5: Nhớ hoàn hảo, phản xạ tức thì (Easy / Perfect recall)
 */

export const SRS_GRADES = {
  AGAIN: 1, // Quên hẳn
  HARD: 3,  // Khó
  GOOD: 4,  // Tốt
  EASY: 5   // Rất dễ
};

/**
 * Initializes default SRS metadata for a newly saved vocab or mistake item.
 */
export function initSrsItem(item) {
  const now = new Date().toISOString();
  return {
    ...item,
    repetition: item.repetition ?? 0,
    intervalDays: item.intervalDays ?? 0,
    easeFactor: item.easeFactor ?? 2.5,
    lastReviewedAt: item.lastReviewedAt || null,
    nextReviewDate: item.nextReviewDate || now // Due immediately for initial learning
  };
}

/**
 * Calculates the next review date and updated repetition parameters using SM-2 algorithm.
 * 
 * @param {Object} item - The vocab or mistake item with SRS properties
 * @param {number} grade - Grade from 1 to 5
 * @returns {Object} Updated item with new interval, repetition, easeFactor, and nextReviewDate
 */
export function calculateNextReview(item, grade) {
  const safeGrade = Math.max(1, Math.min(5, Number(grade) || 4));
  let repetition = Number(item.repetition) || 0;
  let intervalDays = Number(item.intervalDays) || 0;
  let easeFactor = Number(item.easeFactor) || 2.5;

  if (safeGrade < 3) {
    // Failure to recall: reset repetitions back to start
    repetition = 0;
    intervalDays = 1;
  } else {
    // Successful recall: advance repetition stage
    if (repetition === 0) {
      intervalDays = 1; // First review: 1 day later
    } else if (repetition === 1) {
      intervalDays = 3; // Second review: 3 days later
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetition += 1;
  }

  // Update Ease Factor: EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  // EF must not fall below 1.3 (per SM-2 standard)
  easeFactor = easeFactor + (0.1 - (5 - safeGrade) * (0.08 + (5 - safeGrade) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  if (easeFactor > 3.0) easeFactor = 3.0; // Prevent runaway intervals
  easeFactor = Math.round(easeFactor * 100) / 100;

  const now = new Date();
  const nextDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    ...item,
    repetition,
    intervalDays,
    easeFactor,
    lastReviewedAt: now.toISOString(),
    nextReviewDate: nextDate.toISOString()
  };
}

/**
 * Determines if a vocab or mistake item is currently due for review.
 */
export function isItemDue(item) {
  if (!item || !item.nextReviewDate) return true;
  return new Date(item.nextReviewDate).getTime() <= Date.now();
}

/**
 * Returns the list of items due for spaced repetition review today.
 */
export function getDueItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.filter(item => isItemDue(item));
}

/**
 * Returns user-friendly interval preview string for UI buttons.
 */
export function getIntervalPreview(item, grade) {
  const simulated = calculateNextReview(item, grade);
  const days = simulated.intervalDays;
  if (days === 1) return '1 ngày';
  if (days < 30) return `${days} ngày`;
  const months = Math.round(days / 30);
  return `${months} tháng`;
}
