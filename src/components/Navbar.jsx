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
  User
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
  apiKey,
  user,
  onOpenAuth
}) {
  const [activeSkill, setActiveSkill] = useState('writing');
  const [isSkillMenuOpen, setIsSkillMenuOpen] = useState(false);
  const [isPracticeMenuOpen, setIsPracticeMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const skills = [
    { id: 'writing', label: 'IELTS Writing', desc: 'Chấm điểm 4 tiêu chí & sửa lỗi', icon: PenTool, active: true },
    { id: 'reading', label: 'IELTS Reading', desc: 'Luyện đề & giải thích từ khóa', icon: BookMarked, active: false, badge: 'Sắp ra mắt' },
    { id: 'listening', label: 'IELTS Listening', desc: 'Nghe chép chính tả & Mock test', icon: Headphones, active: false, badge: 'Sắp ra mắt' },
    { id: 'speaking', label: 'IELTS Speaking', desc: 'Luyện nói 1-on-1 với AI Audio', icon: Mic, active: false, badge: 'Sắp ra mắt' },
  ];

  const currentSkillObj = skills.find(s => s.id === activeSkill) || skills[0];
  const CurrentSkillIcon = currentSkillObj.icon;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* 1. LEFT ZONE: Brand & Compact Skills Dropdown */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Logo */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black tracking-wider shadow-sm text-sm">
                IELTS
              </div>
              <div className="hidden lg:block">
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
                className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100/80 text-red-700 text-xs font-bold transition-all shadow-2xs group"
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
                              setActiveSkill(s.id);
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

          {/* 2. CENTER ZONE: Current Task & Mode Selection */}
          <div className="flex items-center space-x-2">
            {/* Task Selector Dropdown Trigger */}
            <button 
              onClick={onOpenLibrary}
              className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left shadow-2xs group"
              title="Nhấn để đổi đề thi hoặc xem danh sách bài"
            >
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                currentTask.taskNumber === 1 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                Task {currentTask.taskNumber}
              </span>
              <span className="text-xs font-semibold text-slate-800 max-w-[100px] sm:max-w-[150px] md:max-w-[200px] truncate">
                {currentTask.title}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </button>

            {/* Streak Badge */}
            <div 
              className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold"
              title="Chuỗi ngày luyện tập liên tục!"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{streakCount}d</span>
            </div>
          </div>

          {/* 3. RIGHT ZONE: Grouped Action Dropdowns & Settings */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Group 1: Phòng Luyện Bổ Trợ (Dropdown Popover) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPracticeMenuOpen(!isPracticeMenuOpen);
                  setIsToolsMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
                title="Các chế độ luyện tập"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline">Phòng Luyện</span>
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
                        <div className="font-bold">Thi Thử 60 Phút Thực Chiến</div>
                        <div className="text-[10px] text-slate-400 font-normal">Làm trọn vẹn Task 1 + Task 2 áp lực thời gian</div>
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

            {/* Group 2: Công Cụ AI & Dữ Liệu (Dropdown) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsToolsMenuOpen(!isToolsMenuOpen);
                  setIsPracticeMenuOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all shadow-2xs"
                title="Công cụ AI & Quản lý bài"
              >
                <FolderKanban className="w-4 h-4 text-purple-600" />
                <span className="hidden md:inline">Công Cụ</span>
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
                      Kho Dữ Liệu
                    </div>
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
                  </div>
                </>
              )}
            </div>

            {/* Group 3: Settings & API Key Pill */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                apiKey 
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
              }`}
              title={apiKey ? "Cài đặt hệ thống & Gemini API (Đã có Key)" : "Chưa cài đặt Gemini API Key! Bấm vào để nhập key"}
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="hidden sm:inline text-[11px] font-semibold">
                  {apiKey ? 'API Key' : 'Nhập Key'}
                </span>
              </div>
            </button>

            {/* Group 4: User Profile / Auth Button */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs ${
                user 
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800'
              }`}
              title={user ? `Đã đăng nhập: ${user.email}` : "Đăng nhập hoặc đăng ký tài khoản"}
            >
              <User className={`w-3.5 h-3.5 ${user ? 'text-red-600' : 'text-slate-300'}`} />
              <span className="max-w-[100px] truncate text-[11px]">
                {user ? user.email.split('@')[0] : 'Tài Khoản'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
