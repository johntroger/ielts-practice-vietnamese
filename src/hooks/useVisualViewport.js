/**
 * Custom hook for Mobile Visual Viewport & Virtual Keyboard Resilience
 * Accurately tracks viewport dimension changes when the on-screen keyboard appears,
 * preventing inputs, active questions, or timers from being occluded on mobile devices.
 */

import { useState, useEffect, useCallback } from 'react';

export function useVisualViewport() {
  const [viewportData, setViewportData] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        offsetTop: 0,
        isKeyboardOpen: false,
        keyboardHeight: 0
      };
    }

    const vv = window.visualViewport;
    const height = vv ? vv.height : window.innerHeight;
    const width = vv ? vv.width : window.innerWidth;
    const isKeyboard = vv ? (window.innerHeight - vv.height > 150) : false;
    const keyboardHeight = isKeyboard ? (window.innerHeight - vv.height) : 0;

    return {
      width,
      height,
      offsetTop: vv ? vv.offsetTop : 0,
      isKeyboardOpen: isKeyboard,
      keyboardHeight
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleResizeOrScroll = () => {
      const vv = window.visualViewport;
      if (!vv) return;

      const fullHeight = window.innerHeight;
      const currentHeight = vv.height;
      const heightDiff = fullHeight - currentHeight;
      const isKeyboard = heightDiff > 150; // Standard threshold for mobile keyboard

      setViewportData({
        width: vv.width,
        height: currentHeight,
        offsetTop: vv.offsetTop,
        isKeyboardOpen: isKeyboard,
        keyboardHeight: isKeyboard ? heightDiff : 0
      });
    };

    window.visualViewport.addEventListener('resize', handleResizeOrScroll);
    window.visualViewport.addEventListener('scroll', handleResizeOrScroll);

    return () => {
      window.visualViewport.removeEventListener('resize', handleResizeOrScroll);
      window.visualViewport.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, []);

  /**
   * Helper to scroll active element smoothly into the visible viewport
   */
  const scrollToActiveElement = useCallback((elementOrRef, padding = 24) => {
    if (typeof window === 'undefined') return;
    const el = elementOrRef?.current || elementOrRef || document.activeElement;
    if (!el || typeof el.getBoundingClientRect !== 'function') return;

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const vvHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

      // If element is below the visible viewport or cut off by keyboard
      if (rect.bottom > vvHeight - padding || rect.top < padding) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }, []);

  return {
    ...viewportData,
    scrollToActiveElement
  };
}
