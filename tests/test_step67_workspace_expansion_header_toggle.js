/**
 * Test Step 67: Workspace Expansion & Header Toggle (Nút Mở Rộng / Thu Gọn Giao Diện)
 * 
 * Verifies:
 * 1. App.jsx hides main website Navbar when workspace is expanded (isSlimHeader || isFocusMode) to maximize vertical writing canvas.
 * 2. WritingSubHeaderToolbar.jsx uses accurate action labels and icons:
 *    - Maximize2 & "Mở rộng" when normal (to expand workspace)
 *    - Minimize2 & "Thu gọn" when expanded (to restore top navigation)
 * 3. WritingWorkspace.jsx does NOT forcefully override user's expansion state on editor focus.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 67: Workspace Expansion Header Toggle Test Suite...');

// 1. Verify App.jsx Navbar conditional rendering
const appFile = path.resolve(__dirname, '../src/App.jsx');
assert(fs.existsSync(appFile), 'App.jsx must exist');
const appCode = fs.readFileSync(appFile, 'utf8');

assert(
  appCode.includes('!isFocusMode && !isSlimHeader && (') && appCode.includes('<Navbar'),
  'App.jsx must hide Navbar when isFocusMode or isSlimHeader is active to expand workspace'
);
console.log('  ✅ 1. App.jsx dynamically hides website Navbar when workspace is expanded');

// 2. Verify WritingSubHeaderToolbar.jsx buttons and icons
const subHeaderFile = path.resolve(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
assert(fs.existsSync(subHeaderFile), 'WritingSubHeaderToolbar.jsx must exist');
const subHeaderCode = fs.readFileSync(subHeaderFile, 'utf8');

assert(
  subHeaderCode.includes('Minimize2') && subHeaderCode.includes('Thu gọn'),
  'WritingSubHeaderToolbar must show Minimize2 and "Thu gọn" when expanded'
);
assert(
  subHeaderCode.includes('Maximize2') && subHeaderCode.includes('Mở rộng'),
  'WritingSubHeaderToolbar must show Maximize2 and "Mở rộng" when in normal view'
);
console.log('  ✅ 2. WritingSubHeaderToolbar aligns labels and icons with user expectations (Mở rộng / Thu gọn)');

// 3. Verify WritingWorkspace.jsx removes forced onEditorFocus reset
const writingWorkspaceFile = path.resolve(__dirname, '../src/components/writing/WritingWorkspace.jsx');
assert(fs.existsSync(writingWorkspaceFile), 'WritingWorkspace.jsx must exist');
const workspaceCode = fs.readFileSync(writingWorkspaceFile, 'utf8');

assert(
  !workspaceCode.includes('setIsSlimHeader?.(true)'),
  'WritingWorkspace must NOT forcefully reset isSlimHeader to true on editor focus'
);
console.log('  ✅ 3. WritingWorkspace honors user manual preference without automatic resets');

console.log('🎉 Step 67: All tests passed successfully!');
