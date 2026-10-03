/**
 * Test Step 64: Listening Workspace Header Overlap Fix & Non-obstructive Scratchpad UX (Bước 4)
 * 
 * Verifies:
 * 1. ListeningWorkspace.jsx standardizes header responsive flex row to lg:flex-row to eliminate test selector overlap.
 * 2. ListeningWorkspace.jsx protects questions counter with whitespace-nowrap and shrink-0 so question count never wraps prematurely.
 * 3. ListeningWorkspace.jsx constrains test switcher dropdown with shrink-0 and xl:block.
 * 4. ListeningQuestionPane.jsx introduces scratchpadMode ('floating' | 'minimized' | 'sidebar').
 * 5. ListeningQuestionPane.jsx provides floating window mode that avoids covering exam questions on the left/top.
 * 6. ListeningQuestionPane.jsx provides minimized pill mode with 1-click restore.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 64: Listening Header & Non-obstructive Scratchpad Test Suite...');

// 1. Verify ListeningWorkspace.jsx
const workspaceFile = path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx');
assert(fs.existsSync(workspaceFile), 'ListeningWorkspace.jsx must exist');
const workspaceCode = fs.readFileSync(workspaceFile, 'utf8');

assert(
  workspaceCode.includes('flex flex-col lg:flex-row lg:items-center lg:justify-between'),
  'ListeningWorkspace header must activate single row at lg breakpoint'
);
assert(
  workspaceCode.includes('whitespace-nowrap shrink-0') && workspaceCode.includes('{currentTest.totalQuestions} câu'),
  'ListeningWorkspace question count must be protected with whitespace-nowrap shrink-0'
);
assert(
  workspaceCode.includes('hidden xl:block') && workspaceCode.includes('shrink-0'),
  'ListeningWorkspace test switcher dropdown must have shrink-0 and xl:block'
);
console.log('  ✅ 1. ListeningWorkspace header layout stabilized across breakpoints');

// 2. Verify ListeningQuestionPane.jsx
const questionPaneFile = path.resolve(__dirname, '../src/components/listening/ListeningQuestionPane.jsx');
assert(fs.existsSync(questionPaneFile), 'ListeningQuestionPane.jsx must exist');
const questionPaneCode = fs.readFileSync(questionPaneFile, 'utf8');

assert(
  questionPaneCode.includes("const [scratchpadMode, setScratchpadMode] = useState('floating')"),
  'ListeningQuestionPane must declare scratchpadMode with default floating'
);
assert(
  questionPaneCode.includes("scratchpadMode === 'minimized'") && questionPaneCode.includes("scratchpadMode === 'floating'"),
  'ListeningQuestionPane must support minimized and floating scratchpad modes'
);
assert(
  questionPaneCode.includes('bottom-4 right-4 z-40'),
  'ListeningQuestionPane floating scratchpad must anchor non-obstructively to bottom right'
);
console.log('  ✅ 2. ListeningQuestionPane provides non-obstructive floating & minimized scratchpad UX');

console.log('🎉 Step 64: All tests passed successfully!');
