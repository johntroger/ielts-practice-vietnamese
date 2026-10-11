/**
 * chativeService.js
 * Intelligent Controller for Chative.io Live Chat Widget.
 * Ensures zero cognitive distraction during high-pressure Cambridge tests
 * by auto-hiding the chat bubble when exams or live speaking rooms are active.
 */

export const CHATIVE_CHANNEL_ID = 's5a0235e6-235e-4984-84c5-b08491b71469';
export const CHATIVE_SCRIPT_URL = `https://messenger.svc.chative.io/static/v1.0/channels/${CHATIVE_CHANNEL_ID}/messenger.js?mode=livechat`;

/**
 * Toggles exam mode suppression for Chative widget.
 * @param {boolean} isExamActive - true if student is taking a high-pressure test
 */
export function setChativeExamMode(isExamActive) {
  if (typeof document === 'undefined') return;

  const body = document.body;
  if (!body) return;

  if (isExamActive) {
    body.classList.add('exam-mode-active');
    try {
      if (typeof window !== 'undefined') {
        const chativeApi = window.chative || window.Chative;
        if (chativeApi && typeof chativeApi.hide === 'function') {
          chativeApi.hide();
        }
      }
    } catch (e) {
      // Silently fall back to CSS suppression
    }
  } else {
    body.classList.remove('exam-mode-active');
    try {
      if (typeof window !== 'undefined') {
        const chativeApi = window.chative || window.Chative;
        if (chativeApi && typeof chativeApi.show === 'function') {
          chativeApi.show();
        }
      }
    } catch (e) {
      // Silently fall back to CSS display
    }
  }
}

/**
 * Programmatically opens Chative widget dialogue (e.g. from Navbar Help menu).
 */
export function openChativeChat() {
  if (typeof window === 'undefined') return;

  try {
    const chativeApi = window.chative || window.Chative;
    if (chativeApi && typeof chativeApi.open === 'function') {
      chativeApi.open();
      return;
    }
    
    // Fallback: trigger click on launcher button in DOM if present
    const launcher = document.querySelector('[class*="chative-launcher"], [id*="chative-launcher"], [data-chative-launcher]');
    if (launcher && typeof launcher.click === 'function') {
      launcher.click();
    }
  } catch (e) {
    console.warn('[chativeService] Could not trigger open dialogue:', e);
  }
}

/**
 * Checks whether Chative is currently suppressed due to exam mode.
 */
export function isChativeSuppressed() {
  if (typeof document === 'undefined') return false;
  return document.body?.classList.contains('exam-mode-active') || false;
}
