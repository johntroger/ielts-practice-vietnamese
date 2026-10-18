/**
 * Test Step 193: IELTS Listening Track 39 Speaking Part 2 Candidate Model Long Turn & Audio Integration
 */
import assert from 'assert';
import { track39SpeakingPart2CandidateSample } from '../src/data/listening/track39SpeakingPart2CandidateSample.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { SPEAKING_PART2_CUECARDS } from '../src/data/speakingTopics.js';
import { LISTENING_MICRO_DRILLS } from '../src/data/listeningMicroDrills.js';
import { ARENA_BASE_QUESTION_BANK, ARENA_QUESTION_BANK } from '../src/data/arenaQuestionBank.js';
import { ARENA_QUESTION_TRANSLATIONS, getLocalizedArenaQuestion } from '../src/data/arenaQuestionTranslations.js';

console.log('--- Running Step 193: Track 39 Audio & Candidate Long Turn Integration Test ---');

// 1. Verify Track 39 Dataset Integrity
assert.ok(track39SpeakingPart2CandidateSample, 'Track 39 dataset must exist');
assert.strictEqual(track39SpeakingPart2CandidateSample.id, 'ielts-listening-track39-speaking-part2-sample');
assert.strictEqual(track39SpeakingPart2CandidateSample.totalQuestions, 10);
assert.strictEqual(track39SpeakingPart2CandidateSample.audioDuration, 83);
assert.strictEqual(track39SpeakingPart2CandidateSample.parts.length, 2, 'Must have 2 parts');

// Part 1
const p1 = track39SpeakingPart2CandidateSample.parts[0];
assert.strictEqual(p1.partNumber, 1);
const p1Questions = (p1.questionGroups || []).flatMap(g => g.questions || []);
assert.strictEqual(p1Questions.length, 5, 'Part 1 must have 5 questions (1-5)');
assert.deepStrictEqual(p1Questions.map(q => q.order), [1, 2, 3, 4, 5]);

// Part 2
const p2 = track39SpeakingPart2CandidateSample.parts[1];
assert.strictEqual(p2.partNumber, 2);
const p2Questions = (p2.questionGroups || []).flatMap(g => g.questions || []);
assert.strictEqual(p2Questions.length, 5, 'Part 2 must have 5 questions (6-10)');
assert.deepStrictEqual(p2Questions.map(q => q.order), [6, 7, 8, 9, 10]);

// 2. Verify Registration in INITIAL_LISTENING_TESTS
const t39Test = INITIAL_LISTENING_TESTS.find(t => t.id === 'ielts-listening-track39-speaking-part2-sample');
assert.ok(t39Test, 'Track 39 must be registered in INITIAL_LISTENING_TESTS');
assert.ok(INITIAL_LISTENING_TESTS.slice(0, 10).some(t => t.id === 'ielts-listening-track39-speaking-part2-sample'), 'Track 39 must be present in top listening tests');

// 3. Verify Speaking Topics Candidate Audio Integration
const journeyTopic = SPEAKING_PART2_CUECARDS.find(t => t.id === 'p2-memorable-journey');
assert.ok(journeyTopic, 'Memorable Journey topic must exist');
assert.ok(journeyTopic.candidateAudioUrl, 'Journey topic must have candidateAudioUrl');
assert.strictEqual(journeyTopic.candidateAudioUrl, track39SpeakingPart2CandidateSample.audioUrl);
assert.strictEqual(journeyTopic.candidateAudioDuration, 83);

// 4. Verify Track 39 Micro-Drills
const t39Drills = LISTENING_MICRO_DRILLS.filter(d => d.id && d.id.includes('track39'));
assert.strictEqual(t39Drills.length, 4, 'Must have 4 Track 39 micro-drills');
t39Drills.forEach(d => {
  assert.ok(d.audioUrl.includes('track39-speaking-part2-candidate-sample'), `Drill ${d.id} has valid audio URL`);
  assert.ok(d.titleEn, `Drill ${d.id} must have titleEn`);
  assert.ok(d.categoryEn, `Drill ${d.id} must have categoryEn`);
});

// 5. Verify Arena Question Bank Integration
const expectedArenaIds = [
  'easy_lis_paris_departure_t39',
  'easy_lis_louvre_triangle_t39',
  'med_lis_julie_snow_globe_t39',
  'med_lis_tour_bus_camera_t39',
  'hard_lis_french_study_reflection_t39'
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
  assert.ok(hydratedQ.audioUrl.includes('track39-speaking-part2-candidate-sample'), `${id} must have Track 39 audioUrl`);
  assert.ok(hydratedQ.clipStart >= 0 && hydratedQ.clipEnd <= 83, `${id} audio clip must be within 0 - 83s`);

  assert.ok(ARENA_QUESTION_TRANSLATIONS[id], `${id} must be in ARENA_QUESTION_TRANSLATIONS`);
  const localizedEn = getLocalizedArenaQuestion(hydratedQ, true);
  assert.strictEqual(localizedEn.prompt, hydratedQ.promptEn, `${id} localized English prompt matches`);
});

// 6. Verify Dynamic Question-to-Part Routing
const dynamicPartMapping = track39SpeakingPart2CandidateSample.parts.map(p => {
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
const targetPartForQ6 = track39SpeakingPart2CandidateSample.parts.find(p => {
  const qs = (p.questionGroups || []).flatMap(g => g.questions || []);
  return qs.some(q => (q.order ?? q.number) === 6);
});
assert.strictEqual(targetPartForQ6.partNumber, 2, 'Question 6 must route to Part 2');

console.log('✓ Step 193 Passed: Track 39 Audio & Candidate Long Turn fully verified!');
