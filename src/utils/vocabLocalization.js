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

export const SPELLING_TRAPS_EN = {
  'sp-1': {
    rule: "Remember the middle 'n' between 'ro' and 'ment': Envi-ron-ment. Rushing students frequently omit the 'n'.",
    explanation: "Derived from French 'environner' + suffix '-ment'. The 'n' before 'm' is strictly required."
  },
  'sp-2': {
    rule: "Verb 'govern' + '-ment'. Keep the 'n' before the suffix '-ment'.",
    explanation: "'Govern' ends with an 'n'. Attaching '-ment' retains the letter 'n'."
  },
  'sp-3': {
    rule: "Root word is 'finite': de-finite-ly. Never use an 'a' here!",
    explanation: "Root 'definite' + suffix '-ly'. The most common Band 6 error is writing 'definately'."
  },
  'sp-4': {
    rule: "Mnemonic trick: sep - A RAT - e (there is 'a rat' in the middle).",
    explanation: "From Latin 'separare'. Over 40% of test-takers confuse 'a' with 'e'."
  },
  'sp-5': {
    rule: "1 Collar, 2 Sleeves: 1 'c', 2 's's (ne-c-ess-ary).",
    explanation: "Latin 'necessarius'. One of the most frequently misspelled words in IELTS essays."
  },
  'sp-6': {
    rule: "Pro-portion: single 'p' after pro-, with suffix '-tion'.",
    explanation: "Commonly mistaken as 'propprtion' or 'proprotion' under exam time pressure."
  },
  'sp-7': {
    rule: "Fluctu-ation: single 'c', single 't'.",
    explanation: "From Latin 'fluctuare'. Frequently misspelled as 'fluctuation' with double letters."
  },
  'sp-8': {
    rule: "2 Cats, 2 Mice: double 'c' and double 'm' (ac-com-mo-date).",
    explanation: "Latin 'accommodare'. Over 70% of IELTS learners omit one 'c' or one 'm'."
  },
  'sp-9': {
    rule: "Main-ten-ance: notice the stem vowel shifts from 'maintain' to 'ten'.",
    explanation: "Shift from 'maintain' to '-ten-ance' is a classic Academic English trap."
  },
  'sp-10': {
    rule: "Privi-lege: two 'i's and two 'e's. No 'd' anywhere!",
    explanation: "Latin 'privilegium'. Frequently erroneously written as 'priviledge'."
  },
  'sp-11': {
    rule: "Double 'c' and double 'r', ending in '-ence' (oc-cur-rence).",
    explanation: "When adding a suffix to 'occur', double the final consonant 'r'."
  },
  'sp-12': {
    rule: "Singular is 'phenomenon' (-on), plural is 'phenomena' (-a).",
    explanation: "Greek root. Never write 'phenomenas' or 'phenominon'."
  },
  'sp-13': {
    rule: "De-teri-o-rate: three vowels in the middle (e-i-o).",
    explanation: "Latin 'deteriorare'. Ensure you pronounce each syllable clearly."
  },
  'sp-14': {
    rule: "Pro-nun-ci-a-tion: 'nun', NOT 'noun' like the verb 'pronounce'.",
    explanation: "The noun changes the diphthong /aʊ/ to /ʌ/, spelling shifts to '-nun-'."
  },
  'sp-15': {
    rule: "Con-sci-en-tious: root contains 'science' (sci) + '-ent' + '-ious'.",
    explanation: "Latin 'conscientia' (conscience). Take care with the 'sc' and 'ti' clusters."
  },
  'sp-b5-1': {
    rule: "Single 'l' in 'until' (un-til), unlike 'till'.",
    explanation: "A fatal high-frequency trap: 'until' has only 1 'l'."
  },
  'sp-b5-2': {
    rule: "Con-ve-ni-ent: 'e' before 'ni', followed by 'ent'.",
    explanation: "Latin 'convenire'. Often confused with '-ant'."
  },
  'sp-b5-3': {
    rule: "Tech-no-lo-gy: 'ch' makes the /k/ sound, followed by single 'n'.",
    explanation: "Greek root 'techne' (art/craft)."
  },
  'sp-b5-4': {
    rule: "Double 'p', single 't' (op-por-tu-ni-ty).",
    explanation: "Latin 'opportunitas'. Often mistaken with single 'p' or double 't'."
  },
  'sp-b5-5': {
    rule: "'i' before 'e' except after 'c' (be-lieve).",
    explanation: "Classic English spelling rule: 'ie' creates the /iː/ sound."
  },
  'sp-98': {
    rule: "Tech-ni-cian: 'ch' followed by single 'n' and '-cian' occupation suffix.",
    explanation: "Root from 'technology', suffix '-ician' denotes a skilled specialist."
  }
};

