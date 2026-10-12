import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  getDiagnosticTag,
  recordMistake,
  getStoredMistakes,
  getUnresolvedMistakeCount,
  resolveMistake,
  purgeResolvedMistakes,
  clearMistakeVault,
  generateRevengeSprintQuestions,
  MAX_STORED_MISTAKES
} from '../src/services/gamification/mistakeVaultService.js';

describe('Step 125: Mistake Vault Service & Diagnostic Tagging Engine', () => {

  beforeEach(() => {
    clearMistakeVault();
  });

  it('1. getDiagnosticTag correctly diagnoses question pathology', () => {
    assert.strictEqual(getDiagnosticTag({ type: 'spelling' }), 'spelling_demon');
    assert.strictEqual(getDiagnosticTag({ skillCategory: 'spelling' }), 'spelling_demon');
    assert.strictEqual(getDiagnosticTag({ type: 'tfng' }), 'over_inference');
    assert.strictEqual(getDiagnosticTag({ skillCategory: 'reading' }), 'over_inference');
    assert.strictEqual(getDiagnosticTag({ type: 'listening_trap' }), 'reversal_trap');
    assert.strictEqual(getDiagnosticTag({ skillCategory: 'listening' }), 'reversal_trap');
    assert.strictEqual(getDiagnosticTag({ type: 'hedging' }), 'hedging_absence');
    assert.strictEqual(getDiagnosticTag({ skillCategory: 'grammar' }), 'hedging_absence');
    assert.strictEqual(getDiagnosticTag({ type: 'synonym' }), 'general');
    assert.strictEqual(getDiagnosticTag(null), 'general');
  });

  it('2. recordMistake records a new mistake with diagnostic metadata and user answer', () => {
    const q = {
      id: 'cam15_t1_l_q04',
      prompt: 'Identify the duration',
      options: ['One month', 'One week', 'Six months', 'One day'],
      correctIndex: 1,
      correctAnswer: 'One week',
      explanation: 'The agent said for a week at first',
      cambridgeSource: 'Cambridge 15 Test 1',
      skillCategory: 'listening',
      type: 'listening_trap'
    };

    const result = recordMistake(q, 0); // User wrongly chose option 0 ('One month')
    assert.strictEqual(result.length, 1);
    
    const stored = result[0];
    assert.strictEqual(stored.id, 'cam15_t1_l_q04');
    assert.strictEqual(stored.userSelectedOption, 0);
    assert.strictEqual(stored.userSelectedAnswer, 'One month');
    assert.strictEqual(stored.correctAnswer, 'One week');
    assert.strictEqual(stored.diagnosticTag, 'reversal_trap');
    assert.strictEqual(stored.mistakeCount, 1);
    assert.strictEqual(stored.resolved, false);
    assert.ok(typeof stored.lastMissedAt === 'number');
  });

  it('3. recordMistake increments mistakeCount on repeated errors and brings item to front', () => {
    const q1 = { id: 'q1', type: 'spelling', options: ['A', 'B'], correctIndex: 0 };
    const q2 = { id: 'q2', type: 'tfng', options: ['TRUE', 'FALSE'], correctIndex: 0 };

    recordMistake(q1, 1);
    recordMistake(q2, 1);
    
    let mistakes = getStoredMistakes();
    assert.strictEqual(mistakes.length, 2);
    assert.strictEqual(mistakes[0].id, 'q2'); // q2 is most recent
    assert.strictEqual(mistakes[0].mistakeCount, 1);

    // Repeat mistake on q1
    recordMistake(q1, 1);
    mistakes = getStoredMistakes();
    assert.strictEqual(mistakes.length, 2);
    assert.strictEqual(mistakes[0].id, 'q1'); // q1 moved to front
    assert.strictEqual(mistakes[0].mistakeCount, 2); // Count incremented
  });

  it('4. recordMistake strictly enforces the FIFO cap of 50 items', () => {
    assert.strictEqual(MAX_STORED_MISTAKES, 50);

    for (let i = 1; i <= 60; i++) {
      recordMistake({ id: `item_${i}`, prompt: `Question ${i}`, options: ['A', 'B'], correctIndex: 0 }, 1);
    }

    const mistakes = getStoredMistakes();
    assert.strictEqual(mistakes.length, 50, 'Must cap strictly at 50 items');
    assert.strictEqual(mistakes[0].id, 'item_60', 'Item 60 should be at front');
    assert.strictEqual(mistakes[49].id, 'item_11', 'Oldest preserved item should be item_11 (items 1-10 purged)');
  });

  it('5. resolveMistake and purgeResolvedMistakes update and clean mistake status', () => {
    const q1 = { id: 'q_resolve_1', type: 'spelling', options: ['A', 'B'], correctIndex: 0 };
    const q2 = { id: 'q_resolve_2', type: 'spelling', options: ['A', 'B'], correctIndex: 0 };

    recordMistake(q1, 1);
    recordMistake(q2, 1);

    assert.strictEqual(getUnresolvedMistakeCount(), 2);

    const resolved = resolveMistake('q_resolve_1');
    assert.strictEqual(resolved, true);
    assert.strictEqual(getUnresolvedMistakeCount(), 1);

    const nonExistent = resolveMistake('non_existent_id');
    assert.strictEqual(nonExistent, false);

    const remaining = purgeResolvedMistakes();
    assert.strictEqual(remaining.length, 1);
    assert.strictEqual(remaining[0].id, 'q_resolve_2');
  });

  it('6. generateRevengeSprintQuestions returns unresolved mistakes with isRevengeQuestion metadata', () => {
    for (let i = 1; i <= 15; i++) {
      recordMistake({
        id: `rev_q_${i}`,
        prompt: `Missed Question ${i}`,
        options: ['Opt A', 'Opt B', 'Opt C', 'Opt D'],
        correctIndex: 0,
        type: 'spelling',
        skillCategory: 'spelling'
      }, 1);
    }

    // Resolve 2 of them
    resolveMistake('rev_q_1');
    resolveMistake('rev_q_2');

    // Generate sprint of 10
    const revengeSprint = generateRevengeSprintQuestions({ count: 10 });
    assert.strictEqual(revengeSprint.length, 10, 'Should generate up to 10 questions');

    for (const q of revengeSprint) {
      assert.strictEqual(q.isRevengeQuestion, true, 'Must have isRevengeQuestion flag');
      assert.ok(q.previousMistakeCount >= 1, 'Must preserve previousMistakeCount');
      assert.strictEqual(q.diagnosticTag, 'spelling_demon');
      assert.notStrictEqual(q.id, 'rev_q_1', 'Resolved questions must not be served in revenge sprint');
      assert.notStrictEqual(q.id, 'rev_q_2', 'Resolved questions must not be served in revenge sprint');
    }
  });

  it('7. clearMistakeVault completely clears all stored items', () => {
    recordMistake({ id: 'dummy', options: ['A'], correctIndex: 0 });
    assert.strictEqual(getStoredMistakes().length, 1);

    clearMistakeVault();
    assert.strictEqual(getStoredMistakes().length, 0);
    assert.strictEqual(getUnresolvedMistakeCount(), 0);
  });

});
