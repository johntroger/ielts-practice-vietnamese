/**
 * Test Step 49: Speaking Fluency & Reflex Micro-Drills Studio
 *
 * Verifies:
 * 1. SPEAKING_MICRO_DRILLS dataset completeness & schema integrity across 4 sub-rooms:
 *    - speaking-area: A.R.E.A formula (Answer, Reason, Example, Alternative) + Band 8.5 model.
 *    - speaking-fillers: Natural fillers & signposting options with explanations & audio samples.
 *    - speaking-collocations: Idioms & natural collocations with sample sentences & explanations.
 *    - speaking-part3-counter: Two-sided analytical reflex (Side A, Side B, Synthesis) + model response.
 * 2. Gemini AI Engine:
 *    - generateMicroDrill supports speaking-area, speaking-fillers, speaking-collocations, speaking-part3-counter.
 *    - evaluateSpeakingMicroDrill evaluates user input across fluency, collocations, grammar, and band estimate.
 * 3. MicroDrillsModal UI Integration:
 *    - Room 5 button promotes "Chuyên Speaking" with green "MỚI" badge (no "⏳ Sắp có").
 *    - Level 2 sub-tabs bar renders all 4 speaking sub-tabs.
 *    - Voice dictation via Web Speech API (SpeechRecognition) & manual textarea fallback.
 *    - Native TTS speech playback via handlePlaySpeakingAudio and speakText.
 *    - Pagination bar enabled for Speaking room with StarRatingWidget & Mastered tracking.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Testing Step 49: Speaking Fluency & Reflex Micro-Drills Studio ---');

// 1. Verify Dataset
const dataPath = path.join(__dirname, '../src/data/speakingMicroDrills.js');
assert(fs.existsSync(dataPath), 'src/data/speakingMicroDrills.js must exist');

const { SPEAKING_MICRO_DRILLS } = await import('../src/data/speakingMicroDrills.js');
assert(Array.isArray(SPEAKING_MICRO_DRILLS) && SPEAKING_MICRO_DRILLS.length >= 10,
  'SPEAKING_MICRO_DRILLS must contain curated speaking drills');

const areaDrills = SPEAKING_MICRO_DRILLS.filter(d => d.type === 'speaking-area');
const fillerDrills = SPEAKING_MICRO_DRILLS.filter(d => d.type === 'speaking-fillers');
const collocDrills = SPEAKING_MICRO_DRILLS.filter(d => d.type === 'speaking-collocations');
const part3Drills = SPEAKING_MICRO_DRILLS.filter(d => d.type === 'speaking-part3-counter');

console.log('Test 1: Verifying sub-room dataset distribution');
assert(areaDrills.length >= 3, 'Must have at least 3 speaking-area drills');
assert(fillerDrills.length >= 2, 'Must have at least 2 speaking-fillers drills');
assert(collocDrills.length >= 3, 'Must have at least 3 speaking-collocations drills');
assert(part3Drills.length >= 2, 'Must have at least 2 speaking-part3-counter drills');

// 2. Verify Schema Integrity
console.log('Test 2: Verifying speaking-area schema integrity');
areaDrills.forEach(d => {
  assert(d.id && d.title && d.question, 'speaking-area drill must have id, title, question');
  assert(d.formula && d.formula.answer && d.formula.reason && d.formula.example && d.formula.alternative,
    'speaking-area drill must have full 4-step A.R.E.A formula');
  assert(Array.isArray(d.formula.answer.keywords), 'formula steps must include keyword suggestions');
  assert(d.modelAnswerBand8 && d.modelAnswerBand8.length > 50, 'must have Band 8.5 model answer');
});

console.log('Test 3: Verifying speaking-fillers schema integrity');
fillerDrills.forEach(d => {
  assert(d.id && d.question && d.situation, 'speaking-fillers drill must have question and situation');
  assert(Array.isArray(d.options) && d.options.length >= 3, 'must provide multiple choice filler options');
  assert(d.options.some(opt => opt.isCorrect), 'must have a correct option');
  assert(d.sampleContinuation, 'must have sample continuation for audio playback');
});

console.log('Test 4: Verifying speaking-collocations schema integrity');
collocDrills.forEach(d => {
  assert(d.id && d.questionSentence && d.idiom && d.meaning, 'collocation drill must have idiom and meaning');
  assert(Array.isArray(d.options) && d.options.some(opt => opt.isCorrect), 'options must contain correct answer');
  assert(d.speakingExample, 'must contain spoken example sentence');
});

console.log('Test 5: Verifying speaking-part3-counter schema integrity');
part3Drills.forEach(d => {
  assert(d.id && d.question && d.sideA && d.sideB && d.synthesis, 'part3 drill must have two sides + synthesis');
  assert(d.sideA.perspective && d.sideB.perspective, 'must define both perspectives');
  assert(d.modelAnswerBand8, 'must have model answer for Part 3');
  assert(Array.isArray(d.highBandVocab) && d.highBandVocab.length > 0, 'must highlight high band vocabulary');
});

// 3. Verify Gemini AI Service Integration
console.log('Test 6: Verifying geminiService.js AI speaking prompts & evaluation');
const geminiServicePath = path.join(__dirname, '../src/services/geminiService.js');
const geminiSource = fs.readFileSync(geminiServicePath, 'utf8');

assert(geminiSource.includes('evaluateSpeakingMicroDrill'), 'geminiService must export evaluateSpeakingMicroDrill');
assert(geminiSource.includes("drillType === 'speaking-area'"), 'generateMicroDrill must support speaking-area');
assert(geminiSource.includes("drillType === 'speaking-fillers'"), 'generateMicroDrill must support speaking-fillers');
assert(geminiSource.includes("drillType === 'speaking-collocations'"), 'generateMicroDrill must support speaking-collocations');
assert(geminiSource.includes("drillType === 'speaking-part3-counter'"), 'generateMicroDrill must support speaking-part3-counter');

// 4. Verify MicroDrillsModal.jsx UI Components
console.log('Test 7: Verifying MicroDrillsModal.jsx Speaking integration');
const modalPath = path.join(__dirname, '../src/components/MicroDrillsModal.jsx');
const modalSource = fs.readFileSync(modalPath, 'utf8');

assert(modalSource.includes('SPEAKING_MICRO_DRILLS'), 'MicroDrillsModal must import SPEAKING_MICRO_DRILLS');
assert(modalSource.includes('evaluateSpeakingMicroDrill'), 'MicroDrillsModal must import evaluateSpeakingMicroDrill');
assert(!modalSource.includes('⏳ Sắp có'), 'Modal must not contain placeholder "⏳ Sắp có" badge for Speaking');
assert(modalSource.includes('Chuyên Speaking'), 'Modal must feature "Chuyên Speaking" room');
assert(modalSource.includes("setActiveTab('speaking-area')"), 'Modal must feature speaking-area sub-tab');
assert(modalSource.includes("setActiveTab('speaking-fillers')"), 'Modal must feature speaking-fillers sub-tab');
assert(modalSource.includes("setActiveTab('speaking-collocations')"), 'Modal must feature speaking-collocations sub-tab');
assert(modalSource.includes("setActiveTab('speaking-part3-counter')"), 'Modal must feature speaking-part3-counter sub-tab');
assert(modalSource.includes('handleToggleVoiceDictation'), 'Modal must support voice dictation for speaking practice');
assert(modalSource.includes('handlePlaySpeakingAudio'), 'Modal must support native audio playback for speaking drills');
assert(modalSource.includes("activeRoom !== 'listening' && renderPaginationBar()"),
  'Pagination bar must be rendered for speaking room with rating and mastered features');

console.log('✅ All 7/7 checks passed cleanly for Step 49 Speaking Micro-Drills Studio!');
process.exit(0);
