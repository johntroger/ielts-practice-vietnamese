/**
 * test_step42_speaking_audio_stt_accuracy.js
 * Verification for Client-Side Speaking Recording & Transcript Accuracy Enhancements
 * 100% Offline & Deterministic
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Client-Side Speaking Recording & Transcript Accuracy Enhancements...');

// 1. Test sanitizeSpeakingTranscript logic
import { sanitizeSpeakingTranscript } from '../src/hooks/useSpeechEngine.js';

let passed = 0;

// Test 1: Capitalize isolated 'i' and standard contractions
const test1 = sanitizeSpeakingTranscript("i think i'm ready and i've done my best");
assert.strictEqual(test1, "I think I'm ready and I've done my best", 'Should capitalize pronouns and contractions');
passed++;

// Test 2: Fix phonetic misinterpretations common in Vietnamese English speech
const test2 = sanitizeSpeakingTranscript("now a days many young people are kin on playing sports for sample soccer");
assert.strictEqual(test2, "Nowadays many young people are keen on playing sports for example soccer", 'Should fix IELTS phonetic misinterpretations');
passed++;

// Test 3: Fix discourse markers
const test3 = sanitizeSpeakingTranscript("in my opinions on the other hands first of alls we should consider it");
assert.strictEqual(test3, "In my opinion on the other hand first of all we should consider it", 'Should fix common collocation plurals');
passed++;

// Test 4: Sentence start capitalization
const test4 = sanitizeSpeakingTranscript("i love reading. it expands my knowledge! books are great.");
assert.strictEqual(test4, "I love reading. It expands my knowledge! Books are great.", 'Should capitalize starts of sentences');
passed++;

// 2. Test code patterns in useSpeechEngine.js
const speechEnginePath = path.join(__dirname, '../src/hooks/useSpeechEngine.js');
const speechEngineCode = fs.readFileSync(speechEnginePath, 'utf8');

// Test 5: Verify mono 48kHz and 16-bit constraints
assert.ok(speechEngineCode.includes('channelCount: 1'), 'useSpeechEngine must specify mono audio (channelCount: 1)');
assert.ok(speechEngineCode.includes('sampleRate: 48000'), 'useSpeechEngine must specify studio sampleRate: 48000');
passed++;

// Test 6: Verify 128kbps MediaRecorder Opus bitrate
assert.ok(speechEngineCode.includes('audioBitsPerSecond: 128000'), 'MediaRecorder must specify 128000 bps for studio Opus quality');
passed++;

// Test 7: Verify interim buffer flush on stopListening
assert.ok(speechEngineCode.includes('interimTranscriptRef.current'), 'useSpeechEngine must track interim transcript in a ref');
assert.ok(speechEngineCode.includes('FLUSH INTERIM BUFFER'), 'stopListening must flush interim buffer to prevent dropped ending words');
passed++;

// 3. Test code patterns in SpeakingPracticePane.jsx
const practicePanePath = path.join(__dirname, '../src/components/speaking/SpeakingPracticePane.jsx');
const practicePaneCode = fs.readFileSync(practicePanePath, 'utf8');

// Test 8: Verify manual inline quick edit feature exists
assert.ok(practicePaneCode.includes('editingTranscriptKey'), 'SpeakingPracticePane must track editingTranscriptKey state');
assert.ok(practicePaneCode.includes('Sửa Lời Thoại') || practicePaneCode.includes('Chỉnh Sửa'), 'SpeakingPracticePane must provide inline transcript editing');
assert.ok(practicePaneCode.includes('setCustomTranscript'), 'SpeakingPracticePane must commit manual transcript changes via setCustomTranscript');
passed++;

console.log(`All ${passed}/${passed} unit tests passed cleanly for Step 42!`);
