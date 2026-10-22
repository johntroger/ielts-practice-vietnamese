/**
 * test_step192_clean_mobile_ui_optimization.js
 * 
 * Verification suite for Step 192:
 * Clean Mobile UI Optimization & Ergonomics Audit
 * 1. Top Navbar Right Zone decluttering on phones (< sm) via hidden sm:flex on Arena/Home hub.
 * 2. Mobile Drawer 4-category reorganization (Practice, Study, Progress, Settings) with pill filter.
 * 3. Writing SubHeader Toolbar mobile decluttering (hidden sm:flex on AI Gen and Minimal/Pro, folded into Tools).
 * 4. Reading Workspace mobile decluttering (hidden sm:flex on direct AI Gen, accessible in Tools dropdown).
 * 5. App.jsx mobile banner de-stacking (only 1 primary banner shown on phones at a time).
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 192: Clean Mobile UI Optimization Audit...\n');

let passedTests = 0;

// Test 1: Top Navbar Right Zone decluttering on phone screens
console.log('Test 1: Top Navbar Right Zone decluttering on mobile (< sm)...');
const navbarPath = path.resolve(__dirname, '../src/components/Navbar.jsx');
const navbarSrc = fs.readFileSync(navbarPath, 'utf-8');

assert.ok(navbarSrc.includes('hidden sm:flex items-center space-x-1 sm:space-x-1.5 shrink-0'), 
  'Navbar must hide Arena/Home direct header buttons on mobile (< sm) to prevent crowding');
assert.ok(navbarSrc.includes("openModal('atlasArena')"), 'Atlas Arena launcher remains intact in Navbar');
assert.ok(navbarSrc.includes('doOpenAbout'), 'Home /about launcher remains intact in Navbar');
passedTests++;
console.log('  ✓ Top Navbar Right Zone cleanly decluttered on phone viewports\n');

// Test 2: Mobile Drawer 4-Category Reorganization with Segmented Pills
console.log('Test 2: Mobile Drawer 4-category segmented filter pills...');
assert.ok(navbarSrc.includes("mobileDrawerCategory, setMobileDrawerCategory"), 'Navbar must manage mobileDrawerCategory state');
assert.ok(navbarSrc.includes("id: 'practice', label: isEn ? 'Practice' : 'Luyện Thi'"), 'Drawer has Practice category tab');
assert.ok(navbarSrc.includes("id: 'study', label: isEn ? 'Study' : 'Học Liệu'"), 'Drawer has Study category tab');
assert.ok(navbarSrc.includes("id: 'progress', label: isEn ? 'Progress' : 'Tiến Độ'"), 'Drawer has Progress category tab');
assert.ok(navbarSrc.includes("id: 'system', label: isEn ? 'Settings' : 'Cài Đặt'"), 'Drawer has Settings category tab');
passedTests++;
console.log('  ✓ Mobile Drawer 4-category segmented control verified\n');

// Test 3: Drawer Content Categorization & Zero-Leak Preservation
console.log('Test 3: Drawer categorized blocks & critical entry preservation...');
assert.ok(navbarSrc.includes("mobileDrawerCategory === 'all' || mobileDrawerCategory === 'practice'"), 'Practice category filtering active');
assert.ok(navbarSrc.includes("mobileDrawerCategory === 'all' || mobileDrawerCategory === 'study'"), 'Study category filtering active');
assert.ok(navbarSrc.includes("mobileDrawerCategory === 'all' || mobileDrawerCategory === 'progress'"), 'Progress category filtering active');
assert.ok(navbarSrc.includes("mobileDrawerCategory === 'all' || mobileDrawerCategory === 'system'"), 'System category filtering active');
assert.ok(navbarSrc.includes("Language Toggle in Mobile Drawer"), 'Language toggle in mobile drawer intact');
assert.ok(navbarSrc.includes("Dark Mode Toggle in Mobile Drawer"), 'Dark mode toggle in mobile drawer intact');
assert.ok(navbarSrc.includes("System & AI API Settings"), 'System & AI API settings in mobile drawer intact');
passedTests++;
console.log('  ✓ Drawer clean categories and all essential entry points verified\n');

// Test 4: Writing SubHeader Toolbar mobile decluttering
console.log('Test 4: Writing SubHeader Toolbar mobile decluttering...');
const writingToolbarPath = path.resolve(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
const writingToolbarSrc = fs.readFileSync(writingToolbarPath, 'utf-8');

assert.ok(writingToolbarSrc.includes('hidden sm:flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50'),
  'Writing direct AI prompt gen button must be hidden on mobile phones to free space for task title');
assert.ok(writingToolbarSrc.includes('hidden sm:inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/90 text-xs shrink-0 shadow-2xs'),
  'Minimal/Pro toggle pill must be hidden on mobile phones to prevent row wrapping');
assert.ok(writingToolbarSrc.includes('AI Prompt Generator (Convenient 1-tap in Tools Menu on phone & tablet)'),
  'AI Prompt Generator must be accessible inside Tools dropdown popover');
assert.ok(writingToolbarSrc.includes('Minimal Focus View Mode Toggle'),
  'Minimal/Pro toggle remains fully accessible in Tools dropdown popover');
passedTests++;
console.log('  ✓ Writing SubHeader Toolbar uncluttered on phones\n');

// Test 5: Reading Workspace mobile decluttering
console.log('Test 5: Reading Workspace mobile toolbar decluttering...');
const readingPath = path.resolve(__dirname, '../src/components/reading/ReadingWorkspace.jsx');
const readingSrc = fs.readFileSync(readingPath, 'utf-8');

assert.ok(readingSrc.includes('hidden sm:flex items-center space-x-1 px-2 py-1 rounded-xl bg-purple-50'),
  'Reading direct AI prompt gen button must be hidden on phone viewports');
assert.ok(readingSrc.includes("t('reading.generateAi', 'Sinh Đề Reading Mới (AI)')"),
  'Reading AI prompt gen must be accessible inside Utilities menu popover');
passedTests++;
console.log('  ✓ Reading Workspace mobile toolbar uncluttered\n');

// Test 6: App.jsx mobile banner stacking prevention
console.log('Test 6: App.jsx mobile banner de-stacking...');
const appPath = path.resolve(__dirname, '../src/App.jsx');
const appSrc = fs.readFileSync(appPath, 'utf-8');

assert.ok(appSrc.includes("${(!apiKey && !isApiKeyBannerDismissed) ? 'hidden sm:flex' : ''}"),
  'Beginner guidance banner must subordinate to API key banner on phones to avoid stacking 2 tall banners');
passedTests++;
console.log('  ✓ Mobile banner de-stacking confirmed\n');

console.log('===============================================================');
console.log(`🎉 ALL ${passedTests}/${passedTests} STEP 192 CLEAN MOBILE TESTS PASSED! (100%)`);
console.log('===============================================================\n');
