import { 
  safeGet, 
  safeSet, 
  safeRemove, 
  getStorageMetrics, 
  pruneVolatileData, 
  exportBackupData, 
  importBackupData,
  isLocalStorageAvailable 
} from '../src/utils/storageService.js';

console.log('--- STARTING STEP 7 TEST SUITE: STORAGE RESILIENCE & ERROR RECOVERY ---');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// 1. Basic safeGet and safeSet operations
// -------------------------------------------------------------
console.log('\n[1] Basic safeSet & safeGet functionality:');

// String
safeSet('test_key_str', 'Cambridge IELTS 19');
assert(safeGet('test_key_str') === 'Cambridge IELTS 19', 'Stores and retrieves raw string');

// Number
safeSet('test_key_num', 7.5);
assert(safeGet('test_key_num') === 7.5, 'Stores and retrieves numbers accurately');

// Boolean
safeSet('test_key_bool', true);
assert(safeGet('test_key_bool') === true, 'Stores and retrieves booleans accurately');

// Complex Object
const testObj = { task: 'Writing Task 2', band: 8.0, criteria: { TR: 8, CC: 8, LR: 8, GRA: 8 } };
safeSet('test_key_obj', testObj);
const retrievedObj = safeGet('test_key_obj');
assert(retrievedObj.task === 'Writing Task 2' && retrievedObj.band === 8.0, 'Stores and retrieves complex nested objects');
assert(retrievedObj.criteria.TR === 8, 'Retains nested criteria properties');

// Array
const testArr = ['introduction', 'body 1', 'body 2', 'conclusion'];
safeSet('test_key_arr', testArr);
const retrievedArr = safeGet('test_key_arr');
assert(Array.isArray(retrievedArr) && retrievedArr.length === 4, 'Stores and retrieves arrays');
assert(retrievedArr[0] === 'introduction', 'Array elements are preserved in order');

// -------------------------------------------------------------
// 2. Default Values & Corrupted Keys Handling
// -------------------------------------------------------------
console.log('\n[2] Default Values & Missing/Empty Key handling:');

assert(safeGet('non_existent_key', 'default_val') === 'default_val', 'Returns fallback for non-existent key');
assert(safeGet('non_existent_key', 42) === 42, 'Returns number fallback for non-existent key');
assert(safeGet(null, 'default') === 'default', 'Handles null key gracefully');
assert(safeGet(undefined, 'default') === 'default', 'Handles undefined key gracefully');
assert(safeSet(null, 'val') === false, 'safeSet on null key safely returns false without throwing');

// -------------------------------------------------------------
// 3. safeRemove
// -------------------------------------------------------------
console.log('\n[3] safeRemove functionality:');

safeSet('test_key_to_delete', 'temporary data');
assert(safeGet('test_key_to_delete') === 'temporary data', 'Key exists before deletion');
safeRemove('test_key_to_delete');
assert(safeGet('test_key_to_delete', null) === null, 'Key is successfully removed');

// -------------------------------------------------------------
// 4. Storage Metrics Calculation
// -------------------------------------------------------------
console.log('\n[4] getStorageMetrics calculation:');

const metrics = getStorageMetrics();
assert(typeof metrics === 'object', 'Metrics returned as object');
assert(typeof metrics.usedBytes === 'number' && metrics.usedBytes >= 0, 'usedBytes is a valid number');
assert(metrics.quotaEstimatedBytes === 5 * 1024 * 1024, 'quotaEstimatedBytes is set to 5MB standard');
assert(typeof metrics.usagePercent === 'number' && metrics.usagePercent >= 0 && metrics.usagePercent <= 100, 'usagePercent is between 0% and 100%');

// -------------------------------------------------------------
// 5. pruneVolatileData (Automatic history truncation to 30 items)
// -------------------------------------------------------------
console.log('\n[5] pruneVolatileData test:');

const largeHistory = Array.from({ length: 45 }, (_, i) => ({ id: `sub-${i}`, score: 6.0 + (i % 3) * 0.5 }));
safeSet('ielts_submissions_history', largeHistory);
assert(safeGet('ielts_submissions_history').length === 45, 'Initial oversized history has 45 items');

pruneVolatileData();
const prunedHistory = safeGet('ielts_submissions_history');
assert(prunedHistory.length <= 30, `Pruned history down to ${prunedHistory.length} items (<= 30)`);
assert(prunedHistory[prunedHistory.length - 1].id === 'sub-44', 'Preserves the most recent submissions');

// -------------------------------------------------------------
// 6. Export and Import Backup Data
// -------------------------------------------------------------
console.log('\n[6] exportBackupData and importBackupData:');

safeSet('ielts_target_band', '7.5');
safeSet('ielts_current_task_id', 't1-cambridge-map-19');
safeSet('ielts_vocab_notebook', [{ id: 'v1', phrase: 'unprecedented surge', topic: 'econ' }]);

const backupJson = exportBackupData();
assert(typeof backupJson === 'string' && backupJson.length > 50, 'exportBackupData produces valid JSON string');

const parsedBackup = JSON.parse(backupJson);
assert(parsedBackup.version === '1.0', 'Backup contains schema version');
assert(parsedBackup.exportedAt !== undefined, 'Backup contains timestamp');
assert(parsedBackup.data.ielts_target_band === '7.5', 'Backup captured target band');
assert(parsedBackup.data.ielts_current_task_id === 't1-cambridge-map-19', 'Backup captured current task');

// Test importBackupData with valid data
const testImportPayload = JSON.stringify({
  version: '1.0',
  exportedAt: new Date().toISOString(),
  data: {
    ielts_target_band: '8.5',
    ielts_streak_count: 15
  }
});

const importResult = importBackupData(testImportPayload);
assert(importResult.success === true, 'importBackupData succeeded on valid JSON');
assert(safeGet('ielts_target_band') === '8.5', 'Import updated target band to 8.5');
assert(safeGet('ielts_streak_count') === 15, 'Import updated streak count to 15');

// Test importBackupData with invalid data
const corruptedImport = importBackupData('{"invalid": true}');
assert(corruptedImport.success === false, 'Rejects invalid backup schema without crashing');

const brokenJsonImport = importBackupData('{broken json--');
assert(brokenJsonImport.success === false, 'Rejects malformed JSON string gracefully');

// Clean up test keys
safeRemove('test_key_str');
safeRemove('test_key_num');
safeRemove('test_key_bool');
safeRemove('test_key_obj');
safeRemove('test_key_arr');

console.log(`\n========================================`);
console.log(`STEP 7 TESTS COMPLETED: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
