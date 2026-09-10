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
  AlertTriangle
} from 'lucide-react';
import { INITIAL_READING_TESTS } from '../../data/readingTasks';
import { useReadingExam } from '../../hooks/useReadingExam';
import PassagePane from './PassagePane';
import QuestionPane from './QuestionPane';
import QuestionPaletteBar from './QuestionPaletteBar';
import ReadingResultModal from './ReadingResultModal';
import ReadingGeneratorModal from './ReadingGeneratorModal';
import ReadingIngestModal from './ReadingIngestModal';

export default function ReadingWorkspace({
  apiKey,
  model = 'gemini-2.5-flash',
  onOpenSettings,
  user,
  onSaveToVocabNotebook,
  onReadingSubmitted
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

  const [currentTestId, setCurrentTestId] = useState(() => INITIAL_READING_TESTS[0].id);
  const currentTest = useMemo(() => {
    return allReadingTests.find(t => t.id === currentTestId) || allReadingTests[0];
  }, [allReadingTests, currentTestId]);

  const [selectedPassageNum, setSelectedPassageNum] = useState(1);
  const [examMode, setExamMode] = useState('practice'); // 'exam' | 'practice'
  const [mobileTab, setMobileTab] = useState('passage'); // 'passage' | 'questions' (for mobile)
  const [fontSize, setFontSize] = useState('base');
  
  // Split pane drag width (percentage for left pane)
  const [splitWidth, setSplitWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Explanation, Evidence and Modals states
  const [showExplanationFor, setShowExplanationFor] = useState(null);
  const [activeEvidencePara, setActiveEvidencePara] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);

  // Callback when a new passage is generated or ingested
  const handleAddCustomPassage = (newPassage, source = 'generated') => {
    const newTest = {
      id: `custom-test-${Date.now()}`,
      title: `${source === 'ingest' ? '📰' : '✨'} ${newPassage.title || 'Bài Đọc IELTS Mới'}`,
      description: `Đề thi ${source === 'ingest' ? 'trích xuất từ bài báo' : 'sinh bởi Gemini AI'} theo chuẩn Cambridge Academic.`,
      totalQuestions: newPassage.questionGroups?.reduce((acc, g) => acc + (g.questions?.length || 0), 0) || 10,
      timeLimitMinutes: 20,
      passages: [
        {
          ...newPassage,
          passageNumber: 1
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
    setSelectedPassageNum(1);
    alert(`Đã nạp thành công bài đọc mới: "${newTest.title}"! Bạn có thể bắt đầu làm bài ngay.`);
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
    questionsData: allQuestions
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

  // Handle Dragging Splitter
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newWidth >= 25 && newWidth <= 75) {
        setSplitWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleLocateEvidence = (paraId) => {
    setActiveEvidencePara(paraId);
    if (window.innerWidth < 1024) {
      setMobileTab('passage');
    }
    setTimeout(() => {
      const el = document.getElementById(`passage-para-${paraId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handleJumpToQuestion = (questionOrder) => {
    if (window.innerWidth < 1024) {
      setMobileTab('questions');
    }
    setTimeout(() => {
      const el = document.getElementById(`question-card-${questionOrder}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Timer format (MM:SS)
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 300 && timeRemaining > 0; // Less than 5 mins
  const isCriticalTime = timeRemaining <= 60 && timeRemaining > 0; // Less than 1 min

  // Suggested time per passage: Passage 1 (17m), Passage 2 (20m), Passage 3 (23m)
  const passageTimeGuide = {
    1: 'Gợi ý: ≤ 17 phút',
    2: 'Gợi ý: ≤ 20 phút',
    3: 'Gợi ý: ≤ 23 phút'
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden h-full">
      {/* 1. Reading Sub-header Toolbar */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs shrink-0">
        {/* Left: Skill Badge & Passage Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200">
            <BookMarked className="w-3.5 h-3.5 text-blue-600" />
            <span>IELTS Academic Reading</span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            {currentTest?.passages?.map(p => (
              <button
                key={p.passageNumber}
                onClick={() => {
                  setSelectedPassageNum(p.passageNumber);
                  setActiveEvidencePara(null);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  selectedPassageNum === p.passageNumber 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Passage {p.passageNumber}</span>
                {selectedPassageNum === p.passageNumber && (
                  <span className="hidden md:inline text-[10px] text-blue-600 font-normal">
                    ({passageTimeGuide[p.passageNumber] || '≤ 20 phút'})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Test Selector Dropdown if more than 1 test */}
          {allReadingTests.length > 1 && (
            <select
              value={currentTestId}
              onChange={(e) => {
                setCurrentTestId(e.target.value);
                setSelectedPassageNum(1);
              }}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-700 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[150px] sm:max-w-[200px] truncate"
            >
              {allReadingTests.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          )}

          {/* Generator and Ingest Quick Action Buttons */}
          <div className="hidden lg:flex items-center space-x-1.5 border-l border-slate-200 pl-2">
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors shadow-2xs"
              title="Sinh bài đọc IELTS mới bằng AI theo 12 chủ đề"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Sinh Đề Mới</span>
            </button>

            <button
              onClick={() => setIsIngestOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors shadow-2xs"
              title="Nạp bài báo tiếng Anh (BBC, Nature...) chuyển thành đề thi"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Nạp Bài Báo</span>
            </button>
          </div>
        </div>

        {/* Center: Mobile View Switcher (Passage vs Questions) */}
        <div className="flex lg:hidden items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setMobileTab('passage')}
            className={`px-3 py-1 rounded-md transition-all ${
              mobileTab === 'passage' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Bài Đọc
          </button>
          <button
            onClick={() => setMobileTab('questions')}
            className={`px-3 py-1 rounded-md transition-all ${
              mobileTab === 'questions' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Câu Hỏi
          </button>
        </div>

        {/* Right: Mode, Timer & Score Overview Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          
          {/* Active Countdown Timer */}
          <div className={`flex items-center space-x-2 px-2.5 sm:px-3 py-1 rounded-lg border font-mono transition-all ${
            isCriticalTime
              ? 'bg-red-500 text-white border-red-600 animate-pulse'
              : isLowTime
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : isSubmitted
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-slate-100 text-slate-800 border-slate-200'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${isCriticalTime ? 'text-white' : isLowTime ? 'text-amber-600' : 'text-blue-600'}`} />
            <span className="font-bold text-xs sm:text-sm tracking-wider">
              {formatTimer(timeRemaining)}
            </span>

            {/* Play/Pause in Practice Mode */}
            {examMode === 'practice' && !isSubmitted && (
              <button
                onClick={toggleTimer}
                className="p-1 rounded hover:bg-slate-200/80 text-slate-600 transition-colors ml-0.5"
                title={isRunning ? 'Tạm dừng đếm giờ' : 'Bấm tiếp tục đếm giờ'}
              >
                {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-600" />}
              </button>
            )}
          </div>

          {/* Mode Selector Button */}
          <button
            onClick={() => setExamMode(prev => prev === 'exam' ? 'practice' : 'exam')}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
              examMode === 'exam'
                ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Nhấp để đổi giữa Chế độ Thi Thử và Chế độ Luyện Tập"
          >
            {examMode === 'exam' ? '🛡️ Thi Thử (Strict)' : '📗 Luyện Tập'}
          </button>

          {/* If Submitted: Quick Button to Re-open Result Modal */}
          {isSubmitted && bandResult && (
            <button
              onClick={() => setIsResultModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition-colors"
              title="Xem lại Báo cáo tổng kết Band Score"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Báo Cáo Band</span>
              <span>{bandResult.band.toFixed(1)}</span>
            </button>
          )}
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
          />
        </div>

        {/* Splitter Handle (Desktop Only) */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className="hidden lg:flex w-2 bg-slate-100 hover:bg-blue-400 active:bg-blue-600 cursor-col-resize items-center justify-center transition-colors group z-10"
          title="Kéo thả để điều chỉnh tỷ lệ chia đôi màn hình"
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
            apiKey={apiKey}
            model={model}
            onOpenSettings={onOpenSettings}
            onSaveToVocabNotebook={onSaveToVocabNotebook}
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
        onPassageGenerated={(p) => handleAddCustomPassage(p, 'generated')}
        onOpenSettings={onOpenSettings}
      />

      {/* 6. Reading Ingest Article Modal */}
      <ReadingIngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        apiKey={apiKey}
        model={model}
        onPassageIngested={(p) => handleAddCustomPassage(p, 'ingest')}
        onOpenSettings={onOpenSettings}
      />
    </div>
  );
}
