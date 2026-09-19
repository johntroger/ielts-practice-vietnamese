import {
  roundToIeltsBand,
  analyzeFluencyAndCoherence,
  analyzeLexicalResource,
  analyzeGrammaticalRangeAndAccuracy,
  analyzePronunciationCadence,
  evaluateSpeakingAlgorithmically
} from '../src/services/algorithmicSpeakingService.js';

console.log('====================================================');
console.log('TEST SUITE: STEP 2 - CAMBRIDGE SPEAKING ALGORITHMIC ENGINE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Details: ${details}`);
  }
}

// ----------------------------------------------------
// TEST 1: WPM & Speech Cadence Analysis
// ----------------------------------------------------
console.log('--- 1. Testing WPM & Speech Cadence ---');

// Case 1.1: Natural fluent speed (140 WPM)
const fluentTurns = [
  {
    speaker: 'candidate',
    stage: 'part1',
    durationSec: 12,
    text: 'Well to be honest I am genuinely passionate about environmental science primarily because it allows me to understand complex ecological mechanisms and make meaningful contributions to conservation.'
  }
];
const fcFluent = analyzeFluencyAndCoherence(fluentTurns, 12);
assert(fcFluent.wordsPerMinute >= 120, 'Fluent speaker achieves WPM >= 120 (Got: ' + fcFluent.wordsPerMinute + ' wpm)');
assert(fcFluent.band >= 7.0, 'Fluent speaker achieves Band 7.0+ FC (Got: ' + fcFluent.band + ')');

// Case 1.2: Slow halting speech (60 WPM)
const slowTurns = [
  {
    speaker: 'candidate',
    stage: 'part1',
    durationSec: 30,
    text: 'Yes I like books very much it is good.'
  }
];
const fcSlow = analyzeFluencyAndCoherence(slowTurns, 30);
assert(fcSlow.wordsPerMinute < 85, 'Slow speaker WPM < 85 (Got: ' + fcSlow.wordsPerMinute + ' wpm)');
assert(fcSlow.band <= 5.0, 'Slow speaker FC capped at Band 5.0 max (Got: ' + fcSlow.band + ')');

// ----------------------------------------------------
// TEST 2: Filler Words & Hesitation Density Penalty
// ----------------------------------------------------
console.log('\n--- 2. Testing Filler Density Penalties ---');

const fillerHeavyTurns = [
  {
    speaker: 'candidate',
    stage: 'part1',
    durationSec: 60,
    text: 'Um well like I think that uh technology is like really good you know and um we use like phones every day and uh like it is um very convenient you know sort of thing.'
  }
];
const fcFillers = analyzeFluencyAndCoherence(fillerHeavyTurns, 60);
assert(fcFillers.fillerWordsCount >= 8, 'Detects >= 8 filler words (Got: ' + fcFillers.fillerWordsCount + ')');
assert(fcFillers.fillerDensityPercent > 10, 'Detects filler density > 10% (Got: ' + fcFillers.fillerDensityPercent + '%)');
assert(fcFillers.band <= 5.0, 'Excessive filler density (>10%) strictly caps FC at Band 5.0 max (Got: ' + fcFillers.band + ')');
assert(fcFillers.weaknesses.includes('Mật độ từ đệm'), 'Weakness statement explicitly flags filler density');

// ----------------------------------------------------
// TEST 3: Part 2 Timing Hard Caps (< 60s caps at 5.0, 60-90s caps at 6.0)
// ----------------------------------------------------
console.log('\n--- 3. Testing Part 2 Cue Card Timing Compliance ---');

// Case 3.1: Candidate stops at 45 seconds (< 60s)
const p2TooShortTurns = [
  {
    speaker: 'candidate',
    stage: 'part2',
    durationSec: 45,
    text: 'I would like to talk about a trip I went to Da Nang last year with my friends. We went to the beach and ate seafood. It was fun and I liked it.'
  }
];
const fcP2Short = analyzeFluencyAndCoherence(p2TooShortTurns, 45);
assert(fcP2Short.p2DurationSec < 60, 'Part 2 duration recognized as < 60s (Got: ' + fcP2Short.p2DurationSec + 's)');
assert(fcP2Short.band <= 5.0, 'Part 2 speaking < 60s strictly caps Fluency at Band 5.0 max (Got: ' + fcP2Short.band + ')');

