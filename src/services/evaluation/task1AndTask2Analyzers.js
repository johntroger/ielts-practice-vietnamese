import { STOPWORDS, OVERVIEW_INDICATORS } from './evaluationRuleCatalogs.js';

// -------------------------------------------------------------
// HELPER UTILITIES & TOKENIZERS
// -------------------------------------------------------------

export function sanitizeWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

export function getSentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

export function getParagraphs(text) {
  return text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 15);
}

/**
 * Official Cambridge IELTS Rounding Rule:
 * Calculates arithmetic average of 4 components and rounds to nearest 0.5 or integer:
 * - Remainder < 0.25 -> Round DOWN to previous whole/half band (e.g. 6.125 -> 6.0)
 * - 0.25 <= Remainder < 0.75 -> Round to 0.5 (e.g. 6.25 -> 6.5, 6.625 -> 6.5)
 * - Remainder >= 0.75 -> Round UP to next whole band (e.g. 6.75 -> 7.0)
 */
export function roundToCambridgeBand(score) {
  const clamped = Math.max(1.0, Math.min(9.0, score));
  const floor = Math.floor(clamped);
  const diff = clamped - floor;
  if (diff < 0.25) return Math.max(1.0, floor);
  if (diff < 0.75) return floor + 0.5;
  return Math.min(9.0, floor + 1.0);
}

/**
 * Official Cambridge IELTS Writing Overall Band Calculation
 * According to Cambridge Assessment English & British Council regulations:
 * - Task 2 carries twice as much weight as Task 1:
 *     Raw Score = (Task 1 Band * 1 + Task 2 Band * 2) / 3
 * - Cambridge Rounding Rule:
 *     - If decimal < 0.25 -> Round down to previous whole/half band (e.g. 6.125 -> 6.0)
 *     - If 0.25 <= decimal < 0.75 -> Round to nearest 0.5 (e.g. 6.25 -> 6.5, 6.625 -> 6.5)
 *     - If decimal >= 0.75 -> Round up to next whole band (e.g. 6.75 -> 7.0)
 * Clamped between 1.0 and 9.0.
 *
 * @param {number|string} task1Band - Band score for Task 1 (1.0 - 9.0)
 * @param {number|string} task2Band - Band score for Task 2 (1.0 - 9.0)
 * @returns {{ t1Band: number, t2Band: number, rawWeighted: number, overallBand: number, cefrLevel: string, weightingFormula: string }}
 */
export function calculateOverallWritingBand(task1Band, task2Band) {
  const t1 = Math.max(1.0, Math.min(9.0, Number(task1Band) || 1.0));
  const t2 = Math.max(1.0, Math.min(9.0, Number(task2Band) || 1.0));
  const rawWeighted = (t1 * 1 + t2 * 2) / 3;
  const overallBand = roundToCambridgeBand(rawWeighted);

  let cefrLevel = 'B1';
  if (overallBand >= 8.5) cefrLevel = 'C2';
  else if (overallBand >= 7.0) cefrLevel = 'C1';
  else if (overallBand >= 5.5) cefrLevel = 'B2';
  else if (overallBand >= 4.0) cefrLevel = 'B1';
  else cefrLevel = 'A2';

  return {
    t1Band: t1,
    t2Band: t2,
    rawWeighted: Number(rawWeighted.toFixed(3)),
    overallBand,
    cefrLevel,
    weightingFormula: '((Task 1 × 1) + (Task 2 × 2)) / 3'
  };
}

// -------------------------------------------------------------
// SPECIALIZED TASK 1 & TASK 2 LINGUISTIC ANALYZERS
// -------------------------------------------------------------

/**
 * Prompt Verbatim Copying Deduction (Cambridge Regulation)
 * Identifies chunks of >= 4 consecutive words copied directly from the prompt.
 * Words from prompt copying are subtracted from total word count (Effective Word Count)
 * and penalized in Task Response and Lexical Resource.
 */
export function analyzePromptVerbatimCopying(prompt, essayText) {
  if (!prompt || !essayText || typeof prompt !== 'string' || typeof essayText !== 'string') {
    return { totalCopiedWords: 0, copiedChunks: [] };
  }

  // Filter standard IELTS meta-instructions so they are not treated as topic prompt
  const cleanPrompt = prompt
    .replace(/You should spend about \d+ minutes on this task\.?/gi, '')
    .replace(/Write at least \d+ words\.?/gi, '')
    .replace(/Give reasons for your answer and include any relevant examples from your own knowledge or experience\.?/gi, '')
    .replace(/Summarise the information by selecting and reporting the main features.*?where relevant\.?/gi, '');

  const promptWords = cleanPrompt.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(Boolean);
  const essayWords = essayText.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(Boolean);

  if (promptWords.length < 4 || essayWords.length < 4) {
    return { totalCopiedWords: 0, copiedChunks: [] };
  }

  const minChunkLen = 4;
  const copiedRangesInEssay = [];

  for (let i = 0; i <= essayWords.length - minChunkLen; i++) {
    let maxLen = 0;
    for (let j = 0; j <= promptWords.length - minChunkLen; j++) {
      let matchLen = 0;
      while (
        i + matchLen < essayWords.length &&
        j + matchLen < promptWords.length &&
        essayWords[i + matchLen] === promptWords[j + matchLen]
      ) {
        matchLen++;
      }
      if (matchLen >= minChunkLen && matchLen > maxLen) {
        maxLen = matchLen;
      }
    }

    if (maxLen >= minChunkLen) {
      copiedRangesInEssay.push({ start: i, end: i + maxLen, length: maxLen });
      i += maxLen - 1; // skip ahead to avoid overlapping sub-chunks
    }
  }

  // Merge any overlapping or adjacent ranges
  const mergedRanges = [];
  copiedRangesInEssay.forEach(range => {
    if (mergedRanges.length === 0) {
      mergedRanges.push(range);
    } else {
      const last = mergedRanges[mergedRanges.length - 1];
      if (range.start <= last.end) {
        last.end = Math.max(last.end, range.end);
        last.length = last.end - last.start;
      } else {
        mergedRanges.push(range);
      }
    }
  });

  const copiedChunks = mergedRanges
    .map(r => ({
      phrase: essayWords.slice(r.start, r.end).join(' '),
      wordCount: r.length,
      startIndex: r.start
    }))
    .filter(c => {
      // Exclude timeframe / year ranges like "between 1995 and 2025" or "from 2000 to 2010"
      const hasYears = (c.phrase.match(/\b(19\d\d|20\d\d)\b/g) || []).length >= 2;
      if (hasYears && c.wordCount <= 6) return false;
      return true;
    });

  const totalCopiedWords = copiedChunks.reduce((acc, c) => acc + c.wordCount, 0);

  return {
    totalCopiedWords,
    copiedChunks
  };
}

