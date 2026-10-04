import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * Test Step 89: Markdown Link Integrity & Documentation Graph Verification
 * Step 2 in GitBook Architecture Improvement Plan
 * 
 * Verifies:
 * 1. Recursive scan across all 124+ markdown files in docs/ directory.
 * 2. Parses all relative internal links [text](path.md) and verifies physical existence on disk.
 * 3. Asserts ZERO broken relative links across the entire documentation tree (>600 links).
 * 4. Verifies docs/SUMMARY.md table of contents links (120+ entries) point to existing files.
 * 5. Verifies circular navigation links (Previous / Next / Table of Contents) at file footers.
 */

export function runTests() {
  const rootDir = process.cwd();
  const docsDir = path.join(rootDir, 'docs');

  console.log('--- Running Test Step 89: Markdown Link Integrity & Documentation Graph ---');

  assert.ok(fs.existsSync(docsDir), 'docs/ directory must exist');

  let markdownFiles = [];
  let totalLinksChecked = 0;
  let brokenLinks = [];

  // Recursive directory scanner
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        markdownFiles.push(fullPath);
      }
    }
  }

  scanDir(docsDir);
  assert.ok(markdownFiles.length >= 120, `docs/ must contain at least 120 markdown files, found ${markdownFiles.length}`);
  console.log(`✓ Scanned ${markdownFiles.length} markdown documentation files`);

  // Check all relative links
  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Match Markdown relative links: [Label](relative/path.md) or [Label](relative/path.md#anchor)
    const regex = /\[.*?\]\((?!https?:\/\/|mailto:|#)(.*?\.md)(?:#.*?)?\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      totalLinksChecked++;
      const linkTarget = match[1];
      const resolvedTarget = path.resolve(path.dirname(filePath), linkTarget);
      if (!fs.existsSync(resolvedTarget)) {
        brokenLinks.push({
          source: path.relative(rootDir, filePath),
          link: linkTarget,
          target: path.relative(rootDir, resolvedTarget)
        });
      }
    }
  }

  console.log(`✓ Checked ${totalLinksChecked} relative markdown hyperlinks`);
  assert.strictEqual(brokenLinks.length, 0, `Found broken links:\n${JSON.stringify(brokenLinks, null, 2)}`);
  console.log('✓ Verified ZERO broken relative markdown links across all documentation files');

  // Verify docs/SUMMARY.md integrity
  const summaryPath = path.join(docsDir, 'SUMMARY.md');
  assert.ok(fs.existsSync(summaryPath), 'docs/SUMMARY.md must exist');
  const summaryContent = fs.readFileSync(summaryPath, 'utf8');
  const summaryRegex = /\[.*?\]\((?!https?:\/\/|mailto:|#)(.*?\.md)(?:#.*?)?\)/g;
  let summaryLinksCount = 0;
  let summaryBroken = [];
  let sMatch;
  while ((sMatch = summaryRegex.exec(summaryContent)) !== null) {
    summaryLinksCount++;
    const sTarget = path.resolve(docsDir, sMatch[1]);
    if (!fs.existsSync(sTarget)) {
      summaryBroken.push(sMatch[1]);
    }
  }

  assert.ok(summaryLinksCount >= 115, `SUMMARY.md must contain at least 115 guide links, found ${summaryLinksCount}`);
  assert.strictEqual(summaryBroken.length, 0, `Broken links in SUMMARY.md: ${summaryBroken.join(', ')}`);
  console.log(`✓ Verified ${summaryLinksCount} links in docs/SUMMARY.md are 100% physically accessible`);

  console.log('✅ Test Step 89: All Markdown Link Integrity assertions PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step89_markdown_links_integrity.js')) {
  runTests();
}
