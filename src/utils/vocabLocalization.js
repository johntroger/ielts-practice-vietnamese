/**
 * vocabLocalization.js
 * Comprehensive bilingual localization utilities for IELTS Vocabulary Notebook & SM-2 Flashcards.
 */

export const KNOWN_SEED_VOCAB_EN = {
  'catalyze novel industries': 'spur / stimulate emerging industries into existence',
  'pivotal element': 'crucial / essential component',
  'mitigate adverse effects': 'reduce / lessen harmful impacts',
  'upward trajectory': 'steady rising trend',
  'precipitous drop': 'sharp / dramatic decrease',
  'vital role': 'vital / essential role',
  'paramount importance': 'utmost / highest importance',
  'indispensable asset': 'essential / indispensable asset',
  'alleviate financial burdens': 'ease economic difficulties',
  'tackle unemployment': 'decisively address unemployment',
  'conducive to': 'favorable / advantageous for',
  'detrimental consequence': 'harmful / adverse outcome',
  'pernicious influence': 'subtly destructive influence',
  // Reading Paraphrase Hunter pairs
  'sự sụt giảm mạnh': 'a sharp decline / dramatic plunge',
  'chi phí sản xuất': 'manufacturing / production expenses',
  'tấm pin năng lượng mặt trời': 'photovoltaic panels / solar modules',
  'thúc đẩy, đẩy nhanh tốc độ': 'to accelerate / precipitate',
  'sự áp dụng, tiếp nhận': 'adoption / uptake',
  'năng lượng sạch/bền vững': 'clean / sustainable electricity',
  'mất ngủ kéo dài/mãn tính': 'chronic insomnia / prolonged sleeplessness',
  'gây tác động tiêu cực nặng nề': 'to severely damage / exert a detrimental impact on',
  'sự củng cố, ổn định': 'consolidation / stabilization',
  'kỷ niệm/ký ức theo sự kiện bản thân': 'episodic / autobiographical memories',
  'học sinh lứa tuổi thiếu niên': 'adolescent students / teenage learners',
  'mực nước biển dâng cao/xâm lấn': 'rising sea levels / encroaching waters',
  'đe dọa, đặt vào vòng nguy hiểm': 'to threaten / jeopardize',
  'sự nguyên vẹn và khả năng vận hành': 'operational integrity',
  'hạ tầng giao thông trọng yếu': 'essential transit networks / critical infrastructure',
  'các thành phố ven biển': 'coastal metropolises / littoral cities'
};