/**
 * Prompt-Essay Semantic Relevance (PESR)
 * Detects whether the candidate actually answers the topic or writes off-topic.
 */
export function analyzePromptSemanticRelevance(prompt, essayText) {
  if (!prompt || typeof prompt !== 'string') return { score: 1.0, isOffTopic: false, keywords: [] };

  const promptWords = sanitizeWords(prompt).filter(w => !STOPWORDS.has(w) && w.length >= 4);
  const uniquePromptWords = Array.from(new Set(promptWords));
  if (uniquePromptWords.length < 3) return { score: 1.0, isOffTopic: false, keywords: uniquePromptWords };

  const essayWords = new Set(sanitizeWords(essayText));
  let matchedCount = 0;
  const matchedKeywords = [];

  uniquePromptWords.forEach(kw => {
    // Check direct match, plural/singular, or root stem
    const root = kw.replace(/(ing|ed|tion|tions|s|es|al|ive)$/, '');
    const hit = Array.from(essayWords).some(ew => {
      if (ew === kw) return true;
      if (root.length >= 3 && ew.startsWith(root)) return true;
      return false;
    });
    if (hit) {
      matchedCount++;
      matchedKeywords.push(kw);
    }
  });

  const overlapRatio = matchedCount / uniquePromptWords.length;
  // If essay mentions fewer than 28% of core content words, severe off-topic risk
  const isOffTopic = uniquePromptWords.length >= 4 && overlapRatio < 0.28;

  return {
    score: overlapRatio,
    isOffTopic,
    matchedKeywords,
    totalKeywords: uniquePromptWords.length
  };
}

/**
 * Extract raw numerical data points from text (Task 1 Overview check)
 * Distinguishes true data figures (percentages, units, statistical values) from structural counts & timeframes.
 */
export function extractTask1RawDataPoints(text) {
  if (!text) return [];
  const found = [];

  // 1. Percentages: e.g. 50%, 25.5%, 30 percent, 5 percentage points
  const percentRegex = /(?:\b\d+(?:\.\d+)?\s*%(?!\w)|\b\d+(?:\.\d+)?\s*percent(?:age\s+points?)?\b)/gi;
  const pMatches = text.match(percentRegex);
  if (pMatches) found.push(...pMatches);

  // 2. Units / Currency / Volume: e.g. $500, 10 million, 25 kg, 100 people, 45 euros, 30 liters
  const unitRegex = /(?:\$\s*\d+(?:\.\d+)?|\b\d+(?:\.\d+)?\s*(?:million|billion|thousand|hundred|meters?|metres?|liters?|litres?|dollars?|pounds?|euros?|units?|people|students?|tons?|tonnes?|kg|km|degrees?|celsius|g|mg|ml)\b)/gi;
  const uMatches = text.match(unitRegex);
  if (uMatches) found.push(...uMatches);

  // 3. Statistical verb/preposition + number: e.g. peaked at 85, peaking at 80, stood at 40, dropped to 15, was 50
  const statMarkerRegex = /\b(?:peak(?:ed|ing)?\s+at|st(?:ood|anding)\s+at|bottom(?:ed|ing)?\s+at|reach(?:ed|ing)?|plummet(?:ed|ing)?\s+to|r(?:ose|ising)\s+to|f(?:ell|alling)\s+to|drop(?:ped|ping)?\s+to|climb(?:ed|ing)?\s+to|hover(?:ed|ing)?\s+around|was\s+at|were\s+at|recorded\s+at|amount(?:ed|ing)?\s+to)\s+(\$?\d+(?:\.\d+)?%?)/gi;
  let match;
  while ((match = statMarkerRegex.exec(text)) !== null) {
    const rawVal = match[1].trim();
    if (!/^(19\d\d|20\d\d)$/.test(rawVal)) {
      found.push(match[0]);
    }
  }

  // 4. Specific data assignments: e.g., "was 50", "were 65", "at 45" (not duration/count of categories)
  const valRegex = /\b(?:was|were|at|approximately|around|nearly|about)\s+(\d+(?:\.\d+)?)\b(?!\s*(?:years?|months?|weeks?|days?|decades?|centuries?|stages?|steps?|phases?|categories?|types?|groups?|countries?|nations?|charts?|graphs?|tables?|lines?|bars?))/gi;
  while ((match = valRegex.exec(text)) !== null) {
    const num = match[1].trim();
    if (!/^(19\d\d|20\d\d)$/.test(num)) {
      found.push(match[0]);
    }
  }

  // Deduplicate case-insensitively
  const unique = [];
  const seen = new Set();
  for (const item of found) {
    const clean = item.trim();
    const lower = clean.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      unique.push(clean);
    }
  }

  return unique;
}

/**
 * Task 1 Overview Examiner Diagnostics & Raw Data Penalty
 * In IELTS Writing Task 1, the Overview MUST present key trends, differences, or stages WITHOUT raw numbers/data.
 * Any raw data (e.g. 50%, 10 million, 25 meters, peaked at 80) in the Overview paragraph caps Task Achievement at Band 5.5 max.
 */
