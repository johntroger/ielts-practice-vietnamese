/**
 * Step 51: Manual Task & Question Generator with Fast Source-Based Filtering
 * Verifies manual task creation, custom mock packs, manual micro-drills, and source-based filtering.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applySmartFilterAndSort } from '../src/services/ratingPopularityService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Step 51: Manual Task Generator & Fast Source Filtering Test Suite...\n');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. TaskGeneratorModal.jsx Verification
test('TaskGeneratorModal supports both AI and Manual creation modes with quick templates and TaskImageUploader', () => {
  const fileContent = fs.readFileSync(path.join(__dirname, '../src/components/TaskGeneratorModal.jsx'), 'utf-8');
  assert.ok(fileContent.includes("generatorMode === 'manual'"), 'Must have generatorMode state checking for manual');
  assert.ok(fileContent.includes('QUICK_MANUAL_TEMPLATES'), 'Must contain quick Cambridge templates');
  assert.ok(fileContent.includes('TaskImageUploader'), 'Must import and use TaskImageUploader for Task 1 images');
  assert.ok(fileContent.includes("isManual: true"), 'Must set isManual: true on manual tasks');
  assert.ok(fileContent.includes("isAiGenerated: false"), 'Must set isAiGenerated: false on manual tasks');
  assert.ok(fileContent.includes("source: 'manual'"), "Must set source: 'manual' on manual tasks");
  assert.ok(fileContent.includes('✍️ Nạp Đề Thủ Công'), 'Must render manual tab switcher');
});

// 2. TaskLibraryModal.jsx Verification
test('TaskLibraryModal provides ✍️ Thủ Công and 🏛️ Cambridge filter tabs and badges', () => {
  const fileContent = fs.readFileSync(path.join(__dirname, '../src/components/TaskLibraryModal.jsx'), 'utf-8');
  assert.ok(fileContent.includes("activeTab === 'manual'"), 'Must filter by manual tab');
  assert.ok(fileContent.includes("activeTab === 'cambridge'"), 'Must filter by cambridge tab');
  assert.ok(fileContent.includes('taskCounts.manual'), 'Must compute manual count');
  assert.ok(fileContent.includes('taskCounts.cambridge'), 'Must compute cambridge count');
  assert.ok(fileContent.includes('✍️ Thủ Công'), 'Must display ✍️ Thủ Công tab or badge');
  assert.ok(fileContent.includes('🏛️ Cambridge'), 'Must display 🏛️ Cambridge tab or badge');
  assert.ok(fileContent.includes('isManual: true'), 'Must set isManual: true in handleCreateManual');
});

// 3. SpeakingGeneratorModal.jsx Verification
test('SpeakingGeneratorModal provides full 3-part manual test creator and Cambridge presets', () => {
  const fileContent = fs.readFileSync(path.join(__dirname, '../src/components/speaking/SpeakingGeneratorModal.jsx'), 'utf-8');
  assert.ok(fileContent.includes("mode === 'manual'"), 'Must have manual mode support');
  assert.ok(fileContent.includes('QUICK_SPEAKING_PACK_TEMPLATES'), 'Must include quick speaking pack presets');
  assert.ok(fileContent.includes('customPart1'), 'Must include customPart1 in manual pack');
  assert.ok(fileContent.includes('customPart2'), 'Must include customPart2 in manual pack');
  assert.ok(fileContent.includes('customPart3'), 'Must include customPart3 in manual pack');
  assert.ok(fileContent.includes("isManual: true"), 'Must set isManual: true on manual speaking pack');
  assert.ok(fileContent.includes("isAiGenerated: false"), 'Must set isAiGenerated: false on manual pack');
  assert.ok(fileContent.includes("source: 'manual'"), "Must set source: 'manual' on manual pack");
});

// 4. SpeakingWorkspace.jsx Verification
test('SpeakingWorkspace includes ✍️ Tạo Đề Thủ Công button and source filter pills', () => {
  const fileContent = fs.readFileSync(path.join(__dirname, '../src/components/speaking/SpeakingWorkspace.jsx'), 'utf-8');
  assert.ok(fileContent.includes('✍️ Tạo Đề Thủ Công'), 'Must contain ✍️ Tạo Đề Thủ Công button');
  assert.ok(fileContent.includes("mockFilter === 'manual'"), 'Must filter by manual mock packs');
  assert.ok(fileContent.includes("mockFilter === 'cambridge'"), 'Must filter by cambridge mock packs');
  assert.ok(fileContent.includes("mockFilter === 'ai'"), 'Must filter by AI mock packs');
  assert.ok(fileContent.includes('mockPackCounts.manual'), 'Must compute manual mock pack count');
  assert.ok(fileContent.includes('filteredMockPacks'), 'Must render filtered mock packs');
  assert.ok(fileContent.includes('initialMode={generatorInitialMode}'), 'Must pass initialMode to SpeakingGeneratorModal');
});

// 5. ManualMicroDrillModal.jsx and MicroDrillsModal.jsx Verification
test('ManualMicroDrillModal exists and MicroDrillsModal supports manual drill creation and filters', () => {
  assert.ok(fs.existsSync(path.join(__dirname, '../src/components/ManualMicroDrillModal.jsx')), 'ManualMicroDrillModal.jsx must exist');
  
  const manualDrillContent = fs.readFileSync(path.join(__dirname, '../src/components/ManualMicroDrillModal.jsx'), 'utf-8');
  assert.ok(manualDrillContent.includes('DRILL_PRESETS'), 'Must contain drill presets for quick auto-fill');
  assert.ok(manualDrillContent.includes('isManual: true'), 'Must set isManual: true on created drill');
  assert.ok(manualDrillContent.includes("source: 'manual'"), "Must set source: 'manual'");

  const modalContent = fs.readFileSync(path.join(__dirname, '../src/components/MicroDrillsModal.jsx'), 'utf-8');
  assert.ok(modalContent.includes('ManualMicroDrillModal'), 'Must import and render ManualMicroDrillModal');
  assert.ok(modalContent.includes('✍️ Tạo Bài Thủ Công'), 'Must render ✍️ Tạo Bài Thủ Công button');
  assert.ok(modalContent.includes("drillQuickFilter === 'manual'"), 'Must support quickFilter manual chip');
  assert.ok(modalContent.includes("drillQuickFilter === 'ai'"), 'Must support quickFilter ai chip');
  assert.ok(modalContent.includes('✍️ Thủ Công'), 'Must render ✍️ Thủ Công badge for manual drills');
});

// 6. Rating & Popularity Service Quick Filter Engine Verification
test('applySmartFilterAndSort accurately filters manual vs AI generated items', () => {
  const sampleItems = [
    { id: 'item-1', title: 'Cambridge Official Task 1', isCustom: false, isAiGenerated: false, isManual: false },
    { id: 'item-2', title: 'AI Generated Task 2 on Robotics', isCustom: true, isAiGenerated: true, isManual: false },
    { id: 'item-3', title: 'User Manually Created Task 1 Process', isCustom: true, isAiGenerated: false, isManual: true },
    { id: 'item-4', title: 'Legacy Custom Task', isCustom: true, isAiGenerated: false }
  ];

  // Test filter: manual
  const manualFiltered = applySmartFilterAndSort(sampleItems, { quickFilter: 'manual' });
  assert.strictEqual(manualFiltered.length, 2, 'Should filter 2 manual items (item-3 and legacy item-4)');
  assert.ok(manualFiltered.some(i => i.id === 'item-3'), 'item-3 must be in manual list');
  assert.ok(manualFiltered.some(i => i.id === 'item-4'), 'item-4 must be in manual list');
  assert.ok(!manualFiltered.some(i => i.id === 'item-2'), 'item-2 (AI) must not be in manual list');

  // Test filter: ai
  const aiFiltered = applySmartFilterAndSort(sampleItems, { quickFilter: 'ai' });
  assert.strictEqual(aiFiltered.length, 1, 'Should filter 1 AI item (item-2)');
  assert.strictEqual(aiFiltered[0].id, 'item-2');

  // Test filter: all
  const allFiltered = applySmartFilterAndSort(sampleItems, { quickFilter: 'all' });
  assert.strictEqual(allFiltered.length, 4, 'Should keep all 4 items');
});

console.log(`\n🎉 Step 51: All ${passCount} tests passed successfully!`);
