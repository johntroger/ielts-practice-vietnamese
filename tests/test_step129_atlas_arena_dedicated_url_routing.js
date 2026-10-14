/**
 * test_step127_atlas_arena_dedicated_url_routing.js
 * Verification test for Step 127:
 * Dedicated Two-Way URL Routing (/atlas-arena), Deep-Linking & Browser History Synchronization
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Testing Step 129: Atlas Arena Dedicated URL Routing (/atlas-arena)...\n');

const appSource = fs.readFileSync(path.resolve('src/App.jsx'), 'utf-8');
const arenaModalSource = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
const enSource = fs.readFileSync(path.resolve('src/i18n/locales/en.js'), 'utf-8');
const viSource = fs.readFileSync(path.resolve('src/i18n/locales/vi.js'), 'utf-8');
const vercelConfig = JSON.parse(fs.readFileSync(path.resolve('vercel.json'), 'utf-8'));

// 1. Vercel SPA Routing Rewrite Guard
it('vercel.json has SPA catch-all rewrite rule for clean URL paths', () => {
  assert(Array.isArray(vercelConfig.rewrites), 'vercel.json must define rewrites array');
  const catchAll = vercelConfig.rewrites.find(r => r.source === '/(.*)' && r.destination === '/');
  assert(catchAll, 'vercel.json must have /{.*} -> / catch-all rewrite for SPA deep linking');
});

// 2. App.jsx Route Detection Logic
it('App.jsx detects /atlas-arena, /arena, #atlas-arena and ?mode=atlas-arena', () => {
  assert(appSource.includes("pathname === '/atlas-arena'"), 'App.jsx must check /atlas-arena pathname');
  assert(appSource.includes("pathname === '/arena'"), 'App.jsx must check /arena alias pathname');
  assert(appSource.includes("hash === '#atlas-arena'"), 'App.jsx must support #atlas-arena hash');
  assert(appSource.includes("search.get('mode') === 'atlas-arena'"), 'App.jsx must support ?mode=atlas-arena query parameter');
});

// 3. Direct Entry Auto-Open
it('App.jsx automatically triggers openModal("atlasArena") on route match', () => {
  assert(appSource.includes("if (checkIsArenaRoute()) {\n      openModal('atlasArena');"), 
    'App.jsx must auto-open atlasArena modal on direct URL entry');
});

// 4. Browser History (Back / Forward) Navigation Sync
it('App.jsx listens to popstate and hashchange events for browser history navigation', () => {
  assert(appSource.includes("window.addEventListener('popstate', handleLocationChange)"), 
    'Must register popstate listener');
  assert(appSource.includes("window.addEventListener('hashchange', handleLocationChange)"), 
    'Must register hashchange listener');
  assert(appSource.includes("closeModal('atlasArena')"), 
    'Must close atlasArena modal when user navigates back to root URL');
});

// 5. Two-Way Address Bar PushState Sync
it('App.jsx synchronizes window.history.pushState when modal opens and closes', () => {
  assert(appSource.includes("window.history.pushState({ modal: 'atlasArena' }, '', '/atlas-arena')"), 
    'Must push /atlas-arena to browser history when modal opens');
  assert(appSource.includes("window.history.pushState(null, '', '/')"), 
    'Must reset URL back to / when modal closes');
});

// 6. Share Button inside Atlas English Arena
it('AtlasEnglishArenaModal.jsx renders 1-click Share /atlas-arena button with clipboard copy and isEn defined', () => {
  const freshModalSource = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
  assert(freshModalSource.includes("const { t, isEn } = useTranslation()"), 'Must destructure isEn from useTranslation to prevent ReferenceError');
  assert(freshModalSource.includes("handleShareArena"), 'Must define handleShareArena handler');
  assert(freshModalSource.includes("const shareUrl = `${window.location.origin}/atlas-arena`"), 
    'Must generate /atlas-arena direct link');
  assert(freshModalSource.includes("navigator.clipboard.writeText(shareUrl)"), 
    'Must copy link to clipboard');
  assert(freshModalSource.includes("copiedLink ? t('arena.linkCopied') : t('arena.shareArena')"), 
    'Must render responsive copy confirmation text');
});

// 7. Bilingual i18n Localization Support
it('en.js and vi.js provide translations for shareArena and linkCopied', () => {
  assert(enSource.includes("shareArena: 'Share /atlas-arena'"), 'en.js must define shareArena');
  assert(enSource.includes("linkCopied: 'Link Copied!'"), 'en.js must define linkCopied');
  assert(viSource.includes("shareArena: 'Chia sẻ /atlas-arena'"), 'vi.js must define shareArena');
  assert(viSource.includes("linkCopied: 'Đã sao chép link!'"), 'vi.js must define linkCopied');
});

console.log(`\n===============================================================`);
console.log(`✅ All ${passed}/${total} Step 127 Atlas Arena dedicated URL tests passed cleanly!`);
console.log(`===============================================================\n`);
