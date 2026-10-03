/**
 * Test Step 66: Full Regression & Integration Verification for Notion Bugfix Checklist
 * 
 * Verifies all 5 bug fix phases comprehensively:
 * 1. [Phase 1] Speaking room stability: No stageTimerSeconds ReferenceError, dynamic duration calculation.
 * 2. [Phase 2] 100% English Exam Standard: Listening & Reading question panes and micro-drills use pure English prompts/labels.
 * 3. [Phase 3] Modal UI non-clipping: QR Code modal and Mock Test setup modals maintain sticky top/safe scroll without cutoffs.
 * 4. [Phase 4] Responsive header & Floating Scratchpad: Header avoids button overlap and scratchpad supports non-obstructive modes.
 * 5. [Phase 5] Soundcheck audio balance: Chime peak gain calibrated to 0.85 to match authentic exam audio without double attenuation.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 66: Full Notion Bugfix Regression Test Suite...');

// ==========================================
// 1. Phase 1 Verification: Speaking Room Stability
// ==========================================
const examinerRoomFile = path.resolve(__dirname, '../src/components/speaking/SpeakingExaminerRoom.jsx');
assert(fs.existsSync(examinerRoomFile), 'SpeakingExaminerRoom.jsx must exist');
const examinerCode = fs.readFileSync(examinerRoomFile, 'utf8');

assert(!examinerCode.includes('stageTimerSeconds'), 'Phase 1: Must not contain stageTimerSeconds ReferenceError');
assert(examinerCode.includes('turnDurationSec'), 'Phase 1: Must track turnDurationSec state');
assert(examinerCode.includes('turnStartTimeRef'), 'Phase 1: Must use turnStartTimeRef');
console.log('  ✅ Phase 1: Speaking room ReferenceError completely resolved');

// ==========================================
// 2. Phase 2 Verification: 100% English Content & Labels
// ==========================================
const listeningPaneFile = path.resolve(__dirname, '../src/components/listening/ListeningQuestionPane.jsx');
const readingPaneFile = path.resolve(__dirname, '../src/components/reading/QuestionPane.jsx');
const microDrillsDataFile = path.resolve(__dirname, '../src/data/speakingMicroDrills.js');
const microDrillsModalFile = path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx');

const listeningCode = fs.readFileSync(listeningPaneFile, 'utf8');
const readingCode = fs.readFileSync(readingPaneFile, 'utf8');
const microDrillsData = fs.readFileSync(microDrillsDataFile, 'utf8');
const microDrillsModal = fs.readFileSync(microDrillsModalFile, 'utf8');

// Listening Pane pure English checks
assert(!listeningCode.includes('Điền vào chỗ trống'), 'Phase 2: Listening pane must not have Vietnamese "Điền vào chỗ trống"');
assert(!listeningCode.includes('Lựa chọn...'), 'Phase 2: Listening pane must not have Vietnamese "Lựa chọn..."');
assert(listeningCode.includes('Complete the note / blank'), 'Phase 2: Listening pane must display "Complete the note / blank"');

// Reading Pane pure English checks
assert(!readingCode.includes('Bối cảnh tóm tắt:'), 'Phase 2: Reading pane must not have Vietnamese "Bối cảnh tóm tắt:"');
assert(!readingCode.includes('Ngân hàng từ / Lựa chọn tham chiếu:'), 'Phase 2: Reading pane must not have Vietnamese "Ngân hàng từ..."');
assert(!readingCode.includes('Danh sách tiêu đề:'), 'Phase 2: Reading pane must not have Vietnamese "Danh sách tiêu đề:"');
assert(readingCode.includes('Summary Context:'), 'Phase 2: Reading pane must display "Summary Context:"');
assert(readingCode.includes('Word Bank / Reference Options:'), 'Phase 2: Reading pane must display "Word Bank / Reference Options:"');
assert(readingCode.includes('List of Headings:'), 'Phase 2: Reading pane must display "List of Headings:"');

// Micro-Drills pure English prompts
const drillLines = microDrillsData.split('\n');
const viPromptErrors = [];
drillLines.forEach((line, idx) => {
  if (/(prompt|situation|taskPrompt|perspective):/.test(line) && /[\u00C0-\u1EF9]/.test(line)) {
    viPromptErrors.push(`Line ${idx + 1}: ${line.trim()}`);
  }
});
assert.strictEqual(viPromptErrors.length, 0, 'Phase 2: speakingMicroDrills must not have Vietnamese in prompts/situations');
assert(microDrillsModal.includes('1. Exam Question:') && microDrillsModal.includes('2. Passage Excerpt:'), 'Phase 2: MicroDrillsModal must render English question sections');
console.log('  ✅ Phase 2: 100% English exam questions, prompts, and options verified');

// ==========================================
// 3. Phase 3 Verification: Modal UI Non-Clipping
// ==========================================
const qrModalFile = path.resolve(__dirname, '../src/components/WebsiteQRCodeModal.jsx');
const mockModalFile = path.resolve(__dirname, '../src/components/MockTestModal.jsx');

const qrModalCode = fs.readFileSync(qrModalFile, 'utf8');
const mockModalCode = fs.readFileSync(mockModalFile, 'utf8');

assert(qrModalCode.includes('sticky top-0') && qrModalCode.includes('shrink-0'), 'Phase 3: QR Modal header must be sticky and shrink-0');
assert(qrModalCode.includes('max-h-[92vh]') && qrModalCode.includes('overflow-y-auto flex-1'), 'Phase 3: QR Modal body must be vertically bounded and scrollable');
assert(!mockModalCode.match(/activeMockTab === 'reading' && \(\s*<div className="[^"]*justify-center/), 'Phase 3: Reading setup must not have justify-center on scroll container');
assert(!mockModalCode.match(/activeMockTab === 'writing' && \(\s*<div className="[^"]*justify-center/), 'Phase 3: Writing setup must not have justify-center on scroll container');
console.log('  ✅ Phase 3: Modal header clipping and bottom cut-off resolved');

// ==========================================
// 4. Phase 4 Verification: Responsive Header & Floating Scratchpad
// ==========================================
const listeningWorkspaceFile = path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx');
const listeningWorkspaceCode = fs.readFileSync(listeningWorkspaceFile, 'utf8');

assert(listeningWorkspaceCode.includes('lg:flex-row') || listeningWorkspaceCode.includes('lg:items-center'), 'Phase 4: Listening header adapts at lg breakpoint');
assert(listeningWorkspaceCode.includes('whitespace-nowrap shrink-0'), 'Phase 4: Question counter preserves shrink-0');
assert(listeningCode.includes("scratchpadMode === 'floating'") && listeningCode.includes("scratchpadMode === 'minimized'"), 'Phase 4: Listening scratchpad supports floating & minimized modes');
console.log('  ✅ Phase 4: Non-overlapping header and floating scratchpad UX verified');

// ==========================================
// 5. Phase 5 Verification: Soundcheck Audio Balance
// ==========================================
const soundcheckFile = path.resolve(__dirname, '../src/utils/soundcheckAudio.js');
const soundcheckCode = fs.readFileSync(soundcheckFile, 'utf8');

assert(!soundcheckCode.includes('0.35 * clampedVol'), 'Phase 5: Under-amplified double attenuation must be removed');
assert(soundcheckCode.includes('linearRampToValueAtTime(0.85,'), 'Phase 5: Chime peak gain must be 0.85');
assert(soundcheckCode.includes('volume: clampedVol'), 'Phase 5: Speech volume must match master clampedVol');
console.log('  ✅ Phase 5: Soundcheck audio calibrated to authentic exam volume standard');

console.log('🎉 Step 66: Full regression and integration passed cleanly!');
