import React, { useRef, useEffect } from 'react';
import {
  Mic, Sparkles, ShieldCheck, Layers, BookOpen, Settings,
  Maximize2, Minimize2, Sliders, ChevronDown
} from 'lucide-react';
import { SPEAKING_EXAMINER_PROFILES } from '../../data/speakingTopics';

export default function SpeakingTopHeader({
  activeMode,
  setActiveMode,
  selectedExaminerId,
  setSelectedExaminerId,
  activeExaminer,
  isEn,
  allMockPacks = [],
  onOpenGenerator,
  onOpenPracticeTopicModal,
  onOpenSoundcheck,
  onOpenMockLibrary,
  onOpenTheory,
  onOpenSettings,
  isSlimHeader,
  toggleSlimHeader,
  isMobileToolsOpen,
  setIsMobileToolsOpen
}) {
  const mobileToolsRef = useRef(null);

  // Tạm thời ẩn tất cả các nút sinh đề bằng AI trên giao diện để tinh gọn theo yêu cầu
  const SHOW_AI_GENERATOR_BUTTONS = false;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileToolsRef.current && !mobileToolsRef.current.contains(e.target)) {
        setIsMobileToolsOpen(false);
      }
    };
    if (isMobileToolsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileToolsOpen, setIsMobileToolsOpen]);

  return (
    <div className="bg-slate-900 border-b border-slate-800/80 px-2.5 sm:px-6 py-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3 shrink-0">
      
      {/* Left / Row 1 on Mobile: Branding & Mode Switcher */}
      <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">Speaking Studio</span>
              <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden lg:block">
              {isEn ? "1-on-1 Interview • 4 Cambridge Criteria" : "Khảo thí 1-on-1 • 4 Tiêu chí Cambridge"}
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Mode Pill Switcher */}
        <div className="flex bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 shrink-0">
          <button
            onClick={() => setActiveMode('mock')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'mock' 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{isEn ? 'Mock Exam' : 'Thi Thử'}<span className="hidden sm:inline"> Full Test</span></span>
          </button>
          <button
            onClick={() => setActiveMode('practice')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'practice' 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{isEn ? 'Practice Mode' : 'Luyện Tự Do'}</span>
          </button>
        </div>
      </div>

      {/* Right / Row 2 on Mobile: Examiner Profile Picker & Quick Tools */}
      {/* DESKTOP LAYOUT (>= md) */}
      <div className="hidden md:flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        {/* AI Generator Quick Button (Tạm thời ẩn theo yêu cầu) */}
        {SHOW_AI_GENERATOR_BUTTONS && (
          <button
            onClick={() => {
              if (activeMode === 'practice') {
                onOpenPracticeTopicModal();
              } else {
                onOpenGenerator();
              }
            }}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm shadow-purple-900/40 cursor-pointer shrink-0"
            title={activeMode === 'practice' ? (isEn ? "Generate speaking practice topics with AI" : "Dùng AI để sinh chủ đề luyện tập mới") : (isEn ? "Generate new speaking mock test with AI" : "Dùng AI để tạo bộ đề thi Speaking mới")}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{activeMode === 'practice' ? (isEn ? 'AI Topics' : 'Sinh Chủ Đề (AI)') : (isEn ? 'AI Test' : 'Sinh Đề (AI)')}</span>
          </button>
        )}

        {/* Soundcheck Quick Button */}
        <button
          onClick={onOpenSoundcheck}
          className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0"
          title={isEn ? "Check microphone and speaker volume" : "Kiểm tra Micro và Âm lượng loa"}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{isEn ? 'Soundcheck' : 'Kiểm Tra Thiết Bị'}</span>
        </button>

        {/* Examiner Picker */}
        <div className="relative flex items-center bg-slate-800/60 border border-slate-700/60 rounded-xl px-2 py-1 text-[11px] sm:text-xs shrink-0">
          <span className="text-sm sm:text-base mr-1">{activeExaminer.avatar}</span>
          <select
            value={selectedExaminerId}
            onChange={(e) => setSelectedExaminerId(e.target.value)}
            className="bg-transparent text-slate-200 text-[11px] sm:text-xs font-bold focus:outline-none cursor-pointer pr-1"
          >
            {SPEAKING_EXAMINER_PROFILES.map(ex => (
              <option key={ex.id} value={ex.id} className="bg-slate-900 text-slate-200">
                {ex.name} ({ex.accent.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Speaking Mock Test Library Button */}
        {activeMode === 'mock' && (
          <button
            type="button"
            onClick={onOpenMockLibrary}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition-all cursor-pointer shrink-0"
            title={isEn ? "Open Speaking Mock Test Library" : "Mở Kho Đề Thi Thử IELTS Speaking"}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>📚 {isEn ? `Library (${allMockPacks.length})` : `Kho Đề (${allMockPacks.length})`}</span>
          </button>
        )}

        {/* Theory Handbook Button */}
        {onOpenTheory && (
          <button
            onClick={onOpenTheory}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-purple-300 hover:text-purple-200 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer shrink-0"
            title={isEn ? "Open Speaking Strategy & Theory Handbook" : "Mở Cẩm Nang Lý Thuyết & Chiến Thuật Speaking"}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 {isEn ? 'Handbook' : 'Cẩm Nang'}</span>
          </button>
        )}

        {/* Settings Shortcut */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer shrink-0"
            title={isEn ? "API & Audio Settings" : "Cài đặt API & Âm thanh"}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* Workspace Expansion Toggle (Alt + Z) */}
        {toggleSlimHeader && (
          <button
            type="button"
            onClick={toggleSlimHeader}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 ${
              isSlimHeader
                ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isSlimHeader ? (isEn ? "Exit expanded mode, show navigation bar (Alt + Z)" : "Thu gọn chế độ mở rộng, hiện lại thanh menu website (Alt + Z)") : (isEn ? "Maximize speaking workspace, hide top navigation (Alt + Z)" : "Mở rộng tối đa phòng thi Speaking, ẩn thanh menu trên (Alt + Z)")}
          >
            {isSlimHeader ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? "Collapse" : "Thu gọn"}</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? "Expand" : "Mở rộng"}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* MOBILE CONSOLIDATED CONTROLS (< md) */}
      <div className="flex md:hidden items-center justify-between gap-1.5 shrink-0 w-full pt-0.5">
        {/* Left: AI Generator Button (Tạm thời ẩn theo yêu cầu) */}
        {SHOW_AI_GENERATOR_BUTTONS && (
          <button
            onClick={() => {
              if (activeMode === 'practice') {
                onOpenPracticeTopicModal();
              } else {
                onOpenGenerator();
              }
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold shadow-sm cursor-pointer shrink-0"
            title={activeMode === 'practice' ? (isEn ? "Generate speaking practice topics with AI" : "Dùng AI để sinh chủ đề luyện tập mới") : (isEn ? "Generate new speaking mock test with AI" : "Dùng AI để tạo bộ đề thi Speaking mới")}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{activeMode === 'practice' ? (isEn ? 'AI Topics' : 'Sinh Đề AI') : (isEn ? 'AI Test' : 'Sinh Đề AI')}</span>
          </button>
        )}

        {/* Middle: Examiner Picker */}
        <div className="relative flex items-center bg-slate-800/80 border border-slate-700/60 rounded-xl px-2 py-1 text-[11px] shrink-0 max-w-[150px]">
          <span className="text-sm mr-1 shrink-0">{activeExaminer.avatar}</span>
          <select
            value={selectedExaminerId}
            onChange={(e) => setSelectedExaminerId(e.target.value)}
            className="bg-transparent text-slate-200 text-[11px] font-bold focus:outline-none cursor-pointer truncate"
          >
            {SPEAKING_EXAMINER_PROFILES.map(ex => (
              <option key={ex.id} value={ex.id} className="bg-slate-900 text-slate-200">
                {ex.name} ({ex.accent.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Right: Consolidated Mobile Tools Dropdown (Dropbox) */}
        <div className="relative shrink-0" ref={mobileToolsRef}>
          <button
            type="button"
            onClick={() => setIsMobileToolsOpen(prev => !prev)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer shadow-2xs shrink-0 ${
              isMobileToolsOpen
                ? 'bg-purple-900/70 text-purple-200 border-purple-500/60 ring-1 ring-purple-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isEn ? "Open speaking utilities" : "Mở tiện ích phòng thi Speaking"}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>{isEn ? 'Tools' : 'Tiện Ích'}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Tools Dropdown Popup */}
          {isMobileToolsOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 min-w-[220px] max-w-[min(280px,calc(100vw-16px))] max-h-[calc(100dvh-110px)] overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 text-slate-200">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>{isEn ? 'Speaking Utilities' : 'Tiện Ích Phòng Thi'}</span>
                <Sliders className="w-3 h-3 text-purple-400" />
              </div>

              {/* Library Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileToolsOpen(false);
                  if (activeMode === 'mock') {
                    onOpenMockLibrary();
                  } else {
                    onOpenPracticeTopicModal();
                  }
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 text-purple-200 flex items-center space-x-2.5 cursor-pointer transition-colors"
              >
                <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                <div className="flex-1 truncate">
                  <span>{isEn ? 'Mock Test Library' : 'Kho Đề Thi Thử'}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    {allMockPacks.length} {isEn ? 'Test Packs' : 'bộ đề chuẩn IDP/BC'}
                  </span>
                </div>
              </button>

              {/* Soundcheck Button */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileToolsOpen(false);
                  onOpenSoundcheck();
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 text-emerald-300 flex items-center space-x-2.5 cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex-1 truncate">
                  <span>{isEn ? 'Soundcheck Device' : 'Kiểm Tra Micro & Loa'}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">
                    {isEn ? 'Test voice recorder' : 'Đảm bảo micro thu âm tốt'}
                  </span>
                </div>
              </button>

              {/* Theory Handbook Button */}
              {onOpenTheory && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileToolsOpen(false);
                    onOpenTheory();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 text-amber-200 flex items-center space-x-2.5 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="flex-1 truncate">
                    <span>{isEn ? 'Strategy Handbook' : 'Cẩm Nang Chiến Thuật'}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {isEn ? 'A.R.E.A & PEEL Matrix' : 'Chiến thuật 4 tiêu chí'}
                    </span>
                  </div>
                </button>
              )}

              {/* Settings Button */}
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileToolsOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 text-slate-300 flex items-center space-x-2.5 cursor-pointer transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="flex-1 truncate">
                    <span>{isEn ? 'API & Audio Settings' : 'Cài Đặt API & Âm Thanh'}</span>
                    <span className="text-[10px] text-slate-500 block font-normal">
                      Gemini & AI Audio Key
                    </span>
                  </div>
                </button>
              )}

              {/* Workspace Expansion Toggle (Alt + Z) */}
              {toggleSlimHeader && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileToolsOpen(false);
                    toggleSlimHeader();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 text-cyan-300 flex items-center space-x-2.5 cursor-pointer transition-colors border-t border-slate-800/80 pt-2"
                >
                  {isSlimHeader ? (
                    <>
                      <Minimize2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{isEn ? 'Exit Expanded View' : 'Thu Gọn Mở Rộng'}</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{isEn ? 'Maximize Screen' : 'Toàn Màn Hình (Alt+Z)'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
