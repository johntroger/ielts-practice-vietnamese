/**
 * src/hooks/useArenaAudio.js
 * 
 * Ergonomic Audio Controller for Atlas English Arena.
 * Manages soundcheck harmonic chimes, Cambridge speech synthesis,
 * mute toggles, and safe user-gesture AudioContext unlocks.
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  playChimeTone,
  playSoundcheck, 
  speakArenaText, 
  stopAllAudio, 
  unlockAudioContext,
  playArenaSfx
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
    playChimeTone(callbacks);
  }, [isMuted]);

  const speak = useCallback((textOrQuestion, questionOrCallbacks = {}) => {
    if (isMuted || !textOrQuestion) return;
    if (questionOrCallbacks && typeof questionOrCallbacks === 'object' && (questionOrCallbacks.audioUrl || questionOrCallbacks.isR2Audio || questionOrCallbacks.audioText)) {
      speakArenaText(questionOrCallbacks);
      return;
    }
    speakArenaText(textOrQuestion, questionOrCallbacks);
  }, [isMuted]);

  const playSfx = useCallback((type = 'correct') => {
    if (isMuted) return;
    playArenaSfx(type);
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
    playSfx,
    speak,
    stopAudio,
    unlockAudio
  };
}
