/**
 * Speaking Domain AI Service
 * Handles full 3-part Speaking mock examinations, practice reflex drills, examiner branching, and audio transcription.
 */

import { callGeminiApi, robustJsonParse } from './coreGeminiClient.js';
import { 
  evaluateSpeakingAlgorithmically, 
  evaluateSinglePracticeAnswerAlgorithmically 
} from '../algorithmicSpeakingService.js';

export async function evaluateSpeakingMicroDrill({
  drillType,
  question,
  userInput,
  modelAnswer,
  apiKey,
  model = DEFAULT_MODEL,
  language = 'vi'
}) {
  if (!apiKey) throw new Error(language === 'en' ? 'Please configure your AI API Key in Settings.' : 'Vui lòng cấu hình AI API Key trong phần Cài đặt.');

  const isEnglish = language === 'en';

  const prompt = `Act as an expert Cambridge IELTS Speaking senior examiner and pronunciation coach.
Evaluate the student's spoken/typed response for this IELTS Speaking Micro-Drill:
Drill Type: ${drillType}
Examiner Question: "${question}"
Student Response: "${userInput}"
${modelAnswer ? `Reference Band 8.5 Model Answer: "${modelAnswer}"` : ''}

Evaluate strictly according to Cambridge IELTS Speaking 4 criteria:
1. Fluency & Coherence (answer expansion, natural pace, minimal hesitation)
2. Lexical Resource (idiomatic expressions, precision, avoiding repetition)
3. Grammatical Range & Accuracy (complex structures, tenses)
4. Pronunciation & Intonation advice
${isEnglish 
  ? '5. LANGUAGE DIRECTIVE: Output all feedbacks, commentary and recommended actions strictly in ENGLISH.'
  : '5. Output all feedbacks, commentary and recommended actions in clear, helpful Vietnamese.'}

Return ONLY raw parseable JSON:
{
  "estimatedBand": 7.0,
  "fluencyFeedback": "${isEnglish ? 'Detailed English feedback on answer expansion, coherence, discourse markers' : 'Nhận xét chi tiết bằng tiếng Việt về phát triển câu và mạch lạc'}",
  "lexicalFeedback": "${isEnglish ? 'Detailed English feedback on vocabulary choice, collocations and precision' : 'Nhận xét chi tiết về từ vựng và collocations'}",
  "grammarFeedback": "${isEnglish ? 'Detailed English feedback on grammar range and accuracy' : 'Nhận xét chi tiết về cấu trúc ngữ pháp'}",
  "upgradedVersion": "Band 8.5 polished version of the student's idea maintaining their authentic personal stance",
  "recommendedAction": "${isEnglish ? '1 actionable practice tip in English for the next attempt' : '1 lời khuyên luyện tập cụ thể bằng tiếng Việt'}"
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
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
      estimatedBand: 7.0,
      fluencyFeedback: 'Ý tưởng trả lời rõ ràng, phát triển đầy đủ các ý chính.',
      lexicalFeedback: 'Vốn từ sử dụng tự nhiên, có vận dụng collocations tốt.',
      grammarFeedback: 'Ngữ pháp ổn định, có kết hợp câu ghép và câu phức.',
      upgradedVersion: modelAnswer || userInput,
      recommendedAction: 'Luyện tập phát âm nối âm và ngữ điệu để bài nói mượt mà hơn.'
    };
  }
}

/**
 * Sub-Angle Matrices for Diversity Injection (Prevents AI repetitiveness & duplicate generation)
 */


export async function evaluateSpeakingMockExam({
  dialogueHistory = [],
  mockPack,
  examiner,
  totalDurationSec = 600,
  apiKey,
  model = DEFAULT_MODEL,
  language = 'vi'
}) {
  const isEnglish = language === 'en';
  // Extract candidate answers
  const candidateTurns = dialogueHistory.filter(d => d.speaker === 'candidate');
  const allSpokenText = candidateTurns.map(t => t.text || '').join(' ');
  const words = allSpokenText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const durationMin = Math.max(1, totalDurationSec / 60);
  const wordsPerMinute = Math.round(wordCount / durationMin);

  // Count common filler words
  const fillerRegex = /\b(um|uh|er|ah|like|you know|sort of|kind of|actually|basically|literally)\b/gi;
  const fillersFound = allSpokenText.match(fillerRegex) || [];
  const fillerCount = fillersFound.length;

  // If no API key or no candidate answers, use standalone Cambridge algorithmic engine
  if (!apiKey || candidateTurns.length === 0) {
    return evaluateSpeakingAlgorithmically({
      dialogueHistory,
      mockPack,
      examiner,
      totalDurationSec
    });
  }

  const prompt = `You are an elite Cambridge Senior IELTS Speaking Examiner (IDP/British Council assessment standards).
Analyze the candidate's complete speaking test transcript across Part 1, Part 2, and Part 3.

EXAM PACK: "${mockPack?.title || 'IELTS Speaking Full Mock Test'}"
EXAMINER: "${examiner?.name || 'Senior IELTS Examiner'}"
TOTAL DURATION: ${Math.round(totalDurationSec / 60)} minutes
TOTAL WORDS SPOKEN: ${wordCount} words (~${wordsPerMinute} words per minute)
FILLER WORDS DETECTED: ${fillerCount} fillers (${fillersFound.slice(0, 10).join(', ')})

FULL DIALOGUE TRANSCRIPT:
${dialogueHistory.map(d => `[${(d.stage || 'STAGE').toUpperCase()}] ${d.speaker.toUpperCase()}: ${d.text}`).join('\n\n')}

INSTRUCTIONS:
1. Grade the candidate rigorously on each of the 4 official Cambridge IELTS criteria:
   - Fluency and Coherence (FC)
   - Lexical Resource (LR)
   - Grammatical Range and Accuracy (GRA)
   - Pronunciation (PR - assessed based on clarity, cadence, discourse phrasing, and phonetic accuracy observed from speech recognition)
2. Compute the official overallBand using IELTS half-band rounding rules.
3. Formulate Top 3 Actionable Priorities to gain +0.5 band.
4. For each candidate answer, provide inline feedback, grammatical corrections, an upgraded Band 8.5+ native version preserving the candidate's original message, and golden collocations.
${isEnglish 
  ? '5. CRITICAL LANGUAGE RULE: The user is in English mode. All examiner feedbacks, overall summary verdicts, corrections explanations, and advice MUST be in professional, authentic ENGLISH.'
  : '5. All feedbacks, explanations, and advice must be in clear, professional Vietnamese.'}

OUTPUT FORMAT: Return ONLY valid JSON matching this schema:
{
  "overallBand": 6.5,
  "criteria": {
    "fc": {
      "band": 6.5,
      "title": "Fluency & Coherence",
      "strengths": "...",
      "weaknesses": "...",
      "fillerAnalysis": "...",
      "connectivesEvaluation": "..."
    },
    "lr": {
      "band": 6.5,
      "title": "Lexical Resource",
      "strengths": "...",
      "weaknesses": "...",
      "advancedWordsUsed": ["..."],
      "recommendedCollocations": [
        { "phrase": "...", "meaning": "...", "example": "..." }
      ]
    },
    "gra": {
      "band": 6.0,
      "title": "Grammatical Range & Accuracy",
      "strengths": "...",
      "weaknesses": "...",
      "frequentMistakes": [
        { "original": "...", "corrected": "...", "explanation": "..." }
      ]
    },
    "pr": {
      "band": 7.0,
      "title": "Pronunciation & Intonation",
      "strengths": "...",
      "weaknesses": "...",
      "intonationAdvice": "..."
    }
  },
  "speechAnalytics": {
    "totalWords": ${wordCount},
    "wordsPerMinute": ${wordsPerMinute},
    "fillerWordsCount": ${fillerCount},
    "fillerWordsSample": ${JSON.stringify(fillersFound.slice(0, 8))}
  },
  "topActionablePriorities": [
    "...", "...", "..."
  ],
  "examinerSummaryVerdict": "Nhận xét tổng thể chi tiết bằng tiếng Việt...",
  "turnEvaluations": [
    {
      "stage": "part1",
      "question": "...",
      "candidateAnswer": "...",
      "inlineFeedback": "...",
      "corrections": [
        { "original": "...", "corrected": "...", "explanation": "..." }
      ],
      "upgradedBand8": "...",
      "goldenCollocations": ["..."]
    }
  ]
}`;

  try {
    const response = await callGeminiApi({
      model,
      apiKey,
      body: {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4000,
          responseMimeType: 'application/json'
        }
      }
    });

    if (!response.ok) {
      console.warn('Gemini API call returned non-ok, falling back to local algorithmic evaluation');
      return evaluateSpeakingAlgorithmically({
        dialogueHistory,
        mockPack,
        examiner,
        totalDurationSec
      });
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = robustJsonParse(text, null);

    if (!parsed || !parsed.overallBand) {
      console.warn('Failed to parse JSON, using algorithmic evaluation');
      return evaluateSpeakingAlgorithmically({
        dialogueHistory,
        mockPack,
        examiner,
        totalDurationSec
      });
    }

    return {
      ...parsed,
      evaluationMethod: 'ai'
    };
  } catch (err) {
    console.error('Error in evaluateSpeakingMockExam, using algorithmic evaluation:', err);
    return evaluateSpeakingAlgorithmically({
      dialogueHistory,
      mockPack,
      examiner,
      totalDurationSec
    });
  }
}

export { evaluateSpeakingAlgorithmically, evaluateSinglePracticeAnswerAlgorithmically };

/**
 * AI Speaking Mock Test Pack Generator
 * Generates an authentic full IELTS Speaking mock pack (Part 1, 2, 3) on any topic.
 */
export async function generateSpeakingMockPack({
  topic = 'Công nghệ, Trí tuệ Nhân tạo & Tương lai Nghề nghiệp',
  difficulty = 'Medium - Hard',
  targetBand = '7.0 - 8.5',
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key trong phần Cài đặt.');

  const prompt = `You are an expert Cambridge IELTS Chief Examiner and Speaking Test Author.
Generate a brand-new, highly authentic, comprehensive IELTS Speaking Mock Test Pack covering full Part 1, Part 2, and Part 3 strictly aligned with official Cambridge and IDP/British Council assessment standards.

TOPIC / THEME: "${topic}"
DIFFICULTY: "${difficulty}" (Target Band: "${targetBand}")

REQUIREMENTS:
1. "title": Engaging title in Vietnamese & English (e.g. "Full Mock Test: ${topic}")
2. "summary": Concise 2-sentence Vietnamese overview describing what competencies this test evaluates.
3. "difficulty": "${difficulty}"
4. "targetBand": "${targetBand}"
5. "estTime": "11 - 14 phút"
6. PART 1 ("part1Topic"):
   - "title": Concise topic title in English
   - "category": Category name
   - "tag": "AI Forecast"
   - "questions": Array of 3 progressive interview questions, each with:
     * "qId": "p1-ai-1", "p1-ai-2", "p1-ai-3"
     * "question": Authentic spoken question
     * "focus": What skill or response angle this tests
     * "strategy": Vietnamese coaching tip for candidate
     * "vocabHints": Array of 3-4 collocations [{ "phrase": "...", "meaningVi": "..." }]
     * "sampleAnswer": Exemplary Band 8.5 model response (35-50 words)
7. PART 2 ("part2Card"):
   - "title": Cue Card title in English
   - "category": Category name
   - "prompt": Standard prompt (e.g. "Describe a ... You should say: ...")
   - "cueBullets": Array of 4 bullet points guiding the candidate
   - "prepGuide4Quadrants": { "q1": "Who/What cue", "q2": "When/Where cue", "q3": "How/Why cue", "q4": "Feelings & Epiphany" }
   - "vocabHints": Array of 4-5 C1-C2 collocations [{ "phrase": "...", "meaningVi": "..." }]
   - "sampleAnswer": Complete Band 8.5 model monologue (150-180 words)
8. PART 3 ("part3Set"):
   - "topic": Abstract societal theme connected to Part 2
   - "questions": Array of 3 in-depth discussion questions, each with:
     * "qId": "p3-ai-1", "p3-ai-2", "p3-ai-3"
     * "question": Analytical question demanding critical evaluation
     * "analysisType": Conceptual angle (e.g. "Societal Trend", "Ethical Dilemma", "Future Projection")
     * "strategy": Vietnamese coaching tip
     * "vocabHints": Array of 3-4 advanced phrases [{ "phrase": "...", "meaningVi": "..." }]
     * "sampleAnswer": Band 8.5 academic response with hedging and nuanced reasoning (50-70 words)

OUTPUT FORMAT: Return ONLY valid raw JSON with NO markdown fences:
{
  "title": "Full Mock Test: ...",
  "summary": "...",
  "difficulty": "${difficulty}",
  "targetBand": "${targetBand}",
  "estTime": "11 - 14 phút",
  "part1Topic": {
    "title": "...",
    "category": "...",
    "tag": "AI Forecast",
    "questions": [
      {
        "qId": "p1-ai-1",
        "question": "...",
        "focus": "...",
        "strategy": "...",
        "vocabHints": [{ "phrase": "...", "meaningVi": "..." }],
        "sampleAnswer": "..."
      }
    ]
  },
  "part2Card": {
    "title": "...",
    "category": "...",
    "prompt": "...",
    "cueBullets": ["...", "...", "...", "..."],
    "prepGuide4Quadrants": { "q1": "...", "q2": "...", "q3": "...", "q4": "..." },
    "vocabHints": [{ "phrase": "...", "meaningVi": "..." }],
    "sampleAnswer": "..."
  },
  "part3Set": {
    "topic": "...",
    "questions": [
      {
        "qId": "p3-ai-1",
        "question": "...",
        "analysisType": "...",
        "strategy": "...",
        "vocabHints": [{ "phrase": "...", "meaningVi": "..." }],
        "sampleAnswer": "..."
      }
    ]
  }
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3500,
        responseMimeType: 'application/json'
      }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const parsed = robustJsonParse(text, null);
  if (!parsed || !parsed.part1Topic || !parsed.part2Card || !parsed.part3Set) {
    throw new Error('Dữ liệu bộ đề Speaking do AI sinh ra không đầy đủ. Vui lòng thử lại.');
  }

  return parsed;
}

