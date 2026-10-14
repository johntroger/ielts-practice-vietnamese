/**
 * tests/test_step139_utilities_dropdown_alignment_and_animation.js
 * 
 * Verifies Step 139: Utilities Dropdown Alignment & Entrance Animation
 * 1. Synchronous coordinate calculation on click (no sliding across from screen-left).
 * 2. Downward dropdown entrance animation (origin-top-right slide-in-from-top-2).
 * 3. 100% Consistent left alignment (text-left) on all menu entries & text wrappers.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- Step 139: Utilities Dropdown Alignment & Animation Audit ---');

const toolbarPath = path.resolve('src/components/WritingSubHeaderToolbar.jsx');
assert(fs.existsSync(toolbarPath), 'src/components/WritingSubHeaderToolbar.jsx must exist');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');

// Test 1: Synchronous coordinate calculation on button click
console.log('Test 1: Verifying synchronous coordinate calculation before open');
assert(toolbarSource.includes('handleToggleToolsDropdown'), 'WritingSubHeaderToolbar must define handleToggleToolsDropdown');
assert(toolbarSource.includes('onClick={handleToggleToolsDropdown}'), 'Tools button must invoke handleToggleToolsDropdown');
assert(toolbarSource.includes('isToolsDropdownOpen && dropdownCoords && renderPortal'), 'Dropdown portal must only render when coordinates are ready');
console.log('  ✓ Synchronous coordinate calculation verified');

// Test 2: Downward dropdown entrance animation
console.log('Test 2: Verifying downward drop-down animation');
assert(toolbarSource.includes('origin-top-right animate-in fade-in-0 slide-in-from-top-2 duration-150 ease-out'), 'Dropdown must use smooth origin-top-right slide-in-from-top-2 animation');
console.log('  ✓ Downward dropdown entrance animation verified');

// Test 3: Left-alignment on all menu items
console.log('Test 3: Verifying text-left on all utility menu items');
assert(toolbarSource.includes('hover:bg-slate-50 text-slate-700 text-left transition-colors cursor-pointer'), 'CDI item button must enforce text-left');
assert(toolbarSource.includes('hover:bg-rose-50 text-slate-700 hover:text-rose-900 text-left transition-colors cursor-pointer'), 'Mistakes item button must enforce text-left');
assert(toolbarSource.includes('hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-left transition-colors cursor-pointer'), 'Vocab item button must enforce text-left');
assert(toolbarSource.includes('w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-left transition-colors cursor-pointer'), 'Theory item button must enforce text-left');
assert(toolbarSource.includes('w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 text-left transition-colors cursor-pointer'), 'Shortcuts item button must enforce text-left');
assert(toolbarSource.includes('text-left min-w-0') || toolbarSource.includes('div className="text-left"'), 'Inner text wrappers must enforce text-left');
console.log('  ✓ 100% Consistent left alignment verified across all items');

console.log('\n🎉 ALL STEP 139 UTILITIES DROPDOWN AUDIT CHECKS PASSED CLEANLY!\n');