// Case 3.2: Candidate stops at 75 seconds (60s - 90s)
const p2UnderdevelopedTurns = [
  {
    speaker: 'candidate',
    stage: 'part2',
    durationSec: 75,
    text: 'I would like to talk about a journey that left an impression on me. It happened two years ago when I traveled to Japan with my family. We visited historic shrines in Kyoto and experienced the local culture. The scenery was breathtaking and people were very hospitable. We had a wonderful time together.'
  }
];
const fcP2Mid = analyzeFluencyAndCoherence(p2UnderdevelopedTurns, 75);
assert(fcP2Mid.band <= 6.0, 'Part 2 speaking 60-90s capped at Band 6.0 max (Got: ' + fcP2Mid.band + ')');

// Case 3.3: Ideal 110s timing (105s - 120s)
const p2IdealTurns = [
  {
    speaker: 'candidate',
    stage: 'part2',
    durationSec: 110,
    text: 'To begin with, I would like to dwell upon an experience that left an indelible impression on me. It took place back when I was navigating through my university years. At that time, I embarked on a solo expedition to the mountainous region of Sapa. What struck me most was how the indigenous communities lived in harmonious coexistence with nature despite challenging conditions. Having said that, the trek was remarkably strenuous, yet it taught me resilience and mental fortitude. In addition, interacting with local ethnic minority elders provided me with profound insights into their rich cultural heritage and folklore. When unexpected torrential rain hit along the mountain ridge, I had to rely on my own navigation skills, which pushed me far beyond my comfort zone. Looking back, this transformative journey not only broadened my horizons but also catalyzed novel personal aspirations that remain with me to this day. On top of that, it gave me a fresh perspective on cultural preservation. All in all, this unforgettable expedition was truly a watershed moment in my personal growth.'
  }
];
const fcP2Ideal = analyzeFluencyAndCoherence(p2IdealTurns, 110);
assert(fcP2Ideal.band >= 7.5, 'Part 2 speaking 110s with mature markers achieves Band 7.5+ FC (Got: ' + fcP2Ideal.band + ')');

// ----------------------------------------------------
// TEST 4: Lexical Resource & Spoken Collocations
// ----------------------------------------------------
console.log('\n--- 4. Testing Lexical Resource & Spoken Collocations ---');

const advancedLRTurns = [
  {
    speaker: 'candidate',
    stage: 'part3',
    text: 'From a broader perspective, technological innovations play a pivotal role in modern education. Furthermore, educators must weigh the pros and cons to strike a balance between digital learning and traditional classroom pedagogy.'
  }
];
const lrResult = analyzeLexicalResource(advancedLRTurns);
assert(lrResult.matchedCollocations.length >= 2, 'Detects >= 2 Cambridge C1/C2 collocations (Got: ' + lrResult.matchedCollocations.length + ')');
assert(lrResult.band >= 7.0, 'Advanced collocations achieve Band 7.0+ LR (Got: ' + lrResult.band + ')');

// ----------------------------------------------------
// TEST 5: Grammatical Range & Past Tense Consistency
// ----------------------------------------------------
console.log('\n--- 5. Testing GRA & Past Tense Consistency in Part 2 ---');

// Narrative prompt: "Describe a time when you visited a foreign city"
const pastMockPack = {
  part2Card: { title: 'Describe a time when you visited a foreign city' }
};

// Faulty past cue card: Candidate uses present tense verbs for a past event
const faultyPastTurns = [
  {
    speaker: 'candidate',
    stage: 'part2',
    text: 'I talk about my trip. I go to Paris and I see the Eiffel Tower. I visit museums and I feel very happy. I buy souvenirs and I spend a lot of money.'
  }
];
const graFaulty = analyzeGrammaticalRangeAndAccuracy(faultyPastTurns, pastMockPack);
assert(graFaulty.pastTenseInconsistency === true, 'Flags past tense inconsistency when candidate narrates past event in present tense');
assert(graFaulty.band <= 5.5, 'GRA is capped at Band 5.5 max due to past tense failure (Got: ' + graFaulty.band + ')');

