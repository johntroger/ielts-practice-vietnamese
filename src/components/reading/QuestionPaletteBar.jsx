import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Send, 
  RotateCcw,
  Sparkles,
  Award,
  Flag
} from 'lucide-react';

export default function QuestionPaletteBar({
  totalQuestions = 40,
  activePassageNum = 1,
  userAnswers = {},
  flaggedQuestions = {},
  isSubmitted = false,
  questionsData = [],
  bandResult = null,
  onSubmitExam,
  onResetExam,
  onJumpToQuestion,
  onSelectPassage,
  onOpenResultModal
}) {
  const answeredCount = Object.keys(userAnswers).filter(k => {
    const val = userAnswers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val && val.trim && val.trim().length > 0;
  }).length;

  const flaggedCount = Object.keys(flaggedQuestions).filter(k => flaggedQuestions[k]).length;

  // Dynamically detect which passages exist in this exam test
  const parts = useMemo(() => {
    if (!questionsData || questionsData.length === 0) {
      return [{ partNum: 1, label: 'Part 1', start: 1, end: 13, questions: [] }];
    }

    // Group questions by their passageNumber
    const grouped = {};
    questionsData.forEach(q => {
      const pNum = q.passageNumber || 1;
      if (!grouped[pNum]) grouped[pNum] = [];
      grouped[pNum].push(q);
    });

    const passageNumbers = Object.keys(grouped).map(Number).sort((a, b) => a - b);
    
    // If only 1 passage exists, construct its exact question range
    return passageNumbers.map(pNum => {
      const qList = grouped[pNum].sort((a, b) => a.order - b.order);
      const orders = qList.map(q => q.order);
      return {
        partNum: pNum,
        label: `Passage ${pNum}`,
        start: orders[0],
        end: orders[orders.length - 1],
        orders: orders
      };
    });
  }, [questionsData]);

  const renderQuestionBtn = (num, targetPassage) => {
    const hasAns = !!userAnswers[num] && (
      Array.isArray(userAnswers[num]) ? userAnswers[num].length > 0 : String(userAnswers[num]).trim().length > 0
    );
    const isFlagged = !isSubmitted && !!flaggedQuestions[num];

    let isCorrect = false;
    let isWrong = false;
    if (isSubmitted) {
      const qObj = questionsData.find(q => q.order === num);
      if (qObj) {
        const uAns = userAnswers[num];
        if (Array.isArray(uAns)) {
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

    let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300';
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
        title={`Câu ${num} (${isFlagged ? 'Đang cắm cờ xem lại' : hasAns ? 'Đã làm' : 'Chưa làm'})`}
        className={`relative w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center border transition-all ${btnClass} shrink-0`}
      >
        <span>{num}</span>
        {/* Yellow Flag marker in top-right corner */}
        {isFlagged && (
          <span 
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border border-amber-600 rounded-full shadow-xs"
            title="Được đánh dấu cờ Review"
          />
        )}
      </button>
    );
  };

  return (
    <div className="bg-white border-t border-slate-200 px-2.5 sm:px-6 py-1.5 sm:py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-3 shadow-lg shrink-0 sticky bottom-0 z-20">
      
      {/* Mobile Top Row / Desktop Left: Progress and Quick Mobile Action */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        {/* Left: Score or Progress summary */}
        <div className="flex items-center space-x-2 text-xs">
          {isSubmitted && bandResult ? (
            <button
              onClick={() => onOpenResultModal && onOpenResultModal()}
              className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 sm:px-3 py-1 rounded-xl text-emerald-950 font-bold shadow-2xs transition-colors cursor-pointer text-[11px] sm:text-xs"
              title="Nhấp để xem Báo cáo phân tích chi tiết & Band Score"
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{bandResult.correctCount}/{totalQuestions} câu</span>
              <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded-md text-[10px] sm:text-xs font-black">
                Band {bandResult.band.toFixed(1)}
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px] sm:text-xs">
              <span className="hidden sm:inline">Tiến độ:</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {answeredCount}/{totalQuestions} đã làm
              </span>
              {flaggedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200 flex items-center gap-1">
                  <Flag className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  <span>{flaggedCount} cờ</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mobile-Only Quick Action (Submit / Reset) */}
        <div className="sm:hidden flex items-center">
          {isSubmitted ? (
            <button
              onClick={onResetExam}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Làm lại</span>
            </button>
          ) : (
            <button
              onClick={onSubmitExam}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs text-[11px]"
            >
              <Send className="w-3 h-3" />
              <span>Nộp bài</span>
            </button>
          )}
        </div>
      </div>

      {/* Center: 3-Part Question Palette Matrix (Exact IELTS on Computer format) */}
      <div className="flex-1 max-w-full sm:max-w-2xl overflow-x-auto py-0.5 px-0.5 scrollbar-thin touch-pan-x">
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          {parts.map(part => {
            const isCurrentPart = activePassageNum === part.partNum;
            const qOrders = part.orders && part.orders.length > 0 
              ? part.orders 
              : Array.from({ length: part.end - part.start + 1 }, (_, i) => part.start + i);

            return (
              <div 
                key={part.partNum}
                className={`flex items-center gap-1 p-0.5 sm:p-1 rounded-lg border transition-all ${
                  isCurrentPart 
                    ? 'bg-blue-50/60 border-blue-300 shadow-2xs' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <button
                  onClick={() => onSelectPassage && onSelectPassage(part.partNum)}
                  className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded transition-colors ${
                    isCurrentPart ? 'text-blue-800 bg-blue-100 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={`Chuyển tới Passage ${part.partNum}`}
                >
                  P{part.partNum}
                </button>
                <div className="flex items-center gap-1">
                  {qOrders.map(num => renderQuestionBtn(num, part.partNum))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Only Actions (Submit / Reset) */}
      <div className="hidden sm:flex items-center space-x-2 text-xs shrink-0">
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