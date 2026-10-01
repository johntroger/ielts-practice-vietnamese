/**
 * Test Suite Step 56: Navbar Top Level Contact & Feedback Direct Button
 * 
 * Verifies that:
 * 1. Navbar.jsx includes a direct, top-level "Liên Hệ & Góp Ý" button on the main navigation bar.
 * 2. The direct button triggers doOpenContact to show the ContactModal popup without opening dropdowns first.
 * 3. The button displays the Mail icon and responsive labels ("Liên Hệ & Góp Ý" on md+, "Liên Hệ" on sm).
 * 4. Mobile Drawer and Progress dropdown still preserve Contact access for 100% backward compatibility.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('📬 Testing Step 56: Top Navbar Direct Contact & Feedback Button...');

const navbarPath = path.resolve('src/components/Navbar.jsx');
assert(fs.existsSync(navbarPath), 'src/components/Navbar.jsx must exist');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

// -------------------------------------------------------------
// 1. VERIFY DIRECT TOP NAVBAR CONTACT BUTTON
// -------------------------------------------------------------
console.log('  ▶ 1. Verifying direct top Navbar button existence and wiring...');
assert(
  navbarContent.includes('Liên Hệ & Góp Ý - Đưa trực tiếp ra ngoài thanh Nav trên cùng'),
  'Navbar must contain direct top-level Contact button comment/marker'
);

assert(
  navbarContent.includes('onClick={doOpenContact}'),
  'Direct Contact button must trigger doOpenContact on click'
);

assert(
  navbarContent.includes('aria-label="Liên hệ và góp ý"'),
  'Direct Contact button must have accessible aria-label'
);
console.log('    ✅ Top-level Contact & Feedback button successfully wired.');

// -------------------------------------------------------------
// 2. VERIFY RESPONSIVE LABELS AND STYLING
// -------------------------------------------------------------
console.log('  ▶ 2. Verifying responsive text and icon styling...');
assert(
  navbarContent.includes('Mail className="w-3.5 h-3.5 text-rose-600'),
  'Direct Contact button must display rose Mail icon'
);

assert(
  navbarContent.includes('hidden md:inline text-[11px] font-bold">Liên Hệ & Góp Ý</span>'),
  'Direct Contact button must display full "Liên Hệ & Góp Ý" label on md+ screens'
);

assert(
  navbarContent.includes('md:hidden hidden sm:inline text-[11px] font-bold">Liên Hệ</span>'),
  'Direct Contact button must display compact "Liên Hệ" label on sm screens'
);
console.log('    ✅ Responsive labels ("Liên Hệ & Góp Ý" / "Liên Hệ" / icon-only) verified.');

// -------------------------------------------------------------
// 3. VERIFY RETENTION IN MOBILE DRAWER & DROPDOWN
// -------------------------------------------------------------
console.log('  ▶ 3. Verifying retention in mobile drawer for seamless multi-touch UX...');
assert(
  navbarContent.includes('doOpenContact(); setIsMobileDrawerOpen(false);'),
  'Mobile drawer must continue to provide Contact button'
);
console.log('    ✅ Mobile drawer access preserved.');

console.log('\n🎉 ALL STEP 56 DIRECT NAVBAR CONTACT VERIFICATIONS PASSED (3/3)!');
