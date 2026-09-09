/**
 * Core Data Contracts for IELTS 4-Skills Ecosystem
 * Ensures seamless extensibility for Reading, Listening, and Speaking
 * without modifying the core platform architecture.
 */

export const SKILL_TYPES = {
  WRITING: 'writing',
  READING: 'reading',
  LISTENING: 'listening',
  SPEAKING: 'speaking'
};

export const SKILL_INFO = {
  writing: {
    id: 'writing',
    name: 'Writing',
    vi: 'Viết',
    icon: 'PenTool',
    badgeColor: 'bg-red-100 text-red-800 border-red-200'
  },
  reading: {
    id: 'reading',
    name: 'Reading',
    vi: 'Đọc',
    icon: 'BookOpen',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  listening: {
    id: 'listening',
    name: 'Listening',
    vi: 'Nghe',
    icon: 'Headphones',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  speaking: {
    id: 'speaking',
    name: 'Speaking',
    vi: 'Nói',
    icon: 'Mic',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  }
};

/**
 * Standard schema for an IELTS Task across any skill
 */
export function createBaseTask({
  id,
  skill = SKILL_TYPES.WRITING,
  title,
  timeLimit = 40,
  isCustom = false,
  isAiGenerated = false,
  ...skillSpecificProps
}) {
  return {
    id: id || `${skill}-${Date.now()}`,
    skill,
    title,
    timeLimit,
    isCustom,
    isAiGenerated,
    createdAt: new Date().toISOString(),
    ...skillSpecificProps
  };
}

/**
 * Standard schema for an IELTS Submission across any skill
 */
export function createBaseSubmission({
  taskId,
  skill,
  overallBand,
  timeSpent,
  evaluationDetails,
  candidateAnswers
}) {
  return {
    id: `sub-${skill}-${Date.now()}`,
    taskId,
    skill,
    overallBand,
    timeSpent,
    evaluation: evaluationDetails,
    answers: candidateAnswers,
    submittedAt: new Date().toISOString(),
    dateFormatted: new Date().toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}
