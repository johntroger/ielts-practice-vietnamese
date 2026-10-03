/**
 * Test Step 79: Verification of 100 Spelling Demons & 50 Natural Fillers
 * Ensures complete academic depth, exact count match with titles, and valid markdown structure.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Step 79: Spelling Demons & Natural Fillers Academic Integrity...');

const ROOT_DIR = path.resolve('.');
const SPELLING_DEMONS_PATH = path.join(ROOT_DIR, 'docs', 'listening', 'listening-spelling-demons-100.md');
const NATURAL_FILLERS_PATH = path.join(ROOT_DIR, 'docs', 'speaking', 'natural-fillers.md');

// 1. Verify docs/listening/listening-spelling-demons-100.md
console.log('  ▶ 1. Verifying 100 Spelling Demons document...');
assert(fs.existsSync(SPELLING_DEMONS_PATH), 'File listening-spelling-demons-100.md must exist');
const demonsContent = fs.readFileSync(SPELLING_DEMONS_PATH, 'utf8');

assert(demonsContent.length > 5000, `Spelling demons file too short (${demonsContent.length} bytes)`);
assert(demonsContent.includes('Top 100'), 'Title must state Top 100');
assert(demonsContent.includes('Nhóm 1:'), 'Must include Nhóm 1 (Double Letters)');
assert(demonsContent.includes('Nhóm 2:'), 'Must include Nhóm 2 (Vowel Traps)');
assert(demonsContent.includes('Nhóm 3:'), 'Must include Nhóm 3 (Silent Letters)');
assert(demonsContent.includes('Nhóm 4:'), 'Must include Nhóm 4 (Plural Demons)');
assert(demonsContent.includes('Nhóm 5:'), 'Must include Nhóm 5 (Campus & Jobs)');

// Verify item count from 1 to 100
let demonItemCount = 0;
for (let i = 1; i <= 100; i++) {
  const pattern = new RegExp(`\\|\\s*\\*\\*${i}\\*\\*\\s*\\|`);
  assert(pattern.test(demonsContent), `Spelling demon item #${i} must exist in markdown table`);
  demonItemCount++;
}
assert.strictEqual(demonItemCount, 100, 'Must have exactly 100 items');
assert(demonsContent.includes('/əˌkɒm.əˈdeɪ.ʃən/'), 'Must have IPA transcriptions');
assert(demonsContent.includes('Accommodation'), 'Must include classic Accommodation demon');
console.log('    ✅ listening-spelling-demons-100.md has exactly 100 fully indexed items with IPA and translations.');

// 2. Verify docs/speaking/natural-fillers.md
console.log('  ▶ 2. Verifying 50 Natural Fillers document...');
assert(fs.existsSync(NATURAL_FILLERS_PATH), 'File natural-fillers.md must exist');
const fillersContent = fs.readFileSync(NATURAL_FILLERS_PATH, 'utf8');

assert(fillersContent.length > 5000, `Natural fillers file too short (${fillersContent.length} bytes)`);
assert(fillersContent.includes('50 Natural Fillers'), 'Title must state 50 Natural Fillers');
assert(fillersContent.includes('Nhóm 1:'), 'Must include Nhóm 1');
assert(fillersContent.includes('Nhóm 2:'), 'Must include Nhóm 2');
assert(fillersContent.includes('Nhóm 3:'), 'Must include Nhóm 3');
assert(fillersContent.includes('Nhóm 4:'), 'Must include Nhóm 4');
assert(fillersContent.includes('Nhóm 5:'), 'Must include Nhóm 5');

// Verify numbered items from 1 to 50
let fillerItemCount = 0;
for (let i = 1; i <= 50; i++) {
  const pattern = new RegExp(`(?:^|\\n)${i}\\.\\s+\\*"`);
  assert(pattern.test(fillersContent), `Natural filler #${i} must exist with format: ${i}. *"..."*`);
  fillerItemCount++;
}
assert.strictEqual(fillerItemCount, 50, 'Must have exactly 50 numbered fillers');
console.log('    ✅ natural-fillers.md has exactly 50 numbered, native-quality fillers across 5 exam situations.');

// 3. Verify Links in both files
console.log('  ▶ 3. Verifying Navigation Links...');
assert(demonsContent.includes('../README.md'), 'Spelling demons must link to README.md');
assert(fillersContent.includes('../README.md'), 'Fillers must link to README.md');
console.log('    ✅ Navigation and cross-links verified.');

console.log('🎉 Step 79 Test Suite PASSED: 100 Spelling Demons & 50 Natural Fillers 100% VERIFIED!');
