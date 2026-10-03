/**
 * Test Step 72: Slide-Over Utility Panel for Vocabulary & Common Mistakes (Bước 3)
 *
 * Verifies:
 * 1. SlideOverToolPanel.jsx implementation:
 *    - Accepts mistakes prop alongside vocabList.
 *    - Uses useEffect to sync activeTab when initialTab prop updates.
 *    - Renders 3 tabs: Paraphrase, Sổ Từ Vựng, Sổ Lỗi Sai.
 *    - Implements search & type filtering for mistakes.
 *    - Provides direct "Chèn" (Insert into essay) action for corrections.
 * 2. WritingWorkspace.jsx integration:
 *    - Passes mistakes={mistakes} to SlideOverToolPanel.
 *    - Passes onOpenSlideOver to WritingSubHeaderToolbar.
 * 3. WritingSubHeaderToolbar.jsx integration:
 *    - Accepts onOpenSlideOver prop.
 *    - Triggers onOpenSlideOver('mistakes') and onOpenSlideOver('vocab') with "Khay Trượt" badges.
 * 4. EditorPane.jsx integration:
 *    - Imports ShieldAlert and provides "Sổ Lỗi Sai Thường Gặp" entry in more tools menu.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 72: Slide-Over Utility Panel Test Suite...');

const panelPath = path.resolve(__dirname, '../src/components/SlideOverToolPanel.jsx');
const workspacePath = path.resolve(__dirname, '../src/components/writing/WritingWorkspace.jsx');
const toolbarPath = path.resolve(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
const editorPath = path.resolve(__dirname, '../src/components/EditorPane.jsx');

assert(fs.existsSync(panelPath), 'SlideOverToolPanel.jsx must exist');
assert(fs.existsSync(workspacePath), 'WritingWorkspace.jsx must exist');
assert(fs.existsSync(toolbarPath), 'WritingSubHeaderToolbar.jsx must exist');
assert(fs.existsSync(editorPath), 'EditorPane.jsx must exist');

const panelCode = fs.readFileSync(panelPath, 'utf8');
const workspaceCode = fs.readFileSync(workspacePath, 'utf8');
const toolbarCode = fs.readFileSync(toolbarPath, 'utf8');
const editorCode = fs.readFileSync(editorPath, 'utf8');

// 1. Verify SlideOverToolPanel 3-Tab Architecture
console.log('  ▶ 1. Verifying SlideOverToolPanel 3-tab architecture and props...');
assert(
  panelCode.includes('mistakes = []'),
  'SlideOverToolPanel must accept mistakes prop'
);
assert(
  panelCode.includes('useEffect(') && panelCode.includes('setActiveTab(initialTab)'),
  'SlideOverToolPanel must synchronize activeTab with initialTab prop via useEffect'
);
assert(
  panelCode.includes("activeTab === 'paraphrase'") &&
  panelCode.includes("activeTab === 'vocab'") &&
  panelCode.includes("activeTab === 'mistakes'"),
  'SlideOverToolPanel must support 3 tabs: paraphrase, vocab, and mistakes'
);
assert(
  panelCode.includes('filteredMistakes') && panelCode.includes('mistakeSearch'),
  'SlideOverToolPanel must support searching mistakes log'
);
assert(
  panelCode.includes('handleInsert(m.corrected'),
  'SlideOverToolPanel must allow 1-click insertion of corrected text into essay'
);
console.log('    ✅ SlideOverToolPanel 3-tab layout and mistake insertion verified.');

// 2. Verify WritingWorkspace Wiring
console.log('  ▶ 2. Verifying WritingWorkspace SlideOver wiring...');
assert(
  workspaceCode.includes('SlideOverToolPanel') && workspaceCode.includes('mistakes={mistakes}'),
  'WritingWorkspace must pass mistakes={mistakes} to SlideOverToolPanel'
);
assert(
  workspaceCode.includes('onOpenSlideOver={(tab) => setSlideOverConfig({ isOpen: true, tab })}'),
  'WritingWorkspace must wire onOpenSlideOver to WritingSubHeaderToolbar'
);
console.log('    ✅ WritingWorkspace properly coordinates slide-over state and data.');

// 3. Verify WritingSubHeaderToolbar Integration
console.log('  ▶ 3. Verifying WritingSubHeaderToolbar side-panel triggers...');
assert(
  toolbarCode.includes('onOpenSlideOver') &&
  toolbarCode.includes("onOpenSlideOver('mistakes')") &&
  toolbarCode.includes("onOpenSlideOver('vocab')"),
  'WritingSubHeaderToolbar must route Sổ lỗi sai and Sổ từ vựng to onOpenSlideOver'
);
assert(
  toolbarCode.includes('Khay Trượt'),
  'WritingSubHeaderToolbar must visually indicate "Khay Trượt" mode to user'
);
console.log('    ✅ WritingSubHeaderToolbar side-panel buttons verified.');

// 4. Verify EditorPane Integration
console.log('  ▶ 4. Verifying EditorPane more tools menu integration...');
assert(
  editorCode.includes('ShieldAlert') && editorCode.includes("onOpenSlideOver('mistakes')"),
  'EditorPane must include Sổ Lỗi Sai in more tools menu'
);
console.log('    ✅ EditorPane quick access verified.');

console.log('\n🎉 ALL STEP 72 SLIDE-OVER UTILITY PANEL TESTS PASSED (4/4)!');