// Accurate past cue card
const accuratePastTurns = [
  {
    speaker: 'candidate',
    stage: 'part2',
    text: 'I would like to talk about a memorable vacation. Last summer, I traveled to Paris where I visited the Eiffel Tower. Although the queues were exceptionally long, I thoroughly enjoyed the panoramic cityscape because the weather was pleasant.'
  }
];
const graAccurate = analyzeGrammaticalRangeAndAccuracy(accuratePastTurns, pastMockPack);
assert(graAccurate.pastTenseInconsistency === false, 'Accurate past verbs pass consistency check');
assert(graAccurate.complexConnectors >= 2, 'Detects complex connectors (where, although, because)');

// ----------------------------------------------------
// TEST 6: Full Exam Master Evaluation & Schema Integrity
// ----------------------------------------------------
console.log('\n--- 6. Testing Master Algorithmic Speaking Evaluation ---');

const fullMockHistory = [
  { speaker: 'examiner', stage: 'greeting', text: 'Good morning, can you tell me your full name please?' },
  { speaker: 'candidate', stage: 'greeting', text: 'Good morning, my name is Linh Nguyen and you can call me Linh.' },
  { speaker: 'examiner', stage: 'part1', text: 'Do you enjoy traveling?' },
  { speaker: 'candidate', stage: 'part1', durationSec: 12, text: 'Well, to be honest, I am genuinely passionate about traveling because it provides an invaluable opportunity to unwind and broaden my horizons.' },
  { speaker: 'examiner', stage: 'part2', text: 'Now you have one minute to prepare your cue card.' },
  { speaker: 'candidate', stage: 'part2', durationSec: 110, text: 'To begin with, I would like to dwell upon an experience that left an indelible impression on me. It took place back when I was navigating through my university years. At that time, I embarked on a solo expedition to the mountainous region of Sapa. What struck me most was how the indigenous communities lived in harmonious coexistence with nature despite challenging conditions. Having said that, the trek was remarkably strenuous, yet it taught me resilience and mental fortitude. In addition, interacting with local ethnic minority elders provided me with profound insights into their rich cultural heritage and folklore. When unexpected torrential rain hit along the mountain ridge, I had to rely on my own navigation skills, which pushed me far beyond my comfort zone. Looking back, this transformative journey not only broadened my horizons but also catalyzed novel personal aspirations that remain with me to this day. On top of that, it gave me a fresh perspective on cultural preservation. All in all, this unforgettable expedition was truly a watershed moment in my personal growth.' },
  { speaker: 'examiner', stage: 'part3', text: 'How does tourism impact local communities?' },
  { speaker: 'candidate', stage: 'part3', durationSec: 18, text: 'Looking at it from a broader perspective, international tourism undeniably exerts a profound influence on local economies by generating employment; however, governments must carefully weigh the pros and cons to strike a balance between commerce and environmental protection.' }
];

const mockPackFull = {
  title: 'Full Mock Test: Cultural Heritage & Tourism',
  part2Card: { title: 'Describe a time when you visited a historical city' }
};

const fullEval = evaluateSpeakingAlgorithmically({
  dialogueHistory: fullMockHistory,
  mockPack: mockPackFull,
  examiner: { name: 'Dr. Michael Davies', accent: 'British' },
  totalDurationSec: 300
});

assert(fullEval.evaluationMethod === 'algorithmic', 'evaluationMethod is "algorithmic"');
assert(typeof fullEval.overallBand === 'number' && fullEval.overallBand >= 7.5, 'High-performing candidate achieves Band 7.5+ (Got: ' + fullEval.overallBand + ')');
assert(fullEval.criteria.fc && fullEval.criteria.lr && fullEval.criteria.gra && fullEval.criteria.pr, 'Contains all 4 Cambridge criteria (FC, LR, GRA, PR)');
assert(fullEval.speechAnalytics.wordsPerMinute > 100, 'Speech analytics calculates WPM: ' + fullEval.speechAnalytics.wordsPerMinute);
assert(fullEval.top3ActionPlan.priority1 && fullEval.top3ActionPlan.priority2, 'Generates Action Plan Top 3 priorities');
assert(Array.isArray(fullEval.turnEvaluations) && fullEval.turnEvaluations.length >= 3, 'Generates per-turn feedback for candidate responses');

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