const SPELLING_WORD_TO_ID = {
  'environment': 'sp-1',
  'government': 'sp-2',
  'definitely': 'sp-3',
  'separate': 'sp-4',
  'necessary': 'sp-5',
  'proportion': 'sp-6',
  'fluctuation': 'sp-7',
  'accommodate': 'sp-8',
  'maintenance': 'sp-9',
  'privilege': 'sp-10',
  'occurrence': 'sp-11',
  'phenomenon': 'sp-12',
  'deteriorate': 'sp-13',
  'pronunciation': 'sp-14',
  'conscientious': 'sp-15',
  'until': 'sp-b5-1',
  'convenient': 'sp-b5-2',
  'technology': 'sp-b5-3',
  'opportunity': 'sp-b5-4',
  'believe': 'sp-b5-5',
  'technician': 'sp-98'
};

/**
 * Returns localized spelling trap rule and explanation.
 * @param {Object} trap - Spelling trap object
 * @param {boolean} isEn - Language mode
 * @returns {Object}
 */
export function getLocalizedSpellingTrap(trap, isEn = false) {
  if (!trap) return {};
  if (!isEn) return trap;

  const wKey = trap.correct ? trap.correct.toLowerCase().trim() : '';
  const seedId = SPELLING_TRAPS_EN[trap.id] ? trap.id : SPELLING_WORD_TO_ID[wKey];
  const enSeed = (seedId && SPELLING_TRAPS_EN[seedId]) || SPELLING_TRAPS_EN[wKey] || {};
  let rule = enSeed.rule || trap.ruleEn;
  let explanation = enSeed.explanation || trap.explanationEn;

  const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;

  if (!rule || vnRegex.test(rule)) {
    rule = `Memory trick for "${trap.correct}": break down the syllables (${trap.correct.split('').join('-')}) and verify double letters and vowel clusters.`;
  }
  if (!explanation || vnRegex.test(explanation)) {
    explanation = `Official IELTS spelling trap for "${trap.correct}". Always double-check silent letters, suffix endings, and homophone confusion under timed test conditions.`;
  }

  return {
    ...trap,
    rule,
    explanation
  };
}

