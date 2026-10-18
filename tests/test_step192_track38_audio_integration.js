/**
 * Test Step 192: IELTS Listening Track 38 Speaking Part 2 Examiner Prompt & Dynamic Part Navigation
 */
import assert from 'assert';
import { track38SpeakingPart2ExaminerPrompt } from '../src/data/listening/track38SpeakingPart2ExaminerPrompt.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { SPEAKING_PART2_CUECARDS } from '../src/data/speakingTopics.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';

console.log('--- Running Step 192: Track 38 Audio & Dynamic Part Routing Test ---');

// 1. Verify Track 38 Dataset Integrity
assert.ok(track38SpeakingPart2ExaminerPrompt, 'Track 38 dataset must exist');
assert.strictEqual(track38SpeakingPart2ExaminerPrompt.id, 'ielts-listening-track38-speaking-part2-prompt');
assert.strictEqual(track38SpeakingPart2ExaminerPrompt.totalQuestions, 10);
assert.strictEqual(track38SpeakingPart2ExaminerPrompt.audioDuration, 30);
assert.strictEqual(track38SpeakingPart2ExaminerPrompt.parts.length, 2, 'Must have 2 parts');

// Part 1
const p1 = track38SpeakingPart2ExaminerPrompt.parts[0];
assert.strictEqual(p1.partNumber, 1);
const p1Questions = (p1.questionGroups || []).flatMap(g => g.questions || []);
assert.strictEqual(p1Questions.length, 5, 'Part 1 must have 5 questions (1-5)');
assert.deepStrictEqual(p1Questions.map(q => q.order), [1, 2, 3, 4, 5]);

// Part 2
const p2 = track38SpeakingPart2ExaminerPrompt.parts[1];
assert.strictEqual(p2.partNumber, 2);
const p2Questions = (p2.questionGroups || []).flatMap(g => g.questions || []);
assert.strictEqual(p2Questions.length, 5, 'Part 2 must have 5 questions (6-10)');
assert.deepStrictEqual(p2Questions.map(q => q.order), [6, 7, 8, 9, 10]);

// 2. Verify Registration in INITIAL_LISTENING_TESTS
const t38Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track38-speaking-part2-prompt');
assert.ok(t38Test, 'Track 38 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 15).some(t => t.id === 'ielts-listening-track38-speaking-part2-prompt'), 'Track 38 must be present in top listening tests');

// 3. Verify Speaking Topics Examiner Audio Integration
const journeyTopic = SPEAKING_PART2_CUECARDS.find(t => t.id === 'p2-memorable-journey');
assert.ok(journeyTopic, 'Memorable Journey topic must exist');
assert.ok(journeyTopic.examinerAudioUrl, 'Journey topic must have examinerAudioUrl');
assert.strictEqual(journeyTopic.examinerAudioUrl, track38SpeakingPart2ExaminerPrompt.audioUrl);

// 4. Verify Track 38 Micro-Drills
const t38Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track38'));
assert.strictEqual(t38Drills.length, 4, 'Must have 4 Track 38 micro-drills');
t38Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track38-speaking-part2-journey-prompt'), `Drill ${d.id} has valid audio URL`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

// 5. Verify Arena Question Bank Integration
const expectedArenaIds = [
  'easy_lis_prep_time_t38',
  'easy_lis_paper_pencil_t38',
  'med_lis_interruption_procedure_t38',
  'med_lis_time_ceiling_t38',
  'hard_lis_cue_card_journey_t38'
];

expectedArenaIds.forEach(id => {
  const baseQ = ARENA_BASE_QUESTION_BANK.find(item => item.id === id);
  assert.ok(baseQ, `Arena Base question bank must contain ${id}`);
  assert.ok(baseQ.promptEn, `${id} must have promptEn`);
  assert.ok(baseQ.contextEn, `${id} must have contextEn`);
  assert.ok(baseQ.explanationEn, `${id} must have explanationEn`);
  assert.ok(baseQ.optionsEn && baseQ.optionsEn.length === 4, `${id} must have 4 optionsEn`);

  const hydratedQ = ARENA_QUESTION_BANK.find(item => item.id === id);
  assert.ok(hydratedQ, `Hydrated Arena question ${id} must exist`);
  assert.strictEqual(hydratedQ.isR2Audio, true, `${id} must have isR2Audio flag`);
  assert.ok(hydratedQ.audioUrl.includes('track38-speaking-part2-journey-prompt'), `${id} must have Track 38 audioUrl`);
  assert.ok(hydratedQ.clipStart >= 0 && hydratedQ.clipEnd <= 30, `${id} audio clip must be within 0 - 30s`);

  assert.ok(ARENA_QUESTION_TRANSLATIONS[id], `${id} must be in ARENA_QUESTION_TRANSLATIONS`);
  const localizedEn = getLocalizedArenaQuestion(hydratedQ, true);
  assert.strictEqual(localizedEn.prompt, hydratedQ.promptEn, `${id} localized English prompt matches`);
});

// 6. Verify Dynamic Question-to-Part Routing
const dynamicPartMapping = track38SpeakingPart2ExaminerPrompt.parts.map(p => {
  const qs = (p.questionGroups || []).flatMap(g => g.questions || []);
  const orders = qs.map(q => q.order ?? q.number);
  return {
    partNumber: p.partNumber,
    range: [Math.min(...orders), Math.max(...orders)],
    firstQuestionOrder: Math.min(...orders)
  };
});

assert.strictEqual(dynamicPartMapping[0].partNumber, 1);
assert.deepStrictEqual(dynamicPartMapping[0].range, [1, 5]);
assert.strictEqual(dynamicPartMapping[0].firstQuestionOrder, 1);

assert.strictEqual(dynamicPartMapping[1].partNumber, 2);
assert.deepStrictEqual(dynamicPartMapping[1].range, [6, 10]);
assert.strictEqual(dynamicPartMapping[1].firstQuestionOrder, 6);

// Verify Question 6 routes to Part 2, not Part 1
const targetPartForQ6 = track38SpeakingPart2ExaminerPrompt.parts.find(p => {
  const qs = (p.questionGroups || []).flatMap(g => g.questions || []);
  return qs.some(q => (q.order ?? q.number) === 6);
});
assert.strictEqual(targetPartForQ6.partNumber, 2, 'Question 6 must route to Part 2');

console.log('✓ Step 192 Passed: Track 38 Audio & Dynamic Part Routing fully verified!');
