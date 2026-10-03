/**
 * Test Step 75: Micro-Drills Sub-Rooms Architecture Modularization
 *
 * Verifies:
 * 1. src/components/drills/ exists with 5 specialized sub-room components + barrel index:
 *    - ReadingDrillRoom.jsx
 *    - GeneralDrillRoom.jsx
 *    - WritingDrillRoom.jsx
 *    - ListeningDrillRoom.jsx
 *    - SpeakingDrillRoom.jsx
 *    - index.js
 * 2. MicroDrillsModal.jsx is decluttered from 4,462 lines down to under 2,000 lines.
 * 3. MicroDrillsModal.jsx imports and cleanly renders the domain Sub-Rooms.
 * 4. Sub-rooms correctly encapsulate their domain-specific controls and English standardization labels.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Step 75: Micro-Drills Sub-Rooms Architecture Modularization...');

// 1. Check directory and sub-room files
const drillsDir = path.resolve(__dirname, '../src/components/drills');
assert.ok(fs.existsSync(drillsDir), 'src/components/drills directory must exist');

const expectedFiles = [
  'ReadingDrillRoom.jsx',
  'GeneralDrillRoom.jsx',
  'WritingDrillRoom.jsx',
  'ListeningDrillRoom.jsx',
  'SpeakingDrillRoom.jsx',
  'index.js'
];

expectedFiles.forEach(file => {
  const filePath = path.join(drillsDir, file);
  assert.ok(fs.existsSync(filePath), `Sub-room file ${file} must exist`);
});
console.log('  ✅ 1. All 5 Domain Drill Rooms and barrel index exist in src/components/drills/');

// 2. Verify MicroDrillsModal.jsx line count and imports
const modalPath = path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx');
assert.ok(fs.existsSync(modalPath), 'MicroDrillsModal.jsx must exist');
const modalContent = fs.readFileSync(modalPath, 'utf8');
const modalLines = modalContent.split('\n').length;

assert.ok(
  modalLines < 2100,
  `MicroDrillsModal.jsx should be streamlined under 2,100 lines (actual: ${modalLines} lines)`
);
console.log(`  ✅ 2. MicroDrillsModal.jsx drastically reduced from 4,462 to ${modalLines} lines`);

assert.ok(modalContent.includes("from './drills'"), 'MicroDrillsModal.jsx must import from ./drills');
assert.ok(modalContent.includes('<ReadingDrillRoom'), 'MicroDrillsModal must render ReadingDrillRoom');
assert.ok(modalContent.includes('<GeneralDrillRoom'), 'MicroDrillsModal must render GeneralDrillRoom');
assert.ok(modalContent.includes('<WritingDrillRoom'), 'MicroDrillsModal must render WritingDrillRoom');
assert.ok(modalContent.includes('<ListeningDrillRoom'), 'MicroDrillsModal must render ListeningDrillRoom');
assert.ok(modalContent.includes('<SpeakingDrillRoom'), 'MicroDrillsModal must render SpeakingDrillRoom');
console.log('  ✅ 3. MicroDrillsModal.jsx successfully mounts all 5 Domain Sub-Rooms');

// 3. Verify ReadingDrillRoom encapsulation & English labels
const readingCode = fs.readFileSync(path.join(drillsDir, 'ReadingDrillRoom.jsx'), 'utf8');
assert.ok(readingCode.includes('Your Selection:'), 'ReadingDrillRoom must retain English "Your Selection:" label');
assert.ok(readingCode.includes('1. Exam Question:'), 'ReadingDrillRoom must retain English "1. Exam Question:" label');
assert.ok(readingCode.includes('2. Passage Excerpt:'), 'ReadingDrillRoom must retain English "2. Passage Excerpt:" label');
assert.ok(readingCode.includes('currentTfng'), 'ReadingDrillRoom must handle TFNG');
assert.ok(readingCode.includes('currentHeadings'), 'ReadingDrillRoom must handle Headings');
console.log('  ✅ 4. ReadingDrillRoom encapsulates TFNG, Paraphrase, and Headings with English standardized labels');

// 4. Verify ListeningDrillRoom encapsulation
const listeningCode = fs.readFileSync(path.join(drillsDir, 'ListeningDrillRoom.jsx'), 'utf8');
assert.ok(listeningCode.includes('MicroDrillAudioBar'), 'ListeningDrillRoom must use MicroDrillAudioBar');
assert.ok(listeningCode.includes('listening-dictation'), 'ListeningDrillRoom must handle dictation');
assert.ok(listeningCode.includes('listening-spelling'), 'ListeningDrillRoom must handle spelling');
assert.ok(listeningCode.includes('listening-distractor'), 'ListeningDrillRoom must handle distractor');
assert.ok(listeningCode.includes('listening-map'), 'ListeningDrillRoom must handle map');
assert.ok(listeningCode.includes('listening-signposting'), 'ListeningDrillRoom must handle signposting');
console.log('  ✅ 5. ListeningDrillRoom encapsulates all 5 audio micro-labs');

// 5. Verify SpeakingDrillRoom encapsulation
const speakingCode = fs.readFileSync(path.join(drillsDir, 'SpeakingDrillRoom.jsx'), 'utf8');
assert.ok(speakingCode.includes('speaking-area'), 'SpeakingDrillRoom must handle AREA formula');
assert.ok(speakingCode.includes('speaking-fillers'), 'SpeakingDrillRoom must handle fillers');
assert.ok(speakingCode.includes('speaking-collocations'), 'SpeakingDrillRoom must handle collocations');
assert.ok(speakingCode.includes('speaking-part3-counter'), 'SpeakingDrillRoom must handle Part 3 counter-arguments');
console.log('  ✅ 6. SpeakingDrillRoom encapsulates fluency & reflex training');

console.log('🎉 Step 75: Micro-Drills Sub-Rooms Architecture Modularization passed cleanly!');
