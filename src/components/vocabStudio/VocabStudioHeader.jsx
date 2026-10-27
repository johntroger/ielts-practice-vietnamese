import React from 'react';
import {
  Zap,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Menu,
  Flame,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function VocabStudioHeader({
  isEn,
  t,
  isExpanded,
  onToggleExpanded,
  isSyncing,
  onManualSync,
  isMobileSidebarOpen,
  onToggleMobileSidebar,
  onClose,
  masteredCount = 0,
  totalItems = 0,
  streak = 0
}) {
  const percentage = totalItems > 0 ? Math.round((masteredCount / totalItems) * 100) : 0;

  return (
    <header className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#003838] bg-[#004646] text-white flex items-center justify-between gap-3 shrink-0 shadow-xs z-30">
      {/* Left Branding & Unit Status */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 flex-1">
        {/* Mobile Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15 shrink-0"
          title={isEn ? "Toggle Topic Rail" : "Đóng / Mở Danh sách chủ đề"}
          aria-label={isEn ? "Toggle Navigation" : "Mở menu"}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Studio Logo Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#27c4b5] to-teal-400 flex items-center justify-center text-[#003838] font-black shadow-sm shrink-0">
          <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
        </div>

        {/* Title & Tagline */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight truncate text-white">
              {isEn ? 'IELTS Studio • Vocabulary, Grammar & Spelling' : 'IELTS Studio • Luyện Từ Vựng, Ngữ Pháp & Chính Tả'}
            </h2>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#27c4b5]/20 text-[#27c4b5] border border-[#27c4b5]/40 shrink-0">
              Band 5.5 - 7.5+
            </span>
          </div>
          <p className="text-[11px] text-teal-100/70 hidden md:block truncate">
            {isEn
              ? 'Deep recall, authentic Cambridge exam distractor traps & grammar scaffolding'
              : 'Active Recall, bẫy khảo thí Cambridge & công thức kiến trúc ngữ pháp điểm tựa'}
          </p>
        </div>
      </div>

      {/* Right Tools & Master Stats */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Streak Counter Pill */}
        {streak > 1 && (
          <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{streak} {isEn ? 'Streak' : 'Chuỗi'}</span>
          </div>
        )}

        {/* Progress Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-xs text-teal-100">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#27c4b5]" />
          <span className="font-semibold">
            {isEn ? 'Mastered' : 'Đã thuộc'}: <b className="text-white font-bold">{masteredCount}</b>/{totalItems}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#27c4b5] text-[#003838] font-black">
            {percentage}%
          </span>
        </div>

        {/* Cloud Sync Button */}
        <button
          type="button"
          onClick={onManualSync}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer disabled:opacity-50"
          title={isEn ? "Sync progress with Supabase Cloud" : "Đồng bộ tiến trình với Supabase Cloud"}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#27c4b5]' : 'text-teal-200'}`} />
          <span className="hidden sm:inline">
            {isSyncing ? (isEn ? 'Syncing...' : 'Đang sync...') : (isEn ? 'Sync' : 'Đồng bộ')}
          </span>
        </button>

        {/* Fullscreen Workspace Toggle */}
        <button
          type="button"
          onClick={onToggleExpanded}
          className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
            isExpanded
              ? 'bg-amber-400 text-[#003838] font-bold hover:bg-amber-300 shadow-xs'
              : 'text-teal-200 hover:text-white hover:bg-white/10 bg-white/5 border border-white/10'
          }`}
          title={isExpanded ? (isEn ? "Collapse workspace (Alt + Z)" : "Thu gọn (Alt + Z)") : (isEn ? "Expand fullscreen (Alt + Z)" : "Toàn màn hình (Alt + Z)")}
          aria-label={isExpanded ? (isEn ? "Collapse" : "Thu gọn") : (isEn ? "Expand" : "Mở rộng")}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-teal-200 hover:text-white hover:bg-rose-500/80 transition-colors cursor-pointer"
          aria-label={isEn ? "Close studio" : "Đóng bảng luyện tập"}
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
