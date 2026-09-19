/**
 * Test Suite: Step 5 - Full Writing Mock Exam Simulation (60 min)
 * & Official Cambridge Weighted Band Calculation ((T1 * 1 + T2 * 2) / 3)
 */

import { 
  calculateOverallWritingBand, 
  evaluateWritingMockExam,
  roundToCambridgeBand
} from '../src/services/algorithmicEvaluationService.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('TEST SUITE: STEP 5 - FULL WRITING MOCK EXAM & CAMBRIDGE BAND');
console.log('====================================================\n');

// -------------------------------------------------------------
// 1. CAMBRIDGE WEIGHTED BAND FORMULA TESTS
// -------------------------------------------------------------
console.log('--- 1. Cambridge Weighted Band Formula: (T1 * 1 + T2 * 2) / 3 ---');

// Test 1.1: Identical bands
const res1 = calculateOverallWritingBand(6.0, 6.0);
assert(res1.overallBand === 6.0, `T1=6.0, T2=6.0 -> Overall should be 6.0 (got ${res1.overallBand})`);
assert(res1.rawWeighted === 6.0, `Raw weighted should be 6.0 (got ${res1.rawWeighted})`);
assert(res1.cefrLevel === 'B2', `CEFR should be B2 for Band 6.0 (got ${res1.cefrLevel})`);

// Test 1.2: T1=6.5, T2=7.0 -> (6.5 + 14)/3 = 20.5/3 = 6.833... -> 7.0
const res2 = calculateOverallWritingBand(6.5, 7.0);
assert(res2.overallBand === 7.0, `T1=6.5, T2=7.0 -> Overall should be 7.0 (got ${res2.overallBand})`);
assert(res2.cefrLevel === 'C1', `CEFR should be C1 for Band 7.0 (got ${res2.cefrLevel})`);

// Test 1.3: T1=7.0, T2=6.0 -> (7.0 + 12)/3 = 19/3 = 6.333... -> 6.5
const res3 = calculateOverallWritingBand(7.0, 6.0);
assert(res3.overallBand === 6.5, `T1=7.0, T2=6.0 -> Overall should be 6.5 (got ${res3.overallBand})`);

// Test 1.4: T1=5.0, T2=6.5 -> (5.0 + 13)/3 = 18/3 = 6.0 -> 6.0
const res4 = calculateOverallWritingBand(5.0, 6.5);
assert(res4.overallBand === 6.0, `T1=5.0, T2=6.5 -> Overall should be 6.0 (got ${res4.overallBand})`);

// Test 1.5: T1=6.0, T2=6.5 -> (6.0 + 13)/3 = 19/3 = 6.333... -> 6.5
const res5 = calculateOverallWritingBand(6.0, 6.5);
assert(res5.overallBand === 6.5, `T1=6.0, T2=6.5 -> Overall should be 6.5 (got ${res5.overallBand})`);

// Test 1.6: T1=8.0, T2=8.5 -> (8.0 + 17)/3 = 25/3 = 8.333... -> 8.5
const res6 = calculateOverallWritingBand(8.0, 8.5);
assert(res6.overallBand === 8.5, `T1=8.0, T2=8.5 -> Overall should be 8.5 (got ${res6.overallBand})`);
assert(res6.cefrLevel === 'C2', `CEFR should be C2 for Band 8.5 (got ${res6.cefrLevel})`);

// Test 1.7: T1=8.5, T2=9.0 -> (8.5 + 18)/3 = 26.5/3 = 8.833... -> 9.0
const res7 = calculateOverallWritingBand(8.5, 9.0);
assert(res7.overallBand === 9.0, `T1=8.5, T2=9.0 -> Overall should be 9.0 (got ${res7.overallBand})`);

// Test 1.8: Blank Task 1 (T1=1.0, T2=7.0) -> (1.0 + 14)/3 = 15/3 = 5.0
const res8 = calculateOverallWritingBand(1.0, 7.0);
assert(res8.overallBand === 5.0, `T1=1.0, T2=7.0 -> Overall should be 5.0 (got ${res8.overallBand})`);

// Test 1.9: Blank Task 2 (T1=7.0, T2=1.0) -> (7.0 + 2)/3 = 9/3 = 3.0
const res9 = calculateOverallWritingBand(7.0, 1.0);
assert(res9.overallBand === 3.0, `T1=7.0, T2=1.0 -> Overall should be 3.0 (got ${res9.overallBand})`);

// Test 1.10: String inputs conversion
const res10 = calculateOverallWritingBand('6.5', '7.5');
assert(res10.overallBand === 7.0, `String inputs '6.5' and '7.5' -> (6.5 + 15)/3 = 7.166... -> 7.0 (got ${res10.overallBand})`);

// -------------------------------------------------------------
// 2. CAMBRIDGE ROUNDING EDGE CASES
// -------------------------------------------------------------
console.log('\n--- 2. Cambridge Rounding Edge Cases (<0.25, 0.25-0.75, >=0.75) ---');

