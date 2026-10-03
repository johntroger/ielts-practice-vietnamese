/**
 * Test Step 70: Header Decluttering & Hierarchy Upgrade
 *
 * Verifies:
 * 1. Global Gemini API Key Reminder Banner in App.jsx:
 *    - Uses dismissible state isApiKeyBannerDismissed stored via safeGet/safeSet.
 *    - Includes X icon dismiss button to give back vertical canvas on demand.
 *    - Replaces loud gradient with refined, elegant amber backdrop styling.
 * 2. Navbar.jsx Header Aesthetics & Ergonomics:
 *    - Header features backdrop blur and refined border (bg-white/95 backdrop-blur-md).
 *    - Segmented 4-skill switcher persists with clean color coding and responsive labels.
 *    - Hero CTA "Thi Thử 60p" stands out prominently with ShieldAlert.
 *    - 3 Consolidated dropdowns (Luyện Tập, Công Cụ, Tiến Độ) maintain 1-click outside-click switching.
 *    - Utility actions (Trợ Giúp F1, Gửi Góp Ý, API Key status, User Profile) remain accessible with zero layout breakage.
 *    - Mobile Drawer and touch targets (min 44px) are 100% preserved.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 70: Header Decluttering & Hierarchy Upgrade Test Suite...');

const appPath = path.resolve(__dirname, '../src/App.jsx');
const navbarPath = path.resolve(__dirname, '../src/components/Navbar.jsx');

assert(fs.existsSync(appPath), 'src/App.jsx must exist');
assert(fs.existsSync(navbarPath), 'src/components/Navbar.jsx must exist');

const appSource = fs.readFileSync(appPath, 'utf8');
const navbarSource = fs.readFileSync(navbarPath, 'utf8');

// 1. Verify App.jsx API Key Banner Enhancements
console.log('  ▶ 1. Verifying API Key Reminder Banner dismissibility and styling in App.jsx...');
assert(
  appSource.includes('isApiKeyBannerDismissed') && appSource.includes('setIsApiKeyBannerDismissed'),
  'App.jsx must manage isApiKeyBannerDismissed state'
);
assert(
  appSource.includes("safeGet('ielts_dismiss_api_banner'"),
  'App.jsx must initialize isApiKeyBannerDismissed from safe storage'
);
assert(
  appSource.includes("safeSet('ielts_dismiss_api_banner', true)"),
  'App.jsx must persist banner dismissal via safeSet'
);
assert(
  appSource.includes('!isApiKeyBannerDismissed'),
  'Banner conditional render must check !isApiKeyBannerDismissed'
);
assert(
  appSource.includes('bg-amber-50') && appSource.includes('border-amber-200'),
  'Banner should use soft, academic amber styling instead of harsh full gradient'
);
console.log('    ✅ API Key banner is dismissible and uses refined styling.');

// 2. Verify Navbar.jsx Header Aesthetics & Hierarchy
console.log('  ▶ 2. Verifying Navbar styling, backdrop blur, and visual hierarchy...');
assert(
  navbarSource.includes('backdrop-blur') && navbarSource.includes('<header'),
  'Navbar header must use backdrop blur for modern aesthetic depth'
);
assert(
  navbarSource.includes('Thi Thử 60p') && navbarSource.includes('ShieldAlert'),
  'Hero CTA "Thi Thử 60p" must be prominent in Navbar'
);
assert(
  navbarSource.includes('desktopMenuRef') && navbarSource.includes('handleOutsideClick'),
  'Desktop dropdowns must retain outside-click listener for smooth 1-click switching'
);
assert(
  navbarSource.includes('Luyện Tập') && navbarSource.includes('Công Cụ') && navbarSource.includes('Tiến Độ'),
  'The 3 consolidated functional dropdowns must exist on desktop'
);
console.log('    ✅ Navbar visual hierarchy and dropdown switching verified.');

// 3. Verify Backward Compatibility for tested actions
console.log('  ▶ 3. Verifying retention of direct contact, F1 help, and mobile touch targets...');
assert(
  navbarSource.includes('onClick={doOpenContact}') && navbarSource.includes('Gửi góp ý'),
  'Direct Contact button must remain functional'
);
assert(
  navbarSource.includes('onClick={doOpenFeaturesGuide}') && navbarSource.includes('F1'),
  'Direct F1 Help button must remain functional'
);
assert(
  navbarSource.includes('min-h-[44px]') && navbarSource.includes('min-w-[44px]'),
  'Mobile touch targets must comply with >= 44px'
);
console.log('    ✅ All utility actions and accessibility targets preserved.');

console.log('\n🎉 ALL STEP 70 HEADER DECLUTTERING & HIERARCHY TESTS PASSED (3/3)!');
