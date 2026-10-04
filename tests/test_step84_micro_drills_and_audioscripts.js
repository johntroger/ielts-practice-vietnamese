import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * Test Step 84: Verification of Micro-Passage Drills and Audioscript Distractor Analyses
 * Step 5 in Academic Quality Improvement Plan
 * 
 * Verifies:
 * 1. docs/reading/matching-headings.md:
 *    - Detailed micro-passage drill (Paragraph A about sleep & brain)
 *    - List of Headings i-v
 *    - Trap analyses: Word-spotting, Detail trap, Over-generalized trap
 *    - File length > 5000 bytes
 * 
 * 2. docs/reading/reading-summary-box-options.md:
 *    - Detailed micro-passage drill (Derinkuyu underground city)
 *    - Summary with blank numbers (1), (2), (3)
 *    - Box of Options table (A to H)
 *    - Deductive grammar & paraphrase table with root words
 *    - File length > 4500 bytes
 * 
 * 3. docs/listening/distractor-traps.md:
 *    - Turnaround signpost table
 *    - 3 detailed real audioscripts (Part 1, Part 2, Part 3)
 *    - Visual breakdown markers: [🔴 Distractor], [⚠️ Turnaround Signpost], [🟢 Target Answer]
 *    - File length > 4500 bytes
 */

export function runTests() {
  const rootDir = process.cwd();

  console.log('--- Running Test Step 84: Micro-Passage Drills and Audioscript Analyses ---');

  // Test 1: matching-headings.md
  const headingsFile = path.join(rootDir, 'docs', 'reading', 'matching-headings.md');
  assert.ok(fs.existsSync(headingsFile), 'docs/reading/matching-headings.md must exist');
  const headingsContent = fs.readFileSync(headingsFile, 'utf8');
  assert.ok(headingsContent.length > 5000, `matching-headings.md size should be > 5000 bytes, got ${headingsContent.length}`);
  assert.ok(headingsContent.includes('Micro-Passage Drill'), 'Must contain Micro-Passage Drill section');
  assert.ok(headingsContent.includes('List of Headings'), 'Must contain List of Headings');
  assert.ok(headingsContent.includes('Word-spotting Trap'), 'Must explain Word-spotting Trap');
  assert.ok(headingsContent.includes('Detail Trap'), 'Must explain Detail Trap');
  assert.ok(headingsContent.includes('Over-generalized Trap'), 'Must explain Over-generalized Trap');
  assert.ok(headingsContent.includes('synaptic pruning') || headingsContent.includes('glymphatic system'), 'Must contain academic passage text');
  console.log('✓ matching-headings.md verified with micro-drill and trap analyses');

  // Test 2: reading-summary-box-options.md
  const summaryFile = path.join(rootDir, 'docs', 'reading', 'reading-summary-box-options.md');
  assert.ok(fs.existsSync(summaryFile), 'docs/reading/reading-summary-box-options.md must exist');
  const summaryContent = fs.readFileSync(summaryFile, 'utf8');
  assert.ok(summaryContent.length > 4500, `reading-summary-box-options.md size should be > 4500 bytes, got ${summaryContent.length}`);
  assert.ok(summaryContent.includes('Micro-Passage Drill'), 'Must contain Micro-Passage Drill section');
  assert.ok(summaryContent.includes('Derinkuyu'), 'Must contain passage topic Derinkuyu');
  assert.ok(summaryContent.includes('Box of Options') || summaryContent.includes('Khung từ lựa chọn'), 'Must contain Box of Options');
  assert.ok(summaryContent.includes('breathable atmosphere') && summaryContent.includes('impenetrable'), 'Must contain sample box options');
  assert.ok(summaryContent.includes('Cặp Paraphrase'), 'Must contain Paraphrase deduction table');
  console.log('✓ reading-summary-box-options.md verified with box options and deduction table');

  // Test 3: distractor-traps.md
  const distractorFile = path.join(rootDir, 'docs', 'listening', 'distractor-traps.md');
  assert.ok(fs.existsSync(distractorFile), 'docs/listening/distractor-traps.md must exist');
  const distractorContent = fs.readFileSync(distractorFile, 'utf8');
  assert.ok(distractorContent.length > 4500, `distractor-traps.md size should be > 4500 bytes, got ${distractorContent.length}`);
  assert.ok(distractorContent.includes('Turnaround Signposts') || distractorContent.includes('Tín Hiệu Đổi Ý'), 'Must contain Turnaround signpost section');
  assert.ok(distractorContent.includes('Part 1') && distractorContent.includes('Part 2') && distractorContent.includes('Part 3'), 'Must contain 3 distinct scenarios');
  assert.ok(distractorContent.includes('🔴 Distractor'), 'Must mark Distractors visually');
  assert.ok(distractorContent.includes('⚠️ Turnaround Signpost'), 'Must mark Turnaround Signposts visually');
  assert.ok(distractorContent.includes('🟢 Target Answer'), 'Must mark Target Answers visually');
  console.log('✓ distractor-traps.md verified with 3 audioscript scenarios and visual markers');

  console.log('✅ Test Step 84: All Micro-Drill and Audioscript assertions PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step84_micro_drills_and_audioscripts.js')) {
  runTests();
}
