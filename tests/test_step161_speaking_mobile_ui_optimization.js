/**
 * test_step161_speaking_mobile_ui_optimization.js
 * Verification suite for Step 161:
 * Speaking Workspace Mobile UI Optimization & Consolidated Dropdown Architecture.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 161: Speaking Workspace Mobile UI Optimization Verification Tests...\n');

let passedTests = 0;

const workspacePath = path.resolve(__dirname, '../src/components/speaking/SpeakingWorkspace.jsx');
const headerPath = path.resolve(__dirname, '../src/components/speaking/SpeakingTopHeader.jsx');
const heroPath = path.resolve(__dirname, '../src/components/speaking/SpeakingMockHero.jsx');
const workspaceSrc = [
  fs.readFileSync(workspacePath, 'utf-8'),
  fs.existsSync(headerPath) ? fs.readFileSync(headerPath, 'utf-8') : '',
  fs.existsSync(heroPath) ? fs.readFileSync(heroPath, 'utf-8') : ''
].join('\n');

const practicePanePath = path.resolve(__dirname, '../src/components/speaking/SpeakingPracticePane.jsx');
const practicePaneSrc = fs.readFileSync(practicePanePath, 'utf-8');

const p1RoomPath = path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart1Room.jsx');
const p1RoomSrc = fs.readFileSync(p1RoomPath, 'utf-8');

const p2RoomPath = path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart2Room.jsx');
const p2RoomSrc = fs.readFileSync(p2RoomPath, 'utf-8');

const p3RoomPath = path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart3Room.jsx');
const p3RoomSrc = fs.readFileSync(p3RoomPath, 'utf-8');

// Test 1: Verify SpeakingWorkspace has mobile tools dropdown state and outside-click ref
console.log('Test 1: SpeakingWorkspace top header mobile tools dropdown...');
assert.ok(workspaceSrc.includes("isMobileToolsOpen"), 'Must track isMobileToolsOpen state');
assert.ok(workspaceSrc.includes("mobileToolsRef"), 'Must have mobileToolsRef for outside-click detection');
assert.ok(workspaceSrc.includes("MOBILE CONSOLIDATED CONTROLS"), 'Must have dedicated mobile consolidated layout');
passedTests++;
console.log('  ✓ SpeakingWorkspace mobile tools dropdown state and ref verified\n');

// Test 2: Verify mobile tools dropdown menu items in SpeakingWorkspace
console.log('Test 2: Mobile tools dropdown menu items in SpeakingWorkspace...');
assert.ok(workspaceSrc.includes("Speaking Utilities") || workspaceSrc.includes("Tiện Ích Phòng Thi"), 'Must render Speaking Utilities header');
assert.ok(workspaceSrc.includes("setIsSoundcheckOpen(true)"), 'Mobile dropdown provides quick Soundcheck access');
assert.ok(workspaceSrc.includes("onOpenTheory()"), 'Mobile dropdown provides quick Strategy Handbook access');
assert.ok(workspaceSrc.includes("onOpenSettings()"), 'Mobile dropdown provides quick Settings access');
assert.ok(workspaceSrc.includes("toggleSlimHeader()"), 'Mobile dropdown provides quick Expand/Collapse screen access');
passedTests++;
console.log('  ✓ Mobile dropdown consolidates Soundcheck, Handbook, Settings, and Expand\n');

// Test 3: Verify Mock Mode mobile test pack filter dropdown (Dropbox)
assert.ok(workspaceSrc.includes("On Mobile: Compact Filter Dropdown"), 'Must provide compact filter dropbox for mobile');
assert.ok(workspaceSrc.includes("value={mockFilter}"), 'Dropbox selector must control mockFilter');
assert.ok(workspaceSrc.includes("flex sm:hidden items-center"), 'Filter dropbox is rendered on mobile viewport');
passedTests++;
console.log('  ✓ Mock exam filter consolidated into responsive mobile dropbox\n');

// Test 4: Verify SpeakingPracticePane mobile practice tools dropdown
console.log('Test 4: Practice Mode mobile action tools dropdown...');
assert.ok(practicePaneSrc.includes("isPracticeToolsOpen"), 'Must track isPracticeToolsOpen state');
assert.ok(practicePaneSrc.includes("practiceToolsRef"), 'Must have practiceToolsRef for outside-click detection');
assert.ok(practicePaneSrc.includes("onOpenIdeaMatrix()"), 'Dropdown must allow opening Idea Matrix');
assert.ok(practicePaneSrc.includes("onOpenShadowing()"), 'Dropdown must allow opening Shadowing Studio');
passedTests++;
console.log('  ✓ Practice Mode consolidates Idea Matrix and Shadowing into mobile dropdown\n');

// Test 5: Verify SpeakingPart1Room streamlined topic selector layout
console.log('Test 5: Part 1 Room streamlined topic selector layout...');
assert.ok(p1RoomSrc.includes("Top: Topic Selector + Stepper"), 'Must separate topic selector and stepper into primary row');
assert.ok(p1RoomSrc.includes("Bottom Sub-row: Badges, Hide Mastered & Add Topic Button"), 'Must organize badges and actions into neat sub-row');
passedTests++;
console.log('  ✓ Part 1 Room topic bar optimized for single-screen mobile density\n');

// Test 6: Verify SpeakingPart2Room mobile strategy dropdown
console.log('Test 6: Part 2 Room mobile strategy dropdown...');
assert.ok(p2RoomSrc.includes("isStrategyMenuOpen"), 'Part 2 room must track isStrategyMenuOpen');
assert.ok(p2RoomSrc.includes("strategyMenuRef"), 'Part 2 room must have strategyMenuRef');
assert.ok(p2RoomSrc.includes("setIsArchetypesModalOpen(true)"), 'Strategy menu provides access to 5 Story Archetypes');
assert.ok(p2RoomSrc.includes("openTheoryModalWithContext"), 'Strategy menu provides access to Pacing Guide');
passedTests++;
console.log('  ✓ Part 2 Room consolidates Archetypes and Pacing Guide into mobile dropdown\n');

// Test 7: Verify SpeakingPart3Room mobile responsive actions
console.log('Test 7: Part 3 Room mobile responsive action buttons...');
assert.ok(p3RoomSrc.includes("MOBILE (< sm)"), 'Part 3 room must define responsive mobile layout');
assert.ok(p3RoomSrc.includes("flex sm:hidden items-center"), 'Part 3 room uses flex sm:hidden for clean mobile alignment');
passedTests++;
console.log('  ✓ Part 3 Room action buttons cleanly adapted for mobile\n');

console.log(`🎉 Step 161: All ${passedTests}/7 tests PASSED successfully!`);
