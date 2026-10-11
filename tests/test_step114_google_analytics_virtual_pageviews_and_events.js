/**
 * test_step114_google_analytics_virtual_pageviews_and_events.js
 * Verification test for Step 114:
 * Google Analytics 4 (GA4) Integration, Virtual Pageviews & SPA Section Analytics
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  GA_MEASUREMENT_ID, 
  trackPageView, 
  trackEvent, 
  trackSkillView, 
  trackModalView 
} from '../src/services/analyticsService.js';
import { openModal, closeModal, isModalOpen } from '../src/core/modalStore.js';

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

console.log('🧪 Testing Step 114: Google Analytics 4 & Virtual Pageview Routing...\n');

// 1. Verify index.html contains official Google tag snippet with measurement ID
it('index.html contains official Google Tag (gtag.js) script with ID G-H2Z67KN0ZX', () => {
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  assert(indexHtml.includes('https://www.googletagmanager.com/gtag/js?id=G-H2Z67KN0ZX'), 'Must load gtag.js with G-H2Z67KN0ZX');
  assert(indexHtml.includes("gtag('config', 'G-H2Z67KN0ZX');"), 'Must initialize gtag config with G-H2Z67KN0ZX');
});

// 2. Verify GA_MEASUREMENT_ID constant
it('analyticsService.js exports GA_MEASUREMENT_ID as G-H2Z67KN0ZX', () => {
  assert.strictEqual(GA_MEASUREMENT_ID, 'G-H2Z67KN0ZX');
});

// 3. Test offline safety (when window / window.gtag is not defined)
it('analytics functions do not throw errors when window.gtag is undefined', () => {
  assert.doesNotThrow(() => {
    trackPageView('/test-path', 'Test Screen');
    trackEvent('test_event', { key: 'value' });
    trackSkillView('writing');
    trackModalView('mockTest');
  });
});

// 4. Test with mock window.gtag
it('trackPageView and trackEvent correctly dispatch events to window.gtag when available', () => {
  const recordedEvents = [];
  
  // Set up mock global window and gtag
  global.window = {
    location: { origin: 'https://ielts.example.com' },
    gtag: function(type, name, params) {
      recordedEvents.push({ type, name, params });
    }
  };

  trackPageView('/reading', 'IELTS Reading Workspace');
  assert.strictEqual(recordedEvents.length, 1);
  assert.strictEqual(recordedEvents[0].type, 'event');
  assert.strictEqual(recordedEvents[0].name, 'page_view');
  assert.strictEqual(recordedEvents[0].params.page_path, '/reading');
  assert.strictEqual(recordedEvents[0].params.page_title, 'IELTS Reading Workspace');
  assert.strictEqual(recordedEvents[0].params.page_location, 'https://ielts.example.com/reading');

  trackEvent('submit_essay', { taskType: 'task2', wordCount: 290 });
  assert.strictEqual(recordedEvents.length, 2);
  assert.strictEqual(recordedEvents[1].name, 'submit_essay');
  assert.strictEqual(recordedEvents[1].params.wordCount, 290);
});

// 5. Test trackSkillView generates both virtual pageview and skill_switch custom event
it('trackSkillView virtualizes skill workspaces into unique page_views and skill_switch events', () => {
  const recordedEvents = [];
  global.window.gtag = function(type, name, params) {
    recordedEvents.push({ type, name, params });
  };

  trackSkillView('speaking');
  
  // Expect 2 calls: 1 page_view event + 1 skill_switch event
  assert.strictEqual(recordedEvents.length, 2);
  
  const pageView = recordedEvents.find(e => e.name === 'page_view');
  assert(pageView, 'Must send page_view event');
  assert.strictEqual(pageView.params.page_path, '/speaking');
  assert(pageView.params.page_title.includes('Speaking Studio'));

  const skillEvent = recordedEvents.find(e => e.name === 'skill_switch');
  assert(skillEvent, 'Must send skill_switch event');
  assert.strictEqual(skillEvent.params.skill, 'speaking');
});

// 6. Test trackModalView virtualizes modals into screen page_views and modal_open events
it('trackModalView virtualizes modal opens into unique /modals/* page_views and modal_open events', () => {
  const recordedEvents = [];
  global.window.gtag = function(type, name, params) {
    recordedEvents.push({ type, name, params });
  };

  trackModalView('mockTest');
  
  // Expect 2 calls: 1 page_view event + 1 modal_open event
  assert.strictEqual(recordedEvents.length, 2);
  
  const pageView = recordedEvents.find(e => e.name === 'page_view');
  assert(pageView, 'Must send page_view event for modal');
  assert.strictEqual(pageView.params.page_path, '/modals/mockTest');
  assert(pageView.params.page_title.includes('60-Minute High-Pressure Mock Test'));

  const modalEvent = recordedEvents.find(e => e.name === 'modal_open');
  assert(modalEvent, 'Must send modal_open event');
  assert.strictEqual(modalEvent.params.modal_name, 'mockTest');
});

// 7. Verify modalStore automatically triggers GA4 modal tracking when openModal is invoked
it('modalStore.openModal automatically dispatches GA4 tracking', () => {
  const recordedEvents = [];
  global.window.gtag = function(type, name, params) {
    recordedEvents.push({ type, name, params });
  };

  openModal('theory');
  assert(isModalOpen('theory'), 'Modal must be open in store');
  
  const modalPage = recordedEvents.find(e => e.params?.page_path === '/modals/theory');
  assert(modalPage, 'modalStore.openModal must automatically track /modals/theory in GA4');
  
  closeModal('theory');
  assert(!isModalOpen('theory'), 'Modal must be closed');
});

// Clean up mock window
delete global.window;

console.log(`\n===============================================================`);
console.log(`✅ All ${passed}/${total} Step 114 Google Analytics tests passed cleanly!`);
console.log(`===============================================================\n`);
