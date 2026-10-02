/**
 * Test Suite Step 57: GitBook Documentation & Auto-Sync Integration
 * 
 * Verifies that:
 * 1. .gitbook.yaml exists at project root and configures root: ./docs.
 * 2. docs/README.md and docs/SUMMARY.md exist and conform to GitBook standards.
 * 3. All 16 core master guide markdown files exist across all 4 IELTS skills.
 * 4. docs/SUMMARY.md contains 70+ links and 100% of links resolve to existing files (0 broken links).
 * 5. TheoryHandbookModal.jsx integrates a direct "GitBook Online" portal link button with ExternalLink icon.
 * 6. Navbar.jsx includes GitBook visual indicator badges for enhanced discoverability.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('📖 Testing Step 57: GitBook Documentation & Auto-Sync Integration...');

// -------------------------------------------------------------
// 1. VERIFY .gitbook.yaml CONFIGURATION
// -------------------------------------------------------------
console.log('  ▶ 1. Verifying .gitbook.yaml configuration...');
const gitbookYamlPath = path.resolve('.gitbook.yaml');
assert(fs.existsSync(gitbookYamlPath), '.gitbook.yaml must exist at repository root');
const gitbookYamlContent = fs.readFileSync(gitbookYamlPath, 'utf8');
assert(
  gitbookYamlContent.includes('root: ./docs') || gitbookYamlContent.includes('root: docs'),
  '.gitbook.yaml must point root to ./docs'
);
console.log('    ✅ .gitbook.yaml properly configured with root: ./docs.');

// -------------------------------------------------------------
// 2. VERIFY docs/README.md & docs/SUMMARY.md
// -------------------------------------------------------------
console.log('  ▶ 2. Verifying docs/README.md and docs/SUMMARY.md...');
const readmePath = path.resolve('docs/README.md');
const summaryPath = path.resolve('docs/SUMMARY.md');

assert(fs.existsSync(readmePath), 'docs/README.md must exist as GitBook home page');
assert(fs.existsSync(summaryPath), 'docs/SUMMARY.md must exist as GitBook table of contents');

const readmeContent = fs.readFileSync(readmePath, 'utf8');
const summaryContent = fs.readFileSync(summaryPath, 'utf8');

assert(readmeContent.includes('IELTS Master Handbook'), 'README.md must contain handbook title');
assert(readmeContent.includes('Writing') && readmeContent.includes('Reading') && readmeContent.includes('Listening') && readmeContent.includes('Speaking'), 'README.md must cover all 4 skills');
assert(summaryContent.includes('# Table of contents'), 'SUMMARY.md must contain table of contents header');
console.log('    ✅ docs/README.md and docs/SUMMARY.md verified.');

// -------------------------------------------------------------
// 3. VERIFY ALL 16 CORE MASTER GUIDE FILES EXIST
// -------------------------------------------------------------
console.log('  ▶ 3. Verifying all 16 core master guide markdown files...');
const coreGuideFiles = [
  'docs/README.md',
  'docs/SUMMARY.md',
  'docs/writing/criteria-overview.md',
  'docs/writing/task1-mastery.md',
  'docs/writing/task2-peel-structure.md',
  'docs/writing/academic-hedging.md',
  'docs/reading/time-management.md',
  'docs/reading/true-false-not-given.md',
  'docs/reading/matching-headings.md',
  'docs/listening/distractor-traps.md',
  'docs/listening/spelling-and-units.md',
  'docs/listening/map-and-signposting.md',
  'docs/speaking/area-framework-part1.md',
  'docs/speaking/storytelling-part2.md',
  'docs/speaking/critical-thinking-part3.md',
  'docs/speaking/natural-fillers.md'
];

coreGuideFiles.forEach(file => {
  const fullPath = path.resolve(file);
  assert(fs.existsSync(fullPath), `Required core guide file must exist: ${file}`);
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(content.length > 100, `Guide file ${file} must have substantive content`);
});
console.log('    ✅ All 16 core master guide markdown files exist and contain rich content.');

// -------------------------------------------------------------
// 4. VERIFY 100% OF SUMMARY.md LINKS ARE VALID (0 BROKEN LINKS)
// -------------------------------------------------------------
console.log('  ▶ 4. Verifying SUMMARY.md link integrity across the book...');
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
let match;
let linkCount = 0;
const brokenLinks = [];

while ((match = linkRegex.exec(summaryContent)) !== null) {
  linkCount++;
  const label = match[1];
  const target = match[2];
  const fullTarget = path.resolve('docs', target);
  if (!fs.existsSync(fullTarget)) {
    brokenLinks.push({ label, target });
  }
}

assert(linkCount >= 70, `SUMMARY.md should index at least 70 articles (found: ${linkCount})`);
assert.strictEqual(brokenLinks.length, 0, `SUMMARY.md contains broken links: ${JSON.stringify(brokenLinks)}`);
console.log(`    ✅ SUMMARY.md contains ${linkCount} links with ZERO broken links!`);

// -------------------------------------------------------------
// 5. VERIFY TheoryHandbookModal.jsx GITBOOK INTEGRATION
// -------------------------------------------------------------
console.log('  ▶ 5. Verifying TheoryHandbookModal.jsx GitBook portal button...');
const handbookModalPath = path.resolve('src/components/TheoryHandbookModal.jsx');
assert(fs.existsSync(handbookModalPath), 'TheoryHandbookModal.jsx must exist');
const handbookModalContent = fs.readFileSync(handbookModalPath, 'utf8');

assert(
  handbookModalContent.includes('GitBook Online'),
  'TheoryHandbookModal.jsx must include "GitBook Online" button'
);
assert(
  handbookModalContent.includes('ExternalLink'),
  'TheoryHandbookModal.jsx must import and use ExternalLink icon'
);
assert(
  handbookModalContent.includes('VITE_GITBOOK_URL'),
  'TheoryHandbookModal.jsx must reference VITE_GITBOOK_URL environment variable'
);
console.log('    ✅ TheoryHandbookModal.jsx GitBook portal button properly wired.');

// -------------------------------------------------------------
// 6. VERIFY Navbar.jsx GITBOOK DISCOVERABILITY BADGES
// -------------------------------------------------------------
console.log('  ▶ 6. Verifying Navbar.jsx GitBook badges...');
const navbarPath = path.resolve('src/components/Navbar.jsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

assert(
  navbarContent.includes('GitBook'),
  'Navbar.jsx must display GitBook badge/indicator'
);
assert(
  navbarContent.includes('GitBook Sync'),
  'Navbar.jsx mobile drawer must display GitBook Sync badge'
);
console.log('    ✅ Navbar.jsx GitBook indicators verified.');

console.log('🎉 Step 57 Test Suite PASSED: GitBook documentation and auto-sync fully verified!');
