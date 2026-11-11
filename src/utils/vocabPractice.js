import { getLocalizedVocabMeaning } from './vocabLocalization';

/**
 * Local (no-AI) vocabulary practice helpers for the Vocab Vault.
 */

export const MASTERY_LEVELS = ['new', 'learning', 'familiar', 'mastered'];

/** Derives a learner-friendly mastery level from existing SM-2 fields. */
export function getMasteryLevel(item) {
  const interval = Number(item?.intervalDays) || 0;
  const reps = Number(item?.repetition) || 0;
  if (reps === 0 || interval === 0) return 'new';
  if (interval < 6) return 'learning';
  if (interval < 21) return 'familiar';
  return 'mastered';
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Replaces the phrase inside its example with a blank. Returns null if not found. */
export function blankPhraseInExample(item) {
  const phrase = (item?.phrase || '').trim();
  const example = (item?.example || '').trim();
  if (!phrase || !example) return null;
  const re = new RegExp(escapeRegExp(phrase).replace(/\s+/g, '\\s+'), 'i');
  if (!re.test(example)) return null;
  return example.replace(re, '_____');
}

export const normalizeAnswer = (s) =>
  String(s || '').toLowerCase().trim().replace(/[’']/g, "'").replace(/\s+/g, ' ').replace(/[.,;:!?]+$/, '');

/**
 * Builds a practice session.
 * mode: 'cloze' | 'choice' | 'dictation'
 */
export function buildSession(vocabList, mode, { size = 10, isEn = false, rand = Math.random } = {}) {
  const valid = vocabList.filter(v => (v?.phrase || '').trim());
  const picked = shuffle(valid, rand).slice(0, size);

  return picked.map((item) => {
    const base = { id: item.id, item, mode, answer: item.phrase.trim() };

    if (mode === 'choice') {
      const distractors = shuffle(
        valid.filter(v => normalizeAnswer(v.phrase) !== normalizeAnswer(item.phrase)),
        rand
      ).slice(0, 3).map(v => v.phrase.trim());
      return {
        ...base,
        prompt: getLocalizedVocabMeaning(item, isEn),
        options: shuffle([base.answer, ...distractors], rand)
      };
    }

    if (mode === 'dictation') {
      return { ...base, prompt: '' };
    }

    // cloze
    const blanked = blankPhraseInExample(item);
    return {
      ...base,
      prompt: blanked || getLocalizedVocabMeaning(item, isEn),
      isMeaningFallback: !blanked,
      hint: blanked ? getLocalizedVocabMeaning(item, isEn) : ''
    };
  });
}
