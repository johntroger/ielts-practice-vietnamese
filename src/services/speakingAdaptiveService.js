/**
 * speakingAdaptiveService.js
 * Adaptive Conversational Engine for IELTS Speaking Examiner.
 * Generates natural examiner acknowledgements, conversational discourse markers,
 * and adaptive follow-up questions based on candidate utterance length, complexity, and topics.
 */

// Natural examiner acknowledgement transitions
export const EXAMINER_ACKNOWLEDGMENTS = {
  positive: [
    "That's an interesting perspective.",
    "I see what you mean.",
    "That is a thoughtful point.",
    "Fair enough."
  ],
  neutral: [
    "Right, I understand.",
    "Okay, thank you.",
    "I see.",
    "Alright."
  ],
  deep: [
    "That raises an important issue.",
    "That is quite a multifaceted subject.",
    "Indeed, that's often debated today."
  ]
};

// Adaptive follow-up probes by response profile
export const ADAPTIVE_PROBE_TEMPLATES = {
  too_brief: [
    "Could you elaborate a bit more on why you feel that way?",
    "Can you give me a specific example to illustrate that?",
    "Why do you think that happens so frequently?",
    "What makes you say that?"
  ],
  one_sided_claim: [
    "Some people might argue the exact opposite. How would you respond to them?",
    "Do you see any potential drawbacks or negative consequences to that?",
    "Does this apply to everyone, or mostly certain groups in society?",
    "Could there be any exceptions to that view?"
  ],
  future_speculation: [
    "How do you anticipate this changing over the next twenty years?",
    "Do you think governments or individuals bear more responsibility for addressing this?",
    "Will technology accelerate this trend, or create new challenges?"
  ],
  cultural_societal: [
    "Is this trend more visible in urban areas compared to rural communities?",
    "How does the older generation view this compared to younger people?",
    "Do you think this differs significantly across different cultures?"
  ]
};

/**
 * Analyzes candidate utterance and determines whether a dynamic follow-up is recommended.
 * @param {string} candidateAnswer - Transcript of candidate's response
 * @param {object} context - Stage ('part1' | 'part3'), current topic, question index
 * @returns {object} Analysis result { needsFollowUp: boolean, reason: string, followUpQuestion: string, acknowledgment: string }
 */
export function analyzeCandidateUtterance(candidateAnswer = '', context = {}) {
  const cleanText = (candidateAnswer || '').trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const stage = context.stage || 'part3';

  // 1. Pick natural acknowledgement
  let ackList = EXAMINER_ACKNOWLEDGMENTS.neutral;
  if (wordCount >= 35) {
    ackList = EXAMINER_ACKNOWLEDGMENTS.positive;
  } else if (stage === 'part3' && wordCount >= 20) {
    ackList = EXAMINER_ACKNOWLEDGMENTS.deep;
  }
  const acknowledgment = ackList[Math.abs(hashString(cleanText)) % ackList.length];

  // 2. Determine if follow-up is warranted
  // In IELTS Part 1, examiners rarely give more than 1 follow-up and only if answer is under 12 words.
  // In IELTS Part 3, examiners actively probe, especially if brief or strongly opinionated.
  if (wordCount === 0 || cleanText.includes('(Candidate answered')) {
    return {
      needsFollowUp: false,
      reason: 'empty_or_placeholder',
      acknowledgment: 'Thank you.',
      followUpQuestion: null
    };
  }

  // Case A: Too brief (< 12 words in Part 1 or < 18 words in Part 3)
  const isBrief = stage === 'part1' ? wordCount < 12 : wordCount < 18;
  if (isBrief && !context.hasFollowedUpOnThisQuestion) {
    const probes = ADAPTIVE_PROBE_TEMPLATES.too_brief;
    const probe = probes[Math.abs(hashString(cleanText + '_brief')) % probes.length];
    return {
      needsFollowUp: true,
      reason: 'too_brief',
      acknowledgment: 'I see.',
      followUpQuestion: probe
    };
  }

  // Case B: In Part 3, if candidate makes strong assertions or keywords, probe counter-perspective
  if (stage === 'part3' && !context.hasFollowedUpOnThisQuestion && wordCount >= 18) {
    const lower = cleanText.toLowerCase();
    
    // Check if future speculation keywords appear
    if (lower.includes('future') || lower.includes('will be') || lower.includes('in the next') || lower.includes('eventually')) {
      const probes = ADAPTIVE_PROBE_TEMPLATES.future_speculation;
      const probe = probes[Math.abs(hashString(cleanText + '_future')) % probes.length];
      return {
        needsFollowUp: true,
        reason: 'future_speculation',
        acknowledgment,
        followUpQuestion: probe
      };
    }

    // Check if society / generational / cultural contrast appears
    if (lower.includes('people') || lower.includes('society') || lower.includes('young') || lower.includes('government') || lower.includes('culture')) {
      const probes = ADAPTIVE_PROBE_TEMPLATES.cultural_societal;
      const probe = probes[Math.abs(hashString(cleanText + '_society')) % probes.length];
      return {
        needsFollowUp: true,
        reason: 'cultural_societal',
        acknowledgment,
        followUpQuestion: probe
      };
    }

    // Otherwise check for strong one-sided claims
    if (lower.includes('always') || lower.includes('never') || lower.includes('definitely') || lower.includes('should') || lower.includes('must')) {
      const probes = ADAPTIVE_PROBE_TEMPLATES.one_sided_claim;
      const probe = probes[Math.abs(hashString(cleanText + '_claim')) % probes.length];
      return {
        needsFollowUp: true,
        reason: 'one_sided_claim',
        acknowledgment,
        followUpQuestion: probe
      };
    }
  }

  return {
    needsFollowUp: false,
    reason: 'sufficient_development',
    acknowledgment,
    followUpQuestion: null
  };
}

/**
 * Deterministic hash for reproducible pseudo-random selection in tests and execution
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}
