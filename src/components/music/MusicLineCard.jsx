import React, { memo, useState } from 'react';
import {
  Play,
  Volume2,
  CheckCircle2,
  Lightbulb,
  Eye,
  RotateCcw,
  Sparkles,
  Mic,
  AlertTriangle
} from 'lucide-react';
import {
  evaluateWordBlankAttempt,
  evaluateSentenceBlankAttempt
} from '../../utils/musicDictationGenerator.js';

const MusicLineCard = memo(function MusicLineCard({
  line,
  isActive = false,
  isPlaying = false,
  isEn = false,
  showTranslation = true,
  showPhoneticTips = true,
  wordInputsForLine = {},
  sentenceInputForLine = '',
  isLineRevealed = false,
  onWordInputChange,
  onSentenceInputChange,
  onRevealLine,
  onHintLine,
  onSeekToLine,
  onReplayLine,
  onAdvanceFromBlank,
  onPracticeLinePronunciation,
  registerInputRef
}) {
  const [hasSubmittedSentence, setHasSubmittedSentence] = useState(false);

  const lineIdx = line.index;
  const lineType = line.lineType; // 'anchor' | 'word_blank' | 'sentence_blank'

  // Evaluate word blanks status
  let solvedWordBlanks = 0;
  const totalWordBlanks = line.blankWordIndices?.length || 0;
  let nearMissMessage = '';

  if (lineType === 'word_blank') {
    line.tokens.forEach((tok) => {
      if (!tok.isBlank) return;
      const val = isLineRevealed ? tok.coreWord : (wordInputsForLine[tok.tokenIndex] || '');
      const ev = evaluateWordBlankAttempt(tok.coreWord, val);
      if (ev.isCorrect || isLineRevealed) {
        solvedWordBlanks++;
      } else if (ev.isNearMiss && !nearMissMessage) {
        nearMissMessage = isEn ? ev.messageEn : ev.messageVi;
      }
    });
  }

  // Evaluate sentence blank status
  const effectiveSentenceText = isLineRevealed ? line.text : (sentenceInputForLine || '');
  const sentenceEval =
    lineType === 'sentence_blank'
      ? evaluateSentenceBlankAttempt(line.text, effectiveSentenceText)
      : null;

  const isLineCompleted =
    lineType === 'anchor'
      ? true
      : lineType === 'word_blank'
      ? (totalWordBlanks > 0 && solvedWordBlanks === totalWordBlanks) || isLineRevealed
      : Boolean(sentenceEval?.isPassed || isLineRevealed);

  const handleKeyDownInBlank = (e, tokenIndex) => {
    if (e.key === 'Tab') {
      // Tab key replays the current lyric line immediately for hands-free dictation
      e.preventDefault();
      onReplayLine?.(lineIdx);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdvanceFromBlank?.(lineIdx, tokenIndex);
    }
  };

  const handleKeyDownInSentence = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      onReplayLine?.(lineIdx);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      setHasSubmittedSentence(true);
      if (sentenceEval?.isPassed) {
        onAdvanceFromBlank?.(lineIdx, null);
      }
    }
  };

  const phoneticNote = isEn ? line.phoneticNoteEn : (line.phoneticNoteVi || line.phoneticNoteEn);
  const sectionLabel = isEn ? line.sectionEn : (line.sectionVi || line.sectionEn);

  return (
    <div
      data-line-index={lineIdx}
      className={`rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-rose-50/90 via-purple-50/80 to-indigo-50/80 dark:from-slate-900 dark:via-indigo-950/70 dark:to-slate-900 border-purple-400 dark:border-purple-500 shadow-md ring-2 ring-purple-400/25'
          : isLineCompleted && lineType !== 'anchor'
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/50'
          : 'bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Meta Row: Timestamp, Section Tag, Task Type Badge & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          {/* Clickable Timestamp Pill */}
          <button
            type="button"
            onClick={() => onSeekToLine?.(lineIdx, true)}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-700'
            }`}
            title={isEn ? 'Click to play from this line' : 'Bấm để phát nhạc từ câu này'}
          >
            {isActive && isPlaying ? (
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
            <span>[{line.timestampLabel}]</span>
          </button>

          {sectionLabel && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {sectionLabel}
            </span>
          )}

          {/* Line Mode Badge */}
          {lineType === 'anchor' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300">
              {isEn ? 'Karaoke Guide' : 'Câu Dẫn Nhịp'}
            </span>
          )}
          {lineType === 'word_blank' && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              {isEn
                ? `Fill Words (${solvedWordBlanks}/${totalWordBlanks})`
                : `Điền Từ (${solvedWordBlanks}/${totalWordBlanks})`}
            </span>
          )}
          {lineType === 'sentence_blank' && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300">
              {isEn
                ? `Full Sentence (${line.wordCount} words)`
                : `Chép Nguyên Câu (${line.wordCount} từ)`}
            </span>
          )}
        </div>

        {/* Right Controls: Replay, Hint, Reveal, Completed Status */}
        <div className="flex items-center space-x-1.5">
          {lineType !== 'anchor' && isLineCompleted && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isEn ? 'Completed' : 'Hoàn thành'}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => onReplayLine?.(lineIdx)}
            className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
            title={isEn ? 'Replay this line (Tab)' : 'Nghe lại câu này (Phím Tab)'}
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">{isEn ? 'Replay' : 'Nghe lại'}</span>
          </button>

          {lineType !== 'anchor' && !isLineCompleted && (
            <>
              <button
                type="button"
                onClick={() => onHintLine?.(lineIdx)}
                className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 text-[11px] font-bold transition-colors cursor-pointer"
                title={isEn ? 'Get a hint for the next missing word' : 'Gợi ý từ còn thiếu tiếp theo'}
              >
                <Lightbulb className="w-3 h-3" />
                <span>{isEn ? 'Hint' : 'Gợi ý'}</span>
              </button>

              <button
                type="button"
                onClick={() => onRevealLine?.(lineIdx)}
                className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-700 text-slate-600 dark:text-slate-400 text-[11px] font-semibold transition-colors cursor-pointer"
                title={isEn ? 'Reveal full answer for this line' : 'Hiện đáp án của câu này'}
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">{isEn ? 'Answer' : 'Đáp án'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CASE 1: ANCHOR KARAOKE LINE                                           */}
      {/* ===================================================================== */}
      {lineType === 'anchor' && (
        <div
          onClick={() => onSeekToLine?.(lineIdx, true)}
          className={`text-sm sm:text-base font-bold leading-relaxed cursor-pointer transition-colors ${
            isActive
              ? 'text-purple-900 dark:text-purple-200'
              : 'text-slate-800 dark:text-slate-200 hover:text-purple-700'
          }`}
        >
          {line.text}
        </div>
      )}

      {/* ===================================================================== */}
      {/* CASE 2: WORD GAP-FILL (CLOZE LYRICS)                                  */}
      {/* ===================================================================== */}
      {lineType === 'word_blank' && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2 text-sm sm:text-base leading-relaxed font-semibold text-slate-800 dark:text-slate-100">
            {line.tokens.map((tok) => {
              if (!tok.isBlank) {
                return (
                  <span key={tok.tokenIndex} className="select-text">
                    {tok.text}
                  </span>
                );
              }

              const rawVal = isLineRevealed
                ? tok.coreWord
                : (wordInputsForLine[tok.tokenIndex] ?? '');
              const ev = evaluateWordBlankAttempt(tok.coreWord, rawVal);
              const isSolved = ev.isCorrect || isLineRevealed;
              const charWidth = Math.max(5, (tok.coreWord?.length || 4) + 2);

              return (
                <span key={tok.tokenIndex} className="inline-flex items-baseline">
                  {tok.prefix && <span>{tok.prefix}</span>}
                  <span className="relative inline-flex items-center">
                    <input
                      ref={(el) => registerInputRef?.(`${lineIdx}:${tok.tokenIndex}`, el)}
                      type="text"
                      value={rawVal}
                      disabled={isLineRevealed}
                      onFocus={() => onSeekToLine?.(lineIdx, false)}
                      onChange={(e) =>
                        onWordInputChange?.(lineIdx, tok.tokenIndex, e.target.value, tok.coreWord)
                      }
                      onKeyDown={(e) => handleKeyDownInBlank(e, tok.tokenIndex)}
                      style={{ width: `${charWidth}ch` }}
                      placeholder={'_'.repeat(Math.min(8, Math.max(3, tok.coreWord?.length || 4)))}
                      aria-label={
                        isEn
                          ? `Blank word in line ${lineIdx + 1}`
                          : `Ô điền từ dòng ${lineIdx + 1}`
                      }
                      className={`px-2 py-0.5 rounded-lg border-2 font-bold text-center text-sm sm:text-base transition-all focus:outline-none ${
                        isSolved
                          ? 'bg-emerald-100/90 dark:bg-emerald-900/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-2xs'
                          : ev.isNearMiss
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-100 focus:ring-2 focus:ring-amber-400/30'
                          : rawVal.length > 0
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100 focus:border-purple-500'
                          : 'bg-slate-50 dark:bg-slate-800/90 border-purple-300 dark:border-purple-700 text-slate-900 dark:text-slate-100 focus:border-purple-600 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-purple-500/20'
                      }`}
                    />
                  </span>
                  {tok.suffix && <span>{tok.suffix}</span>}
                </span>
              );
            })}
          </div>

          {/* Near-miss spelling / plural feedback banner */}
          {nearMissMessage && (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{nearMissMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* CASE 3: FULL SENTENCE BLANK DICTATION                                 */}
      {/* ===================================================================== */}
      {lineType === 'sentence_blank' && (
        <div className="space-y-2.5">
          <div className="relative flex items-center gap-2">
            <input
              ref={(el) => registerInputRef?.(`${lineIdx}:sentence`, el)}
              type="text"
              value={effectiveSentenceText}
              disabled={isLineRevealed}
              onFocus={() => onSeekToLine?.(lineIdx, false)}
              onChange={(e) => onSentenceInputChange?.(lineIdx, e.target.value)}
              onKeyDown={handleKeyDownInSentence}
              placeholder={
                isEn
                  ? `Listen and type the full line (${line.wordCount} words)... Press Tab to replay`
                  : `Nghe và gõ lại nguyên câu hát này (${line.wordCount} từ)... Bấm Tab để nghe lại`
              }
              className={`w-full px-3.5 py-2 rounded-xl border-2 text-sm sm:text-base font-semibold transition-all focus:outline-none ${
                isLineCompleted
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                  : 'bg-slate-50 dark:bg-slate-800/90 border-purple-300 dark:border-purple-700 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20'
              }`}
            />
          </div>

          {/* Live Word-by-Word Token Feedback Bar */}
          {(effectiveSentenceText.trim().length > 0 || hasSubmittedSentence) && sentenceEval && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                {isEn
                  ? `Matched ${sentenceEval.correctCount}/${sentenceEval.totalCount} words (${sentenceEval.accuracy}%):`
                  : `Khớp ${sentenceEval.correctCount}/${sentenceEval.totalCount} từ (${sentenceEval.accuracy}%):`}
              </span>
              {sentenceEval.targetDiff.map((tok, idx) => {
                if (tok.type === 'correct' || isLineRevealed) {
                  return (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold border border-emerald-300/60"
                    >
                      {tok.text}
                    </span>
                  );
                }
                // Masked hint for still-missing word: shows first character + underscores for remaining length
                const clean = tok.text.replace(/[^a-zA-Z0-9]/g, '');
                const firstChar = clean[0] || '?';
                const maskLen = Math.max(2, clean.length - 1);
                return (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs border border-slate-300/60 dark:border-slate-700"
                    title={isEn ? 'Missing word — click Hint or replay line' : 'Từ còn thiếu — bấm Gợi ý hoặc nghe lại câu'}
                  >
                    {firstChar}
                    {'_'.repeat(Math.min(6, maskLen))}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* FOOTER: TRANSLATION, CONNECTED SPEECH PHONETIC NOTE & PRONUNCIATION   */}
      {/* ===================================================================== */}
      {isLineCompleted && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1 min-w-0">
            {/* Strictly hide Vietnamese translation when isEn === true */}
            {!isEn && showTranslation && line.translationVi && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                🇻🇳 {line.translationVi}
              </p>
            )}
            {showPhoneticTips && phoneticNote && (
              <div className="flex items-start space-x-1.5 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>{phoneticNote}</span>
              </div>
            )}
          </div>

          {onPracticeLinePronunciation && (
            <button
              type="button"
              onClick={() => onPracticeLinePronunciation(line)}
              className="self-start sm:self-center inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
              title={
                isEn
                  ? 'Practice speaking this line in Pronunciation Studio'
                  : 'Chuyển câu này sang Phòng Luyện Phát Âm để tập đọc theo'
              }
            >
              <Mic className="w-3 h-3" />
              <span>{isEn ? 'Speak Line' : 'Luyện phát âm câu'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default MusicLineCard;
