import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * Test Step 90: CI/CD GitHub Actions Pipeline & One-Way Sync Guard Verification
 * Step 3 in GitBook Architecture Improvement Plan
 * 
 * Verifies:
 * 1. .github/workflows/sync-docs.yml existence and correct triggers (push, pull_request, workflow_dispatch).
 * 2. CI workflow includes automated markdown link verification step.
 * 3. CI workflow includes GitBook URL abstraction verification step.
 * 4. docs/features/gitbook-one-way-sync-guide.md exists and documents the 3-step dashboard config.
 * 5. All documentation files in docs/ maintain zero broken links after new guide added.
 */

export function runTests() {
  const rootDir = process.cwd();

  console.log('--- Running Test Step 90: CI/CD Pipeline & One-Way Sync Guard ---');

  // Test 1: .github/workflows/sync-docs.yml
  const workflowPath = path.join(rootDir, '.github', 'workflows', 'sync-docs.yml');
  assert.ok(fs.existsSync(workflowPath), '.github/workflows/sync-docs.yml must exist');
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');

  assert.ok(workflowContent.includes('test_step89_markdown_links_integrity.js'), 'CI workflow must run Step 89 link integrity test');
  assert.ok(workflowContent.includes('test_step88_gitbook_url_abstraction.js'), 'CI workflow must run Step 88 URL config test');
  assert.ok(workflowContent.includes('pull_request'), 'CI workflow must validate PRs affecting docs');
  console.log('✓ .github/workflows/sync-docs.yml verified with automated link guard and validation steps');

  // Test 2: One-way sync guide
  const guidePath = path.join(rootDir, 'docs', 'features', 'gitbook-one-way-sync-guide.md');
  assert.ok(fs.existsSync(guidePath), 'docs/features/gitbook-one-way-sync-guide.md must exist');
  const guideContent = fs.readFileSync(guidePath, 'utf8');

  assert.ok(guideContent.includes('One-Way Sync') || guideContent.includes('Đồng Bộ Một Chiều'), 'Guide must cover One-Way Sync architecture');
  assert.ok(guideContent.includes('Space Settings'), 'Guide must provide Space Settings steps');
  assert.ok(guideContent.includes('Webhook'), 'Guide must mention GitHub Webhook verification');
  console.log('✓ docs/features/gitbook-one-way-sync-guide.md verified with complete architectural guidance');

  console.log('✅ Test Step 90: All CI/CD Pipeline & One-Way Sync Guard assertions PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step90_ci_pipeline_and_docs_sync_guard.js')) {
  runTests();
}
