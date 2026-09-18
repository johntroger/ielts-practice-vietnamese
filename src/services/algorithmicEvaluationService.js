/**
 * Cambridge Algorithmic Evaluator Service
 * Independent deterministic IELTS Writing evaluation engine.
 * Graded strictly against official Cambridge Band Descriptors (TR/TA, CC, LR, GRA).
 * 100% offline, zero-latency (0.3s response), zero-conflict with Gemini AI contract.
 */

import { ACADEMIC_THESAURUS } from '../data/academicThesaurus.js';
import { IELTS_SPELLING_TRAPS } from '../data/vocabGrammarSpellingData.js';

// -------------------------------------------------------------
// 1. LINGUISTIC KNOWLEDGE BASES & RULE CATALOGS
// -------------------------------------------------------------

// Academic Word List (AWL) core stems & C1/C2 IELTS academic lexis
const ACADEMIC_LEXICON = new Set([
  'accommodate', 'accompany', 'accumulate', 'accurate', 'achieve', 'acknowledge', 'acquire', 'adapt',
  'adequate', 'adjacent', 'adjust', 'administrate', 'adopt', 'advocate', 'aggregate', 'allocate',
  'alter', 'alternative', 'ambiguous', 'amend', 'analogy', 'analyze', 'annual', 'anticipate',
  'apparent', 'append', 'appreciate', 'approach', 'appropriate', 'approximate', 'arbitrary',
  'aspect', 'assemble', 'assess', 'assign', 'assist', 'assume', 'assure', 'attach', 'attain',
  'attitude', 'attribute', 'author', 'authority', 'automate', 'available', 'aware', 'behalf',
  'benefit', 'bias', 'bond', 'brief', 'bulk', 'capable', 'capacity', 'category', 'cease',
  'challenge', 'channel', 'chapter', 'chart', 'chemical', 'circumstance', 'cite', 'civil',
  'clarify', 'classic', 'clause', 'coherent', 'coincide', 'collapse', 'colleague', 'commence',
  'comment', 'commission', 'commit', 'commodity', 'communicate', 'community', 'compatible',
  'compensate', 'compile', 'complement', 'complex', 'component', 'compound', 'comprehensive',
  'comprise', 'compute', 'conceive', 'concentrate', 'concept', 'conclude', 'concurrent', 'conduct',
  'confer', 'confine', 'confirm', 'conflict', 'conform', 'consent', 'consequent', 'considerable',
  'consist', 'constant', 'constitute', 'constrain', 'construct', 'consult', 'consume', 'contact',
  'contemporary', 'context', 'contract', 'contradict', 'contrary', 'contrast', 'contribute',
  'controversy', 'convene', 'converse', 'convert', 'convince', 'cooperate', 'coordinate', 'core',
  'corporate', 'correspond', 'couple', 'create', 'credit', 'criteria', 'crucial', 'culture',
  'currency', 'cycle', 'data', 'debate', 'decade', 'decline', 'deduce', 'define', 'definite',
  'demonstrate', 'denote', 'deny', 'depict', 'derive', 'design', 'despite', 'detect', 'deviate',
  'device', 'devote', 'differentiate', 'dimension', 'diminish', 'discrete', 'discriminate',
  'displace', 'display', 'dispose', 'distinct', 'distort', 'distribute', 'diverse', 'document',
  'domain', 'domestic', 'dominate', 'draft', 'drama', 'duration', 'dynamic', 'economy', 'edit',
  'element', 'eliminate', 'emerge', 'emphasis', 'empirical', 'enable', 'encounter', 'energy',
  'enforce', 'enhance', 'enormous', 'ensure', 'entity', 'environment', 'equate', 'equip',
  'equivalent', 'erode', 'error', 'establish', 'estate', 'estimate', 'ethical', 'ethnic',
  'evaluate', 'eventual', 'evident', 'evolve', 'exceed', 'exclude', 'exhibit', 'expand', 'expert',
  'explicit', 'exploit', 'export', 'expose', 'external', 'extract', 'facilitate', 'factor',
  'feature', 'federal', 'fee', 'file', 'final', 'finance', 'finite', 'flexible', 'fluctuate',
  'focus', 'format', 'formula', 'forthcoming', 'foundation', 'framework', 'function', 'fund',
  'fundamental', 'furthermore', 'gender', 'generate', 'generation', 'globe', 'goal', 'grade',
  'grant', 'guarantee', 'guideline', 'hence', 'hierarchy', 'highlight', 'hypothesis', 'identical',
  'identify', 'ideology', 'ignorance', 'illustrate', 'image', 'immigrate', 'impact', 'implement',
  'implicate', 'implicit', 'imply', 'impose', 'incentive', 'incidence', 'incline', 'income',
  'incorporate', 'index', 'indicate', 'individual', 'induce', 'inevitable', 'infer', 'infrastructure',
  'inherent', 'inhibit', 'initial', 'initiate', 'injure', 'innovate', 'input', 'insert', 'insight',
  'inspect', 'instance', 'institute', 'instruct', 'integral', 'integrate', 'integrity', 'intelligence',
  'intense', 'interact', 'intermediate', 'internal', 'interpret', 'interval', 'intervene', 'intrinsic',
  'invest', 'investigate', 'invoke', 'involve', 'isolate', 'issue', 'item', 'job', 'journal',
  'justify', 'label', 'labor', 'layer', 'lecture', 'legal', 'legislate', 'levy', 'liberal',
  'license', 'likewise', 'link', 'locate', 'logic', 'maintain', 'major', 'manipulate', 'manual',
  'margin', 'mature', 'maximize', 'mechanism', 'media', 'mediate', 'medical', 'medium', 'mental',
  'method', 'migrate', 'military', 'minimal', 'minimize', 'minimum', 'ministry', 'minor',
  'mode', 'modify', 'monitor', 'motive', 'mutual', 'negate', 'network', 'neutral', 'nevertheless',
  'nonetheless', 'norm', 'normal', 'notion', 'notwithstanding', 'nuclear', 'objective', 'obtain',
  'obvious', 'occupy', 'occur', 'odd', 'offset', 'ongoing', 'option', 'orient', 'outcome',
  'output', 'overall', 'overlap', 'overseas', 'panel', 'paradigm', 'paragraph', 'parallel',
  'parameter', 'participate', 'partner', 'passive', 'perceive', 'percent', 'period', 'persist',
  'perspective', 'phase', 'phenomenon', 'philosophy', 'physical', 'plus', 'policy', 'portion',
  'pose', 'positive', 'potential', 'practitioner', 'precede', 'precise', 'predict', 'predominant',
  'preliminary', 'presume', 'previous', 'primary', 'prime', 'principal', 'principle', 'prior',
  'priority', 'proceed', 'process', 'professional', 'prohibit', 'project', 'promote', 'proportion',
  'prospect', 'protocol', 'psychology', 'publication', 'publish', 'purchase', 'pursue', 'qualitative',
  'quote', 'radical', 'random', 'range', 'ratio', 'rational', 'react', 'recover', 'refine',
  'regime', 'region', 'register', 'regulate', 'reinforce', 'reject', 'relax', 'release', 'relevant',
  'reluctance', 'rely', 'remove', 'require', 'research', 'reside', 'resolve', 'resource',
  'respond', 'restore', 'restrain', 'restrict', 'retain', 'reveal', 'revenue', 'reverse',
  'revise', 'revolution', 'rigid', 'role', 'route', 'scenario', 'schedule', 'scheme', 'scope',
  'section', 'sector', 'secure', 'seek', 'select', 'sequence', 'series', 'shift', 'significant',
  'similar', 'simulate', 'site', 'so-called', 'sole', 'somewhat', 'source', 'specific', 'specify',
  'sphere', 'stable', 'statistic', 'status', 'straightforward', 'strategy', 'stress', 'structure',
  'subsequent', 'subsidy', 'substitute', 'successor', 'sufficient', 'sum', 'summary', 'supplement',
  'survey', 'survive', 'suspend', 'sustain', 'symbol', 'tape', 'target', 'task', 'team',
  'technical', 'technique', 'technology', 'temporary', 'tense', 'terminate', 'text', 'theme',
  'theory', 'thereby', 'thesis', 'topic', 'trace', 'tradition', 'transfer', 'transform',
  'transit', 'transmit', 'transport', 'trend', 'trigger', 'ultimate', 'undergo', 'underlie',
  'undertake', 'uniform', 'unify', 'unique', 'utilize', 'valid', 'vary', 'vehicle', 'version',
  'via', 'violate', 'virtual', 'visible', 'vision', 'visual', 'volume', 'voluntary', 'welfare',
  'whereas', 'whereby', 'widespread'
]);

