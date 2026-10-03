/**
 * Writing Domain AI Service
 * Manages IELTS Task 1 & Task 2 essay evaluation, prompt generation, visual banana diagrams, and thesis statement validation.
 */

import { callGeminiApi, robustJsonParse, calculateLexicalOverlap } from './coreGeminiClient.js';
import { applyCambridgeWritingHardCaps } from '../../utils/ieltsScoringRules.js';
import { ensureTaskIllustration } from '../processMapSvgEngine.js';

export const WRITING_SUB_ANGLES = [
  'Technological disruption & ethical artificial intelligence integration',
  'Environmental sustainability, climate mitigation & resource depletion',
  'Socio-economic disparity, wealth distribution & cost-of-living challenges',
  'Demographic transformation (aging population vs youth employment)',
  'Mental well-being, psychological impact & modern lifestyle stress',
  'Public sector intervention & policy governance vs free-market autonomy',
  'Urban planning, infrastructure congestion & sustainable smart cities',
  'Cultural heritage preservation in an increasingly globalized world',
  'Future of education (hybrid digital schooling vs vocational apprenticeships)',
  'Modern workplace dynamics (remote/hybrid employment vs traditional office life)'
];

export const SPEAKING_SUB_ANGLES = [
  'Evolving personal routines & lifestyle adaptations in modern society',
  'The double-edged sword of digital technology on interpersonal relationships',
  'Emotional connections & psychological significance of everyday spaces/objects',
  'Contrasts between fast-paced urban lifestyle and tranquil escapes',
  'Changing cultural traditions and the perspectives of younger vs older generations',
  'Sustainability, eco-friendly habits and conscious personal consumption',
  'Balancing professional/academic ambitions with leisure and community bonding'
];

/**
 * Task 1 Visual Illustration Archetypes to guarantee authentic diversity
 */
export const PROCESS_ARCHETYPES = [
  { type: 'manufacturing', label: 'Sản xuất & Chế tạo công nghiệp', hint: 'Linear or multi-stage industrial manufacturing (e.g. brick manufacturing, artisanal cheese making, paper production from timber, chocolate manufacturing, tea processing, solar cell manufacturing)' },
  { type: 'lifecycle', label: 'Vòng đời sinh thái tự nhiên', hint: 'Natural biological life cycle of an animal, insect, or plant (e.g. Pacific salmon migration, honeybee caste life cycle, red-eyed tree frog metamorphosis, monarch butterfly life cycle, silkworm silk production)' },
  { type: 'recycling', label: 'Tái chế tuần hoàn rác thải', hint: 'Closed-loop recycling and waste reclamation process (e.g. PET plastic bottle recycling into polyester yarn, aluminum beverage can recycling loop, lithium-ion battery material reclamation)' },
  { type: 'energy_water', label: 'Năng lượng & Xử lý môi trường', hint: 'Energy generation, environmental purification, or hydraulic system (e.g. hydroelectric power dam, geothermal energy capture, municipal wastewater purification & treatment, thermal seawater desalination)' }
];

export const MAP_ARCHETYPES = [
  { type: 'university_campus', label: 'Khuôn viên trường đại học', hint: 'Modernisation and expansion of a university or research campus (adding science laboratory complex, new student halls, pedestrian quadrangle, sports pavilion, car parking)' },
  { type: 'airport_terminal', label: 'Mở rộng sân bay quốc tế', hint: 'Expansion and upgrading of an airport terminal (extending runways, new departure concourses/boarding gates, light rail connection, multi-storey car park)' },
  { type: 'tropical_island', label: 'Phát triển đảo du lịch sinh thái', hint: 'Transformation of an uninhabited tropical island into an eco-resort (wooden pier/jetty, beachfront eco-villas, central restaurant, dive center, palm grove)' },
  { type: 'city_center', label: 'Tái quy hoạch trung tâm đô thị', hint: 'Pedestrianisation and urban regeneration of a city centre (converting car lanes into pedestrian walkways, tram lines, modern shopping complex, civic plaza)' },
  { type: 'hospital_zone', label: 'Khu phức hợp y tế & bệnh viện', hint: 'Development of a medical hospital precinct (adding trauma wings, helipad, ambulance bays, healing garden, staff accommodation)' },
  { type: 'coastal_village', label: 'Làng chài ven biển tái thiết', hint: 'Redevelopment of a coastal fishing village into a modern seaside town (fishing docks converted to leisure marina, old warehouses into seaside hotels & promenade)' }
];

