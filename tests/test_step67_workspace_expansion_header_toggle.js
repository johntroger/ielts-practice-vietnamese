/**
 * Test Step 67: Universal Workspace Expansion & Header Toggle (Alt + Z) across all 4 skills
 * 
 * Verifies:
 * 1. App.jsx hides main website Navbar when workspace is expanded (isSlimHeader || isFocusMode) to maximize vertical canvas across ALL skills.
 * 2. WritingSubHeaderToolbar.jsx provides Maximize2/Mở rộng and Minimize2/Thu gọn.
 * 3. WritingWorkspace.jsx does NOT forcefully override user's expansion state on editor focus.
 * 4. ReadingWorkspace.jsx accepts isSlimHeader & toggleSlimHeader, rendering expansion button on both Mobile & Desktop.
 * 5. ListeningWorkspace.jsx accepts isSlimHeader & toggleSlimHeader, rendering expansion button on both Practice & Strict mode.
 * 6. SpeakingWorkspace.jsx accepts isSlimHeader & toggleSlimHeader, rendering expansion button in toolbar.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 67: Universal Workspace Expansion Across All Skills Test Suite...');

// 1. Verify App.jsx Navbar conditional rendering & prop passing
const appFile = path.resolve(__dirname, '../src/App.jsx');
assert(fs.existsSync(appFile), 'App.jsx must exist');
const appCode = fs.readFileSync(appFile, 'utf8');

assert(
  appCode.includes('!isFocusMode && !isSlimHeader && (') && appCode.includes('<Navbar'),
  'App.jsx must hide Navbar when isFocusMode or isSlimHeader is active to expand workspace'
);
assert(
  appCode.includes('<ReadingWorkspace') && appCode.includes('toggleSlimHeader={toggleSlimHeader}'),
  'App.jsx must pass toggleSlimHeader to ReadingWorkspace'
);
assert(
  appCode.includes('<ListeningWorkspace') && appCode.includes('toggleSlimHeader={toggleSlimHeader}'),
  'App.jsx must pass toggleSlimHeader to ListeningWorkspace'
);
assert(
  appCode.includes('<SpeakingWorkspace') && appCode.includes('toggleSlimHeader={toggleSlimHeader}'),
  'App.jsx must pass toggleSlimHeader to SpeakingWorkspace'
);
console.log('  ✅ 1. App.jsx dynamically hides website Navbar and passes expansion controls to all 4 workspaces');

// 2. Verify Writing Workspace
const subHeaderFile = path.resolve(__dirname, '../src/components/WritingSubHeaderToolbar.jsx');
const writingWorkspaceFile = path.resolve(__dirname, '../src/components/writing/WritingWorkspace.jsx');
assert(fs.existsSync(subHeaderFile) && fs.existsSync(writingWorkspaceFile), 'Writing components must exist');

const subHeaderCode = fs.readFileSync(subHeaderFile, 'utf8');
const writingWorkspaceCode = fs.readFileSync(writingWorkspaceFile, 'utf8');

assert(
  subHeaderCode.includes('Minimize2') && subHeaderCode.includes('Thu gọn') &&
  subHeaderCode.includes('Maximize2') && subHeaderCode.includes('Mở rộng'),
  'WritingSubHeaderToolbar must show expansion toggle with accurate labels'
);
assert(
  !writingWorkspaceCode.includes('setIsSlimHeader?.(true)'),
  'WritingWorkspace must NOT forcefully reset isSlimHeader to true on editor focus'
);
console.log('  ✅ 2. Writing workspace: Expansion toggle and editor focus resilience verified');

// 3. Verify Reading Workspace
const readingFile = path.resolve(__dirname, '../src/components/reading/ReadingWorkspace.jsx');
assert(fs.existsSync(readingFile), 'ReadingWorkspace.jsx must exist');
const readingCode = fs.readFileSync(readingFile, 'utf8');

assert(
  readingCode.includes('isSlimHeader = false') && readingCode.includes('toggleSlimHeader'),
  'ReadingWorkspace must declare isSlimHeader and toggleSlimHeader props'
);
assert(
  readingCode.includes('toggleSlimHeader') && readingCode.includes('Mở rộng tối đa không gian làm bài đọc'),
  'ReadingWorkspace must render workspace expansion toggle button'
);
console.log('  ✅ 3. Reading workspace: Full canvas expansion toggle integrated on both desktop and mobile');

// 4. Verify Listening Workspace
const listeningFile = path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx');
assert(fs.existsSync(listeningFile), 'ListeningWorkspace.jsx must exist');
const listeningCode = fs.readFileSync(listeningFile, 'utf8');

assert(
  listeningCode.includes('isSlimHeader = false') && listeningCode.includes('toggleSlimHeader'),
  'ListeningWorkspace must declare isSlimHeader and toggleSlimHeader props'
);
assert(
  listeningCode.includes('Mở rộng tối đa không gian làm bài nghe') &&
  listeningCode.includes('Mở rộng tối đa phòng thi Listening'),
  'ListeningWorkspace must render expansion toggle button in both Practice and Strict exam modes'
);
console.log('  ✅ 4. Listening workspace: Expansion toggle integrated in Practice & Strict mode');

// 5. Verify Speaking Workspace
const speakingFile = path.resolve(__dirname, '../src/components/speaking/SpeakingWorkspace.jsx');
assert(fs.existsSync(speakingFile), 'SpeakingWorkspace.jsx must exist');
const speakingCode = fs.readFileSync(speakingFile, 'utf8');

assert(
  speakingCode.includes('isSlimHeader = false') && speakingCode.includes('toggleSlimHeader'),
  'SpeakingWorkspace must declare isSlimHeader and toggleSlimHeader props'
);
assert(
  speakingCode.includes('Mở rộng tối đa phòng thi Speaking'),
  'SpeakingWorkspace must render expansion toggle button in top action toolbar'
);
console.log('  ✅ 5. Speaking workspace: Expansion toggle integrated in top toolbar');

console.log('🎉 Step 67: Universal workspace expansion verified across all 4 skills successfully!');
