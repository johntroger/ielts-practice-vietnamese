import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Send, Clock, Sparkles, Zap, ChevronDown, ChevronUp } from 'lucide-react';

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
  onOpenSettings
}) {
  const [isMobileCompact, setIsMobileCompact] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 300 && timeRemaining > 0; // Less than 5 mins
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

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
          <span className="text-[11px] text-slate-300 font-semibold">{wordCount}/{minWords} từ</span>
          <button
            onClick={() => onSubmitEssay('algorithmic')}
            disabled={isSubmitting}
            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center space-x-1 cursor-pointer active:scale-95 transition-transform"
            title="Chấm nhanh bằng máy"
          >
            <Zap className="w-3 h-3 fill-current" />
            <span>Nộp</span>
          </button>
          <button
            onClick={() => setIsMobileCompact(false)}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
            title="Mở rộng thanh công cụ thi"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <footer className="sticky bottom-0 z-30 shadow-xl flex flex-col">
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
                title={isRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục tính giờ'}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              {/* Reset Button */}
              <button
                onClick={onResetTimer}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Đặt lại đồng hồ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Collapse Toggle */}
              <button
                onClick={() => setIsMobileCompact(true)}
                className="sm:hidden p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Thu nhỏ thanh điều khiển để không vướng bàn phím ảo"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
              {wordCount < minWords && (
                <span className="text-[11px] sm:text-xs text-amber-400 font-medium mr-1">
                  <span className="md:hidden">{wordCount}/{minWords} từ</span>
                  <span className="hidden md:inline">Chưa đạt số từ tối thiểu ({wordCount}/{minWords})</span>
                </span>
              )}

              {/* 1. Algorithmic Fast Grading (Offline, 0s delay, no API Key needed) */}
              <button
                onClick={() => onSubmitEssay('algorithmic')}
                disabled={isSubmitting}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-2 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
                title="Chấm điểm bằng thuật toán chuyên gia Cambridge (phản hồi ngay tức thì, không cần API Key, không tốn quota)"
              >
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400/40" />
                <span>⚡ Chấm Bằng Máy</span>
              </button>

              {/* 2. AI In-depth Grading (Gemini) */}
              <button
                onClick={() => onSubmitEssay('ai')}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none justify-center flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
                title="Chấm chi tiết với Trí tuệ nhân tạo Gemini (cần kết nối API Key)"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Đang Chấm...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Chấm Bằng AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
