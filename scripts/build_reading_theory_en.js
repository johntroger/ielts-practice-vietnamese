/**
 * scripts/build_reading_theory_en.js
 * Generates src/data/theoryHandbook/readingTheoryDataEn.js with all 25 Reading topics translated to academic English.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const READING_THEORY_ARTICLES_EN = {
  'reading-overview-academic-vs-general-conversion': {
    title: 'IELTS Reading Exam Overview: Academic vs General Training & Official Score Conversion',
    summary: 'A complete overview of the 60-minute 40-question exam: textual sources, question typologies, raw score to band conversion differences, and pacing strategies.',
    stage: 'Stage 1: Foundation & Core Skills (Band 4.0 – 5.0)',
    content: `## 1. Comprehensive Comparison: IELTS Reading Academic vs General Training

Although both formats test English reading comprehension in **60 minutes across 40 questions**, the texts and grading scales differ significantly:

\`\`\`mermaid
mindmap
  root((IELTS Reading))
    Academic
      Passage 1: Descriptive & Informative
      Passage 2: Analytical & Evaluative
      Passage 3: Theoretical Argumentation
    General Training
      Section 1: Daily Social Survival
      Section 2: Workplace Contexts
      Section 3: General Descriptive Article
\`\`\`

### Key Structural Differences:
- **Academic Reading**: Three long passages extracted from academic journals, magazines, books, and research papers (2,150 – 2,750 words total).
- **General Training**: Section 1 consists of 2–3 short informational texts (timetables, advertisements), Section 2 focuses on workplace situations, and Section 3 is a longer general interest text.

---

## 2. Official Cambridge Raw Score to Band Conversion

Because General Training texts are comparatively simpler in vocabulary, the grading threshold for General Training is much stricter:

| Band Score | Academic (Correct / 40) | General Training (Correct / 40) |
| :---: | :---: | :---: |
| **5.0** | 15 – 18 | 23 – 26 |
| **6.0** | 23 – 26 | 30 – 31 |
| **7.0** | 30 – 32 | 34 – 35 |
| **8.0** | 35 – 36 | 37 – 38 |
| **9.0** | 39 – 40 | 40 |

> [!TIP]
> Notice that to achieve **Band 7.0**, an Academic candidate needs **30 correct answers**, whereas a General Training candidate requires **34 correct answers**!

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-core-skills-skimming-scanning-close-reading': {
    title: 'Core Reading Triad: Skimming, Scanning & Close Reading Mastery',
    summary: 'The 3 essential reading skills to navigate 2,700 words under 60 minutes: reading for gist, locating acoustic anchors, and micro-analyzing syntax.',
    stage: 'Stage 1: Foundation & Core Skills (Band 4.0 – 5.0)',
    content: `## 1. The Triad of Reading Techniques

Attempting to read all 2,700 words word-for-word will guarantee running out of time before finishing Passage 3. Master this 3-tier technique:

1. **Skimming (Reading for Gist - 2 to 3 minutes per passage)**: Read titles, subheadings, the first and last sentence of each paragraph to construct a mental map of the text.
2. **Scanning (Searching for Specific Data)**: Move your eyes rapidly across paragraphs to pinpoint dates, capitalized proper nouns, numbers, and technical terminology.
3. **Close Reading (In-Depth Analytical Comprehension)**: Once the relevant sentence is located, read the 2 sentences before and after with intense syntactic scrutiny to confirm exact meaning.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-keyword-classification-locating-micro': {
    title: 'Keyword Classification: Category 1 (Locating Keywords) vs Category 2 (Meaning Clues)',
    summary: 'Distinguishing hard keywords (names, numbers, scientific terms that cannot be paraphrased) from soft keywords (verbs, adjectives that change shape in the text).',
    stage: 'Stage 1: Foundation & Core Skills (Band 4.0 – 5.0)',
    content: `## 1. Category 1: Locating Keywords (Hard Anchors)
These are terms that **cannot be altered or paraphrased** by the test writer:
- Capitalized proper nouns (*Dr. Watson, Harvard University, New Zealand*).
- Specific calendar dates and numbers (*1987, 45%, 150 kilometers*).
- Specialized technical/biological terms (*photosynthesis, dopamine, Cretaceous*).

---

## 2. Category 2: Meaning Keywords (Soft Traps)
These are everyday words that the test writer **deliberately paraphrases in the passage**:
- *Question*: *"Governments must **ban** dangerous chemicals."*
- *Passage*: *"State authorities should **prohibit** hazardous substances."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'foundation-reading-band4-to-5-strategy': {
    title: 'Reading Strategy for Band 4.5 – 5.0: Securing Passage 1 & Keyword Tracking',
    summary: 'Focusing tactical energy on securing 11/13 in Passage 1 and 7/13 in Passage 2 to safely cross the Band 5.0 threshold.',
    stage: 'Stage 1: Foundation & Core Skills (Band 4.0 – 5.0)',
    content: `## 1. The Band 5.0 Reading Survival Rule

To score Band 5.0, you only need **16 to 18 correct answers out of 40**.
- Do not waste 25 minutes struggling with abstract academic philosophy in Passage 3.
- Dedicate **25 minutes to Passage 1** to guarantee 11–12 correct answers.
- Dedicate **25 minutes to Passage 2** to secure 6–8 correct answers.
- Spend the remaining 10 minutes guessing strategically on Passage 3.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-completion-forms': {
    title: 'Completion Strategies: Summary, Note, Table, Flow-chart & Diagram Completion',
    summary: 'Mastering gap-fill question types: predicting parts of speech, identifying syntactic boundaries, and obeying word limits.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. The 3-Step Protocol for Completion Tasks
1. **Analyze Word Limit**: Check whether instructions specify *"NO MORE THAN TWO WORDS"* or *"ONE WORD ONLY"*.
2. **Predict Grammatical Category**: Does the blank require a singular noun, plural noun, adjective, or past participle?
3. **Scan Anchor Words**: Locate the paragraph section matching the summary block and extract exact words from the text.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-academic-paraphrasing': {
    title: 'The 5 Classic Cambridge IELTS Academic Paraphrasing Rules',
    summary: 'Decoding Cambridge paraphrase mechanisms: exact synonyms, word-class conversions, passive-active transformations, antonyms with negation, and conceptual definitions.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. The 5 Paraphrase Patterns in Cambridge Tests
1. **Direct Synonyms**: *enhance* <-> *improve*, *hazardous* <-> *dangerous*.
2. **Word Class Shift**: *destroy* (verb) <-> *widespread destruction* (noun).
3. **Voice Shift**: Active voice in question <-> Passive voice in passage.
4. **Antonym with Negation**: *inexpensive* <-> *not costly*.
5. **Definition / Conceptual Unpacking**: *nocturnal* <-> *active during the night*.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-progression-50-to-75': {
    title: 'Score Leap from Band 5.0 to 7.5: Raw Score Matrix (16 -> 23 -> 27 -> 33) & 3-Passage Energy Allocation',
    summary: 'The exact progression metrics to advance your score: question accuracy milestones and tactical time distribution.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Raw Score Progression Milestones
- **Band 5.0**: 16/40 (Passage 1: 10, Passage 2: 4, Passage 3: 2)
- **Band 6.0**: 23/40 (Passage 1: 11, Passage 2: 8, Passage 3: 4)
- **Band 6.5**: 27/40 (Passage 1: 12, Passage 2: 10, Passage 3: 5)
- **Band 7.5**: 33/40 (Passage 1: 13, Passage 2: 11, Passage 3: 9)

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'time-management': {
    title: 'The 15 - 20 - 25 Minute Golden Time Management Rule (Reading)',
    summary: 'Overcoming the 60-minute time constraint: allocating 15 mins for Passage 1, 20 mins for Passage 2, and 25 mins for Passage 3 without separate transfer time.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. The 15 - 20 - 25 Pacing Rule
Unlike IELTS Listening, there is **NO separate 10-minute transfer time** at the end of the Reading test. All answers must be entered directly onto the answer sheet / computer interface within 60 minutes.

### Pacing Breakdown:
- **Passage 1**: 15 minutes (Direct, descriptive information).
- **Passage 2**: 20 minutes (Moderate analytical complexity).
- **Passage 3**: 25 minutes (Dense, theoretical arguments).

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'true-false-not-given': {
    title: 'True / False / Not Given & Yes / No / Not Given Trap Mastery',
    summary: 'The gold standard rules for T/F/NG: TRUE when meaning matches 100%, FALSE when direct contradiction exists, NOT GIVEN when text is silent on the claim.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Clear Definitions of T/F/NG
- **TRUE / YES**: The claim in the statement agrees 100% with the information in the passage.
- **FALSE / NO**: The claim in the statement **directly contradicts** the text (there is counter-evidence that makes it impossible for both to be true).
- **NOT GIVEN**: The passage mentions the topic, but does not provide sufficient confirmation or contradiction for the specific claim.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-tfng-strategy': {
    title: 'Absolute True / False / Not Given Elimination & Contradiction Traps',
    summary: 'Navigating absolute qualifier traps (all, always, only) versus tentative hedging (many, often, occasionally) in T/F/NG tasks.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Absolute vs Hedging Qualifiers
- **Statement**: *"All migratory birds travel south during winter."*
- **Passage**: *"The majority of migratory bird species journey southwards."*
- **Answer**: **FALSE** (because "All" directly contradicts "The majority of").

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'matching-headings': {
    title: 'Mastering Matching Headings to Paragraphs',
    summary: 'Extracting central paragraph themes: reading for gist, avoiding first-sentence keyword traps, and eliminating distracting sub-details.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Strategy for Matching Headings
1. **Always complete this task first** before doing detailed question types for that passage.
2. Read the headings list and underline unique focal keywords.
3. Skim each paragraph as a whole to grasp the overarching purpose, rather than matching an isolated word in sentence 1.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-matching-names-researchers': {
    title: 'Matching Names, Researchers & Scientific Theories',
    summary: 'Scanning for capital letters and academic titles, highlighting citations (argues, demonstrated, discovered), and matching theories to researchers.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Scanning Proper Names
1. Scan the entire passage and circle every occurrence of each name from the box.
2. Read the reporting clauses surrounding each name (*"Dr. Brown observed that...", "According to Smith..."*).
3. Match the finding to the numbered statement list.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-multiple-choice': {
    title: 'Multiple Choice & Pick Multiple Options Strategies',
    summary: 'Using process of elimination for distractors: Too Broad, Too Narrow, Contradictory, or Not Mentioned in the passage.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Process of Elimination in Multiple Choice
- **Distractor 1: Too Narrow**: Mentions a true detail from the paragraph, but fails to answer the broader question.
- **Distractor 2: Contradictory**: Contains words directly from the text, but reverses the causal relationship.
- **Distractor 3: Not Mentioned**: Fabricates an intuitive but unsubstantiated claim.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-matching-info-features': {
    title: 'Matching Information to Paragraphs & Matching Features',
    summary: 'Tackling the most difficult Reading task ("Which paragraph contains the following information?"): completing it last after mastering the text.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Why Matching Information Should Be Done Last
Unlike sentence completion, Matching Information questions **DO NOT appear in chronological order**.
- Leave this question type until you have answered the other question sets for that passage, because by then you will already know where topics are located.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-summary-box-options': {
    title: 'Summary Completion with a Box of Options (Grammar & Synonyms Filter)',
    summary: 'Dual filtering: using grammatical part of speech and synonymous paraphrases to eliminate 70% of box choices before reading.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Dual-Filter Strategy
1. **Filter 1 (Grammar)**: Identify what part of speech fits the blank. If an adjective is required, eliminate all nouns and verbs in the box immediately.
2. **Filter 2 (Synonym Match)**: Match the surviving options against the meaning in the passage.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-diagram-flowchart': {
    title: 'Diagram & Flow-Chart Labelling Tactics',
    summary: 'Understanding diagrams in Reading: spatial labels, chronological arrows in flowcharts, and exact wording extracted from technical descriptions.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Tracing Flowcharts and Diagrams
- Follow arrows and step numbers sequentially.
- Find the passage section that introduces technical terminology and copy words with 100% exact spelling.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-short-answer-questions': {
    title: 'Short-Answer Questions Strategy (Word Limit & Scanning)',
    summary: 'Targeting specific facts: who, when, where, how much, extracting exact phrases without alteration.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Short-Answer Guidelines
- Extract the exact words from the passage without changing their grammatical form.
- Strictly adhere to word count limits (*"NO MORE THAN TWO WORDS"*).

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-cambridge-synonym-lexicon': {
    title: 'Top 50 Most Frequently Repeated Cambridge Paraphrase Pairs (Cam 10 - 19)',
    summary: 'High-yield recurring synonyms that appear across multiple Cambridge past papers: replicate, mitigate, surge, jeopardize, and deteriorate.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Essential Cambridge Paraphrase Pairs
- *deteriorate* <-> *worsen, decline*
- *mitigate* <-> *alleviate, lessen*
- *jeopardize* <-> *threaten, endanger*
- *indispensable* <-> *essential, vital*
- *disclose* <-> *reveal, uncover*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-order-strategy-and-golden-rules': {
    title: 'In-Order vs Out-Of-Order Question Strategy & 6 Exam Room Golden Rules',
    summary: 'Which question types follow chronological passage order and which do not: maximizing tracking efficiency during the exam.',
    stage: 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
    content: `## 1. Question Order Map

| Follows Passage Order | Does NOT Follow Order |
| :--- | :--- |
| - Multiple Choice<br>- True / False / Not Given<br>- Sentence Completion<br>- Short-Answer Questions | - Matching Headings<br>- Matching Information to Paragraphs<br>- Matching Features |

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-contextual-guessing-roots': {
    title: 'Context Clues, Latin/Greek Roots & Academic Vocabulary Guessing',
    summary: 'Decoding unfamiliar terminology: prefixes (un-, dis-, sub-), Latin roots (bio-, geo-, anthrop-), and surrounding semantic context.',
    stage: 'Stage 3: In-Depth Reading, Trap Decoders & Tactics (Band 7.0 – 9.0)',
    content: `## 1. Decoding Word Roots
- **Bio-** (life): *biodegradable, biosphere*.
- **Anthrop-** (human): *anthropology, philanthropic*.
- **Chron-** (time): *chronological, synchronous*.
- When you encounter an unknown word, determine whether its tone is positive, negative, or neutral from adjacent adjectives.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-chunking-speed': {
    title: 'Sense Groups & Chunking Reading: Accelerating Speed to 300+ WPM',
    summary: 'Training eyes to read meaningful word groups (sense chunks) rather than single words, dramatically boosting reading speed and working memory.',
    stage: 'Stage 3: In-Depth Reading, Trap Decoders & Tactics (Band 7.0 – 9.0)',
    content: `## 1. The Chunking Method
Instead of reading word-by-word:
- *Slow*: [The] [number] [of] [cars] [has] [grown].
- *Chunked*: [The number of cars] [has grown rapidly] [in urban centers].

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-passage3-author-stance': {
    title: 'Deconstructing Passage 3: Attribution vs Author Stance',
    summary: 'Unpacking complex academic texts: distinguishing citations of other scholars from the author\'s own critical conclusions.',
    stage: 'Stage 3: In-Depth Reading, Trap Decoders & Tactics (Band 7.0 – 9.0)',
    content: `## 1. Attribution vs Author Stance
- **Attribution**: *"Proponents claim that artificial intelligence will eliminate human labor."* (This is an outside view, not necessarily endorsed by the author).
- **Author Stance**: *"However, such predictions overlook the enduring value of human empathy."* (This is the author\'s true stance!).

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-strategic-time-management': {
    title: 'The 90-Second Rule & Strategic Abandonment to Secure 35+ Correct Answers',
    summary: 'Never get bogged down: abandoning any single question that takes over 90 seconds to preserve time for easier questions downstream.',
    stage: 'Stage 3: In-Depth Reading, Trap Decoders & Tactics (Band 7.0 – 9.0)',
    content: `## 1. The 90-Second Rule
Every question in IELTS Reading is worth exactly **1 mark**, whether it is the simplest gap-fill in Passage 1 or the hardest philosophical nuance in Passage 3.
- If you spend more than 90 seconds on one question, put down your best educated guess, flag it, and move forward immediately!

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'reading-last-5-minutes-rescue': {
    title: 'Last 5 Minutes Emergency Rescue: Scientific Educated Guessing',
    summary: 'When time is running out: eliminating unlikely options, filling all blanks, and capitalizing on T/F/NG probabilities.',
    stage: 'Stage 3: In-Depth Reading, Trap Decoders & Tactics (Band 7.0 – 9.0)',
    content: `## 1. Emergency Guessing Protocol
- There is **no negative marking** in IELTS. Never leave any question blank on your answer sheet!
- For leftover T/F/NG questions, pick one consistent choice rather than alternating randomly.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'computer-delivered-reading-techniques': {
    title: 'Computer-Delivered IELTS Reading: Highlight, Split-Screen & Note-Taking',
    summary: 'Maximizing the computer interface: adjustable split-screen, yellow highlight shortcuts, and eliminating scrolling fatigue.',
    stage: 'Stage 4: CDI Computer Reading Techniques',
    content: `## 1. Computer Interface Mastery
- **Split Screen**: The left pane displays the passage; the right pane shows the questions. Adjust the dividing bar to optimize your layout.
- **Right-Click Highlight**: Highlight keywords directly in the passage text in yellow.
- **Notes Feature**: Attach notes to highlighted text segments.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  }
};

const targetFile = path.resolve(__dirname, '../src/data/theoryHandbook/readingTheoryDataEn.js');
const fileHeader = `/**
 * src/data/theoryHandbook/readingTheoryDataEn.js
 * Complete English edition of all 25 IELTS Reading Theory articles.
 */

export const READING_THEORY_ARTICLES_EN = ${JSON.stringify(READING_THEORY_ARTICLES_EN, null, 2)};
`;

fs.writeFileSync(targetFile, fileHeader, 'utf-8');
console.log(`Generated: ${targetFile} (${Object.keys(READING_THEORY_ARTICLES_EN).length} articles)`);
