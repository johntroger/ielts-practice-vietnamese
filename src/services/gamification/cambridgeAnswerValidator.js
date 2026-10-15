/**
 * src/services/gamification/cambridgeAnswerValidator.js
 * 
 * Authentic Cambridge Assessment Answer Validation & Tolerance Engine.
 * Calibrated specifically for IELTS Computer-delivered (CDI) Fill-in-the-Blank & Dictation:
 * 
 * Features:
 * 1. String Normalization (case-insensitive, whitespace collapsing, punctuation trimming).
 * 2. British vs American English spelling parity (colour/color, centre/center, organise/organize).
 * 3. Cambridge Numerical Equivalence (8 / eight, 1st / first, £25 / 25 pounds / 25).
 * 4. Strict Mode for Spelling Demons (zero typo allowance for spelling tests).
 * 5. Character-Level Visual Diff Generator (renders red/green highlights for mistake learning).
 */

const UK_US_EQUIVALENTS = {
  // -our vs -or
  colour: 'color', color: 'colour',
  flavour: 'flavor', flavor: 'flavour',
  neighbour: 'neighbor', neighbor: 'neighbour',
  favour: 'favor', favor: 'favour',
  behaviour: 'behavior', behavior: 'behaviour',
  honour: 'honor', honor: 'honour',
  rumour: 'rumor', rumor: 'rumour',
  
  // -re vs -er
  centre: 'center', center: 'centre',
  theatre: 'theater', theater: 'theatre',
  metre: 'meter', meter: 'metre',
  litre: 'liter', liter: 'litre',
  fibre: 'fiber', fiber: 'fibre',
  
  // -ise vs -ize & -yse vs -yze
  organise: 'organize', organize: 'organise',
  recognise: 'recognize', recognize: 'recognise',
  realise: 'realize', realize: 'realise',
  prioritise: 'prioritize', prioritize: 'prioritise',
  customise: 'customize', customize: 'customise',
  analyse: 'analyze', analyze: 'analyse',
  paralyse: 'paralyze', paralyze: 'paralyse',
  
  // -mme vs -m & -ogue vs -og
  programme: 'program', program: 'programme',
  dialogue: 'dialog', dialog: 'dialogue',
  catalogue: 'catalog', catalog: 'catalogue',
  
  // double L vs single L
  travelled: 'traveled', traveled: 'travelled',
  travelling: 'traveling', traveling: 'travelling',
  cancelled: 'canceled', canceled: 'cancelled',
  cancelling: 'canceling', canceling: 'cancelling',
  modelled: 'modeled', modeled: 'modelled'
};

const NUMBER_WORDS_MAP = {
  '0': ['zero', 'oh', 'nought'],
  '1': ['one'],
  '2': ['two'],
  '3': ['three'],
  '4': ['four'],
  '5': ['five'],
  '6': ['six'],
  '7': ['seven'],
  '8': ['eight'],
  '9': ['nine'],
  '10': ['ten'],
  '11': ['eleven'],
  '12': ['twelve'],
  '13': ['thirteen'],
  '14': ['fourteen'],
  '15': ['fifteen'],
  '16': ['sixteen'],
  '17': ['seventeen'],
  '18': ['eighteen'],
  '19': ['nineteen'],
  '20': ['twenty'],
  '30': ['thirty'],
  '40': ['forty'],
  '50': ['fifty'],
  '60': ['sixty'],
  '70': ['seventy'],
  '80': ['eighty'],
  '90': ['ninety'],
  '100': ['one hundred', 'hundred'],
  '1st': ['first'],
  '2nd': ['second'],
  '3rd': ['third'],
  '4th': ['fourth'],
  '5th': ['fifth']
};

const TENS_MAP = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90
};

const ONES_MAP = {
  zero: 0, one: 1, two: 2, three: 3, four: 4,
  five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19
};

function parseNumberWords(str = '') {
  const parts = str.toLowerCase().split(/\s+/);
  if (parts.length === 1) {
    if (ONES_MAP[parts[0]] !== undefined) return String(ONES_MAP[parts[0]]);
    if (TENS_MAP[parts[0]] !== undefined) return String(TENS_MAP[parts[0]]);
  } else if (parts.length === 2) {
    if (TENS_MAP[parts[0]] !== undefined && ONES_MAP[parts[1]] !== undefined) {
      return String(TENS_MAP[parts[0]] + ONES_MAP[parts[1]]);
    }
  }
  return null;
}

function convertNumberToWords(numStr = '') {
  const n = parseInt(numStr, 10);
  if (isNaN(n) || n < 0 || n > 99) return null;
  const onesKeys = Object.entries(ONES_MAP);
  const foundOne = onesKeys.find(([k, v]) => v === n);
  if (foundOne) return foundOne[0];

  const tensVal = Math.floor(n / 10) * 10;
  const onesVal = n % 10;
  const foundTen = Object.entries(TENS_MAP).find(([k, v]) => v === tensVal);
  const foundRemainder = Object.entries(ONES_MAP).find(([k, v]) => v === onesVal);
  if (foundTen && foundRemainder) {
    return `${foundTen[0]} ${foundRemainder[0]}`;
  }
  return null;
}

