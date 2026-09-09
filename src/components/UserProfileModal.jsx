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
  ExternalLink,
  Settings,
  FolderKanban,
  HelpCircle,
  LayoutDashboard
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
  onOpenAuth,
  onOpenIngest,
  onOpenGenerator,
  onOpenLibrary,
  onExportAllData,
  onImportData
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'resources' | 'submissions' | 'vocab' | 'account'
  const [resourceFilter, setResourceFilter] = useState('all'); // 'all' | 'public' | 'private'

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        onImportData?.(parsed);
      } catch (err) {
        alert('File không hợp lệ hoặc bị lỗi cú pháp JSON.');
      }
    };
    reader.readAsText(file);
  };

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
    if (num >= 8.0) return { title: 'IELTS Scholar', color: 'bg-amber-500 text-slate-950 font-black', badge: 'Band 8.0+ Elite' };
    if (num >= 7.0) return { title: 'Academic Master', color: 'bg-purple-600 text-white font-black', badge: 'Band 7.0 - 7.5' };
    if (num >= 6.0) return { title: 'IELTS Challenger', color: 'bg-blue-600 text-white font-black', badge: 'Band 6.0 - 6.5' };
    return { title: 'IELTS Trainee', color: 'bg-slate-700 text-slate-200 font-bold', badge: 'Khởi đầu lộ trình' };
  };

  const rank = getScholarRank(stats.avgBand);

  // Nav Items Definitions
  const navItems = [
    { id: 'overview', label: 'Tổng Quan & Năng Lực', icon: LayoutDashboard, badge: stats.totalEssays > 0 ? `Band ${stats.avgBand}` : null },
    { id: 'resources', label: 'Kho Đề & Tài Nguyên', icon: FolderKanban, count: userCustomTasks.length },
    { id: 'submissions', label: 'Lịch Sử Bài Viết', icon: History, count: submissions.length },
    { id: 'vocab', label: 'Sổ Tay Từ Vựng & Lỗi', icon: Bookmark, count: vocabList.length },
    { id: 'account', label: 'Cài Đặt & Dữ Liệu', icon: Settings, status: user ? 'Đã đăng nhập' : 'Chưa đăng nhập' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* FRAME CHÍNH CỦA TRANG CÁ NHÂN (PORTAL FRAME) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[94vh] max-h-[880px] flex flex-col md:flex-row overflow-hidden">
        
        {/* ========================================================================= */}
        {/* 1. KHUNG NAVIGATION CỐ ĐỊNH BÊN TRÁI (SIDEBAR NAVIGATION) */}
        {/* ========================================================================= */}
        <aside className="w-full md:w-64 lg:w-72 bg-slate-900 text-white flex flex-col justify-between shrink-0 border-b md:border-b-0 md:border-r border-slate-800">
          
          {/* Top Brand & User Card in Sidebar */}
          <div>
            {/* Brand Title */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                  IELTS
                </div>
                <div>
                  <h2 className="text-xs font-black tracking-wider uppercase text-white leading-none">Student Portal</h2>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Trang Cá Nhân Học Viên</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Mini Card */}
            <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-lg shadow-md border border-white/20 shrink-0">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate flex-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-xs font-bold text-white truncate block">
                      {user?.email ? user.email.split('@')[0] : 'Khách vãng lai'}
                    </span>
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9.5px] uppercase mt-0.5 ${rank.color}`}>
                    {rank.badge}
                  </span>
                </div>
              </div>

              {!user && (
                <button
                  onClick={() => { onClose(); onOpenAuth?.(); }}
                  className="mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
                >
                  Đăng nhập tài khoản
                </button>
              )}
            </div>

            {/* INTEGRATED NAVIGATION MENU */}
            <nav className="p-2 sm:p-3 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Menu Quản Lý
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.count}
                      </span>
                    )}

                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">
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
                <span>Chuỗi rèn luyện:</span>
              </span>
              <strong className="text-amber-400 font-black">{streakCount} ngày</strong>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cloud Sync</span>
              </span>
              <span className="text-emerald-400 font-semibold">Bảo mật RLS</span>
            </div>

            {user && (
              <button
                onClick={onSignOut}
                className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white transition-colors text-[11px] font-bold flex items-center justify-center space-x-1.5"
              >
                <LogOut className="w-3 h-3" />
                <span>Đăng xuất</span>
              </button>
            )}
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* 2. VÙNG NỘI DUNG Ở GIỮA CỦA USER (MAIN CONTENT AREA) */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col bg-slate-50/60 overflow-hidden">
          
          {/* Header Bar của Vùng Nội Dung */}
          <div className="px-5 sm:px-8 py-3.5 sm:py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-semibold">
                <span>Student Portal</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700 capitalize font-bold">
                  {navItems.find(i => i.id === activeTab)?.label}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                {activeTab === 'overview' && 'Tổng Quan Năng Lực & Kết Quả Học Tập'}
                {activeTab === 'resources' && 'Kho Đề Bài & Tài Nguyên Bạn Đã Tải Lên'}
                {activeTab === 'submissions' && 'Lịch Sử Bài Làm & Nhận Xét Của Giám Khảo'}
                {activeTab === 'vocab' && 'Sổ Tay Từ Vựng & Sổ Tay Lỗi Sai Cá Nhân'}
                {activeTab === 'account' && 'Cài Đặt Tài Khoản & Quản Lý Dữ Liệu'}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                title="Quay lại phòng luyện thi"
              >
                <span>← Quay Lại Luyện Thi</span>
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                title="Đóng trang cá nhân"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Cuộn Được (Scrollable User Content) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
            
            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW & LEARNING FRAMEWORK */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* PRE-DESIGNED KPI CARDS GRID (KHUNG CHỈ SỐ CỐ ĐỊNH) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {/* Card 1: Estimated Band */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Điểm Ước Tính</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-red-600">
                        {stats.avgBand > 0 ? `Band ${stats.avgBand}` : 'Band --'}
                      </span>
                      <Award className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {stats.avgBand > 0 ? 'Dựa trên bài thi đã chấm' : 'Cần nộp 1 bài để tính'}
                    </span>
                  </div>

                  {/* Card 2: Total Essays */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Bài Đã Hoàn Thành</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalEssays}</span>
                      <PenTool className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Task 1: {stats.task1Count} • Task 2: {stats.task2Count}
                    </span>
                  </div>

                  {/* Card 3: Custom Tasks */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Đề Tự Nạp / AI Sinh</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-purple-600">{userCustomTasks.length}</span>
                      <FolderKanban className="w-5 h-5 text-purple-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {userCustomTasks.filter(t => t.isPublic).length} đề đang công khai
                    </span>
                  </div>

                  {/* Card 4: Vocab Vault */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Sổ Từ Vựng & Collocs</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600">{vocabList.length}</span>
                      <Bookmark className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {mistakes.length} lỗi sai đã lưu
                    </span>
                  </div>
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
                          Khởi Động Lộ Trình Luyện Thi Của Bạn
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Trang cá nhân đã được thiết lập sẵn khung theo dõi tiêu chuẩn Cambridge. Để lấp đầy điểm số vào <strong>Khung Phân Tích 4 Tiêu Chí</strong> bên dưới, bạn hãy chọn 1 đề bài và thực hiện bài viết đầu tiên:
                        </p>
                      </div>
                    </div>

                    {/* 3 Step Roadmap */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="p-3 bg-white/95 rounded-xl border border-red-100 flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">1</span>
                        <span className="text-xs font-semibold text-slate-800">Chọn 1 đề thi gợi ý bên dưới</span>
                      </div>
                      <div className="p-3 bg-white/95 rounded-xl border border-red-100 flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">2</span>
                        <span className="text-xs font-semibold text-slate-800">Nhấn "Nộp Bài & Chấm Điểm AI"</span>
                      </div>
                      <div className="p-3 bg-white/95 rounded-xl border border-red-100 flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center shrink-0">3</span>
                        <span className="text-xs font-semibold text-slate-800">Bảng phân tích sẽ tự động kích hoạt</span>
                      </div>
                    </div>

                    {/* Suggested Tasks */}
                    <div className="pt-2 border-t border-red-100">
                      <span className="text-xs font-bold text-slate-800 block mb-2">Đề bài gợi ý để bạn bắt đầu ngay:</span>
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
                            <span className="text-xs font-bold text-red-600 shrink-0">Viết ngay →</span>
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
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">Chi Tiết Năng Lực 4 Tiêu Chí Chấm IELTS (Rubric Framework)</h3>
                      <p className="text-xs text-slate-500">Thang đo đánh giá chi tiết theo chuẩn giám khảo Cambridge 0 - 9.0</p>
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
                          {stats.avgTR > 0 ? stats.avgTR : 'Chưa có'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600 rounded-full transition-all duration-500"
                          style={{ width: `${stats.avgTR > 0 ? (Number(stats.avgTR) / 9) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">Khả năng trả lời đúng trọng tâm đề và phát triển luận điểm</span>
                    </div>

                    {/* CC */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Coherence & Cohesion (CC)</span>
                        <span className="font-black text-blue-600 text-sm">
                          {stats.avgCC > 0 ? stats.avgCC : 'Chưa có'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${stats.avgCC > 0 ? (Number(stats.avgCC) / 9) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">Độ mạch lạc, liên kết câu từ và cấu trúc phân chia đoạn văn</span>
                    </div>

                    {/* LR */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Lexical Resource (LR)</span>
                        <span className="font-black text-amber-600 text-sm">
                          {stats.avgLR > 0 ? stats.avgLR : 'Chưa có'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-600 rounded-full transition-all duration-500"
                          style={{ width: `${stats.avgLR > 0 ? (Number(stats.avgLR) / 9) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 block">Vốn từ vựng học thuật C1/C2, collocations và tránh lặp từ</span>
                    </div>

                    {/* GRA */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Grammar Range & Accuracy (GRA)</span>
                        <span className="font-black text-emerald-600 text-sm">
                          {stats.avgGRA > 0 ? stats.avgGRA : 'Chưa có'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
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
            {/* TAB 2: MY UPLOADED CUSTOM TASKS & RESOURCES */}
            {/* ========================================================================= */}
            {activeTab === 'resources' && (
              <div className="space-y-5">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Quản Lý Đề Thi & Chế Độ Chia Sẻ</h3>
                    <p className="text-xs text-slate-500">Đề bài do bạn tự tạo hoặc nạp bằng AI, kèm quyền bật/tắt chia sẻ công khai</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
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

                    {onOpenIngest && (
                      <button
                        onClick={onOpenIngest}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Nạp Đề Mới Bằng AI</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tasks List or Empty Framework */}
                {filteredCustomTasks.length === 0 ? (
                  <div className="space-y-4">
                    <div className="p-6 sm:p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">Kho đề cá nhân của bạn hiện chưa có đề tự tạo</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                          Bạn có thể dùng AI để nạp nhanh đề từ tài liệu/sách Cambridge (có ảnh Task 1) hoặc sinh đề mới để luyện thi và chia sẻ cùng cộng đồng.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {onOpenIngest && (
                          <button
                            onClick={onOpenIngest}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Nạp Đề Bằng AI (Smart Ingest)</span>
                          </button>
                        )}
                        {onOpenGenerator && (
                          <button
                            onClick={onOpenGenerator}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
                          >
                            <span>➕ Sinh Đề Mới Bằng AI</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pre-installed System Tasks */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Đề Thi Tiêu Biểu Trong Hệ Thống (Có Thể Làm Ngay)
                        </span>
                        <span className="text-[11px] text-slate-400">15 đề chuẩn Cambridge</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(allTasks || []).slice(0, 4).map((t) => (
                          <div
                            key={t.id}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors"
                          >
                            <div className="truncate pr-2">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black uppercase mr-1.5 ${
                                t.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                              }`}>
                                Task {t.taskNumber}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                {t.title}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                onSelectTask?.(t);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 text-red-700 text-xs font-bold border border-slate-200 shrink-0 shadow-2xs transition-colors"
                            >
                              Viết ngay →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
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

                        {/* Title & Prompt Preview */}
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

                        {/* Actions */}
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
            {/* TAB 3: ESSAYS & SUBMISSIONS HISTORY */}
            {/* ========================================================================= */}
            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Lịch Sử Bài Viết & Chấm Điểm AI</h3>
                    <p className="text-xs text-slate-500">Tất cả bài viết đã nộp và các phiên bản viết lại Band 8.0+ Re-write</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                    {submissions.length} bài đã lưu
                  </span>
                </div>

                {submissions.length === 0 ? (
                  <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <History className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">Chưa có bài nộp nào</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Sau khi bạn hoàn thành bài luận và nhấn "Nộp Bài & Chấm Điểm AI", bài viết và nhận xét của giám khảo sẽ tự động lưu trữ tại đây.
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
            {/* TAB 4: VOCABULARY & MISTAKES NOTEBOOK */}
            {/* ========================================================================= */}
            {activeTab === 'vocab' && (
              <div className="space-y-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Sổ Tay Từ Vựng & Lỗi Sai Thường Gặp</h3>
                    <p className="text-xs text-slate-500">Kho từ vựng C1/C2 và các bẫy ngữ pháp bạn đã lưu trong quá trình luyện viết</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      {vocabList.length} Từ vựng
                    </span>
                    <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                      {mistakes.length} Lỗi sai
                    </span>
                  </div>
                </div>

                {/* Vocab Items Grid */}
                {vocabList.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                    <Bookmark className="w-8 h-8 mx-auto text-amber-400" />
                    <h4 className="text-sm font-bold text-slate-800">Sổ tay từ vựng hiện đang trống</h4>
                    <p className="text-xs text-slate-500">Trong lúc viết bài hoặc xem bài mẫu, bạn có thể bấm lưu bất kỳ từ vựng nào vào đây.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vocabList.map((item, i) => (
                      <div key={item.id || i} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-slate-900">{item.phrase}</strong>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold uppercase">{item.topic || 'General'}</span>
                        </div>
                        <p className="text-xs text-slate-600">{item.meaningVi}</p>
                        {item.example && (
                          <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">"{item.example}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: ACCOUNT & BACKUP SETTINGS */}
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

                {/* Data Backup & Migration Area */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Sao Lưu & Di Chuyển Dữ Liệu Học Tập (JSON)</h4>
                      <p className="text-xs text-slate-500">Giúp bạn chuyển toàn bộ bài làm, từ vựng và ghi chú từ thiết bị khác hoặc localhost sang đây</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {onExportAllData && (
                      <button
                        onClick={onExportAllData}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Xuất Tệp Dữ Liệu (.JSON)</span>
                      </button>
                    )}

                    {onImportData && (
                      <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-all shadow-2xs flex items-center space-x-1.5">
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Nhập Tệp Dữ Liệu (.JSON) Vào Tài Khoản</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
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

        </main>

      </div>
    </div>
  );
}
