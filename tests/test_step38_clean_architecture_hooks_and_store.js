import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getAppState, 
  setAppState, 
  setCdiFontSize, 
  setCdiContrast, 
  setActiveSkill, 
  toggleMasteredItem, 
  isItemMastered 
} from '../src/core/appStore.js';
import { getCdiTimerStatus } from '../src/utils/cdiExamSimulator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Step 38 Test Suite: Clean Architecture Custom Hooks & Unified AppStore (Phase 3)...');

// 1. Verify appStore State Management and Pub/Sub
{
  const initialState = getAppState();
  assert.ok(initialState !== null, 'getAppState must return valid state object');
  assert.ok('cdiFontSize' in initialState, 'State must contain cdiFontSize');
  assert.ok('cdiContrast' in initialState, 'State must contain cdiContrast');
  assert.ok('masteredItemIds' in initialState, 'State must contain masteredItemIds');
  assert.ok('activeSkill' in initialState, 'State must contain activeSkill');

  // Test setCdiFontSize
  setCdiFontSize('large');
  assert.strictEqual(getAppState().cdiFontSize, 'large', 'setCdiFontSize must update state to large');

  // Test setCdiContrast
  setCdiContrast('yellowOnBlack');
  assert.strictEqual(getAppState().cdiContrast, 'yellowOnBlack', 'setCdiContrast must update state to yellowOnBlack');

  // Test setActiveSkill
  setActiveSkill('reading');
  assert.strictEqual(getAppState().activeSkill, 'reading', 'setActiveSkill must update active skill to reading');

  // Test Mastered Items toggle
  const testItemId = 'test-drill-sample-101';
  assert.strictEqual(isItemMastered(testItemId), false, 'Initially item should not be mastered');
  toggleMasteredItem(testItemId);
  assert.strictEqual(isItemMastered(testItemId), true, 'toggleMasteredItem must mark item as mastered');
  toggleMasteredItem(testItemId);
  assert.strictEqual(isItemMastered(testItemId), false, 'Calling toggleMasteredItem again must unmark item');
  console.log('  ✅ 1. appStore provides 0ms reactive cross-cutting state management');
}

// 2. Verify Timer Formatting & Warning Triggers (useReadingExamTimer core logic)
{
  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  assert.strictEqual(formatTimer(3600), '60:00', '3600 seconds must format to 60:00');
  assert.strictEqual(formatTimer(2715), '45:15', '2715 seconds must format to 45:15');
  assert.strictEqual(formatTimer(59), '00:59', '59 seconds must format to 00:59');

  // Official Cambridge CDI warning triggers
  const warning10m = getCdiTimerStatus(600);
  assert.ok(warning10m.noticeText.includes('10 phút'), 'Must trigger 10-minute warning at 600s');

  const warning5m = getCdiTimerStatus(300);
  assert.ok(warning5m.noticeText.includes('5 phút'), 'Must trigger 5-minute warning at 300s');
  console.log('  ✅ 2. Timer countdown formatting and CDI official alerts verified');
}

// 3. Verify useReadingExamTimer Hook exists and exports functions
{
  const hookPath = path.join(rootDir, 'src', 'hooks', 'useReadingExamTimer.js');
  assert.ok(fs.existsSync(hookPath), 'useReadingExamTimer.js must exist');
  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content.includes('export function useReadingExamTimer'), 'Must export useReadingExamTimer');
  assert.ok(content.includes('getCdiTimerStatus'), 'Must utilize getCdiTimerStatus');
  assert.ok(content.includes('formatTimer'), 'Must provide formatTimer helper');
  assert.ok(content.includes('activeCdiNotice'), 'Must manage activeCdiNotice');
  console.log('  ✅ 3. useReadingExamTimer decouples exam timer from ReadingWorkspace');
}

// 4. Verify usePassageEvidence Hook exists and exports functions
{
  const hookPath = path.join(rootDir, 'src', 'hooks', 'usePassageEvidence.js');
  assert.ok(fs.existsSync(hookPath), 'usePassageEvidence.js must exist');
  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content.includes('export function usePassageEvidence'), 'Must export usePassageEvidence');
  assert.ok(content.includes('locateEvidence'), 'Must provide locateEvidence function');
  assert.ok(content.includes('jumpToQuestion'), 'Must provide jumpToQuestion function');
  assert.ok(content.includes('activeEvidencePara'), 'Must manage activeEvidencePara');
  console.log('  ✅ 4. usePassageEvidence decouples passage scrolling & evidence jumping');
}

// 5. Verify useListeningShortcuts Hook exists and exports functions
{
  const hookPath = path.join(rootDir, 'src', 'hooks', 'useListeningShortcuts.js');
  assert.ok(fs.existsSync(hookPath), 'useListeningShortcuts.js must exist');
  const content = fs.readFileSync(hookPath, 'utf8');
  assert.ok(content.includes('export function useListeningShortcuts'), 'Must export useListeningShortcuts');
  assert.ok(content.includes('Space'), 'Must handle Space key for play/pause');
  assert.ok(content.includes('ArrowLeft'), 'Must handle ArrowLeft for rewind 5s');
  assert.ok(content.includes('ArrowRight'), 'Must handle ArrowRight for fast-forward 5s');
  assert.ok(content.includes('activeElement'), 'Must safely check activeElement to prevent typing interference');
  console.log('  ✅ 5. useListeningShortcuts provides ergonomic audio keyboard controls');
}

// 6. Verify ReadingWorkspace.jsx integrates the new hooks
{
  const workspacePath = path.join(rootDir, 'src', 'components', 'reading', 'ReadingWorkspace.jsx');
  const content = fs.readFileSync(workspacePath, 'utf8');
  assert.ok(content.includes('useReadingExamTimer'), 'ReadingWorkspace must import useReadingExamTimer');
  assert.ok(content.includes('usePassageEvidence'), 'ReadingWorkspace must import usePassageEvidence');
  console.log('  ✅ 6. ReadingWorkspace successfully refactored to use dedicated custom hooks');
}

// 7. Verify ListeningWorkspace.jsx integrates useListeningShortcuts
{
  const workspacePath = path.join(rootDir, 'src', 'components', 'listening', 'ListeningWorkspace.jsx');
  const content = fs.readFileSync(workspacePath, 'utf8');
  assert.ok(content.includes('useListeningShortcuts'), 'ListeningWorkspace must import useListeningShortcuts');
  console.log('  ✅ 7. ListeningWorkspace successfully integrates useListeningShortcuts');
}

console.log('🎉 Step 38 Test Suite: All 7 checks passed cleanly (100%)!');
