import React, { useState, useMemo } from 'react';
import { 
  X, 
  User, 
  Award, 
  Flame, 
  BookOpen, 
  History, 
  Bookmark, 
  CheckCircle2, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Clock, 
  FileText, 
  Trash2, 
  PenTool, 
  Sparkles, 
  Share2, 
  ShieldCheck, 
  LogOut, 
  Image as ImageIcon,
  ChevronRight,
  BarChart3,
  ExternalLink
} from 'lucide-react';

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  submissions = [],
  vocabList = [],
  mistakes = [],
  streakCount = 3,
  allTasks = [],
  onSelectTask,
  onTogglePublic,
  onDeleteTask,
  onViewSubmission,
  onSignOut,
  onOpenAuth
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'resources' | 'submissions' | 'account'
  const [resourceFilter, setResourceFilter] = useState('all'); // 'all' | 'public' | 'private'

  // If modal is not open, don't render
  if (!isOpen) return null;

  // 1. Calculate Learning Stats from Submissions
  const stats = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return {
        totalEssays: 0,
        task1Count: 0,
        task2Count: 0,
        avgBand: 0,
        avgTR: 0,
        avgCC: 0,
        avgLR: 0,
        avgGRA: 0,
        totalWords: 0,
        recentScores: []
      };
    }

    let totalTR = 0;
    let totalCC = 0;
    let totalLR = 0;
    let totalGRA = 0;
    let totalOverall = 0;
    let validBandCount = 0;
    let task1 = 0;
    let task2 = 0;
    let words = 0;

    const recentScores = [];

    submissions.forEach(sub => {
      if (sub.task?.taskNumber === 1) task1++;
      if (sub.task?.taskNumber === 2) task2++;

      if (sub.stats?.wordCount) {
        words += Number(sub.stats.wordCount) || 0;
      }

      if (sub.evaluation) {
        const ev = sub.evaluation;
        const tr = Number(ev.taskAchievement?.score || ev.taskResponse?.score || 0);
        const cc = Number(ev.coherenceCohesion?.score || 0);
        const lr = Number(ev.lexicalResource?.score || 0);
        const gra = Number(ev.grammarAccuracy?.score || 0);
        const overall = Number(ev.overallBand || 0);

        if (overall > 0) {
          totalTR += tr;
          totalCC += cc;
          totalLR += lr;
          totalGRA += gra;
          totalOverall += overall;
          validBandCount++;

          recentScores.push({
            date: sub.date || 'Gần đây',
            overall: overall,
            taskTitle: sub.task?.title || 'Bài luận'
          });
        }
      }
    });

    return {
      totalEssays: submissions.length,
      task1Count: task1,
      task2Count: task2,
      avgBand: validBandCount > 0 ? (totalOverall / validBandCount).toFixed(1) : 0,
      avgTR: validBandCount > 0 ? (totalTR / validBandCount).toFixed(1) : 0,
      avgCC: validBandCount > 0 ? (totalCC / validBandCount).toFixed(1) : 0,
      avgLR: validBandCount > 0 ? (totalLR / validBandCount).toFixed(1) : 0,
      avgGRA: validBandCount > 0 ? (totalGRA / validBandCount).toFixed(1) : 0,
      totalWords: words,
      recentScores: recentScores.slice(0, 5).reverse()
    };
  }, [submissions]);

  // 2. Filter User's Uploaded / Custom Tasks
  const userCustomTasks = useMemo(() => {
    // Tasks created by this user: flag isOwnTask = true or id starts with 'task-' or 'custom-'
    return (allTasks || []).filter(t => t.isOwnTask || t.id?.startsWith('task-') || t.id?.startsWith('custom-'));
  }, [allTasks]);

  const filteredCustomTasks = useMemo(() => {
    if (resourceFilter === 'public') return userCustomTasks.filter(t => t.isPublic);
    if (resourceFilter === 'private') return userCustomTasks.filter(t => !t.isPublic);
    return userCustomTasks;
  }, [userCustomTasks, resourceFilter]);

  // Academic Rank Badge based on Average Band
  const getScholarRank = (band) => {
    const num = Number(band);
    if (num >= 8.0) return { title: 'IELTS Writing Scholar', color: 'from-amber-500 to-yellow-400 text-yellow-950', badge: 'Band 8.0+ Elite' };
    if (num >= 7.0) return { title: 'Academic Master', color: 'from-purple-600 to-indigo-600 text-white', badge: 'Band 7.0 - 7.5' };
    if (num >= 6.0) return { title: 'IELTS Challenger', color: 'from-blue-600 to-cyan-600 text-white', badge: 'Band 6.0 - 6.5' };
    return { title: 'IELTS Trainee', color: 'from-slate-700 to-slate-800 text-white', badge: 'Bắt đầu hành trình' };
  };

  const rank = getScholarRank(stats.avgBand);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] max-h-[820px] flex flex-col overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-5 sm:px-7 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Trang Cá Nhân & Trung Tâm Học Tập</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/30">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[280px] sm:max-w-md">
                {user ? user.email : 'Khách vãng lai (Chưa đăng nhập)'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Đóng trang cá nhân"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOT LOGGED IN WARNING BANNER */}
        {!user && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center space-x-2 truncate">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Bạn đang xem dữ liệu tạm trên thiết bị này. Hãy đăng nhập để lưu trữ vĩnh viễn trên Supabase Cloud!</span>
            </div>
            <button
              onClick={() => { onClose(); onOpenAuth?.(); }}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0 transition-colors shadow-xs"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 overflow-x-auto shrink-0 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-700 bg-white shadow-2xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tổng Quan & Năng Lực</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center space-x-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'resources'
                ? 'border-red-600 text-red-700 bg-white shadow-2xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Kho Đề Bạn Tải Lên</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-extrabold">
              {userCustomTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center space-x-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'border-red-600 text-red-700 bg-white shadow-2xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch Sử Bài Viết</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-extrabold">
              {submissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center space-x-2 py-3 px-3 sm:px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'account'
                ? 'border-red-600 text-red-700 bg-white shadow-2xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tài Khoản & Bảo Mật</span>
          </button>
        </div>

        {/* MODAL BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW & LEARNING ANALYTICS */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* User Hero Badge Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-md border-2 border-white/20">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg sm:text-xl font-black">{user?.email?.split('@')[0] || 'Học Viên IELTS'}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r ${rank.color} shadow-xs`}>
                        {rank.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                      <span>Danh hiệu: </span>
                      <strong className="text-slate-200">{rank.title}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl self-stretch sm:self-auto justify-around">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Chuỗi học tập</span>
                    <span className="text-base sm:text-lg font-black text-amber-400 flex items-center justify-center space-x-1">
                      <Flame className="w-4 h-4 fill-amber-400" />
                      <span>{streakCount} Ngày</span>
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Điểm Ước Tính</span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">
                      {stats.avgBand > 0 ? `Band ${stats.avgBand}` : 'Chưa có'}
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Tổng bài đã viết</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalEssays}</span>
                    <span className="text-xs font-bold text-slate-400">T1: {stats.task1Count} | T2: {stats.task2Count}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Tổng từ vựng đã nạp</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">{vocabList.length}</span>
                    <Bookmark className="w-4 h-4 text-amber-500" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Đề bạn đã tải lên</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-purple-600">{userCustomTasks.length}</span>
                    <FileText className="w-4 h-4 text-purple-500" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Lỗi sai đã ghi nhận</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-red-600">{mistakes.length}</span>
                    <span className="text-[11px] text-slate-400">cần khắc phục</span>
                  </div>
                </div>
              </div>

              {/* Detailed 4-Criteria Radar / Progress Bars */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">Chi Tiết Năng Lực 4 Tiêu Chí Chấm IELTS</h4>
                    <p className="text-xs text-slate-500">Trung bình cộng điểm từ tất cả các bài viết được giám khảo Gemini chấm</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    Official Rubric
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* TR / TA */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Task Achievement / Response (TR/TA)</span>
                      <span className="font-black text-red-600 text-sm">{stats.avgTR > 0 ? stats.avgTR : '-'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.avgTR > 0 ? (Number(stats.avgTR) / 9) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">Khả năng trả lời đúng trọng tâm đề và phát triển luận điểm</span>
                  </div>

                  {/* CC */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Coherence & Cohesion (CC)</span>
                      <span className="font-black text-blue-600 text-sm">{stats.avgCC > 0 ? stats.avgCC : '-'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.avgCC > 0 ? (Number(stats.avgCC) / 9) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">Độ mạch lạc, liên kết giữa các câu và cấu trúc phân đoạn</span>
                  </div>

                  {/* LR */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Lexical Resource (LR)</span>
                      <span className="font-black text-amber-600 text-sm">{stats.avgLR > 0 ? stats.avgLR : '-'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.avgLR > 0 ? (Number(stats.avgLR) / 9) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">Vốn từ vựng học thuật C1/C2, collocations và tránh lặp từ</span>
                  </div>

                  {/* GRA */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Grammar Range & Accuracy (GRA)</span>
                      <span className="font-black text-emerald-600 text-sm">{stats.avgGRA > 0 ? stats.avgGRA : '-'}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.avgGRA > 0 ? (Number(stats.avgGRA) / 9) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 block">Độ đa dạng của câu ghép/phức và độ chuẩn xác ngữ pháp</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MY UPLOADED CUSTOM TASKS & COMMUNITY SHARING */}
          {/* ========================================================================= */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Kho Đề Bài & Tài Nguyên Bạn Đã Tải Lên</h3>
                  <p className="text-xs text-slate-500">Quản lý và bật/tắt quyền chia sẻ công khai cho cộng đồng luyện thi</p>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setResourceFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      resourceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả ({userCustomTasks.length})
                  </button>
                  <button
                    onClick={() => setResourceFilter('public')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      resourceFilter === 'public' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🌐 Công khai ({userCustomTasks.filter(t => t.isPublic).length})
                  </button>
                  <button
                    onClick={() => setResourceFilter('private')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      resourceFilter === 'private' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔒 Riêng tư ({userCustomTasks.filter(t => !t.isPublic).length})
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              {filteredCustomTasks.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Chưa có đề bài nào trong danh mục này</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Bạn có thể nạp tài liệu bằng AI Smart Ingest hoặc tự tạo đề mới để luyện tập và chia sẻ với cộng đồng.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCustomTasks.map((t) => (
                    <div 
                      key={t.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col justify-between space-y-3 transition-all group"
                    >
                      {/* Card Top: Badges & Visibility Switch */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            t.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            Task {t.taskNumber}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {t.type || 'Academic'}
                          </span>
                        </div>

                        {/* Visibility Status Badge & Toggle Button */}
                        <button
                          onClick={() => onTogglePublic?.(t.id, !t.isPublic)}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-2xs border ${
                            t.isPublic 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' 
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={t.isPublic ? "Đang chia sẻ công khai! Nhấn để chuyển về Riêng tư" : "Đang để riêng tư! Nhấn để chia sẻ công khai cho cộng đồng"}
                        >
                          {t.isPublic ? (
                            <>
                              <Globe className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Công Khai</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-slate-500" />
                              <span>Riêng Tư</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Card Middle: Title & Prompt Preview */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-1">
                          {t.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {t.prompt}
                        </p>
                      </div>

                      {/* Image Preview if Task 1 */}
                      {t.imageUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
                          <img 
                            src={t.imageUrl} 
                            alt="Task 1 attachment" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1">
                            <ImageIcon className="w-3 h-3 text-cyan-400" />
                            <span>Đính kèm hình ảnh Task 1</span>
                          </div>
                        </div>
                      )}

                      {/* Card Bottom: Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {t.timeLimit || 40} phút • {t.minWords || 250} từ
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              onSelectTask?.(t);
                              onClose();
                            }}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            <span>Làm Bài Ngay</span>
                          </button>

                          {onDeleteTask && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Bạn có chắc muốn xóa đề "${t.title}" khỏi tài khoản?`)) {
                                  onDeleteTask(t.id);
                                }
                              }}
                              className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                              title="Xóa đề này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ESSAYS & REVISIONS HISTORY */}
          {/* ========================================================================= */}
          {activeTab === 'submissions' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Lịch Sử Bài Viết & Chấm Điểm AI</h3>
                  <p className="text-xs text-slate-500">Tất cả bài viết đã nộp và các phiên bản viết lại Band 8.0+ Re-write</p>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                  {submissions.length} bài đã lưu
                </span>
              </div>

              {submissions.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <History className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Chưa có bài nộp nào</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Sau khi bạn hoàn thành bài luận và nhấn "Nộp Bài & Chấm Điểm AI", bài viết và nhận xét của giám khảo sẽ xuất hiện tại đây.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub, idx) => (
                    <div 
                      key={sub.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            sub.task?.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            Task {sub.task?.taskNumber || 2}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {sub.task?.title || 'IELTS Writing Essay'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {sub.essayText || 'Nội dung bài viết...'}
                        </p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{sub.date || 'Gần đây'}</span>
                          </span>
                          <span>•</span>
                          <span>{sub.stats?.wordCount || 0} từ</span>
                          <span>•</span>
                          <span>Thời gian: {sub.stats?.timeSpent || 'Không tính giờ'}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                        {sub.evaluation?.overallBand && (
                          <div className="text-center px-3 py-1.5 rounded-xl bg-red-50 border border-red-200">
                            <span className="text-[10px] text-red-600 block uppercase font-bold">Overall</span>
                            <span className="text-base font-black text-red-700">Band {sub.evaluation.overallBand}</span>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            onViewSubmission?.(sub);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center space-x-1 shadow-xs"
                        >
                          <span>Xem Nhận Xét AI</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ACCOUNT SETTINGS & LOGOUT */}
          {/* ========================================================================= */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b pb-3">Thông Tin Tài Khoản & Đồng Bộ Đám Mây</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Email đăng ký</span>
                    <strong className="text-slate-800 text-sm font-bold">{user?.email || 'Chưa đăng nhập'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Trạng thái đồng bộ</span>
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supabase Cloud Sync: Đang Bật</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">User ID (Mã định danh)</span>
                    <span className="font-mono text-slate-600 text-[11px] bg-slate-100 px-2 py-1 rounded block truncate">
                      {user?.id || 'anonymous-local'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Chính sách bảo mật</span>
                    <span className="text-slate-600">Row Level Security (RLS) bảo vệ 100% dữ liệu cá nhân</span>
                  </div>
                </div>
              </div>

              {/* Sign Out Area */}
              {user && (
                <div className="p-5 rounded-2xl bg-red-50/70 border border-red-200/80 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-red-900">Đăng Xuất Khỏi Tài Khoản</h4>
                    <p className="text-[11px] text-red-700">Dữ liệu trên máy của bạn sẽ được lưu an toàn trên Cloud cho lần đăng nhập sau.</p>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
