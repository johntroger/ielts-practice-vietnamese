import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  validatePeelParagraphAlgorithmically, 
  validatePeelParagraph 
} from '../src/services/ai/writingAiService.js';
import * as geminiService from '../src/services/geminiService.js';
import { getFeatureById } from '../src/core/featureRegistry.js';

/**
 * Test Suite Step 91: PEEL Argument Coherence Checker Verification
 * 
 * Verifies:
 * 1. Functions exported from writingAiService.js and re-exported from geminiService.js
 * 2. Algorithmic analysis of exemplary PEEL body paragraph (100% complete, Band 7.5 - 8.5)
 * 3. Diagnostic detection of missing Evidence and unsupported absolute claims
 * 4. Diagnostic detection of personal anecdotes vs academic empirical evidence
 * 5. PromptPane.jsx PEEL validator toggle & drawer UI integration
 * 6. Task2CoherenceModal.jsx active body paragraph PEEL integration
 * 7. Feature Registry registration for feat-peel-argument-checker
 */

console.log('🏛️ Testing Step 91: PEEL Argument Coherence Checker (Task 2 Cambridge TR & CC)...');

// 1. Verify exports
console.log('  ▶ 1. Verifying service exports & re-exports in geminiService facade...');
assert.strictEqual(typeof validatePeelParagraphAlgorithmically, 'function', 'validatePeelParagraphAlgorithmically must be exported');
assert.strictEqual(typeof validatePeelParagraph, 'function', 'validatePeelParagraph must be exported');
assert.strictEqual(typeof geminiService.validatePeelParagraphAlgorithmically, 'function', 'geminiService must re-export validatePeelParagraphAlgorithmically');
assert.strictEqual(typeof geminiService.validatePeelParagraph, 'function', 'geminiService must re-export validatePeelParagraph');
console.log('    ✅ Service function signatures verified.');

// 2. Test exemplary PEEL body paragraph
console.log('  ▶ 2. Testing exemplary PEEL paragraph evaluation (Band 8.0+)...');
const exemplaryPara = 'To begin with, the adoption of digital automation significantly boosts industrial productivity. This is because when repetitive manual labor is delegated to advanced algorithms, human employees can redirect their intellectual efforts toward creative problem-solving and strategic innovation. For instance, recent empirical data from manufacturing hubs across Germany revealed that robotics-assisted facilities achieved a 35% reduction in production defects while concurrently reducing operating expenditures. Consequently, embracing automation is indispensable for preserving long-term international economic competitiveness.';

const exemplaryResult = validatePeelParagraphAlgorithmically({
  paragraphText: exemplaryPara
});

assert.strictEqual(exemplaryResult.completenessScore, 100, 'Exemplary paragraph should have 100% completeness score');
assert.strictEqual(exemplaryResult.hasPoint, true, 'Must detect Point (Topic sentence)');
assert.strictEqual(exemplaryResult.hasExplanation, true, 'Must detect Explanation');
assert.strictEqual(exemplaryResult.hasEvidence, true, 'Must detect Evidence (Example)');
assert.strictEqual(exemplaryResult.hasLink, true, 'Must detect Link (Concluding sentence)');
assert.ok(exemplaryResult.estimatedBand >= 7.5, `Estimated band should be >= 7.5, got ${exemplaryResult.estimatedBand}`);
assert.strictEqual(exemplaryResult.missingComponents.length, 0, 'No components should be missing');
assert.strictEqual(exemplaryResult.unsupportedClaims.length, 0, 'No unsupported claims in exemplary text');
assert.ok(exemplaryResult.sentenceBreakdown.length >= 4, 'Should break down all sentences');
assert.ok(exemplaryResult.exemplaryUpgrade.text.length > 50, 'Should provide Band 8.5+ exemplary upgrade');
console.log(`    ✅ Exemplary paragraph verified: Score ${exemplaryResult.completenessScore}%, Band ${exemplaryResult.estimatedBand}, Breakdown: ${exemplaryResult.sentenceBreakdown.length} sentences.`);

// 3. Test flawed paragraph (Missing Evidence & Unsupported absolute claims)
console.log('  ▶ 3. Testing flawed paragraph (Missing Evidence & Unsupported Claims)...');
const flawedPara = 'First of all, private cars cause extreme air pollution in major metropolises. Obviously, everyone knows that vehicle emissions are completely destroying the urban atmosphere and all people must suffer. Therefore, authorities should ban automobiles.';

const flawedResult = validatePeelParagraphAlgorithmically({
  paragraphText: flawedPara
});

assert.strictEqual(flawedResult.hasEvidence, false, 'Should flag missing evidence');
assert.ok(flawedResult.completenessScore < 85, `Completeness score should be penalized, got ${flawedResult.completenessScore}`);
assert.ok(flawedResult.missingComponents.includes('Evidence (Dẫn chứng thực tế)'), 'missingComponents must list Evidence');
assert.ok(flawedResult.unsupportedClaims.length > 0, 'Must detect absolute unsupported claims ("Obviously, everyone knows...")');
assert.ok(flawedResult.improvements.some(imp => imp.toLowerCase().includes('dẫn chứng') || imp.toLowerCase().includes('evidence')), 'Must suggest adding evidence');
console.log(`    ✅ Flawed paragraph diagnosed: Score ${flawedResult.completenessScore}%, Missing: ${flawedResult.missingComponents.join(', ')}, Unsupported claims: ${flawedResult.unsupportedClaims.length}.`);

