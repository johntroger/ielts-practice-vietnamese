/**
 * Gemini Service for IELTS Writing Master & Micro-Drills Studio
 * Directly communicates with Google Gemini API using structured JSON prompts.
 */

const DEFAULT_MODEL = 'gemini-3.6-flash';

export const POPULAR_GEMINI_MODELS = [
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (Khuyên dùng mới nhất - Phản hồi siêu tốc, thông minh)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Tối ưu tốc độ cao)' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Phân tích chuyên sâu Band 8.5+)' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash-Lite' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Bản ổn định v1)' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Bản ổn định v1)' }
];

function cleanModelName(model) {
  if (!model) return DEFAULT_MODEL;
  return model.replace(/^models\//, '').trim();
}

/**
 * Universal Gemini API caller with automatic v1beta <-> v1 version fallback
 */
export async function callGeminiApi({ model, apiKey, body, apiVersion = 'v1beta' }) {
  const modelName = cleanModelName(model);
  const primaryUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${apiKey}`;
  
  let response = await fetch(primaryUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  // If model is not found in v1beta, automatically fallback to v1 (or vice versa)
  if (!response.ok && (response.status === 404 || response.status === 400)) {
    const fallbackVersion = apiVersion === 'v1beta' ? 'v1' : 'v1beta';
    const fallbackUrl = `https://generativelanguage.googleapis.com/${fallbackVersion}/models/${modelName}:generateContent?key=${apiKey}`;
    const fallbackResponse = await fetch(fallbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (fallbackResponse.ok) {
      return fallbackResponse;
    }
  }

  return response;
}

export async function fetchAvailableModels(apiKey) {
  if (!apiKey) return POPULAR_GEMINI_MODELS;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    let response = await fetch(url);
    if (!response.ok) {
      // Try v1
      response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    }
    if (!response.ok) return POPULAR_GEMINI_MODELS;
    const data = await response.json();
    if (data.models && Array.isArray(data.models)) {
      const supported = data.models
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => {
          const rawId = m.name.replace('models/', '');
          return {
            id: rawId,
            name: `${rawId} (${m.displayName || rawId})`
          };
        });
      return supported.length > 0 ? supported : POPULAR_GEMINI_MODELS;
    }
  } catch (e) {
    console.warn('Không thể tự động tải danh sách models:', e);
  }
  return POPULAR_GEMINI_MODELS;
}

export async function testApiKey(apiKey, model = DEFAULT_MODEL) {
  if (!apiKey) throw new Error('Vui lòng nhập Gemini API Key');
  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: 'Reply with the single word "OK" if this connection is working.' }] }]
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Lỗi kết nối API (${response.status})`);
  }
  return true;
}

/**
 * Evaluates student essay according to Cambridge IELTS Band Descriptors (TR/TA, CC, LR, GRA)
 * Enforces strict Cambridge rules (missing Overview hard cap, length penalty).
 */
export async function evaluateEssay({ task, essayText, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');
  if (!essayText || essayText.trim().split(/\s+/).length < 20) {
    throw new Error('Bài viết quá ngắn để giám khảo chấm điểm (tối thiểu 20 từ).');
  }

  const prompt = `ROLE & PERSONA:
You are an expert Cambridge IELTS Senior Examiner and Academic Copy-Editor. You grade strictly according to the official Cambridge IELTS Band Descriptors (TR/TA, CC, LR, GRA) and international Academic Register standards.

CAMBRIDGE EXAMINER HARD CAPS (NON-NEGOTIABLE):
1. TASK 1 OVERVIEW REQUIREMENT: If this is Task 1 and the essay lacks a clear OVERVIEW (general trend or key differences without data), Task Achievement (TR) MUST NOT exceed Band 5.0, regardless of vocabulary or grammar excellence.
2. TASK 2 QUESTION FULFILLMENT: If the candidate does not fully address all parts of the question, Task Response MUST NOT exceed Band 5.5.
3. UNDERLENGTH PENALTY: If word count < 150 (Task 1) or < 250 (Task 2), penalize Task Response / Task Achievement score proportionally.
4. ZERO TOLERANCE FOR EMPTY FLUFF: Do not award high Lexical Resource for rare words used inappropriately or without natural collocations.

