import { evaluateEssayAlgorithmically, analyzeHedgingAndOvergeneralisation } from '../src/services/algorithmicEvaluationService.js';

console.log('====================================================');
console.log('TEST SUITE: STEP 8 - HEDGING & OVERGENERALISATION ENGINE');
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
// TEST 1: Unit Tests - Hedging Detection
// ----------------------------------------------------
console.log('--- 1. Testing Hedging / Tentative Language Detection ---');

const hedgingSentences = [
  'This innovative policy may lead to unintended economic ramifications.',
  'Adopting renewable energy could contribute significantly to emissions reduction.',
  'Younger generations tend to consume information via digital channels.',
  'The current approach appears to be increasingly ineffective.',
  'Densely populated metropolitan centers are likely to experience infrastructural strain.',
  'Technological automation is arguably the most transformative catalyst of our era.',
  'Empirical research suggests that early childhood intervention fosters cognitive resilience.',
  'It can be argued that public transport should be heavily subsidized.'
];

const hedgingResult = analyzeHedgingAndOvergeneralisation([], hedgingSentences, false);

assert(
  hedgingResult.hedgingCount >= 8,
  'All 8 academic hedging structures correctly detected',
  `Detected count: ${hedgingResult.hedgingCount} / 8`
);

// ----------------------------------------------------
// TEST 2: Unit Tests - Overgeneralisation Detection
// ----------------------------------------------------
console.log('\n--- 2. Testing Overgeneralisation / Sweeping Claims Detection ---');

const overgenSentences = [
  'Everyone knows that modern smartphones destroy social cohesion entirely.',
  'All citizens always disobey environmental regulations without strict fines.',
  'This single governmental measure will definitely ruin the local economy.',
  'There is no doubt whatsoever that artificial intelligence is evil.',
  'The only solution to global warming is completely banning fossil fuels.',
  'One hundred percent of students fail when teachers use modern technology.'
];

const overgenResult = analyzeHedgingAndOvergeneralisation([], overgenSentences, false);

assert(
  overgenResult.overgeneralisationCount >= 6,
  'All 6 overgeneralised statements detected',
  `Detected count: ${overgenResult.overgeneralisationCount} / 6. Detected: ${JSON.stringify(overgenResult.overgeneralisedStatements.map(s => s.match))}`
);

// ----------------------------------------------------
// TEST 3: Safeguards - Negative Qualifications / Legitimate Academic Contexts
// ----------------------------------------------------
console.log('\n--- 3. Testing Safeguards (Negatively Qualified Statements) ---');

const qualifiedSentences = [
  'This does not mean that everyone will agree with the newly enacted guidelines.',
  'Not all students perform equally well in standardized examinations.',
  'One cannot simply assume that all citizens support the taxation increase.',
  'It is never the case that everybody shares identical priorities.'
];

const qualifiedResult = analyzeHedgingAndOvergeneralisation([], qualifiedSentences, false);

assert(
  qualifiedResult.overgeneralisationCount === 0,
  'Negatively qualified statements correctly spared from overgeneralisation penalty',
  `Expected 0 overgeneralisations, got: ${qualifiedResult.overgeneralisationCount} (${JSON.stringify(qualifiedResult.overgeneralisedStatements.map(s => s.match))})`
);

// ----------------------------------------------------
// TEST 4: Task 1 Exemption Test
// ----------------------------------------------------
console.log('\n--- 4. Testing Task 1 Exemption (Factual Reporting) ---');

const task1Sentences = [
  'Everyone knows that the percentage increased sharply between 2000 and 2010.',
  'This will definitely lead to higher figures in the subsequent period.'
];

const task1Result = analyzeHedgingAndOvergeneralisation([], task1Sentences, true);

assert(
  task1Result.overgeneralisationCount === 0 && task1Result.hedgingCount === 0,
  'Task 1 reports are exempted from Task 2 Hedging/Overgeneralisation logic',
  `Expected 0, got hedging: ${task1Result.hedgingCount}, overgeneralisation: ${task1Result.overgeneralisationCount}`
);

// ----------------------------------------------------
// TEST 5: Integration Test - Band 8+ Essay with Mature Hedging
// ----------------------------------------------------
console.log('\n--- 5. Integration Test: High-Band Academic Essay with Mature Hedging ---');

const matureHedgingEssay = `
In contemporary discourse, the proliferation of digital automation within corporate infrastructures has elicited considerable debate. While detractors express grave apprehension regarding widespread workforce displacement, proponents contend that technological advancement fosters unprecedented economic opportunities. In my perspective, although mechanisation inevitably presents short-term structural disruption, it is likely to generate substantial socio-economic dividends when accompanied by proactive vocational retraining.

On the one hand, critics argue that algorithmic systems tend to jeopardize conventional occupations. As machine learning models and robotic automation achieve human-level proficiency in analytical and physical tasks, traditional clerical and manufacturing jobs appear to be increasingly susceptible to obsolescence. For instance, in automated logistics hubs, autonomous vehicles and robotic sorting systems have largely replaced manual handlers. Consequently, without timely interventions, such structural shifts may lead to protracted unemployment among vulnerable demographics.

On the other hand, it can be argued that historical precedents demonstrate the economy's innate propensity to cultivate novel employment sectors following technological transitions. Empirical research suggests that automated workflows not only curtail logistical inaccuracies but also permit human personnel to direct their intellectual capital toward innovative conceptualisation. Furthermore, nascent industries such as artificial intelligence engineering, cyber defense, and data curation are likely to expand exponentially. Therefore, modern automation predominantly serves as a catalyst for high-skilled job creation rather than perpetual deprivation.

In conclusion, while digital transformation undoubtedly induces transitional labor market friction, it tends to elevate macroeconomic complexity and cultivate diverse vocational horizons. Provided that educational institutions and governments collaborate effectively, technological progress will conceivably enrich human society as a whole.
`.trim();

