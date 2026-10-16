/**
 * src/utils/hapticHelper.js
 * 
 * Tactile Haptic Vibration Engine for Atlas English Arena.
 * Employs standard W3C Web Vibration API (navigator.vibrate) to deliver
 * high-fidelity tactile game feel on mobile and supported devices.
 * 
 * Features:
 * - Safe feature detection (silently no-ops in Node.js or unsupported browsers)
 * - Mute respect (can be disabled via settings)
 * - Calibrated haptic patterns:
 *   - 'correct': crisp 15ms single tap
 *   - 'wrong': [40, 50, 40] double warning buzz
 *   - 'nearMiss': 25ms warning nudge
 *   - 'combo': [20, 30, 20] ascending celebration
 *   - 'boss': [60, 40, 100] heavy victory pulse
 *   - 'loot': [30, 40, 30, 40, 60] fanfare ripple
 *   - 'shieldBreak': [80, 40, 80] damage crunch
 *   - 'chipTap': 10ms micro-tap for quick-affix buttons
 */

export const HAPTIC_PATTERNS = {
  correct: 15,
  wrong: [40, 50, 40],
  nearMiss: 25,
  combo: [20, 30, 20],
  boss: [60, 40, 100],
  loot: [30, 40, 30, 40, 60],
  shieldBreak: [80, 40, 80],
  chipTap: 10
};

let isHapticEnabled = true;

/**
 * Checks if Vibration API is available on the current device.
 */
export function isHapticSupported() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/**
 * Toggles haptic feedback preference.
 */
export function setHapticEnabled(enabled) {
  isHapticEnabled = Boolean(enabled);
}

export function getHapticEnabled() {
  return isHapticEnabled;
}

/**
 * Triggers physical vibration pattern on supported mobile devices.
 * 
 * @param {string|number|Array<number>} patternOrPreset - Preset name or custom ms array
 * @returns {boolean} Whether vibration was dispatched
 */
export function triggerHaptic(patternOrPreset = 'correct') {
  if (!isHapticEnabled || !isHapticSupported()) {
    return false;
  }

  try {
    const pattern = typeof patternOrPreset === 'string'
      ? (HAPTIC_PATTERNS[patternOrPreset] || 15)
      : patternOrPreset;

    return navigator.vibrate(pattern);
  } catch (err) {
    // Non-blocking for haptics
    return false;
  }
}
