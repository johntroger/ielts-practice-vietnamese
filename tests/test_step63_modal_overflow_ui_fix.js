/**
 * Test Step 63: Modal Layout Overflow & Top Cut-Off UI Fix (Bước 3)
 * 
 * Verifies:
 * 1. WebsiteQRCodeModal.jsx wraps dialog with max-h-[92vh], flex flex-col, and my-auto.
 * 2. WebsiteQRCodeModal.jsx pins header ribbon with sticky top-0 and shrink-0 so close button 'X' never floats off-screen.
 * 3. WebsiteQRCodeModal.jsx applies overflow-y-auto to modal body for responsive small screen scrolling.
 * 4. MockTestModal.jsx removes conflicting justify-center from overflow-y-auto containers in Reading and Writing setups.
 * 5. MockTestModal.jsx protects pacing advice bar and task switcher bar with shrink-0 against small viewport distortion.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 63: Modal Layout Overflow UI Fix Test Suite...');

// 1. Verify WebsiteQRCodeModal.jsx
const qrModalFile = path.resolve(__dirname, '../src/components/WebsiteQRCodeModal.jsx');
assert(fs.existsSync(qrModalFile), 'WebsiteQRCodeModal.jsx must exist');
const qrCode = fs.readFileSync(qrModalFile, 'utf8');

assert(
  qrCode.includes('overflow-y-auto') && qrCode.includes('max-h-[92vh]'),
  'WebsiteQRCodeModal must constrain dialog with max-h-[92vh] and allow outer scrolling'
);
assert(
  qrCode.includes('sticky top-0') && qrCode.includes('shrink-0'),
  'WebsiteQRCodeModal header ribbon must be sticky and shrink-0 to preserve close button'
);
assert(
  qrCode.includes('overflow-y-auto flex-1'),
  'WebsiteQRCodeModal body content must be scrollable with flex-1'
);
console.log('  ✅ 1. WebsiteQRCodeModal correctly constrains dialog and pins close button header');

// 2. Verify MockTestModal.jsx
const mockModalFile = path.resolve(__dirname, '../src/components/MockTestModal.jsx');
assert(fs.existsSync(mockModalFile), 'MockTestModal.jsx must exist');
const mockCode = fs.readFileSync(mockModalFile, 'utf8');

// Ensure no conflicting justify-center on the scrollable flex-1 containers
const readingSetupMatch = mockCode.match(/activeMockTab === 'reading' && \(\s*<div className="([^"]+)"/);
assert(readingSetupMatch, 'Reading setup container must be found');
assert(
  !readingSetupMatch[1].includes('justify-center'),
  'Reading setup container must not contain justify-center on scroll container'
);

const writingSetupMatch = mockCode.match(/activeMockTab === 'writing' && \(\s*<div className="([^"]+)"/);
assert(writingSetupMatch, 'Writing setup container must be found');
assert(
  !writingSetupMatch[1].includes('justify-center'),
  'Writing setup container must not contain justify-center on scroll container'
);

// Ensure shrink-0 on fixed action bars
assert(
  mockCode.includes('px-4 py-1.5 text-[11px] flex items-center justify-between border-b border-slate-800 shrink-0'),
  'MockTestModal pacing advice bar must have shrink-0'
);
assert(
  mockCode.includes('px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0'),
  'MockTestModal task switcher bar must have shrink-0'
);
console.log('  ✅ 2. MockTestModal eliminates top cut-off bug and stabilizes action bars');

console.log('🎉 Step 63: All tests passed successfully!');
