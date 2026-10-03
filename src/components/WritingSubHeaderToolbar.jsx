import React, { useState } from 'react';
import StarRatingWidget from './common/StarRatingWidget';
import { 
  ChevronDown, 
  ChevronUp,
  Flame, 
  Target, 
  GraduationCap, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  Keyboard,
  Sparkles,
  SlidersHorizontal,
  FolderKanban,
  ShieldAlert,
  Bookmark,
  Sliders,
  Pill,
  CheckCircle2
} from 'lucide-react';

export default function WritingSubHeaderToolbar({
  currentTask,
  streakCount = 3,
  targetBand = '6.5',
  masteredIds = [],
  onToggleMastered,
  onOpenLibrary,
  onOpenGenerator,
  onOpenOnboarding,
  onOpenTheory,
  onOpenMistakeLog,
  onOpenPrescription,
  mistakesCount = 0,
  isFocusMode,
  toggleFocusMode,
  onOpenShortcuts,
  weeklyWordProgress = 0,
  currentWeekWords = 0,
  weeklyWordTarget = 2500,
  onOpenCDIDisplay,
  cdiFontSize = 'standard',
  cdiContrast = 'standard',
  isSlimHeader = false,
  toggleSlimHeader,
  writingViewMode = 'pro',
  onToggleWritingViewMode,
  onOpenSlideOver
}) {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  // Daily Missions Progress Tracker
  const todayStr = new Date().toISOString().slice(0, 10);
  const hasWrittenToday = (() => {
    try {
      const subs = JSON.parse(localStorage.getItem('ielts_submissions_history') || '[]');
      return Array.isArray(subs) && subs.some(s => (s.timestamp || s.date || '').startsWith(todayStr));
    } catch {
      return false;
    }
  })();
  const hasPrescriptionToday = (() => {
    try {
      const history = JSON.parse(localStorage.getItem('ielts_prescription_history') || '{}');
      return Boolean(history[todayStr]?.completed);
    } catch {
      return false;
    }
  })();
  const hasVocabToday = (() => {
    try {
      const vocab = JSON.parse(localStorage.getItem('ielts_vocab_notebook') || '[]');
      return Array.isArray(vocab) && vocab.length > 0;
    } catch {
      return false;
    }
  })();
  const missionsDone = [hasWrittenToday, hasPrescriptionToday, hasVocabToday].filter(Boolean).length;

  return (
    <div className={`bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 shadow-2xs shrink-0 z-20 transition-all duration-300 ${
      isSlimHeader 
        ? 'py-1 min-h-[38px] flex items-center justify-between gap-1.5' 
        : 'py-2 flex flex-col md:flex-row md:items-center md:justify-between md:flex-wrap gap-1.5 sm:gap-2'
    }`}>
      
      {/* ============================================================ */}
      {/* ZONE 1 (Left): CORE WRITING TASK ACTIONS                     */}
      {/* ============================================================ */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 max-w-full overflow-x-auto no-scrollbar py-0.5">
        {/* 1. Task Selector Dropdown Trigger & Rating */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-0">
          <button 
            onClick={onOpenLibrary}
            className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-2.5 lg:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left shadow-2xs group cursor-pointer min-w-0 flex-1 md:flex-initial"
            title="Nhấn để đổi đề thi hoặc chọn từ thư viện đề IELTS"
          >
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider shrink-0 ${
              currentTask?.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
            }`}>
              Task {currentTask?.taskNumber || 2}
            </span>
            <span className="text-xs font-bold text-slate-800 max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[240px] xl:max-w-[320px] truncate">
              {currentTask?.title || 'IELTS Writing Task'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0" />
          </button>
          {currentTask && (
            <div className="hidden xs:flex items-center bg-slate-50/90 px-1 sm:px-1.5 py-0.5 sm:py-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
              <StarRatingWidget itemId={currentTask.id || currentTask.title} fallbackTitle={currentTask.title} size="xs" showAttempts={true} />
            </div>
          )}
        </div>

        {/* 2. Sinh Đề Mới Bằng AI (Primary Action) */}
        <button
          onClick={onOpenGenerator}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 group"
          title="Sinh đề thi Writing Task 1 hoặc Task 2 mới bám sát xu hướng bằng AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform shrink-0" />
          <span>Sinh Đề (AI)</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* ZONE 2 (Right): ESSENTIAL CONTROLS & UNIFIED TOOLS DROPDOWN  */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between md:justify-end space-x-1.5 sm:space-x-2 text-xs shrink-0 max-w-full py-0.5">
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          
          {/* Minimal Focus View vs Pro Studio View Mode Switcher */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/90 text-xs shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => onToggleWritingViewMode?.('minimal')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                writingViewMode === 'minimal'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Chế độ Tinh Giản (Minimal View): Ẩn các chỉ số phức tạp, tập trung gõ bài"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tinh Giản</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleWritingViewMode?.('pro')}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                writingViewMode === 'pro'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Chế độ Pro Studio: Đầy đủ các tiện ích và chỉ số phân tích chuyên sâu"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden xs:inline">Pro Studio</span>
              <span className="xs:hidden">Pro</span>
            </button>
          </div>

          {/* Unified "Tiện Ích & Cài Đặt" Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isToolsDropdownOpen || mistakesCount > 0
                  ? 'bg-amber-50/90 text-amber-900 border-amber-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Mở thực đơn Tiện ích: CDI, Chế độ tập trung, Thuộc bài, Sổ lỗi sai & Cẩm nang"
            >
              <FolderKanban className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden xs:inline">Tiện Ích & Cài Đặt</span>
              <span className="xs:hidden">Tiện Ích</span>
              {(cdiFontSize !== 'standard' || cdiContrast !== 'standard') && (
                <span className="w-2 h-2 rounded-full bg-blue-600" title="Đang bật tùy chỉnh tương phản CDI" />
              )}
              {mistakesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">
                  {mistakesCount}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popover */}
            {isToolsDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsToolsDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] max-h-[calc(100dvh-160px)] overflow-y-auto overscroll-contain bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-left">
                  
                  {/* SECTION 1: Cấu hình thi & Hiển thị */}
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Cấu Hình Phòng Thi & Hiển Thị
                  </div>

                  {/* Focus Mode Toggle */}
                  <button
                    onClick={() => {
                      toggleFocusMode?.();
                      setIsToolsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isFocusMode ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-lg ${isFocusMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
                        {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs">Chế Độ Tập Trung (Zen)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Ẩn mọi menu để tập trung viết (Alt+F)</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isFocusMode ? 'bg-purple-200 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                      {isFocusMode ? 'BẬT' : 'TẮT'}
                    </span>
                  </button>

                  {/* Minimal Focus View Mode Toggle */}
                  <button
                    onClick={() => {
                      onToggleWritingViewMode?.(writingViewMode === 'minimal' ? 'pro' : 'minimal');
                      setIsToolsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      writingViewMode === 'minimal' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-lg ${writingViewMode === 'minimal' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Giao Diện Tinh Giản (Minimal)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Ẩn các bảng biểu phân tích phụ, tối ưu tập trung</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${writingViewMode === 'minimal' ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-600'}`}>
                      {writingViewMode === 'minimal' ? 'BẬT' : 'TẮT'}
                    </span>
                  </button>

                  {/* CDI Display Settings */}
                  <button
                    onClick={() => {
                      onOpenCDIDisplay?.();
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Trợ Năng Hiển Thị CDI</div>
                        <div className="text-[10px] text-slate-400 font-normal">Cỡ chữ & màu tương phản IDP/BC</div>
                      </div>
                    </div>
                    {(cdiFontSize !== 'standard' || cdiContrast !== 'standard') && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        Tùy chỉnh
                      </span>
                    )}
                  </button>

                  {/* Mastered Task Toggle */}
                  <button
                    onClick={() => {
                      onToggleMastered?.(currentTask?.id);
                      setIsToolsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      masteredIds.includes(currentTask?.id) ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded-lg ${masteredIds.includes(currentTask?.id) ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Đánh Dấu Thuộc Đề Thi Này</div>
                        <div className="text-[10px] text-slate-400 font-normal">Ghi nhớ đã luyện thành thạo dạng bài này</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${masteredIds.includes(currentTask?.id) ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {masteredIds.includes(currentTask?.id) ? 'Đã thuộc ✓' : 'Chưa thuộc'}
                    </span>
                  </button>

                  {/* SECTION 2: Học tập & Sửa lỗi */}
                  <div className="border-t border-slate-100 pt-1 my-1"></div>
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sổ Tay & Kiến Thức Luyện Viết
                  </div>

                  {/* Sổ tay lỗi sai */}
                  <button
                    onClick={() => {
                      if (onOpenSlideOver) {
                        onOpenSlideOver('mistakes');
                      } else {
                        onOpenMistakeLog?.();
                      }
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>Sổ Tay Lỗi Sai Thường Gặp</span>
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">Khay Trượt</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">Ngữ pháp, từ vựng & bẫy diễn đạt bên hông</div>
                      </div>
                    </div>
                    {mistakesCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.5 rounded-full">
                        {mistakesCount}
                      </span>
                    )}
                  </button>

                  {/* Sổ tay từ vựng & Collocations */}
                  <button
                    onClick={() => {
                      if (onOpenSlideOver) {
                        onOpenSlideOver('vocab');
                      }
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>Sổ Tay Từ Vựng & Collocations</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">Khay Trượt</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">Tra cứu nhanh từ vựng & chèn trực tiếp vào bài</div>
                      </div>
                    </div>
                  </button>

                  {/* Đơn thuốc sửa lỗi SRS */}
                  <button
                    onClick={() => {
                      onOpenPrescription?.();
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 text-white">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center space-x-1">
                          <span>Đơn Thuốc Sửa Lỗi</span>
                          <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-black">SRS</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">Bài tập 3 phút khắc phục bẫy lỗi sai</div>
                      </div>
                    </div>
                  </button>

                  {/* Cẩm nang lý thuyết */}
                  <button
                    onClick={() => {
                      onOpenTheory?.();
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-amber-50 text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Cẩm Nang Chiến Thuật</div>
                      <div className="text-[10px] text-slate-400 font-normal">Chiến lược viết Task 1 & Task 2 chuẩn 8.0+</div>
                    </div>
                  </button>

                  {/* Phím tắt tra cứu */}
                  <button
                    onClick={() => {
                      onOpenShortcuts?.();
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                      <Keyboard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs">Bảng Tra Cứu Phím Tắt (?)</div>
                      <div className="text-[10px] text-slate-400 font-normal">Alt+F, Alt+K, Ctrl+Enter, Esc</div>
                    </div>
                  </button>

                  {/* SECTION 3: Mục tiêu & Streak */}
                  <div className="border-t border-slate-100 pt-1 my-1"></div>
                  <button
                    onClick={() => {
                      onOpenOnboarding?.();
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Mục Tiêu Band Điểm</div>
                        <div className="text-[10px] text-slate-400 font-normal">Nhấn để thay đổi lộ trình học</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-black text-[10px]">
                      Band {targetBand}
                    </span>
                  </button>

                  {/* Streak Info */}
                  <div className="px-2.5 py-1.5 bg-orange-50/60 rounded-xl border border-orange-200/50 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-orange-800 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      <span>Chuỗi học tập</span>
                    </div>
                    <span className="font-black text-xs text-orange-700">{streakCount} ngày liên tục</span>
                  </div>

                  {/* Daily Mission Progress */}
                  <div className="mt-1.5 p-2 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-xl border border-indigo-100/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                      <div className="flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Nhiệm Vụ Hôm Nay</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                        missionsDone === 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {missionsDone}/3 Đạt
                      </span>
                    </div>
                    <div className="space-y-1 text-[10px] text-slate-600 font-medium">
                      <div className="flex items-center justify-between">
                        <span>1. Viết bài / Dàn ý hôm nay</span>
                        <span className={hasWrittenToday ? "text-emerald-700 font-bold" : "text-slate-400"}>
                          {hasWrittenToday ? "✓ Xong" : "0/1"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>2. Uống đơn thuốc lỗi SRS</span>
                        <span className={hasPrescriptionToday ? "text-emerald-700 font-bold" : "text-slate-400"}>
                          {hasPrescriptionToday ? "✓ Xong" : "0/1"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>3. Ôn tập từ vựng & bẫy lỗi</span>
                        <span className={hasVocabToday ? "text-emerald-700 font-bold" : "text-slate-400"}>
                          {hasVocabToday ? "✓ Xong" : "0/1"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4. Weekly Word Target Progress Bar (Visible on desktop/laptop >= 1280px in Pro Studio Mode) */}
        {writingViewMode !== 'minimal' && (
          <div className="hidden xl:flex items-center space-x-2 text-slate-600 pl-2.5 border-l border-slate-200">
            <span className="font-medium text-[11px] text-slate-500">Mục tiêu tuần:</span>
            <div className="w-20 sm:w-28 lg:w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${weeklyWordProgress}%` }}
              />
            </div>
            <span className="font-bold text-slate-800 text-[11px]">{currentWeekWords}/{weeklyWordTarget} từ</span>
          </div>
        )}

        {/* 5. Workspace Expansion & Slim Header Toggle (Alt + Z) */}
        {toggleSlimHeader && (
          <button
            onClick={toggleSlimHeader}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSlimHeader
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={isSlimHeader ? "Thu gọn chế độ mở rộng, hiện lại thanh menu website (Alt + Z)" : "Mở rộng tối đa không gian viết bài, ẩn thanh menu trên (Alt + Z)"}
          >
            {isSlimHeader ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Thu gọn</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Mở rộng</span>
              </>
            )}
          </button>
        )}

      </div>

    </div>
  );
}
