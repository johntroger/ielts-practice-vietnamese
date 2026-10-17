import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Test Step 180: Multilingual Documentation Architecture (English Variant Foundation)
// Step 1 in GitBook Multilingual Implementation Plan
// Verifies:
// 1. docs-en/ directory exists.
// 2. docs-en/README.md exists, contains English Cambridge framework terms, and has valid structure.
// 3. docs-en/SUMMARY.md exists and contains over 115 standardized English lesson links across all 4 skills.
// 4. docs-en/.gitbook.yaml configuration file exists for dedicated GitBook Space mapping.
// 5. .gitattributes includes docs-en files with LF normalization.

export function runTests() {
  const rootDir = process.cwd();
  const docsEnDir = path.join(rootDir, 'docs-en');

  console.log('--- Running Test Step 180: Multilingual Documentation Architecture ---');

  // Test 1: docs-en folder existence
  assert.ok(fs.existsSync(docsEnDir), 'docs-en/ directory must exist');
  console.log('✓ docs-en/ root directory verified');

  // Test 2: docs-en/README.md
  const readmePath = path.join(docsEnDir, 'README.md');
  assert.ok(fs.existsSync(readmePath), 'docs-en/README.md must exist');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  assert.ok(readmeContent.includes('IELTS Master Handbook - Complete Strategy Guide'), 'Must contain English title');
  assert.ok(readmeContent.includes('Four Skills Master Blueprint'), 'Must contain Four Skills overview');
  assert.ok(readmeContent.includes('Cambridge Assessment English'), 'Must credit Cambridge Assessment');
  console.log('✓ docs-en/README.md verified with Cambridge English framework');

  // Test 3: docs-en/SUMMARY.md
  const summaryPath = path.join(docsEnDir, 'SUMMARY.md');
  assert.ok(fs.existsSync(summaryPath), 'docs-en/SUMMARY.md must exist');
  const summaryContent = fs.readFileSync(summaryPath, 'utf8');
  
  assert.ok(summaryContent.includes('## IELTS Writing'), 'Must include Writing section');
  assert.ok(summaryContent.includes('## IELTS Reading'), 'Must include Reading section');
  assert.ok(summaryContent.includes('## IELTS Listening'), 'Must include Listening section');
  assert.ok(summaryContent.includes('## IELTS Speaking'), 'Must include Speaking section');
  assert.ok(summaryContent.includes('## 📚 Core Grammar & Academic Vocabulary Guide'), 'Must include Grammar & Lexicon section');
  
  // Count English link items
  const linkMatches = summaryContent.match(/\* \[.*?\]\(.*?\)/g) || [];
  assert.ok(linkMatches.length >= 115, `SUMMARY.md must contain at least 115 lesson links, found ${linkMatches.length}`);
  console.log(`✓ docs-en/SUMMARY.md verified with ${linkMatches.length} standardized English lesson links`);

  // Test 4: docs-en/.gitbook.yaml
  const gitbookYamlPath = path.join(docsEnDir, '.gitbook.yaml');
  assert.ok(fs.existsSync(gitbookYamlPath), 'docs-en/.gitbook.yaml must exist');
  console.log('✓ docs-en/.gitbook.yaml verified for space mapping');

  // Test 5: .gitattributes protection
  const gitattrPath = path.join(rootDir, '.gitattributes');
  const gitattrContent = fs.readFileSync(gitattrPath, 'utf8');
  assert.ok(gitattrContent.includes('docs-en/**/*.md text eol=lf'), '.gitattributes must protect docs-en files');
  console.log('✓ .gitattributes verified with docs-en EOL normalization');

  console.log('✅ Test Step 180: All Multilingual Architecture assertions PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step180_multilang_docs_architecture.js')) {
  runTests();
}
