import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalPath = path.resolve(__dirname, '../src/services/geminiService.js');
const targetDir = path.resolve(__dirname, '../src/services/ai');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const src = fs.readFileSync(originalPath, 'utf8');

// 1. Core Gemini Client
const coreStart = src.indexOf('const DEFAULT_MODEL =');
const coreEnd = src.indexOf('export async function evaluateEssay');
const coreSlice = src.slice(coreStart, coreEnd);

const overlapStart = src.indexOf('export function calculateLexicalOverlap');
const overlapEnd = src.indexOf('export function buildGoogleBananaMapPrompt');
const overlapSlice = src.slice(overlapStart, overlapEnd);

const coreContent = `/**
 * Core Gemini API Client & Resilience Engine
 * Handles low-level HTTP requests, rate limiting, model fallback chains, and robust JSON parsing.
 */

${coreSlice}
${overlapSlice}
`;
fs.writeFileSync(path.join(targetDir, 'coreGeminiClient.js'), coreContent, 'utf8');
console.log('✅ 1. Created coreGeminiClient.js');

// 2. Writing AI Service
const evalEssayStart = src.indexOf('export async function evaluateEssay');
const evalEssayEnd = src.indexOf('export async function evaluateParaphrase');
const evalEssaySlice = src.slice(evalEssayStart, evalEssayEnd);

const bananaAndTasksStart = src.indexOf('export function buildGoogleBananaMapPrompt');
const bananaAndTasksEnd = src.indexOf('export async function generateSpellingTrapAi');
const bananaAndTasksSlice = src.slice(bananaAndTasksStart, bananaAndTasksEnd);

const revisionStart = src.indexOf('export async function evaluateRevisionComparison');
const revisionEnd = src.indexOf('export async function explainReadingQuestion');
const revisionSlice = src.slice(revisionStart, revisionEnd);

const thesisStart = src.indexOf('export function validateThesisAlgorithmically');
const thesisSlice = src.slice(thesisStart);

const subAnglesStart = src.indexOf('export const WRITING_SUB_ANGLES =');
const subAnglesEnd = src.indexOf('export function calculateLexicalOverlap');
const subAnglesSlice = src.slice(subAnglesStart, subAnglesEnd);

const writingContent = `/**
 * Writing Domain AI Service
 * Manages IELTS Task 1 & Task 2 essay evaluation, prompt generation, visual banana diagrams, and thesis statement validation.
 */

import { callGeminiApi, robustJsonParse, calculateLexicalOverlap } from './coreGeminiClient.js';
import { applyCambridgeWritingHardCaps } from '../../utils/ieltsScoringRules.js';
import { ensureTaskIllustration } from '../processMapSvgEngine.js';

${subAnglesSlice}

${evalEssaySlice}

${bananaAndTasksSlice}

${revisionSlice}

${thesisSlice}
`;
fs.writeFileSync(path.join(targetDir, 'writingAiService.js'), writingContent, 'utf8');
console.log('✅ 2. Created writingAiService.js');

// 3. Speaking AI Service
const speakingMicroDrillStart = src.indexOf('export async function evaluateSpeakingMicroDrill');
const speakingMicroDrillEnd = src.indexOf('export const WRITING_SUB_ANGLES =');
const speakingMicroDrillSlice = src.slice(speakingMicroDrillStart, speakingMicroDrillEnd);

const speakingExamStart = src.indexOf('export async function evaluateSpeakingMockExam');
const speakingExamEnd = src.indexOf('export function validateThesisAlgorithmically');
const speakingExamSlice = src.slice(speakingExamStart, speakingExamEnd);

const speakingContent = `/**
 * Speaking Domain AI Service
 * Handles full 3-part Speaking mock examinations, practice reflex drills, examiner branching, and audio transcription.
 */

import { callGeminiApi, robustJsonParse } from './coreGeminiClient.js';
import { 
  evaluateSpeakingAlgorithmically, 
  evaluateSinglePracticeAnswerAlgorithmically 
} from '../algorithmicSpeakingService.js';

${speakingMicroDrillSlice}

${speakingExamSlice}
`;
fs.writeFileSync(path.join(targetDir, 'speakingAiService.js'), speakingContent, 'utf8');
console.log('✅ 3. Created speakingAiService.js');

// 4. Reading & Listening AI Service
const readingListeningStart = src.indexOf('export async function explainReadingQuestion');
const readingListeningEnd = src.indexOf('export async function evaluateSpeakingMockExam');
const readingListeningSlice = src.slice(readingListeningStart, readingListeningEnd);

const readingListeningContent = `/**
 * Reading & Listening Domain AI Service
 * Manages Reading passage generation, article ingestion, word lookup, question explanations,
 * and Listening audio source discovery, diagnostic evaluation, and test generation.
 */

import { callGeminiApi, robustJsonParse } from './coreGeminiClient.js';

${readingListeningSlice}
`;
fs.writeFileSync(path.join(targetDir, 'readingListeningAiService.js'), readingListeningContent, 'utf8');
console.log('✅ 4. Created readingListeningAiService.js');

// 5. Practice & Micro-Drills AI Service
const paraphraseStart = src.indexOf('export async function evaluateParaphrase');
const paraphraseEnd = src.indexOf('export async function evaluateSpeakingMicroDrill');
const paraphraseSlice = src.slice(paraphraseStart, paraphraseEnd);

const spellingGrammarStart = src.indexOf('export async function generateSpellingTrapAi');
const spellingGrammarEnd = src.indexOf('export async function evaluateRevisionComparison');
const spellingGrammarSlice = src.slice(spellingGrammarStart, spellingGrammarEnd);

const practiceContent = `/**
 * Practice & Micro-Drills Domain AI Service
 * Handles sentence paraphrasing, fill-in-blanks drills, spelling traps, grammar exercises, and thematic vocabulary drills.
 */

import { callGeminiApi, robustJsonParse } from './coreGeminiClient.js';

${paraphraseSlice}

${spellingGrammarSlice}
`;
fs.writeFileSync(path.join(targetDir, 'practiceDrillsAiService.js'), practiceContent, 'utf8');
console.log('✅ 5. Created practiceDrillsAiService.js');

// 6. Rewrite geminiService.js as a clean Facade
const facadeContent = `/**
 * Gemini AI Facade Layer (Backward Compatibility Adapter)
 * Re-exports all domain AI services to preserve existing import contracts across the entire platform.
 */

export * from './ai/coreGeminiClient.js';
export * from './ai/writingAiService.js';
export * from './ai/speakingAiService.js';
export * from './ai/readingListeningAiService.js';
export * from './ai/practiceDrillsAiService.js';
`;
fs.writeFileSync(originalPath, facadeContent, 'utf8');
console.log('✅ 6. Updated geminiService.js as clean Facade (~15 lines)');
