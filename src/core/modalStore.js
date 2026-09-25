import { useState, useEffect } from 'react';

/**
 * Lightweight, zero-dependency Pub/Sub Modal Store for IELTS Web Platform.
 * Centralizes modal open/close lifecycle, eliminating ~25 useState declarations
 * and prop drilling across App.jsx, Navbar.jsx, and workspaces.
 */

// Initial state for all 20+ modals in the platform
let state = {
  auth: false,
  drills: false,
  vocabGrammar: false,
  weeklyReport: false,
  feedback: false,
  generator: false,
  library: false,
  notebook: false,
  mistakeLog: false,
  history: false,
  theory: false,
  paraphrase: false,
  settings: false,
  ideaMatrix: false,
  revision: false,
  ingest: false,
  mockTest: false,
  diagnostic: false,
  featuresGuide: false,
  profile: false,
  contact: false,
  onboarding: false,
  prescription: false,
  trfSimulator: false,
  growthAnalytics: false
};

const listeners = new Set();

function emitChange() {
  listeners.forEach(listener => listener(state));
}

/**
 * Returns current snapshot of all modals.
 */
export function getModalState() {
  return state;
}

/**
 * Checks if a specific modal is open.
 * @param {string} modalName
 */
export function isModalOpen(modalName) {
  return Boolean(state[modalName]);
}

/**
 * Opens a modal by name, with an optional payload.
 * @param {string} modalName - Identifier of modal (e.g. 'settings', 'generator', 'library')
 * @param {any} [payload=true] - Optional payload or boolean true
 */
export function openModal(modalName, payload = true) {
  state = {
    ...state,
    [modalName]: payload
  };
  emitChange();
}

/**
 * Closes a modal by name, or closes all modals if no name is provided.
 * @param {string} [modalName] - Identifier of modal to close
 */
export function closeModal(modalName) {
  if (modalName) {
    state = {
      ...state,
      [modalName]: false
    };
  } else {
    const nextState = {};
    for (const key of Object.keys(state)) {
      nextState[key] = false;
    }
    state = nextState;
  }
  emitChange();
}

/**
 * Toggles a modal open/close status.
 * @param {string} modalName
 */
export function toggleModal(modalName) {
  if (state[modalName]) {
    closeModal(modalName);
  } else {
    openModal(modalName);
  }
}

/**
 * React hook to access modal state and dispatch open/close events.
 */
export function useModalStore() {
  const [modalState, setModalState] = useState(state);

  useEffect(() => {
    listeners.add(setModalState);
    return () => listeners.delete(setModalState);
  }, []);

  return {
    modals: modalState,
    openModal,
    closeModal,
    toggleModal,
    isModalOpen: (name) => Boolean(modalState[name]),
    getModalPayload: (name) => modalState[name]
  };
}
