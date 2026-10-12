/**
 * src/services/gamification/skillBalancingEngine.js
 * 
 * Dynamic Skill Balancing & Runtime Schema Validation Engine for Atlas English Arena v8.0.
 * Implements the Pedagogical Golden Ratio:
 * - Reading Traps (Micro TFNG & Keywords): 25%
 * - Listening Traps (Audio Reversal & Distractors): 25%
 * - Lexical Resource & Paraphrase: 20%
 * - Spelling Demons (Double letters & Silent letters): 12%
 * - Academic Grammar & Hedging: 10%
 * - Task 1 Visual Data & Charts: 8%
 */

export const SKILL_DISTRIBUTION_TARGETS = {
  reading: 0.25,
  listening: 0.25,
  vocab: 0.20,
  spelling: 0.12,
  grammar: 0.10,
  visual_data: 0.08
};

export const VALID_SKILL_CATEGORIES = [
  'reading',
  'listening',
  'vocab',
  'spelling',
  'grammar',
  'visual_data'
];

export const VALID_DIFFICULTIES = ['easy', 'medium', 'hard', 'nightmare'];

/**
 * Validates a single question against the strict Arena v8.0 runtime schema.
 * @param {Object} q 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateArenaQuestion(q) {
  const errors = [];
  if (!q || typeof q !== 'object') {
    return { valid: false, errors: ['Question is null or not an object'] };
  }
  if (!q.id || typeof q.id !== 'string') {
    errors.push('Missing or invalid id');
  }
  if (!q.prompt || typeof q.prompt !== 'string') {
    errors.push('Missing or invalid prompt');
  }
  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push('Options must be an array with at least 2 items');
  }
  if (typeof q.correctIndex !== 'number' || !Number.isInteger(q.correctIndex)) {
    errors.push('correctIndex must be an integer');
  } else if (Array.isArray(q.options) && (q.correctIndex < 0 || q.correctIndex >= q.options.length)) {
    errors.push(`correctIndex ${q.correctIndex} out of bounds for options length ${q.options.length}`);
  }
  if (!q.explanation || typeof q.explanation !== 'string') {
    errors.push('Missing or invalid explanation');
  }
  if (q.difficulty && !VALID_DIFFICULTIES.includes(q.difficulty)) {
    errors.push(`Invalid difficulty: ${q.difficulty}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Calculates exact integer quotas for each skill category, strictly summing to totalCount.
 * @param {number} totalCount 
 * @returns {Record<string, number>}
 */
export function calculateSkillQuotas(totalCount = 10) {
  if (totalCount <= 0) return {};

  const quotas = {};
  let allocated = 0;

  // Largest remainder allocation
  const remainders = [];
  for (const [skill, ratio] of Object.entries(SKILL_DISTRIBUTION_TARGETS)) {
    const raw = totalCount * ratio;
    const count = Math.floor(raw);
    quotas[skill] = count;
    allocated += count;
    remainders.push({ skill, remainder: raw - count });
  }

  // Sort descending by remainder
  remainders.sort((a, b) => b.remainder - a.remainder);

  // Distribute remaining slots
  let diff = totalCount - allocated;
  let idx = 0;
  while (diff > 0 && idx < remainders.length) {
    quotas[remainders[idx].skill] += 1;
    diff--;
    idx++;
  }

  return quotas;
}

/**
 * Maps a question to one of the 6 golden skill keys.
 * @param {Object} q 
 * @returns {string}
 */
export function classifyQuestionCategory(q) {
  if (!q) return 'vocab';
  if (q.type === 'spelling' || q.skillCategory === 'spelling') return 'spelling';
  if (q.type === 'chart_reading' || q.type === 'map_reading' || q.type === 'process_reading' || q.skillCategory === 'visual_data') return 'visual_data';
  if (q.skillCategory === 'grammar' || q.type === 'hedging') return 'grammar';
  if (q.skillCategory === 'listening' || q.type === 'listening_trap') return 'listening';
  if (q.skillCategory === 'reading' || q.type === 'tfng') return 'reading';
  return 'vocab';
}

/**
 * Balances questions from an input pool according to the Golden Pedagogical Ratio.
 * Backfills gracefully if certain skill pools have fewer available questions.
 * 
 * @param {Array<Object>} pool 
 * @param {number} targetCount 
 * @param {Function} [rng=Math.random]
 * @returns {Array<Object>}
 */
export function balanceQuestionsBySkill(pool = [], targetCount = 10, rng = Math.random) {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  if (pool.length <= targetCount) return [...pool];

  const quotas = calculateSkillQuotas(targetCount);
  const buckets = {
    reading: [],
    listening: [],
    vocab: [],
    spelling: [],
    grammar: [],
    visual_data: []
  };

  // Group pool into buckets
  for (const q of pool) {
    const cat = classifyQuestionCategory(q);
    if (buckets[cat]) {
      buckets[cat].push(q);
    } else {
      buckets.vocab.push(q);
    }
  }

  // Shuffle individual buckets
  for (const cat of Object.keys(buckets)) {
    buckets[cat] = [...buckets[cat]].sort(() => rng() - 0.5);
  }

  const selected = [];
  const selectedIds = new Set();
  const leftovers = [];

  // 1. Take quota from each bucket
  for (const [cat, quota] of Object.entries(quotas)) {
    const available = buckets[cat] || [];
    const take = available.slice(0, quota);
    for (const q of take) {
      selected.push(q);
      selectedIds.add(q.id);
    }
    // Track unused questions in leftovers
    const remaining = available.slice(quota);
    leftovers.push(...remaining);
  }

  // 2. Backfill if some buckets didn't meet their quotas
  if (selected.length < targetCount) {
    const shuffledLeftovers = leftovers
      .filter(q => !selectedIds.has(q.id))
      .sort(() => rng() - 0.5);

    const needed = targetCount - selected.length;
    selected.push(...shuffledLeftovers.slice(0, needed));
  }

  // 3. Final shuffle of the selected questions
  return selected.sort(() => rng() - 0.5);
}