ACADEMIC REGISTER & GRAMMAR BENCHMARKS (10-AXES CHECK):
- HEDGING & TONE: Flag over-assertive absolutes ("prove", "obviously", "undoubtedly") and replace with academic hedging ("suggest", "indicate", "tend to").
- UNCOUNTABLE NOUNS: Strictly flag typical non-native errors such as "researches", "evidences", "informations", "feedbacks", "literatures".
- PREPOSITIONS & COLLOCATIONS: Verify academic collocations ("impact on", "consistent with", "contribute to", "differ from", "associated with").
- FORMAL VOCABULARY OVER PHRASAL VERBS: Flag informal phrasal verbs ("find out" -> "identify", "look at" -> "examine", "a lot of" -> "a substantial proportion of").
- AI-SLOP DETECTION: Detect and flag overused, hollow robotic filler phrases ("delve into", "pivotal role", "in today's rapidly evolving landscape", "a testament to") and recommend natural human academic alternatives.

TASK DETAILS:
- Task Number: Task ${task.taskNumber} (${task.taskNumber === 1 ? 'Report' : 'Essay'})
- Question Type: ${task.type}
- Task Prompt: "${task.prompt}"
${task.chartData ? `- Chart Information Provided to Candidate: ${JSON.stringify(task.chartData)}` : ''}

CANDIDATE ESSAY:
"""
${essayText}
"""

INSTRUCTIONS:
1. Provide band scores (from 1.0 to 9.0 in 0.5 increments) for each criterion:
   - TR (Task Achievement for Task 1 / Task Response for Task 2)
   - CC (Coherence & Cohesion)
   - LR (Lexical Resource)
   - GRA (Grammatical Range & Accuracy)
2. Calculate the Overall Band (standard IELTS rounding rule: average of 4 criteria, rounded to nearest 0.5).
3. Extract specific sentence-level corrections (grammar errors, awkward collocations, word choice, punctuation, hedging, academic tone).
4. Provide a full Band 8.5+ rewrite of the candidate's essay, preserving their exact original stance/viewpoint and structure, but elevating lexical precision and grammatical sophistication.
5. Extract 5-8 golden academic collocations from the Band 8.5 rewrite with Vietnamese meanings.

