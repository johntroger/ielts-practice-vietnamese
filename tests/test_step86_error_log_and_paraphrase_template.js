import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * Test Step 86: Verification of Academic Error Log & Paraphrase Journal Template
 * Step 6 in Academic Quality Improvement Plan
 * 
 * Verifies:
 * 1. docs/grammar-vocab/error-log-and-paraphrase-journal.md:
 *    - Root-cause taxonomy: Type A (Slip), Type B (Gap), Type C (Trap), Type D (Style)
 *    - Error tracking sheet table with columns (ID, Ngày, Kỹ năng, Lỗi, Loại lỗi, Nguyên nhân, Đáp án đúng, Hành động 48h)
 *    - Paraphrase 3-column table
 *    - Spaced Review Protocol (SM-2: Day 1, Day 3, Day 7, Day 14)
 *    - Pre-submission sanity checklist
 *    - File length > 4500 bytes
 * 
 * 2. docs/SUMMARY.md:
 *    - Contains link to grammar-vocab/error-log-and-paraphrase-journal.md
 */

export function runTests() {
  const rootDir = process.cwd();

  console.log('--- Running Test Step 86: Academic Error Log & Paraphrase Journal Template ---');

  // Test 1: File existence and content depth
  const logFile = path.join(rootDir, 'docs', 'grammar-vocab', 'error-log-and-paraphrase-journal.md');
  assert.ok(fs.existsSync(logFile), 'docs/grammar-vocab/error-log-and-paraphrase-journal.md must exist');
  const logContent = fs.readFileSync(logFile, 'utf8');

  assert.ok(logContent.length > 4500, `error-log-and-paraphrase-journal.md size should be > 4500 bytes, got ${logContent.length}`);
  assert.ok(logContent.includes('Type A') && logContent.includes('Type B') && logContent.includes('Type C') && logContent.includes('Type D'), 'Must include 4-tier root-cause taxonomy');
  assert.ok(logContent.includes('Error Tracking Sheet') || logContent.includes('Mẫu Bảng Theo Dõi Lỗi'), 'Must include Error tracking table');
  assert.ok(logContent.includes('Paraphrase Journal') || logContent.includes('Sổ Tay Paraphrase'), 'Must include Paraphrase journal table');
  assert.ok(logContent.includes('Spaced Review Protocol') || logContent.includes('Ôn Tập Lỗi Sai Ngắt Quãng'), 'Must include Spaced Review Protocol');
  assert.ok(logContent.includes('Pre-Submission Sanity Check') || logContent.includes('Checklist 5 Bước Trước Khi Nộp Bài'), 'Must include Pre-submission checklist');
  console.log('✓ error-log-and-paraphrase-journal.md verified with taxonomy, templates, and protocols');

  // Test 2: docs/SUMMARY.md integration
  const summaryFile = path.join(rootDir, 'docs', 'SUMMARY.md');
  assert.ok(fs.existsSync(summaryFile), 'docs/SUMMARY.md must exist');
  const summaryContent = fs.readFileSync(summaryFile, 'utf8');
  assert.ok(summaryContent.includes('grammar-vocab/error-log-and-paraphrase-journal.md'), 'docs/SUMMARY.md must include link to Error Log file');
  console.log('✓ docs/SUMMARY.md verified with Error Log navigation entry');

  console.log('✅ Test Step 86: All Error Log Template assertions PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step86_error_log_and_paraphrase_template.js')) {
  runTests();
}
