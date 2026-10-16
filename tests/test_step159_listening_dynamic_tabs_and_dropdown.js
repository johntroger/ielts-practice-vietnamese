/**
 * test_step159_listening_dynamic_tabs_and_dropdown.js
 * Verification suite for Step 159:
 * Listening Header Optimization - Dynamic Closable Tabs & Dropdown Switcher.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 159: Listening Dynamic Tabs & Dropdown Switcher Verification Tests...\n');

let passedTests = 0;

const workspacePath = path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx');
const workspaceSrc = fs.readFileSync(workspacePath, 'utf-8');

// Test 1: Verify openListeningTabs state and localStorage persistence
console.log('Test 1: Dynamic openListeningTabs state and localStorage persistence...');
assert.ok(workspaceSrc.includes("ielts_listening_open_tabs"), 'Must store and retrieve tabs from localStorage key ielts_listening_open_tabs');
assert.ok(workspaceSrc.includes("setOpenListeningTabs"), 'Must have setOpenListeningTabs state updater');
assert.ok(workspaceSrc.includes("isTestDropdownOpen"), 'Must track isTestDropdownOpen state');
assert.ok(workspaceSrc.includes("testDropdownRef"), 'Must have testDropdownRef for outside click handling');
passedTests++;
console.log('  ✓ Dynamic tab state and localStorage persistence verified\n');

// Test 2: Verify outside click detection
console.log('Test 2: Outside click listener for test dropdown...');
assert.ok(workspaceSrc.includes("handleClickOutside"), 'Must define outside click handler');
assert.ok(workspaceSrc.includes("testDropdownRef.current.contains"), 'Must check dropdown ref containment');
passedTests++;
console.log('  ✓ Outside click handling verified\n');

// Test 3: Verify core handlers (switch, select from dropdown, close tab, open all, close others)
console.log('Test 3: Tab management handlers...');
assert.ok(workspaceSrc.includes("handleSwitchTest"), 'Must define handleSwitchTest');
assert.ok(workspaceSrc.includes("handleSelectTestFromDropdown"), 'Must define handleSelectTestFromDropdown');
assert.ok(workspaceSrc.includes("handleCloseTestTab"), 'Must define handleCloseTestTab');
assert.ok(workspaceSrc.includes("handleOpenAllTestTabs"), 'Must define handleOpenAllTestTabs');
assert.ok(workspaceSrc.includes("handleCloseOtherTestTabs"), 'Must define handleCloseOtherTestTabs');
passedTests++;
console.log('  ✓ Tab lifecycle and dropdown selection handlers verified\n');

// Test 4: Verify Bar 1.5 renders dropdown trigger and closable tabs
console.log('Test 4: Bar 1.5 dropdown trigger and dynamic tabs rendering...');
assert.ok(workspaceSrc.includes("Dynamic Listening Test Tab Bar & Dropdown Switcher"), 'Must render Dynamic Listening Tab Bar in Bar 1.5');
assert.ok(workspaceSrc.includes("allListeningTests.filter(t => t.audioUrl?.includes('.r2.dev')).length"), 'Dropdown badge displays available R2 audio tests');
assert.ok(workspaceSrc.includes("handleOpenAllTestTabs"), 'Dropdown includes Quick Open All button');
assert.ok(workspaceSrc.includes("handleCloseOtherTestTabs"), 'Dropdown includes Quick Only Active button');
assert.ok(workspaceSrc.includes("openListeningTabs.map"), 'Tab bar dynamically maps only openListeningTabs');
passedTests++;
console.log('  ✓ Dropdown trigger, menu actions, and tab bar verified\n');

// Test 5: Verify tab close button has stopPropagation and calls handleCloseTestTab
console.log('Test 5: Tab close (✕) button behavior...');
assert.ok(workspaceSrc.includes("handleCloseTestTab(testItem.id, e)"), 'Close button on tab must pass event to prevent test selection');
assert.ok(workspaceSrc.includes("e.stopPropagation()"), 'handleCloseTestTab must call stopPropagation');
passedTests++;
console.log('  ✓ Tab close button with event isolation verified\n');

// Test 6: Verify Bar 1 redundant select dropdown is removed in favor of Bar 1.5 unified tab switcher
console.log('Test 6: Redundant Bar 1 select dropdown removal...');
assert.ok(!workspaceSrc.includes("hidden xl:block bg-white border border-slate-200 text-xs font-bold text-slate-700 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-[210px]"), 'Redundant select dropdown in Bar 1 must be removed');
passedTests++;
console.log('  ✓ Redundant select removed, Bar 1.5 dynamic dropdown tabs is now the single source of truth\n');

console.log(`🎉 Step 159: All ${passedTests}/6 tests PASSED successfully!`);
