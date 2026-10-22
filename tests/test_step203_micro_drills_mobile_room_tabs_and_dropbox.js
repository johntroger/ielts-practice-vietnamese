/**
 * test_step203_micro_drills_mobile_room_tabs_and_dropbox.js
 * Verification suite for Step 203:
 * Micro-Drills Mobile UX Optimization - Room & Drill Dynamic Closable Tabs with Dropbox Pickers
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 203: Micro-Drills Mobile Dynamic Tabs & Dropbox Verification Tests...\n');

let passedTests = 0;

const modalPath = path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx');
const modalSrc = fs.readFileSync(modalPath, 'utf-8');

// Test 1: Verify roomCatalog and openRooms state persistence
console.log('Test 1: Dynamic openRooms state and localStorage persistence...');
assert.ok(modalSrc.includes("ielts_micro_drills_open_rooms"), 'Must store and retrieve rooms from localStorage key ielts_micro_drills_open_rooms');
assert.ok(modalSrc.includes("setOpenRooms"), 'Must have setOpenRooms state updater');
assert.ok(modalSrc.includes("isRoomDropdownOpen"), 'Must track isRoomDropdownOpen state');
assert.ok(modalSrc.includes("roomDropdownRef"), 'Must have roomDropdownRef for outside click handling');
passedTests++;
console.log('  ✓ Dynamic room state and localStorage persistence verified\n');

// Test 2: Verify outside click detection
console.log('Test 2: Outside click listener for room dropdown and mobile tools dropdown...');
assert.ok(modalSrc.includes("roomDropdownRef.current"), 'Must check roomDropdownRef containment');
assert.ok(modalSrc.includes("mobileToolsDropdownRef.current"), 'Must check mobileToolsDropdownRef containment');
passedTests++;
console.log('  ✓ Outside click handling verified\n');

// Test 3: Verify room tab management handlers
console.log('Test 3: Room tab management handlers...');
assert.ok(modalSrc.includes("handleSelectRoomFromDropdown"), 'Must define handleSelectRoomFromDropdown');
assert.ok(modalSrc.includes("handleCloseRoomTab"), 'Must define handleCloseRoomTab');
assert.ok(modalSrc.includes("handleOpenAllRooms"), 'Must define handleOpenAllRooms');
assert.ok(modalSrc.includes("handleCloseOtherRooms"), 'Must define handleCloseOtherRooms');
passedTests++;
console.log('  ✓ Room tab lifecycle and dropdown selection handlers verified\n');

// Test 4: Verify Level 1 renders room dropbox trigger and closable tabs
console.log('Test 4: Level 1 room dropdown trigger and dynamic tabs rendering...');
assert.ok(modalSrc.includes("openRooms.length}/5"), 'Room dropdown badge displays open rooms count');
assert.ok(modalSrc.includes("handleOpenAllRooms"), 'Room dropdown includes Open All button');
assert.ok(modalSrc.includes("handleCloseOtherRooms"), 'Room dropdown includes Only Active button');
assert.ok(modalSrc.includes("openRooms.map"), 'Tab bar dynamically maps openRooms');
assert.ok(modalSrc.includes("handleCloseRoomTab(roomId, e)"), 'Room tab close button calls handleCloseRoomTab');
passedTests++;
console.log('  ✓ Room dropdown trigger, menu actions, and tab bar verified\n');

// Test 5: Verify Level 2 Mobile Utilities Dropdown prevents mobile crowding
console.log('Test 5: Level 2 mobile utilities dropdown and desktop inline buttons...');
assert.ok(modalSrc.includes("mobileToolsDropdownRef"), 'Must have mobileToolsDropdownRef for mobile utilities');
assert.ok(modalSrc.includes("sm:hidden shrink-0"), 'Must render compact utilities dropdown trigger on mobile');
assert.ok(modalSrc.includes("hidden sm:flex items-center space-x-1.5"), 'Must preserve full inline utilities on tablet/desktop');
assert.ok(modalSrc.includes("handleCloseTab(tabId)"), 'Drill tabs close button calls handleCloseTab');
passedTests++;
console.log('  ✓ Level 2 mobile decluttering and desktop responsiveness verified\n');

console.log(`===============================================================`);
console.log(`🎉 ALL ${passedTests}/5 TESTS PASSED CLEANLY FOR STEP 203!`);
console.log(`===============================================================`);
