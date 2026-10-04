import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  TRAP_ARCHETYPES, 
  analyzeDistractorTrap 
} from '../src/services/trapAnalysisService.js';
import { getFeatureById } from '../src/core/featureRegistry.js';

/**
 * Test Suite Step 93: Distractor Trap Decoder Verification
 * 
 * Verifies:
 * 1. TRAP_ARCHETYPES schema integrity (titles, blueprints, 3-second reflex rules)
 * 2. Algorithmic trap detection for Listening 180-degree pivot
 * 3. Algorithmic trap detection for Reading False Synonym / Word Matching
 * 4. Algorithmic trap detection for Over-Generalization & NOT GIVEN scope creep
 * 5. Algorithmic trap detection for Numerical / currency distractors
 * 6. DistractorTrapExplainer.jsx component structure
 * 7. QuestionPane.jsx & ListeningQuestionPane.jsx integration
 * 8. Feature Registry registration for feat-distractor-trap-decoder
 */

console.log('🏛️ Testing Step 93: Cambridge Distractor Trap Decoder (Reading & Listening)...');

// 1. Verify TRAP_ARCHETYPES
console.log('  ▶ 1. Verifying TRAP_ARCHETYPES definitions and schema...');
assert.ok(TRAP_ARCHETYPES.LISTENING_PIVOT, 'Must define LISTENING_PIVOT');
assert.ok(TRAP_ARCHETYPES.FALSE_SYNONYM, 'Must define FALSE_SYNONYM');
assert.ok(TRAP_ARCHETYPES.OVER_GENERALIZATION, 'Must define OVER_GENERALIZATION');
assert.ok(TRAP_ARCHETYPES.NUMERICAL_DISTRACTOR, 'Must define NUMERICAL_DISTRACTOR');
assert.ok(TRAP_ARCHETYPES.EXTREME_ABSOLUTE, 'Must define EXTREME_ABSOLUTE');

Object.values(TRAP_ARCHETYPES).forEach(trap => {
  assert.ok(trap.id, `Trap must have id: ${trap.id}`);
  assert.ok(trap.titleVi, `Trap must have Vietnamese title: ${trap.id}`);
  assert.ok(trap.titleEn, `Trap must have English title: ${trap.id}`);
  assert.ok(trap.whyYouChoseThis, `Trap must explain why candidate chose it: ${trap.id}`);
  assert.ok(trap.examinerBlueprint, `Trap must have examiner blueprint: ${trap.id}`);
  assert.ok(trap.reflexActionTip, `Trap must prescribe 3-second reflex rule: ${trap.id}`);
});
console.log(`    ✅ All ${Object.keys(TRAP_ARCHETYPES).length} trap archetypes validated.`);

// 2. Test Listening 180-Degree Pivot detection
console.log('  ▶ 2. Testing Listening 180-degree turnaround pivot detection...');
const listeningResult = analyzeDistractorTrap({
  skill: 'listening',
  question: { order: 1, questionText: 'Date of departure', answer: 'Sunday 16th' },
  userAnswer: 'Friday 14th',
  evidenceQuote: 'We initially planned to arrive on Friday the 14th, but actually our flights got rescheduled to Sunday the 16th.'
});
assert.strictEqual(listeningResult.id, 'LISTENING_PIVOT', 'Must detect LISTENING_PIVOT from "actually"');
assert.ok(listeningResult.reflexActionTip.includes('2 giây') || listeningResult.reflexActionTip.includes('phản xạ'), 'Must provide reflex action tip');
console.log(`    ✅ Listening pivot diagnosed: "${listeningResult.titleVi}"`);

// 3. Test Reading False Synonym / Word Spotting Trap
console.log('  ▶ 3. Testing Reading False Synonym / Word Matching trap detection...');
const falseSynonymResult = analyzeDistractorTrap({
  skill: 'reading',
  question: { 
    order: 5, 
    questionText: 'Which technological advancement caused international deforestation?', 
    answer: 'Timber logging machines' 
  },
  userAnswer: 'Artificial intelligence satellites',
  passageText: 'Although satellites monitor global forest coverage, industrial timber logging machines directly accelerate international deforestation.',
  evidenceQuote: 'industrial timber logging machines directly accelerate international deforestation'
});
assert.ok(falseSynonymResult.id === 'FALSE_SYNONYM', 'Should flag False Synonym / Word Matching trap');
console.log(`    ✅ False Synonym diagnosed: "${falseSynonymResult.titleVi}"`);

