/**
 * growthPredictorService.js
 * Cambridge-Aligned Growth Analytics & Target Band Prediction Engine.
 * Based on Cambridge Assessment empirical research:
 * ~100 to 150 hours (average 120 hours) of guided active practice to improve 0.5 IELTS band score.
 */

export const CAMBRIDGE_HOURS_PER_HALF_BAND = 120;
export const DEFAULT_WEEKLY_STUDY_HOURS = 8;

export const SKILL_LABELS = {
  listening: 'Listening (Nghe)',
  reading: 'Reading (Đọc)',
  writing: 'Writing (Viết)',
  speaking: 'Speaking (Nói)'
};

export const SKILL_PRESCRIPTIONS = {
  writing: 'Tập trung củng cố tính mạch lạc (Coherence & Cohesion), luyện viết câu phức đa mệnh đề và tránh lỗi quả quyết tuyệt đối bằng Academic Hedging.',
  speaking: 'Kéo dài thời lượng phát triển ý tưởng trong Part 3, sử dụng các từ nối tự nhiên (Discourse Markers) để hạn chế ngập ngừng và filler words.',
  reading: 'Luyện kỹ năng Skimming & Scanning định vị từ khóa paraphrased, giải tỏa bẫy câu hỏi True/False/Not Given và Matching Headings.',
  listening: 'Tăng tốc độ ghi chú chính xác cho Section 3 & 4, dự đoán từ loại cần điền và làm quen với đa dạng accent bản xứ (UK, Aus, US).'
};

/**
 * Calculates gap between current and target band.
 */
export function calculateBandGap(currentBand, targetBand) {
  const current = Number(currentBand) || 0;
  const target = Number(targetBand) || 0;
  const gap = Math.max(0, target - current);
  return Math.round(gap * 10) / 10;
}

/**
 * Calculates estimated active practice hours required according to Cambridge benchmark.
 */
export function calculateHoursRequired(currentBand, targetBand, hoursPerHalfBand = CAMBRIDGE_HOURS_PER_HALF_BAND) {
  const gap = calculateBandGap(currentBand, targetBand);
  if (gap <= 0) return 0;
  return Math.round((gap / 0.5) * hoursPerHalfBand);
}

/**
 * Estimates target completion date based on required hours and weekly pace.
 */
export function estimateTargetCompletionDate(hoursRequired, weeklyHours = DEFAULT_WEEKLY_STUDY_HOURS, startDate = new Date()) {
  if (hoursRequired <= 0) {
    return {
      weeksRemaining: 0,
      daysRemaining: 0,
      formattedDate: 'Đã đạt mục tiêu!',
      targetDate: new Date(startDate)
    };
  }

  const effectiveWeekly = Math.max(1, Number(weeklyHours) || DEFAULT_WEEKLY_STUDY_HOURS);
  const weeksRemaining = Math.ceil(hoursRequired / effectiveWeekly);
  const daysRemaining = weeksRemaining * 7;
  
  const targetDate = new Date(startDate.getTime() + daysRemaining * 24 * 60 * 60 * 1000);
  
  const day = String(targetDate.getDate()).padStart(2, '0');
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const year = targetDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return {
    weeksRemaining,
    daysRemaining,
    formattedDate,
    targetDate
  };
}

/**
 * Analyzes gaps across all 4 individual skills and determines bottlenecks.
 */
export function analyzeSkillGaps(skillBands = {}, targetBand = 7.0) {
  const skills = ['listening', 'reading', 'writing', 'speaking'];
  const target = Number(targetBand) || 7.0;

  const gaps = skills.map(skill => {
    const current = Number(skillBands[skill]) || 5.0;
    const gap = calculateBandGap(current, target);
    return {
      skill,
      label: SKILL_LABELS[skill] || skill,
      currentBand: current,
      targetBand: target,
      gap,
      hoursNeeded: calculateHoursRequired(current, target),
      isBottleneck: gap > 0,
      prescription: SKILL_PRESCRIPTIONS[skill] || 'Tập trung luyện tập chuyên sâu theo từng dạng bài chuẩn.'
    };
  });

  // Sort: biggest gap first
  gaps.sort((a, b) => b.gap - a.gap);

  const primaryBottleneck = gaps.find(g => g.gap > 0) || null;
  const strongestSkill = [...gaps].sort((a, b) => b.currentBand - a.currentBand)[0] || null;

  return {
    gaps,
    primaryBottleneck,
    strongestSkill
  };
}

/**
 * Generates full diagnostic growth report.
 */
export function generateGrowthAnalyticsReport({
  currentScores = { listening: 6.5, reading: 6.5, writing: 6.0, speaking: 6.0, overall: 6.5 },
  targetBand = 7.5,
  weeklyStudyHours = DEFAULT_WEEKLY_STUDY_HOURS,
  practiceHistory = []
} = {}) {
  const overallCurrent = Number(currentScores.overall) || 6.0;
  const overallTarget = Number(targetBand) || 7.0;
  const overallGap = calculateBandGap(overallCurrent, overallTarget);
  const totalHoursRequired = calculateHoursRequired(overallCurrent, overallTarget);
  const eta = estimateTargetCompletionDate(totalHoursRequired, weeklyStudyHours);
  const skillAnalysis = analyzeSkillGaps(currentScores, overallTarget);

  // Calculate percentage of progress relative to band 9.0 ceiling
  const baseline = 4.0;
  const progressRatio = Math.max(0, Math.min(1, (overallCurrent - baseline) / (overallTarget - baseline || 1)));
  const progressPercentage = Math.round(progressRatio * 100);

  return {
    currentScores,
    targetBand: overallTarget,
    overallGap,
    totalHoursRequired,
    weeklyStudyHours,
    weeksRemaining: eta.weeksRemaining,
    daysRemaining: eta.daysRemaining,
    estimatedCompletionDate: eta.formattedDate,
    progressPercentage,
    skillAnalysis,
    historyCount: practiceHistory.length
  };
}
