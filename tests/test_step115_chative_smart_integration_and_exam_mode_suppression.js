/**
 * test_step115_chative_smart_integration_and_exam_mode_suppression.js
 * Verification test for Step 115:
 * Chative.io Live Chat Integration & Zero-Distraction Exam Mode Auto-Suppression
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  CHATIVE_CHANNEL_ID, 
  CHATIVE_SCRIPT_URL,
  setChativeExamMode, 
  isChativeSuppressed, 
  openChativeChat 
} from '../src/services/chativeService.js';

let passed = 0;
let total = 0;

function it(desc, fn) {
  total++;
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Testing Step 115: Chative.io Integration & Zero-Distraction Exam Mode...\n');

// 1. Verify index.html contains Chative script
it('index.html contains the authentic Chative.io messenger script with channel ID', () => {
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  assert(indexHtml.includes('https://messenger.svc.chative.io/static/v1.0/channels/s5a0235e6-235e-4984-84c5-b08491b71469/messenger.js?mode=livechat'), 'index.html must include Chative script tag');
  assert(indexHtml.includes('id="chative-messenger-script"'), 'Must have ID chative-messenger-script');
});

// 2. Verify channel ID constant
it('chativeService.js exports correct CHATIVE_CHANNEL_ID and script URL', () => {
  assert.strictEqual(CHATIVE_CHANNEL_ID, 's5a0235e6-235e-4984-84c5-b08491b71469');
  assert(CHATIVE_SCRIPT_URL.includes(CHATIVE_CHANNEL_ID));
});

// 3. Test offline safety when document and window are undefined
it('chativeService methods do not throw when window or document are undefined', () => {
  assert.doesNotThrow(() => {
    setChativeExamMode(true);
    setChativeExamMode(false);
    openChativeChat();
    isChativeSuppressed();
  });
});

// 4. Test exam mode suppression logic with mock DOM
it('setChativeExamMode toggles exam-mode-active class and invokes window.chative API', () => {
  const classList = new Set();
  const calls = [];

  global.document = {
    body: {
      classList: {
        add: (cls) => classList.add(cls),
        remove: (cls) => classList.delete(cls),
        contains: (cls) => classList.has(cls)
      }
    }
  };

  global.window = {
    chative: {
      hide: () => calls.push('hide'),
      show: () => calls.push('show'),
      open: () => calls.push('open')
    }
  };

  // Test entering exam mode
  setChativeExamMode(true);
  assert(isChativeSuppressed(), 'Body must have exam-mode-active when exam is active');
  assert(calls.includes('hide'), 'Must invoke window.chative.hide()');

  // Test exiting exam mode
  setChativeExamMode(false);
  assert(!isChativeSuppressed(), 'Body must remove exam-mode-active when exam ends');
  assert(calls.includes('show'), 'Must invoke window.chative.show()');

  // Test programmatic open
  openChativeChat();
  assert(calls.includes('open'), 'Must invoke window.chative.open()');

  delete global.document;
  delete global.window;
});

// 5. Verify CSS suppression rules in index.css
it('src/index.css includes zero-distraction suppression and mobile responsive positioning rules', () => {
  const css = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');
  assert(css.includes('body.exam-mode-active'), 'Must have body.exam-mode-active rule');
  assert(css.includes('display: none !important'), 'Must hide widget with display: none !important');
  assert(css.includes('z-index: 40 !important'), 'Must keep widget below z-50 modal layer');
  assert(css.includes('@media (max-width: 640px)'), 'Must have mobile responsive rules');
});

// 6. Verify wiring in App.jsx and SpeakingWorkspace.jsx
it('App.jsx and SpeakingWorkspace.jsx auto-suppress Chative during mock exams and speaking room', () => {
  const appJsx = fs.readFileSync(path.resolve('src/App.jsx'), 'utf-8');
  assert(appJsx.includes('setChativeExamMode'), 'App.jsx must import and use setChativeExamMode');
  assert(appJsx.includes('modals.mockTest'), 'App.jsx must watch modals.mockTest');

  const speakingJsx = fs.readFileSync(path.resolve('src/components/speaking/SpeakingWorkspace.jsx'), 'utf-8');
  assert(speakingJsx.includes('setChativeExamMode'), 'SpeakingWorkspace must import and use setChativeExamMode');
  assert(speakingJsx.includes('isInMockExamRoom'), 'SpeakingWorkspace must watch isInMockExamRoom');
});

console.log(`\n===============================================================`);
console.log(`✅ All ${passed}/${total} Step 115 Chative integration tests passed cleanly!`);
console.log(`===============================================================\n`);
