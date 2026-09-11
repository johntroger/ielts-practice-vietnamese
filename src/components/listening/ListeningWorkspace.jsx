import React, { useState, useEffect, useMemo } from 'react';
import { 
  Headphones, 
  Volume2, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  X, 
  BarChart2, 
  Award, 
  FileText,
  BookOpen,
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import AudioPlayerBar from './AudioPlayerBar';
import ListeningQuestionPane from './ListeningQuestionPane';
import ListeningPaletteBar from './ListeningPaletteBar';
import ListeningResultModal from './ListeningResultModal';
import ListeningTranscriptModal from './ListeningTranscriptModal';
import ListeningLibraryModal from './ListeningLibraryModal';
import ListeningURLExerciseGeneratorModal from './ListeningURLExerciseGeneratorModal';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { useListeningExam } from '../../hooks/useListeningExam';
import { INITIAL_LISTENING_TESTS } from '../../data/listeningTasks';
import { scoreListeningExam } from '../../utils/listeningScorer';

const SNAPSHOT_KEY_PREFIX = 'ielts_listening_snapshot_';
const CUSTOM_TESTS_STORAGE_KEY = 'ielts_listening_custom_tests';

export default function ListeningWorkspace({
  apiKey,
  model,
  onOpenSettings,
  user,
  onSaveToVocabNotebook,
  onListeningSubmitted,
  initialTestId = 'cambridge-18-test-1',
  initialExamMode = 'practice'
}) {
  // 1. All Listening Tests (Preloaded + Custom from URL)
  const [allListeningTests, setAllListeningTests] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_TESTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...INITIAL_LISTENING_TESTS, ...parsed];
        }
      }
    } catch (e) {}
    return INITIAL_LISTENING_TESTS;
  });

  const [currentTestId, setCurrentTestId] = useState(initialTestId);
  const [examMode, setExamMode] = useState(initialExamMode); // 'strict' | 'practice'
  const [activePart, setActivePart] = useState(1);
  const [hasStartedExam, setHasStartedExam] = useState(true);
  const [isSoundcheckOpen, setIsSoundcheckOpen] = useState(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Band Score Result State
  const [bandResult, setBandResult] = useState(() => {
    try {
      const saved = localStorage.getItem('ielts_listening_last_result_' + currentTestId);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  // Accessibility State: Font Size & Contrast
  const [fontSizeMode, setFontSizeMode] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [contrastTheme, setContrastTheme] = useState('standard'); // 'standard' | 'dark' | 'yellowOnBlack'
  
  // Preparation Timer (30s Prep cue at start of each part)
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(0);
  const [isPrepActive, setIsPrepActive] = useState(false);

  // Crash Recovery / Auto-Resume Snapshot
  const [resumePrompt, setResumePrompt] = useState(null);

  // Active Test Object
  const currentTest = useMemo(() => {
    return allListeningTests.find(t => t.id === currentTestId) || allListeningTests[0] || INITIAL_LISTENING_TESTS[0];
  }, [allListeningTests, currentTestId]);

  // Current Part Object
  const currentPartData = useMemo(() => {
    return currentTest.parts?.find(p => p.partNumber === activePart) || currentTest.parts?.[0] || INITIAL_LISTENING_TESTS[0].parts[0];
  }, [currentTest, activePart]);

  // Handler: Add newly generated listening test from URL
  const handleAddCustomTest = (newTest) => {
    setAllListeningTests(prev => {
      const updated = [newTest, ...prev];
      try {
        const customOnly = updated.filter(t => t.isCustom);
        localStorage.setItem(CUSTOM_TESTS_STORAGE_KEY, JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });
    setCurrentTestId(newTest.id);
    setActivePart(1);
    setHasStartedExam(true);
  };

  // Handler: Delete custom listening test
  const handleDeleteCustomTest = (testIdToDelete) => {
    setAllListeningTests(prev => {
      const updated = prev.filter(t => t.id !== testIdToDelete);
      try {
        const customOnly = updated.filter(t => t.isCustom);
        localStorage.setItem(CUSTOM_TESTS_STORAGE_KEY, JSON.stringify(customOnly));
      } catch (e) {}
      return updated;
    });
    if (currentTestId === testIdToDelete) {
      setCurrentTestId(INITIAL_LISTENING_TESTS[0].id);
      setActivePart(1);
    }
  };

  // Candidate ID & Name for authentic CD-IELTS header
  const candidateName = user?.email ? user.email.split('@')[0].toUpperCase() : 'CANDIDATE';
  const candidateId = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000);
  }, []);

  // 2. Audio Engine Hook
  const audioEngine = useAudioEngine({
    initialSrc: currentTest.audioUrl || currentTest.fallbackAudioUrl,
    examMode,
    onEnded: () => {
      console.log('Audio track finished playing.');
    }
  });

  // 3. Exam State Hook (Answers, Flags, Submission, Shortcuts)
  const exam = useListeningExam({
    testId: currentTestId,
    audioEngine,
    examMode,
    questionsData: currentTest.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions))
  });

  // Check for prior interrupted session on mount
  useEffect(() => {
    try {
      const savedSnapshot = localStorage.getItem(SNAPSHOT_KEY_PREFIX + currentTestId);
      if (savedSnapshot) {
        const parsed = JSON.parse(savedSnapshot);
        if (parsed && parsed.savedTime > 0 && !parsed.isCompleted) {
          setResumePrompt(parsed);
        }
      }
    } catch (e) {}
  }, [currentTestId]);

  // Auto-Save Snapshot Engine every 2 seconds
  useEffect(() => {
    if (!hasStartedExam) return;
    const interval = setInterval(() => {
      try {
        const snapshot = {
          testId: currentTestId,
          activePart,
          savedTime: audioEngine.currentTime,
          examMode,
          timestamp: new Date().toISOString(),
          isCompleted: exam.isSubmitted
        };
        localStorage.setItem(SNAPSHOT_KEY_PREFIX + currentTestId, JSON.stringify(snapshot));
      } catch (e) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [hasStartedExam, currentTestId, activePart, audioEngine.currentTime, examMode, exam.isSubmitted]);

  // 30s Prep Timer countdown
  useEffect(() => {
    let timer = null;
    if (isPrepActive && prepTimeRemaining > 0) {
      timer = setInterval(() => {
        setPrepTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPrepActive(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPrepActive, prepTimeRemaining]);

  // Handle Autoplay unlock and begin exam with safe buffer pre-flight
  const handleStartExam = async () => {
    await audioEngine.unlockAudio();
    setHasStartedExam(true);
    setIsPrepActive(true);
    setPrepTimeRemaining(30);
    // Trigger buffer preloading if not ready
    if (!audioEngine.isBufferReady) {
      audioEngine.forcePreload();
    }
    audioEngine.play();
  };

  // Resume interrupted exam
  const handleResumeExam = () => {
    if (resumePrompt) {
      setActivePart(resumePrompt.activePart || 1);
      audioEngine.seek(resumePrompt.savedTime || 0);
      setHasStartedExam(true);
      setResumePrompt(null);
      audioEngine.play();
    }
  };

  // Discard saved exam
  const handleDiscardResume = () => {
    try {
      localStorage.removeItem(SNAPSHOT_KEY_PREFIX + currentTestId);
    } catch (e) {}
    setResumePrompt(null);
  };

  // Handle Submit Exam with 4-layer diagnostic scoring
  const handleConfirmSubmit = () => {
    exam.submitExam();
    setIsConfirmSubmitOpen(false);
    audioEngine.pause();

    const scored = scoreListeningExam({
      testData: currentTest,
      userAnswers: exam.userAnswers,
      timeSpentSeconds: audioEngine.currentTime
    });

    setBandResult(scored);
    setIsResultModalOpen(true);

    try {
      localStorage.setItem('ielts_listening_last_result_' + currentTestId, JSON.stringify(scored));
    } catch (e) {}

    if (onListeningSubmitted) {
      onListeningSubmitted({
        testId: currentTestId,
        testTitle: currentTest.title,
        correctCount: scored.correctCount,
        totalQuestions: scored.totalQuestions,
        band: scored.band,
        userAnswers: exam.userAnswers,
        submittedAt: scored.submittedAt,
        resultData: scored
      });
    }
  };

  // Accessibility styling classes
  const fontClass = fontSizeMode === 'large' ? 'text-base' : fontSizeMode === 'xlarge' ? 'text-lg' : 'text-sm';
  const themeBg = contrastTheme === 'dark' 
    ? 'bg-slate-900 text-slate-100' 
    : contrastTheme === 'yellowOnBlack' 
    ? 'bg-black text-yellow-300' 
    : 'bg-slate-100 text-slate-900';

  return (
    <div className={"flex-1 flex flex-col min-h-0 h-full overflow-hidden " + themeBg + " " + fontClass}>
      
      {/* 1. Header: Authentic CD-IELTS Bar in Strict Mode OR Standard Bar in Practice Mode */}
      {examMode === 'strict' ? (
        <div className="bg-slate-950 text-white px-3 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0 text-xs select-none">
          {/* Candidate ID & Number */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="font-mono font-bold tracking-wider truncate">
              {candidateName} (ID: {candidateId})
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-400 font-semibold">{currentTest.title}</span>
          </div>

          {/* Center: Headphone Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioEngine.volume}
              onChange={(e) => audioEngine.changeVolume(parseFloat(e.target.value))}
              className="w-20 sm:w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              title="Âm lượng tai nghe"
            />
          </div>

          {/* Right: Accessibility Controls, Report & Countdown Timer */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {exam.isSubmitted && bandResult && (
              <button
                onClick={() => setIsResultModalOpen(true)}
                className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Band {bandResult.band.toFixed(1)}</span>
              </button>
            )}

            <button
              onClick={() => setContrastTheme(prev => prev === 'standard' ? 'dark' : prev === 'dark' ? 'yellowOnBlack' : 'standard')}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 cursor-pointer"
              title="Đổi độ tương phản màu"
            >
              Theme
            </button>
            <button
              onClick={() => setFontSizeMode(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal')}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 cursor-pointer"
              title="Đổi cỡ chữ"
            >
              Cỡ chữ
            </button>
            <button
              onClick={() => {
                if (window.confirm('Bạn có muốn thoát khỏi Chế độ Thi Thử (Strict Mode) để quay về Chế độ Luyện Tập tự do không?')) {
                  setExamMode('practice');
                }
              }}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 cursor-pointer"
              title="Quay về chế độ luyện tập"
            >
              Thoát Thi
            </button>
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {Math.max(0, Math.floor((audioEngine.duration - audioEngine.currentTime) / 60))}:
                {Math.max(0, Math.floor((audioEngine.duration - audioEngine.currentTime) % 60)).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Header in Practice Mode */
        <div className="bg-white border-b border-slate-200 px-3 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  {currentTest.title}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Cambridge 18 Official
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 truncate">
                <span>{currentTest.totalQuestions} câu hỏi</span>
                <span>•</span>
                <span>Thời lượng ~32 phút</span>
                <span>•</span>
                <span className="text-indigo-600 font-semibold">Đã trả lời: {exam.answeredCount} / {currentTest.totalQuestions}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Quick Test Switcher Dropdown */}
            {allListeningTests.length > 1 && (
              <select
                value={currentTestId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedTest = allListeningTests.find(t => t.id === selectedId);
                  setCurrentTestId(selectedId);
                  setActivePart(1);
                  setHasStartedExam(true);
                  exam.resetExam();
                  setBandResult(null);
                  if (selectedTest?.audioUrl) {
                    audioEngine.loadAudio(selectedTest.audioUrl || selectedTest.fallbackAudioUrl);
                  }
                }}
                className="hidden md:block bg-white border border-slate-200 text-xs font-bold text-slate-700 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-[160px] truncate cursor-pointer"
                title="Chọn bộ đề nghe"
              >
                {allListeningTests.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.isCustom ? '✨ ' : '📚 '}
                    {t.title}
                  </option>
                ))}
              </select>
            )}

            {/* Kho Đề Nghe Button */}
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
              title="Mở thư viện toàn bộ đề thi IELTS Listening"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kho Đề ({allListeningTests.length})</span>
            </button>

            {/* Sinh Đề AI Button */}
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors shadow-2xs cursor-pointer"
              title="Sinh đề thi IELTS mới từ link âm thanh bất kỳ bằng AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Sinh Đề (URL)</span>
            </button>

            {/* If Submitted: Result Report Button */}
            {exam.isSubmitted && bandResult && (
              <button
                onClick={() => setIsResultModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title="Mở lại bảng báo cáo kết quả và chẩn đoán lỗi"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Báo Cáo Band {bandResult.band.toFixed(1)}</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setExamMode('practice')}
                className={"px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer " + (examMode === 'practice' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900')}
              >
                📗 Luyện Tập
              </button>
              <button
                onClick={() => setExamMode('strict')}
                className={"px-2 sm:px-2.5 py-1 rounded-md transition-all cursor-pointer " + (examMode === 'strict' ? 'bg-red-600 text-white shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900')}
              >
                🛡️ Thi Thử (CD-IELTS)
              </button>
            </div>

            {/* Transcript Modal Button */}
            <button
              onClick={() => setIsTranscriptOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Mở lời thoại gỡ băng đồng bộ thời gian thực (Karaoke Transcript)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lời Thoại</span>
            </button>

            {/* Soundcheck Button */}
            <button
              onClick={() => setIsSoundcheckOpen(true)}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Kiểm tra âm lượng tai nghe trước khi làm bài"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Soundcheck</span>
            </button>

            {/* Reset Exam Button */}
            {exam.isSubmitted && (
              <button
                onClick={() => {
                  if (window.confirm('Bạn có muốn làm lại đề thi này từ đầu không?')) {
                    exam.resetExam();
                    audioEngine.seek(0);
                    setHasStartedExam(false);
                    setBandResult(null);
                    try {
                      localStorage.removeItem('ielts_listening_last_result_' + currentTestId);
                    } catch (e) {}
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Làm lại</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Sticky Audio Player Bar */}
      <AudioPlayerBar 
        audioEngine={audioEngine}
        examMode={examMode}
        activePart={activePart}
        onSelectPart={(pNum) => {
          setActivePart(pNum);
          if (examMode === 'practice') {
            const targetPart = currentTest.parts?.find(p => p.partNumber === pNum);
            if (targetPart && typeof targetPart.audioTimestampStart === 'number') {
              audioEngine.seek(targetPart.audioTimestampStart);
            }
          }
        }}
        parts={currentTest.parts || []}
      />

      {/* 3. Crash Recovery / Resume Notification Banner */}
      {resumePrompt && !hasStartedExam && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 flex items-center justify-between text-xs font-semibold border-b border-amber-600 shrink-0">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              Phát hiện bài làm chưa hoàn tất tại thời điểm <strong>{Math.floor(resumePrompt.savedTime / 60)} phút {Math.floor(resumePrompt.savedTime % 60)} giây</strong> (Part {resumePrompt.activePart || 1}).
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleResumeExam}
              className="px-2.5 py-1 rounded-md bg-slate-950 text-white hover:bg-slate-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Tiếp Tục Làm Bài
            </button>
            <button
              onClick={handleDiscardResume}
              className="p-1 hover:bg-amber-600 rounded-md transition-colors cursor-pointer"
              title="Bỏ qua phiên làm bài cũ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3.1 Soft-Quarantine Safe-Box Banner (when audio fails or has CORS/network error) */}
      {audioEngine.audioState === 'error' && (
        <div className="bg-amber-50 border-b border-amber-300 px-4 py-3 shadow-xs shrink-0 animate-in fade-in">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                    Cơ Chế Bảo Vệ Soft-Quarantine: Gián Đoạn Luồng Âm Thanh
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                    An Toàn Dữ Liệu
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Link âm thanh gốc không phản hồi (CORS hoặc lỗi mạng). <strong>Tiến trình và câu trả lời của bạn được bảo toàn 100%.</strong> Bạn có thể thử kết nối lại, mở Lời Thoại để làm tiếp hoặc đổi đề khác.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => audioEngine.loadAudio(currentTest.audioUrl || currentTest.fallbackAudioUrl)}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
                title="Thử tải lại âm thanh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử Lại</span>
              </button>
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                title="Mở gỡ băng lời thoại để làm bài"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Xem Lời Thoại</span>
              </button>
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
                title="Chọn bộ đề khác từ thư viện"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kho Đề</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 30s Preparation Countdown Banner */}
      {isPrepActive && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md shrink-0 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 animate-spin shrink-0" />
            <span>
              THỜI GIAN ĐỌC ĐỀ & CHUẨN BỊ (PART {activePart}): Bạn có {prepTimeRemaining}s để quét nhanh câu hỏi và gạch chân từ khóa.
            </span>
          </div>
          <button
            onClick={() => setIsPrepActive(false)}
            className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[11px] font-normal transition-colors cursor-pointer"
          >
            Bỏ qua đếm ngược
          </button>
        </div>
      )}

      {/* 5. Main Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        {!hasStartedExam && !exam.isSubmitted ? (
          /* Welcome & Soundcheck Gate Screen */
          <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-xl mb-5">
              <Headphones className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
              CD-IELTS Simulation Engine
            </span>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              {currentTest.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mb-6 leading-relaxed">
              {currentTest.description}
            </p>

            {/* Instruction Checklist */}
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-6 text-left shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Quy chế thi máy (CD-IELTS Guidelines)</span>
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span>Audio sẽ chỉ phát <strong>01 lần duy nhất</strong> xuyên suốt 4 Part không tạm dừng (trong chế độ Thi Thử).</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span>Có 30 giây chuẩn bị trước mỗi phần và 2 phút kiểm tra lại đáp án ở cuối bài.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span>Dùng phím <strong>Tab</strong> trên bàn phím để chuyển nhanh giữa các ô điền từ.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span>Bôi đen chữ bất kỳ để mở thanh <strong>Tô màu (Highlight 3 màu)</strong> và <strong>Ghi chú</strong>.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
              <button
                onClick={() => setIsSoundcheckOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-slate-500" />
                <span>Kiểm Tra Loa / Tai Nghe</span>
              </button>

              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt Đầu Làm Bài Ngay</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Question Pane Rendering */
          <ListeningQuestionPane 
            testId={currentTestId}
            partData={currentPartData}
            userAnswers={exam.userAnswers}
            onAnswerChange={exam.setAnswer}
            flaggedQuestions={exam.flaggedQuestions}
            onToggleFlag={exam.toggleFlag}
            activeQuestionOrder={exam.activeQuestionOrder}
            onSelectQuestion={exam.setActiveQuestionOrder}
            isSubmitted={exam.isSubmitted}
            fontSizeMode={fontSizeMode}
            contrastTheme={contrastTheme}
            onSeekAudio={(timestamp) => {
              audioEngine.seek(timestamp);
              audioEngine.play();
            }}
          />
        )}
      </div>

      {/* 6. CD-IELTS Bottom Palette Bar */}
      {(hasStartedExam || exam.isSubmitted) && (
        <ListeningPaletteBar 
          totalQuestions={currentTest.totalQuestions}
          activePart={activePart}
          onSelectPart={setActivePart}
          activeQuestionOrder={exam.activeQuestionOrder}
          onSelectQuestion={(order) => {
            exam.setActiveQuestionOrder(order);
            const pNum = Math.ceil(order / 10);
            if (pNum !== activePart) {
              setActivePart(pNum);
            }
          }}
          userAnswers={exam.userAnswers}
          flaggedQuestions={exam.flaggedQuestions}
          onToggleFlag={exam.toggleFlag}
          onSubmitExam={() => setIsConfirmSubmitOpen(true)}
          isSubmitted={exam.isSubmitted}
        />
      )}

      {/* 7. Soundcheck Modal */}
      {isSoundcheckOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Kiểm Tra Âm Thanh (Soundcheck)</h3>
                <p className="text-xs text-slate-500">Đảm bảo bạn nghe rõ tiếng trước khi làm bài</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Bạn có thể nghe thử một đoạn âm thanh ngắn để kiểm tra độ to rõ của tai nghe hoặc loa ngoài. Hãy điều chỉnh thanh âm lượng cho vừa tai trước khi nhấn bắt đầu.
            </p>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsSoundcheckOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  audioEngine.play();
                  setIsSoundcheckOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Phát Nghe Thử</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Confirm Submit Modal */}
      {isConfirmSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Xác Nhận Nộp Bài Thi</h3>
                <p className="text-xs text-slate-500">IELTS Listening Simulation Check</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Số câu đã hoàn thành:</span>
                <span className="font-bold text-slate-900">{exam.answeredCount} / {currentTest.totalQuestions} câu</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Số câu chưa điền:</span>
                <span className={"font-bold " + (currentTest.totalQuestions - exam.answeredCount > 0 ? 'text-amber-600' : 'text-emerald-600')}>
                  {currentTest.totalQuestions - exam.answeredCount} câu
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Sau khi nộp bài, hệ thống sẽ tự động chấm điểm theo thang điểm Cambridge Official Band Score, mở khóa Audio Evidence Locator và bản dịch phân tích chi tiết.
            </p>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tiếp Tục Làm Bài
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Xác Nhận Nộp Bài</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Comprehensive Cambridge Test Report Modal */}
      <ListeningResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        bandResult={bandResult}
        testTitle={currentTest.title}
        onResetExam={() => {
          exam.resetExam();
          audioEngine.seek(0);
          setHasStartedExam(false);
          setBandResult(null);
          try {
            localStorage.removeItem('ielts_listening_last_result_' + currentTestId);
          } catch (e) {}
        }}
        onJumpToQuestion={(order) => {
          exam.setActiveQuestionOrder(order);
          const pNum = Math.ceil(order / 10);
          if (pNum !== activePart) {
            setActivePart(pNum);
          }
        }}
        onSeekAudio={(timestamp) => {
          audioEngine.seek(timestamp);
          audioEngine.play();
        }}
      />

      {/* 10. Karaoke Interactive Transcript Modal */}
      <ListeningTranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        currentTest={currentTest}
        audioEngine={audioEngine}
        activePart={activePart}
        onSelectPart={setActivePart}
        onSaveToVocabNotebook={onSaveToVocabNotebook}
      />

      {/* 11. Listening Library Modal (Browse Cambridge & AI generated tests) */}
      <ListeningLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        allListeningTests={allListeningTests}
        currentTestId={currentTestId}
        onSelectTest={(test) => {
          setCurrentTestId(test.id);
          setIsLibraryOpen(false);
          setActivePart(1);
          setHasStartedExam(true);
          exam.resetExam();
          setBandResult(null);
          if (test.audioUrl) {
            audioEngine.loadAudio(test.audioUrl);
          }
        }}
        onDeleteTest={handleDeleteCustomTest}
        onOpenGenerator={() => {
          setIsLibraryOpen(false);
          setIsGeneratorOpen(true);
        }}
        user={user}
      />

      {/* 12. Listening AI Test Generator from Audio URL Modal */}
      <ListeningURLExerciseGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        apiKey={apiKey}
        model={model}
        onTestGenerated={handleAddCustomTest}
        onOpenSettings={onOpenSettings}
      />

    </div>
  );
}
