import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Headphones, 
  Volume2, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Bookmark,
  Share2,
  X,
  RefreshCw,
  Sun,
  Moon,
  Type
} from 'lucide-react';
import AudioPlayerBar from './AudioPlayerBar';
import { useAudioEngine } from '../../hooks/useAudioEngine';
import { INITIAL_LISTENING_TESTS } from '../../data/listeningTasks';

const SNAPSHOT_KEY_PREFIX = 'ielts_listening_snapshot_';

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
  // 1. Test Selection & Exam Mode
  const [currentTestId, setCurrentTestId] = useState(initialTestId);
  const [examMode, setExamMode] = useState(initialExamMode); // 'strict' | 'practice'
  const [activePart, setActivePart] = useState(1);
  const [hasStartedExam, setHasStartedExam] = useState(false);
  const [isSoundcheckOpen, setIsSoundcheckOpen] = useState(false);
  
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
    return INITIAL_LISTENING_TESTS.find(t => t.id === currentTestId) || INITIAL_LISTENING_TESTS[0];
  }, [currentTestId]);

  // Current Part Object
  const currentPartData = useMemo(() => {
    return currentTest.parts.find(p => p.partNumber === activePart) || currentTest.parts[0];
  }, [currentTest, activePart]);

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

  // Check for prior interrupted session on mount
  useEffect(() => {
    try {
      const savedSnapshot = localStorage.getItem(`${SNAPSHOT_KEY_PREFIX}${currentTestId}`);
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
          isCompleted: false
        };
        localStorage.setItem(`${SNAPSHOT_KEY_PREFIX}${currentTestId}`, JSON.stringify(snapshot));
      } catch (e) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [hasStartedExam, currentTestId, activePart, audioEngine.currentTime, examMode]);

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

  // Handle Autoplay unlock and begin exam
  const handleStartExam = async () => {
    await audioEngine.unlockAudio();
    setHasStartedExam(true);
    // Start 30s prep visual countdown
    setIsPrepActive(true);
    setPrepTimeRemaining(30);
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
      localStorage.removeItem(`${SNAPSHOT_KEY_PREFIX}${currentTestId}`);
    } catch (e) {}
    setResumePrompt(null);
  };

  // Accessibility styling classes
  const fontClass = fontSizeMode === 'large' ? 'text-base' : fontSizeMode === 'xlarge' ? 'text-lg' : 'text-sm';
  const themeBg = contrastTheme === 'dark' 
    ? 'bg-slate-900 text-slate-100' 
    : contrastTheme === 'yellowOnBlack' 
    ? 'bg-black text-yellow-300' 
    : 'bg-slate-100 text-slate-900';

  return (
    <div className={`flex-1 flex flex-col min-h-0 h-full overflow-hidden ${themeBg} ${fontClass}`}>
      
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

          {/* Right: Accessibility Controls & Countdown Timer */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Contrast theme toggle */}
            <button
              onClick={() => setContrastTheme(prev => prev === 'standard' ? 'dark' : prev === 'dark' ? 'yellowOnBlack' : 'standard')}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
              title="Đổi độ tương phản màu"
            >
              Theme
            </button>
            {/* Font Size toggle */}
            <button
              onClick={() => setFontSizeMode(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal')}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700"
              title="Đổi cỡ chữ"
            >
              Cỡ chữ
            </button>
            {/* Countdown Clock */}
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {Math.floor((audioEngine.duration - audioEngine.currentTime) / 60)}:
                {Math.floor((audioEngine.duration - audioEngine.currentTime) % 60).toString().padStart(2, '0')}
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
                <span>Thời lượng 30 phút</span>
                <span>•</span>
                <span className="hidden md:inline">Giọng Anh - Úc - Mỹ chuẩn</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center text-xs font-semibold">
              <button
                onClick={() => setExamMode('practice')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  examMode === 'practice'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Luyện Tập
              </button>
              <button
                onClick={() => setExamMode('strict')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                  examMode === 'strict'
                    ? 'bg-red-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Thi Thử</span>
              </button>
            </div>

            <button
              onClick={() => setIsSoundcheckOpen(true)}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-200/70 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Soundcheck</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Sticky Top Audio Player Bar */}
      <AudioPlayerBar
        audioEngine={audioEngine}
        examMode={examMode}
        activePart={activePart}
        onSelectPart={(p) => setActivePart(p)}
        parts={currentTest.parts}
      />

      {/* 3. Preparation Time Banner (30s countdown before each Part) */}
      {isPrepActive && prepTimeRemaining > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" />
            <span>Thời gian chuẩn bị Part {activePart}: Hãy đọc đề và gạch chân từ khóa!</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{prepTimeRemaining}s còn lại</span>
          </div>
        </div>
      )}

      {/* 4. Resume Prompt Modal (Crash Recovery) */}
      {resumePrompt && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Phát hiện bài làm dở dang lúc {Math.floor(resumePrompt.savedTime / 60)}p {Math.floor(resumePrompt.savedTime % 60)}s. Bạn có muốn tiếp tục?</span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleResumeExam}
              className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-2xs"
            >
              Tiếp Tục
            </button>
            <button
              onClick={handleDiscardResume}
              className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-600 font-medium border border-slate-200 transition-colors"
            >
              Bỏ Qua
            </button>
          </div>
        </div>
      )}

      {/* 5. Main Content Container */}
      <div className="flex-1 overflow-y-auto relative pb-28">
        
        {/* If exam has not started, show the Start Overlay / Ready Card */}
        {!hasStartedExam ? (
          <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                Sẵn Sàng Làm Bài Nghe IELTS Listening
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Đeo tai nghe và điều chỉnh âm lượng vừa phải. Khi bấm bắt đầu, âm thanh sẽ được tự động kích hoạt và phát liên tục theo đúng chuẩn thi thật.
              </p>

              {/* Sound Guidelines Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left text-xs text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">Quy chế Cambridge</strong>
                    <span>Audio chỉ phát một lần duy nhất trong chế độ Thi Thử (Strict).</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">Phím Tab thần tốc</strong>
                    <span>Dùng phím Tab trên bàn phím để chuyển nhanh giữa các ô điền từ.</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartExam}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 inline-flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt Đầu Làm Bài & Bật Âm Thanh</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Part Question Content Container */
          <div className="max-w-4xl mx-auto px-3 py-4 sm:px-6 sm:py-6">
            
            {/* Part Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 mb-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider">
                  Part {currentPartData.partNumber} / 4
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentPartData.audioTimestampStart}s – {currentPartData.audioTimestampEnd}s
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                {currentPartData.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-3">
                {currentPartData.context}
              </p>

              {/* Speaker tags */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">Giọng đọc:</span>
                {currentPartData.speakers?.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                    {s.name} ({s.accent} {s.gender})
                  </span>
                ))}
              </div>
            </div>

            {/* Questions Preview for Active Part */}
            <div className="space-y-4">
              {currentPartData.questionGroups?.map((group) => (
                <div key={group.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-2xs">
                  {/* Group Instruction */}
                  <div className="mb-4 pb-3 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {group.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 whitespace-pre-line font-serif italic">
                      {group.instruction}
                    </p>
                    {group.headerTitle && (
                      <div className="mt-2 text-xs font-bold text-red-700 tracking-wider uppercase">
                        {group.headerTitle}
                      </div>
                    )}
                  </div>

                  {/* List of Questions in Group */}
                  <div className="space-y-3">
                    {group.questions?.map((q) => (
                      <div key={q.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                        <div className="flex items-baseline space-x-2">
                          <span className="font-bold text-red-600 shrink-0 w-6">
                            #{q.order}
                          </span>
                          <span className="text-slate-800">
                            {q.questionText}
                          </span>
                        </div>
                        {/* Quick Answer Placeholder (Will be full interactive pane in Step 2) */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <input
                            type="text"
                            placeholder="Nhập đáp án..."
                            tabIndex={100 + q.order}
                            className="px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-hidden w-40"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* 6. Soundcheck Modal */}
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
              Bạn có thể nghe thử một đoạn âm thanh ngắn để kiểm tra độ to rõ của tai nghe hoặc loa ngoài.
            </p>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsSoundcheckOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  audioEngine.play();
                  setIsSoundcheckOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Phát Nghe Thử</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
