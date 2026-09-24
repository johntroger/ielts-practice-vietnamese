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
  Sliders,
  Pill
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
  toggleSlimHeader
}) {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  return (
    <div className={`bg-white border-b border-slate-200 px-3 sm:px-6 shadow-2xs shrink-0 z-20 transition-all duration-300 ${
      isSlimHeader 
        ? 'py-1 min-h-[38px] flex items-center justify-between gap-1.5' 
        : 'py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2'
    }`}>
      
      {/* ============================================================ */}
      {/* ZONE 1 (Left): CORE WRITING TASK ACTIONS                     */}
      {/* ============================================================ */}
      <div className="flex items-center space-x-2 min-w-0">
        {/* 1. Task Selector Dropdown Trigger & Rating */}
        <div className="flex items-center space-x-1.5 min-w-0">
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
            <span className="text-xs font-bold text-slate-800 max-w-[140px] sm:max-w-[180px] lg:max-w-[240px] xl:max-w-[320px] truncate">
              {currentTask?.title || 'IELTS Writing Task'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0" />
          </button>
          {currentTask && (
            <div className="hidden sm:flex items-center bg-slate-50/90 px-2 py-1 rounded-xl border border-slate-200 shrink-0 shadow-2xs">
              <StarRatingWidget itemId={currentTask.id || currentTask.title} fallbackTitle={currentTask.title} size="xs" showAttempts={true} />
            </div>
          )}
        </div>

        {/* 2. Sinh Đề Mới Bằng AI (Prominent Action) */}
        <button
          onClick={onOpenGenerator}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/90 text-red-700 hover:bg-red-100/90 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs group"
          title="Sinh đề thi Writing Task 1 hoặc Task 2 mới bám sát xu hướng 2025–2026 bằng AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform shrink-0" />
          <span className="hidden sm:inline">Sinh Đề (AI)</span>
          <span className="sm:hidden">Sinh Đề</span>
        </button>

        {/* 3. Mastered Task Toggle (Thuộc Bài) */}
        <button
          onClick={() => onToggleMastered && onToggleMastered(currentTask?.id)}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs ${
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

      {/* ============================================================ */}
      {/* ZONE 2 (Right): EXAM MODES, CDI DISPLAY & ESSENTIAL TOOLS    */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between md:justify-end space-x-2 text-xs shrink-0">
        <div className="flex items-center space-x-1.5">
          
          {/* 1. CDI Display & Accessibility Settings (Font Scale / Color Contrast) */}
          <button
            onClick={onOpenCDIDisplay}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              (cdiFontSize !== 'standard' || cdiContrast !== 'standard')
                ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Tùy chỉnh cỡ chữ & chế độ tương phản chuẩn phòng thi máy tính CDI"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Trợ Năng CDI</span>
            {(cdiFontSize !== 'standard' || cdiContrast !== 'standard') && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>

          {/* 2. Focus Mode (Zen Mode) Toggle */}
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

          {/* 3. De-cluttered "Tiện Ích & Sổ Tay" Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isToolsDropdownOpen || mistakesCount > 0
                  ? 'bg-amber-50/80 text-amber-900 border-amber-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Mở thực đơn Sổ tay lỗi sai, Cẩm nang, Phím tắt & Mục tiêu"
            >
              <FolderKanban className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Tiện Ích</span>
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
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-left">
                  
                  {/* Item 1: Cẩm nang lý thuyết */}
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

                  {/* Item 2: Sổ tay lỗi sai */}
                  <button
                    onClick={() => {
                      onOpenMistakeLog?.();
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Sổ Tay Lỗi Sai Thường Gặp</div>
                        <div className="text-[10px] text-slate-400 font-normal">Ngữ pháp, từ vựng & bẫy diễn đạt</div>
                      </div>
                    </div>
                    {mistakesCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.5 rounded-full">
                        {mistakesCount}
                      </span>
                    )}
                  </button>

                  {/* Item 2.5: Đơn thuốc sửa lỗi mỗi ngày (SRS) */}
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

                  {/* Item 3: Phím tắt tra cứu */}
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

                  <div className="border-t border-slate-100 pt-1 my-1"></div>

                  {/* Item 4: Mục tiêu Band */}
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

                  {/* Item 5: Streak Info */}
                  <div className="px-2.5 py-1.5 bg-orange-50/60 rounded-xl border border-orange-200/50 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-orange-800 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      <span>Chuỗi học tập</span>
                    </div>
                    <span className="font-black text-xs text-orange-700">{streakCount} ngày liên tục</span>
                  </div>

                </div>
              </>
            )}
          </div>

        </div>

        {/* 4. Weekly Word Target Progress Bar (Visible on desktop/laptop) */}
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

        {/* 5. Slim Header Mode Toggle (Alt + Z) */}
        {toggleSlimHeader && (
          <button
            onClick={toggleSlimHeader}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isSlimHeader
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={isSlimHeader ? "Mở rộng thanh công cụ Writing (Alt + Z)" : "Thu gọn thanh công cụ để tăng diện tích viết bài (Alt + Z)"}
          >
            {isSlimHeader ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden xl:inline">Mở rộng</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xl:inline">Thu gọn</span>
              </>
            )}
          </button>
        )}

      </div>

    </div>
  );
}
