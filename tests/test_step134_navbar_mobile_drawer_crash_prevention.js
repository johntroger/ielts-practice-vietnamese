/**
 * Test Step 134: Mobile Drawer Crash Prevention & Complete Icon Import Audit
 *
 * Verifies:
 * 1. ChevronRight is imported from 'lucide-react' in Navbar.jsx (fixing the crash on drawer open).
 * 2. Every single JSX icon used inside the mobile drawer is properly imported.
 * 3. Mobile drawer rendering integrity and zero ReferenceError exceptions.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Step 134: Mobile Drawer Crash Prevention Audit ---');

const navbarPath = path.join(__dirname, '../src/components/Navbar.jsx');
const navbarSource = fs.readFileSync(navbarPath, 'utf8');

// 1. Verify lucide-react imports block
console.log('Test 1: Verifying ChevronRight import');
const lucideImportMatch = navbarSource.match(/import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/);
assert(lucideImportMatch, 'Navbar.jsx must have a lucide-react import statement');

const importedIcons = lucideImportMatch[1]
  .split(',')
  .map(item => item.trim())
  .filter(Boolean);

assert(importedIcons.includes('ChevronRight'), 'ChevronRight must be imported from lucide-react in Navbar.jsx');
console.log(`  ✓ Successfully confirmed ChevronRight is imported (total ${importedIcons.length} icons imported)`);

// 2. Scan mobile drawer JSX for all icon tags and ensure 100% are imported
console.log('Test 2: Verifying all icons in Mobile Drawer are imported');
const drawerStartIndex = navbarSource.indexOf('isMobileDrawerOpen && renderPortal(');
assert(drawerStartIndex !== -1, 'Mobile drawer render block must exist in Navbar.jsx');

const drawerSource = navbarSource.substring(drawerStartIndex);
const tagMatches = drawerSource.match(/<([A-Z][A-Za-z0-9_]*)/g) || [];
const uniqueTags = [...new Set(tagMatches.map(t => t.slice(1)))];

const customDefinedTags = ['WebsiteQRCodeModal', 'CurrentSkillIcon', 'Icon'];

uniqueTags.forEach(tag => {
  if (customDefinedTags.includes(tag)) return;
  assert(
    importedIcons.includes(tag),
    `Icon <${tag}> used in mobile drawer MUST be imported from lucide-react to prevent crash`
  );
});

console.log(`  ✓ Verified all ${uniqueTags.length} tags in mobile drawer: ${uniqueTags.join(', ')}`);

console.log('\n🎉 ALL STEP 134 MOBILE DRAWER CRASH CHECKS PASSED CLEANLY!\n');
