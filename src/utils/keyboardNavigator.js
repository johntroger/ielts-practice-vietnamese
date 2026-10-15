/**
 * src/utils/keyboardNavigator.js
 * 
 * Ergonomic Keyboard Controller for Atlas English Arena.
 * Features:
 * - 2-Step Enter Flow (Select -> Check -> Advance)
 * - Number keys 1-4 for instant answer selection
 * - Spacebar to re-listen audio
 * - Esc key to Skip difficult questions gracefully
 * - Strict Input Focus Guard: ignores events when typing in input/textarea/contentEditable
 */

export function setupKeyboardNavigation({
  onSelectOption,
  onSubmit,
  onSkip,
  onSpaceAudio,
  isActive = true
}) {
  if (typeof window === 'undefined') return () => {};

  const handleKeyDown = (e) => {
    if (!isActive) return;

    // Strict Input Focus Guard
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onSkip?.();
      }
      return;
    }

    // Number keys 1, 2, 3, 4
    if (['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      const index = parseInt(e.key, 10) - 1;
      onSelectOption?.(index);
      return;
    }

    // Enter: 2-Step Check / Advance
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.();
      return;
    }

    // Escape: Skip question
    if (e.key === 'Escape') {
      e.preventDefault();
      onSkip?.();
      return;
    }

    // Space: Audio replay
    if (e.code === 'Space') {
      e.preventDefault();
      onSpaceAudio?.();
      return;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}
