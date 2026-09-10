import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  History, 
  Bookmark, 
  Settings, 
  ChevronDown, 
  PenTool,
  Headphones,
  BookMarked,
  Mic,
  FileText, 
  Clock, 
  Puzzle, 
  TrendingUp, 
  Flame, 
  ShieldAlert, 
  FileUp,
  SpellCheck2,
  FolderKanban,
  GraduationCap,
  User,
  Menu,
  X,
  Compass,
  Mail
} from 'lucide-react';

export default function Navbar({
  currentTask,
  allTasks,
  onSelectTask,
  mode,
  setMode,
  streakCount = 3,
  onOpenVocabGrammar,
  onOpenDrills,
  onOpenWeeklyReport,
  onOpenMockTest,
  onOpenIngest,
  onOpenGenerator,
  onOpenLibrary,
  onOpenNotebook,
  onOpenHistory,
  onOpenSettings,
  onOpenTheory,
  onOpenMistakeLog,
  onOpenFeaturesGuide,
  onOpenProfile,
  onOpenContact,
  activeSkill = 'writing',
  onSelectSkill,
  mistakesCount = 0,
  apiKey,
  user,
  onOpenAuth
}) {
  const [isSkillMenuOpen, setIsSkillMenuOpen] = useState(false);
  const [isPracticeMenuOpen, setIsPracticeMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const skills = [
    { id: 'writing', label: 'IELTS Writing', desc: 'Chấm điểm 4 tiêu chí & sửa lỗi', icon: PenTool, active: true },
    { id: 'reading', label: 'IELTS Reading', desc: 'Luyện đề 14 dạng & giải thích bằng chứng', icon: BookMarked, active: true },
    { id: 'listening', label: 'IELTS Listening', desc: 'Luyện đề 8 dạng, audio evidence & dictation', icon: Headphones, active: true },
    { id: 'speaking', label: 'IELTS Speaking', desc: 'Luyện nói 1-on-1 với AI Audio', icon: Mic, active: false, badge: 'Sắp ra mắt' },
  ];

  const currentSkillObj = skills.find(s => s.id === activeSkill) || skills[0];
  const CurrentSkillIcon = currentSkillObj.icon;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* ROW 1: Brand (Left) + Tools/Settings/Menu (Right) */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* 1. LEFT ZONE: Brand & Skills Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3.5">
            {/* Logo */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black tracking-wider shadow-sm text-xs sm:text-sm">
                IELTS
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-slate-900 text-sm leading-none block">STUDIO</span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider block mt-0.5">ACADEMIC AI</span>
              </div>
            </div>

            {/* Compact Skills Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSkillMenuOpen(!isSkillMenuOpen);
                  setIsPracticeMenuOpen(false);
                  setIsToolsMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100/80 text-red-700 text-xs font-bold transition-all shadow-2xs group"
                title="Chuyển đổi kỹ năng IELTS"
              >
                <CurrentSkillIcon className="w-3.5 h-3.5 text-red-600" />
                <span className="font-bold">{currentSkillObj.label}</span>
                <ChevronDown className={`w-3 h-3 text-red-500 transition-transform duration-150 ${isSkillMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSkillMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSkillMenuOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Chọn Kỹ Năng Luyện Thi
                    </div>
                    {skills.map(s => {
                      const Icon = s.icon;
                      const isCurrent = activeSkill === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            if (s.active) {
                              onSelectSkill?.(s.id);
                              setIsSkillMenuOpen(false);
                            } else {
                              alert(`Phân hệ ${s.label} đang được hoàn thiện và sẽ ra mắt trong bản cập nhật tới!`);
                            }
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                            isCurrent 
                              ? 'bg-red-50 text-red-700' 
                              : s.active 
                                ? 'hover:bg-slate-50 text-slate-700' 
                                : 'opacity-60 hover:bg-slate-50 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs">{s.label}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{s.desc}</div>
                            </div>
                          </div>
                          {!s.active && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium shrink-0">
                              {s.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. DESKTOP CENTER ZONE: Current Task Selector for Writing */}
          {activeSkill === 'writing' && (
            <div className="hidden md:flex items-center space-x-2">
              <button 
                onClick={onOpenLibrary}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left shadow-2xs group cursor-pointer"
                title="Nhấn để đổi đề thi hoặc xem danh sách bài"
              >
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                  currentTask.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  Task {currentTask.taskNumber}
                </span>
                <span className="text-xs font-semibold text-slate-800 max-w-[150px] lg:max-w-[220px] truncate">
                  {currentTask.title}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
              </button>

              {/* Streak Badge */}
              <div 
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold"
                title="Chuỗi ngày luyện tập liên tục!"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span>{streakCount}d</span>
              </div>
            </div>
          )}

          {/* 3. RIGHT ZONE: Actions & Mobile Hamburger */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Desktop Only: Phòng Luyện Bổ Trợ */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setIsPracticeMenuOpen(!isPracticeMenuOpen);
                  setIsToolsMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
                title="Các chế độ luyện tập"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Phòng Luyện</span>
                <ChevronDown className="w-3 h-3 text-emerald-600" />
              </button>

              {isPracticeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPracticeMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Phòng Thực Hành Kỹ Năng
                    </div>
                    <button
                      onClick={() => { onOpenVocabGrammar(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-emerald-50 text-left text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <SpellCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Vocab, Grammar & Chính Tả</div>
                        <div className="text-[10px] text-slate-400 font-normal">Flashcard C1-C2 & Bẫy lỗi thường gặp</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onOpenDrills(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-amber-50 text-left text-xs font-semibold text-slate-700 hover:text-amber-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <Puzzle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Micro-Drills (Luyện Bổ Trợ)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Tập viết câu đơn, ghép ý, từ nối</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onOpenMockTest(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-red-50 text-left text-xs font-semibold text-slate-700 hover:text-red-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold flex items-center space-x-1.5">
                          <span>Thi Thử 60 Phút Thực Chiến</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-black">Writing & Reading</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {activeSkill === 'reading' 
                            ? 'Full Test 3 Passages 40 câu chuẩn áp lực 60 phút' 
                            : 'Làm trọn vẹn Task 1 + Task 2 hoặc Full Reading 40 câu'}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => { onOpenWeeklyReport(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-blue-50 text-left text-xs font-semibold text-slate-700 hover:text-blue-900 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Báo Cáo & Chẩn Đoán Tuần</div>
                        <div className="text-[10px] text-slate-400 font-normal">Radar điểm 4 tiêu chí & tiến độ học</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Only: Công Cụ AI & Dữ Liệu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setIsToolsMenuOpen(!isToolsMenuOpen);
                  setIsPracticeMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all shadow-2xs"
                title="Công cụ AI & Quản lý bài"
              >
                <FolderKanban className="w-4 h-4 text-purple-600" />
                <span>Công Cụ</span>
                <ChevronDown className="w-3 h-3 text-purple-600" />
              </button>

              {isToolsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsToolsMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Công Cụ Sinh & Nạp
                    </div>
                    <button
                      onClick={() => { onOpenGenerator(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700"
                    >
                      <Sparkles className="w-4 h-4 text-red-600" />
                      <span>Sinh Đề Thi Mới Bằng AI</span>
                    </button>
                    <button
                      onClick={() => { onOpenIngest(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700"
                    >
                      <FileUp className="w-4 h-4 text-purple-600" />
                      <span>Nạp Đề & Bài Mẫu Thô</span>
                    </button>
                    
                    <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cá Nhân Hóa
                    </div>
                    <button
                      onClick={() => { 
                        onOpenProfile?.();
                        setIsToolsMenuOpen(false); 
                      }}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-left text-xs font-bold text-slate-900 transition-colors"
                    >
                      <User className="w-4 h-4 text-red-600" />
                      <span>Trang Cá Nhân & Thống Kê</span>
                    </button>
                    <button
                      onClick={() => { onOpenNotebook(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700"
                    >
                      <Bookmark className="w-4 h-4 text-amber-600" />
                      <span>Sổ Tay Từ Vựng Cá Nhân</span>
                    </button>
                    <button
                      onClick={() => { onOpenHistory(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700"
                    >
                      <History className="w-4 h-4 text-blue-600" />
                      <span>Lịch Sử Bài Viết & Điểm</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Khám Phá & Học Tập
                    </div>
                    <button
                      onClick={() => { onOpenFeaturesGuide(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-left text-xs font-bold text-red-700 hover:from-red-100 hover:to-rose-100 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-red-600" />
                      <span>Giới Thiệu Tính Năng Web</span>
                    </button>
                    <button
                      onClick={() => { onOpenContact?.(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-rose-600" />
                      <span>Liên Hệ & Góp Ý</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* API Key Indicator */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                apiKey 
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
              }`}
              title={apiKey ? "Cài đặt hệ thống & Gemini API (Đã có Key)" : "Chưa cài đặt Gemini API Key! Bấm vào để nhập key"}
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="hidden sm:inline text-[11px] font-semibold">
                  {apiKey ? 'API Key' : 'Nhập Key'}
                </span>
              </div>
            </button>

            {/* Desktop Only: User Profile Button */}
            <button
              onClick={() => {
                if (user) {
                  onOpenProfile?.();
                } else {
                  onOpenAuth();
                }
              }}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                user 
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800'
              }`}
              title={user ? `Xem trang cá nhân: ${user.email}` : "Đăng nhập hoặc đăng ký tài khoản"}
            >
              <User className={`w-3.5 h-3.5 ${user ? 'text-red-600' : 'text-slate-300'}`} />
              <span className="max-w-[100px] truncate text-[11px]">
                {user ? (user.email.split('@')[0]) : 'Tài Khoản'}
              </span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors shadow-2xs"
              aria-label="Mở menu đầy đủ"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* ROW 2: Mobile Only Task & Action Bar (Clean 2nd line, only in Writing) */}
        {activeSkill === 'writing' && (
          <div className="md:hidden py-2 border-t border-slate-100 flex items-center justify-between gap-2">
            {/* Mobile Task Selector - Expands flexibly */}
            <button 
              onClick={onOpenLibrary}
              className="flex-1 flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-left shadow-2xs min-w-0 cursor-pointer"
              title="Đổi đề bài hoặc chọn từ thư viện"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                  currentTask.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  Task {currentTask.taskNumber}
                </span>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {currentTask.title}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Mobile Streak & Theory Fast Buttons */}
            <button
              onClick={onOpenTheory}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold shrink-0 shadow-2xs cursor-pointer"
              title="Xem cẩm nang lý thuyết"
            >
              <span className="text-sm">📖</span>
              <span className="hidden xs:inline">Cẩm nang</span>
            </button>

            <div 
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shrink-0 shadow-2xs"
              title={`Chuỗi học tập liên tục: ${streakCount} ngày`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streakCount}d</span>
            </div>
          </div>
        )}

      </div>

      {/* MOBILE DRAWER */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* User Bar in Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <button 
                  onClick={() => {
                    if (user) {
                      onOpenProfile?.();
                    } else {
                      onOpenAuth();
                    }
                    setIsMobileDrawerOpen(false);
                  }}
                  className="flex items-center space-x-2.5 text-left truncate flex-1 mr-2"
                >
                  <div className={`p-2 rounded-lg ${user ? 'bg-red-100 text-red-700' : 'bg-slate-800 text-white'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {user ? user.email : 'Đăng nhập / Đăng ký tài khoản'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {user ? '👤 Xem trang cá nhân & thống kê' : 'Lưu bài & từ vựng trên mọi thiết bị'}
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            {/* Quick Actions Grid */}
            <div>
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Học & Luyện Thi
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenTheory(); setIsMobileDrawerOpen(false); }}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-red-50/70 border border-red-200 text-left text-xs font-bold text-red-900 hover:bg-red-100 transition-colors"
                >
                  <span className="text-base">📖</span>
                  <span>Cẩm Nang Lý Thuyết</span>
                </button>
                <button
                  onClick={() => { onOpenVocabGrammar(); setIsMobileDrawerOpen(false); }}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-left text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-colors"
                >
                  <SpellCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Vocab & Lỗi Sai</span>
                </button>
                <button
                  onClick={() => { onOpenDrills(); setIsMobileDrawerOpen(false); }}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-left text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                >
                  <Puzzle className="w-4 h-4 text-amber-600" />
                  <span>Micro-Drills</span>
                </button>
                <button
                  onClick={() => { onOpenMockTest(); setIsMobileDrawerOpen(false); }}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-left text-xs font-bold text-rose-900 hover:bg-rose-100 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Thi Thử 60 Phút (W & R)</span>
                </button>
              </div>
            </div>

            {/* Management & AI Tools */}
            <div>
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                Công Cụ AI & Dữ Liệu
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => { onOpenGenerator(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-red-600" />
                    <span>Sinh Đề Thi Mới Bằng AI</span>
                  </div>
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">AI</span>
                </button>

                <button
                  onClick={() => { onOpenNotebook(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center space-x-2.5">
                    <Bookmark className="w-4 h-4 text-amber-600" />
                    <span>Sổ Tay Từ Vựng Cá Nhân</span>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenHistory(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center space-x-2.5">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>Lịch Sử Bài Viết & Điểm Chấm</span>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenMistakeLog(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">⚠️</span>
                    <span>Sổ Tay Lỗi Sai Thường Gặp</span>
                  </div>
                  {mistakesCount > 0 && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                      {mistakesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { onOpenWeeklyReport(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center space-x-2.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Báo Cáo & Radar Điểm 4 Tiêu Chí</span>
                  </div>
                </button>

                <button
                  onClick={() => { onOpenSettings(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100"
                >
                  <div className="flex items-center space-x-2.5">
                    <Settings className="w-4 h-4 text-slate-600" />
                    <span>Cài Đặt Hệ Thống & Gemini API Key</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </button>

                {/* Mobile Features Guide Button */}
                <button
                  onClick={() => { onOpenFeaturesGuide(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-left text-xs font-bold shadow-md active:scale-95 transition-all mt-2"
                >
                  <div className="flex items-center space-x-2.5">
                    <Compass className="w-4 h-4 text-white" />
                    <span>Khám Phá Tất Cả Tính Năng Web</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-extrabold">
                    Hướng Dẫn
                  </span>
                </button>

                {/* Mobile Contact Button */}
                <button
                  onClick={() => { onOpenContact?.(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-200 mt-2"
                >
                  <div className="flex items-center space-x-2.5">
                    <Mail className="w-4 h-4 text-rose-600" />
                    <span>Liên Hệ & Góp Ý (Mr. Tung Tran)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Hỗ trợ 24/7</span>
                </button>
              </div>
            </div>

            </div>
          </div>
        </div>
      )}

    </header>
  );
}
