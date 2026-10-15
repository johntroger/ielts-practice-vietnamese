/**
 * test_step157_dictation_word_diff_and_visual_breakdown.js
 * Verification suite for Step 157:
 * Word-by-Word Alignment & Color-Accurate Visual Breakdown for Listening 3-Tier Sentence Dictation.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeWord, computeDictationDiff } from '../src/utils/dictationDiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 157: Dictation Word Diff & Visual Breakdown Verification Tests...\n');

let passedTests = 0;

// Test 1: normalizeWord fairness rules
console.log('Test 1: normalizeWord handles punctuation, capitalization, and contractions...');
assert.strictEqual(normalizeWord('If'), 'if', 'Should lowercase');
assert.strictEqual(normalizeWord('card,'), 'card', 'Should strip trailing comma');
assert.strictEqual(normalizeWord('receptionist.'), 'receptionist', 'Should strip trailing period');
assert.strictEqual(normalizeWord('"hello"'), 'hello', 'Should strip quotes');
assert.strictEqual(normalizeWord('(annual)'), 'annual', 'Should strip brackets');
assert.strictEqual(normalizeWord("don't"), 'dont', 'Should strip apostrophe for fair keyboard matching');
assert.strictEqual(normalizeWord('dont'), 'dont', 'Contraction without apostrophe matches normalized');
assert.strictEqual(normalizeWord("don't"), normalizeWord('dont'), 'don\'t and dont should match');
passedTests++;
console.log('  ✓ normalizeWord handles all Cambridge punctuation edge cases\n');

// Test 2: Perfect match
console.log('Test 2: computeDictationDiff on exact matching sentences...');
const target1 = 'If you want to renew your membership card, please fill in this form and hand it to the receptionist.';
const user1 = 'If you want to renew your membership card, please fill in this form and hand it to the receptionist.';
const res1 = computeDictationDiff(target1, user1);
assert.strictEqual(res1.accuracy, 100, 'Accuracy should be 100%');
assert.strictEqual(res1.isExactMatch, true, 'isExactMatch should be true');
assert.strictEqual(res1.correctCount, 19, 'All 19 words matched');
assert.ok(res1.targetDiff.every(t => t.type === 'correct'), 'All target tokens marked correct');
assert.ok(res1.userDiff.every(u => u.type === 'correct'), 'All user tokens marked correct');
passedTests++;
console.log('  ✓ 100% match accurately identified and tagged\n');

// Test 3: Cambridge IELTS case and punctuation tolerance
console.log('Test 3: Case insensitivity and punctuation tolerance...');
const userPunct = 'if you want to renew your membership card please fill in this form and hand it to the receptionist';
const resPunct = computeDictationDiff(target1, userPunct);
assert.strictEqual(resPunct.accuracy, 100, 'Should be 100% despite lowercase and missing commas/periods');
assert.strictEqual(resPunct.correctCount, 19, 'All 19 words matched');
passedTests++;
console.log('  ✓ Case and punctuation tolerance verified\n');

// Test 4: Word substitution / misspelling from user screenshot
console.log('Test 4: User screenshot test case (typed "in" instead of "to")...');
const userSub = 'if you want to renew your membership card, please fill in this form and hand it in the receptionist';
const resSub = computeDictationDiff(target1, userSub);
assert.strictEqual(resSub.correctCount, 18, '18 out of 19 words correct');
assert.strictEqual(resSub.accuracy, 95, 'Accuracy is 95%');
assert.strictEqual(resSub.isExactMatch, false, 'isExactMatch is false');

// In target: "to" is missed
const targetTo = resSub.targetDiff.find(t => t.text === 'to' && t.type === 'missed');
assert.ok(targetTo, 'Target sentence marks "to" as missed');

// In user: "in" is extra
const userInExtra = resSub.userDiff.find(u => u.text === 'in' && u.type === 'extra');
assert.ok(userInExtra, 'User transcript marks substituted "in" as extra');

// In user: "to" is marked as omission
const userToOmission = resSub.userDiff.find(u => u.text === 'to' && u.type === 'omission');
assert.ok(userToOmission, 'User transcript marks omitted "to" at appropriate position');
passedTests++;
console.log('  ✓ Substituted words and omissions cleanly detected and separated\n');

// Test 5: Pure omission
console.log('Test 5: Pure omission (user omitted "back")...');
const targetOmission = 'Please call us back tomorrow morning.';
const userOmission = 'Please call us tomorrow morning.';
const resOmission = computeDictationDiff(targetOmission, userOmission);
assert.strictEqual(resOmission.correctCount, 5, '5 out of 6 words matched');
assert.strictEqual(resOmission.totalCount, 6, 'Total 6 target words');
const missedBack = resOmission.targetDiff.find(t => t.text === 'back' && t.type === 'missed');
assert.ok(missedBack, 'Target marks "back" as missed');
const omissionBack = resOmission.userDiff.find(u => u.text === 'back' && u.type === 'omission');
assert.ok(omissionBack, 'User diff includes omission indicator for "back"');
passedTests++;
console.log('  ✓ Pure word omission properly highlighted\n');

// Test 6: Empty user transcript
console.log('Test 6: Empty user transcript handling...');
const resEmpty = computeDictationDiff(target1, '');
assert.strictEqual(resEmpty.accuracy, 0, 'Accuracy should be 0% for empty input');
assert.strictEqual(resEmpty.correctCount, 0, '0 words matched');
assert.ok(resEmpty.targetDiff.every(t => t.type === 'missed'), 'All target tokens marked missed');
passedTests++;
console.log('  ✓ Empty transcript safely handled without errors\n');

// Test 7: ListeningDrillRoom.jsx code integrity check
console.log('Test 7: ListeningDrillRoom.jsx rendering & color consistency audit...');
const drillRoomPath = path.resolve(__dirname, '../src/components/drills/ListeningDrillRoom.jsx');
const drillRoomSrc = fs.readFileSync(drillRoomPath, 'utf-8');

assert.ok(drillRoomSrc.includes("import { computeDictationDiff } from '../../utils/dictationDiff';"), 'ListeningDrillRoom imports computeDictationDiff');
assert.ok(drillRoomSrc.includes('const dictationDiff = useMemo('), 'ListeningDrillRoom computes dictationDiff with useMemo');
assert.ok(drillRoomSrc.includes('text-emerald-700'), 'Legend and correct words use matching emerald green');
assert.ok(drillRoomSrc.includes('text-rose-700'), 'Legend uses matching rose red');
assert.ok(drillRoomSrc.includes('text-sky-700'), 'Legend uses matching sky blue for missed words');
assert.ok(drillRoomSrc.includes('dictationDiff.targetDiff.map('), 'Target sentence renders token-by-token diff');
assert.ok(drillRoomSrc.includes('dictationDiff?.userDiff.map('), 'User transcript renders token-by-token diff with omission badges');
assert.ok(drillRoomSrc.includes('line-through decoration-rose-500'), 'Misspelled/extra words are strikethrough with rose decoration');
passedTests++;
console.log('  ✓ ListeningDrillRoom.jsx color consistency and token rendering verified\n');

console.log('===============================================================');
console.log(`🎉 ALL ${passedTests}/${passedTests} STEP 157 UNIT TESTS PASSED! (100%)`);
console.log('===============================================================\n');
