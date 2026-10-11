/**
 * src/hooks/useArenaAudio.js
 * 
 * Ergonomic Audio Controller for Atlas English Arena.
 * Manages soundcheck harmonic chimes, Cambridge speech synthesis,
 * mute toggles, and safe user-gesture AudioContext unlocks.
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  playSoundcheck, 
  speakArenaText, 
  stopAllAudio, 
  unlockAudioContext 
} from '../utils/audioHelper.js';

export function useArenaAudio() {
  const [isMuted, setIsMuted] = useState(false);

  const unlockAudio = useCallback(() => {
    unlockAudioContext();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) {
        stopAllAudio();
      }
      return next;
    });
  }, []);

  const playChime = useCallback((callbacks = {}) => {
    if (isMuted) return;
    playSoundcheck(callbacks);
  }, [isMuted]);

  const speak = useCallback((text, callbacks = {}) => {
    if (isMuted || !text) return;
    speakArenaText(text, callbacks);
  }, [isMuted]);

  const stopAudio = useCallback(() => {
    stopAllAudio();
  }, []);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  return {
    isMuted,
    toggleMute,
    playChime,
    speak,
    stopAudio,
    unlockAudio
  };
}
