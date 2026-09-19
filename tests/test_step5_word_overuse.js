import { evaluateEssayAlgorithmically, analyzeWordOveruse } from '../src/services/algorithmicEvaluationService.js';
import { lookupTopicCollocations, lookupSynonyms, ACADEMIC_THESAURUS } from '../src/data/academicThesaurus.js';

console.log('====================================================');
console.log('TEST SUITE: STEP 5 - WORD OVERUSE & DYNAMIC TOPIC COLLOCATIONS');
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
// TEST 1: Unit Test analyzeWordOveruse
// ----------------------------------------------------
console.log('--- 1. Testing analyzeWordOveruse() ---');
const repeatedWords = [
  'important', 'important', 'important', 'important', 'important', // 5 times
  'people', 'people', 'people', 'people',                         // 4 times
  'the', 'the', 'the', 'the', 'the',                              // stopword (should be ignored)
  'cat', 'cat', 'cat', 'cat',                                     // < 4 letters (should be ignored)
  'technology', 'growth', 'future'                                // 1 time each
];

const overuseDiag = analyzeWordOveruse(repeatedWords);
assert(overuseDiag.hasOveruse === true, 'Flags overuse when non-stopwords >= 4 repetitions');
assert(overuseDiag.overuseCount === 2, 'Counts exactly 2 overused words (important, people)', `Got ${overuseDiag.overuseCount}`);
assert(overuseDiag.overusedWords[0].word === 'important' && overuseDiag.overusedWords[0].count === 5, 'Finds important repeated 5 times');
assert(overuseDiag.overusedWords[1].word === 'people' && overuseDiag.overusedWords[1].count === 4, 'Finds people repeated 4 times');
assert(overuseDiag.suggestions.length > 0, 'Generates academic thesaurus suggestions for overused words');
assert(overuseDiag.suggestions[0].alternatives.length > 0, 'Suggestions contain C1/C2 alternatives');

// ----------------------------------------------------
// TEST 2: Unit Test lookupTopicCollocations
// ----------------------------------------------------
console.log('\n--- 2. Testing lookupTopicCollocations() across Cambridge Themes ---');

const testCasesTopic = [
  {
    context: 'Children attending school and university education face curriculum changes and academic pressure from teachers.',
    expectedTopic: 'education',
    label: 'Education & Child Development'
  },
  {
    context: 'Artificial intelligence and automation technology in the modern digital era are replacing human workers with computers.',
    expectedTopic: 'technology',
    label: 'Technology & AI'
  },
  {
    context: 'Climate change and environmental pollution from carbon emissions threaten global biodiversity and ecosystems.',
    expectedTopic: 'environment',
    label: 'Environment & Climate'
  },
  {
    context: 'Crime rates and prison sentences for juvenile offenders require strict police enforcement to deter delinquency.',
    expectedTopic: 'crime',
    label: 'Crime & Justice'
  },
  {
    context: 'Obesity and sedentary lifestyle cause chronic disease and illness that overwhelm public hospital healthcare systems.',
    expectedTopic: 'health',
    label: 'Healthcare & Lifestyle'
  },
  {
    context: 'Economic inflation and stagnant wage growth in urban cities exacerbate housing disparity and unemployment.',
    expectedTopic: 'economy',
    label: 'Economy & Urbanization'
  },
  {
    context: 'Some people argue about abstract concepts without any specific domain.',
    expectedTopic: 'general',
    label: 'General Academic Argumentation fallback'
  }
];

testCasesTopic.forEach(tc => {
  const res = lookupTopicCollocations(tc.context);
  assert(res.topicKey === tc.expectedTopic, `Topic detector for '${tc.label}' -> matched '${res.topicKey}'`, `Got ${res.topicKey}, expected ${tc.expectedTopic}`);
  assert(Array.isArray(res.collocations) && res.collocations.length >= 3, `Returns >= 3 collocations for '${res.topicKey}'`);
});

// ----------------------------------------------------
// TEST 3: Integration - Severe Word Overuse LR Cap (Band 6.0 Max)
// ----------------------------------------------------
console.log('\n--- 3. Testing Severe Word Overuse Penalty in Full Essay Evaluation ---');

// 250+ words, high AWL vocabulary, but repeatedly uses "important" 7 times and "problem" 6 times
const essayWithSevereOveruse = `
It is often argued that artificial intelligence represents a pivotal development in modern society. In my opinion, technological innovations yield profound advantages although significant dilemmas emerge. While algorithms facilitate substantial economic efficiency, ethical ramifications require careful consideration.

To begin with, education plays a vital function in contemporary civilization. However, this is an important problem for universities. It is important because students face an important problem with automated assessment. Furthermore, an important factor is that teachers encounter another important problem when grading essays. Therefore, an important problem remains unresolved in academia. When institutions ignore this important problem, educational integrity diminishes rapidly. Consequently, finding a viable alternative to traditional methodologies becomes an indispensable priority for educational authorities worldwide.

On the other hand, technological infrastructure facilitates remarkable economic productivity and industrial expansion. Governments must formulate comprehensive regulations to mitigate unforeseen socioeconomic risks. For instance, empirical research demonstrates that automated algorithms enhance operational capacity across financial sectors. Nonetheless, this problem is an important problem for society. State authorities must collaborate with technological pioneers to rectify potential vulnerabilities and protect the populace from exploitation.

In conclusion, although technological advancements introduce considerable complexities, proactive adaptation ensures substantial benefits for future generations.
`;