export function analyzeTask1Overview(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) {
    return {
      hasOverview: false,
      overviewIndex: -1,
      overviewText: '',
      hasRawData: false,
      rawDataList: []
    };
  }

  let overviewIndex = -1;
  let overviewText = '';

  // Look for overview indicators across paragraphs
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const pLower = p.toLowerCase();
    const matchesIndicator = OVERVIEW_INDICATORS.some(ind => pLower.includes(ind)) ||
      /\b(overall|in\s+summary|to\s+summarize|in\s+general|the\s+overall\s+trend|overall\s+trend|broadly\s+speaking)\b/i.test(pLower);
    if (matchesIndicator) {
      overviewIndex = i;
      overviewText = p;
      break;
    }
  }

  // If candidate wrote 3 or 4 paragraphs and paragraph 2 (index 1) has general trend words, check if intended as overview
  if (overviewIndex === -1 && paragraphs.length >= 3) {
    const p2Lower = paragraphs[1].toLowerCase().trim();
    const isChronologicalStart = /^(in|during|at|between|from)\s+\d{4}\b/i.test(p2Lower);
    if (!isChronologicalStart &&
        /\b(trend|highest|lowest|upward|downward|fluctuat|increase|decrease|predominant)\b/i.test(p2Lower) &&
        !/\b(firstly|first of all|to begin with|on the one hand)\b/i.test(p2Lower)) {
      const p2Data = extractTask1RawDataPoints(paragraphs[1]);
      if (p2Data.length <= 1) {
        overviewIndex = 1;
        overviewText = paragraphs[1];
      }
    }
  }

  const hasOverview = overviewIndex !== -1;
  const rawDataList = hasOverview ? extractTask1RawDataPoints(overviewText) : [];

  return {
    hasOverview,
    overviewIndex, // 0-indexed
    overviewText,
    hasRawData: rawDataList.length > 0,
    rawDataList
  };
}

/**
 * Task 1 Numerical & Statistical Data Extractor
 * Verifies that body paragraphs contain specific figures, percentages, dates, or units.
 * Excludes Overview paragraph from body data calculations.
 */
export function analyzeTask1DataDensity(paragraphs, overviewIndex = -1) {
  if (paragraphs.length <= 1) return { bodyDataCount: 0, hasAdequateData: false };

  // Body paragraphs exclude Introduction (index 0) and Overview paragraph (if any)
  const bodyParas = paragraphs.filter((_, idx) => idx !== 0 && idx !== overviewIndex);
  const dataRegex = /\b(\d+(\.\d+)?%?|\d+\s*(percent|million|billion|thousand|meters|liters|dollars|pounds|euros|units|people|students)|(19\d\d|20\d\d))\b/gi;

  let totalDataPoints = 0;
  bodyParas.forEach(p => {
    const matches = p.match(dataRegex);
    if (matches) totalDataPoints += matches.length;
  });

  return {
    bodyDataCount: totalDataPoints,
    hasAdequateData: totalDataPoints >= 3
  };
}

/**
 * IELTS Task 1 Comparative & Contrasting Language Patterns
 * Required by Cambridge Task 1: "make comparisons where relevant".
 */
export const TASK1_COMPARATIVE_PATTERNS = [
  // 1. Multiplicative & Proportional
  { regex: /\b(?:twice|three\s+times|four\s+times|five\s+times)\s+(?:as\s+\w+\s+as|higher\s+than|lower\s+than|more\s+than|less\s+than)\b/gi, name: 'so sánh bội số (twice as...as)' },
  { regex: /\b(?:double|doubled|triple|tripled|treble|trebled|halve|halved|quadruple|quadrupled)\b/gi, name: 'động từ nhân bội / giảm nửa' },
  { regex: /\b(?:double|triple|half|one-third|two-thirds|a\s+quarter)\s+(?:that\s+of|the\s+figure\s+for|the\s+proportion\s+of|the\s+number\s+of)\b/gi, name: 'so sánh tỷ lệ phân số' },

  // 2. Comparative forms with 'than' or 'as ... as'
  { regex: /\b(?:higher|lower|greater|smaller|larger|fewer|more|less)\s+than\b/gi, name: 'so sánh hơn kém (than)' },
  { regex: /\b(?:significantly|substantially|considerably|far|much|slightly|marginally|somewhat)\s+(?:higher|lower|greater|smaller|larger|fewer|more|less)\b/gi, name: 'so sánh mức độ chênh lệch' },
  { regex: /\bas\s+(?:high|low|much|many|popular|prevalent|widespread)\s+as\b/gi, name: 'so sánh ngang bằng (as...as)' },
  { regex: /\b(?:nearly|almost|approximately)\s+as\s+\w+\s+as\b/gi, name: 'so sánh xấp xỉ ngang bằng' },

  // 3. Superlative forms with data reference
  { regex: /\bthe\s+(?:highest|lowest|greatest|smallest|largest|most\s+popular|least\s+popular|predominant|dominant)\b/gi, name: 'so sánh nhất (superlative)' },
  { regex: /\bby\s+far\s+the\s+(?:highest|lowest|most|least|greatest)\b/gi, name: 'so sánh nhất tuyệt đối' },

  // 4. Contrasting connectives between figures
  { regex: /\b(?:in\s+stark\s+contrast\s+to|in\s+contrast\s+to|in\s+comparison\s+with|in\s+comparison\s+to|compared\s+(?:to|with)|as\s+opposed\s+to)\b/gi, name: 'cụm từ đối chiếu (compared to / in contrast to)' },
  { regex: /\b(?:whereas|whilst|while)\b/gi, name: 'liên từ đối lập số liệu (whereas / while)' },
  { regex: /\b(?:conversely|on\s+the\s+contrary|at\s+the\s+opposite\s+end\s+of\s+the\s+spectrum)\b/gi, name: 'từ nối chuyển ý đối lập' },

  // 5. Overtaking & Exceeding
  { regex: /\b(?:outstripped|surpassed|overtook|overtaken|exceeded|eclipsed)\b/gi, name: 'động từ vượt mặt (outstripped / overtook)' },
  { regex: /\b(?:lagged\s+behind|fell\s+behind|trailed\s+behind)\b/gi, name: 'tụt lại phía sau (lagged behind)' },

  // 6. Disparity & Gap vocabulary
  { regex: /\b(?:the\s+gap\s+between|the\s+disparity\s+between|a\s+disparity\s+of|a\s+difference\s+of)\b/gi, name: 'từ vựng chênh lệch khoảng cách (gap / disparity)' },
  { regex: /\bthe\s+gap\s+(?:widened|narrowed|remained\s+constant)\b/gi, name: 'xu hướng mở rộng / thu hẹp khoảng cách' },

  // 7. Ranking & Sequencing
  { regex: /\b(?:closely\s+followed\s+by|followed\s+by)\b/gi, name: 'xếp hạng theo sau (followed by)' },
  { regex: /\b(?:ranked\s+(?:first|second|third|last)|in\s+(?:first|second|third|last)\s+place|occupied\s+the\s+(?:first|top|bottom)\s+spot)\b/gi, name: 'thứ hạng (ranked second / top spot)' },
  { regex: /\brespectively\b/gi, name: 'tương ứng (respectively)' }
];

