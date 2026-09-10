import React from 'react';
import { 
  CheckCircle2, 
  Send, 
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';

export default function QuestionPaletteBar({
  totalQuestions = 40,
  activePassageNum = 1,
  userAnswers = {},
  isSubmitted = false,
  questionsData = [],
  bandResult = null,
  onSubmitExam,
  onResetExam,
  onJumpToQuestion,
  onSelectPassage
}) {
  // Determine question status
  const answeredCount = Object.keys(userAnswers).filter(k => {
    const val = userAnswers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val && val.trim && val.trim().length > 0;
  }).length;

  return (
    <div className="bg-white border-t border-slate-200 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg shrink-0">
      {/* Left: Score or Progress summary */}
      <div className="flex items-center space-x-3 text-xs">
        {isSubmitted && bandResult ? (
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl text-emerald-950 font-bold shadow-2xs">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Kết quả: {bandResult.correctCount}/{totalQuestions} câu đúng</span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-md text-xs font-black">
              Band {bandResult.band.toFixed(1)}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-slate-600 font-semibold">
            <span className="hidden sm:inline">Tiến độ bài làm:</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
              {answeredCount}/{totalQuestions} đã trả lời
            </span>
          </div>
        )}
      </div>

      {/* Center: 40 Question Palette Matrix */}
      <div className="flex-1 max-w-2xl overflow-x-auto py-1 px-1 scrollbar-thin">
        <div className="flex items-center gap-1 min-w-max">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(num => {
            const hasAns = !!userAnswers[num] && (
              Array.isArray(userAnswers[num]) ? userAnswers[num].length > 0 : String(userAnswers[num]).trim().length > 0
            );

            // Determine passage of this question
            const targetPassage = num <= 13 ? 1 : num <= 26 ? 2 : 3;

            // Check correctness if submitted
            let isCorrect = false;
            let isWrong = false;
            if (isSubmitted) {
              const qObj = questionsData.find(q => q.order === num);
              if (qObj) {
                const uAns = userAnswers[num];
                if (Array.isArray(uAns)) {
                  // multi-select
                  const correctArr = Array.isArray(qObj.answer) ? qObj.answer : [qObj.answer];
                  isCorrect = uAns.length === correctArr.length && uAns.every(a => correctArr.includes(a));
                  isWrong = !isCorrect;
                } else if (uAns) {
                  isCorrect = (
                    String(uAns).trim().toLowerCase() === String(qObj.answer).trim().toLowerCase() ||
                    (qObj.acceptableAnswers && qObj.acceptableAnswers.some(a => a.toLowerCase() === String(uAns).trim().toLowerCase()))
                  );
                  isWrong = !isCorrect;
                } else {
                  isWrong = true;
                }
              }
            }

            let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200';
            if (isSubmitted) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500 text-white font-black border-emerald-600 shadow-2xs';
              } else {
                btnClass = 'bg-rose-500 text-white font-bold border-rose-600 shadow-2xs';
              }
            } else if (hasAns) {
              btnClass = 'bg-blue-600 text-white font-bold border-blue-700 shadow-2xs';
            }

            return (
              <button
                key={num}
                onClick={() => {
                  if (activePassageNum !== targetPassage && onSelectPassage) {
                    onSelectPassage(targetPassage);
                  }
                  setTimeout(() => {
                    if (onJumpToQuestion) onJumpToQuestion(num);
                  }, 100);
                }}
                title={`Câu ${num} (Passage ${targetPassage})`}
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all ${btnClass} shrink-0`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Actions (Submit / Reset) */}
      <div className="flex items-center space-x-2 text-xs">
        {isSubmitted ? (
          <button
            onClick={onResetExam}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại từ đầu</span>
          </button>
        ) : (
          <button
            onClick={onSubmitExam}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-102"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài chấm điểm</span>
          </button>
        )}
      </div>
    </div>
  );
}