// 4. Test Over-Generalization & NOT GIVEN Trap
console.log('  ▶ 4. Testing Over-Generalization & NOT GIVEN trap detection...');
const notGivenResult = analyzeDistractorTrap({
  skill: 'reading',
  question: { 
    order: 8, 
    type: 'TFNG', 
    questionText: 'All ancient Egyptian physicians were required to attend Alexandria university.', 
    answer: 'NOT GIVEN' 
  },
  userAnswer: 'FALSE'
});
assert.strictEqual(notGivenResult.id, 'OVER_GENERALIZATION', 'Must diagnose OVER_GENERALIZATION for NOT GIVEN vs FALSE confusion');
console.log(`    ✅ NOT GIVEN Scope Creep diagnosed: "${notGivenResult.titleVi}"`);

// 5. Test Numerical & Currency Distractor Trap
console.log('  ▶ 5. Testing Numerical & Currency distractor trap detection...');
const numericalResult = analyzeDistractorTrap({
  skill: 'listening',
  question: { 
    order: 3, 
    questionText: 'Discounted admission fee per student', 
    answer: '£15' 
  },
  userAnswer: '£20',
  evidenceQuote: 'Standard tickets are £20 for adults, but student groups enjoy a reduced rate of £15.'
});
assert.strictEqual(numericalResult.id, 'NUMERICAL_DISTRACTOR', 'Must detect NUMERICAL_DISTRACTOR');
console.log(`    ✅ Numerical Distractor diagnosed: "${numericalResult.titleVi}"`);

// 6. Verify DistractorTrapExplainer.jsx component file
console.log('  ▶ 6. Verifying DistractorTrapExplainer.jsx component structure...');
const explainerPath = path.resolve('src/components/DistractorTrapExplainer.jsx');
assert.ok(fs.existsSync(explainerPath), 'DistractorTrapExplainer.jsx must exist');
const explainerContent = fs.readFileSync(explainerPath, 'utf8');

assert.ok(explainerContent.includes('analyzeDistractorTrap'), 'Must import analyzeDistractorTrap');
assert.ok(explainerContent.includes('whyYouChoseThis'), 'Must display whyYouChoseThis');
assert.ok(explainerContent.includes('examinerBlueprint'), 'Must display examinerBlueprint');
assert.ok(explainerContent.includes('reflexActionTip'), 'Must display reflexActionTip');
assert.ok(explainerContent.includes('handleSaveToMistakeLog'), 'Must support saving to mistake log');
console.log('    ✅ DistractorTrapExplainer.jsx component verified.');

// 7. Verify Reading QuestionPane.jsx integration
console.log('  ▶ 7. Verifying Reading QuestionPane.jsx integration...');
const readingPanePath = path.resolve('src/components/reading/QuestionPane.jsx');
assert.ok(fs.existsSync(readingPanePath), 'QuestionPane.jsx must exist');
const readingContent = fs.readFileSync(readingPanePath, 'utf8');
assert.ok(readingContent.includes('DistractorTrapExplainer'), 'QuestionPane must import and render DistractorTrapExplainer');
assert.ok(readingContent.includes('skill="reading"'), 'QuestionPane must specify skill="reading"');
console.log('    ✅ Reading QuestionPane.jsx integration verified.');

// 8. Verify ListeningQuestionPane.jsx integration
console.log('  ▶ 8. Verifying Listening ListeningQuestionPane.jsx integration...');
const listeningPanePath = path.resolve('src/components/listening/ListeningQuestionPane.jsx');
assert.ok(fs.existsSync(listeningPanePath), 'ListeningQuestionPane.jsx must exist');
const listeningContent = fs.readFileSync(listeningPanePath, 'utf8');
assert.ok(listeningContent.includes('DistractorTrapExplainer'), 'ListeningQuestionPane must import and render DistractorTrapExplainer');
assert.ok(listeningContent.includes('skill="listening"'), 'ListeningQuestionPane must specify skill="listening"');
console.log('    ✅ Listening ListeningQuestionPane.jsx integration verified.');

// 9. Verify Feature Registry registration
console.log('  ▶ 9. Verifying Feature Registry registration...');
const feature = getFeatureById('feat-distractor-trap-decoder');
assert.ok(feature, 'feat-distractor-trap-decoder must be registered in FEATURE_REGISTRY');
assert.strictEqual(feature.status, 'new', 'Feature status should be new');
assert.ok(feature.title.includes('Bẫy Khảo Thí Cambridge'), 'Title must match feature name');
assert.ok(feature.targetSkills.includes('reading') && feature.targetSkills.includes('listening'), 'Target skills must include reading and listening');
console.log(`    ✅ Feature registered: "${feature.title}" (ID: ${feature.id})`);

console.log('🎉 Step 93 Test Suite PASSED 100%! All Cambridge distractor decoder requirements met.');
