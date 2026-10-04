import assert from 'assert';
import { getGitBookBaseUrl, getFeatureGitBookUrl, GITBOOK_DOCS_BASE_URL, GITBOOK_FEATURES_BASE_URL } from '../src/core/featureRegistry.js';
import fs from 'fs';
import path from 'path';

/**
 * Test Step 88: GitBook URL Configuration Abstraction & .gitattributes Normalization
 * Step 1 in GitBook Architecture Improvement Plan
 * 
 * Verifies:
 * 1. .gitattributes file exists and configures text=auto eol=lf for docs and source code.
 * 2. getGitBookBaseUrl() returns default fallback when no VITE_GITBOOK_URL is provided.
 * 3. getFeatureGitBookUrl() constructs dynamic deep links without hardcoding.
 * 4. Zero hardcoded GitBook URLs in UI components (Navbar, TheoryHandbookModal).
 */

export function runTests() {
  const rootDir = process.cwd();

  console.log('--- Running Test Step 88: GitBook URL Abstraction & .gitattributes Normalization ---');

  // Test 1: .gitattributes existence and content
  const gitAttrPath = path.join(rootDir, '.gitattributes');
  assert.ok(fs.existsSync(gitAttrPath), '.gitattributes file must exist at repository root');
  const gitAttrContent = fs.readFileSync(gitAttrPath, 'utf8');
  assert.ok(gitAttrContent.includes('eol=lf'), '.gitattributes must enforce eol=lf');
  assert.ok(gitAttrContent.includes('docs/**/*.md'), '.gitattributes must specifically protect docs markdown files');
  console.log('✓ .gitattributes verified with EOL LF normalization');

  // Test 2: URL resolvers functionality
  const defaultBase = getGitBookBaseUrl();
  assert.strictEqual(defaultBase, 'https://vneconomics.gitbook.io/vneconomics-docs', 'Default base URL should match standard fallback');
  assert.strictEqual(GITBOOK_DOCS_BASE_URL, defaultBase, 'GITBOOK_DOCS_BASE_URL should match getGitBookBaseUrl()');

  const allUrl = getFeatureGitBookUrl('all');
  assert.strictEqual(allUrl, `${defaultBase}/huong-dan-su-dung-and-tinh-nang-he-thong/features`, 'Should construct all features link correctly');

  const catUrl = getFeatureGitBookUrl('ai_evaluation');
  assert.strictEqual(catUrl, `${defaultBase}/huong-dan-su-dung-and-tinh-nang-he-thong/ai-evaluation`, 'Should resolve category slug properly');

  const featUrl = getFeatureGitBookUrl({ id: 'ai-writing-rater', category: 'ai_evaluation' });
  assert.strictEqual(featUrl, `${defaultBase}/huong-dan-su-dung-and-tinh-nang-he-thong/ai-evaluation#ai-writing-rater`, 'Should resolve deep link with anchor');
  console.log('✓ getGitBookBaseUrl and getFeatureGitBookUrl verified');

  // Test 3: No hardcoded URLs in UI components
  const navbarPath = path.join(rootDir, 'src', 'components', 'Navbar.jsx');
  const navbarContent = fs.readFileSync(navbarPath, 'utf8');
  assert.ok(!navbarContent.includes('https://vneconomics.gitbook.io'), 'Navbar.jsx must not have hardcoded vneconomics.gitbook.io URL');

  const theoryPath = path.join(rootDir, 'src', 'components', 'TheoryHandbookModal.jsx');
  const theoryContent = fs.readFileSync(theoryPath, 'utf8');
  assert.ok(!theoryContent.includes('https://vneconomics.gitbook.io'), 'TheoryHandbookModal.jsx must not have hardcoded vneconomics.gitbook.io URL');
  console.log('✓ UI components verified with zero hardcoded GitBook URLs');

  console.log('✅ Test Step 88: All GitBook URL Abstraction & .gitattributes assertions PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step88_gitbook_url_abstraction.js')) {
  runTests();
}