/**
 * Task 1 Comparative Language & Data Contrasting Analyzer
 * Evaluates compliance with the explicit instruction: "make comparisons where relevant".
 * Detects whether the candidate makes meaningful comparisons between figures/categories
 * or falls into the "Mechanical Data Listing" trap (listing figures without comparison).
 */
export function analyzeTask1Comparisons(paragraphs, overviewIndex = -1) {
  if (!paragraphs || paragraphs.length === 0) {
    return {
      totalComparisons: 0,
      uniqueComparisonsCount: 0,
      matchedComparisons: [],
      comparisonsByParagraph: []
    };
  }

  // Focus primarily on body paragraphs (excluding Introduction and Overview)
  const bodyParas = paragraphs.filter((_, idx) => idx !== 0 && idx !== overviewIndex);
  const matchedComparisons = [];
  const comparisonsByParagraph = [];

  bodyParas.forEach((pText, idx) => {
    const paraMatches = [];
    TASK1_COMPARATIVE_PATTERNS.forEach(patternObj => {
      patternObj.regex.lastIndex = 0;
      const matches = pText.match(patternObj.regex);
      if (matches) {
        matches.forEach(m => {
          paraMatches.push({
            patternName: patternObj.name,
            text: m.trim()
          });
          matchedComparisons.push(m.trim());
        });
      }
    });

    comparisonsByParagraph.push({
      bodyIndex: idx + 1,
      count: paraMatches.length,
      matches: paraMatches
    });
  });

  const uniqueMatched = Array.from(new Set(matchedComparisons.map(m => m.toLowerCase())));

  return {
    totalComparisons: matchedComparisons.length,
    uniqueComparisonsCount: uniqueMatched.length,
    matchedComparisons: uniqueMatched,
    comparisonsByParagraph
  };
}

/**
 * Detect Task 1 Subtype: 'map' | 'process' | 'chart_graph'
 * Dynamically infers the visual format from task metadata, prompt keywords, or essay vocabulary.
 */
export function detectTask1Subtype(task = {}, essayText = '') {
  // 1. Explicit task configuration
  if (task?.type === 'map') return 'map';
  if (task?.type === 'process') return 'process';
  if (task?.taskType === 'map') return 'map';
  if (task?.taskType === 'process') return 'process';
  if (Array.isArray(task?.mapChanges) && task.mapChanges.length > 0) return 'map';
  if (Array.isArray(task?.processSteps) && task.processSteps.length > 0) return 'process';

  // 2. Prompt and Title linguistic markers
  const context = `${task?.title || ''} ${task?.prompt || ''}`.toLowerCase();
  if (/\b(?:map|maps|plan|plans|layout|urban\s+change|urban\s+transformation|redevelopment|village\s+of|island\s+of|floor\s+plan|site\s+plan|campus\s+plan|infrastructure\s+changes?)\b/i.test(context)) {
    return 'map';
  }
  if (/\b(?:process|stages?|procedure|diagram|diagrams|life\s+cycle|manufacturing|production\s+of|how\s+.*?\s+is\s+(?:made|produced|processed|manufactured|generated|recycled)|flowchart)\b/i.test(context)) {
    return 'process';
  }

  // 3. Fallback: Essay body vocabulary scan
  if (essayText && typeof essayText === 'string') {
    const mapMatches = essayText.match(/\b(?:to\s+the\s+(?:north|south|east|west)|northern|southern|eastern|western|northwest|northeast|southwest|southeast|demolished|knocked\s+down|converted\s+into|made\s+way\s+for|erected|constructed|relocated|adjacent\s+to|flanked\s+by|pedestrianized|dual\s+carriageway|roundabout)\b/gi) || [];
    const processMatches = essayText.match(/\b(?:in\s+the\s+(?:first|initial)\s+stage|subsequently|followed\s+by|culminates\s+in|the\s+process\s+begins|raw\s+materials?|undergoes|is\s+heated|is\s+cooled|is\s+crushed|is\s+filtered|is\s+packaged|the\s+final\s+step|the\s+cycle\s+repeats)\b/gi) || [];

    if (mapMatches.length >= 3 && mapMatches.length > processMatches.length) {
      return 'map';
    }
    if (processMatches.length >= 3 && processMatches.length > mapMatches.length) {
      return 'process';
    }
  }

  return 'chart_graph';
}

/**
 * Task 1 Map Specialized Linguistic Patterns
 * Essential for describing spatial orientation, layouts, and urban/infrastructural transformations.
 */