assert(roundToCambridgeBand(6.125) === 6.0, '6.125 (< 0.25) -> rounds down to 6.0');
assert(roundToCambridgeBand(6.249) === 6.0, '6.249 (< 0.25) -> rounds down to 6.0');
assert(roundToCambridgeBand(6.25) === 6.5, '6.25 (= 0.25) -> rounds up to 6.5');
assert(roundToCambridgeBand(6.375) === 6.5, '6.375 (between 0.25 and 0.75) -> 6.5');
assert(roundToCambridgeBand(6.749) === 6.5, '6.749 (< 0.75) -> 6.5');
assert(roundToCambridgeBand(6.75) === 7.0, '6.75 (= 0.75) -> rounds up to 7.0');
assert(roundToCambridgeBand(6.875) === 7.0, '6.875 (>= 0.75) -> rounds up to 7.0');
assert(roundToCambridgeBand(9.5) === 9.0, 'Score > 9.0 is clamped to 9.0');
assert(roundToCambridgeBand(0.5) === 1.0, 'Score < 1.0 is clamped to 1.0');

// -------------------------------------------------------------
// 3. FULL WRITING MOCK EXAM EVALUATOR (Dual Task Pipeline)
// -------------------------------------------------------------
console.log('\n--- 3. Full Writing Mock Exam Evaluator Integration ---');

const mockTask1 = {
  id: 'mock-t1-chart',
  title: 'Internet Usage by Age Group (2010-2020)',
  taskNumber: 1,
  type: 'chart',
  prompt: 'The chart illustrates the percentage of individuals across three distinct age brackets who accessed the Internet on a daily basis from 2010 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
};

const mockTask1Essay = `The line graph delineates the proportion of people in three different age cohorts utilizing the Internet daily between 2010 and 2020.

Overall, it is readily apparent that daily online engagement exhibited an upward trajectory across all demographics. Furthermore, younger adults consistently demonstrated the most substantial usage throughout the entire surveyed timeframe.

In 2010, the figure for individuals aged 18-34 commenced at approximately 60%, whereas the corresponding metric for the 35-54 age bracket was significantly lower, standing at 40%. The percentage of elderly users accounted for just under 20%. Over the ensuing five years, online access for young adults ascended steadily to roughly 85%, outstripping older cohorts by a considerable margin.

By contrast, the senior demographic experienced notable expansion from 2015 onwards, culminating in 45% by the end of the period. Similarly, the middle-aged cohort climbed progressively to reach a plateau of 75% in 2020, compared with nearly 95% recorded for the youngest category.`;

const mockTask2 = {
  id: 'mock-t2-essay',
  title: 'Remote Working and Society',
  taskNumber: 2,
  prompt: 'Some people argue that technological developments enable more individuals to work remotely from home, which benefits both employees and society as a whole. To what extent do you agree or disagree with this statement?'
};

const mockTask2Essay = `It is widely asserted that recent technological breakthroughs facilitate remote employment, thereby yielding substantial dividends for both individual workers and the wider community. From my perspective, I entirely concur with this assertion, as telecommuting optimizes work-life equilibrium, diminishes urban traffic congestion, and fosters widespread economic decentralization.

On the one hand, teleworking confers immense personal benefits upon modern professionals. By eliminating onerous daily commutes on crowded highways or mass transit, individuals can preserve several hours each working day, which can subsequently be allocated to physical well-being, familial bonding, and continuous personal development. For instance, recent empirical studies from Stanford University highlight that telecommuters report notably higher job satisfaction and drastically reduced occupational burnout, primarily because flexible scheduling empowers them to operate during their peak productivity windows. Furthermore, decreased transportation expenses and reduced expenditure on formal attire directly augment household disposable income, mitigating daily socioeconomic stress.

On the other hand, widespread remote work exerts profoundly positive impacts on society and the natural environment. When considerable proportions of the national labor force operate from domestic workstations, vehicular volume on major urban thoroughfares drops markedly, leading to diminished carbon emissions and cleaner atmospheric quality in densely populated metropolitan centers. Additionally, corporate enterprises can downsize exorbitant commercial office premises, allowing municipal authorities to repurpose vacant commercial complexes into affordable residential zones or communal green parks. This structural demographic decentralization also revitalizes peripheral rural areas as workers relocate away from hyper-congested cities.

In conclusion, I firmly maintain that remote employment presents tremendous advantages for both workers and macroscopic societal infrastructure. Governments and corporate leadership should proactively collaborate to cultivate robust digital infrastructure and progressive regulatory frameworks that support flexible remote working models sustainably.`;

const mockResult = evaluateWritingMockExam({
  task1: mockTask1,
  task1Text: mockTask1Essay,
  task2: mockTask2,
  task2Text: mockTask2Essay,
  timeSpentSeconds: 3200
});

