import React from 'react';
import { 
  ChevronDown, 
  Flame, 
  Target, 
  GraduationCap, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Keyboard 
} from 'lucide-react';

export default function WritingSubHeaderToolbar({
  currentTask,
  streakCount,
  targetBand,
  masteredIds = [],
  onToggleMastered,
  onOpenLibrary,
  onOpenOnboarding,
  onOpenTheory,
  onOpenMistakeLog,
  mistakesCount = 0,
  isFocusMode,
  toggleFocusMode,
  onOpenShortcuts,
  weeklyWordProgress = 0,
  currentWeekWords = 0,
  weeklyWordTarget = 2500
}) {
  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-2xs shrink-0 z-20">
      {/* Row 1 / Left: Task Selector & Target Badges */}
      <div className="flex items-center space-x-2 min-w-0">
        <button 
          onClick={onOpenLibrary}
          className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left shadow-2xs group cursor-pointer min-w-0 flex-1 md:flex-initial"
          title="Nhấn để đổi đề thi hoặc chọn từ thư viện đề IELTS"
        >
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider shrink-0 ${
            currentTask?.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            Task {currentTask?.taskNumber || 2}
          </span>
          <span className="text-xs font-bold text-slate-800 max-w-[160px] sm:max-w-[260px] lg:max-w-[380px] xl:max-w-[480px] truncate">
            {currentTask?.title || 'IELTS Writing Task'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0" />
        </button>

        {/* Streak Badge */}
        <div 
          className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold shrink-0"
          title={`Chuỗi ngày học liên tục: ${streakCount} ngày!`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
          <span>{streakCount}d</span>
        </div>

        {/* Target Band Badge */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/80 text-red-700 hover:bg-red-100/80 text-xs font-black shrink-0 transition-all cursor-pointer shadow-2xs group"
          title="Mục tiêu điểm IELTS của bạn. Nhấn để thay đổi mục tiêu"
        >
          <Target className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform shrink-0" />
          <span>Band {targetBand}</span>
        </button>

        {/* Mastered Task Toggle Button */}
        <button
          onClick={() => onToggleMastered && onToggleMastered(currentTask?.id)}
          className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs ${
            masteredIds.includes(currentTask?.id)
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
          }`}
          title={masteredIds.includes(currentTask?.id)
            ? 'Đề thi này đã được đánh dấu là "Đã thuộc". Nhấn để bỏ đánh dấu.'
            : 'Đánh dấu đề thi này là "Đã thuộc" để ghi nhớ tiến trình và lọc trong thư viện.'}
        >
          <GraduationCap className={`w-3.5 h-3.5 ${masteredIds.includes(currentTask?.id) ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">{masteredIds.includes(currentTask?.id) ? 'Đã thuộc' : 'Thuộc bài'}</span>
        </button>
      </div>

      {/* Row 2 on Mobile / Right on Desktop: Quick Tools & Word Progress */}
      <div className="flex items-center justify-between md:justify-end space-x-2 text-xs shrink-0">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenTheory}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200/80 shadow-2xs transition-colors cursor-pointer"
            title="Cẩm nang chiến thuật & lý thuyết viết IELTS Academic"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Cẩm Nang</span>
          </button>

          <button
            onClick={onOpenMistakeLog}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors cursor-pointer"
            title="Xem sổ tay các lỗi sai ngữ pháp & từ vựng đã lưu"
          >
            <span className="text-amber-600">⚠️</span>
            <span>Lỗi sai ({mistakesCount})</span>
          </button>

          {/* Focus Mode (Zen Mode) Toggle */}
          <button
            onClick={toggleFocusMode}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isFocusMode
                ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={isFocusMode ? "Đang ở Chế độ Tập Trung. Nhấn để quay lại (Alt + F)" : "Bật Chế độ Tập Trung toàn màn hình (Alt + F)"}
          >
            {isFocusMode ? (
              <Minimize2 className="w-3.5 h-3.5 text-purple-600" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden lg:inline">{isFocusMode ? 'Thoát Focus' : 'Tập trung'}</span>
          </button>

          {/* Keyboard Shortcuts Trigger Button */}
          <button
            onClick={onOpenShortcuts}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200 transition-colors cursor-pointer"
            title="Bảng tra cứu phím tắt (Nhấn ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline text-[11px] font-semibold">Phím tắt (?)</span>
          </button>
        </div>

        {/* Weekly Word Target Progress Bar */}
        <div className="hidden sm:flex items-center space-x-2 text-slate-600 pl-2.5 border-l border-slate-200">
          <span className="font-medium text-[11px] text-slate-500">Mục tiêu tuần:</span>
          <div className="w-20 sm:w-28 lg:w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${weeklyWordProgress}%` }}
            />
          </div>
          <span className="font-bold text-slate-800 text-[11px]">{currentWeekWords}/{weeklyWordTarget} từ</span>
        </div>
      </div>
    </div>
  );
}
