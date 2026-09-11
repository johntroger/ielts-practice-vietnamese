import React, { useRef, useEffect } from 'react';
import { Flag, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

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
  isSubmitted = false
}) {
  const activePillRef = useRef(null);

  // Auto scroll active pill into visible horizontal area on mobile
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeQuestionOrder]);

  const parts = [
    { partNumber: 1, range: [1, 10] },
    { partNumber: 2, range: [11, 20] },
    { partNumber: 3, range: [21, 30] },
    { partNumber: 4, range: [31, 40] }
  ];

  const currentPartObj = parts.find(p => p.partNumber === activePart) || parts[0];
  const isCurrentFlagged = !!flaggedQuestions[activeQuestionOrder];

  const handlePrevQuestion = () => {
    if (activeQuestionOrder > 1) {
      const prev = activeQuestionOrder - 1;
      onSelectQuestion(prev);
      // Change part if crossing border
      const newPart = parts.find(p => prev >= p.range[0] && prev <= p.range[1]);
      if (newPart && newPart.partNumber !== activePart && onSelectPart) {
        onSelectPart(newPart.partNumber);
      }
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionOrder < totalQuestions) {
      const next = activeQuestionOrder + 1;
      onSelectQuestion(next);
      // Change part if crossing border
      const newPart = parts.find(p => next >= p.range[0] && next <= p.range[1]);
      if (newPart && newPart.partNumber !== activePart && onSelectPart) {
        onSelectPart(newPart.partNumber);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900 text-white border-t border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-2 py-2 sm:px-4 sm:py-2.5 flex flex-col gap-2">
        
        {/* ROW 1: Part Pills & All 40 Questions (or active Part questions on mobile) */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-0.5">
          
          {/* Part Buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            {parts.map(p => (
              <button
                key={p.partNumber}
                onClick={() => onSelectPart && onSelectPart(p.partNumber)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 ${
                  activePart === p.partNumber
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Part {p.partNumber}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="hidden sm:block w-px h-6 bg-slate-700 shrink-0" />

          {/* Numbered Pills (1..40 or current part on mobile) */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none py-1">
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((order) => {
              const isAnswered = typeof userAnswers[order] === 'string' 
                ? userAnswers[order].trim().length > 0 
                : !!userAnswers[order];
              const isFlagged = !!flaggedQuestions[order];
              const isActive = activeQuestionOrder === order;

              return (
                <button
                  key={order}
                  ref={isActive ? activePillRef : null}
                  onClick={() => {
                    onSelectQuestion(order);
                    const newPart = parts.find(p => order >= p.range[0] && order <= p.range[1]);
                    if (newPart && newPart.partNumber !== activePart && onSelectPart) {
                      onSelectPart(newPart.partNumber);
                    }
                  }}
                  className={`relative min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-1 rounded-md text-xs font-mono font-bold transition-all shrink-0 flex items-center justify-center ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-md scale-105'
                      : isAnswered
                      ? 'bg-slate-700 text-white border-b-2 border-emerald-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Câu ${order}${isAnswered ? ' (Đã làm)' : ' (Chưa làm)'}${isFlagged ? ' - Cắm cờ' : ''}`}
                >
                  <span>{order}</span>
                  {/* Flag indicator dot */}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-slate-900" />
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* ROW 2: CD-IELTS Action Controls (Review Checkbox, Back / Next, Submit) */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-1.5 text-xs">
          
          {/* Left: Review Flag Checkbox */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none text-slate-300 hover:text-amber-300 transition-colors">
            <input
              type="checkbox"
              checked={isCurrentFlagged}
              onChange={() => onToggleFlag && onToggleFlag(activeQuestionOrder)}
              className="w-3.5 h-3.5 rounded-sm border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'text-amber-400 fill-current' : 'text-slate-400'}`} />
            <span className="font-semibold text-[11px] sm:text-xs">⚑ Đánh dấu xem lại (Review)</span>
          </label>

          {/* Right: Navigation Arrows & Submit Button */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevQuestion}
                disabled={activeQuestionOrder <= 1}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Câu trước</span>
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={activeQuestionOrder >= totalQuestions}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-700"
              >
                <span className="hidden sm:inline">Câu sau</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Submit Button */}
            {!isSubmitted && (
              <button
                onClick={onSubmitExam}
                className="px-3.5 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center space-x-1.5 ml-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nộp Bài</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
