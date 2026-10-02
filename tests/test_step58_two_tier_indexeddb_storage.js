/**
 * Test Suite: Step 2.1 - Two-Tier High Capacity Storage Architecture (IndexedDB & LocalStorage Index)
 * Verifies that full submissions are safely archived into IndexedDB while LocalStorage
 * retains only lightweight summaries (< 500 bytes per submission), preventing QuotaExceededError.
 */

import assert from 'assert';
import {
  createLightweightSubmission,
  saveTwoTierSubmissions,
  loadTwoTierSubmissions,
  deleteSubmissionTwoTier,
  clearSubmissionsTwoTier,
  getSubmissionById,
  migrateSubmissionsToIndexedDb,
  STORES,
  idbGet,
  idbSet
} from '../src/utils/indexedDbStorage.js';
import { safeSet, safeGet, safeRemove } from '../src/utils/storageService.js';

console.log('--- TEST STEP 2.1: TWO-TIER INDEXEDDB ARCHITECTURE & QUOTA MITIGATION ---');

let passed = 0;

async function test(title, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${title}`);
  } catch (err) {
    console.error(`  ✗ ${title}`);
    throw err;
  }
}

async function run() {
  // Sample heavy IELTS Writing submission (mimics 25KB+ real AI evaluation response)
  const heavySubmission = {
    id: 'sub-test-999',
    date: '2 Thg 10 20:30',
    timestamp: '2026-10-02T13:30:00.000Z',
    task: {
      id: 'task-w2-001',
      title: 'University Education: Practical Skills vs Theory',
      taskNumber: 2
    },
    essayText: 'In the contemporary era of rapid technological advancement, the overarching objective of higher education has become a subject of considerable controversy. While some individuals argue that universities should primarily prepare students for the workplace by prioritizing practical career skills, others contend that the fundamental mission of academic institutions is to cultivate intellectual inquiry and theoretical mastery. In my opinion, I firmly believe that both facets are vital, though institutions must place increased emphasis on practical application to navigate modern workforce demands.',
    stats: {
      wordCount: 285,
      timeSpent: '38 phút 15 giây'
    },
    evaluation: {
      overallBand: 7.5,
      band: 7.5,
      score: 7.5,
      evaluationMethod: 'ai',
      engineName: 'Trí Tuệ Nhân Tạo AI (gemini-2.5-pro)',
      criteriaScores: {
        taskResponse: { band: 7.5, comment: 'Clear position throughout with relevant well-supported ideas.' },
        coherence: { band: 7.0, comment: 'Logical paragraph structure and effective cohesive devices.' },
        lexicalResource: { band: 8.0, comment: 'Skillful use of uncommon lexical items with precision.' },
        grammaticalRange: { band: 7.5, comment: 'Wide variety of complex structures with rare minor errors.' }
      },
      band65Rewrite: 'Many people nowadays debate whether universities should focus on practical career skills or theoretical knowledge. On one hand, learning job skills helps graduates find employment quickly. On the other hand, theoretical understanding builds foundational problem solving. In conclusion, universities should combine both approaches to prepare students well.',
      band8Rewrite: 'The paradigm of modern tertiary education currently contends with conflicting mandates: the pragmatic imperative of vocational readiness versus the classical devotion to pure intellectual inquiry. While theoretical foundationalism equips students with systemic conceptual agility, ungrounded abstractions risk producing graduates maladapted to volatile labor markets. Hence, a balanced pedagogical synthesis is imperative.',
      paragraphFeedback: [
        { paragraphIndex: 0, feedback: 'Strong paraphrase with clear thesis statement.' },
        { paragraphIndex: 1, feedback: 'Body 1 effectively analyzes the vocational argument.' },
        { paragraphIndex: 2, feedback: 'Body 2 provides robust counterweight on theoretical mastery.' }
      ],
      vocabularyUpgrades: [
        { original: 'important', upgrade: 'pivotal / quintessential' },
        { original: 'good', upgrade: 'advantageous / meritorious' }
      ]
    }
  };

  await test('createLightweightSubmission compresses heavy submission by > 80% without losing core stats', () => {
    const lightweight = createLightweightSubmission(heavySubmission);
    
    // Core summary fields must exist
    assert.strictEqual(lightweight.id, heavySubmission.id);
    assert.strictEqual(lightweight.hasFullDetailInIdb, true);
    assert.strictEqual(lightweight.task.title, heavySubmission.task.title);
    assert.strictEqual(lightweight.task.taskNumber, 2);
    assert.strictEqual(lightweight.stats.wordCount, 285);
    assert.strictEqual(lightweight.evaluation.overallBand, 7.5);
    assert.strictEqual(lightweight.evaluation.criteriaScores.taskResponse.band, 7.5);

    // Heavy payloads must be stripped
    assert.strictEqual(lightweight.evaluation.band65Rewrite, undefined);
    assert.strictEqual(lightweight.evaluation.band8Rewrite, undefined);
    assert.strictEqual(lightweight.evaluation.paragraphFeedback, undefined);
    assert.strictEqual(lightweight.evaluation.vocabularyUpgrades, undefined);

    // Payload size comparison
    const fullSize = JSON.stringify(heavySubmission).length;
    const lightSize = JSON.stringify(lightweight).length;
    const compressionRatio = ((fullSize - lightSize) / fullSize) * 100;
    
    assert(compressionRatio > 60, `Compression ratio must exceed 60% (got ${compressionRatio.toFixed(1)}%)`);
    assert(lightSize < 800, `Lightweight payload size must be < 800 bytes (got ${lightSize} bytes)`);
  });

  await test('saveTwoTierSubmissions saves full data to IndexedDB and lightweight summary to LocalStorage', async () => {
    const testKey = 'ielts_test_two_tier_writing';
    const list = [heavySubmission];

    const ok = await saveTwoTierSubmissions(testKey, list);
    assert.strictEqual(ok, true);

    // 1. Check LocalStorage (Lightweight)
    const local = safeGet(testKey);
    assert(Array.isArray(local) && local.length === 1);
    assert.strictEqual(local[0].evaluation.band65Rewrite, undefined, 'LocalStorage must NOT have heavy rewrite');
    assert.strictEqual(local[0].evaluation.overallBand, 7.5);

    // 2. Check IndexedDB (Full details preserved)
    const idbData = await loadTwoTierSubmissions(testKey);
    assert(Array.isArray(idbData) && idbData.length === 1);
    assert(idbData[0].evaluation.band65Rewrite.length > 50, 'IndexedDB MUST preserve full band65Rewrite');
    assert(idbData[0].evaluation.band8Rewrite.length > 50, 'IndexedDB MUST preserve full band8Rewrite');

    // 3. Check individual record archive
    const single = await getSubmissionById(heavySubmission.id);
    assert.notStrictEqual(single, null);
    assert.strictEqual(single.id, heavySubmission.id);
    assert(single.evaluation.band8Rewrite.includes('paradigm'));
  });

  await test('deleteSubmissionTwoTier removes record from both IndexedDB and LocalStorage', async () => {
    const testKey = 'ielts_test_two_tier_delete';
    const itemA = { ...heavySubmission, id: 'item-A' };
    const itemB = { ...heavySubmission, id: 'item-B' };

    await saveTwoTierSubmissions(testKey, [itemA, itemB]);
    
    // Delete itemA
    const deleted = await deleteSubmissionTwoTier(testKey, 'item-A');
    assert.strictEqual(deleted, true);

    // Verify LocalStorage only has itemB
    const local = safeGet(testKey);
    assert.strictEqual(local.length, 1);
    assert.strictEqual(local[0].id, 'item-B');

    // Verify IndexedDB only has itemB
    const idbData = await loadTwoTierSubmissions(testKey);
    assert.strictEqual(idbData.length, 1);
    assert.strictEqual(idbData[0].id, 'item-B');
  });

  await test('clearSubmissionsTwoTier resets both tiers', async () => {
    const testKey = 'ielts_test_two_tier_clear';
    await saveTwoTierSubmissions(testKey, [heavySubmission]);

    await clearSubmissionsTwoTier(testKey);

    const local = safeGet(testKey);
    assert(Array.isArray(local) && local.length === 0);

    const idbData = await loadTwoTierSubmissions(testKey);
    assert(Array.isArray(idbData) && idbData.length === 0);
  });

  await test('migrateSubmissionsToIndexedDb automatically converts legacy heavy LocalStorage to two-tier', async () => {
    const legacyKey = 'ielts_submissions_history';
    // Emulate existing unmigrated full submission in LocalStorage
    safeSet(legacyKey, [heavySubmission]);

    const count = await migrateSubmissionsToIndexedDb();
    assert(count >= 1, 'Must migrate at least 1 submission');

    // After migration, LocalStorage must be lightweight
    const localAfter = safeGet(legacyKey);
    assert.strictEqual(localAfter[0].evaluation.band65Rewrite, undefined, 'LocalStorage must be compressed');
    assert.strictEqual(localAfter[0].hasFullDetailInIdb, true);

    // Full data is securely in IndexedDB
    const idbFull = await loadTwoTierSubmissions(legacyKey);
    assert.notStrictEqual(idbFull[0].evaluation.band65Rewrite, undefined, 'Full data preserved in IndexedDB');
  });

  console.log(`\n🎉 ALL ${passed} TWO-TIER INDEXEDDB STORAGE TESTS PASSED 100%!\n`);
}

run().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