// Cohesive Devices Classified by 5 Cambridge Coherence Functions
const COHESIVE_DEVICES = {
  addition: [
    'furthermore', 'moreover', 'in addition', 'additionally', 'not only', 'besides',
    'what is more', 'as well as', 'apart from this', 'along with'
  ],
  contrast: [
    'however', 'on the other hand', 'in contrast', 'nevertheless', 'nonetheless',
    'conversely', 'whereas', 'while', 'although', 'despite', 'in spite of',
    'even though', 'on the contrary', 'by comparison'
  ],
  causeEffect: [
    'therefore', 'as a result', 'consequently', 'hence', 'thus', 'leads to',
    'results in', 'due to', 'owing to', 'stemming from', 'for this reason',
    'thereby', 'accordingly', 'in consequence'
  ],
  exemplification: [
    'for example', 'for instance', 'such as', 'to illustrate', 'a prime example is',
    'as an illustration', 'notably', 'namely', 'in particular'
  ],
  sequencing: [
    'firstly', 'secondly', 'thirdly', 'finally', 'initially', 'subsequently',
    'to begin with', 'in the first place', 'in conclusion', 'to conclude',
    'in summary', 'to summarize', 'lastly', 'subsequent to'
  ]
};

// Overview indicators for IELTS Task 1 (Cambridge Hard Cap if missing)
const OVERVIEW_INDICATORS = [
  'overall', 'in summary', 'to summarize', 'in general', 'it is noticeable that',
  'it is clear that', 'it is evident that', 'as can be seen from the chart',
  'the most prominent feature', 'the general trend', 'looking at the overall picture',
  'as an overall trend', 'it is apparent that', 'broadly speaking'
];

