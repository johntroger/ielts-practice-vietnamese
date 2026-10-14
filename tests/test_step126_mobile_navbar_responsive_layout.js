/**
 * test_step126_mobile_navbar_responsive_layout.js
 * Verification test for Step 126:
 * Mobile Top Navbar Responsive Layout, Zero Truncation & Hamburger Accessibility Audit
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Testing Step 126: Mobile Top Navbar Responsive Layout & Ergonomics...\n');

const navbarSource = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf-8');

it('Navbar left zone container uses min-w-0 and tight mobile spacing', () => {
  assert(navbarSource.includes('min-w-0'), 'Left zone container must have min-w-0 to prevent flex blowout');
  assert(navbarSource.includes('space-x-1.5 sm:space-x-3.5'), 'Left zone must use tight space-x-1.5 on mobile');
});

it('Atlas Arena has compact label on mobile (< sm) and full label on tablet/desktop', () => {
  assert(navbarSource.includes("hidden sm:inline font-extrabold"), 'Must have hidden sm:inline for full Atlas Arena label');
  assert(navbarSource.includes("sm:hidden font-extrabold text-[11px]"), 'Must have sm:hidden for compact Arena label on mobile');
});

it('Micro-Drills button is hidden on small mobile viewports (hidden md:flex) to prevent truncation', () => {
  assert(navbarSource.includes("hidden md:flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 xl:px-3 py-1.5 rounded-xl border border-amber-200"), 
    'Micro-Drills button on top bar must be hidden on phone viewports to prevent truncation');
});

it('Micro-Drills deliberate practice remains accessible inside the mobile drawer', () => {
  assert(navbarSource.includes("doOpenDrills(); setIsMobileDrawerOpen(false);"), 
    'Micro-Drills must be accessible in mobile drawer');
  assert(navbarSource.includes("Micro-Drills (Deliberate Practice)") || navbarSource.includes("Micro-Drills (Luyện Kỹ Năng Vi Mô)"), 
    'Micro-Drills label must exist in mobile drawer');
});

it('API Key indicator button is hidden on mobile phones (hidden sm:flex) to prevent hamburger off-screen push', () => {
  assert(navbarSource.includes("hidden sm:flex items-center justify-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold"),
    'API Key button on top navbar must be hidden on mobile phones (< sm)');
});

it('Hamburger menu button has responsive dimensions and amber notification badge when API key is missing', () => {
  assert(navbarSource.includes("w-9 h-9 sm:w-11 sm:h-11"), 'Hamburger menu must have compact w-9 h-9 on phone');
  assert(navbarSource.includes("!apiKey &&"), 'Hamburger menu must check !apiKey');
  assert(navbarSource.includes("sm:hidden absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-500"), 
    'Hamburger menu must render amber pulse badge on mobile when API key is not configured');
});

it('Mobile drawer maintains full settings, language toggle, and dark mode controls', () => {
  assert(navbarSource.includes("Language Toggle in Mobile Drawer"), 'Mobile drawer must have language toggle');
  assert(navbarSource.includes("Dark Mode Toggle in Mobile Drawer"), 'Mobile drawer must have theme toggle');
  assert(navbarSource.includes("System & AI API Settings"), 'Mobile drawer must have settings & API key item');
});

it('Desktop layout retains all full menu dropdowns, mock test hero CTA, and user profile', () => {
  assert(navbarSource.includes("hidden xl:flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600"),
    'Desktop mock test button must remain intact');
  assert(navbarSource.includes("Practice & Test Bank"), 'Practice dropdown on desktop intact');
  assert(navbarSource.includes("Learning progress & guides"), 'Progress dropdown on desktop intact');
  assert(navbarSource.includes("hidden xl:flex items-center space-x-1 sm:space-x-1.5 px-2 2xl:px-2.5 py-1.5 rounded-xl border text-xs font-bold"),
    'Desktop user profile button intact');
});

console.log(`\n===============================================================`);
console.log(`✅ All ${passed}/${total} Step 126 mobile top navbar tests passed cleanly!`);
console.log(`===============================================================\n`);
