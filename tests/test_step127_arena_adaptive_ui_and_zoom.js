/**
 * tests/test_step127_arena_adaptive_ui_and_zoom.js
 * 
 * Verifies Phase 2.3:
 * 1. ArenaQuestionCard adaptive grid (3-column layout for TFNG/3 options)
 * 2. Monospace font styling for spelling trap options
 * 3. Space key guard with e.preventDefault() in keyboard navigator
 * 4. ArenaMediaViewer Lightbox Zoom functionality with Esc key handling
 * 5. Multi-level zoom scaling (ZoomIn, ZoomOut, Reset)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { setupKeyboardNavigation } from '../src/utils/keyboardNavigator.js';

describe('Step 127: Adaptive Question UI, Monospace Spelling & Lightbox Zoom Engine', () => {

  it('1. ArenaQuestionCard implements responsive 3-column grid for TFNG and monospace for spelling', () => {
    const cardCode = fs.readFileSync(path.resolve('src/components/arena/ArenaQuestionCard.jsx'), 'utf-8');
    
    // Check adaptive grid logic
    assert.ok(cardCode.includes('question.options.length === 3'), 'Must check for 3 options');
    assert.ok(cardCode.includes('grid-cols-1 sm:grid-cols-3'), 'Must support 3 columns for TFNG / 3 options');
    
    // Check monospace styling for spelling trap options
    assert.ok(cardCode.includes('isSpelling = question.type === \'spelling\''), 'Must identify spelling questions');
    assert.ok(cardCode.includes('font-mono tracking-wide'), 'Must apply font-mono to spelling options');
  });

  it('2. ArenaMediaViewer supports Lightbox Zoom, ESC listener, and zoom controls', () => {
    const viewerCode = fs.readFileSync(path.resolve('src/components/arena/ArenaMediaViewer.jsx'), 'utf-8');
    
    // Check Escape listener
    assert.ok(viewerCode.includes('e.key === \'Escape\''), 'Must listen to Escape key to close modal');
    assert.ok(viewerCode.includes('setZoomScale(1)'), 'Must reset zoom scale on close');
    
    // Check Zoom controls
    assert.ok(viewerCode.includes('setZoomScale(prev => Math.min(2.5'), 'Must support Zoom In up to 2.5x');
    assert.ok(viewerCode.includes('setZoomScale(prev => Math.max(0.75'), 'Must support Zoom Out down to 0.75x');
    assert.ok(viewerCode.includes('style={{ transform: `scale(${zoomScale})` }}'), 'Must apply scale transform to media');
  });

  it('3. keyboardNavigator strictly prevents default spacebar page scrolling and guards input focus', () => {
    let spaceCalled = false;
    let selectedOption = null;
    let submitted = false;

    // Simulate mock window
    const listeners = {};
    global.window = {
      addEventListener: (evt, fn) => { listeners[evt] = fn; },
      removeEventListener: (evt) => { delete listeners[evt]; }
    };

    const cleanup = setupKeyboardNavigation({
      onSelectOption: (idx) => { selectedOption = idx; },
      onSubmit: () => { submitted = true; },
      onSpaceAudio: () => { spaceCalled = true; },
      isActive: true
    });

    assert.ok(typeof listeners.keydown === 'function', 'Listener must be attached to window');

    // Test Spacebar event
    let defaultPrevented = false;
    listeners.keydown({
      code: 'Space',
      preventDefault: () => { defaultPrevented = true; },
      target: { tagName: 'DIV' }
    });
    assert.strictEqual(spaceCalled, true, 'Spacebar must trigger audio callback');
    assert.strictEqual(defaultPrevented, true, 'Spacebar must preventDefault() to avoid page scrolling');

    // Test Number keys 1-4
    defaultPrevented = false;
    listeners.keydown({
      key: '3',
      preventDefault: () => { defaultPrevented = true; },
      target: { tagName: 'DIV' }
    });
    assert.strictEqual(selectedOption, 2, 'Key 3 must select option index 2');
    assert.strictEqual(defaultPrevented, true, 'Number key must preventDefault()');

    // Test Input Guard (when typing in an input field, hotkeys must be ignored)
    spaceCalled = false;
    selectedOption = null;
    listeners.keydown({
      code: 'Space',
      preventDefault: () => {},
      target: { tagName: 'INPUT' }
    });
    assert.strictEqual(spaceCalled, false, 'Hotkeys must be ignored inside INPUT');

    cleanup();
    assert.strictEqual(listeners.keydown, undefined, 'Cleanup must remove keydown listener');
    delete global.window;
  });

});
