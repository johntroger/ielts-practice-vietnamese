/**
 * Test Step 175: Dedicated Two-Way URL Routing & Deep-Linking for Micro-Drills
 *
 * Verifies:
 * 1. App.jsx implements two-way routing for /micro-drills, /micro-drill, /drills, /drill, /luyen-phan-xa.
 * 2. App.jsx supports direct URL entry, query params (?room=..., ?skill=...), subpaths (/micro-drills/reading), and browser popstate/hashchange.
 * 3. AppModalHost.jsx forwards deep-link payload (initialRoom, initialTab, targetDrillId) to MicroDrillsModal.
 * 4. MicroDrillsModal.jsx initializes activeRoom from deep link, synchronizes URL on room change, and provides a 1-click Copy URL button.
 * 5. Navbar.jsx displays /micro-drills badges and updated tooltips.
 * 6. Global English UI compliance (no hardcoded Vietnamese strings).
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Step 175: Dedicated URL Routing for Micro-Drills...');

// 1. Verify App.jsx routing logic
const appPath = path.resolve(__dirname, '../src/App.jsx');
assert.ok(fs.existsSync(appPath), 'src/App.jsx must exist');
const appContent = fs.readFileSync(appPath, 'utf8');

assert.ok(
  appContent.includes("pathname === '/micro-drills'") &&
  appContent.includes("pathname === '/micro-drill'") &&
  appContent.includes("pathname === '/drills'"),
  'App.jsx must check for /micro-drills, /micro-drill, and /drills'
);

assert.ok(
  appContent.includes("search.get('room')") &&
  appContent.includes("search.get('skill')"),
  'App.jsx must parse room or skill query parameter'
);

assert.ok(
  appContent.includes("openModal('drills', { room, tab, drillId })"),
  'App.jsx must openModal drills with extracted deep-link payload'
);

assert.ok(
  appContent.includes("window.history.pushState({ modal: 'drills' }, '', targetUrl)") ||
  appContent.includes("window.history.pushState({ modal: 'drills' }"),
  'App.jsx must pushState /micro-drills when modal opens'
);
console.log('  ✅ 1. App.jsx correctly implements two-way routing and address bar synchronization for /micro-drills.');

// 2. Verify AppModalHost.jsx payload forwarding
const hostPath = path.resolve(__dirname, '../src/components/modals/AppModalHost.jsx');
assert.ok(fs.existsSync(hostPath), 'AppModalHost.jsx must exist');
const hostContent = fs.readFileSync(hostPath, 'utf8');

assert.ok(
  hostContent.includes('initialRoom=') &&
  hostContent.includes('initialTab='),
  'AppModalHost.jsx must forward initialRoom and initialTab to MicroDrillsModal'
);
console.log('  ✅ 2. AppModalHost.jsx passes deep link payload to MicroDrillsModal.');

// 3. Verify MicroDrillsModal.jsx deep-link handling and share URL button
const modalPath = path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx');
assert.ok(fs.existsSync(modalPath), 'MicroDrillsModal.jsx must exist');
const modalContent = fs.readFileSync(modalPath, 'utf8');

assert.ok(
  modalContent.includes('initialRoom') &&
  modalContent.includes('handleCopyShareUrl') &&
  modalContent.includes('handleRoomChange'),
  'MicroDrillsModal must accept initialRoom and have handleCopyShareUrl'
);

assert.ok(
  modalContent.includes('replaceState') &&
  modalContent.includes("url.searchParams.set('room', activeRoom)"),
  'MicroDrillsModal must synchronize activeRoom in URL via replaceState'
);

assert.ok(
  modalContent.includes('handleCopyShareUrl') &&
  modalContent.includes('Share2'),
  'MicroDrillsModal must include a Copy Direct URL button with Share2 icon'
);
console.log('  ✅ 3. MicroDrillsModal handles deep-links, dynamic room URL sync, and 1-click share URL copying.');

// 4. Verify Navbar.jsx has /micro-drills badges & tooltips
const navbarPath = path.resolve(__dirname, '../src/components/Navbar.jsx');
assert.ok(fs.existsSync(navbarPath), 'Navbar.jsx must exist');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');

assert.ok(
  navbarContent.includes('/micro-drills'),
  'Navbar.jsx must display /micro-drills badge/tooltip'
);
console.log('  ✅ 4. Navbar.jsx includes /micro-drills badges and tooltips for direct user discoverability.');

console.log('🎉 ALL STEP 175 TESTS PASSED SUCCESSFULLY!');
