import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, Headphones, Play, Pause, Square, Sparkles, BookOpen, 
  Layers, Clock, Award, Shield, User, Settings, AlertCircle, 
  CheckCircle2, ChevronRight, RefreshCw, BarChart2, Flame,
  FileText, Compass, MessageSquare, ArrowRight, Info, ShieldCheck,
  RotateCcw, X, Loader2, GraduationCap, PenTool,
  Maximize2, Minimize2, ChevronDown, Sliders, Zap
} from 'lucide-react';
import { 
  SPEAKING_EXAMINER_PROFILES, 
  SPEAKING_PART1_TOPICS, 
  SPEAKING_PART2_CUECARDS, 
  SPEAKING_PART3_QUESTIONS, 
  SPEAKING_MOCK_TEST_PACKS,
  COMMUNITY_DEFAULT_P1_TOPICS,
  COMMUNITY_DEFAULT_P2_CARDS,
  COMMUNITY_DEFAULT_P3_SETS
} from '../../data/speakingTopics';
import { useSpeechEngine } from '../../hooks/useSpeechEngine';
import { useSpeakingTopics } from '../../hooks/useSpeakingTopics';
import { evaluateSpeakingMockExam, evaluateSpeakingAlgorithmically } from '../../services/geminiService';
import SpeakingSoundcheckModal from './SpeakingSoundcheckModal';
import SpeechWaveVisualizer from './SpeechWaveVisualizer';
import SpeakingPracticePane from './SpeakingPracticePane';
import SpeakingIdeaMatrixModal from './SpeakingIdeaMatrixModal';
import SpeakingShadowingModal from './SpeakingShadowingModal';
import SpeakingExaminerRoom from './SpeakingExaminerRoom';
import SpeakingResultModal from './SpeakingResultModal';
import SpeakingGeneratorModal from './SpeakingGeneratorModal';
import SpeakingPracticeTopicModal from './SpeakingPracticeTopicModal';
import SpeakingMockLibraryModal from './SpeakingMockLibraryModal';
import SpeakingTopHeader from './SpeakingTopHeader';
import SpeakingMockHero from './SpeakingMockHero';
import { useTranslation } from '../../i18n/index.js';

