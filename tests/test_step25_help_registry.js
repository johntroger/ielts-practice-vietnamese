/**
 * STEP 25 TEST SUITE: Self-Updating Feature Registry & Help Center Hub
 * 
 * Verifies:
 * 1. Declarative Schema integrity for 100% registered features
 * 2. 100% ModalStore coverage gate (CI Validator prevents forgotten documentation)
 * 3. Spotlight Instant Search engine (Vietnamese, English, tags, skills)
 * 4. 1-Click Action Launcher dispatching (navigate_workspace, open_modal)
 * 5. Auto-Changelog timeline ordering
 * 6. Context-Aware feature recommendations
 */

import { 
  FEATURE_REGISTRY, 
  FEATURE_CATEGORIES, 
  SKILL_DEFINITIONS,
  getAllFeatures,
  getFeatureById,
  searchFeatures,
  getFeaturesBySkill,
  getFeaturesByCategory,
  getRecentChangelog,
  getContextualFeatures,
  dispatchFeatureAction
} from '../src/core/featureRegistry.js';
import { getModalState } from '../src/core/modalStore.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ Assertion Failed: ${message}`);
  }
}

console.log('--- Step 25: Self-Updating Feature Registry & Help Center Hub ---');

// 1. Schema Completeness & Integrity Tests
const validCategories = new Set(FEATURE_CATEGORIES.map(c => c.id));
const validSkills = new Set(['writing', 'reading', 'listening', 'speaking']);

assert(FEATURE_REGISTRY.length >= 20, `Registry contains at least 20 comprehensive features (found ${FEATURE_REGISTRY.length})`);

FEATURE_REGISTRY.forEach(feat => {
  assert(Boolean(feat.id && feat.id.startsWith('feat-')), `Feature ${feat.id} has valid id starting with 'feat-'`);
  assert(Boolean(feat.title && feat.title.length > 5), `Feature ${feat.id} has descriptive title`);
  assert(Boolean(feat.shortDesc && feat.shortDesc.length > 15), `Feature ${feat.id} has informative shortDesc`);
  assert(validCategories.has(feat.category), `Feature ${feat.id} has valid category '${feat.category}'`);
  assert(Array.isArray(feat.targetSkills) && feat.targetSkills.length > 0, `Feature ${feat.id} targets at least 1 IELTS skill`);
  feat.targetSkills.forEach(s => {
    assert(validSkills.has(s), `Feature ${feat.id} has valid target skill '${s}'`);
  });
  assert(Array.isArray(feat.highlights) && feat.highlights.length >= 2, `Feature ${feat.id} has >= 2 key highlights`);
  assert(Boolean(feat.usageGuide && feat.usageGuide.length > 10), `Feature ${feat.id} has usageGuide`);
  assert(Boolean(feat.version), `Feature ${feat.id} has version string`);
  assert(Boolean(feat.updatedAt && /^\d{4}-\d{2}-\d{2}$/.test(feat.updatedAt)), `Feature ${feat.id} has valid ISO updatedAt (${feat.updatedAt})`);
});

// 2. CI Verification Gate: 100% ModalStore Coverage
// Ensures every modal defined in modalStore has a quickAction or documented feature!
const modalStateSnapshot = getModalState();
const registeredModalNames = Object.keys(modalStateSnapshot);

const allQuickActionTargets = new Set(
  FEATURE_REGISTRY
    .filter(f => f.quickAction && f.quickAction.type === 'open_modal')
    .map(f => f.quickAction.target)
);

// Allow specific internal modals to be covered indirectly or directly
const exemptModals = new Set(['contact', 'onboarding']); // auxiliary dialogs
registeredModalNames.forEach(modalName => {
  if (exemptModals.has(modalName)) return;
  const isCovered = allQuickActionTargets.has(modalName);
  assert(isCovered, `ModalStore '${modalName}' MUST be registered as an action in FEATURE_REGISTRY`);
});

// 3. 1-Click Action Launcher Dispatcher Tests
let navigatedToSkill = null;
let openedModalName = null;
let closedModalCalled = false;

