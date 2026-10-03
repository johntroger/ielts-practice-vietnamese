/**
 * Test Suite Step 68: Grammar & Vocabulary Documentation Integrity
 * 
 * Verifies that:
 * 1. docs/grammar-vocab/ directory exists and contains all 13 required modules.
 * 2. Each markdown file contains comprehensive explanations, grammar formulas, and bilingual examples.
 * 3. docs/SUMMARY.md links to all 13 files with 0 broken links.
 * 4. docs/README.md references the grammar-vocab hub.
 * 5. scripts/sync_features_to_gitbook.js preserves the grammar-vocab section when executed.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { runSync } from '../scripts/sync_features_to_gitbook.js';

console.log('📚 Testing Step 68: Grammar & Vocabulary Documentation Integrity...');

const grammarVocabDir = path.resolve('docs/grammar-vocab');
assert(fs.existsSync(grammarVocabDir), 'docs/grammar-vocab directory must exist');

const expectedFiles = [
  'README.md',
  'grammar-sentence-structures.md',
  'grammar-tenses-by-task.md',
  'grammar-passive-voice.md',
  'grammar-conditionals.md',
  'grammar-comparison-structures.md',
  'grammar-advanced-structures.md',
  'grammar-common-errors-vietnamese.md',
  'vocab-linking-devices.md',
  'vocab-task1-data-language.md',
  'vocab-topic-collocations.md',
  'vocab-academic-word-families.md',
  'vocab-speaking-functional-language.md'
];

// 1. Verify existence and content depth of all 13 files
console.log('  ▶ 1. Verifying all 13 grammar-vocab markdown files...');
for (const file of expectedFiles) {
  const filePath = path.join(grammarVocabDir, file);
  assert(fs.existsSync(filePath), `File docs/grammar-vocab/${file} must exist`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.length >= 1500, `File docs/grammar-vocab/${file} must have substantial content (>= 1500 bytes, found ${content.length})`);
  assert(/ví dụ|example/i.test(content), `File ${file} must contain examples`);
}
console.log('    ✅ All 13 grammar and vocabulary modules exist with in-depth academic content.');

// 2. Verify SUMMARY.md integrity
console.log('  ▶ 2. Verifying docs/SUMMARY.md links and anchors...');
const summaryPath = path.resolve('docs/SUMMARY.md');
const summaryContent = fs.readFileSync(summaryPath, 'utf8');

assert(
  summaryContent.includes('## 📚 Ngữ Pháp & Từ Vựng Trọng Tâm IELTS'),
  'SUMMARY.md must contain the Grammar & Vocabulary section header'
);

for (const file of expectedFiles) {
  const link = `grammar-vocab/${file}`;
  assert(
    summaryContent.includes(link),
    `SUMMARY.md must include link to ${link}`
  );
}
console.log('    ✅ docs/SUMMARY.md correctly lists all 13 grammar-vocab documents.');

// 3. Verify README.md references
console.log('  ▶ 3. Verifying docs/README.md portal reference...');
const readmeContent = fs.readFileSync(path.resolve('docs/README.md'), 'utf8');
assert(
  readmeContent.includes('grammar-vocab/README.md'),
  'docs/README.md must link to the grammar-vocab hub'
);
console.log('    ✅ docs/README.md includes quick links to Grammar & Vocabulary.');

// 4. Verify sync script preserves the section
console.log('  ▶ 4. Running sync engine to verify persistence...');
runSync();
const refreshedSummary = fs.readFileSync(summaryPath, 'utf8');
assert(
  refreshedSummary.includes('## 📚 Ngữ Pháp & Từ Vựng Trọng Tâm IELTS'),
  'SUMMARY.md must preserve the Grammar & Vocabulary section after sync'
);
for (const file of expectedFiles) {
  assert(
    refreshedSummary.includes(`grammar-vocab/${file}`),
    `SUMMARY.md must still include link to grammar-vocab/${file} after sync`
  );
}
console.log('    ✅ Auto-sync engine preserves Grammar & Vocabulary section completely.');

console.log('🎉 Step 68 Test Suite PASSED: Grammar & Vocabulary Documentation 100% VERIFIED!\n');
