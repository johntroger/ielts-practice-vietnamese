import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw, 
  Award, 
  Check, 
  Flame, 
  BookOpen, 
  Pill,
  ArrowRight
} from 'lucide-react';
import { generateDailyPrescription, recordPrescriptionCompletion } from '../services/prescriptionService';

export default function DailyErrorPrescriptionModal({
  isOpen,
  onClose,
  mistakes = [],
  submissions = []
}) {
  const [prescription, setPrescription] = useState(() => generateDailyPrescription(mistakes, submissions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentItem = prescription.items[currentIndex] || prescription.items[0];
  const total = prescription.items.length;

  const handleSelectOption = (index) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    if (index === currentItem.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < total) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsCompleted(true);
      recordPrescriptionCompletion(prescription.date, score + (selectedOption === currentItem.correctIndex ? 1 : 0), total);
    }
  };

  const handleRestart = () => {
    setPrescription(generateDailyPrescription(mistakes, submissions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92dvh]"
        role="dialog"
        aria-modal="true"
      >
        {/* ============================================================ */}
        {/* MODAL HEADER                                                */}
        {/* ============================================================ */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Đơn Thuốc Sửa Lỗi Mỗi Ngày
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
                  SRS 3 Phút
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Vòng lặp khắc phục lỗi sai kinh điển & bẫy ngữ pháp Cambridge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* MODAL BODY                                                  */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!isCompleted ? (
            <div className="space-y-4">
              
              {/* Progress & Badge */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">
                  Câu hỏi {currentIndex + 1} / {total}
                </span>
                <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-[11px]">
                  {currentItem.type}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>

              {/* Sentence with Mistake */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-amber-900 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>{currentItem.title}</span>
                </div>
                <p className="font-serif sm:font-sans text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                  "{currentItem.sentence}"
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-600">
                  Chọn câu sửa chuẩn xác nhất:
                </span>

                {currentItem.options.map((opt, idx) => {
                  let optStyle = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';

                  if (hasAnswered) {
                    if (idx === currentItem.correctIndex) {
                      optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (idx === selectedOption) {
                      optStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                    } else {
                      optStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start space-x-2.5 cursor-pointer disabled:cursor-default ${optStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 ${
                        hasAnswered && idx === currentItem.correctIndex
                          ? 'bg-emerald-600 text-white'
                          : hasAnswered && idx === selectedOption
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Rule Tip (Revealed after answer) */}
              {hasAnswered && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                  selectedOption === currentItem.correctIndex
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}>
                  <div className="flex items-center space-x-1.5 font-bold">
                    {selectedOption === currentItem.correctIndex ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-800">Chính xác! Bạn đã phát hiện đúng lỗi.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-800">Chưa chính xác! Hãy lưu ý lời giải bên dưới:</span>
                      </>
                    )}
                  </div>

                  <p className="text-slate-700 leading-relaxed font-normal">
                    {currentItem.explanation}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/60 text-[11px] font-medium text-slate-800 flex items-start space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Quy tắc vàng:</strong> {currentItem.ruleTip}</span>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ========================================================= */
            /* COMPLETION SUMMARY SCREEN                                 */
            /* ========================================================= */
            <div className="p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                <Award className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  🎉 Hoàn Thành Đơn Thuốc Hôm Nay!
                </h3>
                <p className="text-xs text-slate-500">
                  Bạn đã hoàn thành cữ luyện tập 3 phút nhằm triệt tiêu các lỗi sai cố hữu.
                </p>
              </div>

              {/* Score Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block px-8">
                <div className="text-3xl font-black text-slate-900">
                  {score} / {total}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Điểm chính xác ({Math.round((score / total) * 100)}%)
                </div>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {score === total
                  ? 'Tuyệt vời! Bạn không mắc một lỗi nào. Hãy tiếp tục duy trì phản xạ ngữ pháp chuẩn xác này trong các bài thi thử.'
                  : 'Rất tốt! Việc nhận diện và ghi nhớ lời giải sẽ giúp bạn không còn lặp lại các lỗi tương tự khi bước vào phòng thi thật.'}
              </p>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Luyện Tập Lại</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Đã Uống Thuốc Xong!
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* MODAL FOOTER                                                */}
        {/* ============================================================ */}
        {!isCompleted && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="text-[11px] text-slate-400">
              Mỗi ngày 1 đơn thuốc • Nâng +0.5 Band ngữ pháp
            </span>

            {hasAnswered && (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all shadow-md shadow-rose-900/30 flex items-center space-x-1.5 cursor-pointer animate-in fade-in"
              >
                <span>{currentIndex + 1 < total ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