/**
 * Returns localized meaning for vocabulary item.
 * @param {Object|string} item - Vocabulary object with phrase, meaningVi, meaningEn or raw meaning string
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedVocabMeaning(item, isEn = false) {
  if (!item) return '';
  const rawMeaning = typeof item === 'object' ? (item.meaningVi || item.meaning || '') : String(item);
  if (!isEn) return rawMeaning;
  if (typeof item === 'object' && item.meaningEn) return item.meaningEn;
  
  const rawKey = rawMeaning.trim().toLowerCase();
  if (KNOWN_SEED_VOCAB_EN[rawKey]) {
    return KNOWN_SEED_VOCAB_EN[rawKey];
  }
  const phraseKey = (typeof item === 'object' && item.phrase ? item.phrase : '').trim().toLowerCase();
  if (KNOWN_SEED_VOCAB_EN[phraseKey]) {
    return KNOWN_SEED_VOCAB_EN[phraseKey];
  }
  return typeof item === 'object' ? (item.meaningEn || item.meaning || item.meaningVi || '') : rawMeaning;
}

export const THEMATIC_CARDS_MEANING_EN = {
  'c-tech-b5-1': 'Connect to the worldwide web reliably for academic study or personal work',
  'c-tech-b5-2': 'Handheld digital equipment such as smartphones, tablets, and laptops',
  'c-tech-b6-1': 'Modern electronic equipment utilizing computerized technology',
  'c-tech-b6-2': 'Progress and breakthroughs achieved in scientific and technological fields',
  'c-tech-b6-3': 'Interaction and exchange of information conducted through online digital platforms',
  'c-tech-b7-1': 'Business operations and recurring tasks executed autonomously via software and AI',
  'c-tech-b7-2': 'Groundbreaking technological breakthroughs that fundamentally transform existing industries',
  'c-tech-b7-3': 'The socioeconomic gap between individuals with internet access and those without',

  'c-env-b5-1': 'Preserve natural surroundings and ecosystems from contamination and harm',
  'c-env-b5-2': 'Contamination of atmospheric air and aquatic ecosystems by hazardous waste',
  'c-env-b6-1': 'Sustainable energy derived from inexhaustible natural sources like solar and wind',
  'c-env-b6-2': 'Non-renewable hydrocarbon fuels such as coal, petroleum, and natural gas',
  'c-env-b6-3': 'The harmonious state of equilibrium between living organisms and their environment',
  'c-env-b7-1': 'The total amount of greenhouse gases produced directly and indirectly by human activities',
  'c-env-b7-2': 'Pollutant gases and emissions originating from human industrial and commercial activities',
  'c-env-b7-3': 'The deterioration of the natural environment through depletion of resources and pollution',

  'c-soc-b5-1': 'A balanced, health-conscious way of living encompassing physical exercise and nutrition',
  'c-soc-b5-2': 'Chances and openings available in the labour market for gainful employment',
  'c-soc-b6-1': 'The average financial expenditure required to sustain daily living standards in a city',
  'c-soc-b6-2': 'Severe vehicle gridlock and delays occurring on roads during peak rush hours',
  'c-soc-b6-3': 'Tertiary academic education pursued at universities and graduate colleges',
  'c-soc-b7-1': 'Inequalities and unequal distribution of wealth, income, and privileges across social strata',
  'c-soc-b7-2': 'Structural changes in the composition of a population, such as an ageing demographic',
  'c-soc-b7-3': 'Uncontrolled, dispersed horizontal expansion of urban areas into surrounding rural land'
};

export const GRAMMAR_PACK_EN = {
  'gr-b5-1': {
    title: 'Subject-Verb Agreement with Complex Subjects',
    formula: 'The number of + Plural Noun + Singular Verb (is / has / V-s) | A number of + Plural Noun + Plural Verb (are / have / V)',
    rationale: 'Over 60% of test-takers at Band 5.0 - 5.5 lose GRA score due to misaligning verbs with intervening prepositional phrases (e.g., "The consumption of fast foods IS" rather than "ARE"). Fixing this is step one to securing Band 6.0+.',
    prompt: 'Correct the subject-verb agreement error in the sentence below to achieve grammatical accuracy:'
  },
  'gr-b5-2': {
    title: 'Compound Sentences & Eliminating Comma Splices',
    formula: 'Clause 1, and/but/so + Clause 2 OR Clause 1; however, Clause 2',
    rationale: 'Comma splices (joining independent clauses with only a comma) are a primary penalty factor keeping GRA at Band 5.0. Constructing compound sentences with coordinators is essential for Band 6.0.',
    prompt: 'Fix the comma splice error by adding an appropriate coordinating conjunction or semicolon:'
  },
  'gr-b5-3': {
    title: 'Logical Cause & Effect',
    formula: 'Because + Clause 1, Clause 2 OR S + V. As a result, S + V OR S + leads to / results in + Noun phrase',
    rationale: 'Avoid the common error of mixing "Because... so..." in the same sentence. Fluidly deploying "As a result" and "leads to" cements a solid Band 6.0 foundation.',
    prompt: 'Convert the cause-and-effect sentence below using "leads to" + Noun phrase:'
  },
  'gr-b6-1': {
    title: 'Complex Contrast & Concession',
    formula: 'While / Whereas / Although + Clause 1 (S + V), Clause 2 (S + V)',
    rationale: 'Band 6.0 requires writing error-free complex sentences, avoiding short fragmented clauses or over-relying on "But".',
    prompt: 'Combine the two sentences into a complex contrast sentence using "While" or "Whereas":'
  },
  'gr-b6-2': {
    title: 'Defining & Non-defining Relative Clauses',
    formula: 'S + [who / which / whose + V / S + V] + Main Verb + O',
    rationale: 'Band 6.5 demands relative clauses to qualify ideas naturally without comma errors or confusing "which" with "that".',
    prompt: 'Join the two sentences using a relative clause with "which" or "who":'
  },
  'gr-b6-3': {
    title: 'Passive Voice in Academic Arguments',
    formula: 'It is widely argued/believed that + S + V... OR S + should/must be + V3/ed',
    rationale: 'Eliminate subjective phrasing like "I think" or "People think". Passive constructions convey objective formality expected in IELTS Writing.',
    prompt: 'Transform the personal active sentence into an impersonal academic passive construction:'
  },
  'gr-b7-1': {
    title: 'Participle Clauses for Cause & Effect',
    formula: 'Main Clause (S + V + O), thereby / thus + V-ing + O',
    rationale: 'The hallmark of Band 7.0 writing is using terminal participial clauses (, thereby V-ing) to articulate consequential results with elegance.',
    prompt: 'Combine the result clause into a participial phrase using ", thereby V-ing":'
  },
  'gr-b7-2': {
    title: 'Cleft Sentences for Emphasis',
    formula: 'It is + [Emphasized Element: Noun / Prepositional phrase] + that + S + V...',
    rationale: 'Band 7.0+ necessitates a variety of complex structures. Cleft sentences place decisive stylistic emphasis on key topic arguments.',
    prompt: 'Rewrite the sentence using a cleft sentence ("It is... that") to emphasize "education":'
  },
  'gr-b7-3': {
    title: 'Negative Inversion with "Not only"',
    formula: 'Not only + Auxiliary (does/do/can/should) + S + V, but S + also + V...',
    rationale: 'Subject-auxiliary inversion provides substantial Grammatical Range payoff at Band 7.5 when deployed naturally and accurately.',
    prompt: 'Transform the sentence into negative inversion beginning with "Not only does":'
  },
  'gr-b7-4': {
    title: 'Nominalization',
    formula: 'Convert [Verb/Adjective + Conjunction] into [Academic Noun Phrase: Noun + of + Noun]',
    rationale: 'Nominalization condenses ideas, boosting academic density and replacing conversational Band 6 storytelling with scholarly rigor.',
    prompt: 'Nominalize the sentence below (invest -> investment, expand -> expansion):'
  }
};

/**
 * Returns localized grammar drill item fields.
 * @param {Object} grammar - Grammar item object
 * @param {boolean} isEn - Language mode
 * @returns {Object}
 */
