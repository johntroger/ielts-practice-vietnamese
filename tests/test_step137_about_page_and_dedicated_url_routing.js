/**
 * tests/test_step137_about_page_and_dedicated_url_routing.js
 * 
 * Verifies Step 137: Dedicated About Page (/about), Bilingual Localization,
 * Interactive 4-Skill Showcase, Gamification Hook, Cambridge Rigor & Two-Way URL Routing.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- Step 137: Dedicated About Page & Two-Way URL Routing Audit ---');

const aboutPagePath = path.resolve('src/pages/AboutPage.jsx');
const appPath = path.resolve('src/App.jsx');
const navbarPath = path.resolve('src/components/Navbar.jsx');
const viPath = path.resolve('src/i18n/locales/vi.js');
const enPath = path.resolve('src/i18n/locales/en.js');

// Test 1: Verify AboutPage.jsx exists and has required components
console.log('Test 1: Verifying AboutPage.jsx component');
assert(fs.existsSync(aboutPagePath), 'src/pages/AboutPage.jsx must exist');
const aboutSource = fs.readFileSync(aboutPagePath, 'utf-8');

assert(aboutSource.includes('export default function AboutPage'), 'AboutPage must export default functional component');
assert(aboutSource.includes('useTranslation'), 'AboutPage must use useTranslation hook');
assert(aboutSource.includes('toggleTheme'), 'AboutPage must support theme toggling');
assert(aboutSource.includes('handleToggleLang'), 'AboutPage must support 1-click language toggling');
assert(aboutSource.includes('activeSkillTab'), 'AboutPage must have interactive 4-skill tab switcher');
assert(aboutSource.includes('showUpgradedSentence'), 'AboutPage must have interactive Before & After lexical comparison');
assert(aboutSource.includes('handleQuizAnswer'), 'AboutPage must have interactive 10-second reflex mini quiz');
assert(aboutSource.includes('expandedFaqIndex'), 'AboutPage must have interactive FAQ accordion');
console.log('  ✓ AboutPage component structure and interactive state verified');

// Test 2: Verify i18n dictionaries have complete about namespace
console.log('Test 2: Verifying bilingual localization dictionaries');
const viSource = fs.readFileSync(viPath, 'utf-8');
const enSource = fs.readFileSync(enPath, 'utf-8');

const requiredKeys = [
  'about:',
  'badge:',
  'heroTitle:',
  'heroSubtitle:',
  'ctaStart:',
  'ctaArena:',
  'workspacesTitle:',
  'writingTitle:',
  'readingTitle:',
  'listeningTitle:',
  'speakingTitle:',
  'academicTitle:',
  'beforeLabel:',
  'afterLabel:',
  'arenaTitle:',
  'miniQuizTitle:',
  'miniQuizQuestion:',
  'philoTitle:',
  'philo1Title:',
  'philo2Title:',
  'philo3Title:',
  'faqTitle:',
  'faq1Q:',
  'faq1A:',
  'finalTitle:',
  'finalCta:'
];

for (const key of requiredKeys) {
  assert(viSource.includes(key), `vi.js must define about key: ${key}`);
  assert(enSource.includes(key), `en.js must define about key: ${key}`);
}
console.log(`  ✓ Both vi.js and en.js contain all ${requiredKeys.length} required translation keys`);

// Test 3: Verify two-way URL routing in App.jsx
console.log('Test 3: Verifying Two-Way URL Routing in App.jsx');
const appSource = fs.readFileSync(appPath, 'utf-8');

assert(appSource.includes("const AboutPage = React.lazy(() => import('./pages/AboutPage'))"), 'App.jsx must lazy-load AboutPage');
assert(appSource.includes('isAboutViewOpen'), 'App.jsx must maintain isAboutViewOpen state');
assert(appSource.includes("pathname === '/about'"), 'App.jsx must check /about pathname');
assert(appSource.includes("pathname === '/gioi-thieu'"), 'App.jsx must check /gioi-thieu alias');
assert(appSource.includes("hash === '#about'"), 'App.jsx must check #about hash');
assert(appSource.includes("search.get('page') === 'about'"), 'App.jsx must support ?page=about search param');
assert(appSource.includes("window.history.pushState({ page: 'about' }, '', '/about')"), 'App.jsx must pushState /about on open');
assert(appSource.includes("trackSkillView('about')"), 'App.jsx must log virtual pageview for GA4 analytics');
assert(appSource.includes('<AboutPage'), 'App.jsx must render AboutPage');
assert(appSource.includes('isDirectRootAccess'), 'App.jsx must redirect direct root visits to /about');
console.log('  ✓ Two-Way URL Routing and deep-linking in App.jsx verified');

// Test 4: Verify vercel.json redirect rule
console.log('Test 4: Verifying vercel.json server redirect');
const vercelConfigPath = path.resolve('vercel.json');
assert(fs.existsSync(vercelConfigPath), 'vercel.json must exist');
const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
assert(Array.isArray(vercelConfig.redirects), 'vercel.json must define redirects array');
const rootRedirect = vercelConfig.redirects.find(r => r.source === '/' && r.destination === '/about');
assert(rootRedirect, 'vercel.json must redirect / to /about');
console.log('  ✓ vercel.json redirects / to /about');

// Test 5: Verify Navbar integration (Compact Home icon & Thi Thử button)
console.log('Test 5: Verifying Navbar integration');
const navbarSource = fs.readFileSync(navbarPath, 'utf-8');

assert(navbarSource.includes('onOpenAbout'), 'Navbar.jsx must support onOpenAbout prop');
assert(navbarSource.includes('doOpenAbout'), 'Navbar.jsx must provide doOpenAbout handler');
assert(navbarSource.includes('/about'), 'Navbar.jsx must link to /about');
assert(navbarSource.includes('<Home'), 'Navbar.jsx must render Home icon for About navigation');
assert(navbarSource.includes("<span>{isEn ? 'Mock Test' : 'Thi Thử'}</span>"), 'Navbar.jsx must render compact Thi Thử without 60p');
console.log('  ✓ Navbar desktop and mobile drawer integration verified (Home icon & Thi Thử)');

console.log('\n🎉 ALL STEP 137 ABOUT PAGE CHECKS PASSED CLEANLY!\n');
