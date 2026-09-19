/**
 * Test Suite: Step 9 - Task 1 Overview Gatekeeper & Academic Hedging Inspector
 * Verifies Cambridge Band caps for missing Overview, Overview raw data, and overgeneralisation.
 */

import assert from 'assert';
import { 
  analyzeTask1Overview, 
  extractTask1RawDataPoints,
  analyzeHedgingAndOvergeneralisation,
  evaluateEssayAlgorithmically 
} from '../src/services/algorithmicEvaluationService.js';

console.log('--- TEST STEP 9: TASK 1 OVERVIEW & ACADEMIC HEDGING ---');

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
// 1. TASK 1 OVERVIEW DETECTION & RAW DATA CHECK
// ============================================================================
it('analyzeTask1Overview should detect valid overview without raw data', () => {
  const paragraphs = [
    'The line graph illustrates fast food consumption in the UK between 1990 and 2010.',
    'Overall, it is readily observable that pizza consumption experienced a consistent upward trend, whereas fish and chips saw a marked decline over the surveyed period.',
    'In 1990, fish and chips consumption started at a high level. Subsequently, it decreased steadily.',
    'Conversely, pizza began at a lower volume before climbing significantly towards the end of the timeline.'
  ];

  const res = analyzeTask1Overview(paragraphs);
  assert.strictEqual(res.hasOverview, true);
  assert.strictEqual(res.overviewIndex, 1);
  assert.strictEqual(res.hasRawData, false);
  assert.strictEqual(res.rawDataList.length, 0);
});

it('analyzeTask1Overview should detect raw data penalty when overview contains numerical figures', () => {
  const paragraphs = [
    'The chart illustrates vehicle sales from 2000 to 2020.',
    'Overall, car sales rose dramatically from 40% in 2000 to peak at 85% in 2020, while motorcycle sales dropped to only 15%.',
    'Looking at cars, figures commenced at 40% before outstripping all other transport modes.',
    'Regarding motorcycles, numbers plateaued at 20% before falling.'
  ];

  const res = analyzeTask1Overview(paragraphs);
  assert.strictEqual(res.hasOverview, true);
  assert.strictEqual(res.hasRawData, true);
  assert.ok(res.rawDataList.length >= 2, 'Should capture at least 2 raw figures');
});

it('analyzeTask1Overview should flag missing overview when no overview paragraph or trend sentence exists', () => {
  const paragraphs = [
    'The chart illustrates computer ownership between 2000 and 2010.',
    'In 2000, 30% of households owned a computer compared with 50% in 2005.',
    'By 2010, this proportion climbed to 75%, representing substantial expansion.'
  ];

  const res = analyzeTask1Overview(paragraphs);
  assert.strictEqual(res.hasOverview, false);
  assert.strictEqual(res.overviewIndex, -1);
});

it('extractTask1RawDataPoints should ignore calendar year ranges like 1990 or 2025', () => {
  const text = 'Overall, between 1995 and 2015, renewable energy grew steadily.';
  const rawData = extractTask1RawDataPoints(text);
  assert.strictEqual(rawData.length, 0, 'Calendar years should not be counted as raw statistical data');

  const textWithData = 'Overall, energy output stood at 45 megawatts, representing 60% of total production.';
  const rawData2 = extractTask1RawDataPoints(textWithData);
  assert.ok(rawData2.length >= 2, 'Should extract megawatts and percentage');
});

// ============================================================================
// 2. ACADEMIC HEDGING & OVERGENERALISATION
// ============================================================================
it('analyzeHedgingAndOvergeneralisation should detect tentative academic phrasing', () => {
  const sentences = [
    'Recent research indicates that remote working tends to improve employee retention.',
    'It is arguably the case that technological automation is likely to transform employment markets.',
    'Evidence suggests that students appear to learn more effectively through interactive environments.'
  ];
  const paragraphs = [sentences.join(' ')];

  const res = analyzeHedgingAndOvergeneralisation(paragraphs, sentences, false);
  assert.ok(res.hedgingCount >= 3, `Expected at least 3 hedging structures, found ${res.hedgingCount}`);
  assert.strictEqual(res.overgeneralisationCount, 0);
});

it('analyzeHedgingAndOvergeneralisation should flag extreme overgeneralisations', () => {
  const sentences = [
    'Everyone knows that smoking always causes deadly illnesses in all people.',
    'It is undeniable that computers completely destroy human relationships without exception.'
  ];
  const paragraphs = [sentences.join(' ')];

  const res = analyzeHedgingAndOvergeneralisation(paragraphs, sentences, false);
  assert.ok(res.overgeneralisationCount >= 2, `Expected at least 2 overgeneralisation triggers, found ${res.overgeneralisationCount}`);
});

