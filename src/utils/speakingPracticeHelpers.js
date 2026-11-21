/**
 * Shared pure helpers for Pronunciation Studio, Dialogue Roleplay, and Speech Shadowing.
 * Keeps text masking and Layer 2 Gemini Audio Deep Check normalization DRY across modules.
 */

const FUNCTION_WORDS = new Set([
  'a', 'an', 'the', 'is', 'am', 'are', 'was', 'were', 'be', 'been',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'as',
  'and', 'or', 'but', 'if', 'that', 'this', 'it', 'i', 'you', 'we', 'they',
  'my', 'your', 'our', 'their', 'do', 'does', 'did', 'can', 'could', 'will', 'would'
]);

/**
 * Masks function words in Keywords-Only mode so learners practice recall & natural phrasing.
 */
export function maskToKeywords(text = '') {
  return String(text || '')
    .split(/\s+/)
    .map((w) => {
      const clean = w.toLowerCase().replace(/[^a-z']/g, '');
      if (clean.length <= 2 || FUNCTION_WORDS.has(clean)) {
        return w.replace(/[a-zA-Z]/g, '•');
      }
      return w;
    })
    .join(' ');
}

/**
 * Shared Layer 2 Multimodal Gemini Native Audio Deep Check runner.
 * Normalizes word breakdown, pass gating, and coaching feedback across all 3 studios.
 */
export async function runLayer2PronunciationCheck({
  audioBlob,
  targetText,
  ipa,
  itemType = 'sentences',
  apiKey,
  model,
  isEn,
  passThreshold = 75,
  prevEval = null,
  xpHigh = 35,
  xpNormal = 25
}) {
  const { evaluatePronunciationWithGeminiAudio } = await import('../services/ai/speakingAiService');
  const aiRes = await evaluatePronunciationWithGeminiAudio({
    audioBlob,
    targetText,
    ...(ipa ? { ipa } : {}),
    itemType,
    apiKey,
    model,
    language: isEn ? 'en' : 'vi'
  });

  const isPassed = aiRes.overallAccuracy >= passThreshold;
  const mappedWords =
    aiRes.wordBreakdown && aiRes.wordBreakdown.length > 0
      ? aiRes.wordBreakdown.map((w) => ({
          word: w.word,
          cleanWord: w.word,
          status: w.status || (w.similarity >= 84 ? 'correct' : w.similarity >= 52 ? 'near' : 'missed'),
          similarity: Number(w.similarity) || 80,
          ...(w.phonemeNote ? { phonemeNote: w.phonemeNote } : {})
        }))
      : prevEval?.wordBreakdown || [];

  const earnedXp = isPassed
    ? aiRes.overallAccuracy >= 92
      ? xpHigh
      : xpNormal
    : prevEval?.xpEarned || 0;

  return {
    ...(prevEval || {}),
    overallAccuracy: aiRes.overallAccuracy,
    estimatedBand: aiRes.estimatedBand,
    spokenTranscript: aiRes.heardTranscript || prevEval?.spokenTranscript || targetText,
    wordBreakdown: mappedWords,
    ...(aiRes.heardIpa ? { heardIpa: aiRes.heardIpa } : {}),
    ...(aiRes.stressFeedback ? { stressFeedback: aiRes.stressFeedback } : {}),
    ...(aiRes.endingFeedback ? { endingFeedback: aiRes.endingFeedback } : {}),
    ...(aiRes.prosodyNote ? { prosodyNote: aiRes.prosodyNote } : {}),
    coachFeedbackEn: aiRes.coachFeedback,
    coachFeedbackVi: aiRes.coachFeedback,
    xpEarned: earnedXp,
    isPassed,
    engineTier: 'layer2_gemini_audio'
  };
}

export const NOOP = () => {};
