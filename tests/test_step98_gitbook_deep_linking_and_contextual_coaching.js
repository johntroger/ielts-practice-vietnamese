import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getTheoryContext, 
  getGitBookTopicUrl, 
  CONTEXT_THEORY_MAP 
} from '../src/services/theoryContextService.js';
import { getGitBookBaseUrl } from '../src/core/featureRegistry.js';
import { THEORY_HANDBOOK } from '../src/data/theoryHandbook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runTests() {
  console.log('📚 Testing Step 98: GitBook Contextual Deep-Linking & Smart Strategy Coaching...');

  const baseUrl = getGitBookBaseUrl();
  assert(baseUrl.length > 0, 'getGitBookBaseUrl must return valid base URL');

  // =========================================================================
  // TEST 1: Writing Task 1 & Task 2 Context Mapping
  // =========================================================================
  console.log('  ▶ 1. Verifying Writing Task 1 & Task 2 Context Mapping...');
  
  const mapCtx = getTheoryContext({ skill: 'writing', taskNumber: 1, taskType: 'map' });
  assert.strictEqual(mapCtx.topicId, 'task1-map');
  assert.strictEqual(mapCtx.gitbookSlug, 'writing/task1-map');
  assert.strictEqual(mapCtx.gitbookUrl, `${baseUrl}/writing/task1-map`);
  assert(mapCtx.tip.includes('bản đồ') || mapCtx.tip.includes('mốc'), 'Map tip should be pedagogical');

  const processCtx = getTheoryContext({ skill: 'writing', taskNumber: 1, taskType: 'process' });
  assert.strictEqual(processCtx.topicId, 'task1-process');
  assert.strictEqual(processCtx.gitbookSlug, 'writing/task1-process');

  const lineCtx = getTheoryContext({ skill: 'writing', taskNumber: 1, taskType: 'line graph' });
  assert.strictEqual(lineCtx.topicId, 'task1-line-graph');

  const opinionCtx = getTheoryContext({ skill: 'writing', taskNumber: 2, taskType: 'opinion' });
  assert.strictEqual(opinionCtx.topicId, 'task2-opinion');
  assert.strictEqual(opinionCtx.gitbookSlug, 'writing/task2-opinion');
  assert.strictEqual(opinionCtx.gitbookUrl, `${baseUrl}/writing/task2-opinion`);

  const discussionCtx = getTheoryContext({ skill: 'writing', taskNumber: 2, taskType: 'discussion' });
  assert.strictEqual(discussionCtx.topicId, 'task2-discussion');

  const probSolCtx = getTheoryContext({ skill: 'writing', taskNumber: 2, taskType: 'problem_solution' });
  assert.strictEqual(probSolCtx.topicId, 'task2-problem-solution');

  console.log('    ✅ Writing Task 1 & 2 contextual mapping verified.');

  // =========================================================================
  // TEST 2: Reading, Listening, Speaking Context Mapping
  // =========================================================================
  console.log('  ▶ 2. Verifying Reading, Listening & Speaking Context Mapping...');

  const tfngCtx = getTheoryContext({ skill: 'reading', questionType: 'true_false_not_given' });
  assert.strictEqual(tfngCtx.topicId, 'true-false-not-given');
  assert.strictEqual(tfngCtx.gitbookSlug, 'reading/true-false-not-given');

  const headingsCtx = getTheoryContext({ skill: 'reading', questionType: 'matching_headings' });
  assert.strictEqual(headingsCtx.topicId, 'matching-headings');

  const listSec1Ctx = getTheoryContext({ skill: 'listening', section: 1, questionType: 'form_completion' });
  assert.strictEqual(listSec1Ctx.topicId, 'listening-part1-spelling-numbers');
  assert.strictEqual(listSec1Ctx.gitbookSlug, 'listening/listening-part1-spelling-numbers');

  const listMapCtx = getTheoryContext({ skill: 'listening', questionType: 'map' });
  assert.strictEqual(listMapCtx.topicId, 'map-and-signposting');

  const spkP1Ctx = getTheoryContext({ skill: 'speaking', section: 1 });
  assert.strictEqual(spkP1Ctx.topicId, 'area-framework-part1');

  const spkP2Ctx = getTheoryContext({ skill: 'speaking', section: 2 });
  assert.strictEqual(spkP2Ctx.topicId, 'storytelling-part2');

  const spkP3Ctx = getTheoryContext({ skill: 'speaking', section: 3 });
  assert.strictEqual(spkP3Ctx.topicId, 'critical-thinking-part3');

  console.log('    ✅ Reading, Listening & Speaking contextual mapping verified.');

  // =========================================================================
  // TEST 3: Validate All Mapped Topics Exist in 113-topic Handbook
  // =========================================================================
  console.log('  ▶ 3. Verifying Mapped Topic IDs Exist in THEORY_HANDBOOK...');

  const handbookIds = new Set(THEORY_HANDBOOK.map(t => t.id));
  const handbookSlugs = new Set(THEORY_HANDBOOK.map(t => t.gitbookSlug));

  const checkTopics = (obj) => {
    for (const key in obj) {
      const val = obj[key];
      if (val && typeof val === 'object') {
        if (val.topicId && val.gitbookSlug) {
          assert(handbookIds.has(val.topicId), `Topic ID "${val.topicId}" must exist in THEORY_HANDBOOK`);
          assert(handbookSlugs.has(val.gitbookSlug), `GitBook slug "${val.gitbookSlug}" must exist in THEORY_HANDBOOK`);
        } else {
          checkTopics(val);
        }
      }
    }
  };

  checkTopics(CONTEXT_THEORY_MAP);
  console.log('    ✅ All contextual topics 100% matched to authoritative handbook items.');

  // =========================================================================
  // TEST 4: UI Components Integration Verification
  // =========================================================================
  console.log('  ▶ 4. Verifying UI Component Integrations...');

  const promptPaneSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/PromptPane.jsx'), 'utf8');
  assert(promptPaneSrc.includes('getTheoryContext'), 'PromptPane.jsx must use getTheoryContext');
  assert(promptPaneSrc.includes('openTheoryModalWithContext'), 'PromptPane.jsx must use openTheoryModalWithContext');

  const questionPaneSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/reading/QuestionPane.jsx'), 'utf8');
  assert(questionPaneSrc.includes('getTheoryContext'), 'QuestionPane.jsx must use getTheoryContext');

  const listPaneSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/listening/ListeningQuestionPane.jsx'), 'utf8');
  assert(listPaneSrc.includes('getTheoryContext'), 'ListeningQuestionPane.jsx must use getTheoryContext');

  const p1Src = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart1Room.jsx'), 'utf8');
  assert(p1Src.includes('area-framework-part1'), 'SpeakingPart1Room.jsx must reference A.R.E.A framework');

  const p2Src = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart2Room.jsx'), 'utf8');
  assert(p2Src.includes('storytelling-part2'), 'SpeakingPart2Room.jsx must reference storytelling-part2');

  const p3Src = fs.readFileSync(path.resolve(__dirname, '../src/components/speaking/subrooms/SpeakingPart3Room.jsx'), 'utf8');
  assert(p3Src.includes('critical-thinking-part3'), 'SpeakingPart3Room.jsx must reference critical-thinking-part3');

  const distractorSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/DistractorTrapExplainer.jsx'), 'utf8');
  assert(distractorSrc.includes('openTheoryModalWithContext'), 'DistractorTrapExplainer.jsx must support openTheoryModalWithContext');

  const feedbackSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/FeedbackModal.jsx'), 'utf8');
  assert(feedbackSrc.includes('openTheoryModalWithContext'), 'FeedbackModal.jsx must support openTheoryModalWithContext');

  const appModalHostSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/modals/AppModalHost.jsx'), 'utf8');
  assert(appModalHostSrc.includes('initialTopicId'), 'AppModalHost.jsx must forward initialTopicId');

  const theoryModalSrc = fs.readFileSync(path.resolve(__dirname, '../src/components/TheoryHandbookModal.jsx'), 'utf8');
  assert(theoryModalSrc.includes('initialTopicId'), 'TheoryHandbookModal.jsx must accept initialTopicId');
  assert(theoryModalSrc.includes('theory-card-'), 'TheoryHandbookModal.jsx must assign theory-card- id to cards');

  console.log('    ✅ All 10 UI components successfully verified.');

  // =========================================================================
  // TEST 5: Zero Hardcoded GitBook URLs in New Service and Updated UI
  // =========================================================================
  console.log('  ▶ 5. Verifying Zero Hardcoded GitBook URLs...');

  const serviceSrc = fs.readFileSync(path.resolve(__dirname, '../src/services/theoryContextService.js'), 'utf8');
  assert(!serviceSrc.includes('https://vneconomics.gitbook.io'), 'theoryContextService.js must not contain hardcoded GitBook URL');

  assert(!promptPaneSrc.includes('https://vneconomics.gitbook.io'), 'PromptPane.jsx must not contain hardcoded GitBook URL');
  assert(!questionPaneSrc.includes('https://vneconomics.gitbook.io'), 'QuestionPane.jsx must not contain hardcoded GitBook URL');
  assert(!listPaneSrc.includes('https://vneconomics.gitbook.io'), 'ListeningQuestionPane.jsx must not contain hardcoded GitBook URL');
  assert(!feedbackSrc.includes('https://vneconomics.gitbook.io'), 'FeedbackModal.jsx must not contain hardcoded GitBook URL');

  console.log('    ✅ URL abstraction 100% verified (Zero hardcoded links).');

  console.log('\n🎉 ALL STEP 98 GITBOOK CONTEXTUAL DEEP-LINKING TESTS PASSED (5/5)!');
}

if (process.argv[1] && process.argv[1].endsWith('test_step98_gitbook_deep_linking_and_contextual_coaching.js')) {
  runTests();
}
