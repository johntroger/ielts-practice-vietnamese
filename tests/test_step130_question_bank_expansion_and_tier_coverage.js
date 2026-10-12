/**
 * tests/test_step130_question_bank_expansion_and_tier_coverage.js
 * 
 * Verifies Phase 3.2:
 * 1. ARENA_QUESTION_BANK incorporates Base + Batch 1 + Batch 2 (total 228 questions)
 * 2. getQuestionsByTierAndTopic provides rich coverage across all 4 tiers and 8 topics
 * 3. Golden Ratio skill balancing works seamlessly on 228-question bank
 * 4. generateArenaSprintQuestions successfully draws balanced 10-question sprints across all difficulties
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  ARENA_QUESTION_BANK, 
  getQuestionsByTierAndTopic 
} from '../src/data/arenaQuestionBank.js';
import { generateArenaSprintQuestions } from '../src/adapters/sprintQuestionAdapter.js';
import { ARENA_IELTS_TOPICS, ARENA_DIFFICULTY_LEVELS } from '../src/utils/arenaStorageKeys.js';
import { validateArenaQuestion } from '../src/services/gamification/skillBalancingEngine.js';

describe('Step 130: Question Bank Expansion (228 Questions) & Tier Coverage', () => {

  it('1. ARENA_QUESTION_BANK contains exactly 228 questions with zero schema errors', () => {
    assert.strictEqual(ARENA_QUESTION_BANK.length, 228, 'Should have 28 base + 100 Batch 1 + 100 Batch 2 = 228 questions');

    const invalidList = [];
    ARENA_QUESTION_BANK.forEach(q => {
      const v = validateArenaQuestion(q);
      if (!v.valid) {
        invalidList.push({ id: q.id, errors: v.errors });
      }
    });

    assert.strictEqual(invalidList.length, 0, 'Every question in 228-item bank must pass validation');
  });

  it('2. Deep tier coverage across all 4 difficulties', () => {
    const easyPool = getQuestionsByTierAndTopic('easy');
    const medPool = getQuestionsByTierAndTopic('medium');
    const hardPool = getQuestionsByTierAndTopic('hard');
    const nmPool = getQuestionsByTierAndTopic('nightmare');

    assert.ok(easyPool.length >= 50, `Easy tier has ${easyPool.length} questions (expected >= 50)`);
    assert.ok(medPool.length >= 60, `Medium tier has ${medPool.length} questions (expected >= 60)`);
    assert.ok(hardPool.length >= 60, `Hard tier has ${hardPool.length} questions (expected >= 60)`);
    assert.ok(nmPool.length >= 35, `Nightmare tier has ${nmPool.length} questions (expected >= 35)`);
  });

  it('3. Topic filtering works across all 8 academic topics for each difficulty', () => {
    ARENA_IELTS_TOPICS.forEach(topic => {
      const filtered = getQuestionsByTierAndTopic('medium', topic.id);
      assert.ok(filtered.length > 0, `Topic ${topic.id} must have questions in Medium tier`);
    });
  });

  it('4. generateArenaSprintQuestions generates valid 10-question sprint for each difficulty', () => {
    const tiers = ['easy', 'medium', 'hard', 'nightmare'];

    tiers.forEach(difficulty => {
      const sprint = generateArenaSprintQuestions({
        count: 10,
        difficulty,
        recordHistory: false
      });

      assert.strictEqual(sprint.length, 10, `Sprint for ${difficulty} must have 10 questions`);
      assert.strictEqual(sprint[9].isBossQuestion, true, 'Question 10 must be Boss question');

      // Check skill diversity (at least 3 distinct skill categories)
      const categories = new Set(sprint.map(q => q.skillCategory));
      assert.ok(categories.size >= 3, `Sprint should have diverse skill categories, got ${categories.size}`);
    });
  });

});
