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

      {/* Browser Notification Banner (Pre-flight notice) */}
      {!isChrome && !isDismissedBrowserBanner && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between text-xs text-amber-200 shrink-0">
          <div className="flex items-center space-x-2.5 max-w-3xl">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isEdge ? (
                <>
                  Bạn đang dùng <strong>Microsoft Edge</strong>. Để đảm bảo giọng đọc Giám khảo và Micro hoạt động 100% ổn định (không bị Windows ngắt tiếng), <strong>khuyến khích mở web bằng Google Chrome</strong>.
                </>
              ) : (
                <>
                  Trình duyệt này có thể bị hạn chế tính năng Nhận diện giọng nói. <strong>Khuyến khích sử dụng Google Chrome</strong> để có trải nghiệm luyện thi tốt nhất.
                </>
              )}
            </span>
            <button
              onClick={() => setIsSoundcheckOpen(true)}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline ml-1 cursor-pointer shrink-0"
            >
              Kiểm tra thiết bị ngay
            </button>
          </div>
          <button
            onClick={() => setIsDismissedBrowserBanner(true)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer ml-2 shrink-0"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
                </div>

                {/* Examiner Card with Voice Test */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex items-center space-x-3 shrink-0 shadow-md">
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
                  <span className="text-slate-400">Hệ thống sẽ kiểm tra micro và âm lượng trước khi vào thi.</span>
                </div>
                <button
                  onClick={() => setIsSoundcheckOpen(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-purple-900/40 flex items-center space-x-2 transition-all cursor-pointer shrink-0"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kiểm Tra Thiết Bị & Vào Thi</span>
                </button>
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
          alert('Kiểm tra thiết bị thành công! Sang Bước 3 & Bước 4 chúng ta sẽ đưa bạn trực tiếp vào Buồng thi ảo (Virtual Exam Room).');
        }}
      />
    </div>
  );
}
