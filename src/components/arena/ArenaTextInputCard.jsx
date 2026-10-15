/**
 * src/components/arena/ArenaTextInputCard.jsx
 * 
 * Interactive Type-In-The-Word Component for Atlas English Arena.
 * Features:
 * - Anti-Autocorrect & Anti-Cheating guards (spellcheck=false, autocomplete=off, autocorrect=off)
 * - Auto-focus on question load
 * - 2-Step Enter Flow (Type -> Enter to Check -> Enter to Advance)
 * - In-situ Character Diff Viewer for visual error correction
 * - Responsive mobile keyboard accommodation
 */

import React, { useRef, useEffect } from 'react';
import { Keyboard, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function ArenaTextInputCard({
  value = '',
  onChange,
  onSubmit,
  question,
  userInputText,
  onUserInputChange,
  onCheckAnswer,
  onSkip,
  isAnswerChecked = false,
  isCorrect = null,
  validationResult = null,
  correctAnswer = '',
  acceptableAnswers = []
}) {
  const { t, isEn } = useTranslation();
  const inputRef = useRef(null);

  const activeValue = userInputText !== undefined ? userInputText : value;
  const activeChange = onUserInputChange || onChange;
  const activeSubmit = onCheckAnswer || onSubmit;
  const activeTarget = question?.correctAnswer || correctAnswer;
  const activeAcceptable = question?.acceptableAnswers || acceptableAnswers || [activeTarget];

  // Auto-focus input on question mount or advance
  useEffect(() => {
    if (!isAnswerChecked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAnswerChecked]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeValue.trim()) {
        activeSubmit?.();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onSkip?.();
    }
  };

  const diffTokens = validationResult?.diff || [];

  return (
    <div className="w-full flex flex-col gap-3 my-1">
      {/* Input container */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Keyboard className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={activeValue}
          disabled={isAnswerChecked}
          onChange={(e) => activeChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          data-lpignore="true"
          placeholder={isEn ? 'Type the missing word and press Enter...' : 'Gõ từ còn thiếu rồi nhấn Enter...'}
          className={`w-full pl-11 pr-12 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-mono font-bold tracking-wide transition-all outline-hidden border select-text cursor-text ${
            isAnswerChecked
              ? isCorrect
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                : 'bg-rose-950/40 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
              : 'bg-slate-900/90 border-slate-700/80 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 hover:border-slate-600'
          }`}
        />

        {/* Status Icon */}
        {isAnswerChecked && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-in zoom-in-75 duration-200" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 animate-in zoom-in-75 duration-200" />
            )}
          </div>
        )}
      </div>

      {/* Visual Character Diff Display when incorrect */}
      {isAnswerChecked && !isCorrect && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-800/60 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-rose-400 flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{isEn ? 'Your spelling vs authentic Cambridge spelling:' : 'Đối chiếu chính tả của bạn với chuẩn Cambridge:'}</span>
            </span>
          </div>

          {/* User's typed diff with red indicators OR skipped state */}
          {activeValue ? (
            <div className="flex items-center gap-1 font-mono text-sm tracking-wider flex-wrap bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-xs font-sans mr-1">{isEn ? 'You typed:' : 'Bạn đã gõ:'}</span>
              {diffTokens.map((token, idx) => (
                <span
                  key={idx}
                  className={`px-1 py-0.5 rounded font-bold ${
                    token.type === 'match'
                      ? 'text-slate-200 bg-slate-800'
                      : token.type === 'wrong'
                      ? 'text-rose-200 bg-rose-600/60 line-through'
                      : 'text-rose-300 bg-rose-900/80'
                  }`}
                >
                  {token.char}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-lg">
              <span>⏭️</span>
              <span>{isEn ? 'Question skipped without input' : 'Câu hỏi đã được bỏ qua'}</span>
            </div>
          )}

          {/* Correct Cambridge answer */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-emerald-400 font-bold">{isEn ? 'Correct Answer:' : 'Đáp Án Đúng:'}</span>
            <span className="font-mono font-bold text-emerald-300 text-sm tracking-wide bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {activeTarget}
            </span>
            {activeAcceptable.length > 1 && (
              <span className="text-slate-400 italic text-[11px] ml-1">
                ({isEn ? 'Also accepted:' : 'Cũng chấp nhận:'} {activeAcceptable.filter(a => a.toLowerCase() !== String(activeTarget).toLowerCase()).join(', ')})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Helper cue */}
      {!isAnswerChecked && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1 text-indigo-300">
            <Sparkles className="w-3 h-3" />
            <span>{isEn ? 'Cambridge Active Recall • Type exact word' : 'Phản xạ chủ động Cambridge • Gõ từ chính xác'}</span>
          </span>
          <span className="font-mono text-slate-500">Press Enter ↵</span>
        </div>
      )}
    </div>
  );
}
