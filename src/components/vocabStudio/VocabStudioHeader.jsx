import React, { useState } from 'react';
import {
  Zap,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Menu,
  Flame,
  CheckCircle2,
  Share2,
  Check
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
  streak = 0,
  activeTab = 'spelling'
}) {
  const percentage = totalItems > 0 ? Math.round((masteredCount / totalItems) * 100) : 0;
  const [isCopiedUrl, setIsCopiedUrl] = useState(false);

  const handleCopyShareUrl = () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ielts-practice-vietnamese.vercel.app';
      const tabParam = activeTab && activeTab !== 'spelling' ? `?tab=${activeTab}` : '';
      const shareUrl = `${origin}/vocab-studio${tabParam}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setIsCopiedUrl(true);
      setTimeout(() => setIsCopiedUrl(false), 2200);
    } catch (e) {
      console.error('Failed to copy studio URL:', e);
    }
  };

  return (
    <header className="px-4 sm:px-6 py-3 border-b border-[#e5e9ea] bg-[#f7f5ef] text-[#0f172a] flex items-center justify-between gap-3 shrink-0 z-30">
      {/* Left: Clean Brand Logo & Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-[#d9e3e4] shrink-0"
          title={isEn ? "Toggle Menu" : "Danh mục"}
          aria-label={isEn ? "Toggle Menu" : "Mở menu"}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Wordmark logo style ForumFlash */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#004646] flex items-center justify-center text-[#27c4b5] font-black shadow-xs shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-black tracking-tight text-[#004646]">
                IELTS Studio<span className="text-[#27c4b5]">.</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#004646]/10 text-[#004646] border border-[#004646]/20">
                Cambridge Exam Prep
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              {isEn ? 'Spelling Traps, Grammar Scaffolding & Active Recall' : 'Bẫy chính tả, Ngữ pháp điểm tựa & Phản xạ từ vựng'}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Minimalist Tools */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Streak Pill */}
        {streak > 1 && (
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
            <Flame className="w-3.5 h-3.5 fill-current text-amber-500 animate-pulse" />
            <span>{streak} {isEn ? 'Streak' : 'Chuỗi'}</span>
          </div>
        )}

        {/* Mastered Progress Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-xl bg-white border border-[#d9e3e4] text-xs text-slate-600 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#27c4b5]" />
          <span className="font-semibold">
            {isEn ? 'Mastered' : 'Đã thuộc'}: <b className="text-[#004646] font-extrabold">{masteredCount}</b>/{totalItems}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#e6f5f3] text-[#004646] font-black border border-[#27c4b5]/30">
            {percentage}%
          </span>
        </div>

        {/* Cloud Sync */}
        <button
          type="button"
          onClick={onManualSync}
          disabled={isSyncing}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-[#d9e3e4] transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
          title={isEn ? "Sync with Cloud" : "Đồng bộ đám mây"}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#27c4b5]' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">
            {isSyncing ? (isEn ? 'Syncing...' : 'Đang sync...') : (isEn ? 'Sync' : 'Đồng bộ')}
          </span>
        </button>

        {/* Copy Direct URL */}
        <button
          type="button"
          onClick={handleCopyShareUrl}
          className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer shadow-2xs ${
            isCopiedUrl
              ? 'bg-[#004646] text-[#27c4b5] border-[#004646]'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-[#d9e3e4]'
          }`}
          title={
            isCopiedUrl
              ? (isEn ? "URL Copied to clipboard! (/vocab-studio)" : "Đã sao chép link! (/vocab-studio)")
              : (isEn ? "Copy direct URL to this Studio (/vocab-studio)" : "Sao chép link trực tiếp (/vocab-studio)")
          }
          aria-label={isEn ? "Copy Direct URL" : "Sao chép liên kết"}
        >
          {isCopiedUrl ? (
            <Check className="w-3.5 h-3.5 text-[#27c4b5]" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span className="hidden sm:inline">
            {isCopiedUrl
              ? (isEn ? 'Copied!' : 'Đã chép link!')
              : (isEn ? 'Share Link' : 'Chia sẻ link')}
          </span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={onToggleExpanded}
          className={`p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
            isExpanded
              ? 'bg-[#004646] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white bg-white/70 border border-[#d9e3e4]'
          }`}
          title={isExpanded ? (isEn ? "Collapse (Alt + Z)" : "Thu gọn (Alt + Z)") : (isEn ? "Expand (Alt + Z)" : "Mở rộng (Alt + Z)")}
          aria-label={isExpanded ? (isEn ? "Collapse" : "Thu gọn") : (isEn ? "Expand" : "Mở rộng")}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer border border-transparent"
          aria-label={isEn ? "Close" : "Đóng"}
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
