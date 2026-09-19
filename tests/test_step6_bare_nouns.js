import { evaluateEssayAlgorithmically } from '../src/services/algorithmicEvaluationService.js';

console.log('====================================================');
console.log('TEST SUITE: STEP 6 - BARE SINGULAR COUNTABLE NOUNS & ARTICLE TRAPS');
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
// TEST 1: Unit Pattern Tests (Isolated Error Scenarios)
// ----------------------------------------------------
console.log('--- 1. Testing Bare Noun & Missing Article Sentences ---');

const testCases = [
  {
    sentence: 'Student should study hard every day to achieve high academic performance.',
    expectedTypes: ['grammar'],
    description: 'Bare subject noun: "Student should"'
  },
  {
    sentence: 'In modern society, government must take action to address environmental pollution.',
    expectedTypes: ['grammar'],
    description: 'Bare institutional noun: "government must"'
  },
  {
    sentence: 'Doctor plays important role in community healthcare facilities.',
    expectedTypes: ['grammar'],
    description: 'Bare "Doctor plays" and missing article "plays important role"'
  },
  {
    sentence: 'Many individuals who live in big city encounter traffic congestion on daily basis.',
    expectedTypes: ['grammar'],
    description: 'Bare "in big city" and missing article "on daily basis"'
  },
  {
    sentence: 'Technological innovations have profound impact on modern civilization in long run.',
    expectedTypes: ['grammar'],
    description: 'Missing article "have profound impact" and "in long run"'
  }
];

const mockTask = {
  taskNumber: 2,
  type: 'OPINION',
  prompt: 'Discuss the role of education in modern society.',
  title: 'Education in Society',
  minWords: 250
};

testCases.forEach((tc, idx) => {
  // Wrap in small essay context (> 45 words so it passes the Band 1.0 < 35 words non-user gate)
  const dummyEssay = `${tc.sentence} This controversial subject has ignited profound debate across contemporary academic society worldwide. Proponents argue that strategic reforms provide sustainable benefits for all citizens. In conclusion, proactive collaboration is paramount for long-term prosperity.`;
  const res = evaluateEssayAlgorithmically({
    task: mockTask,
    essayText: dummyEssay
  });

  const hasExpectedCorrection = res.corrections.some(c => 
    c.explanation.includes('mạo từ') || c.explanation.includes('danh từ đếm được số ít') || c.explanation.includes('Bare Singular')
  );

  assert(hasExpectedCorrection, `Test 1.${idx + 1}: Catches ${tc.description}`);
});

// ----------------------------------------------------
// TEST 2: False Positive Safeguard Tests
// ----------------------------------------------------
console.log('\n--- 2. Testing False Positive Safeguards (Correct English Sentences) ---');

const correctSentences = [
  'Students should study hard every day to achieve high academic performance.',
  'In modern society, the government must take action to address environmental pollution.',
  'Governments should invest in public infrastructure to stimulate economic growth.',
  'A doctor plays an important role in community healthcare facilities.',
  'Doctors play a vital role in patient rehabilitation.',
  'Many individuals who live in big cities encounter traffic congestion on a daily basis.',
  'Technological innovations have a profound impact on modern civilization in the long run.'
];

correctSentences.forEach((sent, idx) => {
  const dummyEssay = `${sent} This topic has ignited profound debate across contemporary society. Proponents argue that strategic reforms provide sustainable benefits for all citizens. In conclusion, proactive collaboration is paramount.`;
  const res = evaluateEssayAlgorithmically({
    task: mockTask,
    essayText: dummyEssay
  });

  const falsePositive = res.corrections.find(c => 
    c.original.includes(sent) && (c.explanation.includes('Bare Singular') || c.explanation.includes('Thiếu mạo từ'))
  );

  assert(!falsePositive, `Test 2.${idx + 1}: No false positive for correct sentence: "${sent.slice(0, 45)}..."`);
});

// ----------------------------------------------------
// TEST 3: Integration - Systematic Bare Noun Errors (GRA Band 6.0 Cap)
// ----------------------------------------------------
console.log('\n--- 3. Testing Systematic Bare Noun / Article Deductions (GRA Band 6.0 Cap) ---');