export const MAP_SPATIAL_PATTERNS = [
  // 1. Cardinal Directions & Compass Quadrants
  {
    category: 'compass',
    name: 'phương hướng la bàn (cardinal directions)',
    regex: /\b(?:north|south|east|west|north-?east(?:ern)?|north-?west(?:ern)?|south-?east(?:ern)?|south-?west(?:ern)?|northern|southern|eastern|western|northward|southward|eastward|westward)\b/gi
  },
  {
    category: 'compass',
    name: 'định vị góc phần tư / khu vực (directional quadrant/section)',
    regex: /\b(?:to\s+the\s+(?:north|south|east|west|north-?east|north-?west|south-?east|south-?west)\s+of|(?:in\s+)?the\s+(?:northern|southern|eastern|western|north-?eastern|north-?western|south-?eastern|south-?western)\s+(?:part|region|section|quadrant|area|corner|perimeter))\b/gi
  },

  // 2. Spatial Relations & Adjacency Prepositions
  {
    category: 'spatialRelation',
    name: 'giới từ vị trí tương quan (spatial prepositions & adjacency)',
    regex: /\b(?:adjacent\s+to|opposite(?:\s+to)?|across\s+from|parallel\s+to|bordered\s+by|surrounding|surrounded\s+by|in\s+close\s+proximity\s+to|in\s+the\s+vicinity\s+of|flanked\s+by|positioned\s+(?:at|in|near)|situated\s+(?:in|at|along|near|on)|located\s+(?:in|at|along|near|on)|nestled\s+between|alongside)\b/gi
  },

  // 3. Demolition, Removal & Clearance
  {
    category: 'demolition',
    name: 'dỡ bỏ / xóa bỏ (demolition & clearance)',
    regex: /\b(?:demolished|knocked\s+down|flattened|pulled\s+down|razed(?:\s+to\s+the\s+ground)?|torn\s+down|cleared|eradicated|dismantled|removed|chopped\s+down|cut\s+down)\b/gi
  },

  // 4. Replacement & Succession
  {
    category: 'replacement',
    name: 'thay thế mặt bằng (replacement & succession)',
    regex: /\b(?:replaced\s+by|(?:made|make)\s+way\s+for|(?:gave|give)\s+way\s+to|supplanted\s+by|succeeded\s+by)\b/gi
  },

  // 5. Transformation & Repurposing
  {
    category: 'transformation',
    name: 'chuyển đổi công năng (transformation & repurposing)',
    regex: /\b(?:converted\s+into|transformed\s+into|repurposed\s+(?:into|as)|turned\s+into|modernised|modernized|redeveloped\s+into|metamorphosed\s+into|evolved\s+into)\b/gi
  },

  // 6. Construction & Addition
  {
    category: 'construction',
    name: 'xây mới / bổ sung (construction & erection)',
    regex: /\b(?:erected|constructed|built|installed|introduced|established|added|set\s+up)\b/gi
  },

  // 7. Expansion, Lengthening & Widening
  {
    category: 'expansion',
    name: 'mở rộng quy mô hạ tầng (expansion & widening)',
    regex: /\b(?:extended|expanded|widened|enlarged|stretched|broadened|lengthened|pedestrianized|dual\s+carriageway|roundabout)\b/gi
  },

  // 8. Relocation & Preservation
  {
    category: 'preservation',
    name: 'di dời / giữ nguyên (relocation & preservation)',
    regex: /\b(?:relocated\s+to|moved\s+to|shifted\s+to|remained\s+(?:unchanged|intact|the\s+same)|witnessed\s+no\s+alteration|left\s+intact)\b/gi
  }
];

/**
 * Task 1 Process Specialized Sequential Patterns
 * Essential for describing linear/cyclical manufacturing, natural life cycles, and mechanical operations.
 */
export const PROCESS_SEQUENTIAL_PATTERNS = [
  // 1. Initial Stage Linkers
  {
    category: 'initial',
    name: 'giai đoạn khởi đầu (initial stage)',
    regex: /\b(?:in\s+the\s+(?:initial|first)\s+(?:stage|step|phase)|the\s+(?:first|initial)\s+(?:step|stage|phase)\s+(?:is|involves)|the\s+process\s+(?:begins|starts|commences)\s+(?:with|by)|at\s+the\s+outset|initially|first\s+of\s+all|firstly)\b/gi
  },

  // 2. Subsequent / Chronological Transitions
  {
    category: 'subsequent',
    name: 'chuyển tiếp giai đoạn tiếp theo (subsequent stages)',
    regex: /\b(?:subsequently|following\s+(?:this|that)|after\s+(?:this|that|which)|in\s+the\s+(?:following|subsequent|next)\s+(?:stage|step|phase)|at\s+the\s+next\s+stage|then|next|thereafter|in\s+the\s+course\s+of\s+the\s+next\s+stage)\b/gi
  },

  // 3. Simultaneous / Concurrent Steps
  {
    category: 'simultaneous',
    name: 'giai đoạn đồng thời (simultaneous operations)',
    regex: /\b(?:simultaneously|concurrently|at\s+the\s+same\s+time|in\s+tandem|meanwhile|while\s+this\s+is\s+taking\s+place)\b/gi
  },

  // 4. Prerequisite & Conditional State Transitions
  {
    category: 'conditional',
    name: 'liên kết điều kiện thời điểm (prior to / once)',
    regex: /\b(?:prior\s+to\s+(?:being|\w+ing)|before\s+(?:being|\w+ing)|once\s+(?:this\s+is\s+(?:completed|done)|heated|cooled|filtered|crushed|purified)|having\s+been\s+\w+ed)\b/gi
  },

  // 5. Final / Concluding Stage Markers
  {
    category: 'final',
    name: 'giai đoạn hoàn tất (final / culmination)',
    regex: /\b(?:finally|ultimately|in\s+the\s+final\s+(?:stage|step|phase)|the\s+process\s+(?:concludes|culminates|ends)\s+(?:with|by|in)|the\s+last\s+(?:step|stage)\s+(?:is|involves)|the\s+finished\s+product\s+is)\b/gi
  },

  // 6. Cyclical / Recurring Process Indicators
  {
    category: 'cyclical',
    name: 'tính chất chu kỳ (cyclical repetition)',
    regex: /\b(?:the\s+cycle\s+(?:repeats|starts\s+again|is\s+repeated)|in\s+a\s+cyclical\s+(?:manner|process|way)|recurring\s+loop|repeats\s+indefinitely)\b/gi
  },

  // 7. Process Operational Passive Voice Constructions
  {
    category: 'passiveOps',
    name: 'thao tác thể bị động (passive voice process operations)',
    regex: /\b(?:is|are|was|were|being|been)\s+(?:crushed|pulverised|pulverized|mixed|blended|heated|cooled|filtered|purified|extracted|transported|delivered|transferred|fed\s+into|poured\s+into|passed\s+through|stored|packaged|distributed|melted|moulded|molded|separated|collected|condensed|evaporated|harvested|refined|treated|dried|submerged|baked|assembled|combined)\b/gi
  }
];

/**
 * Task 1 Map Features Analyzer
 * Analyzes body paragraphs for spatial prepositions, cardinal directions, and transformation verbs.
 */