const taskTech = {
  taskNumber: 2,
  type: 'OPINION',
  prompt: 'Some people believe that artificial intelligence will transform society positively. To what extent do you agree or disagree?',
  title: 'AI in Society',
  minWords: 250
};

const resultSevereOveruse = evaluateEssayAlgorithmically({
  task: taskTech,
  essayText: essayWithSevereOveruse
});

console.log('Result with severe word overuse:');
console.log(`- Word Count: ${resultSevereOveruse.wordStats.effectiveWordCount}`);
console.log(`- TR Band: ${resultSevereOveruse.criteria.tr.band}`);
console.log(`- LR Band: ${resultSevereOveruse.criteria.lr.band}`);
console.log(`- Word Overuse Stats:`, resultSevereOveruse.wordOveruseStats.overusedWords);
console.log(`- Detected Topic:`, resultSevereOveruse.detectedTopic);
console.log(`- Action Plan Priority 3:`, resultSevereOveruse.actionPlan.priority3);

assert(resultSevereOveruse.wordOveruseStats.hasOveruse === true, 'Detected word overuse');
assert(resultSevereOveruse.criteria.lr.band <= 6.0, 'LR is strictly capped at Band 6.0 due to severe word overuse', `LR Band was ${resultSevereOveruse.criteria.lr.band}`);
assert(resultSevereOveruse.criteria.lr.improvements.some(imp => imp.includes('LỖI LẶP TỪ NGHIÊM TRỌNG')), 'Includes Cambridge severe word overuse penalty warning');
assert(resultSevereOveruse.detectedTopic.topicKey === 'technology', 'Correctly detected Technology topic from prompt/essay');
assert(resultSevereOveruse.keyVocabulary.length >= 3, 'Key vocabulary contains topic collocations');

// ----------------------------------------------------
// TEST 4: High Variety Academic Essay (Band 7.0+ LR)
// ----------------------------------------------------
console.log('\n--- 4. Testing High Variety Academic Essay without Overuse ---');

const highVarietyEnvEssay = `
Global climate change and environmental degradation undoubtedly constitute paramount challenges confronting contemporary civilization. I firmly subscribe to the view that decisive governmental intervention and sustainable development alternatives are imperative to safeguard ecological stability.

Primarily, the proliferation of fossil fuel consumption has exerted a detrimental impact on atmospheric integrity, triggering unprecedented global warming and catastrophic weather phenomena. To mitigate the adverse effects, state authorities must prioritize investments in renewable energy source infrastructure, such as solar and wind power. For instance, empirical evidence from Nordic nations illustrates that subsidizing clean technology yields substantial reductions in greenhouse gas emission while catalyzing economic modernization. Consequently, transitioning towards green alternatives represents a viable alternative to traditional coal extraction.

Furthermore, fostering comprehensive public awareness regarding ecological conservation plays an indispensable role in sustainable progress. Educational campaigns empower individuals to minimize environmental footprints and abandon unsustainable consumerist behaviors. When coupled with stringent regulation frameworks penalizing industrial polluters, societies can cultivate resilient ecosystems conducive to long-term prosperity. Moreover, allocating financial subsidies for green research enables scientific institutions to pioneer cutting-edge carbon capture mechanisms.

In addition, international cooperation between developed and emerging economies is paramount to bridge the gap in ecological technology. By establishing multilateral environmental agreements and sharing clean energy patents, the global community can accelerate the transition toward carbon neutrality on a worldwide scale.

In conclusion, addressing this pressing issue necessitates synergistic endeavors encompassing progressive governance, technological innovation, and civic responsibility. Immediate implementation of these measures remains of paramount importance for safeguarding future generations.
`;

const taskEnv = {
  taskNumber: 2,
  type: 'OPINION',
  prompt: 'Global warming is the biggest threat to humanity. To what extent do you agree or disagree?',
  title: 'Environmental Protection',
  minWords: 250
};

const resultHighVariety = evaluateEssayAlgorithmically({
  task: taskEnv,
  essayText: highVarietyEnvEssay
});

console.log('Result for high-variety essay:');
console.log(`- Word Count: ${resultHighVariety.wordStats.effectiveWordCount}`);
console.log(`- LR Band: ${resultHighVariety.criteria.lr.band}`);
console.log(`- Overall Band: ${resultHighVariety.overallBand}`);
console.log(`- Detected Topic:`, resultHighVariety.detectedTopic);
console.log(`- Has Overuse: ${resultHighVariety.wordOveruseStats.hasOveruse}`);

assert(resultHighVariety.wordOveruseStats.hasOveruse === false, 'High variety essay has NO word overuse');
assert(resultHighVariety.criteria.lr.band >= 7.0, 'High variety essay achieves Band 7.0+ LR', `LR was ${resultHighVariety.criteria.lr.band}`);
assert(resultHighVariety.detectedTopic.topicKey === 'environment', 'Correctly identified environment topic');
assert(resultHighVariety.keyVocabulary.some(v => v.phrase.includes('carbon') || v.phrase.includes('ecological') || v.phrase.includes('environment')), 'Dynamic vocabulary provides environmental collocations');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} tests passed.`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL STEP 5 TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
