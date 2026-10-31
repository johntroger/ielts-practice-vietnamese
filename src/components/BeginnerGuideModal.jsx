import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  X,
  Swords,
  Puzzle,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Compass,
  HeartHandshake,
  Lightbulb,
  Target,
  Zap,
  BookMarked,
  Layers,
  ChevronDown,
  Plus,
  Check
} from 'lucide-react';
import { useTranslation } from '../i18n';
import HeadingInfoTip from './common/HeadingInfoTip';
import { safeSet } from '../utils/storageService';

export default function BeginnerGuideModal({
  isOpen,
  onClose,
  targetBand = '6.5',
  onApplyTargetBand,
  onOpenArena,
  onOpenDrills,
  onOpenDiagnostic,
  onOpenTheory
}) {
  if (!isOpen) return null;
  const { isEn } = useTranslation();
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'jargon' | 'target'
  const [bandAppliedMsg, setBandAppliedMsg] = useState('');

  // ----------------------------------------------------
  // DYNAMIC TABS & DROPBOX PICKER ARCHITECTURE
  // ----------------------------------------------------
  const beginnerTabsCatalog = useMemo(() => [
    {
      id: 'roadmap',
      icon: Compass,
      label: isEn ? "4-Step Roadmap" : "1. Lộ Trình 4 Bước",
      shortLabel: isEn ? "Roadmap" : "Lộ trình",
      activeTheme: 'bg-white text-emerald-800 shadow-md font-bold',
      iconColor: 'text-emerald-700'
    },
    {
      id: 'jargon',
      icon: HelpCircle,
      label: isEn ? "IELTS Jargon Buster" : "2. Giải Thích Thuật Ngữ",
      shortLabel: isEn ? "Jargon" : "Thuật ngữ",
      activeTheme: 'bg-white text-emerald-800 shadow-md font-bold',
      iconColor: 'text-teal-700'
    },
    {
      id: 'target',
      icon: Target,
      label: isEn ? "Starter Target Band" : "3. Chọn Target Vừa Sức",
      shortLabel: isEn ? "Target Band" : "Target Band",
      activeTheme: 'bg-white text-emerald-800 shadow-md font-bold',
      iconColor: 'text-amber-700'
    }
  ], [isEn]);

  const [openTabs, setOpenTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_beginner_open_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['roadmap', 'jargon', 'target'];
  });

  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const tabDropdownRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('ielts_beginner_open_tabs', JSON.stringify(openTabs));
    } catch (e) {}
  }, [openTabs]);

  // Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tabDropdownRef.current && !tabDropdownRef.current.contains(event.target)) {
        setIsTabDropdownOpen(false);
      }
    };
    if (isTabDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isTabDropdownOpen]);

  // Ensure activeTab is always in openTabs
  useEffect(() => {
    if (activeTab && !openTabs.includes(activeTab)) {
      setOpenTabs(prev => [...prev, activeTab]);
    }
  }, [activeTab, openTabs]);

  const handleSelectFromDropdown = (tabId) => {
    if (!openTabs.includes(tabId)) {
      setOpenTabs(prev => [...prev, tabId]);
    }
    setActiveTab(tabId);
    setIsTabDropdownOpen(false);
  };

  const handleCloseTab = (tabId) => {
    const nextList = openTabs.filter(id => id !== tabId);
    setOpenTabs(nextList);
    if (activeTab === tabId) {
      if (nextList.length > 0) {
        const closedIdx = openTabs.indexOf(tabId);
        const nextActiveIdx = Math.min(closedIdx, nextList.length - 1);
        setActiveTab(nextList[nextActiveIdx] || nextList[0]);
      } else {
        const remaining = beginnerTabsCatalog.find(t => t.id !== tabId);
        if (remaining) {
          setActiveTab(remaining.id);
          setOpenTabs([remaining.id]);
        }
      }
    }
  };

  const handleOpenAllTabs = () => {
    setOpenTabs(beginnerTabsCatalog.map(t => t.id));
    setIsTabDropdownOpen(false);
  };

  const handleCloseOtherTabs = () => {
    setOpenTabs([activeTab]);
    setIsTabDropdownOpen(false);
  };

  const currentOpenTabs = openTabs.length > 0 ? openTabs : ['roadmap'];

  const handleSetStarterBand = (newBand) => {
    onApplyTargetBand?.(newBand);
    safeSet('ielts_target_band', newBand);
    setBandAppliedMsg(isEn ? `Updated target band to ${newBand}!` : `Đã cập nhật mục tiêu khởi động: Band ${newBand}!`);
    setTimeout(() => setBandAppliedMsg(''), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92dvh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label={isEn ? "Close" : "Đóng"}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="text-base leading-none">🌱</span>
            <span>{isEn ? "Beginner Foundation Hub" : "Trung Tâm Khởi Động Cho Người Mới Bắt Đầu"}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white leading-tight flex items-center flex-wrap">
            <span>{isEn ? "Feeling Overwhelmed? Start Here!" : "Chưa Có Nền Tảng? Đừng Lo, Hãy Bắt Đầu Từ Đây!"}</span>
            <HeadingInfoTip
              content={isEn
                ? "You do NOT need to write a 250-word essay immediately. Follow this gentle 4-step path to build vocabulary and confidence naturally."
                : "Bạn không cần viết ngay một bài luận 250 từ! Hãy làm quen với các bài tập ngắn 90 giây để tích lũy phản xạ và từ vựng tự nhiên nhất."}
              title={isEn ? "Beginner Foundation Hub" : "Trung Tâm Khởi Động"}
              dark={true}
              isEn={isEn}
            />
          </h2>

          {/* Navigation Tabs with Dropbox */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20 relative z-30 overflow-visible">
            {/* Left: Dropbox Category Selector */}
            <div className="relative shrink-0" ref={tabDropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTabDropdownOpen(prev => !prev);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isTabDropdownOpen 
                    ? 'bg-white text-emerald-800 border-white shadow-md' 
                    : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                }`}
                title={isEn ? "Open topics dropbox" : "Bấm để chọn chuyên mục"}
                aria-expanded={isTabDropdownOpen}
              >
                <Layers className={`w-3.5 h-3.5 ${isTabDropdownOpen ? 'text-emerald-700' : 'text-emerald-200'}`} />
                <span className="font-bold">{isEn ? 'Topics' : 'Chuyên mục'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isTabDropdownOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-black/20 text-white'
                }`}>
                  {currentOpenTabs.length}/{beginnerTabsCatalog.length}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTabDropdownOpen ? 'rotate-180 text-white' : 'text-emerald-200'}`} />
              </button>

              {/* Dropbox Menu Floating Dropdown */}
              {isTabDropdownOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1.5 z-50 min-w-[240px] sm:min-w-[260px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800"
                >
                  <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <span>{isEn ? 'Beginner Modules' : 'Chuyên mục khởi động'}</span>
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAllTabs();
                        }}
                        className="text-emerald-600 hover:text-emerald-800 hover:underline font-semibold cursor-pointer"
                      >
                        {isEn ? 'Open all' : 'Mở tất cả'}
                      </button>
                      {currentOpenTabs.length > 1 && (
                        <>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseOtherTabs();
                            }}
                            className="text-slate-500 hover:text-rose-600 hover:underline cursor-pointer"
                          >
                            {isEn ? 'Only active' : 'Chỉ tab này'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-1 pr-0.5">
                    {beginnerTabsCatalog.map(tab => {
                      const isOpen = currentOpenTabs.includes(tab.id);
                      const isActive = activeTab === tab.id;
                      const IconComponent = tab.icon;

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFromDropdown(tab.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-left ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                              : isOpen
                                ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <IconComponent className={`w-3.5 h-3.5 shrink-0 ${tab.iconColor || 'text-slate-500'}`} />
                            <span className="truncate">{tab.shortLabel}</span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            {isOpen ? (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                <Check className="w-2.5 h-2.5 mr-0.5" />
                                {isActive ? (isEn ? 'Active' : 'Đang xem') : (isEn ? 'Open' : 'Đã mở')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                                <Plus className="w-2.5 h-2.5 mr-0.5" />
                                {isEn ? 'Add' : 'Mở tab'}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Dynamic Opened Tabs List */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar touch-pan-x flex-1 min-w-0 py-0.5">
              {beginnerTabsCatalog
                .filter(tab => currentOpenTabs.includes(tab.id))
                .map(tab => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;

                  return (
                    <div
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border select-none ${
                        isActive
                          ? `${tab.activeTheme} border-white shadow-md`
                          : 'text-white/80 hover:bg-white/10 hover:text-white border-transparent'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(tab.id);
                        }}
                        title={isEn ? `Close ${tab.shortLabel} tab` : `Tắt tab ${tab.shortLabel}`}
                        className={`p-0.5 rounded-full transition-colors cursor-pointer ml-0.5 ${
                          isActive
                            ? 'hover:bg-emerald-200 text-emerald-800'
                            : 'hover:bg-white/20 text-white/70 hover:text-white'
                        }`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

              {currentOpenTabs.length === 0 && (
                <button
                  type="button"
                  onClick={() => setIsTabDropdownOpen(true)}
                  className="text-xs text-white/90 hover:text-white underline font-medium py-1 px-2 cursor-pointer flex items-center space-x-1 bg-white/10 rounded-lg border border-dashed border-white/30"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isEn ? '+ Click to open topic tab' : '+ Bấm để mở tab chuyên mục'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3">
                <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-amber-900 leading-relaxed text-xs sm:text-sm">
                  <span className="font-bold">
                    {isEn ? "Gentle Tip for Beginners: " : "Lời khuyên chân thành: "}
                  </span>
                  {isEn
                    ? "If your English foundation is still developing, bypass the 60-minute mock exam for now. Spend 10-15 minutes a day doing small interactive drills."
                    : "Nếu bạn cảm thấy nền tảng tiếng Anh của mình chưa chắc, đừng vội làm đề thi thử 60 phút! Hãy dành 10-15 phút mỗi ngày với các bài luyện vi mô vui nhộn dưới đây."}
                </div>
              </div>

              {/* Step 1: Atlas Arena */}
              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Swords className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-purple-900 text-sm sm:text-base">
                        {isEn ? "Step 1: Atlas English Arena (90s)" : "Bước 1: Chơi Atlas Arena (90 Giây)"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-black uppercase">
                        {isEn ? "Game" : "Vui Nhộn"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      {isEn
                        ? "Fast, low-stress multiple choice reflex rounds to build vocabulary and grammar sense without writing."
                        : "Luyện phản xạ từ vựng và ngữ pháp qua minigame 90 giây nhịp độ cao, không cần viết chữ nào, không sợ sai."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenArena?.();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{isEn ? "Play Arena Now" : "Chơi Arena Ngay"}</span>
                </button>
              </div>

              {/* Step 2: Micro-Drills */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Puzzle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-950 text-sm sm:text-base">
                        {isEn ? "Step 2: Micro-Drills Studio (3 Mins)" : "Bước 2: Luyện Phản Xạ Vi Mô (3 Phút)"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                        {isEn ? "Targeted" : "Từng Câu"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      {isEn
                        ? "Practice writing one single sentence, dictation matching, and scanning clues without facing a 250-word blank page."
                        : "Tập viết đúng 1 câu đơn/ghép, tập nghe chép chính tả 1 câu ngắn thay vì phải tự viết cả bài văn dài 250 từ."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenDrills?.();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Puzzle className="w-3.5 h-3.5" />
                  <span>{isEn ? "Open Micro-Drills" : "Luyện Micro-Drills"}</span>
                </button>
              </div>

              {/* Step 3: Diagnostic Test */}
              <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-indigo-950 text-sm sm:text-base">
                        {isEn ? "Step 3: Band Placement Quiz (15 Mins)" : "Bước 3: Định Vị Trình Độ 15 Phút"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 text-[10px] font-black uppercase">
                        {isEn ? "Diagnostic" : "Chuẩn Xác"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      {isEn
                        ? "Take a quick 16-question diagnostic quiz to determine your current baseline (Band 3.5 - 5.5) and get an adaptive 30-day plan."
                        : "Làm test 16 câu trắc nghiệm ngắn để biết chính xác bạn đang ở đâu (Band 3.5, 4.5 hay 5.5) và nhận kế hoạch học 30 ngày vừa sức."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenDiagnostic?.();
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isEn ? "Take 15m Quiz" : "Làm Test 15 Phút"}</span>
                </button>
              </div>

              {/* Step 4: Theory Handbook */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-950 text-sm sm:text-base">
                        {isEn ? "Step 4: Vietnamese Strategy Handbook" : "Bước 4: Cẩm Nang Chiến Thuật Tiếng Việt"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                        {isEn ? "Bilingual" : "Song Ngữ"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      {isEn
                        ? "Read bite-sized, structured guides for all 4 skills with thorough Vietnamese explanations and real exam examples."
                        : "Đọc cẩm nang chiến thuật 4 kỹ năng được viết hoàn toàn bằng tiếng Việt, hướng dẫn chi tiết từng dạng bài từ dễ đến khó."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTheory?.();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>{isEn ? "Read Handbook" : "Đọc Cẩm Nang"}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'jargon' && (
            <div className="space-y-3">
              <p className="text-slate-600 text-xs sm:text-sm">
                {isEn
                  ? "Here are the most common IELTS terms decoded into plain, friendly language:"
                  : "Các thuật ngữ IELTS thường gặp được giải thích bằng ngôn ngữ gần gũi nhất:"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-red-700 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Writing Task 1</span>
                  </div>
                  <div className="text-slate-700 text-xs mt-1">
                    {isEn
                      ? "A 150-word report describing facts, charts, tables or processes (~20 minutes). No personal opinion needed."
                      : "Bài viết 150 từ mô tả biểu đồ, bảng số liệu hoặc quy trình (khoảng 20 phút). Không cần nêu quan điểm cá nhân."}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-red-700 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Writing Task 2</span>
                  </div>
                  <div className="text-slate-700 text-xs mt-1">
                    {isEn
                      ? "A 250-word essay discussing a social topic or giving your opinion (~40 minutes)."
                      : "Bài luận 250 từ nêu quan điểm của bạn về một vấn đề đời sống/xã hội (khoảng 40 phút)."}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-indigo-700 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>PEEL Formula</span>
                  </div>
                  <div className="text-slate-700 text-xs mt-1">
                    {isEn
                      ? "Point ➔ Explanation ➔ Example ➔ Link. A 4-sentence paragraph formula that guarantees coherence."
                      : "Point (Ý chính) ➔ Explanation (Giải thích) ➔ Example (Ví dụ) ➔ Link (Chốt câu). Công thức 4 câu viết đoạn cực kỳ mạch lạc."}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-blue-700 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Paraphrase</span>
                  </div>
                  <div className="text-slate-700 text-xs mt-1">
                    {isEn
                      ? "Expressing the same idea using different words and sentence structures."
                      : "Cách diễn đạt lại cùng một ý bằng từ đồng nghĩa hoặc cấu trúc khác mà không đổi nghĩa câu."}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-emerald-700 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Practice Mode vs Exam Mode</span>
                  </div>
                  <div className="text-slate-700 text-xs mt-1">
                    {isEn
                      ? "Practice Mode allows unlimited hints, outlines & translations. Exam Mode simulates the strict official countdown."
                      : "Chế Độ Luyện Tập cho phép bạn xem gợi ý, dàn ý tiếng Việt và từ điển. Chế Độ Thi sẽ đếm giờ nghiêm ngặt."}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="font-extrabold text-purple-700 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Collocation</span>
                  </div>
                  <div className="text-slate-700 text-xs mt-1">
                    {isEn
                      ? "Natural pairings of words that native speakers use (e.g. 'heavy rain' instead of 'strong rain')."
                      : "Các cụm từ tự nhiên hay đi cùng nhau trong tiếng Anh (ví dụ: 'make a decision' chứ không nói 'do a decision')."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'target' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="font-bold flex items-center space-x-1.5 text-xs sm:text-sm">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? "Why set a Starter Band?" : "Vì sao người mới nên chọn Band khởi động vừa sức?"}</span>
                </div>
                <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                  {isEn
                    ? "If target band is set too high (7.0+), the AI will expect advanced academic idioms and complex syntax, causing unnecessary frustration. Starting with 5.0 or 5.5 focuses on clear, grammatically sound simple and compound sentences."
                    : "Nếu để mục tiêu quá cao (Band 7.0+), AI sẽ đòi hỏi từ vựng hàn lâm phức tạp khiến bạn dễ nản lòng. Chọn Band 5.0 - 5.5 sẽ giúp bạn tập trung vào việc viết câu rõ ràng, đúng ngữ pháp và không mắc lỗi cơ bản."}
                </p>
              </div>

              {bandAppliedMsg && (
                <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{bandAppliedMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border transition-all ${
                  targetBand === '5.0' ? 'border-emerald-500 bg-emerald-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="font-black text-slate-900 text-sm">
                      {isEn ? 'Band 5.0 - Solid Foundation' : 'Band 5.0 - Khởi Động Vững Vàng'}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Foundation</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    {isEn
                      ? 'Focus on writing grammatically accurate simple & compound sentences while avoiding tense and subject-verb agreement errors.'
                      : 'Tập trung viết câu đơn, câu ghép đúng ngữ pháp cơ bản, tránh sai thì và chia động từ.'}
                  </p>
                  <button
                    onClick={() => handleSetStarterBand('5.0')}
                    className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      targetBand === '5.0'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-emerald-100 hover:text-emerald-900'
                    }`}
                  >
                    {targetBand === '5.0'
                      ? (isEn ? '✓ Band 5.0 Selected' : '✓ Đang chọn Band 5.0')
                      : (isEn ? 'Select Target Band 5.0' : 'Chọn Mục Tiêu Band 5.0')}
                  </button>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  targetBand === '5.5' ? 'border-emerald-500 bg-emerald-50/70 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="font-black text-slate-900 text-sm">
                      {isEn ? 'Band 5.5 - Confident Step Up' : 'Band 5.5 - Tự Tin Bước Tiếp'}
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black">Pre-IELTS</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    {isEn
                      ? 'Begin constructing natural complex sentences and mastering standard Task 1 & Task 2 paragraph structures.'
                      : 'Bắt đầu phát triển câu phức nhẹ nhàng, nắm được bố cục Task 1 & Task 2 chuẩn.'}
                  </p>
                  <button
                    onClick={() => handleSetStarterBand('5.5')}
                    className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      targetBand === '5.5'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-emerald-100 hover:text-emerald-900'
                    }`}
                  >
                    {targetBand === '5.5'
                      ? (isEn ? '✓ Band 5.5 Selected' : '✓ Đang chọn Band 5.5')
                      : (isEn ? 'Select Target Band 5.5' : 'Chọn Mục Tiêu Band 5.5')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            {isEn ? "Take it step by step • You can do this!" : "Học từng bước một • Bạn chắc chắn sẽ tiến bộ!"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            {isEn ? "Got it, thanks!" : "Đã hiểu, đóng hướng dẫn"}
          </button>
        </div>
      </div>
    </div>
  );
}