export function analyzeTask1MapFeatures(paragraphs, overviewIndex = -1) {
  if (!paragraphs || paragraphs.length === 0) {
    return {
      totalSpatialCount: 0,
      cardinalCount: 0,
      prepositionCount: 0,
      transformationCount: 0,
      uniquePatternsCount: 0,
      matchedFeatures: [],
      categories: {
        compass: [],
        spatialRelation: [],
        demolition: [],
        replacement: [],
        transformation: [],
        construction: [],
        expansion: [],
        preservation: []
      }
    };
  }

  const bodyParas = paragraphs.filter((_, idx) => idx !== 0 && idx !== overviewIndex);
  const matchedFeatures = [];
  const categories = {
    compass: [],
    spatialRelation: [],
    demolition: [],
    replacement: [],
    transformation: [],
    construction: [],
    expansion: [],
    preservation: []
  };

  bodyParas.forEach(pText => {
    MAP_SPATIAL_PATTERNS.forEach(pat => {
      pat.regex.lastIndex = 0;
      const matches = pText.match(pat.regex);
      if (matches) {
        matches.forEach(m => {
          const item = m.trim();
          matchedFeatures.push(item);
          if (categories[pat.category]) {
            categories[pat.category].push(item);
          }
        });
      }
    });
  });

  const uniqueMatched = Array.from(new Set(matchedFeatures.map(m => m.toLowerCase())));
  const cardinalCount = categories.compass.length;
  const prepositionCount = categories.spatialRelation.length;
  const transformationCount = categories.demolition.length +
    categories.replacement.length +
    categories.transformation.length +
    categories.construction.length +
    categories.expansion.length +
    categories.preservation.length;

  return {
    totalSpatialCount: matchedFeatures.length,
    cardinalCount,
    prepositionCount,
    transformationCount,
    uniquePatternsCount: uniqueMatched.length,
    matchedFeatures: uniqueMatched,
    categories
  };
}

/**
 * Task 1 Process Features Analyzer
 * Analyzes body paragraphs for stage sequencing linkers and passive voice operational verbs.
 */
export function analyzeTask1ProcessFeatures(paragraphs, overviewIndex = -1) {
  if (!paragraphs || paragraphs.length === 0) {
    return {
      totalSequentialCount: 0,
      passiveVoiceCount: 0,
      hasInitialStage: false,
      hasConcludingStage: false,
      uniquePatternsCount: 0,
      matchedStages: [],
      matchedPassives: [],
      categories: {
        initial: [],
        subsequent: [],
        simultaneous: [],
        conditional: [],
        final: [],
        cyclical: [],
        passiveOps: []
      }
    };
  }

  const bodyParas = paragraphs.filter((_, idx) => idx !== 0 && idx !== overviewIndex);
  const matchedStages = [];
  const matchedPassives = [];
  const categories = {
    initial: [],
    subsequent: [],
    simultaneous: [],
    conditional: [],
    final: [],
    cyclical: [],
    passiveOps: []
  };

  bodyParas.forEach(pText => {
    PROCESS_SEQUENTIAL_PATTERNS.forEach(pat => {
      pat.regex.lastIndex = 0;
      const matches = pText.match(pat.regex);
      if (matches) {
        matches.forEach(m => {
          const item = m.trim();
          if (pat.category === 'passiveOps') {
            matchedPassives.push(item);
          } else {
            matchedStages.push(item);
          }
          if (categories[pat.category]) {
            categories[pat.category].push(item);
          }
        });
      }
    });
  });

  const uniqueStages = Array.from(new Set(matchedStages.map(m => m.toLowerCase())));
  const uniquePassives = Array.from(new Set(matchedPassives.map(m => m.toLowerCase())));

  return {
    totalSequentialCount: matchedStages.length,
    passiveVoiceCount: matchedPassives.length,
    hasInitialStage: categories.initial.length > 0,
    hasConcludingStage: categories.final.length > 0,
    uniquePatternsCount: uniqueStages.length + uniquePassives.length,
    matchedStages: uniqueStages,
    matchedPassives: uniquePassives,
    categories
  };
}

/**
 * Advanced Task 2 Question Classifier & Task Fulfillment Engine
 * Strictly enforces Cambridge Band Descriptors for Task Response:
 * - Omits one part of a multi-part prompt -> Hard cap TR Band 5.0
 * - Covers both parts unequally/superficially -> Cap TR Band 6.0
 * - Fully addresses both parts in balanced body paragraphs -> TR Band 7.0+
 */
