/**
 * DOM & Browser Simulation Mock Engine (Step 78: Testing Standardization Architecture)
 * Provides a lightweight, 100% offline, zero-dependency browser runtime environment
 * for testing React custom hooks, storage adapters, speech synthesis, and cross-tab sync.
 */

export class DomSimulationHarness {
  /**
   * Initializes or resets global browser mocks in Node.js runtime.
   */
  static setupEnvironment() {
    const memoryStorage = new Map();

    // 1. LocalStorage Mock
    globalThis.localStorage = {
      getItem: (key) => memoryStorage.get(key) || null,
      setItem: (key, val) => memoryStorage.set(key, String(val)),
      removeItem: (key) => memoryStorage.delete(key),
      clear: () => memoryStorage.clear(),
      get length() {
        return memoryStorage.size;
      },
      key: (i) => Array.from(memoryStorage.keys())[i] || null
    };

    // 2. Window Event Target Mock
    const eventListeners = new Map();
    globalThis.window = {
      localStorage: globalThis.localStorage,
      addEventListener: (type, listener) => {
        if (!eventListeners.has(type)) eventListeners.set(type, new Set());
        eventListeners.get(type).add(listener);
      },
      removeEventListener: (type, listener) => {
        if (eventListeners.has(type)) eventListeners.get(type).delete(listener);
      },
      dispatchEvent: (event) => {
        const listeners = eventListeners.get(event.type);
        if (listeners) {
          listeners.forEach(fn => fn(event));
        }
        return true;
      },
      confirm: () => true,
      alert: () => {},
      speechSynthesis: {
        speak: () => {},
        cancel: () => {},
        getVoices: () => [{ lang: 'en-GB', name: 'UK English' }]
      }
    };

    // 3. Document Mock
    globalThis.document = {
      createElement: (tagName) => ({
        tagName: tagName.toUpperCase(),
        style: {},
        setAttribute: () => {},
        getAttribute: () => null,
        addEventListener: () => {},
        removeEventListener: () => {},
        click: () => {},
        classList: {
          add: () => {},
          remove: () => {},
          toggle: () => {},
          contains: () => false
        }
      }),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    };

    // 4. BroadcastChannel Mock
    class MockBroadcastChannel {
      constructor(name) {
        this.name = name;
        this.onmessage = null;
      }
      postMessage(msg) {
        if (typeof this.onmessage === 'function') {
          this.onmessage({ data: msg });
        }
      }
      close() {}
    }
    globalThis.BroadcastChannel = MockBroadcastChannel;

    // 5. AudioContext Mock
    class MockAudioContext {
      constructor() {
        this.state = 'running';
      }
      createGain() {
        return { gain: { value: 1 }, connect: () => {} };
      }
      createOscillator() {
        return {
          frequency: { value: 440 },
          connect: () => {},
          start: () => {},
          stop: () => {}
        };
      }
      close() {
        this.state = 'closed';
      }
    }
    globalThis.AudioContext = MockAudioContext;
    globalThis.webkitAudioContext = MockAudioContext;

    // 6. SpeechSynthesisUtterance Mock
    class MockSpeechSynthesisUtterance {
      constructor(text) {
        this.text = text;
        this.lang = 'en-GB';
        this.rate = 1;
        this.pitch = 1;
        this.volume = 1;
        this.onend = null;
        this.onerror = null;
      }
    }
    globalThis.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

    return {
      memoryStorage,
      eventListeners,
      cleanup: () => {
        memoryStorage.clear();
        eventListeners.clear();
      }
    };
  }

  /**
   * Fires a synthetic storage event to simulate cross-tab updates.
   */
  static triggerCrossTabStorageEvent(key, oldValue, newValue) {
    if (globalThis.window?.dispatchEvent) {
      globalThis.window.dispatchEvent({
        type: 'storage',
        key,
        oldValue,
        newValue,
        url: 'https://ielts-practice-vietnamese.vercel.app'
      });
    }
  }

  /**
   * Generates mock AI evaluation payload conforming to Cambridge assessment contracts.
   */
  static createMockAiWritingEvaluation(band = 7.5) {
    return {
      bandOverall: band,
      taskAchievement: band,
      coherenceCohesion: band,
      lexicalResource: band,
      grammaticalRangeAccuracy: band,
      feedbackGeneral: 'Well-structured argument with strong critical synthesis.',
      threeSecondActionPlan: {
        highlightQuote: 'While AI may disrupt traditional roles, it fosters novel opportunities.',
        priorityBandBooster: 'Enrich topical collocations in conclusion.',
        actionChecklist: [
          'Diversify conditional sentence forms',
          'Avoid repetitive transitions'
        ]
      },
      detailedImprovements: [
        { original: 'big impact', suggested: 'profound ramification', reason: 'Higher lexical register' }
      ]
    };
  }
}
