import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BookMarked, 
  Clock, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Highlighter, 
  FileText, 
  HelpCircle,
  Maximize2,
  Minimize2,
  BookOpen,
  ArrowRight,
  Split,
  Eye,
  Award,
  Play,
  Pause,
  RotateCcw,
  BarChart2,
  AlertTriangle,
  Globe,
  Lock,
  ChevronDown,
  SlidersHorizontal,
  Shield,
  GraduationCap
} from 'lucide-react';
import { INITIAL_READING_TESTS } from '../../data/readingTasks';
import { useReadingExam } from '../../hooks/useReadingExam';
import { useReadingExamTimer } from '../../hooks/useReadingExamTimer';
import { usePassageEvidence } from '../../hooks/usePassageEvidence';
import PassagePane from './PassagePane';
import QuestionPane from './QuestionPane';
import QuestionPaletteBar from './QuestionPaletteBar';
import ReadingResultModal from './ReadingResultModal';
import ReadingGeneratorModal from './ReadingGeneratorModal';
import ReadingIngestModal from './ReadingIngestModal';
import ReadingLibraryModal from './ReadingLibraryModal';
import { 
  clampSplitWidth, 
  CDI_CONTRAST_THEMES, 
  getContrastThemeStyles, 
  getCdiTimerStatus 
} from '../../utils/cdiExamSimulator';

