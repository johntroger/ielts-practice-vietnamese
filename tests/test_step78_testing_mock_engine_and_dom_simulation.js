/**
 * Test Step 78: Standardized Testing & DOM Simulation Mock Engine Architecture (Kiến trúc Bước 5)
 *
 * Verifies:
 * 1. Zero-dependency Browser & DOM Simulation Engine in tests/utils/domSimulationHarness.js.
 * 2. Cross-tab storage event dispatching and BroadcastChannel message transmission.
 * 3. Audio & Speech synthesis mock contracts.
 * 4. Cambridge AI Writing evaluation mock payload generators.
 * 5. Vitest framework readiness via vitest.config.js and tests/setupVitest.js bootstrap.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DomSimulationHarness } from './utils/domSimulationHarness.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Step 78: Standardized Testing & DOM Simulation Mock Engine Architecture...');

// 1. Verify DomSimulationHarness initialization
const { cleanup } = DomSimulationHarness.setupEnvironment();

assert.ok(globalThis.localStorage, 'localStorage must be simulated');
globalThis.localStorage.setItem('test_key', 'test_value');
assert.strictEqual(globalThis.localStorage.getItem('test_key'), 'test_value');
assert.strictEqual(globalThis.localStorage.length, 1);
globalThis.localStorage.removeItem('test_key');
assert.strictEqual(globalThis.localStorage.getItem('test_key'), null);
console.log('  ✅ 1. LocalStorage mock simulation verified');

// 2. Verify Window Events & Storage Event Dispatcher
let receivedStorageEvent = null;
globalThis.window.addEventListener('storage', (e) => {
  receivedStorageEvent = e;
});

DomSimulationHarness.triggerCrossTabStorageEvent('ielts_all_tasks', null, '["task-1"]');
assert.ok(receivedStorageEvent, 'Storage event must be dispatched to window listeners');
assert.strictEqual(receivedStorageEvent.key, 'ielts_all_tasks');
assert.strictEqual(receivedStorageEvent.newValue, '["task-1"]');
console.log('  ✅ 2. Window Event Dispatcher & Cross-Tab Storage Event simulation verified');

// 3. Verify BroadcastChannel Simulation
const channel = new globalThis.BroadcastChannel('ielts_tasks_realtime');
let receivedChannelMsg = null;
channel.onmessage = (e) => {
  receivedChannelMsg = e.data;
};
channel.postMessage({ type: 'TASK_DELETED', id: 'task-test-99' });
assert.ok(receivedChannelMsg, 'BroadcastChannel must pass message');
assert.strictEqual(receivedChannelMsg.id, 'task-test-99');
console.log('  ✅ 3. BroadcastChannel real-time message bus simulation verified');

// 4. Verify Audio & Speech Synthesis Mocks
const audioCtx = new globalThis.AudioContext();
assert.strictEqual(audioCtx.state, 'running');
const osc = audioCtx.createOscillator();
assert.ok(osc && typeof osc.start === 'function');
audioCtx.close();
assert.strictEqual(audioCtx.state, 'closed');

const utterance = new globalThis.SpeechSynthesisUtterance('Welcome to Cambridge IELTS Practice');
assert.strictEqual(utterance.text, 'Welcome to Cambridge IELTS Practice');
assert.strictEqual(utterance.lang, 'en-GB');
console.log('  ✅ 4. AudioContext & SpeechSynthesis mocks verified');

// 5. Verify Mock AI Evaluation Generator
const mockEval = DomSimulationHarness.createMockAiWritingEvaluation(8.0);
assert.strictEqual(mockEval.bandOverall, 8.0);
assert.ok(mockEval.threeSecondActionPlan, 'Must have 3-second actionable plan');
assert.ok(Array.isArray(mockEval.detailedImprovements), 'Must have detailed improvements');
console.log('  ✅ 5. Cambridge AI Evaluation payload generator verified');

// 6. Verify Vitest configuration & setup bootstrap
const vitestConfigPath = path.resolve(__dirname, '../vitest.config.js');
assert.ok(fs.existsSync(vitestConfigPath), 'vitest.config.js must exist');
const vitestConfigCode = fs.readFileSync(vitestConfigPath, 'utf8');
assert.ok(vitestConfigCode.includes('./tests/setupVitest.js'), 'Must register setupVitest.js in vitest.config.js');

const setupFilePath = path.resolve(__dirname, 'setupVitest.js');
assert.ok(fs.existsSync(setupFilePath), 'tests/setupVitest.js must exist');
console.log('  ✅ 6. Vitest configuration and environment setup bootstrap verified');

cleanup();
console.log('🎉 Step 78: Standardized Testing & DOM Simulation Mock Engine Architecture passed cleanly!');
