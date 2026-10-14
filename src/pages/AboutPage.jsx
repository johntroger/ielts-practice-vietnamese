import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  PenTool, 
  BookOpen, 
  Headphones, 
  Mic, 
  ShieldCheck, 
  Swords, 
  Award, 
  Zap, 
  Lock, 
  HelpCircle, 
  ChevronDown, 
  ExternalLink, 
  Sun, 
  Moon, 
  Globe, 
  Flame, 
  Layers, 
  Check, 
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useTranslation } from '../i18n/index.js';
import { getTheme, toggleTheme, subscribeTheme } from '../utils/themeService';
import { GITBOOK_FEATURES_BASE_URL } from '../core/featureRegistry';

export default function AboutPage({
  onStartPractice,
  onSelectSkill,
  onOpenArena,
  onOpenGitBook
}) {
  const { t, language, setLanguage } = useTranslation();
  const [currentTheme, setCurrentTheme] = useState(() => getTheme());
  const [activeSkillTab, setActiveSkillTab] = useState('writing');
  const [showUpgradedSentence, setShowUpgradedSentence] = useState(true);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);

  useEffect(() => {
    const unsub = subscribeTheme((theme) => {
      setCurrentTheme(theme);
    });
    return unsub;
  }, []);

  const handleToggleLang = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setCurrentTheme(getTheme());
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const skillsData = [
    {
      id: 'writing',
      name: t('about.writingTitle', 'Writing Workspace'),
      subtitle: t('about.writingSubtitle', 'Task 1 & Task 2 với AI chấm 4 tiêu chí giám khảo'),
      icon: PenTool,
      accent: 'emerald',
      features: [
        t('about.writingFeat1', 'Chấm điểm Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy'),
        t('about.writingFeat2', 'Bộ kiểm tra lập luận PEEL & Phát hiện luận điểm thiếu logic'),
        t('about.writingFeat3', 'Bộ nâng cấp từ vựng tại chỗ (Lexical Upgrader) từ Band 5.5 lên 7.5+')
      ],
      previewBadge: 'Task 2 • Discussion Essay',
      previewQuestion: 'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?',
      previewMetrics: [
        { label: 'TR', score: '7.5' },
        { label: 'CC', score: '7.0' },
        { label: 'LR', score: '8.0' },
        { label: 'GRA', score: '7.5' }
      ]
    },
    {
      id: 'reading',
      name: t('about.readingTitle', 'Reading Workspace'),
      subtitle: t('about.readingSubtitle', 'Mô phỏng thi máy chia đôi màn hình & Giải mã bẫy câu hỏi'),
      icon: BookOpen,
      accent: 'indigo',
      features: [
        t('about.readingFeat1', 'Chia đôi màn hình linh hoạt: Bài đọc bên trái, câu hỏi bên phải kèm highlight màu'),
        t('about.readingFeat2', 'Giải mã bẫy câu hỏi Distractor Trap Decoder (Paraphrase lừa, Half-Truth, Not Given)'),
        t('about.readingFeat3', 'Bộ tra từ điển nổi tức thì & lưu vào Sổ tay từ vựng 1-click')
      ],
      previewBadge: 'Passage 3 • Authentic Academic',
      previewQuestion: 'Do the following statements agree with the claims of the writer in Reading Passage 3? (True / False / Not Given)',
      previewMetrics: [
        { label: 'Score', score: '38/40' },
        { label: 'Band', score: '8.5' },
        { label: 'Trap', score: '100% Solved' }
      ]
    },
    {
      id: 'listening',
      name: t('about.listeningTitle', 'Listening Workspace'),
      subtitle: t('about.listeningSubtitle', 'Trình phát audio thông minh & Phân tích bẫy âm học'),
      icon: Headphones,
      accent: 'amber',
      features: [
        t('about.listeningFeat1', 'Phần thi chia đôi màn hình gọn gàng, khu vực câu hỏi rộng rãi không che lấp'),
        t('about.listeningFeat2', 'Bộ lọc bẫy âm học: Nối âm, bẫy tự sửa (Self-correction), đồng âm dị nghĩa'),
        t('about.listeningFeat3', 'Tra cứu audioscript đồng bộ với mốc thời gian bài nghe')
      ],
      previewBadge: 'Section 4 • Lecture Monologue',
      previewQuestion: 'Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.',
      previewMetrics: [
        { label: 'Score', score: '37/40' },
        { label: 'Band', score: '8.5' },
        { label: 'Pacing', score: 'Standard' }
      ]
    },
    {
      id: 'speaking',
      name: t('about.speakingTitle', 'Speaking Workspace'),
      subtitle: t('about.speakingSubtitle', 'Phòng thi ảo với AI Examiner & Thanh căn nhịp độ Part 2'),
      icon: Mic,
      accent: 'rose',
      features: [
        t('about.speakingFeat1', 'Mô phỏng phòng thi thật Part 1, 2, 3 với giọng đọc giám khảo bản xứ'),
        t('about.speakingFeat2', 'Thanh căn nhịp độ 2 phút (Part 2 Pacing Bar) giúp phân bổ ý hoàn hảo'),
        t('about.speakingFeat3', 'Báo cáo chi tiết phát âm, độ trôi chảy (Fluency) và đề xuất từ vựng Collocations')
      ],
      previewBadge: 'Part 2 Cue Card • Examiner AI',
      previewQuestion: 'Describe a memorable journey you made by public transport. You should say: where you went, what happened, and why it was memorable.',
      previewMetrics: [
        { label: 'Fluency', score: '7.5' },
        { label: 'Lexical', score: '8.0' },
        { label: 'Pronun', score: '7.5' }
      ]
    }
  ];

  const currentSkill = skillsData.find(s => s.id === activeSkillTab) || skillsData[0];

  const faqs = [
    {
      q: t('about.faq1Q', 'Trang web có hoàn toàn miễn phí không?'),
      a: t('about.faq1A', 'Có, toàn bộ bài tập, đề thi Cambridge, ngân hàng câu hỏi và công cụ chấm điểm bằng thuật toán chuyên sâu đều miễn phí trọn đời.')
    },
    {
      q: t('about.faq2Q', 'Dữ liệu bài làm của tôi được lưu trữ như thế nào?'),
      a: t('about.faq2A', 'Hệ thống áp dụng kiến trúc Local-First: dữ liệu lưu trực tiếp trong IndexedDB trên máy tính/điện thoại của bạn. Bạn cũng có thể đăng nhập để sao lưu đồng bộ đám mây qua Supabase.')
    },
    {
      q: t('about.faq3Q', 'Tôi có cần API Key của Gemini không?'),
      a: t('about.faq3A', 'Không bắt buộc. Website có sẵn công cụ chấm điểm thuật toán offline chuyên sâu. Nếu bạn muốn nhận phản hồi AI phân tích sâu hơn, bạn có thể nhập Gemini API Key miễn phí của mình vào mục Cài đặt.')
    },
    {
      q: t('about.faq4Q', 'Người mất gốc tiếng Anh có học được trên trang không?'),
      a: t('about.faq4A', 'Hoàn toàn phù hợp. Trang web có chế độ Luyện tập (Practice Mode) không giới hạn thời gian, có gợi ý dàn ý, thẻ lộ trình 30 ngày cho người mới và bài kiểm tra chẩn đoán trình độ.')
    }
  ];

  const handleQuizAnswer = (optionKey) => {
    if (quizAnswered) return;
    setQuizSelectedOption(optionKey);
    setQuizAnswered(true);
  };

  const isEn = language === 'en';

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => onStartPractice && onStartPractice()}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group min-w-0 shrink"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent truncate">
                  IELTS Studio
                </span>
                <span className="hidden sm:inline-block text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 uppercase shrink-0">
                  Local-First
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none truncate mt-0.5">
                {isEn ? 'Cambridge AI Assessment Engine' : 'Hệ thống luyện thi chuẩn Cambridge'}
              </p>
            </div>
          </div>

          {/* Quick Nav Anchor Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => scrollToSection('workspaces')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t('about.navWorkspaces', '4 Kỹ năng')}
            </button>
            <button 
              onClick={() => scrollToSection('academic')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t('about.navAcademic', 'Chuẩn Cambridge')}
            </button>
            <button 
              onClick={() => scrollToSection('arena')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1"
            >
              <Swords className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('about.navArena', 'Đấu trường Titans')}</span>
            </button>
            <button 
              onClick={() => scrollToSection('philosophy')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t('about.navPhilosophy', 'Triết lý 3 KHÔNG')}
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t('about.navFaq', 'FAQ')}
            </button>
          </nav>

          {/* Utility Actions (Lang, Theme, CTA) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={handleToggleLang}
              className="flex items-center space-x-1 px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title={isEn ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-bold text-[11px] sm:text-xs">{language === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-1.5 sm:p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              title={currentTheme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
              aria-label="Toggle dark mode"
            >
              {currentTheme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              )}
            </button>

            {/* Return to Practice Button - Clean, Non-wrapping, Space-saving */}
            <button
              onClick={() => onStartPractice && onStartPractice()}
              className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="hidden sm:inline">{t('about.ctaStart', 'Vào Phòng Luyện Thi')}</span>
              <span className="sm:hidden">{isEn ? 'Practice' : 'Luyện thi'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="overview" className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(0,0,0,0))] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/70 text-indigo-700 dark:text-indigo-300 text-[11px] sm:text-xs md:text-sm font-semibold mb-4 sm:mb-6 shadow-sm max-w-[95vw]">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 animate-pulse shrink-0" />
            <span className="truncate">{t('about.badge', 'NỀN TẢNG LUYỆN THI IELTS 4 KỸ NĂNG • 100% LOCAL-FIRST & MIỄN PHÍ')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2] mb-4 sm:mb-6">
            {isEn ? (
              <>
                Master IELTS with <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">Precision AI</span> & Authentic Cambridge Standards
              </>
            ) : (
              <>
                Luyện Thi IELTS Chuẩn <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">Khảo Thí Cambridge</span> Với AI & Local-First
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-10 px-1">
            {t('about.heroSubtitle', 'Hệ thống tự học toàn diện 4 kỹ năng Writing, Reading, Listening, Speaking. Tích hợp AI chấm thi chuyên sâu, giải mã bẫy đề thi, đấu trường tương tác 100 cấp độ và bảo mật dữ liệu tuyệt đối trên thiết bị của bạn.')}
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 mb-10 sm:mb-16">
            <button
              onClick={() => onStartPractice && onStartPractice()}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>{t('about.ctaStart', 'Vào Phòng Luyện Thi Ngay')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (onOpenArena) onOpenArena();
                else scrollToSection('arena');
              }}
              className="w-full sm:w-auto px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Swords className="w-4 h-4 text-amber-500" />
              <span>{t('about.ctaArena', 'Khám Phá Đấu Trường Arena')}</span>
            </button>
          </div>

          {/* 4 Proof Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                {t('about.metricSkills', '4 Kỹ Năng')}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('about.metricSkillsSub', 'Writing, Reading, Listening, Speaking chuẩn CDI')}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                {t('about.metricTests', '100+ Đề Cambridge')}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('about.metricTestsSub', 'Ngân hàng đề thi thật cập nhật liên tục')}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:border-amber-400 dark:hover:border-amber-600 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Swords className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                {t('about.metricLevels', '100 Cấp Độ Titans')}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('about.metricLevelsSub', 'Đấu trường phản xạ, đua rank người dùng thật')}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:border-cyan-400 dark:hover:border-cyan-600 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                {t('about.metricLocalFirst', '100% Local-First')}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('about.metricLocalFirstSub', 'Dữ liệu lưu an toàn trên máy, không quảng cáo')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE 4-SKILL WORKSPACE SHOWCASE */}
      <section id="workspaces" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('about.workspacesTitle', 'Bộ Tứ Không Gian Luyện Thi Chuyên Sâu')}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {t('about.workspacesDesc', 'Được thiết kế dựa trên giao diện thi máy tính chính thức (Computer-delivered IELTS), tối ưu không gian làm bài và loại bỏ tối đa xao nhãng.')}
          </p>

          {/* Skill Selector Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 max-w-md mx-auto">
            {skillsData.map((skill) => {
              const Icon = skill.icon;
              const isActive = activeSkillTab === skill.id;
              return (
                <button
                  key={skill.id}
                  onClick={() => setActiveSkillTab(skill.id)}
                  className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="capitalize">{skill.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Skill Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl">
          
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Workspace Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {currentSkill.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {currentSkill.subtitle}
              </p>
            </div>

            <ul className="space-y-3.5">
              {currentSkill.features.map((feat, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onSelectSkill && onSelectSkill(currentSkill.id)}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <span>{isEn ? `Practice ${currentSkill.id.toUpperCase()} Now` : `Luyện Ngay ${currentSkill.id.toUpperCase()}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Interactive Mockup Simulation */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-100 dark:bg-slate-950 p-5 sm:p-6 border border-slate-200 dark:border-slate-800/80 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-400 ml-2">cdi-workspace-preview.app</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {currentSkill.previewBadge}
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Authentic Task Prompt
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                "{currentSkill.previewQuestion}"
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {currentSkill.previewMetrics.map((met, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-400">{met.label}</div>
                  <div className="text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {met.score}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Cambridge Assessment Rubric Calibrated</span>
              </span>
              <span className="font-mono">Lat: 0ms • Offline Ready</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ACADEMIC RIGOR & CAMBRIDGE ALIGNMENT (BEFORE & AFTER) */}
      <section id="academic" className="py-16 md:py-24 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Rigorous Evaluation Standard
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {t('about.academicTitle', 'Tính Chuẩn Xác Học Thuật & Khung Chấm Điểm Cambridge')}
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              {t('about.academicSubtitle', 'Không chấm điểm ảo, không nhận xét chung chung. Mọi phản hồi đều đối chiếu với rubric khảo thí quốc tế.')}
            </p>
          </div>

          {/* Interactive Before & After Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  {isEn ? 'In-situ Lexical Upgrader Case Study' : 'Minh Họa Nâng Cấp Từ Vựng Tại Chỗ'}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowUpgradedSentence(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !showUpgradedSentence
                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('about.beforeLabel', 'Trước Khi Nâng Cấp (5.5)')}
                </button>
                <button
                  onClick={() => setShowUpgradedSentence(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    showUpgradedSentence
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('about.afterLabel', 'Sau Khi AI Nâng Cấp (7.5+)')}
                </button>
              </div>
            </div>

            {/* Display Sentence */}
            <div className="py-8">
              {!showUpgradedSentence ? (
                <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-2">
                    {t('about.beforeLabel', 'Band 5.5 - Nguyên bản người học')}
                  </span>
                  <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed">
                    "{t('about.beforeSample', 'Many people think that traffic jam is a very big problem in big cities because there are too many cars on the road.')}"
                  </p>
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-3 font-medium">
                    ⚠️ {t('about.beforeIssue', 'Lỗi lặp từ (big, big), cấu trúc câu đơn điệu, từ vựng thông tục thiếu tính học thuật.')}
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2">
                    {t('about.afterLabel', 'Band 7.5+ - AI Lexical Upgrade')}
                  </span>
                  <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 italic font-serif leading-relaxed font-medium">
                    "{t('about.afterSample', 'It is widely contended that severe traffic congestion poses a formidable challenge to modern metropolises, primarily exacerbated by the escalating volume of private vehicular transport.')}"
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-3 font-medium">
                    ✨ {t('about.afterHighlight', 'Sử dụng cấu trúc bị động khách quan, cụm collocations học thuật (severe traffic congestion, formidable challenge, metropolises).')}
                  </p>
                </div>
              )}
            </div>

            {/* 4 Cambridge Criteria Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="font-bold text-xs text-indigo-600 dark:text-indigo-400">1. Task Response</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Trả lời trực diện, lập luận PEEL trọn vẹn</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400">2. Coherence & Cohesion</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Mạch lạc tự nhiên, liên kết câu chặt chẽ</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="font-bold text-xs text-amber-600 dark:text-amber-400">3. Lexical Resource</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Từ vựng C1/C2, collocations chính xác</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="font-bold text-xs text-rose-600 dark:text-rose-400">4. Grammatical Range</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Đa dạng mệnh đề phụ, chính xác cấu trúc</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. GAMIFICATION HIGHLIGHT: ATLAS ENGLISH ARENA */}
      <section id="arena" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 border border-indigo-700/50 shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-4">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>LEVEL 100 ATLAS TITANS ARENA</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {t('about.arenaTitle', 'Đấu Trường Tri Thức: Atlas English Arena')}
            </h2>
            
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {t('about.arenaSubtitle', 'Học tập gây nghiện thông qua cơ chế Gamification đỉnh cao: 100 Cấp độ Titans, chuỗi Combo và Đua Top BXH người dùng thật.')}
            </p>
          </div>

          {/* Mini Interactive 10-Second Reflex Quiz */}
          <div className="relative z-10 mt-8 max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-4 h-4" />
                <span>{t('about.miniQuizTitle', 'Thử Thách Phản Xạ 10 Giây Ngay Tại Đây')}</span>
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/20 text-white">
                +50 XP
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-white mb-4">
              {t('about.miniQuizQuestion', 'Chọn từ đồng nghĩa chuẩn học thuật (C1/C2) cho cụm từ "A big difference":')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'A', text: t('about.miniQuizOptA', 'A massive gap'), isCorrect: false },
                { key: 'B', text: t('about.miniQuizOptB', 'A stark disparity'), isCorrect: true },
                { key: 'C', text: t('about.miniQuizOptC', 'A lot of unlike'), isCorrect: false },
                { key: 'D', text: t('about.miniQuizOptD', 'A great contrast'), isCorrect: false }
              ].map((opt) => {
                const isSelected = quizSelectedOption === opt.key;
                let btnStyle = 'bg-white/10 hover:bg-white/20 border-white/15 text-white';
                if (quizAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-300';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-600/80 border-rose-400 text-white';
                  } else {
                    btnStyle = 'bg-white/5 opacity-50 border-white/5 text-slate-300';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleQuizAnswer(opt.key)}
                    disabled={quizAnswered}
                    className={`p-3 rounded-xl border text-xs sm:text-sm text-left flex items-center space-x-2.5 transition-all ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-black/30 flex items-center justify-center font-bold text-xs shrink-0">
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Result Banner */}
            {quizAnswered && (
              <div className="mt-4 p-3.5 rounded-xl bg-white/15 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium">
                  {quizSelectedOption === 'B' ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-emerald-300">{t('about.miniQuizCorrect', 'Chính xác! "A stark disparity" là collocation C2 xuất sắc.')}</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-rose-300" />
                      <span className="text-rose-200">{t('about.miniQuizWrong', 'Chưa chính xác. Đáp án chuẩn C2 là "A stark disparity"!')}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => onOpenArena && onOpenArena()}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1 shrink-0 shadow-md"
                >
                  <span>{isEn ? 'Enter Full Arena' : 'Vào Đấu Trường Ngay'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onOpenArena && onOpenArena()}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg hover:scale-105 transition-all"
            >
              <Swords className="w-4 h-4" />
              <span>{t('about.ctaArena', 'Khám Phá Đấu Trường Arena')}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 6. OUR PHILOSOPHY: 3 PILLARS OF COMMITMENT */}
      <section id="philosophy" className="py-16 md:py-24 bg-slate-100/70 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Core Philosophy
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {t('about.philoTitle', 'Triết Lý 3 KHÔNG Của Chúng Tôi')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('about.philo1Title', '1. KHÔNG Thu Phí Ẩn')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.philo1Desc', 'Nền tảng được xây dựng phi lợi nhuận vì cộng đồng học sinh, sinh viên Việt Nam. Không khóa tính năng, không đòi gói Premium.')}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('about.philo2Title', '2. KHÔNG Xâm Phạm Dữ Liệu (Local-First)')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.philo2Desc', 'Bài viết, đoạn ghi âm và ghi chú được lưu an toàn trong IndexedDB của trình duyệt. Không ai xem được bài của bạn nếu bạn không chia sẻ.')}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('about.philo3Title', '3. KHÔNG Quảng Cáo & Không Rối Mắt')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.philo3Desc', 'Không gian tinh gọn tuyệt đối, tái hiện áp lực phòng thi thật để bạn hoàn toàn tập trung vào việc nâng cao band điểm.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            {t('about.faqTitle', 'Câu Hỏi Thường Gặp (FAQ)')}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION BANNER */}
      <section className="py-16 md:py-20 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-emerald-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {t('about.finalTitle', 'Sẵn Sàng Chinh Phục Mục Tiêu IELTS Của Bạn?')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            {t('about.finalSubtitle', 'Bắt đầu ngay hôm nay mà không tốn một đồng chi phí.')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartPractice && onStartPractice()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-indigo-900 bg-white hover:bg-slate-100 shadow-xl hover:scale-105 active:scale-95 transition-all text-base flex items-center justify-center space-x-2"
            >
              <span>{t('about.finalCta', 'Bắt Đầu Làm Bài Ngay')}</span>
              <ArrowRight className="w-4 h-4 text-indigo-900" />
            </button>
            <a
              href={GITBOOK_FEATURES_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-800/60 hover:bg-indigo-800 border border-white/20 transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <span>{t('about.docsLink', 'Xem Cẩm Nang GitBook')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>IELTS Studio Master • Local-First Learning</span>
          </div>
          <div>
            {t('about.authorCredit', 'Được phát triển với tâm huyết vì cộng đồng IELTS Việt Nam')}
          </div>
          <button
            onClick={() => onStartPractice && onStartPractice()}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            {t('about.backToPractice', 'Quay lại phòng luyện')}
          </button>
        </div>
      </footer>

    </div>
  );
}
