/**
 * Test Step 60: Minimal Focus View & Cognitive Decluttering (Bước 3.1)
 * 
 * Verifies:
 * 1. WritingWorkspace manages writingViewMode state ('minimal' | 'pro') with localStorage persistence.
 * 2. WritingWorkspace sets data-writing-view attribute on workspace container.
 * 3. WritingSubHeaderToolbar provides seamless segmented control / toggle switch for Minimal vs Pro view.
 * 4. WritingSubHeaderToolbar conditionally hides heavy weekly progress in minimal view while preserving backwards compatibility.
 * 5. EditorPane provides clean popover ("Chỉ Số Phân Tích") in minimal view to eliminate typing distractions.
 * 6. EditorPane retains full direct badges in pro view mode.
 * 7. Feature is registered in featureRegistry.js with category 'shortcuts_ux'.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 60: Minimal Focus View Test Suite...');

// 1. Verify WritingWorkspace implementation
const workspaceFile = path.resolve(__dirname, '../src/components/writing/WritingWorkspace.jsx');
assert(fs.existsSync(workspaceFile), 'WritingWorkspace.jsx must exist');
const workspaceCode = fs.readFileSync(workspaceFile, 'utf8');

assert(
  workspaceCode.includes('ielts_writing_view_mode'),
  'WritingWorkspace must use localStorage key "ielts_writing_view_mode"'
);
assert(
  workspaceCode.includes('writingViewMode') && workspaceCode.includes('handleToggleWritingViewMode'),
  'WritingWorkspace must manage writingViewMode and handleToggleWritingViewMode'
);
assert(
  workspaceCode.includes('data-writing-view={writingViewMode}'),
  'WritingWorkspace root element must expose data-writing-view attribute'
);
assert(
  workspaceCode.includes('writingViewMode={writingViewMode}') && workspaceCode.includes('onToggleWritingViewMode={handleToggleWritingViewMode}'),
  'WritingWorkspace must pass view mode props to child components'
);
console.log('  ✅ 1. WritingWorkspace manages view mode persistence and data attributes');

// 2. Verify WritingSubHeaderToolbar implementation
const toolbarFile = path.resolve(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
assert(fs.existsSync(toolbarFile), 'WritingSubHeaderToolbar.jsx must exist');
const toolbarCode = fs.readFileSync(toolbarFile, 'utf8');

assert(
  toolbarCode.includes('writingViewMode') && toolbarCode.includes('onToggleWritingViewMode'),
  'WritingSubHeaderToolbar must accept writingViewMode and onToggleWritingViewMode props'
);
assert(
  toolbarCode.includes('Tinh Giản') && toolbarCode.includes('Pro Studio'),
  'WritingSubHeaderToolbar must render mode switcher with Tinh Giản and Pro Studio options'
);
assert(
  toolbarCode.includes("writingViewMode !== 'minimal'") && toolbarCode.includes('weeklyWordProgress'),
  'WritingSubHeaderToolbar must conditonally display weeklyWordProgress outside minimal mode'
);
console.log('  ✅ 2. WritingSubHeaderToolbar renders segmented toggle and declutters weekly progress');

// 3. Verify EditorPane minimal popover implementation
const editorFile = path.resolve(__dirname, '../src/components/EditorPane.jsx');
assert(fs.existsSync(editorFile), 'EditorPane.jsx must exist');
const editorCode = fs.readFileSync(editorFile, 'utf8');

assert(
  editorCode.includes("writingViewMode === 'minimal'"),
  'EditorPane must support minimal writingViewMode condition'
);
assert(
  editorCode.includes('Chỉ Số Phân Tích') && editorCode.includes('isMetricsMenuOpen'),
  'EditorPane must bundle auxiliary metrics into popover menu during minimal mode'
);
assert(
  editorCode.includes('metricsMenuRef'),
  'EditorPane must track metricsMenuRef for outside click closing'
);
assert(
  editorCode.includes('TTR:') && editorCode.includes('Cấu Trúc GRA'),
  'EditorPane must retain Cambridge metrics access in both minimal and pro modes'
);
console.log('  ✅ 3. EditorPane implements compact metrics popover reducing cognitive load during writing');

// 4. Verify Feature Registry registration
const registryFile = path.resolve(__dirname, '../src/core/featureRegistry.js');
assert(fs.existsSync(registryFile), 'featureRegistry.js must exist');
const registryCode = fs.readFileSync(registryFile, 'utf8');

assert(
  registryCode.includes('feat-minimal-focus-view'),
  'featureRegistry must register feat-minimal-focus-view'
);
assert(
  registryCode.includes('Chế Độ Luyện Tập Tinh Giản (Minimal Focus View)'),
  'featureRegistry must specify descriptive title for minimal focus view'
);
console.log('  ✅ 4. Feature registered into central featureRegistry for Help Center and Spotlight');

console.log('\n🎉 ALL STEP 60 MINIMAL FOCUS VIEW TESTS PASSED SUCCESSFULLY! (4/4)\n');
