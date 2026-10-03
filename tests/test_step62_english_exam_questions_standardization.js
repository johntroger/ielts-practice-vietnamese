/**
 * Test Step 62: Authentic English Exam Questions & Practice Prompts Standardization (Bước 2)
 * 
 * Verifies:
 * 1. ListeningQuestionPane.jsx standardizes all exam question labels, blank prompts, option boxes, and placeholders to 100% English.
 * 2. ListeningQuestionPane.jsx word limit rules and live warnings use standard English.
 * 3. QuestionPane.jsx (Reading) standardizes all multi-select prompts, summary context headers, word bank labels, and placeholders to 100% English.
 * 4. speakingMicroDrills.js ensures all practice situations, task prompts, A.R.E.A guidance, and debate perspectives are 100% English.
 * 5. MicroDrillsModal.jsx renders exam question headers and selection options in English.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 62: English Exam Questions & Prompts Test Suite...');

// 1. Verify ListeningQuestionPane.jsx
const listeningFile = path.resolve(__dirname, '../src/components/listening/ListeningQuestionPane.jsx');
assert(fs.existsSync(listeningFile), 'ListeningQuestionPane.jsx must exist');
const listeningCode = fs.readFileSync(listeningFile, 'utf8');

assert(!listeningCode.includes('Điền vào chỗ trống'), 'ListeningQuestionPane must NOT contain "Điền vào chỗ trống"');
assert(listeningCode.includes('Complete the note / blank'), 'ListeningQuestionPane must contain "Complete the note / blank"');

assert(!listeningCode.includes('Lựa chọn (Chọn tối đa'), 'ListeningQuestionPane must NOT contain "Lựa chọn (Chọn tối đa"');
assert(listeningCode.includes('Options (Choose up to'), 'ListeningQuestionPane must contain "Options (Choose up to"');

assert(!listeningCode.includes('Danh Sách Lựa Chọn (Options Box):'), 'ListeningQuestionPane must NOT contain Vietnamese options box header');
assert(listeningCode.includes('List of Options (Options Box):'), 'ListeningQuestionPane must contain "List of Options (Options Box):"');

assert(listeningCode.includes('-- Select A–'), 'ListeningQuestionPane must contain "-- Select A–"');
assert(listeningCode.includes('Step {idx + 1} (Question {q.order})'), 'ListeningQuestionPane must format steps in English');

assert(listeningCode.includes('placeholder="Type your answer..."'), 'ListeningQuestionPane must have English table answer placeholder');
assert(listeningCode.includes('placeholder="Type your short answer..."'), 'ListeningQuestionPane must have English short answer placeholder');

assert(listeningCode.includes("NO MORE THAN ONE WORD"), 'parseWordLimit must return standard English limit text');
assert(listeningCode.includes("Typed ${words.length} words"), 'Word limit warning must be in English');
console.log('  ✅ 1. ListeningQuestionPane standardizes 100% exam question labels and prompts to English');

// 2. Verify QuestionPane.jsx (Reading)
const readingFile = path.resolve(__dirname, '../src/components/reading/QuestionPane.jsx');
assert(fs.existsSync(readingFile), 'QuestionPane.jsx must exist');
const readingCode = fs.readFileSync(readingFile, 'utf8');

assert(!readingCode.includes('Đoạn tóm tắt (Summary Context):'), 'QuestionPane must NOT contain Vietnamese summary context header');
assert(readingCode.includes('Summary Context:'), 'QuestionPane must contain "Summary Context:"');

assert(!readingCode.includes('Hộp Từ Vựng Tham Khảo:'), 'QuestionPane must NOT contain "Hộp Từ Vựng Tham Khảo:"');
assert(readingCode.includes('Word Bank / Reference Options:'), 'QuestionPane must contain "Word Bank / Reference Options:"');

assert(readingCode.includes('Choose {q.maxSelect || 2} options. Selected:'), 'QuestionPane must use English multi-select status');
assert(readingCode.includes('placeholder={group.wordBank ? "Enter letter (e.g. A, B...)" : "Type your answer..."}'), 'QuestionPane must use English completion placeholder');
assert(readingCode.includes('List of Headings:'), 'QuestionPane must contain "List of Headings:"');
console.log('  ✅ 2. QuestionPane standardizes 100% exam question labels and context to English');

// 3. Verify speakingMicroDrills.js
const drillsFile = path.resolve(__dirname, '../src/data/speakingMicroDrills.js');
assert(fs.existsSync(drillsFile), 'speakingMicroDrills.js must exist');
const drillsCode = fs.readFileSync(drillsFile, 'utf8');

const drillLines = drillsCode.split('\n');
const viPromptErrors = [];
drillLines.forEach((line, idx) => {
  if (/(prompt|situation|taskPrompt|perspective):/.test(line) && /[\u00C0-\u1EF9]/.test(line)) {
    viPromptErrors.push(`Line ${idx + 1}: ${line.trim()}`);
  }
});
assert.strictEqual(viPromptErrors.length, 0, `speakingMicroDrills.js must not contain Vietnamese in prompts/situations:\n${viPromptErrors.join('\n')}`);
console.log('  ✅ 3. speakingMicroDrills.js has 0 Vietnamese prompts, situations, or perspectives');

// 4. Verify MicroDrillsModal.jsx
const microDrillModalFile = path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx');
assert(fs.existsSync(microDrillModalFile), 'MicroDrillsModal.jsx must exist');
const modalCode = fs.readFileSync(microDrillModalFile, 'utf8');

assert(modalCode.includes('Your Selection:'), 'MicroDrillsModal must contain English "Your Selection:" label');
assert(modalCode.includes('1. Exam Question:'), 'MicroDrillsModal must contain English "1. Exam Question:" label');
assert(modalCode.includes('2. Passage Excerpt:'), 'MicroDrillsModal must contain English "2. Passage Excerpt:" label');
console.log('  ✅ 4. MicroDrillsModal renders exam questions and interactive controls in English');

console.log('🎉 Step 62: All tests passed successfully!');
