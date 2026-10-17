import React, { useState, useMemo } from 'react';
import {
  X,
  Award,
  Flame,
  History,
  Bookmark,
  PenTool,
  Sparkles,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Settings,
  FolderKanban,
  LayoutDashboard,
  BookMarked,
  Headphones,
  Mic,
  GraduationCap,
  Pill,
  Keyboard
} from 'lucide-react';
import SpeakingResultModal from './speaking/SpeakingResultModal';
import { useTranslation } from '../i18n';
import { getTypingStats, getTopSpellingDemons, getTypingBadges } from '../services/gamification/typingStatsService';
import { useProfileAnalytics } from './profile/useProfileAnalytics';
import ProfileSkillHistoryTabs from './profile/ProfileSkillHistoryTabs';
import ProfileVaultAndAccountTabs from './profile/ProfileVaultAndAccountTabs';

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  masteredIds = [],
  onToggleMastered,
  submissions = [],
  readingHistory = [],
  listeningHistory = [],
  speakingHistory = [],
  vocabList = [],
  mistakes = [],
  streakCount = 3,
  allTasks = [],
  onSelectTask,
  onTogglePublic,
  onDeleteTask,
  onViewSubmission,
  onDeleteSubmission,
  onClearHistory,
  onClearAllHistory,
  onDeleteReadingSubmission,
  onClearReadingHistory,
  onDeleteListeningSubmission,
  onClearListeningHistory,
  onDeleteSpeakingSubmission,
  onClearSpeakingHistory,
  onSignOut,
  onOpenAuth,
  onOpenIngest,
  onOpenGenerator,
  onOpenLibrary,
  onExportAllData,
  onImportData,
  onSaveToVocabNotebook,
  onSaveMistake,
  onOpenPrescription
}) {
  const { t, isEn } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'submissions' | 'reading' | 'listening' | 'speaking' | 'resources' | 'vocab' | 'account'
  const [resourceFilter, setResourceFilter] = useState('all'); // 'all' | 'public' | 'private'
  const [masteredSkillFilter, setMasteredSkillFilter] = useState('all'); // 'all' | 'writing' | 'reading' | 'listening' | 'speaking'
  const [selectedSpeakingSub, setSelectedSpeakingSub] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        onImportData?.(parsed);
      } catch (err) {
        alert(isEn ? 'Invalid file or JSON syntax error.' : 'File không hợp lệ hoặc bị lỗi cú pháp JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Delegate multi-skill analytics, level progression, and repertoire resolution to useProfileAnalytics
  const {
    stats,
    readingStats,
    listeningStats,
    speakingStats,
    overallProjectedBand,
    rank,
    isOwnerUser,
    userLevelData,
    userCustomTasks,
    filteredCustomTasks,
    allMasteredItems,
    filteredMasteredItems
  } = useProfileAnalytics({
    isOpen,
    isEn,
    user,
    allTasks,
    submissions,
    readingHistory,
    listeningHistory,
    speakingHistory,
    masteredIds,
    resourceFilter,
    masteredSkillFilter
  });

  const typingStats = useMemo(() => {
    return getTypingStats();
  }, [isOpen]);

  const topSpellingDemons = useMemo(() => {
    return getTopSpellingDemons(5);
  }, [isOpen]);

  const typingBadges = useMemo(() => {
    return getTypingBadges(typingStats);
  }, [typingStats]);

  // Nav Items Definitions (All 4 Skills)
  const navItems = [
    { id: 'overview', label: isEn ? 'Overview & Analytics' : 'Tổng Quan & Năng Lực', icon: LayoutDashboard, badge: overallProjectedBand > 0 ? `Overall ${overallProjectedBand}` : null },
    { id: 'submissions', label: isEn ? 'Writing Submissions' : 'Lịch Sử IELTS Writing', icon: History, count: submissions.length, badge: stats.avgBand > 0 ? `Band ${stats.avgBand}` : null },
    { id: 'reading', label: isEn ? 'Reading History' : 'Lịch Sử IELTS Reading', icon: BookMarked, count: readingHistory.length, badge: readingStats.totalTests > 0 ? `Band ${readingStats.avgBand}` : null },
    { id: 'listening', label: isEn ? 'Listening History' : 'Lịch Sử IELTS Listening', icon: Headphones, count: listeningHistory.length, badge: listeningStats.totalTests > 0 ? `Band ${listeningStats.avgBand}` : null },
    { id: 'speaking', label: isEn ? 'Speaking Mock Exams' : 'Lịch Sử IELTS Speaking', icon: Mic, count: speakingHistory.length, badge: speakingStats.totalTests > 0 ? `Band ${speakingStats.avgBand}` : null },
    { id: 'mastered', label: isEn ? 'Mastered Tasks' : 'Đề & Bài Đã Thuộc', icon: GraduationCap, count: masteredIds.length, badge: masteredIds.length > 0 ? `${masteredIds.length}` : null },
    { id: 'resources', label: isEn ? 'Custom Resources' : 'Kho Đề & Tài Nguyên', icon: FolderKanban, count: userCustomTasks.length },
    { id: 'vocab', label: isEn ? 'Vocab & Error Vault' : 'Sổ Tay Từ Vựng & Lỗi', icon: Bookmark, count: vocabList.length },
    { id: 'account', label: isEn ? 'Settings & Data' : 'Cài Đặt & Dữ Liệu', icon: Settings, status: user ? (isEn ? 'Logged in' : 'Đã đăng nhập') : (isEn ? 'Guest' : 'Chưa đăng nhập') }
  ];

  // If modal is not open, don't render DOM (must be after all hooks!)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-2 lg:p-3 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-hidden">
      {/* FRAME CHÍNH CỦA TRANG CÁ NHÂN (PORTAL FRAME) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-[98vw] 2xl:max-w-[1620px] h-[96dvh] max-h-[96dvh] flex flex-col md:flex-row overflow-hidden overscroll-contain min-h-0">
        
        {/* ========================================================================= */}
        {/* 1. KHUNG NAVIGATION CỐ ĐỊNH BÊN TRÁI (SIDEBAR NAVIGATION) */}
        {/* ========================================================================= */}
        <aside className="w-full md:w-64 lg:w-72 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
          
          {/* Top Brand & User Card in Sidebar */}
          <div>
            {/* Brand Title */}
            <div className="p-3.5 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                  IELTS
                </div>
                <div>
                  <h2 className="text-xs font-black tracking-wider uppercase text-white leading-none">Student Portal</h2>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{isEn ? 'Learner Dashboard' : 'Trang Cá Nhân Học Viên'}</span>
                </div>
              </div>

              {/* Mobile Right Action Area: User Chip & Close Button */}
              <div className="flex items-center space-x-2 md:hidden">
                {!user ? (
                  <button
                    onClick={() => { onClose(); onOpenAuth?.(); }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition-all shadow-xs shrink-0"
                  >
                    {isEn ? 'Sign In' : 'Đăng nhập'}
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 max-w-[140px]">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-[10px] shrink-0">
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 truncate">
                      {user?.email ? user.email.split('@')[0] : (isEn ? 'Guest' : 'Khách')}
                    </span>
                  </div>
                )}
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  title={isEn ? 'Close user profile' : 'Đóng trang cá nhân'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Mini Card (Desktop Only) */}
            <div className="hidden md:block p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-md border border-white/20 shrink-0">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate flex-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-xs font-bold text-white truncate block">
                      {user?.email ? user.email.split('@')[0] : (isEn ? 'Guest Student' : 'Khách vãng lai')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9.5px] uppercase ${rank.color}`}>
                      {rank.badge}
                    </span>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9.5px] font-black border ${userLevelData.tier.badgeColor}`}>
                      Lv.{userLevelData.level}
                    </span>
                  </div>
                </div>
              </div>

              {!user && (
                <button
                  onClick={() => { onClose(); onOpenAuth?.(); }}
                  className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
                >
                  {isEn ? 'Sign In Account' : 'Đăng nhập tài khoản'}
                </button>
              )}
            </div>

            {/* INTEGRATED NAVIGATION MENU (Horizontal swipeable on mobile, Vertical stack on desktop) */}
            <nav className="p-2 sm:p-3 flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar gap-1.5 md:space-y-1 shrink-0">
              <div className="hidden md:block px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isEn ? 'Navigation' : 'Menu Quản Lý'}
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`shrink-0 md:w-full flex items-center justify-between px-3 py-2 md:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 bg-slate-800/40 md:bg-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2 md:space-x-2.5">
                      <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span className={`ml-2 md:ml-0 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.count}
                      </span>
                    )}

                    {item.badge && (
                      <span className="ml-2 md:ml-0 px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5 text-xs hidden md:block">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{isEn ? 'Streak:' : 'Chuỗi rèn luyện:'}</span>
              </span>
              <strong className="text-amber-400 font-black">{streakCount} {isEn ? 'days' : 'ngày'}</strong>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cloud Sync</span>
              </span>
              <span className="text-emerald-400 font-semibold">{isEn ? 'RLS Encrypted' : 'Bảo mật RLS'}</span>
            </div>

            {user && (
              <button
                onClick={onSignOut}
                className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white transition-colors text-[11px] font-bold flex items-center justify-center space-x-1.5"
              >
                <LogOut className="w-3 h-3" />
                <span>{isEn ? 'Sign Out' : 'Đăng xuất'}</span>
              </button>
            )}
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* 2. VÙNG NỘI DUNG Ở GIỮA CỦA USER (MAIN CONTENT AREA) */}
        {/* ========================================================================= */}
        <main className="flex-1 min-h-0 flex flex-col bg-slate-50/60 overflow-hidden">
          
          {/* Header Bar của Vùng Nội Dung */}
          <div className="px-3.5 sm:px-8 py-2.5 sm:py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="min-w-0 pr-2">
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                <span>Student Portal</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700 capitalize font-bold truncate">
                  {navItems.find(i => i.id === activeTab)?.label}
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-black text-slate-900 mt-0.5 line-clamp-1 sm:line-clamp-none">
                {activeTab === 'overview' && (isEn ? 'Holistic Performance & Cambridge Band Projections' : 'Tổng Quan Năng Lực & Dự Phóng Điểm IELTS')}
                {activeTab === 'submissions' && (isEn ? 'IELTS Writing Essay Submission Archive' : 'Lịch Sử Bài Viết IELTS Writing')}
                {activeTab === 'reading' && (isEn ? 'IELTS Reading Official Test Log & Analytics' : 'Lịch Sử Làm Đề & Thống Kê IELTS Reading')}
                {activeTab === 'listening' && (isEn ? 'IELTS Listening Test Log & Audioscript Analytics' : 'Lịch Sử Làm Đề & Thống Kê IELTS Listening')}
                {activeTab === 'speaking' && (isEn ? 'IELTS Speaking Examiner Mock Test Records' : 'Lịch Sử Thi Thử IELTS Speaking')}
                {activeTab === 'mastered' && (isEn ? 'Mastered Question Bank & Repertoire' : 'Danh Sách Đề Thi & Bài Luyện Đã Thuần Thục (Đã Thuộc)')}
                {activeTab === 'resources' && (isEn ? 'User-Authored Tasks & Custom Study Materials' : 'Kho Đề Bài & Tài Nguyên Bạn Đã Tải Lên')}
                {activeTab === 'vocab' && (isEn ? 'Personal Lexicon & Error Log Journal' : 'Sổ Tay Từ Vựng & Sổ Tay Lỗi Sai Cá Nhân')}
                {activeTab === 'account' && (isEn ? 'Account Configuration & Data Resilience' : 'Cài Đặt Tài Khoản & Quản Lý Dữ Liệu')}
              </h1>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={onClose}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title={isEn ? 'Back to practice' : 'Quay lại phòng luyện thi'}
              >
                <span>{isEn ? '← Back to Practice' : '← Quay Lại Luyện Thi'}</span>
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                title={isEn ? 'Close user profile' : 'Đóng trang cá nhân'}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Body Cuộn Được (Scrollable User Content) */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-3.5 sm:p-7 space-y-4 sm:space-y-6">
            
            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW & LEARNING FRAMEWORK */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* ATLAS TITANS LEVEL & XP PROGRESSION HERO BANNER */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-md ring-2 ${userLevelData.tier.ringColor} ${userLevelData.tier.badgeColor}`}>
                      Lv.{userLevelData.level}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-white">
                          {isEn ? 'LEVEL' : 'CẤP'} {userLevelData.level} • {isEn ? userLevelData.tier.titleEn : userLevelData.tier.titleVi}
                        </span>
                        {isOwnerUser && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-black">
                            👑 ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">
                        {isEn 
                          ? `Atlas Titan Progression • ${userLevelData.totalXp} Lifetime XP`
                          : `Hệ thống cấp độ Atlas Titans • ${userLevelData.totalXp} XP Toàn thời gian`}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-72 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {isEn ? `Progress to Level ${userLevelData.level + 1}` : `Tiến độ lên Cấp ${userLevelData.level + 1}`}
                      </span>
                      <span className="font-mono font-bold text-indigo-300">{userLevelData.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${userLevelData.progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 text-right font-mono">
                      {userLevelData.isMaxLevel
                        ? 'MAX LEVEL'
                        : isEn
                        ? `${userLevelData.xpRemaining} XP remaining`
                        : `Còn thiếu ${userLevelData.xpRemaining} XP`}
                    </div>
                  </div>
                </div>

                {/* PRE-DESIGNED KPI CARDS GRID (KHUNG CHỈ SỐ CỐ ĐỊNH 4 KỸ NĂNG) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {/* Card 1: Estimated Overall Band */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50/60 border border-red-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">Overall Band (Cambridge)</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-red-600">
                        {overallProjectedBand > 0 ? `Band ${overallProjectedBand}` : 'Band --'}
                      </span>
                      <Award className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {overallProjectedBand > 0 ? (isEn ? 'Cambridge 4-skill standard rounding' : 'Quy tròn chuẩn 4 kỹ năng') : (isEn ? 'Complete tests to calculate' : 'Cần hoàn thành bài thi để tính')}
                    </span>
                  </div>

                  {/* Card 2: Writing Band & Essays */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Writing Studio</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-blue-600">
                        {stats.avgBand > 0 ? `Band ${stats.avgBand}` : '--'}
                      </span>
                      <PenTool className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {stats.totalEssays} {isEn ? 'essays submitted' : 'bài viết đã nộp'}
                    </span>
                  </div>

                  {/* Card 3: Reading Studio */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Reading Studio</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                        {readingStats.avgBand > 0 ? `Band ${readingStats.avgBand}` : '--'}
                      </span>
                      <BookMarked className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {readingStats.totalTests} {isEn ? 'tests' : 'đề thi'} • {readingStats.totalCorrect} {isEn ? 'correct' : 'câu đúng'}
                    </span>
                  </div>

                  {/* Card 4: Listening Studio */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Listening Studio</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600">
                        {listeningStats.avgBand > 0 ? `Band ${listeningStats.avgBand}` : '--'}
                      </span>
                      <Headphones className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {listeningStats.totalTests} {isEn ? 'tests' : 'đề thi'} • {listeningStats.totalCorrect} {isEn ? 'correct' : 'câu đúng'}
                    </span>
                  </div>

                  {/* Card 5: Speaking Studio */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Speaking Studio</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-purple-600">
                        {speakingStats.avgBand > 0 ? `Band ${speakingStats.avgBand}` : '--'}
                      </span>
                      <Mic className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {speakingStats.totalTests} {isEn ? 'tests taken' : 'lượt thi'} • {speakingStats.avgWpm > 0 ? `${speakingStats.avgWpm} wpm` : (isEn ? 'None' : 'Chưa có')}
                    </span>
                  </div>
                </div>

                {/* SECONDARY ROW: CUSTOM TASKS & VOCAB & MASTERED */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Card: Mastered Items */}
                  <div 
                    onClick={() => setActiveTab('mastered')}
                    className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition-all group"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">{isEn ? 'Mastered Question Bank' : 'Đề & Bài Luyện Đã Thuộc'}</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-emerald-700">{masteredIds.length}</span>
                        <span className="text-xs text-emerald-600 font-semibold">{isEn ? 'mastered items' : 'mục đã thuần thục'}</span>
                      </div>
                      <span className="text-[11px] text-emerald-700/80 block">
                        {isEn ? 'Click to view list & review' : 'Bấm để xem danh sách & ôn tập lại'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card: Custom Tasks */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{isEn ? 'Custom & AI Generated Tasks' : 'Kho Đề Bài Tự Tải Lên & AI Sinh'}</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-purple-600">{userCustomTasks.length}</span>
                        <span className="text-xs text-slate-500">{isEn ? 'custom tasks' : 'đề bài cá nhân'}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        {userCustomTasks.filter(t => t.isPublic).length} {isEn ? 'publicly shared with community' : 'đề đang chia sẻ cộng đồng'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                      <FolderKanban className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card: Vocab Vault */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{isEn ? 'Vocab & Error Notebook' : 'Sổ Tay Từ Vựng & Sổ Lỗi Sai'}</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-amber-600">{vocabList.length}</span>
                        <span className="text-xs text-slate-500">{isEn ? 'C1/C2 terms' : 'từ vựng C1/C2'}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-2xl font-black text-red-600">{mistakes.length}</span>
                        <span className="text-xs text-slate-500">{isEn ? 'grammar slips' : 'lỗi ngữ pháp'}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        {isEn ? 'Automatically synced during practice & mock tests' : 'Được tự động đồng bộ khi viết bài & thi thử'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                      <Bookmark className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* DAILY ERROR PRESCRIPTION PROMO CARD */}
                <div 
                  onClick={() => {
                    onClose?.();
                    onOpenPrescription?.();
                  }}
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-red-500/10 border-2 border-rose-300 dark:border-rose-700/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-rose-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                      <Pill className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {isEn ? 'Daily Error Prescription (Spaced Repetition)' : 'Đơn Thuốc Sửa Lỗi Sai Mỗi Ngày (Spaced Repetition)'}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-700 rounded-full">
                          {isEn ? '3 Mins / Day' : '3 Phút / Ngày'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {isEn 
                          ? `Practice eliminating ${mistakes.length > 0 ? `${mistakes.length} actual mistakes you made` : '5 common grammar traps'} to reliably boost your band.`
                          : `Luyện tập giải quyết triệt để ${mistakes.length > 0 ? `${mistakes.length} lỗi thực tế bạn đã mắc` : '5 bẫy ngữ pháp người Việt hay mất điểm nhất'} để tăng band điểm bền vững.`}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl shadow-2xs transition-all shrink-0"
                  >
                    <span>{isEn ? 'Open Prescription' : 'Mở Đơn Thuốc'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* SPELLING & LEXICAL TYPING MASTERY (ARENA TYPE-IN & SPELLING DEMONS) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-800/50 shadow-md text-white space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <Keyboard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {isEn ? 'Spelling & Lexical Typing Mastery' : 'Chính Tả & Luyện Gõ Arena'}
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                            Active Recall
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {isEn 
                            ? 'Cambridge exact spelling accuracy and near-miss grace rescues in the Arena'
                            : 'Độ chuẩn xác chính tả chuẩn Cambridge và số lần cứu combo suýt đúng trong Arena'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Mini Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {isEn ? 'Words Typed' : 'Từ Đã Gõ'}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">
                        {typingStats.totalTyped}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isEn ? `${typingStats.correctCount} correct` : `${typingStats.correctCount} đúng`}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {isEn ? 'Accuracy Rate' : 'Độ Chính Xác'}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                        {typingStats.accuracyRate}%
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isEn ? 'Cambridge standard' : 'Chuẩn Cambridge'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {isEn ? 'Near-Miss Rescues' : 'Cứu Combo'}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                        {typingStats.nearMissRescued}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isEn ? 'Grace window saved' : 'Ân hạn suýt đúng'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {isEn ? 'Skipped Words' : 'Từ Bỏ Qua'}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                        {typingStats.skippedCount}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isEn ? 'Pass without input' : 'Bỏ qua khi thi'}
                      </span>
                    </div>
                  </div>

                  {/* Typing Mastery Badges */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                      {isEn ? 'Lexical Badges & Achievements' : 'Huy Hiệu & Thành Tích Chính Tả'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {typingBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className={`p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
                            badge.unlocked
                              ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-100 shadow-sm'
                              : 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{badge.icon}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              badge.unlocked ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {badge.unlocked ? (isEn ? 'UNLOCKED' : 'ĐÃ ĐẠT') : (isEn ? 'LOCKED' : 'CHƯA MỞ')}
                            </span>
                          </div>
                          <span className="text-xs font-bold truncate">
                            {isEn ? badge.nameEn : badge.nameVi}
                          </span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {isEn ? badge.descEn : badge.descVi}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Spelling Demons List */}
                  {topSpellingDemons.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                          <span>⚠️</span>
                          <span>{isEn ? 'Top Spelling Traps Encountered' : 'Các Bẫy Chính Tả Dễ Sai Nhất'}</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {isEn ? 'Practice these in Arena' : 'Cần rèn luyện thêm'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {topSpellingDemons.map(({ word, count }) => (
                          <div
                            key={word}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs font-mono"
                          >
                            <span className="font-bold">{word}</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-900/80 text-[10px] text-rose-300 font-sans font-bold">
                              {count}x {isEn ? 'slips' : 'lỗi'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ONBOARDING QUICK-ACTION FRAME (KHI CHƯA CÓ BÀI LÀM) */}
                {stats.totalEssays === 0 && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border border-red-200 shadow-xs space-y-4">
                    <div className="flex items-start space-x-3.5">
                      <div className="p-3 rounded-2xl bg-red-600 text-white shadow-md shrink-0">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {isEn ? 'Kickstart Your Exam Preparation' : 'Khởi Động Lộ Trình Luyện Thi Của Bạn'}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {isEn 
                            ? 'Your profile has Cambridge tracking frameworks ready. To populate scores into the 4-Criteria Rubric Framework below, choose a topic and submit your first essay:'
                            : 'Trang cá nhân đã được thiết lập sẵn khung theo dõi tiêu chuẩn Cambridge. Để lấp đầy điểm số vào Khung Phân Tích 4 Tiêu Chí bên dưới, bạn hãy chọn 1 đề bài và thực hiện bài viết đầu tiên:'}
                        </p>
                      </div>
                    </div>

                    {/* 3 Step Roadmap */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="p-3 bg-white/95 rounded-xl border border-red-100 flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">1</span>
                        <span className="text-xs font-semibold text-slate-800">{isEn ? 'Select a recommended task below' : 'Chọn 1 đề thi gợi ý bên dưới'}</span>
                      </div>
                      <div className="p-3 bg-white/95 rounded-xl border border-red-100 flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">2</span>
                        <span className="text-xs font-semibold text-slate-800">{isEn ? 'Click "Submit & AI Grade"' : 'Nhấn "Nộp Bài & Chấm Điểm AI"'}</span>
                      </div>
                      <div className="p-3 bg-white/95 rounded-xl border border-red-100 flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">3</span>
                        <span className="text-xs font-semibold text-slate-800">{isEn ? 'Analytics board will activate' : 'Bảng phân tích sẽ tự động kích hoạt'}</span>
                      </div>
                    </div>

                    {/* Suggested Tasks */}
                    <div className="pt-2 border-t border-red-100">
                      <span className="text-xs font-bold text-slate-800 block mb-2">{isEn ? 'Recommended tasks to start immediately:' : 'Đề bài gợi ý để bạn bắt đầu ngay:'}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(allTasks || []).slice(0, 2).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              onSelectTask?.(t);
                              onClose();
                            }}
                            className="p-3 rounded-xl bg-white hover:bg-red-50/50 border border-slate-200 hover:border-red-200 text-left flex items-center justify-between group transition-all shadow-2xs"
                          >
                            <div className="truncate pr-2">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black uppercase mr-1.5 ${
                                t.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                              }`}>
                                Task {t.taskNumber}
                              </span>
                              <span className="text-xs font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                                {t.title}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-red-600 shrink-0">{isEn ? 'Write now →' : 'Viết ngay →'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* PRE-DESIGNED 4-CRITERIA RUBRIC FRAMEWORK (KHUNG 4 TIÊU CHÍ CHUẨN) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{isEn ? 'IELTS 4-Criteria Diagnostic Details (Rubric Framework)' : 'Chi Tiết Năng Lực 4 Tiêu Chí Chấm IELTS (Rubric Framework)'}</h3>
                      <p className="text-xs text-slate-500">{isEn ? 'Diagnostic breakdown according to Cambridge examiner criteria 0 - 9.0' : 'Thang đo đánh giá chi tiết theo chuẩn giám khảo Cambridge 0 - 9.0'}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
                      IELTS Official Rubric
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* TR / TA */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Task Achievement / Response (TR/TA)</span>
                        <span className="font-black text-red-600 text-sm">
                          {stats.avgTR > 0 ? stats.avgTR : (isEn ? 'N/A' : 'Chưa có')}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600 rounded-full transition-all duration-500"
                          style={{ width: `${stats.avgTR > 0 ? (Number(stats.avgTR) / 9) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">{isEn ? 'Ability to address all parts of the task and develop ideas logically' : 'Khả năng trả lời đúng trọng tâm đề và phát triển luận điểm'}</span>
                    </div>

                    {/* CC */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Coherence & Cohesion (CC)</span>
                        <span className="font-black text-blue-600 text-sm">
                          {stats.avgCC > 0 ? stats.avgCC : (isEn ? 'N/A' : 'Chưa có')}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${stats.avgCC > 0 ? (Number(stats.avgCC) / 9) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">{isEn ? 'Logical progression, cohesive devices, and effective paragraphing' : 'Độ mạch lạc, liên kết câu từ và cấu trúc phân chia đoạn văn'}</span>
                    </div>

                    {/* LR */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Lexical Resource (LR)</span>
                        <span className="font-black text-amber-600 text-sm">
                          {stats.avgLR > 0 ? stats.avgLR : (isEn ? 'N/A' : 'Chưa có')}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-600 rounded-full transition-all duration-500"
                          style={{ width: `${stats.avgLR > 0 ? (Number(stats.avgLR) / 9) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">{isEn ? 'Academic C1/C2 vocabulary, natural collocations, and paraphrase variety' : 'Vốn từ vựng học thuật C1/C2, collocations và tránh lặp từ'}</span>
                    </div>

                    {/* GRA */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Grammar Range & Accuracy (GRA)</span>
                        <span className="font-black text-emerald-600 text-sm">
                          {stats.avgGRA > 0 ? stats.avgGRA : (isEn ? 'N/A' : 'Chưa có')}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${stats.avgGRA > 0 ? (Number(stats.avgGRA) / 9) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">{isEn ? 'Variety of complex structures and grammatical accuracy' : 'Độ đa dạng của câu ghép/phức và độ chuẩn xác ngữ pháp'}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* TABS: 4-SKILL SUBMISSIONS & HISTORY (WRITING, READING, LISTENING, SPEAKING) */}
            {/* ========================================================================= */}
            <ProfileSkillHistoryTabs
              activeTab={activeTab}
              isEn={isEn}
              submissions={submissions}
              readingHistory={readingHistory}
              listeningHistory={listeningHistory}
              speakingHistory={speakingHistory}
              readingStats={readingStats}
              listeningStats={listeningStats}
              speakingStats={speakingStats}
              masteredIds={masteredIds}
              onViewSubmission={onViewSubmission}
              onDeleteSubmission={onDeleteSubmission}
              onClearHistory={onClearHistory}
              onDeleteReadingSubmission={onDeleteReadingSubmission}
              onClearReadingHistory={onClearReadingHistory}
              onDeleteListeningSubmission={onDeleteListeningSubmission}
              onClearListeningHistory={onClearListeningHistory}
              onDeleteSpeakingSubmission={onDeleteSpeakingSubmission}
              onClearSpeakingHistory={onClearSpeakingHistory}
              setSelectedSpeakingSub={setSelectedSpeakingSub}
              onClose={onClose}
            />

            {/* ========================================================================= */}
            {/* TABS: RESOURCES, MASTERED REPERTOIRE, VOCAB VAULT & ACCOUNT SETTINGS */}
            {/* isEn ? 'Account Configuration & Data Resilience' : 'Cài Đặt Tài Khoản & Quản Lý Dữ Liệu' */}
            {/* ========================================================================= */}
            <ProfileVaultAndAccountTabs
              activeTab={activeTab}
              isEn={isEn}
              user={user}
              allTasks={allTasks}
              userCustomTasks={userCustomTasks}
              filteredCustomTasks={filteredCustomTasks}
              resourceFilter={resourceFilter}
              setResourceFilter={setResourceFilter}
              allMasteredItems={allMasteredItems}
              filteredMasteredItems={filteredMasteredItems}
              masteredSkillFilter={masteredSkillFilter}
              setMasteredSkillFilter={setMasteredSkillFilter}
              vocabList={vocabList}
              mistakes={mistakes}
              onSelectTask={onSelectTask}
              onTogglePublic={onTogglePublic}
              onDeleteTask={onDeleteTask}
              onToggleMastered={onToggleMastered}
              onOpenIngest={onOpenIngest}
              onOpenGenerator={onOpenGenerator}
              onExportAllData={onExportAllData}
              onImportData={onImportData}
              handleFileUpload={handleFileUpload}
              onSignOut={onSignOut}
              onClose={onClose}
            />

          </div>

        </main>

      {/* Speaking Evaluation Result Modal */}
      {selectedSpeakingSub && (
        <SpeakingResultModal
          isOpen={!!selectedSpeakingSub}
          onClose={() => setSelectedSpeakingSub(null)}
          evaluation={selectedSpeakingSub.evaluation}
          dialogueHistory={selectedSpeakingSub.dialogueHistory}
          mockPack={selectedSpeakingSub.mockPack}
          examiner={selectedSpeakingSub.examiner}
          totalDurationSec={selectedSpeakingSub.durationSec}
          onSaveToVocabNotebook={onSaveToVocabNotebook}
          onSaveMistake={onSaveMistake}
        />
      )}

      </div>
    </div>
  );
}
