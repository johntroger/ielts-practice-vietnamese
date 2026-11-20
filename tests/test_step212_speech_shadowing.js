import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  SHADOWING_DEFAULT_THRESHOLD,
  SHADOWING_PARTS,
  SHADOWING_CHUNK_MODES,
  SHADOWING_STARTER_TASKS,
  resolveShadowingSegments,
  evaluateShadowingSegment,
  buildCustomShadowingTask,
  summarizeShadowingSession,
  loadSpeakingBankShadowingTasks,
  splitIntoSentencesSafe,
  normalizeShadowingTask
} from '../src/data/shadowingData.js';

console.log('🧪 Running Step 212: Speech Shadowing Tab (/conversation?tab=shadowing) Tests...');

// 1. Constants & Starter Tasks Validation
assert.strictEqual(SHADOWING_DEFAULT_THRESHOLD, 75, 'Default shadowing threshold must be 75%');
assert.strictEqual(SHADOWING_PARTS.length, 4, 'Should define All + Part 1/2/3 filters');
assert.strictEqual(SHADOWING_CHUNK_MODES.length, 3, 'Should define auto/sentence/paragraph chunk modes');
assert.strictEqual(SHADOWING_STARTER_TASKS.length, 6, 'Should ship 6 starter Speaking tasks (2 P1, 2 P2, 2 P3)');

let hasSentence = false;
let hasParagraph = false;
let hasPromptCue = false;

SHADOWING_STARTER_TASKS.forEach((task) => {
  assert.ok(!task.requiresAuth, `Shadowing task ${task.id} must be open access`);
  assert.ok(task.titleEn && task.titleVi, `Task ${task.id} must have bilingual titles`);
  assert.ok(task.promptEn && task.promptVi, `Task ${task.id} must have bilingual prompts`);
  assert.ok(Array.isArray(task.segments) && task.segments.length >= 3, `Task ${task.id} must have >= 3 segments`);
  task.segments.forEach((seg) => {
    if (seg.unitType === 'sentence') hasSentence = true;
    if (seg.unitType === 'paragraph') hasParagraph = true;
    if (seg.unitType === 'prompt_only') hasPromptCue = true;
  });
});

assert.ok(hasSentence && hasParagraph && hasPromptCue, 'Starter tasks must mix sentence, paragraph, and prompt_only units');

// 2. Chunk Resolution (auto vs sentence vs paragraph)
const p1Task = SHADOWING_STARTER_TASKS[0];
const autoSegs = resolveShadowingSegments(p1Task, 'auto');
assert.strictEqual(autoSegs.length, p1Task.segments.length, 'Auto mode should preserve natural flow');

const sentSegs = resolveShadowingSegments(p1Task, 'sentence');
assert.ok(sentSegs.length > autoSegs.length, 'Sentence mode should split multi-sentence paragraphs');
assert.strictEqual(sentSegs.filter(s => s.unitType === 'prompt_only').length, 2, 'Sentence mode must keep prompt_only cues intact');

const p2Task = SHADOWING_STARTER_TASKS.find(t => t.part === 'part2');
const paraSegs = resolveShadowingSegments(p2Task, 'paragraph');
assert.ok(paraSegs.length <= p2Task.segments.length, 'Paragraph mode should combine adjacent segments');
assert.ok(paraSegs.some(s => s.unitType === 'paragraph'), 'Paragraph mode must produce paragraph segments');

// 3. Pass-Gated Evaluation on Single Sentences & Multi-Sentence Paragraphs
const paraSegment = p2Task.segments.find(s => s.unitType === 'paragraph');
const passPara = evaluateShadowingSegment({
  targetText: paraSegment.text,
  spokenText: paraSegment.text,
  confidence: 0.92,
  threshold: 75,
  unitType: 'paragraph'
});
assert.strictEqual(passPara.isPassed, true, 'Accurate paragraph shadowing must pass >= 75% gate');
assert.ok(passPara.overallAccuracy >= 75, 'Accurate paragraph score must be >= 75');

