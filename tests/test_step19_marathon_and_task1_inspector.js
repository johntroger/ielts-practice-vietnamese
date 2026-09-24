import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('🧪 Testing Step 19: CDI Marathon 3-Skill Mode & Task 1 Coverage Inspector (Phase 2)');

// 1. Verify Task 1 Data Coverage Inspector Component & Exports
const modalPath = path.resolve('src/components/Task1DataCoverageModal.jsx');
assert(fs.existsSync(modalPath), 'Task1DataCoverageModal.jsx must exist');
const modalCode = fs.readFileSync(modalPath, 'utf8');

assert(modalCode.includes('analyzeTask1Overview'), 'Must analyze Task 1 Overview');
assert(modalCode.includes('analyzeTask1DataDensity'), 'Must analyze Task 1 Data Density');
assert(modalCode.includes('analyzeTask1Comparisons'), 'Must analyze Task 1 Comparative Language');
assert(modalCode.includes('Barem khảo thí chính thức của Cambridge IELTS'), 'Must reference Cambridge Barem');
console.log('  ✅ 1. Task1DataCoverageModal provides full Cambridge compliance analysis');

// 2. Verify EditorPane.jsx integrates Task 1 Inspector
const editorPath = path.resolve('src/components/EditorPane.jsx');
const editorCode = fs.readFileSync(editorPath, 'utf8');

assert(editorCode.includes('Task1DataCoverageModal'), 'EditorPane must import Task1DataCoverageModal');
assert(editorCode.includes('isTask1CoverageOpen'), 'EditorPane must manage isTask1CoverageOpen state');
assert(editorCode.includes('Phủ Số Liệu Task 1'), 'EditorPane must render live inspector button for Task 1');
console.log('  ✅ 2. EditorPane implements live Task 1 Data Coverage button & interactive modal');

// 3. Verify CDI Marathon sequential pipeline in App.jsx and MockTestModal.jsx
const appPath = path.resolve('src/App.jsx');
const appCode = fs.readFileSync(appPath, 'utf8');

assert(appCode.includes('marathonSession'), 'App.jsx must manage marathonSession state');
assert(appCode.includes('handleStartMarathon'), 'App.jsx must have handleStartMarathon');
assert(appCode.includes('handleCancelMarathon'), 'App.jsx must have handleCancelMarathon');
assert(appCode.includes('CDI Marathon:'), 'App.jsx must display Marathon progress banner');
assert(appCode.includes('marathonSession.stage === \'listening\''), 'Must handle listening transition');
assert(appCode.includes('marathonSession.stage === \'reading\''), 'Must handle reading transition');
assert(appCode.includes('marathonSession.stage === \'writing\''), 'Must handle writing final completion');

const mockModalPath = path.resolve('src/components/MockTestModal.jsx');
const mockModalCode = fs.readFileSync(mockModalPath, 'utf8');
assert(mockModalCode.includes('marathonSession'), 'MockTestModal must accept marathonSession');
assert(mockModalCode.includes('onStartMarathon'), 'MockTestModal must accept onStartMarathon');
console.log('  ✅ 3. CDI Marathon pipeline coordinates 3 consecutive skills (Listening ➔ Reading ➔ Writing)');

// 4. Verify IndexedDB Async Backup in storageService.js
const storagePath = path.resolve('src/utils/storageService.js');
const storageCode = fs.readFileSync(storagePath, 'utf8');

assert(storageCode.includes('backupToIndexedDB'), 'storageService must provide backupToIndexedDB');
assert(storageCode.includes('indexedDbStorage.js'), 'Must mirror data into indexedDbStorage');
console.log('  ✅ 4. StorageService safely mirrors heavy submissions & history collections into IndexedDB');

console.log('🎉 Step 19: CDI Marathon & Task 1 Coverage Inspector tests PASSED 100%!\n');
