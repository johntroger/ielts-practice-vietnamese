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
  Mail,
  Target,
  Award
} from 'lucide-react';

export default function Navbar({
  currentTask,
  allTasks,
  onSelectTask,
  mode,
  setMode,
  streakCount = 3,
  targetBand = '6.5',
  onOpenOnboarding,
  onOpenDiagnostic,
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
  const [isProgressMenuOpen, setIsProgressMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const skills = [
    { id: 'writing', label: 'IELTS Writing', desc: 'Chấm điểm 4 tiêu chí & sửa lỗi', icon: PenTool, active: true },
    { id: 'reading', label: 'IELTS Reading', desc: 'Luyện đề 14 dạng & giải thích bằng chứng', icon: BookMarked, active: true },
    { id: 'listening', label: 'IELTS Listening', desc: 'Luyện đề 8 dạng, audio evidence & dictation', icon: Headphones, active: true },
    { id: 'speaking', label: 'IELTS Speaking', desc: 'Luyện nói 1-on-1 với AI Audio', icon: Mic, active: true },
  ];

  const currentSkillObj = skills.find(s => s.id === activeSkill) || skills[0];
  const CurrentSkillIcon = currentSkillObj.icon;

  const skillColorConfig = {
    writing: {
      btn: 'border-red-200 bg-red-50/80 hover:bg-red-100 text-red-700',
      icon: 'text-red-600',
      chevron: 'text-red-500',
      activeItem: 'bg-red-50 text-red-700',
      activeItemIcon: 'bg-red-100 text-red-700'
    },
    reading: {
      btn: 'border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700',
      icon: 'text-blue-600',
      chevron: 'text-blue-500',
      activeItem: 'bg-blue-50 text-blue-700',
      activeItemIcon: 'bg-blue-100 text-blue-700'
    },
    listening: {
      btn: 'border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700',
      icon: 'text-emerald-600',
      chevron: 'text-emerald-500',
      activeItem: 'bg-emerald-50 text-emerald-700',
      activeItemIcon: 'bg-emerald-100 text-emerald-700'
    },
    speaking: {
      btn: 'border-purple-200 bg-purple-50/80 hover:bg-purple-100 text-purple-700',
      icon: 'text-purple-600',
      chevron: 'text-purple-500',
      activeItem: 'bg-purple-50 text-purple-700',
      activeItemIcon: 'bg-purple-100 text-purple-700'
    }
  };
  const activeColor = skillColorConfig[activeSkill] || skillColorConfig.writing;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* ROW 1: Brand (Left) + Tools/Settings/Menu (Right) */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* 1. LEFT ZONE: Brand & Skills Switcher */}
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

            {/* Compact Skills Dropdown (Mobile / Tablet only - hidden on Desktop to avoid repetition) */}
            <div className="relative xl:hidden shrink-0">
              <button
                onClick={() => {
                  setIsSkillMenuOpen(!isSkillMenuOpen);
                  setIsPracticeMenuOpen(false);
                  setIsToolsMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs group cursor-pointer shrink-0 ${activeColor.btn}`}
                title="Chuyển đổi kỹ năng IELTS"
              >
                <CurrentSkillIcon className={`w-3.5 h-3.5 shrink-0 ${activeColor.icon}`} />
                <span className="font-bold sm:hidden">{currentSkillObj.label.replace('IELTS ', '')}</span>
                <span className="font-bold hidden sm:inline">{currentSkillObj.label}</span>
                <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-150 ${activeColor.chevron} ${isSkillMenuOpen ? 'rotate-180' : ''}`} />
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
                      const sColor = skillColorConfig[s.id] || skillColorConfig.writing;
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
                              ? sColor.activeItem 
                              : s.active 
                                ? 'hover:bg-slate-50 text-slate-700' 
                                : 'opacity-60 hover:bg-slate-50 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-1.5 rounded-lg ${isCurrent ? sColor.activeItemIcon : 'bg-slate-100 text-slate-600'}`}>
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

            {/* Direct 4-Skill Switcher Tabs on Large Desktop (Writing / Reading / Listening / Speaking) */}
            <div className="hidden xl:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 space-x-1 shrink-0">
              {skills.map(s => {
                const Icon = s.icon;
                const isCurrent = activeSkill === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectSkill?.(s.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? s.id === 'speaking'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : s.id === 'listening'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : s.id === 'reading'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.label.replace('IELTS ', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. RIGHT ZONE: Actions & Mobile Hamburger */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 pr-0.5">
            
            {/* Desktop Only Hero CTA: Thi Thử IELTS 60 Phút */}
            <button
              onClick={onOpenMockTest}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
              title="Vào Phòng Thi Thử IELTS Áp Lực Cao (60 Phút)"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Thi Thử 60p</span>
              <span className="hidden xl:inline px-1.5 py-0.2 rounded bg-white/20 text-[9px] font-black uppercase">Mock Vault</span>
            </button>

            {/* Desktop Only: 1. Luyện Tập Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => {
                  setIsPracticeMenuOpen(!isPracticeMenuOpen);
                  setIsToolsMenuOpen(false);
                  setIsProgressMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isPracticeMenuOpen ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
                title="Luyện tập & Đề thi"
              >
                <GraduationCap className="w-4 h-4 text-red-600" />
                <span>Luyện Tập</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isPracticeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPracticeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPracticeMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Đề Thi & Chế Độ Luyện
                    </div>
                    <button
                      onClick={() => { onOpenDiagnostic?.(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/80 text-left text-xs font-bold text-indigo-900 transition-colors cursor-pointer border border-indigo-200/60"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-2xs">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>Định Vị Band & Lộ Trình</span>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-600 text-[9px] text-white font-black">15p</span>
                        </div>
                        <div className="text-[10px] text-indigo-700/80 font-normal">Test 16 câu định vị Band & tạo kế hoạch 30 ngày</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenLibrary?.(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Thư Viện Đề Thi</div>
                        <div className="text-[10px] text-slate-400 font-normal">Đề Writing, Reading, Listening chuẩn Cambridge</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenGenerator(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Sinh Đề Mới Bằng AI</div>
                        <div className="text-[10px] text-slate-400 font-normal">Tạo đề thi mới bám sát xu hướng đề thật</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenDrills(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <Puzzle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Micro-Drills (Luyện Vi Mô)</div>
                        <div className="text-[10px] text-slate-400 font-normal">Luyện câu đơn, ghép ý, dictation, scanning</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenIngest(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                        <FileUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Nạp Đề & Bài Mẫu Thô</div>
                        <div className="text-[10px] text-slate-400 font-normal">Nhập văn bản đề bài hoặc bài mẫu bên ngoài</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenTheory(); setIsPracticeMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <BookMarked className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Cẩm Nang Chiến Thuật</div>
                        <div className="text-[10px] text-slate-400 font-normal">Chiến lược làm bài 4 kỹ năng chuẩn Cambridge</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Only: 2. Công Cụ Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => {
                  setIsToolsMenuOpen(!isToolsMenuOpen);
                  setIsPracticeMenuOpen(false);
                  setIsProgressMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isToolsMenuOpen ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
                title="Công cụ bổ trợ từ vựng & sửa lỗi"
              >
                <FolderKanban className="w-4 h-4 text-purple-600" />
                <span>Công Cụ</span>
                {mistakesCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsToolsMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Bộ Công Cụ Bổ Trợ
                    </div>
                    <button
                      onClick={() => { onOpenNotebook(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Sổ Tay Từ Vựng</div>
                        <div className="text-[10px] text-slate-400 font-normal">Lưu từ vựng C1-C2 & Collocations</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenMistakeLog(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">Sổ Tay Lỗi Sai Thường Gặp</div>
                          <div className="text-[10px] text-slate-400 font-normal">Bẫy ngữ pháp & lỗi diễn đạt</div>
                        </div>
                      </div>
                      {mistakesCount > 0 && (
                        <span className="text-[10px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.5 rounded-full">
                          {mistakesCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => { onOpenVocabGrammar(); setIsToolsMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <SpellCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Vocab, Grammar & Chính Tả</div>
                        <div className="text-[10px] text-slate-400 font-normal">Flashcards trau dồi từ vựng học thuật</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Desktop Only: 3. Tiến Độ Dropdown */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => {
                  setIsProgressMenuOpen(!isProgressMenuOpen);
                  setIsPracticeMenuOpen(false);
                  setIsToolsMenuOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  isProgressMenuOpen ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
                title="Tiến độ học tập & Trợ giúp"
              >
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Tiến Độ</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isProgressMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProgressMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProgressMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Báo Cáo & Lịch Sử
                    </div>
                    <button
                      onClick={() => { onOpenHistory(); setIsProgressMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                        <History className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Lịch Sử Nộp Bài & Điểm Số</div>
                        <div className="text-[10px] text-slate-400 font-normal">Xem lại các bài thi & feedback chi tiết</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenWeeklyReport(); setIsProgressMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Báo Cáo Tiến Độ Tuần</div>
                        <div className="text-[10px] text-slate-400 font-normal">Radar 4 tiêu chí & chẩn đoán học tập</div>
                      </div>
                    </button>
                    <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Hỗ Trợ & Hướng Dẫn
                    </div>
                    <button
                      onClick={() => { onOpenFeaturesGuide(); setIsProgressMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Khám Phá Tính Năng Web</div>
                        <div className="text-[10px] text-slate-400 font-normal">Hướng dẫn làm quen và tối ưu học tập</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { onOpenContact?.(); setIsProgressMenuOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Liên Hệ & Góp Ý</div>
                        <div className="text-[10px] text-slate-400 font-normal">Hỗ trợ kỹ thuật và góp ý phát triển</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* API Key Indicator */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer ${
                apiKey 
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' 
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
              }`}
              title={apiKey ? "Cài đặt hệ thống & Gemini API (Đã có Key)" : "Chưa cài đặt Gemini API Key! Bấm vào để nhập key"}
            >
              <Settings className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full shrink-0 ${apiKey ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
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
              className={`hidden lg:flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer ${
                user 
                  ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-800'
              }`}
              title={user ? `Xem trang cá nhân: ${user.email}` : "Đăng nhập hoặc đăng ký tài khoản"}
            >
              <User className={`w-3.5 h-3.5 shrink-0 ${user ? 'text-red-600' : 'text-slate-300'}`} />
              <span className="max-w-[90px] xl:max-w-[120px] truncate text-[11px]">
                {user ? (user.email.split('@')[0]) : 'Tài Khoản'}
              </span>
            </button>

            {/* Mobile & Tablet Hamburger Menu Button (44px touch target) */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
              aria-label="Mở menu đầy đủ"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

      </div>

      {/* MOBILE DRAWER */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-5 overflow-y-auto overscroll-contain flex flex-col justify-between pb-[max(2rem,env(safe-area-inset-bottom))]">
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
                  className="flex items-center space-x-2.5 text-left truncate flex-1 mr-2 min-h-[44px]"
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
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Hero CTA & Goal Target in Mobile Drawer */}
              <div className="space-y-2">
                <button
                  onClick={() => { onOpenMockTest(); setIsMobileDrawerOpen(false); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs shadow-md active:scale-95 transition-all min-h-[44px] cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <ShieldAlert className="w-5 h-5 text-amber-300 animate-pulse" />
                    <div className="text-left">
                      <div className="text-sm font-black">Phòng Thi Thử IELTS (60p)</div>
                      <div className="text-[10px] text-red-100 font-normal">Writing 60p, Reading 60p, Listening & Speaking</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                    Vào Thi
                  </span>
                </button>

                <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-50 via-red-50/30 to-amber-50/30 border border-slate-200 flex items-center justify-between min-h-[44px]">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Mục Tiêu: Band {targetBand}</div>
                      <div className="text-[10px] text-slate-500">Cá nhân hóa độ khó & chấm điểm AI</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onOpenOnboarding?.();
                      setIsMobileDrawerOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-700 text-xs font-bold hover:bg-red-50 shadow-2xs cursor-pointer"
                  >
                    Đổi
                  </button>
                </div>
              </div>

              {/* 2. Skill Switcher in Mobile Drawer */}
              <div>
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Chọn Kỹ Năng Luyện Thi
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map(s => {
                    const Icon = s.icon;
                    const isCurrent = activeSkill === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (s.active) {
                            onSelectSkill?.(s.id);
                            setIsMobileDrawerOpen(false);
                          } else {
                            alert(`Phân hệ ${s.label} đang được hoàn thiện và sẽ ra mắt trong bản cập nhật tới!`);
                          }
                        }}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                          isCurrent
                            ? 'bg-red-50 text-red-700 border-red-300 shadow-2xs'
                            : s.active
                            ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{s.label.replace('IELTS ', '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Luyện Tập & Đề Thi */}
              <div>
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Luyện Tập & Đề Thi
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { onOpenDiagnostic?.(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-left text-xs font-bold text-indigo-900 border border-indigo-200 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>Định Vị Band & Lộ Trình 30 Ngày</span>
                    </div>
                    <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-1.5 py-0.5 rounded">15 Phút</span>
                  </button>

                  <button
                    onClick={() => { onOpenLibrary?.(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Thư Viện Đề Thi Chuẩn Cambridge</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenGenerator(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sparkles className="w-4 h-4 text-red-600" />
                      <span>Sinh Đề Thi Mới Bằng AI</span>
                    </div>
                    <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">AI</span>
                  </button>

                  <button
                    onClick={() => { onOpenDrills(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Puzzle className="w-4 h-4 text-amber-600" />
                      <span>Micro-Drills (Luyện Kỹ Năng Vi Mô)</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenTheory(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-left text-xs font-bold text-amber-900 border border-amber-200/70 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <BookMarked className="w-4 h-4 text-amber-600" />
                      <span>Cẩm Nang Lý Thuyết & Chiến Thuật</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">4 Kỹ Năng</span>
                  </button>

                  <button
                    onClick={() => { onOpenIngest(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileUp className="w-4 h-4 text-purple-600" />
                      <span>Nạp Đề & Bài Mẫu Thô</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 4. Bộ Công Cụ Bổ Trợ */}
              <div>
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Bộ Công Cụ Bổ Trợ
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { onOpenNotebook(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Bookmark className="w-4 h-4 text-amber-600" />
                      <span>Sổ Tay Từ Vựng Cá Nhân</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenMistakeLog(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Sổ Tay Lỗi Sai Thường Gặp</span>
                    </div>
                    {mistakesCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded-full">
                        {mistakesCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { onOpenVocabGrammar(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <SpellCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>Vocab, Grammar & Chính Tả</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 5. Tiến Độ & Cài Đặt */}
              <div>
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Tiến Độ & Cài Đặt
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => { onOpenHistory(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <History className="w-4 h-4 text-blue-600" />
                      <span>Lịch Sử Bài Viết & Điểm Chấm</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenWeeklyReport(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Báo Cáo Tiến Độ Tuần</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenSettings(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-100 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span>Cài Đặt Hệ Thống & Gemini API Key</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </button>

                  <button
                    onClick={() => { onOpenFeaturesGuide(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-left text-xs font-bold text-red-700 border border-red-100 mt-2 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Compass className="w-4 h-4 text-red-600" />
                      <span>Khám Phá Tất Cả Tính Năng Web</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onOpenContact?.(); setIsMobileDrawerOpen(false); }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 border border-slate-200 mt-2 min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Mail className="w-4 h-4 text-rose-600" />
                      <span>Liên Hệ & Góp Ý</span>
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