/**
 * Normalizes input string by:
 * - Trimming leading/trailing whitespace
 * - Converting to lower case
 * - Removing diacritics/accents (e.g. Café -> Cafe)
 * - Replacing hyphens with spaces (e.g. twenty-four -> twenty four)
 * - Stripping sentence punctuation marks (. , ; : ! ? " ' `)
 * - Collapsing multiple consecutive spaces into one
 * 
 * @param {string} str
 * @returns {string}
 */
export function normalizeCambridgeString(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics / accents
    .replace(/[-_]+/g, ' ')                            // hyphens to space
    .replace(/[.,;!?"'’`:]+/g, '')                     // remove punctuation
    .replace(/\s+/g, ' ')                              // collapse multi-spaces
    .trim();
}

/**
 * Automatically cleans unintentional Telex / VNI Vietnamese IME artifacts
 * commonly introduced when Vietnamese learners type English words with Unikey enabled.
 * 
 * Examples:
 * - "ưednesday" -> "wednesday" (initial 'w' turned to 'ư' by Telex)
 * - "ađress" -> "address" ('đ' from double 'd')
 * - "cômmittêe" -> "committee" (vowels with circumflex from double 'o', 'e')
 * - "bâzaar" -> "bazaar" ('â' from double 'a')
 * 
 * @param {string} str
 * @param {boolean} [preferDoubleD=false]
 * @returns {string}
 */
export function cleanVietnameseImeArtifacts(str = '', preferDoubleD = false) {
  if (typeof str !== 'string') return '';
  let cleaned = str
    .replace(/\b[ưƯ]/g, 'w')
    .replace(/^[ưƯ]/g, 'w');

  if (preferDoubleD) {
    cleaned = cleaned.replace(/[đĐ]/g, 'dd');
  } else {
    cleaned = cleaned.replace(/[đĐ]/g, 'd');
  }

  cleaned = cleaned.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  cleaned = cleaned
    .replace(/[ưƯ]/g, 'u')
    .replace(/[ơƠ]/g, 'o')
    .replace(/[đĐ]/g, 'd');

  return cleaned;
}

/**
 * Calculates standard Levenshtein edit distance between two strings.
 * 
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function calculateLevenshteinDistance(a = '', b = '') {
  const s1 = normalizeCambridgeString(a);
  const s2 = normalizeCambridgeString(b);
  if (s1 === s2) return 0;
  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  const dp = Array(s2.length + 1).fill(null).map((_, i) => i);

  for (let i = 1; i <= s1.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= s2.length; j++) {
      const temp = dp[j];
      if (s1[i - 1] === s2[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
      }
      prev = temp;
    }
  }

  return dp[s2.length];
}

/**
 * Evaluates whether a user's typed answer is a "Near-Miss" (distance === 1).
 * 
 * @param {string} rawInput
 * @param {string|string[]} targetAnswers
 * @returns {{ isNearMiss: boolean, minDistance: number, closestTarget: string }}
 */
export function isNearMissAnswer(rawInput = '', targetAnswers = []) {
  const cleanedInput = normalizeCambridgeString(rawInput);
  if (!cleanedInput) return { isNearMiss: false, minDistance: Infinity, closestTarget: '' };

  const targets = Array.isArray(targetAnswers) 
    ? targetAnswers.map(normalizeCambridgeString).filter(Boolean)
    : [normalizeCambridgeString(targetAnswers)].filter(Boolean);

  if (targets.length === 0) return { isNearMiss: false, minDistance: Infinity, closestTarget: '' };

  const candidateInputs = [
    cleanedInput,
    normalizeCambridgeString(cleanVietnameseImeArtifacts(rawInput, false)),
    normalizeCambridgeString(cleanVietnameseImeArtifacts(rawInput, true))
  ].filter(Boolean);

  let minDistance = Infinity;
  let closestTarget = targets[0];

  for (const input of candidateInputs) {
    for (const target of targets) {
      const dist = calculateLevenshteinDistance(input, target);
      if (dist < minDistance) {
        minDistance = dist;
        closestTarget = target;
      }
    }
  }

  return {
    isNearMiss: minDistance === 1,
    minDistance,
    closestTarget
  };
}

/**
 * Evaluates whether a user's typed answer is acceptable against the target answer(s).
 * 
 * @param {string} rawInput - Text typed by the learner
 * @param {string|string[]} targetAnswers - Expected answer or array of acceptable variations
 * @param {Object} [options]
 * @param {boolean} [options.isStrictSpelling=false] - If true, enforces 100% exact character match (for spelling tests)
 * @param {boolean} [options.strictSpelling=false] - Alias for isStrictSpelling
 * @returns {boolean}
 */
export function isAnswerAcceptable(rawInput = '', targetAnswers = [], options = {}) {
  const isStrict = Boolean(options.isStrictSpelling || options.strictSpelling);
  const cleanedInput = normalizeCambridgeString(rawInput);
  if (!cleanedInput) return false;

  const targets = Array.isArray(targetAnswers) 
    ? targetAnswers.map(normalizeCambridgeString).filter(Boolean)
    : [normalizeCambridgeString(targetAnswers)].filter(Boolean);

  if (targets.length === 0) return false;

  // Candidate inputs: raw normalized, plus IME cleaned variants
  const candidateInputs = [cleanedInput];
  const imeCleaned1 = normalizeCambridgeString(cleanVietnameseImeArtifacts(rawInput, false));
  const imeCleaned2 = normalizeCambridgeString(cleanVietnameseImeArtifacts(rawInput, true));
  if (imeCleaned1 && !candidateInputs.includes(imeCleaned1)) candidateInputs.push(imeCleaned1);
  if (imeCleaned2 && !candidateInputs.includes(imeCleaned2)) candidateInputs.push(imeCleaned2);

  // 1. Direct Normalized Match across any candidate input
  for (const input of candidateInputs) {
    if (targets.includes(input)) {
      return true;
    }
  }

  // If this is a strict spelling question, no loose synonym or substitution is allowed
  if (isStrict) {
    return false;
  }

  // 2. Cambridge UK vs US spelling check
  for (const input of candidateInputs) {
    for (const target of targets) {
      if (UK_US_EQUIVALENTS[input] === target || UK_US_EQUIVALENTS[target] === input) {
        return true;
      }
      // Multi-word UK/US check (e.g. "sports centre" vs "sports center")
      const inputWords = input.split(' ');
      const targetWords = target.split(' ');
      if (inputWords.length === targetWords.length) {
        const allWordsMatch = inputWords.every((word, idx) => {
          const tWord = targetWords[idx];
          return word === tWord || UK_US_EQUIVALENTS[word] === tWord || UK_US_EQUIVALENTS[tWord] === word;
        });
        if (allWordsMatch) return true;
      }
    }
  }

  // 3. Cambridge Number & Word parity check
  for (const input of candidateInputs) {
    for (const target of targets) {
      // Check if target is a number and input is the word (or vice versa)
      if (NUMBER_WORDS_MAP[target]?.includes(input)) return true;
      if (NUMBER_WORDS_MAP[input]?.includes(target)) return true;

      const parsedInput = parseNumberWords(input);
      if (parsedInput && parsedInput === target) return true;
      const parsedTarget = parseNumberWords(target);
      if (parsedTarget && parsedTarget === input) return true;
      if (convertNumberToWords(input) === target) return true;
      if (convertNumberToWords(target) === input) return true;

      // Currency check (e.g. "£25" vs "25" vs "25 pounds")
      const strippedInput = input.replace(/^[£$€¥]/, '').replace(/\s*(pounds|dollars|euros|cents|pence)$/, '').trim();
      const strippedTarget = target.replace(/^[£$€¥]/, '').replace(/\s*(pounds|dollars|euros|cents|pence)$/, '').trim();
      if (strippedInput && strippedInput === strippedTarget) {
        return true;
      }

      // Time check (e.g. "8.45" vs "8:45" vs "8:45 am")
      const timeInput = input.replace('.', ':').replace(/\s*am|\s*pm/, '').trim();
      const timeTarget = target.replace('.', ':').replace(/\s*am|\s*pm/, '').trim();
      if (timeInput && timeInput === timeTarget) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Generates character-by-character visual diff for in-situ error review.
 * 
 * @param {string} userText
 * @param {string} targetText
 * @returns {Array<{ char: string, type: 'match' | 'wrong' | 'missing' | 'extra', expected?: string }>}
 */
export function generateVisualDiff(userText = '', targetText = '') {
  const normUser = normalizeCambridgeString(userText);
  const normTarget = normalizeCambridgeString(targetText);

  const result = [];
  const maxLen = Math.max(normUser.length, normTarget.length);

  for (let i = 0; i < maxLen; i++) {
    const uChar = normUser[i];
    const tChar = normTarget[i];

    if (uChar === tChar) {
      result.push({ char: uChar, type: 'match' });
    } else if (uChar && !tChar) {
      result.push({ char: uChar, type: 'extra' });
    } else if (!uChar && tChar) {
      result.push({ char: tChar, type: 'missing' });
    } else {
      result.push({ char: uChar, type: 'wrong', expected: tChar });
    }
  }

  return result;
}