OUTPUT FORMAT: Return ONLY valid, parseable JSON with NO markdown formatting, NO backticks. Schema:
{
  "overallBand": 7.0,
  "criteria": {
    "tr": {
      "band": 7.0,
      "feedback": "Detailed examiner commentary on task achievement...",
      "strengths": ["...", "..."],
      "improvements": ["...", "..."]
    },
    "cc": {
      "band": 6.5,
      "feedback": "Detailed examiner commentary on coherence and cohesion...",
      "strengths": ["...", "..."],
      "improvements": ["...", "..."]
    },
    "lr": {
      "band": 7.0,
      "feedback": "Detailed examiner commentary on vocabulary and collocations...",
      "strengths": ["...", "..."],
      "improvements": ["...", "..."]
    },
    "gra": {
      "band": 6.5,
      "feedback": "Detailed examiner commentary on grammar range and errors...",
      "strengths": ["...", "..."],
      "improvements": ["...", "..."]
    }
  },
  "corrections": [
    {
      "original": "exact sentence from candidate text",
      "corrected": "polished academic version",
      "type": "grammar | vocabulary | collocation | punctuation",
      "explanation": "clear explanation in Vietnamese explaining why and how to improve"
    }
  ],
  "band8Rewrite": "Full complete rewritten essay at Band 8.5+...",
  "keyVocabulary": [
    {
      "phrase": "collocation or academic idiom",
      "meaningVi": "Vietnamese meaning and explanation",
      "example": "example sentence"
    }
  ]
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Lỗi từ Gemini (${response.status})`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Không nhận được phản hồi hợp lệ từ Gemini.');

  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', text);
    throw new Error('Lỗi định dạng phản hồi từ AI. Vui lòng thử lại.');
  }
}

/**
 * Intelligent Document Ingestion: Parses raw text from books, PDFs, or teacher notes into an IELTS Task
 */
export async function parseDocumentToTask({ rawText, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình Gemini API Key.');

  const prompt = `You are an expert Cambridge IELTS curriculum coordinator. Analyze the following raw study material / text excerpt and parse it into a clean, structured IELTS Writing Task.

RAW TEXT INPUT:
"""
${rawText}
"""

EXTRACT & PRODUCE:
1. Determine if this is Task 1 or Task 2.
2. Concise, professional Title (e.g. "Cambridge 18 Test 2: Online vs In-person Education").
3. Exact Task Prompt.
4. If Task 1 has numbers or steps, represent them clearly.
5. If a Model Answer is present in the text, extract it; if absent, generate a Band 8.5 Model Answer.
6. 4-step Outline.
7. 4-6 Key Collocations with Vietnamese translations.

Return ONLY raw parseable JSON in this schema:
{
  "title": "Title of task",
  "taskNumber": 2,
  "type": "opinion | discussion | advantages | problems | twopart | line | bar | pie | process | map",
  "topic": "tech | env | edu | work | society | health | urban",
  "prompt": "Full prompt text...",
  "minWords": 250,
  "timeLimit": 40,
  "outline": {
    "introduction": "...",
    "body1": "...",
    "body2": "...",
    "conclusion": "..."
  },
  "modelAnswer": "...",
  "vocabularyHighlights": [
    { "word": "...", "meaning": "..." }
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

  if (!response.ok) throw new Error('Lỗi khi trích xuất tài liệu từ Gemini.');
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    id: `ingested-${Date.now()}`,
    isCustom: true,
    isIngested: true,
    createdAt: new Date().toISOString(),
    ...parsed
  };
}

/**
 * Instant Evaluation for Paraphrased Sentence Drills
 */
export async function evaluateParaphrase({ originalSentence, candidateSentence, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình Gemini API Key.');
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

  if (!response.ok) throw new Error('Lỗi khi chấm câu Paraphrase.');
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * AI Auto-Generates New Micro-Drills on demand
 */
export async function generateMicroDrill({ drillType, topic = 'general', apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');

  let prompt = '';

  if (drillType === 'fill-blanks') {
    prompt = `Act as an expert Cambridge IELTS coach. Generate 1 brand new "Fill-in-the-Blanks" micro-drill testing prepositions of data (Task 1) or academic cohesive devices / linking words (Task 2).
Topic: ${topic}

Requirements:
- "title": Short title (e.g. "Giới từ miêu tả tỷ trọng & biến đổi" or "Từ nối tương phản nâng cao")
- "category": e.g. "Task 1 Data Prepositions" or "Task 2 Cohesive Devices"
- "passage": A paragraph (3-4 sentences) with 3 to 4 blanks represented by "___".
- "blanks": Array of 3-4 objects, each with:
  - "index": integer (0, 1, 2, 3) corresponding to the blanks in order
  - "answer": the correct word (e.g. "at", "by", "However", "Consequently")
  - "options": array of 4 choices [correct word and 3 plausible distractors]
  - "explanation": Vietnamese explanation of grammar / rule why this word is correct

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
- "title": Short descriptive title
- "category": "Task 1 Data Accuracy"
- "context": A concise data summary (e.g. "Dữ liệu năm 2024: Nước A: 45%, Nước B: 30%, Nước C: 15%, Nước D: 10%...")
- "questions": Array of 4 statement objects, each with:
  - "id": "q1", "q2", "q3", "q4"
  - "statement": English statement interpreting the data (some true, some false traps like confusing percentage vs percentage points or lowest vs highest)
  - "isTrue": boolean (true or false)
  - "explanation": Vietnamese explanation detailing why it is true or false based on the numbers

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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Lỗi từ Gemini (${response.status}) khi sinh bài tập.`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Không nhận được nội dung phản hồi từ Gemini.');

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
 * Generates an authentic IELTS Task 1 or Task 2 prompt with complete learning materials
 */
export async function generateNewTask({ taskNumber, type, topic, timeFrame = 'any', targetBand = 8.0, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình Gemini API Key trong phần Cài đặt.');

  const isTask1 = Number(taskNumber) === 1;

  let timeFrameInstruction = '';
  if (isTask1) {
    if (timeFrame === 'static') {
      timeFrameInstruction = `
TIME-FRAME CONSTRAINT: STATIC (Single Point in Time / No time progression).
- The chart/table MUST represent data at ONE SINGLE YEAR (e.g. 2023 or 2024) or without chronological progression.
- DO NOT use time progression across multiple years.
- The model answer MUST focus entirely on COMPARISONS (highest/lowest, rankings, multiples, proportional shares, ratios) and MUST NOT use trend verbs (increase/decrease/rise/fall).`;
    } else if (timeFrame === 'dynamic') {
      timeFrameInstruction = `
TIME-FRAME CONSTRAINT: DYNAMIC (Change over time).
- The chart/table MUST represent chronological progression with at least 3-6 distinct time points (e.g. 2010, 2015, 2020, 2025).
- The model answer MUST focus on TRENDS (upward/downward trajectories, surges, declines, plateaus, fluctuations) as well as overall leaders.`;
    }
  }

  let prompt = '';

  if (isTask1) {
    if (type === 'process') {
      prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, highly authentic IELTS Writing Task 1 Academic prompt for a PROCESS DIAGRAM (manufacturing, natural life cycle, or mechanical procedure) reflecting Cambridge standards.
Topic Category: ${topic || 'Technology & Science'}
Task Type: process

REQUIREMENTS:
1. Provide a realistic prompt title and prompt text ("The diagram below illustrates the process of... Summarise the information by selecting and reporting the main features...").
2. Provide a 5 to 7-step sequential workflow for the process in "processSteps".
   Each step must have:
   - "step": integer (1, 2, 3...)
   - "name": short step name (e.g. "Collection & Sorting", "Thermal Cracking")
   - "desc": clear 1-2 sentence description of what happens, equipment used, and input/output.
3. Provide an ideal 4-paragraph outline (introduction, overview, body1, body2).
4. Provide a Band 8.5+ Model Answer with outstanding sequencing vocabulary (initially, subsequently, prior to being, once transformed) and passive voice structures.
5. Provide 5-6 vocabulary highlights with Vietnamese explanations.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Manufacturing Process of ...",
  "prompt": "The diagram below illustrates how ... is manufactured/produced. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "type": "process",
  "processSteps": [
    { "step": 1, "name": "Raw Material Harvesting", "desc": "Raw ingredients are gathered and transported to the processing plant." },
    { "step": 2, "name": "Purification", "desc": "Impurities are filtered out through a series of high-pressure chambers." }
  ],
  "keywords": ["process", "stages", "raw materials"],
  "outline": {
    "introduction": "...",
    "overview": "...",
    "body1": "...",
    "body2": "..."
  },
  "modelAnswer": "...",
  "vocabularyHighlights": [
    { "word": "...", "meaning": "..." }
  ]
}`;
    } else if (type === 'map') {
      prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, highly authentic IELTS Writing Task 1 Academic prompt for a MAP TRANSFORMATION (comparison of a town, village, campus, or island between two periods, e.g. 2000 vs present or before vs after redevelopment).
Topic Category: ${topic || 'Urban Planning & Geography'}
Task Type: map

REQUIREMENTS:
1. Provide a realistic prompt title and prompt text ("The maps below show the changes that occurred in ... between ... and ... Summarise the information...").
2. Provide 4 to 6 key location/feature changes in "mapChanges".
   Each item must have:
   - "feature": specific area or landmark (e.g. "North-Western Farmland", "Industrial Dockland", "Southern Coastline")
   - "past": description of how it looked in the earlier period
   - "present": description of the modern / redeveloped state (demolished, relocated, expanded, pedestrianized, etc.)
3. Provide an ideal 4-paragraph outline (introduction, overview, body1, body2).
4. Provide a Band 8.5+ Model Answer with outstanding directional vocabulary (situated in the north-east, flanked by, replaced with, transformed into).
5. Provide 5-6 vocabulary highlights with Vietnamese explanations.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Redevelopment of ... (1995 vs Present)",
  "prompt": "The two maps below illustrate the changes in ... between ... and ... Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "type": "map",
  "mapChanges": [
    { "feature": "North Area", "past": "Unused wasteland and farmland", "present": "Converted into a technology park with modern office blocks" },
    { "feature": "Harbour / Waterfront", "past": "Traditional fishing port with timber piers", "present": "Demolished to make way for a recreational marina and promenade" }
  ],
  "keywords": ["transformation", "demolished", "constructed", "expanded"],
  "outline": {
    "introduction": "...",
    "overview": "...",
    "body1": "...",
    "body2": "..."
  },
  "modelAnswer": "...",
  "vocabularyHighlights": [
    { "word": "...", "meaning": "..." }
  ]
}`;
    } else if (type === 'table') {
      prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, highly authentic IELTS Writing Task 1 Academic prompt for a TABLE of statistical data reflecting Cambridge standards.
Topic Category: ${topic || 'General Economy & Demographics'}
Task Type: table
${timeFrameInstruction}

REQUIREMENTS:
1. Provide a realistic prompt title and prompt text ("The table below presents data on... Summarise the information...").
2. Provide a numerical table formatted in "tableData":
   - "headers": array of column headers (e.g. ["Country / Category", "2015", "2020", "2025"] if dynamic, or ["Country", "Expenditure", "Population Share", "Rank"] if static).
   - "rows": array of arrays representing each row's values.
3. Also provide the identical data as "chartData" (with type "bar") so the application can render a comparative visual bar chart alongside the table.
4. Provide an ideal 4-paragraph outline (introduction, overview, body1, body2).
5. Provide a Band 8.5+ Model Answer with outstanding language fitting the time frame (trends if dynamic, comparative rankings if static).
6. Provide 5-6 vocabulary highlights with Vietnamese explanations.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Statistical Data on ...",
  "prompt": "The table below illustrates ... in various sectors between ... and ... Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "type": "table",
  "tableData": {
    "headers": ["Sector", "2015", "2020", "2025"],
    "rows": [
      ["Sector A", "12,000", "15,500", "22,000"],
      ["Sector B", "8,500", "9,200", "9,800"]
    ]
  },
  "chartData": {
    "type": "bar",
    "labels": ["Sector A", "Sector B"],
    "datasets": [
      { "label": "2015", "data": [12000, 8500], "backgroundColor": "#3B82F6" },
      { "label": "2025", "data": [22000, 9800], "backgroundColor": "#10B981" }
    ]
  },
  "keywords": ["table", "comparison", "increase", "decrease"],
  "outline": {
    "introduction": "...",
    "overview": "...",
    "body1": "...",
    "body2": "..."
  },
  "modelAnswer": "...",
  "vocabularyHighlights": [
    { "word": "...", "meaning": "..." }
  ]
}`;
    } else if (type === 'mixed') {
      prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, highly authentic IELTS Writing Task 1 Academic prompt for a MIXED / COMBINATION CHART (e.g. A Pie Chart + Bar Chart, or A Table + Line Graph) reflecting Cambridge standards.
Topic Category: ${topic || 'Society & Economics'}
Task Type: mixed

REQUIREMENTS:
1. Provide a realistic prompt title and prompt text ("The charts below show... and the table/graph shows... Summarise the information by selecting and reporting the main features, and make comparisons where relevant.").
2. Provide TWO datasets representing the two combined components:
   - Component 1: "chartData" (type "pie" or "bar" or "line") with 4-5 items.
   - Component 2: "secondChartData" (type "bar" or "line") OR "tableData" with headers and rows.
   (Provide "chartData" with a "chartTitle" e.g. "Chart 1: Distribution of Energy by Source" and "secondChartData" with "chartTitle" e.g. "Chart 2: Carbon Emissions by Sector").
3. Provide an ideal 4-paragraph outline:
   - Introduction: Paraphrase both charts.
   - Overview: Identify overall trends/prominent features across both visuals.
   - Body 1: Detail the first chart.
   - Body 2: Detail the second chart and note any cross-correlations.
4. Provide a Band 8.5+ Model Answer demonstrating seamless synthesis between both sources.
5. Provide 5-6 vocabulary highlights with Vietnamese explanations.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Combined Analysis of ... and ...",
  "prompt": "The pie chart illustrates ... and the bar chart compares ... Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "type": "mixed",
  "chartData": {
    "title": "Biểu đồ 1: Tỷ lệ phân bổ ngân sách",
    "type": "pie",
    "labels": ["Giáo dục", "Y tế", "Quốc phòng", "Hạ tầng"],
    "datasets": [
      {
        "label": "Tỷ lệ (%)",
        "data": [35, 25, 20, 20],
        "backgroundColor": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
      }
    ]
  },
  "secondChartData": {
    "title": "Biểu đồ 2: Tăng trưởng qua các năm (2020-2025)",
    "type": "bar",
    "labels": ["2020", "2022", "2024", "2025"],
    "datasets": [
      {
        "label": "Đầu tư (Tỷ USD)",
        "data": [45, 58, 72, 85],
        "backgroundColor": "#6366F1"
      }
    ]
  },
  "keywords": ["combined chart", "correlation", "proportional share", "growth trajectory"],
  "outline": {
    "introduction": "...",
    "overview": "...",
    "body1": "...",
    "body2": "..."
  },
  "modelAnswer": "...",
  "vocabularyHighlights": [
    { "word": "...", "meaning": "..." }
  ]
}`;
    } else {
      // line, bar, pie
      prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, highly authentic IELTS Writing Task 1 Academic prompt reflecting recent exam trends (2024-2026).
Topic Category: ${topic || 'General Environment or Economy'}
Chart Type: ${type || 'line'} (Choose from line, bar, pie)
${timeFrameInstruction}

REQUIREMENTS:
1. Provide a realistic prompt title and prompt text.
2. Provide a realistic numerical dataset formatted for Chart.js so our web app can render it visually:
   - If DYNAMIC: provide 4-6 categories/years on X axis with clear chronological progression.
   - If STATIC: provide 4-6 categorical entities (e.g. sectors, countries, age brackets) at ONE single point in time.
   - For line: (Must always be dynamic) 3-4 series lines with clear labels.
   - For bar: comparative bars with realistic values.
   - For pie: 4-6 slices with labels and percentage values adding up to 100%.
3. Provide an ideal outline (Introduction, Overview, Body 1, Body 2).
4. Provide a Band 8.5+ Model Answer with outstanding reporting vocabulary (trend vocabulary if dynamic, comparative & ratio structures if static).
5. Provide 5-6 vocabulary highlights with Vietnamese explanations.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Title of the task",
  "prompt": "The graph below shows...",
  "type": "${type || 'line'}",
  "chartData": {
    "type": "${type || 'line'}",
    "labels": ["2010", "2015", "2020", "2025"],
    "datasets": [
      {
        "label": "Series 1",
        "data": [10, 25, 45, 60],
        "borderColor": "#3B82F6",
        "backgroundColor": "rgba(59, 130, 246, 0.2)"
      }
    ]
  },
  "keywords": ["...", "..."],
  "outline": {
    "introduction": "...",
    "overview": "...",
    "body1": "...",
    "body2": "..."
  },
  "modelAnswer": "...",
  "vocabularyHighlights": [
    { "word": "...", "meaning": "..." }
  ]
}`;
    }
  } else {
    prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, thought-provoking IELTS Writing Task 2 prompt reflecting hot current topics (2024-2026).
Topic Category: ${topic || 'Technology or Society'}
Question Type: ${type || 'opinion'} (e.g. opinion, discussion, advantages, problems, twopart)

REQUIREMENTS:
1. Realistic, modern prompt text.
2. Keyword breakdown.
3. 4-paragraph outline with logical ideas and real-world examples.
4. Band 8.5+ model essay.
5. 6-8 key academic collocations with Vietnamese meanings.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Short title of the task",
  "prompt": "Full IELTS prompt text ending with standard question...",
  "keywords": ["...", "..."],
  "outline": {
    "introduction": "...",
    "body1": "...",
    "body2": "...",
    "conclusion": "..."
  },
  "modelAnswer": "Full Band 8.5 model essay...",
  "vocabularyHighlights": [
    { "word": "...", "meaning": "..." }
  ]
}`;
  }

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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Lỗi từ Gemini (${response.status})`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Không nhận được phản hồi từ Gemini.');

  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const taskObj = JSON.parse(cleaned);
    return {
      id: `ai-gen-${Date.now()}`,
      taskNumber: Number(taskNumber),
      type: type || (isTask1 ? 'line' : 'opinion'),
      topic: topic || 'tech',
      minWords: isTask1 ? 150 : 250,
      timeLimit: isTask1 ? 20 : 40,
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
      ...taskObj
    };
  } catch (err) {
    console.error('Failed to parse generated task JSON:', text);
    throw new Error('Lỗi định dạng khi AI sinh đề. Vui lòng thử lại.');
  }
}

/**
 * Instant Brainstorming & Idea Generator for Task 2
 */
export async function brainstormIdeas({ promptText, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình Gemini API Key.');

  const prompt = `Act as an elite IELTS Writing mentor. Brainstorm ideas and arguments for this IELTS Writing prompt:
"${promptText}"

Provide:
1. 2 distinct perspectives / main arguments.
2. For each perspective: 2 strong supporting ideas + 1 concrete real-world example.
3. 5 high-impact academic collocations suitable for this specific topic with Vietnamese translation.

Format output cleanly in Vietnamese with clear bullet points. Keep it punchy and ready to use in a 40-minute test.`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6 }
    }
  });

  if (!response.ok) throw new Error('Lỗi khi gợi ý ý tưởng từ Gemini.');
  const result = await response.json();
  return result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * AI Generator for Vocab, Grammar, and Spelling items
 */
export async function generateSpellingTrapAi({ apiKey, model = DEFAULT_MODEL, category = 'Academic Register', bandLevel = '6.5' }) {
  if (!apiKey) throw new Error('Vui lòng nhập Gemini API Key.');

  const prompt = `Act as a senior Cambridge IELTS examiner. Generate 1 practical IELTS spelling trap item targeting Band ${bandLevel} (within target Band 6.0 - 7.5) in JSON format:
{
  "correct": "exact correctly spelled word suitable for Band ${bandLevel} IELTS Writing (e.g. environment, government, definitely, separate, necessary, maintenance, privilege, proportion, accommodate, etc.)",
  "distractors": ["3 common deceptive misspellings that Band 6.0 - 7.0 students make"],
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

  if (!response.ok) throw new Error('Lỗi khi gọi Gemini để tạo bẫy chính tả.');
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const obj = JSON.parse(clean);
  return { id: `ai-sp-${Date.now()}`, bandLevel: bandLevel, ...obj };
}

export async function generateGrammarDrillAi({ apiKey, model = DEFAULT_MODEL, grammarType = 'Complex Sentences', bandLevel = '7.0' }) {
  if (!apiKey) throw new Error('Vui lòng nhập Gemini API Key.');

  const prompt = `Act as an elite IELTS Writing Coach. Create 1 practical grammar drill targeting Band ${bandLevel} (range Band 6.0 - 7.5) for pattern "${grammarType}" in JSON format:
{
  "title": "Tên cấu trúc ngữ pháp (e.g. While/Whereas contrast, Relative clauses, Passive voice, Participle clauses, Not only inversion, Cleft sentence)",
  "bandTarget": "Band ${bandLevel === '6.0' || bandLevel === '6.5' ? 'Band 6.0 - 6.5' : 'Band 7.0 - 7.5'}",
  "bandLevel": "${bandLevel}",
  "formula": "Công thức ngữ pháp rõ ràng, dễ áp dụng",
  "rationale": "Tại sao cấu trúc này giúp bài viết đạt điểm chuẩn Band ${bandLevel} (tiếng Việt)",
  "basicSentence": "Một câu văn thường Band 5.5 - 6.0 diễn đạt ý này",
  "band8Sentence": "Câu văn chuẩn Band ${bandLevel} đã áp dụng cấu trúc",
  "prompt": "Yêu cầu luyện tập cho học viên (tiếng Việt)",
  "testInput": "Câu đề bài cần viết lại",
  "modelAnswer": "Đáp án chuẩn Band ${bandLevel}",
  "drills": [
    {
      "question": "Câu hỏi thực hành bổ sung",
      "origin": "Câu gốc Band 5.5",
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

  if (!response.ok) throw new Error('Lỗi khi gọi Gemini để tạo bài tập ngữ pháp.');
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const obj = JSON.parse(clean);
  return { id: `ai-gr-${Date.now()}`, bandLevel: bandLevel, ...obj };
}

export async function generateThematicVocabAi({ apiKey, model = DEFAULT_MODEL, topic = 'Technology & Digital Life', bandLevel = '7.0' }) {
  if (!apiKey) throw new Error('Vui lòng nhập Gemini API Key.');

  const prompt = `Act as a Cambridge Lexical Resource specialist. Generate 2 practical vocabulary items / collocations strictly in Band ${bandLevel} (range Band 6.0 - 7.5) for IELTS topic "${topic}" in JSON format:
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

  if (!response.ok) throw new Error('Lỗi khi gọi Gemini để tạo thẻ từ vựng.');
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
export async function evaluateRevisionComparison({ task, v1Text, v1Evaluation, v2Text, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cung cấp Gemini API Key.');

  const prompt = `You are a Cambridge IELTS Senior Examiner. The candidate has written Version 1 of an essay and has now revised it into Version 2 to address previous feedback and improve their band score.

TASK PROMPT:
"${task.prompt}"

CANDIDATE VERSION 1:
"""
${v1Text}
"""
Previous Band Score V1: ${v1Evaluation?.overallBand || '6.0'} (TR: ${v1Evaluation?.criteria?.tr?.band || '6.0'}, CC: ${v1Evaluation?.criteria?.cc?.band || '6.0'}, LR: ${v1Evaluation?.criteria?.lr?.band || '6.0'}, GRA: ${v1Evaluation?.criteria?.gra?.band || '6.0'})

CANDIDATE VERSION 2 (REVISED):
"""
${v2Text}
"""

INSTRUCTIONS:
1. Grade Version 2 rigorously based on Cambridge standards for all 4 criteria (TR/TA, CC, LR, GRA) and compute the new overallBand.
2. Conduct a side-by-side comparison:
   - What key errors from V1 were successfully fixed in V2?
   - What persistent weaknesses remain?
   - Specific band differences in each of the 4 criteria.
3. Provide an encouraging yet strict feedback summary in Vietnamese.

OUTPUT FORMAT: Return ONLY valid JSON without markdown fences. Schema:
{
  "overallBand": 7.0,
  "criteria": {
    "tr": { "band": 7.0, "feedback": "...", "delta": "+0.5" },
    "cc": { "band": 7.0, "feedback": "...", "delta": "+0.5" },
    "lr": { "band": 7.0, "feedback": "...", "delta": "+0.5" },
    "gra": { "band": 6.5, "feedback": "...", "delta": "0.0" }
  },
  "fixedItems": [
    "Sửa triệt để lỗi chia động từ ở đoạn 2",
    "Thêm câu Overview sắc nét giúp tăng Task Achievement",
    "Thay thế từ ngữ văn nói bằng collocations học thuật"
  ],
  "remainingIssues": [
    "Vẫn còn lặp lại liên từ 'However'",
    "Cần phát triển sâu hơn một luận cứ ở Body 2"
  ],
  "examinerVerdict": "Nhận xét tổng quát bằng tiếng Việt về sự tiến bộ giữa hai bản viết...",
  "corrections": [
    {
      "original": "câu có lỗi trong v2",
      "corrected": "cách sửa gợi ý",
      "explanation": "giải thích chi tiết bằng tiếng Việt"
    }
  ]
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3 }
    }
  });

  if (!response.ok) throw new Error('Lỗi khi chấm điểm so sánh v1 và v2.');
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(clean);
}


