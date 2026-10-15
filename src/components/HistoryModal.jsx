import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  History, 
  Award, 
  Trash2, 
  FileDown, 
  Eye, 
  X, 
  Calendar, 
  Clock, 
  BookOpen,
  FileText,
  BookMarked,
  CheckCircle2,
  Headphones,
  Mic,
  Volume2,
  GraduationCap,
  Zap,
  Sparkles,
  Layers,
  ChevronDown,
  Plus,
  Check
} from 'lucide-react';
import { exportToWord } from '../services/exportService';
import { useTranslation } from '../i18n/LanguageContext';

export default function HistoryModal({
  isOpen,
  onClose,
  masteredIds = [],
  submissions = [],
  readingHistory = [],
  listeningHistory = [],
  speakingHistory = [],
  onViewSubmission,
  onDeleteSubmission,
  onClearHistory,
  onDeleteReadingSubmission,
  onClearReadingHistory,
  onDeleteListeningSubmission,
  onClearListeningHistory,
  onDeleteSpeakingSubmission,
  onClearSpeakingHistory,
  onClearAllHistory,
  onViewSpeakingSubmission,
  activeSkill = 'writing'
}) {
  if (!isOpen) return null;
  const { t, isEn } = useTranslation();

  const [activeTab, setActiveTab] = useState(() => {
    if (activeSkill === 'reading') return 'reading';
    if (activeSkill === 'listening') return 'listening';
    if (activeSkill === 'speaking') return 'speaking';
    return 'writing';
  });

  const totalAllHistoryCount = submissions.length + readingHistory.length + listeningHistory.length + speakingHistory.length;

  // ----------------------------------------------------
  // DYNAMIC TABS & DROPBOX PICKER ARCHITECTURE
  // ----------------------------------------------------
  const historyTabsCatalog = useMemo(() => [
    {
      id: 'writing',
      icon: FileText,
      label: `✍️ Writing (${submissions.length})`,
      shortLabel: '✍️ Writing',
      count: submissions.length,
      activeTheme: 'bg-red-600 text-white border-red-600 shadow-2xs font-bold',
      iconColor: 'text-red-500'
    },
    {
      id: 'reading',
      icon: BookOpen,
      label: `📖 Reading (${readingHistory.length})`,
      shortLabel: '📖 Reading',
      count: readingHistory.length,
      activeTheme: 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold',
      iconColor: 'text-blue-500'
    },
    {
      id: 'listening',
      icon: Headphones,
      label: `🎧 Listening (${listeningHistory.length})`,
      shortLabel: '🎧 Listening',
      count: listeningHistory.length,
      activeTheme: 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'speaking',
      icon: Mic,
      label: `🎙️ Speaking (${speakingHistory.length})`,
      shortLabel: '🎙️ Speaking',
      count: speakingHistory.length,
      activeTheme: 'bg-purple-600 text-white border-purple-600 shadow-2xs font-bold',
      iconColor: 'text-purple-500'
    }
  ], [submissions.length, readingHistory.length, listeningHistory.length, speakingHistory.length]);

  const [openTabs, setOpenTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_history_open_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['writing', 'reading', 'listening', 'speaking'];
  });

  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const tabDropdownRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('ielts_history_open_tabs', JSON.stringify(openTabs));
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
        const remaining = historyTabsCatalog.find(t => t.id !== tabId);
        if (remaining) {
          setActiveTab(remaining.id);
          setOpenTabs([remaining.id]);
        }
      }
    }
  };

  const handleOpenAllTabs = () => {
    setOpenTabs(historyTabsCatalog.map(t => t.id));
    setIsTabDropdownOpen(false);
  };

  const handleCloseOtherTabs = () => {
    setOpenTabs([activeTab]);
    setIsTabDropdownOpen(false);
  };

  const currentOpenTabs = openTabs.length > 0 ? openTabs : ['writing'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden overscroll-contain flex flex-col h-[96dvh] max-h-[96dvh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full sm:w-auto min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs shrink-0">
              <History className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold truncate">
                  {t('modals.history.title')}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase shrink-0">
                  {isEn ? `${totalAllHistoryCount} tests saved` : `${totalAllHistoryCount} bài đã lưu`}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate mt-0.5">Writing, Reading, Listening & Speaking</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            {activeTab === 'writing' && submissions.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title={isEn ? "Clear Writing history" : "Xóa toàn bộ bài nộp Writing"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isEn ? `Clear Writing (${submissions.length})` : `Xóa Writing (${submissions.length})`}</span>
              </button>
            )}
            {activeTab === 'reading' && readingHistory.length > 0 && (
              <button
                onClick={onClearReadingHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title={isEn ? "Clear Reading history" : "Xóa toàn bộ bài thi Reading"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isEn ? `Clear Reading (${readingHistory.length})` : `Xóa Reading (${readingHistory.length})`}</span>
              </button>
            )}
            {activeTab === 'listening' && listeningHistory.length > 0 && (
              <button
                onClick={onClearListeningHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title={isEn ? "Clear Listening history" : "Xóa toàn bộ bài thi Listening"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isEn ? `Clear Listening (${listeningHistory.length})` : `Xóa Listening (${listeningHistory.length})`}</span>
              </button>
            )}
            {activeTab === 'speaking' && speakingHistory.length > 0 && (
              <button
                onClick={onClearSpeakingHistory}
                className="flex items-center space-x-1 text-[11px] sm:text-xs text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title={isEn ? "Clear Speaking history" : "Xóa toàn bộ bài thi Speaking"}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isEn ? `Clear Speaking (${speakingHistory.length})` : `Xóa Speaking (${speakingHistory.length})`}</span>
              </button>
            )}
            {totalAllHistoryCount > 0 && onClearAllHistory && (
              <button
                onClick={onClearAllHistory}
                className="hidden lg:flex items-center space-x-1 text-[11px] sm:text-xs text-slate-400 hover:text-rose-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title={isEn ? "Clear complete 4-skill history" : "Xóa sạch toàn bộ lịch sử của cả 4 kỹ năng"}
              >
                <span>{isEn ? `Clear all 4 skills (${totalAllHistoryCount})` : `Xóa sạch 4 kỹ năng (${totalAllHistoryCount})`}</span>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Tabs Bar with Dropbox (4 Skills) */}
        <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-5 py-2 flex items-center gap-2 relative z-30 overflow-visible">
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
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm' 
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600'
              }`}
              title={isEn ? "Open skill tabs dropbox" : "Bấm để chọn kỹ năng hiển thị"}
              aria-expanded={isTabDropdownOpen}
            >
              <Layers className={`w-3.5 h-3.5 ${isTabDropdownOpen ? 'text-white' : 'text-blue-400'}`} />
              <span className="font-bold">{isEn ? 'Skills' : 'Kỹ năng'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isTabDropdownOpen ? 'bg-blue-700 text-white' : 'bg-slate-700 text-slate-200'
              }`}>
                {currentOpenTabs.length}/{historyTabsCatalog.length}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTabDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
            </button>

            {/* Dropbox Menu Floating Dropdown */}
            {isTabDropdownOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 top-full mt-1.5 z-50 min-w-[260px] sm:min-w-[280px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <span>{isEn ? 'Select Skill Tabs' : 'Chọn tab kỹ năng'}</span>
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAllTabs();
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
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
                  {historyTabsCatalog.map(tab => {
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
                            ? 'bg-blue-50/90 text-blue-900 font-bold border border-blue-200'
                            : isOpen
                              ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-transparent'
                              : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate pr-2">
                          <IconComponent className={`w-3.5 h-3.5 shrink-0 ${tab.iconColor || 'text-slate-500'}`} />
                          <span className="truncate">{tab.shortLabel}</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            {tab.count}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          {isOpen ? (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              <Check className="w-2.5 h-2.5 mr-0.5" />
                              {isActive ? (isEn ? 'Active' : 'Đang xem') : (isEn ? 'Open' : 'Đã mở')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100">
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
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar touch-pan-x flex-1 min-w-0 py-0.5">
            {historyTabsCatalog
              .filter(tab => currentOpenTabs.includes(tab.id))
              .map(tab => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.icon;

                return (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer border select-none ${
                      isActive
                        ? `${tab.activeTheme} ring-2 ring-blue-500/30`
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
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
                          ? 'hover:bg-white/20 text-white/80 hover:text-white'
                          : 'hover:bg-slate-600 text-slate-400 hover:text-slate-200'
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
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium py-1 px-2 cursor-pointer flex items-center space-x-1 bg-slate-800/80 rounded-lg border border-dashed border-blue-500/40"
              >
                <Plus className="w-3 h-3" />
                <span>{isEn ? '+ Click to open skill tab' : '+ Bấm để mở tab kỹ năng'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          
          {/* TAB 1: WRITING HISTORY */}
          {activeTab === 'writing' && (
            submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {submissions.map((sub, idx) => (
                  <div 
                    key={sub.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.task?.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Task {sub.task?.taskNumber || 2}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{sub.date || new Date().toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{sub.stats?.timeSpent || '20m'}</span>
                        </span>
                        {masteredIds.includes(sub.task?.id) && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold flex items-center space-x-1 shadow-2xs">
                            <GraduationCap className="w-3 h-3 text-emerald-700" />
                            <span>{isEn ? 'Mastered' : 'Đã thuộc'}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {sub.task?.title || (isEn ? 'IELTS Writing Task' : 'Bài tập IELTS Writing')}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2 italic">
                        "{sub.essayText?.slice(0, 120)}..."
                      </p>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                        <span>{sub.stats?.wordCount || 0} {isEn ? 'words' : 'từ'}</span>
                        {sub.evaluation?.overallBand && (
                          <span>• <strong className="text-red-600 font-bold">Band {sub.evaluation.overallBand.toFixed(1)}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => exportToWord({
                            task: sub.task,
                            essayText: sub.essayText,
                            evaluation: sub.evaluation,
                            stats: sub.stats
                          })}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          title={isEn ? "Export to Word (.docx)" : "Xuất bài ra Word .doc"}
                        >
                          <FileDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(isEn ? 'Are you sure you want to remove this writing submission from history?' : 'Bạn có chắc chắn muốn xóa bài viết này khỏi lịch sử?')) {
                              onDeleteSubmission?.(sub.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title={isEn ? "Delete this submission" : "Xóa bài này"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onViewSubmission(sub);
                          onClose();
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isEn ? 'View Score' : 'Xem Điểm'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>{isEn ? 'You have no Writing submissions yet. Complete and submit an essay to record your history!' : 'Bạn chưa có bài nộp Writing nào. Hãy hoàn thành và nộp một bài viết để lưu lại lịch sử!'}</p>
              </div>
            )
          )}

          {/* TAB 2: READING HISTORY */}
          {activeTab === 'reading' && (
            readingHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {readingHistory.map((rec, idx) => (
                  <div 
                    key={rec.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          BAND {rec.band ? Number(rec.band).toFixed(1) : '5.0'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{rec.submittedAt || new Date().toLocaleDateString(isEn ? 'en-US' : 'vi-VN')}</span>
                        </span>
                        {rec.timeSpentSeconds && (
                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(rec.timeSpentSeconds / 60)}{isEn ? 'm' : 'p'} {rec.timeSpentSeconds % 60}s</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {rec.testTitle || (isEn ? 'IELTS Reading Test' : 'Bài thi IELTS Reading')}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                        <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{rec.correctCount}/{rec.totalQuestions} {isEn ? 'correct' : 'câu đúng'}</span>
                        </span>
                        <span>• {isEn ? 'Accuracy:' : 'Độ chính xác:'} <strong>{rec.accuracyPercent || Math.round((rec.correctCount / rec.totalQuestions) * 100)}%</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm(isEn ? 'Are you sure you want to remove this Reading test result from history?' : 'Bạn có chắc chắn muốn xóa kết quả bài thi Reading này khỏi lịch sử?')) {
                            onDeleteReadingSubmission?.(rec.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={isEn ? "Delete this test result" : "Xóa bài thi này"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p>{isEn ? 'You have no Reading test history yet. Complete and submit a reading test to record your history!' : 'Bạn chưa có bài thi Reading nào. Hãy hoàn thành và nộp một bài đọc để lưu lại lịch sử!'}</p>
              </div>
            )
          )}

          {/* TAB 3: LISTENING HISTORY */}
          {activeTab === 'listening' && (
            listeningHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {listeningHistory.map((rec, idx) => (
                  <div 
                    key={rec.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          BAND {rec.band ? Number(rec.band).toFixed(1) : '5.0'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{rec.submittedAt ? new Date(rec.submittedAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN') : (isEn ? 'Recent' : 'Gần đây')}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {rec.testTitle || (isEn ? 'IELTS Listening Test' : 'Bài thi IELTS Listening')}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                        <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{rec.correctCount}/{rec.totalQuestions} {isEn ? 'correct' : 'câu đúng'}</span>
                        </span>
                        <span>• {isEn ? 'Accuracy:' : 'Độ chính xác:'} <strong>{rec.resultData?.accuracyPercent || Math.round(((rec.correctCount || 0) / (rec.totalQuestions || 40)) * 100)}%</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          if (window.confirm(isEn ? 'Are you sure you want to remove this Listening test result from history?' : 'Bạn có chắc chắn muốn xóa kết quả bài thi Listening này khỏi lịch sử?')) {
                            onDeleteListeningSubmission?.(rec.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title={isEn ? "Delete this test result" : "Xóa bài thi này"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <Headphones className="w-8 h-8 text-slate-300 mx-auto" />
                <p>{isEn ? 'You have no Listening test history yet. Complete and submit a listening test to record your history!' : 'Bạn chưa có bài thi Listening nào. Hãy hoàn thành và nộp một bài nghe để lưu lại lịch sử!'}</p>
              </div>
            )
          )}

          {/* TAB 4: SPEAKING HISTORY */}
          {activeTab === 'speaking' && (
            speakingHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
                {speakingHistory.map((rec, idx) => {
                  const evalData = rec.evaluation || {};
                  const criteriaData = evalData.criteria || {};
                  return (
                    <div 
                      key={rec.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                            BAND {evalData.overallBand ? Number(evalData.overallBand).toFixed(1) : '6.0'}
                          </span>
                          {evalData.evaluationMethod === 'algorithmic' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                              <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500 inline" />
                              <span>{isEn ? 'Rule-Based' : 'Máy Chấm'}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                              <Sparkles className="w-2.5 h-2.5 text-purple-500 inline" />
                              <span>{isEn ? 'AI Evaluated' : 'AI Chấm'}</span>
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{rec.submittedAt ? new Date(rec.submittedAt).toLocaleDateString(isEn ? 'en-US' : 'vi-VN') : (isEn ? 'Recent' : 'Gần đây')}</span>
                          </span>
                          {rec.durationSec && (
                            <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{Math.round(rec.durationSec / 60)}{isEn ? 'm' : 'p'}</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {rec.mockPack?.title || (isEn ? 'IELTS Speaking Mock Test' : 'Buổi thi thử IELTS Speaking')}
                        </h4>

                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">
                            FC: {criteriaData.fc?.band || '6.0'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                            LR: {criteriaData.lr?.band || '6.0'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                            GRA: {criteriaData.gra?.band || '6.0'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                            PR: {criteriaData.pr?.band || '6.0'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm(isEn ? 'Are you sure you want to remove this Speaking test result from history?' : 'Bạn có chắc chắn muốn xóa kết quả bài thi Speaking này khỏi lịch sử?')) {
                              onDeleteSpeakingSubmission?.(rec.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title={isEn ? "Delete this test result" : "Xóa bài thi này"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {onViewSpeakingSubmission && (
                          <button
                            onClick={() => onViewSpeakingSubmission(rec)}
                            className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer"
                            title={isEn ? "Review detailed evaluation report" : "Xem lại báo cáo đánh giá chi tiết"}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Report' : 'Báo Cáo'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <Mic className="w-8 h-8 text-slate-300 mx-auto" />
                <p>{isEn ? 'You have no Speaking test history yet. Complete and submit a speaking test to record your history!' : 'Bạn chưa có bài thi Speaking nào. Hãy hoàn thành và nộp một bài nói để lưu lại lịch sử!'}</p>
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
}
