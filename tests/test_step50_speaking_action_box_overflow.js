/**
 * Test Step 50: Speaking Ready Action Box Responsive Layout & Overflow Fix
 *
 * Verifies:
 * 1. SpeakingWorkspace Ready Action Box uses 'flex-col xl:flex-row' instead of 'sm:flex-row'
 *    to prevent the 3 action buttons from colliding with the title on tablet / 672px screens.
 * 2. The container uses 'overflow-hidden' and 'rounded-2xl' to guarantee no button can protrude.
 * 3. Left text container has 'min-w-0 flex-1' to allow proper line wrapping.
 * 4. The buttons container has 'flex-wrap' and responsive width ('w-full xl:w-auto') so all 3 buttons
 *    ('Thuộc Đề', 'Kiểm Tra Thiết Bị', 'Vào Thi Đề Này') fit cleanly within the card boundaries.
 * 5. Adaptive paddings for buttons ('px-3.5 sm:px-4', 'px-4 sm:px-5') ensure proper mobile & tablet breathing room.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Testing Step 50: Speaking Action Box Overflow Fix ---');

const workspacePath = path.join(__dirname, '../src/components/speaking/SpeakingWorkspace.jsx');
const source = fs.readFileSync(workspacePath, 'utf8');

console.log('Test 1: Verifying Ready Action Box uses xl:flex-row instead of sm:flex-row');
assert(!source.includes('sm:flex-row items-center justify-between gap-3 pt-4'), 
  'Ready Action Box must NOT use sm:flex-row which causes overflow at 672px tablet width');
assert(source.includes('flex flex-col xl:flex-row items-start xl:items-center justify-between'),
  'Ready Action Box must use flex-col xl:flex-row for safe tablet stacking');

console.log('Test 2: Verifying overflow-hidden protection on action container');
assert(source.includes('rounded-2xl bg-purple-950/40 border border-purple-800/50') && source.includes('overflow-hidden'),
  'Action container must include overflow-hidden to clip any unintended bleeding');

console.log('Test 3: Verifying min-w-0 flex-1 on text container');
assert(source.includes('text-xs text-slate-300 text-left min-w-0 flex-1 space-y-1'),
  'Text container must include min-w-0 flex-1 to wrap titles properly');

console.log('Test 4: Verifying responsive buttons container with flex-wrap and w-full xl:w-auto');
assert(source.includes('flex flex-wrap sm:flex-nowrap items-center justify-start sm:justify-end gap-2 sm:gap-2.5 w-full xl:w-auto'),
  'Buttons container must support flex-wrap and full-width on mobile/tablet screens');

console.log('Test 5: Verifying responsive padding on Vào Thi Đề Này button');
assert(source.includes('px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600'),
  'Vào Thi Đề Này button must use responsive padding (px-4 py-2 sm:px-5)');

console.log('✅ All 5/5 checks passed cleanly for Step 50 Speaking Action Box Overflow Fix!');
process.exit(0);
