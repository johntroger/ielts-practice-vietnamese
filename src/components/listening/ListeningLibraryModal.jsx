import React, { useState, useMemo, useEffect, useRef } from 'react';
import StarRatingWidget from '../common/StarRatingWidget';
import { getItemMetrics, recordAttempt } from '../../services/ratingPopularityService';
import { 
  Headphones, 
  Search, 
  Trash2, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Play, 
  AlertTriangle,
  Radio,
  Globe,
  Lock,
  Volume2,
  Bookmark,
  Puzzle,
  Dices,
  ChevronRight,
  GraduationCap,
  ArrowUpDown,
  ChevronDown,
  Plus,
  Check
} from 'lucide-react';
import { 
  extractListeningPartBank, 
  assembleFullListeningTest, 
  createRandomFullListeningTest 
} from '../../utils/listeningTestAssembler';
import { useTranslation } from '../../i18n';
import { formatTestTitle, formatTestDescription, getListeningTestDisplayInfo } from '../../utils/testLocalizationHelper';

export default function ListeningLibraryModal({
  isOpen,
  onClose,
  allListeningTests = [],
  currentTestId,
  onSelectTest,
  onDeleteTest,
  onAddCustomTest,
  onTogglePublic,
  onOpenGenerator,
  user,
  masteredIds = [],
  onToggleMastered
}) {
  if (!isOpen) return null;
  const { t, isEn } = useTranslation();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cambridge' | 'ai' | 'assembled' | 'part1' | 'part2' | 'part3' | 'part4' | 'mastered'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'rating-desc' | 'attempts-desc'
  const [hideMastered, setHideMastered] = useState(() => {
    try {
      return localStorage.getItem('ielts_listening_hide_mastered') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleHideMastered = () => {
    setHideMastered(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ielts_listening_hide_mastered', String(next));
      } catch {}
      return next;
    });
  };

  // Exam Assembler States
  const [isAssemblerOpen, setIsAssemblerOpen] = useState(false);
  const [selectedP1Key, setSelectedP1Key] = useState('');
  const [selectedP2Key, setSelectedP2Key] = useState('');
  const [selectedP3Key, setSelectedP3Key] = useState('');
  const [selectedP4Key, setSelectedP4Key] = useState('');
  const [assembledTitle, setAssembledTitle] = useState('');
  const [assemblerError, setAssemblerError] = useState('');

  // Bank of available Parts across all tests
  const partBank = useMemo(() => {
    return extractListeningPartBank(allListeningTests);
  }, [allListeningTests]);

  const p1List = useMemo(() => partBank.filter(p => p.partNumber === 1), [partBank]);
  const p2List = useMemo(() => partBank.filter(p => p.partNumber === 2), [partBank]);
  const p3List = useMemo(() => partBank.filter(p => p.partNumber === 3), [partBank]);
  const p4List = useMemo(() => partBank.filter(p => p.partNumber === 4), [partBank]);

  // Handlers for Assembler
  const handleManualAssemble = () => {
    setAssemblerError('');
    if (!selectedP1Key || !selectedP2Key || !selectedP3Key || !selectedP4Key) {
      setAssemblerError(isEn 
        ? 'Please select all 4 parts (Part 1, Part 2, Part 3, Part 4) to assemble a complete test.' 
        : 'Vui lòng chọn đủ 4 phần (Part 1, Part 2, Part 3, Part 4) để ghép đề hoàn chỉnh.');
      return;
    }

    const b1 = partBank.find(p => p.partKey === selectedP1Key);
    const b2 = partBank.find(p => p.partKey === selectedP2Key);
    const b3 = partBank.find(p => p.partKey === selectedP3Key);
    const b4 = partBank.find(p => p.partKey === selectedP4Key);

    const assembled = assembleFullListeningTest({
      builderP1: b1,
      builderP2: b2,
      builderP3: b3,
      builderP4: b4,
      customTitle: assembledTitle,
      userEmail: user?.email
    });

    if (assembled) {
      if (onAddCustomTest) {
        onAddCustomTest(assembled);
      } else {
        onSelectTest(assembled);
      }
      setIsAssemblerOpen(false);
      onClose();
    }
  };

  const handleRandomAssemble = () => {
    setAssemblerError('');
    const randomTest = createRandomFullListeningTest({
      allListeningTests,
      userEmail: user?.email
    });

    if (!randomTest) {
      setAssemblerError(isEn 
        ? 'Insufficient Part data to assemble randomly. Need at least 1 test for each Part (1, 2, 3, 4).' 
        : 'Không đủ dữ liệu Part để ghép ngẫu nhiên. Cần tối thiểu ít nhất 1 bài cho mỗi Part (1, 2, 3, 4).');
      return;
    }

    if (onAddCustomTest) {
      onAddCustomTest(randomTest);
    } else {
      onSelectTest(randomTest);
    }
    setIsAssemblerOpen(false);
    onClose();
  };

  const filteredTests = useMemo(() => {
    return allListeningTests.filter(test => {
      const isMastered = masteredIds.includes(test.id);

      // Hide mastered if checked (unless on mastered tab)
      if (hideMastered && activeTab !== 'mastered' && isMastered) {
        return false;
      }

      // 1. Tab filter
      let matchesTab = true;
      if (activeTab === 'r2_cloud') {
        matchesTab = Boolean(test.audioUrl?.includes('.r2.dev'));
      } else if (activeTab === 'cambridge') {
        matchesTab = Boolean(test.isCambridge || !test.isCustom);
      } else if (activeTab === 'mastered') {
        matchesTab = isMastered;
      } else if (activeTab === 'ai') {
        matchesTab = Boolean(test.isCustom) && !test.isAssembled;
      } else if (activeTab === 'public') {
        matchesTab = Boolean(test.isPublic);
      } else if (activeTab === 'assembled') {
        matchesTab = Boolean(test.isAssembled);
      } else if (activeTab === 'part1') {
        matchesTab = test.targetPart === 1 || test.parts?.[0]?.partNumber === 1;
      } else if (activeTab === 'part2') {
        matchesTab = test.targetPart === 2 || test.parts?.[0]?.partNumber === 2;
      } else if (activeTab === 'part3') {
        matchesTab = test.targetPart === 3 || test.parts?.[0]?.partNumber === 3;
      } else if (activeTab === 'part4') {
        matchesTab = test.targetPart === 4 || test.parts?.[0]?.partNumber === 4;
      }

      // 2. Search query
      const q = searchQuery.toLowerCase().trim();
      const displayInfo = q ? getListeningTestDisplayInfo(test, isEn) : null;
      const matchesSearch = !q ||
        test.title?.toLowerCase().includes(q) ||
        test.id?.toLowerCase().includes(q) ||
        displayInfo?.trackBadge?.toLowerCase().includes(q) ||
        displayInfo?.shortTitle?.toLowerCase().includes(q) ||
        test.description?.toLowerCase().includes(q) ||
        test.parts?.some(p => 
          p.title?.toLowerCase().includes(q) || 
          p.context?.toLowerCase().includes(q) ||
          p.speakers?.some(s => s.name?.toLowerCase().includes(q) || s.accent?.toLowerCase().includes(q))
        );

      return matchesTab && matchesSearch;
    });
  }, [allListeningTests, activeTab, searchQuery, hideMastered, masteredIds, isEn]);

  const sortedTests = useMemo(() => {
    if (sortBy === 'rating-desc') {
      return [...filteredTests].sort((a, b) => {
        const rA = getItemMetrics(a.id, a.title);
        const rB = getItemMetrics(b.id, b.title);
        return (rB.rating || 0) - (rA.rating || 0);
      });
    }
    if (sortBy === 'attempts-desc') {
      return [...filteredTests].sort((a, b) => {
        const rA = getItemMetrics(a.id, a.title);
        const rB = getItemMetrics(b.id, b.title);
        return (rB.attemptsCount || 0) - (rA.attemptsCount || 0);
      });
    }
    return filteredTests;
  }, [filteredTests, sortBy]);

  const stats = useMemo(() => ({
    total: allListeningTests.length,
    r2Cloud: allListeningTests.filter(t => t.audioUrl?.includes('.r2.dev')).length,
    cambridge: allListeningTests.filter(t => t.isCambridge || !t.isCustom).length,
    mastered: allListeningTests.filter(t => masteredIds.includes(t.id)).length,
    ai: allListeningTests.filter(t => t.isCustom && !t.isAssembled).length,
    assembled: allListeningTests.filter(t => t.isAssembled).length,
    public: allListeningTests.filter(t => t.isPublic).length,
    p1: allListeningTests.filter(t => t.targetPart === 1 || t.parts?.[0]?.partNumber === 1).length,
    p2: allListeningTests.filter(t => t.targetPart === 2 || t.parts?.[0]?.partNumber === 2).length,
    p3: allListeningTests.filter(t => t.targetPart === 3 || t.parts?.[0]?.partNumber === 3).length,
    p4: allListeningTests.filter(t => t.targetPart === 4 || t.parts?.[0]?.partNumber === 4).length,
  }), [allListeningTests, masteredIds]);

  // ----------------------------------------------------
  // DYNAMIC TABS & DROPBOX PICKER ARCHITECTURE
  // ----------------------------------------------------
  const listeningTabsCatalog = useMemo(() => [
    {
      id: 'all',
      icon: Headphones,
      label: `${isEn ? 'All' : 'Tất Cả'} (${stats.total})`,
      shortLabel: isEn ? 'All' : 'Tất Cả',
      count: stats.total,
      activeTheme: 'bg-purple-600 text-white border-purple-600 shadow-2xs font-bold',
      iconColor: 'text-purple-600'
    },
    {
      id: 'r2_cloud',
      icon: Radio,
      label: `☁️ ${isEn ? 'R2 Studio Audio' : 'Audio Thực Chiến R2'} (${stats.r2Cloud})`,
      shortLabel: 'R2 Audio',
      count: stats.r2Cloud,
      activeTheme: 'bg-cyan-600 text-white border-cyan-600 shadow-2xs font-bold',
      iconColor: 'text-cyan-600'
    },
    {
      id: 'cambridge',
      icon: Bookmark,
      label: `📚 Cambridge (${stats.cambridge})`,
      shortLabel: 'Cambridge',
      count: stats.cambridge,
      activeTheme: 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'mastered',
      icon: GraduationCap,
      label: `${isEn ? 'Mastered' : 'Đã Thuộc'} (${stats.mastered})`,
      shortLabel: isEn ? 'Mastered' : 'Đã Thuộc',
      count: stats.mastered,
      activeTheme: 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-bold',
      iconColor: 'text-emerald-700'
    },
    {
      id: 'public',
      icon: Globe,
      label: `🌐 ${isEn ? 'Community' : 'Cộng Đồng'} (${stats.public})`,
      shortLabel: isEn ? 'Community' : 'Cộng Đồng',
      count: stats.public,
      activeTheme: 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold',
      iconColor: 'text-blue-600'
    },
    {
      id: 'assembled',
      icon: Puzzle,
      label: `🧩 ${isEn ? 'Assembled' : 'Đã Ghép'} (${stats.assembled})`,
      shortLabel: isEn ? 'Assembled' : 'Đã Ghép',
      count: stats.assembled,
      activeTheme: 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'part1',
      icon: Headphones,
      label: `Part 1 (${stats.p1})`,
      shortLabel: 'Part 1',
      count: stats.p1,
      activeTheme: 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold',
      iconColor: 'text-blue-500'
    },
    {
      id: 'part2',
      icon: Headphones,
      label: `Part 2 (${stats.p2})`,
      shortLabel: 'Part 2',
      count: stats.p2,
      activeTheme: 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'part3',
      icon: Headphones,
      label: `Part 3 (${stats.p3})`,
      shortLabel: 'Part 3',
      count: stats.p3,
      activeTheme: 'bg-purple-600 text-white border-purple-600 shadow-2xs font-bold',
      iconColor: 'text-purple-500'
    },
    {
      id: 'part4',
      icon: Headphones,
      label: `Part 4 (${stats.p4})`,
      shortLabel: 'Part 4',
      count: stats.p4,
      activeTheme: 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold',
      iconColor: 'text-amber-500'
    }
  ], [stats, isEn]);

  const [openTabs, setOpenTabs] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_listening_lib_open_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['all', 'cambridge', 'mastered', 'public', 'part1'];
  });

  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const tabDropdownRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('ielts_listening_lib_open_tabs', JSON.stringify(openTabs));
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
        const remaining = listeningTabsCatalog.find(t => t.id !== tabId);
        if (remaining) {
          setActiveTab(remaining.id);
          setOpenTabs([remaining.id]);
        }
      }
    }
  };

  const handleOpenAllTabs = () => {
    setOpenTabs(listeningTabsCatalog.map(t => t.id));
    setIsTabDropdownOpen(false);
  };

  const handleCloseOtherTabs = () => {
    setOpenTabs([activeTab]);
    setIsTabDropdownOpen(false);
  };

  const currentOpenTabs = openTabs.length > 0 ? openTabs : ['all'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-1 sm:p-2 lg:p-3 animate-in fade-in duration-150 overflow-hidden">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] h-[96dvh] max-h-[96dvh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden overscroll-contain">
        
        {/* Header */}
        <div className="px-3.5 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 mr-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg truncate">
                  {isEn ? 'IELTS Listening Test Library' : 'Kho Đề Thi IELTS Listening'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                  {isEn ? `${stats.total} Tests Available` : `${stats.total} Bộ Đề Sẵn Sàng`}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate">
                {isEn ? 'Official Cambridge tests & native AI-generated conversation tests' : 'Đề thi chính thức Cambridge & đề hội thoại bản xứ sinh bằng AI'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0 ml-1.5"
            aria-label={isEn ? "Close listening library" : "Đóng kho đề listening"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Tabs Bar with Dropbox */}
        <div className="px-3 sm:px-5 py-2.5 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2 relative z-30 overflow-visible">
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
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
              }`}
              title={isEn ? "Open listening parts dropbox" : "Bấm để chọn danh mục & Part nghe"}
              aria-expanded={isTabDropdownOpen}
            >
              <Layers className={`w-3.5 h-3.5 ${isTabDropdownOpen ? 'text-white' : 'text-purple-600'}`} />
              <span className="font-bold">{isEn ? 'Parts & Sources' : 'Phân loại'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isTabDropdownOpen ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {currentOpenTabs.length}/{listeningTabsCatalog.length}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isTabDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
            </button>

            {/* Dropbox Menu Floating Dropdown */}
            {isTabDropdownOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 top-full mt-1.5 z-50 min-w-[260px] sm:min-w-[300px] max-w-[92vw] bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <span>{isEn ? 'Listening Categories' : 'Phân loại đề Listening'}</span>
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAllTabs();
                      }}
                      className="text-purple-600 hover:text-purple-800 hover:underline font-semibold cursor-pointer"
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
                  {listeningTabsCatalog.map(tab => {
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
                            ? 'bg-purple-50/90 text-purple-900 font-bold border border-purple-200'
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
                              isActive ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              <Check className="w-2.5 h-2.5 mr-0.5" />
                              {isActive ? (isEn ? 'Active' : 'Đang xem') : (isEn ? 'Open' : 'Đã mở')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-600 hover:bg-purple-100">
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
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar touch-pan-x flex-1 min-w-0 py-0.5">
            {listeningTabsCatalog
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
                        ? `${tab.activeTheme} shadow-xs ring-2 ring-purple-500/20`
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
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
                          : 'hover:bg-slate-200 text-slate-400 hover:text-slate-600'
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
                className="text-xs text-purple-600 hover:text-purple-800 underline font-medium py-1 px-2 cursor-pointer flex items-center space-x-1 bg-purple-50 rounded-lg border border-dashed border-purple-300"
              >
                <Plus className="w-3 h-3" />
                <span>{isEn ? '+ Click to open part tab' : '+ Bấm để mở tab Part'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Toolbar: Search and Filter Controls */}
        <div className="px-3 sm:px-5 py-2.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2.5">
          {/* Search and AI Generator Trigger */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Ẩn đề đã thuộc Checkbox */}
            <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer select-none px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0">
              <input
                type="checkbox"
                checked={hideMastered}
                onChange={handleToggleHideMastered}
                className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="whitespace-nowrap font-medium text-[11px] sm:text-xs">
                {isEn ? 'Hide mastered' : 'Ẩn đề đã thuộc'}
              </span>
            </label>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isEn ? "Search test title, Part, accent..." : "Tìm tên đề, Part, accent giọng đọc..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-800"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-2 rounded-xl shadow-2xs focus:ring-1 focus:ring-purple-500 cursor-pointer"
                title={isEn ? "Sort listening tests" : "Sắp xếp danh sách đề thi Listening"}
              >
                <option value="default">{isEn ? 'Default' : 'Mặc định'}</option>
                <option value="rating-desc">{isEn ? '⭐ Top Rated' : '⭐ Rating cao'}</option>
                <option value="attempts-desc">{isEn ? '🔥 Most Practiced' : '🔥 Lượt làm'}</option>
              </select>
            </div>

            {/* 1-Click Auto Random Mix */}
            <button
              onClick={handleRandomAssemble}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all cursor-pointer shrink-0 shadow-2xs"
              title={isEn ? "Randomly select 4 parts to assemble a full 40-question test" : "Tự động chọn ngẫu nhiên 4 Part để tạo 1 đề thi thử Full 40 câu hoàn chỉnh"}
            >
              <Dices className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">{isEn ? '🎲 Quick Mix Test' : '🎲 Ghép Nhanh 1 Đề'}</span>
            </button>

            {/* Manual Assembler Toggle */}
            <button
              onClick={() => setIsAssemblerOpen(!isAssemblerOpen)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shrink-0 shadow-2xs ${
                isAssemblerOpen 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
              }`}
              title={isEn ? "Assemble 4 parts from test bank into a 40-question test" : "Tự chọn 4 Part từ ngân hàng đề để lắp ráp thành 1 đề thi 40 câu"}
            >
              <Puzzle className="w-3.5 h-3.5 text-purple-600" />
              <span>{isEn ? '🧩 4-Part Assembler' : '🧩 Ghép Đề 4 Part'}</span>
            </button>

            {onOpenGenerator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGenerator();
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? 'Generate Test' : 'Sinh Đề Mới'}</span>
                <span className="sm:hidden">{isEn ? 'Create' : 'Tạo Đề'}</span>
              </button>
            )}
          </div>

        </div>

        {/* EXAM ASSEMBLER PANEL IF OPEN */}
        {isAssemblerOpen && (
          <div className="px-5 py-3.5 bg-gradient-to-r from-purple-50/90 to-indigo-50/90 border-b border-purple-200 animate-in fade-in space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Puzzle className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wide">
                  {isEn ? 'Assemble Full 4-Part Exam (40 Questions • ~32 Mins)' : 'Lắp Ghép Đề Thi Full 4 Parts (40 Câu • ~32 Phút)'}
                </h4>
              </div>
              <span className="text-[11px] text-purple-700 font-medium">
                {isEn ? 'Select 1 passage for each Part from your test bank:' : 'Chọn 1 bài cho mỗi Part từ ngân hàng đề của bạn:'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Part 1 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>{isEn ? 'Part 1 (Dialogue)' : 'Part 1 (Hội thoại)'}</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p1List.length} {isEn ? 'tests' : 'bài'}</span>
                </label>
                <select
                  value={selectedP1Key}
                  onChange={(e) => setSelectedP1Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">{isEn ? '-- Select Part 1 --' : '-- Chọn bài Part 1 --'}</option>
                  {p1List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Part 2 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>{isEn ? 'Part 2 (Monologue)' : 'Part 2 (Độc thoại)'}</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p2List.length} {isEn ? 'tests' : 'bài'}</span>
                </label>
                <select
                  value={selectedP2Key}
                  onChange={(e) => setSelectedP2Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">{isEn ? '-- Select Part 2 --' : '-- Chọn bài Part 2 --'}</option>
                  {p2List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Part 3 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>{isEn ? 'Part 3 (Discussion)' : 'Part 3 (Thảo luận)'}</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p3List.length} {isEn ? 'tests' : 'bài'}</span>
                </label>
                <select
                  value={selectedP3Key}
                  onChange={(e) => setSelectedP3Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">{isEn ? '-- Select Part 3 --' : '-- Chọn bài Part 3 --'}</option>
                  {p3List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Part 4 Selector */}
              <div className="bg-white p-2.5 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>{isEn ? 'Part 4 (Lecture)' : 'Part 4 (Bài giảng)'}</span>
                  <span className="text-purple-600 font-mono text-[10px]">{p4List.length} {isEn ? 'tests' : 'bài'}</span>
                </label>
                <select
                  value={selectedP4Key}
                  onChange={(e) => setSelectedP4Key(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800"
                >
                  <option value="">{isEn ? '-- Select Part 4 --' : '-- Chọn bài Part 4 --'}</option>
                  {p4List.map(p => (
                    <option key={p.partKey} value={p.partKey}>
                      {p.part.title || p.testTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom title & Confirm Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              <input
                type="text"
                placeholder={isEn ? "Custom test title (e.g. Cambridge Practice Full Test 01)..." : "Tên đề thi tùy chỉnh (Ví dụ: Cambridge Practice Full Test 01)..."}
                value={assembledTitle}
                onChange={(e) => setAssembledTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-purple-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setIsAssemblerOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'Close' : 'Đóng'}
                </button>
                <button
                  onClick={handleManualAssemble}
                  disabled={!selectedP1Key || !selectedP2Key || !selectedP3Key || !selectedP4Key}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>{isEn ? 'Assemble Test (40 Questions)' : 'Hoàn Tất Ghép Đề (40 Câu)'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {assemblerError && (
              <p className="text-[11px] font-bold text-rose-600 animate-in fade-in">
                ⚠️ {assemblerError}
              </p>
            )}
          </div>
        )}

        {/* Tests List Grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-5 bg-slate-50/50">
          {sortedTests.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Headphones className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
              <p className="text-sm font-semibold text-slate-600">
                {isEn ? 'No listening tests found matching your criteria.' : 'Không tìm thấy bộ đề nghe nào phù hợp.'}
              </p>
              <p className="text-xs text-slate-400">
                {isEn ? 'Try different keywords or click "Generate Test" to create a new one.' : 'Hãy thử đổi từ khóa tìm kiếm hoặc bấm nút "Sinh Đề Bằng AI" để tạo đề mới.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {sortedTests.map((test) => {
                const isCurrent = currentTestId === test.id;
                const partCount = test.parts?.length || 4;

                return (
                  <div
                    key={test.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between bg-white relative ${
                      isCurrent
                        ? 'border-purple-500 ring-2 ring-purple-400/30 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Badge Top Line */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          {test.audioUrl?.includes('.r2.dev') ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-300">
                              ☁️ {isEn ? 'R2 Studio Audio • New' : 'Audio Thực Chiến R2 • Mới'}
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              test.isCustom 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {test.isCustom 
                                ? '✨ AI Audio Test' 
                                : (isEn ? `📚 Cambridge Standard${test.cambridgeBook ? ` (Book ${test.cambridgeBook})` : ''}` : `📚 Chuẩn Cambridge${test.cambridgeBook ? ` (Cam ${test.cambridgeBook})` : ''}`)}
                            </span>
                          )}

                          {(() => {
                            const { trackBadge } = getListeningTestDisplayInfo(test, isEn);
                            return trackBadge ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-700 text-white shadow-2xs">
                                {trackBadge}
                              </span>
                            ) : null;
                          })()}

                          {masteredIds.includes(test.id) && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-emerald-700" />
                              <span>{isEn ? 'Mastered' : 'Đã thuộc'}</span>
                            </span>
                          )}

                          {/* Public/Private Badge for Custom Listening Tests */}
                          {test.isCustom && !test.isEphemeral && (
                            <button
                              type="button"
                              onClick={() => onTogglePublic && onTogglePublic(test.id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition-colors cursor-pointer ${
                                test.isPublic 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                              title={isEn ? "Click to toggle Public / Private status" : "Bấm để chuyển đổi trạng thái Công khai / Riêng tư"}
                            >
                              {test.isPublic ? (
                                <>
                                  <Globe className="w-3 h-3 text-emerald-600" />
                                  <span>{isEn ? 'Public' : 'Cộng đồng'}</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 text-slate-500" />
                                  <span>{isEn ? 'Private' : 'Riêng tư'}</span>
                                </>
                              )}
                            </button>
                          )}

                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold">
                              {isEn ? 'Active' : 'Đang Luyện'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>~{test.timeLimitMinutes || 32} {isEn ? 'mins' : 'phút'}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-2">
                        {formatTestTitle(test.title, isEn, test)}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                        {formatTestDescription(test.description, isEn, test)}
                      </p>

                      {/* Star Rating & Social Proof */}
                      <div className="mb-3">
                        <StarRatingWidget itemId={test.id} fallbackTitle={test.title} size="xs" showAttempts={true} />
                      </div>

                      {/* Parts Peek */}
                      <div className="space-y-1.5 mb-4">
                        {test.parts?.slice(0, 3).map((p) => (
                          <div key={p.partNumber} className="text-[11px] text-slate-600 flex items-center space-x-1.5 truncate">
                            <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {p.partNumber}
                            </span>
                            <span className="font-medium text-slate-700 truncate">{p.title}</span>
                          </div>
                        ))}
                        {partCount > 3 && (
                          <div className="text-[10px] text-slate-400 pl-5">
                            + {isEn ? `${partCount - 3} more parts (total ${test.totalQuestions || 40} questions)` : `thêm ${partCount - 3} phần khác (tổng ${test.totalQuestions || 40} câu hỏi)`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-[11px] font-mono font-semibold">Zero-Storage URL</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {onToggleMastered && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleMastered(test.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              masteredIds.includes(test.id)
                                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title={
                              masteredIds.includes(test.id)
                                ? (isEn ? 'Unmark as mastered' : 'Bỏ đánh dấu đã thuộc')
                                : (isEn ? 'Mark as mastered' : 'Đánh dấu đã thuộc đề này')
                            }
                          >
                            <GraduationCap className="w-4 h-4" />
                          </button>
                        )}

                        {test.isCustom && onDeleteTest && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(isEn ? `Are you sure you want to delete listening test "${test.title}"?` : `Bạn có chắc muốn xóa đề nghe "${test.title}" không?`)) {
                                onDeleteTest(test.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={isEn ? "Delete this test" : "Xóa đề này"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            try { recordAttempt(test.id); } catch (e) {}
                            onSelectTest(test);
                            onClose();
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xs active:scale-95'
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{isEn ? 'Continue' : 'Tiếp Tục Làm'}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{isEn ? 'Select Test' : 'Chọn Đề Này'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            {isEn ? 'Direct audio streaming from Archive.org, BBC, TED, Podcasts • Automatic dead-link isolation' : 'Hỗ trợ URL âm thanh trực tiếp từ Archive.org, BBC, TED, Podcasts • Tự động cách ly nếu link chết'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
        </div>

      </div>
    </div>
  );
}