const matureEval = evaluateEssayAlgorithmically({
  task: {
    type: 'TASK_2',
    prompt: 'Some people think that digital automation will lead to high unemployment, while others believe it creates new opportunities. Discuss both views and give your opinion.'
  },
  essayText: matureHedgingEssay
});

assert(
  matureEval.hedgingStats.hedgingCount >= 3,
  'Mature essay has hedgingCount >= 3',
  `Hedging count: ${matureEval.hedgingStats.hedgingCount} (matches: ${matureEval.hedgingStats.matchedHedging.join(', ')})`
);

assert(
  matureEval.hedgingStats.hasOvergeneralisation === false,
  'Mature essay has zero overgeneralisations',
  `Overgeneralisation count: ${matureEval.hedgingStats.overgeneralisationCount}`
);

assert(
  matureEval.criteria.tr.band >= 7.5,
  'Mature essay achieves Band 7.5+ in Task Response',
  `TR score: ${matureEval.criteria.tr.band}`
);

const hasHedgingStrength = matureEval.criteria.tr.strengths.some(s => s.includes('Academic Hedging') || s.includes('ngôn ngữ dè dặt'));
assert(
  hasHedgingStrength,
  'Examiner explicitly praises Academic Hedging in Task Response strengths',
  `Strengths: ${JSON.stringify(matureEval.criteria.tr.strengths)}`
);

// ----------------------------------------------------
// TEST 6: Integration Test - Overgeneralisation Trap (Caps TR at max Band 6.0)
// ----------------------------------------------------
console.log('\n--- 6. Integration Test: Overgeneralisation Trap (Band 6.0 Cap) ---');

const overgeneralisedEssay = `
In contemporary discourse, the proliferation of digital automation within corporate infrastructures has elicited considerable debate. While some analysts contend that mechanisation fosters unprecedented operational efficiency, detractors express legitimate apprehension regarding workforce displacement. In my perspective, while technological adoption inevitably presents short-term structural challenges, it will definitely solve all economic issues.

To begin with, everyone knows that modern technology destroys human creativity completely. All citizens always disobey company regulations when robots are implemented, which leads to total chaos in the workplace. Furthermore, the only solution to unemployment is completely banning computers from all companies. There is no doubt whatsoever that artificial intelligence will eliminate every single human job in the future.

Furthermore, historical precedents prove this point without any doubt. During the industrial revolution, one hundred percent of workers suffered extreme poverty forever because of machines. No one can ever deny that technological advancements always ruin human civilization and lead to catastrophe.

In conclusion, digital transformation is an absolute disaster for humanity. The government must immediately prohibit all automated technologies to protect citizens.
`.trim();

const overgenEval = evaluateEssayAlgorithmically({
  task: {
    type: 'TASK_2',
    prompt: 'Some people think that digital automation will lead to high unemployment, while others believe it creates new opportunities. Discuss both views and give your opinion.'
  },
  essayText: overgeneralisedEssay
});

assert(
  overgenEval.hedgingStats.hasOvergeneralisation === true,
  'Overgeneralised essay detected hasOvergeneralisation = true',
  `Overgeneralisation count: ${overgenEval.hedgingStats.overgeneralisationCount}`
);

assert(
  overgenEval.hedgingStats.overgeneralisationCount >= 2,
  'Overgeneralised essay has >= 2 overgeneralisation instances',
  `Count: ${overgenEval.hedgingStats.overgeneralisationCount}`
);

assert(
  overgenEval.criteria.tr.band <= 6.0,
  'Task Response score strictly capped at Band 6.0 max due to overgeneralisation',
  `TR Band: ${overgenEval.criteria.tr.band}`
);

const hasOvergenImprovement = overgenEval.criteria.tr.improvements.some(imp => 
  imp.includes('Overgeneralisation Trap') || imp.includes('BẪY QUY CHỤP TUYỆT ĐỐI')
);
assert(
  hasOvergenImprovement,
  'Examiner TR Improvements contains Overgeneralisation Trap alert',
  `Improvements: ${JSON.stringify(overgenEval.trImprovements)}`
);

const hasActionPlanWarning = overgenEval.actionPlan.priority1.includes('quy chụp') || overgenEval.actionPlan.priority2.includes('quy chụp');
assert(
  hasActionPlanWarning,
  'Examiner Action Plan flags overgeneralisation in Priority 1 or 2',
  `Priority 1: ${overgenEval.actionPlan.priority1} | Priority 2: ${overgenEval.actionPlan.priority2}`
);

const hasStyleCorrections = overgenEval.corrections.some(c => c.type === 'style' && c.explanation.includes('Overgeneralisation'));
assert(
  hasStyleCorrections,
  'Detailed style corrections provide Hedging suggestions for overgeneralised statements',
  `Corrections: ${JSON.stringify(overgenEval.corrections.filter(c => c.type === 'style'))}`
);

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
