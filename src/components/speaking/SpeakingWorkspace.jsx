import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Headphones, Play, Pause, Square, Sparkles, BookOpen, 
  Layers, Clock, Award, Shield, User, Settings, AlertCircle, 
  CheckCircle2, ChevronRight, RefreshCw, BarChart2, Flame,
  FileText, Compass, MessageSquare, ArrowRight, Info, ShieldCheck,
  RotateCcw
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
  
  // Soundcheck modal state
  const [isSoundcheckOpen, setIsSoundcheckOpen] = useState(false);

  // Practice Mode State
  const [practicePart, setPracticePart] = useState(1); // 1 | 2 | 3
  const [selectedP1TopicId, setSelectedP1TopicId] = useState(SPEAKING_PART1_TOPICS[0]?.id || 'p1-work-study');
  const [selectedP2CueCardId, setSelectedP2CueCardId] = useState(SPEAKING_PART2_CUECARDS[0]?.id || 'p2-tech-device');
  const [activeP1QuestionIndex, setActiveP1QuestionIndex] = useState(0);
  const [showVocabHints, setShowVocabHints] = useState(true);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isPlayingPracticeAudio, setIsPlayingPracticeAudio] = useState(false);
  const practiceAudioRef = React.useRef(null);

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
          /* PRACTICE STUDIO (PART 1, PART 2, PART 3)                 */
          /* ========================================================= */
          <div className="w-full max-w-4xl space-y-5 animate-in fade-in duration-200">
            
            {/* Practice Part Tabs */}
            <div className="flex items-center justify-center space-x-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
              <button
                onClick={() => setPracticePart(1)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  practicePart === 1 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Part 1: Phỏng Vấn (A.R.E.A)</span>
              </button>
              <button
                onClick={() => setPracticePart(2)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  practicePart === 2 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Part 2: Cue Card & Pacing</span>
              </button>
              <button
                onClick={() => setPracticePart(3)}
                className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  practicePart === 3 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Part 3: Thảo Luận (PEEL)</span>
              </button>
            </div>

            {/* PART 1 PRACTICE VIEW */}
            {practicePart === 1 && (
              <div className="space-y-4">
                {/* Topic Selector */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                  {SPEAKING_PART1_TOPICS.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedP1TopicId(topic.id);
                        setActiveP1QuestionIndex(0);
                        setShowSampleAnswer(false);
                        speechEngine.resetTranscript();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedP1TopicId === topic.id
                          ? 'bg-purple-600 text-white border border-purple-400'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>

                {/* Question Card */}
                {activeP1Topic.questions?.[activeP1QuestionIndex] && (
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Câu {activeP1QuestionIndex + 1} / {activeP1Topic.questions.length}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{activeP1Topic.title}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setShowVocabHints(!showVocabHints)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                        >
                          {showVocabHints ? 'Ẩn Gợi Ý Từ Vựng' : 'Hiện Từ Vựng Band 7+'}
                        </button>
                        <button
                          onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                          className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 transition-colors cursor-pointer"
                        >
                          {showSampleAnswer ? 'Ẩn Bài Mẫu' : 'Xem Bài Mẫu 8.5'}
                        </button>
                      </div>
                    </div>

                    {/* The Question Text with TTS play button */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Câu hỏi khảo thí:</span>
                        <button
                          onClick={() => handleReadQuestion(activeP1Topic.questions[activeP1QuestionIndex].question)}
                          className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{speechEngine.isSpeaking ? 'Đang đọc...' : 'Nghe Giám khảo đọc câu hỏi'}</span>
                        </button>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                        "{activeP1Topic.questions[activeP1QuestionIndex].question}"
                      </h2>
                      <p className="text-xs text-slate-400 italic">
                        💡 {activeP1Topic.questions[activeP1QuestionIndex].strategy}
                      </p>
                    </div>

                    {/* LIVE INTERACTIVE PRACTICE RECORDER BOX WITH HIGH CONTRAST & PLAYBACK */}
                    <div className={`p-4 rounded-2xl border space-y-3 transition-all ${
                      speechEngine.isListening 
                        ? 'bg-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30' 
                        : 'bg-slate-950 border-slate-800/90'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-1.5 rounded-lg border transition-colors ${
                            speechEngine.isListening 
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' 
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {speechEngine.isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider block text-white">
                              {speechEngine.isListening ? 'Đang Thu Âm Trả Lời' : 'Luyện Nói Cho Câu Này'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {speechEngine.isListening ? 'Giọng bạn đang được phân tích trực tiếp' : 'Mic hiện đang tắt'}
                            </span>
                          </div>
                        </div>

                        {/* High Contrast Mic Badge */}
                        <div className="flex items-center space-x-2">
                          {speechEngine.isListening ? (
                            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              <span>REC • MICRO ĐANG BẬT</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold">
                              <span>ĐÃ TẮT MIC</span>
                            </span>
                          )}
                          {speechEngine.isListening && (
                            <span className="text-[11px] text-emerald-400 font-mono font-bold">
                              {speechEngine.micLevel}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Organic Waveform visualizer */}
                      <div className={`h-16 rounded-xl border overflow-hidden transition-all ${
                        speechEngine.isListening 
                          ? 'bg-slate-900 border-emerald-500/40 ring-2 ring-emerald-500/20' 
                          : 'bg-slate-900 border-slate-800'
                      }`}>
                        <SpeechWaveVisualizer
                          mode={speechEngine.isListening ? 'candidate_speaking' : speechEngine.isSpeaking ? 'examiner_speaking' : 'idle'}
                          analyserNode={speechEngine.analyserNode}
                          className="w-full h-full"
                        />
                      </div>

                      {/* Realtime Live Transcript Preview */}
                      <div className={`p-3 rounded-xl border text-xs min-h-[50px] flex items-center justify-between transition-colors ${
                        speechEngine.isListening 
                          ? 'bg-slate-900 border-emerald-500/40 text-slate-100' 
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}>
                        <p className="italic leading-relaxed">
                          {speechEngine.transcript || speechEngine.interimTranscript ? (
                            <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                          ) : (
                            <span className="text-slate-500">Bấm nút "Bật Micro Luyện Nói" bên dưới và bắt đầu trả lời bằng tiếng Anh...</span>
                          )}
                        </p>
                        {speechEngine.transcript && !speechEngine.isListening && (
                          <button
                            onClick={() => {
                              speechEngine.resetTranscript();
                              const currentClipKey = `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`;
                              if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(currentClipKey);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors ml-2 shrink-0 cursor-pointer"
                            title="Xóa làm lại câu này"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Controls & High Contrast Action Button */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                        <span className="text-[11px] text-slate-400">
                          {speechEngine.transcript ? (
                            <span className="text-purple-300 font-semibold">Đã nói: {speechEngine.transcript.split(' ').filter(Boolean).length} từ</span>
                          ) : (
                            '💡 Mẹo: Bấm Space để bật/tắt mic nhanh'
                          )}
                        </span>

                        <button
                          onClick={() => {
                            if (practiceAudioRef.current) {
                              practiceAudioRef.current.pause();
                              setIsPlayingPracticeAudio(false);
                            }
                            handleTogglePracticeRecord(`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`);
                          }}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                            speechEngine.isListening 
                              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-2 ring-rose-400 animate-pulse' 
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                          }`}
                        >
                          {speechEngine.isListening ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>DỪNG THU ÂM (HOÀN TẤT)</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3.5 h-3.5" />
                              <span>BẬT MICRO LUYỆN NÓI</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Playback Voice Clip for Practice Answer */}
                      {(() => {
                        const clipKey = `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`;
                        const activeClip = speechEngine.audioClips[clipKey];
                        if (!activeClip || speechEngine.isListening) return null;

                        const handleTogglePlayPractice = () => {
                          if (!activeClip?.url) return;
                          if (!practiceAudioRef.current) {
                            practiceAudioRef.current = new Audio(activeClip.url);
                            practiceAudioRef.current.onended = () => setIsPlayingPracticeAudio(false);
                            practiceAudioRef.current.onerror = () => setIsPlayingPracticeAudio(false);
                          } else if (practiceAudioRef.current.src !== activeClip.url) {
                            practiceAudioRef.current.src = activeClip.url;
                            practiceAudioRef.current.onended = () => setIsPlayingPracticeAudio(false);
                            practiceAudioRef.current.onerror = () => setIsPlayingPracticeAudio(false);
                          }

                          if (isPlayingPracticeAudio) {
                            practiceAudioRef.current.pause();
                            practiceAudioRef.current.currentTime = 0;
                            setIsPlayingPracticeAudio(false);
                          } else {
                            practiceAudioRef.current.play().then(() => {
                              setIsPlayingPracticeAudio(true);
                            }).catch(() => setIsPlayingPracticeAudio(false));
                          }
                        };

                        const handleConfirmPracticeClip = () => {
                          if (practiceAudioRef.current) {
                            practiceAudioRef.current.pause();
                            setIsPlayingPracticeAudio(false);
                          }
                          if (speechEngine.deleteAudioClip) {
                            speechEngine.deleteAudioClip(clipKey);
                          }
                        };

                        return (
                          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                                <span>Nghe lại câu trả lời vừa thu ({activeClip.duration || 1}s):</span>
                              </span>
                              <span className="text-[10px] text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/40">
                                RAM-Only
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleTogglePlayPractice}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                                  isPlayingPracticeAudio
                                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                                }`}
                              >
                                {isPlayingPracticeAudio ? (
                                  <>
                                    <Pause className="w-3.5 h-3.5 fill-current" />
                                    <span>Tạm Dừng</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>🔊 Nghe Lại Giọng Của Bạn</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={handleConfirmPracticeClip}
                                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1 cursor-pointer transition-colors"
                                title="Xóa file âm thanh tạm để giải phóng RAM"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>OK & Xóa File Tạm (Tiết Kiệm Bộ Nhớ)</span>
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Vocab Hints Box */}
                    {showVocabHints && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Gợi ý Collocations & Idioms Band 7.5+:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeP1Topic.questions[activeP1QuestionIndex].vocabHints?.map((v, idx) => (
                            <div key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs flex items-center space-x-1">
                              <span className="font-bold text-purple-300">{v.phrase}</span>
                              <span className="text-slate-400 text-[11px]">({v.meaningVi})</span>
                              {onSaveToVocabNotebook && (
                                <button
                                  onClick={() => onSaveToVocabNotebook({
                                    id: `v-spk-${Date.now()}-${idx}`,
                                    phrase: v.phrase,
                                    meaningVi: v.meaningVi,
                                    example: activeP1Topic.questions[activeP1QuestionIndex].sampleAnswer,
                                    topic: 'speaking'
                                  })}
                                  className="ml-1 text-[10px] text-purple-400 hover:text-purple-200 cursor-pointer font-bold"
                                  title="Lưu vào Sổ tay từ vựng"
                                >
                                  +Lưu
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sample Answer Box */}
                    {showSampleAnswer && (
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                            Câu trả lời mẫu Band 8.5+ (Theo công thức A.R.E.A):
                          </span>
                          <button
                            onClick={() => handleReadQuestion(activeP1Topic.questions[activeP1QuestionIndex].sampleAnswer)}
                            className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Nghe đọc mẫu</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                          "{activeP1Topic.questions[activeP1QuestionIndex].sampleAnswer}"
                        </p>
                      </div>
                    )}

                    {/* Question Navigation */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        disabled={activeP1QuestionIndex === 0}
                        onClick={() => {
                          if (speechEngine.isListening) speechEngine.stopListening();
                          setActiveP1QuestionIndex(prev => prev - 1);
                          setShowSampleAnswer(false);
                          speechEngine.resetTranscript();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        ← Câu Trước
                      </button>
                      <button
                        disabled={activeP1QuestionIndex >= activeP1Topic.questions.length - 1}
                        onClick={() => {
                          if (speechEngine.isListening) speechEngine.stopListening();
                          setActiveP1QuestionIndex(prev => prev + 1);
                          setShowSampleAnswer(false);
                          speechEngine.resetTranscript();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Câu Tiếp Theo</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PART 2 PRACTICE VIEW */}
            {practicePart === 2 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Part 2 Long Turn
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{activeP2Card.category}</span>
                  </div>
                  <select
                    value={selectedP2CueCardId}
                    onChange={(e) => setSelectedP2CueCardId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-200 font-bold focus:outline-none cursor-pointer"
                  >
                    {SPEAKING_PART2_CUECARDS.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                {/* Cue Card Frame */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-purple-500/30 space-y-3 shadow-inner">
                  <h3 className="text-base sm:text-lg font-bold text-white">{activeP2Card.title}</h3>
                  <p className="text-xs font-semibold text-purple-400">{activeP2Card.cueCard.intro}</p>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-slate-300">
                    {activeP2Card.cueCard.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>

                {/* 4-Quadrant Mindmap Notes Recommendation */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Gợi ý dàn bài 1 phút nháp (4-Quadrant Grid):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeP2Card.mindmapNotes?.map((note, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                        • {note}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-up question info */}
                <div className="text-xs text-slate-400 italic">
                  <strong>Câu hỏi mở rộng (Rounding-off):</strong> "{activeP2Card.examinerFollowUp}"
                </div>
              </div>
            )}

            {/* PART 3 PRACTICE VIEW */}
            {practicePart === 3 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Part 3: Thảo Luận Hai Chiều
                  </span>
                  <span className="text-xs font-bold text-slate-300">{activeP3Set.topic}</span>
                </div>

                <div className="space-y-4">
                  {activeP3Set.questions?.map((q, idx) => (
                    <div key={q.qId || idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-400 uppercase">Câu hỏi {idx + 1} ({q.analysisType})</span>
                        <button
                          onClick={() => handleReadQuestion(q.question)}
                          className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Nghe đọc</span>
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-white">"{q.question}"</h4>
                      <p className="text-xs text-slate-400 italic">💡 Chiến lược PEEL: {q.strategy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

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