/**
 * Lightweight client-side lexical overlap calculator to detect question repetition
 */


export async function evaluateEssay({ task, essayText, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key trong phần Cài đặt.');
  if (!essayText || essayText.trim().split(/\s+/).length < 20) {
    throw new Error('Bài viết quá ngắn để giám khảo chấm điểm (tối thiểu 20 từ).');
  }

  const prompt = `ROLE & PERSONA:
You are an accredited Cambridge IELTS Senior Examiner and Academic Assessment Specialist. You grade rigorously according to the official Cambridge IELTS Band Descriptors (TR/TA, CC, LR, GRA) and international Academic Register standards.

STRICT ANTI-BAND-INFLATION DIRECTIVE (CRITICAL):
- Avoid AI sycophancy: LLMs commonly award 7.0 - 7.5 to average writing. The true average candidate scores 5.5 - 6.5. Grade with realistic examiner precision.
- BAND 7.0 THRESHOLD:
  * TR: Requires all prompt parts to be addressed with sufficiently developed ideas. Superficial arguments, generic bullet-point style reasoning, or unsupported assertions MUST be capped at Band 6.0.
  * CC: Logically organizes information with clear progression throughout. OVERUSE OF MECHANICAL LINKERS ("Furthermore", "Moreover", "In addition", "On the other hand", "To begin with") starting every sentence indicates Band 6.0 ("uses cohesive devices mechanically").
  * LR: Uses a sufficient range of vocabulary with flexibility and some awareness of style/collocation. Frequent awkward phrasing or wrong prepositions must remain at Band 6.0 or below.
  * GRA: Uses a variety of complex structures with frequent error-free sentences. If almost every sentence has an article, plural, or tense error, GRA CANNOT exceed Band 5.5 - 6.0.

CAMBRIDGE EXAMINER HARD CAPS (NON-NEGOTIABLE):
1. TASK 1 OVERVIEW REQUIREMENT: If this is Task 1 and the report lacks a clear OVERVIEW (general trend or key differences without data), Task Achievement (TR) MUST NOT exceed Band 5.0, regardless of vocabulary or grammar excellence.
2. TASK 1 MECHANICAL DATA DUMP: Merely listing numbers without grouping into logical categories or comparing key features caps TA at Band 5.5.
3. TASK 2 QUESTION FULFILLMENT: If the candidate does not fully address all parts of the question, or misses one side in a discuss-both-views prompt, Task Response MUST NOT exceed Band 5.5.
4. UNDERLENGTH PENALTY: If word count < 150 (Task 1) or < 250 (Task 2), penalize Task Response / Task Achievement score proportionally (e.g. 150-199 words in T2 capped at 5.0; < 150 words in T2 capped at 4.0).
5. ZERO TOLERANCE FOR EMPTY FLUFF: Do not award high Lexical Resource for rare "big words" used inappropriately, out of register, or without natural collocations.

FEW-SHOT CALIBRATION ANCHORS (OFFICIAL CAMBRIDGE BENCHMARKS):
- Anchor 1 (Task 1 with high LR/GRA but NO Overview): Candidate writes 170 words with C1/C2 vocabulary ("meteoric ascent", "precipitous downturn") but jumps directly from introduction into body figures with NO overview paragraph summarizing the general trends. -> Score TA = 5.0 (Strictly capped by Cambridge Band Descriptors).
- Anchor 2 (Task 1 with numbers in Overview): "Overall, sales rose from 40% to 80% while costs dropped to 10%." -> Score TA <= 5.5 (Overview corrupted by specific raw data).
- Anchor 3 (Task 2 Discuss Both Views with only one side developed): Candidate only discusses advantages and ignores disadvantages -> Score TR <= 5.0.

ACADEMIC REGISTER & GRAMMAR BENCHMARKS (10-AXES CHECK):
- HEDGING & TONE: Flag over-assertive absolutes ("prove", "obviously", "undoubtedly", "every person") and replace with academic hedging ("suggest", "indicate", "tend to", "many individuals").
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
4. Provide TWO tiered rewrites of the candidate's essay (Band Stepping):
   - "band65Rewrite": A clean, accessible Band 6.5 - 7.0 version. Focus on 100% grammatical accuracy, clear cohesive progression, standard sentence variety, and natural B2/early-C1 vocabulary (easy for a Band 5.0-6.0 learner to adopt).
   - "band8Rewrite": A sophisticated Band 8.5+ version elevating lexical precision, C1/C2 collocations, nuanced hedging, and complex syntax.
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
  "band65Rewrite": "Full complete rewritten essay at Band 6.5 - 7.0 (accessible, clear, error-free)...",
  "band8Rewrite": "Full complete rewritten essay at Band 8.5+ (advanced academic sophistication)...",
  "keyVocabulary": [
    {
      "phrase": "collocation or academic idiom",
      "meaningVi": "Vietnamese meaning and explanation",
      "example": "example sentence"
    }
  ]
}
`;

  const contentParts = [{ text: prompt }];

  // Hỗ trợ Gemini Vision chấm trực tiếp từ hình ảnh đề bài Task 1
  if (task.imageUrl && typeof task.imageUrl === 'string' && task.imageUrl.startsWith('data:image/')) {
    try {
      const mimeMatch = task.imageUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const base64Data = task.imageUrl.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      if (base64Data) {
        contentParts.unshift({
          inlineData: {
            mimeType,
            data: base64Data
          }
        });
      }
    } catch (e) {
      console.warn('Could not parse task.imageUrl for Gemini vision:', e);
    }
  }

  const response = await callGeminiApi({
    model,
    apiKey,
    body: {
      contents: [{ parts: contentParts }],
      generationConfig: {
        temperature: 0.2,
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
  if (!text) throw new Error('Không nhận được phản hồi hợp lệ từ AI.');

  try {
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return applyCambridgeWritingHardCaps({ task, essayText, evaluation: parsed });
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', text);
    throw new Error('Lỗi định dạng phản hồi từ AI. Vui lòng thử lại.');
  }
}

/**
 * Intelligent Document Ingestion: Parses raw text from books, PDFs, or teacher notes into an IELTS Task
 */
export async function parseDocumentToTask({ rawText, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key.');

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

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
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


export function buildGoogleBananaMapPrompt(taskObj = {}) {
  const title = taskObj.title || 'Map Transformation';
  const changes = (taskObj.mapChanges || []).map((c, i) => 
    `${i + 1}. Area "${c.feature || c.area || ''}": Formerly "${c.past || ''}". Modern state: "${c.present || ''}".`
  ).join('\n');

  return `Create an authentic, high-resolution Cambridge IELTS Academic Writing Task 1 Dual-Map Examination Illustration.
Topic: "${title}"
Specific Transformation details to depict between the two periods:
${changes || 'Urban redevelopment, infrastructure expansion, and spatial transformation'}

Visual & Cartographic Requirements:
- Layout: EXACTLY TWO maps side-by-side or stacked in one single coherent image.
- Header badges: Left map clearly titled "MAP 1: Past / Before", Right map clearly titled "MAP 2: Present / After".
- Cartography Style: Official Cambridge IELTS examination paper style. Clean masterplan drawing with crisp architectural shapes, distinct roads, roundabouts, buildings, bodies of water, trees, and car parking.
- Compass Rose: A neat compass rose indicating North on both maps.
- Clear English Labels: Clear, legible English labels matching the landmarks and changes described above.
- Clean white background, high contrast, professional cartographic vector/handbook aesthetic suitable for an IELTS exam booklet.`;
}

/**
 * Builds prompt for Google Banana (Gemini 2.5 Flash Image / Imagen 3) to generate authentic IELTS Task 1 Process Flowchart
 */
export function buildGoogleBananaProcessPrompt(taskObj = {}) {
  const title = taskObj.title || 'Process Diagram';
  const steps = (taskObj.processSteps || []).map((s, i) => 
    `Stage ${s.step || i + 1}: "${s.name || ''}" - ${s.desc || ''}`
  ).join('\n');

  return `Create an authentic, high-resolution Cambridge IELTS Academic Writing Task 1 Sequential Process Flowchart diagram.
Topic: "${title}"
Sequential stages to depict in order:
${steps || 'Sequential industrial manufacturing or biological lifecycle process'}

Visual & Schematic Requirements:
- Layout: Clear sequential workflow with prominent directional arrows connecting each stage from start to completion.
- Schematic Style: Official Cambridge IELTS examination paper style. Clean technical apparatus, machinery, chemical vats, heating furnaces, or biological organisms depicted with crisp, clear lines.
- Stage Labels: Each stage clearly numbered ("Stage 1", "Stage 2"...) with clear English labels for equipment, inputs, and outputs.
- Clean white or neutral background, high contrast, academic textbook clarity suitable for an IELTS test booklet.`;
}

/**
 * Invokes Google Banana (Gemini 2.5 Flash Image / Imagen 3) to generate an image
 * @param {object} options { prompt, apiKey }
 * @returns {Promise<string|null>} base64 data URL or null
 */
export async function generateGoogleBananaImage({ prompt, apiKey }) {
  if (!apiKey || !prompt) return null;

  const candidateModels = [
    'gemini-2.5-flash-image',
    'gemini-3.1-flash-lite-image'
  ];

  for (const modelName of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            responseModalities: ['image', 'text']
          }
        })
      });

      if (!response.ok) {
        console.warn(`[Google Banana] Model ${modelName} returned status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part?.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    } catch (err) {
      console.warn(`[Google Banana] Error calling ${modelName}:`, err.message);
    }
  }

  // Backup: try imagen-3.0-generate-002 if supported on this key
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1 }
      })
    });
    if (response.ok) {
      const data = await response.json();
      const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
      if (b64) {
        return `data:image/png;base64,${b64}`;
      }
    }
  } catch (err) {
    // Ignore fallback
  }

  return null;
}

/**
 * Generates an authentic IELTS Task 1 or Task 2 prompt with complete learning materials
 */
export async function generateNewTask({ 
  taskNumber, 
  type, 
  topic, 
  timeFrame = 'any', 
  targetBand = 8.0, 
  existingTitles = [], 
  apiKey, 
  model = DEFAULT_MODEL 
}) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key trong phần Cài đặt.');

  const isTask1 = Number(taskNumber) === 1;

  // Diversity Angle Injection: Pick a randomized sub-angle to guarantee uniqueness
  const randomAngle = WRITING_SUB_ANGLES[Math.floor(Math.random() * WRITING_SUB_ANGLES.length)];

  // Strict Exclusion List: Prevent repeating past prompts
  let exclusionInstruction = '';
  if (Array.isArray(existingTitles) && existingTitles.length > 0) {
    const list = existingTitles.slice(0, 15).map((t, i) => `  ${i + 1}. "${t}"`).join('\n');
    exclusionInstruction = `
CRITICAL NO-DUPLICATION & DIVERSITY CONSTRAINT:
The student has ALREADY practiced the following ${Math.min(15, existingTitles.length)} prompts in this library:
${list}

STRICT GENERATION RULES:
- You MUST NOT repeat, imitate, or closely paraphrase ANY prompt from the list above.
- You MUST create an original prompt exploring a novel real-world scenario reflecting current 2025-2026 trends.
- Anchor this prompt specifically around this unique angle: "${randomAngle}".
`;
  } else {
    exclusionInstruction = `
NOVELTY CONSTRAINT:
- Anchor this prompt around this unique contemporary angle: "${randomAngle}".
- Avoid generic cliches; pick a fresh, thought-provoking real-world scenario.
`;
  }

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
  let chosenProcessArchetype = null;
  let chosenMapArchetype = null;

  if (isTask1) {
    if (type === 'process') {
      chosenProcessArchetype = PROCESS_ARCHETYPES[Math.floor(Math.random() * PROCESS_ARCHETYPES.length)];
      prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, highly authentic IELTS Writing Task 1 Academic prompt for a PROCESS DIAGRAM reflecting Cambridge standards.
Specific Process Archetype to Generate: "${chosenProcessArchetype.type}" (${chosenProcessArchetype.label})
Archetype Direction: ${chosenProcessArchetype.hint}
Topic Category: ${topic || 'Technology & Science'}
Task Type: process
${exclusionInstruction}

REQUIREMENTS:
1. Provide a realistic prompt title and prompt text ("The diagram below illustrates the process of... Summarise the information by selecting and reporting the main features...").
2. Explicitly include "processType": "${chosenProcessArchetype.type}" in your JSON output.
3. Provide a 5 to 7-step sequential workflow for the process in "processSteps".
   Each step must have:
   - "step": integer (1, 2, 3...)
   - "name": short step name (e.g. "Collection & Sorting", "Thermal Cracking")
   - "desc": clear 1-2 sentence description of what happens, equipment used, and input/output.
4. Provide an ideal 4-paragraph outline (introduction, overview, body1, body2).
5. Provide a Band 8.5+ Model Answer with outstanding sequencing vocabulary (initially, subsequently, prior to being, once transformed) and passive voice structures.
6. Provide 5-6 vocabulary highlights with Vietnamese explanations.
7. MANDATORY VISUAL ILLUSTRATION: You may optionally include an SVG string in 'svgIllustration' (<svg ...>...</svg>) or our built-in graphics engine will automatically generate the vector flowchart diagram matching your processType and processSteps.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Manufacturing Process of ...",
  "prompt": "The diagram below illustrates how ... is manufactured/produced. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "type": "process",
  "processType": "${chosenProcessArchetype.type}",
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
      chosenMapArchetype = MAP_ARCHETYPES[Math.floor(Math.random() * MAP_ARCHETYPES.length)];
      prompt = `You are an expert Cambridge IELTS test designer. Generate a brand new, highly authentic IELTS Writing Task 1 Academic prompt for a MAP TRANSFORMATION (comparison of a site/area between two periods, e.g. before vs after redevelopment).
Specific Map Archetype to Generate: "${chosenMapArchetype.type}" (${chosenMapArchetype.label})
Archetype Direction: ${chosenMapArchetype.hint}
Topic Category: ${topic || 'Urban Planning & Geography'}
Task Type: map
${exclusionInstruction}

REQUIREMENTS:
1. Provide a realistic prompt title and prompt text ("The maps below show the changes that occurred in ... between ... and ... Summarise the information...").
2. Explicitly include "mapType": "${chosenMapArchetype.type}" in your JSON output.
3. Provide 4 to 6 key location/feature changes in "mapChanges".
   Each item must have:
   - "feature": specific area or landmark (e.g. "North-Western Farmland", "Industrial Dockland", "Southern Coastline")
   - "past": description of how it looked in the earlier period
   - "present": description of the modern / redeveloped state (demolished, relocated, expanded, pedestrianized, etc.)
4. Provide an ideal 4-paragraph outline (introduction, overview, body1, body2).
5. Provide a Band 8.5+ Model Answer with outstanding directional vocabulary (situated in the north-east, flanked by, replaced with, transformed into).
6. Provide 5-6 vocabulary highlights with Vietnamese explanations.
7. MANDATORY VISUAL ILLUSTRATION: You may optionally include an SVG string in 'svgIllustration' (<svg ...>...</svg>) or our built-in graphics engine will automatically generate the dual-period map comparison diagram matching your mapType and mapChanges.

Return ONLY raw parseable JSON with this structure:
{
  "title": "Redevelopment of ... (1995 vs Present)",
  "prompt": "The two maps below illustrate the changes in ... between ... and ... Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "type": "map",
  "mapType": "${chosenMapArchetype.type}",
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
${exclusionInstruction}

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
${exclusionInstruction}

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
${exclusionInstruction}

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
${exclusionInstruction}

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
        temperature: 0.95,
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
  if (!text) throw new Error('Không nhận được phản hồi từ AI.');

  try {
    const taskObj = robustJsonParse(text, null);
    if (!taskObj || !taskObj.prompt) {
      throw new Error('Dữ liệu bài tập AI không đầy đủ.');
    }
    const baseTask = {
      id: `ai-gen-${Date.now()}`,
      taskNumber: Number(taskNumber),
      type: type || (isTask1 ? 'line' : 'opinion'),
      topic: topic || 'tech',
      minWords: isTask1 ? 150 : 250,
      timeLimit: isTask1 ? 20 : 40,
      createdAt: new Date().toISOString(),
      isAiGenerated: true,
      ...taskObj,
      processType: taskObj.processType || chosenProcessArchetype?.type || undefined,
      mapType: taskObj.mapType || chosenMapArchetype?.type || undefined
    };

    // For Task 1 Process and Map: Generate authentic illustration with Google Banana AI Image
    if (isTask1 && (baseTask.type === 'process' || baseTask.type === 'map')) {
      try {
        const bananaPrompt = baseTask.type === 'map'
          ? buildGoogleBananaMapPrompt(baseTask)
          : buildGoogleBananaProcessPrompt(baseTask);

        const aiImage = await generateGoogleBananaImage({
          prompt: bananaPrompt,
          apiKey
        });

        if (aiImage) {
          baseTask.imageUrl = aiImage;
          baseTask.imageSource = 'google_banana';
        }
      } catch (bananaErr) {
        console.warn('[Google Banana] Image generation fallback to vector engine:', bananaErr?.message);
      }
    }

    // Ensure Process and Map tasks are guaranteed to have a high-resolution illustration (imageUrl)
    return ensureTaskIllustration(baseTask);
  } catch (err) {
    console.error('Failed to parse generated task JSON:', text);
    throw new Error('Lỗi định dạng khi AI sinh đề. Vui lòng thử lại.');
  }
}

/**
 * Instant Brainstorming & Idea Generator for Task 2
 */
export async function brainstormIdeas({ promptText, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cấu hình AI API Key.');

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

  if (!response || !response.ok) {
    const errorData = await response?.json().catch(() => ({}));
    throw new Error(formatFriendlyGeminiError(errorData, response?.status));
  }
  const result = await response.json();
  return result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * AI Generator for Vocab, Grammar, and Spelling items
 */


export async function evaluateRevisionComparison({ task, v1Text, v1Evaluation, v2Text, apiKey, model = DEFAULT_MODEL }) {
  if (!apiKey) throw new Error('Vui lòng cung cấp AI API Key.');

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
 * AI On-Demand Explanation for IELTS Reading Question (Step 5)
 * Analyzes trap, provides bilingual translation, paraphrase mapping, and evidence verification.
 */


export function validateThesisAlgorithmically({ task, thesisText = '' }) {
  const text = (thesisText || '').trim();
  const lower = text.toLowerCase();
  const isTask1 = task?.taskNumber === 1;

  if (isTask1) {
    const hasOverviewTrend = /(overall|in\s+general|it\s+is\s+(clear|evident|observable|notable)\s+that|noticeable\s+trend)/i.test(lower);
    const hasNumbers = /\b\d+(\.\d+)?%?|\b\d{4}\b/.test(lower);

    if (!hasOverviewTrend) {
      return {
        stanceLevel: 'vague',
        isDecisive: false,
        estimatedBand: 5.0,
        feedback: 'Câu Overview của bạn chưa sử dụng từ tín hiệu tổng quan (Overall, It is clear that...). Theo chuẩn Cambridge Task 1, thiếu Overview rõ ràng sẽ bị chặn trần Band 5.0 TA.',
        strengths: ['Đã bước đầu viết câu tóm tắt nội dung biểu đồ.'],
        improvements: ['Bắt đầu bằng "Overall, it is readily observable that..." và nêu 1-2 xu hướng nổi bật nhất mà không đưa số liệu cụ thể.'],
        upgrades: [
          {
            type: 'Overview chuẩn Cambridge Band 8.0+',
            thesis: `Overall, it is readily observable that significant shifts transpired throughout the surveyed timeframe, with ${task?.title || 'the dominant category'} undergoing a pronounced upward trajectory.`,
            rationale: 'Nêu bật xu hướng tổng thể mà không bị sa đà vào việc liệt kê số liệu thô.'
          }
        ]
      };
    }

    if (hasNumbers) {
      return {
        stanceLevel: 'vague',
        isDecisive: false,
        estimatedBand: 5.5,
        feedback: 'Cảnh báo: Đoạn Overview của bạn đang chứa số liệu cụ thể (data dump). Cambridge quy định Overview chỉ được khái quát xu hướng, việc đưa dữ liệu số liệu bị khống chế trần tối đa Band 5.5 TA.',
        strengths: ['Đã có từ chỉ dấu tổng quan rõ ràng.'],
        improvements: ['Loại bỏ toàn bộ các số liệu, phần trăm và năm cụ thể ra khỏi Overview; chỉ mô tả hướng tăng/giảm hoặc nhóm áp đảo.'],
        upgrades: [
          {
            type: 'Overview chuẩn Cambridge (Không chứa số liệu)',
            thesis: `Overall, it is readily apparent that while certain metrics experienced marked expansion, others demonstrated a steady downward trend over the period examined.`,
            rationale: 'Tuyệt đối không đưa số liệu vào Overview để tránh bị trừ điểm Task Achievement.'
          }
        ]
      };
    }

    return {
      stanceLevel: 'clear',
      isDecisive: true,
      estimatedBand: 8.0,
      feedback: 'Rất tốt! Câu Overview của bạn nêu bật xu hướng tổng quát, có từ chỉ dấu rõ ràng và không vi phạm quy tắc đưa số liệu thô.',
      strengths: ['Có tín hiệu chỉ dấu tổng quan rõ ràng.', 'Không bị lỗi đưa số liệu chi tiết vào Overview.'],
      improvements: ['Có thể sử dụng thêm các từ vựng học thuật chỉ xu hướng như "pronounced upward trajectory", "divergence".'],
      upgrades: [
        {
          type: 'Nâng cấp sắc thái học thuật Band 8.5+',
          thesis: `Overall, it is immediately discernible that substantial fluctuations characterized the period, with the disparity between key sectors narrowing noticeably towards the end.`,
          rationale: 'Tăng cường tính mạch lạc và từ vựng so sánh tương quan.'
        }
      ]
    };
  }

  // Task 2 Thesis Validation
  const hasDecisiveStance = /(i\s+(firmly|strongly|completely|totally|fully)\s+(believe|agree|disagree|maintain|contend)|in\s+my\s+(opinion|view)|i\s+would\s+argue\s+that|i\s+tend\s+to\s+agree|far\s+outweighs?|vastly\s+superior|cannot\s+be\s+supported)/i.test(lower);
  const hasVagueMiddleGround = /(both\s+(sides|perspectives|views)|advantages\s+and\s+disadvantages|pros\s+and\s+cons|has\s+two\s+sides|some\s+people\s+agree.*while\s+others)/i.test(lower) && !hasDecisiveStance;

  if (hasVagueMiddleGround) {
    return {
      stanceLevel: 'vague',
      isDecisive: false,
      estimatedBand: 5.5,
      feedback: 'Cảnh báo Barem Cambridge: Câu Thesis của bạn mang tính "nước đôi" / trung lập (neutral fence-sitting) mà không chọn rõ lập trường. Theo tiêu chí Task Response (TR), không thể hiện quan điểm rõ ràng (clear position throughout) sẽ bị chặn trần tối đa Band 5.5 - 6.0.',
      strengths: ['Đã nhận biết được 2 mặt của vấn đề.'],
      improvements: ['Phải chốt dứt khoát bạn nghiêng về bên nào hơn (ví dụ: mặc dù cả hai bên đều có lý, nhưng tôi tin chắc rằng bên B mang lại nhiều lợi ích hơn).'],
      upgrades: [
        {
          type: 'Mệnh đề nhượng bộ chốt quan điểm (Band 8.0+)',
          thesis: `While acknowledging that traditional arguments hold some merit, I firmly adhere to the view that progressive methodologies offer vastly superior long-term benefits.`,
          rationale: 'Dùng cấu trúc "While [nhượng bộ A], I firmly adhere to the view that [chốt B]" giúp đạt điểm tuyệt đối về Stance.'
        },
        {
          type: 'So sánh mức độ vượt trội (Outweigh Stance)',
          thesis: `In my view, although certain initial drawbacks exist, the socioeconomic advantages generated by this trend overwhelmingly outweigh the disadvantages.`,
          rationale: 'Chốt rõ lợi ích áp đảo bất lợi (outweighs) giải quyết trọn vẹn yêu cầu đề bài.'
        }
      ]
    };
  }

  if (hasDecisiveStance) {
    return {
      stanceLevel: 'clear',
      isDecisive: true,
      estimatedBand: 8.0,
      feedback: 'Xuất sắc! Câu Thesis của bạn có lập trường rất dứt khoát, định hình rõ ràng hướng lập luận cho các đoạn thân bài tiếp theo, hoàn toàn đáp ứng tiêu chí Band 7.0+ Task Response.',
      strengths: ['Chốt quan điểm dứt khoát, không mang tính nước đôi.', 'Định hướng rõ ràng cho thân bài.'],
      improvements: ['Có thể bổ sung thêm 1 lý do khái quát ngắn gọn (tổng kết 2 luận điểm chính) để câu thesis có chiều sâu hơn.'],
      upgrades: [
        {
          type: 'Tích hợp vắn tắt 2 lý do cốt lõi (Band 8.5+)',
          thesis: `I firmly contend that this policy is overwhelmingly advantageous, primarily because it fosters economic productivity and mitigates systemic social inequality.`,
          rationale: 'Khái quát trước 2 luận điểm chính sẽ viết trong Body 1 và Body 2.'
        }
      ]
    };
  }

  return {
    stanceLevel: text.length > 20 ? 'moderate' : 'vague',
    isDecisive: false,
    estimatedBand: 6.0,
    feedback: 'Câu Thesis của bạn đã nêu được chủ đề nhưng mức độ dứt khoát chưa cao. Giám khảo mong muốn nhìn thấy cụm từ thể hiện quan điểm cá nhân trực diện (ví dụ: "I firmly believe that...", "In my opinion, ...").',
    strengths: ['Đã bám sát từ khóa của đề thi.'],
    improvements: ['Bổ sung động từ thể hiện lập trường cá nhân rõ ràng hơn để tránh bị đánh giá là câu nêu lại đề bài (paraphrase thuần túy).'],
    upgrades: [
      {
        type: 'Khẳng định lập trường trực diện (Band 8.0+)',
        thesis: `In my opinion, adopting this approach is indispensable for sustainable growth, as it addresses both foundational and future challenges.`,
        rationale: 'Khẳng định dứt khoát quan điểm cá nhân và định hướng thân bài.'
      }
    ]
  };
}

/**
 * Validates candidate's Thesis Statement & Question Stance
 * against Cambridge Band Descriptors (TR / Task Response Band 7.0+ Requirement).
 */
export async function validateThesisStatement({ task, thesisText, apiKey, model = DEFAULT_MODEL }) {
  if (!thesisText || thesisText.trim().length < 5) {
    throw new Error('Vui lòng nhập câu Thesis Statement (ít nhất 5 ký tự).');
  }

  // Algorithmic Fallback if no API key
  if (!apiKey) {
    return validateThesisAlgorithmically({ task, thesisText });
  }

  const prompt = `ROLE & OBJECTIVE:
You are an expert Cambridge IELTS Examiner evaluating a student's THESIS STATEMENT or INTRODUCTION STANCE for IELTS Writing Task ${task?.taskNumber || 2}.

CAMBRIDGE ASSESSMENT CRITERION (TASK RESPONSE - POSITION REQUIREMENT):
- Band 7+ TR requires: "presents a clear position throughout the response".
- If the thesis is vague, purely neutral without a stance ("there are both pros and cons"), or fails to directly answer the question, TR is capped at Band 5.5 - 6.0.
- If it directly and decisively answers all parts of the prompt with clear direction, it supports Band 7.0 - 9.0.

QUESTION DETAILS:
- Task: Task ${task?.taskNumber || 2}
- Prompt: "${task?.prompt || ''}"

CANDIDATE'S THESIS STATEMENT:
"""
${thesisText.trim()}
"""

INSTRUCTIONS:
1. Determine if candidate presents a decisive position/stance (clear, vague, missing, or off_topic).
2. Estimate the Thesis Statement Quality Band (e.g. 5.5, 6.5, 7.5, 8.5).
3. Provide constructive feedback in Vietnamese: explain why it succeeds or what it lacks according to Cambridge criteria.
4. Provide TWO elevated Band 8.5+ alternative thesis versions adhering to their original stance:
   - Version 1 (Balanced concession / Nuanced): e.g. "While acknowledging [counter-argument], I firmly argue that [main stance] due to [reason]."
   - Version 2 (Categorical / Direct): e.g. "I completely agree that..., primarily because [reason 1] and [reason 2]."

OUTPUT FORMAT: Return ONLY valid, parseable JSON with NO markdown formatting, NO backticks. Schema:
{
  "stanceLevel": "clear" | "vague" | "missing" | "off_topic",
  "isDecisive": true,
  "estimatedBand": 7.5,
  "feedback": "Examiner evaluation in Vietnamese...",
  "strengths": ["..."],
  "improvements": ["..."],
  "upgrades": [
    {
      "type": "Nhượng bộ & Cân bằng (Nuanced Concession)",
      "thesis": "While...",
      "rationale": "Sử dụng mệnh đề nhượng bộ thể hiện tư duy phản biện sắc bén."
    },
    {
      "type": "Khẳng định trực diện (Direct & Decisive)",
      "thesis": "I firmly maintain that...",
      "rationale": "Chốt lập trường dứt khoát, dễ dàng triển khai luận điểm ở thân bài."
    }
  ]
}
`;

  try {
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

    if (!response || !response.ok) {
      return validateThesisAlgorithmically({ task, thesisText });
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return validateThesisAlgorithmically({ task, thesisText });

    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('AI thesis validation failed, falling back to algorithmic checker:', err);
    return validateThesisAlgorithmically({ task, thesisText });
  }
}