/**
 * AI Single-Answer Evaluator for Speaking Practice Mode (Part 1, 2, or 3)
 * Analyzes candidate transcript against Cambridge Speaking criteria, provides band score,
 * sentence corrections, upgraded Band 8.5+ version, and golden collocations.
 */
export async function evaluateSpeakingPracticeAnswer({
  part = 1,
  topicTitle = '',
  questionText = '',
  cueBullets = [],
  candidateTranscript = '',
  durationSec = 30,
  apiKey,
  model = DEFAULT_MODEL
}) {
  const words = (candidateTranscript || '').trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (!apiKey || wordCount < 5) {
    return evaluateSinglePracticeAnswerAlgorithmically({
      part,
      topicTitle,
      questionText,
      cueBullets,
      candidateTranscript,
      durationSec
    });
  }

  const prompt = `You are a Senior Cambridge IELTS Speaking Examiner (IDP/British Council assessment standards).
Evaluate the candidate's spoken response for this specific IELTS Speaking Part ${part} practice exercise.

EXAM PART: Part ${part}
TOPIC: "${topicTitle}"
QUESTION / PROMPT: "${questionText}"
${cueBullets && cueBullets.length > 0 ? `CUE BULLETS (Part 2): ${JSON.stringify(cueBullets)}` : ''}
RECORDED TIME: ${durationSec} seconds
WORD COUNT: ${wordCount} words

CANDIDATE'S SPOKEN TRANSCRIPT:
"""
${candidateTranscript}
"""

TASK:
1. Provide estimated Band Scores (from 4.0 to 9.0 in 0.5 increments) for:
   - Overall Band for this response
   - FC (Fluency & Coherence)
   - LR (Lexical Resource)
   - GRA (Grammatical Range & Accuracy)
   - PR (Pronunciation & Intonation notes based on transcript and flow)
2. Extract specific grammatical, word choice, or collocation errors in "corrections":
   - "original": exact problematic phrase from transcript
   - "corrected": polished academic native version
   - "explanation": clear Vietnamese explanation
3. Provide a complete, natural Band 8.5+ native rewrite ("upgradedBand8") preserving the candidate's exact ideas and message.
4. Extract 3-5 golden academic collocations ("goldenCollocations") with Vietnamese meanings.
5. Provide a constructive, motivating examiner summary commentary in Vietnamese ("examinerComment").

OUTPUT FORMAT: Return ONLY valid raw JSON with NO markdown fences:
{
  "overallBand": 6.5,
  "criteria": {
    "fc": { "band": 6.5, "feedback": "..." },
    "lr": { "band": 6.5, "feedback": "..." },
    "gra": { "band": 6.0, "feedback": "..." },
    "pr": { "band": 6.5, "feedback": "..." }
  },
  "corrections": [
    {
      "original": "...",
      "corrected": "...",
      "explanation": "..."
    }
  ],
  "upgradedBand8": "...",
  "goldenCollocations": [
    { "phrase": "...", "meaningVi": "..." }
  ],
  "examinerComment": "..."
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2500,
        responseMimeType: 'application/json'
      }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const parsed = robustJsonParse(text, null);
  if (!parsed || !parsed.overallBand) {
    throw new Error('Dữ liệu kết quả chấm điểm AI không đúng định dạng. Vui lòng thử lại.');
  }

  return parsed;
}

/**
 * AI Single-Part Topic Generator for Speaking Practice Mode
 * Generates a brand-new practice topic with questions (Part 1, Part 2, or Part 3)
 */
export async function generateSpeakingPracticeTopic({
  part = 1,
  topic = 'Technology & Daily Life',
  existingTopics = [],
  existingQuestions = [],
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key trong phần Cài đặt.');

  // Diversity Angle Injection: Pick a randomized sub-angle to guarantee speaking uniqueness
  const randomAngle = SPEAKING_SUB_ANGLES[Math.floor(Math.random() * SPEAKING_SUB_ANGLES.length)];

  // Strict Exclusion List: Prevent repeating past speaking questions/topics
  let exclusionInstruction = '';
  const knownItems = [
    ...(Array.isArray(existingTopics) ? existingTopics : []),
    ...(Array.isArray(existingQuestions) ? existingQuestions : [])
  ].filter(Boolean).slice(0, 15);

  if (knownItems.length > 0) {
    const list = knownItems.map((item, idx) => `  ${idx + 1}. "${item}"`).join('\n');
    exclusionInstruction = `
CRITICAL NO-DUPLICATION & DIVERSITY CONSTRAINT:
The candidate has ALREADY answered/practiced the following questions or topics:
${list}

STRICT GENERATION RULES:
- You MUST NOT repeat, imitate, or ask questions conceptually similar to the list above.
- Create original questions exploring modern 2025-2026 perspectives.
- Anchor questions through this unique nuance/angle: "${randomAngle}".
`;
  } else {
    exclusionInstruction = `
NOVELTY CONSTRAINT:
- Anchor questions through this unique contemporary angle: "${randomAngle}".
- Avoid cliche exam questions; ask fresh, engaging real-life prompts.
`;
  }

  let prompt = '';

  if (part === 1) {
    prompt = `You are a Cambridge IELTS Speaking Examiner. Generate 1 new Part 1 topic containing 3 authentic interview questions on the theme "${topic}".
${exclusionInstruction}
Output valid raw JSON:
{
  "id": "p1-custom-${Date.now()}",
  "title": "${topic}",
  "category": "AI Practice Topic",
  "tag": "AI Custom",
  "isCustom": true,
  "questions": [
    {
      "qId": "p1-c-1",
      "question": "Question 1 about personal experience...",
      "focus": "Direct Habits",
      "strategy": "Vietnamese answering tip...",
      "vocabHints": [{ "phrase": "collocation 1", "meaningVi": "nghĩa" }],
      "sampleAnswer": "Band 8.5 answer..."
    },
    {
      "qId": "p1-c-2",
      "question": "Question 2 exploring reason/preference...",
      "focus": "Preference",
      "strategy": "Vietnamese answering tip...",
      "vocabHints": [{ "phrase": "collocation 2", "meaningVi": "nghĩa" }],
      "sampleAnswer": "Band 8.5 answer..."
    },
    {
      "qId": "p1-c-3",
      "question": "Question 3 looking to future or contrast...",
      "focus": "Future / Contrast",
      "strategy": "Vietnamese answering tip...",
      "vocabHints": [{ "phrase": "collocation 3", "meaningVi": "nghĩa" }],
      "sampleAnswer": "Band 8.5 answer..."
    }
  ]
}`;
  } else if (part === 2) {
    prompt = `You are a Cambridge IELTS Speaking Examiner. Generate 1 new Part 2 Cue Card on the theme "${topic}".
${exclusionInstruction}
Output valid raw JSON:
{
  "id": "p2-custom-${Date.now()}",
  "title": "${topic}",
  "category": "AI Practice Cue Card",
  "isCustom": true,
  "prompt": "Describe a ... You should say: ...",
  "cueBullets": ["what it is", "when/where it occurred", "who or what was involved", "and explain why it is significant to you"],
  "prepGuide4Quadrants": {
    "q1": "Who / What",
    "q2": "When / Where",
    "q3": "How / Action",
    "q4": "Why / Lesson"
  },
  "vocabHints": [{ "phrase": "...", "meaningVi": "..." }],
  "sampleAnswer": "Full 2-minute monologue at Band 8.5..."
}`;
  } else {
    // Part 3
    prompt = `You are a Cambridge IELTS Speaking Examiner. Generate 1 new Part 3 discussion set containing 3 in-depth societal/analytical questions on the theme "${topic}".
${exclusionInstruction}
Output valid raw JSON:
{
  "linkedPart2Id": "p3-custom-${Date.now()}",
  "topic": "${topic}",
  "isCustom": true,
  "questions": [
    {
      "qId": "p3-c-1",
      "question": "Broad societal question...",
      "analysisType": "Societal Impact",
      "strategy": "Vietnamese tip using PEEL...",
      "vocabHints": [{ "phrase": "...", "meaningVi": "..." }],
      "sampleAnswer": "Band 8.5 response..."
    },
    {
      "qId": "p3-c-2",
      "question": "Contrasting viewpoints question...",
      "analysisType": "Comparative Evaluation",
      "strategy": "Vietnamese tip...",
      "vocabHints": [{ "phrase": "...", "meaningVi": "..." }],
      "sampleAnswer": "Band 8.5 response..."
    },
    {
      "qId": "p3-c-3",
      "question": "Future projection or ethical question...",
      "analysisType": "Future Projection",
      "strategy": "Vietnamese tip...",
      "vocabHints": [{ "phrase": "...", "meaningVi": "..." }],
      "sampleAnswer": "Band 8.5 response..."
    }
  ]
}`;
  }

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.95,
        maxOutputTokens: 2500,
        responseMimeType: 'application/json'
      }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const parsed = robustJsonParse(text, null);
  if (!parsed) {
    throw new Error('Không thể phân tích dữ liệu chủ đề do AI sinh ra. Vui lòng thử lại.');
  }

  return parsed;
}

/**
 * Direct Multimodal Audio Transcription with Google Gemini AI
 * Converts in-RAM audio blob to base64 and invokes Gemini's native audio understanding.
 * Accurately extracts English spoken words, fixes STT errors, and adds punctuation.
 */
export async function transcribeAudioWithGemini({
  audioBlob,
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key trong phần Cài đặt.');
  if (!audioBlob) throw new Error('Không tìm thấy tệp âm thanh ghi âm.');

  // Convert Blob to Base64 in browser
  const base64Audio = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const res = reader.result;
        const base64 = typeof res === 'string' ? res.split(',')[1] : '';
        resolve(base64);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });

  if (!base64Audio) throw new Error('Không thể đọc dữ liệu âm thanh từ bộ nhớ RAM.');

  // Determine standard audio mimeType (e.g. audio/webm, audio/mp4, audio/ogg)
  let mimeType = audioBlob.type || 'audio/webm';
  if (mimeType.includes(';')) {
    mimeType = mimeType.split(';')[0];
  }

  const prompt = `You are a Cambridge IELTS Senior Speech-to-Text Examiner.
Listen to this audio recording of a candidate practicing for the IELTS Speaking test.
Transcribe every word spoken in English verbatim with extreme precision.
Rules:
1. Output ONLY the English transcript.
2. Fix any minor acoustic ambiguities while strictly preserving the candidate's actual words, grammar, and pronunciation choices.
3. Include natural punctuation (commas, full stops, question marks) and capitalization.
4. Do NOT add notes, headers, markdown fences, timestamps, or translations. Output ONLY the plain transcription text.`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Audio
              }
            },
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2500
      }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const transcribedText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  return transcribedText.replace(/^["']|["']$/g, '').trim();
}

/**
 * Algorithmic Heuristic Fallback for Thesis Statement Validation
 */