export default function SpeakingWorkspace({
  apiKey,
  model,
  onOpenSettings,
  user,
  onOpenTheory,
  onSaveToVocabNotebook,
  onSpeakingSubmitted,
  openGeneratorTrigger,
  openLibraryTrigger,
  masteredIds = [],
  onToggleMastered,
  isSlimHeader = false,
  toggleSlimHeader
}) {
  const { t, isEn, language } = useTranslation();
  // 1. Workspace Configuration State
  const [activeMode, setActiveMode] = useState('mock'); // 'mock' | 'practice'
  const [selectedExaminerId, setSelectedExaminerId] = useState(() => {
    return localStorage.getItem('ielts_speaking_examiner') || 'examiner-arthur';
  });

  // Topics and Mock Packs Management Hook
  const {
    allP1Topics,
    selectedP1TopicId,
    setSelectedP1TopicId,
    activeP1Topic,
    activeP1QuestionIndex,
    setActiveP1QuestionIndex,
    handleAddP1Topic,
    handleDeleteP1Topic,
    handleAddP1Question,
    handleDeleteP1Question,

    allP2Cards,
    selectedP2CueCardId,
    setSelectedP2CueCardId,
    activeP2Card,
    handleAddP2Card,
    handleDeleteP2Card,

    allP3Sets,
    selectedP3Id,
    setSelectedP3Id,
    activeP3Set,
    handleAddP3Set,
    handleDeleteP3Set,
    handleAddP3Question,
    handleDeleteP3Question,

    allMockPacks,
    setAllMockPacks,
    selectedMockId,
    setSelectedMockId,
    activeMockPack,
    mockFilter,
    setMockFilter,
    mockPackCounts,
    filteredMockPacks,
    currentPackIndex,
    handlePrevPack,
    handleNextPack,
    handlePackGenerated,
    handleDeleteCustomPack,
    mockP1,
    mockP2,
    mockP3
  } = useSpeakingTopics({ isEn });
  
  // Modals state
  const [isMockLibraryOpen, setIsMockLibraryOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorInitialMode, setGeneratorInitialMode] = useState('ai');
  const [isPracticeTopicModalOpen, setIsPracticeTopicModalOpen] = useState(false);
  const [isSoundcheckOpen, setIsSoundcheckOpen] = useState(false);
  const [isIdeaMatrixOpen, setIsIdeaMatrixOpen] = useState(false);
  const [isShadowingOpen, setIsShadowingOpen] = useState(false);
  const [isInMockExamRoom, setIsInMockExamRoom] = useState(false);
  const [completedExamData, setCompletedExamData] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  // Consolidated Mobile Tools Dropdown State
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  // Fault-Tolerant Draft Storage & Recovery
  const [pendingDraft, setPendingDraft] = useState(null);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('ielts_speaking_draft_backup');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && Array.isArray(parsed.finalTranscript) && parsed.finalTranscript.length > 0) {
          setPendingDraft(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse ielts_speaking_draft_backup:', e);
    }
  }, []);

  // Sync external generator trigger
  useEffect(() => {
    if (openGeneratorTrigger) {
      setIsGeneratorOpen(true);
    }
  }, [openGeneratorTrigger]);

  // Sync external library trigger
  useEffect(() => {
    if (openLibraryTrigger) {
      if (activeMode === 'mock') {
        setIsMockLibraryOpen(true);
      }
      setIsPracticeTopicModalOpen(true);
    }
  }, [openLibraryTrigger, activeMode]);

  // Practice Mode State
  const [practicePart, setPracticePart] = useState(1); // 1 | 2 | 3
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

  // Enter mock exam room
  const handleEnterExamRoom = () => {
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine.isListening) speechEngine.stopListening();
    try { sessionStorage.removeItem('ielts_speaking_session_transcript'); } catch (e) {}
    setIsInMockExamRoom(true);
  };

  const handleReEvaluateWithAI = async () => {
    if (!completedExamData?.finalTranscript) return;
    setIsEvaluating(true);
    try {
      const evalResult = await evaluateSpeakingMockExam({
        dialogueHistory: completedExamData.finalTranscript,
        mockPack: activeMockPack,
        examiner: activeExaminer,
        totalDurationSec: completedExamData.meta?.totalDurationSec || 600,
        apiKey,
        model,
        language
      });
      setCurrentEvaluation(evalResult);
    } catch (err) {
      console.error('Error re-evaluating speaking exam with AI:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReEvaluateAlgorithmically = () => {
    if (!completedExamData?.finalTranscript) return;
    const evalResult = evaluateSpeakingAlgorithmically({
      dialogueHistory: completedExamData.finalTranscript,
      mockPack: activeMockPack,
      examiner: activeExaminer,
      totalDurationSec: completedExamData.meta?.totalDurationSec || 600
    });
    setCurrentEvaluation(evalResult);
  };

  const handleRecoverDraft = async (evalWithAi = false) => {
    if (!pendingDraft) return;
    const { finalTranscript, meta, mockPack: draftPack, examiner: draftExaminer } = pendingDraft;
    const targetPack = draftPack || activeMockPack;
    const targetExaminer = draftExaminer || activeExaminer;
    const duration = meta?.totalDurationSec || 600;

    if (evalWithAi && apiKey) {
      setIsEvaluating(true);
      setIsResultModalOpen(true);
      try {
        const evalResult = await evaluateSpeakingMockExam({
          dialogueHistory: finalTranscript,
          mockPack: targetPack,
          examiner: targetExaminer,
          totalDurationSec: duration,
          apiKey,
          model,
          language
        });
        setCurrentEvaluation(evalResult);
        setCompletedExamData({ finalTranscript, meta, evaluation: evalResult });
        try { localStorage.removeItem('ielts_speaking_draft_backup'); } catch (e) {}
        setPendingDraft(null);

        if (onSpeakingSubmitted) {
          onSpeakingSubmitted({
            id: `spk-${Date.now()}`,
            submittedAt: new Date().toISOString(),
            mockPack: { id: targetPack.id, title: targetPack.title, targetBand: targetPack.targetBand },
            examiner: { name: targetExaminer.name, accent: targetExaminer.accent },
            durationSec: duration,
            evaluation: evalResult,
            dialogueHistory: finalTranscript
          });
        }
      } catch (err) {
        console.error('Error recovering draft with AI, fallback to algorithmic:', err);
        const fallbackResult = evaluateSpeakingAlgorithmically({
          dialogueHistory: finalTranscript,
          mockPack: targetPack,
          examiner: targetExaminer,
          totalDurationSec: duration
        });
        setCurrentEvaluation(fallbackResult);
        setCompletedExamData({ finalTranscript, meta, evaluation: fallbackResult });
        try { localStorage.removeItem('ielts_speaking_draft_backup'); } catch (e) {}
        setPendingDraft(null);
      } finally {
        setIsEvaluating(false);
      }
    } else {
      const evalResult = evaluateSpeakingAlgorithmically({
        dialogueHistory: finalTranscript,
        mockPack: targetPack,
        examiner: targetExaminer,
        totalDurationSec: duration
      });
      setCurrentEvaluation(evalResult);
      setCompletedExamData({ finalTranscript, meta, evaluation: evalResult });
      setIsResultModalOpen(true);
      try { localStorage.removeItem('ielts_speaking_draft_backup'); } catch (e) {}
      setPendingDraft(null);

      if (onSpeakingSubmitted) {
        onSpeakingSubmitted({
          id: `spk-${Date.now()}`,
          submittedAt: new Date().toISOString(),
          mockPack: { id: targetPack.id, title: targetPack.title, targetBand: targetPack.targetBand },
          examiner: { name: targetExaminer.name, accent: targetExaminer.accent },
          durationSec: duration,
          evaluation: evalResult,
          dialogueHistory: finalTranscript
        });
      }
    }
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem('ielts_speaking_draft_backup');
    } catch (e) {}
    setPendingDraft(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 h-full min-h-0 overflow-hidden">
      
      {/* 1. TOP HEADER & METRICS BAR (Theater Mode & Mobile-Optimized) */}
      <SpeakingTopHeader
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        selectedExaminerId={selectedExaminerId}
        setSelectedExaminerId={setSelectedExaminerId}
        activeExaminer={activeExaminer}
        isEn={isEn}
        allMockPacks={allMockPacks}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenPracticeTopicModal={() => setIsPracticeTopicModalOpen(true)}
        onOpenSoundcheck={() => setIsSoundcheckOpen(true)}
        onOpenMockLibrary={() => setIsMockLibraryOpen(true)}
        onOpenTheory={onOpenTheory}
        onOpenSettings={onOpenSettings}
        isSlimHeader={isSlimHeader}
        toggleSlimHeader={toggleSlimHeader}
        isMobileToolsOpen={isMobileToolsOpen}
        setIsMobileToolsOpen={setIsMobileToolsOpen}
      />

      {/* RECOVERABLE DRAFT BANNER (Fault-Tolerant Mock Exam Recovery) */}
      {pendingDraft && (
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-500/50 px-4 py-3 flex flex-wrap items-center justify-between text-xs text-purple-100 shrink-0 shadow-lg animate-in slide-in-from-top-2 duration-300 gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  {isEn ? 'Recoverable Speaking Exam Found' : 'Phát hiện bài thi Speaking chưa chấm'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                  {pendingDraft.mockPack?.title || (isEn ? 'Mock Test' : 'Đề thi thử')}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {isEn
                  ? `You have an un-evaluated speaking dialogue record (${pendingDraft.finalTranscript?.length || 0} turns) from your previous session.`
                  : `Bạn có bản ghi cuộc hội thoại thi (${pendingDraft.finalTranscript?.length || 0} lượt nói) từ phiên làm việc trước chưa được chấm điểm.`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => handleRecoverDraft(false)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm"
              title={isEn ? "Instantly grade via 0.02ms offline algorithmic evaluator" : "Chấm điểm ngay tức thì bằng thuật toán ngoại tuyến"}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isEn ? 'Quick Grade (Offline)' : 'Chấm ngay (Offline)'}</span>
            </button>

            {apiKey && (
              <button
                onClick={() => handleRecoverDraft(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shadow-purple-950/40"
                title={isEn ? "Grade using Gemini AI 4-criteria examiner" : "Chấm điểm toàn diện bằng Giám khảo AI"}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'Grade with AI' : 'Chấm bằng AI'}</span>
              </button>
            )}

            <button
              onClick={handleDiscardDraft}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors cursor-pointer"
              title={isEn ? 'Discard draft' : 'Bỏ qua bản nháp này'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. BROWSER PRE-FLIGHT NOTICE BANNER */}
      {isEdge ? (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/50 px-4 py-2.5 flex items-center justify-between text-xs text-amber-100 shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5 max-w-4xl">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase shrink-0">
              {isEn ? "Chrome Recommended" : "Khuyên dùng Chrome"}
            </span>
            <span className="leading-snug">
              {isEn 
                ? <>You are browsing with <strong>Microsoft Edge</strong>. Edge may cause audio cut-offs. <strong>We recommend opening the website in Google Chrome</strong> for the most stable voice & microphone experience!</>
                : <>Bạn đang duyệt bằng <strong>Microsoft Edge</strong>. Trình duyệt Edge có thể gặp lỗi ngắt tiếng (không nghe thấy giám khảo). <strong>Khuyến nghị mở website bằng Google Chrome</strong> để có trải nghiệm giọng đọc và micro ổn định nhất!</>}
            </span>
          </div>
          <button
            onClick={() => setIsSoundcheckOpen(true)}
            className="ml-3 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
          >
            {isEn ? "Soundcheck now" : "Kiểm tra âm thanh ngay"}
          </button>
        </div>
      ) : !isChrome ? (
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-b border-rose-500/50 px-4 py-2.5 flex items-center justify-between text-xs text-rose-100 shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5 max-w-4xl">
            <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-black text-[10px] uppercase shrink-0">
              {isEn ? "Chrome Recommended" : "Khuyên dùng Chrome"}
            </span>
            <span>
              {isEn 
                ? <>This browser may not support direct audio recording. <strong>Please use Google Chrome</strong> to ensure a smooth Speaking test.</>
                : <>Trình duyệt này có thể không hỗ trợ ghi âm trực tiếp. <strong>Vui lòng sử dụng Google Chrome</strong> để đảm bảo thi Speaking mượt mà.</>}
            </span>
          </div>
          <button
            onClick={() => setIsSoundcheckOpen(true)}
            className="ml-3 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-[11px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
          >
            {isEn ? "Check equipment" : "Kiểm tra thiết bị"}
          </button>
        </div>
      ) : null}

      {/* 2. MAIN CONTENT STAGE */}
      <div className="flex-1 overflow-y-auto p-2.5 sm:p-5 flex flex-col items-center justify-start">
        
        {activeMode === 'mock' ? (
          /* ========================================================= */
          /* MOCK TEST PREVIEW & SELECTION STAGE                       */
          /* ========================================================= */
          <SpeakingMockHero
            isEn={isEn}
            isChrome={isChrome}
            isEdge={isEdge}
            allMockPacks={allMockPacks}
            activeMockPack={activeMockPack}
            activeExaminer={activeExaminer}
            selectedMockId={selectedMockId}
            setSelectedMockId={setSelectedMockId}
            filteredMockPacks={filteredMockPacks}
            currentPackIndex={currentPackIndex}
            mockFilter={mockFilter}
            setMockFilter={setMockFilter}
            mockPackCounts={mockPackCounts}
            mockP1={mockP1}
            mockP2={mockP2}
            mockP3={mockP3}
            masteredIds={masteredIds}
            onToggleMastered={onToggleMastered}
            handlePrevPack={handlePrevPack}
            handleNextPack={handleNextPack}
            handleDeleteCustomPack={handleDeleteCustomPack}
            handleEnterExamRoom={handleEnterExamRoom}
            handleReadQuestion={handleReadQuestion}
            speechEngine={speechEngine}
            setIsMockLibraryOpen={setIsMockLibraryOpen}
            setIsGeneratorOpen={setIsGeneratorOpen}
            setGeneratorInitialMode={setGeneratorInitialMode}
            setIsSoundcheckOpen={setIsSoundcheckOpen}
          />
        ) : (
          /* ========================================================= */
          /* PRACTICE STUDIO (PART 1, PART 2, PART 3) WITH IDEA MATRIX & SHADOWING */
          /* ========================================================= */
          <SpeakingPracticePane
            practicePart={practicePart}
            setPracticePart={setPracticePart}
            part1Topics={allP1Topics}
            onAddP1Topic={handleAddP1Topic}
            onDeleteP1Topic={handleDeleteP1Topic}
            selectedP1TopicId={selectedP1TopicId}
            setSelectedP1TopicId={setSelectedP1TopicId}
            activeP1QuestionIndex={activeP1QuestionIndex}
            setActiveP1QuestionIndex={setActiveP1QuestionIndex}
            part2Cards={allP2Cards}
            onAddP2Card={handleAddP2Card}
            onDeleteP2Card={handleDeleteP2Card}
            selectedP2CueCardId={selectedP2CueCardId}
            setSelectedP2CueCardId={setSelectedP2CueCardId}
            part3Sets={allP3Sets}
            onAddP3Set={handleAddP3Set}
            onDeleteP3Set={handleDeleteP3Set}
            selectedP3Id={selectedP3Id}
            setSelectedP3Id={setSelectedP3Id}
            onAddP1Question={handleAddP1Question}
            onDeleteP1Question={handleDeleteP1Question}
            onAddP3Question={handleAddP3Question}
            onDeleteP3Question={handleDeleteP3Question}
            activeP3Set={activeP3Set}
            speechEngine={speechEngine}
            activeExaminer={activeExaminer}
            apiKey={apiKey}
            model={model}
            onOpenSettings={onOpenSettings}
            onOpenIdeaMatrix={() => setIsIdeaMatrixOpen(true)}
            onOpenShadowing={() => setIsShadowingOpen(true)}
            onSaveToVocabNotebook={onSaveToVocabNotebook}
            onPracticeAnswerSubmitted={onSpeakingSubmitted}
            masteredIds={masteredIds}
            onToggleMastered={onToggleMastered}
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
      {isShadowingOpen && (
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
      )}

      {/* 3. SOUNDCHECK DEVICE CALIBRATION MODAL */}
      {isSoundcheckOpen && (
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
      )}

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
            if (speechEngine.clearAudioClips) speechEngine.clearAudioClips();
          }}
          onFinishExam={async (finalTranscript, meta) => {
            setIsInMockExamRoom(false);
            if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
            if (speechEngine.isListening) speechEngine.stopListening();
            if (speechEngine.clearAudioClips) speechEngine.clearAudioClips();

            // Fault-Tolerant Draft Storage: Write backup draft immediately
            const draftPayload = {
              finalTranscript,
              meta,
              mockPack: {
                id: activeMockPack.id,
                title: activeMockPack.title,
                targetBand: activeMockPack.targetBand
              },
              examiner: {
                id: activeExaminer.id,
                name: activeExaminer.name,
                accent: activeExaminer.accent
              },
              savedAt: new Date().toISOString()
            };
            try {
              localStorage.setItem('ielts_speaking_draft_backup', JSON.stringify(draftPayload));
            } catch (e) {
              console.warn('Unable to persist speaking draft to localStorage:', e);
            }

            // Read learner's preferred engine from Settings
            let preferredEngine = 'algorithmic';
            try {
              preferredEngine = localStorage.getItem('ielts_speaking_preferred_engine') || (apiKey ? 'ai' : 'algorithmic');
            } catch {
              preferredEngine = apiKey ? 'ai' : 'algorithmic';
            }

            // 1. ALGORITHMIC / OFFLINE DISPATCH: 100% instant 0.02ms algorithmic evaluation
            if (preferredEngine === 'algorithmic' || !apiKey) {
              const evalResult = evaluateSpeakingAlgorithmically({
                dialogueHistory: finalTranscript,
                mockPack: activeMockPack,
                examiner: activeExaminer,
                totalDurationSec: meta?.totalDurationSec || 600
              });

              setCurrentEvaluation(evalResult);
              setCompletedExamData({ finalTranscript, meta, evaluation: evalResult });
              setIsResultModalOpen(true);
              try {
                localStorage.removeItem('ielts_speaking_draft_backup');
                setPendingDraft(null);
              } catch (e) {}

              const submissionRecord = {
                id: `spk-${Date.now()}`,
                submittedAt: new Date().toISOString(),
                mockPack: {
                  id: activeMockPack.id,
                  title: activeMockPack.title,
                  targetBand: activeMockPack.targetBand
                },
                examiner: {
                  name: activeExaminer.name,
                  accent: activeExaminer.accent
                },
                durationSec: meta?.totalDurationSec || 600,
                evaluation: evalResult,
                dialogueHistory: finalTranscript
              };

              if (onSpeakingSubmitted) {
                onSpeakingSubmitted(submissionRecord);
              }
              return;
            }

            // 2. AI EVALUATION DISPATCH (with automatic resilient fallback)
            setIsEvaluating(true);
            setIsResultModalOpen(true);

            try {
              const evalResult = await evaluateSpeakingMockExam({
                dialogueHistory: finalTranscript,
                mockPack: activeMockPack,
                examiner: activeExaminer,
                totalDurationSec: meta?.totalDurationSec || 600,
                apiKey,
                model,
                language
              });

              setCurrentEvaluation(evalResult);
              setCompletedExamData({ finalTranscript, meta, evaluation: evalResult });
              try {
                localStorage.removeItem('ielts_speaking_draft_backup');
                setPendingDraft(null);
              } catch (e) {}

              const submissionRecord = {
                id: `spk-${Date.now()}`,
                submittedAt: new Date().toISOString(),
                mockPack: {
                  id: activeMockPack.id,
                  title: activeMockPack.title,
                  targetBand: activeMockPack.targetBand
                },
                examiner: {
                  name: activeExaminer.name,
                  accent: activeExaminer.accent
                },
                durationSec: meta?.totalDurationSec || 600,
                evaluation: evalResult,
                dialogueHistory: finalTranscript
              };

              if (onSpeakingSubmitted) {
                onSpeakingSubmitted(submissionRecord);
              }
            } catch (err) {
              console.error('Error during speaking exam evaluation, falling back to algorithmic:', err);
              const fallbackResult = evaluateSpeakingAlgorithmically({
                dialogueHistory: finalTranscript,
                mockPack: activeMockPack,
                examiner: activeExaminer,
                totalDurationSec: meta?.totalDurationSec || 600
              });
              setCurrentEvaluation(fallbackResult);
              setCompletedExamData({ finalTranscript, meta, evaluation: fallbackResult });
              try {
                localStorage.removeItem('ielts_speaking_draft_backup');
                setPendingDraft(null);
              } catch (e) {}
            } finally {
              setIsEvaluating(false);
            }
          }}
        />
      )}

      {/* 5. STEP 5: EVALUATION LOADING OVERLAY */}
      {isEvaluating && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border-2 border-purple-500/60 flex items-center justify-center text-purple-400 mb-4 shadow-xl shadow-purple-900/40 animate-pulse">
            <Sparkles className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isEn ? 'AI Examiner Evaluating 4 Cambridge Criteria...' : 'Giám Khảo AI Đang Chấm Điểm 4 Tiêu Chí...'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
            {isEn
              ? 'Analyzing Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation according to official Cambridge IDP / BC criteria.'
              : 'Hệ thống đang phân tích chi tiết Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy và Pronunciation theo chuẩn khảo thí Cambridge IDP / BC.'}
          </p>
          <div className="mt-6 flex items-center space-x-2 text-xs text-purple-300 font-bold bg-purple-950/60 px-4 py-2 rounded-full border border-purple-800/60">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span>{isEn ? 'Generating diagnostic report & Band 8.5+ model answers...' : 'Đang tạo báo cáo chẩn đoán & câu mẫu Band 8.5+...'}</span>
          </div>
        </div>
      )}

      {/* 6. STEP 5: COMPREHENSIVE SPEAKING RESULT MODAL */}
      <SpeakingResultModal
        isOpen={isResultModalOpen && !isEvaluating}
        onClose={() => setIsResultModalOpen(false)}
        evaluation={currentEvaluation}
        dialogueHistory={completedExamData?.finalTranscript || []}
        mockPack={activeMockPack}
        examiner={activeExaminer}
        totalDurationSec={completedExamData?.meta?.totalDurationSec || 600}
        onRetryExam={() => {
          try { sessionStorage.removeItem('ielts_speaking_session_transcript'); } catch (e) {}
          setIsResultModalOpen(false);
          setIsInMockExamRoom(true);
        }}
        onSaveToVocabNotebook={onSaveToVocabNotebook}
        onReEvaluateWithAI={handleReEvaluateWithAI}
        onReEvaluateAlgorithmically={handleReEvaluateAlgorithmically}
        apiKey={apiKey}
      />

      {/* Speaking Mock Test Library Modal */}
      <SpeakingMockLibraryModal
        isOpen={isMockLibraryOpen}
        onClose={() => setIsMockLibraryOpen(false)}
        allMockPacks={allMockPacks}
        selectedMockId={selectedMockId}
        onSelectMockPack={(id) => setSelectedMockId(id)}
        onDeleteCustomPack={handleDeleteCustomPack}
        onOpenManualCreate={() => {
          setGeneratorInitialMode('manual');
          setIsGeneratorOpen(true);
        }}
        onOpenAiGenerate={() => {
          setGeneratorInitialMode('ai');
          setIsGeneratorOpen(true);
        }}
        masteredIds={masteredIds}
        onToggleMastered={onToggleMastered}
        mockFilter={mockFilter}
        setMockFilter={setMockFilter}
        mockPackCounts={mockPackCounts}
      />

      {/* 7. STEP 6: AI / MANUAL SPEAKING MOCK TEST GENERATOR MODAL */}
      <SpeakingGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        apiKey={apiKey}
        model={model}
        initialMode={generatorInitialMode}
        onOpenSettings={onOpenSettings}
        onPackGenerated={handlePackGenerated}
      />

      {/* 8. STEP 7: AI PRACTICE TOPIC & QUESTION GENERATOR MODAL */}
      <SpeakingPracticeTopicModal
        isOpen={isPracticeTopicModalOpen}
        onClose={() => setIsPracticeTopicModalOpen(false)}
        part={practicePart}
        apiKey={apiKey}
        model={model}
        onTopicCreated={(newTopic) => {
          if (practicePart === 1) {
            handleAddP1Topic(newTopic);
          } else if (practicePart === 2) {
            handleAddP2Card(newTopic);
          } else if (practicePart === 3) {
            handleAddP3Set(newTopic);
          }
        }}
      />
    </div>
  );
}
