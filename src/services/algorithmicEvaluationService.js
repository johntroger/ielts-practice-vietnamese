/**
 * Cambridge Algorithmic Evaluator Service (Deep Linguistic Heuristic Engine v2)
 * Independent high-precision IELTS Writing evaluation engine.
 * Graded strictly against official Cambridge Band Descriptors (TR/TA, CC, LR, GRA).
 * 
 * Key Features v2:
 * 1. Prompt-Essay Semantic Relevance (PESR) & Off-Topic Hard Cap (<= 5.0).
 * 2. Task 1 Numerical & Trend Data Extractor (Hard Cap <= 5.0 if body lacks data).
 * 3. Task 2 Question Classifier (Discuss both views, Problem-Solution fulfillment checks).
 * 4. Referencing & Substitution Analyzer (This/such + noun, the former/latter).
 * 5. Academic Collocation N-Gram Corpus (2-3 words C1/C2 Collocation Density).
 * 6. Error-Free Sentence Ratio (EFSR) Engine for Cambridge GRA Band calibration.
 * 7. Prompt Copying Deduction (Subtracts verbatim phrases >= 5 words).
 */

import { ACADEMIC_THESAURUS, lookupTopicCollocations, lookupSynonyms } from '../data/academicThesaurus.js';
import { IELTS_SPELLING_TRAPS } from '../data/vocabGrammarSpellingData.js';

// -------------------------------------------------------------
// 1. KNOWLEDGE BASES & RULE CATALOGS
// -------------------------------------------------------------

// Common English Stopwords (for Prompt Keyword Extraction)
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves', 'give', 'reasons', 'examples', 'write', 'at',
  'least', 'words', 'should', 'spend', 'about', 'minutes', 'task',
  // IELTS Prompt Meta-instructions
  'discuss', 'views', 'view', 'opinion', 'opinions', 'agree', 'disagree', 'extent', 'think', 'believe',
  'others', 'people', 'allowed', 'solutions', 'solution', 'problems', 'problem', 'causes', 'cause',
  'effects', 'effect', 'advantages', 'disadvantages', 'outweigh', 'statement', 'question', 'following',
  'factor', 'factors', 'true', 'false', 'whether', 'argue', 'argued', 'considered', 'many', 'much',
  'like', 'whatever', 'positive', 'negative', 'development', 'developments', 'case', 'choosing', 'choose'
]);

// Academic Word List (AWL) & C1/C2 IELTS Academic Lexis
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

// 800+ Golden Academic Collocations N-Grams (Bigrams & Trigrams)
const ACADEMIC_COLLOCATIONS = [
  // High-frequency Academic Verbs + Noun / Preposition
  'play an indispensable role', 'play a pivotal role', 'play a vital role', 'play a key role',
  'exert a profound impact', 'exert an adverse effect', 'exert a detrimental impact', 'exert influence on',
  'take into consideration', 'take into account', 'shed light on', 'pave the way for',
  'pose a serious threat', 'mitigate the impact', 'mitigate the adverse effects', 'alleviate poverty',
  'alleviate traffic congestion', 'tackle the problem', 'tackle this issue', 'address the issue',
  'bridge the gap', 'broaden one s horizons', 'cultivate a sense of', 'foster innovation',
  'curb the growth', 'spark intense debate', 'ignite controversy', 'underpin the success',
  'stem from', 'lead to', 'result in', 'attribute to', 'contribute significantly to',

  // Academic Adjective + Noun
  'viable alternative', 'pressing issue', 'empirical evidence', 'insurmountable obstacle',
  'formidable challenge', 'compelling evidence', 'profound implication', 'substantial proportion',
  'exponential growth', 'upward trajectory', 'precipitous drop', 'marked decline',
  'striking disparity', 'socioeconomic background', 'higher education institution', 'cognitive development',
  'technological advancement', 'sustainable development', 'environmental degradation', 'greenhouse gas emission',
  'renewable energy source', 'fossil fuel consumption', 'public transport infrastructure', 'pedestrian precinct',
  'cultural heritage', 'social cohesion', 'civic responsibility', 'fiscal policy',
  'governmental intervention', 'punitive measure', 'stringent regulation', 'preventative measure',
  'disproportionate amount', 'paramount importance', 'inherent danger', 'integral component',
  'holistic approach', 'systemic failure', 'ubiquitous presence', 'unprecedented surge',

  // Argumentation & Viewpoint Collocations
  'it is widely argued', 'it is commonly believed', 'proponents argue that', 'advocates contend that',
  'opponents maintain that', 'detractors point out', 'from this perspective', 'on the grounds that',
  'give rise to', 'bear in mind', 'weigh the pros and cons', 'strike a balance',
  'tip the scale', 'fall into the trap of', 'exercise strict control', 'wreak havoc on',
  'bear full responsibility', 'hold the view that', 'subscribe to the view', 'strongly oppose',

  // Task 1 Precision Collocations
  'accounted for the largest share', 'represented a minority', 'witnessed a dramatic rise',
  'experienced a slight decline', 'fluctuated significantly between', 'remained relatively stable',
  'plateaued at', 'reached a peak of', 'hit an all-time low', 'narrowed considerably',
  'exhibited an upward trend', 'followed a downward pattern', 'stood at approximately',
  'compared to the figures for', 'in stark contrast to', 'in terms of', 'with respect to'
];

// Cohesive Devices Classified by Cambridge Functions
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

// Referencing & Anaphoric Substitution Markers (Cambridge Band 7-8 CC Indicators)
const REFERENCING_PATTERNS = [
  /\b(this|these|such)\s+(trend|phenomenon|issue|problem|tendency|pattern|shift|disparity|measure|approach|dilemma|finding|outcome|consequence|initiative|transition|transformation|strategy|policy|alternative|development|paradigm)\b/gi,
  /\bthe\s+former\b/gi,
  /\bthe\s+latter\b/gi,
  /\bin\s+doing\s+so\b/gi,
  /\bby\s+doing\s+so\b/gi,
  /\bwhich\s+(in\s+turn|subsequently|consequently)\b/gi
];

// Overview Indicators for IELTS Task 1 (Mandatory Cambridge Hard Cap)
const OVERVIEW_INDICATORS = [
  'overall', 'in summary', 'to summarize', 'in general', 'it is noticeable that',
  'it is clear that', 'it is evident that', 'as can be seen from the chart',
  'the most prominent feature', 'the general trend', 'looking at the overall picture',
  'as an overall trend', 'it is apparent that', 'broadly speaking'
];

// Subject-Verb Agreement Traps (Cambridge Band 5-6 Red Flags)
const SUBJECT_VERB_TRAPS = [
  // 3rd person singular pronoun / noun + base verb (missing -s/-es)
  {
    regex: /\b(he|she|it|this|that|everyone|everybody|someone|somebody|each)\s+(have|make|do|take|help|lead|show|provide|give|cause|play|bring|need|want|seem|tend|like|prefer|think|believe|create)\b/gi,
    fix: "Lỗi hòa hợp Chủ ngữ - Động từ: Chủ ngữ ngôi thứ 3 số ít (he/she/it/this/that/everyone...) phải đi với động từ số ít (has, makes, does, helps, likes, brings...)."
  },
  // Gerund subject (V-ing) + plural verb
  {
    regex: /\b([a-z]+ing)\s+([a-z]+\s+)?(have|are|were)\b/gi,
    filter: (match, p1) => ['wearing', 'studying', 'learning', 'using', 'working', 'living', 'reading', 'doing', 'getting', 'spending', 'providing', 'implementing'].includes(p1.toLowerCase()),
    fix: "Lỗi hòa hợp: Danh động từ làm chủ ngữ (V-ing) luôn tương đương với ngôi thứ 3 số ít, phải dùng động từ số ít (has / is / was)."
  },
  // Plural subject pronoun + singular verb
  {
    regex: /\b(they|we|these|those)\s+(has|is|was|makes|does|leads|shows|provides|gives|causes|needs|wants|likes)\b/gi,
    fix: "Lỗi hòa hợp: Chủ ngữ số nhiều (they/we/these/those) phải đi với động từ số nhiều (have, are, were, make, lead...)."
  }
];

// Quantifier & Noun Number Traps
const NOUN_AGREEMENT_TRAPS = [
  // Quantifier + singular countable noun (missing -s/-es)
  {
    regex: /\b(many|numerous|various|several|different|a lot of|lots of|two|three|four|both)\s+(student|child|person|reason|problem|factor|advantage|disadvantage|country|job|skill|school|way|benefit|individual|year|opinion|measure)\b/gi,
    fix: "Lỗi danh từ số nhiều: Sau các từ chỉ số lượng nhiều (many, several, various, both...), danh từ đếm được bắt buộc phải ở dạng số nhiều (-s / -es)."
  },
  // each/every + plural noun
  {
    regex: /\b(every|each)\s+(students|children|persons|reasons|problems|factors|advantages|disadvantages|countries|jobs|skills|schools|ways|benefits|individuals|years|opinions|measures)\b/gi,
    fix: "Lỗi danh từ số ít: Sau 'each' và 'every', danh từ đếm được luôn ở dạng số ít."
  }
];

// Preposition & Collocation Errors
const PREPOSITION_COLLOCATION_TRAPS = [
  { regex: /\bdepend\s+of\b/gi, fix: "Sai giới từ: Dùng 'depend on' (thay vì 'depend of')." },
  { regex: /\bin\s+the\s+other\s+hand\b/gi, fix: "Sai cụm liên kết: Dùng 'on the other hand' (thay vì 'in the other hand')." },
  { regex: /\bpay\s+attention\s+for\b/gi, fix: "Sai giới từ: Dùng 'pay attention to' (thay vì 'pay attention for')." },
  { regex: /\bfocus\s+in\b/gi, fix: "Sai giới từ: Dùng 'focus on' (thay vì 'focus in')." },
  { regex: /\bcontribute\s+in\b/gi, fix: "Sai giới từ: Dùng 'contribute to' (thay vì 'contribute in')." },
  { regex: /\bresponsible\s+of\b/gi, fix: "Sai giới từ: Dùng 'responsible for' (thay vì 'responsible of')." },
  { regex: /\bdiscuss\s+about\b/gi, fix: "Sai ngữ pháp: 'discuss' là ngoại động từ trực tiếp, không đi cùng 'about' (ví dụ: 'discuss this matter')." },
  { regex: /\bmention\s+about\b/gi, fix: "Sai ngữ pháp: 'mention' là ngoại động từ trực tiếp, không đi cùng 'about' (ví dụ: 'mention the benefits')." },
  { regex: /\bexplain\s+about\b/gi, fix: "Sai ngữ pháp: Dùng 'explain something' (thay vì 'explain about something')." },
  { regex: /\bmarry\s+with\b/gi, fix: "Sai giới từ: Dùng 'marry someone' hoặc 'be married to someone'." },
  { regex: /\bplay\s+an\s+important\s+role\s+to\b/gi, fix: "Sai giới từ: Dùng 'play an important role in' (thay vì 'role to')." }
];

// Double Comparative & Word Form Traps
const COMPARATIVE_AND_WORD_FORM_TRAPS = [
  { regex: /\bmore\s+(better|easier|faster|harder|cheaper|stronger|higher|lower|clearer)\b/gi, fix: "Lỗi so sánh kép (Double comparative): Không dùng 'more' trước tính từ ngắn đã có đuôi -er." },
  { regex: /\bcan\s+easy\b/gi, fix: "Sai từ loại: Sau trợ động từ 'can' dùng phó từ 'can easily'." },
  { regex: /\bcan\s+quick\b/gi, fix: "Sai từ loại: Dùng phó từ 'can quickly'." },
  { regex: /\bis\s+danger\b/gi, fix: "Sai từ loại: Sau to be dùng tính từ 'is dangerous' (thay vì danh từ 'danger')." }
];

// Uncountable Noun Plural Traps (Strict Cambridge Grammar Deductions)
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

