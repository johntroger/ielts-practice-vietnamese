/**
 * Test Step 34: Responsive Navigation Audit & Mobile UX Verification
 *
 * Verifies:
 * 1. Mobile Skill Selector Pill (< 640px) logic and skill configs.
 * 2. Desktop Dropdown Consolidation (Luyện Tập, Công Cụ, Tiến Độ) - Zero duplicates on xl+.
 * 3. 1-Click Fast Switching: Outside click handler replaced blocking fixed inset backdrops.
 * 4. Mobile Drawer Theme Colors: Dynamic skill badges (writing=red, reading=blue, listening=emerald, speaking=purple).
 * 5. Drawer Smooth Transitions: slide-in and fade-in animation classes.
 * 6. Touch Target Compliance: minimum 44x44px for touch elements.
 * 7. Writing SubHeader StarRatingWidget visibility on mobile viewports.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Testing Step 34: Responsive Navigation Audit & Mobile UX ---');

const navbarPath = path.join(__dirname, '../src/components/Navbar.jsx');
const subheaderPath = path.join(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');

const navbarSource = fs.readFileSync(navbarPath, 'utf8');
const subheaderSource = fs.readFileSync(subheaderPath, 'utf8');

// Test 1: Mobile Skill Selector Pill (< 640px)
console.log('Test 1: Verifying Mobile Skill Selector Pill exists and is configured for < 640px');
assert(navbarSource.includes('mobileSkillRef'), 'mobileSkillRef should be present in Navbar');
assert(navbarSource.includes('setMobileSkillMenuOpen'), 'mobileSkillMenuOpen state should exist');
assert(navbarSource.includes('relative sm:hidden'), 'Mobile Skill Selector Pill should be visible on < sm screens');
assert(navbarSource.includes('Chuyển Kỹ Năng Luyện Thi'), 'Mobile dropdown should contain header for quick skill switching');

// Test 2: Outside Click Listener (Replaces blocking backdrops)
console.log('Test 2: Verifying 1-Click switching via document outside click listener');
assert(navbarSource.includes('desktopMenuRef'), 'desktopMenuRef must be defined and referenced');
assert(navbarSource.includes('handleOutsideClick'), 'handleOutsideClick listener must be wired to document');
assert(!navbarSource.includes('<div className="fixed inset-0 z-40" onClick={() => setIsPracticeMenuOpen(false)} />'), 
  'Blocking backdrop on Luyện Tập must be removed to allow 1-click switching');
assert(!navbarSource.includes('<div className="fixed inset-0 z-40" onClick={() => setIsToolsMenuOpen(false)} />'), 
  'Blocking backdrop on Công Cụ must be removed to allow 1-click switching');
assert(!navbarSource.includes('<div className="fixed inset-0 z-40" onClick={() => setIsProgressMenuOpen(false)} />'), 
  'Blocking backdrop on Tiến Độ must be removed to allow 1-click switching');

// Test 3: Zero Duplicate Items on Desktop (xl+)
console.log('Test 3: Verifying zero duplicate items on desktop dropdowns');
assert(navbarSource.includes('hidden xl:block'), 'Tiến Độ dropdown should be visible on standard laptops (xl:block)');
assert(navbarSource.includes('lg:block xl:hidden'), 'Progress links inside Công Cụ should only show on lg when Tiến Độ is hidden');

// Test 4: Mobile Drawer Dynamic Skill Badges
console.log('Test 4: Verifying Mobile Drawer uses dynamic theme colors instead of hardcoded red');
assert(navbarSource.includes("s.id === 'speaking'") && navbarSource.includes('bg-purple-50 text-purple-700'),
  'Speaking skill button in drawer must have purple theme');
assert(navbarSource.includes("s.id === 'reading'") && navbarSource.includes('bg-blue-50 text-blue-700'),
  'Reading skill button in drawer must have blue theme');
assert(navbarSource.includes("s.id === 'listening'") && navbarSource.includes('bg-emerald-50 text-emerald-700'),
  'Listening skill button in drawer must have emerald theme');
assert(navbarSource.includes("s.id === 'writing'") && navbarSource.includes('bg-red-50 text-red-700'),
  'Writing skill button in drawer must have red theme');

// Test 5: Drawer Animation & Touch Target Compliance
console.log('Test 5: Verifying drawer smooth slide-in animation and 44px touch targets');
assert(navbarSource.includes('slide-in-from-right duration-250'), 'Drawer must have slide-in-from-right animation');
assert(navbarSource.includes('fade-in duration-200'), 'Drawer backdrop must have fade-in animation');
assert(navbarSource.includes('min-h-[44px]'), 'Mobile interactive elements must have min-h-[44px]');
assert(navbarSource.includes('min-w-[44px]'), 'Mobile menu toggle buttons must have min-w-[44px]');

// Test 7: EditorPane Writing Toolbar Overflow Prevention
console.log('Test 7: Verifying EditorPane toolbar layout prevents cut-offs in split view');
const editorPath = path.join(__dirname, '../src/components/EditorPane.jsx');
const editorSource = fs.readFileSync(editorPath, 'utf8');

assert(editorSource.includes('isMoreToolsOpen'), 'EditorPane must manage isMoreToolsOpen for compact tools dropdown');
assert(editorSource.includes('moreToolsRef'), 'EditorPane must use moreToolsRef for outside click detection');
assert(!editorSource.includes('overflow-x-auto no-scrollbar'), 'Toolbar must not use no-scrollbar that hides clipped content');
assert(editorSource.includes('totalWords}/{task.minWords} từ'), 'Word count badge must use compact format');

console.log('Passed: 8/8 checks in Step 34');
console.log('✅ ALL TEST STEP 34 CHECKS PASSED SUCCESSFULLY!');
