/**
 * src/services/evaluation/evaluationRuleCatalogs.js
 *
 * CAMBRIDGE LINGUISTIC KNOWLEDGE BASES & GRAMMAR/LEXICAL RULE CATALOGS
 * Extracted from algorithmicEvaluationService.js (Phase 3 Modular Architecture)
 */

// Common English Stopwords (for Prompt Keyword Extraction)
export const STOPWORDS = new Set([
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
export const ACADEMIC_LEXICON = new Set([
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
export const ACADEMIC_COLLOCATIONS = [
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
export const COHESIVE_DEVICES = {
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
  ],
  transition: [
    'overall', 'turning to', 'regarding', 'in terms of', 'concurrently',
    'simultaneously', 'meanwhile', 'with regard to', 'with respect to',
    'as for', 'as regards', 'at the same time'
  ]
};

// Referencing & Anaphoric Substitution Markers (Cambridge Band 7-8 CC Indicators)
export const REFERENCING_PATTERNS = [
  /\b(this|these|such)\s+(?:[a-z]+\s+)?(trend|phenomenon|issue|problem|tendency|pattern|shift|disparity|measure|approach|dilemma|finding|outcome|consequence|initiative|transition|transformation|strategy|policy|alternative|development|paradigm|space|area|zone|material|compound|cylinder|mixture|product|facility|structure|step|phase|stage|process|constituent|equipment)\b/gi,
  /\b(these|those)\s+(?:\w+\s+)?(features|changes|developments|materials|constituents|stages|steps|phases|facilities|amenities|measures|factors)\b/gi,
  /\bthe\s+former\b/gi,
  /\bthe\s+latter\b/gi,
  /\bin\s+doing\s+so\b/gi,
  /\bby\s+doing\s+so\b/gi,
  /\bwhich\s+(in\s+turn|subsequently|consequently)\b/gi
];

// Overview Indicators for IELTS Task 1 (Mandatory Cambridge Hard Cap)
export const OVERVIEW_INDICATORS = [
  'overall', 'in summary', 'to summarize', 'in general', 'it is noticeable that',
  'it is clear that', 'it is evident that', 'as can be seen from the chart',
  'the most prominent feature', 'the general trend', 'looking at the overall picture',
  'as an overall trend', 'it is apparent that', 'broadly speaking'
];

// Subject-Verb Agreement Traps (Cambridge Band 5-6 Red Flags)
export const SUBJECT_VERB_TRAPS = [
  {
    regex: /\b(he|she|it|this|that|everyone|everybody|someone|somebody|each)\s+(have|make|do|take|help|lead|show|provide|give|cause|play|bring|need|want|seem|tend|like|prefer|think|believe|create)\b/gi,
    fix: "Lỗi hòa hợp Chủ ngữ - Động từ: Chủ ngữ ngôi thứ 3 số ít (he/she/it/this/that/everyone...) phải đi với động từ số ít (has, makes, does, helps, likes, brings...)."
  },
  {
    regex: /\b([a-z]+ing)\s+([a-z]+\s+)?(have|are|were)\b/gi,
    filter: (match, p1) => ['wearing', 'studying', 'learning', 'using', 'working', 'living', 'reading', 'doing', 'getting', 'spending', 'providing', 'implementing'].includes(p1.toLowerCase()),
    fix: "Lỗi hòa hợp: Danh động từ làm chủ ngữ (V-ing) luôn tương đương với ngôi thứ 3 số ít, phải dùng động từ số ít (has / is / was)."
  },
  {
    regex: /\b(they|we|these|those)\s+(has|is|was|makes|does|leads|shows|provides|gives|causes|needs|wants|likes)\b/gi,
    fix: "Lỗi hòa hợp: Chủ ngữ số nhiều (they/we/these/those) phải đi với động từ số nhiều (have, are, were, make, lead...)."
  }
];

// Quantifier & Noun Number Traps
export const NOUN_AGREEMENT_TRAPS = [
  {
    regex: /\b(many|numerous|various|several|different|a lot of|lots of|two|three|four|both)\s+(student|child|person|reason|problem|factor|advantage|disadvantage|country|job|skill|school|way|benefit|individual|year|opinion|measure)\b/gi,
    fix: "Lỗi danh từ số nhiều: Sau các từ chỉ số lượng nhiều (many, several, various, both...), danh từ đếm được bắt buộc phải ở dạng số nhiều (-s / -es)."
  },
  {
    regex: /\b(every|each)\s+(students|children|persons|reasons|problems|factors|advantages|disadvantages|countries|jobs|skills|schools|ways|benefits|individuals|years|opinions|measures)\b/gi,
    fix: "Lỗi danh từ số ít: Sau 'each' và 'every', danh từ đếm được luôn ở dạng số ít."
  }
];

// Preposition & Collocation Errors
export const PREPOSITION_COLLOCATION_TRAPS = [
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
export const COMPARATIVE_AND_WORD_FORM_TRAPS = [
  { regex: /\bmore\s+(better|easier|faster|harder|cheaper|stronger|higher|lower|clearer)\b/gi, fix: "Lỗi so sánh kép (Double comparative): Không dùng 'more' trước tính từ ngắn đã có đuôi -er." },
  { regex: /\bcan\s+easy\b/gi, fix: "Sai từ loại: Sau trợ động từ 'can' dùng phó từ 'can easily'." },
  { regex: /\bcan\s+quick\b/gi, fix: "Sai từ loại: Dùng phó từ 'can quickly'." },
  { regex: /\bis\s+danger\b/gi, fix: "Sai từ loại: Sau to be dùng tính từ 'is dangerous' (thay vì danh từ 'danger')." }
];

// Uncountable Noun Plural Traps (Strict Cambridge Grammar Deductions)
export const UNCOUNTABLE_NOUN_TRAPS = [
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
export const INFORMAL_WORDS = [
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
export const BARE_NOUN_AND_ARTICLE_TRAPS = [
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
  {
    regex: /\b(that|think|thinks|believe|believes|argue|argues)\s+(government|company|university)\s+(should|must|can|could|will|would|needs?\s+to|has\s+to)\b/gi,
    fix: "Thiếu mạo từ trước danh từ thể chế: Dùng 'the government should' hoặc 'governments should'.",
    suggest: (match) => match.replace(/\b(government|company|university)\b/i, 'the $1')
  },
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
  {
    regex: /\b(in|into|from)\s+(big\s+city|modern\s+city|large\s+city|rural\s+area|urban\s+area)\b/gi,
    fix: "Thiếu mạo từ trước danh từ chỉ nơi chốn đếm được: Dùng 'in a big city' hoặc 'in big cities' (thay vì 'in big city').",
    suggest: (match) => match.replace(/^(in|into|from)\s+/i, '$1 a ')
  }
];

// Grammar & Mechanical Error Patterns
export const COMMON_GRAMMAR_PATTERNS = [
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
