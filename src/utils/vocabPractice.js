import { getLocalizedVocabMeaning } from './vocabLocalization';
import { isItemDue } from './srsService';

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

/** "make progress" -> "m___ p______" */
export function firstLetterHint(answer) {
  return String(answer || '')
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0] + '_'.repeat(Math.max(0, w.length - 1)))
    .join(' ');
}

/**
 * Scrambles a phrase. Multi-word phrases get their words shuffled;
 * single words get their letters shuffled. Never returns the original order.
 */
export function scramblePhrase(phrase, rand = Math.random) {
  const words = String(phrase || '').trim().split(/\s+/).filter(Boolean);
  const original = words.join(' ');
  const unitsOf = () => (words.length > 1 ? words : [...(words[0] || '')]);
  const join = (units) => (words.length > 1 ? units.join(' ') : units.join(''));
  const units = unitsOf();
  if (new Set(units).size < 2) return { display: original, units };
  let out = units;
  for (let tries = 0; tries < 10; tries++) {
    out = shuffle(units, rand);
    if (join(out) !== original) break;
  }
  return { display: join(out), units: out };
}

/** Filters the vault by scope (all | due | weak | new) and topic. */
export function filterPool(vocabList, { scope = 'all', topic = 'all' } = {}) {
  return vocabList.filter((v) => {
    if (!(v?.phrase || '').trim()) return false;
    if (topic !== 'all' && v.topic !== topic) return false;
    if (scope === 'due') return isItemDue(v);
    if (scope === 'new') return getMasteryLevel(v) === 'new';
    if (scope === 'weak') {
      const reviewed = Boolean(v.lastReviewedAt);
      return reviewed && ((Number(v.easeFactor) || 2.5) < 2.3 || (Number(v.intervalDays) || 0) <= 1);
    }
    return true;
  });
}

/**
 * Builds a practice session from a pool.
 * mode: 'cloze' | 'choice' | 'reverse' | 'scramble' | 'dictation'
 * `distractorSource` is the full vault, used for wrong options.
 */
export function buildSession(pool, mode, { size = 10, isEn = false, rand = Math.random, distractorSource } = {}) {
  const source = (distractorSource || pool).filter(v => (v?.phrase || '').trim());
  const picked = shuffle(pool.filter(v => (v?.phrase || '').trim()), rand).slice(0, size);

  return picked.map((item) => {
    const phrase = item.phrase.trim();
    const base = { id: item.id, item, mode, answer: phrase };

    if (mode === 'choice') {
      const distractors = shuffle(
        source.filter(v => normalizeAnswer(v.phrase) !== normalizeAnswer(phrase)),
        rand
      ).slice(0, 3).map(v => v.phrase.trim());
      return {
        ...base,
        prompt: getLocalizedVocabMeaning(item, isEn),
        options: shuffle([phrase, ...distractors], rand)
      };
    }

    if (mode === 'reverse') {
      const meaning = getLocalizedVocabMeaning(item, isEn);
      const distractors = shuffle(
        source
          .filter(v => normalizeAnswer(v.phrase) !== normalizeAnswer(phrase))
          .map(v => getLocalizedVocabMeaning(v, isEn))
          .filter(m => m && normalizeAnswer(m) !== normalizeAnswer(meaning)),
        rand
      );
      const unique = [...new Set(distractors)].slice(0, 3);
      return {
        ...base,
        answer: meaning,
        prompt: phrase,
        options: shuffle([meaning, ...unique], rand)
      };
    }

    if (mode === 'scramble') {
      const { display, units } = scramblePhrase(phrase, rand);
      return {
        ...base,
        prompt: getLocalizedVocabMeaning(item, isEn),
        scrambled: display,
        scrambledUnits: units,
        isWordLevel: phrase.split(/\s+/).length > 1
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

/** Builds one matching board (phrases vs meanings) of up to `size` pairs. */
export function buildMatchBoard(pool, { size = 6, isEn = false, rand = Math.random } = {}) {
  const seenMeanings = new Set();
  const items = [];
  for (const item of shuffle(pool, rand)) {
    const meaning = getLocalizedVocabMeaning(item, isEn);
    const key = normalizeAnswer(meaning);
    if (!meaning || seenMeanings.has(key)) continue;
    seenMeanings.add(key);
    items.push({ item, phrase: item.phrase.trim(), meaning });
    if (items.length >= size) break;
  }
  return {
    pairs: items,
    left: shuffle(items.map((p, i) => ({ idx: i, text: p.phrase })), rand),
    right: shuffle(items.map((p, i) => ({ idx: i, text: p.meaning })), rand)
  };
}

// ---------- Practice stats (local only) ----------
const STATS_KEY = 'ielts_vocab_practice_stats';

export function loadPracticeStats() {
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
    return {
      rounds: raw.rounds || 0,
      answered: raw.answered || 0,
      correct: raw.correct || 0,
      bestCombo: raw.bestCombo || 0
    };
  } catch {
    return { rounds: 0, answered: 0, correct: 0, bestCombo: 0 };
  }
}

export function recordPracticeRound({ answered, correct, bestCombo }) {
  const prev = loadPracticeStats();
  const next = {
    rounds: prev.rounds + 1,
    answered: prev.answered + answered,
    correct: prev.correct + correct,
    bestCombo: Math.max(prev.bestCombo, bestCombo || 0)
  };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable; stats are best-effort
  }
  return next;
}