const mockHandlers = {
  switchSkill: (skill) => { navigatedToSkill = skill; },
  openModal: (name) => { openedModalName = name; },
  closeModal: () => { closedModalCalled = true; }
};

// Test Workspace Navigation Action
const speakingFeat = getFeatureById('feat-speaking-dual-engine');
assert(speakingFeat !== null, 'Found feat-speaking-dual-engine in registry');
assert(speakingFeat.quickAction.type === 'navigate_workspace', 'Speaking feature has navigate_workspace action');
assert(speakingFeat.quickAction.target === 'speaking', 'Speaking feature targets speaking workspace');

const dispatchRes1 = dispatchFeatureAction(speakingFeat.quickAction, mockHandlers);
assert(dispatchRes1 === true, 'dispatchFeatureAction returned true');
assert(navigatedToSkill === 'speaking', 'Dispatched switchSkill with "speaking"');
assert(closedModalCalled === true, 'closeModal called when launching action');

// Test Open Modal Action
closedModalCalled = false;
const generatorFeat = getFeatureById('feat-ai-generator-pro');
assert(generatorFeat !== null, 'Found feat-ai-generator-pro in registry');
assert(generatorFeat.quickAction.type === 'open_modal', 'Generator feature has open_modal action');
assert(generatorFeat.quickAction.target === 'generator', 'Generator feature targets generator modal');

const dispatchRes2 = dispatchFeatureAction(generatorFeat.quickAction, mockHandlers);
assert(dispatchRes2 === true, 'dispatchFeatureAction for modal returned true');
assert(openedModalName === 'generator', 'Dispatched openModal with "generator"');
assert(closedModalCalled === true, 'closeModal called when launching modal');

// 4. Spotlight Instant Search Engine Tests
const searchDualEngine = searchFeatures('chấm máy');
assert(searchDualEngine.length >= 1, `Search 'chấm máy' found results (${searchDualEngine.length})`);
assert(searchDualEngine.some(f => f.id === 'feat-speaking-dual-engine'), 'Results include feat-speaking-dual-engine');

const searchTask1 = searchFeatures('Task 1');
assert(searchTask1.length >= 2, `Search 'Task 1' found results (${searchTask1.length})`);

const searchFuzzyShortcut = searchFeatures('Alt + S');
assert(searchFuzzyShortcut.some(f => f.id === 'feat-speaking-dual-engine'), 'Search by shortcut Alt + S finds feature');

const searchSkillFiltered = searchFeatures('', { skill: 'speaking' });
assert(searchSkillFiltered.every(f => f.targetSkills.includes('speaking')), 'All results in speaking filter contain speaking skill');

const searchCategoryFiltered = searchFeatures('', { category: 'exam_simulation' });
assert(searchCategoryFiltered.every(f => f.category === 'exam_simulation'), 'All results in category filter match exam_simulation');

// 5. Auto-Changelog Timeline Ordering Tests
const changelog = getRecentChangelog(10);
assert(changelog.length === 10, 'getRecentChangelog returns requested limit');
for (let i = 0; i < changelog.length - 1; i++) {
  const dateA = new Date(changelog[i].updatedAt);
  const dateB = new Date(changelog[i + 1].updatedAt);
  assert(dateA >= dateB, `Changelog item ${i} (${changelog[i].updatedAt}) is >= item ${i+1} (${changelog[i+1].updatedAt})`);
}

// 6. Context-Aware Feature Recommendations
const speakingContext = getContextualFeatures('speaking');
assert(speakingContext.length >= 3, `Contextual speaking features >= 3 (found ${speakingContext.length})`);
assert(speakingContext.some(f => f.id === 'feat-speaking-dual-engine'), 'Contextual speaking includes dual engine');
assert(speakingContext.some(f => f.id === 'feat-speaking-mock-examiner'), 'Contextual speaking includes mock examiner');

const writingContext = getContextualFeatures('writing');
assert(writingContext.length >= 5, `Contextual writing features >= 5 (found ${writingContext.length})`);

console.log(`Step 25 Results: Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log(`All ${passed}/${passed} checks passed cleanly! 🚀`);
}