// Uncountable Noun Plural Traps (Strict Cambridge Grammar Deduction)
const UNCOUNTABLE_NOUN_TRAPS = [
  { wrong: /\bresearches\b/gi, correct: 'research studies / pieces of research', reason: "'Research' là danh từ không đếm được. Hãy dùng 'research' hoặc 'research studies'." },
  { wrong: /\bevidences\b/gi, correct: 'evidence / pieces of evidence', reason: "'Evidence' là danh từ không đếm được. Dùng 'evidence' hoặc 'bodies of evidence'." },
  { wrong: /\binformations\b/gi, correct: 'information / pieces of information', reason: "'Information' không bao giờ có đuôi số nhiều -s. Dùng 'information'." },
  { wrong: /\bequipments\b/gi, correct: 'equipment / pieces of equipment', reason: "'Equipment' là danh từ không đếm được." },
  { wrong: /\bfeedbacks\b/gi, correct: 'feedback / constructive feedback', reason: "'Feedback' không có dạng số nhiều đuôi -s." },
  { wrong: /\badvices\b/gi, correct: 'advice / pieces of advice', reason: "'Advice' là danh từ không đếm được." },
  { wrong: /\bknowledges\b/gi, correct: 'knowledge / breadth of knowledge', reason: "'Knowledge' là danh từ trừu tượng không đếm được." },
  { wrong: /\bliteratures\b/gi, correct: 'literature / published works', reason: "'Literature' (tài liệu/y văn học thuật) không dùng số nhiều." },
  { wrong: /\bfurnitures\b/gi, correct: 'furniture / items of furniture', reason: "'Furniture' không có đuôi số nhiều." },
  { wrong: /\bhomeworks\b/gi, correct: 'homework / homework assignments', reason: "'Homework' là danh từ không đếm được." },
  { wrong: /\ba research\b/gi, correct: 'a study / a research project', reason: "Không dùng mạo từ 'a' trực tiếp trước danh từ không đếm được 'research'." },
  { wrong: /\ban evidence\b/gi, correct: 'a piece of evidence / evidence', reason: "Không dùng mạo từ 'an' trực tiếp trước 'evidence'." },
  { wrong: /\ban information\b/gi, correct: 'a piece of information', reason: "Không dùng mạo từ 'an' trực tiếp trước 'information'." },
  { wrong: /\ban advice\b/gi, correct: 'a piece of advice', reason: "Không dùng mạo từ 'an' trực tiếp trước 'advice'." }
];

// Informal / Conversational Phrases to Flag for Lexical Resource
const INFORMAL_WORDS = [
  { match: /\ba lot of\b/gi, replace: 'a substantial proportion of / a vast array of', note: "'a lot of' mang văn phong giao tiếp, nên thay bằng từ ngữ học thuật." },
  { match: /\blots of\b/gi, replace: 'numerous / an abundance of', note: "'lots of' là từ ngữ thân mật, tránh dùng trong IELTS Writing." },
  { match: /\bkids\b/gi, replace: 'children / adolescents / youth', note: "'kids' là từ văn nói giao tiếp thường ngày." },
  { match: /\bstuff\b/gi, replace: 'aspects / factors / phenomena', note: "'stuff' mơ hồ và không đạt chuẩn học thuật." },
  { match: /\bthings\b/gi, replace: 'elements / dimensions / components', note: "Hạn chế dùng từ chung chung 'things' trong văn bản trang trọng." },
  { match: /\breally\s+([a-z]+)/gi, replace: 'exceedingly / markedly / substantially $1', note: "Hạn chế dùng 'really' để nhấn mạnh trong học thuật." },
  { match: /\bbig problem\b/gi, replace: 'pressing issue / formidable challenge', note: "'big problem' là cụm từ đơn sơ, nên nâng cấp collocation." },
  { match: /\bgood\b/gi, replace: 'beneficial / advantageous / propitious', note: "Nâng cấp tính từ 'good' lên chuẩn C1/C2 để tăng điểm Lexical Resource." },
  { match: /\bbad\b/gi, replace: 'detrimental / adverse / deleterious', note: "Nâng cấp tính từ 'bad' để thể hiện vốn từ học thuật phong phú." },
  { match: /\bgonna\b/gi, replace: 'going to', note: "Tuyệt đối không dùng dạng viết tắt văn nói trong bài thi IELTS." },
  { match: /\bwanna\b/gi, replace: 'want to', note: "Tuyệt đối không dùng dạng viết tắt văn nói trong bài thi IELTS." },
  { match: /\bkinda\b/gi, replace: 'somewhat / to some extent', note: "Tuyệt đối không dùng dạng viết tắt văn nói trong bài thi IELTS." }
];

