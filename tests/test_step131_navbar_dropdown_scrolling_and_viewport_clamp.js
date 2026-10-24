/**
 * Test Step 131: Navbar Dropdown Scrolling & Viewport Clamp Audit
 *
 * Verifies:
 * 1. All desktop & mobile dropdowns have viewport clamping (max-h-[calc(100vh-80px)] or equivalent).
 * 2. All dropdowns have overflow-y-auto so users can scroll long item lists (Practice, Tools, Progress, Skills).
 * 3. Overscroll containment is enabled to prevent page background bouncing when scrolling dropdowns.
 * 4. Dropdown width expanded to w-72 for rich multi-line cards without cramping.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Step 131: Navbar Dropdown Scrolling & Viewport Clamp Audit ---');

const navbarPath = path.join(__dirname, '../src/components/Navbar.jsx');
const navbarSource = fs.readFileSync(navbarPath, 'utf8');

const normalizedNavbarSource = navbarSource.replace(/100dvh-(?:72|80)px/g, '100vh-80px');

// 1. Practice Menu (Luyện Tập)
console.log('Test 1: Verifying Practice menu (Luyện Tập) has vertical scrolling and max-height');
assert(
  normalizedNavbarSource.includes('isPracticeMenuOpen && (') &&
  normalizedNavbarSource.includes('max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50'),
  'Practice menu must have max-h viewport clamp, overflow-y-auto and overscroll-contain'
);

// 2. Tools Menu (Công Cụ)
console.log('Test 2: Verifying Tools menu (Công Cụ) has vertical scrolling and max-height');
assert(
  normalizedNavbarSource.includes('isToolsMenuOpen && (') &&
  normalizedNavbarSource.includes('w-72 max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain'),
  'Tools menu must have max-h viewport clamp, overflow-y-auto and overscroll-contain'
);

// 3. Progress Menu (Tiến Độ)
console.log('Test 3: Verifying Progress menu (Tiến Độ) has vertical scrolling and max-height');
assert(
  normalizedNavbarSource.includes('isProgressMenuOpen && (') &&
  normalizedNavbarSource.includes('w-72 max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain'),
  'Progress menu must have max-h viewport clamp, overflow-y-auto and overscroll-contain'
);

// 4. Skills Menu (Desktop)
console.log('Test 4: Verifying Skills menu (Desktop) has vertical scrolling and max-height');
assert(
  normalizedNavbarSource.includes('isSkillMenuOpen && (') &&
  normalizedNavbarSource.includes('w-64 max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain'),
  'Desktop Skills menu must have max-h viewport clamp and overflow-y-auto'
);

// 5. Skills Menu (Mobile Pill)
console.log('Test 5: Verifying Skills menu (Mobile Pill) has vertical scrolling and max-height');
assert(
  normalizedNavbarSource.includes('mobileSkillMenuOpen && (') &&
  normalizedNavbarSource.includes('w-60 max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain'),
  'Mobile Skills menu must have max-h viewport clamp and overflow-y-auto'
);

console.log('\n🎉 ALL STEP 131 DROPDOWN SCROLLING CHECKS PASSED CLEANLY!\n');
