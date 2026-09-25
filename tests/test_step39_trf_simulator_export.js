import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  calculateCambridgeOverallBand, 
  calculateCefrLevel, 
  generateTrfData 
} from '../src/services/trfExportService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Step 39 Test Suite: Official Cambridge TRF Simulator & PDF Export...');

// 1. Test Cambridge Grand Rounding Algorithm
{
  // Test Case 1: Exact average (6.5)
  assert.strictEqual(calculateCambridgeOverallBand(6.5, 6.5, 6.5, 6.5), 6.5, 'Equal 6.5 scores must produce 6.5');

  // Test Case 2: Fractional .25 rounds UP to .5 (e.g. 6.0 + 6.5 + 6.5 + 6.0 = 25 / 4 = 6.25 -> 6.5)
  assert.strictEqual(calculateCambridgeOverallBand(6.0, 6.5, 6.5, 6.0), 6.5, 'Average 6.25 (.25) must round up to 6.5');

  // Test Case 3: Fractional .125 (< .25) rounds DOWN to 6.0 (e.g. 6.0 + 6.0 + 6.5 + 6.0 = 24.5 / 4 = 6.125 -> 6.0)
  assert.strictEqual(calculateCambridgeOverallBand(6.0, 6.0, 6.5, 6.0), 6.0, 'Average 6.125 (< .25) must round down to 6.0');

  // Test Case 4: Fractional .75 rounds UP to next whole band (e.g. 7.5 + 8.0 + 7.5 + 8.0 = 31 / 4 = 7.75 -> 8.0)
  assert.strictEqual(calculateCambridgeOverallBand(7.5, 8.0, 7.5, 8.0), 8.0, 'Average 7.75 (.75) must round up to 8.0');

  // Test Case 5: Fractional .625 (>= .25 && < .75) rounds to .5 (e.g. 7.5 + 7.5 + 8.0 + 7.5 = 30.5 / 4 = 7.625 -> 7.5)
  assert.strictEqual(calculateCambridgeOverallBand(7.5, 7.5, 8.0, 7.5), 7.5, 'Average 7.625 must round to 7.5');

  // Test Case 6: Band 9.0 boundary (8.5 + 9.0 + 8.5 + 9.0 = 35 / 4 = 8.75 -> 9.0)
  assert.strictEqual(calculateCambridgeOverallBand(8.5, 9.0, 8.5, 9.0), 9.0, 'Average 8.75 must round up to 9.0');
  console.log('  ✅ 1. Official Cambridge Grand Rounding formula verified across all boundary conditions');
}

// 2. Test CEFR Level Conversion
{
  assert.strictEqual(calculateCefrLevel(9.0), 'C2', 'Band 9.0 must map to CEFR C2');
  assert.strictEqual(calculateCefrLevel(8.5), 'C2', 'Band 8.5 must map to CEFR C2');
  assert.strictEqual(calculateCefrLevel(8.0), 'C1', 'Band 8.0 must map to CEFR C1');
  assert.strictEqual(calculateCefrLevel(7.0), 'C1', 'Band 7.0 must map to CEFR C1');
  assert.strictEqual(calculateCefrLevel(6.5), 'B2', 'Band 6.5 must map to CEFR B2');
  assert.strictEqual(calculateCefrLevel(5.5), 'B2', 'Band 5.5 must map to CEFR B2');
  assert.strictEqual(calculateCefrLevel(5.0), 'B1', 'Band 5.0 must map to CEFR B1');
  assert.strictEqual(calculateCefrLevel(3.5), 'A2', 'Band 3.5 must map to CEFR A2');
  console.log('  ✅ 2. CEFR Level mapping matches Cambridge specifications');
}

// 3. Test generateTrfData Structure
{
  const data = generateTrfData({
    candidateName: 'Nguyen Van A',
    listeningBand: 7.0,
    readingBand: 7.5,
    writingBand: 6.5,
    speakingBand: 7.0,
    centreNumber: 'VN108'
  });

  assert.strictEqual(data.candidateName, 'NGUYEN VAN A', 'Candidate name must be uppercase');
  assert.strictEqual(data.scores.overall, 7.0, 'Average 7.0 must match overall');
  assert.strictEqual(data.cefrLevel, 'C1', '7.0 Overall must be CEFR C1');
  assert.ok(data.validationCode.startsWith('IELTS-VN108-'), 'Validation code must contain centre code');
  assert.ok(data.candidateNumber.length >= 6, 'Candidate number must be generated');
  console.log('  ✅ 3. generateTrfData correctly produces official TRF payload');
}

// 4. Verify TRFSimulatorModal.jsx exists and has expected UI elements
{
  const modalPath = path.join(rootDir, 'src', 'components', 'TRFSimulatorModal.jsx');
  assert.ok(fs.existsSync(modalPath), 'TRFSimulatorModal.jsx must exist');
  const content = fs.readFileSync(modalPath, 'utf8');

  assert.ok(content.includes('IELTS Official Test Report Form'), 'Modal must render official TRF title');
  assert.ok(content.includes('printTrfDocument'), 'Modal must import printTrfDocument');
  assert.ok(content.includes('validationCode'), 'Modal must display validation code');
  assert.ok(content.includes('OFFICIAL'), 'Modal must render official centre stamp');
  console.log('  ✅ 4. TRFSimulatorModal component provides authentic visual preview');
}

// 5. Verify MarathonTRFScorecard.jsx integrates TRFSimulatorModal
{
  const scorecardPath = path.join(rootDir, 'src', 'components', 'MarathonTRFScorecard.jsx');
  const content = fs.readFileSync(scorecardPath, 'utf8');

  assert.ok(content.includes('TRFSimulatorModal'), 'Scorecard must import TRFSimulatorModal');
  assert.ok(content.includes('generateTrfData'), 'Scorecard must import generateTrfData');
  assert.ok(content.includes('isTrfModalOpen'), 'Scorecard must manage isTrfModalOpen state');
  assert.ok(content.includes('Xem & Tải Phiếu Điểm (PDF)'), 'Scorecard must render TRF export button');
  console.log('  ✅ 5. MarathonTRFScorecard connects directly to TRF Simulator & PDF Export');
}

// 6. Verify modalStore.js registers trfSimulator
{
  const storePath = path.join(rootDir, 'src', 'core', 'modalStore.js');
  const content = fs.readFileSync(storePath, 'utf8');
  assert.ok(content.includes('trfSimulator: false'), 'modalStore must contain trfSimulator state');
  console.log('  ✅ 6. modalStore registers trfSimulator for centralized modal control');
}

console.log('🎉 Step 39 Test Suite: All 6 checks passed cleanly (100%)!');