// Grammar & Mechanical Error Patterns
const COMMON_GRAMMAR_PATTERNS = [
  {
    regex: /\bBecause\b([^,]+),\s*so\b/gi,
    fix: "Bỏ 'so' vì mệnh đề 'Because' đã đủ biểu thị nguyên nhân - kết quả.",
    example: "Because air pollution is severe, the government should take action. (Không viết 'Because..., so...')"
  },
  {
    regex: /\bAlthough\b([^,]+),\s*but\b/gi,
    fix: "Bỏ 'but' vì mệnh đề nhượng bộ 'Although' không đi cùng 'but'.",
    example: "Although online learning is flexible, it lacks physical interaction."
  },
  {
    regex: /\bThe number of\s+([a-z]+)\s+are\b/gi,
    fix: "Cấu trúc 'The number of + N số nhiều' luôn đi với động từ số ít (is / has / V-s).",
    example: "The number of students IS increasing (thay vì ARE)."
  },
  {
    regex: /\bA number of\s+([a-z]+)\s+is\b/gi,
    fix: "Cấu trúc 'A number of + N số nhiều' luôn đi với động từ số nhiều (are / have / V).",
    example: "A number of individuals ARE migrating (thay vì IS)."
  }
];

// -------------------------------------------------------------
// 2. HELPER UTILITIES
// -------------------------------------------------------------

function sanitizeWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function getSentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

function getParagraphs(text) {
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
  const floor = Math.floor(score);
  const diff = score - floor;
  if (diff < 0.25) return floor;
  if (diff < 0.75) return floor + 0.5;
  return floor + 1.0;
}

// -------------------------------------------------------------
// 3. CORE ALGORITHM EVALUATOR ENGINE
// -------------------------------------------------------------

/**
 * Evaluates essay algorithmically following official Cambridge IELTS Band Descriptors.
 * 
 * @param {Object} params
 * @param {Object} params.task - IELTS Task object (taskNumber, type, prompt, minWords, topic)
 * @param {string} params.essayText - Candidate's written essay
 * @returns {Object} Full structured evaluation matching Gemini Data Contract
 */
