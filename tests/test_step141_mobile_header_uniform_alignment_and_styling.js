/**
 * Test Step 141: Mobile Header Uniform Alignment & Harmonious Styling Audit
 *
 * Verifies:
 * 1. Mobile Logo, Skill Selector, and Arena button have uniform h-9 (36px) baseline height.
 * 2. Right zone utility buttons (Home, Language, Theme, Hamburger) have harmonious h-9 height, rounded-xl radius, and clean bg-slate-50 surfaces.
 * 3. Home icon button is seamlessly integrated with neutral border-slate-200 bg-slate-50 instead of clashing colors.
 * 4. All mobile header elements align along a single horizontal baseline without jagged height steps.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Step 141: Mobile Header Uniform Alignment & Harmonious Styling Audit ---');

const navbarPath = path.join(__dirname, '../src/components/Navbar.jsx');
const navbarSource = fs.readFileSync(navbarPath, 'utf8');

// 1. Left Zone Height Uniformity (Logo, Skill Selector, Arena)
console.log('Test 1: Verifying Left Zone elements have consistent h-9 height');
assert(
  navbarSource.includes('w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600'),
  'Logo must use w-9 h-9 on mobile to match button heights'
);
assert(
  navbarSource.includes('px-2.5 h-9 rounded-xl border text-xs font-bold'),
  'Mobile Skill selector must have fixed h-9 height for perfect vertical centering'
);
assert(
  navbarSource.includes('h-9 sm:h-10 rounded-xl border border-purple-200'),
  'Arena button must have h-9 height on mobile to align with Skill selector'
);

// 2. Right Zone Utility Group Uniformity (Home, Language, Theme, Hamburger)
console.log('Test 2: Verifying Right Zone utility buttons have harmonious slate styling');
assert(
  navbarSource.includes('w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600'),
  'Home button must use cohesive bg-slate-50 border-slate-200 styling'
);
assert(
  navbarSource.includes('px-2 h-9 sm:px-2.5 sm:h-10 rounded-xl border border-slate-200 bg-slate-50'),
  'Language toggle must have consistent h-9 height and slate surface'
);
assert(
  navbarSource.includes('w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-slate-50'),
  'Theme toggle must have consistent h-9 height and slate surface'
);
assert(
  navbarSource.includes('w-9 h-9 sm:w-11 sm:h-11 min-w-[36px] sm:min-w-[44px] min-h-[36px] sm:min-h-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700'),
  'Hamburger button must use matching bg-slate-50 surface'
);

// 3. Spacing & Clamping Integrity
console.log('Test 3: Verifying gaps between zones and items');
assert(
  navbarSource.includes('flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-2'),
  'Navbar row 1 container must have balanced gap between left and right zones'
);
assert(
  navbarSource.includes('flex items-center gap-1 sm:gap-1.5 xl:gap-1.5 2xl:gap-2 shrink-0'),
  'Right zone must maintain rhythmic spacing across breakpoints'
);

console.log('✅ All 3/3 Mobile Header Uniform Alignment & Harmonious Styling Audit checks passed!');
