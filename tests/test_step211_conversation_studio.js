import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  CONVERSATION_DEFAULT_THRESHOLD,
  CONVERSATION_SCENARIOS,
  CONVERSATION_TRACKS,
  evaluateConversationTurn,
  buildCustomConversation,
  summarizeConversationSession
} from '../src/data/conversationData.js';
import { expandConversationalTokens } from '../src/data/pronunciationData.js';
import { loadDynamicConversations } from '../src/data/conversationAdapters.js';

console.log('🧪 Running Step 211: Conversation Roleplay Studio (/conversation) Tests...');

// 1. Default threshold & open access checks
assert.strictEqual(CONVERSATION_DEFAULT_THRESHOLD, 75, 'Default threshold must be 75%');
assert.ok(CONVERSATION_TRACKS.length >= 4, 'Should define all + 3 conversation tracks');
assert.strictEqual(CONVERSATION_SCENARIOS.length, 12, 'Should ship 12 built-in scenarios');
CONVERSATION_SCENARIOS.forEach((sc) => {
  assert.ok(!sc.requiresAuth, `Scenario ${sc.id} must be open access (no requiresAuth)`);
  assert.ok(sc.titleEn && sc.titleVi, `Scenario ${sc.id} must have bilingual titles`);
  assert.ok(Array.isArray(sc.turns) && sc.turns.length >= 6, `Scenario ${sc.id} must have >= 6 turns`);
});

// 2. Conversational token normalization (contractions, numbers, time, currency)
assert.deepStrictEqual(expandConversationalTokens("That's 20 dollars"), ['that', 'is', 'twenty', 'dollars']);
assert.deepStrictEqual(expandConversationalTokens('at 11:00'), ['at', 'eleven']);
assert.deepStrictEqual(expandConversationalTokens('$5'), ['five', 'dollars']);

// 3. Turn-gating threshold evaluation (75% default)
const passEval = evaluateConversationTurn({
  targetText: "No syrup, thank you. Just a regular shot is totally fine.",
  spokenText: "No syrup thank you just a regular shot is totally fine",
  confidence: 0.92,
  threshold: 75
});
assert.strictEqual(passEval.isPassed, true, 'Accurate utterance must pass >= 75% gate');
assert.ok(passEval.overallAccuracy >= 75, 'Accurate utterance accuracy should be >= 75');

const failEval = evaluateConversationTurn({
  targetText: "No syrup, thank you. Just a regular shot is totally fine.",
  spokenText: "hello world",
  confidence: 0.85,
  threshold: 75
});
assert.strictEqual(failEval.isPassed, false, 'Inaccurate utterance must stay locked (< 75%)');

// Contraction matching test ("That's" vs "That is")
const contractionEval = evaluateConversationTurn({
  targetText: "That's a great idea for tomorrow.",
  spokenText: "That is a great idea for tomorrow",
  confidence: 0.9,
  threshold: 75
});
assert.strictEqual(contractionEval.isPassed, true, 'Expanded contractions must match cleanly');

// 4. Custom conversation builder
const customConv = buildCustomConversation({
  title: 'Coffee Chat',
  track: 'daily',
  bandLevel: '7.0',
  rawScript: 'A: Good morning!\nB: Hi, could I get a flat white please?'
});
assert.strictEqual(customConv.turns.length, 2, 'Custom parser should extract 2 turns');
assert.strictEqual(customConv.turns[0].speaker, 'A');
assert.strictEqual(customConv.turns[1].speaker, 'B');

// 5. Session summary & struggled words
const testScenario = CONVERSATION_SCENARIOS[0];
const userTurns = testScenario.turns.filter(t => t.speaker === 'B');
const turnResults = {};
const turnAttempts = {};
userTurns.forEach((t, i) => {
  turnAttempts[t.id] = i === 0 ? 1 : 2;
  turnResults[t.id] = {
    overallAccuracy: 82,
    estimatedBand: '7.5',
    isPassed: true,
    xpEarned: 20,
    wordBreakdown: [
      { word: 'latte', cleanWord: 'latte', status: 'near', similarity: 68, missingCoda: false }
    ]
  };
});
const summary = summarizeConversationSession({
  scenario: testScenario,
  userRole: 'B',
  turnResults,
  turnAttempts
});
assert.strictEqual(summary.avgAccuracy, 82);
assert.ok(summary.bonusXp > 0, 'Completed session should award completion bonus XP');
assert.ok(summary.struggledWords.some(w => w.cleanWord === 'latte'), 'Should extract struggled words');

// 6. Dynamic adapter check (Listening R2 + Speaking Bank)
const dynamicList = await loadDynamicConversations();
assert.ok(dynamicList.length >= 5, 'Should load dynamic R2 Listening & Speaking Bank conversations');
const r2Scenario = dynamicList.find(d => d.sourceTag === 'Studio Audio R2');
assert.ok(r2Scenario && r2Scenario.audioUrl, 'R2 dynamic scenario must include studio audioUrl');

// 7. Integration & routing checks
const root = process.cwd();
const appSrc = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8');
const navbarSrc = fs.readFileSync(path.join(root, 'src/components/Navbar.jsx'), 'utf8');
const modalStoreSrc = fs.readFileSync(path.join(root, 'src/core/modalStore.js'), 'utf8');
const modalHostSrc = fs.readFileSync(path.join(root, 'src/components/modals/AppModalHost.jsx'), 'utf8');
const speechEngineSrc = fs.readFileSync(path.join(root, 'src/hooks/useSpeechEngine.js'), 'utf8');

assert.ok(appSrc.includes("'/conversation'"), 'App.jsx must handle /conversation route');
assert.ok(navbarSrc.includes('doOpenConversation'), 'Navbar.jsx must expose Conversation Studio link');
assert.ok(modalStoreSrc.includes('conversation: false'), 'modalStore.js must register conversation modal');
assert.ok(modalHostSrc.includes('ConversationStudioModal'), 'AppModalHost.jsx must mount ConversationStudioModal');
assert.ok(speechEngineSrc.includes('sampleCount: m.sampleCount'), 'useSpeechEngine.js must expose sampleCount');

console.log('✅ Step 211 passed all Conversation Studio tests!');
