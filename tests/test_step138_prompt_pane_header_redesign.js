/**
 * tests/test_step138_prompt_pane_header_redesign.js
 * 
 * Verifies Step 138: PromptPane Header Redesign
 * - Unified Card Layout (zero floating fragmented bars)
 * - Single StarRatingWidget (no duplicate rating stars)
 * - Safe whitespace-nowrap on Mastered toggle (no broken 'Đánh dấu thuộc' line-breaks)
 * - Polished task type formatting (formatTaskType)
 * - Clean handbook and task bank button styling
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- Step 138: PromptPane Header Redesign & Decluttering Audit ---');

const promptPanePath = path.resolve('src/components/PromptPane.jsx');
assert(fs.existsSync(promptPanePath), 'src/components/PromptPane.jsx must exist');
const promptSource = fs.readFileSync(promptPanePath, 'utf-8');

// Test 1: Verify unified card header container
console.log('Test 1: Verifying unified card header container');
assert(promptSource.includes('Redesigned Unified Task Header Card'), 'PromptPane must contain redesigned task header card');
assert(promptSource.includes('rounded-2xl border border-slate-200/90 shadow-2xs'), 'PromptPane must use unified rounded card');
console.log('  ✓ Unified card container verified');

// Test 2: Verify single StarRatingWidget (no duplicates)
console.log('Test 2: Verifying StarRatingWidget is rendered once without duplication');
const matches = promptSource.match(/<StarRatingWidget/g) || [];
assert.strictEqual(matches.length, 1, 'StarRatingWidget must only appear once in PromptPane');
console.log('  ✓ StarRatingWidget rendered exactly once (no duplicate)');

// Test 3: Verify whitespace-nowrap and clean mastered toggle
console.log('Test 3: Verifying whitespace-nowrap and mastered toggle');
assert(promptSource.includes('whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold'), 'Mastered toggle button must enforce whitespace-nowrap');
assert(promptSource.includes('<span className="whitespace-nowrap">{isMastered'), 'Mastered label span must enforce whitespace-nowrap');
console.log('  ✓ whitespace-nowrap verified on mastered button');

// Test 4: Verify formatTaskType helper
console.log('Test 4: Verifying formatTaskType helper');
assert(promptSource.includes('formatTaskType(task.type, task.taskNumber, isEn)'), 'PromptPane must use formatTaskType helper');
assert(promptSource.includes('Two-part Question'), 'formatTaskType must format two-part question cleanly');
assert(promptSource.includes('Line Graph'), 'formatTaskType must format line graph cleanly');
console.log('  ✓ formatTaskType helper verified');

// Test 5: Verify targets and handbook integration
console.log('Test 5: Verifying targets and handbook integration');
assert(promptSource.includes('<Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />'), 'PromptPane must render Clock icon for time limit');
assert(promptSource.includes('<Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />'), 'PromptPane must render Target icon for word limit');
assert(promptSource.includes('getTheoryContext'), 'PromptPane must support getTheoryContext');
assert(promptSource.includes('openTheoryModalWithContext'), 'PromptPane must support openTheoryModalWithContext');
console.log('  ✓ Targets, time limit and handbook integration verified');

console.log('\n🎉 ALL STEP 138 PROMPT PANE HEADER REDESIGN CHECKS PASSED CLEANLY!\n');
