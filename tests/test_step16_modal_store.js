import { 
  openModal, 
  closeModal, 
  toggleModal, 
  getModalState, 
  isModalOpen 
} from '../src/core/modalStore.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('---------------------------------------------------------');
console.log('🧪 TEST SUITE: Step 16 - Modal Store Pub/Sub State Engine');
console.log('---------------------------------------------------------');

// Test 1: Initial state has all modals closed
closeModal(); // Ensure reset
let state = getModalState();
assert(isModalOpen('settings') === false, 'Settings modal initially closed');
assert(isModalOpen('library') === false, 'Library modal initially closed');
assert(isModalOpen('generator') === false, 'Generator modal initially closed');
assert(isModalOpen('mockTest') === false, 'MockTest modal initially closed');

// Test 2: openModal opens target modal
openModal('settings');
assert(isModalOpen('settings') === true, 'openModal("settings") sets settings to open');
assert(isModalOpen('library') === false, 'Other modals remain closed when settings is opened');

// Test 3: openModal with payload
openModal('history', { tab: 'speaking' });
assert(isModalOpen('history') === true, 'openModal("history", payload) opens history');
const historyPayload = getModalState().history;
assert(typeof historyPayload === 'object' && historyPayload.tab === 'speaking', 'History retains passed payload object');

// Test 4: closeModal closes specific modal
closeModal('settings');
assert(isModalOpen('settings') === false, 'closeModal("settings") closes settings modal');
assert(isModalOpen('history') === true, 'History remains open after closing settings');

// Test 5: toggleModal opens if closed, closes if open
closeModal('mockTest');
assert(isModalOpen('mockTest') === false, 'Mock test initially closed');
toggleModal('mockTest');
assert(isModalOpen('mockTest') === true, 'toggleModal("mockTest") opens mock test when closed');
toggleModal('mockTest');
assert(isModalOpen('mockTest') === false, 'toggleModal("mockTest") closes mock test when open');

// Test 6: Global closeModal() with no args closes all active modals
openModal('drills');
openModal('vocabGrammar');
openModal('theory');
assert(isModalOpen('drills') === true && isModalOpen('vocabGrammar') === true, 'Multiple modals opened simultaneously');
closeModal(); // close all
state = getModalState();
const anyOpen = Object.values(state).some(val => Boolean(val));
assert(anyOpen === false, 'Global closeModal() resets all modals to false');

console.log('---------------------------------------------------------');
console.log(`📊 RESULTS: Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All 11/11 Modal Store tests passed cleanly!');
  process.exit(0);
}
