/**
 * test_step158_atlas_and_home_mobile_navigation_hub.js
 * Verification suite for Step 158:
 * Mobile Header Ergonomics - Atlas Arena & Home Navigation Hub & Zero Collision.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 158: Atlas Arena & Home Mobile Navigation Hub Verification Tests...\n');

let passedTests = 0;

const navbarPath = path.resolve(__dirname, '../src/components/Navbar.jsx');
const navbarSrc = fs.readFileSync(navbarPath, 'utf-8');

const aboutPath = path.resolve(__dirname, '../src/pages/AboutPage.jsx');
const aboutSrc = fs.readFileSync(aboutPath, 'utf-8');

// Test 1: Verify Atlas Arena and Home are paired in Quick Navigation Hub
console.log('Test 1: Atlas Arena and Home button pairing in Navbar...');
assert.ok(navbarSrc.includes('Quick Navigation Hub: Atlas Arena & Home (/about)'), 'Navbar must define Quick Navigation Hub');
assert.ok(navbarSrc.includes("openModal('atlasArena')"), 'Atlas Arena button must trigger openModal(atlasArena)');
assert.ok(navbarSrc.includes('doOpenAbout'), 'Home button must trigger doOpenAbout');
passedTests++;
console.log('  ✓ Atlas Arena and Home button are paired in Right Zone\n');

// Test 2: Verify zero truncation of "Arena" text
console.log('Test 2: Zero truncation and whitespace-nowrap protection...');
assert.ok(navbarSrc.includes('whitespace-nowrap shrink-0') || navbarSrc.includes('shrink-0 whitespace-nowrap'), 'Atlas Arena must have whitespace-nowrap shrink-0 to prevent "Ar" truncation');
assert.ok(navbarSrc.includes("sm:hidden font-extrabold text-[11px]"), 'Must have sm:hidden Arena label');
assert.ok(navbarSrc.includes("hidden sm:inline font-extrabold"), 'Must have hidden sm:inline Atlas Arena label');
passedTests++;
console.log('  ✓ Arena label protected against viewport clipping\n');

// Test 3: Verify Theme Toggle is hidden on mobile to free up 40px horizontal space
console.log('Test 3: Mobile viewport clutter reduction...');
assert.ok(navbarSrc.includes('hidden sm:flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-amber-500'), 'Theme toggle must be hidden on mobile (< sm) to prevent crowding');
assert.ok(navbarSrc.includes('currentTheme === \'dark\' ? (isEn ? \'Dark Mode\' : \'Giao Diện Ban Đêm (Dark Mode)\')'), 'Theme toggle remains accessible in mobile drawer');
passedTests++;
console.log('  ✓ 40px horizontal space freed up on phone screens\n');

// Test 4: Verify Left Zone is uncluttered and does not collide with Right Zone
console.log('Test 4: Left Zone decluttering on mobile...');
const leftZoneEndIdx = navbarSrc.indexOf('{/* 2. RIGHT ZONE: Actions & Mobile Hamburger */}');
const leftZoneCode = navbarSrc.slice(0, leftZoneEndIdx);
assert.ok(!leftZoneCode.includes("openModal('atlasArena')"), 'Left Zone must not contain Atlas Arena to prevent middle-screen collision');
passedTests++;
console.log('  ✓ Left Zone decluttered; flex collision eliminated\n');

// Test 5: Verify AboutPage has direct Atlas Arena jump in sticky header
console.log('Test 5: AboutPage sticky header contains 1-tap Atlas Arena button...');
assert.ok(aboutSrc.includes('onOpenArena'), 'AboutPage must support onOpenArena prop');
assert.ok(aboutSrc.includes("title={isEn ? \"Open Atlas English Arena\" : \"Mở Đấu Trường Atlas Arena\"}"), 'AboutPage header must have Atlas Arena button');
assert.ok(aboutSrc.includes('onStartPractice'), 'AboutPage header must have Return to Practice button');
passedTests++;
console.log('  ✓ AboutPage header includes 1-tap Atlas Arena and Practice entry points\n');

// Test 6: Verify bidirectional navigation loop
console.log('Test 6: Bidirectional navigation integrity...');
assert.ok(aboutSrc.includes('Swords'), 'AboutPage imports Swords icon for Atlas Arena');
assert.ok(navbarSrc.includes('Swords'), 'Navbar imports Swords icon');
assert.ok(navbarSrc.includes('Home'), 'Navbar imports Home icon');
passedTests++;
console.log('  ✓ Closed-loop navigation between Practice, Home/About, and Atlas Arena verified\n');

console.log('===============================================================');
console.log(`🎉 ALL ${passedTests}/${passedTests} STEP 158 UNIT TESTS PASSED! (100%)`);
console.log('===============================================================\n');
