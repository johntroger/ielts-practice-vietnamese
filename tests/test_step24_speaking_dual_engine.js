/**
 * Test Suite: Step 24 - IELTS Speaking Dual-Engine & Computer Algorithmic Evaluation
 * Verifies standalone offline algorithmic evaluation for both full 3-part mock exams
 * and single-question practice drills according to official Cambridge assessment rubrics.
 */

import assert from 'assert';
import { 
  roundToIeltsBand,
  analyzeFluencyAndCoherence,
  analyzeLexicalResource,
  analyzeGrammaticalRangeAndAccuracy,
  analyzePronunciationCadence,
  evaluateSpeakingAlgorithmically,
  evaluateSinglePracticeAnswerAlgorithmically
} from '../src/services/algorithmicSpeakingService.js';

console.log('--- TEST STEP 24: SPEAKING DUAL-ENGINE & ALGORITHMIC EVALUATION ---');

let testsPassed = 0;

function it(desc, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// ============================================================================
// 1. CAMBRIDGE IELTS HALF-BAND ROUNDING RULES
// ============================================================================
it('roundToIeltsBand should follow Cambridge official rounding boundaries', () => {
  // Below 0.25 rounds down to integer
  assert.strictEqual(roundToIeltsBand(6.1), 6.0);
  assert.strictEqual(roundToIeltsBand(6.24), 6.0);

  // 0.25 to 0.74 rounds to half-band (.5)
  assert.strictEqual(roundToIeltsBand(6.25), 6.5);
  assert.strictEqual(roundToIeltsBand(6.375), 6.5);
  assert.strictEqual(roundToIeltsBand(6.5), 6.5);
  assert.strictEqual(roundToIeltsBand(6.74), 6.5);

  // 0.75 and above rounds up to next integer (+1.0)
  assert.strictEqual(roundToIeltsBand(6.75), 7.0);
  assert.strictEqual(roundToIeltsBand(6.875), 7.0);

  // Clamping between 1.0 and 9.0
  assert.strictEqual(roundToIeltsBand(0.5), 1.0);
  assert.strictEqual(roundToIeltsBand(9.5), 9.0);
});

// ============================================================================
// 2. EDGE CASE RESILIENCE: EMPTY, NULL & SHORT TRANSCRIPTS
// ============================================================================
it('evaluateSpeakingAlgorithmically should handle empty or missing candidate turns gracefully', () => {
  const emptyRes = evaluateSpeakingAlgorithmically({
    dialogueHistory: [],
    totalDurationSec: 0
  });

  assert.strictEqual(emptyRes.overallBand, 2.0);
  assert.strictEqual(emptyRes.evaluationMethod, 'algorithmic');
  assert.strictEqual(emptyRes.speechAnalytics.totalWords, 0);
  assert.strictEqual(emptyRes.speechAnalytics.wordsPerMinute, 0);
  assert.ok(emptyRes.examinerSummaryVerdict.includes('Không phát hiện câu trả lời'));
});

it('evaluateSinglePracticeAnswerAlgorithmically should handle empty or ultra-short input safely', () => {
  const ultraShort = evaluateSinglePracticeAnswerAlgorithmically({
    part: 1,
    topicTitle: 'Work & Study',
    questionText: 'Do you work or study?',
    candidateTranscript: 'Yes, work.',
    durationSec: 2
  });

  assert.strictEqual(ultraShort.overallBand, 2.0);
  assert.strictEqual(ultraShort.isShortOrEmpty, true);
  assert.strictEqual(ultraShort.evaluationMethod, 'algorithmic');
  assert.ok(ultraShort.examinerComment.includes('quá ngắn'));
  assert.ok(ultraShort.top3ActionPlan.priority1.includes('Nói đủ độ dài'));
});

// ============================================================================
// 3. FULL MOCK EXAM SCORING & CAMBRIDGE HARD CAPPING
// ============================================================================
it('evaluateSpeakingAlgorithmically should apply Part 2 duration penalty (< 60s caps FC at 5.0)', () => {
  const dialogueWithBriefP2 = [
    { speaker: 'examiner', stage: 'greeting', text: 'Welcome.' },
    { speaker: 'candidate', stage: 'part1', text: 'Well, to be honest I live in Hanoi which is a bustling city with many amenities.', durationSec: 15 },
    { speaker: 'candidate', stage: 'part2', text: 'I want to talk about a memorable trip. I went to Da Nang last year. It was nice. I enjoyed the beach.', durationSec: 35 },
    { speaker: 'candidate', stage: 'part3', text: 'From a broader perspective, tourism proves an integral component of national economic development.', durationSec: 25 }
  ];

  const res = evaluateSpeakingAlgorithmically({
    dialogueHistory: dialogueWithBriefP2,
    totalDurationSec: 400
  });

  assert.ok(res.criteria.fc.band <= 5.0, `FC should be capped at 5.0 due to < 60s Part 2, got ${res.criteria.fc.band}`);
  assert.ok(res.criteria.fc.fcCapReason.includes('< 60 giây'), 'Should state Part 2 cap reason');
});

it('evaluateSpeakingAlgorithmically should penalize excessive filler words (> 10% caps FC at 5.0)', () => {
  const dialogueWithHeavyFillers = [
    {
      speaker: 'candidate',
      stage: 'part1',
      text: 'Um, I think, uh, like, you know, my hometown is, er, like, very big and, um, you know, crowded, like, really busy.',
      durationSec: 30
    }
  ];

  const res = evaluateSpeakingAlgorithmically({
    dialogueHistory: dialogueWithHeavyFillers,
    totalDurationSec: 120
  });

  assert.ok(res.criteria.fc.fillerDensityPercent > 10, 'Filler density should exceed 10%');
  assert.ok(res.criteria.fc.band <= 5.0, `FC should be capped at 5.0 for excessive fillers, got ${res.criteria.fc.band}`);
});

it('evaluateSpeakingAlgorithmically should detect Part 2 past tense narrative inconsistency', () => {
  const dialogueWithTenseTrap = [
    {
      speaker: 'candidate',
      stage: 'part2',
      text: 'I describe a time I visit Singapore. I go to the zoo and I see many animals. I buy some souvenirs and I feel very happy. I also decide to walk in the park.',
      durationSec: 110
    }
  ];

  const mockPack = {
    part2Card: { title: 'Describe a time you traveled abroad in the past' }
  };

  const res = evaluateSpeakingAlgorithmically({
    dialogueHistory: dialogueWithTenseTrap,
    mockPack,
    totalDurationSec: 120
  });

  assert.strictEqual(res.criteria.gra.pastTenseInconsistency, true);
  assert.ok(res.criteria.gra.band <= 5.5, `GRA should be capped at 5.5 due to past tense inconsistency, got ${res.criteria.gra.band}`);
  assert.ok(res.criteria.gra.weaknesses.includes('BẪY THÌ QUÁ KHỨ'));
});

// ============================================================================
// 4. HIGH-PERFORMING CANDIDATE EVALUATION
// ============================================================================
it('evaluateSpeakingAlgorithmically should reward Band 7.5+ for fluent speech with C1 collocations and complex grammar', () => {
  const p2Speech = 'I would like to dwell upon an excursion that left an indelible impression on me. It took place back when I was exploring ancient architecture in Hue with my close companions. Looking back, what struck me most was how this transformative journey not only broadened my horizons but also catalyzed my passion for heritage conservation. Although we encountered unexpected rainstorms during our journey, we decided to persevere, visiting historical imperial monuments and engaging actively with local artisans who shared profound stories. Furthermore, this experience offered an invaluable avenue to appreciate our cultural heritage, leaving me with profound gratitude. On top of that, navigating historical streets helped me appreciate traditional values, which continues to inspire my current studies. All in all, it was an exceptional episode in my life that I will cherish forever.';

  const advancedDialogue = [
    {
      speaker: 'candidate',
      stage: 'part1',
      text: 'Well, to be honest, I am currently navigating my final year at university. While it is true that academic pressure can be daunting, I believe perseverance plays a pivotal role in achieving professional success.',
      durationSec: 16
    },
    {
      speaker: 'candidate',
      stage: 'part2',
      text: p2Speech,
      durationSec: 68
    },
    {
      speaker: 'candidate',
      stage: 'part3',
      text: 'From a broader societal perspective, technological advancement exerts a profound influence on daily interactions. While critics argue that screen time induces isolation, individuals must weigh the pros and cons in order to strike a balance between virtual connectivity and authentic human bonds. Furthermore, education plays a vital role in guiding digital consumption.',
      durationSec: 25
    }
  ];

  const res = evaluateSpeakingAlgorithmically({
    dialogueHistory: advancedDialogue,
    totalDurationSec: 300
  });

  assert.ok(res.overallBand >= 7.5, `High performing candidate should achieve Band >= 7.5, got ${res.overallBand}`);
  assert.ok(res.criteria.lr.matchedCollocations.length >= 3, 'Should identify multiple C1 collocations');
  assert.ok(res.criteria.gra.complexConnectors >= 3, 'Should detect complex connectors');
  assert.strictEqual(res.criteria.gra.detectedSlips.length, 0, 'No grammar slips should be detected');
});

// ============================================================================
// 5. SINGLE PRACTICE QUESTION EVALUATION (PRACTICE MODE)
// ============================================================================
it('evaluateSinglePracticeAnswerAlgorithmically should evaluate Part 1 practice with A.R.E feedback', () => {
  const p1Answer = evaluateSinglePracticeAnswerAlgorithmically({
    part: 1,
    topicTitle: 'Reading Habits',
    questionText: 'Do you enjoy reading books?',
    candidateTranscript: 'To be completely honest, I am deeply passionate about reading historical literature because it offers an invaluable avenue to broaden my personal horizons after intense study hours.',
    durationSec: 16
  });

  assert.strictEqual(p1Answer.evaluationMethod, 'algorithmic');
  assert.ok(p1Answer.overallBand >= 7.0, `Band should be >= 7.0, got ${p1Answer.overallBand}`);
  assert.ok(p1Answer.criteria.fc.band >= 7.0);
  assert.ok(p1Answer.criteria.lr.matchedCollocations.length >= 1);
  assert.ok(p1Answer.upgradedBand8.includes('broaden my personal horizons'));
  assert.ok(Array.isArray(p1Answer.goldenCollocations) && p1Answer.goldenCollocations.length > 0);
});

it('evaluateSinglePracticeAnswerAlgorithmically should enforce Part 1 brief answer penalty (< 15 words)', () => {
  const briefP1 = evaluateSinglePracticeAnswerAlgorithmically({
    part: 1,
    topicTitle: 'Sports',
    questionText: 'Do you play any sports?',
    candidateTranscript: 'Yes, I usually play football with my friends every Sunday afternoon.',
    durationSec: 6
  });

  // 11 words -> below 15 words threshold
  assert.ok(briefP1.criteria.fc.band <= 5.5, `Brief P1 should be capped at 5.5, got ${briefP1.criteria.fc.band}`);
  assert.ok(briefP1.criteria.fc.feedback.includes('< 15 từ'));
});

it('evaluateSinglePracticeAnswerAlgorithmically should execute with sub-15ms performance', () => {
  const testText = 'From my perspective, sustainable development is an integral component of urban planning because it exerts a profound influence on environmental preservation for future generations.';
  const start = Date.now();
  for (let i = 0; i < 50; i++) {
    evaluateSinglePracticeAnswerAlgorithmically({
      part: 3,
      topicTitle: 'Environment',
      questionText: 'How can cities become greener?',
      candidateTranscript: testText,
      durationSec: 20
    });
  }
  const totalElapsed = Date.now() - start;
  const avgPerRun = totalElapsed / 50;
  console.log(`     ⚡ Performance: 50 evaluations took ${totalElapsed}ms (Average: ${avgPerRun.toFixed(2)}ms per evaluation)`);
  assert.ok(avgPerRun < 15, `Each evaluation should run under 15ms, took ${avgPerRun}ms`);
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log(`\nAll ${testsPassed}/${testsPassed} Step 24 tests passed successfully!\n`);