assert(mockResult.t1Band >= 6.0, `Mock Task 1 should achieve Band 6.0+ (got ${mockResult.t1Band})`);
assert(mockResult.t2Band >= 6.5, `Mock Task 2 should achieve Band 6.5+ (got ${mockResult.t2Band})`);
assert(mockResult.t1Words >= 150, `Mock Task 1 word count should be >= 150 (got ${mockResult.t1Words})`);
assert(mockResult.t2Words >= 250, `Mock Task 2 word count should be >= 250 (got ${mockResult.t2Words})`);
assert(mockResult.totalWords >= 400, `Total words should be >= 400 (got ${mockResult.totalWords})`);

// Verify Cambridge formula consistency
const expectedWeighted = (mockResult.t1Band * 1 + mockResult.t2Band * 2) / 3;
const expectedRounded = roundToCambridgeBand(expectedWeighted);
assert(mockResult.finalOverall === expectedRounded, `Final Overall Band matches Cambridge weighted rounding: ${expectedRounded} (got ${mockResult.finalOverall})`);
assert(mockResult.weightingFormula.includes('Task 1 × 1') && mockResult.weightingFormula.includes('Task 2 × 2'), 'Report contains official Cambridge weighting formula specification');
assert(typeof mockResult.pacingFeedback === 'string' && mockResult.pacingFeedback.length > 10, 'Pacing feedback generated');
assert(mockResult.executiveSummary && mockResult.executiveSummary.strongerTask, 'Executive summary includes stronger task identification');
assert(mockResult.eval1 && mockResult.eval1.criteria && mockResult.eval1.criteria.tr, 'Task 1 evaluation details populated');
assert(mockResult.eval2 && mockResult.eval2.criteria && mockResult.eval2.criteria.tr, 'Task 2 evaluation details populated');

// -------------------------------------------------------------
// 4. MAP & PROCESS INTEGRATION IN MOCK EXAM
// -------------------------------------------------------------
console.log('\n--- 4. Task 1 Map & Process Mock Exam Integration ---');

const mockMapTask = {
  id: 'mock-t1-map',
  title: 'Norbury Town Industrial Transformation',
  taskNumber: 1,
  type: 'map',
  prompt: 'The two maps show the village of Norbury in 1980 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
};

const mockMapEssay = `The two maps illustrate the extensive infrastructural and commercial changes that took place in Norbury between 1980 and 2020.

Overall, it is immediately evident that Norbury was transformed from a predominantly rural, agricultural village into a modern residential and commercial hub. The expansion of residential facilities and transport links represents the most prominent development.

In the northern section of the town, farmland was completely demolished and replaced by a large residential estate consisting of modern housing. To the east of the central river, a new bridge was constructed to improve connectivity. Furthermore, the old school located in the western quadrant was significantly enlarged to accommodate more students.

Regarding the southern part of the map, the industrial factories that existed in 1980 were cleared to make way for a spacious supermarket with an adjacent parking lot. Meanwhile, the woodland in the southeastern corner was partially preserved, though several trees were chopped down for residential infrastructure.`;

const mockMapResult = evaluateWritingMockExam({
  task1: mockMapTask,
  task1Text: mockMapEssay,
  task2: mockTask2,
  task2Text: mockTask2Essay,
  timeSpentSeconds: 3400
});

assert(mockMapResult.eval1.task1Subtype === 'map', `Task 1 subtype in mock exam correctly detected as 'map' (got ${mockMapResult.eval1.task1Subtype})`);
assert(mockMapResult.eval1.task1MapStats && mockMapResult.eval1.task1MapStats.transformationCount >= 3, 'Map transformation features analyzed in mock exam');
assert(mockMapResult.eval1.task1MapStats && mockMapResult.eval1.task1MapStats.cardinalCount >= 2, 'Map cardinal directions analyzed in mock exam');
assert(mockMapResult.t1Band >= 6.5, `Task 1 Map in mock exam achieves Band 6.5+ (got ${mockMapResult.t1Band})`);

// -------------------------------------------------------------
// 5. UNDERLENGTH & PACING SAFEGUARD TESTS
// -------------------------------------------------------------
console.log('\n--- 5. Underlength and Pacing Diagnostics in Mock Exam ---');

const underlengthResult = evaluateWritingMockExam({
  task1: mockTask1,
  task1Text: 'This is a very short report with only a few words.',
  task2: mockTask2,
  task2Text: 'This is an unfinished essay because time ran out before the candidate could develop ideas.',
  timeSpentSeconds: 1200 // 20 mins
});

assert(underlengthResult.t1Words < 50, `T1 underlength detected: ${underlengthResult.t1Words} words`);
assert(underlengthResult.t2Words < 50, `T2 underlength detected: ${underlengthResult.t2Words} words`);
assert(underlengthResult.t1Band <= 2.0, `T1 underlength severely penalized: ${underlengthResult.t1Band}`);
assert(underlengthResult.t2Band <= 2.0, `T2 underlength severely penalized: ${underlengthResult.t2Band}`);
assert(underlengthResult.finalOverall <= 2.0, `Combined overall band penalized down to ${underlengthResult.finalOverall}`);
assert(underlengthResult.pacingFeedback.includes('tiêu chuẩn 60 phút'), 'Pacing warning triggers for premature submission with underlength essays');

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${totalTests - passedTests}`);
console.log('====================================================');
