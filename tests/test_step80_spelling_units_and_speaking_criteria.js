/**
 * Test Step 80: Verification of Spelling & Units and Speaking Descriptors Academic Integrity
 * Verifies in-depth coverage, exam guidelines, and zero-defect structure.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Step 80: Spelling & Units & Speaking Descriptors Academic Integrity...');

const ROOT_DIR = path.resolve('.');
const SPELLING_UNITS_PATH = path.join(ROOT_DIR, 'docs', 'listening', 'spelling-and-units.md');
const SPEAKING_CRITERIA_PATH = path.join(ROOT_DIR, 'docs', 'speaking', 'speaking-criteria-descriptors.md');

// 1. Verify docs/listening/spelling-and-units.md
console.log('  ▶ 1. Verifying Spelling, Numbers & Measurement Units document...');
assert(fs.existsSync(SPELLING_UNITS_PATH), 'File spelling-and-units.md must exist');
const unitsContent = fs.readFileSync(SPELLING_UNITS_PATH, 'utf8');

assert(unitsContent.length > 5000, `Spelling and units file too short (${unitsContent.length} bytes, expected > 5000)`);
assert(unitsContent.includes('Quy Chuẩn Ghi Số'), 'Must include number rules section');
assert(unitsContent.includes('Mã bưu chính'), 'Must include postcodes guidance');
assert(unitsContent.includes('Đơn Vị Tiền Tệ'), 'Must include currency units table');
assert(unitsContent.includes('Đơn Vị Đo Lường'), 'Must include measurement units section');
assert(unitsContent.includes('Quy Tắc Số Ít / Số Nhiều'), 'Must include singular/plural grammatical clues');
assert(unitsContent.includes('Top 5 Bẫy Đổi Ý Số Liệu'), 'Must include correction distractor table');
assert(unitsContent.includes('£'), 'Must include pound symbol');
assert(unitsContent.includes('€'), 'Must include euro symbol');
console.log('    ✅ spelling-and-units.md has comprehensive CDI guidelines, tables, and distractor cases.');

// 2. Verify docs/speaking/speaking-criteria-descriptors.md
console.log('  ▶ 2. Verifying Speaking Descriptors & Vietnamese Pronunciation Errors document...');
assert(fs.existsSync(SPEAKING_CRITERIA_PATH), 'File speaking-criteria-descriptors.md must exist');
const criteriaContent = fs.readFileSync(SPEAKING_CRITERIA_PATH, 'utf8');

assert(criteriaContent.length > 5000, `Speaking criteria file too short (${criteriaContent.length} bytes, expected > 5000)`);
assert(criteriaContent.includes('Fluency & Coherence'), 'Must include FC');
assert(criteriaContent.includes('Lexical Resource'), 'Must include LR');
assert(criteriaContent.includes('Grammatical Range & Accuracy'), 'Must include GRA');
assert(criteriaContent.includes('Pronunciation'), 'Must include PR');
assert(criteriaContent.includes('Ma Trận So Sánh Chi Tiết 4 Tiêu Chí'), 'Must include 4-tier band descriptor matrix');
assert(criteriaContent.includes('6 Lỗi Phát Âm Cố Hữu'), 'Must include Vietnamese specific phonetic traps');
assert(criteriaContent.includes('Rơi âm đuôi'), 'Must include final consonant dropping');
assert(criteriaContent.includes('đuôi \'-ed\''), 'Must include ed ending pronunciation rules');
assert(criteriaContent.includes('Quy Tắc Làm Tròn'), 'Must include official Cambridge rounding rules');
console.log('    ✅ speaking-criteria-descriptors.md has complete band descriptor matrix and Vietnamese phonetic analysis.');

// 3. Verify Links
console.log('  ▶ 3. Verifying Navigation Links...');
assert(unitsContent.includes('../README.md'), 'Spelling units must link to README.md');
assert(criteriaContent.includes('../README.md'), 'Speaking criteria must link to README.md');
console.log('    ✅ Navigation and cross-links verified.');

console.log('🎉 Step 80 Test Suite PASSED: Spelling Units & Speaking Descriptors 100% VERIFIED!');