export function getLocalizedGrammarItem(grammar, isEn = false) {
  if (!grammar) return {};
  if (!isEn) return grammar;
  const enData = GRAMMAR_PACK_EN[grammar.id] || {};
  return {
    ...grammar,
    title: enData.title || (grammar.title ? grammar.title.split('(')[0].trim() : ''),
    formula: enData.formula || grammar.formula,
    rationale: enData.rationale || grammar.rationale,
    prompt: enData.prompt || grammar.prompt
  };
}

/**
 * Returns localized card meaning.
 * @param {Object} card - Card object
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedCardMeaning(card, isEn = false) {
  if (!card) return '';
  if (!isEn) return card.meaningVi || card.meaning || '';
  if (card.meaningEn) return card.meaningEn;
  if (THEMATIC_CARDS_MEANING_EN[card.id]) return THEMATIC_CARDS_MEANING_EN[card.id];
  return getLocalizedVocabMeaning(card, isEn);
}

/**
 * Returns localized topic name.
 * @param {string|Object} topic - Topic ID or topic object
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedTopicName(topic, isEn = false) {
  if (!topic) return isEn ? 'All Topics' : 'Tất cả chủ đề';
  if (topic === 'all') return isEn ? 'All Topics' : 'Tất cả chủ đề';
  if (typeof topic === 'object') {
    return isEn ? (topic.name || topic.id) : (topic.vi || topic.name || topic.id);
  }
  return topic;
}
