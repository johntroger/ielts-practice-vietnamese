/**
 * tests/test_step121_arena_mouse_click_and_i18n_header_fix.js
 * 
 * Verifies the bugfix for:
 * 1. Mouse Click Check Answer capability (dual prop support for onCheckAnswer & onSubmitAnswer)
 * 2. arena.stageQuestionHeader i18n key localization and formatting
 * 3. Interactive cursor pointers on buttons and option selections
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Step 121: Atlas Arena Mouse Click & Header i18n Polish', () => {
  it('1. ArenaQuestionCard supports both onCheckAnswer and onSubmitAnswer callback props', () => {
    const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
    assert.ok(cardCode.includes('onSubmitAnswer'), 'Must accept onSubmitAnswer in props');
    assert.ok(cardCode.includes('onCheckAnswer'), 'Must accept onCheckAnswer in props');
    assert.ok(cardCode.includes('onCheckAnswer || onSubmitAnswer'), 'Must fallback gracefully between both callback prop names');
    assert.ok(cardCode.includes('handleCheck'), 'Must invoke handleCheck on check button click');
  });

  it('2. AtlasEnglishArenaModal explicitly passes onCheckAnswer and onSubmitAnswer to ArenaQuestionCard', () => {
    const modalCode = fs.readFileSync(path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx'), 'utf-8');
    assert.ok(modalCode.includes('onCheckAnswer={sprint.checkAnswer}'), 'Must pass onCheckAnswer prop');
    assert.ok(modalCode.includes('onSubmitAnswer={sprint.checkAnswer}'), 'Must pass onSubmitAnswer prop');
  });

  it('3. Both vi.js and en.js contain arena.checkAnswer, playAudio, and stageQuestionHeader', () => {
    const viCode = fs.readFileSync(path.resolve('src/i18n/locales/vi.js'), 'utf-8');
    const enCode = fs.readFileSync(path.resolve('src/i18n/locales/en.js'), 'utf-8');

    assert.ok(viCode.includes('checkAnswer:'), 'vi.js must have checkAnswer');
    assert.ok(viCode.includes('playAudio:'), 'vi.js must have playAudio');
    assert.ok(viCode.includes('stageQuestionHeader:'), 'vi.js must have stageQuestionHeader');

    assert.ok(enCode.includes('checkAnswer:'), 'en.js must have checkAnswer');
    assert.ok(enCode.includes('playAudio:'), 'en.js must have playAudio');
    assert.ok(enCode.includes('stageQuestionHeader:'), 'en.js must have stageQuestionHeader');
  });

  it('4. ArenaHeaderBar properly calls stageQuestionHeader with num and total params', () => {
    const headerCode = fs.readFileSync(path.resolve('src/components/arena/ArenaHeaderBar.jsx'), 'utf-8');
    assert.ok(headerCode.includes('t(\'arena.stageQuestionHeader\', { num: currentIndex + 1, total: totalQuestions })'), 'Must format header with num and total');
  });

  it('5. Interactive elements have cursor-pointer style applied', () => {
    const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
    assert.ok(cardCode.includes('cursor-pointer'), 'Action buttons must have cursor-pointer for intuitive mouse clicking');
    assert.ok(cardCode.includes('disabled:cursor-not-allowed'), 'Disabled state should display not-allowed cursor');
  });
});
