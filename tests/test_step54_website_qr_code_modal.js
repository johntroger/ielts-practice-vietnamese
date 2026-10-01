/**
 * Test Suite Step 54: Website QR Code Modal & Navbar Quick Access
 * 
 * Verifies that:
 * 1. WEBSITE_URL matches 'https://ielts-practice-vietnamese.vercel.app/'.
 * 2. QRCode library can generate high-resolution scannable QR data URLs.
 * 3. WebsiteQRCodeModal component has complete features (download, copy link, scan instructions).
 * 4. Navbar.jsx integrates the interactive logo with QR badge indicator and renders WebsiteQRCodeModal.
 * 5. Mobile navigation drawer provides quick-access QR scan trigger.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

console.log('📱 Testing Step 54: Website QR Code Modal & Quick Access Trigger...');

const modalFilePath = path.resolve('src/components/WebsiteQRCodeModal.jsx');
assert(fs.existsSync(modalFilePath), 'src/components/WebsiteQRCodeModal.jsx must exist');
const modalContent = fs.readFileSync(modalFilePath, 'utf8');

// -------------------------------------------------------------
// 1. VERIFY WEBSITE URL AND CONFIGURATION
// -------------------------------------------------------------
console.log('  ▶ 1. Verifying website destination URL...');
const urlMatch = modalContent.match(/export const WEBSITE_URL = ['"]([^'"]+)['"]/);
assert(urlMatch, 'WEBSITE_URL constant must be exported in WebsiteQRCodeModal.jsx');
const WEBSITE_URL = urlMatch[1];

assert.strictEqual(
  WEBSITE_URL, 
  'https://ielts-practice-vietnamese.vercel.app/', 
  'WEBSITE_URL must strictly match https://ielts-practice-vietnamese.vercel.app/'
);
assert(WEBSITE_URL.startsWith('https://'), 'URL must be secure HTTPS');
console.log(`    ✅ Destination URL verified: ${WEBSITE_URL}`);

// -------------------------------------------------------------
// 2. VERIFY QR CODE GENERATION WITH QRCODE LIBRARY
// -------------------------------------------------------------
console.log('  ▶ 2. Verifying QR code generation engine...');

async function testQrGeneration() {
  const dataUrl = await QRCode.toDataURL(WEBSITE_URL, {
    width: 320,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });

  assert(typeof dataUrl === 'string', 'Generated QR code must be a string');
  assert(dataUrl.startsWith('data:image/png;base64,'), 'QR code must be a base64 PNG data URI');
  assert(dataUrl.length > 500, 'QR code base64 payload must be reasonably sized');

  const svgString = await QRCode.toString(WEBSITE_URL, { type: 'svg' });
  assert(typeof svgString === 'string', 'QR code SVG must be a string');
  assert(svgString.includes('<svg'), 'QR SVG must contain <svg tag');
  console.log(`    ✅ QR code generated successfully (${dataUrl.length} chars base64, SVG supported).`);
}

await testQrGeneration();

// -------------------------------------------------------------
// 3. VERIFY WEBSITE QR CODE MODAL COMPONENT INTEGRITY
// -------------------------------------------------------------
console.log('  ▶ 3. Verifying WebsiteQRCodeModal.jsx source code...');
assert(modalContent.includes('export const WEBSITE_URL'), 'Modal must export WEBSITE_URL constant');
assert(modalContent.includes('export default function WebsiteQRCodeModal'), 'Modal must have default export WebsiteQRCodeModal');
assert(modalContent.includes('handleCopyLink'), 'Modal must contain copy link handler');
assert(modalContent.includes('handleDownloadQR'), 'Modal must contain download QR handler');
assert(modalContent.includes('ielts-practice-vietnamese-qr.png'), 'Download filename must be user-friendly PNG');
assert(modalContent.includes('Zalo'), 'Modal must mention Zalo / camera scanner support');
assert(modalContent.includes('Escape'), 'Modal must support closing on Escape key');
console.log('    ✅ WebsiteQRCodeModal component structure and features verified.');

// -------------------------------------------------------------
// 4. VERIFY NAVBAR INTEGRATION
// -------------------------------------------------------------
console.log('  ▶ 4. Verifying Navbar.jsx interactive Logo & QR Integration...');
const navbarFilePath = path.resolve('src/components/Navbar.jsx');
assert(fs.existsSync(navbarFilePath), 'src/components/Navbar.jsx must exist');
const navbarContent = fs.readFileSync(navbarFilePath, 'utf8');

assert(navbarContent.includes('import WebsiteQRCodeModal'), 'Navbar must import WebsiteQRCodeModal');
assert(navbarContent.includes('QrCode'), 'Navbar must import QrCode icon');
assert(navbarContent.includes('isQrModalOpen'), 'Navbar must manage isQrModalOpen state');
assert(navbarContent.includes('setIsQrModalOpen(true)'), 'Navbar must have click trigger to open QR modal');
assert(navbarContent.includes('<WebsiteQRCodeModal'), 'Navbar must render WebsiteQRCodeModal');
assert(navbarContent.includes('Quét mã QR truy cập nhanh'), 'Navbar logo must have descriptive tooltip');
console.log('    ✅ Navbar logo trigger, QR badge, and modal rendering verified.');

// -------------------------------------------------------------
// 5. VERIFY MOBILE DRAWER ACCESS
// -------------------------------------------------------------
console.log('  ▶ 5. Verifying Mobile Navigation Drawer QR Access...');
assert(
  navbarContent.includes('Mã QR Website (Quét Mở Nhanh)'), 
  'Navbar mobile drawer must include quick access button for QR code'
);
console.log('    ✅ Mobile drawer fast access button verified.');

console.log('\n🎉 ALL STEP 54 WEBSITE QR CODE VERIFICATIONS PASSED (5/5)!');
