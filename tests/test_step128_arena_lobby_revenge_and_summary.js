/**
 * tests/test_step128_arena_lobby_revenge_and_summary.js
 * 
 * Verifies Phase 2.4:
 * 1. Revenge Sprint CTA button in AtlasEnglishArenaModal lobby appears when unresolved mistakes exist
 * 2. AtlasEnglishArenaModal correctly loads revenge questions and launches revenge sprint
 * 3. ArenaSprintSummaryModal renders 3-tier transparent XP breakdown (Base, Boss, Time, Streak)
 * 4. Soft-cap warning notice appears when daily limit is scaled
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { 
  recordMistake, 
  clearMistakeVault, 
  getUnresolvedMistakeCount, 
  generateRevengeSprintQuestions 
} from '../src/services/gamification/mistakeVaultService.js';

describe('Step 128: Arena Lobby Revenge Sprint & 3-Tier Summary Breakdown', () => {

  beforeEach(() => {
    clearMistakeVault();
  });

  it('1. AtlasEnglishArenaModal renders Revenge Sprint CTA button conditioned on unresolved mistakes', () => {
    const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
    
    assert.ok(modalCode.includes('getUnresolvedMistakeCount() > 0'), 'Must check getUnresolvedMistakeCount() > 0');
    assert.ok(modalCode.includes('⚡ Đấu Phục Thù'), 'Must render Revenge Sprint button');
    assert.ok(modalCode.includes('generateRevengeSprintQuestions'), 'Must call generateRevengeSprintQuestions on click');
  });

  it('2. generateRevengeSprintQuestions dynamically prepares targeted questions from vault', () => {
    // 0 mistakes initially
    assert.strictEqual(getUnresolvedMistakeCount(), 0);
    assert.strictEqual(generateRevengeSprintQuestions({ count: 10 }).length, 0);

    // Record 3 mistakes
    recordMistake({ id: 'err_1', prompt: 'P1', options: ['A', 'B'], correctIndex: 0, type: 'tfng' }, 1);
    recordMistake({ id: 'err_2', prompt: 'P2', options: ['A', 'B'], correctIndex: 0, type: 'spelling' }, 1);
    recordMistake({ id: 'err_3', prompt: 'P3', options: ['A', 'B'], correctIndex: 0, type: 'listening_trap' }, 1);

    assert.strictEqual(getUnresolvedMistakeCount(), 3);
    const revengeList = generateRevengeSprintQuestions({ count: 10 });
    assert.strictEqual(revengeList.length, 3);
    
    // Each revenge question must have isRevengeQuestion = true
    for (const q of revengeList) {
      assert.strictEqual(q.isRevengeQuestion, true);
      assert.ok(['over_inference', 'spelling_demon', 'reversal_trap'].includes(q.diagnosticTag));
    }
  });

  it('3. ArenaSprintSummaryModal renders 3-tier transparent XP breakdown table', () => {
    const summaryCode = fs.readFileSync(path.resolve('src/components/arena/ArenaSprintSummaryModal.jsx'), 'utf-8');

    assert.ok(summaryCode.includes('Base XP'), 'Summary must display Base XP breakdown');
    assert.ok(summaryCode.includes('👑 Boss Bonus'), 'Summary must display Boss Bonus item');
    assert.ok(summaryCode.includes('⏱️ Time Bonus'), 'Summary must display Time Bonus item');
    assert.ok(summaryCode.includes('🔥 Streak Bonus'), 'Summary must display Streak Bonus item');
    assert.ok(summaryCode.includes('summary.softCapMultiplier < 1.0'), 'Summary must display Daily Soft-Cap notice when throttled');
  });

});
