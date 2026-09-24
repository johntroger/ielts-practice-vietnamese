import { useEffect } from 'react';

/**
 * Custom hook for registering global application keyboard shortcuts.
 * Supports:
 * - Alt + F: Toggle Focus Mode
 * - Alt + K: Open Task Library
 * - Alt + M: Toggle Mastered task status
 * - Alt + T: Open Theory handbook
 * - ?: Open Keyboard Shortcuts guide (when not typing in an input/textarea)
 * - Escape: Close shortcuts modal or exit focus mode
 */
export function useKeyboardShortcuts({
  toggleFocusMode,
  onOpenLibrary,
  onToggleMastered,
  currentTaskId,
  onOpenTheory,
  onOpenHelp,
  isShortcutsOpen,
  setIsShortcutsOpen,
  isFocusMode,
  setIsFocusMode
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F1 or Alt + H: Open Help Center & Features Guide
      if (e.key === 'F1' || (e.altKey && (e.key === 'h' || e.key === 'H'))) {
        e.preventDefault();
        if (onOpenHelp) onOpenHelp();
        return;
      }
      const activeEl = document.activeElement;
      const isEditing = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable
      );

      // Alt + F / Option + F: Toggle Focus Mode
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        if (toggleFocusMode) toggleFocusMode();
        return;
      }

      // Alt + K / Option + K: Open Task Library
      if (e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (onOpenLibrary) onOpenLibrary();
        return;
      }

      // Alt + M / Option + M: Toggle Mastered Task
      if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        if (currentTaskId && onToggleMastered) {
          onToggleMastered(currentTaskId);
        }
        return;
      }

      // Alt + T / Option + T: Open Theory Handbook
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        if (onOpenTheory) onOpenTheory();
        return;
      }

      // Escape key: exit shortcuts modal if open, or exit focus mode if active
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          if (setIsShortcutsOpen) setIsShortcutsOpen(false);
          return;
        }
        if (isFocusMode) {
          if (setIsFocusMode) setIsFocusMode(false);
          return;
        }
      }

      // '?' key: Open Keyboard Shortcuts modal (only when not typing in an input/textarea)
      if (e.key === '?' && !isEditing && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        if (setIsShortcutsOpen) {
          setIsShortcutsOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleFocusMode,
    onOpenLibrary,
    onToggleMastered,
    currentTaskId,
    onOpenTheory,
    onOpenHelp,
    isShortcutsOpen,
    setIsShortcutsOpen,
    isFocusMode,
    setIsFocusMode
  ]);
}