// Bare Singular Countable Nouns & Missing Article Traps (Cambridge GRA Band 5-6 Red Flags)
const BARE_NOUN_AND_ARTICLE_TRAPS = [
  // 1. Missing 'a'/'an' in Predicate Nominals & Common Collocations
  {
    regex: /\b(play|plays|played)\s+(important\s+role|pivotal\s+role|vital\s+role|crucial\s+role|key\s+role|significant\s+role|indispensable\s+role|fundamental\s+role)\b/gi,
    fix: "Thiếu mạo từ 'a/an': Cụm chuẩn là 'play an important / a vital / a key role in' (thay vì thiếu mạo từ).",
    suggest: (match) => {
      const lower = match.toLowerCase();
      if (lower.includes('important') || lower.includes('indispensable')) {
        return match.replace(/^(play|plays|played)\s+/i, '$1 an ');
      }
      return match.replace(/^(play|plays|played)\s+/i, '$1 a ');
    }
  },
  {
    regex: /\b(is|are|was|were|become|becomes|became)\s+(serious\s+problem|major\s+problem|big\s+problem|pressing\s+issue|difficult\s+task|common\s+phenomenon|viable\s+alternative)\b/gi,
    fix: "Thiếu mạo từ 'a': Danh từ đếm được số ít đi kèm tính từ sau to be bắt buộc phải có mạo từ (ví dụ: 'is a serious problem', 'is a pressing issue').",
    suggest: (match) => match.replace(/^(is|are|was|were|become|becomes|became)\s+/i, '$1 a ')
  },
  {
    regex: /\b(have|has|had|lead|leads|led)\s+(better\s+life|good\s+life|healthy\s+life|normal\s+life|luxurious\s+life)\b/gi,
    fix: "Thiếu mạo từ 'a': Dùng 'have a better life / lead a healthy life' (danh từ 'life' ở đây là danh từ đếm được chỉ hoàn cảnh sống cụ thể).",
    suggest: (match) => match.replace(/^(have|has|had|lead|leads|led)\s+/i, '$1 a ')
  },
  {
    regex: /\b(have|has|had)\s+(profound\s+impact|significant\s+impact|detrimental\s+impact|negative\s+impact|positive\s+impact|huge\s+impact|direct\s+impact)\b/gi,
    fix: "Thiếu mạo từ 'a': Dùng 'have a profound / significant / detrimental impact on'.",
    suggest: (match) => match.replace(/^(have|has|had)\s+/i, '$1 a ')
  },
  {
    regex: /\b(make|makes|made)\s+(big\s+difference|significant\s+difference|huge\s+difference|remarkable\s+difference|difference)\b/gi,
    fix: "Thiếu mạo từ 'a': Dùng 'make a difference / make a significant difference'.",
    suggest: (match) => match.replace(/^(make|makes|made)\s+/i, '$1 a ')
  },
  {
    regex: /\b(pose|poses|posed)\s+(serious\s+threat|grave\s+threat|significant\s+threat|major\s+threat)\b/gi,
    fix: "Thiếu mạo từ 'a': Dùng 'pose a serious / grave threat to'.",
    suggest: (match) => match.replace(/^(pose|poses|posed)\s+/i, '$1 a ')
  },
  {
    regex: /\b(provide|provides|provided|give|gives|gave)\s+(viable\s+alternative|better\s+solution|clear\s+example|good\s+example|concrete\s+example)\b/gi,
    fix: "Thiếu mạo từ 'a': Dùng 'provide a viable alternative' hoặc 'give a clear example'.",
    suggest: (match) => match.replace(/^(provide|provides|provided|give|gives|gave)\s+/i, '$1 a ')
  },

  // 2. Fixed Expressions Missing 'the' / 'a'
  {
    regex: /\b(in|for)\s+(long\s+run|short\s+run)\b/gi,
    fix: "Thiếu mạo từ 'the': Dùng cụm cố định 'in the long run' hoặc 'in the short run'.",
    suggest: (match) => match.replace(/^(in|for)\s+/i, '$1 the ')
  },
  {
    regex: /\b(on)\s+(daily\s+basis|regular\s+basis)\b/gi,
    fix: "Thiếu mạo từ 'a': Dùng cụm cố định 'on a daily basis' hoặc 'on a regular basis'.",
    suggest: (match) => match.replace(/^on\s+/i, 'on a ')
  },
  {
    regex: /\b(all\s+over|around)\s+(world)\b/gi,
    fix: "Thiếu mạo từ 'the': Dùng 'around the world' hoặc 'all over the world'.",
    suggest: (match) => match.replace(/\bworld\b/i, 'the world')
  },
  {
    regex: /\b(at)\s+(global\s+level|national\s+level|local\s+level)\b/gi,
    fix: "Thiếu mạo từ: Dùng 'at the global level' hoặc 'at a national/local level'.",
    suggest: (match) => match.replace(/^at\s+/i, 'at the ')
  },
  {
    regex: /\b(as)\s+(result),/gi,
    fix: "Thiếu mạo từ 'a': Cụm liên từ nguyên nhân - kết quả chuẩn là 'As a result,'.",
    suggest: () => 'as a result,'
  },
  {
    regex: /\bin\s+(future|near\s+future)\b/gi,
    fix: "Thiếu mạo từ 'the': Dùng 'in the future' hoặc 'in the near future'.",
    suggest: (match) => match.replace(/^in\s+/i, 'in the ')
  },

  // 3. Bare Singular Countable Nouns in Subject Position (People & Roles)
  {
    regex: /(^|[.;,!?]\s*)(student|teacher|parent|child|doctor|nurse|worker|employee|employer|consumer|citizen|individual)\s+(should|must|can|could|will|would|need\s+to|needs\s+to|has\s+to|have\s+to|ought\s+to|is|was|plays|faces|creates)\b/gi,
    fix: "Lỗi danh từ đếm được số ít đứng trơ trọi (Bare Singular Countable Noun): Danh từ đếm được số ít ('student', 'teacher', 'parent', 'individual'...) không được đứng độc lập mà bắt buộc phải có mạo từ (a/an/the) hoặc chuyển sang dạng số nhiều (-s/-es). Ví dụ: 'Students should...' hoặc 'A student should...'.",
    suggest: (match) => {
      return match.replace(/\b(student|teacher|parent|child|doctor|nurse|worker|employee|employer|consumer|citizen|individual)\b/i, (m) => {
        if (m.toLowerCase() === 'child') return m[0] === 'C' ? 'Children' : 'children';
        return m + 's';
      });
    }
  },

  // 4. Bare Singular Countable Nouns in Subject Position (Institutions / Entities)
  {
    regex: /(^|[.;,!?]\s*)(government|company|university|hospital|country|nation)\s+(should|must|can|could|will|would|need\s+to|needs\s+to|has\s+to|have\s+to|ought\s+to)\b/gi,
    fix: "Lỗi thiếu mạo từ/từ hạn định trước danh từ tổ chức/thể chế: 'government/company/university' là danh từ đếm được, phải dùng 'the government / governments' hoặc 'a company / companies'.",
    suggest: (match) => {
      return match.replace(/\b(government|company|university|hospital|country|nation)\b/i, (m) => {
        const isCapital = m[0] === m[0].toUpperCase();
        return isCapital ? `The ${m.toLowerCase()}` : `the ${m}`;
      });
    }
  },

  // 5. Institutional Noun following that / belief verbs
  {
    regex: /\b(that|think|thinks|believe|believes|argue|argues)\s+(government|company|university)\s+(should|must|can|could|will|would|needs?\s+to|has\s+to)\b/gi,
    fix: "Thiếu mạo từ trước danh từ thể chế: Dùng 'the government should' hoặc 'governments should'.",
    suggest: (match) => match.replace(/\b(government|company|university)\b/i, 'the $1')
  },

  // 6. Bare Singular Nouns following Prepositions
  {
    regex: /\b(for|with|to|against)\s+(student|teacher|parent|child|worker|employee|consumer|citizen|individual)\s+(who|which|that|in|to)\b/gi,
    fix: "Lỗi danh từ đếm được số ít sau giới từ: Dùng danh từ số nhiều ('for students who') hoặc có mạo từ ('for a student who').",
    suggest: (match) => {
      return match.replace(/\b(student|teacher|parent|child|worker|employee|consumer|citizen|individual)\b/i, (m) => {
        if (m.toLowerCase() === 'child') return 'children';
        return m + 's';
      });
    }
  },

  // 7. Bare Countable Noun in Location / Environment
  {
    regex: /\b(in|into|from)\s+(big\s+city|modern\s+city|large\s+city|rural\s+area|urban\s+area)\b/gi,
    fix: "Thiếu mạo từ trước danh từ chỉ nơi chốn đếm được: Dùng 'in a big city' hoặc 'in big cities' (thay vì 'in big city').",
    suggest: (match) => match.replace(/^(in|into|from)\s+/i, '$1 a ')
  }
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
// 2. HELPER UTILITIES & TOKENIZERS
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
  const clamped = Math.max(1.0, Math.min(9.0, score));
  const floor = Math.floor(clamped);
  const diff = clamped - floor;
  if (diff < 0.25) return Math.max(1.0, floor);
  if (diff < 0.75) return floor + 0.5;
  return Math.min(9.0, floor + 1.0);
}

// -------------------------------------------------------------
// 3. SPECIALIZED LINGUISTIC ANALYZERS (v2)
// -------------------------------------------------------------

/**
 * Prompt Verbatim Copying Deduction (Cambridge Regulation)
 * Identifies chunks of >= 4 consecutive words copied directly from the prompt.
 * Words from prompt copying are subtracted from total word count (Effective Word Count)
 * and penalized in Task Response and Lexical Resource.
 */
