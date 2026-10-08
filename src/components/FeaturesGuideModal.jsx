import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Search, 
  Users, 
  Smartphone, 
  ShieldCheck, 
  Award, 
  Cloud, 
  BookOpen, 
  Puzzle, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Compass,
  Zap,
  Tag,
  PenTool,
  Mic,
  Headphones,
  Layers,
  GraduationCap,
  Image as ImageIcon,
  Keyboard,
  BarChart3,
  FileText,
  Target,
  ArrowRight,
  Calendar,
  SlidersHorizontal,
  Flame,
  Check,
  Pill
} from 'lucide-react';
import { 
  FEATURE_REGISTRY, 
  FEATURE_CATEGORIES, 
  SKILL_DEFINITIONS, 
  searchFeatures, 
  dispatchFeatureAction,
  getRecentChangelog,
  getFeatureGitBookUrl
} from '../core/featureRegistry';
import { openModal as storeOpenModal } from '../core/modalStore';
import { useTranslation } from '../i18n';

const ICON_MAP = {
  Image: ImageIcon,
  Users: Users,
  Smartphone: Smartphone,
  ShieldCheck: ShieldCheck,
  Award: Award,
  Cloud: Cloud,
  BookOpen: BookOpen,
  Puzzle: Puzzle,
  Clock: Clock,
  Zap: Zap,
  Sparkles: Sparkles,
  Target: Target,
  PenTool: PenTool,
  Mic: Mic,
  Headphones: Headphones,
  Layers: Layers,
  Keyboard: Keyboard,
  BarChart3: BarChart3,
  FileText: FileText,
  Compass: Compass,
  Pill: Pill
};

const SKILL_ICONS = {
  writing: PenTool,
  reading: BookOpen,
  speaking: Mic,
  listening: Headphones
};

const CATEGORY_LABELS_EN = {
  all: 'All Categories',
  ai_evaluation: 'AI & Cambridge Assessment',
  practice_tools: 'Question Bank & Practice Tools',
  exam_simulation: 'Official CDI Exam Simulation',
  theory_vocab: 'Handbooks & Vocabulary Notebook',
  analytics_profile: 'Progress & Personal Profile',
  shortcuts_ux: 'Interface & Shortcuts'
};

const SKILL_DESCS_EN = {
  writing: 'CDI-standard Writing room, 4-criteria Cambridge AI evaluation, idea matrix, paraphrase & Task 1 visual ingest.',
  reading: 'Split-screen CDI Reading room, 1-touch vocabulary lookup, True/False/Not Given trap analyzer & instant scoring.',
  listening: 'Segmented audio player, multi-speed playback (0.8x-1.5x), bolded answer transcript & exact word counter.',
  speaking: 'Dual-engine speaking studio (⚡ 0.02ms Algorithmic & 🤖 Cambridge AI), 15-minute simulated Cambridge examiner room.'
};

