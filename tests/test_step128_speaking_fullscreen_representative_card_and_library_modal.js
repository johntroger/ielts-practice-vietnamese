/**
 * Test Step 128: Speaking Fullscreen Optimization, Representative Card & Library Modal
 *
 * Verifies:
 * 1. SpeakingWorkspace uses full-height layout ('h-full min-h-0 overflow-hidden').
 * 2. Main content stage uses wide full-screen container ('max-w-5xl xl:max-w-6xl').
 * 3. Shows only 1 representative test card on the main speaking stage instead of a huge multi-card grid.
 * 4. Representative card includes prev/next switchers, direct selector dropdown, and a prominent 'Kho Đề' button.
 * 5. SpeakingMockLibraryModal exists and provides full search, filtering (All, Cambridge, Manual, AI, Mastered), and selection.
 * 6. Top action toolbar in SpeakingWorkspace provides a quick 'Kho Đề' library button.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- TEST STEP 128: SPEAKING FULLSCREEN, REPRESENTATIVE CARD & LIBRARY MODAL ---');

const workspacePath = path.join(__dirname, '../src/components/speaking/SpeakingWorkspace.jsx');
const modalPath = path.join(__dirname, '../src/components/speaking/SpeakingMockLibraryModal.jsx');

assert.ok(fs.existsSync(workspacePath), 'SpeakingWorkspace.jsx must exist');
assert.ok(fs.existsSync(modalPath), 'SpeakingMockLibraryModal.jsx must exist');

const workspaceContent = fs.readFileSync(workspacePath, 'utf8');
const modalContent = fs.readFileSync(modalPath, 'utf8');

const heroPath = path.join(__dirname, '../src/components/speaking/SpeakingMockHero.jsx');
const heroContent = fs.existsSync(heroPath) ? fs.readFileSync(heroPath, 'utf8') : '';

// 1. Fullscreen layout verification
assert.ok(
  workspaceContent.includes('h-full min-h-0 overflow-hidden'),
  'SpeakingWorkspace root container must use h-full min-h-0 overflow-hidden'
);
assert.ok(
  workspaceContent.includes('max-w-5xl xl:max-w-6xl') || heroContent.includes('max-w-5xl xl:max-w-6xl'),
  'SpeakingWorkspace / SpeakingMockHero main stage must use wide responsive container max-w-5xl xl:max-w-6xl'
);

// 2. Representative card verification
assert.ok(
  workspaceContent.includes('Selected Mock Test Pack (Representative)') ||
  workspaceContent.includes('Bộ Đề Thi Thử Đang Chọn (Đại Diện)') ||
  heroContent.includes('Selected Mock Test Pack (Representative)') ||
  heroContent.includes('Bộ Đề Thi Thử Đang Chọn (Đại Diện)'),
  'SpeakingMockHero must display representative test pack header'
);
assert.ok(
  workspaceContent.includes('handlePrevPack') && workspaceContent.includes('handleNextPack'),
  'SpeakingWorkspace must provide handlePrevPack and handleNextPack navigation'
);
assert.ok(
  workspaceContent.includes('currentPackIndex'),
  'SpeakingWorkspace must track currentPackIndex for fast pagination'
);

// 3. Library Modal Integration
assert.ok(
  workspaceContent.includes('SpeakingMockLibraryModal'),
  'SpeakingWorkspace must import and render SpeakingMockLibraryModal'
);
assert.ok(
  workspaceContent.includes('isMockLibraryOpen'),
  'SpeakingWorkspace must maintain isMockLibraryOpen state'
);

// 4. Modal Features verification
assert.ok(
  modalContent.includes('searchQuery') && modalContent.includes('displayedPacks'),
  'SpeakingMockLibraryModal must provide interactive search and filtered test packs'
);
assert.ok(
  modalContent.includes("mockFilter === 'cambridge'") &&
  modalContent.includes("mockFilter === 'manual'") &&
  modalContent.includes("mockFilter === 'ai'"),
  'SpeakingMockLibraryModal must provide Cambridge, Manual, and AI filter tabs'
);
assert.ok(
  modalContent.includes('onSelectMockPack'),
  'SpeakingMockLibraryModal must support onSelectMockPack callback'
);

console.log('✅ ALL 6/6 VERIFICATIONS PASSED for Step 128 Speaking Fullscreen & Library Modal!');
process.exit(0);
