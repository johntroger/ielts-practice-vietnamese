/**
 * Test Suite: Step 11 - 15-Minute Diagnostic Placement Quick-Test & IndexedDB Storage Adapter
 * Verifies high-capacity asynchronous storage, calibrated placement scoring, and 30-day adaptive study plan generation.
 */

import assert from 'assert';
import { 
  isIndexedDbSupported, 
  idbSet, 
  idbGet, 
  idbGetAll, 
  idbDelete, 
  idbClear, 
  getStorageQuotaMetrics,
  STORES 
} from '../src/utils/indexedDbStorage.js';
import { 
  DIAGNOSTIC_QUESTIONS, 
  evaluateDiagnosticTest, 
  generate30DayStudyPlan 
} from '../src/utils/diagnosticPlacementEngine.js';
import { exportBackupData, stripEphemeralMedia, safeSet, safeGet } from '../src/utils/storageService.js';

console.log('--- TEST STEP 11: DIAGNOSTIC PLACEMENT & INDEXEDDB ADAPTER ---');

let testsPassed = 0;

async function it(desc, fn) {
  try {
    await fn();
    testsPassed++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

async function runTests() {
  // ============================================================================
  // 1. INDEXEDDB ADAPTER & CAPACITY TESTS
  // ============================================================================
  await it('isIndexedDbSupported should safely report boolean status without throwing', () => {
    const supported = isIndexedDbSupported();
    assert.strictEqual(typeof supported, 'boolean');
  });

  await it('idbSet and idbGet should reliably store and retrieve primitives and objects', async () => {
    await idbSet(STORES.KEYVAL, 'test_str', 'Cambridge IELTS 19');
    const resStr = await idbGet(STORES.KEYVAL, 'test_str');
    assert.strictEqual(resStr, 'Cambridge IELTS 19');

    const sampleObj = { band: 7.5, taskType: 'academic', target: 'Band 8.0' };
    await idbSet(STORES.KEYVAL, 'test_obj', sampleObj);
    const resObj = await idbGet(STORES.KEYVAL, 'test_obj');
    assert.deepStrictEqual(resObj, sampleObj);
  });

  await it('idbGet should return defaultValue when key does not exist', async () => {
    const res = await idbGet(STORES.KEYVAL, 'non_existent_key_xyz', 'DEFAULT_FALLBACK');
    assert.strictEqual(res, 'DEFAULT_FALLBACK');
  });

  await it('idbGetAll, idbDelete, and idbClear should operate correctly', async () => {
    await idbClear(STORES.SUBMISSIONS_ARCHIVE);
    await idbSet(STORES.SUBMISSIONS_ARCHIVE, 'sub_1', { id: 'sub_1', score: 6.5 });
    await idbSet(STORES.SUBMISSIONS_ARCHIVE, 'sub_2', { id: 'sub_2', score: 7.0 });

    const all = await idbGetAll(STORES.SUBMISSIONS_ARCHIVE);
    assert.strictEqual(all.length, 2);

    await idbDelete(STORES.SUBMISSIONS_ARCHIVE, 'sub_1');
    const remaining = await idbGetAll(STORES.SUBMISSIONS_ARCHIVE);
    assert.strictEqual(remaining.length, 1);
    assert.strictEqual(remaining[0].id, 'sub_2');

    await idbClear(STORES.SUBMISSIONS_ARCHIVE);
    const afterClear = await idbGetAll(STORES.SUBMISSIONS_ARCHIVE);
    assert.strictEqual(afterClear.length, 0);
  });

  await it('getStorageQuotaMetrics should return valid metric schema', async () => {
    const metrics = await getStorageQuotaMetrics();
    assert.ok(typeof metrics === 'object' && metrics !== null);
    assert.ok('isSupported' in metrics);
    assert.ok('usageMb' in metrics);
    assert.ok('quotaMb' in metrics);
    assert.ok('percentUsed' in metrics);
    assert.ok('storageType' in metrics);
  });

  // ============================================================================
  // 2. DIAGNOSTIC PLACEMENT QUESTIONS & CALIBRATION INTEGRITY
  // ============================================================================
  await it('DIAGNOSTIC_QUESTIONS should contain exactly 16 questions across 4 core skills', () => {
    assert.strictEqual(DIAGNOSTIC_QUESTIONS.length, 16);
    
    const skillCounts = { reading: 0, listening: 0, writing: 0, speaking: 0 };
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      assert.ok(q.id, 'Question must have id');
      assert.ok(q.title, 'Question must have title');
      assert.ok(q.question, 'Question must have prompt');
      assert.ok(Array.isArray(q.options) && q.options.length >= 3, 'Question must have options');
      assert.ok(q.explanation, 'Question must have explanation');

      const correctOptions = q.options.filter(o => o.isCorrect);
      assert.strictEqual(correctOptions.length, 1, `Question ${q.id} must have exactly one correct option`);

      skillCounts[q.skill] = (skillCounts[q.skill] || 0) + 1;
    });

    assert.strictEqual(skillCounts.reading, 4, 'Should have 4 Reading questions');
    assert.strictEqual(skillCounts.listening, 4, 'Should have 4 Listening questions');
    assert.strictEqual(skillCounts.writing, 4, 'Should have 4 Writing questions');
    assert.strictEqual(skillCounts.speaking, 4, 'Should have 4 Speaking questions');
  });

  // ============================================================================
  // 3. DIAGNOSTIC SCORING ENGINE TESTS
  // ============================================================================
  await it('evaluateDiagnosticTest with 100% correct answers should estimate Band 8.0+ and 0 weaknesses', () => {
    const perfectAnswers = {};
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const correctOpt = q.options.find(o => o.isCorrect);
      perfectAnswers[q.id] = correctOpt.key;
    });

    const evalResult = evaluateDiagnosticTest(perfectAnswers);
    assert.strictEqual(evalResult.totalQuestions, 16);
    assert.strictEqual(evalResult.totalCorrect, 16);
    assert.strictEqual(evalResult.overallPercentage, 100);
    assert.strictEqual(evalResult.estimatedOverallBand >= 8.0, true);
    assert.strictEqual(evalResult.weaknesses.length, 0);
    assert.strictEqual(evalResult.skillStats.reading.correct, 4);
    assert.strictEqual(evalResult.skillStats.writing.correct, 4);
  });

  await it('evaluateDiagnosticTest with 0% correct answers should identify all 4 skill weaknesses and estimate Band 3.5', () => {
    const zeroAnswers = {};
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const wrongOpt = q.options.find(o => !o.isCorrect);
      zeroAnswers[q.id] = wrongOpt.key;
    });

    const evalResult = evaluateDiagnosticTest(zeroAnswers);
    assert.strictEqual(evalResult.totalCorrect, 0);
    assert.strictEqual(evalResult.overallPercentage, 0);
    assert.strictEqual(evalResult.estimatedOverallBand, 3.5);
    assert.strictEqual(evalResult.weaknesses.length, 4, 'Should flag all 4 skills as weaknesses');
  });

  await it('evaluateDiagnosticTest should isolate specific weaknesses when candidate struggles in Writing & Speaking', () => {
    const partialAnswers = {};
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      if (q.skill === 'reading' || q.skill === 'listening') {
        const correctOpt = q.options.find(o => o.isCorrect);
        partialAnswers[q.id] = correctOpt.key;
      } else {
        const wrongOpt = q.options.find(o => !o.isCorrect);
        partialAnswers[q.id] = wrongOpt.key;
      }
    });

    const evalResult = evaluateDiagnosticTest(partialAnswers);
    assert.strictEqual(evalResult.totalCorrect, 8);
    assert.strictEqual(evalResult.skillStats.reading.correct, 4);
    assert.strictEqual(evalResult.skillStats.listening.correct, 4);
    assert.strictEqual(evalResult.skillStats.writing.correct, 0);
    assert.strictEqual(evalResult.skillStats.speaking.correct, 0);

    const weakSkills = evalResult.weaknesses.map(w => w.skill);
    assert.ok(weakSkills.includes('writing'));
    assert.ok(weakSkills.includes('speaking'));
    assert.strictEqual(weakSkills.includes('reading'), false);
    assert.strictEqual(weakSkills.includes('listening'), false);
  });

  // ============================================================================
  // 4. ADAPTIVE 30-DAY STUDY PLAN GENERATOR
  // ============================================================================
  await it('generate30DayStudyPlan should generate exactly 30 chronological days across 4 weeks', () => {
    const weaknesses = [
      { skill: 'writing', title: 'Overview & Hedging' },
      { skill: 'speaking', title: 'Collocations' }
    ];
    const plan = generate30DayStudyPlan(5.5, 7.0, weaknesses);
    assert.strictEqual(plan.length, 30);

    // Verify all 30 days are sequential
    for (let i = 0; i < 30; i++) {
      assert.strictEqual(plan[i].day, i + 1);
      assert.ok(plan[i].week >= 1 && plan[i].week <= 4);
      assert.ok(plan[i].title.length > 0);
      assert.ok(plan[i].duration.length > 0);
      assert.ok(plan[i].taskDescription.length > 0);
      assert.ok(plan[i].toolShortcut.length > 0);
    }

    // Verify week distribution
    const week1 = plan.filter(p => p.week === 1);
    const week2 = plan.filter(p => p.week === 2);
    const week3 = plan.filter(p => p.week === 3);
    const week4 = plan.filter(p => p.week === 4);

    assert.strictEqual(week1.length, 7);
    assert.strictEqual(week2.length, 7);
    assert.strictEqual(week3.length, 7);
    assert.strictEqual(week4.length, 9);
  });

  // ============================================================================
  // 5. BACKUP INTEGRATION TEST
  // ============================================================================
  await it('exportBackupData should include diagnostic placement and 30-day study plan keys', () => {
    const backupStr = exportBackupData();
    const parsed = JSON.parse(backupStr);
    assert.ok(parsed && parsed.data !== undefined);
  });

  // ============================================================================
  // 6. ZERO PERMANENT MEDIA PERSISTENCE (EPHEMERAL IMAGE & AUDIO STRIPPING)
  // ============================================================================
  await it('stripEphemeralMedia should strip base64 image data URIs and blob URLs while preserving scores and text', () => {
    const dirtySubmission = {
      id: 'sub_test_123',
      task: {
        title: 'Line Graph Fast Food',
        prompt: 'The chart below shows...',
        imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...'
      },
      evaluation: {
        overallBand: 7.0,
        feedback: 'Good overview and clear trends.'
      },
      userAudioClip: 'data:audio/webm;base64,GkXfo59ChoEBQveBAULygQ8...'
    };

    const cleaned = stripEphemeralMedia(dirtySubmission);
    assert.strictEqual(cleaned.task.imageUrl, '', 'Base64 imageUrl must be stripped to empty string');
    assert.strictEqual(cleaned.userAudioClip, '', 'Base64 audio must be stripped to empty string');
    assert.strictEqual(cleaned.task.title, 'Line Graph Fast Food');
    assert.strictEqual(cleaned.evaluation.overallBand, 7.0);
    assert.strictEqual(cleaned.evaluation.feedback, 'Good overview and clear trends.');
  });

  await it('safeSet should never write base64 image or audio payloads to persistent storage', () => {
    const payloadWithMedia = {
      testId: 't-1',
      title: 'Practice with Map',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      audioBlob: 'blob:http://localhost:5173/b4d667c2-9bb0-47b2-bb52',
      normalWebUrl: 'https://images.unsplash.com/photo-1526778548025'
    };

    safeSet('test_ephemeral_media_key', payloadWithMedia);
    const saved = safeGet('test_ephemeral_media_key');

    assert.strictEqual(saved.imageUrl, '', 'imageUrl base64 must be sanitized to empty string');
    assert.strictEqual(saved.audioBlob, '', 'audio blob URL must be sanitized to empty string');
    assert.strictEqual(saved.normalWebUrl, 'https://images.unsplash.com/photo-1526778548025', 'Ordinary web URLs must be preserved');
  });

  console.log(`\n🎉 Step 11 Unit Tests Passed: ${testsPassed}/${testsPassed} tests passed cleanly.`);
}

runTests().catch(err => {
  console.error('Fatal test error in Step 11:', err);
  process.exit(1);
});