/**
 * Normalizes grammar title to authentic English.
 * @param {string} title - Raw title
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedGrammarTitle(title, isEn = false) {
  if (!title) return '';
  // Strip "Unit X:" or "Unit X -" prefixes
  let cleaned = title.replace(/^Unit\s+\d+:\s*/i, '').replace(/^Unit\s+\d+\s*[-–•]\s*/i, '');
  if (!isEn) return cleaned;
  
  // If title has English in front of bracket e.g. "Relative Clauses (Mệnh đề quan hệ)"
  if (cleaned.includes('(')) {
    const head = cleaned.split('(')[0].trim();
    const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
    if (!vnRegex.test(head) && head.length > 3) {
      return head.replace(/^Unit\s+\d+:\s*/i, '');
    }
    // Also check inside bracket if bracket has English e.g. "Mệnh đề quan hệ (Relative Clauses)"
    const match = cleaned.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      const inside = match[1].trim();
      if (!vnRegex.test(inside) && inside.length > 3 && !/^band\b|^\d/i.test(inside)) {
        return inside.replace(/^Unit\s+\d+:\s*/i, '');
      }
    }
  }

  const lower = cleaned.toLowerCase();
  if (lower.includes('quan hệ')) {
    if (lower.includes('rút gọn')) return 'Reduced Relative Clauses';
    return 'Defining & Non-defining Relative Clauses';
  }
  if (lower.includes('nhượng bộ') || lower.includes('tương phản') || lower.includes('while') || lower.includes('although')) {
    return 'Complex Contrast & Concession (While/Although)';
  }
  if (lower.includes('bị động')) {
    return 'Academic Passive Voice';
  }
  if (lower.includes('phân từ') || lower.includes('v-ing')) {
    return 'Participle Clauses for Cause & Effect';
  }
  if (lower.includes('câu chẻ') || lower.includes('nhấn mạnh')) {
    return 'Cleft Sentences for Emphasis';
  }
  if (lower.includes('đảo ngữ')) {
    return 'Negative Inversion with "Not only"';
  }
  if (lower.includes('hòa hợp') || lower.includes('chủ - vị') || lower.includes('chủ vị')) {
    return 'Subject-Verb Agreement with Complex Subjects';
  }
  if (lower.includes('câu ghép') || lower.includes('comma splice')) {
    return 'Compound Sentences & Eliminating Comma Splices';
  }
  if (lower.includes('nguyên nhân') || lower.includes('kết quả') || lower.includes('hệ quả')) {
    return 'Logical Cause & Effect';
  }
  if (lower.includes('danh từ hóa')) {
    return 'Academic Nominalization';
  }
  if (lower.includes('câu điều kiện') || lower.includes('điều kiện')) {
    return 'Inverted & Counterfactual Conditionals';
  }
  if (lower.includes('danh ngữ') || lower.includes('mệnh đề danh')) {
    return 'Noun Clauses';
  }
  if (lower.includes('trạng ngữ') || lower.includes('mệnh đề trạng')) {
    return 'Adverbial Clauses';
  }
  if (lower.includes('thì') || lower.includes('tense')) {
    if (lower.includes('hoàn thành')) return 'Perfect Tenses in Academic Writing';
    if (lower.includes('tiếp diễn')) return 'Continuous Tenses in Academic Writing';
    return 'Simple & Progressive Tenses';
  }
  if (lower.includes('mạo từ') || lower.includes('article')) {
    return 'Articles in Academic Writing';
  }
  if (lower.includes('so sánh') || lower.includes('comparative')) {
    return 'Advanced Comparative Structures';
  }
  if (lower.includes('khuyết thiếu') || lower.includes('modal')) {
    return 'Modal Verbs & Academic Hedging';
  }
  if (lower.includes('liên từ') || lower.includes('kết nối')) {
    return 'Cohesive Devices & Signposting';
  }

  // Strip Vietnamese characters
  return title
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/gi, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/gi, 'e')
    .replace(/[ìíịỉĩ]/gi, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/gi, 'o')
    .replace(/[ùúụủũưừứựửữ]/gi, 'u')
    .replace(/[ỳýỵỷỹ]/gi, 'y')
    .replace(/[đĐ]/gi, 'd')
    .replace(/mệnh đề/gi, 'Clause')
    .replace(/câu/gi, 'Sentence');
}

/**
 * Normalizes grammar formula to English.
 * @param {string} formula
 * @param {boolean} isEn
 * @returns {string}
 */
export function getLocalizedGrammarFormula(formula, isEn = false) {
  if (!formula || !isEn) return formula || '';
  return formula
    .replace(/số nhiều/gi, 'Plural')
    .replace(/số ít/gi, 'Singular')
    .replace(/Động từ/gi, 'Verb')
    .replace(/động từ/gi, 'verb')
    .replace(/HOẶC/g, 'OR')
    .replace(/hoặc/gi, 'or')
    .replace(/Cụm danh từ/gi, 'Noun phrase')
    .replace(/cụm danh từ/gi, 'noun phrase')
    .replace(/Mệnh đề/gi, 'Clause')
    .replace(/mệnh đề/gi, 'clause')
    .replace(/Chủ ngữ/gi, 'Subject')
    .replace(/chủ ngữ/gi, 'subject')
    .replace(/Tân ngữ/gi, 'Object')
    .replace(/tân ngữ/gi, 'object');
}

/**
 * Normalizes grammar rationale to English.
 * @param {string} rationale
 * @param {string} title
 * @param {string} bandLevel
 * @param {boolean} isEn
 * @returns {string}
 */
