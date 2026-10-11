import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Send, 
  Clock, 
  Sparkles, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  ArrowRight 
} from 'lucide-react';
import { detectWritingHabits } from '../utils/habitDetector.js';
import { useTranslation } from '../i18n/index.js';

export { detectWritingHabits };

export default function TimerBar({
  timeRemaining,
  totalTime,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onSubmitEssay,
  isSubmitting,
  wordCount,
  minWords,
  apiKey,
  onOpenSettings,
  essayText = '',
  currentTask = null,
  mistakes = []
}) {
  const { t, isEn } = useTranslation();
  const [isMobileCompact, setIsMobileCompact] = useState(false);
  const [habitWarnings, setHabitWarnings] = useState([]);
  const [pendingSubmitMethod, setPendingSubmitMethod] = useState(null);
  const [acknowledgedTextHash, setAcknowledgedTextHash] = useState('');
  const [submitMode, setSubmitMode] = useState(() => (apiKey ? 'ai' : 'algorithmic'));
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);

  // Automatically adapt submit mode when user connects an API key
  React.useEffect(() => {
    if (apiKey && submitMode === 'algorithmic') {
      setSubmitMode('ai');
    }
  }, [apiKey]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 300 && timeRemaining > 0; // Less than 5 mins
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  const handleInitiateSubmit = (method) => {
    const currentHash = `${method}-${essayText.length}-${essayText.slice(0, 30)}`;
    if (acknowledgedTextHash === currentHash) {
      onSubmitEssay(method);
      return;
    }

    const detected = detectWritingHabits(essayText, currentTask, mistakes);
    if (detected && detected.length > 0) {
      setHabitWarnings(detected);
      setPendingSubmitMethod(method);
    } else {
      onSubmitEssay(method);
    }
  };

  const handleConfirmSubmit = () => {
    if (pendingSubmitMethod) {
      setAcknowledgedTextHash(`${pendingSubmitMethod}-${essayText.length}-${essayText.slice(0, 30)}`);
      const method = pendingSubmitMethod;
      setHabitWarnings([]);
      setPendingSubmitMethod(null);
      onSubmitEssay(method);
    }
  };

  const handleDismissWarning = () => {
    setHabitWarnings([]);
    setPendingSubmitMethod(null);
  };

  return (
    <>
      {/* 1. Mobile Compact Floating Bar when user chooses to minimize on small screens */}
      {isMobileCompact ? (
        <div className="sm:hidden fixed bottom-3 right-3 z-40 flex items-center space-x-2 bg-slate-900/95 text-white px-3 py-2 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-1.5 font-mono text-xs font-bold">
            <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
            <span className={isLowTime ? 'text-red-400' : 'text-white'}>{formatTime(timeRemaining)}</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-300 font-semibold">{wordCount}/{minWords} {isEn ? 'words' : 'từ'}</span>
          <button
            onClick={() => handleInitiateSubmit(submitMode)}
            disabled={isSubmitting}
            className={`px-2.5 py-1 rounded-lg text-white font-black text-[11px] flex items-center space-x-1 cursor-pointer active:scale-95 transition-transform ${
              submitMode === 'ai' ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'
            }`}
            title={submitMode === 'ai' ? (isEn ? "Grade with AI" : "Chấm Bằng AI") : (isEn ? "Fast algorithmic grading" : "Chấm Bằng Máy")}
          >
            {submitMode === 'ai' ? <Sparkles className="w-3 h-3 text-amber-200" /> : <Zap className="w-3 h-3 fill-current text-amber-200" />}
            <span>{isEn ? 'Submit' : 'Nộp'}</span>
          </button>
          <button
            onClick={() => setIsMobileCompact(false)}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
            title={isEn ? "Expand exam toolbar" : "Mở rộng thanh công cụ thi"}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <footer className="sticky bottom-0 z-30 shadow-xl flex flex-col shrink-0">
          {/* Pre-Submission Habit Check Gentle Nudge Banner */}
          {habitWarnings.length > 0 && (
            <div className="bg-amber-950/95 border-t-2 border-amber-500 text-amber-100 p-3 sm:px-5 backdrop-blur-md animate-in slide-in-from-bottom-2 shadow-2xl">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isEn ? `Pre-submission writing habit check (${habitWarnings.length} notices):` : `Rà soát thói quen viết trước khi nộp (${habitWarnings.length} lưu ý):`}</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    {habitWarnings.slice(0, 2).map((w, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5 text-amber-200/90 leading-tight">
                        <span className="text-amber-400 font-bold">•</span>
                        <span><strong>{w.title}:</strong> {w.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
                  <button
                    type="button"
                    onClick={handleDismissWarning}
                    className="flex-1 md:flex-none px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-1 cursor-pointer min-h-[40px]"
                  >
                    <span>{isEn ? '🔍 Review essay' : '🔍 Rà soát lại bài'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSubmit}
                    className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer min-h-[40px]"
                  >
                    <span>{isEn ? `Proceed to submit (${pendingSubmitMethod === 'ai' ? 'AI' : 'Algo'})` : `Tiếp tục nộp bài (${pendingSubmitMethod === 'ai' ? 'AI' : 'Máy'})`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Timer & Submit Bar */}
          <div className="bg-slate-900 text-white px-3 sm:px-4 pt-2 sm:pt-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
            
            {/* Timer Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Clock className={`w-4 h-4 ${isLowTime ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
                <span className={`font-mono text-base sm:text-lg font-bold tracking-wider ${
                  isLowTime ? 'text-red-400' : 'text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="hidden sm:block w-28 lg:w-40 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    isLowTime ? 'bg-red-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={onToggleTimer}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title={isRunning ? (isEn ? 'Pause timer' : 'Tạm dừng đồng hồ') : (isEn ? 'Resume timer' : 'Tiếp tục tính giờ')}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Reset Button */}
              <button
                onClick={onResetTimer}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={isEn ? "Reset timer" : "Đặt lại đồng hồ"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Collapse Toggle */}
              <button
                onClick={() => setIsMobileCompact(true)}
                className="sm:hidden p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={isEn ? "Minimize exam toolbar to avoid virtual keyboard" : "Thu nhỏ thanh điều khiển để không vướng bàn phím ảo"}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
              {wordCount < minWords && (
                <span className="text-[11px] sm:text-xs text-amber-400 font-medium mr-1">
                  <span className="sm:hidden">{wordCount}/{minWords}</span>
                  <span className="hidden sm:inline lg:hidden">{wordCount}/{minWords} {t('common.words')}</span>
                  <span className="hidden lg:inline">{isEn ? `Below minimum word count (${wordCount}/${minWords})` : `Chưa đạt số từ tối thiểu (${wordCount}/${minWords})`}</span>
                </span>
              )}

              {/* Unified Smart Submit Action Group */}
              <div className="relative inline-flex items-center rounded-xl shadow-md">
                {/* Main Action Button */}
                <button
                  onClick={() => handleInitiateSubmit(submitMode)}
                  disabled={isSubmitting}
                  className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 min-h-[38px] sm:min-h-[40px] rounded-l-xl text-white text-xs sm:text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                    submitMode === 'ai'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600'
                  }`}
                  title={
                    submitMode === 'ai'
                      ? (isEn ? "In-depth AI grading with Cambridge examiner criteria" : "Chấm chi tiết với Trí tuệ nhân tạo AI (cần kết nối API Key)")
                      : (isEn ? "Fast algorithmic grading (instant, no API key required)" : "Chấm điểm bằng thuật toán chuyên gia Cambridge (phản hồi ngay tức thì, không cần API Key)")
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{isEn ? 'Evaluating...' : 'Đang Chấm...'}</span>
                    </>
                  ) : submitMode === 'ai' ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="lg:hidden">{isEn ? 'AI Grade' : 'Chấm AI'}</span>
                      <span className="hidden lg:inline">{isEn ? 'Grade with AI' : 'Nộp Bài & Chấm AI'}</span>
                      <span className="sr-only">Chấm Bằng AI</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                      <span className="lg:hidden">{isEn ? 'Algorithm' : 'Chấm Máy'}</span>
                      <span className="hidden lg:inline">{isEn ? 'Algorithm Grade' : 'Nộp Bài & Chấm Điểm'}</span>
                      <span className="sr-only">Chấm Bằng Máy</span>
                    </>
                  )}
                </button>

                {/* Mode Selector Toggle */}
                <button
                  type="button"
                  onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
                  className={`px-2 py-1.5 sm:py-2 min-h-[38px] sm:min-h-[40px] rounded-r-xl border-l border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center ${
                    submitMode === 'ai' ? 'bg-rose-700 hover:bg-rose-600' : 'bg-amber-800 hover:bg-amber-700'
                  }`}
                  title={isEn ? "Switch grading mode: AI vs Algorithmic" : "Chuyển phương thức chấm: AI hoặc Máy"}
                  aria-label={isEn ? "Switch grading mode" : "Chuyển phương thức chấm"}
                >
                  <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-150 ${isModeSelectorOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mode Selector Popover */}
                {isModeSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsModeSelectorOpen(false)} />
                    <div className="absolute right-0 bottom-full mb-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1.5 text-left text-xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        {isEn ? 'Select Grading Engine' : 'Chọn Phương Thức Chấm'}
                      </div>

                      {/* Option 1: AI In-depth Grading */}
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitMode('ai');
                          setIsModeSelectorOpen(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2 rounded-xl transition-colors cursor-pointer ${
                          submitMode === 'ai' ? 'bg-red-950/80 border border-red-500/50 text-white' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-red-600 text-white shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold flex items-center justify-between text-xs">
                            <span>{isEn ? 'Grade with AI (Cambridge)' : 'Chấm Bằng AI (Cambridge)'}</span>
                            {submitMode === 'ai' && <span className="text-[10px] text-red-400 font-bold">✓ Đang chọn</span>}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            {isEn ? '4 Cambridge criteria (TR, CC, LR, GRA) with rewrite suggestions' : 'Chấm 4 tiêu chí TR, CC, LR, GRA kèm gợi ý viết lại (Cần API Key)'}
                          </div>
                        </div>
                      </button>

                      {/* Option 2: Algorithmic Fast Grading */}
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitMode('algorithmic');
                          setIsModeSelectorOpen(false);
                        }}
                        className={`w-full flex items-start space-x-2.5 p-2 rounded-xl transition-colors cursor-pointer ${
                          submitMode === 'algorithmic' ? 'bg-amber-950/80 border border-amber-500/50 text-white' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-amber-600 text-white shrink-0 mt-0.5">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold flex items-center justify-between text-xs">
                            <span>{isEn ? 'Algorithm Grade (Instant)' : 'Chấm Bằng Máy (Tức Thì)'}</span>
                            {submitMode === 'algorithmic' && <span className="text-[10px] text-amber-400 font-bold">✓ Đang chọn</span>}
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            {isEn ? 'Instant 0.02s check for word count, paragraphs & vocabulary diversity' : 'Chấm ngay trong 0.02s, đếm từ, kiểm tra đoạn & từ vựng (Không cần API Key)'}
                          </div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
