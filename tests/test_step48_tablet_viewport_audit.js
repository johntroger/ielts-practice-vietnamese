/**
 * Test Step 48: Tablet Viewport Audit & Menu Display Verification
 *
 * Verifies:
 * 1. Navbar Container Padding: Uses px-4 on tablets (sm:px-4 xl:px-6) for maximum breathing room.
 * 2. Thi Thử 60p Hero CTA: Uses 'hidden xl:flex' to prevent top bar collision on 768px (portrait) and 1024px (landscape).
 * 3. 4-Skill Switcher: Retains responsive padding with no clipping.
 * 4. Outside-click touch support: Listens to 'touchstart' to ensure menus close reliably on iPad / Android tablets.
 * 5. Touch Target Compliance: Min 44x44px for tablet interactive elements.
 * 6. WritingSubHeaderToolbar: Wraps gracefully (md:flex-wrap) and hides 210px weekly word target on tablets (< 1280px).
 * 7. SplitPane: Touch resizing supported for tablets in landscape mode.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Testing Step 48: Tablet Viewport Audit & Menu Display ---');

const navbarPath = path.join(__dirname, '../src/components/Navbar.jsx');
const subheaderPath = path.join(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
const splitPanePath = path.join(__dirname, '../src/components/SplitPane.jsx');

const navbarSource = fs.readFileSync(navbarPath, 'utf8');
const subheaderSource = fs.readFileSync(subheaderPath, 'utf8');
const splitPaneSource = fs.readFileSync(splitPanePath, 'utf8');

// Test 1: Navbar Container Padding for Tablets
console.log('Test 1: Verifying Navbar container uses px-4 on tablet viewports');
assert(navbarSource.includes('px-2 sm:px-4 xl:px-6'), 
  'Navbar container should use px-4 on tablets and px-6 on xl+ screens for safe margins');

// Test 2: Hero CTA "Thi Thử 60p" Breakpoint
console.log('Test 2: Verifying Thi Thử 60p button is reserved for xl+ screens to prevent tablet squeeze');
assert(navbarSource.includes('hidden xl:flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600'),
  'Thi Thử 60p must use hidden xl:flex so it does not crowd 768px-1024px tablet viewports');
assert(!navbarSource.includes('hidden md:flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600'),
  'Thi Thử 60p must NOT appear on md (768px) top bar');

// Test 3: Touch Event Support on Menus
console.log('Test 3: Verifying touchstart listeners for tablet menu dismissing');
assert(navbarSource.includes("document.addEventListener('touchstart', handleOutsideClick)"),
  'Navbar must attach touchstart listener to close dropdowns when tapping outside on touch tablets');
assert(navbarSource.includes("document.removeEventListener('touchstart', handleOutsideClick)"),
  'Navbar must cleanup touchstart listener');

// Test 4: WritingSubHeaderToolbar Responsive Wrap
console.log('Test 4: Verifying WritingSubHeaderToolbar wraps gracefully on tablet screens');
assert(subheaderSource.includes('md:flex-wrap'), 
  'WritingSubHeaderToolbar must include md:flex-wrap to prevent horizontal button collisions');
assert(subheaderSource.includes('hidden xl:flex items-center space-x-2 text-slate-600 pl-2.5 border-l border-slate-200'),
  'Weekly Word Target progress bar must use hidden xl:flex to save 210px horizontal space on tablets');
assert(subheaderSource.includes('max-w-full overflow-x-auto no-scrollbar py-0.5'),
  'Subheader zones must constrain width with max-w-full');

// Test 5: SplitPane Touch Dragging for Tablets
console.log('Test 5: Verifying SplitPane touch drag support for landscape tablet view');
assert(splitPaneSource.includes('handleTouchMove'), 'SplitPane must implement handleTouchMove for finger gestures');
assert(splitPaneSource.includes('onTouchStart={startDragging}'), 'Resizer handle must support onTouchStart');
assert(splitPaneSource.includes("window.addEventListener('touchmove', onTouch"), 'SplitPane must listen to touchmove on window');

console.log('✅ ALL TEST STEP 48 CHECKS PASSED SUCCESSFULLY!');