export function getLocalizedGrammarRationale(rationale, title, bandLevel, isEn = false) {
  if (!rationale || !isEn) return rationale || '';
  const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
  if (!vnRegex.test(rationale)) return rationale;

  const lower = (title || '').toLowerCase();
  if (lower.includes('relative') || lower.includes('quan hệ')) {
    return 'Using relative clauses naturally without punctuation errors satisfies Cambridge Grammatical Range & Accuracy criteria for Band 6.5+.';
  }
  if (lower.includes('concession') || lower.includes('contrast') || lower.includes('nhượng bộ')) {
    return 'Deploying complex concession clauses (While, Although, Whereas) directly demonstrates sentence variety and critical argumentation balance.';
  }
  if (lower.includes('passive') || lower.includes('bị động')) {
    return 'Academic passive voice establishes an objective, formal academic tone expected by official IELTS examiners.';
  }
  if (lower.includes('participle') || lower.includes('phân từ')) {
    return 'Participle clauses (, thereby V-ing) create seamless cohesion between causes and consequences, raising grammatical sophistication to Band 7.0+.';
  }
  if (lower.includes('cleft') || lower.includes('câu chẻ')) {
    return 'Cleft sentences provide deliberate rhetorical emphasis on key arguments, showcasing top-tier syntactic control.';
  }
  if (lower.includes('inversion') || lower.includes('đảo ngữ')) {
    return 'Negative inversion (Not only...) is a high-impact syntactic structure that cements Band 7.5+ Grammatical Range.';
  }
  if (lower.includes('nominalization') || lower.includes('danh từ hóa')) {
    return 'Nominalization condenses conversational clauses into formal academic noun phrases, elevating lexical and grammatical density.';
  }
  if (lower.includes('agreement') || lower.includes('hòa hợp')) {
    return 'Mastering subject-verb agreement with complex intervening phrases eliminates critical error penalties that hold scores at Band 5.5.';
  }
  if (lower.includes('compound') || lower.includes('comma splice')) {
    return 'Eliminating comma splices by properly linking clauses ensures clean sentence boundaries required for Band 6.0+.';
  }
  return `Mastering this grammatical structure boosts Cambridge Grammatical Range & Accuracy toward Band ${bandLevel || '7.0+'}.`;
}

/**
 * Normalizes grammar prompt to English.
 * @param {string} prompt
 * @param {string} title
 * @param {boolean} isEn
 * @returns {string}
 */
