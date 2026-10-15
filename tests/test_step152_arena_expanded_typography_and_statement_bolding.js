/**
 * tests/test_step150_arena_expanded_typography_and_statement_bolding.js
 * 
 * Verifies:
 * 1. Expanded Widescreen Viewport (max-w-2xl sm:max-w-3xl lg:max-w-5xl) in AtlasEnglishArenaModal & ArenaQuestionCard.
 * 2. Scaled up typography across prompts, options, badges, input boxes, and buttons.
 * 3. Distinct bold & highlighted statement formatting (renderPromptWithFormattedStatement & renderFormattedContext).
 * 4. Distinct category pill rendering for vocab questions and dedicated statement evaluation card for Reading TFNG.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('\n--- Running Step 152: Expanded Viewport, Typography & Statement Bolding Tests ---');

// 1. Container width expansion
it('1. AtlasEnglishArenaModal & ArenaQuestionCard expand question width to max-w-5xl', () => {
  const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');

  assert.ok(modalCode.includes('max-w-2xl sm:max-w-3xl lg:max-w-5xl'), 'AtlasEnglishArenaModal must use responsive max-w-5xl container');
  assert.ok(cardCode.includes('max-w-2xl sm:max-w-3xl lg:max-w-5xl'), 'ArenaQuestionCard must use responsive max-w-5xl container');
});

// 2. Main prompt enlarged typography and statement bolding helper
it('2. ArenaQuestionCard formats quoted statements in bold high-contrast styling', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');

  assert.ok(cardCode.includes('renderPromptWithFormattedStatement'), 'Must declare renderPromptWithFormattedStatement helper');
  assert.ok(cardCode.includes('font-black text-amber-200 bg-amber-950/70 border-2 border-amber-500/60'), 'Must bold statement with amber border and highlight');
  assert.ok(cardCode.includes('text-xl sm:text-2xl md:text-[27px]'), 'Must scale prompt typography to 20-27px font size');
});

// 3. Reading TFNG context splits passage and renders dedicated bold Statement Box
it('3. ArenaQuestionCard extracts and bolds TFNG statements in dedicated evaluation card', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');

  assert.ok(cardCode.includes('statementMatch'), 'Must extract statement from activeContext');
  assert.ok(cardCode.includes('Statement to Evaluate (In Đậm)'), 'Must render dedicated Statement to Evaluate card in English');
  assert.ok(cardCode.includes('Nhận Định Cần Đánh Giá (Statement - In Đậm)'), 'Must render dedicated Statement card in Vietnamese');
  assert.ok(cardCode.includes('text-lg sm:text-xl md:text-2xl font-black text-amber-100'), 'Must format statement text with 18-24px font-black weight');
});

// 4. Vocab questions format Category metadata as elegant domain pills
it('4. ArenaQuestionCard formats Category: metadata into domain badge instead of plain text card', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');

  assert.ok(cardCode.includes('Category / Domain:'), 'Must label category domain in English');
  assert.ok(cardCode.includes('Chủ đề từ vựng:'), 'Must label category domain in Vietnamese');
  assert.ok(cardCode.includes('text-indigo-300 bg-indigo-950/50 border border-indigo-700/50'), 'Must style category badge cleanly');
});

// 5. Option cards have enlarged typography, larger badges, and generous padding
it('5. ArenaQuestionCard options scale to text-base/lg/xl, larger 1-4 badges, and rounded-2xl padding', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');

  assert.ok(cardCode.includes('text-base sm:text-lg md:text-xl font-semibold'), 'Options must use text-base sm:text-lg md:text-xl typography');
  assert.ok(cardCode.includes('w-8 h-8 sm:w-9 sm:h-9 rounded-xl'), 'Option number badges must scale to w-8/w-9 with rounded-xl');
  assert.ok(cardCode.includes('p-4 sm:p-5 rounded-2xl'), 'Option buttons must have p-4 sm:p-5 rounded-2xl padding');
});

// 6. Action buttons scale up for comfortable thumb tapping
it('6. Bottom action buttons (Check, Skip, Next) have larger text and prominent padding', () => {
  const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');

  assert.ok(cardCode.includes('py-3 sm:py-3.5'), 'Action buttons must have py-3 sm:py-3.5 padding');
  assert.ok(cardCode.includes('text-sm sm:text-base font-bold'), 'Check Answer button must have text-sm sm:text-base font-bold');
});

// 7. ArenaTextInputCard scales input text to 18-24px with larger padding
it('7. ArenaTextInputCard uses enlarged input typography and diff display', () => {
  const inputCode = fs.readFileSync(path.resolve('src/components/arena/ArenaTextInputCard.jsx'), 'utf-8');

  assert.ok(inputCode.includes('text-lg sm:text-xl md:text-2xl font-mono font-bold'), 'Text input must scale to text-lg sm:text-xl md:text-2xl');
  assert.ok(inputCode.includes('py-4 sm:py-5 rounded-2xl'), 'Input container must use py-4 sm:py-5 rounded-2xl padding');
  assert.ok(inputCode.includes('text-base sm:text-lg tracking-wider'), 'Diff viewer must use text-base sm:text-lg');
});

console.log(`\nStep 150 Suite Passed: ${passedTests}/${totalTests} tests successful (100%).\n`);