const failPara = evaluateShadowingSegment({
  targetText: paraSegment.text,
  spokenText: 'I visited yesterday',
  confidence: 0.85,
  threshold: 75,
  unitType: 'paragraph'
});
assert.strictEqual(failPara.isPassed, false, 'Incomplete paragraph shadowing must stay locked (< 75%)');

// Contraction & number normalization check
const numEval = evaluateShadowingSegment({
  targetText: "That's twenty minutes before bed.",
  spokenText: 'That is 20 minutes before bed',
  confidence: 0.9,
  threshold: 75,
  unitType: 'sentence'
});
assert.strictEqual(numEval.isPassed, true, 'Contractions and numbers must normalize smoothly');

// 4. Custom Speaking Sample Importer
const customTask = buildCustomShadowingTask({
  title: 'Hometown Study',
  part: 'part1',
  bandLevel: '7.5',
  prompt: 'Talk about your hometown',
  rawText: [
    'Examiner: Where are you from?',
    'I grew up in Da Nang, a coastal city in central Vietnam.',
    'Examiner: What do you like most about it?',
    'The beaches are pristine and clean. People are genuinely warm and welcoming toward visitors.'
  ].join('\n\n')
});
assert.strictEqual(customTask.segments.length, 4, 'Custom parser should produce 4 segments');
assert.strictEqual(customTask.segments[0].unitType, 'prompt_only');
assert.strictEqual(customTask.segments[1].unitType, 'sentence');
assert.strictEqual(customTask.segments[2].unitType, 'prompt_only');
assert.strictEqual(customTask.segments[3].unitType, 'paragraph');

// 5. Session Summary & Struggled Words (excludes prompt_only)
const resolvedForSummary = resolveShadowingSegments(p1Task, 'auto');
const shadowable = resolvedForSummary.filter(s => s.unitType !== 'prompt_only');
const segResults = {};
const segAttempts = {};
shadowable.forEach((seg, idx) => {
  segAttempts[seg.id] = idx === 0 ? 1 : 2;
  segResults[seg.id] = {
    overallAccuracy: 84,
    estimatedBand: '7.5',
    isPassed: true,
    xpEarned: 30,
    wordBreakdown: [{ word: 'psychology', cleanWord: 'psychology', status: 'near', similarity: 66, missingCoda: false }]
  };
});
const summary = summarizeShadowingSession({
  task: p1Task,
  segments: resolvedForSummary,
  segmentResults: segResults,
  segmentAttempts: segAttempts
});
assert.strictEqual(summary.totalUserTurns, shadowable.length, 'Summary must exclude prompt_only cues');
assert.strictEqual(summary.avgAccuracy, 84);
assert.ok(summary.bonusXp > 0, 'Completed shadowing should earn bonus XP');
assert.ok(summary.struggledWords.some(w => w.cleanWord === 'psychology'), 'Should collect struggled words');

// 6. Dynamic Speaking Bank Adapter (Part 1, Part 2, Part 3)
const bankTasks = await loadSpeakingBankShadowingTasks();
assert.ok(bankTasks.length >= 6, 'Should adapt Part 1, Part 2, and Part 3 samples from Speaking Bank');
assert.ok(bankTasks.some(t => t.part === 'part1'), 'Should include Part 1 adapted tasks');
assert.ok(bankTasks.some(t => t.part === 'part2'), 'Should include Part 2 Cue Cards');
assert.ok(bankTasks.some(t => t.part === 'part3'), 'Should include Part 3 Discussion tasks');
bankTasks.forEach((t) => {
  assert.ok(!t.titleEn.includes('undefined') && !t.titleVi.includes('undefined'), `Task ${t.id} title must not contain undefined`);
});

// 7. Source-Level Integration & Routing Verification
const root = process.cwd();
const convModalSrc = fs.readFileSync(path.join(root, 'src/components/ConversationStudioModal.jsx'), 'utf8');
const appSrc = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
const backupSrc = fs.readFileSync(path.join(root, 'src/hooks/useSubmissionAndTaskActions.js'), 'utf8');
const summarySrc = fs.readFileSync(path.join(root, 'src/components/conversation/ConversationSummaryCard.jsx'), 'utf8');

