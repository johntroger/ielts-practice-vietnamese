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
  Award
} from 'lucide-react';
import { INITIAL_READING_TESTS, calculateReadingBandScore } from '../../data/readingTasks';
import PassagePane from './PassagePane';
import QuestionPane from './QuestionPane';
import QuestionPaletteBar from './QuestionPaletteBar';

export default function ReadingWorkspace({
  apiKey,
  onOpenSettings,
  user
}) {
  const currentTest = INITIAL_READING_TESTS[0];
  const [selectedPassageNum, setSelectedPassageNum] = useState(1);
  const [examMode, setExamMode] = useState('practice'); // 'exam' | 'practice'
  const [mobileTab, setMobileTab] = useState('passage'); // 'passage' | 'questions' (for mobile)
  const [fontSize, setFontSize] = useState('base');
  
  // Split pane drag width (percentage for left pane)
  const [splitWidth, setSplitWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // User state
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanationFor, setShowExplanationFor] = useState(null);
  const [activeEvidencePara, setActiveEvidencePara] = useState(null);

  const handleToggleFlag = (order) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [order]: !prev[order]
    }));
  };

  // Active Passage object
  const activePassage = useMemo(() => {
    return currentTest?.passages.find(p => p.passageNumber === selectedPassageNum) || currentTest?.passages[0];
  }, [currentTest, selectedPassageNum]);

  // Flatten all questions for palette checks
  const allQuestions = useMemo(() => {
    if (!currentTest?.passages) return [];
    const list = [];
    currentTest.passages.forEach(p => {
      p.questionGroups.forEach(g => {
        g.questions.forEach(q => {
          list.push({ ...q, passageNumber: p.passageNumber });
        });
      });
    });
    return list;
  }, [currentTest]);

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

  const handleAnswerChange = (questionOrder, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionOrder]: value
    }));
  };

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

  const handleSubmitExam = () => {
    setIsSubmitted(true);
  };

  const handleResetExam = () => {
    if (window.confirm('Bạn có chắc muốn làm lại từ đầu? Tất cả câu trả lời sẽ được làm mới.')) {
      setUserAnswers({});
      setFlaggedQuestions({});
      setIsSubmitted(false);
      setShowExplanationFor(null);
      setActiveEvidencePara(null);
    }
  };

  // Calculate Band Score if submitted
  const bandResult = useMemo(() => {
    if (!isSubmitted) return null;
    let correctCount = 0;
    allQuestions.forEach(q => {
      const uAns = userAnswers[q.order];
      if (Array.isArray(uAns)) {
        const correctArr = Array.isArray(q.answer) ? q.answer : [q.answer];
        if (uAns.length === correctArr.length && uAns.every(a => correctArr.includes(a))) {
          correctCount++;
        }
      } else if (uAns) {
        if (
          String(uAns).trim().toLowerCase() === String(q.answer).trim().toLowerCase() ||
          (q.acceptableAnswers && q.acceptableAnswers.some(a => a.toLowerCase() === String(uAns).trim().toLowerCase()))
        ) {
          correctCount++;
        }
      }
    });
    const band = calculateReadingBandScore(correctCount);
    return { correctCount, band };
  }, [isSubmitted, allQuestions, userAnswers]);

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
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => {
                  setSelectedPassageNum(num);
                  setActiveEvidencePara(null);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                  selectedPassageNum === num 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Passage {num}
              </button>
            ))}
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

        {/* Right: Mode & Timer Indicators */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
          <div className="flex items-center space-x-1 font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Tổng thời gian:</span>
            <span className="font-bold">60:00 (40 câu)</span>
          </div>

          <button
            onClick={() => setExamMode(prev => prev === 'exam' ? 'practice' : 'exam')}
            className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
              examMode === 'exam'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {examMode === 'exam' ? '🛡️ Chế độ Thi Thử' : '📗 Chế độ Luyện Tập'}
          </button>
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
            questionGroups={activePassage?.questionGroups || []}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={handleToggleFlag}
            onAnswerChange={handleAnswerChange}
            isSubmitted={isSubmitted}
            showExplanationFor={showExplanationFor}
            onToggleExplanation={(qOrder) => setShowExplanationFor(prev => prev === qOrder ? null : qOrder)}
            onLocateEvidence={handleLocateEvidence}
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
      />
    </div>
  );
}

