import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { analyzeFillerWords } from '../src/services/speakingFluencyService.js';
import { FEATURE_REGISTRY } from '../src/core/featureRegistry.js';

console.log('🧪 Testing Step 27: Speaking Fluency Filler Words Tracker & Audio Visualizer');

// 1. Test Clean Transcript (Zero filler words)
const cleanTranscript = 'I firmly believe that international cultural exchange promotes mutual understanding and global peace among nations.';
const cleanAnalysis = analyzeFillerWords(cleanTranscript, 45);

assert.equal(cleanAnalysis.totalFillers, 0, 'Clean speech should have 0 fillers');
assert.equal(cleanAnalysis.status, 'clean', 'Status must be clean');
assert.equal(cleanAnalysis.warningMessage, null, 'No warning message for clean speech');
console.log('  ✅ 1. analyzeFillerWords gives clean status for fluent speech with 0 fillers');

// 2. Test Filler Detection & Breakdown
const fillerTranscript = 'Well um, I think that, like, many young people, you know, spend too much time on their phones, sort of forgetting real life.';
const fillerAnalysis = analyzeFillerWords(fillerTranscript, 30);

assert.ok(fillerAnalysis.totalFillers >= 4, `Should detect at least 4 filler words (detected ${fillerAnalysis.totalFillers})`);
assert.ok(fillerAnalysis.fillerBreakdown['um'] >= 1, 'Should detect "um" in breakdown');
assert.ok(fillerAnalysis.fillerBreakdown['like'] >= 1, 'Should detect "like" in breakdown');
assert.ok(fillerAnalysis.fillerBreakdown['you know'] >= 1, 'Should detect "you know" in breakdown');
assert.ok(fillerAnalysis.fillerBreakdown['sort of'] >= 1, 'Should detect "sort of" in breakdown');
console.log('  ✅ 2. analyzeFillerWords correctly extracts and categorizes individual filler words in breakdown');

// 3. Test High Frequency Warning (> 5 fillers/min)
const heavyFillerTranscript = 'Um, I like, you know, actually think that, er, studying abroad is, like, very good, basically.';
const heavyAnalysis = analyzeFillerWords(heavyFillerTranscript, 20); // 20 seconds = 0.33 min

assert.ok(heavyAnalysis.fillerRatePerMin >= 5.0, `Rate per minute should exceed 5.0 (got ${heavyAnalysis.fillerRatePerMin})`);
assert.equal(heavyAnalysis.status, 'high', 'Status should be high for excessive filler rate');
assert.ok(heavyAnalysis.warningMessage.includes('Band 5.0') || heavyAnalysis.warningMessage.includes('Fluency'), 'Warning message must highlight Fluency penalty');
console.log('  ✅ 3. Excessive filler rate (>5/min) triggers high warning with Cambridge Band 5.0 - 5.5 penalty notice');

// 4. Test Edge Cases (Empty transcript, short duration)
const emptyAnalysis = analyzeFillerWords('', 0);
assert.equal(emptyAnalysis.totalWords, 0, 'Empty transcript yields 0 words');
assert.equal(emptyAnalysis.totalFillers, 0, 'Empty transcript yields 0 fillers');

const nullAnalysis = analyzeFillerWords(null, 60);
assert.equal(nullAnalysis.totalFillers, 0, 'Null transcript handled safely');
console.log('  ✅ 4. Edge cases (empty, null, zero duration) handled safely without exceptions');

// 5. Verify Component Integration in SpeakingPracticePane.jsx
const practicePanePath = path.resolve('src/components/speaking/SpeakingPracticePane.jsx');
const practicePaneCode = fs.readFileSync(practicePanePath, 'utf8');
assert.ok(practicePaneCode.includes("import SpeakingFillerTracker from './SpeakingFillerTracker'"), 'SpeakingPracticePane must import SpeakingFillerTracker');
assert.ok(practicePaneCode.includes('<SpeakingFillerTracker'), 'SpeakingPracticePane must render SpeakingFillerTracker');
console.log('  ✅ 5. SpeakingPracticePane.jsx successfully integrates SpeakingFillerTracker');

// 6. Verify Component Integration in SpeakingExaminerRoom.jsx
const examinerRoomPath = path.resolve('src/components/speaking/SpeakingExaminerRoom.jsx');
const examinerRoomCode = fs.readFileSync(examinerRoomPath, 'utf8');
assert.ok(examinerRoomCode.includes("import SpeakingFillerTracker from './SpeakingFillerTracker'"), 'SpeakingExaminerRoom must import SpeakingFillerTracker');
assert.ok(examinerRoomCode.includes('<SpeakingFillerTracker'), 'SpeakingExaminerRoom must render SpeakingFillerTracker');
console.log('  ✅ 6. SpeakingExaminerRoom.jsx successfully integrates SpeakingFillerTracker');

// 7. Verify Feature Registry Documentation
const registered = FEATURE_REGISTRY.find(f => f.id === 'feat-speaking-filler-tracker');
assert.ok(registered, 'Feature Registry must document feat-speaking-filler-tracker');
assert.equal(registered.category, 'ai_evaluation', 'Registered in valid category');
console.log('  ✅ 7. Feature Registry documents Speaking Fluency Studio for Help Center');

console.log('\n🎉 Step 27: Speaking Fluency Filler Words Tracker & Audio Visualizer tests PASSED 100%!\n');
