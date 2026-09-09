import React from 'react';
import { Play, Pause, RotateCcw, Send, Clock, Sparkles } from 'lucide-react';

export default function TimerBar({
  timeRemaining,
  totalTime,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onSubmitEssay,
  isSubmitting,
  wordCount,
  minWords
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 300 && timeRemaining > 0; // Less than 5 mins
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-30 shadow-lg">
      
      {/* Timer Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
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
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          title={isRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục tính giờ'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Reset Button */}
        <button
          onClick={onResetTimer}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Đặt lại đồng hồ"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Submit Action Button */}
      <div className="flex items-center space-x-3">
        {wordCount < minWords && (
          <span className="text-xs text-amber-400 hidden md:inline">
            Chưa đạt số từ tối thiểu ({wordCount}/{minWords})
          </span>
        )}

        <button
          onClick={onSubmitEssay}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Giám Khảo Đang Chấm Bài...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Nộp Bài & Chấm Điểm AI</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
