import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Testing Step 35: Comprehensive Mobile UI/UX Verification ---');

// 1. TimerBar Mobile Optimization
console.log('Test 1: Verifying TimerBar mobile ergonomics and button labels');
const timerPath = path.join(__dirname, '../src/components/TimerBar.jsx');
const timerSource = fs.readFileSync(timerPath, 'utf8');

assert(timerSource.includes('min-h-[40px]'), 'TimerBar submit buttons must have min 40px touch target');
assert(timerSource.includes('<span className="sm:hidden">Chấm Máy</span>'), 'TimerBar must have compact "Chấm Máy" for mobile');
assert(timerSource.includes('<span className="sm:hidden">Chấm AI</span>'), 'TimerBar must have compact "Chấm AI" for mobile');
assert(!timerSource.includes('<span>⚡ Chấm Bằng Máy</span>'), 'TimerBar must not have redundant emoji in text span');

// 2. WritingSubHeaderToolbar Overflow Safety
console.log('Test 2: Verifying WritingSubHeaderToolbar scroll resilience on mobile');
const toolbarPath = path.join(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');

assert(toolbarSource.includes('overflow-x-auto no-scrollbar py-0.5'), 'Toolbar Zone 1 & 2 must support safe horizontal swipe on narrow phones');

// 3. FeedbackModal Header Action Row
console.log('Test 3: Verifying FeedbackModal header actions fit phone screens without cut-offs');
const feedbackPath = path.join(__dirname, '../src/components/FeedbackModal.jsx');
const feedbackSource = fs.readFileSync(feedbackPath, 'utf8');

assert(feedbackSource.includes('overflow-x-auto no-scrollbar'), 'FeedbackModal actions row must be scrollable on mobile');
assert(feedbackSource.includes('Chấm Lại AI'), 'FeedbackModal must provide compact "Chấm Lại AI" label for mobile viewports');

// 4. VocabNotebookModal & MistakeLogModal
console.log('Test 4: Verifying VocabNotebookModal and MistakeLogModal mobile headers and touch targets');
const vocabPath = path.join(__dirname, '../src/components/VocabNotebookModal.jsx');
const vocabSource = fs.readFileSync(vocabPath, 'utf8');
assert(vocabSource.includes('overflow-x-auto no-scrollbar'), 'Vocab tabs must be horizontally scrollable on mobile');
assert(vocabSource.includes('min-w-[40px] min-h-[40px]'), 'VocabModal close button must have 40px touch target');

const mistakePath = path.join(__dirname, '../src/components/MistakeLogModal.jsx');
const mistakeSource = fs.readFileSync(mistakePath, 'utf8');
assert(mistakeSource.includes('min-w-[40px] min-h-[40px]'), 'MistakeLogModal close button must have 40px touch target');

// 5. TheoryHandbookModal & DailyErrorPrescriptionModal
console.log('Test 5: Verifying TheoryHandbookModal and DailyErrorPrescriptionModal mobile touch targets');
const theoryPath = path.join(__dirname, '../src/components/TheoryHandbookModal.jsx');
const theorySource = fs.readFileSync(theoryPath, 'utf8');
assert(theorySource.includes('min-w-[40px] min-h-[40px]'), 'TheoryHandbookModal close button must have 40px touch target');

const rxPath = path.join(__dirname, '../src/components/DailyErrorPrescriptionModal.jsx');
const rxSource = fs.readFileSync(rxPath, 'utf8');
assert(rxSource.includes('min-w-[40px] min-h-[40px]'), 'DailyErrorPrescriptionModal close button must have 40px touch target');

// 6. PromptPane Image Zoom Modal
console.log('Test 6: Verifying PromptPane image zoom modal close target');
const promptPath = path.join(__dirname, '../src/components/PromptPane.jsx');
const promptSource = fs.readFileSync(promptPath, 'utf8');
assert(promptSource.includes('min-w-[40px] min-h-[40px]'), 'PromptPane image zoom close button must have 40px touch target');

console.log('Passed: 6/6 tests in Step 35');
console.log('✅ ALL TEST STEP 35 CHECKS PASSED SUCCESSFULLY!');
