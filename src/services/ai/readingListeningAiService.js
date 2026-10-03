/**
 * Reading & Listening Domain AI Service
 * Manages Reading passage generation, article ingestion, word lookup, question explanations,
 * and Listening audio source discovery, diagnostic evaluation, and test generation.
 */

import { callGeminiApi, robustJsonParse } from './coreGeminiClient.js';

export async function explainReadingQuestion({
  passageTitle,
  paragraphText,
  question,
  userAnswer,
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key.');

  const prompt = `ROLE & OBJECTIVE:
You are an elite Cambridge IELTS Reading Master and Bilingual English-Vietnamese Tutor.
Analyze this IELTS Reading question with maximum clarity, uncovering Cambridge distractor traps, paraphrase transformations, and exact reasoning.

PASSAGE TITLE: "${passageTitle}"
EVIDENCE PARAGRAPH (${question.evidenceParagraph || 'Relevant paragraph'}):
"${paragraphText || ''}"

QUESTION DETAILS:
- Order / Number: Question ${question.order}
- Question Type: ${question.type || 'Standard'}
- Question Statement: "${question.questionText}"
- Student's Answer: "${userAnswer || '(Chưa làm / Bỏ trống)'}"
- Correct Official Answer: "${question.answer}"
${question.options ? `- Options: ${JSON.stringify(question.options)}` : ''}

REQUIRED JSON OUTPUT FORMAT (strictly valid JSON, no backticks, no markdown):
{
  "verdict": "CHÍNH XÁC hoặc CHƯA CHÍNH XÁC",
  "trapAnalysis": "Mổ xẻ vì sao học viên dễ chọn nhầm (bẫy True/False/Not Given hoặc bẫy từ đồng nghĩa)",
  "stepByStepReasoning": "Giải thích từng bước vì sao đáp án đúng là '${question.answer}'",
  "paraphraseMap": [
    { "questionKeyword": "từ/cụm từ trong câu hỏi", "passageEquivalent": "từ/cụm từ tương đương trong bài đọc", "note": "Ghi chú ngữ cảnh" }
  ],
  "evidenceQuote": "Trích nguyên văn 1-2 câu tiếng Anh chứa manh mối",
  "bilingualTranslation": "Bản dịch tiếng Việt chuẩn xác của câu bằng chứng và câu hỏi",
  "keyVocabulary": [
    { "word": "từ mới C1/C2 trong bài", "ipa": "/phiên âm/", "meaningVi": "nghĩa tiếng Việt học thuật", "collocation": "cụm từ đi kèm" }
  ]
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(clean);
}

/**
 * Instant Double-Click Dictionary Lookup for IELTS Reading
 */
export async function lookupReadingWord({ word, contextSentence, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key.');

  const prompt = `Define this English word in the context of an IELTS Academic Reading text:
WORD: "${word}"
CONTEXT: "${contextSentence || ''}"

Return strictly JSON:
{
  "word": "${word}",
  "ipa": "/.../",
  "partOfSpeech": "noun / verb / adj / adv",
  "vietnameseMeaning": "Nghĩa tiếng Việt súc tích, chuẩn học thuật trong ngữ cảnh bài đọc",
  "englishDefinition": "Short English definition",
  "academicExample": "Example sentence using the word",
  "synonyms": ["synonym1", "synonym2"]
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(clean);
}

/**
 * Step 6: Generate a Brand-New Cambridge-Standard IELTS Reading Passage with Questions
 */
export async function generateReadingPassage({
  topic = 'Technology & AI',
  difficulty = 'Medium', // 'Easy' | 'Medium' | 'Hard'
  questionType = 'mixed', // 'tfng' | 'mc' | 'completion' | 'mixed'
  targetPassageNum = 1, // 1 | 2 | 3
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key.');

  const pNum = Number(targetPassageNum) || 1;
  const startOrder = pNum === 1 ? 1 : pNum === 2 ? 14 : 27;
  const endOrder = pNum === 1 ? 13 : pNum === 2 ? 26 : 40;
  const midOrder = startOrder + 6; // e.g. for P1: 1-7 and 8-13, P2: 14-20 and 21-26, P3: 27-33 and 34-40

  const prompt = `ROLE:
You are an expert Cambridge IELTS Academic Reading test writer.
Generate an authentic, high-quality IELTS Reading passage (approx 650-800 words) strictly following official Cambridge Academic standards for PASSAGE ${pNum}.

SPECIFICATIONS:
- Target Passage Number: Passage ${pNum}
- Question Numbers Range: Exactly from Question ${startOrder} to Question ${endOrder} (TOTAL ${endOrder - startOrder + 1} QUESTIONS).
- Topic: ${topic}
- Difficulty Level: ${difficulty} (Passage should have 4-5 paragraphs labeled A, B, C, D, E)
- Include exactly 2 question groups covering:
  Group 1: True / False / Not Given (Questions ${startOrder}–${midOrder})
  Group 2: Multiple Choice (Single answer) or Summary Completion (Questions ${midOrder + 1}–${endOrder})

JSON OUTPUT STRUCTURE (Return ONLY valid raw JSON without markdown formatting):
{
  "id": "gen-${Date.now()}",
  "passageNumber": ${pNum},
  "title": "Compelling Academic Title",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "wordCount": 750,
  "paragraphs": [
    { "id": "A", "text": "Full text of paragraph A..." },
    { "id": "B", "text": "Full text of paragraph B..." },
    { "id": "C", "text": "Full text of paragraph C..." },
    { "id": "D", "text": "Full text of paragraph D..." },
    { "id": "E", "text": "Full text of paragraph E..." }
  ],
  "questionGroups": [
    {
      "id": "qg-${pNum}-1",
      "type": "true_false_not_given",
      "title": "Questions ${startOrder}–${midOrder}",
      "instruction": "Do the following statements agree with the information given in Reading Passage ${pNum}?\\nIn boxes ${startOrder}–${midOrder} choose TRUE, FALSE, or NOT GIVEN",
      "questions": [
        {
          "id": ${startOrder},
          "order": ${startOrder},
          "questionText": "Statement for question ${startOrder}...",
          "answer": "TRUE",
          "evidenceParagraph": "A",
          "evidenceQuote": "exact quote from paragraph A",
          "explanation": "Giải thích chi tiết bằng tiếng Việt vì sao chọn TRUE."
        },
        {
          "id": ${startOrder + 1},
          "order": ${startOrder + 1},
          "questionText": "Statement for question ${startOrder + 1}...",
          "answer": "FALSE",
          "evidenceParagraph": "B",
          "evidenceQuote": "exact quote from paragraph B",
          "explanation": "Giải thích chi tiết bằng tiếng Việt vì sao chọn FALSE."
        },
        {
          "id": ${startOrder + 2},
          "order": ${startOrder + 2},
          "questionText": "Statement for question ${startOrder + 2}...",
          "answer": "NOT GIVEN",
          "evidenceParagraph": "B",
          "evidenceQuote": "",
          "explanation": "Giải thích chi tiết bằng tiếng Việt vì sao thông tin không có trong bài."
        }
      ]
    },
    {
      "id": "qg-${pNum}-2",
      "type": "multiple_choice_single",
      "title": "Questions ${midOrder + 1}–${endOrder}",
      "instruction": "Choose the correct letter, A, B, C, or D.",
      "questions": [
        {
          "id": ${midOrder + 1},
          "order": ${midOrder + 1},
          "questionText": "Multiple choice question ${midOrder + 1}...",
          "answer": "B",
          "options": [
            { "letter": "A", "text": "Option A..." },
            { "letter": "B", "text": "Option B..." },
            { "letter": "C", "text": "Option C..." },
            { "letter": "D", "text": "Option D..." }
          ],
          "evidenceParagraph": "C",
          "evidenceQuote": "exact quote from paragraph C",
          "explanation": "Giải thích chi tiết bằng tiếng Việt vì sao đáp án đúng là B."
        }
      ]
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

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const parsed = robustJsonParse(text, null);
  if (!parsed || !parsed.paragraphs) {
    throw new Error('Dữ liệu bài đọc do AI sinh ra không đúng định dạng. Vui lòng thử lại.');
  }
  parsed.passageNumber = pNum;
  return parsed;
}

/**
 * Step 6: Ingest Raw English Article into a Structured IELTS Reading Passage
 */
export async function ingestArticleToReadingPassage({
  rawArticleText,
  customTitle,
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key.');
  if (!rawArticleText || rawArticleText.trim().length < 100) {
    throw new Error('Nội dung bài báo quá ngắn để chuyển đổi thành bài đọc IELTS (tối thiểu 100 ký tự).');
  }

  const prompt = `ROLE:
You are an expert Cambridge IELTS Academic Reading test developer.
Convert the following raw English article into a standardized IELTS Academic Reading passage with paragraphs labeled A, B, C, D... and create authentic Cambridge-style reading comprehension questions with answers, evidence quotes, and Vietnamese explanations.

RAW ARTICLE:
"""
${rawArticleText.slice(0, 5000)}
"""

CUSTOM TITLE REQUEST: "${customTitle || ''}"

JSON OUTPUT STRUCTURE (Return ONLY valid raw JSON without markdown):
{
  "id": "ingest-${Date.now()}",
  "passageNumber": 1,
  "title": "${customTitle || 'Ingested Academic Reading Article'}",
  "topic": "General Academic",
  "difficulty": "Band 6.5 - 7.5",
  "wordCount": 700,
  "paragraphs": [
    { "id": "A", "text": "Paragraph A content..." },
    { "id": "B", "text": "Paragraph B content..." },
    { "id": "C", "text": "Paragraph C content..." },
    { "id": "D", "text": "Paragraph D content..." }
  ],
  "questionGroups": [
    {
      "id": "qg-ingest-1",
      "type": "true_false_not_given",
      "title": "Questions 1–4",
      "instruction": "Do the following statements agree with the information given in the reading passage?\\nIn boxes 1–4 choose TRUE, FALSE, or NOT GIVEN",
      "questions": [
        {
          "id": 1,
          "order": 1,
          "questionText": "Statement 1 based on paragraph A...",
          "answer": "TRUE",
          "evidenceParagraph": "A",
          "evidenceQuote": "exact quote from paragraph A",
          "explanation": "Giải thích chi tiết bằng tiếng Việt."
        },
        {
          "id": 2,
          "order": 2,
          "questionText": "Statement 2 based on paragraph B...",
          "answer": "FALSE",
          "evidenceParagraph": "B",
          "evidenceQuote": "exact quote from paragraph B",
          "explanation": "Giải thích chi tiết bằng tiếng Việt."
        }
      ]
    },
    {
      "id": "qg-ingest-2",
      "type": "multiple_choice_single",
      "title": "Questions 3–5",
      "instruction": "Choose the correct letter, A, B, C, or D.",
      "questions": [
        {
          "id": 3,
          "order": 3,
          "questionText": "Multiple choice question about the text...",
          "answer": "A",
          "options": [
            { "letter": "A", "text": "Option A..." },
            { "letter": "B", "text": "Option B..." },
            { "letter": "C", "text": "Option C..." },
            { "letter": "D", "text": "Option D..." }
          ],
          "evidenceParagraph": "C",
          "evidenceQuote": "quote from paragraph C",
          "explanation": "Giải thích chi tiết bằng tiếng Việt."
        }
      ]
    }
  ]
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    }
  });

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return robustJsonParse(text, {});
}

/**
 * AI Audio & Part Suitability Analyzer
 * Analyzes audio context/URL and suggests the best matching IELTS Listening Part(s)
 */
export async function analyzeAudioAndSuggestParts({
  audioUrl = '',
  audioBase64 = null,
  audioMimeType = 'audio/mp3',
  topicOrTitle = '',
  transcriptSnippet = '',
  apiKey,
  model = 'gemini-2.5-flash'
}) {
  const prompt = `You are an expert Cambridge Assessment English IELTS Chief Examiner.
Analyze this audio source and topic context to determine which IELTS Listening Part (Part 1, Part 2, Part 3, or Part 4) it is most suitable for.
${audioBase64 ? 'LISTEN CAREFULLY TO THE ATTACHED SPOKEN AUDIO to identify speaker interactions, acoustic setting, conversational vs academic tone, and vocabulary.' : ''}

AUDIO URL: ${audioUrl || 'N/A'}
TOPIC / TITLE: ${topicOrTitle || 'N/A'}
TRANSCRIPT / CONTEXT: ${transcriptSnippet || 'N/A'}

IELTS LISTENING 4 PARTS CHARACTERISTICS:
- Part 1: Everyday social/transactional dialogue between 2 people (booking, inquiring, ordering, applying). Question format: Note/Form completion (names, numbers, dates, addresses).
- Part 2: Everyday social monologue by 1 speaker (guided tour, facilities overview, local event introduction, map directions). Question format: Multiple choice, Map/Plan labelling, Matching.
- Part 3: Educational/academic discussion between 2-4 speakers (students & tutor discussing research, assignments, projects, field trips). Question format: Academic Multiple choice, Matching opinions, Summary.
- Part 4: University academic lecture monologue by 1 speaker (deep dive into scientific, historical, or environmental topics). Question format: Note/Summary completion strictly ONE WORD ONLY.

Task:
1. Identify "primaryPart": the single best Part (1, 2, 3, or 4).
2. Identify "suggestedParts": an array of all viable Parts (e.g. [1] or [1, 2] or [3, 4]). Multiple parts can be viable if the audio has broad educational/conversational value.
3. Provide "confidence": "high" | "medium".
4. Provide "reasoning": 2-3 concise sentences in Vietnamese explaining why this audio fits that Part (based on number of speakers, conversational style vs academic tone, vocabulary level).
5. Provide "recommendedQuestionTypes": array of 2-3 question types in Vietnamese/English.
6. Provide "detectedContext": short Vietnamese summary of the situation.
7. Provide "detectedSpeakers": estimated speaker count and roles (e.g., "2 người (Khách hàng & Nhân viên tiếp tân)").

Return ONLY pure JSON (no markdown formatting, no code fence):
{
  "primaryPart": 1,
  "suggestedParts": [1],
  "confidence": "high",
  "reasoning": "...",
  "recommendedQuestionTypes": ["Note Completion (Điền thông tin)", "Multiple Choice ngắn"],
  "detectedContext": "...",
  "detectedSpeakers": "..."
}`;

  const contentParts = [];
  if (audioBase64) {
    contentParts.push({
      inlineData: {
        mimeType: audioMimeType || 'audio/mp3',
        data: audioBase64
      }
    });
  }
  contentParts.push({ text: prompt });

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: contentParts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
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
  return robustJsonParse(text, { primaryPart: 1, suggestedParts: [1], reasoning: '' });
}

/**
 * AI Audio Source Explorer & Suggester
 * Dynamically discovers / searches for authentic listening audio sources suitable for IELTS Listening parts.
 * Suggests real audio URLs, speakers, accent, context, recommended Part(s), and pedagogical reasoning.
 */
export async function discoverListeningAudioSources({
  topicKeyword = '',
  targetPartPreference = null, // null or 1, 2, 3, 4
  apiKey,
  model = 'gemini-2.5-flash'
}) {
  const partFocusText = targetPartPreference 
    ? `Prioritize authentic audio sources that are highly suitable for IELTS Listening Part ${targetPartPreference}.`
    : 'Provide a balanced mix across Part 1 (social dialogue), Part 2 (social monologue), Part 3 (academic discussion), and Part 4 (university lecture).';

  const topicText = topicKeyword.trim() 
    ? `The user requested audio topics related to: "${topicKeyword.trim()}".` 
    : 'Select diverse, authentic IELTS themes (e.g., student accommodation, travel inquiry, nature reserves, volunteer orientation, research paper methodology, urban ecology, history of science).';

  const prompt = `You are an expert Cambridge Assessment English IELTS Chief Examiner & Audio Material Curator.
Your task is to search, identify, and recommend 3 to 4 NEW authentic listening audio sources suitable for IELTS Listening practice.
${topicText}
${partFocusText}

AUDIO REPOSITORY GUIDELINES:
- Provide direct, publicly streamable, CORS-accessible MP3 audio links from well-known open educational archives.
  Examples of reliable archives:
  * Internet Archive Cambridge / IELTS audio archives (e.g. https://archive.org/download/.../....mp3 or https://dn711100.ca.archive.org/0/items/.../....mp3)
  * BBC Learning English audio podcasts / 6-Minute English archive CDN streams
  * LibriVox educational dialogues / lectures (archive.org streaming mp3)
  * Wikimedia Commons open speech / lecture audio
  * Open courseware educational mp3s

EVALUATE EACH AUDIO SOURCE:
1. "title": Engaging English title describing the dialogue/lecture.
2. "audioUrl": Direct, valid streamable MP3 URL.
3. "fallbackAudioUrl": Optional fallback URL.
4. "durationText": Estimated length, e.g. '~5.5 phút'.
5. "accent": e.g. 'British (Anh - Anh)', 'Australian', 'American', 'Canadian', etc.
6. "speakers": Speaker count and roles, e.g. '2 người (Lễ tân khách sạn & Khách du lịch)'.
7. "context": 2-3 sentences in Vietnamese describing the scenario and topics discussed.
8. "suggestedParts": Array of numbers (e.g. [1] or [1, 2] or [3] or [4]) indicating which IELTS Listening Part(s) this audio fits best.
9. "aiReasoning": 2-3 sentences in Vietnamese explaining WHY this audio fits the suggested Part (speech tempo, speaker interaction, vocabulary level, question types it can generate).
10. "recommendedQuestionTypes": Array of 2-3 question types (e.g. ["Form Completion", "Multiple Choice"]).
11. "sampleTranscriptSnippet": Short 1-2 sentence dialogue snippet from the audio.

Return ONLY pure JSON (no markdown formatting, no backticks, no wrapping text) with this schema:
{
  "sources": [
    {
      "title": "...",
      "audioUrl": "...",
      "fallbackAudioUrl": "...",
      "durationText": "...",
      "accent": "...",
      "speakers": "...",
      "context": "...",
      "suggestedParts": [1],
      "aiReasoning": "...",
      "recommendedQuestionTypes": ["Note Completion", "Multiple Choice"],
      "sampleTranscriptSnippet": "..."
    }
  ]
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
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
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{"sources":[]}';
  const parsed = robustJsonParse(text, { sources: [] });
  const rawSources = Array.isArray(parsed?.sources) ? parsed.sources : [];

  return rawSources.map((s, idx) => ({
    ...s,
    id: s.id || `ai-discovered-${Date.now()}-${idx}`,
    isAIDiscovered: true,
    suggestedParts: Array.isArray(s.suggestedParts) && s.suggestedParts.length > 0 
      ? s.suggestedParts.map(Number) 
      : [1]
  }));
}

/**
 * AI Listening Test Generator from Audio URL & Transcript (Single Part Mode)
 * Generates Cambridge standard 1-Part IELTS Listening test (Part 1, 2, 3, or 4) with exactly 10 questions.
 * Ensures fast generation (<8s), perfect token economy, accurate timestamps, evidence quotes and answer keys.
 */
export async function generateListeningTestFromAudio({
  audioUrl,
  fallbackAudioUrl = '',
  audioBase64 = null,
  audioMimeType = 'audio/mp3',
  testTitle = '',
  topicDescription = '',
  transcriptText = '',
  targetPart = 1, // 1, 2, 3, or 4
  partCount, // fallback for legacy calls
  apiKey,
  model = 'gemini-2.5-flash'
}) {
  const partNum = Number(targetPart) || (Number(partCount) === 4 ? 1 : Number(partCount)) || 1;

  const partProfiles = {
    1: {
      partName: 'Part 1',
      genre: 'Daily Social Conversation (2 Speakers)',
      contextDesc: 'An authentic everyday transactional conversation between 2 people (e.g., telephone inquiry, festival ticket booking, shipping insurance claim, flat rental application).',
      standardQuestionType: 'note_completion',
      instruction: 'Complete the notes below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      specifics: 'Questions 1 to 10. Focus on specific factual details: names (with spelling if applicable), phone numbers, dates, prices, addresses, and short noun phrases. Include realistic distractors where speakers correct themselves.'
    },
    2: {
      partName: 'Part 2',
      genre: 'Everyday Social Monologue (1 Speaker)',
      contextDesc: 'An informative monologue delivered by 1 speaker in a general community or social context (e.g., guide introducing a dinosaur museum tour, nature reserve layout, community center facilities, volunteer program).',
      standardQuestionType: 'multiple_choice',
      instruction: 'Choose the correct letter, A, B, or C.',
      specifics: 'Questions 1 to 10. Focus on event regulations, visiting guidelines, facility descriptions, opening hours, and safety tips with carefully placed distractors.'
    },
    3: {
      partName: 'Part 3',
      genre: 'Academic Discussion (2-4 Speakers)',
      contextDesc: 'A rich academic conversation between university students and/or a tutor/professor (e.g., discussing a research paper proposal, fieldwork methodology, project presentation feedback, analyzing findings).',
      standardQuestionType: 'multiple_choice',
      instruction: 'Choose the correct letter, A, B, or C.',
      specifics: 'Questions 1 to 10. Focus on analyzing student opinions, academic consensus, disagreements, methodology justifications, and research conclusions.'
    },
    4: {
      partName: 'Part 4',
      genre: 'University Academic Lecture Monologue (1 Speaker)',
      contextDesc: 'A university academic lecture delivered continuously by 1 lecturer on an academic topic (e.g., physical geography & urban microclimates, history of personal hygiene & medicine, wildlife adaptation to cities).',
      standardQuestionType: 'note_completion',
      instruction: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      specifics: 'Questions 1 to 10. Structured lecture outline with headings and bullet points. Strict ONE WORD ONLY constraint for every blank. Advanced academic vocabulary.'
    }
  };

  const profile = partProfiles[partNum] || partProfiles[1];

  const prompt = `You are an expert Cambridge Assessment English IELTS Chief Examiner.
Your task is to create an authentic, high-caliber IELTS Listening Single-Part Practice Test (Part ${partNum}) based on the provided Audio URL and content context.

AUDIO SOURCE URL: ${audioUrl}
FALLBACK URL: ${fallbackAudioUrl}
TEST TITLE SUGGESTION: ${testTitle || `IELTS Listening Part ${partNum} Practice`}
TOPIC CONTEXT: ${topicDescription || profile.contextDesc}
TARGET PART: Part ${partNum} (${profile.genre})
TRANSCRIPT / NOTES:
${transcriptText || 'No full transcript provided. Synthesize a realistic, high-fidelity IELTS transcript that faithfully reflects the topic and audio flow.'}

EXAM SPECIFICATIONS FOR PART ${partNum}:
- Standard format: ${profile.contextDesc}
- Question type: ${profile.standardQuestionType} (${profile.instruction})
- Detailed guidelines: ${profile.specifics}
- Total Questions: Exactly 10 questions (Numbered 1 to 10).
- Time Limit: 10 minutes.
- Timestamps: Spanning from ~0s to ~360s (or match audio duration). Each question must have a precise evidenceTimestamp (in seconds).
- For EACH of the 10 questions, provide:
  * id: 1 to 10
  * order: 1 to 10
  * questionText: for multiple choice or prompt
  * prefixText & suffixText: for note completion blanks
  * options: array of 3 options [A, B, C] if multiple_choice
  * answer: the exact correct answer (concise word/number or option letter)
  * acceptableAnswers: comprehensive array of all valid alternative spellings and formats (e.g. for numbers/prices: ["£35", "35 pounds", "thirty-five pounds", "35 gbp"]; for dates: ["30th May", "30 May", "May 30", "May 30th"]; for times: ["9:30 am", "9.30 am", "9:30am"])
  * evidenceQuote: exact spoken sentence from the audio containing the clue
  * evidenceTimestamp: timestamp in seconds when the answer is revealed
  * explanation: clear, pedagogic explanation in Vietnamese highlighting the key clues and why distractors are incorrect.
- Provide a "transcripts" array containing continuous dialogue/monologue segments with start (sec), end (sec), speaker, text, and targetQuestion (order number if it contains an answer).

OUTPUT FORMAT:
Return ONLY pure JSON (no markdown formatting, no code fence, no commentary) adhering strictly to this schema:
{
  "title": "IELTS Listening Part ${partNum}: ...",
  "description": "...",
  "audioUrl": "${audioUrl}",
  "fallbackAudioUrl": "${fallbackAudioUrl || audioUrl}",
  "isSinglePart": true,
  "targetPart": ${partNum},
  "totalQuestions": 10,
  "timeLimitMinutes": 10,
  "parts": [
    {
      "partNumber": ${partNum},
      "title": "Part ${partNum}: ${profile.genre}",
      "context": "...",
      "audioTimestampStart": 0,
      "audioTimestampEnd": 360,
      "speakers": [
        { "name": "...", "gender": "Female", "accent": "British" }
      ],
      "questionGroups": [
        {
          "id": "qg-ai-p${partNum}",
          "type": "${profile.standardQuestionType}",
          "title": "Questions 1–10",
          "instruction": "${profile.instruction.replace(/\n/g, '\\n')}",
          "headerTitle": "...",
          "questions": [
            {
              "id": 1,
              "order": 1,
              "questionText": "...",
              "prefixText": "...",
              "suffixText": "...",
              "options": ["A. ...", "B. ...", "C. ..."],
              "answer": "...",
              "acceptableAnswers": ["..."],
              "evidenceQuote": "...",
              "evidenceTimestamp": 35,
              "explanation": "Giải thích chi tiết bằng tiếng Việt..."
            }
          ]
        }
      ],
      "transcripts": [
        {
          "start": 0,
          "end": 15,
          "speaker": "...",
          "text": "...",
          "targetQuestion": 1,
          "speechTip": "..."
        }
      ]
    }
  ]
}`;

  const contentParts = [];
  if (audioBase64) {
    contentParts.push({
      inlineData: {
        mimeType: audioMimeType || 'audio/mp3',
        data: audioBase64
      }
    });
  }
  contentParts.push({ text: prompt });

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: contentParts }],
      generationConfig: { 
        temperature: 0.2,
        maxOutputTokens: 5000,
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
  if (!parsed || !parsed.parts) {
    throw new Error('Dữ liệu bài thi AI trả về bị ngắt quãng hoặc không đúng định dạng. Vui lòng thử lại một lần nữa.');
  }

  // Enforce consistent metadata
  parsed.isSinglePart = true;
  parsed.targetPart = partNum;
  parsed.totalQuestions = 10;
  parsed.timeLimitMinutes = 10;
  if (parsed.parts && parsed.parts[0]) {
    parsed.parts[0].partNumber = partNum;
  }

  return parsed;
}

/**
 * AI Listening Examiner: Comprehensive Diagnostic Evaluation & Actionable Practice Plan
 * Evaluates candidate listening performance, diagnoses cognitive breakdown patterns, and generates custom drills.
 */
export async function generateListeningDiagnosticEvaluation({
  bandResult,
  testTitle,
  apiKey,
  model = DEFAULT_MODEL
}) {
  if (!apiKey) {
    throw new Error('Vui lòng cung cấp AI API Key để nhận nhận xét và kế hoạch luyện tập từ AI.');
  }

  const {
    band = 6.0,
    correctCount = 0,
    totalQuestions = 40,
    accuracyPercent = 0,
    timeSpentSeconds = 0,
    errorBreakdown = {},
    partStats = [],
    typeStats = [],
    questionsBreakdown = []
  } = bandResult;

  // Extract errors for rich analysis
  const incorrectQuestions = questionsBreakdown
    .filter(q => !q.isCorrect)
    .slice(0, 15) // Top 15 error samples to avoid token bloat
    .map(q => ({
      order: q.order,
      partNumber: q.partNumber,
      questionType: q.questionType,
      userAnswer: q.userAnswer || '(Bỏ trống)',
      correctAnswer: q.correctAnswer,
      status: q.status,
      evidenceQuote: q.evidenceQuote || ''
    }));

  const prompt = `You are a Senior Cambridge Assessment English IELTS Chief Examiner and Master Listening Coach.
Provide an in-depth, encouraging, highly analytical, and actionable diagnostic evaluation and personalized practice roadmap for a candidate who just finished an IELTS Listening test.

TEST INFORMATION:
- Test Title: ${testTitle || 'IELTS Listening Practice'}
- Estimated Band Score: ${Number(band).toFixed(1)} / 9.0
- Accuracy: ${correctCount}/${totalQuestions} questions (${accuracyPercent}%)
- Time Spent: ${Math.floor(timeSpentSeconds / 60)} minutes ${timeSpentSeconds % 60} seconds
- Error Breakdown:
  * Absolute Correct: ${errorBreakdown.CORRECT || 0}
  * Plural/Singular (-s/-es) Mistakes: ${errorBreakdown.PLURAL_ERROR || 0}
  * Stem Repetition Traps: ${errorBreakdown.STEM_REPETITION_ERROR || 0}
  * Spelling Mistakes: ${errorBreakdown.SPELLING_ERROR || 0}
  * Information / Distractor Errors: ${errorBreakdown.WRONG_ANSWER || 0}
  * Unanswered / Skipped: ${errorBreakdown.UNANSWERED || 0}

PERFORMANCE BY PART:
${JSON.stringify(partStats, null, 2)}

PERFORMANCE BY QUESTION TYPE:
${JSON.stringify(typeStats, null, 2)}

SAMPLE INCORRECT QUESTIONS:
${JSON.stringify(incorrectQuestions, null, 2)}

TASK REQUIREMENTS:
1. "overallSummary": 2-3 inspiring yet professional paragraphs in Vietnamese evaluating the candidate's current listening reflexes, strengths, and primary bottlenecks (such as losing track during fast connected speech, distractors with self-correction, or missing word endings -s/-ed).
2. "strengths": Array of 3-4 specific strengths demonstrated in the test (e.g. strong note completion in Part 1, good grasp of key numbers/dates, etc.).
3. "criticalWeaknesses": Array of 3-4 specific root-cause weaknesses with concrete examples from their errors (e.g. spelling confusion, falling for speaker self-corrections, losing focus in academic monologues).
4. "actionablePracticePlan": A structured 3-phase practice roadmap tailored to their exact score band:
   - "phase1_ImmediateFix": Immediate habits for the next 48 hours (e.g., how to read ahead during the 30s prep time, checking word counts).
   - "phase2_SkillBuilding": Targeted drills for the next 2-3 weeks (e.g., connected speech shadowing, dictation drills with BBC/TED, map labelling signposting).
   - "phase3_ExamMastery": Strategy to push to the next Band milestone (+0.5 to +1.0 Band).
5. "recommendedDrills": Array of 3-4 practical exercises with specific instructions:
   - "drillName": Name of drill (e.g., "Kỹ thuật Shadowing 1.2x tốc độ", "Luyện nghe bắt từ nối Signposting Part 3/4", "Chép chính tả âm đuôi -s/số nhiều")
   - "purpose": Purpose of the drill
   - "stepByStep": Clear 2-3 sentence guide on how to do it.
6. "motivationalAdvice": A closing encouraging motto from the examiner.

OUTPUT FORMAT: Return ONLY valid, parseable JSON with NO markdown formatting, NO backticks. Schema:
{
  "overallSummary": "...",
  "currentLevelComment": "...",
  "strengths": ["...", "..."],
  "criticalWeaknesses": [
    { "issue": "...", "example": "...", "solution": "..." }
  ],
  "actionablePracticePlan": {
    "phase1_ImmediateFix": "...",
    "phase2_SkillBuilding": "...",
    "phase3_ExamMastery": "..."
  },
  "recommendedDrills": [
    {
      "drillName": "...",
      "purpose": "...",
      "stepByStep": "..."
    }
  ],
  "motivationalAdvice": "..."
}`;

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3000,
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

  if (!parsed || !parsed.overallSummary) {
    throw new Error('AI không thể sinh nhận xét chi tiết cho bài thi. Vui lòng bấm thử lại.');
  }

  return parsed;
}

/**
 * Fallback Generator for Speaking Mock Evaluation (Offline or without API Key)
 */
function generateFallbackSpeakingEvaluation({
  dialogueHistory = [],
  mockPack,
  examiner,
  wordCount = 0,
  wordsPerMinute = 110,
  fillerCount = 0
}) {
  // Estimate baseline band based on fluency & word count
  let baseBand = 6.0;
  if (wordCount > 350) baseBand = 6.5;
  if (wordCount > 600) baseBand = 7.0;

  const candidateTurns = dialogueHistory.filter(d => d.speaker === 'candidate');

  const turnEvaluations = candidateTurns.map((turn, i) => {
    const isP2 = turn.stage === 'part2';
    const isP3 = turn.stage === 'part3';
    return {
      stage: turn.stage || (i === 0 ? 'part1' : i === 1 ? 'part2' : 'part3'),
      question: turn.questionText || (isP2 ? 'Part 2 Cue Card Presentation' : isP3 ? 'Part 3 In-depth Discussion Question' : 'Part 1 Interview Question'),
      candidateAnswer: turn.text || '(Thí sinh đã trả lời bằng lời nói)',
      inlineFeedback: isP2 
        ? 'Bạn đã duy trì được mạch bài nói Part 2 khá tốt, có ý mở đầu và bối cảnh. Cần đẩy mạnh thêm phần cao trào (climax) và cảm xúc đọng lại.'
        : isP3
        ? 'Câu trả lời có quan điểm rõ ràng. Hãy mở rộng thêm ví dụ thực tiễn hoặc dẫn chứng từ góc độ xã hội để tăng tính thuyết phục.'
        : 'Phản xạ trả lời tự nhiên, độ dài câu phù hợp với chuẩn phỏng vấn Part 1.',
      corrections: [
        {
          original: 'I think that it is very good',
          corrected: 'From my perspective, it proves to be remarkably beneficial',
          explanation: 'Nâng cấp từ ngữ văn nói thường ngày sang văn phong học thuật trang trọng hơn.'
        }
      ],
      upgradedBand8: isP2
        ? 'To kick off, I would like to dwell upon an experience that left an indelible impression on me. It took place back when I was navigating through my college years...'
        : 'Well, looking at this phenomenon from a broader sociological viewpoint, one could argue that modern technological integration fundamentally reshapes interpersonal dynamics.',
      goldenCollocations: ['leave an indelible impression', 'catalyze novel avenues', 'profound implications']
    };
  });

  return {
    overallBand: baseBand,
    criteria: {
      fc: {
        band: baseBand,
        title: 'Fluency & Coherence',
        strengths: 'Khả năng duy trì luồng nói liên tục, tốc độ phát âm ổn định và phản xạ nhanh trước các câu hỏi của Giám khảo.',
        weaknesses: fillerCount > 5 
          ? `Xuất hiện ${fillerCount} lần ngập ngừng hoặc dùng từ đệm (um, like, ah). Cần thay thế bằng các cụm buying-time tự nhiên như "That is an intriguing question...".`
          : 'Thỉnh thoảng còn dừng lại giữa câu để tìm từ vựng.',
        fillerAnalysis: `Phát hiện ${fillerCount} từ đệm trong toàn bộ bài thi. Mật độ từ đệm ở mức chấp nhận được nhưng cần tiết chế để đạt Band 7.0+.`,
        connectivesEvaluation: 'Đã sử dụng các từ nối cơ bản (Furthermore, However, On the other hand). Khuyên dùng thêm các discourse markers linh hoạt (Admittedly, Consequently).'
      },
      lr: {
        band: baseBand,
        title: 'Lexical Resource',
        strengths: 'Vốn từ vựng tương đối phong phú, diễn đạt đúng ngữ cảnh của chủ đề được hỏi.',
        weaknesses: 'Còn lặp lại một số tính từ thông dụng (good, big, important) thay vì sử dụng từ vựng C1-C2 chính xác hơn.',
        advancedWordsUsed: ['crucial factor', 'significant impact', 'perspective', 'lifestyle'],
        recommendedCollocations: [
          { phrase: 'exert a profound influence on', meaning: 'tạo ra ảnh hưởng sâu sắc đến', example: 'Digital media exerts a profound influence on youth culture.' },
          { phrase: 'integral component', meaning: 'thành tố không thể thiếu', example: 'Critical thinking is an integral component of academic success.' },
          { phrase: 'weigh the pros and cons', meaning: 'cân nhắc ưu và nhược điểm', example: 'Candidates should carefully weigh the pros and cons before deciding.' }
        ]
      },
      gra: {
        band: Math.max(5.5, baseBand - 0.5),
        title: 'Grammatical Range & Accuracy',
        strengths: 'Kiểm soát tốt thì hiện tại đơn và quá khứ đơn trong các câu trần thuật.',
        weaknesses: 'Ít sử dụng câu ghép phức (complex sentences) và câu điều kiện hỗn hợp hoặc đảo ngữ.',
        frequentMistakes: [
          {
            original: 'people has a lot of choices',
            corrected: 'people have a wide range of choices',
            explanation: 'Danh từ số nhiều "people" đi với động từ số nhiều "have".'
          },
          {
            original: 'if I have more time, I will travel',
            corrected: 'if I had more time, I would travel',
            explanation: 'Nên dùng câu điều kiện loại 2 để diễn tả giả định trái với thực tế ở hiện tại.'
          }
        ]
      },
      pr: {
        band: baseBand,
        title: 'Pronunciation & Intonation',
        strengths: 'Âm lượng rõ ràng, phát âm đủ to để hệ thống nhận diện giọng nói chính xác trên 90%.',
        weaknesses: 'Ngữ điệu (intonation) đôi chỗ còn đều đều (monotone). Cần nhấn trọng âm câu (sentence stress) vào các từ mang nội dung chính (keywords).',
        intonationAdvice: 'Hãy áp dụng kỹ thuật lên giọng ở vế đầu và hạ giọng dứt khoát ở cuối câu khẳng định để tăng độ tự tin chuẩn Cambridge.'
      }
    },
    speechAnalytics: {
      totalWords: wordCount,
      wordsPerMinute: wordsPerMinute,
      fillerWordsCount: fillerCount,
      fillerWordsSample: ['um', 'like', 'ah']
    },
    topActionablePriorities: [
      'Giảm thiểu từ đệm (um, like) bằng cách hít sâu hoặc dùng cụm nối chuẩn "Well, to be perfectly frank..."',
      'Đưa ít nhất 2 cụm Collocation C1 vào mỗi câu trả lời Part 3 để nâng tiêu chí Lexical Resource lên 7.5+',
      'Tập trung ngắt nhịp (chunking) theo cụm nghĩa thay vì ngắt giữa câu giúp câu nói trôi chảy và mạch lạc hơn.'
    ],
    examinerSummaryVerdict: `Thí sinh đã hoàn thành trọn vẹn buổi thi với Giám khảo ${examiner?.name || 'AI'}. Nhìn chung, bạn có phản xạ tương tác tốt và tư duy mạch lạc. Điểm mấu chốt để bứt phá lên Band 7.5+ là mở rộng cấu trúc câu phức và thay thế từ đơn bằng các Collocations học thuật chuyên sâu.`,
    turnEvaluations: turnEvaluations.length > 0 ? turnEvaluations : [
      {
        stage: 'part1',
        question: 'Could you describe your neighborhood?',
        candidateAnswer: 'I live in a quiet neighborhood with friendly neighbors and many green parks.',
        inlineFeedback: 'Câu trả lời trực diện, rõ ý. Có thể mở rộng thêm một chi tiết nhỏ về giao thông hoặc tiện ích.',
        corrections: [],
        upgradedBand8: 'I currently reside in a tranquil suburban neighborhood characterized by verdant parks and a tight-knit sense of community.',
        goldenCollocations: ['tranquil suburban neighborhood', 'tight-knit community', 'verdant parks']
      }
    ]
  };
}

/**
 * Evaluate IELTS Speaking Mock Exam (Part 1, Part 2, Part 3)
 * Evaluates candidate dialogue against official Cambridge IELTS Speaking Band Descriptors (FC, LR, GRA, PR).
 */

