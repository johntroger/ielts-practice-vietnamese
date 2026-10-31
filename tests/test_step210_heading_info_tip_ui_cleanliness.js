/**
 * test_step210_heading_info_tip_ui_cleanliness.js
 * Verification suite for Step 210:
 * UI Decluttering - Heading Info Tooltip ('i') Pattern & Subtitle Elimination
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 210: Heading Info Tooltip & UI Cleanliness Verification Tests...\n');

let passedTests = 0;

// Test 1: Verify HeadingInfoTip component exists and exports properly
console.log('Test 1: HeadingInfoTip component existence and structure...');
const tipPath = path.resolve(__dirname, '../src/components/common/HeadingInfoTip.jsx');
assert.ok(fs.existsSync(tipPath), 'HeadingInfoTip.jsx must exist');
const tipSrc = fs.readFileSync(tipPath, 'utf-8');
assert.ok(tipSrc.includes('export default function HeadingInfoTip'), 'HeadingInfoTip must be default export');
assert.ok(tipSrc.includes('onMouseEnter') && tipSrc.includes('onMouseLeave'), 'Must handle hover interactions');
assert.ok(tipSrc.includes('onClick'), 'Must handle mobile click/tap interactions');
assert.ok(tipSrc.includes('<span className="leading-none select-none">i</span>'), 'Must display small "i" icon');
passedTests++;
console.log('  ✓ HeadingInfoTip component verified\n');

// Test 2: Verify ListeningQuestionPane uses HeadingInfoTip and cleans group subtitle
console.log('Test 2: ListeningQuestionPane HeadingInfoTip integration...');
const listeningPanePath = path.resolve(__dirname, '../src/components/listening/ListeningQuestionPane.jsx');
const listeningPaneSrc = fs.readFileSync(listeningPanePath, 'utf-8');
assert.ok(listeningPaneSrc.includes('HeadingInfoTip'), 'ListeningQuestionPane must import HeadingInfoTip');
assert.ok(listeningPaneSrc.includes('<HeadingInfoTip'), 'ListeningQuestionPane must render HeadingInfoTip next to group title');
assert.ok(!listeningPaneSrc.includes('<p className={`mt-1.5 whitespace-pre-line font-serif italic text-slate-600'), 'ListeningQuestionPane must remove cluttered subtitle paragraph under heading');
passedTests++;
console.log('  ✓ ListeningQuestionPane decluttering verified\n');

// Test 3: Verify Reading QuestionPane uses HeadingInfoTip
console.log('Test 3: Reading QuestionPane HeadingInfoTip integration...');
const readingPanePath = path.resolve(__dirname, '../src/components/reading/QuestionPane.jsx');
const readingPaneSrc = fs.readFileSync(readingPanePath, 'utf-8');
assert.ok(readingPaneSrc.includes('HeadingInfoTip'), 'Reading QuestionPane must import HeadingInfoTip');
assert.ok(readingPaneSrc.includes('<HeadingInfoTip'), 'Reading QuestionPane must render HeadingInfoTip');
passedTests++;
console.log('  ✓ Reading QuestionPane decluttering verified\n');

// Test 4: Verify Key Modals integrate HeadingInfoTip on their titles
console.log('Test 4: Core modals HeadingInfoTip integration...');
const filesToCheck = [
  { name: 'MicroDrillsModal', path: '../src/components/MicroDrillsModal.jsx' },
  { name: 'TheoryHandbookModal', path: '../src/components/TheoryHandbookModal.jsx' },
  { name: 'VocabGrammarSpellingModal', path: '../src/components/VocabGrammarSpellingModal.jsx' },
  { name: 'DiagnosticPlacementModal', path: '../src/components/DiagnosticPlacementModal.jsx' },
  { name: 'TaskLibraryModal', path: '../src/components/TaskLibraryModal.jsx' },
  { name: 'TaskGeneratorModal', path: '../src/components/TaskGeneratorModal.jsx' },
  { name: 'DailyErrorPrescriptionModal', path: '../src/components/DailyErrorPrescriptionModal.jsx' },
  { name: 'AdaptiveSprintModal', path: '../src/components/AdaptiveSprintModal.jsx' },
  { name: 'GrowthAnalyticsModal', path: '../src/components/GrowthAnalyticsModal.jsx' },
  { name: 'BeginnerGuideModal', path: '../src/components/BeginnerGuideModal.jsx' },
  { name: 'FeaturesGuideModal', path: '../src/components/FeaturesGuideModal.jsx' },
  { name: 'IdeaMatrixModal', path: '../src/components/IdeaMatrixModal.jsx' },
  { name: 'SpeakingMockLibraryModal', path: '../src/components/speaking/SpeakingMockLibraryModal.jsx' },
  { name: 'AtlasEnglishArenaModal', path: '../src/components/arena/AtlasEnglishArenaModal.jsx' }
];

filesToCheck.forEach(({ name, path: relPath }) => {
  const filePath = path.resolve(__dirname, relPath);
  assert.ok(fs.existsSync(filePath), `${name} must exist`);
  const src = fs.readFileSync(filePath, 'utf-8');
  assert.ok(src.includes('HeadingInfoTip'), `${name} must import HeadingInfoTip`);
  assert.ok(src.includes('<HeadingInfoTip'), `${name} must render HeadingInfoTip`);
});
passedTests++;
console.log(`  ✓ All ${filesToCheck.length} key modals verified with HeadingInfoTip\n`);

// Test 5: Verify strict line count limits on constrained components
console.log('Test 5: Architecture line count limits check...');
const microDrillsSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/MicroDrillsModal.jsx'), 'utf-8');
const microDrillsLines = microDrillsSrc.split('\n').length;
assert.ok(microDrillsLines < 2300, `MicroDrillsModal must remain < 2300 lines (actual: ${microDrillsLines})`);

const listeningWsSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/listening/ListeningWorkspace.jsx'), 'utf-8');
const listeningWsLines = listeningWsSrc.split('\n').length;
assert.ok(listeningWsLines < 1750, `ListeningWorkspace must remain < 1750 lines (actual: ${listeningWsLines})`);
passedTests++;
console.log('  ✓ Architecture line count limits satisfied\n');

console.log('===============================================================');
console.log(`🎉 ALL ${passedTests}/5 TESTS PASSED CLEANLY FOR STEP 210!`);
console.log('===============================================================');
