import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Headphones, Play, Pause, Square, Sparkles, BookOpen, 
  Layers, Clock, Award, Shield, User, Settings, AlertCircle, 
  CheckCircle2, ChevronRight, RefreshCw, BarChart2, Flame,
  FileText, Compass, MessageSquare, ArrowRight, Info, ShieldCheck,
  RotateCcw, X
} from 'lucide-react';
import { 
  SPEAKING_EXAMINER_PROFILES, 
  SPEAKING_PART1_TOPICS, 
  SPEAKING_PART2_CUECARDS, 
  SPEAKING_PART3_QUESTIONS, 
  SPEAKING_MOCK_TEST_PACKS 
} from '../../data/speakingTopics';
import { useSpeechEngine } from '../../hooks/useSpeechEngine';
import SpeakingSoundcheckModal from './SpeakingSoundcheckModal';
import SpeechWaveVisualizer from './SpeechWaveVisualizer';
import SpeakingPracticePane from './SpeakingPracticePane';
import SpeakingIdeaMatrixModal from './SpeakingIdeaMatrixModal';
import SpeakingShadowingModal from './SpeakingShadowingModal';
import SpeakingExaminerRoom from './SpeakingExaminerRoom';

export default function SpeakingWorkspace({
  apiKey,
  model,
  onOpenSettings,
  user,
  onOpenTheory,
  onSaveToVocabNotebook,
  onSpeakingSubmitted
}) {
  // 1. Workspace Configuration State
  const [activeMode, setActiveMode] = useState('mock'); // 'mock' | 'practice'
  const [selectedExaminerId, setSelectedExaminerId] = useState(() => {
    return localStorage.getItem('ielts_speaking_examiner') || 'examiner-arthur';
  });
  const [selectedMockId, setSelectedMockId] = useState(SPEAKING_MOCK_TEST_PACKS[0]?.id || 'mock-spk-tech-future');
  
  // Modals state
  const [isSoundcheckOpen, setIsSoundcheckOpen] = useState(false);
  const [isIdeaMatrixOpen, setIsIdeaMatrixOpen] = useState(false);
  const [isShadowingOpen, setIsShadowingOpen] = useState(false);
  const [isInMockExamRoom, setIsInMockExamRoom] = useState(false);
  const [completedExamData, setCompletedExamData] = useState(null);

  // Practice Mode State
  const [practicePart, setPracticePart] = useState(1); // 1 | 2 | 3
  const [selectedP1TopicId, setSelectedP1TopicId] = useState(SPEAKING_PART1_TOPICS[0]?.id || 'p1-work-study');
  const [selectedP2CueCardId, setSelectedP2CueCardId] = useState(SPEAKING_PART2_CUECARDS[0]?.id || 'p2-tech-device');
  const [activeP1QuestionIndex, setActiveP1QuestionIndex] = useState(0);
  const [showVocabHints, setShowVocabHints] = useState(true);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isPlayingPracticeAudio, setIsPlayingPracticeAudio] = useState(false);
  const practiceAudioRef = React.useRef(null);

  const [isDismissedBrowserBanner, setIsDismissedBrowserBanner] = useState(false);

  // Accurate browser detection
  const isEdge = typeof window !== 'undefined' && /Edg\//i.test(navigator.userAgent);
  const isChrome = typeof window !== 'undefined' && /Chrome\//i.test(navigator.userAgent) && !isEdge;
  const isSafariOrFirefox = typeof window !== 'undefined' && !isChrome && !isEdge;

  // Sync Examiner preference
  useEffect(() => {
    localStorage.setItem('ielts_speaking_examiner', selectedExaminerId);
  }, [selectedExaminerId]);

  const activeExaminer = SPEAKING_EXAMINER_PROFILES.find(e => e.id === selectedExaminerId) || SPEAKING_EXAMINER_PROFILES[0];
  const activeMockPack = SPEAKING_MOCK_TEST_PACKS.find(m => m.id === selectedMockId) || SPEAKING_MOCK_TEST_PACKS[0];

  // Derive active items for Mock Pack
  const mockP1 = SPEAKING_PART1_TOPICS.find(p => p.id === activeMockPack.part1TopicId) || SPEAKING_PART1_TOPICS[0];
  const mockP2 = SPEAKING_PART2_CUECARDS.find(p => p.id === activeMockPack.part2CueCardId) || SPEAKING_PART2_CUECARDS[0];
  const mockP3 = SPEAKING_PART3_QUESTIONS.find(p => p.linkedPart2Id === activeMockPack.part3DiscussionId) || SPEAKING_PART3_QUESTIONS[0];

  // Practice items
  const activeP1Topic = SPEAKING_PART1_TOPICS.find(p => p.id === selectedP1TopicId) || SPEAKING_PART1_TOPICS[0];
  const activeP2Card = SPEAKING_PART2_CUECARDS.find(p => p.id === selectedP2CueCardId) || SPEAKING_PART2_CUECARDS[0];
  const activeP3Set = SPEAKING_PART3_QUESTIONS.find(p => p.linkedPart2Id === selectedP2CueCardId) || SPEAKING_PART3_QUESTIONS[0];

  // 2. Hook up Speech Engine Core
  const speechEngine = useSpeechEngine({
    examinerId: selectedExaminerId
  });

  // Handle Listen to Question (TTS)
  const handleReadQuestion = (questionText) => {
    if (speechEngine.isSpeaking) {
      speechEngine.stopSpeaking();
    } else {
      speechEngine.speak(questionText, { examinerId: selectedExaminerId });
    }
  };

  // Handle Candidate Practice Answer (Mic toggle)
  const handleTogglePracticeRecord = (questionId) => {
    if (speechEngine.isListening) {
      speechEngine.stopListening();
    } else {
      speechEngine.resetTranscript();
      speechEngine.startListening(questionId);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* 1. TOP HEADER TOOLBAR (Theater Mode) */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shrink-0">
        
        {/* Left: Branding & Mode Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm text-white tracking-tight">Speaking Studio</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AI Examiner
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Khảo thí 1-on-1 • 4 Tiêu chí Cambridge
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Mode Pill Switcher */}
          <div className="flex bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveMode('mock')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'mock' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Phòng Thi Thử
            </button>
            <button
              onClick={() => setActiveMode('practice')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'practice' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Luyện Tập Tự Do
            </button>
          </div>
        </div>

        {/* Right: Examiner Profile Picker & Quick Tools */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Direct Enter Exam Room Button on Top Toolbar */}
          <button
            onClick={() => {
              if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
              if (speechEngine.isListening) speechEngine.stopListening();
              setIsInMockExamRoom(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-purple-900/40 transition-all cursor-pointer shrink-0 animate-pulse hover:animate-none"
            title="Bấm để vào phòng thi mô phỏng với Giám khảo AI ngay lập tức"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>VÀO PHÒNG THI</span>
          </button>

          {/* Soundcheck Quick Button */}
          <button
            onClick={() => setIsSoundcheckOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
            title="Kiểm tra Micro và Âm lượng loa"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kiểm Tra Thiết Bị</span>
          </button>

          {/* Examiner Picker */}
          <div className="relative flex items-center bg-slate-800/60 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs">
            <span className="text-base mr-1.5">{activeExaminer.avatar}</span>
            <select
              value={selectedExaminerId}
              onChange={(e) => setSelectedExaminerId(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer pr-1"
            >
              {SPEAKING_EXAMINER_PROFILES.map(ex => (
                <option key={ex.id} value={ex.id} className="bg-slate-900 text-slate-200">
                  {ex.name} ({ex.accent.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Theory Handbook Button */}
          {onOpenTheory && (
            <button
              onClick={onOpenTheory}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-purple-300 hover:text-purple-200 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Mở Cẩm Nang Lý Thuyết Speaking"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cẩm Nang Speaking</span>
            </button>
          )}

          {/* Settings Shortcut */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Cài đặt API & Âm thanh"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. BROWSER PRE-FLIGHT NOTICE BANNER */}
      {isEdge ? (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/50 px-4 py-2.5 flex items-center justify-between text-xs text-amber-100 shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5 max-w-4xl">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase shrink-0">
              Khuyên dùng Chrome
            </span>
            <span className="leading-snug">
              Bạn đang duyệt bằng <strong>Microsoft Edge</strong>. Trình duyệt Edge có thể gặp lỗi ngắt tiếng (không nghe thấy giám khảo). <strong>Khuyến nghị mở website bằng Google Chrome</strong> để có trải nghiệm giọng đọc và micro ổn định nhất!
            </span>
          </div>
          <button
            onClick={() => setIsSoundcheckOpen(true)}
            className="ml-3 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
          >
            Kiểm tra âm thanh ngay
          </button>
        </div>
      ) : !isChrome ? (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-500/50 px-4 py-2.5 flex items-center justify-between text-xs text-rose-100 shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5 max-w-4xl">
            <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-black text-[10px] uppercase shrink-0">
              Khuyên dùng Chrome
            </span>
            <span>
              Trình duyệt này có thể không hỗ trợ ghi âm trực tiếp. <strong>Vui lòng sử dụng Google Chrome</strong> để đảm bảo thi Speaking mượt mà.
            </span>
          </div>
          <button
            onClick={() => setIsSoundcheckOpen(true)}
            className="ml-3 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
          >
            Kiểm tra thiết bị
          </button>
        </div>
      ) : null}

      {/* 2. MAIN CONTENT STAGE */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start">
        
        {activeMode === 'mock' ? (
          /* ========================================================= */
          /* MOCK TEST PREVIEW & SELECTION STAGE                       */
          /* ========================================================= */
          <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-200">
            
            {/* Top Welcome Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800/40 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Mô Phỏng 100% Khảo Thí IDP / BC
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• 11 – 14 Phút Chuẩn Mực</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Phòng Thi Thử IELTS Speaking Với Giám Khảo AI
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Trải nghiệm tương tác giọng nói 1-on-1 trực tiếp với Giám khảo AI: hỏi đáp Part 1, 60s nháp ghi chú Part 2, và câu hỏi follow-up phản biện chuyên sâu ở Part 3.
                  </p>

                  {/* Persistent Browser Advice Box */}
                  <div className={`mt-3 p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 ${
                    isChrome 
                      ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200' 
                      : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                  }`}>
                    <span className="text-base">{isChrome ? '🚀' : '💡'}</span>
                    <div className="leading-snug">
                      {isChrome ? (
                        <span><strong>Trình duyệt tối ưu:</strong> Bạn đang dùng Google Chrome chuẩn 100% cho Web Speech & Audio.</span>
                      ) : (
                        <span>
                          <strong>Khuyên dùng Google Chrome:</strong> Nếu bạn đang dùng {isEdge ? 'Microsoft Edge' : 'trình duyệt khác'} và không nghe thấy tiếng Giám khảo đọc, vui lòng mở trang này trên <strong>Google Chrome</strong> để chạy ổn định nhất.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Examiner Card with Voice Test & Instant Enter Button */}
                <div className="flex flex-col gap-2.5 shrink-0">
                  <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-center space-x-3 shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-2xl">
                      {activeExaminer.avatar}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                        Giám Khảo Khảo Thí
                      </span>
                      <span className="font-extrabold text-sm text-white block">{activeExaminer.name}</span>
                      <button
                        onClick={() => handleReadQuestion(`Good morning. I am ${activeExaminer.name}. Welcome to your IELTS Speaking test.`)}
                        className="text-[11px] text-purple-300 hover:text-purple-200 font-bold flex items-center space-x-1 mt-0.5 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{speechEngine.isSpeaking ? 'Đang đọc...' : 'Nghe giọng đọc'}</span>
                      </button>
                    </div>
                  </div>

                  {/* GIANT TOP ENTER BUTTON */}
                  <button
                    onClick={() => {
                      if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
                      if (speechEngine.isListening) speechEngine.stopListening();
                      setIsInMockExamRoom(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-950/80 flex items-center justify-center space-x-2 transition-all cursor-pointer ring-2 ring-purple-400/50 hover:scale-102"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>VÀO PHÒNG THI NGAY (1 CLICK)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Select Mock Test Pack */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Chọn Bộ Đề Thi Thử (Mock Test Pack)</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">4 Gói đề chuẩn hóa Cambridge</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SPEAKING_MOCK_TEST_PACKS.map(pack => {
                  const isSelected = selectedMockId === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => setSelectedMockId(pack.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSelected 
                          ? 'bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-950/50' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-purple-300 border border-slate-700">
                            {pack.difficulty} • Target {pack.targetBand}
                          </span>
                          <span className="text-xs text-slate-400 font-bold flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{pack.estTime}</span>
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white leading-snug">{pack.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{pack.summary}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Đủ Part 1, 2, 3</span>
                        <div className="flex items-center space-x-1 text-purple-400 font-bold">
                          <span>{isSelected ? 'Đang chọn đề này' : 'Bấm để chọn'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Details Breakdown (Part 1, 2, 3 Overview) */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Info className="w-3.5 h-3.5 text-purple-400" />
                <span>Cấu Trúc Chi Tiết Của Gói Đề Đang Chọn</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Part 1 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>PART 1: Phỏng Vấn</span>
                    <span>4 - 5 phút</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">{mockP1.title}</h5>
                  <p className="text-[11px] text-slate-400">{mockP1.questions?.length || 3} câu hỏi về thói quen, góc nhìn cá nhân</p>
                </div>

                {/* Part 2 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>PART 2: Cue Card</span>
                    <span>3 - 4 phút</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 line-clamp-1">{mockP2.title}</h5>
                  <p className="text-[11px] text-slate-400">1 phút nháp 4 ô ma trận + 2 phút nói liên tục</p>
                </div>

                {/* Part 3 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>PART 3: Thảo Luận</span>
                    <span>4 - 5 phút</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-200">{mockP3.topic}</h5>
                  <p className="text-[11px] text-slate-400">{mockP3.questions?.length || 3} câu hỏi phản biện & câu hỏi follow-up</p>
                </div>
              </div>

              {/* Ready Action Box */}
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                <div className="text-xs text-slate-300 text-center sm:text-left">
                  <span className="font-bold text-white block">Sẵn sàng bước vào phòng thi?</span>
                  <span className="text-slate-400">Bạn có thể kiểm tra thiết bị hoặc vào phòng thi ảo với Giám khảo AI ngay lập tức.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsSoundcheckOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white font-bold text-xs border border-purple-500/30 flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
                    title="Kiểm tra loa và mic trước"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Kiểm Tra Thiết Bị</span>
                  </button>

                  <button
                    onClick={() => {
                      if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
                      if (speechEngine.isListening) speechEngine.stopListening();
                      setIsInMockExamRoom(true);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-900/40 flex items-center space-x-2 transition-all cursor-pointer shrink-0 animate-pulse hover:animate-none"
                    title="Vào thẳng phòng thi trực tiếp với Giám khảo"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>VÀO PHÒNG THI NGAY</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================= */
          /* PRACTICE STUDIO (PART 1, PART 2, PART 3) WITH IDEA MATRIX & SHADOWING */
          /* ========================================================= */
          <SpeakingPracticePane
            practicePart={practicePart}
            setPracticePart={setPracticePart}
            part1Topics={SPEAKING_PART1_TOPICS}
            selectedP1TopicId={selectedP1TopicId}
            setSelectedP1TopicId={setSelectedP1TopicId}
            activeP1QuestionIndex={activeP1QuestionIndex}
            setActiveP1QuestionIndex={setActiveP1QuestionIndex}
            part2Cards={SPEAKING_PART2_CUECARDS}
            selectedP2CueCardId={selectedP2CueCardId}
            setSelectedP2CueCardId={setSelectedP2CueCardId}
            part3Sets={SPEAKING_PART3_QUESTIONS}
            activeP3Set={activeP3Set}
            speechEngine={speechEngine}
            activeExaminer={activeExaminer}
            onOpenIdeaMatrix={() => setIsIdeaMatrixOpen(true)}
            onOpenShadowing={() => setIsShadowingOpen(true)}
            onSaveToVocabNotebook={onSaveToVocabNotebook}
          />
        )}

      </div>

      {/* IDEA MATRIX MODAL */}
      <SpeakingIdeaMatrixModal
        isOpen={isIdeaMatrixOpen}
        onClose={() => setIsIdeaMatrixOpen(false)}
        topicTitle={practicePart === 1 ? activeP1Topic?.title : practicePart === 2 ? activeP2Card?.title : activeP3Set?.topic}
        questionText={
          practicePart === 1 
            ? activeP1Topic?.questions?.[activeP1QuestionIndex]?.question 
            : practicePart === 2 
            ? activeP2Card?.title 
            : activeP3Set?.questions?.[0]?.question
        }
        part={practicePart}
      />

      {/* SHADOWING STUDIO MODAL */}
      <SpeakingShadowingModal
        isOpen={isShadowingOpen}
        onClose={() => setIsShadowingOpen(false)}
        sampleText={
          practicePart === 1 
            ? (activeP1Topic?.questions?.[activeP1QuestionIndex]?.sampleAnswer || '')
            : practicePart === 2 
            ? (activeP2Card?.sampleAnswer || '')
            : (activeP3Set?.questions?.[0]?.sampleAnswer || '')
        }
        topicTitle={practicePart === 1 ? activeP1Topic?.title : practicePart === 2 ? activeP2Card?.title : activeP3Set?.topic}
        examiner={activeExaminer}
        speechEngine={speechEngine}
      />

      {/* 3. SOUNDCHECK DEVICE CALIBRATION MODAL */}
      <SpeakingSoundcheckModal
        isOpen={isSoundcheckOpen}
        onClose={() => setIsSoundcheckOpen(false)}
        examiner={activeExaminer}
        speechEngine={speechEngine}
        onPassedSoundcheck={() => {
          setIsSoundcheckOpen(false);
          setIsInMockExamRoom(true);
        }}
      />

      {/* 4. STEP 4: AI VIRTUAL EXAM ROOM (THEATER MODE 100dvh) */}
      {isInMockExamRoom && (
        <SpeakingExaminerRoom
          examiner={activeExaminer}
          mockPack={activeMockPack}
          part1Topic={mockP1}
          part2Card={mockP2}
          part3Set={mockP3}
          speechEngine={speechEngine}
          onExitRoom={() => {
            setIsInMockExamRoom(false);
            if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
            if (speechEngine.isListening) speechEngine.stopListening();
          }}
          onFinishExam={(finalTranscript, meta) => {
            setIsInMockExamRoom(false);
            setCompletedExamData({ finalTranscript, meta });
            if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
            if (speechEngine.isListening) speechEngine.stopListening();
            if (onSpeakingSubmitted) {
              onSpeakingSubmitted(finalTranscript, meta);
            }
          }}
        />
      )}
    </div>
  );
}