export function analyzeTask2Fulfillment(prompt, paragraphs) {
  if (!prompt || typeof prompt !== 'string') {
    return { type: 'GENERAL', isBalanced: true, severity: 'none', warning: null, taskDescription: '' };
  }

  const promptLower = prompt.toLowerCase();
  const bodyParas = paragraphs.length > 2 ? paragraphs.slice(1, -1) : paragraphs.slice(1);
  const bodyText = bodyParas.join(' ').toLowerCase();

  // -------------------------------------------------------------
  // 1. TWO-PART: WHY + POSITIVE/NEGATIVE
  // e.g. "Why is this the case? Is this a positive or negative development?"
  // -------------------------------------------------------------
  const isWhyPosNeg = /why\s+(?:is|do|does|are).*?\?.*?(?:positive\s+or\s+negative|negative\s+or\s+positive|a\s+good\s+or\s+bad|benefit\s+or\s+drawback)/i.test(promptLower) ||
    (/\bwhy\b/i.test(promptLower) && /\b(positive\s+or\s+negative|advantage\s+or\s+disadvantage)\b/i.test(promptLower));

  if (isWhyPosNeg) {
    const reasonRegex = /\b(reason(?:s)?|cause(?:s|d)?|factor(?:s)?|stem(?:s|med)?\s+from|due\s+to|because|arise(?:s|n)?|lead(?:s)?\s+to|attribute(?:d)?|result\s+of|catalyst(?:s)?|driver(?:s)?|driv(?:e|en|ing)|propel(?:led|s)?|motivat(?:e|ed|ing|ion)|originate(?:s|d)?|root(?:s)?\s+in)\b/i;
    const posNegRegex = /\b(positive(?:ly)?|negative(?:ly)?|benefit(?:s|ed|ing|ial)?|advantage(?:s|ous)?|drawback(?:s)?|disadvantage(?:s|ous)?|merit(?:s)?|detriment(?:al)?|favor(?:able)?|harmful|upside(?:s)?|downside(?:s)?|constructive|destructive)\b/i;

    const hasReasonsInBody = reasonRegex.test(bodyText);
    const hasPosNegInBody = posNegRegex.test(bodyText);

    if (!hasReasonsInBody && !hasPosNegInBody) {
      return {
        type: 'TWO_PART_WHY_POS_NEG',
        isBalanced: false,
        severity: 'fatal',
        taskDescription: '1. Giải thích nguyên nhân (Why) & 2. Đánh giá Tích cực/Tiêu cực (Positive or Negative)',
        missingPartDescription: 'cả 2 câu hỏi của đề bài',
        warning: 'LỖI BỎ SÓT CẢ 2 YÊU CẦU ĐỀ BÀI: Đề bài yêu cầu giải thích nguyên nhân và đánh giá tính tích cực/tiêu cực, nhưng thân bài chưa phát triển rõ ràng các luận điểm này.'
      };
    }

    if (!hasReasonsInBody || !hasPosNegInBody) {
      const missingPart = !hasReasonsInBody ? 'Câu hỏi 1: Giải thích nguyên nhân (Why)' : 'Câu hỏi 2: Đánh giá Tích cực hay Tiêu cực (Is this positive or negative)';
      return {
        type: 'TWO_PART_WHY_POS_NEG',
        isBalanced: false,
        severity: 'fatal',
        taskDescription: '1. Giải thích nguyên nhân (Why) & 2. Đánh giá Tích cực/Tiêu cực (Positive or Negative)',
        missingPartDescription: missingPart,
        warning: `LỖI BỎ SÓT YÊU CẦU ĐỀ BÀI (Unaddressed Task): Đề bài gồm 2 câu hỏi độc lập, nhưng bài viết hoàn toàn BỎ SÓT ${missingPart}. Barem Cambridge quy định bài viết chỉ trả lời 1 phần của đề thi (addresses the task only partially) bị KHỐNG CHẾ Task Response tối đa Band 5.0.`
      };
    }

    return {
      type: 'TWO_PART_WHY_POS_NEG',
      isBalanced: true,
      severity: 'none',
      taskDescription: '1. Giải thích nguyên nhân (Why) & 2. Đánh giá Tích cực/Tiêu cực',
      warning: null
    };
  }

  // -------------------------------------------------------------
  // 2. TWO-PART: WHY + EFFECTS/PROBLEMS
  // e.g. "Why is this happening? What problems does this cause / What are the effects?"
  // -------------------------------------------------------------
  const isWhyEffects = /\bwhy\b.*?\?.*?\b(what\s+effects?|what\s+problems?|what\s+consequences?|how\s+does\s+this\s+affect)\b/i.test(promptLower);

  if (isWhyEffects) {
    const reasonRegex = /\b(reason(?:s)?|cause(?:s|d)?|factor(?:s)?|stem(?:s|med)?\s+from|due\s+to|because|arise(?:s|n)?|contribute(?:s|d)?|catalyst(?:s)?|driver(?:s)?|driv(?:e|en|ing)|propel(?:led|s)?|motivat(?:e|ed|ing|ion))\b/i;
    const effectRegex = /\b(effect(?:s)?|problem(?:s)?|consequence(?:s)?|impact(?:s)?|influence(?:s)?|harm|damage|affect(?:s|ed|ing)?|repercussion(?:s)?|result(?:s)?)\b/i;

    const hasReasons = reasonRegex.test(bodyText);
    const hasEffects = effectRegex.test(bodyText);

    if (!hasReasons || !hasEffects) {
      const missingPart = !hasReasons ? 'Câu hỏi 1 (Nguyên nhân - Why)' : 'Câu hỏi 2 (Tác động / Vấn đề - Effects/Problems)';
      return {
        type: 'TWO_PART_WHY_EFFECTS',
        isBalanced: false,
        severity: 'fatal',
        taskDescription: '1. Nguyên nhân (Why) & 2. Tác động / Vấn đề (Effects/Problems)',
        missingPartDescription: missingPart,
        warning: `LỖI BỎ SÓT YÊU CẦU ĐỀ BÀI: Bài viết hoàn toàn bỏ sót ${missingPart}. Barem Cambridge khống chế Task Response tối đa Band 5.0 khi thí sinh không trả lời đầy đủ các câu hỏi của đề.`
      };
    }

    return {
      type: 'TWO_PART_WHY_EFFECTS',
      isBalanced: true,
      severity: 'none',
      taskDescription: '1. Nguyên nhân & 2. Tác động',
      warning: null
    };
  }

  // -------------------------------------------------------------
  // 3. PROBLEMS & SOLUTIONS / CAUSES & SOLUTIONS
  // e.g. "What are the causes? How can this problem be solved?"
  // -------------------------------------------------------------
  const isProblemSolution = /causes?\s+(?:and|&)\s+solutions?|problems?\s+(?:and|&)\s+solutions?|what\s+(?:causes|measures|steps)|how\s+can\s+(?:this|we)\s+(?:solve|tackle|deal)/i.test(promptLower);

  if (isProblemSolution) {
    const causeRegex = /\b(cause(?:s|d)?|reason(?:s)?|stem(?:s|med)?\s+from|due\s+to|originate(?:s|d)?|factor(?:s)?|problem(?:s)?|issue(?:s)?|challenge(?:s)?|difficulty|difficulties|catalyst(?:s)?|driver(?:s)?|root(?:s)?\s+in)\b/i;
    const solutionRegex = /\b(solution(?:s)?|measure(?:s)?|remedy|remedies|tackle|mitigate|address|resolve|government\s+should|step(?:s)?|policy|policies|implement(?:ed|ing)?|action(?:s)?)\b/i;

    const hasCause = causeRegex.test(bodyText);
    const hasSolution = solutionRegex.test(bodyText);

    if (!hasCause || !hasSolution) {
      const missingPart = !hasCause ? 'Phần 1: Nguyên nhân / Vấn đề (Causes / Problems)' : 'Phần 2: Giải pháp / Biện pháp (Solutions / Measures)';
      return {
        type: 'PROBLEM_SOLUTION',
        isBalanced: false,
        severity: 'fatal',
        taskDescription: '1. Nguyên nhân & 2. Giải pháp',
        missingPartDescription: missingPart,
        warning: `LỖI BỎ SÓT YÊU CẦU ĐỀ BÀI: Bài viết thiếu hẳn ${missingPart}. Đề bài dạng Problem & Solution đòi hỏi sự cân bằng tuyệt đối giữa 2 phần trong thân bài. Điểm Task Response bị giới hạn tối đa Band 5.0.`
      };
    }

    return {
      type: 'PROBLEM_SOLUTION',
      isBalanced: true,
      severity: 'none',
      taskDescription: 'Nguyên nhân & Giải pháp',
      warning: null
    };
  }

  // -------------------------------------------------------------
  // 4. DISCUSS BOTH VIEWS (& GIVE YOUR OPINION)
  // e.g. "Discuss both views and give your opinion."
  // -------------------------------------------------------------
  const isDiscussBoth = /discuss\s+both\s+(?:views|sides)|both\s+views/i.test(promptLower);

  if (isDiscussBoth) {
    const viewARegex = /\b(on the one hand|some people (?:argue|believe|contend|assert|maintain)|proponents|first view|supporters|one perspective|one school of thought)\b/i;
    const viewBRegex = /\b(on the other hand|other people (?:argue|believe|contend|assert|maintain)|opponents|conversely|in contrast|second view|alternative perspective|other side|detractors|others argue|others believe)\b/i;

    const hasViewA = viewARegex.test(bodyText);
    const hasViewB = viewBRegex.test(bodyText);

    if (!hasViewA || !hasViewB) {
      const missingPart = !hasViewA ? 'Quan điểm thứ nhất (View 1)' : 'Quan điểm thứ hai (View 2)';
      return {
        type: 'DISCUSS_BOTH',
        isBalanced: false,
        severity: 'fatal',
        taskDescription: 'Bàn luận cả 2 quan điểm (Discuss Both Views)',
        missingPartDescription: missingPart,
        warning: 'LỖI BỎ SÓT QUAN ĐIỂM: Đề bài yêu cầu bàn luận cả 2 quan điểm (Discuss both views), nhưng thân bài chỉ tập trung vào 1 phía. Barem Cambridge quy định bài không bàn luận đủ 2 góc nhìn bị khống chế Task Response tối đa Band 5.0.'
      };
    }

    return {
      type: 'DISCUSS_BOTH',
      isBalanced: true,
      severity: 'none',
      taskDescription: 'Bàn luận 2 quan điểm cân đối',
      warning: null
    };
  }

  // -------------------------------------------------------------
  // 5. ADVANTAGES OUTWEIGH DISADVANTAGES
  // e.g. "Do the advantages outweigh the disadvantages?"
  // -------------------------------------------------------------
  const isAdvDisadv = /(?:advantages?\s+(?:and|or|outweigh)\s+disadvantages?|pros?\s+(?:and|&)\s+cons?|benefits?\s+outweigh)/i.test(promptLower);

  if (isAdvDisadv) {
    const advRegex = /\b(advantage(?:s|ous)?|benefit(?:s|ial)?|merit(?:s)?|positive\s+aspect(?:s)?|upside(?:s)?|pros|favor(?:able)?)\b/i;
    const disadvRegex = /\b(disadvantage(?:s|ous)?|drawback(?:s)?|demerit(?:s)?|negative\s+aspect(?:s)?|downside(?:s)?|cons|shortcoming(?:s)?|pitfall(?:s)?)\b/i;

    const hasAdv = advRegex.test(bodyText);
    const hasDisadv = disadvRegex.test(bodyText);

    if (!hasAdv || !hasDisadv) {
      const missingPart = !hasAdv ? 'Mặt thuận lợi / Lợi ích (Advantages / Benefits)' : 'Mặt bất lợi / Tác hại (Disadvantages / Drawbacks)';
      return {
        type: 'ADVANTAGES_OUTWEIGH',
        isBalanced: false,
        severity: 'fatal',
        taskDescription: 'Phân tích cả Mặt Lợi và Mặt Hại',
        missingPartDescription: missingPart,
        warning: `LỖI BỎ SÓT YÊU CẦU ĐỀ BÀI: Dạng đề so sánh Lợi và Hại yêu cầu phân tích cả 2 mặt trước khi kết luận bên nào vượt trội hơn, nhưng bài viết hoàn toàn thiếu ${missingPart}. Điểm Task Response bị khống chế tối đa Band 5.0.`
      };
    }

    return {
      type: 'ADVANTAGES_OUTWEIGH',
      isBalanced: true,
      severity: 'none',
      taskDescription: 'Phân tích hai mặt Lợi và Hại',
      warning: null
    };
  }

  // -------------------------------------------------------------
  // 6. GENERIC DOUBLE DIRECT QUESTIONS (Any prompt with 2 question marks '?')
  // -------------------------------------------------------------
  const questionMarksCount = (prompt.match(/\?/g) || []).length;
  if (questionMarksCount >= 2) {
    if (bodyParas.length < 2) {
      return {
        type: 'DOUBLE_DIRECT_QUESTIONS',
        isBalanced: false,
        severity: 'warning',
        taskDescription: 'Trả lời 2 câu hỏi trực tiếp của đề bài',
        missingPartDescription: 'Chưa tách thành 2 đoạn thân bài độc lập',
        warning: 'Đề bài gồm 2 câu hỏi riêng biệt. Bạn cần dành riêng ít nhất 1 đoạn thân bài cho mỗi câu hỏi để đảm bảo bài viết phát triển cân đối (Band 7.0+ TR).'
      };
    }

    return {
      type: 'DOUBLE_DIRECT_QUESTIONS',
      isBalanced: true,
      severity: 'none',
      taskDescription: 'Trả lời 2 câu hỏi trực tiếp trong 2 đoạn thân bài',
      warning: null
    };
  }

  return { type: 'OPINION', isBalanced: true, severity: 'none', warning: null, taskDescription: 'Nêu quan điểm cá nhân' };
}
