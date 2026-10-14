/**
 * Test Step 132: Writing SubHeader Toolbar Dropdown Screen-Edge Clamping & Mobile Anti-Clipping Audit
 *
 * Verifies:
 * 1. WritingSubHeaderToolbar imports and uses createPortal to escape parent clipping.
 * 2. toolsButtonRef and dropdownCoords state are established.
 * 3. Smart horizontal screen-edge clamp logic (left < 12 -> 12, right overflow prevention).
 * 4. Dropdown rendered with dynamic fixed positioning and viewport padding.
 * 5. Dropdown has overflow-y-auto and overscroll-contain for smooth scrolling.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Step 132: Writing SubHeader Toolbar Screen-Edge Clamping Audit ---');

const toolbarPath = path.join(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
const toolbarSource = fs.readFileSync(toolbarPath, 'utf8');

// 1. Portal & Hooks
console.log('Test 1: Verifying createPortal and hook imports in WritingSubHeaderToolbar');
assert(toolbarSource.includes("import { createPortal } from 'react-dom';"), 'Must import createPortal');
assert(toolbarSource.includes('toolsButtonRef = useRef(null)'), 'Must establish toolsButtonRef');
assert(toolbarSource.includes('dropdownCoords, setDropdownCoords'), 'Must manage dropdownCoords state');

// 2. Smart Clamping Math
console.log('Test 2: Verifying horizontal screen-edge boundary clamping logic');
assert(toolbarSource.includes('calcCoords'), 'Must have calcCoords positioning function');
assert(toolbarSource.includes('if (left < 12) {') && toolbarSource.includes('left = 12;'), 'Must clamp left boundary to at least 12px');
assert(toolbarSource.includes('left + desiredWidth > window.innerWidth - 12'), 'Must clamp right boundary to window edge');

// 3. Dynamic Fixed Positioning
console.log('Test 3: Verifying dynamic fixed styling and fallback resilience');
assert(toolbarSource.includes('style={dropdownCoords ? {'), 'Must apply computed coordinates style');
assert(toolbarSource.includes("position: 'fixed'"), 'Must position fixed to avoid clipping by relative ancestors');
assert(toolbarSource.includes('overflow-y-auto overscroll-contain'), 'Must enable internal scrolling');

console.log('\n🎉 ALL STEP 132 SCREEN-EDGE CLAMPING CHECKS PASSED CLEANLY!\n');