assert.ok(convModalSrc.includes('SpeechShadowingWorkspace'), 'ConversationStudioModal must mount SpeechShadowingWorkspace');
assert.ok(convModalSrc.includes("studioTab !== 'roleplay'"), 'Roleplay effects must guard against running when Speech Shadowing tab is active');
assert.ok(appSrc.includes("'/shadowing'") && appSrc.includes("tab === 'shadowing'") && appSrc.includes("tab = 'shadowing'"), 'App.jsx must handle /shadowing and tab=shadowing deep-links');
assert.ok(backupSrc.includes('ielts_shadowing_stats_v1') && backupSrc.includes('ielts_shadowing_custom_v1'), 'Backup hook must include shadowing stats and custom samples');
assert.ok(summarySrc.includes("mode === 'shadowing'"), 'ConversationSummaryCard must support shadowing mode');

// 8. Voice capture race regression guards for SpeechShadowingWorkspace
const shadowingWsSrc = fs.readFileSync(path.join(root, 'src/components/conversation/SpeechShadowingWorkspace.jsx'), 'utf8');
assert.ok(
  shadowingWsSrc.includes('lastAutoReadKeyRef') && shadowingWsSrc.includes('runMachineReadForSegment'),
  'SpeechShadowingWorkspace.jsx must guard auto-read useEffect with lastAutoReadKeyRef so Start Mic / Skip never kills recording'
);
const retryFnMatch = shadowingWsSrc.match(/const handleListenAndRetry =[\s\S]*?\n  \};/);
assert.ok(
  retryFnMatch && retryFnMatch[0].includes('!isMobileDevice') && !retryFnMatch[0].includes('async () =>'),
  'handleListenAndRetry must skip non-gesture auto startListening on mobile devices'
);

// 9. Mobile active-segment focus scroll & compact locked preview guards
assert.ok(
  shadowingWsSrc.includes('activeSegRef') &&
    shadowingWsSrc.includes('getBoundingClientRect') &&
    !shadowingWsSrc.includes('segContainerRef.current.scrollHeight'),
  'SpeechShadowingWorkspace.jsx must scroll specifically to activeSegRef via getBoundingClientRect (never scrollHeight past active segment)'
);
assert.ok(
  shadowingWsSrc.includes('remainingLocked') && shadowingWsSrc.includes('if (idx > activeSegIndex) return null;'),
  'SpeechShadowingWorkspace.jsx must collapse upcoming locked segments into a compact indicator bar'
);

// 10. Abbreviation-safe sentence splitter, bulk bank normalizer & workspace replay/memo guards
const splitSentences = splitIntoSentencesSafe('Dr. Smith scored 7.5 in the U.K. today. He was thrilled!');
assert.strictEqual(splitSentences.length, 2, 'splitIntoSentencesSafe must not split on Dr., 7.5, or U.K.');
assert.strictEqual(splitSentences[0], 'Dr. Smith scored 7.5 in the U.K. today.');

const normalizedBulkTask = normalizeShadowingTask({
  part: 'Part 2',
  title: 'Memorable Journey',
  question: 'Describe a memorable journey you took.',
  sampleAnswer: 'Last summer I visited Da Nang with my close friends. It was unforgettable.\n\nWe explored the marble mountains and enjoyed local seafood every evening.'
}, 0);
assert.strictEqual(normalizedBulkTask.part, 'part2');
assert.strictEqual(normalizedBulkTask.requiresAuth, false, 'Bulk-ingested tasks must remain open access');
assert.ok(normalizedBulkTask.segments.length >= 3, 'Normalized task must preserve prompt and multi-paragraph segments');
assert.strictEqual(normalizedBulkTask.segments[0].unitType, 'prompt_only');

assert.ok(
  shadowingWsSrc.includes('segmentCountByTaskId') &&
    shadowingWsSrc.includes('fullReplayTimerRef') &&
    shadowingWsSrc.includes('stopToken'),
  'SpeechShadowingWorkspace.jsx must memoize segmentCountByTaskId, track fullReplayTimerRef, and guard stop eval with stopToken'
);

console.log('✅ Step 212 passed all Speech Shadowing tests!');
