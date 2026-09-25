import { useState, useEffect } from 'react';
import { safeGet, safeSet } from '../utils/storageService.js';

/**
 * Lightweight, zero-dependency Pub/Sub Application State Store.
 * Centralizes cross-cutting preferences:
 * - CDI Display settings (fontSize, contrast)
 * - All-skill mastered items
 * - Global active skill & ergonomical UI toggles (focusMode, slimHeader)
 * Eliminates redundant prop drilling and ensures 0ms instant reactivity.
 */

// Initial state loaded resiliently from storageService
let state = {
  cdiFontSize: safeGet('ielts_cdi_font_size', 'standard'),
  cdiContrast: safeGet('ielts_cdi_contrast', 'standard'),
  masteredItemIds: safeGet('ielts_mastered_items', []),
  activeSkill: safeGet('ielts_active_skill', 'writing'),
  isFocusMode: safeGet('ielts_focus_mode', false),
  isSlimHeader: safeGet('ielts_slim_header', false)
};

const listeners = new Set();

function emitChange() {
  listeners.forEach(listener => listener(state));
}

/**
 * Get current snapshot of app store state
 */
export function getAppState() {
  return state;
}

/**
 * Update partial app store state and persist relevant keys
 */
export function setAppState(partial) {
  state = {
    ...state,
    ...partial
  };

  // Persist modified keys to safe storage
  if ('cdiFontSize' in partial) safeSet('ielts_cdi_font_size', partial.cdiFontSize);
  if ('cdiContrast' in partial) safeSet('ielts_cdi_contrast', partial.cdiContrast);
  if ('masteredItemIds' in partial) safeSet('ielts_mastered_items', partial.masteredItemIds);
  if ('activeSkill' in partial) safeSet('ielts_active_skill', partial.activeSkill);
  if ('isFocusMode' in partial) safeSet('ielts_focus_mode', partial.isFocusMode);
  if ('isSlimHeader' in partial) safeSet('ielts_slim_header', partial.isSlimHeader);

  emitChange();
}

export function setCdiFontSize(size) {
  setAppState({ cdiFontSize: size });
}

export function setCdiContrast(contrast) {
  setAppState({ cdiContrast: contrast });
}

export function setActiveSkill(skill) {
  setAppState({ activeSkill: skill });
}

export function toggleFocusMode() {
  setAppState({ isFocusMode: !state.isFocusMode });
}

export function toggleSlimHeader() {
  setAppState({ isSlimHeader: !state.isSlimHeader });
}

export function isItemMastered(id) {
  if (!id) return false;
  return Array.isArray(state.masteredItemIds) && state.masteredItemIds.includes(id);
}

export function toggleMasteredItem(id) {
  if (!id) return;
  const current = Array.isArray(state.masteredItemIds) ? state.masteredItemIds : [];
  const exists = current.includes(id);
  const updated = exists ? current.filter(item => item !== id) : [...current, id];
  setAppState({ masteredItemIds: updated });
}

/**
 * React hook to subscribe to App Store with zero unnecessary re-renders
 * @param {Function} [selector] - Optional selector function, defaults to identity
 */
export function useAppStore(selector = s => s) {
  const [selectedState, setSelectedState] = useState(() => selector(state));

  useEffect(() => {
    const handleUpdate = (newState) => {
      const nextSelected = selector(newState);
      setSelectedState(prev => {
        if (prev === nextSelected) return prev;
        return nextSelected;
      });
    };

    listeners.add(handleUpdate);
    return () => listeners.delete(handleUpdate);
  }, [selector]);

  return selectedState;
}
