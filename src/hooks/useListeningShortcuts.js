import { useEffect } from 'react';

/**
 * Dedicated Custom Hook for Listening Audio Shortcuts
 * Supports:
 * - Spacebar: Play/Pause audio (safe against typing in text inputs/modals)
 * - ArrowLeft / ArrowRight: Rewind/Fast-forward 5s (in practice mode)
 * - ArrowUp / ArrowDown: Adjust headphone volume (+/- 0.05)
 * - 'm' / 'M': Mute / Unmute audio
 */
export function useListeningShortcuts({
  audioEngine,
  examMode = 'practice',
  isEnabled = true,
  isModalOpen = false
}) {
  useEffect(() => {
    if (!isEnabled || !audioEngine || isModalOpen) return;

    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable element
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      const isEditable = document.activeElement && (document.activeElement.isContentEditable || activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select');
      
      if (isEditable) return;

      // 1. Space: Play / Pause toggle
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (audioEngine.isPlaying) {
          audioEngine.pause();
        } else {
          audioEngine.play();
        }
        return;
      }

      // 2. ArrowLeft / ArrowRight: Seek +/- 5s (Allowed in Practice Mode)
      if (examMode !== 'strict') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const target = Math.max(0, (audioEngine.currentTime || 0) - 5);
          audioEngine.seek(target);
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const target = Math.min(audioEngine.duration || Infinity, (audioEngine.currentTime || 0) + 5);
          audioEngine.seek(target);
          return;
        }
      }

      // 3. ArrowUp / ArrowDown: Volume control
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentVol = typeof audioEngine.volume === 'number' ? audioEngine.volume : 1.0;
        const nextVol = Math.min(1.0, Math.round((currentVol + 0.05) * 100) / 100);
        audioEngine.changeVolume(nextVol);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentVol = typeof audioEngine.volume === 'number' ? audioEngine.volume : 1.0;
        const nextVol = Math.max(0.0, Math.round((currentVol - 0.05) * 100) / 100);
        audioEngine.changeVolume(nextVol);
        return;
      }

      // 4. 'm' or 'M': Mute toggle
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const currentVol = typeof audioEngine.volume === 'number' ? audioEngine.volume : 1.0;
        if (currentVol > 0) {
          audioEngine.changeVolume(0);
        } else {
          audioEngine.changeVolume(0.8);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioEngine, examMode, isEnabled, isModalOpen]);

  return { isEnabled };
}
