/**
 * Test Step 140: Practice Menu Single-Line and Responsive Width Audit
 *
 * Verifies:
 * 1. Practice dropdown in Navbar.jsx is widened to w-[420px] sm:w-[460px] with max-w-[calc(100vw-24px)] for cross-device responsiveness.
 * 2. Item rows in Practice menu use min-w-0 flex-1, whitespace-nowrap, and truncate so titles & descriptions stay on a single line.
 * 3. Icons and badges have shrink-0 to prevent layout collapse.
 * 4. Mobile drawer practice items have min-w-0, truncate whitespace-nowrap, and shrink-0 for beautiful mobile display.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Step 140: Practice Menu Single-Line and Responsive Width Audit ---');

const navbarPath = path.join(__dirname, '../src/components/Navbar.jsx');
const navbarSource = fs.readFileSync(navbarPath, 'utf8');

// 1. Container responsive width & max-width clamp
console.log('Test 1: Verifying Practice dropdown container width expansion');
assert(
  navbarSource.includes('w-[420px] sm:w-[460px] max-w-[calc(100vw-24px)]') ||
  navbarSource.includes('w-[min(420px,calc(100vw-24px))] sm:w-[460px] max-w-[calc(100vw-24px)]'),
  'Practice menu container must have responsive width clamp'
);

// 2. Single line layout with whitespace-nowrap & truncate on Practice items
console.log('Test 2: Verifying Practice menu items have single-line whitespace-nowrap');
assert(
  navbarSource.includes('min-w-0 flex-1') &&
  navbarSource.includes('whitespace-nowrap') &&
  navbarSource.includes('Mô phỏng áp lực phòng thi máy chuẩn IDP/BC') &&
  navbarSource.includes('Lộ trình 4 bước không áp lực cho người mất gốc') &&
  navbarSource.includes('Sprint 3 chặng nước rút cá nhân hóa theo điểm yếu'),
  'Practice menu items must use single-line layout with whitespace-nowrap'
);

// 3. Badges and icons shrink-0
console.log('Test 3: Verifying badges and icons have shrink-0');
assert(
  navbarSource.includes("'KHỞI ĐỘNG'") &&
  navbarSource.includes("'THI THỬ'") &&
  navbarSource.includes('shrink-0'),
  'Badges and icons must have shrink-0 to prevent compression'
);

// 4. Mobile drawer practice items responsive styling
console.log('Test 4: Verifying Mobile drawer practice items have truncate whitespace-nowrap');
assert(
  navbarSource.includes('truncate whitespace-nowrap">{isEn ? \'Band Diagnostic & 30-Day Plan\' : \'Định Vị Band & Lộ Trình 30 Ngày\'}</span>') &&
  navbarSource.includes('truncate whitespace-nowrap">{isEn ? \'30-Min Coach (Adaptive Sprint)\' : \'Huấn Luyện Viên 30P (Adaptive Sprint)\'}</span>'),
  'Mobile drawer practice items must have truncate whitespace-nowrap for single-line display'
);

console.log('✅ All 4/4 Practice Menu Single-Line and Responsive Width Audit checks passed!');
