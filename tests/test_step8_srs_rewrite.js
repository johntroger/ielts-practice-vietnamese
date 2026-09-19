/**
 * Test Suite: Step 8 - Spaced Repetition (SM-2) & Sentence Rewrite Scorer
 * Verifies cognitive spacing intervals, due filters, and pedagogical rewrite heuristics.
 */

import assert from 'assert';
import { 
  initSrsItem, 
  calculateNextReview, 
  isItemDue, 
  getDueItems, 
  getIntervalPreview, 
  SRS_GRADES 
} from '../src/utils/srsService.js';

import { scoreUserRewrite } from '../src/utils/rewriteScorer.js';

console.log('--- TEST STEP 8: SRS SM-2 & SENTENCE REWRITE SCORER ---');

let testsPassed = 0;

function it(desc, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// ============================================================================
// 1. SM-2 SPACED REPETITION TESTS
// ============================================================================
it('initSrsItem should set default SM-2 properties with initial easeFactor 2.5', () => {
  const raw = { phrase: 'mitigate', meaningVi: 'giảm nhẹ' };
  const initialized = initSrsItem(raw);
  assert.strictEqual(initialized.repetition, 0);
  assert.strictEqual(initialized.intervalDays, 0);
  assert.strictEqual(initialized.easeFactor, 2.5);
  assert.ok(initialized.nextReviewDate);
});

it('calculateNextReview should reset interval to 1 on failure (Grade 1)', () => {
  const item = { repetition: 3, intervalDays: 14, easeFactor: 2.5 };
  const updated = calculateNextReview(item, SRS_GRADES.AGAIN);
  assert.strictEqual(updated.repetition, 0);
  assert.strictEqual(updated.intervalDays, 1);
  assert.ok(updated.easeFactor < 2.5);
});

it('calculateNextReview should advance correctly for Grade 4 (Good) over multiple reviews', () => {
  // Review 1: repetition 0 -> 1, interval 1
  let item = initSrsItem({ phrase: 'ubiquitous' });
  item = calculateNextReview(item, SRS_GRADES.GOOD);
  assert.strictEqual(item.repetition, 1);
  assert.strictEqual(item.intervalDays, 1);

  // Review 2: repetition 1 -> 2, interval 3
  item = calculateNextReview(item, SRS_GRADES.GOOD);
  assert.strictEqual(item.repetition, 2);
  assert.strictEqual(item.intervalDays, 3);

  // Review 3: repetition 2 -> 3, interval = round(3 * easeFactor)
  const prevInterval = item.intervalDays;
  const ef = item.easeFactor;
  item = calculateNextReview(item, SRS_GRADES.GOOD);
  assert.strictEqual(item.repetition, 3);
  assert.strictEqual(item.intervalDays, Math.round(prevInterval * ef));
});

it('calculateNextReview should clamp easeFactor to minimum 1.3 and maximum 3.0', () => {
  let lowItem = { repetition: 0, intervalDays: 1, easeFactor: 1.35 };
  // Repeated failures should not plunge below 1.3
  for (let i = 0; i < 5; i++) {
    lowItem = calculateNextReview(lowItem, 1);
  }
  assert.strictEqual(lowItem.easeFactor, 1.3);

  let highItem = { repetition: 5, intervalDays: 30, easeFactor: 2.95 };
  // Repeated easy scores should not exceed 3.0
  for (let i = 0; i < 5; i++) {
    highItem = calculateNextReview(highItem, SRS_GRADES.EASY);
  }
  assert.strictEqual(highItem.easeFactor, 3.0);
});

it('isItemDue and getDueItems should accurately filter items past due date', () => {
  const pastItem = { id: 1, nextReviewDate: new Date(Date.now() - 86400000).toISOString() };
  const futureItem = { id: 2, nextReviewDate: new Date(Date.now() + 86400000).toISOString() };
  const undefinedItem = { id: 3 };

  assert.strictEqual(isItemDue(pastItem), true);
  assert.strictEqual(isItemDue(futureItem), false);
  assert.strictEqual(isItemDue(undefinedItem), true);

  const dueList = getDueItems([pastItem, futureItem, undefinedItem]);
  assert.strictEqual(dueList.length, 2);
  assert.strictEqual(dueList[0].id, 1);
  assert.strictEqual(dueList[1].id, 3);
});

it('getIntervalPreview should return descriptive localized text', () => {
  const item = { repetition: 0, intervalDays: 0, easeFactor: 2.5 };
  const previewAgain = getIntervalPreview(item, 1);
  assert.strictEqual(previewAgain, '1 ngày');

  const previewGood = getIntervalPreview(item, 4);
  assert.strictEqual(previewGood, '1 ngày');
});

// ============================================================================
// 2. REWRITE SCORER HEURISTICS TESTS
// ============================================================================
it('scoreUserRewrite should return warning for empty or overly short sentences', () => {
  const emptyRes = scoreUserRewrite('', 'People is bad', 'People are bad');
  assert.strictEqual(emptyRes.status, 'warning');
  assert.strictEqual(emptyRes.score, 0);

  const shortRes = scoreUserRewrite('Too short', 'People is bad', 'People are bad');
  assert.strictEqual(shortRes.status, 'warning');
  assert.strictEqual(shortRes.score, 0);
});

it('scoreUserRewrite should detect verbatim copying of the erroneous sentence', () => {
  const res = scoreUserRewrite(
    'The government should to invest in public education.',
    'The government should to invest in public education.',
    'The government should invest in public education.'
  );
  assert.strictEqual(res.status, 'error');
  assert.strictEqual(res.score, 0);
  assert.ok(res.message.includes('chưa thay đổi gì'));
});

it('scoreUserRewrite should award perfect 10/10 for matching examiner recommendation', () => {
  const res = scoreUserRewrite(
    'The government should invest in public education.',
    'The government should to invest in public education.',
    'The government should invest in public education.'
  );
  assert.strictEqual(res.status, 'perfect');
  assert.strictEqual(res.score, 10);
  assert.strictEqual(res.similarity, 100);
});

it('scoreUserRewrite should award 9/10 for excellent phrasing matching key academic structures', () => {
  const res = scoreUserRewrite(
    'The government should invest resources in public education.',
    'The government should to invest in public education.',
    'The government should invest in public education.'
  );
  assert.strictEqual(res.status, 'excellent');
  assert.strictEqual(res.score, 9);
  assert.ok(res.similarity >= 60);
});

it('scoreUserRewrite should penalize when candidate retains original errors', () => {
  const res = scoreUserRewrite(
    'The government really should to invest much in bad public schooling.',
    'The government should to invest in bad public education.',
    'The government should invest in public education.'
  );
  assert.strictEqual(res.status, 'needs-work');
  assert.strictEqual(res.score, 5);
});

console.log(`\n🎉 ALL ${testsPassed} STEP 8 UNIT TESTS PASSED CLEANLY!`);
