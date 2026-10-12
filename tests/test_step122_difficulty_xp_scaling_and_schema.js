/**
 * tests/test_step122_difficulty_xp_scaling_and_schema.js
 * 
 * Verifies Phase 1:
 * 1. 4-Tier Difficulty Configuration (Easy, Medium, Hard, Nightmare)
 * 2. 8 Core IELTS Topics Definition
 * 3. Dynamic XP Scaling in calculateSprintXp (12, 20, 32, 50 XP)
 * 4. Difficulty preservation in sprint state machine and question generator
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { 
  ARENA_DIFFICULTY_LEVELS, 
  ARENA_DIFFICULTY_CONFIG, 
  ARENA_IELTS_TOPICS 
} from '../src/utils/arenaStorageKeys.js';
import { calculateSprintXp } from '../src/services/gamification/xpCalculator.js';
import { startSprintAction, finishSprintAction } from '../src/hooks/useArenaSprintEngine.js';
import { generateArenaSprintQuestions } from '../src/adapters/sprintQuestionAdapter.js';

describe('Step 122: Arena Multi-Tier Difficulty, 8 Topics & XP Scaling Engine', () => {
  it('1. ARENA_DIFFICULTY_LEVELS & CONFIG define 4 standard IELTS band tiers', () => {
    assert.strictEqual(ARENA_DIFFICULTY_LEVELS.EASY, 'easy');
    assert.strictEqual(ARENA_DIFFICULTY_LEVELS.MEDIUM, 'medium');
    assert.strictEqual(ARENA_DIFFICULTY_LEVELS.HARD, 'hard');
    assert.strictEqual(ARENA_DIFFICULTY_LEVELS.NIGHTMARE, 'nightmare');

    assert.strictEqual(ARENA_DIFFICULTY_CONFIG.easy.baseXpPerQuestion, 12);
    assert.strictEqual(ARENA_DIFFICULTY_CONFIG.medium.baseXpPerQuestion, 20);
    assert.strictEqual(ARENA_DIFFICULTY_CONFIG.hard.baseXpPerQuestion, 32);
    assert.strictEqual(ARENA_DIFFICULTY_CONFIG.nightmare.baseXpPerQuestion, 50);
  });

  it('2. ARENA_IELTS_TOPICS defines exactly 8 diverse IELTS academic topics', () => {
    assert.strictEqual(ARENA_IELTS_TOPICS.length, 8);
    const ids = ARENA_IELTS_TOPICS.map(t => t.id);
    assert.ok(ids.includes('environment'));
    assert.ok(ids.includes('technology'));
    assert.ok(ids.includes('education'));
    assert.ok(ids.includes('health'));
    assert.ok(ids.includes('urbanization'));
    assert.ok(ids.includes('economy'));
    assert.ok(ids.includes('culture'));
    assert.ok(ids.includes('science'));
  });

  it('3. calculateSprintXp calculates tiered Base XP accurately across difficulties', () => {
    // 5 correct answers, 0 streak, 100s (no speed bonus)
    const easyRes = calculateSprintXp({ correctAnswers: 5, streakCount: 0, totalSeconds: 100, difficulty: 'easy' });
    const medRes = calculateSprintXp({ correctAnswers: 5, streakCount: 0, totalSeconds: 100, difficulty: 'medium' });
    const hardRes = calculateSprintXp({ correctAnswers: 5, streakCount: 0, totalSeconds: 100, difficulty: 'hard' });
    const nmRes = calculateSprintXp({ correctAnswers: 5, streakCount: 0, totalSeconds: 100, difficulty: 'nightmare' });

    assert.strictEqual(easyRes.rawXp, 5 * 12); // 60
    assert.strictEqual(medRes.rawXp, 5 * 20);  // 100
    assert.strictEqual(hardRes.rawXp, 5 * 32);  // 160
    assert.strictEqual(nmRes.rawXp, 5 * 50);    // 250
  });

  it('4. calculateSprintXp defaults safely to medium difficulty for backward compatibility', () => {
    const defaultRes = calculateSprintXp({ correctAnswers: 7, streakCount: 0, totalSeconds: 120 });
    assert.strictEqual(defaultRes.difficulty, 'medium');
    assert.strictEqual(defaultRes.rawXp, 7 * 20); // 140
  });

  it('5. startSprintAction and finishSprintAction preserve selected difficulty in summary', () => {
    const mockQuestions = [
      { id: 'q1', correctIndex: 0, options: ['A', 'B'], correctAnswer: 'A' }
    ];
    const activeState = startSprintAction(mockQuestions, 180, 'hard');
    assert.strictEqual(activeState.difficulty, 'hard');
    assert.strictEqual(activeState.timeRemaining, 180);

    const completedState = finishSprintAction({
      ...activeState,
      score: 1,
      timeRemaining: 150
    });
    assert.strictEqual(completedState.summary.difficulty, 'hard');
    assert.ok(completedState.summary.finalXp > 0);
  });

  it('6. generateArenaSprintQuestions attaches difficulty and topic to all questions', () => {
    const questions = generateArenaSprintQuestions({ count: 7, difficulty: 'nightmare', topic: 'technology', recordHistory: false });
    assert.strictEqual(questions.length, 7);
    questions.forEach(q => {
      assert.strictEqual(q.difficulty, 'nightmare');
      assert.strictEqual(q.topic, 'technology');
    });
  });

  it('7. ARENA_QUESTION_BANK has questions for all 4 tiers and includes chart/map media', () => {
    const bankFile = fs.readFileSync(path.resolve('src/data/arenaQuestionBank.js'), 'utf-8');
    assert.ok(bankFile.includes('easy_env_01'), 'Must include easy tier questions');
    assert.ok(bankFile.includes('med_env_01'), 'Must include medium tier questions');
    assert.ok(bankFile.includes('hard_env_01'), 'Must include hard tier questions');
    assert.ok(bankFile.includes('nm_env_01'), 'Must include nightmare tier questions');
    assert.ok(bankFile.includes('type: \'chart\''), 'Must include chart media questions');
    assert.ok(bankFile.includes('type: \'map\''), 'Must include map media questions');
  });

  it('8. Arena components index exports ArenaDifficultySelector and ArenaMediaViewer', () => {
    const indexCode = fs.readFileSync(path.resolve('src/components/arena/index.js'), 'utf-8');
    assert.ok(indexCode.includes('ArenaDifficultySelector'), 'index.js must export ArenaDifficultySelector');
    assert.ok(indexCode.includes('ArenaMediaViewer'), 'index.js must export ArenaMediaViewer');
  });

  it('9. AtlasEnglishArenaModal renders ArenaDifficultySelector and wires difficulty', () => {
    const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
    assert.ok(modalCode.includes('<ArenaDifficultySelector'), 'Modal must render ArenaDifficultySelector in lobby');
    assert.ok(modalCode.includes('selectedDifficulty'), 'Modal must track selectedDifficulty');
    assert.ok(modalCode.includes('currentTopic'), 'Modal must track and preview currentTopic');
  });

  it('10. ArenaQuestionCard embeds ArenaMediaViewer when question has media', () => {
    const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
    assert.ok(cardCode.includes('<ArenaMediaViewer media={question.media}'), 'Card must render ArenaMediaViewer');
  });
});
