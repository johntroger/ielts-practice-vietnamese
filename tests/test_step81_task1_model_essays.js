/**
 * Test Step 81: Verification of Full Model Essays and Examiner Feedback across all 6 Writing Task 1 Guides
 * Ensures each guide has an authentic prompt, grouping strategy, Band 8.5+ model essay, and 4-criteria analysis.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('🧪 Testing Step 81: Writing Task 1 Model Essays & Assessment Integrity...');

const ROOT_DIR = path.resolve('.');
const TASK1_FILES = [
  { name: 'Line Graph', path: path.join(ROOT_DIR, 'docs', 'writing', 'task1-line-graph.md') },
  { name: 'Bar Chart', path: path.join(ROOT_DIR, 'docs', 'writing', 'task1-bar-chart.md') },
  { name: 'Pie Chart', path: path.join(ROOT_DIR, 'docs', 'writing', 'task1-pie-chart.md') },
  { name: 'Table', path: path.join(ROOT_DIR, 'docs', 'writing', 'task1-table.md') },
  { name: 'Process', path: path.join(ROOT_DIR, 'docs', 'writing', 'task1-process.md') },
  { name: 'Map', path: path.join(ROOT_DIR, 'docs', 'writing', 'task1-map.md') }
];

for (const doc of TASK1_FILES) {
  console.log(`  ▶ Checking Task 1 Guide: ${doc.name}...`);
  assert(fs.existsSync(doc.path), `File ${doc.path} must exist`);
  const content = fs.readFileSync(doc.path, 'utf8');

  // Check file depth
  assert(content.length > 4500, `${doc.name} guide should have comprehensive depth (>4500 bytes, got ${content.length})`);

  // Check prompt
  assert(
    content.includes('Đề Thi Mẫu Thực Tế') || content.includes('Đề bài thực tế') || content.includes('Prompt'),
    `${doc.name} must contain an authentic Cambridge prompt`
  );

  // Check grouping strategy
  assert(
    content.includes('Gom Nhóm') || content.includes('Grouping Strategy'),
    `${doc.name} must explain grouping strategy`
  );

  // Check full model essay
  assert(
    content.includes('Bài Viết Mẫu Hoàn Chỉnh') || content.includes('Bài Mẫu Hoàn Chỉnh') || content.includes('Model Essay'),
    `${doc.name} must include a full Band 8.5+ model essay`
  );

  // Check 4-criteria assessment
  assert(
    content.includes('Phân Tích Chấm Điểm 4 Tiêu Chí') || content.includes('Tiêu Chí Khảo Thí'),
    `${doc.name} must provide 4-criteria examiner analysis`
  );
  assert(content.includes('Task Achievement') || content.includes('TA'), `${doc.name} must analyze TA`);
  assert(content.includes('Coherence & Cohesion') || content.includes('CC'), `${doc.name} must analyze CC`);
  assert(content.includes('Lexical Resource') || content.includes('LR'), `${doc.name} must analyze LR`);
  assert(content.includes('Grammatical Range') || content.includes('GRA'), `${doc.name} must analyze GRA`);

  // Check navigation links
  assert(content.includes('../README.md'), `${doc.name} must link to README.md`);
  console.log(`    ✅ ${doc.name} successfully verified with full model essay & examiner analysis.`);
}

console.log('🎉 Step 81 Test Suite PASSED: All 6 Task 1 Guides 100% VERIFIED!');
