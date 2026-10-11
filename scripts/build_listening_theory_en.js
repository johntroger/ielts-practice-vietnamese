/**
 * scripts/build_listening_theory_en.js
 * Generates src/data/theoryHandbook/listeningTheoryDataEn.js with all 20 Listening topics translated to academic English.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const LISTENING_THEORY_ARTICLES_EN = {
  'foundation-listening-band4-to-5-part1-mastery': {
    title: 'Listening Survival: Climbing from Band 4.0 to 5.0 (Part 1 Mastery & Letter/Number Traps)',
    summary: 'A fail-safe roadmap for Band 4.0 learners to score 16 - 22 correct answers: mastering high-frequency alphabet pairs, UK telephone numbers, and eliminating self-correction traps.',
    stage: 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
    content: `## 1. The Four Most Confused Letter Sound Pairs for ESL Learners

In Part 1, at least 1–2 questions require you to write down names of people, streets, cities, or postcodes. Here are the 4 most commonly confused letter pairs:

### Pair 1: A (/eɪ/) vs E (/iː/) vs I (/aɪ/)
- **Letter A**: Pronounced as /eɪ/ (rhymes with *say*, *day*).
- **Letter E**: Pronounced as /iː/ (rhymes with *see*, *tea*).
- **Letter I**: Pronounced as /aɪ/ (rhymes with *my*, *tie*).
- *Trap Example*: The speaker spells "BRAIN" -> many candidates write "BREEN" or "BRIN".

### Pair 2: G (/dʒiː/) vs J (/dʒeɪ/)
- **Letter G**: Sounds like the vowel in *sea* (/dʒiː/).
- **Letter J**: Sounds like the vowel in *say* (/dʒeɪ/).

### Pair 3: B (/biː/) vs P (/piː/)
- **Letter B**: Voiced bilabial plosive (vocal cords vibrate).
- **Letter P**: Voiceless aspirated plosive (puff of air).

### Pair 4: H (/eɪtʃ/) vs 8 (/eɪt/)
- The letter **H** ends with a soft /tʃ/ sound, whereas the number **8** ends with a crisp /t/.

---

## 2. Number Conventions in UK English

### 1. The Number "0" (Zero):
- Usually pronounced as the letter **"Oh"** in telephone numbers and postcodes (e.g., 0207 -> "Oh-two-oh-seven").
- Occasionally pronounced as **"Zero"** or **"Nought"**.

### 2. Double and Triple Digits:
- \`77\` is read as **"double seven"**.
- \`999\` is read as **"triple nine"**.

### 3. The "-teen" vs "-ty" Acoustic Trap:
- **13 - 19**: Stress falls on the second syllable (*thir-TEEN, four-TEEN, fif-TEEN*), with a long vowel.
- **30 - 90**: Stress falls heavily on the first syllable (*THIR-ty, FOR-ty, FIF-ty*), with a short final vowel.

---

## 3. The Classic "Self-Correction" Trap
Never rush to write down the first number or name uttered by the speaker. In Part 1, speakers almost always change their mind:
- *Speaker*: *"You can reach me on 07945... oh wait, sorry, that's my old SIM card. My current number is 07982 334190."*
- *Rule*: Listen for pivot markers (*"actually", "sorry", "wait", "no, hold on"*)!

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-part1-spelling-numbers': {
    title: 'Part 1: Personal Names, Numbers & Postcode Traps',
    summary: 'Acoustic traps in Part 1: homophones, UK address formatting, self-corrections, and letter-number combinations.',
    stage: 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
    content: `## 1. Anatomy of Part 1

Part 1 consists of a transactional conversation between two people in an everyday social context (e.g., booking a hotel room, renting an apartment, opening a bank account).

### 3 Golden Rules for Part 1:
1. **Target 10/10**: Part 1 is the easiest section of the test; aiming for a perfect 10/10 provides a psychological cushion for Parts 3 and 4.
2. **Strict Word Count**: Always inspect the instructions (*"ONE WORD AND/OR A NUMBER"*). Writing "2 words" when only one is permitted results in immediate zero credit.
3. **UK Postcode Format**: UK postcodes alternate letters and numbers (e.g., *SW1A 1AA, OX2 6DP*). Always write letters in CAPITAL form.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'spelling-and-units': {
    title: 'Data, Postcodes, Units of Measurement & Currency in IELTS Listening',
    summary: 'Standardized formats for numerical figures, phone numbers, alphanumeric postcodes, SI units, and international currencies in IELTS Listening.',
    stage: 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
    content: `## 1. Measurement Units & Currency Formats

### Rule 1: Check Pre-Printed Units on the Question Paper
If the question sheet already includes the unit symbol (e.g., \`£______\` or \`______ km\`), **DO NOT RE-WRITE THE UNIT**. Writing "£50" when "£" is already printed will be marked as incorrect ("££50").

### Common Currency Names & Symbols:
- \`$\` / dollars
- \`£\` / pounds / quid (slang in UK)
- \`€\` / euros
- \`p\` / pence / cents

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-units-currency-traps': {
    title: 'Measurement Units, Currency Traps & Unit Conversion in IELTS Listening',
    summary: 'Identifying pre-printed unit traps, conversion between hours and minutes, and metric vs imperial unit distinctions.',
    stage: 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
    content: `## 1. Unit Conversion Traps

The recording will frequently state measurements in one unit, while the exam sheet demands another:
- *Speaker*: *"The round trip takes about an hour and a half."*
- *Question*: *"Duration: [_______] minutes"* -> You must write **90**, not "1.5 hours"!

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-spelling-demons-100': {
    title: 'Top 100 IELTS Listening Spelling Demons',
    summary: 'The most fatal spelling mistakes that cost test-takers marks in IELTS Listening: silent letters, double consonants, and tricky vowel combinations.',
    stage: 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
    content: `## 1. The High-Risk Spelling Demons List

Misspelling a single letter invalidates an otherwise correct answer. Study and handwrite these frequently tested words:

| Word | High-Risk Trap | Key Spelling Feature |
| :--- | :--- | :--- |
| **accommodation** | double 'c', double 'm' | *two c\'s, two m\'s* |
| **environment** | silent 'n' | *en-vi-ron-ment* |
| **government** | silent 'n' | *gov-ern-ment* |
| **restaurant** | 'au' combination | *res-tau-rant* |
| **definitely** | 'i' instead of 'a' | *de-fi-nite-ly* |
| **Wednesday** | silent 'd' | *Wed-nes-day* |
| **February** | silent 'r' | *Feb-ru-ar-y* |
| **necessary** | one 'c', double 's' | *one collar, two socks* |
| **colleague** | 'ea' and 'ue' | *col-league* |
| **privilege** | two 'i's, no 'd' | *priv-i-lege* |

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-dictation-shadowing-method': {
    title: 'Dictation & Shadowing Methodology to Conquer Connected Speech',
    summary: 'A 4-step acoustic training system: separating syllables, identifying phonetic linking, and eliminating ear fatigue during long recordings.',
    stage: 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
    content: `## 1. The 4-Step Intensive Listening Protocol

1. **Blind First Listen**: Listen to a 60-second audio clip without viewing the audioscript.
2. **Dictation**: Transcribe word-for-word, pausing every 5–8 words.
3. **Audioscript Cross-Check**: Highlight in red every missed word, linking sound, or elided consonant.
4. **Shadowing**: Speak aloud simultaneously with the native speaker at 1.0x speed until your cadence matches exactly.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-progression-50-to-75': {
    title: 'Band 5.0 to 7.5 Listening Progression: Securing 18/20 in Parts 1 & 2 to Advanced Parts 3 & 4',
    summary: 'A tactical score-accumulation strategy: guaranteeing near-perfect scores in transactional sections while mastering academic discussions and lectures.',
    stage: 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
    content: `## 1. The Mathematics of Band 7.5 Listening

To achieve Band 7.5 in IELTS Listening, you must achieve **32 to 34 correct answers out of 40**:
- **Part 1 (Everyday Transaction)**: Target **9 - 10 / 10**.
- **Part 2 (Public Monologue / Map)**: Target **8 - 9 / 10**.
- **Part 3 (Academic Discussion)**: Target **7 - 8 / 10**.
- **Part 4 (Academic Lecture)**: Target **8 - 9 / 10**.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'distractor-traps': {
    title: 'Distractor Traps & Mind-Changes in IELTS Listening',
    summary: 'Deconstructing distractors and speaker mind-changes across multiple choice and form-filling tasks.',
    stage: 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
    content: `## 1. The Anatomy of a Distractor

A **distractor** is an incorrect option that is explicitly mentioned in the recording to mislead careless candidates.

### Common Distractor Signposts:
- *"I initially thought of X, but on second thought..."*
- *"We used to offer Y, however we discontinued it last year."*
- *"Although Option A seems viable, it is well outside our budget."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'map-and-signposting': {
    title: 'Map Labelling & Audio Signposting Markers in Listening',
    summary: 'Spatial navigation in Part 2: starting point anchors, cardinal directions, and following speaker navigation cues.',
    stage: 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
    content: `## 1. Mastering Map Labelling Tasks

### The Golden 3-Step Map Routine:
1. **Locate the Starting Point**: Look for *"You are here"*, the entrance, reception desk, or main gate.
2. **Orient Cardinal Directions**: Note compass indicators (*North, South, East, West*) or relative positions (*left, right, ahead, opposite*).
3. **Follow the Speaker's Physical Journey**: Trace the speaker\'s path with your pencil or cursor as they walk through the layout.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-part2-map-directions': {
    title: 'Part 2: Map Labelling Traps & Spatial Orientation Language',
    summary: 'Overcoming spatial traps: roundabouts, T-junctions, cross-roads, bends, and peripheral corridors.',
    stage: 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
    content: `## 1. Key Spatial Prepositions and Navigational Verbs
- *Take the first turning on your right.*
- *Directly opposite the botanical conservatory.*
- *Tucked away in the far north-eastern corner.*
- *Run parallel to the main railway line.*
- *Just past the roundabout on the left-hand side.*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-plural-s-grammar-rule': {
    title: 'Grammatical Deduction for Plural \'-s\' When Endings Are Elided',
    summary: 'Acoustic rescue tactics when final /s/ is swallowed: analyzing articles (a/an vs zero article), quantifiers, and verb agreement.',
    stage: 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
    content: `## 1. When You Cannot Hear the Final /s/

Fast native speech frequently elides word-final consonants. When in doubt:
- If preceded by **a / an / one**, it MUST be singular.
- If preceded by **various / numerous / several / both / these / those**, it MUST be plural.
- If there is no article before a countable noun, it is almost certainly **plural**.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-pre-prediction-protocol': {
    title: 'The 30-Second Pre-Listening Prediction Protocol',
    summary: 'Maximizing the 30-second preparation window before each section: identifying part of speech, semantic fields, and grammatical constraints.',
    stage: 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
    content: `## 1. The 30-Second Prediction Routine
1. **Identify Word Class**: Predict whether the blank requires a noun, verb, adjective, or number.
2. **Predict Semantic Field**: Is the missing word an animal, a payment method, a profession, or a geographic location?
3. **Underline Acoustic Anchor Keywords**: Identify proper nouns or numbers that cannot be paraphrased by the speaker.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-accents-guide': {
    title: 'Identifying & Adapting to Regional Accents (UK, US, AU, Scottish, NZ)',
    summary: 'Phonetic nuances across British RP, General American, Australian, Scottish, and Kiwi accents in Cambridge IELTS tests.',
    stage: 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
    content: `## 1. Regional Accents Tested in IELTS
- **British RP**: Non-rhotic ('r' is dropped after vowels: *car* -> /kɑː/).
- **Australian**: Rising inflection; vowel shifts (*today* sounds like /təˈdaɪ/).
- **General American**: Strong rhoticity; 't' flaps (*water* -> /wɑːt̬ər/).
- **Scottish**: Rolled 'r's and distinctive vowel lengths.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-part3-academic-discussion': {
    title: 'Part 3: Academic Discussion & Divergent Perspective Traps',
    summary: 'Tackling university tutorials: multiple choice options, tracking which student supports which stance, and consensus versus conflict.',
    stage: 'Stage 3: Dialogue Analysis & Academic Lectures (Band 7.0 – 9.0)',
    content: `## 1. Dynamics of Part 3 Academic Tutorials
Part 3 features up to 3 speakers (usually two students and a tutor) discussing research projects, dissertations, or scientific case studies.

### Core Challenge:
Questions frequently ask: *"What do both students agree on?"*
- One student will enthusiastically suggest an idea.
- The second student will hedge or reject it.
- Only options backed by **mutual agreement** are correct!

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-part3-tone-attitude-sarcasm': {
    title: 'Deciphering Tone, Covert Attitude & Subtle Disagreement in Part 3',
    summary: 'Recognizing subtle auditory cues: reluctant concessions, ironic intonations, and polite disagreement markers.',
    stage: 'Stage 3: Dialogue Analysis & Academic Lectures (Band 7.0 – 9.0)',
    content: `## 1. Listening for Subtext & Irony
Native speakers rarely say "I disagree with you" outright in academic discussions. Instead, they use polite hedging:
- *"Well, up to a point, but..."*
- *"That\'s one way of looking at it, I suppose."* (Indicates skepticism).
- *"I wouldn\'t be so sure about that."* (Direct counter-stance).

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'cambridge-part3-consensus-traps': {
    title: 'Cracking Pseudo-Consensus Traps in Cambridge 18-19 Part 3',
    summary: 'Recent Cambridge test analysis: speakers feigning initial consensus before rejecting propositions on logistical or methodological grounds.',
    stage: 'Stage 3: Dialogue Analysis & Academic Lectures (Band 7.0 – 9.0)',
    content: `## 1. The Pseudo-Consensus Formula (Cam 18-19 Trend)
In recent exams, speakers often use agreeable sounds (*"Right", "Sure", "Yeah"*) simply to show they are listening, NOT that they agree with the proposal!
- *Student A*: *"We should include interviews with factory workers."*
- *Student B*: *"Yeah... though given our two-week deadline, arranging site visits would be virtually impossible."*
- *Outcome*: Student B rejects the proposal despite saying *"Yeah"*.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-part4-lecture-signposting': {
    title: 'Part 4: Academic Lecture Signposting Markers',
    summary: 'Navigating uninterrupted 10-question lectures: tracking structural cues, rhetorical questions, and topic shifts.',
    stage: 'Stage 3: Dialogue Analysis & Academic Lectures (Band 7.0 – 9.0)',
    content: `## 1. Part 4 Strategy: Following the Academic Signposts
Part 4 runs continuously for 10 questions without a mid-section pause.

### Key Signpost Categories:
- **Introducing a Topic**: *"Let\'s begin by examining...", "What I want to focus on today is..."*
- **Shifting Focus**: *"Turning now to...", "Moving on to the secondary factor..."*
- **Illustrating**: *"To see this in action, consider...", "A classic example is..."*
- **Synthesizing**: *"So, what conclusions can we draw from this?..."*

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-connected-speech-phonetics': {
    title: 'Acoustics & Connected Speech: Linking, Elision & Weak Forms',
    summary: 'Understanding why spoken words sound different from written text: consonant-vowel linking, /t/ and /d/ elision, and the schwa sound.',
    stage: 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
    content: `## 1. Three Core Rules of Connected Speech

### 1. Consonant-to-Vowel Linking:
- *"Pick it up"* -> pronounced as /pɪ-kɪ-tʌp/.

### 2. Elision (Disappearing Sounds):
- In rapid speech, /t/ and /d/ between two consonants disappear:
  - *"Next door"* -> /neks-dɔː/.
  - *"First class"* -> /fɜːs-klɑːs/.

### 3. Weak Forms & The Schwa (/ə/):
- Prepositions and auxiliaries (*to, for, at, can, have*) are unstressed and reduce to the schwa:
  - *"I can go"* -> /aɪ kən ɡəʊ/.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-overview-format': {
    title: 'IELTS Listening Format, Scoring Conversion & CD-IELTS Overview',
    summary: 'Structure of the 4 Listening sections, raw score to band conversion table, and computer exam navigation strategies.',
    stage: 'Stage 4: CDI Computer Listening Skills',
    content: `## 1. Format of the IELTS Listening Test
- **Duration**: Approximately 30 minutes of audio (+ 10 minutes transfer time on paper; 2 minutes review on computer).
- **Questions**: 40 questions across 4 recorded sections.
- **Each recording is played ONCE ONLY.**

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  },

  'listening-cd-ielts-hacks-and-focus': {
    title: 'Computer-Delivered Listening (CD-IELTS): Keyboard Shortcuts & Screen Strategy',
    summary: 'Computer test advantages: Tab navigation between blanks, volume adjustments, split-screen matching, and recovery when lost.',
    stage: 'Stage 4: CDI Computer Listening Skills',
    content: `## 1. Computer Exam Keyboard Shortcuts for Listening
- **Tab**: Jump instantly to the next text field or blank without touching the mouse.
- **Shift + Tab**: Jump backward to the previous blank.
- **Volume Slider**: Adjust audio output levels at any moment during the test.
- **Drag & Drop vs Typing**: For matching questions, drag labels smoothly into empty target slots.

---

> **Practical Application:** Open the [IELTS Practice Web](https://ielts-practice-vietnamese.vercel.app/) application to practice and receive in-depth AI evaluations.`
  }
};

const targetFile = path.resolve(__dirname, '../src/data/theoryHandbook/listeningTheoryDataEn.js');
const fileHeader = `/**
 * src/data/theoryHandbook/listeningTheoryDataEn.js
 * Complete English edition of all 20 IELTS Listening Theory articles.
 */

export const LISTENING_THEORY_ARTICLES_EN = ${JSON.stringify(LISTENING_THEORY_ARTICLES_EN, null, 2)};
`;

fs.writeFileSync(targetFile, fileHeader, 'utf-8');
console.log(`Generated: ${targetFile} (${Object.keys(LISTENING_THEORY_ARTICLES_EN).length} articles)`);