export function getLocalizedGrammarPrompt(prompt, title, isEn = false) {
  if (!prompt || !isEn) return prompt || '';
  const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
  if (!vnRegex.test(prompt)) return prompt;

  const lower = (prompt + ' ' + (title || '')).toLowerCase();

  // Relative Clauses
  if (lower.includes('quan hệ') || lower.includes('relative')) {
    if (lower.includes('who')) {
      return "Combine the two sentences into a complex sentence using a relative clause with 'who':";
    }
    if (lower.includes('which')) {
      return "Combine the two sentences into a complex sentence using a relative clause with 'which':";
    }
    if (lower.includes('whose')) {
      return "Combine the two sentences using a possessive relative clause with 'whose':";
    }
    if (lower.includes('rút gọn') || lower.includes('reduced')) {
      return 'Reduce the relative clause below into an academic participial modifier:';
    }
    return 'Combine the two sentences into a complex sentence using an appropriate relative clause:';
  }

  // Concession / Contrast
  if (lower.includes('nhượng bộ') || lower.includes('tương phản') || lower.includes('concession') || lower.includes('contrast')) {
    if (lower.includes('despite') || lower.includes('in spite of')) {
      return 'Rewrite the sentences into a concession structure using "Despite" or "In spite of":';
    }
    if (lower.includes('while') || lower.includes('whereas')) {
      return 'Combine the sentences into a complex contrast sentence using "While" or "Whereas":';
    }
    return 'Combine the sentences into a complex contrast sentence using "Although" or "While":';
  }

  // Passive voice
  if (lower.includes('bị động') || lower.includes('passive')) {
    if (lower.includes('impersonal') || lower.includes('khách quan')) {
      return 'Transform the sentence into an impersonal academic passive construction ("It is widely contended that..."):';
    }
    return 'Transform the personal active sentence into an impersonal academic passive construction:';
  }

  // Participle clauses
  if (lower.includes('phân từ') || lower.includes('participle') || lower.includes('v-ing')) {
    return 'Combine the result clause into a participial phrase using ", thereby V-ing":';
  }

  // Inversion
  if (lower.includes('đảo ngữ') || lower.includes('inversion')) {
    if (lower.includes('not only')) {
      return 'Rewrite the sentence using negative inversion beginning with "Not only":';
    }
    return 'Rewrite the sentence using academic inversion to add emphasis:';
  }

  // Conditionals
  if (lower.includes('điều kiện') || lower.includes('conditional')) {
    if (lower.includes('loại 3') || lower.includes('third')) {
      return 'Rewrite the situation into a third conditional sentence:';
    }
    if (lower.includes('loại 2') || lower.includes('second')) {
      return 'Rewrite the situation into a second conditional sentence:';
    }
    return 'Rewrite the sentences using an appropriate conditional structure:';
  }

  // Subject-Verb Agreement
  if (lower.includes('hòa hợp') || lower.includes('chia động từ') || lower.includes('agreement')) {
    return 'Correct the verb form to agree with the complex subject:';
  }

  // Comma Splice / Compound
  if (lower.includes('phẩy') || lower.includes('comma splice') || lower.includes('câu ghép')) {
    return 'Fix the comma splice error by adding an appropriate coordinating conjunction or semicolon:';
  }

  // Cause and effect
  if (lower.includes('nguyên nhân') || lower.includes('kết quả') || lower.includes('hệ quả') || lower.includes('cause')) {
    return 'Convert the cause-and-effect sentence below using "leads to" + Noun phrase:';
  }

  // Nominalization
  if (lower.includes('danh từ hóa') || lower.includes('nominalization')) {
    return 'Nominalize the sentence below to increase academic lexical density:';
  }

  // Cleft sentence
  if (lower.includes('câu chẻ') || lower.includes('nhấn mạnh') || lower.includes('cleft')) {
    return 'Rewrite the sentence using a cleft structure ("It is... that") for emphasis:';
  }

  // Modals / Hedging
  if (lower.includes('khuyết thiếu') || lower.includes('modal') || lower.includes('hedging')) {
    return 'Rephrase the sentence using academic modal verbs to convey cautious hedging:';
  }

  // Generic combine sentence
  if (lower.includes('kết hợp') || lower.includes('ghép') || lower.includes('nối câu') || lower.includes('combine')) {
    return 'Combine the following sentences into a cohesive academic complex sentence:';
  }

  return 'Rewrite the sentence to upgrade grammatical range and accuracy:';
}

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
  const title = grammar.titleEn || enData.title || getLocalizedGrammarTitle(grammar.title, true);
  const formula = grammar.formulaEn || enData.formula || getLocalizedGrammarFormula(grammar.formula, true);
  const rationale = grammar.rationaleEn || enData.rationale || getLocalizedGrammarRationale(grammar.rationale, title, grammar.bandLevel || grammar.bandTarget, true);
  const prompt = grammar.promptEn || enData.prompt || getLocalizedGrammarPrompt(grammar.prompt, title, true);

  const drills = (grammar.drills || []).map(drill => {
    let q = drill.questionEn || '';
    if (!q) {
      q = getLocalizedGrammarPrompt(drill.question, title, true);
    }
    let exp = drill.explanationEn || '';
    if (!exp) {
      exp = getLocalizedGrammarRationale(drill.explanation, title, grammar.bandLevel, true);
    }
    return {
      ...drill,
      question: q,
      explanation: exp
    };
  });

  return {
    ...grammar,
    title,
    formula,
    rationale,
    prompt,
    drills
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

/**
 * Localizes a vocab deck topic name.
 * When isEn is true, guarantees 100% English by using topicNameEn or stripping any Vietnamese in parentheses.
 * @param {Object|string} deckOrTopic - Deck object or topic string
 * @param {boolean} isEn - Language mode
 * @returns {string}
 */
export function getLocalizedDeckTopicName(deckOrTopic, isEn = false) {
  if (!deckOrTopic) return isEn ? 'Thematic Vocabulary' : 'Từ Vựng Theo Chủ Đề';

  if (typeof deckOrTopic === 'object') {
    if (isEn && deckOrTopic.topicNameEn) return deckOrTopic.topicNameEn;
    if (!isEn && deckOrTopic.topicNameVi) return deckOrTopic.topicNameVi;
    deckOrTopic = deckOrTopic.topicName || deckOrTopic.title || deckOrTopic.name || deckOrTopic.id || '';
  }

  let str = String(deckOrTopic).trim();
  const vnRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;

  if (isEn) {
    // If the topic string has parenthesized content containing Vietnamese, strip it
    str = str.replace(/\s*\([^)]*\)/g, (match) => {
      if (vnRegex.test(match)) {
        return '';
      }
      return match;
    }).trim();

    // In case the whole string is in Vietnamese or has leftover brackets
    if (vnRegex.test(str)) {
      if (str.includes('Công nghệ')) return 'Technology & Digital Life';
      if (str.includes('Môi trường')) return 'Environment & Climate';
      if (str.includes('Xã hội')) return 'Society & Urban Life';
    }
  }

  return str || (isEn ? 'Thematic Vocabulary' : 'Từ Vựng Theo Chủ Đề');
}