// High AWL, complex sentences, 250+ words, but contains 4 systematic bare noun / article errors:
// 1. "Student should devote..."
// 2. "government must formulate..."
// 3. "plays vital role..."
// 4. "in long run..."
const essayWithSystematicBareNouns = `
It is widely argued that modern educational methodologies have ignited profound debate in contemporary society. I firmly subscribe to the view that progressive methodologies offer substantial societal advantages compared to traditional frameworks. While structured memorization provided historical utility, dynamic pedagogical models cultivate adaptable competencies indispensable for modern economic landscapes.

To begin with, student should devote adequate attention to scientific disciplines and technological innovations. When educational institutions cultivate critical thinking and problem-solving mechanisms, individuals acquire indispensable vocational capabilities. Furthermore, government must formulate comprehensive policies to subsidize modern laboratories and digital infrastructure across municipal schools. Empirical evidence demonstrates that allocating financial resources to pedagogical modernization accelerates socioeconomic progress on a national scale, enabling developing regions to compete internationally.

On the other hand, traditional character development plays vital role in holistic adolescent growth. While theoretical instruction remains important, fostering civic responsibility and empathetic communication empowers future generations to navigate complex cultural landscapes with integrity. In addition, promoting ethical awareness inside educational institutions yields enduring communal stability in long run, counteracting the pervasive effects of self-interested consumerism among impressionable young adults.

In conclusion, although conventional practices provide undeniable initial safeguards, the multifaceted benefits of forward-looking alternatives are far more substantial. Consequently, proactive collaboration between teachers and policymakers should be championed across all educational sectors.
`;

const resultBareNouns = evaluateEssayAlgorithmically({
  task: mockTask,
  essayText: essayWithSystematicBareNouns
});

console.log('Result with systematic bare noun errors:');
console.log(`- Word Count: ${resultBareNouns.wordStats.effectiveWordCount}`);
console.log(`- GRA Band: ${resultBareNouns.criteria.gra.band}`);
console.log(`- Bare Noun Error Count: ${resultBareNouns.bareNounStats.bareNounErrorCount}`);
console.log(`- Action Plan Priority 1 / 2:`, resultBareNouns.actionPlan.priority1, '||', resultBareNouns.actionPlan.priority2);

assert(resultBareNouns.bareNounStats.hasBareNounErrors === true, 'Detected bare noun errors');
assert(resultBareNouns.bareNounStats.bareNounErrorCount >= 3, `Counted >= 3 bare noun errors (Got ${resultBareNouns.bareNounStats.bareNounErrorCount})`);
assert(resultBareNouns.criteria.gra.band <= 6.0, `GRA is strictly capped at Band 6.0 due to systematic bare noun errors (Got Band ${resultBareNouns.criteria.gra.band})`);
assert(resultBareNouns.criteria.gra.improvements.some(imp => imp.includes('LỖI HỆ THỐNG DANH TỪ & MẠO TỪ')), 'Includes Cambridge bare noun / article penalty warning');
assert(resultBareNouns.actionPlan.priority1.includes('danh từ trơ trọi') || resultBareNouns.actionPlan.priority2.includes('danh từ trơ trọi'), 'Action plan alerts candidate to bare noun & article mastery');

// ----------------------------------------------------
// TEST 4: High Grammar Accuracy Essay (Band 8.0 GRA)
// ----------------------------------------------------
console.log('\n--- 4. Testing High Grammar Accuracy Essay (Band 8.0 GRA) ---');

const essayHighAccuracy = `
It is widely argued that modern educational methodologies have ignited profound debate in contemporary society. I firmly subscribe to the view that progressive methodologies offer substantial societal advantages compared to traditional frameworks. While structured memorization provided historical utility, dynamic pedagogical models cultivate adaptable competencies indispensable for modern economic landscapes.

To begin with, students should devote adequate attention to scientific disciplines and technological innovations. When educational institutions cultivate critical thinking and problem-solving mechanisms, individuals acquire indispensable vocational capabilities. Furthermore, the government must formulate comprehensive policies to subsidize modern laboratories and digital infrastructure across municipal schools. Empirical evidence demonstrates that allocating financial resources to pedagogical modernization accelerates socioeconomic progress on a national scale, enabling developing regions to compete internationally.

On the other hand, traditional character development plays a vital role in holistic adolescent growth. While theoretical instruction remains important, fostering civic responsibility and empathetic communication empowers future generations to navigate complex cultural landscapes with integrity. In addition, promoting ethical awareness inside educational institutions yields enduring communal stability in the long run, counteracting the pervasive effects of self-interested consumerism among impressionable young adults.

In conclusion, although conventional practices provide undeniable initial safeguards, the multifaceted benefits of forward-looking alternatives are far more substantial. Consequently, proactive collaboration between teachers and policymakers should be championed across all educational sectors.
`;

const resultHighAcc = evaluateEssayAlgorithmically({
  task: mockTask,
  essayText: essayHighAccuracy
});

console.log('Result for high accuracy essay:');
console.log(`- Word Count: ${resultHighAcc.wordStats.effectiveWordCount}`);
console.log(`- GRA Band: ${resultHighAcc.criteria.gra.band}`);
console.log(`- Bare Noun Error Count: ${resultHighAcc.bareNounStats.bareNounErrorCount}`);
console.log(`- Corrections Count: ${resultHighAcc.corrections.length}`);

assert(resultHighAcc.bareNounStats.hasBareNounErrors === false, 'High accuracy essay has 0 bare noun errors');
assert(resultHighAcc.criteria.gra.band >= 7.5, `High accuracy essay achieves Band 7.5+ GRA (Got Band ${resultHighAcc.criteria.gra.band})`);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} tests passed.`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL STEP 6 TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
