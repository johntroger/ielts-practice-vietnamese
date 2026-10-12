/**
 * tests/test_step125_arena_no_soundcheck_and_hidden_listening_transcript.js
 * 
 * Verifies:
 * 1. AtlasEnglishArenaModal no longer invokes soundcheck voiceover when clicking Start Sprint, Revenge Sprint, or Challenge Sprint.
 * 2. useArenaAudio playChime uses pure harmonic chime playChimeTone instead of speaking soundcheck text.
 * 3. ArenaQuestionCard hides question.context for listening questions while user is answering (!isAnswerChecked).
 * 4. ArenaQuestionCard displays audio transcript alongside explanation only AFTER user checks their answer (isAnswerChecked).
 * 5. Reading TFNG & other non-listening question contexts remain visible before answering.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let passedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('Testing Step 125: Arena No Soundcheck on Start & Hidden Listening Transcript ...');

// 1. Check AtlasEnglishArenaModal does not call playChime in Start, Revenge, or Challenge handlers
runTest('AtlasEnglishArenaModal starts sprints silently without soundcheck chimes', () => {
  const modalPath = path.join(rootDir, 'src/components/arena/AtlasEnglishArenaModal.jsx');
  const code = fs.readFileSync(modalPath, 'utf-8');

  // Find startSprint button onClick handler
  const startBtnMatch = code.match(/onClick=\{\(\)\s*=>\s*\{[\s\S]*?sprint\.startSprint\(null,\s*selectedDifficulty\);/);
  assert(startBtnMatch, 'Start Sprint button handler must be found');
  assert(!startBtnMatch[0].includes('playChime()'), 'Start Sprint button handler must NOT call playChime()');

  // Find revenge button onClick handler
  const revengeBtnMatch = code.match(/onClick=\{\(\)\s*=>\s*\{[\s\S]*?sprint\.startSprint\(revengeQuestions,\s*selectedDifficulty\);/);
  assert(revengeBtnMatch, 'Revenge Sprint button handler must be found');
  assert(!revengeBtnMatch[0].includes('playChime()'), 'Revenge Sprint button handler must NOT call playChime()');

  // Find challenge sprint handler
  const challengeMatch = code.match(/onChallengeSprint=\{\(\)\s*=>\s*\{[\s\S]*?sprint\.startSprint\(\);/);
  assert(challengeMatch, 'Challenge Sprint handler must be found');
  assert(!challengeMatch[0].includes('playChime()'), 'Challenge Sprint handler must NOT call playChime()');
});

// 2. Check useArenaAudio and audioHelper playChimeTone
runTest('audioHelper and useArenaAudio use pure musical tone without soundcheck speech for playChime', () => {
  const audioHelperPath = path.join(rootDir, 'src/utils/audioHelper.js');
  const audioHelperCode = fs.readFileSync(audioHelperPath, 'utf-8');
  assert(audioHelperCode.includes('export function playChimeTone'), 'audioHelper must export playChimeTone');

  const useArenaAudioPath = path.join(rootDir, 'src/hooks/useArenaAudio.js');
  const useArenaAudioCode = fs.readFileSync(useArenaAudioPath, 'utf-8');
  assert(useArenaAudioCode.includes('playChimeTone'), 'useArenaAudio must import and use playChimeTone');
  assert(!useArenaAudioCode.includes('playSoundcheck(callbacks)'), 'useArenaAudio playChime must NOT call playSoundcheck');
});

// 3. Check ArenaQuestionCard hides transcript when answering listening questions
runTest('ArenaQuestionCard hides context for listening questions during answering phase', () => {
  const cardPath = path.join(rootDir, 'src/components/arena/ArenaQuestionCard.jsx');
  const cardCode = fs.readFileSync(cardPath, 'utf-8');

  // Check isListening definition
  assert(cardCode.includes("const isListening = question.skillCategory === 'listening'"), 'Must define isListening condition');

  // Context snippet must NOT be rendered if isListening
  assert(cardCode.includes('{question.context && !isListening && ('), 'question.context must only render when !isListening during question display');

  // Must provide audio prompt banner for listening questions
  assert(cardCode.includes('{isListening && !isAnswerChecked && ('), 'Must render listening guidance banner while answering');
});

// 4. Check ArenaQuestionCard reveals audio transcript in explanation box
runTest('ArenaQuestionCard reveals audio transcript in review explanation box after check', () => {
  const cardPath = path.join(rootDir, 'src/components/arena/ArenaQuestionCard.jsx');
  const cardCode = fs.readFileSync(cardPath, 'utf-8');

  // Inside explanation box: reveals transcript
  assert(cardCode.includes('{isListening && (question.context || question.audioText) && ('), 'Must show audio transcript when answer checked and isListening');
  assert(cardCode.includes('Audio Transcript:'), 'Must label transcript clearly as Audio Transcript');
});

// 5. Verify Reading & Vocab contexts remain intact
runTest('Non-listening questions (reading, vocab) retain visible context for answering', () => {
  const cardPath = path.join(rootDir, 'src/components/arena/ArenaQuestionCard.jsx');
  const cardCode = fs.readFileSync(cardPath, 'utf-8');

  // Non-listening: question.context is displayed when !isListening
  const nonListeningContextCondition = cardCode.includes('question.context && !isListening');
  assert(nonListeningContextCondition, 'Non-listening questions must still render question.context');
});

console.log(`\nAll ${passedTests}/${passedTests} checks passed successfully!`);