export default function FeaturesGuideModal({ 
  isOpen, 
  onClose, 
  initialSkill = 'all',
  onNavigateWorkspace,
  onOpenModal
}) {
  if (!isOpen) return null;

  const { t, isEn } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(initialSkill || 'all');
  const [showChangelogOnly, setShowChangelogOnly] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState(FEATURE_REGISTRY[0]?.id);
  const [mobileTab, setMobileTab] = useState('list'); // 'filter' | 'list' | 'detail'
  
  const searchInputRef = useRef(null);

  // Tự động nhận diện ngữ cảnh ban đầu (Context-awareness)
  useEffect(() => {
    if (initialSkill && initialSkill !== 'all') {
      setSelectedSkill(initialSkill);
      // Tìm tính năng đầu tiên thuộc kỹ năng này để active
      const firstSkillFeat = FEATURE_REGISTRY.find(f => f.targetSkills?.includes(initialSkill));
      if (firstSkillFeat) {
        setActiveFeatureId(firstSkillFeat.id);
      }
    }
  }, [initialSkill]);

  // Focus ô tìm kiếm khi mở modal
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Tính toán danh sách tính năng được lọc
  const filteredFeatures = useMemo(() => {
    if (showChangelogOnly) {
      return getRecentChangelog(12);
    }
    return searchFeatures(searchQuery, {
      category: selectedCategory,
      skill: selectedSkill
    });
  }, [searchQuery, selectedCategory, selectedSkill, showChangelogOnly]);

  // Cập nhật tính năng đang chọn nếu danh sách thay đổi
  useEffect(() => {
    if (filteredFeatures.length > 0) {
      const exists = filteredFeatures.some(f => f.id === activeFeatureId);
      if (!exists) {
        setActiveFeatureId(filteredFeatures[0].id);
      }
    }
  }, [filteredFeatures, activeFeatureId]);

  const activeFeature = useMemo(() => {
    return FEATURE_REGISTRY.find(f => f.id === activeFeatureId) || filteredFeatures[0] || FEATURE_REGISTRY[0];
  }, [activeFeatureId, filteredFeatures]);

  const ActiveIcon = ICON_MAP[activeFeature?.icon] || Sparkles;

  // Thực thi 1-Click Action Launcher
  const handleLaunchFeature = (feature) => {
    if (!feature?.quickAction) return;
    
    dispatchFeatureAction(feature.quickAction, {
      openModal: onOpenModal || storeOpenModal,
      switchSkill: onNavigateWorkspace,
      closeModal: onClose
    });
  };

  const skillFilterItems = [
    { id: 'all', label: isEn ? 'All Skills' : 'Tất Cả Kỹ Năng', icon: GraduationCap, color: 'text-slate-700' },
    { id: 'writing', label: 'Writing', icon: PenTool, color: 'text-red-600' },
    { id: 'reading', label: 'Reading', icon: BookOpen, color: 'text-blue-600' },
    { id: 'speaking', label: 'Speaking', icon: Mic, color: 'text-emerald-600' },
    { id: 'listening', label: 'Listening', icon: Headphones, color: 'text-amber-600' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-1.5 sm:p-4 lg:p-6 overflow-hidden animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[98vw] 2xl:max-w-[1600px] shadow-2xl overflow-hidden flex flex-col h-[94dvh] max-h-[96dvh] border border-slate-200/80 min-w-0">
        
        {/* TOP HEADER: Spotlight Search Bar & Controls */}
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-2.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 gap-2 sm:gap-3 shrink-0 min-w-0">
          
          {/* Row 1 on mobile: Icon, Title & Close Button */}
          <div className="flex items-center justify-between w-full md:w-auto min-w-0">
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shrink-0">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <h2 className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-white truncate">
                    {isEn ? 'Help Center & Feature Guide' : 'Trung Tâm Trợ Giúp & Tính Năng'}
                  </h2>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                    {isEn ? 'Live Updated' : 'Tự Động Cập Nhật'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                  {isEn ? 'Instant reference manual & 1-click launcher for Cambridge IELTS preparation tools' : 'Tài liệu tra cứu tức thì & phóng nhanh công cụ luyện thi IELTS Cambridge'}
                </p>
              </div>
            </div>

            {/* Mobile Close Button (Always visible on mobile row 1 top right) */}
            <div className="flex md:hidden items-center shrink-0 ml-1.5">
              <button
                onClick={onClose}
                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isEn ? "Close (Esc)" : "Đóng cửa sổ (Esc)"}
                aria-label={isEn ? "Close" : "Đóng"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Row 2 on mobile / Middle on Desktop: Spotlight Instant Search Bar */}
          <div className="w-full md:flex-1 md:max-w-xl md:mx-4 min-w-0">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowChangelogOnly(false);
                }}
                placeholder={isEn ? "Search features, shortcuts (e.g. AI scoring, task 1, Alt+F)..." : "Tìm tính năng, phím tắt (vd: chấm máy, task 1, Alt+F)..."}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Right Action: GitBook Portal, Shortcut Hint & Close */}
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            <a
              href={getFeatureGitBookUrl(selectedCategory)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              title={isEn ? "Open detailed documentation on GitBook" : "Mở tài liệu chi tiết trên GitBook"}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>GitBook Docs</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>

            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
              <Keyboard className="w-3.5 h-3.5 text-slate-400" />
              <span>{isEn ? 'Shortcut:' : 'Phím tắt:'}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[10px] font-bold">F1</kbd>
            </div>

            <button
              onClick={onClose}
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isEn ? "Close (Esc)" : "Đóng cửa sổ (Esc)"}
              aria-label={isEn ? "Close" : "Đóng"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MOBILE SUB-NAV TABS */}
        <div className="lg:hidden flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 shrink-0">
          <button
            onClick={() => setMobileTab('filter')}
            className={`flex-1 py-2.5 text-center border-b-2 flex items-center justify-center gap-1.5 ${mobileTab === 'filter' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent'}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isEn ? 'Filters' : 'Bộ Lọc'}</span>
          </button>
          <button
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2.5 text-center border-b-2 flex items-center justify-center gap-1.5 ${mobileTab === 'list' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent'}`}
          >
            <span>{isEn ? `List (${filteredFeatures.length})` : `Danh Sách (${filteredFeatures.length})`}</span>
          </button>
          <button
            onClick={() => setMobileTab('detail')}
            className={`flex-1 py-2.5 text-center border-b-2 flex items-center justify-center gap-1.5 ${mobileTab === 'detail' ? 'border-red-600 text-red-600 bg-white' : 'border-transparent'}`}
          >
            <span>{isEn ? 'Details' : 'Chi Tiết'}</span>
          </button>
        </div>

        {/* MAIN BODY: 3-COLUMN MODERN WORKSPACE */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-100">
          
          {/* COLUMN 1: SIDEBAR FILTERS (Kỹ Năng & Chuyên Đề) */}
          <div className={`w-full lg:w-64 xl:w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto space-y-5 shrink-0 ${mobileTab === 'filter' ? 'block' : 'hidden lg:block'}`}>
            
            {/* 1.1 IELTS Skills Filter */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                <span>{isEn ? 'By IELTS Skill' : 'Theo Kỹ Năng IELTS'}</span>
              </div>
              <div className="space-y-1">
                {skillFilterItems.map(item => {
                  const Icon = item.icon;
                  const isSelected = !showChangelogOnly && selectedSkill === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedSkill(item.id);
                        setShowChangelogOnly(false);
                        setMobileTab('list');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected 
                          ? 'bg-red-50 text-red-700 shadow-2xs font-extrabold border border-red-200/80' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1.2 Categories Filter */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>{isEn ? 'By Category' : 'Theo Chuyên Đề'}</span>
              </div>
              <div className="space-y-1">
                {FEATURE_CATEGORIES.map(cat => {
                  const CatIcon = ICON_MAP[cat.icon] || Tag;
                  const isSelected = !showChangelogOnly && selectedCategory === cat.id;
                  const catLabel = isEn ? (CATEGORY_LABELS_EN[cat.id] || cat.label) : cat.label;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowChangelogOnly(false);
                        setMobileTab('list');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-slate-900 text-white font-bold shadow-xs' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <CatIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{catLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1.3 Auto Changelog Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowChangelogOnly(true);
                  setSelectedSkill('all');
                  setSelectedCategory('all');
                  setMobileTab('list');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                  showChangelogOnly 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-sm' 
                    : 'bg-amber-50/60 border-amber-200 text-amber-900 hover:bg-amber-100/70'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Flame className={`w-4 h-4 ${showChangelogOnly ? 'text-white' : 'text-amber-600'}`} />
                  <span>{isEn ? '⚡ Recent Updates (Changelog)' : '⚡ Mới Cập Nhật (Changelog)'}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* Quick Stats Footnote */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700 flex items-center justify-between">
                <span>{isEn ? 'Total Features:' : 'Tổng tính năng:'}</span>
                <span className="text-red-600 font-extrabold">{FEATURE_REGISTRY.length} modules</span>
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {isEn ? 'All modules include comprehensive guides and 1-click launchers.' : 'Toàn bộ tính năng đều có tài liệu hướng dẫn và liên kết khởi chạy tự động.'}
              </div>
            </div>

            {/* GitBook Deep Link Portal */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-50/80 to-rose-50/80 border border-red-200/80 text-[11px] space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-red-900">
                <BookOpen className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{isEn ? 'GitBook Handbook' : 'Cẩm Nang GitBook'}</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-snug">
                {isEn ? 'Read comprehensive guides and in-depth tutorials on official GitBook.' : 'Đọc cẩm nang toàn diện và hướng dẫn chi tiết trên trang GitBook chính thức.'}
              </p>
              <a
                href={getFeatureGitBookUrl(selectedCategory)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-[11px] shadow-xs transition-colors cursor-pointer"
              >
                <span>{isEn ? 'Open on GitBook' : 'Mở Trên GitBook'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          {/* COLUMN 2: FEATURE DIRECTORY (Danh Sách Tính Năng) */}
          <div className={`w-full lg:w-80 xl:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 min-w-0 ${mobileTab === 'list' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Header info bar */}
            <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>{isEn ? `Found ${filteredFeatures.length} features` : `Tìm thấy ${filteredFeatures.length} tính năng`}</span>
              {showChangelogOnly && (
                <span className="text-amber-600 font-extrabold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {isEn ? 'Latest' : 'Mới Nhất'}
                </span>
              )}
            </div>

            {/* Feature List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredFeatures.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold">{isEn ? 'No matching features found' : 'Không tìm thấy tính năng phù hợp'}</p>
                  <p className="text-[11px]">{isEn ? 'Try searching with different keywords or reset filters.' : 'Hãy thử tìm bằng từ khóa khác hoặc xóa bộ lọc.'}</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedSkill('all');
                      setShowChangelogOnly(false);
                    }}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    {isEn ? 'View All' : 'Xem Tất Cả'}
                  </button>
                </div>
              ) : (
                filteredFeatures.map(feat => {
                  const ItemIcon = ICON_MAP[feat.icon] || Sparkles;
                  const isActive = feat.id === activeFeature?.id;
                  
                  return (
                    <button
                      key={feat.id}
                      onClick={() => {
                        setActiveFeatureId(feat.id);
                        setMobileTab('detail');
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-md ring-1 ring-slate-800' 
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isActive 
                          ? 'bg-slate-800 text-red-400' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                            {feat.title}
                          </span>
                        </div>

                        <p className={`text-[11px] line-clamp-2 mt-0.5 leading-snug ${
                          isActive ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {feat.shortDesc}
                        </p>

                        <div className="flex items-center space-x-2 mt-2">
                          {feat.badge && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isActive 
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {feat.badge}
                            </span>
                          )}

                          {feat.shortcut && (
                            <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                              isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {feat.shortcut}
                            </span>
                          )}

                          {feat.updatedAt && (
                            <span className={`text-[10px] ml-auto ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                              {feat.updatedAt.slice(5)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* COLUMN 3: RICH INTERACTIVE READER & ACTION LAUNCHER (Chi Tiết & Phóng Tính Năng) */}
          <div className={`flex-1 bg-white overflow-y-auto p-4 sm:p-6 lg:p-8 ${mobileTab === 'detail' ? 'block' : 'hidden lg:block'}`}>
            {activeFeature && (
              <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
                
                {/* 3.1 Feature Banner Header */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl space-y-4 border border-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider">
                        {activeFeature.version || 'v2.8'}
                      </span>
                      {activeFeature.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-[11px] font-bold border border-white/20">
                          {activeFeature.badge}
                        </span>
                      )}
                    </div>
                    {activeFeature.updatedAt && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Updated:' : 'Cập nhật:'} {activeFeature.updatedAt}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start space-x-3.5">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-red-400 border border-white/10 shrink-0">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">
                        {activeFeature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                        {activeFeature.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* 1-CLICK ACTION LAUNCHER & GITBOOK DEEP LINK */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {activeFeature.quickAction && (
                      <button
                        onClick={() => handleLaunchFeature(activeFeature)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-red-900/30 flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>{isEn ? (activeFeature.quickAction.labelEn || 'Launch This Feature') : (activeFeature.quickAction.label || 'Thử Ngay Tính Năng Này')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <a
                      href={getFeatureGitBookUrl(activeFeature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-slate-600/80 flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
                      title={isEn ? `Read comprehensive guide on GitBook` : `Đọc tài liệu chuyên sâu về "${activeFeature.title}" trên GitBook`}
                    >
                      <BookOpen className="w-4 h-4 text-rose-400" />
                      <span>{isEn ? 'Read on GitBook' : 'Đọc Trên GitBook'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    {activeFeature.shortcut && (
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span>{isEn ? 'or press' : 'hoặc bấm'}</span>
                        <kbd className="px-2 py-1 rounded-md bg-slate-800 text-white font-mono text-xs font-bold border border-slate-700">
                          {activeFeature.shortcut}
                        </kbd>
                      </span>
                    )}
                  </div>
                </div>

                {/* 3.2 Target Skills Badges */}
                {activeFeature.targetSkills && activeFeature.targetSkills.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-red-600" />
                      <span>{isEn ? 'Directly enhances IELTS skills:' : 'Bổ trợ trực tiếp cho các kỹ năng IELTS:'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeFeature.targetSkills.map(sk => {
                        const def = SKILL_DEFINITIONS[sk];
                        if (!def) return null;
                        const SkillIcon = SKILL_ICONS[sk] || PenTool;
                        return (
                          <div 
                            key={sk} 
                            className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-start space-x-2.5"
                          >
                            <div className={`p-2 rounded-lg shrink-0 ${def.color}`}>
                              <SkillIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                                <span>{def.label}</span>
                                <span className={`w-1.5 h-1.5 rounded-full ${def.dotColor}`}></span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {isEn ? (SKILL_DESCS_EN[sk] || def.desc) : def.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3.3 Key Highlights Checklist */}
                {activeFeature.highlights && activeFeature.highlights.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{isEn ? 'Key Highlights & Core Capabilities:' : 'Các Điểm Nổi Bật & Năng Lực Cốt Lõi:'}</span>
                    </h4>
                    <div className="space-y-2.5">
                      {activeFeature.highlights.map((h, i) => (
                        <div 
                          key={i} 
                          className="flex items-start space-x-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-700 shadow-2xs hover:border-slate-300 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3.4 Usage Guide Step-by-Step */}
                {activeFeature.usageGuide && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <span className="text-xs font-black text-amber-900 flex items-center space-x-2">
                      <span className="text-base">💡</span>
                      <span>{isEn ? 'Quick Start Guide:' : 'Hướng Dẫn Thao Tác Nhanh:'}</span>
                    </span>
                    <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed pl-6">
                      {activeFeature.usageGuide}
                    </p>
                  </div>
                )}

                {/* 3.5 Quick Action Footer */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold">{isEn ? 'Ready to try this feature right now?' : 'Bạn muốn trải nghiệm ngay tính năng này?'}</div>
                    <div className="text-[11px] text-slate-400">
                      {isEn ? 'Click below to close the guide and launch the tool directly.' : 'Bấm nút bên dưới để đóng bảng trợ giúp và mở trực tiếp công cụ.'}
                    </div>
                  </div>
                  {activeFeature.quickAction ? (
                    <button
                      onClick={() => handleLaunchFeature(activeFeature)}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shrink-0 shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>{isEn ? (activeFeature.quickAction.labelEn || 'Get Started Now') : (activeFeature.quickAction.label || 'Bắt Đầu Ngay')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shrink-0"
                    >
                      {isEn ? 'Close Guide' : 'Đóng Trợ Giúp'}
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