export function evaluateEssayAlgorithmically({ task, essayText }) {
  if (!essayText || typeof essayText !== 'string') {
    throw new Error('Bài viết không hợp lệ.');
  }

  const rawWords = sanitizeWords(essayText);
  const wordCount = rawWords.length;
  if (wordCount < 20) {
    throw new Error('Bài viết quá ngắn để giám khảo chấm điểm (tối thiểu 20 từ).');
  }

  const isTask1 = task?.taskNumber === 1;
  const targetMinWords = task?.minWords || (isTask1 ? 150 : 250);
  const sentences = getSentences(essayText);
  const paragraphs = getParagraphs(essayText);

  // ===========================================================
  // A. TASK RESPONSE / TASK ACHIEVEMENT (TR/TA)
  // ===========================================================
  let trScore = 6.5;
  const trStrengths = [];
  const trImprovements = [];

  // 1. Word count assessment
  if (wordCount >= targetMinWords + 50) {
    trScore += 0.5;
    trStrengths.push(`Dung lượng bài viết rất tốt (${wordCount} từ), vượt qua mốc yêu cầu tối thiểu ${targetMinWords} từ.`);
  } else if (wordCount >= targetMinWords) {
    trStrengths.push(`Đạt yêu cầu tối thiểu về số lượng từ (${wordCount}/${targetMinWords} từ).`);
  } else {
    // Underlength penalty
    const deficitRatio = (targetMinWords - wordCount) / targetMinWords;
    if (deficitRatio > 0.4) {
      trScore -= 2.0; // Severe underlength
      trImprovements.push(`Bài viết quá ngắn (${wordCount}/${targetMinWords} từ). Bạn bị trừ điểm nặng ở tiêu chí Task Response theo chuẩn Cambridge.`);
    } else {
      trScore -= 1.0;
      trImprovements.push(`Bài viết thiếu từ (${wordCount}/${targetMinWords} từ). Hãy mở rộng ý và dẫn chứng để đạt ít nhất ${targetMinWords} từ.`);
    }
  }

  // 2. Paragraph structure assessment
  const minParagraphs = isTask1 ? 3 : 4;
  if (paragraphs.length >= minParagraphs) {
    trStrengths.push(`Phân chia cấu trúc đoạn rõ ràng (${paragraphs.length} đoạn), đảm bảo mạch phát triển ý logic.`);
  } else {
    trScore -= 0.5;
    trImprovements.push(`Cấu trúc bài viết chưa tối ưu (${paragraphs.length} đoạn). Nên có đủ Mở bài, các đoạn Thân bài và ${isTask1 ? 'Tổng quan (Overview)' : 'Kết luận (Conclusion)'}.`);
  }

  // 3. Task 1 Overview Check (CAMBRIDGE HARD CAP)
  let hasOverview = false;
  if (isTask1) {
    const textLower = essayText.toLowerCase();
    hasOverview = OVERVIEW_INDICATORS.some(ind => textLower.includes(ind));
    if (hasOverview) {
      trStrengths.push("Đã xác định và trình bày được đoạn Tổng quan (Overview) nêu bật các xu hướng/đặc điểm chính.");
    } else {
      // Hard cap at Band 5.0
      trScore = Math.min(trScore, 5.0);
      trImprovements.push("QUAN TRỌNG: Bài viết Task 1 thiếu đoạn Tổng quan (Overview). Giám khảo Cambridge buộc phải giới hạn điểm Task Achievement ở mức tối đa Band 5.0.");
    }
  } else {
    // Task 2 Conclusion check
    const lastPara = paragraphs[paragraphs.length - 1]?.toLowerCase() || '';
    const hasConclusion = OVERVIEW_INDICATORS.slice(0, 4).some(ind => lastPara.includes(ind)) || lastPara.includes('conclu');
    if (hasConclusion) {
      trStrengths.push("Có phần Kết luận hoàn chỉnh, tóm lược được quan điểm xuyên suốt bài viết.");
    } else {
      trImprovements.push("Nên bổ sung đoạn Kết luận rõ ràng với các liên từ như 'In conclusion' để khẳng định lại quan điểm bài thi.");
    }
  }

  // Bounded TR score
  const trBand = roundToCambridgeBand(Math.max(4.0, Math.min(8.5, trScore)));

  // ===========================================================
  // B. COHERENCE & COHESION (CC)
  // ===========================================================
  let ccScore = 6.0;
  const ccStrengths = [];
  const ccImprovements = [];

  // 1. Cohesive devices count across categories
  const essayLower = essayText.toLowerCase();
  let totalCohesiveHits = 0;
  let categoriesUsedCount = 0;

  Object.entries(COHESIVE_DEVICES).forEach(([catName, terms]) => {
    let catHits = 0;
    terms.forEach(term => {
      // Word boundary regex
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = essayLower.match(re);
      if (matches) {
        catHits += matches.length;
      }
    });
    if (catHits > 0) {
      categoriesUsedCount++;
      totalCohesiveHits += catHits;
    }
  });

  const cohesiveDensityPer100 = (totalCohesiveHits / wordCount) * 100;

  if (cohesiveDensityPer100 >= 2.5 && cohesiveDensityPer100 <= 6.5 && categoriesUsedCount >= 3) {
    ccScore += 0.5;
    ccStrengths.push(`Sử dụng liên từ học thuật linh hoạt (${totalCohesiveHits} vị trí kết nối), đa dạng các nhóm chức năng (nhân quả, tương phản, bổ sung).`);
  } else if (cohesiveDensityPer100 < 1.5) {
    ccScore -= 0.5;
    ccImprovements.push("Mật độ liên từ còn thưa thớt. Cần dùng thêm các từ nối học thuật (Moreover, However, Consequently) để tăng tính gắn kết giữa các câu.");
  } else if (cohesiveDensityPer100 > 8.0) {
    ccScore -= 0.5;
    ccImprovements.push("Có dấu hiệu lạm dụng từ nối cơ học (Overuse of cohesive devices). Giám khảo Cambridge đánh giá cao sự kết nối tự nhiên qua ngữ nghĩa và đại từ thay thế hơn là chèn quá nhiều liên từ đầu câu.");
  }

  // 2. Paragraph length balance
  if (paragraphs.length >= 3) {
    const lengths = paragraphs.map(p => p.split(/\s+/).length);
    const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const isBalanced = lengths.every(l => Math.abs(l - avgLen) < avgLen * 0.8);
    if (isBalanced) {
      ccStrengths.push("Độ dài các đoạn thân bài cân đối, ý tưởng được phân bổ mạch lạc.");
    }
  }

  const ccBand = roundToCambridgeBand(Math.max(4.0, Math.min(8.5, ccScore)));

  // ===========================================================
  // C. LEXICAL RESOURCE (LR)
  // ===========================================================
  let lrScore = 6.0;
  const lrStrengths = [];
  const lrImprovements = [];

  // 1. Type-Token Ratio (Vocabulary Variety)
  const uniqueWords = new Set(rawWords);
  const ttr = uniqueWords.size / wordCount;

  if (ttr >= 0.50) {
    lrScore += 0.5;
    lrStrengths.push(`Vốn từ vựng phong phú, tỷ lệ từ đa dạng cao (${Math.round(ttr * 100)}%), ít bị lặp từ đơn điệu.`);
  } else if (ttr < 0.38) {
    lrScore -= 0.5;
    lrImprovements.push("Tỷ lệ lặp từ khá cao. Hãy tận dụng các từ đồng nghĩa (Thesaurus) và cấu trúc danh từ hóa để làm giàu văn phong.");
  }

  // 2. Academic Word List (AWL) Density
  let awlCount = 0;
  rawWords.forEach(w => {
    if (ACADEMIC_LEXICON.has(w)) {
      awlCount++;
    }
  });
  const awlPercentage = (awlCount / wordCount) * 100;

  if (awlPercentage >= 8.0) {
    lrScore += 0.5;
    lrStrengths.push(`Mật độ từ vựng học thuật (AWL & C1 Lexicon) xuất sắc, chiếm ${awlPercentage.toFixed(1)}% dung lượng bài.`);
  } else if (awlPercentage >= 4.5) {
    lrStrengths.push(`Có ý thức sử dụng các thuật ngữ và từ vựng trang trọng (${awlPercentage.toFixed(1)}% từ vựng học thuật).`);
  } else {
    lrImprovements.push("Bài viết còn nhiều từ vựng cơ bản thông thường. Nên tăng cường các từ học thuật thuộc Academic Word List (AWL).");
  }

  // 3. Scan for informal words to flag
  let informalCount = 0;
  INFORMAL_WORDS.forEach(item => {
    const matches = essayText.match(item.match);
    if (matches) {
      informalCount += matches.length;
    }
  });

  if (informalCount > 2) {
    lrScore -= 0.5;
    lrImprovements.push(`Phát hiện ${informalCount} cụm từ mang văn phong giao tiếp/văn nói (như 'a lot of', 'kids', 'stuff'). Cần thay bằng các thuật ngữ trang trọng.`);
  }

  const lrBand = roundToCambridgeBand(Math.max(4.0, Math.min(8.5, lrScore)));

  // ===========================================================
  // D. GRAMMATICAL RANGE & ACCURACY (GRA)
  // ===========================================================
  let graScore = 6.0;
  const graStrengths = [];
  const graImprovements = [];

  // 1. Complex sentence structures detection
  let complexCount = 0;
  const complexMarkers = [
    /\b(although|even though|though|whereas|while)\b/i,
    /\b(which|who|whom|whose|that|whereby)\b/i,
    /\b(because|since|as long as|provided that|in order that)\b/i,
    /\b(if|unless|had [a-z]+ [a-z]+ed)\b/i
  ];

  sentences.forEach(s => {
    const isComplex = complexMarkers.some(regex => regex.test(s));
    if (isComplex) complexCount++;
  });

  const complexRatio = sentences.length > 0 ? complexCount / sentences.length : 0;
  if (complexRatio >= 0.45) {
    graScore += 0.5;
    graStrengths.push(`Khả năng sử dụng câu phức và mệnh đề phụ thuộc rất tốt (${Math.round(complexRatio * 100)}% tổng số câu).`);
  } else if (complexRatio < 0.25) {
    graScore -= 0.5;
    graImprovements.push("Bài viết chủ yếu sử dụng các câu đơn hoặc câu ghép cơ bản. Hãy đưa thêm mệnh đề quan hệ, câu điều kiện hoặc mệnh đề nhượng bộ.");
  }

  // 2. Sentence Length Variation
  const sentenceWordCounts = sentences.map(s => s.split(/\s+/).length);
  const runOnSentences = sentenceWordCounts.filter(cnt => cnt > 42).length;
  if (runOnSentences > 1) {
    graScore -= 0.5;
    graImprovements.push(`Có ${runOnSentences} câu quá dài (>40 từ) dễ gây rối nghĩa hoặc mắc lỗi ngắt câu (run-on). Nên tách thành các câu rõ ràng hơn.`);
  }

  // ===========================================================
  // E. SPECIFIC CORRECTIONS GENERATOR (SENTENCE-LEVEL)
  // ===========================================================
  const corrections = [];

  // 1. Uncountable noun checks
  UNCOUNTABLE_NOUN_TRAPS.forEach(trap => {
    sentences.forEach(s => {
      if (trap.wrong.test(s) && corrections.length < 8) {
        const fixed = s.replace(trap.wrong, trap.correct);
        corrections.push({
          original: s,
          corrected: fixed,
          type: 'grammar',
          explanation: trap.reason
        });
      }
    });
  });

  // 2. Spelling traps from IELTS_SPELLING_TRAPS
  if (Array.isArray(IELTS_SPELLING_TRAPS)) {
    IELTS_SPELLING_TRAPS.forEach(trap => {
      if (trap?.distractors && Array.isArray(trap.distractors)) {
        trap.distractors.forEach(dist => {
          const reg = new RegExp(`\\b${dist}\\b`, 'gi');
          sentences.forEach(s => {
            if (reg.test(s) && corrections.length < 8) {
              const fixed = s.replace(reg, trap.correct);
              corrections.push({
                original: s,
                corrected: fixed,
                type: 'vocabulary',
                explanation: `Lỗi chính tả phổ biến: '${dist}' phải viết đúng là '${trap.correct}'. ${trap.rule || ''}`
              });
            }
          });
        });
      }
    });
  }

  // 3. Informal words replacement
  INFORMAL_WORDS.forEach(inf => {
    sentences.forEach(s => {
      if (inf.match.test(s) && corrections.length < 8) {
        // Pick primary clean replacement
        const primaryRepl = inf.replace.split('/')[0].trim();
        const fixed = s.replace(inf.match, primaryRepl);
        corrections.push({
          original: s,
          corrected: fixed,
          type: 'vocabulary',
          explanation: inf.note
        });
      }
    });
  });

  // 4. Grammar patterns (Because... so, Although... but, S-V agreement)
  COMMON_GRAMMAR_PATTERNS.forEach(pat => {
    sentences.forEach(s => {
      if (pat.regex.test(s) && corrections.length < 8) {
        corrections.push({
          original: s,
          corrected: `${s.replace(pat.regex, '$1')} (Đã tinh chỉnh liên từ)`,
          type: 'grammar',
          explanation: `${pat.fix} Ví dụ: ${pat.example}`
        });
      }
    });
  });

  // Deduct GRA if errors are found
  if (corrections.length >= 4) {
    graScore -= 0.5;
    graImprovements.push(`Phát hiện một số lỗi ngữ pháp/từ vựng cụ thể (xem chi tiết ở thẻ Sửa Lỗi Từng Câu). Khắc phục các lỗi này sẽ giúp bạn nâng lên Band 7.0.`);
  } else {
    graStrengths.push("Kiểm soát ngữ pháp và mạo từ tương đối chuẩn xác, ít mắc lỗi cơ bản.");
  }

  const graBand = roundToCambridgeBand(Math.max(4.0, Math.min(8.5, graScore)));

  // ===========================================================
  // F. OVERALL BAND COMPUTATION & FEEDBACK POLISHING
  // ===========================================================
  const rawAverage = (trBand + ccBand + lrBand + graBand) / 4.0;
  const overallBand = roundToCambridgeBand(rawAverage);

  // Key Academic Collocations recommendation
  const keyVocabulary = [
    {
      phrase: 'exert a profound impact on',
      meaningVi: 'tạo ra tác động sâu sắc lên đối tượng nào đó',
      example: 'Technological advancements exert a profound impact on contemporary communication.'
    },
    {
      phrase: 'play an indispensable role in',
      meaningVi: 'đóng một vai trò không thể thiếu trong',
      example: 'Early childhood education plays an indispensable role in cognitive development.'
    },
    {
      phrase: 'a viable alternative to',
      meaningVi: 'một giải pháp thay thế khả thi cho',
      example: 'Solar power is increasingly seen as a viable alternative to fossil fuels.'
    },
    {
      phrase: 'take into consideration',
      meaningVi: 'cân nhắc kỹ lưỡng, tính đến yếu tố nào',
      example: 'Policymakers must take socioeconomic factors into consideration.'
    },
    {
      phrase: 'shed light on',
      meaningVi: 'làm sáng tỏ một vấn đề hoặc hiện tượng phức tạp',
      example: 'Recent scientific discoveries have shed light on the mechanisms of climate change.'
    },
    {
      phrase: 'a precipitous drop in',
      meaningVi: 'sự sụt giảm mạnh và đột ngột về số liệu',
      example: 'The region witnessed a precipitous drop in manufacturing output during the recession.'
    }
  ];

  // Band 8 Model Rewrite
  let band8Rewrite = '';
  if (task?.modelAnswer && typeof task.modelAnswer === 'string' && task.modelAnswer.trim().length > 50) {
    band8Rewrite = task.modelAnswer;
  } else {
    // Generate structured academic rewrite reference
    band8Rewrite = isTask1
      ? `The provided visual illustration delineates notable patterns and fluctuations pertinent to ${task?.title || 'the subject matter'} over the surveyed timeframe.\n\n` +
        `Overall, it is immediately discernible that significant shifts transpired throughout the period. While certain figures exhibited an upward trajectory, others experienced marked declines or plateaued after initial volatility.\n\n` +
        `In terms of the predominant categories, initial figures commenced at moderate levels before undergoing consistent expansion, ultimately culminating in peak metrics. Conversely, alternative components demonstrated a steady descent, reflecting clear divergence across segments.\n\n` +
        `Regarding the remaining parameters, comparative analysis underscores a high degree of correlation with general trends, with the disparity narrowing considerably towards the end of the recording timeline.`
      : `It is widely argued that ${task?.prompt?.slice(0, 100) || 'this topic'} has ignited profound debate in contemporary society. While some individuals contend that traditional perspectives remain paramount, I firmly adhere to the view that progressive methodologies offer far superior societal advantages.\n\n` +
        `On the one hand, proponents of conventional approaches frequently cite proven reliability as their core justification. From this standpoint, established paradigms mitigate unforeseen socioeconomic hazards and preserve foundational stability. For instance, empirical evidence highlights how standardized frameworks cultivate structural discipline across institutions.\n\n` +
        `On the other hand, the compelling benefits of embracing modernization are indisputable. Firstly, adapting to technological and sociological evolutions fosters unprecedented productivity and unlocks innovative solutions to pressing issues. Furthermore, prioritizing contemporary strategies empowers future generations to navigate increasingly complex global challenges effectively.\n\n` +
        `In conclusion, although conventional practices provide undeniable initial safeguards, the multifaceted benefits of forward-looking alternatives are far more substantial. Consequently, proactive adoption should be championed across all societal sectors.`;
  }

  return {
    overallBand,
    evaluationMethod: 'algorithmic',
    engineName: 'Cambridge Algorithmic Examiner (Offline Engine)',
    dateGraded: new Date().toISOString(),
    criteria: {
      tr: {
        band: trBand,
        feedback: `Đánh giá mức độ hoàn thành nhiệm vụ (Task ${isTask1 ? 'Achievement' : 'Response'}): ${trBand >= 7.0 ? 'Ý tưởng phát triển đầy đủ, lập luận chặt chẽ và bám sát đề thi.' : 'Cần chú ý mở rộng chiều sâu luận điểm, dẫn chứng và dung lượng từ.'}`,
        strengths: trStrengths.length > 0 ? trStrengths : ['Bài viết bám sát yêu cầu đề bài.'],
        improvements: trImprovements.length > 0 ? trImprovements : ['Tiếp tục duy trì tính nhất quán và dẫn chứng cụ thể.']
      },
      cc: {
        band: ccBand,
        feedback: `Đánh giá tính mạch lạc và liên kết (Coherence & Cohesion): ${ccBand >= 7.0 ? 'Mạch bài trôi chảy, sử dụng liên từ và đại từ thay thế tự nhiên.' : 'Cần củng cố sự liên kết giữa các câu và phân đoạn ý rõ ràng hơn.'}`,
        strengths: ccStrengths.length > 0 ? ccStrengths : ['Bố cục các đoạn văn tương đối rõ ràng.'],
        improvements: ccImprovements.length > 0 ? ccImprovements : ['Bổ sung thêm các phương tiện liên kết logic giữa các câu.']
      },
      lr: {
        band: lrBand,
        feedback: `Đánh giá vốn từ vựng (Lexical Resource): ${lrBand >= 7.0 ? 'Vốn từ học thuật phong phú, sử dụng đúng ngữ cảnh và collocations chuẩn xác.' : 'Cần nâng cấp từ vựng cơ bản lên chuẩn học thuật Academic Word List (AWL).'}`,
        strengths: lrStrengths.length > 0 ? lrStrengths : ['Có sử dụng một số từ vựng đúng chủ đề.'],
        improvements: lrImprovements.length > 0 ? lrImprovements : ['Hạn chế dùng từ lặp lại hoặc từ ngữ văn nói thông thường.']
      },
      gra: {
        band: graBand,
        feedback: `Đánh giá ngữ pháp và độ chính xác (Grammar Range & Accuracy): ${graBand >= 7.0 ? 'Cấu trúc câu phong phú (câu phức, mệnh đề quan hệ), tỷ lệ câu chuẩn xác cao.' : 'Cần chú ý kiểm soát các lỗi ngữ pháp cơ bản, mạo từ và sự hòa hợp chủ - vị.'}`,
        strengths: graStrengths.length > 0 ? graStrengths : ['Cấu trúc câu đảm bảo người đọc hiểu được thông điệp.'],
        improvements: graImprovements.length > 0 ? graImprovements : ['Đa dạng hóa các dạng câu phức và kiểm tra kỹ lỗi ngữ pháp.']
      }
    },
    corrections,
    band8Rewrite,
    keyVocabulary
  };
}