// ============================================================================
// 3. CAMBRIDGE BAND CEILING ENFORCEMENT
// ============================================================================
it('evaluateEssayAlgorithmic should cap Task 1 at Band 5.0 when Overview is completely missing', () => {
  const prompt = 'The graph below shows the consumption of fast food in the UK from 1990 to 2010.';
  const task = { taskNumber: 1, isTask1: true, prompt, title: 'Fast Food in UK', minWords: 150 };
  
  // High quality body paragraphs with plenty of words and comparisons, but NO Overview
  const essayWithoutOverview = `The provided line graph presents data regarding the consumption of fast food across three distinct categories in the United Kingdom over a twenty-year period between 1990 and 2010.

In 1990, fish and chips was by far the most popular fast food item, commencing at approximately 300 grams per person per week. Over the following decade, this figure witnessed a significant downward trajectory, plummeting to roughly 200 grams in 2000. In stark contrast, pizza consumption commenced at a modest 100 grams, but progressively escalated, outstripping fish and chips by the year 2005.

Regarding hamburgers, initial figures stood at 150 grams per person, before experiencing consistent and substantial expansion throughout the entire timeframe, ultimately reaching a peak of 280 grams in 2010. Compared with alternative choices, this represented a nearly threefold multiplication in popularity over the observed two decades.`;

  const evaluation = evaluateEssayAlgorithmically({ task, essayText: essayWithoutOverview });
  assert.ok(evaluation.criteria.tr.band <= 5.0, `Expected TA band <= 5.0 for missing overview, got ${evaluation.criteria.tr.band}`);
  assert.strictEqual(evaluation.task1OverviewStats.hasOverview, false);
});

it('evaluateEssayAlgorithmically should cap Task 1 at Band 5.5-6.0 when Overview contains raw numerical data', () => {
  const prompt = 'The graph below shows the consumption of fast food in the UK from 1990 to 2010.';
  const task = { taskNumber: 1, isTask1: true, prompt, title: 'Fast Food in UK', minWords: 150 };
  
  // Overview is present, but contaminated with specific data: "300 grams", "100 grams", "280 grams"
  const essayWithContaminatedOverview = `The line graph illustrates fast food consumption in the UK between 1990 and 2010.

Overall, it is clear that hamburgers rose dramatically from 150 grams to peak at 280 grams, while fish and chips dropped from 300 grams to only 180 grams.

In 1990, fish and chips consumption started at a high level. Subsequently, it decreased steadily compared with other options.

Conversely, pizza began at a lower volume of 100 grams before climbing significantly towards the end of the timeline, doubling its original metric.`;

  const evaluation = evaluateEssayAlgorithmically({ task, essayText: essayWithContaminatedOverview });
  assert.ok(evaluation.criteria.tr.band <= 6.0, `Expected TA band <= 6.0 for overview with raw numbers, got ${evaluation.criteria.tr.band}`);
  assert.strictEqual(evaluation.task1OverviewStats.hasOverview, true);
  assert.strictEqual(evaluation.task1OverviewStats.hasRawData, true);
});

it('evaluateEssayAlgorithmically should cap Task 2 at Band 6.0 for extreme overgeneralisations', () => {
  const prompt = 'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?';
  const task = { taskNumber: 2, isTask1: false, prompt, title: 'Community Service', minWords: 250 };

  const essayWithExtremeClaims = `It is often argued that high school students should be required to perform unpaid community service. In my opinion, I completely agree with this proposal because it delivers immense social benefits.

Firstly, everyone knows that teenagers are always selfish. Furthermore, all citizens always agree that mandatory community service always leads to good behavior and guarantees that every single student becomes a moral citizen.

Secondly, no one can deny that this policy will definitely solve the unemployment crisis among young people. It is impossible for any young person to obtain a successful career without volunteering. Therefore, the only solution to solve youth issues is forcing teenagers into public work.

In conclusion, community service should be compulsory because it completely transforms adolescents into productive members of society.`;

  const evaluation = evaluateEssayAlgorithmically({ task, essayText: essayWithExtremeClaims });
  assert.ok(evaluation.criteria.tr.band <= 6.0, `Expected TR band <= 6.0 for extreme overgeneralisations, got ${evaluation.criteria.tr.band}`);
  assert.ok(evaluation.hedgingStats.overgeneralisationCount >= 2);
});

console.log(`\n🎉 ALL ${testsPassed} STEP 9 UNIT TESTS PASSED CLEANLY!`);
