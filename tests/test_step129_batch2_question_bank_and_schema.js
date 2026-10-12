/**
 * tests/test_step129_batch2_question_bank_and_schema.js
 * 
 * Verifies Phase 3.1:
 * 1. ARENA_BATCH_2_QUESTIONS contains exactly 100 questions
 * 2. 100% of questions pass runtime schema validation
 * 3. Strict 4-tier distribution: 25 Easy, 30 Medium, 30 Hard, 15 Nightmare
 * 4. Coverage of all 8 academic topics and core skill categories
 * 5. Presence of Task 1 SVGs (Bar, Line, Pie, Flowchart, Complex)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ARENA_BATCH_2_QUESTIONS } from '../src/data/arenaQuestionsBatch2.js';
import { validateArenaQuestion } from '../src/services/gamification/skillBalancingEngine.js';

describe('Step 129: Batch 2 Question Bank & Schema Integrity (Cambridge 16 & GitBook)', () => {

  it('1. ARENA_BATCH_2_QUESTIONS contains exactly 100 authentic questions', () => {
    assert.strictEqual(ARENA_BATCH_2_QUESTIONS.length, 100, 'Batch 2 must have exactly 100 questions');
  });

  it('2. 100% of questions in ARENA_BATCH_2_QUESTIONS pass runtime schema validation with zero errors', () => {
    const invalidQuestions = [];
    ARENA_BATCH_2_QUESTIONS.forEach((q, idx) => {
      const validation = validateArenaQuestion(q);
      if (!validation.valid) {
        invalidQuestions.push({ index: idx, id: q.id, errors: validation.errors });
      }
    });

    assert.strictEqual(invalidQuestions.length, 0, `All questions must be valid. Found errors: ${JSON.stringify(invalidQuestions)}`);
  });

  it('3. ARENA_BATCH_2_QUESTIONS strictly satisfies the 4-tier difficulty quota', () => {
    const counts = { easy: 0, medium: 0, hard: 0, nightmare: 0 };
    ARENA_BATCH_2_QUESTIONS.forEach(q => {
      counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
    });

    assert.strictEqual(counts.easy, 25, 'Easy tier must have exactly 25 questions');
    assert.strictEqual(counts.medium, 30, 'Medium tier must have exactly 30 questions');
    assert.strictEqual(counts.hard, 30, 'Hard tier must have exactly 30 questions');
    assert.strictEqual(counts.nightmare, 15, 'Nightmare tier must have exactly 15 questions');
  });

  it('4. Questions span all 8 IELTS academic topics and include rich skill categories', () => {
    const topics = new Set(ARENA_BATCH_2_QUESTIONS.map(q => q.topic));
    assert.ok(topics.has('environment'));
    assert.ok(topics.has('technology'));
    assert.ok(topics.has('education'));
    assert.ok(topics.has('health'));
    assert.ok(topics.has('urbanization'));
    assert.ok(topics.has('economy'));
    assert.ok(topics.has('culture'));
    assert.ok(topics.has('science'));
    assert.strictEqual(topics.size, 8, 'Must cover all 8 topics');

    const skills = new Set(ARENA_BATCH_2_QUESTIONS.map(q => q.skillCategory));
    assert.ok(skills.has('spelling'));
    assert.ok(skills.has('reading'));
    assert.ok(skills.has('listening'));
    assert.ok(skills.has('vocab'));
    assert.ok(skills.has('visual_data'));
    assert.ok(skills.has('grammar'));
  });

  it('5. Contains authentic Cambridge Task 1 visual SVG questions with responsive vector data', () => {
    const svgQuestions = ARENA_BATCH_2_QUESTIONS.filter(q => q.media && q.media.svg);
    assert.ok(svgQuestions.length >= 5, 'Must contain at least 5 Task 1 SVG questions');

    svgQuestions.forEach(q => {
      assert.ok(q.media.svg.includes('<svg'), 'Media must contain valid SVG markup');
      assert.ok(typeof q.media.caption === 'string' && q.media.caption.length > 0, 'Must have a descriptive caption');
    });
  });

  it('6. Every question has unique ID with zero duplicates', () => {
    const idSet = new Set();
    ARENA_BATCH_2_QUESTIONS.forEach(q => {
      assert.ok(!idSet.has(q.id), `Duplicate ID detected: ${q.id}`);
      idSet.add(q.id);
    });
    assert.strictEqual(idSet.size, 100);
  });

});