// 4. Test personal anecdote warning
console.log('  ▶ 4. Testing personal anecdote detection vs academic evidence...');
const personalPara = 'To begin with, excessive screen time diminishes academic performance. This is because prolonged computer usage distracts learners from their essential reading tasks. For example, my friend in high school failed his midterm exam because he was playing video games all night. Consequently, limiting digital device usage is essential.';

const personalResult = validatePeelParagraphAlgorithmically({
  paragraphText: personalPara
});

const exampleSentence = personalResult.sentenceBreakdown.find(s => s.role === 'evidence');
assert.ok(exampleSentence, 'Should detect evidence sentence');
assert.strictEqual(exampleSentence.isPersonal, true, 'Must detect personal anecdote marker ("my friend")');
assert.ok(exampleSentence.tip.includes('cá nhân'), 'Sentence tip must warn about personal anecdotes');
console.log('    ✅ Personal anecdote warning verified.');

// 5. Verify PromptPane.jsx integration
console.log('  ▶ 5. Verifying PromptPane.jsx PEEL UI integration...');
const promptPanePath = path.resolve('src/components/PromptPane.jsx');
assert.ok(fs.existsSync(promptPanePath), 'PromptPane.jsx must exist');
const promptPaneCode = fs.readFileSync(promptPanePath, 'utf8');

assert.ok(promptPaneCode.includes('validatePeelParagraph'), 'PromptPane.jsx must import validatePeelParagraph');
assert.ok(promptPaneCode.includes('showPeelValidator'), 'PromptPane.jsx must define showPeelValidator state');
assert.ok(promptPaneCode.includes('handleValidatePeel'), 'PromptPane.jsx must define handleValidatePeel handler');
assert.ok(promptPaneCode.includes('Check Đoạn PEEL (AI)'), 'PromptPane.jsx must have Check Đoạn PEEL (AI) button');
assert.ok(promptPaneCode.includes('peelResult.completenessScore'), 'PromptPane.jsx must render PEEL completeness score');
assert.ok(promptPaneCode.includes('peelResult.sentenceBreakdown'), 'PromptPane.jsx must render sentence breakdown');
assert.ok(promptPaneCode.includes('peelResult.exemplaryUpgrade'), 'PromptPane.jsx must render exemplary upgrade rewrite');
console.log('    ✅ PromptPane.jsx PEEL toggle & drawer UI verified.');

// 6. Verify Task2CoherenceModal.jsx integration
console.log('  ▶ 6. Verifying Task2CoherenceModal.jsx PEEL integration...');
const coherenceModalPath = path.resolve('src/components/Task2CoherenceModal.jsx');
assert.ok(fs.existsSync(coherenceModalPath), 'Task2CoherenceModal.jsx must exist');
const coherenceModalCode = fs.readFileSync(coherenceModalPath, 'utf8');

assert.ok(coherenceModalCode.includes('validatePeelParagraphAlgorithmically'), 'Task2CoherenceModal.jsx must import validatePeelParagraphAlgorithmically');
assert.ok(coherenceModalCode.includes('activePeel'), 'Task2CoherenceModal.jsx must compute activePeel');
assert.ok(coherenceModalCode.includes('PEEL:'), 'Task2CoherenceModal.jsx must display PEEL badge');
assert.ok(coherenceModalCode.includes('activePeel.unsupportedClaims'), 'Task2CoherenceModal.jsx must warn about unsupported claims');
console.log('    ✅ Task2CoherenceModal.jsx PEEL diagnostics verified.');

// 7. Verify Feature Registry registration
console.log('  ▶ 7. Verifying featureRegistry.js registration...');
const feature = getFeatureById('feat-peel-argument-checker');
assert.ok(feature, 'feat-peel-argument-checker must be registered in FEATURE_REGISTRY');
assert.strictEqual(feature.category, 'ai_evaluation', 'Must be in ai_evaluation category');
assert.ok(feature.targetSkills.includes('writing'), 'Must target writing skill');
assert.ok(feature.title.includes('PEEL'), 'Title must mention PEEL');
assert.ok(feature.highlights.length >= 3, 'Must have at least 3 highlights');
console.log('    ✅ Feature registry entry verified.');

// 8. Verify React Rules of Hooks compliance in Task2CoherenceModal.jsx
console.log('  ▶ 8. Verifying React Rules of Hooks compliance in Task2CoherenceModal.jsx...');
const returnIdx = coherenceModalCode.indexOf('if (!isOpen || !analysis) return null;');
const peelHookIdx = coherenceModalCode.indexOf('const activePeel = React.useMemo');
assert.ok(returnIdx !== -1, 'Must have safe return guard');
assert.ok(peelHookIdx !== -1, 'Must have activePeel hook');
assert.ok(peelHookIdx < returnIdx, 'activePeel hook MUST be called BEFORE early return to prevent React Hook count mismatch error');
console.log('    ✅ React Rules of Hooks compliance verified.');

console.log('\n🎉 ALL 8/8 TESTS FOR STEP 91 (PEEL ARGUMENT COHERENCE CHECKER) PASSED CLEANLY!\n');
