import React, { useEffect, useRef, useCallback } from 'react';
import MusicLineCard from './MusicLineCard.jsx';
import { useVisualViewport } from '../../hooks/useVisualViewport.js';

export default function MusicLyricsCanvas({
  blueprint,
  activeLineIndex = 0,
  isPlaying = false,
  isEn = false,
  showTranslation = true,
  showPhoneticTips = true,
  wordInputs = {},
  sentenceInputs = {},
  revealedLines = {},
  onWordInputChange,
  onSentenceInputChange,
  onRevealLine,
  onHintLine,
  onSeekToLine,
  onReplayLine,
  onPracticeLinePronunciation
}) {
  const containerRef = useRef(null);
  const inputRefsMap = useRef(new Map());
  const { scrollToActiveElement } = useVisualViewport();

  const registerInputRef = useCallback((key, element) => {
    if (element) {
      inputRefsMap.current.set(key, element);
    } else {
      inputRefsMap.current.delete(key);
    }
  }, []);

  // Build ordered list of interactive input keys for instant auto-advance focus
  const orderedInputKeys = React.useMemo(() => {
    const keys = [];
    const lines = blueprint?.lines || [];
    lines.forEach((line) => {
      if (line.lineType === 'word_blank') {
        (line.blankWordIndices || []).forEach((tokIdx) => {
          keys.push({ key: `${line.index}:${tokIdx}`, lineIdx: line.index });
        });
      } else if (line.lineType === 'sentence_blank') {
        keys.push({ key: `${line.index}:sentence`, lineIdx: line.index });
      }
    });
    return keys;
  }, [blueprint]);

  // Move focus smoothly to the next blank input (or next sentence input)
  const handleAdvanceFromBlank = useCallback(
    (currentLineIdx, currentTokenIdx) => {
      const currentKey =
        currentTokenIdx === null || currentTokenIdx === undefined
          ? `${currentLineIdx}:sentence`
          : `${currentLineIdx}:${currentTokenIdx}`;

      const idxInOrder = orderedInputKeys.findIndex(item => item.key === currentKey);
      if (idxInOrder !== -1 && idxInOrder + 1 < orderedInputKeys.length) {
        const nextTarget = orderedInputKeys[idxInOrder + 1];
        const nextEl = inputRefsMap.current.get(nextTarget.key);
        if (nextEl && !nextEl.disabled) {
          nextEl.focus();
          scrollToActiveElement(nextEl);
          // If advancing to a new line, seek audio to that line so learner hears it immediately
          if (nextTarget.lineIdx !== currentLineIdx) {
            onSeekToLine?.(nextTarget.lineIdx, true);
          }
        }
      }
    },
    [orderedInputKeys, onSeekToLine, scrollToActiveElement]
  );

  // Auto-scroll active lyric line into view when song progresses
  useEffect(() => {
    if (!containerRef.current) return;
    const activeCard = containerRef.current.querySelector(`[data-line-index="${activeLineIndex}"]`);
    if (activeCard) {
      activeCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLineIndex]);

  const lines = blueprint?.lines || [];

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 bg-slate-50/70 dark:bg-slate-950/80"
    >
      {lines.map((line) => (
        <MusicLineCard
          key={line.id || line.index}
          line={line}
          isActive={line.index === activeLineIndex}
          isPlaying={isPlaying}
          isEn={isEn}
          showTranslation={showTranslation}
          showPhoneticTips={showPhoneticTips}
          wordInputsForLine={wordInputs[line.index] || {}}
          sentenceInputForLine={sentenceInputs[line.index] || ''}
          isLineRevealed={Boolean(revealedLines[line.index])}
          onWordInputChange={onWordInputChange}
          onSentenceInputChange={onSentenceInputChange}
          onRevealLine={onRevealLine}
          onHintLine={onHintLine}
          onSeekToLine={onSeekToLine}
          onReplayLine={onReplayLine}
          onAdvanceFromBlank={handleAdvanceFromBlank}
          onPracticeLinePronunciation={onPracticeLinePronunciation}
          registerInputRef={registerInputRef}
        />
      ))}
    </div>
  );
}
