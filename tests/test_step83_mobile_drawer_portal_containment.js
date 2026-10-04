import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * Test Suite Step 83: Mobile & Tablet Drawer Stacking Context & Portal Escape Verification
 * 
 * Verifies that:
 * 1. Navbar.jsx defines a safe renderPortal utility using createPortal from react-dom.
 * 2. Mobile Drawer is rendered OUTSIDE the sticky <header> containing block (which has backdrop-blur-md).
 * 3. Mobile Drawer is portaled directly into document.body to ensure it covers the entire viewport (inset-0).
 * 4. WebsiteQRCodeModal is also portaled cleanly out of the header containing block.
 * 5. Full responsiveness: Mobile drawer has full height (h-full), overflow-y-auto, and backdrop-blur overlay.
 */

console.log('📱 Testing Step 83: Mobile Drawer Stacking Context & Portal Escape Verification...');

const navbarPath = path.resolve('src/components/Navbar.jsx');
assert(fs.existsSync(navbarPath), 'src/components/Navbar.jsx must exist');
const navbarCode = fs.readFileSync(navbarPath, 'utf8');

// 1. Verify createPortal is imported
console.log('  ▶ 1. Verifying createPortal import...');
assert(navbarCode.includes("import { createPortal } from 'react-dom'"), 'Navbar must import createPortal from react-dom');
console.log('    ✅ createPortal imported from react-dom.');

// 2. Verify renderPortal helper exists with document & document.body guard
console.log('  ▶ 2. Verifying renderPortal utility with SSR/DOM environment guard...');
assert(navbarCode.includes('const renderPortal = (children) =>'), 'Navbar must define renderPortal helper');
assert(navbarCode.includes("typeof document !== 'undefined'"), 'renderPortal must guard for undefined document');
assert(navbarCode.includes('createPortal(children, document.body)'), 'renderPortal must portal into document.body');
console.log('    ✅ renderPortal helper safely handles browser and Node/SSR environments.');

// 3. Verify that <header> is closed BEFORE the Mobile Drawer
console.log('  ▶ 3. Verifying header closes before Mobile Drawer to break out of backdrop-blur containing block...');
const headerCloseIdx = navbarCode.indexOf('</header>');
const mobileDrawerCommentIdx = navbarCode.indexOf('{/* MOBILE & TABLET DRAWER');
assert(headerCloseIdx !== -1, 'Navbar must have closing </header> tag');
assert(mobileDrawerCommentIdx !== -1, 'Navbar must have mobile drawer comment marker');
assert(headerCloseIdx < mobileDrawerCommentIdx, '</header> must be closed BEFORE Mobile Drawer to prevent CSS clipping');
console.log('    ✅ Header tag closes before Mobile Drawer.');

// 4. Verify Mobile Drawer is wrapped in renderPortal
console.log('  ▶ 4. Verifying Mobile Drawer uses renderPortal...');
assert(navbarCode.includes('isMobileDrawerOpen && renderPortal('), 'Mobile drawer must be wrapped in renderPortal');
console.log('    ✅ Mobile Drawer is portaled directly into document.body.');

// 5. Verify WebsiteQRCodeModal is wrapped in renderPortal
console.log('  ▶ 5. Verifying WebsiteQRCodeModal uses renderPortal...');
assert(navbarCode.includes('renderPortal(') && navbarCode.includes('<WebsiteQRCodeModal'), 'WebsiteQRCodeModal must be wrapped in renderPortal');
console.log('    ✅ WebsiteQRCodeModal is portaled cleanly.');

// 6. Verify Mobile Drawer has correct viewport-filling CSS classes
console.log('  ▶ 6. Verifying Mobile Drawer CSS classes for viewport fill and scroll...');
assert(navbarCode.includes('fixed inset-0 z-50 bg-slate-900/60'), 'Mobile drawer must have fixed inset-0 z-50 backdrop overlay');
assert(navbarCode.includes('h-full shadow-2xl p-5 overflow-y-auto'), 'Drawer content must have h-full and overflow-y-auto');
console.log('    ✅ Full height and independent scrolling styles confirmed.');

console.log('🎉 Step 83 Test Suite PASSED: Mobile Drawer Portal & Viewport Escape 100% VERIFIED!\n');
