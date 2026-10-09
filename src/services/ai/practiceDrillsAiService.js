/**
 * Practice & Micro-Drills Domain AI Service
 * Handles sentence paraphrasing, fill-in-blanks drills, spelling traps, grammar exercises, and thematic vocabulary drills.
 */

import { callGeminiApi, robustJsonParse } from './coreGeminiClient.js';

export async function evaluateParaphrase({ originalSentence, candidateSentence, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key.');
  if (!candidateSentence || candidateSentence.trim().length < 5) {
    throw new Error('Vui lòng nhập câu viết lại của bạn.');
  }

  const prompt = `You are an elite IELTS Writing Coach. Evaluate the candidate's paraphrased sentence compared to the original prompt sentence.

ORIGINAL SENTENCE:
"${originalSentence}"

CANDIDATE PARAPHRASED SENTENCE:
"${candidateSentence}"

EVALUATE:
1. Estimated Band Score for this sentence (e.g. Band 6.5, 7.5, 8.5).
2. Meaning Equivalence: Does it retain 100% of the original meaning without distorting facts?
3. Grammar & Academic Vocabulary: Are collocations natural and grammatically accurate?
4. Two alternative Band 8.5+ versions.

Return ONLY raw JSON with this format:
{
  "band": 7.5,
  "isAccurateMeaning": true,
  "feedback": "Nhận xét chi tiết bằng tiếng Việt về ngữ pháp và cách dùng từ...",
  "strengths": ["..."],
  "improvements": ["..."],
  "alternatives": [
    "Alternative Band 8.5 option 1 using nominalization...",
    "Alternative Band 8.5 option 2 using passive/cleft sentence..."
  ]
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * AI Auto-Generates New Micro-Drills on demand
 */
export async function generateMicroDrill({ drillType, topic = 'general', apiKey, model = DEFAULT_MODEL, isEn = false }) {
  if (!apiKey) throw new Error(isEn ? 'Please configure your AI API Key in Settings.' : 'Vui lòng cấu hình AI API Key trong phần Cài đặt.');

  const langInstruction = isEn 
    ? 'CRITICAL LANGUAGE REQUIREMENT: Output ALL titles, categories, contexts, questions, explanations, tips, and guidelines STRICTLY in English. Do NOT output Vietnamese. Include "titleEn" field.' 
    : 'Yêu cầu: Giải thích và hướng dẫn bằng tiếng Việt.';

  let prompt = '';

  if (drillType === 'fill-blanks') {
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "Fill-in-the-Blanks" micro-drill testing prepositions of data (Task 1) or academic cohesive devices / linking words (Task 2).
Topic: ${topic}

Requirements:
- "title": Short title (e.g. ${isEn ? '"Prepositions of Data & Trends" or "Advanced Contrastive Linkers"' : '"Giới từ miêu tả tỷ trọng & biến đổi" or "Từ nối tương phản nâng cao"'})
- "category": e.g. "Task 1 Data Prepositions" or "Task 2 Cohesive Devices"
- "passage": A paragraph (3-4 sentences) with 3 to 4 blanks represented by "___".
- "blanks": Array of 3-4 objects, each with:
  - "index": integer (0, 1, 2, 3) corresponding to the blanks in order
  - "answer": the correct word (e.g. "at", "by", "However", "Consequently")
  - "options": array of 4 choices [correct word and 3 plausible distractors]
  - "explanation": ${isEn ? 'English explanation of grammar / rule why this word is correct' : 'Vietnamese explanation of grammar / rule why this word is correct'}

Return ONLY raw parseable JSON:
{
  "type": "fill-blanks",
  "title": "...",
  "category": "...",
  "passage": "...",
  "blanks": [
    { "index": 0, "answer": "...", "options": ["...", "...", "...", "..."], "explanation": "..." }
  ]
}`;
  } else if (drillType === 'true-false') {
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "True / False Data Verification" micro-drill testing data interpretation from IELTS Writing Task 1.
Topic: ${topic}

Requirements:
- "title": Short descriptive title ${isEn ? '(in English)' : ''}
- "category": "Task 1 Data Accuracy"
- "context": A concise data summary (e.g. ${isEn ? '"Data for 2024: Country A: 45%, Country B: 30%, Country C: 15%, Country D: 10%..."' : '"Dữ liệu năm 2024: Nước A: 45%, Nước B: 30%, Nước C: 15%, Nước D: 10%..."'})
- "questions": Array of 4 statement objects, each with:
  - "id": "q1", "q2", "q3", "q4"
  - "statement": English statement interpreting the data (some true, some false traps like confusing percentage vs percentage points or lowest vs highest)
  - "isTrue": boolean (true or false)
  - "explanation": ${isEn ? 'English explanation detailing why it is true or false based on the numbers' : 'Vietnamese explanation detailing why it is true or false based on the numbers'}

Return ONLY raw parseable JSON:
{
  "type": "true-false",
  "title": "...",
  "category": "Task 1 Data Accuracy",
  "context": "...",
  "questions": [
    { "id": "q1", "statement": "...", "isTrue": true, "explanation": "..." }
  ]
}`;
  } else if (drillType === 'error-spotting') {
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "Error Spotting & Grammar Correction" micro-drill focusing on classic IELTS pitfalls (uncountable nouns, comma splices, incorrect prepositions, subject-verb agreement, or trend verbs used in static charts).
Topic: ${topic}

Requirements:
- "title": Title describing the specific pitfall (e.g. "Sửa lỗi mệnh đề quan hệ & dấu phẩy")
- "category": "Grammar Accuracy & Range"
- "sentenceWithErrors": The flawed sentence containing 1 realistic grammatical or collocation error
- "targetCorrection": The perfectly corrected Band 8.5 academic sentence
- "explanation": Detailed Vietnamese explanation of the rule and why the original was wrong

Return ONLY raw parseable JSON:
{
  "type": "error-spotting",
  "title": "...",
  "category": "Grammar Accuracy",
  "sentenceWithErrors": "...",
  "targetCorrection": "...",
  "explanation": "..."
}`;
  } else if (drillType === 'collocation') {
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "Academic Collocation Pairing" micro-drill featuring 4 advanced C1-C2 vocabulary collocations for IELTS Writing.
Topic: ${topic}

Requirements:
- "title": Title describing the topic collocations
- "category": "Lexical Resource (C1-C2)"
- "pairs": Array of 4 objects, each with:
  - "term": Verb / Adjective (e.g. "mitigate", "exacerbate", "stark")
  - "match": Noun phrase (e.g. "environmental degradation", "disparity")
  - "meaning": Vietnamese translation of the combined collocation

Return ONLY raw parseable JSON:
{
  "type": "collocation",
  "title": "...",
  "category": "Lexical Resource (C1-C2)",
  "pairs": [
    { "term": "...", "match": "...", "meaning": "..." }
  ]
}`;
  } else if (drillType === 'reading-tfng') {
    prompt = `Act as an expert Cambridge IELTS Reading coach. Generate 1 brand new "True / False / Not Given Trap Master" micro-drill.
Topic: ${topic}

Requirements:
- "title": Descriptive title (e.g. "Phân biệt bẫy Not Given vs False: [Chủ đề]")
- "category": Topic category (e.g. "Science & Ecology", "History & Archaeology", "Technology")
- "passage": A concise academic passage (3-4 sentences, approx 60-80 words).
- "statement": 1 statement testing subtle understanding. Choose whether it should be TRUE, FALSE, or NOT GIVEN.
  - If FALSE: ensure there is a clear direct contradiction in the passage.
  - If NOT GIVEN: ensure it creates a plausible assumption/trap that people often assume, but is NOT stated or cannot be confirmed in the passage.
  - If TRUE: ensure it is a faithful paraphrase of the passage's idea.
- "answer": MUST be strictly "TRUE", "FALSE", or "NOT GIVEN"
- "trapType": Name the trap (e.g. "Assumption Trap", "Direct Contradiction", "Comparative Trap", "Paraphrase Confirmation")
- "explanation": In-depth Vietnamese explanation of why this answer is correct, and why other choices (especially the trap) are incorrect.
- "evidence": Direct quote from the passage proving the answer (or note that info is missing for Not Given).

Return ONLY raw parseable JSON:
{
  "type": "reading-tfng",
  "title": "...",
  "category": "...",
  "passage": "...",
  "statement": "...",
  "answer": "TRUE",
  "trapType": "...",
  "explanation": "...",
  "evidence": "..."
}`;
  } else if (drillType === 'reading-paraphrase') {
    prompt = `Act as an expert Cambridge IELTS Reading coach. Generate 1 brand new "Reading Paraphrase Hunter" micro-drill.
Topic: ${topic}

Requirements:
- "title": Short title (e.g. "Truy tìm Paraphrase: [Chủ đề]")
- "category": "Academic Reading Skills"
- "questionText": 1 sentence representing an IELTS exam question (Band 7.0 style).
- "passageExcerpt": 1 sentence from the reading text expressing the exact same meaning using sophisticated academic synonyms and restructured syntax.
- "pairs": Array of 4-6 objects mapping synonymous chunks between question and passage:
  [
    { "questionWord": "...", "passageWord": "...", "meaning": "Vietnamese meaning of the pair" }
  ]

Return ONLY raw parseable JSON:
{
  "type": "reading-paraphrase",
  "title": "...",
  "category": "Academic Reading Skills",
  "questionText": "...",
  "passageExcerpt": "...",
  "pairs": [
    { "questionWord": "...", "passageWord": "...", "meaning": "..." }
  ]
}`;
  } else if (drillType === 'reading-headings') {
    prompt = `Act as an expert Cambridge IELTS Reading coach. Generate 1 brand new "Matching Headings Trap-Breaker" micro-drill.
Topic: ${topic}

Requirements:
- "title": Short title (e.g. "Phá bẫy Matching Headings: [Chủ đề]")
- "category": "IELTS Reading Matching Headings"
- "paragraph": A well-written academic paragraph (4-6 sentences, 80-110 words) with 1 clear central theme.
- "correctHeadingIndex": Index (0, 1, 2, or 3) of the correct heading.
- "headings": Array of 4 heading objects:
  - 1 correct heading (accurate summary of the paragraph's main idea, marked with isCorrect: true, type: "CORRECT", and detailed Vietnamese analysis).
  - 1 "DETAIL_TRAP": Heading focusing on a minor specific detail/keyword mentioned in the paragraph, isCorrect: false.
  - 1 "TOO_GENERAL": Heading that is overly broad or beyond the scope, isCorrect: false.
  - 1 "IRRELEVANT" or "DISTRACTOR": Heading with alluring keywords but misleading or distorted meaning, isCorrect: false.
- "topicSentence": The exact sentence or key clause in the paragraph that conveys the main theme.

Return ONLY raw parseable JSON:
{
  "type": "reading-headings",
  "title": "...",
  "category": "...",
  "paragraph": "...",
  "correctHeadingIndex": 0,
  "headings": [
    { "id": "h1", "text": "...", "isCorrect": true, "type": "CORRECT", "analysis": "..." },
    { "id": "h2", "text": "...", "isCorrect": false, "type": "DETAIL_TRAP", "analysis": "..." },
    { "id": "h3", "text": "...", "isCorrect": false, "type": "TOO_GENERAL", "analysis": "..." },
    { "id": "h4", "text": "...", "isCorrect": false, "type": "IRRELEVANT", "analysis": "..." }
  ],
  "topicSentence": "..."
}`;
  } else if (drillType === 'context-vocab') {
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "Contextual Vocabulary Decryption" micro-drill.
Topic: ${topic}

Requirements:
- "title": Title e.g. "Đoán nghĩa từ: [targetWord]"
- "category": "Core Academic Vocabulary"
- "sentence": An academic sentence containing one advanced C1-C2 word with rich contextual clues (contrast, cause-effect, definition, or examples).
- "targetWord": The target word (e.g. "ephemeral", "paradoxical", "pernicious", "catalyst").
- "clueType": Description of the clue mechanism (e.g. "Contrast Clue", "Definition by Example", "Cause & Effect Clue").
- "options": Array of 4 options (1 correct definition, 3 plausible distractors).
- "explanation": Detailed Vietnamese explanation of how the contextual clues reveal the meaning of the target word.

Return ONLY raw parseable JSON:
{
  "type": "context-vocab",
  "title": "...",
  "category": "Core Academic Vocabulary",
  "sentence": "...",
  "targetWord": "...",
  "clueType": "...",
  "options": [
    { "text": "...", "isCorrect": true },
    { "text": "...", "isCorrect": false },
    { "text": "...", "isCorrect": false },
    { "text": "...", "isCorrect": false }
  ],
  "explanation": "..."
}`;
  } else if (drillType === 'sentence-chunking') {
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "Complex Sentence Chunking & Deconstruction" micro-drill.
Topic: ${topic}

Requirements:
- "title": Title e.g. "Giải phẫu câu phức: [Chủ đề]"
- "category": "Academic Sentence Mastery"
- "fullSentence": A sophisticated, 35-45 word academic sentence with embedded relative clauses, participial phrases, or appositives.
- "subject": The core Subject noun phrase.
- "subModifier": The non-essential clauses/modifiers (relative clauses, prepositional phrases).
- "coreVerb": The main finite verb/predicate.
- "objectResult": The core Object or Result complement.
- "takeawayVietnamese": A clear takeaway showing how stripping down to Subject-Verb-Object helps fast comprehension.

Return ONLY raw parseable JSON:
{
  "type": "sentence-chunking",
  "title": "...",
  "category": "Academic Sentence Mastery",
  "fullSentence": "...",
  "subject": "...",
  "subModifier": "...",
  "coreVerb": "...",
  "objectResult": "...",
  "takeawayVietnamese": "..."
}`;
  } else if (drillType === 'listening-dictation') {
    prompt = `Act as an expert Cambridge IELTS Listening examiner. Generate 1 brand new "Intensive Dictation" micro-drill for IELTS Listening.
Topic: ${topic}

Requirements:
- "title": Title describing the context (e.g. "Dictation Thực Chiến: [Chủ đề]")
- "category": Topic category (e.g. "Daily Life & Accommodation", "Campus Facilities", "Urban Ecology")
- "difficulty": "Band 6.0 - 7.5"
- "ttsText": A natural, authentic English spoken sentence (14 to 22 words) containing natural connected speech features (linking sounds, vowel reductions, or plural '-s' endings).
- "targetTranscript": The identical exact transcript of the sentence.
- "wordCount": Total word count of the sentence.
- "audioClipTip": Clear Vietnamese advice on phonetics / connected speech to look out for (e.g. "Chú ý nối âm: 'confirm your' và âm đuôi 'reservation'").

Return ONLY raw parseable JSON:
{
  "type": "listening-dictation",
  "title": "...",
  "category": "...",
  "difficulty": "Band 6.5 - 7.5",
  "ttsText": "...",
  "targetTranscript": "...",
  "wordCount": 16,
  "audioClipTip": "..."
}`;
  } else if (drillType === 'listening-spelling') {
    prompt = `Act as an expert Cambridge IELTS Listening examiner. Generate 1 brand new "Speed Spelling, Names & Numbers" reflex micro-drill (IELTS Listening Part 1 format).
Topic: ${topic}

Requirements:
- "title": Short title (e.g. "Đánh vần tên riêng & Mã bưu chính UK")
- "category": "Names, Postcodes & Numbers"
- "subType": One of "spelling", "numbers", "currency-date"
- "promptAudioText": The complete spoken sentence in British English. If spelling a name, include the spelled letters with hyphens (e.g. "The guest surname is MacIntyre, that is M-A-C-I-N-T-Y-R-E"). If numbers, include realistic distractors or reversals.
- "questionPrompt": The exam question line with blanks (e.g. "Guest surname: ........." or "Booking reference code: .........")
- "correctAnswer": The exact key (e.g. "MacIntyre", "SW19 4TL", "75")
- "acceptableAnswers": Array of acceptable formats (e.g. ["SW19 4TL", "SW194TL", "sw19 4tl"])
- "trapNote": Specific trap warning in Vietnamese (e.g. "Bẫy âm dễ nhầm: Chữ V vs B, số đảo ngược")
- "explanation": Detailed Vietnamese explanation

Return ONLY raw parseable JSON:
{
  "type": "listening-spelling",
  "subType": "spelling",
  "title": "...",
  "category": "...",
  "promptAudioText": "...",
  "questionPrompt": "...",
  "correctAnswer": "...",
  "acceptableAnswers": ["..."],
  "trapNote": "...",
  "explanation": "..."
}`;
  } else if (drillType === 'listening-distractor') {
    prompt = `Act as an expert Cambridge IELTS Listening examiner. Generate 1 brand new "Distractor Trap Buster" micro-drill testing self-correction and shifting conditions (Part 1 or Part 3 format).
Topic: ${topic}

Requirements:
- "title": Short title e.g. "Bẫy tự đính chính: [Tình huống]"
- "category": e.g. "Transport Schedule", "Course Enrollment", "Customer Service"
- "audioSnippetText": A mini-dialogue (2-3 sentences) between two people where an initial piece of information is suggested, but then corrected or rejected with words like "Actually, make that...", "However, unlike last time...", or "I used to, but now...".
- "question": Direct question asking about the final confirmed information
- "options": Array of 3 options [{ "id": "A", "text": "..." }, { "id": "B", "text": "..." }, { "id": "C", "text": "..." }]
- "correctOption": "A", "B", or "C"
- "distractorMechanism": Detailed Vietnamese breakdown of how the speaker tricked the listener
- "explanation": Clear Vietnamese summary of why the correct option is the final decision

Return ONLY raw parseable JSON:
{
  "type": "listening-distractor",
  "title": "...",
  "category": "...",
  "audioSnippetText": "...",
  "question": "...",
  "options": [
    { "id": "A", "text": "..." },
    { "id": "B", "text": "..." },
    { "id": "C", "text": "..." }
  ],
  "correctOption": "C",
  "distractorMechanism": "...",
  "explanation": "..."
}`;
  } else if (drillType === 'listening-map') {
    prompt = `Act as an expert Cambridge IELTS Listening examiner. Generate 1 brand new "Map Navigation & Spatial Directions" micro-drill (Part 2 format).
Topic: ${topic}

Requirements:
- "title": Short title e.g. "Định hướng sơ đồ: [Địa điểm]"
- "category": "Campus & Park Navigation"
- "audioDirectionsText": A spoken directional guide (40-60 words) starting from a clear entrance/landmark, navigating through paths, junctions, ponds/fountains, and pinpointing a specific room/facility.
- "question": "Where is the [Facility Name] located?"
- "options": Array of 3 location descriptions [{ "id": "A", "text": "..." }, { "id": "B", "text": "..." }, { "id": "C", "text": "..." }]
- "correctOption": "A", "B", or "C"
- "spatialClues": Array of 3-4 sequential path clues (e.g. ["Main entrance -> walk straight", "Turn left at fountain", "Directly opposite bike shed"])
- "explanation": Detailed step-by-step route explanation in Vietnamese

Return ONLY raw parseable JSON:
{
  "type": "listening-map",
  "title": "...",
  "category": "...",
  "audioDirectionsText": "...",
  "question": "...",
  "options": [
    { "id": "A", "text": "..." },
    { "id": "B", "text": "..." },
    { "id": "C", "text": "..." }
  ],
  "correctOption": "B",
  "spatialClues": ["...", "..."],
  "explanation": "..."
}`;
  } else if (drillType === 'listening-signposting') {
    prompt = `Act as an expert Cambridge IELTS Listening examiner. Generate 1 brand new "Academic Lecture Signposting Catcher" micro-drill (Part 4 format).
Topic: ${topic}

Requirements:
- "title": Short title e.g. "Bắt tín hiệu chuyển ý: [Chủ đề học thuật]"
- "category": "Academic Lecture (Part 4)"
- "audioSnippetText": An excerpt from an academic monograph / university lecture (40-60 words) containing a prominent signposting cue (e.g. "Moving on to...", "Turning now to our second hypothesis...", "Surprisingly, however...").
- "question": "Cụm từ nào báo hiệu người nói đang chuyển sang [mục đích cụ thể]?"
- "options": Array of 3 excerpt options [{ "id": "A", "text": "..." }, { "id": "B", "text": "..." }, { "id": "C", "text": "..." }]
- "correctOption": "A", "B", or "C"
- "signpostType": e.g. "Transition to New Key Point" or "Contrast / Counter-intuitive Evidence"
- "explanation": Detailed Vietnamese explanation of why this marker signals the transition

Return ONLY raw parseable JSON:
{
  "type": "listening-signposting",
  "title": "...",
  "category": "...",
  "audioSnippetText": "...",
  "question": "...",
  "options": [
    { "id": "A", "text": "..." },
    { "id": "B", "text": "..." },
    { "id": "C", "text": "..." }
  ],
  "correctOption": "B",
  "signpostType": "...",
  "explanation": "..."
}`;
  } else if (drillType === 'speaking-area') {
    prompt = `Act as an expert Cambridge IELTS Speaking coach. Generate 1 brand new "A.R.E.A Expansion Reflex" micro-drill for IELTS Speaking (Part 1 or Part 3).
Topic: ${topic}

Requirements:
- "title": Title e.g. "A.R.E.A Reflex: [Chủ đề sinh hoạt / xã hội]"
- "topic": Topic name
- "part": "Part 1" or "Part 3"
- "question": An authentic Cambridge IELTS Speaking question
- "difficulty": "Band 7.0 - 8.5"
- "tip": Clear Vietnamese advice on how to expand the answer
- "formula": Object containing:
  - "answer": { "label": "A - Answer (Trực diện)", "prompt": "...", "sample": "...", "keywords": ["...", "..."] }
  - "reason": { "label": "R - Reason (Lý do)", "prompt": "...", "sample": "...", "keywords": ["...", "..."] }
  - "example": { "label": "E - Example (Ví dụ)", "prompt": "...", "sample": "...", "keywords": ["...", "..."] }
  - "alternative": { "label": "A - Alternative (Góc nhìn đối chiếu)", "prompt": "...", "sample": "...", "keywords": ["...", "..."] }
- "modelAnswerBand8": Full 4-sentence Band 8.5 response
- "lexicalHighlights": Array of 5-7 advanced C1-C2 collocations/idioms used

Return ONLY raw parseable JSON:
{
  "type": "speaking-area",
  "title": "...",
  "topic": "...",
  "part": "Part 1",
  "question": "...",
  "difficulty": "Band 7.0 - 8.5",
  "tip": "...",
  "formula": {
    "answer": { "label": "A - Answer (Trực diện)", "prompt": "...", "sample": "...", "keywords": ["..."] },
    "reason": { "label": "R - Reason (Lý do)", "prompt": "...", "sample": "...", "keywords": ["..."] },
    "example": { "label": "E - Example (Ví dụ)", "prompt": "...", "sample": "...", "keywords": ["..."] },
    "alternative": { "label": "A - Alternative (Góc nhìn đối chiếu)", "prompt": "...", "sample": "...", "keywords": ["..."] }
  },
  "modelAnswerBand8": "...",
  "lexicalHighlights": ["...", "..."]
}`;
  } else if (drillType === 'speaking-fillers') {
    prompt = `Act as an expert Cambridge IELTS Speaking coach. Generate 1 brand new "Natural Fillers & Signposting" micro-drill.
Topic: ${topic}

Requirements:
- "title": Title e.g. "Từ Đệm: [Tình huống phòng thi]"
- "category": e.g. "Buying Time & Recalling Past", "Speculating & Forecasting", "Balancing Two Sides"
- "situation": Vietnamese description of the challenging exam moment
- "question": Examiner question
- "taskPrompt": Question prompt asking user to pick the most natural native filler
- "options": Array of 4 options (1 correct native filler with explanation, 3 unnatural/awkward choices with explanations)
- "targetFiller": The correct filler phrase
- "sampleContinuation": Full natural continuation sentence

Return ONLY raw parseable JSON:
{
  "type": "speaking-fillers",
  "title": "...",
  "category": "...",
  "situation": "...",
  "question": "...",
  "taskPrompt": "...",
  "options": [
    { "text": "...", "isCorrect": true, "explanation": "..." },
    { "text": "...", "isCorrect": false, "explanation": "..." },
    { "text": "...", "isCorrect": false, "explanation": "..." },
    { "text": "...", "isCorrect": false, "explanation": "..." }
  ],
  "targetFiller": "...",
  "sampleContinuation": "..."
}`;
  } else if (drillType === 'speaking-collocations') {
    prompt = `Act as an expert Cambridge IELTS Speaking coach. Generate 1 brand new "Natural Speaking Collocations & Idioms" micro-drill.
Topic: ${topic}

Requirements:
- "title": Title e.g. "Idiom: [Ý nghĩa]"
- "category": Topic category
- "context": Context where this idiom is naturally used
- "prompt": Instruction prompt in Vietnamese
- "questionSentence": Sentence with "______" blank
- "options": Array of 4 options (1 correct idiom, 3 incorrect/word-by-word Vietnamese translation traps)
- "idiom": The target idiom
- "meaning": English meaning
- "speakingExample": Example sentence for Speaking test

Return ONLY raw parseable JSON:
{
  "type": "speaking-collocations",
  "title": "...",
  "category": "...",
  "context": "...",
  "prompt": "...",
  "questionSentence": "...",
  "options": [
    { "text": "...", "isCorrect": true, "explanation": "..." },
    { "text": "...", "isCorrect": false, "explanation": "..." },
    { "text": "...", "isCorrect": false, "explanation": "..." },
    { "text": "...", "isCorrect": false, "explanation": "..." }
  ],
  "idiom": "...",
  "meaning": "...",
  "speakingExample": "..."
}`;
  } else if (drillType === 'speaking-part3-counter') {
    prompt = `Act as an expert Cambridge IELTS Speaking examiner. Generate 1 brand new "Two-Sided Analytical Reflex" micro-drill for IELTS Speaking Part 3.
Topic: ${topic}

Requirements:
- "title": Title e.g. "Phản Biện Part 3: [Chủ đề tranh luận]"
- "topic": Topic name
- "question": A challenging, multi-layered Part 3 question
- "category": "Two-Sided Societal Debate"
- "difficulty": "Band 7.5 - 8.5"
- "tip": Vietnamese advice on balancing arguments
- "sideA": { "perspective": "...", "starter": "On the one hand, ...", "points": "..." }
- "sideB": { "perspective": "...", "starter": "On the flip side, conversely, ...", "points": "..." }
- "synthesis": { "starter": "So on balance, ...", "conclusion": "..." }
- "modelAnswerBand8": Full high-scoring response
- "highBandVocab": Array of 6-8 C1-C2 vocabulary items

Return ONLY raw parseable JSON:
{
  "type": "speaking-part3-counter",
  "title": "...",
  "topic": "...",
  "question": "...",
  "category": "Two-Sided Societal Debate",
  "difficulty": "Band 7.5 - 8.5",
  "tip": "...",
  "sideA": { "perspective": "...", "starter": "...", "points": "..." },
  "sideB": { "perspective": "...", "starter": "...", "points": "..." },
  "synthesis": { "starter": "...", "conclusion": "..." },
  "modelAnswerBand8": "...",
  "highBandVocab": ["..."]
}`;
  } else {
    // paraphrase
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "Single-Sentence Paraphrasing Drill" for IELTS Writing.
Topic: ${topic}

Requirements:
- "title": Short title (e.g. "Luyện Paraphrase Câu Luận Điểm Thân Bài")
- "category": "Task 1 or Task 2 Paraphrasing"
- "originalSentence": A simple, Band 5.5-6.0 sentence needing academic upgrade
- "targetBand": "Band 8.0+"
- "hints": Array of 2 actionable tips/collocations in Vietnamese
- "sampleBand8": An exemplary Band 8.5 version demonstrating nominalization or passive structures

Return ONLY raw parseable JSON:
{
  "type": "paraphrase",
  "title": "...",
  "category": "...",
  "originalSentence": "...",
  "targetBand": "Band 8.0+",
  "hints": ["...", "..."],
  "sampleBand8": "..."
}`;
  }

  prompt += `\n\n${langInstruction}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json'
      }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Không nhận được nội dung phản hồi từ AI.');

  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      id: `custom-drill-${Date.now()}`,
      isAiGenerated: true,
      ...parsed
    };
  } catch (err) {
    console.error('Failed to parse generated drill JSON:', text);
    throw new Error('Lỗi định dạng dữ liệu khi AI sinh bài tập. Vui lòng thử lại.');
  }
}

/**
 * AI Detailed Evaluator for Listening Micro-Drills
 * Analyzes word-by-word phonetic drift, homophone traps, dropped plural endings, and distractor anatomy
 */
export async function evaluateListeningDrill({
  drillType,
  targetTranscript,
  userInput,
  questionPrompt,
  correctOption,
  userChoice,
  options = [],
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key trong phần Cài đặt.');

  const prompt = `Act as an expert Cambridge IELTS Listening examiner and phonetics specialist.
Evaluate the student's submission for this IELTS Listening Micro-Drill:
Drill Type: ${drillType}
${targetTranscript ? `Target Reference Sentence / Key: "${targetTranscript}"` : ''}
${userInput ? `Student's Dictation / Input: "${userInput}"` : ''}
${questionPrompt ? `Question Context: "${questionPrompt}"` : ''}
${correctOption ? `Correct Option Key: "${correctOption}"` : ''}
${userChoice ? `Student's Chosen Option: "${userChoice}"` : ''}
${options && options.length > 0 ? `Options: ${JSON.stringify(options)}` : ''}

Evaluate and return ONLY valid JSON:
{
  "isFullyCorrect": true/false,
  "accuracyScore": 85, // integer 0-100
  "phoneticFeedback": "Detailed Vietnamese feedback on why they missed or got words right (e.g. dropped -s, misheard homophone, connected speech reduction)",
  "trapAnalysis": "Detailed Vietnamese breakdown of the distractor or spelling trap in this exercise",
  "recommendedReflex": "Short 1-sentence tip on how to catch this pattern in the real test"
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Không nhận được nội dung phản hồi từ AI.');

  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return {
      isFullyCorrect: false,
      accuracyScore: 70,
      phoneticFeedback: 'Đã hoàn thành bài nghe. Cần chú ý âm đuôi và hiện tượng nuốt âm.',
      trapAnalysis: 'Hãy đối chiếu kỹ lưỡng với đáp án chuẩn.',
      recommendedReflex: 'Luyện nghe chép chính tả 10 phút mỗi ngày.'
    };
  }
}

/**
 * AI Detailed Evaluator for Speaking Micro-Drills
 * Evaluates A.R.E.A expansion, discourse markers, lexical resource and grammatical depth
 */


export async function generateSpellingTrapAi({ apiKey, model = DEFAULT_MODEL, category = 'Academic Register', bandLevel = '6.5' }) {
  if (!apiKey) throw new Error('Vui lòng nhập AI API Key.');

  const prompt = `Act as a senior Cambridge IELTS examiner. Generate 1 practical IELTS spelling trap item targeting Band ${bandLevel} (within target Band 5.5 - 7.5) in JSON format:
{
  "correct": "exact correctly spelled word suitable for Band ${bandLevel} IELTS Writing (e.g. environment, government, definitely, separate, necessary, maintenance, privilege, proportion, accommodate, until, convenient, technology, opportunity, believe, receive, etc.)",
  "distractors": ["3 common deceptive misspellings that Band ${bandLevel === '5.5' ? '5.0 - 5.5' : '6.0 - 7.0'} students make"],
  "rule": "Một câu mẹo ghi nhớ cực kỳ sắc bén bằng tiếng Việt (mẹo chữ cái, gốc từ, hình ảnh)",
  "contextSentence": "An academic IELTS sentence using the word with '________' replacing the word.",
  "explanation": "Giải thích ngắn gọn nguồn gốc từ và lỗi sai phổ biến bằng tiếng Việt",
  "category": "${category}",
  "bandLevel": "${bandLevel}"
}

Return ONLY raw valid JSON without markdown fences.`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const obj = JSON.parse(clean);
  return { id: `ai-sp-${Date.now()}`, bandLevel: bandLevel, ...obj };
}

export async function generateGrammarDrillAi({ apiKey, model = DEFAULT_MODEL, grammarType = 'Complex Sentences', bandLevel = '7.0' }) {
  if (!apiKey) throw new Error('Vui lòng nhập AI API Key.');

  const prompt = `Act as an elite IELTS Writing Coach. Create 1 practical grammar drill targeting Band ${bandLevel} (range Band 5.5 - 7.5) for pattern "${grammarType}" in JSON format:
{
  "title": "Tên cấu trúc ngữ pháp (e.g. Subject-Verb Agreement, Compound Sentences, Cause and Effect, While/Whereas contrast, Relative clauses, Passive voice, Participle clauses, Not only inversion, Cleft sentence)",
  "bandTarget": "Band ${bandLevel === '5.5' ? 'Band 5.5 - 6.0' : (bandLevel === '6.0' || bandLevel === '6.5' ? 'Band 6.0 - 6.5' : 'Band 7.0 - 7.5')}",
  "bandLevel": "${bandLevel}",
  "formula": "Công thức ngữ pháp rõ ràng, dễ áp dụng",
  "rationale": "Tại sao cấu trúc này giúp bài viết đạt điểm chuẩn Band ${bandLevel} (tiếng Việt)",
  "basicSentence": "Một câu văn thường Band 5.0 - 5.5 diễn đạt ý này",
  "band8Sentence": "Câu văn chuẩn Band ${bandLevel} đã áp dụng cấu trúc",
  "prompt": "Yêu cầu luyện tập cho học viên (tiếng Việt)",
  "testInput": "Câu đề bài cần viết lại",
  "modelAnswer": "Đáp án chuẩn Band ${bandLevel}",
  "drills": [
    {
      "question": "Câu hỏi thực hành bổ sung",
      "origin": "Câu gốc Band 5.0 - 5.5",
      "correctPattern": "Câu viết lại Band ${bandLevel}"
    }
  ]
}

Return ONLY raw valid JSON without markdown fences.`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const obj = JSON.parse(clean);
  return { id: `ai-gr-${Date.now()}`, bandLevel: bandLevel, ...obj };
}

export async function generateThematicVocabAi({ apiKey, model = DEFAULT_MODEL, topic = 'Technology & Digital Life', bandLevel = '7.0' }) {
  if (!apiKey) throw new Error('Vui lòng nhập AI API Key.');

  const prompt = `Act as a Cambridge Lexical Resource specialist. Generate 2 practical vocabulary items / collocations strictly in Band ${bandLevel} (range Band 5.5 - 7.5) for IELTS topic "${topic}" in JSON format:
[
  {
    "term": "Natural academic phrase / collocation chunk (Band ${bandLevel})",
    "phonetic": "/phonetic transcription/",
    "wordType": "noun phrase / verb phrase / collocated chunk",
    "meaningVi": "Nghĩa tiếng Việt dễ hiểu, chuẩn học thuật",
    "collocations": ["collocation 1", "collocation 2", "collocation 3"],
    "bandScore": "${bandLevel}",
    "bandLevel": "${bandLevel}",
    "example": "A clear academic sentence using this term in an IELTS Writing context."
  }
]

Return ONLY raw valid JSON array without markdown fences.`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const arr = JSON.parse(clean);
  return arr.map((item, idx) => ({
    id: `ai-card-${Date.now()}-${idx}`,
    bandLevel: bandLevel,
    ...item,
    mastery: 'learning'
  }));
}

/**
 * Compare Version 1 vs Version 2 Revision Analysis
 */