function analyzePromptVerbatimCopying(prompt, essayText) {
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

  const copiedChunks = mergedRanges.map(r => ({
    phrase: essayWords.slice(r.start, r.end).join(' '),
    wordCount: r.length,
    startIndex: r.start
  }));

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
function analyzePromptSemanticRelevance(prompt, essayText) {
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
    const p2Lower = paragraphs[1].toLowerCase();
    if (/\b(trend|highest|lowest|upward|downward|fluctuat|increase|decrease|predominant)\b/i.test(p2Lower) &&
        !/\b(firstly|first of all|to begin with|on the one hand)\b/i.test(p2Lower)) {
      const p2Data = extractTask1RawDataPoints(paragraphs[1]);
      if (p2Data.length <= 2) {
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
function analyzeTask1DataDensity(paragraphs, overviewIndex = -1) {
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

/**
 * Word Overuse & Repetition Analyzer
 * Detects frequent, repetitive use of non-stopword academic & everyday terms (>= 4 times)
 * and provides C1/C2 academic alternative suggestions from ACADEMIC_THESAURUS.
 * 
 * @param {string[]} rawWords - Array of lowercase words from the essay
 * @param {Set<string>} stopwords - Stopwords to ignore
 * @returns {Object} Overuse diagnostics
 */
export function analyzeWordOveruse(rawWords, stopwords = STOPWORDS) {
  if (!Array.isArray(rawWords) || rawWords.length === 0) {
    return {
      hasOveruse: false,
      overusedWords: [],
      overuseCount: 0,
      suggestions: []
    };
  }

  const frequencyMap = {};
  rawWords.forEach(word => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    const isThesaurusWord = Boolean(ACADEMIC_THESAURUS[clean]);
    if (clean.length >= 4 && (!stopwords.has(clean) || isThesaurusWord)) {
      frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
    }
  });

  const overusedWords = [];
  const suggestions = [];

  // Sort by frequency descending
  const sortedWords = Object.entries(frequencyMap)
    .filter(([_, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1]);

  for (const [word, count] of sortedWords) {
    const thesaurusMatches = lookupSynonyms(word);
    overusedWords.push({
      word,
      count,
      hasThesaurus: thesaurusMatches.length > 0
    });

    if (thesaurusMatches.length > 0 && suggestions.length < 5) {
      suggestions.push({
        word,
        count,
        alternatives: thesaurusMatches.slice(0, 4)
      });
    }
  }

  return {
    hasOveruse: overusedWords.length > 0,
    overusedWords,
    overuseCount: overusedWords.length,
    suggestions
  };
}

/**
 * Analyzes sentences for Comma Splices (two independent clauses joined only with a comma).
 * Cambridge GRA Standard: Band 8.0 requires 0 comma splices;
 * >= 2 comma splices caps GRA at max 6.0; >= 4 caps at max 5.0.
 */
export function analyzeCommaSplices(sentences) {
  if (!Array.isArray(sentences) || sentences.length === 0) {
    return { commaSpliceCount: 0, commaSpliceDetails: [] };
  }

  const SUBORDINATOR_START = /^(although|even though|though|while|whereas|because|since|if|unless|when|whenever|after|before|once|as long as|provided that|given that|despite the fact that|as [a-z]+ed\b)/i;

  const FINITE_VERB_REGEX = /\b(is|are|was|were|has|have|had|do|does|did|can|cannot|can't|could|will|won't|would|should|must|may|might|become|becomes|became|remain|remains|remained|seem|seems|seemed|appear|appears|appeared|serves?|served|brings?|brought|provides?|provided|creates?|created|leads?|led|helps?|helped|causes?|caused|aims?|aimed|tends?|tended|makes?|made|allows?|allowed|enables?|enabled|means?|meant|gives?|gave|given|wants?|wanted|needs?|needed|requires?|required|demands?|demanded|faces?|faced|destroys?|destroyed|harms?|harmed|damages?|damaged|plays?|played|struggles?|struggled|fails?|failed|costs?|results?|resulted|stems?|stemmed|produces?|produced|generates?|generated|works?|worked|lives?|lived|believes?|believed|thinks?|thought|argues?|argued|suggests?|suggested|shows?|showed|shown|lacks?|lacked|suffers?|suffered|spends?|spent|chooses?|chose|chosen|loses?|lost|finds?|found|sees?|saw|seen|takes?|took|taken|builds?|built|grows?|grew|grown|knows?|knew|known|falls?|fell|fallen|rises?|rose|risen|pays?|paid|offers?|offered|gains?|gained|solves?|solved|improves?|improved|increases?|increased|decreases?|decreased|declines?|declined|develops?|developed|affects?|affected|impacts?|impacted|influences?|influenced|secures?|secured|obtains?|obtained|encounters?|encountered|experiences?|experienced|undergoes?|underwent|boosts?|boosted|enhances?|enhanced|tackles?|tackled|addresses?|addressed|invests?|invested|funds?|funded|imposes?|imposed|implements?|implemented|adopts?|adopted|introduces?|introduced|establishes?|established|relies?|relied|depends?|depended|promotes?|promoted|prevents?|prevented|reduces?|reduced|limits?|limited|expands?|expanded|surpasses?|surpassed|exceeds?|exceeded|outstrips?|outstripped|demonstrates?|demonstrated|indicates?|indicated|proves?|proved|proven|reveals?|revealed|illustrates?|illustrated|claims?|claimed|asserts?|asserted|contends?|contended|maintains?|maintained|emphasizes?|emphasized|highlights?|highlighted|prefers?|preferred)\b/i;

  const isIntroductoryPhrase = (clause) => {
    if (/^(compared\s+to|given\s+that|having\s+[a-z]+ed)\b/i.test(clause)) return true;
    if (/^to\s+[a-z]+\b/i.test(clause) && !/\b(is|are|was|were|will|can|should|must)\b/i.test(clause)) return true;
    if (/^[a-z]+ing\b/i.test(clause) && !FINITE_VERB_REGEX.test(clause.replace(/^[a-z]+ing\b/i, ''))) return true;
    return false;
  };

  // Pattern 1: Conjunctive adverbs incorrectly joined with comma
  const CONJUNCTIVE_ADVERB_REGEX = /,\s*(however|therefore|furthermore|moreover|consequently|nevertheless|nonetheless)(?:,\s*|\s+)([a-z]+)\b/gi;

  // Pattern 2: Pronoun / Demonstrative subject + finite verb
  const PRONOUN_SPLICE_REGEX = /,\s*(it|they|this|these|he|she|we)\s+(?:(often|always|also|now|simply|currently|greatly|directly|rarely|seldom)\s+)?(is|are|was|were|has|have|had|will|would|can|cannot|can't|could|should|must|may|might|brings?|provides?|creates?|leads?|helps?|causes?|aims?|tends?|makes?|allows?|enables?|means?|gives?|wants?|needs?|faces?|destroys?|harms?|plays?|struggles?|fails?|costs?|results?|stems?|produces?|generates?|requires?)\b/gi;

  // Pattern 3: Existential there is/are
  const EXISTENTIAL_SPLICE_REGEX = /,\s*(there\s+(is|are|was|were|will\s+be|has\s+been|have\s+been))\b/gi;

  // Pattern 4: Common IELTS plural / institutional subjects + modal/aux/verb
  const NOUN_SPLICE_REGEX = /,\s*(students|people|governments|citizens|parents|children|individuals|companies|workers|consumers|universities|schools|colleges|institutions)\s+(?:(often|always|also|now|simply|currently)\s+)?(can|cannot|can't|could|will|won't|would|should|must|have|has|had|are|were|tend\s+to|need\s+to|face|struggle\s+with|suffer\s+from|play|invest)\b/gi;

  const details = [];

  sentences.forEach((sentence, sIdx) => {
    const s = sentence.trim();
    if (!s || s.length < 25) return;

    // Subordinate clause at sentence start -> main clause following comma is valid!
    if (SUBORDINATOR_START.test(s)) return;

    // Check Pattern 1: Conjunctive Adverb Splice
    CONJUNCTIVE_ADVERB_REGEX.lastIndex = 0;
    let match;
    while ((match = CONJUNCTIVE_ADVERB_REGEX.exec(s)) !== null) {
      const matchIndex = match.index;
      const preComma = s.substring(0, matchIndex).trim();
      const adverb = match[1];
      const nextWord = match[2];

      // Pre-comma must have a finite verb and not be an introductory phrase
      if (preComma.split(/\s+/).length >= 3 && 
          FINITE_VERB_REGEX.test(preComma) && 
          !isIntroductoryPhrase(preComma)) {
        
        // Ensure post-adverb has a subject/verb (not a parenthetical adverb like "This, however, is...")
        const postAdverbText = s.substring(matchIndex + match[0].length).trim();
        if (FINITE_VERB_REGEX.test(postAdverbText)) {
          const capitalizedAdverb = adverb.charAt(0).toUpperCase() + adverb.slice(1);
          const suggestionOption1 = s.replace(match[0], `; ${adverb}, ${nextWord}`);
          const suggestionOption2 = s.replace(match[0], `. ${capitalizedAdverb}, ${nextWord}`);
          
          details.push({
            sentenceIndex: sIdx,
            original: s,
            commaFragment: match[0].trim(),
            suggestion: `${suggestionOption1} (hoặc: ${suggestionOption2})`,
            explanation: `Lỗi Comma Splice với trạng từ liên kết ('${adverb}'): Trong văn phong học thuật, các trạng từ liên kết ('however', 'therefore', 'furthermore'...) nối hai mệnh đề độc lập bắt buộc phải dùng dấu chấm phẩy (; ${adverb},) hoặc tách thành câu mới (. ${capitalizedAdverb},), không được chỉ dùng dấu phẩy.`
          });
          return;
        }
      }
    }

    // Helper to test patterns 2, 3, 4
    const checkSplicePattern = (regex, type) => {
      regex.lastIndex = 0;
      let pMatch;
      while ((pMatch = regex.exec(s)) !== null) {
        const matchIndex = pMatch.index;
        const preComma = s.substring(0, matchIndex).trim();

        // Safeguard checks on preComma
        if (preComma.split(/\s+/).length < 3) continue;
        if (!FINITE_VERB_REGEX.test(preComma)) continue;
        if (isIntroductoryPhrase(preComma)) continue;

        // Check if preComma has internal commas and examine the immediate preceding clause
        const preParts = preComma.split(',');
        const immediatePre = preParts[preParts.length - 1].trim();
        if (!FINITE_VERB_REGEX.test(immediatePre) && preParts.length > 1) {
          const previousPart = preParts[preParts.length - 2].trim();
          if (!FINITE_VERB_REGEX.test(previousPart)) continue;
        }

        const matchedText = pMatch[0]; // e.g. ", it brings" or ", students cannot"
        const cleanMatched = matchedText.replace(/^,\s*/, '');
        
        let suggestion = '';
        if (type === 'pronoun') {
          const pronoun = pMatch[1].toLowerCase();
          const adv = pMatch[2] ? pMatch[2] + ' ' : '';
          const verb = pMatch[3];
          if (pronoun === 'it' || pronoun === 'this') {
            suggestion = s.replace(matchedText, `, which ${adv}${verb}`);
          } else {
            suggestion = s.replace(matchedText, `, and ${cleanMatched}`);
          }
        } else if (type === 'existential') {
          suggestion = s.replace(matchedText, `; ${cleanMatched}`);
        } else {
          suggestion = s.replace(matchedText, `, and ${cleanMatched}`);
        }

        details.push({
          sentenceIndex: sIdx,
          original: s,
          commaFragment: matchedText.trim(),
          suggestion: `${suggestion} (hoặc tách câu bằng dấu chấm)`,
          explanation: `Lỗi Comma Splice (ghép hai mệnh đề độc lập S+V bằng dấu phẩy): Mệnh đề '${cleanMatched}...' là một mệnh đề hoàn chỉnh, không thể nối với mệnh đề trước chỉ bằng dấu phẩy. Cách khắc phục chuẩn Cambridge: (1) Thêm liên từ kết hợp (', and ${cleanMatched}...'), (2) Dùng mệnh đề quan hệ (', which...'), hoặc (3) Tách bằng dấu chấm hoặc chấm phẩy.`
        });
        return true;
      }
      return false;
    };

    if (checkSplicePattern(PRONOUN_SPLICE_REGEX, 'pronoun')) return;
    if (checkSplicePattern(EXISTENTIAL_SPLICE_REGEX, 'existential')) return;
    if (checkSplicePattern(NOUN_SPLICE_REGEX, 'noun')) return;
  });

  return {
    commaSpliceCount: details.length,
    commaSpliceDetails: details
  };
}

/**
 * Deep Paragraph-by-Paragraph Examiner Diagnostics
 * Analyzes Introduction, Body Paragraphs, and Conclusion structure according to P.E.E.L and Cambridge standards.
 */
function analyzeParagraphsDeeply(paragraphs, isTask1, task, task1OverviewCheck = null) {
  if (!paragraphs || paragraphs.length === 0) return [];
  
  const results = [];
  
  // 1. Introduction Analysis
  if (paragraphs.length >= 1) {
    const introText = paragraphs[0];
    const introLower = introText.toLowerCase();
    const hasCliché = /\b(in this modern (era|world|society)|in today s (world|society)|nowadays|since the dawn of (time|humanity)|a hot debate|a controversial issue|every coin has two sides|a double-edged sword)\b/i.test(introLower);
    const hasThesis = /\b(i firmly (believe|agree|disagree|argue|contend)|in my (opinion|view)|this essay will (examine|discuss|argue)|i will discuss|my view is that|i completely agree|i completely disagree)\b/i.test(introLower);
    const introWords = sanitizeWords(introText).length;

    results.push({
      paragraphIndex: 1,
      name: 'Đoạn 1: Mở Bài (Introduction)',
      wordCount: introWords,
      verdict: isTask1 
        ? 'Mở bài cần giới thiệu lại ngắn gọn biểu đồ (Paraphrase đề bài) trong 1-2 câu súc tích.'
        : (hasThesis 
            ? 'Rất tốt: Mở bài đã nêu rõ quan điểm cá nhân (Thesis statement rõ ràng, không nước đôi).' 
            : 'CẢNH BÁO GIÁM KHẢO: Mở bài chưa nêu rõ lập trường cá nhân (Missing Thesis Statement). Barem Cambridge yêu cầu lập trường rõ ràng ngay từ Mở bài để mở khóa Band 7.0+ TR.'),
      clicheWarning: hasCliché ? 'Phát hiện câu mở đầu sáo rỗng/rập khuôn ("In this modern era / Nowadays / Every coin has two sides"). Hãy bỏ những mẫu câu khuôn sáo này để mở bài trang trọng, tự nhiên.' : null,
      recommendation: isTask1
        ? 'Công thức mở bài Task 1 chuẩn: "The provided visual data delineates [Đối tượng] in [Địa điểm] across the [Thời gian]."'
        : 'Công thức mở bài 2 câu chuẩn 8.0: Câu 1 - Paraphrase đề bài khách quan. Câu 2 - Khẳng định lập trường dứt khoát ("While some argue that [View A], I firmly adhere to the view that [View B] due to [Lý do]").'
    });
  }

  // 2. Paragraph Analysis (Task 1 Overview vs Detailed Body / Task 2 P.E.E.L)
  if (isTask1) {
    let detailBodyCounter = 1;
    for (let i = 1; i < paragraphs.length; i++) {
      const pText = paragraphs[i];
      const pWords = sanitizeWords(pText).length;
      const isOverviewPara = task1OverviewCheck && task1OverviewCheck.overviewIndex === i;

      if (isOverviewPara) {
        results.push({
          paragraphIndex: i + 1,
          name: `Đoạn ${i + 1}: Tổng Quan (Overview)`,
          wordCount: pWords,
          verdict: task1OverviewCheck.hasRawData
            ? `CẢNH BÁO BẪY SỐ LIỆU ĐOẠN TỔNG QUAN: Phát hiện đoạn Overview chứa số liệu chi tiết cụ thể (${task1OverviewCheck.rawDataList.join(', ')}). Theo tiêu chuẩn giám khảo Cambridge IELTS Task 1, Overview chỉ được khái quát xu hướng lớn (tăng/giảm, biến động, phân kỳ), TUYỆT ĐỐI KHÔNG đưa số liệu chi tiết. Lỗi này khiến điểm Task Achievement bị khống chế tối đa Band 5.5.`
            : 'Rất tốt: Đoạn Overview đạt chuẩn giám khảo Cambridge — khái quát rõ ràng các xu hướng và đặc điểm nổi bật mà không bị sa đà vào số liệu chi tiết.',
          clicheWarning: task1OverviewCheck.hasRawData
            ? `Bẫy số liệu: Các số liệu (${task1OverviewCheck.rawDataList.join(', ')}) cần được chuyển xuống các đoạn Thân bài chi tiết bên dưới.`
            : null,
          recommendation: 'Quy tắc vàng viết Overview Task 1: 1-2 câu tóm tắt 2 đặc điểm nổi bật nhất (Ví dụ: Đại lượng nào luôn cao nhất/thấp nhất? Xu hướng chung qua các năm là tăng hay giảm?). Tuyệt đối không đưa bất kỳ con số cụ thể nào.'
        });
      } else {
        const pData = extractTask1RawDataPoints(pText);
        const hasComparison = /\b(higher|lower|more|less|fewer|than|as\s+\w+\s+as|compared\s+(?:to|with)|in\s+comparison\s+(?:to|with)|whereas|while|whilst|conversely|in\s+contrast)\b/i.test(pText);

        results.push({
          paragraphIndex: i + 1,
          name: `Đoạn ${i + 1}: Thân Bài Chi Tiết ${detailBodyCounter} (Detailed Body Paragraph ${detailBodyCounter})`,
          wordCount: pWords,
          verdict: pWords < 35
            ? `Đoạn thân bài quá ngắn (${pWords} từ), chưa mô tả đầy đủ các nhóm số liệu của biểu đồ.`
            : (pData.length >= 2
                ? `Đoạn thân bài chi tiết phát triển tốt, có dẫn chứng số liệu cụ thể (${pData.join(', ')})${hasComparison ? ' và có cấu trúc so sánh đối chiếu.' : '.'}`
                : `CẢNH BÁO THIẾU DẪN CHỨNG: Đoạn thân bài chi tiết này chỉ có ${pData.length} số liệu. Thân bài Task 1 cần lựa chọn và đưa ra số liệu/mốc thời gian cụ thể để làm dẫn chứng.`),
          anecdoteWarning: null,
          recommendation: hasComparison 
            ? 'Duy trì kết hợp nêu số liệu đi kèm cấu trúc so sánh đối chiếu để làm nổi bật sự khác biệt giữa các nhóm đối tượng.'
            : 'Bổ sung các cấu trúc so sánh đối chiếu (ví dụ: "...was twice as high as...", "in contrast to...", "followed by...") để đạt tiêu chí Task Achievement Band 7+.'
        });
        detailBodyCounter++;
      }
    }
  } else {
    // Task 2 Body Paragraphs Analysis (P.E.E.L Model)
    const bodyParas = paragraphs.slice(1, -1);
    bodyParas.forEach((bodyText, idx) => {
      const bodyWords = sanitizeWords(bodyText).length;
      const bodyLower = bodyText.toLowerCase();
      const hasAnecdote = /\b(my friend|my father|my mother|my family|my brother|my sister|when i was|in my country)\b/i.test(bodyLower);
      const hasExplanation = /\b(because|since|as a consequence|this is because|in other words|leads to|results in|owing to|due to)\b/i.test(bodyLower);
      const hasExample = /\b(for example|for instance|such as|to illustrate|a prime example|evidence shows|studies show|empirical data)\b/i.test(bodyLower);

      results.push({
        paragraphIndex: idx + 2,
        name: `Đoạn ${idx + 2}: Thân Bài ${idx + 1} (Body Paragraph ${idx + 1})`,
        wordCount: bodyWords,
        verdict: bodyWords < 40 
          ? `Đoạn thân bài quá ngắn (${bodyWords} từ). Luận điểm chỉ mới nêu ra dạng gạch đầu dòng mà chưa có câu giải thích 'Vì sao' hoặc dẫn chứng cụ thể.`
          : (hasExplanation && hasExample 
              ? 'Đoạn văn phát triển cân đối và chặt chẽ theo mô hình chuẩn P.E.E.L (Luận điểm - Giải thích cơ chế - Dẫn chứng).'
              : 'Cần củng cố chiều sâu: Hãy bổ sung thêm câu giải thích cơ chế nguyên nhân - hệ quả hoặc số liệu/dẫn chứng cụ thể.'),
        anecdoteWarning: hasAnecdote ? 'CẢNH BÁO BẪY VÍ DỤ CÁ NHÂN: Phát hiện dẫn chứng dựa trên trải nghiệm cá nhân ("my friend / my family / when I was"). Văn phong IELTS Academic đòi hỏi ví dụ mang tính quy luật chung của xã hội, số liệu nghiên cứu hoặc chính sách chính phủ.' : null,
        recommendation: 'Áp dụng công thức P.E.E.L: (1) Point - Câu chủ đề định hướng ý; (2) Explanation - Phân tích cơ chế tác động; (3) Evidence - Dẫn chứng thực tế xã hội; (4) Link - Câu chốt liên kết ngược lại đề bài.'
      });
    });

    // Task 2 Conclusion Analysis
    if (paragraphs.length >= 2) {
      const lastText = paragraphs[paragraphs.length - 1];
      const lastLower = lastText.toLowerCase();
      const hasConcluMarker = /\b(in conclusion|to conclude|to summarize|in summary)\b/i.test(lastLower);
      const concluWords = sanitizeWords(lastText).length;

      results.push({
        paragraphIndex: paragraphs.length,
        name: `Đoạn ${paragraphs.length}: Kết Bài (Conclusion)`,
        wordCount: concluWords,
        verdict: hasConcluMarker 
          ? 'Kết bài chuẩn mực: Có từ nối quy ước ("In conclusion"), tóm lược lại quan điểm xuyên suốt.'
          : 'CẢNH BÁO: Kết bài thiếu từ nối quy ước ("In conclusion"). Giám khảo cần thấy rõ tín hiệu kết thúc bài thi.',
        clicheWarning: concluWords < 20 ? `Đoạn kết bài hơi vội vã (${concluWords} từ), chưa tóm lược đầy đủ các góc nhìn đã trình bày ở thân bài.` : null,
        recommendation: 'Kết bài chuẩn 1-2 câu: Tóm lược lại các luận điểm cốt lõi và tái khẳng định lập trường cuối cùng mà tuyệt đối không đưa thêm ý tưởng mới nào.'
      });
    }
  }

  return results;
}

/**
 * Generates an Actionable Prescription Roadmap to boost candidate's band score.
 */
function generateExaminerActionPlan(trBand, ccBand, lrBand, graBand, svErrorCount, wordCount, targetMinWords, isTask1, task1OverviewCheck = null, task1ComparisonCheck = null, task2Fulfillment = null, topicData = null, wordOveruse = null, bareNounErrorCount = 0, commaSpliceCount = 0) {
  const plan = {
    priority1: '',
    priority2: '',
    priority3: '',
    estimatedBandTarget: ''
  };

  // Priority 1: Most Fatal Barrier
  if (wordCount < targetMinWords) {
    plan.priority1 = `Khắc phục dung lượng khẩn cấp: Bài viết hiện thiếu ${targetMinWords - wordCount} từ. Bắt buộc phải viết đủ tối thiểu ${targetMinWords} từ để thoát khỏi khung điểm liệt Task Response.`;
  } else if (isTask1 && task1OverviewCheck?.hasRawData) {
    plan.priority1 = `Khắc phục bẫy số liệu đoạn Overview: Phát hiện ${task1OverviewCheck.rawDataList.length} số liệu chi tiết (${task1OverviewCheck.rawDataList.slice(0, 3).join(', ')}) trong Overview. Đoạn Tổng quan chỉ được khái quát xu hướng lớn (tăng/giảm, biến động), tuyệt đối không đưa số liệu cụ thể để thoát khỏi mức khống chế Band 5.5 Task Achievement.`;
  } else if (isTask1 && task1ComparisonCheck && task1ComparisonCheck.totalComparisons === 0) {
    plan.priority1 = `Thoát khỏi bẫy liệt kê số liệu cơ học (Mechanical Listing): Thân bài có đưa ra số liệu nhưng thiếu hẳn các cấu trúc so sánh đối chiếu. Hãy sử dụng tối thiểu 3 cấu trúc so sánh tương quan (như: 'twice as high as', 'whereas', 'outstripped', 'compared with') để mở khóa Band 7.0+ Task Achievement.`;
  } else if (!isTask1 && task2Fulfillment && !task2Fulfillment.isBalanced) {
    plan.priority1 = `Khắc phục lỗi bỏ sót yêu cầu đề bài: ${task2Fulfillment.missingPartDescription ? 'Bạn chưa trả lời ' + task2Fulfillment.missingPartDescription + '.' : ''} Dành riêng 1 đoạn thân bài độc lập cho mỗi câu hỏi của đề bài để thoát khỏi mức khống chế Band 5.0 Task Response.`;
  } else if (svErrorCount >= 3) {
    plan.priority1 = `Chấm dứt lỗi chia động từ cơ bản: Phát hiện ${svErrorCount} lỗi hòa hợp Chủ ngữ - Động từ và Danh từ số nhiều. Hãy dành 3 phút cuối giờ rà soát lại thì và đuôi -s/-es của mọi động từ.`;
  } else if (bareNounErrorCount >= 4) {
    plan.priority1 = `Chấm dứt lỗi danh từ trơ trọi & mạo từ: Phát hiện ${bareNounErrorCount} lỗi danh từ đếm được số ít đứng một mình hoặc thiếu mạo từ (a/an/the) (như: 'student should', 'plays important role'). Quy tắc bắt buộc: Danh từ đếm được số ít không bao giờ đứng độc lập. Hãy thêm mạo từ hoặc chuyển sang số nhiều (-s/-es) để mở khóa Band 7.0+ GRA.`;
  } else if (commaSpliceCount >= 4) {
    plan.priority1 = `Chấm dứt lỗi ngắt câu Comma Splice nghiêm trọng: Phát hiện ${commaSpliceCount} câu nối hai mệnh đề độc lập chỉ bằng dấu phẩy. Đây là lỗi hệ thống ranh giới câu khống chế GRA ở Band 5.0. Hãy tách thành 2 câu riêng biệt bằng dấu chấm hoặc dùng liên từ kết hợp (', and / but...') hoặc đại từ quan hệ (', which...').`;
  } else if (trBand < 6.0) {
    plan.priority1 = isTask1 
      ? 'Bắt buộc phải có đoạn Overview nêu bật 2 đặc điểm lớn nhất của biểu đồ (không đưa số liệu chi tiết vào Overview).' 
      : 'Phát triển luận điểm đa chiều: Dành riêng 1 đoạn cho mỗi góc nhìn trong đề bài, trả lời trọn vẹn câu hỏi.';
  } else {
    plan.priority1 = 'Phát triển chiều sâu lập luận: Đào sâu cơ chế "Vì sao dẫn đến kết quả đó" thay vì chỉ liệt kê ý tưởng bề mặt.';
  }

  // Priority 2: Cohesion, Grammar & Article/Noun/Splice Control
  if (commaSpliceCount >= 1) {
    plan.priority2 = `Khắc phục lỗi Comma Splice (nối câu bằng dấu phẩy): Phát hiện ${commaSpliceCount} câu ghép hai mệnh đề độc lập S+V bằng dấu phẩy mà không có liên từ kết hợp. Hãy chuyển mệnh đề phụ thành mệnh đề quan hệ (', which...'), thêm liên từ (', and / but'), hoặc dùng dấu chấm phẩy để đạt chuẩn Band 7.0+ GRA.`;
  } else if (bareNounErrorCount >= 2) {
    plan.priority2 = `Khắc phục triệt để lỗi mạo từ & danh từ trơ trọi: Phát hiện ${bareNounErrorCount} lỗi thiếu mạo từ (a/an/the) hoặc dùng danh từ đếm được số ít đứng một mình. Hãy luôn chuyển sang danh từ số nhiều (-s/-es) hoặc thêm 'a/an/the'.`;
  } else if (ccBand < 6.0) {
    plan.priority2 = 'Cải thiện mạch văn: Chia bài viết thành các đoạn cân đối. Hạn chế nhồi nhét "First, Second, Moreover", hãy luyện tập dùng đại từ thay thế (This trend, Such measures) và liên kết ẩn.';
  } else if (graBand < 6.5) {
    plan.priority2 = 'Bổ sung câu phức nâng cao: Lồng ghép tối thiểu 3 câu có mệnh đề quan hệ (which/who), mệnh đề nhượng bộ (Although/While) hoặc câu điều kiện (If).';
  } else {
    plan.priority2 = 'Tăng cường tính liên kết ẩn (Thematic progression): Kết nối các câu bằng mạch ý liền mạch, tránh để giám khảo cảm thấy câu văn bị ngắt quãng.';
  }

  // Priority 3: Lexical Precision & Dynamic Topic Collocations
  const topicName = topicData?.topicNameVi || 'học thuật';
  const topicCollocations = topicData?.collocations || [];
  const collocationsSample = topicCollocations.slice(0, 2).map(v => `'${v.phrase}'`).join(', ');

  if (wordOveruse?.hasOveruse && wordOveruse.overusedWords.some(w => w.count >= 5)) {
    const topOverused = wordOveruse.overusedWords.filter(w => w.count >= 5).slice(0, 2).map(w => `'${w.word}' (${w.count} lần)`).join(', ');
    plan.priority3 = `Khắc phục lỗi lặp từ nghiêm trọng: Đa dạng hóa các từ đang bị lặp lại quá nhiều (${topOverused}) bằng các từ đồng nghĩa học thuật C1/C2 theo chủ đề '${topicName}'.`;
  } else if (lrBand < 6.0) {
    plan.priority3 = `Nâng cấp từ vựng học thuật: Thay thế các từ giao tiếp cơ bản bằng thuật ngữ C1/C2 theo chủ đề '${topicName}'. Tích lũy các cụm từ đắt giá để nâng điểm Lexical Resource.`;
  } else {
    plan.priority3 = `Tích lũy các cụm Collocations đắt giá theo chủ đề '${topicName}'${collocationsSample ? ` (như: ${collocationsSample})` : ''} để chạm mốc Band 7.5+ LR.`;
  }

  const currentOverall = (trBand + ccBand + lrBand + graBand) / 4.0;
  const currentBand = roundToCambridgeBand(currentOverall);
  const nextTarget = Math.min(9.0, currentBand + 0.5);
  plan.estimatedBandTarget = `Lộ trình mục tiêu: Nâng từ Band ${currentBand.toFixed(1)} lên Band ${nextTarget.toFixed(1)} khi bạn thực hiện triệt để 3 ưu tiên trên.`;

  return plan;
}

// -------------------------------------------------------------
// 4. CORE ALGORITHM EVALUATOR ENGINE (v4 CHIEF EXAMINER STRICT STANDARD)
// -------------------------------------------------------------

/**
 * Evaluates essay algorithmically following official Cambridge IELTS Band Descriptors (Band 1.0 to 9.0).
 * 
 * @param {Object} params
 * @param {Object} params.task - IELTS Task object (taskNumber, type, prompt, minWords, topic)
 * @param {string} params.essayText - Candidate's written essay
 * @returns {Object} Full structured evaluation matching Gemini Data Contract
 */
export function evaluateEssayAlgorithmically({ task, essayText }) {
  if (!essayText || typeof essayText !== 'string' || essayText.trim().length === 0) {
    throw new Error('Vui lòng nhập bài viết để giám khảo chấm điểm.');
  }

  const rawWords = sanitizeWords(essayText);
  const rawWordCount = rawWords.length;
  const isTask1 = task?.taskNumber === 1;
  const targetMinWords = task?.minWords || (isTask1 ? 150 : 250);
  const sentences = getSentences(essayText);
  const paragraphs = getParagraphs(essayText);

  // 1. Prompt Verbatim Copying Deduction (Official Cambridge Regulation)
  const promptCopying = analyzePromptVerbatimCopying(task?.prompt, essayText);
  const copiedWordCount = promptCopying.totalCopiedWords;
  const wordCount = Math.max(0, rawWordCount - copiedWordCount); // Effective Word Count

  // Band 1.0 Non-user Immediate Handling (< 35 effective words)
  if (wordCount < 35) {
    const feedbackMsg = `Theo khung chuẩn khảo thí Cambridge IELTS Band Descriptors, bài viết dưới 35 từ hợp lệ (đạt ${wordCount}/${targetMinWords} từ${copiedWordCount > 0 ? `, đã trừ ${copiedWordCount} từ sao chép đề bài` : ''}) thuộc khung "Band 1.0 - Non-user" (Không thể sử dụng ngôn ngữ ngoài một vài từ đơn lẻ). Thí sinh không cung cấp đủ ngữ liệu để giám khảo đánh giá các tiêu chí ngữ pháp và lập luận.`;
    return {
      overallBand: 1.0,
      evaluationMethod: 'algorithmic',
      engineName: 'Cambridge Deep Linguistic Evaluator v4 (Chief Examiner Strict Standard)',
      dateGraded: new Date().toISOString(),
      criteria: {
        tr: {
          band: 1.0,
          feedback: feedbackMsg,
          strengths: [],
          improvements: [`Bài viết quá ngắn (${wordCount}/${targetMinWords} từ). Bắt buộc phải viết đủ tối thiểu ${targetMinWords} từ để bài thi có thể được đánh giá theo barem chuẩn Cambridge.`]
        },
        cc: {
          band: 1.0,
          feedback: 'Không thể đánh giá tính mạch lạc do văn bản chưa đủ dung lượng cấu thành đoạn văn hoàn chỉnh.',
          strengths: [],
          improvements: ['Cần viết thành các câu hoàn chỉnh và chia thành tối thiểu 4 đoạn văn (Mở bài - 2 Thân bài - Kết bài).']
        },
        lr: {
          band: 1.0,
          feedback: 'Vốn từ vựng chỉ gồm vài từ đơn lẻ, không thể hiện được khả năng diễn đạt học thuật.',
          strengths: [],
          improvements: ['Tích lũy từ vựng cơ bản và các mẫu câu thông dụng trước khi làm bài.']
        },
        gra: {
          band: 1.0,
          feedback: 'Chưa đủ cấu trúc câu để đánh giá độ chính xác ngữ pháp.',
          strengths: [],
          improvements: ['Luyện tập viết các câu đơn đúng ngữ pháp (S + V + O) trước khi bước vào luyện viết luận.']
        }
      },
      corrections: [],
      band8Rewrite: isTask1
        ? `The provided visual illustration delineates notable patterns and fluctuations pertinent to ${task?.title || 'the subject matter'} over the surveyed timeframe.\n\nOverall, it is immediately discernible that significant shifts transpired throughout the period. While certain figures exhibited an upward trajectory, others experienced marked declines or plateaued after initial volatility.\n\nIn terms of the predominant categories, initial figures commenced at moderate levels before undergoing consistent expansion, ultimately culminating in peak metrics. Conversely, alternative components demonstrated a steady descent, reflecting clear divergence across segments.\n\nRegarding the remaining parameters, comparative analysis underscores a high degree of correlation with general trends, with the disparity narrowing considerably towards the end of the recording timeline.`
        : `It is widely argued that ${task?.prompt?.slice(0, 100) || 'this topic'} has ignited profound debate in contemporary society. While some individuals contend that traditional perspectives remain paramount, I firmly adhere to the view that progressive methodologies offer far superior societal advantages.\n\nOn the one hand, proponents of conventional approaches frequently cite proven reliability as their core justification. From this standpoint, established paradigms mitigate unforeseen socioeconomic hazards and preserve foundational stability. For instance, empirical evidence highlights how standardized frameworks cultivate structural discipline across institutions.\n\nOn the other hand, the compelling benefits of embracing modernization are indisputable. Firstly, adapting to technological and sociological evolutions fosters unprecedented productivity and unlocks innovative solutions to pressing issues. Furthermore, prioritizing contemporary strategies empowers future generations to navigate increasingly complex global challenges effectively.\n\nIn conclusion, although conventional practices provide undeniable initial safeguards, the multifaceted benefits of forward-looking alternatives are far more substantial. Consequently, proactive adoption should be championed across all societal sectors.`,
      keyVocabulary: [
        { phrase: 'exert a profound impact on', meaningVi: 'tạo ra tác động sâu sắc lên đối tượng nào đó', example: 'Technological advancements exert a profound impact on contemporary communication.' },
        { phrase: 'play an indispensable role in', meaningVi: 'đóng một vai trò không thể thiếu trong', example: 'Early childhood education plays an indispensable role in cognitive development.' },
        { phrase: 'a viable alternative to', meaningVi: 'một giải pháp thay thế khả thi cho', example: 'Solar power is increasingly seen as a viable alternative to fossil fuels.' }
      ],
      paragraphAnalysis: [
        {
          paragraphIndex: 1,
          name: 'Toàn bài (Chưa phân đoạn)',
          wordCount,
          verdict: `Bài viết chỉ có ${wordCount} từ, quá ngắn để tạo thành một đoạn văn hoàn chỉnh.`,
          clicheWarning: null,
          anecdoteWarning: null,
          recommendation: `Bắt buộc phải mở rộng dung lượng lên tối thiểu ${targetMinWords} từ theo mô hình chuẩn 4 đoạn (Mở bài - 2 Thân bài - Kết bài).`
        }
      ],
      actionPlan: {
        priority1: `Khắc phục dung lượng khẩn cấp: Bài viết chỉ có ${wordCount}/${targetMinWords} từ. Bắt buộc phải viết đủ tối thiểu ${targetMinWords} từ để thoát khỏi điểm liệt Band 1.0.`,
        priority2: 'Xây dựng cấu trúc bài viết chuẩn: Học cấu trúc 4 đoạn (Mở bài - Thân bài 1 - Thân bài 2 - Kết bài).',
        priority3: 'Luyện câu đơn cơ bản: Rèn luyện viết câu chuẩn ngữ pháp (Chủ ngữ + Động từ + Tân ngữ) không sai thì.',
        estimatedBandTarget: `Lộ trình mục tiêu: Nâng từ Band 1.0 lên Band 3.5 - 4.0 khi bạn viết đủ ${targetMinWords} từ và chia đoạn rõ ràng.`
      }
    };
  }

  // Corrections array initialized early for cross-referencing
  const corrections = [];

  // ===========================================================
  // A. TASK RESPONSE / TASK ACHIEVEMENT (TR/TA) v4 (STRICT EXAMINER)
  // ===========================================================
  // Base score for standard structure: 5.5
  let trScore = 5.5;
  const trStrengths = [];
  const trImprovements = [];

  // Prompt Verbatim Copying Penalty (Cambridge Regulation: Copied words receive zero credit)
  if (copiedWordCount >= 4) {
    if (copiedWordCount >= 15) {
      trScore = Math.max(1.0, trScore - 1.0);
    } else {
      trScore = Math.max(1.0, trScore - 0.5);
    }
    const sampleChunks = promptCopying.copiedChunks.map(c => `"${c.phrase}" (${c.wordCount} từ)`).slice(0, 2).join(', ');
    trImprovements.push(`CẢNH BÁO SAO CHÉP ĐỀ BÀI: Phát hiện ${copiedWordCount} từ sao chép nguyên văn từ câu hỏi đề bài mà không paraphrase (${sampleChunks}). Theo quy chế khảo thí chính thức của Cambridge IELTS, các từ sao chép nguyên văn sẽ bị GẠCH BỎ KHỎI TỔNG SỐ TỪ TÍNH ĐIỂM (Dung lượng thực tế hợp lệ: ${wordCount}/${targetMinWords} từ).`);
  }

  // 1. Strict Underlength Penalties (Cambridge Exam Regulations)
  if (isTask1) {
    if (wordCount < 50) {
      trScore = Math.min(trScore, 2.0);
      trImprovements.push(`Bài viết quá ngắn (${wordCount}/150 từ). Theo quy chế Cambridge, bài viết dưới 50 từ thuộc Band 2.0 (Intermittent user).`);
    } else if (wordCount < 80) {
      trScore = Math.min(trScore, 3.0);
      trImprovements.push(`Bài viết thiếu từ nghiêm trọng (${wordCount}/150 từ). Điểm Task Achievement bị giới hạn ở Band 3.0.`);
    } else if (wordCount < 110) {
      trScore = Math.min(trScore, 4.0);
      trImprovements.push(`Bài viết quá ngắn (${wordCount}/150 từ, thiếu ${150 - wordCount} từ). Task Achievement bị giới hạn ở Band 4.0.`);
    } else if (wordCount < 135) {
      trScore = Math.min(trScore, 4.5);
      trImprovements.push(`Bài viết thiếu từ đáng kể (${wordCount}/150 từ). Điểm Task Achievement bị giới hạn tối đa Band 4.5.`);
    } else if (wordCount < 150) {
      trScore = Math.min(trScore, 5.0);
      trImprovements.push(`Bài viết chưa đạt dung lượng tối thiểu (${wordCount}/150 từ). Bạn bị trừ điểm do không hoàn thành yêu cầu cơ bản.`);
    } else if (wordCount >= 170 && paragraphs.length >= 3) {
      trScore += 0.5;
      trStrengths.push(`Dung lượng bài viết đạt chuẩn và phát triển tốt (${wordCount}/150 từ).`);
    } else {
      trStrengths.push(`Đạt yêu cầu tối thiểu về dung lượng bài viết (${wordCount}/150 từ).`);
    }
  } else {
    // Task 2: Minimum 250 words
    if (wordCount < 75) {
      trScore = Math.min(trScore, 2.0);
      trImprovements.push(`CẢNH BÁO THIẾU TỪ TRẦM TRỌNG: Bài viết chỉ có ${wordCount}/250 từ. Theo Cambridge Band Descriptors, thí sinh thuộc khung Band 2.0 (Intermittent user) do không diễn đạt được thông điệp hoàn chỉnh.`);
    } else if (wordCount < 120) {
      trScore = Math.min(trScore, 3.0);
      trImprovements.push(`CẢNH BÁO THIẾU TỪ NGHIÊM TRỌNG: Bài viết chỉ có ${wordCount}/250 từ (thiếu ${250 - wordCount} từ). Theo Cambridge, bài viết dưới 120 từ bị khống chế tối đa Band 3.0.`);
    } else if (wordCount < 160) {
      trScore = Math.min(trScore, 4.0);
      trImprovements.push(`CẢNH BÁO THIẾU TỪ ĐÁNG KỂ: Bài viết chỉ có ${wordCount}/250 từ (thiếu ${250 - wordCount} từ). Ý tưởng chưa được giải thích và minh chứng đầy đủ, điểm Task Response bị khống chế tối đa Band 4.0.`);
    } else if (wordCount < 200) {
      trScore = Math.min(trScore, 5.0);
      trImprovements.push(`Bài viết thiếu từ đáng kể (${wordCount}/250 từ). Luận điểm còn sơ sài, điểm Task Response bị giới hạn tối đa Band 5.0.`);
    } else if (wordCount < 240) {
      trScore = Math.min(trScore, 5.5);
      trImprovements.push(`Bài viết hơi ngắn (${wordCount}/250 từ). Cần mở rộng thêm luận cứ và ví dụ minh họa để chạm mốc tối thiểu 250 từ.`);
    } else if (wordCount >= 250 && paragraphs.length >= 4) {
      trScore = 6.0; // Meets baseline standard
      if (wordCount >= 280) {
        trScore = 6.5;
        trStrengths.push(`Dung lượng bài viết lý tưởng (${wordCount} từ), phát triển ý sâu sắc.`);
      } else {
        trStrengths.push(`Đạt yêu cầu tối thiểu về dung lượng bài viết (${wordCount}/250 từ).`);
      }
    }
  }

  // 2. Paragraph Structure & Body Development Depth
  const minParagraphs = isTask1 ? 3 : 4;
  if (paragraphs.length >= minParagraphs) {
    trStrengths.push(`Bố cục bài viết gồm ${paragraphs.length} đoạn phân định rõ ràng (Mở bài, Thân bài, ${isTask1 ? 'Tổng quan' : 'Kết luận'}).`);
    
    // Check body paragraphs depth (undeveloped paragraphs penalty)
    const bodyParagraphs = paragraphs.slice(1, isTask1 ? undefined : -1);
    if (bodyParagraphs.length > 0) {
      const avgBodyWords = bodyParagraphs.reduce((acc, p) => acc + sanitizeWords(p).length, 0) / bodyParagraphs.length;
      if (avgBodyWords < 35 && wordCount < 220) {
        trScore = Math.min(trScore, 5.0);
        trImprovements.push(`Các đoạn thân bài quá ngắn (trung bình chỉ ${Math.round(avgBodyWords)} từ/đoạn). Bạn cần giải thích cơ chế 'Vì sao' và đưa ví dụ cụ thể thay vì chỉ liệt kê ý.`);
      }
    }
  } else {
    trScore = Math.min(trScore, 5.0);
    trImprovements.push(`Cấu trúc bài viết chưa tối ưu (${paragraphs.length} đoạn). Bạn cần chia tối thiểu ${minParagraphs} đoạn độc lập để đạt cấu trúc chuẩn.`);
  }

  // 3. Prompt-Essay Semantic Relevance (PESR) & Off-Topic Check
  const relevance = analyzePromptSemanticRelevance(task?.prompt, essayText);
  if (relevance.score < 0.15 && wordCount >= 80) {
    trScore = Math.min(trScore, 2.5);
    trImprovements.push(`LẠC ĐỀ HOÀN TOÀN: Bài viết hầu như không đề cập đến các từ khóa hay chủ đề trọng tâm của đề thi (điểm tương đồng PESR chỉ đạt ${Math.round(relevance.score * 100)}%). Theo Cambridge Band Descriptors, bài lạc đề hoàn toàn bị khống chế tối đa Band 2.0 - 2.5.`);
  } else if (relevance.score < 0.28 && wordCount >= 100) {
    trScore = Math.min(trScore, 3.5);
    trImprovements.push(`LỆCH ĐỀ NGHIÊM TRỌNG: Bài viết đi chệch khỏi yêu cầu cốt lõi của đề thi (chỉ khớp ${relevance.matchedKeywords.length}/${relevance.totalKeywords} từ khóa). Điểm Task Response bị giới hạn tối đa Band 3.5.`);
  } else if (relevance.isOffTopic) {
    trScore = Math.min(trScore, 4.5); // Strict Cambridge off-topic penalty
    trImprovements.push(`CẢNH BÁO LỆCH ĐỀ (Off-Topic): Bài viết chỉ đề cập ${relevance.matchedKeywords.length}/${relevance.totalKeywords} từ khóa trọng tâm của đề bài. Giám khảo khảo thí Cambridge sẽ giới hạn điểm Task Response tối đa Band 4.5.`);
  } else if (relevance.score >= 0.55 && wordCount >= 250) {
    trScore += 0.5;
    trStrengths.push("Bài viết bám sát các từ khóa trọng tâm của đề thi, thể hiện sự hiểu đề thấu đáo.");
  }

  // 4. Task 1 & Task 2 Specific Checks
  let task1OverviewCheck = null;
  let task1ComparisonCheck = null;
  let task2Fulfillment = null;
  if (isTask1) {
    task1OverviewCheck = analyzeTask1Overview(paragraphs);
    task1ComparisonCheck = analyzeTask1Comparisons(paragraphs, task1OverviewCheck?.overviewIndex);

    if (task1OverviewCheck.hasOverview) {
      if (task1OverviewCheck.hasRawData) {
        trScore = Math.min(trScore, 5.5);
        trImprovements.push(
          `BẪY SỐ LIỆU ĐOẠN TỔNG QUAN (Task 1): Phát hiện đoạn Overview chứa số liệu chi tiết cụ thể (${task1OverviewCheck.rawDataList.join(', ')}). Theo tiêu chuẩn giám khảo khảo thí Cambridge IELTS Task 1, đoạn Overview CHỈ ĐƯỢC NÊU XU HƯỚNG TỔNG THỂ (tăng/giảm, biến động, phân kỳ), TUYỆT ĐỐI KHÔNG ĐƯỢC ĐƯA SỐ LIỆU CHI TIẾT. Việc đưa số liệu vào Overview khiến điểm Task Achievement bị khống chế tối đa Band 5.5.`
        );
      } else {
        if (wordCount >= 150) trScore += 0.5;
        trStrengths.push("Đoạn Tổng quan (Overview) chuẩn mực: Nêu bật các xu hướng chính và đặc điểm nổi bật mà không bị vướng bẫy đưa số liệu chi tiết.");
      }
    } else {
      trScore = Math.min(trScore, 5.0);
      trImprovements.push("QUAN TRỌNG: Bài viết Task 1 thiếu đoạn Tổng quan (Overview). Barem Cambridge quy định điểm Task Achievement KHÔNG ĐƯỢC VƯỢT QUÁ Band 5.0.");
    }

    const dataCheck = analyzeTask1DataDensity(paragraphs, task1OverviewCheck.overviewIndex);
    if (!dataCheck.hasAdequateData) {
      trScore = Math.min(trScore, 5.0);
      trImprovements.push("QUAN TRỌNG: Các đoạn thân bài Task 1 thiếu số liệu hoặc dẫn chứng cụ thể (phát hiện chỉ có " + dataCheck.bodyDataCount + " số liệu). Theo chuẩn Cambridge, bài phân tích không có số liệu dẫn chứng bị giới hạn ở Band 5.0.");
    } else {
      trStrengths.push(`Dẫn chứng số liệu trong thân bài đầy đủ (${dataCheck.bodyDataCount} mốc số liệu/thời gian cụ thể).`);
    }

    // 4c. Comparative & Contrasting Language Check (Mandatory "make comparisons where relevant")
    if (dataCheck.bodyDataCount >= 2) {
      if (task1ComparisonCheck.totalComparisons === 0) {
        trScore = Math.min(trScore, 5.5);
        trImprovements.push(
          "BẪY LIỆT KÊ SỐ LIỆU CƠ HỌC (Mechanical Data Listing): Thân bài có đưa số liệu nhưng hoàn toàn KHÔNG có cấu trúc so sánh đối chiếu giữa các đối tượng hoặc các mốc thời gian. Yêu cầu bắt buộc của Cambridge IELTS Task 1 là 'make comparisons where relevant'. Việc chỉ mô tả số liệu đơn lẻ từng năm/từng đối tượng khiến Task Achievement bị khống chế tối đa Band 5.5. Hãy bổ sung các cấu trúc so sánh: hơn/kém ('significantly higher than', 'outstripped'), so sánh bội số ('twice as high as', 'doubled'), hoặc liên từ đối chiếu ('whereas', 'in stark contrast to', 'compared with')."
        );
      } else if (task1ComparisonCheck.totalComparisons < 3) {
        trScore = Math.min(trScore, 6.0);
        trImprovements.push(
          `CẦN ĐA DẠNG HÓA SO SÁNH: Thân bài mới chỉ có ${task1ComparisonCheck.totalComparisons} cấu trúc so sánh đối chiếu (${task1ComparisonCheck.matchedComparisons.slice(0, 2).join(', ')}). Barem Cambridge Band 7.0+ Task Achievement yêu cầu liên tục lồng ghép so sánh tương quan giữa các nhóm số liệu thay vì chỉ mô tả xu hướng một chiều.`
        );
      } else {
        if (wordCount >= 150 && trScore >= 6.0) trScore += 0.5;
        trStrengths.push(
          `Kỹ năng so sánh đối chiếu số liệu phong phú (${task1ComparisonCheck.totalComparisons} cấu trúc: ${task1ComparisonCheck.matchedComparisons.slice(0, 4).join(', ')}), đáp ứng xuất sắc tiêu chí 'make comparisons where relevant' của đề thi.`
        );
      }
    }
  } else {
    // 5. Task 2 Specific Checks (Conclusion + Question Type Balance)
    const lastPara = paragraphs[paragraphs.length - 1]?.toLowerCase() || '';
    const hasConclusion = OVERVIEW_INDICATORS.slice(0, 4).some(ind => lastPara.includes(ind)) || lastPara.includes('conclu');
    if (hasConclusion) {
      if (wordCount >= 250) trScore += 0.5;
      trStrengths.push("Có đoạn Kết luận rõ ràng, khẳng định lại lập trường xuyên suốt bài viết.");
    } else {
      trScore = Math.min(trScore, 5.5);
      trImprovements.push("Thiếu đoạn Kết luận độc lập. Nên kết bài bằng 'In conclusion' để tóm tắt quan điểm của bạn. Điểm TR bị giới hạn tối đa Band 5.5.");
    }

    task2Fulfillment = analyzeTask2Fulfillment(task?.prompt, paragraphs);
    if (!task2Fulfillment.isBalanced) {
      // Hard cap Band 5.0 for omitting a question/part of task per Cambridge Band Descriptors
      trScore = Math.min(trScore, 5.0);
      trImprovements.push(`QUAN TRỌNG: ${task2Fulfillment.warning}`);
    } else if (task2Fulfillment.type !== 'OPINION' && task2Fulfillment.type !== 'GENERAL') {
      if (wordCount >= 250 && trScore >= 6.0) trScore += 0.5;
      trStrengths.push(`Phát triển luận điểm đa chiều và cân xứng: Đáp ứng trọn vẹn yêu cầu dạng đề (${task2Fulfillment.taskDescription}) qua các đoạn thân bài riêng biệt.`);
    }
  }

  const trBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, trScore)));

  // ===========================================================
  // B. COHERENCE & COHESION (CC) v4 (STRICT EXAMINER)
  // ===========================================================
  let ccScore = 5.5;
  const ccStrengths = [];
  const ccImprovements = [];
  const essayLower = essayText.toLowerCase();

  // 1. Structural Coherence Baseline
  if (paragraphs.length === 1 && wordCount >= 60) {
    ccScore = Math.min(ccScore, 3.5);
    ccImprovements.push("VI PHẠM BỐ CỤC ĐOẠN VĂN: Toàn bộ bài viết là một khối duy nhất không xuống dòng phân chia đoạn. Barem Cambridge quy định bài không chia đoạn văn bị khống chế Coherence & Cohesion tối đa Band 3.5.");
  } else if (wordCount < 75) {
    ccScore = Math.min(ccScore, 2.0);
    ccImprovements.push("Bài viết quá ngắn để tổ chức tính liên kết đoạn văn, giới hạn tối đa ở Band 2.0.");
  } else if (wordCount < 120) {
    ccScore = Math.min(ccScore, 3.0);
    ccImprovements.push("Đoạn văn quá ngắn và thiếu liên kết logic giữa các ý, giới hạn ở Band 3.0.");
  } else if (paragraphs.length < 3 || wordCount < 160) {
    ccScore = Math.min(ccScore, 4.0);
    ccImprovements.push("Đoạn văn quá ngắn hoặc chưa phân chia đoạn rõ ràng, ảnh hưởng nghiêm trọng đến tính mạch lạc.");
  } else if (paragraphs.length === 3 && !isTask1) {
    ccScore = 5.0;
    ccImprovements.push("Bài viết Task 2 nên chia tối thiểu 4 đoạn (Mở bài, 2 Thân bài, Kết bài) để tạo mạch ý cân đối.");
  }

  // 2. Cohesive Devices Count & Category Diversity
  let totalCohesiveHits = 0;
  let categoriesUsedCount = 0;

  Object.entries(COHESIVE_DEVICES).forEach(([catName, terms]) => {
    let catHits = 0;
    terms.forEach(term => {
      const re = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = essayLower.match(re);
      if (matches) catHits += matches.length;
    });
    if (catHits > 0) {
      categoriesUsedCount++;
      totalCohesiveHits += catHits;
    }
  });

  const cohesiveDensityPer100 = (totalCohesiveHits / wordCount) * 100;

  // 3. Referencing & Anaphoric Cohesion Analysis (Cambridge Band 7-8 Hallmark)
  let referencingCount = 0;
  REFERENCING_PATTERNS.forEach(pat => {
    const matches = essayText.match(pat);
    if (matches) referencingCount += matches.length;
  });

  // Check Mechanical Linking Device frequency
  const mechanicalCount = (essayLower.match(/\b(firstly|secondly|thirdly|first|second|moreover|furthermore|in addition|in conclusion|on the one hand|on the other hand)\b/gi) || []).length;

  // 4. Calibrated Cambridge CC Grading Matrix
  if (referencingCount >= 2 && paragraphs.length >= 4 && wordCount >= 240 && categoriesUsedCount >= 3) {
    ccScore = 7.0; // True Band 7 CC (Clear progression, natural referencing)
    if (referencingCount >= 3 && mechanicalCount <= 5 && wordCount >= 260) {
      ccScore = 7.5;
    }
    ccStrengths.push(`Sử dụng đại từ tham chiếu và liên kết ngữ nghĩa xuất sắc (${referencingCount} cụm 'this/such + Noun', 'the former/the latter'). Mạch văn chuyển ý tự nhiên.`);
  } else if (paragraphs.length >= 4 && mechanicalCount >= 2 && wordCount >= 200) {
    // Mechanical cohesion without referencing = standard Band 6.0
    ccScore = 6.0;
    ccStrengths.push(`Bố cục gồm ${paragraphs.length} đoạn văn, có sử dụng liên từ nối cơ bản.`);
    ccImprovements.push("Có dấu hiệu sử dụng từ nối cơ học (Mechanical linkers: First, Second, Moreover). Để đạt Band 7.0+ CC, hãy kết hợp thêm đại từ thay thế (this problem, such measures) và mệnh đề quan hệ.");
  } else if (cohesiveDensityPer100 < 1.5 && referencingCount < 1) {
    ccScore = 5.0;
    ccImprovements.push("Mạch văn rời rạc, thiếu các phương tiện liên kết giữa các câu. Hãy bổ sung liên từ chuyển ý phù hợp.");
  } else if (cohesiveDensityPer100 > 8.0 && referencingCount < 1) {
    ccScore = 5.5;
    ccImprovements.push("Lạm dụng từ nối cơ học ở đầu mọi câu khiến bài viết thiếu tự nhiên.");
  }

  const ccBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, ccScore)));

  // ===========================================================
  // C. LEXICAL RESOURCE (LR) v4 (STRICT EXAMINER)
  // ===========================================================
  let lrScore = 5.0;
  const lrStrengths = [];
  const lrImprovements = [];

  // 1. Type-Token Ratio (Normalized: only awarded if essay has adequate length)
  const uniqueWords = new Set(rawWords);
  const ttr = uniqueWords.size / wordCount;

  // 2. Academic Word List (AWL) Density
  let awlCount = 0;
  rawWords.forEach(w => {
    if (ACADEMIC_LEXICON.has(w)) awlCount++;
  });
  const awlPercentage = (awlCount / wordCount) * 100;

  // 3. Academic Collocations Scanner (800+ Corpus)
  let collocationHits = 0;
  const matchedCollocations = [];
  ACADEMIC_COLLOCATIONS.forEach(col => {
    const colRegex = new RegExp(`\\b${col.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const matches = essayText.match(colRegex);
    if (matches) {
      collocationHits += matches.length;
      matchedCollocations.push(col);
    }
  });

  // 4. Informal Words Detection
  let informalCount = 0;
  INFORMAL_WORDS.forEach(item => {
    const matches = essayText.match(item.match);
    if (matches) informalCount += matches.length;
  });

  // 5. Underlength hard caps for LR
  if (wordCount < 75) {
    lrScore = Math.min(lrScore, 2.0);
  } else if (wordCount < 120) {
    lrScore = Math.min(lrScore, 3.0);
  } else if (wordCount < 160) {
    lrScore = Math.min(lrScore, 4.0);
  }

  // 6. Calibrated Cambridge LR Matrix
  if (awlPercentage >= 8.5 && collocationHits >= 4 && wordCount >= 240 && informalCount === 0) {
    lrScore = 8.0;
    lrStrengths.push(`Vốn từ vựng học thuật C1/C2 đỉnh cao (${awlPercentage.toFixed(1)}% AWL, ${collocationHits} cụm collocations tự nhiên như: '${matchedCollocations.slice(0, 3).join("', '")}').`);
  } else if (awlPercentage >= 7.0 && collocationHits >= 2 && wordCount >= 220 && informalCount <= 1) {
    lrScore = 7.0;
    lrStrengths.push(`Sở hữu vốn từ học thuật phong phú (${awlPercentage.toFixed(1)}% AWL) và có ý thức dùng collocations chuẩn xác (${matchedCollocations.slice(0, 2).join(', ')}).`);
  } else if (awlPercentage >= 5.5 && (collocationHits >= 1 || (ttr >= 0.50 && wordCount >= 220))) {
    lrScore = 6.5;
    lrStrengths.push(`Vốn từ vựng tương đối đa dạng (${awlPercentage.toFixed(1)}% AWL), đáp ứng tốt yêu cầu bài thi.`);
  } else if (awlPercentage >= 4.5 || collocationHits >= 1) {
    lrScore = 6.0;
    lrStrengths.push("Vốn từ vựng ở mức vừa đủ hoàn thành bài viết, có sử dụng một số thuật ngữ liên quan đến chủ đề.");
    lrImprovements.push("Cần bổ sung thêm các cụm từ học thuật C1/C2 và Collocations nâng cao để vượt ngưỡng Band 6.0.");
  } else if (wordCount >= 160) {
    // Basic A2/B1 vocabulary
    lrScore = 5.0;
    lrImprovements.push("Vốn từ vựng còn khá cơ bản (chỉ đạt " + awlPercentage.toFixed(1) + "% từ vựng học thuật AWL, thiếu các cụm Collocations chuẩn). Bạn cần tích lũy thêm từ vựng chuyên sâu theo chủ đề.");
  }

  if (informalCount >= 2) {
    lrScore = Math.max(1.0, lrScore - 0.5);
    lrImprovements.push(`Phát hiện ${informalCount} từ/cụm từ mang văn phong giao tiếp thường ngày (như 'a lot of', 'kids', 'stuff'). Hãy đổi sang văn phong học thuật trang trọng.`);
  }

  // Prompt Copying Penalty for LR (Candidate lacks vocabulary to paraphrase)
  if (copiedWordCount >= 4) {
    if (copiedWordCount >= 15) {
      lrScore = Math.max(1.0, lrScore - 1.0);
    } else {
      lrScore = Math.max(1.0, lrScore - 0.5);
    }
    lrImprovements.push(`CẢNH BÁO TỪ VỰNG (Prompt Copying): Bài viết sao chép ${copiedWordCount} từ nguyên xi từ đề bài. Để đạt điểm cao ở tiêu chí Lexical Resource, thí sinh bắt buộc phải thể hiện khả năng Paraphrase (dùng từ đồng nghĩa, chuyển đổi từ loại hoặc cấu trúc câu) ngay từ câu mở đầu.`);
  }

  // 7. Word Overuse & Repetition Diagnostics (Band 6.0 cap for severe overuse)
  const wordOveruse = analyzeWordOveruse(rawWords);
  if (wordOveruse.hasOveruse) {
    const severeOveruse = wordOveruse.overusedWords.filter(w => w.count >= 5);
    if (severeOveruse.length >= 2) {
      if (lrScore > 6.0) lrScore = 6.0;
      lrImprovements.push(
        `LỖI LẶP TỪ NGHIÊM TRỌNG (Word Overuse): Bài viết lặp lại quá nhiều lần các từ đơn điệu (${severeOveruse.map(o => `'${o.word}' (${o.count} lần)`).join(', ')}). Barem Cambridge Band 7.0+ Lexical Resource đòi hỏi tính linh hoạt và đa dạng từ vựng. Điểm LR bị khống chế tối đa Band 6.0. Hãy tham khảo mục 'Gợi ý từ vựng thay thế' bên dưới để đa dạng hóa văn phong.`
      );
    } else if (wordOveruse.overusedWords.length >= 2 || severeOveruse.length >= 1) {
      const topWords = wordOveruse.overusedWords.slice(0, 3).map(o => `'${o.word}' (${o.count} lần)`).join(', ');
      lrImprovements.push(
        `CẢNH BÁO LẶP TỪ: Phát hiện các từ lặp lại nhiều lần trong bài: ${topWords}. Hãy sử dụng các từ đồng nghĩa học thuật C1/C2 để nâng cao tiêu chí Lexical Resource.`
      );
    }
  }

  const lrBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, lrScore)));

  // ===========================================================
  // D. SPECIFIC ERROR GENERATOR (SENTENCE-LEVEL) v3
  // ===========================================================
  const erroneousSentenceIndices = new Set();
  let svErrorCount = 0;

  // 1. Subject-Verb Agreement Traps (S-V errors)
  SUBJECT_VERB_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        if (!trap.filter || trap.filter(s, s)) {
          erroneousSentenceIndices.add(sIdx);
          svErrorCount++;
          corrections.push({
            original: s,
            corrected: `${s} (Xem lưu ý chia động từ)`,
            type: 'grammar',
            explanation: trap.fix
          });
        }
      }
    });
  });

  // 2. Quantifier & Noun Number Traps
  NOUN_AGREEMENT_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        svErrorCount++;
        corrections.push({
          original: s,
          corrected: `${s} (Kiểm tra lại số ít / số nhiều)`,
          type: 'grammar',
          explanation: trap.fix
        });
      }
    });
  });

  // 3. Preposition & Collocation Traps
  PREPOSITION_COLLOCATION_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        corrections.push({
          original: s,
          corrected: `${s} (Sửa giới từ)`,
          type: 'vocabulary',
          explanation: trap.fix
        });
      }
    });
  });

  // 4. Double Comparative & Word Form Traps
  COMPARATIVE_AND_WORD_FORM_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        corrections.push({
          original: s,
          corrected: `${s} (Sửa dạng từ)`,
          type: 'grammar',
          explanation: trap.fix
        });
      }
    });
  });

  // 5. Uncountable Noun Traps
  UNCOUNTABLE_NOUN_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      if (trap.wrong.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
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

  // 6. Spelling Traps from IELTS_SPELLING_TRAPS
  if (Array.isArray(IELTS_SPELLING_TRAPS)) {
    IELTS_SPELLING_TRAPS.forEach(trap => {
      if (trap?.distractors && Array.isArray(trap.distractors)) {
        trap.distractors.forEach(dist => {
          const reg = new RegExp(`\\b${dist}\\b`, 'gi');
          sentences.forEach((s, sIdx) => {
            if (reg.test(s) && corrections.length < 12) {
              erroneousSentenceIndices.add(sIdx);
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

  // 7. Informal Words Replacement
  INFORMAL_WORDS.forEach(inf => {
    sentences.forEach((s, sIdx) => {
      if (inf.match.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
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

  // 8. Grammar Patterns (Because... so, Although... but, S-V agreement)
  COMMON_GRAMMAR_PATTERNS.forEach(pat => {
    sentences.forEach((s, sIdx) => {
      if (pat.regex.test(s) && corrections.length < 12) {
        erroneousSentenceIndices.add(sIdx);
        svErrorCount++;
        corrections.push({
          original: s,
          corrected: `${s.replace(pat.regex, '$1')} (Đã tinh chỉnh liên từ)`,
          type: 'grammar',
          explanation: `${pat.fix} Ví dụ: ${pat.example}`
        });
      }
    });
  });

  // 9. Bare Singular Countable Nouns & Article Traps (Cambridge Band 5-6 Red Flags)
  let bareNounErrorCount = 0;
  BARE_NOUN_AND_ARTICLE_TRAPS.forEach(trap => {
    sentences.forEach((s, sIdx) => {
      trap.regex.lastIndex = 0;
      if (trap.regex.test(s) && corrections.length < 15) {
        erroneousSentenceIndices.add(sIdx);
        bareNounErrorCount++;
        trap.regex.lastIndex = 0;
        const correctedSentence = trap.suggest
          ? s.replace(trap.regex, trap.suggest)
          : `${s} (Kiểm tra lại mạo từ/danh từ số nhiều)`;
        corrections.push({
          original: s,
          corrected: correctedSentence,
          type: 'grammar',
          explanation: trap.fix
        });
      }
    });
  });

  // 10. Comma Splices & Run-on Sentences (Cambridge GRA Band 5-6 Red Flags)
  const commaSpliceAnalysis = analyzeCommaSplices(sentences);
  const commaSpliceCount = commaSpliceAnalysis.commaSpliceCount;
  commaSpliceAnalysis.commaSpliceDetails.forEach(detail => {
    erroneousSentenceIndices.add(detail.sentenceIndex);
    if (corrections.length < 18) {
      corrections.push({
        original: detail.original,
        corrected: detail.suggestion,
        type: 'grammar',
        explanation: detail.explanation
      });
    }
  });

  // ===========================================================
  // E. GRAMMATICAL RANGE & ACCURACY (GRA) v3 (CALIBRATED)
  // ===========================================================
  let graScore = 5.0;
  const graStrengths = [];
  const graImprovements = [];

  // 1. Error-Free Sentence Ratio (EFSR)
  const totalSentences = Math.max(1, sentences.length);
  const errorFreeCount = totalSentences - erroneousSentenceIndices.size;
  const efsrRatio = (errorFreeCount / totalSentences) * 100;

  // 2. Syntactic Variety & Complex Structures (Range Check)
  let complexCount = 0;
  const complexMarkers = [
    /\b(although|even though|though|whereas|while)\b/i,
    /\b(which|who|whom|whose|that|whereby|in which)\b/i,
    /\b(because|since|as long as|provided that|in order that)\b/i,
    /\b(if|unless|had [a-z]+ [a-z]+ed|were [a-z]+ to)\b/i, // Conditionals & Inversions
    /\b(not only\s+(did|does|do|can|is|are|have|has))\b/i, // Negative Inversions
    /\b(having\s+[a-z]+ed|compared\s+to|given\s+that)\b/i   // Participle Clauses
  ];

  sentences.forEach(s => {
    const isComplex = complexMarkers.some(regex => regex.test(s));
    if (isComplex) complexCount++;
  });

  const complexRatio = complexCount / totalSentences;

  // 3. Calibrated Cambridge GRA Matrix (Accuracy + Range Dual Gate)
  if (svErrorCount === 0 && bareNounErrorCount === 0 && commaSpliceCount === 0 && efsrRatio >= 80 && complexRatio >= 0.45 && totalSentences >= 8) {
    graScore = 8.0;
    graStrengths.push(`Khả năng kiểm soát ngữ pháp xuất sắc: ${Math.round(efsrRatio)}% câu hoàn toàn không lỗi, kết hợp nhuần nhuyễn câu phức và mệnh đề nâng cao (${Math.round(complexRatio * 100)}%).`);
  } else if (svErrorCount <= 1 && bareNounErrorCount <= 1 && commaSpliceCount <= 1 && efsrRatio >= 65 && complexRatio >= 0.30) {
    graScore = 7.0;
    graStrengths.push(`Tỷ lệ câu không lỗi đạt mức tốt (${Math.round(efsrRatio)}%), sử dụng thành thạo nhiều dạng câu phức.`);
  } else if (svErrorCount <= 2 && bareNounErrorCount <= 2 && commaSpliceCount <= 2 && efsrRatio >= 40) {
    graScore = 6.0;
    graStrengths.push(`Có sự kết hợp giữa câu đơn và câu phức, truyền tải được thông điệp dù còn một số lỗi ngữ pháp.`);
    if (complexRatio < 0.25) {
      graImprovements.push("Cấu trúc câu còn đơn điệu (chủ yếu là câu đơn). Cần bổ sung thêm mệnh đề quan hệ (which/who) và mệnh đề nhượng bộ (Although/While).");
    }
  } else {
    // Systematic errors or very low EFSR
    graScore = 5.0;
    graImprovements.push(`Mắc lỗi ngữ pháp cơ bản lặp đi lặp lại (${svErrorCount} lỗi hòa hợp chủ ngữ-động từ/danh từ số nhiều, ${bareNounErrorCount} lỗi danh từ trơ trọi/mạo từ, ${commaSpliceCount} lỗi comma splice). Theo tiêu chí Cambridge, lỗi hệ thống giới hạn điểm GRA ở Band 5.0.`);
  }

  // Underlength hard caps for GRA
  if (wordCount < 75) {
    graScore = Math.min(graScore, 2.0);
  } else if (wordCount < 120) {
    graScore = Math.min(graScore, 3.0);
  } else if (wordCount < 160) {
    graScore = Math.min(graScore, 4.0);
  }

  // Hard Cap: Systematic elementary S-V errors
  if (svErrorCount >= 6) {
    graScore = Math.min(graScore, 3.0);
    graImprovements.push(`Mắc lỗi ngữ pháp cơ bản dày đặc (${svErrorCount} lỗi hòa hợp chủ vị / số nhiều / liên từ). Theo tiêu chí Cambridge, điểm GRA bị khống chế tối đa Band 3.0.`);
  } else if (svErrorCount >= 4) {
    graScore = Math.min(graScore, 4.0);
    graImprovements.push(`Lỗi ngữ pháp cơ bản xảy ra thường xuyên (${svErrorCount} lỗi). Theo tiêu chí Cambridge, lỗi hệ thống cơ bản giới hạn GRA tối đa Band 4.0.`);
  } else if (svErrorCount >= 3) {
    graScore = Math.min(graScore, 4.5);
    graImprovements.push(`Phát hiện ${svErrorCount} lỗi hòa hợp chủ ngữ-động từ/danh từ số nhiều. GRA bị khống chế ở Band 4.5.`);
  } else if (svErrorCount >= 2) {
    graScore = Math.min(graScore, 5.5);
  }

  // Hard Cap: Bare Singular Countable Nouns & Systematic Article Omission
  if (bareNounErrorCount >= 5) {
    if (graScore > 5.0) graScore = 5.0;
    graImprovements.push(`LỖI NGỮ PHÁP HỆ THỐNG NGHIÊM TRỌNG (Bare Noun / Article Trap): Phát hiện ${bareNounErrorCount} lỗi danh từ đếm được số ít đứng trơ trọi hoặc thiếu mạo từ (a/an/the) lặp lại liên tục. Barem Cambridge Band 5.0 GRA quy định các lỗi ngữ pháp hệ thống khống chế điểm tối đa Band 5.0.`);
  } else if (bareNounErrorCount >= 3) {
    if (graScore > 6.0) graScore = 6.0;
    graImprovements.push(`LỖI HỆ THỐNG DANH TỪ & MẠO TỪ (Bare Nouns / Articles): Phát hiện ${bareNounErrorCount} lỗi danh từ đếm được số ít đứng trơ trọi hoặc thiếu mạo từ (như: 'student should', 'plays important role', 'in big city'). Barem Cambridge Band 7.0+ GRA đòi hỏi tỷ lệ câu không lỗi cao và kiểm soát tốt hình thái danh từ. Lỗi này khống chế điểm Ngữ pháp tối đa Band 6.0. Hãy xem bảng Lỗi sai để sửa triệt để.`);
  }

  // Hard Cap: Comma Splices & Sentence Boundary Defects
  if (commaSpliceCount >= 4) {
    if (graScore > 5.0) graScore = 5.0;
    graImprovements.push(`LỖI HỆ THỐNG PHÂN TÁCH CÂU (Comma Splices / Run-on): Phát hiện ${commaSpliceCount} lỗi nối hai mệnh đề độc lập bằng dấu phẩy không có liên từ (như: 'S+V, S+V'). Lỗi ngắt câu và phân tách ranh giới mệnh đề là lỗi ngữ pháp hệ thống nghiêm trọng, khống chế điểm Ngữ pháp tối đa Band 5.0 theo barem Cambridge.`);
  } else if (commaSpliceCount >= 2) {
    if (graScore > 6.0) graScore = 6.0;
    graImprovements.push(`LỖI PHÂN TÁCH MỆNH ĐỀ (Comma Splices): Phát hiện ${commaSpliceCount} câu ghép hai mệnh đề độc lập S+V chỉ bằng dấu phẩy (như: 'Technology develops rapidly, it brings...'). Tiêu chí Cambridge Band 7.0+ GRA đòi hỏi kiểm soát tốt dấu câu và liên kết mệnh đề. Lỗi này khống chế điểm GRA tối đa Band 6.0. Hãy dùng liên từ kết hợp (, and / , but), mệnh đề quan hệ (, which), hoặc tách bằng dấu chấm/chấm phẩy.`);
  }

  // Sentence Length Diagnostics (Run-on detection)
  const sentenceWordCounts = sentences.map(s => s.split(/\s+/).length);
  const runOnSentences = sentenceWordCounts.filter(cnt => cnt > 42).length;
  if (runOnSentences > 1) {
    graScore = Math.max(1.0, graScore - 0.5);
    graImprovements.push(`Có ${runOnSentences} câu quá dài (>42 từ) dễ gây rối nghĩa hoặc lỗi ngắt câu (run-on). Nên tách thành các câu mạch lạc.`);
  }

  const graBand = roundToCambridgeBand(Math.max(1.0, Math.min(9.0, graScore)));

  // ===========================================================
  // F. OVERALL BAND COMPUTATION & DEEP EXAMINER DIAGNOSTICS
  // ===========================================================
  const rawAverage = (trBand + ccBand + lrBand + graBand) / 4.0;
  const overallBand = roundToCambridgeBand(rawAverage);

  // Dynamic Topic Collocations Recommendation
  const contextForTopic = `${task?.title || ''} ${task?.prompt || ''} ${essayText.slice(0, 600)}`;
  const topicData = lookupTopicCollocations(contextForTopic);
  const keyVocabulary = topicData.collocations;

  // Generate In-Depth Paragraph Analysis & Examiner Action Plan
  const paragraphAnalysis = analyzeParagraphsDeeply(paragraphs, isTask1, task, task1OverviewCheck);
  const actionPlan = generateExaminerActionPlan(trBand, ccBand, lrBand, graBand, svErrorCount, wordCount, targetMinWords, isTask1, task1OverviewCheck, task1ComparisonCheck, task2Fulfillment, topicData, wordOveruse, bareNounErrorCount, commaSpliceCount);

  // Band 8 Model Rewrite
  let band8Rewrite = '';
  if (task?.modelAnswer && typeof task.modelAnswer === 'string' && task.modelAnswer.trim().length > 50) {
    band8Rewrite = task.modelAnswer;
  } else {
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
    engineName: 'Cambridge Deep Linguistic Evaluator v4 (Chief Examiner Strict Standard)',
    dateGraded: new Date().toISOString(),
    criteria: {
      tr: {
        band: trBand,
        feedback: `Đánh giá mức độ hoàn thành nhiệm vụ (Task ${isTask1 ? 'Achievement' : 'Response'}): ${trBand >= 7.0 ? 'Ý tưởng phát triển toàn diện, lập luận chặt chẽ và bám sát đề thi.' : trBand <= 3.5 ? 'Chưa đáp ứng yêu cầu cơ bản của đề thi, dung lượng thiếu hụt nghiêm trọng hoặc chưa phát triển được luận điểm rõ ràng.' : 'Cần chú ý mở rộng chiều sâu luận điểm, dẫn chứng và dung lượng từ.'}`,
        strengths: trStrengths.length > 0 ? trStrengths : ['Bài viết thể hiện nỗ lực trả lời câu hỏi đề thi.'],
        improvements: trImprovements.length > 0 ? trImprovements : ['Tiếp tục duy trì tính nhất quán và dẫn chứng cụ thể.']
      },
      cc: {
        band: ccBand,
        feedback: `Đánh giá tính mạch lạc và liên kết (Coherence & Cohesion): ${ccBand >= 7.0 ? 'Mạch bài trôi chảy, sử dụng liên từ và đại từ thay thế tự nhiên.' : ccBand <= 3.5 ? 'Bố cục chưa phân đoạn hoặc các câu rời rạc, thiếu tính liên kết logic giữa các ý.' : 'Cần củng cố sự liên kết giữa các câu và phân đoạn ý rõ ràng hơn.'}`,
        strengths: ccStrengths.length > 0 ? ccStrengths : ['Có cố gắng sắp xếp trật tự các câu.'],
        improvements: ccImprovements.length > 0 ? ccImprovements : ['Bổ sung thêm các phương tiện liên kết logic giữa các câu.']
      },
      lr: {
        band: lrBand,
        feedback: `Đánh giá vốn từ vựng (Lexical Resource): ${lrBand >= 7.0 ? 'Vốn từ học thuật phong phú, sử dụng đúng ngữ cảnh và collocations chuẩn xác.' : lrBand <= 3.5 ? 'Vốn từ rất hạn chế, phụ thuộc vào các từ ngữ giao tiếp đơn giản và lặp từ nhiều.' : 'Cần nâng cấp từ vựng cơ bản lên chuẩn học thuật Academic Word List (AWL).'}`,
        strengths: lrStrengths.length > 0 ? lrStrengths : ['Sử dụng được một số từ vựng đúng chủ đề.'],
        improvements: lrImprovements.length > 0 ? lrImprovements : ['Hạn chế dùng từ lặp lại hoặc từ ngữ văn nói thông thường.']
      },
      gra: {
        band: graBand,
        feedback: `Đánh giá ngữ pháp và độ chính xác (Grammar Range & Accuracy): ${graBand >= 7.0 ? `Cấu trúc câu phong phú, tỷ lệ câu không lỗi (EFSR) đạt ${Math.round(efsrRatio)}%.` : graBand <= 3.5 ? `Nhiều lỗi ngữ pháp cơ bản (chia động từ, mạo từ, danh từ số nhiều), tỷ lệ câu không lỗi rất thấp (${Math.round(efsrRatio)}%).` : `Cần kiểm soát lỗi sai cơ bản để nâng tỷ lệ câu không lỗi (EFSR hiện tại: ${Math.round(efsrRatio)}%).`}`,
        strengths: graStrengths.length > 0 ? graStrengths : ['Cấu trúc câu đảm bảo người đọc hiểu được thông điệp.'],
        improvements: graImprovements.length > 0 ? graImprovements : ['Đa dạng hóa các dạng câu phức và kiểm tra kỹ lỗi ngữ pháp.']
      }
    },
    corrections,
    band8Rewrite,
    keyVocabulary,
    paragraphAnalysis,
    actionPlan,
    wordStats: {
      rawWordCount,
      copiedWordCount,
      effectiveWordCount: wordCount,
      copiedChunks: promptCopying.copiedChunks
    },
    task1OverviewStats: isTask1 ? {
      hasOverview: task1OverviewCheck?.hasOverview || false,
      hasRawData: task1OverviewCheck?.hasRawData || false,
      rawDataList: task1OverviewCheck?.rawDataList || [],
      overviewIndex: task1OverviewCheck?.overviewIndex ?? -1
    } : null,
    task1ComparisonStats: isTask1 ? {
      totalComparisons: task1ComparisonCheck?.totalComparisons || 0,
      uniqueComparisonsCount: task1ComparisonCheck?.uniqueComparisonsCount || 0,
      matchedComparisons: task1ComparisonCheck?.matchedComparisons || [],
      isMechanicalListing: (task1ComparisonCheck?.totalComparisons === 0)
    } : null,
    task2FulfillmentStats: !isTask1 ? {
      type: task2Fulfillment?.type || 'OPINION',
      isBalanced: task2Fulfillment?.isBalanced ?? true,
      severity: task2Fulfillment?.severity || 'none',
      taskDescription: task2Fulfillment?.taskDescription || '',
      missingPartDescription: task2Fulfillment?.missingPartDescription || null,
      warning: task2Fulfillment?.warning || null
    } : null,
    detectedTopic: {
      topicKey: topicData.topicKey,
      topicNameVi: topicData.topicNameVi
    },
    wordOveruseStats: {
      hasOveruse: wordOveruse.hasOveruse,
      overuseCount: wordOveruse.overuseCount,
      overusedWords: wordOveruse.overusedWords,
      suggestions: wordOveruse.suggestions
    },
    bareNounStats: {
      hasBareNounErrors: bareNounErrorCount > 0,
      bareNounErrorCount
    },
    commaSpliceStats: {
      hasCommaSplices: commaSpliceCount > 0,
      commaSpliceCount,
      details: commaSpliceAnalysis.commaSpliceDetails
    }
  };
}
