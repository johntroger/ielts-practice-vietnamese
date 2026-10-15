/**
 * tests/test_step145_arena_unambiguous_typing_questions.js
 * 
 * Verifies that all interactive type-in exercises in Atlas English Arena
 * provide clear, unambiguous target cues (e.g. misspelled word in brackets,
 * contextual note stems, audio pronunciation, and dynamic placeholder)
 * so users never have to guess open-ended blanks.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { adaptSpellingTrap, adaptListeningSpellingDrill } from '../src/adapters/sprintQuestionAdapter.js';
import { IELTS_SPELLING_TRAPS } from '../src/data/vocabGrammarSpellingData.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';

let passedTests = 0;
let totalTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('\n--- Running Step 145: Unambiguous Type-in Questions & Spelling Error Cues ---');

// 1. Wednesday trap (sp-58) is unambiguous and embeds [Wenesday]
it('1. adaptSpellingTrap for Wednesday (sp-58) embeds [Wenesday] and removes open-ended blank', () => {
  const wednesdayItem = IELTS_SPELLING_TRAPS.find(t => t.id === 'sp-58');
  assert.ok(wednesdayItem, 'sp-58 item must exist');
  assert.strictEqual(wednesdayItem.correct, 'Wednesday');

  const adapted = adaptSpellingTrap(wednesdayItem);
  assert.strictEqual(adapted.interactionType, 'text_input');
  assert.strictEqual(adapted.misspelledWord, 'Wenesday');
  assert.strictEqual(adapted.correctAnswer, 'Wednesday');
  
  // Sentence must contain [Wenesday] and MUST NOT contain empty ____
  assert.ok(adapted.context.includes('[Wenesday]'), 'Context sentence must embed [Wenesday]');
  assert.ok(!adapted.context.includes('____'), 'Context sentence must not contain open-ended ____ blank');
  
  // Prompt must explicitly instruct fixing [Wenesday]
  assert.ok(adapted.promptEn.includes('[Wenesday]'), 'promptEn must name [Wenesday]');
  assert.ok(adapted.promptVi.includes('[Wenesday]'), 'promptVi must name [Wenesday]');
  
  // Placeholder must guide user to type correct spelling of Wenesday
  assert.ok(adapted.placeholderEn.includes('Wenesday'), 'placeholderEn must reference Wenesday');
  assert.ok(adapted.placeholderVi.includes('Wenesday'), 'placeholderVi must reference Wenesday');
  
  // Audio text must be Wednesday
  assert.strictEqual(adapted.audioText, 'Wednesday');
});

// 2. All 100 IELTS_SPELLING_TRAPS produce unambiguous cues
it('2. All 100 IELTS_SPELLING_TRAPS produce unambiguous bracketed mistake cues', () => {
  IELTS_SPELLING_TRAPS.forEach(item => {
    const adapted = adaptSpellingTrap(item);
    assert.ok(adapted.misspelledWord && adapted.misspelledWord.length > 0, `${item.id} must have a misspelledWord`);
    assert.ok(adapted.context.includes(`[${adapted.misspelledWord}]`), `${item.id} context must embed bracketed misspelledWord`);
    assert.ok(!adapted.context.includes('____'), `${item.id} context must not contain open-ended blanks`);
    assert.ok(adapted.promptEn.includes(`[${adapted.misspelledWord}]`), `${item.id} promptEn must mention bracketed word`);
    assert.ok(adapted.placeholderEn.includes(adapted.misspelledWord), `${item.id} placeholderEn must include misspelledWord`);
    assert.strictEqual(adapted.audioText, item.correct, `${item.id} audioText must be correct spelling`);
  });
});

// 3. Listening spelling drills embed formStem notes
it('3. adaptListeningSpellingDrill embeds note form stems and clear note prompts', () => {
  const spellingDrills = LISTENING_MICRO_DRILLS.filter(d => d.type === 'listening-spelling');
  assert.ok(spellingDrills.length >= 6, 'Must have at least 6 listening-spelling drills');

  spellingDrills.forEach(drill => {
    const adapted = adaptListeningSpellingDrill(drill);
    assert.strictEqual(adapted.interactionType, 'text_input');
    assert.strictEqual(adapted.skillCategory, 'listening');
    assert.ok(adapted.formStem && adapted.formStem.length > 0, `${drill.id} must have formStem`);
    assert.ok(adapted.promptEn.includes(adapted.formStem), `${drill.id} promptEn must include note stem`);
    assert.ok(adapted.audioText.length > 0, `${drill.id} must have audioText`);
  });
});

// 4. ArenaTextInputCard UI displays misspelledWord cue badge and binds activePlaceholder
it('4. ArenaTextInputCard UI displays misspelledWord cue badge and binds activePlaceholder', () => {
  const code = fs.readFileSync(path.resolve('src/components/arena/ArenaTextInputCard.jsx'), 'utf-8');
  assert.ok(code.includes('activePlaceholder'), 'ArenaTextInputCard must compute activePlaceholder');
  assert.ok(code.includes('placeholder={activePlaceholder}'), 'ArenaTextInputCard input must use activePlaceholder');
  assert.ok(code.includes('question?.misspelledWord'), 'ArenaTextInputCard must check for question.misspelledWord');
  assert.ok(code.includes('Fix spelling for:'), 'ArenaTextInputCard must display fix spelling cue in English');
  assert.ok(code.includes('Sửa lỗi chính tả cho từ:'), 'ArenaTextInputCard must display fix spelling cue in Vietnamese');
  assert.ok(code.includes('line-through'), 'Misspelled cue must have strikethrough styling');
});

// 5. ArenaQuestionCard highlights bracketed errors and displays note completion
it('5. ArenaQuestionCard highlights bracketed errors and displays note completion', () => {
  const code = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
  assert.ok(code.includes("activeContext.split(/(\\[[^\\]]+\\])/g)"), 'ArenaQuestionCard must split bracketed tokens for styling');
  assert.ok(code.includes('bg-rose-950/80'), 'Bracketed error must have rose warning badge styling');
  assert.ok(code.includes('question.formStem || localizedQ.formStem'), 'ArenaQuestionCard must render formStem note completion banner');
  assert.ok(code.includes('📋 Note:'), 'Must display Note icon and label');
});

console.log(`\nAll ${passedTests}/${totalTests} Step 145 tests PASSED successfully!\n`);