export default function ReadingWorkspace({
  apiKey,
  model = 'gemini-2.5-flash',
  onOpenSettings,
  onOpenTheory,
  user,
  onSaveToVocabNotebook,
  onReadingSubmitted,
  initialTestId,
  initialExamMode,
  openGeneratorTrigger,
  openIngestTrigger,
  masteredIds = [],
  onToggleMastered
}) {
  const [allReadingTests, setAllReadingTests] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_reading_custom_tests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...INITIAL_READING_TESTS, ...parsed];
        }
      }
    } catch (e) {}
    return INITIAL_READING_TESTS;
  });

  const [currentTestId, setCurrentTestId] = useState(() => initialTestId || INITIAL_READING_TESTS[0].id);
  const currentTest = useMemo(() => {
    return allReadingTests.find(t => t.id === currentTestId) || allReadingTests[0];
  }, [allReadingTests, currentTestId]);

  const [selectedPassageNum, setSelectedPassageNum] = useState(1);
  const [examMode, setExamMode] = useState(() => initialExamMode || 'practice'); // 'exam' | 'practice'
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [readingTheme, setReadingTheme] = useState(() => {
    try {
      return localStorage.getItem('ielts_reading_theme') || 'standard';
    } catch (e) {
      return 'standard';
    }
  });

  const handleThemeChange = (newTheme) => {
    setReadingTheme(newTheme);
    try {
      localStorage.setItem('ielts_reading_theme', newTheme);
    } catch (e) {}
  };

  // Sync when initialTestId or initialExamMode is updated externally (e.g. from MockTestModal)
  useEffect(() => {
    if (initialTestId) {
      try {
        const saved = localStorage.getItem('ielts_reading_custom_tests');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setAllReadingTests([...INITIAL_READING_TESTS, ...parsed]);
          }
        }
      } catch (e) {}
      setCurrentTestId(initialTestId);
      setSelectedPassageNum(1);
    }
    if (initialExamMode) {
      setExamMode(initialExamMode);
    }
  }, [initialTestId, initialExamMode]);
  const [mobileTab, setMobileTab] = useState('passage'); // 'passage' | 'questions' (for mobile)
  const [fontSize, setFontSize] = useState('base');
  
  // Split pane drag width (percentage for left pane)
  const [splitWidth, setSplitWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Computer-Delivered IELTS (CDI) Simulation states
  const [cdiFullscreen, setCdiFullscreen] = useState(false);
  const [cdiTheme, setCdiTheme] = useState('standard'); // 'standard' | 'black-on-white' | 'white-on-black' | 'yellow-on-black'

  // Explanation and Modals states
  const [showExplanationFor, setShowExplanationFor] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // External open triggers (e.g. from global Navbar)
  useEffect(() => {
    if (openGeneratorTrigger) {
      setIsGeneratorOpen(true);
    }
  }, [openGeneratorTrigger]);

  useEffect(() => {
    if (openIngestTrigger) {
      setIsIngestOpen(true);
    }
  }, [openIngestTrigger]);

  // Callback when a new passage is generated or ingested
  const handleAddCustomPassage = (newPassage, source = 'generated', isPublic = null, extraMeta = {}) => {
    const targetPNum = newPassage.passageNumber || extraMeta.passageNum || 1;
    const cleanTitle = (newPassage.title || '').replace(/^(✨|📰)\s*/, '').trim() || `Bài Đọc IELTS Passage ${targetPNum}`;
    
    // Count existing AI / Ingest tests to generate sequence #01, #02...
    const countSameType = allReadingTests.filter(t => 
      source === 'ingest' ? (t.description?.includes('trích xuất từ bài báo') || t.title?.includes('📰')) : (!t.description?.includes('trích xuất từ bài báo') && t.isCustom)
    ).length + 1;
    const seqStr = `#${String(countSameType).padStart(2, '0')}`;

    let standardizedTitle = '';
    if (source === 'ingest') {
      standardizedTitle = `📰 [Báo chí - P${targetPNum}] ${seqStr}: ${cleanTitle}`;
    } else {
      const topicLabel = extraMeta.topicEn ? `${extraMeta.topicEn}: ` : '';
      standardizedTitle = `✨ [AI - P${targetPNum}] ${seqStr} ${topicLabel}${cleanTitle}`;
    }

    const finalIsPublic = isPublic !== null ? Boolean(isPublic) : true;

    const newTest = {
      id: `custom-test-${Date.now()}`,
      title: standardizedTitle,
      description: `Đề thi Passage ${targetPNum} ${source === 'ingest' ? 'trích xuất từ bài báo' : 'sinh bởi Gemini AI'} theo chuẩn Cambridge Academic.`,
      totalQuestions: newPassage.questionGroups?.reduce((acc, g) => acc + (g.questions?.length || 0), 0) || 13,
      timeLimitMinutes: 20,
      isCustom: true,
      isPublic: finalIsPublic,
      creatorEmail: user?.email || 'Thành viên',
      passages: [
        {
          ...newPassage,
          passageNumber: targetPNum
        }
      ]
    };

    setAllReadingTests(prev => {
      const updated = [newTest, ...prev];
      try {
        const customOnly = updated.filter(t => t.id.startsWith('custom-test-'));
        localStorage.setItem('ielts_reading_custom_tests', JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });

    setCurrentTestId(newTest.id);
    setSelectedPassageNum(targetPNum);
    alert(`Đã nạp thành công bài đọc mới: "${newTest.title}" (${isPublic ? '🌐 Chia sẻ cộng đồng' : '🔒 Lưu riêng tư'})! Bạn có thể bắt đầu làm bài ngay.`);
  };

  // Delete a custom reading test
  const handleDeleteReadingTest = (testId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đọc này khỏi danh sách?')) return;
    setAllReadingTests(prev => {
      const updated = prev.filter(t => t.id !== testId);
      try {
        const customOnly = updated.filter(t => t.isCustom || t.id.startsWith('custom-test-'));
        localStorage.setItem('ielts_reading_custom_tests', JSON.stringify(customOnly));
      } catch (e) {}
      if (currentTestId === testId) {
        if (updated.length > 0) {
          setCurrentTestId(updated[0].id);
          setSelectedPassageNum(updated[0].passages[0]?.passageNumber || 1);
        }
      }
      return updated;
    });
  };

  // Callback when a full 3-passages test is created from ReadingLibraryModal
  const handleCreateFullTest = (newFullTest) => {
    setAllReadingTests(prev => {
      const updated = [newFullTest, ...prev];
      try {
        const customOnly = updated.filter(t => t.id.startsWith('custom-test-'));
        localStorage.setItem('ielts_reading_custom_tests', JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });

    setCurrentTestId(newFullTest.id);
    setSelectedPassageNum(1);
    alert(`Đã tạo thành công bộ đề thi 3 Passages: "${newFullTest.title}"! Bạn có thể bắt đầu thi ngay.`);
  };

  // Real-time synchronization across browser tabs for Reading
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ielts_reading_custom_tests') {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setAllReadingTests(() => {
              const map = new Map();
              [...INITIAL_READING_TESTS, ...updated].forEach(t => { if (t && t.id) map.set(t.id, t); });
              return Array.from(map.values());
            });
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Toggle publicity for a custom reading test
  const handleToggleReadingPublic = (testId) => {
    setAllReadingTests(prev => {
      const updated = prev.map(t => {
        if (t.id === testId) {
          const nextPub = !t.isPublic;
          return { ...t, isPublic: nextPub };
        }
        return t;
      });
      try {
        const customOnly = updated.filter(t => t.id.startsWith('custom-test-'));
        localStorage.setItem('ielts_reading_custom_tests', JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });
  };

  // Active Passage object
  const activePassage = useMemo(() => {
    return currentTest?.passages.find(p => p.passageNumber === selectedPassageNum) || currentTest?.passages[0];
  }, [currentTest, selectedPassageNum]);

  // Flatten all questions for palette checks and exam hook
  const allQuestions = useMemo(() => {
    if (!currentTest?.passages) return [];
    const list = [];
    currentTest.passages.forEach(p => {
      p.questionGroups.forEach(g => {
        g.questions.forEach(q => {
          list.push({ ...q, passageNumber: p.passageNumber, type: g.type });
        });
      });
    });
    return list;
  }, [currentTest]);

  // useReadingExam Hook
  const {
    userAnswers,
    flaggedQuestions,
    timeRemaining,
    isRunning,
    isSubmitted,
    submittedAt,
    bandResult,
    toggleTimer,
    handleAnswerChange,
    handleToggleFlag,
    handleSubmitExam: submitExamHook,
    handleResetExam: resetExamHook,
    setIsRunning
  } = useReadingExam({
    testId: currentTest.id,
    totalTimeMinutes: currentTest.timeLimitMinutes || 60,
    questionsData: allQuestions,
    testData: currentTest
  });

  // Automatically start timer in exam mode
  useEffect(() => {
    if (examMode === 'exam' && !isSubmitted && !isRunning) {
      setIsRunning(true);
    }
  }, [examMode, isSubmitted, isRunning, setIsRunning]);

  // Auto-open modal on submission
  const handleSubmitExam = () => {
    submitExamHook();
    setIsResultModalOpen(true);
    
    // Save to reading history
    setTimeout(() => {
      if (bandResult) {
        const record = {
          id: `reading-sub-${Date.now()}`,
          testId: currentTest.id,
          testTitle: currentTest.title,
          band: bandResult.band,
          correctCount: bandResult.correctCount,
          totalQuestions: bandResult.totalQuestions,
          accuracyPercent: bandResult.accuracyPercent,
          timeSpentSeconds: bandResult.timeSpentSeconds,
          submittedAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          passageStats: bandResult.passageStats
        };
        if (onReadingSubmitted) onReadingSubmitted(record);
      }
    }, 200);
  };

  const handleResetExam = () => {
    resetExamHook();
    setIsResultModalOpen(false);
    setShowExplanationFor(null);
    setActiveEvidencePara(null);
  };

  // Handle Dragging Splitter (Mouse & Touch for Tablets/iPads)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitWidth(clampSplitWidth(newWidth, 25, 75));
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !containerRef.current || !e.touches || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      setSplitWidth(clampSplitWidth(newWidth, 25, 75));
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Dedicated Custom Hook for Reading Exam Timer & CDI Alerts (Clean Architecture)
  const {
    formatTimer,
    activeCdiNotice,
    setActiveCdiNotice,
    isLowTime,
    isCriticalTime
  } = useReadingExamTimer({
    timeRemaining,
    isRunning,
    isSubmitted
  });

  // ESC key to exit CDI Fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && cdiFullscreen) {
        setCdiFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cdiFullscreen]);

  // Dedicated Custom Hook for Paragraph Evidence Locating & Question Jumping (Clean Architecture)
  const {
    activeEvidencePara,
    setActiveEvidencePara,
    locateEvidence: handleLocateEvidence,
    jumpToQuestion: handleJumpToQuestion
  } = usePassageEvidence({
    onSwitchToPassage: () => setMobileTab('passage'),
    onSwitchToQuestions: () => setMobileTab('questions')
  });

  // Suggested time per passage: Passage 1 (17m), Passage 2 (20m), Passage 3 (23m)
  const passageTimeGuide = {
    1: 'Gợi ý: ≤ 17 phút',
    2: 'Gợi ý: ≤ 20 phút',
    3: 'Gợi ý: ≤ 23 phút'
  };

  const handleToggleExamMode = () => {
    if (examMode === 'exam' && !isSubmitted) {
      if (!window.confirm('Bạn đang ở Chế độ Thi Thử (Strict Exam). Nếu chuyển về Luyện Tập tự do, chế độ kiểm soát thời gian thi thật sẽ kết thúc. Bạn có chắc chắn muốn chuyển sang chế độ Luyện tập?')) {
        return;
      }
    }
    setExamMode(prev => prev === 'exam' ? 'practice' : 'exam');
  };

  const handleOpenLibrary = () => {
    if (examMode === 'exam' && !isSubmitted && Object.keys(userAnswers).length > 0) {
      if (!window.confirm('Bạn đang làm bài thi thử. Nếu đổi đề thi khác lúc này, tiến độ bài làm hiện tại sẽ bị hủy. Bạn có chắc chắn muốn mở Kho Đề?')) {
        return;
      }
    }
    setIsLibraryOpen(true);
  };

  const themeStyles = getContrastThemeStyles(cdiTheme);

  return (
    <div className={`flex-1 flex flex-col overflow-hidden h-full transition-colors ${
      cdiFullscreen 
        ? `fixed inset-0 z-50 h-screen w-screen overflow-hidden ${themeStyles.containerClass}` 
        : 'bg-slate-50'
    }`}>
      {/* CDI Official Exam Warning Notice Bar (10m / 5m alerts) */}
      {activeCdiNotice && (
        <div className={`px-4 py-2 flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-2 duration-200 shrink-0 ${
          activeCdiNotice.severity === 'critical'
            ? 'bg-red-600 text-white'
            : activeCdiNotice.severity === 'urgent'
            ? 'bg-amber-500 text-white'
            : 'bg-indigo-600 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{activeCdiNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveCdiNotice(null)}
            className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-bold cursor-pointer"
          >
            Đã hiểu ✕
          </button>
        </div>
      )}

      {/* 1. Reading Sub-header Toolbar (Clean, Ergonomic & Fully Responsive) */}
      <div className={`px-2.5 sm:px-4 lg:px-6 py-2 shadow-2xs shrink-0 w-full transition-colors relative z-20 ${
        cdiFullscreen ? themeStyles.headerClass : 'bg-white border-b border-slate-200'
      }`}>
        {/* MOBILE & TABLET LAYOUT (< 1024px): Structured 2-row layout with zero collisions */}
        <div className="flex flex-col gap-2 lg:hidden">
          {/* Mobile Row 1: Tab switcher (Left) + Test Chip & Passage Tabs (Right) */}
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            {/* Mobile Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold shrink-0 border border-slate-200">
              <button
                type="button"
                onClick={() => setMobileTab('passage')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  mobileTab === 'passage' 
                    ? 'bg-blue-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📖 Bài Đọc
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('questions')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  mobileTab === 'questions' 
                    ? 'bg-blue-600 text-white shadow-xs font-black' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📝 Câu Hỏi
              </button>
            </div>

            {/* Test Chip & Passage Pills */}
            <div className="flex items-center space-x-1 min-w-0 shrink">
              {/* Test Chip */}
              <button
                type="button"
                onClick={handleOpenLibrary}
                className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 font-bold text-xs border border-indigo-200 transition-colors shadow-2xs cursor-pointer max-w-[120px] sm:max-w-[190px] min-w-0 truncate"
                title={`Đề đang làm: ${currentTest.title} (Bấm để mở Kho Đề - ${allReadingTests.length} đề)`}
              >
                <BookOpen className="w-3 h-3 text-indigo-600 shrink-0" />
                <span className="truncate">{currentTest.title}</span>
                <span className="text-[10px] text-indigo-500 font-semibold shrink-0">▾</span>
              </button>

              {/* Mastered Button (Mobile) */}
              {onToggleMastered && (
                <button
                  type="button"
                  onClick={() => onToggleMastered(currentTest.id)}
                  className={`p-1 rounded-xl border text-xs font-bold transition-all flex items-center shrink-0 cursor-pointer shadow-2xs ${
                    masteredIds.includes(currentTest.id)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                  }`}
                  title={masteredIds.includes(currentTest.id) ? 'Đã thuộc! Bấm để bỏ đánh dấu' : 'Đánh dấu bài đọc này là "Đã thuộc"'}
                >
                  <GraduationCap className={`w-3.5 h-3.5 ${masteredIds.includes(currentTest.id) ? 'text-emerald-600' : 'text-slate-400'}`} />
                </button>
              )}

              {/* Passages */}
              <div className="flex items-center space-x-0.5 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold text-slate-600 shrink-0 border border-slate-200/60">
                {currentTest?.passages?.map(p => (
                  <button
                    key={p.passageNumber}
                    type="button"
                    onClick={() => {
                      setSelectedPassageNum(p.passageNumber);
                      setActiveEvidencePara(null);
                    }}
                    className={`px-1.5 py-0.5 rounded-lg transition-all font-bold cursor-pointer text-xs ${
                      selectedPassageNum === p.passageNumber 
                        ? 'bg-white text-blue-900 shadow-2xs font-black' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title={`Chuyển tới Passage ${p.passageNumber}`}
                  >
                    P{p.passageNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Row 2: Timer (Left) + Quick Actions (Right) */}
          <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 text-xs">
            {/* Countdown Timer */}
            <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-xl border font-mono transition-all shrink-0 ${
              isCriticalTime
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : isLowTime
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : isSubmitted
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${isCriticalTime ? 'text-white' : isLowTime ? 'text-amber-600' : 'text-blue-600'}`} />
              <span className="font-bold text-xs tracking-wider">
                {formatTimer(timeRemaining)}
              </span>
              {examMode === 'practice' && !isSubmitted && (
                <button
                  type="button"
                  onClick={toggleTimer}
                  className="p-0.5 rounded hover:bg-slate-200/80 text-slate-600 transition-colors ml-0.5 cursor-pointer"
                  title={isRunning ? 'Tạm dừng đếm giờ' : 'Bấm tiếp tục đếm giờ'}
                >
                  {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-600" />}
                </button>
              )}
              {examMode === 'exam' && !isSubmitted && (
                <span className="p-0.5 text-amber-500/80 ml-0.5 shrink-0" title="Chế độ Thi Thử: Đồng hồ chạy liên tục 60 phút (không thể tạm dừng)">
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>

            {/* Mobile Right Action Group */}
            <div className="flex items-center space-x-1 shrink-0">
              {/* Sinh Đề AI (Chỉ hiện khi Luyện tập để không phân tâm khi Thi thật) */}
              {examMode === 'practice' ? (
                <button
                  type="button"
                  onClick={() => setIsGeneratorOpen(true)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
                  title="Sinh Đề Reading Mới Bằng AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                  <span>Sinh Đề</span>
                </button>
              ) : !isSubmitted ? (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold text-[11px] shrink-0 select-none">
                  <Shield className="w-3 h-3 text-red-600 animate-pulse" />
                  <span>Phòng Thi</span>
                </div>
              ) : null}

              {/* Mode Toggle */}
              <button
                type="button"
                onClick={handleToggleExamMode}
                className={`px-2 py-1 rounded-xl font-bold border text-xs shrink-0 cursor-pointer shadow-2xs ${
                  examMode === 'exam'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
                title="Chuyển chế độ Luyện Tập / Thi Thử"
              >
                {examMode === 'exam' ? '🛡️ Thi' : '📗 Luyện'}
              </button>

              {/* CDI Button */}
              <button
                type="button"
                onClick={() => setCdiFullscreen(prev => !prev)}
                className={`p-1 sm:px-2 sm:py-1 rounded-xl border font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer ${
                  cdiFullscreen
                    ? 'bg-purple-600 text-white border-purple-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title={cdiFullscreen ? "Thoát CDI" : "Bật mô phỏng thi máy tính CDI"}
              >
                {cdiFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-purple-600" />}
                <span className="hidden sm:inline">{cdiFullscreen ? 'Thoát' : 'CDI'}</span>
              </button>

              {/* Tools Dropdown Trigger for Mobile */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
                  title="Tiện ích khác"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                {isToolsDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsToolsDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-slate-800">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tiện Ích & Công Cụ
                      </div>
                      <button
                        onClick={() => { setIsIngestOpen(true); setIsToolsDropdownOpen(false); }}
                        className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl hover:bg-amber-50 text-left text-xs font-semibold text-amber-900 cursor-pointer transition-colors"
                      >
                        <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Nạp Báo / Văn Bản Thô</span>
                      </button>
                      {onOpenTheory && (
                        <button
                          onClick={() => { onOpenTheory(); setIsToolsDropdownOpen(false); }}
                          className="w-full flex items-center space-x-2 px-2.5 py-2 rounded-xl hover:bg-blue-50 text-left text-xs font-semibold text-blue-900 cursor-pointer transition-colors"
                        >
                          <BookMarked className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Cẩm Nang Chiến Thuật</span>
                        </button>
                      )}
                      <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Chế Độ Giấy Đọc (Bảo Vệ Mắt)
                      </div>
                      <div className="flex items-center space-x-1 px-2 pb-1">
                        <button
                          type="button"
                          onClick={() => { handleThemeChange('standard'); setIsToolsDropdownOpen(false); }}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${readingTheme === 'standard' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                          title="Giao diện chuẩn giấy trắng"
                        >
                          ☀️ Chuẩn
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleThemeChange('sepia'); setIsToolsDropdownOpen(false); }}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${readingTheme === 'sepia' ? 'bg-amber-700 text-amber-50 border-amber-800' : 'bg-[#fbf7ee] text-[#5c4a28] border-[#e8dfc8]'}`}
                          title="Màu giấy sách ngả vàng ấm, chống mỏi mắt"
                        >
                          📜 Sách Giấy
                        </button>
                        <button
                          type="button"
                          onClick={() => { handleThemeChange('slate'); setIsToolsDropdownOpen(false); }}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${readingTheme === 'slate' ? 'bg-slate-800 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-300'}`}
                          title="Chế độ tối dịu mắt Slate"
                        >
                          🌙 Tối
                        </button>
                      </div>
                      <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Cỡ Chữ Đọc
                      </div>
                      <div className="flex items-center space-x-1 px-2 pb-1">
                        <button
                          onClick={() => { setFontSize('sm'); setIsToolsDropdownOpen(false); }}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${fontSize === 'sm' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                        >
                          Nhỏ (A-)
                        </button>
                        <button
                          onClick={() => { setFontSize('base'); setIsToolsDropdownOpen(false); }}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${fontSize === 'base' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                        >
                          Chuẩn (A)
                        </button>
                        <button
                          onClick={() => { setFontSize('lg'); setIsToolsDropdownOpen(false); }}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${fontSize === 'lg' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                        >
                          Lớn (A+)
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Band Score Button (if submitted) */}
              {isSubmitted && bandResult && (
                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(true)}
                  className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>{bandResult.band.toFixed(1)}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT (>= 1024px): Spacious, perfectly proportioned single row */}
        <div className="hidden lg:flex items-center justify-between gap-3 w-full">
          {/* Left Cluster: Test Info, Passages & AI Creation */}
          <div className="flex items-center space-x-2 min-w-0 shrink">
            {/* Skill Badge (2xl only) */}
            <div className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200 shrink-0">
              <BookMarked className="w-3.5 h-3.5 text-blue-600" />
              <span>IELTS Academic Reading</span>
            </div>

            {/* Test Selector Chip */}
            <div className="flex items-center space-x-1 min-w-0 shrink">
              <button
                type="button"
                onClick={handleOpenLibrary}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 font-bold text-xs border border-indigo-200 transition-colors shadow-2xs cursor-pointer max-w-[170px] xl:max-w-[240px] truncate min-w-0 shrink"
                title={`Đề đang làm: ${currentTest.title} (Bấm để mở Kho Đề - ${allReadingTests.length} đề)`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{currentTest.title}</span>
                <span className="text-[10px] text-indigo-500 font-semibold shrink-0">▾</span>
              </button>

              {currentTest?.isCustom && (
                <button
                  type="button"
                  onClick={() => handleToggleReadingPublic(currentTest.id)}
                  className={`p-1 rounded-lg border text-xs font-bold transition-all flex items-center shrink-0 cursor-pointer ${
                    currentTest.isPublic 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                  title={currentTest.isPublic ? "Đang chia sẻ công khai! Bấm để chuyển riêng tư" : "Đang để riêng tư! Bấm để chia sẻ"}
                >
                  {currentTest.isPublic ? <Globe className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                </button>
              )}

              {/* Mastered Button (Desktop) */}
              {onToggleMastered && (
                <button
                  type="button"
                  onClick={() => onToggleMastered(currentTest.id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 ${
                    masteredIds.includes(currentTest.id)
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                  title={masteredIds.includes(currentTest.id)
                    ? 'Bài đọc này đã được đánh dấu là "Đã thuộc". Bấm để bỏ đánh dấu.'
                    : 'Đánh dấu bài đọc này là "Đã thuộc" để ghi nhớ tiến trình và lọc trong thư viện.'}
                >
                  <GraduationCap className={`w-3.5 h-3.5 ${masteredIds.includes(currentTest.id) ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="hidden xl:inline">{masteredIds.includes(currentTest.id) ? 'Đã thuộc' : 'Thuộc bài'}</span>
                </button>
              )}
            </div>

            {/* Passage Selector Buttons */}
            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold text-slate-600 shrink-0 border border-slate-200/60">
              {currentTest?.passages?.map(p => (
                <button
                  key={p.passageNumber}
                  type="button"
                  onClick={() => {
                    setSelectedPassageNum(p.passageNumber);
                    setActiveEvidencePara(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-bold ${
                    selectedPassageNum === p.passageNumber 
                      ? 'bg-white text-blue-900 shadow-2xs font-black' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={`Chuyển tới Passage ${p.passageNumber}`}
                >
                  <span>P{p.passageNumber}</span>
                  <span className="hidden 2xl:inline text-[11px] font-normal text-slate-400">
                    Passage {p.passageNumber}
                  </span>
                </button>
              ))}
            </div>

            {/* AI Generator Button or Strict Exam Badge */}
            {examMode === 'exam' && !isSubmitted ? (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold shadow-2xs shrink-0 select-none">
                <Shield className="w-3.5 h-3.5 text-red-600 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Phòng Thi Nghiêm Ngặt</span>
                <span className="sm:hidden">Thi Thử</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-700 hover:text-purple-800 font-bold text-xs border border-purple-200 transition-all shadow-2xs shrink-0 cursor-pointer"
                title="Sinh bài đọc & bộ câu hỏi IELTS Reading mới bằng AI theo chuẩn Cambridge"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse shrink-0" />
                <span>Sinh Đề (AI)</span>
              </button>
            )}

            {/* Desktop Tiện Ích Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer ${
                  isToolsDropdownOpen ? 'bg-slate-200 text-slate-900 border-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Mở thêm công cụ & tiện ích hỗ trợ"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Tiện Ích</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsToolsDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-slate-800">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Công Cụ Tạo Đề & Tài Liệu
                    </div>
                    <button
                      onClick={() => { setIsIngestOpen(true); setIsToolsDropdownOpen(false); }}
                      className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-amber-50 text-left text-xs font-semibold text-amber-900 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">Nạp Báo & Văn Bản</div>
                        <div className="text-[10px] text-slate-400 font-normal">Nhập văn bản bất kỳ để tạo đề</div>
                      </div>
                    </button>
                    {onOpenTheory && (
                      <button
                        onClick={() => { onOpenTheory(); setIsToolsDropdownOpen(false); }}
                        className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-blue-50 text-left text-xs font-semibold text-blue-900 transition-colors cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                          <BookMarked className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">Cẩm Nang Chiến Thuật</div>
                          <div className="text-[10px] text-slate-400 font-normal">Chiến thuật 14 dạng bài Reading</div>
                        </div>
                      </button>
                    )}
                    <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Chế Độ Giấy Đọc (Bảo Vệ Mắt)
                    </div>
                    <div className="flex items-center space-x-1 px-2 pb-1">
                      <button
                        type="button"
                        onClick={() => handleThemeChange('standard')}
                        className={`flex-1 py-1 px-1 rounded-lg text-xs font-bold border cursor-pointer ${readingTheme === 'standard' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                        title="Giao diện chuẩn giấy trắng"
                      >
                        ☀️ Chuẩn
                      </button>
                      <button
                        type="button"
                        onClick={() => handleThemeChange('sepia')}
                        className={`flex-1 py-1 px-1 rounded-lg text-xs font-bold border cursor-pointer ${readingTheme === 'sepia' ? 'bg-amber-700 text-amber-50 border-amber-800' : 'bg-[#fbf7ee] text-[#5c4a28] border-[#e8dfc8]'}`}
                        title="Màu giấy sách ngả vàng ấm Cambridge, chống mỏi mắt"
                      >
                        📜 Sách Giấy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleThemeChange('slate')}
                        className={`flex-1 py-1 px-1 rounded-lg text-xs font-bold border cursor-pointer ${readingTheme === 'slate' ? 'bg-slate-800 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-300'}`}
                        title="Chế độ tối dịu mắt Slate"
                      >
                        🌙 Slate Tối
                      </button>
                    </div>
                    <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cỡ Chữ Đọc
                    </div>
                    <div className="flex items-center space-x-1 px-2 pb-1">
                      <button
                        onClick={() => setFontSize('sm')}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${fontSize === 'sm' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        A- (Nhỏ)
                      </button>
                      <button
                        onClick={() => setFontSize('base')}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${fontSize === 'base' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        A (Chuẩn)
                      </button>
                      <button
                        onClick={() => setFontSize('lg')}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${fontSize === 'lg' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        A+ (Lớn)
                      </button>
                    </div>
                    <div className="pt-1 border-t border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tỷ Lệ Màn Hình (Đọc / Câu Hỏi)
                    </div>
                    <div className="flex items-center space-x-1 px-2 pb-1">
                      <button
                        onClick={() => setSplitWidth(35)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${splitWidth === 35 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        35 / 65
                      </button>
                      <button
                        onClick={() => setSplitWidth(50)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${splitWidth === 50 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        50 / 50
                      </button>
                      <button
                        onClick={() => setSplitWidth(65)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold border cursor-pointer ${splitWidth === 65 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                      >
                        65 / 35
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Direct buttons on ultra-wide 2xl screens */}
            <button
              type="button"
              onClick={() => setIsIngestOpen(true)}
              className="hidden 2xl:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
              title="Nạp một bài báo hoặc văn bản bất kỳ để AI tạo đề thi Reading"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Nạp Báo</span>
            </button>

            {onOpenTheory && (
              <button
                type="button"
                onClick={onOpenTheory}
                className="hidden 2xl:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
                title="Mở Cẩm Nang Lý Thuyết & Chiến Thuật IELTS Reading"
              >
                <BookMarked className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Cẩm Nang</span>
              </button>
            )}
          </div>

          {/* Right Cluster: Timer, Mode, CDI, Band Score */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Active Countdown Timer */}
            <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border font-mono transition-all shrink-0 ${
              isCriticalTime
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : isLowTime
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : isSubmitted
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${isCriticalTime ? 'text-white' : isLowTime ? 'text-amber-600' : 'text-blue-600'}`} />
              <span className="font-bold text-xs tracking-wider">
                {formatTimer(timeRemaining)}
              </span>
              {examMode === 'practice' && !isSubmitted && (
                <button
                  type="button"
                  onClick={toggleTimer}
                  className="p-1 rounded hover:bg-slate-200/80 text-slate-600 transition-colors ml-0.5 cursor-pointer"
                  title={isRunning ? 'Tạm dừng đếm giờ' : 'Bấm tiếp tục đếm giờ'}
                >
                  {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-600" />}
                </button>
              )}
              {examMode === 'exam' && !isSubmitted && (
                <span className="p-1 text-amber-500/80 ml-0.5 shrink-0" title="Chế độ Thi Thử: Đồng hồ chạy liên tục 60 phút (không thể tạm dừng)">
                  <Lock className="w-3 h-3" />
                </span>
              )}
            </div>

            {/* CDI Fullscreen Simulation Toggle & Contrast Theme Selector */}
            {cdiFullscreen && (
              <select
                value={cdiTheme}
                onChange={(e) => setCdiTheme(e.target.value)}
                className="bg-white border border-slate-300 text-[11px] font-bold text-slate-700 px-1.5 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 shrink-0 cursor-pointer"
                title="Chọn độ tương phản CDI chuẩn khảo thí"
              >
                <option value={CDI_CONTRAST_THEMES.STANDARD}>Chuẩn</option>
                <option value={CDI_CONTRAST_THEMES.BLACK_ON_WHITE}>Đen / Trắng</option>
                <option value={CDI_CONTRAST_THEMES.WHITE_ON_BLACK}>Trắng / Đen</option>
                <option value={CDI_CONTRAST_THEMES.YELLOW_ON_BLACK}>Vàng / Đen</option>
              </select>
            )}

            <button
              type="button"
              onClick={() => setCdiFullscreen(prev => !prev)}
              className={`px-2.5 py-1 rounded-xl border font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                cdiFullscreen
                  ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
              }`}
              title={cdiFullscreen ? "Thoát toàn màn hình CDI (Phím Esc)" : "Bật chế độ Toàn Màn Hình mô phỏng phòng thi máy tính CDI"}
            >
              {cdiFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Thoát CDI</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Thi CDI</span>
                </>
              )}
            </button>

            {/* Mode Selector Button */}
            <button
              type="button"
              onClick={handleToggleExamMode}
              className={`px-2.5 py-1 rounded-xl font-bold border text-xs transition-all shrink-0 cursor-pointer shadow-2xs ${
                examMode === 'exam'
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Nhấp để đổi giữa Chế độ Thi Thử và Chế độ Luyện Tập"
            >
              <span>{examMode === 'exam' ? '🛡️ Thi Thử' : '📗 Luyện Tập'}</span>
            </button>

            {/* If Submitted: Quick Button to Re-open Result Modal */}
            {isSubmitted && bandResult && (
              <button
                type="button"
                onClick={() => setIsResultModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors text-xs shrink-0 cursor-pointer"
                title="Xem lại Báo cáo tổng kết Band Score"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Báo Cáo:</span>
                <span>Band {bandResult.band.toFixed(1)}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Interactive Workspace (Split Pane on Desktop, Tabbed on Mobile) */}
      <div 
        ref={containerRef}
        className={`flex-1 flex overflow-hidden relative ${isDragging ? 'select-none cursor-col-resize' : ''}`}
      >
        {/* Left: Passage Pane */}
        <div 
          style={{ width: window.innerWidth >= 1024 ? `${splitWidth}%` : '100%' }}
          className={`h-full border-r border-slate-200 overflow-hidden ${
            mobileTab === 'passage' ? 'block' : 'hidden lg:block'
          }`}
        >
          <PassagePane
            passage={activePassage}
            activeEvidencePara={activeEvidencePara}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            apiKey={apiKey}
            model={model}
            onOpenSettings={onOpenSettings}
            onSaveToVocabNotebook={onSaveToVocabNotebook}
            examMode={examMode}
            theme={readingTheme}
          />
        </div>

        {/* Splitter Handle (Desktop Only) */}
        <div
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onDoubleClick={() => setSplitWidth(50)}
          className="hidden lg:flex w-2 bg-slate-100 hover:bg-blue-400 active:bg-blue-600 cursor-col-resize items-center justify-center transition-colors group z-10"
          title="Kéo thả để điều chỉnh tỷ lệ chia đôi màn hình (Nhấp đúp để đặt lại 50/50)"
        >
          <div className="w-0.5 h-8 bg-slate-400 group-hover:bg-white rounded-full" />
        </div>

        {/* Right: Question Pane */}
        <div 
          style={{ width: window.innerWidth >= 1024 ? `${100 - splitWidth}%` : '100%' }}
          className={`h-full flex-1 overflow-hidden ${
            mobileTab === 'questions' ? 'block' : 'hidden lg:block'
          }`}
        >
          <QuestionPane
            passageTitle={activePassage?.title || ''}
            passageParagraphs={activePassage?.paragraphs || []}
            questionGroups={activePassage?.questionGroups || []}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
            onAnswerChange={handleAnswerChange}
            isSubmitted={isSubmitted}
            showExplanationFor={showExplanationFor}
            onToggleExplanation={(qOrder) => setShowExplanationFor(prev => prev === qOrder ? null : qOrder)}
            onLocateEvidence={handleLocateEvidence}
            fontSize={fontSize}
            apiKey={apiKey}
            model={model}
            onOpenSettings={onOpenSettings}
            onSaveToVocabNotebook={onSaveToVocabNotebook}
            theme={readingTheme}
          />
        </div>
      </div>

      {/* 3. Bottom Question Palette Bar */}
      <QuestionPaletteBar
        totalQuestions={40}
        activePassageNum={selectedPassageNum}
        userAnswers={userAnswers}
        flaggedQuestions={flaggedQuestions}
        isSubmitted={isSubmitted}
        questionsData={allQuestions}
        bandResult={bandResult}
        onSubmitExam={handleSubmitExam}
        onResetExam={handleResetExam}
        onJumpToQuestion={handleJumpToQuestion}
        onSelectPassage={setSelectedPassageNum}
        onOpenResultModal={() => setIsResultModalOpen(true)}
      />

      {/* 4. Reading Result Modal */}
      <ReadingResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        bandResult={bandResult}
        testTitle={currentTest.title}
        onResetExam={handleResetExam}
        onJumpToQuestion={handleJumpToQuestion}
        onSelectPassage={setSelectedPassageNum}
      />

      {/* 5. Reading AI Generator Modal */}
      <ReadingGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        apiKey={apiKey}
        model={model}
        onPassageGenerated={(p, isPub, meta) => handleAddCustomPassage(p, 'generated', isPub, meta)}
        onOpenSettings={onOpenSettings}
      />

      {/* 6. Reading Ingest Article Modal */}
      <ReadingIngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        apiKey={apiKey}
        model={model}
        onPassageIngested={(p, isPub) => handleAddCustomPassage(p, 'ingest', isPub)}
        onOpenSettings={onOpenSettings}
      />

      {/* 7. Reading Library Modal */}
      <ReadingLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        allReadingTests={allReadingTests}
        currentTestId={currentTestId}
        onSelectTest={(testId) => {
          const t = allReadingTests.find(item => item.id === testId);
          setCurrentTestId(testId);
          setSelectedPassageNum(t?.passages[0]?.passageNumber || 1);
        }}
        onDeleteTest={handleDeleteReadingTest}
        onTogglePublic={handleToggleReadingPublic}
        onCreateFullTest={handleCreateFullTest}
        onOpenGenerator={() => {
          setIsLibraryOpen(false);
          setIsGeneratorOpen(true);
        }}
        onOpenIngest={() => {
          setIsLibraryOpen(false);
          setIsIngestOpen(true);
        }}
        user={user}
        masteredIds={masteredIds}
        onToggleMastered={onToggleMastered}
      />
    </div>
  );
}
