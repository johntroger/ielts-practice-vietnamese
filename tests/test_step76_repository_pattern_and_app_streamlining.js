/**
 * Test Step 76: Repository Pattern & App.jsx Data Access Streamlining (Kiến trúc Bước 3)
 *
 * Verifies:
 * 1. Data Access Layer in src/repositories/:
 *    - taskRepository.js (TaskRepository)
 *    - submissionRepository.js (SubmissionRepository)
 *    - studyProfileRepository.js (StudyProfileRepository)
 *    - backupRepository.js (BackupRepository)
 *    - index.js (Repositories Barrel Facade)
 * 2. Presentation Connector:
 *    - src/hooks/useStudyData.js hook connects App.jsx with the Repository layer.
 * 3. Contract & Method Verification:
 *    - TaskRepository exposes CRUD & sync methods.
 *    - SubmissionRepository encapsulates Two-Tier IndexedDB & LocalStorage history.
 *    - StudyProfileRepository manages student vocab, mistakes, streak, and mastered topics.
 *    - BackupRepository encapsulates full workspace export & wipe operations.
 * 4. App.jsx Integration:
 *    - App.jsx integrates useStudyData, eliminating repetitive storage effects and boilerplate.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  TaskRepository,
  SubmissionRepository,
  StudyProfileRepository,
  BackupRepository
} from '../src/repositories/index.js';
import { useStudyData } from '../src/hooks/useStudyData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Step 76: Repository Pattern & App.jsx Data Access Streamlining...');

// 1. Verify Repository files exist
const repoDir = path.resolve(__dirname, '../src/repositories');
assert.ok(fs.existsSync(repoDir), 'src/repositories/ must exist');

const expectedFiles = [
  'taskRepository.js',
  'submissionRepository.js',
  'studyProfileRepository.js',
  'backupRepository.js',
  'index.js'
];
expectedFiles.forEach(file => {
  assert.ok(fs.existsSync(path.join(repoDir, file)), `Repository file ${file} must exist`);
});
console.log('  ✅ 1. All 4 Domain Repositories and barrel index exist in src/repositories/');

// 2. Verify TaskRepository methods
assert.strictEqual(typeof TaskRepository.getInitialTasks, 'function');
assert.strictEqual(typeof TaskRepository.saveAllTasks, 'function');
assert.strictEqual(typeof TaskRepository.getCommunityTasks, 'function');
assert.strictEqual(typeof TaskRepository.saveCommunityTasks, 'function');
assert.strictEqual(typeof TaskRepository.deleteCustomTask, 'function');
assert.strictEqual(typeof TaskRepository.syncPublicTasks, 'function');
console.log('  ✅ 2. TaskRepository methods verified');

// 3. Verify SubmissionRepository methods
assert.strictEqual(typeof SubmissionRepository.getInitialHistory, 'function');
assert.strictEqual(typeof SubmissionRepository.hydrateAllTwoTierHistories, 'function');
assert.strictEqual(typeof SubmissionRepository.saveSubmissions, 'function');
assert.strictEqual(typeof SubmissionRepository.deleteSubmission, 'function');
assert.strictEqual(typeof SubmissionRepository.clearSkillHistory, 'function');
assert.strictEqual(typeof SubmissionRepository.clearAllHistories, 'function');
console.log('  ✅ 3. SubmissionRepository Two-Tier methods verified');

// 4. Verify StudyProfileRepository methods
assert.strictEqual(typeof StudyProfileRepository.getVocabList, 'function');
assert.strictEqual(typeof StudyProfileRepository.saveVocabList, 'function');
assert.strictEqual(typeof StudyProfileRepository.getMistakes, 'function');
assert.strictEqual(typeof StudyProfileRepository.saveMistakes, 'function');
assert.strictEqual(typeof StudyProfileRepository.getMasteredIds, 'function');
assert.strictEqual(typeof StudyProfileRepository.toggleMasteredId, 'function');
assert.strictEqual(typeof StudyProfileRepository.getStreakCount, 'function');
console.log('  ✅ 4. StudyProfileRepository student state methods verified');

// 5. Verify BackupRepository methods
assert.strictEqual(typeof BackupRepository.exportDataPackage, 'function');
assert.strictEqual(typeof BackupRepository.wipeAllStorage, 'function');
console.log('  ✅ 5. BackupRepository workspace persistence methods verified');

// 6. Verify useStudyData hook & App.jsx integration
assert.strictEqual(typeof useStudyData, 'function');

const appPath = path.resolve(__dirname, '../src/App.jsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert.ok(appContent.includes("from './hooks/useStudyData'"), 'App.jsx must import useStudyData');
assert.ok(appContent.includes('useStudyData(currentUser)'), 'App.jsx must call useStudyData(currentUser)');
console.log('  ✅ 6. App.jsx successfully refactored and decoupled via Repository Layer');

console.log('🎉 Step 76: Repository Pattern & App.jsx Data Access Streamlining passed cleanly!');
