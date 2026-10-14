/**
 * Test Step 133: Reading Workspace CDI Simulation & Workspace Expansion Deduplication Audit
 *
 * Verifies:
 * 1. Mobile Row 2 toolbar in ReadingWorkspace does NOT render duplicate Maximize2 buttons.
 * 2. Workspace Expansion (toggleSlimHeader) is the single dedicated canvas expander on mobile.
 * 3. CDI Computer Exam Simulation is relocated to the Mobile Tools dropdown with distinct Monitor icon.
 * 4. Desktop CDI Simulation button uses Monitor icon instead of duplicate Maximize2 icon.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Step 133: Reading Workspace CDI & Expand Deduplication Audit ---');

const readingPath = path.join(__dirname, '../src/components/reading/ReadingWorkspace.jsx');
const readingSource = fs.readFileSync(readingPath, 'utf8');

// 1. Monitor Icon Import
console.log('Test 1: Verifying Monitor icon import');
assert(readingSource.includes('Monitor') && readingSource.includes("from 'lucide-react'"), 'Must import Monitor icon');

// 2. Mobile Toolbar Deduplication
console.log('Test 2: Verifying mobile toolbar has zero duplicate Maximize2 buttons');
const mobileRow2Start = readingSource.indexOf('Mobile Row 2: Timer (Left) + Quick Actions (Right)');
const mobileRow2End = readingSource.indexOf('Tools Dropdown Trigger for Mobile');
const mobileRow2Chunk = readingSource.substring(mobileRow2Start, mobileRow2End);

// In mobile row 2, there should only be toggleSlimHeader with Maximize2, not cdiFullscreen
assert(
  !mobileRow2Chunk.includes('onClick={() => setCdiFullscreen(prev => !prev)}'),
  'Mobile row 2 must not have standalone cdiFullscreen button duplicating expander'
);
assert(
  mobileRow2Chunk.includes('toggleSlimHeader'),
  'Mobile row 2 must retain toggleSlimHeader workspace expander'
);

// 3. CDI in Mobile Tools Menu
console.log('Test 3: Verifying CDI Simulation is cleanly accessible in Mobile Tools dropdown');
const toolsMenuStart = readingSource.indexOf('{t(\'reading.utilitiesMenu\', \'Tiện Ích & Công Cụ\')}');
const toolsMenuEnd = readingSource.indexOf('Chế Độ Giấy Đọc (Bảo Vệ Mắt)');
const toolsMenuChunk = readingSource.substring(toolsMenuStart, toolsMenuEnd);

assert(
  toolsMenuChunk.includes('setCdiFullscreen') && toolsMenuChunk.includes('<Monitor'),
  'Mobile tools menu must offer CDI Simulation option with Monitor icon'
);

// 4. Desktop CDI Button Differentiation
console.log('Test 4: Verifying desktop CDI button uses Monitor icon instead of Maximize2');
const desktopToolbarStart = readingSource.indexOf('CDI Fullscreen Simulation Toggle & Contrast Theme Selector');
const desktopToolbarEnd = readingSource.indexOf('Workspace Expansion Toggle (Alt + Z)', desktopToolbarStart);
const desktopToolbarChunk = readingSource.substring(desktopToolbarStart, desktopToolbarEnd);

assert(
  desktopToolbarChunk.includes('<Monitor className="w-3.5 h-3.5 text-purple-600" />'),
  'Desktop CDI button must use Monitor icon'
);
assert(
  !desktopToolbarChunk.includes('<Maximize2 className="w-3.5 h-3.5 text-purple-600" />'),
  'Desktop CDI button must not use confusing Maximize2 icon'
);

console.log('\n🎉 ALL STEP 133 CDI & EXPAND DEDUPLICATION CHECKS PASSED CLEANLY!\n');
