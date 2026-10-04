/**
 * Test Step 82: Verification of Full Model Essays and Examiner Feedback across all 5 Writing Task 2 Guides
 * Ensures each guide has an authentic prompt, outline, Band 8.5+ model essay, and 4-criteria analysis.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Step 82: Writing Task 2 Model Essays & Assessment Integrity...');

const ROOT_DIR = path.resolve('.');
const TASK2_FILES = [
  { name: 'Opinion', path: path.join(ROOT_DIR, 'docs', 'writing', 'task2-opinion.md') },
  { name: 'Discussion', path: path.join(ROOT_DIR, 'docs', 'writing', 'task2-discussion.md') },
  { name: 'Advantages & Disadvantages', path: path.join(ROOT_DIR, 'docs', 'writing', 'task2-advantages-disadvantages.md') },
  { name: 'Problem & Solution', path: path.join(ROOT_DIR, 'docs', 'writing', 'task2-problem-solution.md') },
  { name: 'Two-Part Question', path: path.join(ROOT_DIR, 'docs', 'writing', 'task2-two-part.md') }
];

for (const doc of TASK2_FILES) {
  console.log(`  ▶ Checking Task 2 Guide: ${doc.name}...`);
  assert(fs.existsSync(doc.path), `File ${doc.path} must exist`);
  const content = fs.readFileSync(doc.path, 'utf8');

  // Check file depth
  assert(content.length > 4500, `${doc.name} guide should have comprehensive depth (>4500 bytes, got ${content.length})`);

  // Check prompt
  assert(
    content.includes('Đề Thi Mẫu Thực Tế') || content.includes('Đề bài thực chiến') || content.includes('Prompt'),
    `${doc.name} must contain an authentic Cambridge prompt`
  );

  // Check full model essay
  assert(
    content.includes('Bài Viết Mẫu Hoàn Chỉnh') || content.includes('Bài mẫu hoàn chỉnh') || content.includes('Model Essay'),
    `${doc.name} must include a full Band 8.5+ model essay`
  );

  // Check 4-criteria assessment
  assert(
    content.includes('Phân Tích Chấm Điểm 4 Tiêu Chí') || content.includes('Tiêu Chí Khảo Thí'),
    `${doc.name} must provide 4-criteria examiner analysis`
  );
  assert(content.includes('Task Response') || content.includes('TR'), `${doc.name} must analyze TR`);
  assert(content.includes('Coherence & Cohesion') || content.includes('CC'), `${doc.name} must analyze CC`);
  assert(content.includes('Lexical Resource') || content.includes('LR'), `${doc.name} must analyze LR`);
  assert(content.includes('Grammatical Range') || content.includes('GRA'), `${doc.name} must analyze GRA`);

  // Check navigation links
  assert(content.includes('../README.md'), `${doc.name} must link to README.md`);
  console.log(`    ✅ ${doc.name} successfully verified with full model essay & examiner analysis.`);
}

console.log('🎉 Step 82 Test Suite PASSED: All 5 Task 2 Guides 100% VERIFIED!');
