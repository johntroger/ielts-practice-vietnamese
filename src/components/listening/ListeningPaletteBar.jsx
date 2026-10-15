import React, { useRef, useEffect } from 'react';
import { Flag, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n/index.js';

export default function ListeningPaletteBar({
  totalQuestions = 40,
  activePart = 1,
  onSelectPart,
  activeQuestionOrder = 1,
  onSelectQuestion,
  userAnswers = {},
  flaggedQuestions = {},
  onToggleFlag,
  onSubmitExam,
  isSubmitted = false,
  availableParts = null
}) {
  const { t, isEn } = useTranslation();
  const activePillRef = useRef(null);

  // Auto scroll active pill into visible horizontal area
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeQuestionOrder]);

  const defaultParts = [
    { partNumber: 1, range: [1, 10] },
    { partNumber: 2, range: [11, 20] },
    { partNumber: 3, range: [21, 30] },
    { partNumber: 4, range: [31, 40] }
  ];

  const parts = (Array.isArray(availableParts) && availableParts.length > 0)
    ? (availableParts.length === 1
        ? [{ partNumber: availableParts[0], range: [1, totalQuestions] }]
        : defaultParts.filter(p => availableParts.includes(p.partNumber)))
    : defaultParts;

  const isCurrentFlagged = !isSubmitted && !!flaggedQuestions[activeQuestionOrder];

  const handlePrevQuestion = () => {
    if (activeQuestionOrder > 1) {
      const prev = activeQuestionOrder - 1;
      onSelectQuestion(prev);
      if (parts.length > 1) {
        const newPart = parts.find(p => prev >= p.range[0] && prev <= p.range[1]);
        if (newPart && newPart.partNumber !== activePart && onSelectPart) {
          onSelectPart(newPart.partNumber);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionOrder < totalQuestions) {
      const next = activeQuestionOrder + 1;
      onSelectQuestion(next);
      if (parts.length > 1) {
        const newPart = parts.find(p => next >= p.range[0] && next <= p.range[1]);
        if (newPart && newPart.partNumber !== activePart && onSelectPart) {
          onSelectPart(newPart.partNumber);
        }
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2">
        
        {/* DESKTOP & TABLET: Single-row ultra-compact layout (>= sm) */}
        <div className="hidden sm:flex items-center justify-between gap-2.5">
          {/* ZONE 1 (Left): Part Selector & Review Checkbox */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Part Buttons */}
            <div className="flex items-center space-x-0.5 p-0.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
              {parts.map(p => (
                <button
                  key={p.partNumber}
                  type="button"
                  onClick={() => {
                    if (onSelectPart) onSelectPart(p.partNumber);
                    if (onSelectQuestion && p.range) onSelectQuestion(p.range[0]);
                  }}
                  className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activePart === p.partNumber
                      ? 'bg-red-600 text-white shadow-xs font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/70'
                  }`}
                  title={isEn ? `Switch to Part ${p.partNumber}` : `Chuyển tới Part ${p.partNumber}`}
                >
                  <span className="hidden md:inline">Part </span>
                  <span className="md:hidden">P</span>
                  {p.partNumber}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-slate-700/80 mx-0.5 shrink-0" />

            {/* Review Flag Checkbox */}
            <label className="flex items-center space-x-1.5 cursor-pointer select-none text-slate-300 hover:text-amber-300 transition-colors text-xs shrink-0 py-0.5">
              <input
                type="checkbox"
                checked={isCurrentFlagged}
                onChange={() => onToggleFlag && onToggleFlag(activeQuestionOrder)}
                className="w-3.5 h-3.5 rounded-sm border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'text-amber-400 fill-current' : 'text-slate-400'}`} />
              <span className="font-semibold text-xs whitespace-nowrap">
                {isEn ? 'Review' : 'Xem lại'}
              </span>
            </label>
          </div>

          {/* ZONE 2 (Center): Compact Numbered Question Pills Strip */}
          <div className="flex-1 min-w-0 mx-1 overflow-x-auto no-scrollbar scrollbar-none py-0.5 flex items-center justify-center">
            <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((order) => {
                const isAnswered = typeof userAnswers[order] === 'string' 
                  ? userAnswers[order].trim().length > 0 
                  : !!userAnswers[order];
                const isFlagged = !isSubmitted && !!flaggedQuestions[order];
                const isActive = activeQuestionOrder === order;

                return (
                  <button
                    key={order}
                    ref={isActive ? activePillRef : null}
                    type="button"
                    onClick={() => {
                      onSelectQuestion(order);
                      if (parts.length > 1) {
                        const newPart = parts.find(p => order >= p.range[0] && order <= p.range[1]);
                        if (newPart && newPart.partNumber !== activePart && onSelectPart) {
                          onSelectPart(newPart.partNumber);
                        }
                      }
                    }}
                    className={`relative min-w-[26px] h-6 sm:h-6.5 px-1 rounded-md text-[11px] sm:text-xs font-mono font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer select-none ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-sm scale-105 font-black'
                        : isAnswered
                        ? 'bg-slate-700 text-white border-b-2 border-emerald-400 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={isEn 
                      ? `Question ${order}${isAnswered ? ' (Answered)' : ' (Unanswered)'}${isFlagged ? ' - Flagged' : ''}`
                      : `Câu ${order}${isAnswered ? ' (Đã làm)' : ' (Chưa làm)'}${isFlagged ? ' - Cắm cờ' : ''}`}
                  >
                    <span>{order}</span>
                    {isFlagged && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ZONE 3 (Right): Navigation Arrows & Submit Button */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={activeQuestionOrder <= 1}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-700 cursor-pointer"
              title={isEn ? "Previous question" : "Câu trước"}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isEn ? 'Previous' : 'Trước'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={activeQuestionOrder >= totalQuestions}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-700 cursor-pointer"
              title={isEn ? "Next question" : "Câu sau"}
            >
              <span className="hidden md:inline">{isEn ? 'Next' : 'Sau'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!isSubmitted && (
              <button
                type="button"
                onClick={onSubmitExam}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center space-x-1 ml-1 cursor-pointer shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('common.submit', isEn ? 'Submit' : 'Nộp Bài')}</span>
              </button>
            )}
          </div>
        </div>

        {/* MOBILE LAYOUT (< sm): Streamlined 2-tier micro-strip */}
        <div className="sm:hidden flex flex-col gap-1.5">
          {/* Micro-row 1: Part buttons & question numbers */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
            <div className="flex items-center space-x-0.5 shrink-0 p-0.5 bg-slate-800/80 rounded-md">
              {parts.map(p => (
                <button
                  key={p.partNumber}
                  type="button"
                  onClick={() => {
                    if (onSelectPart) onSelectPart(p.partNumber);
                    if (onSelectQuestion && p.range) onSelectQuestion(p.range[0]);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0 cursor-pointer ${
                    activePart === p.partNumber ? 'bg-red-600 text-white font-black' : 'text-slate-300'
                  }`}
                >
                  P{p.partNumber}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-slate-700 shrink-0" />

            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((order) => {
                const isAnswered = typeof userAnswers[order] === 'string' 
                  ? userAnswers[order].trim().length > 0 
                  : !!userAnswers[order];
                const isFlagged = !isSubmitted && !!flaggedQuestions[order];
                const isActive = activeQuestionOrder === order;

                return (
                  <button
                    key={order}
                    ref={isActive ? activePillRef : null}
                    type="button"
                    onClick={() => onSelectQuestion(order)}
                    className={`relative min-w-[24px] h-6 px-1 rounded text-[11px] font-mono font-bold shrink-0 flex items-center justify-center cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : isAnswered
                        ? 'bg-slate-700 text-white border-b-2 border-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{order}</span>
                    {isFlagged && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Micro-row 2: Review flag + Prev/Next + Submit */}
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-1 text-xs">
            <label className="flex items-center space-x-1 cursor-pointer select-none text-slate-300 text-[11px]">
              <input
                type="checkbox"
                checked={isCurrentFlagged}
                onChange={() => onToggleFlag && onToggleFlag(activeQuestionOrder)}
                className="w-3 h-3 rounded-sm border-slate-600 bg-slate-800 text-amber-500 cursor-pointer"
              />
              <Flag className={`w-3 h-3 ${isCurrentFlagged ? 'text-amber-400 fill-current' : 'text-slate-400'}`} />
              <span>{isEn ? 'Review' : 'Xem lại'}</span>
            </label>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handlePrevQuestion}
                disabled={activeQuestionOrder <= 1}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[11px] font-semibold border border-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3 inline" />
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={activeQuestionOrder >= totalQuestions}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[11px] font-semibold border border-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-3 h-3 inline" />
              </button>

              {!isSubmitted && (
                <button
                  type="button"
                  onClick={onSubmitExam}
                  className="px-2.5 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-xs cursor-pointer ml-1"
                >
                  {t('common.submit', isEn ? 'Submit' : 'Nộp')}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
