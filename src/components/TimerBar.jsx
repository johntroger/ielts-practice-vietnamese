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
  minWords,
  apiKey,
  onOpenSettings
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 300 && timeRemaining > 0; // Less than 5 mins
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));

  return (
    <footer className="sticky bottom-0 z-30 shadow-xl flex flex-col">
      {/* 1. Main Timer & Submit Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-3">
        
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

      {/* 2. Bottom Note: Desktop full notice, Mobile slim notice only if no API key */}
      <div className="hidden sm:flex w-full bg-slate-950/95 border-t border-slate-800/90 px-3 sm:px-4 py-1.5 flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 text-center leading-normal">
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Lưu ý:</strong> Bạn cần{' '}
            <button
              onClick={onOpenSettings}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              kết nối AI của bạn (Google Gemini API Key)
            </button>{' '}
            thì mới sử dụng trọn vẹn tất cả tính năng của website (Chấm bài 4 tiêu chí, Gợi ý ý tưởng, Nạp đề AI & Sửa ngữ pháp).
          </span>
        </div>
        {!apiKey ? (
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold shadow-xs transition-all active:scale-95 animate-pulse cursor-pointer shrink-0"
            title="Nhấn để mở bảng cài đặt API Key"
          >
            <span>⚡ Kết nối ngay</span>
          </button>
        ) : (
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium transition-colors cursor-pointer shrink-0"
            title="AI đã sẵn sàng! Nhấn nếu muốn đổi API Key khác"
          >
            <span>✓ Đã kết nối AI</span>
          </button>
        )}
      </div>

      {/* Mobile Ultra-Slim Reminder (Only if unconfigured) */}
      {!apiKey && (
        <div className="sm:hidden w-full bg-amber-950/90 border-t border-amber-800/80 px-2.5 py-1 flex items-center justify-between text-[11px] text-amber-200">
          <div className="flex items-center space-x-1.5 truncate">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">Cần kết nối Gemini API để chấm bài</span>
          </div>
          <button
            onClick={onOpenSettings}
            className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold shrink-0 ml-1.5"
          >
            Kết nối
          </button>
        </div>
      )}
    </footer>
  );
}
