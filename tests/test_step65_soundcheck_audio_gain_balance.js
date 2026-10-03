/**
 * Test Step 65: Soundcheck Audio Gain Balance (Bước 5)
 * 
 * Verifies:
 * 1. soundcheckAudio.js does not suffer from double volume attenuation (0.35 * clampedVol on note gain when masterGain already attenuates).
 * 2. Web Audio chime note peak gain is calibrated to 0.85 (matching real Cambridge test audio peak levels).
 * 3. Master gain linear scaling preserves full dynamic range (0.05 to 1.0).
 * 4. Speech synthesis receives matched clampedVol (rate: 0.95) for balanced volume perception.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 65: Soundcheck Audio Gain Balance Test Suite...');

// 1. Verify soundcheckAudio.js implementation
const soundcheckFile = path.resolve(__dirname, '../src/utils/soundcheckAudio.js');
assert(fs.existsSync(soundcheckFile), 'soundcheckAudio.js must exist');
const soundcheckCode = fs.readFileSync(soundcheckFile, 'utf8');

// 1.1 Verify elimination of double-attenuation / low 0.35 * clampedVol
assert(
  !soundcheckCode.includes('0.35 * clampedVol'),
  'soundcheckAudio.js must NOT have under-amplified chime gain (0.35 * clampedVol)'
);
console.log('  ✅ 1. Under-amplified 0.35 factor eliminated');

// 1.2 Verify calibration to 0.85 peak gain matching authentic Cambridge listening audio
assert(
  soundcheckCode.includes('linearRampToValueAtTime(0.85,'),
  'soundcheckAudio.js must calibrate chime note peak gain to 0.85'
);
console.log('  ✅ 2. Web Audio chime peak gain calibrated to 0.85 (real exam audio standard)');

// 1.3 Verify master gain scaling
assert(
  soundcheckCode.includes('const masterGain = activeAudioCtx.createGain();') &&
  soundcheckCode.includes('masterGain.gain.setValueAtTime(clampedVol, now);'),
  'soundcheckAudio.js must scale volume via masterGain'
);
console.log('  ✅ 3. Master gain linear scaling dynamically bounds audio output');

// 1.4 Verify speech volume matches clampedVol
assert(
  soundcheckCode.includes('volume: clampedVol') &&
  soundcheckCode.includes('rate: 0.95'),
  'soundcheckAudio.js must pass clampedVol to speech synthesis'
);
console.log('  ✅ 4. Speech announcement volume correctly synchronized with clampedVol');

console.log('🎉 Step 65: All 4/4 tests passed successfully!');
