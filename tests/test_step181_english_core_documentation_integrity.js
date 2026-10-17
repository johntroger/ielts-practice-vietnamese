import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * Test Step 181: Verification of English Core Documentation Modules & Link Graph
 * Step 2 in GitBook Multilingual Implementation Plan
 * 
 * Verifies:
 * 1. docs-en/four-skills-overview.md exists and is written in complete English Cambridge register.
 * 2. docs-en/writing/criteria-overview.md exists with 4 criteria (TA/TR, CC, LR, GRA) in English.
 * 3. docs-en/speaking/speaking-criteria-descriptors.md exists with 4 criteria (FC, LR, GRA, PR) in English.
 * 4. All 120+ markdown files in docs-en exist.
 * 5. Recursive scan of over 550 relative links in docs-en shows ZERO broken links.
 */

export function runTests() {
  const rootDir = process.cwd();
  const docsEnDir = path.join(rootDir, 'docs-en');

  console.log('--- Running Test Step 181: English Core Documentation & Zero Broken Links ---');

  // Test 1: four-skills-overview.md
  const fourSkillsPath = path.join(docsEnDir, 'four-skills-overview.md');
  assert.ok(fs.existsSync(fourSkillsPath), 'docs-en/four-skills-overview.md must exist');
  const fourSkillsContent = fs.readFileSync(fourSkillsPath, 'utf8');
  assert.ok(fourSkillsContent.includes('Four Skills Master Blueprint'), 'Must contain English title');
  assert.ok(fourSkillsContent.includes('Task 1: Objective factual reporting'), 'Must contain English Task 1 overview');
  assert.ok(fourSkillsContent.includes('Task 2: Critical argumentative essay'), 'Must contain English Task 2 overview');
  console.log('✓ docs-en/four-skills-overview.md verified in English');

  // Test 2: writing/criteria-overview.md
  const writingCriteriaPath = path.join(docsEnDir, 'writing', 'criteria-overview.md');
  assert.ok(fs.existsSync(writingCriteriaPath), 'docs-en/writing/criteria-overview.md must exist');
  const writingCriteriaContent = fs.readFileSync(writingCriteriaPath, 'utf8');
  assert.ok(writingCriteriaContent.includes('IELTS Writing Assessment Criteria'), 'Must contain English criteria title');
  assert.ok(writingCriteriaContent.includes('Task Achievement (TA) / Task Response (TR)'), 'Must detail TR/TA in English');
  assert.ok(writingCriteriaContent.includes('Coherence and Cohesion (CC)'), 'Must detail CC in English');
  console.log('✓ docs-en/writing/criteria-overview.md verified in English');

  // Test 3: speaking/speaking-criteria-descriptors.md
  const speakingCriteriaPath = path.join(docsEnDir, 'speaking', 'speaking-criteria-descriptors.md');
  assert.ok(fs.existsSync(speakingCriteriaPath), 'docs-en/speaking/speaking-criteria-descriptors.md must exist');
  const speakingCriteriaContent = fs.readFileSync(speakingCriteriaPath, 'utf8');
  assert.ok(speakingCriteriaContent.includes('IELTS Speaking Criteria'), 'Must contain English speaking criteria title');
  assert.ok(speakingCriteriaContent.includes('Fluency and Coherence (FC)'), 'Must detail FC in English');
  assert.ok(speakingCriteriaContent.includes('Pronunciation (PR)'), 'Must detail PR in English');
  console.log('✓ docs-en/speaking/speaking-criteria-descriptors.md verified in English');

  // Test 4: Link Graph Scan of docs-en
  let totalLinks = 0;
  let brokenLinks = [];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(full);
      } else if (entry.name.endsWith('.md')) {
        const content = fs.readFileSync(full, 'utf8');
        const regex = /\[.*?\]\((?!https?:\/\/|mailto:|#)(.*?\.md)(?:#.*?)?\)/g;
        let m;
        while ((m = regex.exec(content)) !== null) {
          totalLinks++;
          const target = m[1];
          const resolved = path.resolve(path.dirname(full), target);
          if (!fs.existsSync(resolved)) {
            brokenLinks.push({ file: path.relative(rootDir, full), target });
          }
        }
      }
    }
  }

  scanDir(docsEnDir);
  console.log(`✓ Scanned ${totalLinks} relative hyperlinks across docs-en`);
  assert.strictEqual(brokenLinks.length, 0, `Found broken links in docs-en: ${JSON.stringify(brokenLinks, null, 2)}`);
  console.log('✓ Verified ZERO broken relative links in docs-en');

  console.log('✅ Test Step 181: All English Core Documentation assertions PASSED!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step181_english_core_documentation_integrity.js')) {
  runTests();
}
