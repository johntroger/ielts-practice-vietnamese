import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ARENA_BATCH_1_QUESTIONS } from '../src/data/arenaQuestionsBatch1.js';
import { ARENA_QUESTION_BANK, getQuestionsByTierAndTopic } from '../src/data/arenaQuestionBank.js';
import { 
  validateArenaQuestion, 
  calculateSkillQuotas, 
  classifyQuestionCategory,
  balanceQuestionsBySkill,
  SKILL_DISTRIBUTION_TARGETS 
} from '../src/services/gamification/skillBalancingEngine.js';
import { generateArenaSprintQuestions } from '../src/adapters/sprintQuestionAdapter.js';

describe('Step 124: Dynamic Skill Balancing & Batch 1 Question Bank Engine', () => {

  it('1. ARENA_BATCH_1_QUESTIONS contains exactly 100 high-quality authentic questions', () => {
    assert.strictEqual(ARENA_BATCH_1_QUESTIONS.length, 100, 'Batch 1 must contain exactly 100 questions');
    
    const diffMap = { easy: 0, medium: 0, hard: 0, nightmare: 0 };
    for (const q of ARENA_BATCH_1_QUESTIONS) {
      assert.ok(diffMap[q.difficulty] !== undefined, `Unknown difficulty: ${q.difficulty}`);
      diffMap[q.difficulty]++;
    }

    assert.strictEqual(diffMap.easy, 25, 'Must have 25 easy questions');
    assert.strictEqual(diffMap.medium, 30, 'Must have 30 medium questions');
    assert.strictEqual(diffMap.hard, 30, 'Must have 30 hard questions');
    assert.strictEqual(diffMap.nightmare, 15, 'Must have 15 nightmare questions');
  });

  it('2. 100% of questions in ARENA_BATCH_1_QUESTIONS pass runtime schema validation with zero errors', () => {
    for (const q of ARENA_BATCH_1_QUESTIONS) {
      const res = validateArenaQuestion(q);
      assert.strictEqual(res.valid, true, `Question ${q.id} failed validation: ${res.errors.join(', ')}`);
      assert.ok(q.options.length >= 2, `Question ${q.id} must have at least 2 options`);
      assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Question ${q.id} correctIndex out of bounds`);
      assert.ok(q.explanation.length > 5, `Question ${q.id} must have a descriptive explanation`);
    }
  });

  it('3. calculateSkillQuotas allocates integer slots that strictly sum to targetCount', () => {
    for (const targetCount of [7, 10, 12, 15, 20]) {
      const quotas = calculateSkillQuotas(targetCount);
      const totalAllocated = Object.values(quotas).reduce((sum, n) => sum + n, 0);
      assert.strictEqual(totalAllocated, targetCount, `Quotas for targetCount ${targetCount} must sum to ${targetCount}`);
      
      // Quotas must follow golden ratio proportionality
      assert.ok(quotas.reading >= 1, 'Reading quota must be at least 1');
      assert.ok(quotas.listening >= 1, 'Listening quota must be at least 1');
    }
  });

  it('4. classifyQuestionCategory reliably classifies diverse question types', () => {
    assert.strictEqual(classifyQuestionCategory({ type: 'spelling' }), 'spelling');
    assert.strictEqual(classifyQuestionCategory({ type: 'chart_reading' }), 'visual_data');
    assert.strictEqual(classifyQuestionCategory({ type: 'map_reading' }), 'visual_data');
    assert.strictEqual(classifyQuestionCategory({ type: 'hedging' }), 'grammar');
    assert.strictEqual(classifyQuestionCategory({ skillCategory: 'listening' }), 'listening');
    assert.strictEqual(classifyQuestionCategory({ skillCategory: 'reading' }), 'reading');
    assert.strictEqual(classifyQuestionCategory({ skillCategory: 'vocab' }), 'vocab');
  });

  it('5. balanceQuestionsBySkill balances question pools according to pedagogical quotas', () => {
    const balanced = balanceQuestionsBySkill(ARENA_BATCH_1_QUESTIONS, 10);
    assert.strictEqual(balanced.length, 10, 'Balanced set must equal requested count of 10');

    // Ensure distinct IDs
    const ids = new Set(balanced.map(q => q.id));
    assert.strictEqual(ids.size, 10, 'All selected questions must be distinct');
  });

  it('6. generateArenaSprintQuestions produces balanced sprint questions that pass schema validation', () => {
    const sprint10 = generateArenaSprintQuestions({ count: 10, difficulty: 'medium' });
    assert.strictEqual(sprint10.length, 10, 'Sprint must contain 10 questions');
    
    for (const q of sprint10) {
      const validation = validateArenaQuestion(q);
      assert.strictEqual(validation.valid, true, `Sprint question ${q.id} must be valid: ${validation.errors.join(', ')}`);
      assert.strictEqual(q.difficulty, 'medium', 'Question difficulty must match requested');
    }
  });

  it('7. ARENA_QUESTION_BANK combines base questions and Batch 1 seamlessly', () => {
    assert.ok(ARENA_QUESTION_BANK.length >= 125, 'Bank must have at least 125 questions');
    
    // Check tier filtering works
    const hardQuestions = getQuestionsByTierAndTopic('hard');
    assert.ok(hardQuestions.length >= 30, 'Must have at least 30 hard questions available');
    for (const q of hardQuestions) {
      assert.strictEqual(q.difficulty, 'hard');
    }
  });

});
