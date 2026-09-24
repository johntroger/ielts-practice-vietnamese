import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Play, Pause, Square, RotateCcw, CheckCircle2, 
  Sparkles, BookOpen, Layers, Clock, Award, Shield, Compass, Headphones, 
  ChevronRight, ArrowRight, Lightbulb, Copy, Info, AlertCircle, Plus,
  Trash2, Loader2, GraduationCap, Zap
} from 'lucide-react';
import SpeechWaveVisualizer from './SpeechWaveVisualizer';
import SpeakingFillerTracker from './SpeakingFillerTracker';
import { speakingSoundEffects } from '../../utils/speakingSoundEffects';
import { 
  evaluateSpeakingPracticeAnswer, 
  evaluateSinglePracticeAnswerAlgorithmically,
  transcribeAudioWithGemini 
} from '../../services/geminiService';
import SpeakingSingleEvaluationModal from './SpeakingSingleEvaluationModal';
import SpeakingPracticeTopicModal from './SpeakingPracticeTopicModal';

export default function SpeakingPracticePane({
  practicePart = 1,
  setPracticePart,
  // Part 1 data & state
  part1Topics = [],
  onAddP1Topic,
  onDeleteP1Topic,
  selectedP1TopicId,
  setSelectedP1TopicId,
  activeP1QuestionIndex,
  setActiveP1QuestionIndex,
  // Part 2 data & state
  part2Cards = [],
  onAddP2Card,
  onDeleteP2Card,
  selectedP2CueCardId,
  setSelectedP2CueCardId,
  // Part 3 data & state
  part3Sets = [],
  onAddP3Set,
  onDeleteP3Set,
  selectedP3Id: externalSelectedP3Id,
  setSelectedP3Id: externalSetSelectedP3Id,
  onAddP1Question,
  onDeleteP1Question,
  onAddP3Question,
  onDeleteP3Question,
  activeP3Set,
  // Engine & callbacks
  speechEngine,
  activeExaminer,
  apiKey,
  model,
  onOpenSettings,
  onOpenIdeaMatrix,
  onOpenShadowing,
  onSaveToVocabNotebook,
  onPracticeAnswerSubmitted,
  masteredIds = [],
  onToggleMastered
}) {
  // Common state
  const [showVocabHints, setShowVocabHints] = useState(true);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isPlayingPracticeAudio, setIsPlayingPracticeAudio] = useState(false);
  const practiceAudioRef = useRef(null);

  const [hideMastered, setHideMastered] = useState(() => {
    try {
      return localStorage.getItem('ielts_speaking_hide_mastered') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleHideMastered = () => {
    setHideMastered(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ielts_speaking_hide_mastered', String(next));
      } catch {}
      return next;
    });
  };

  // Modals state
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topicModalPart, setTopicModalPart] = useState(1);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isEvaluatingSingle, setIsEvaluatingSingle] = useState(false);
  const [evaluatingClipKey, setEvaluatingClipKey] = useState('');
  const [singleEvaluationResult, setSingleEvaluationResult] = useState(null);
  const [evaluationContext, setEvaluationContext] = useState(null);
  const [isRefiningTranscript, setIsRefiningTranscript] = useState(false);
  const [refiningClipKey, setRefiningClipKey] = useState('');
  const [activeRecordClipKey, setActiveRecordClipKey] = useState('');
  const [isMicConnecting, setIsMicConnecting] = useState(false);
  const [micErrorDetail, setMicErrorDetail] = useState(null);

  // Quick Add Question modal/prompt state
  const [isQuickAddQOpen, setIsQuickAddQOpen] = useState(false);
  const [quickQText, setQuickQText] = useState('');
  const [quickQStrategy, setQuickQStrategy] = useState('');

  // Part 2 Specific Timers & Pacing State
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [speakSecondsElapsed, setSpeakSecondsElapsed] = useState(0);
  const [isPart2Speaking, setIsPart2Speaking] = useState(false);
  const prepTimerRef = useRef(null);
  const speakTimerRef = useRef(null);

  // Part 3 Selector State
  const [localSelectedP3Id, setLocalSelectedP3Id] = useState(activeP3Set?.linkedPart2Id || part3Sets[0]?.linkedPart2Id || 'p3-tech-society');
  const selectedP3Id = externalSelectedP3Id || localSelectedP3Id;
  const setSelectedP3Id = externalSetSelectedP3Id || setLocalSelectedP3Id;

  // Active items
  const activeP1Topic = part1Topics.find(t => t.id === selectedP1TopicId) || part1Topics[0] || {};
  const activeP2Card = part2Cards.find(c => c.id === selectedP2CueCardId) || part2Cards[0] || {};
  const currentP3Set = part3Sets.find(s => (s.linkedPart2Id || s.id) === selectedP3Id) || activeP3Set || part3Sets[0] || {};
  const currentP1Question = activeP1Topic.questions?.[activeP1QuestionIndex] || null;

  // Cleanup on unmount or tab/topic/question switch
  useEffect(() => {
    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
      if (practiceAudioRef.current) {
        practiceAudioRef.current.pause();
        setIsPlayingPracticeAudio(false);
      }
    };
  }, [practicePart, selectedP1TopicId, activeP1QuestionIndex, selectedP2CueCardId]);

  // Read examiner text
  const handleReadText = (text) => {
    speechEngine.speak(text, { examinerId: activeExaminer.id });
  };

  // Explicit Mic Permission Requester (forces browser popup if not yet prompted)
  const handleRequestMicPermissionDirectly = async () => {
    setMicErrorDetail(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ getUserMedia.');
      }
      const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Acquired! Keep in engine
      testStream.getTracks().forEach(track => track.stop());
      alert('✅ Micro đã sẵn sàng! Bạn có thể nhấn nút "BẬT MICRO LUYỆN NÓI" để bắt đầu trả lời.');
    } catch (err) {
      console.warn('Direct mic permission test error:', err);
      setMicErrorDetail(err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
        ? 'Trình duyệt đang CHẶN Microphone! Hãy nhấp vào biểu tượng Ổ khóa (🔒) bên trái thanh URL để Cho phép Micro.'
        : (err.message || 'Không thể kết nối Micro. Hãy kiểm tra thiết bị của bạn.'));
    }
  };

  // Toggle generic practice recording with visible feedback
  const handleTogglePracticeRecord = async (clipKey) => {
    setMicErrorDetail(null);
    if (isMicConnecting) return;

    // If currently listening, stop it cleanly
    if (speechEngine.isListening) {
      speechEngine.stopListening();
      setActiveRecordClipKey('');
      setIsMicConnecting(false);
      return;
    }

    setIsMicConnecting(true);
    setActiveRecordClipKey(clipKey);
    speechEngine.resetTranscript();
    if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(clipKey);

    try {
      await speechEngine.startListening(clipKey);
      setMicErrorDetail(null);
    } catch (err) {
      console.error('Microphone start error:', err);
      setActiveRecordClipKey('');
      setMicErrorDetail(err.message || 'Trình duyệt chưa cho phép truy cập Micro. Hãy bấm vào biểu tượng Ổ khóa (🔒) trên thanh URL để Cho phép Micro.');
    } finally {
      setIsMicConnecting(false);
    }
  };

  // -------------------------------------------------------------
  // PART 2 PREP TIMER & PACING LOGIC
  // -------------------------------------------------------------
  const handleStartPart2Prep = () => {
    if (isPrepping) {
      clearInterval(prepTimerRef.current);
      setIsPrepping(false);
      return;
    }

    setPrepSecondsRemaining(60);
    setIsPrepping(true);

    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    prepTimerRef.current = setInterval(() => {
      setPrepSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(prepTimerRef.current);
          setIsPrepping(false);
          speakingSoundEffects.playPrepTimeEndChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTogglePart2Speaking = async () => {
    if (isMicConnecting) return;
    const clipKey = `p2_${activeP2Card.id}`;

    if (isPart2Speaking || speechEngine.isListening) {
      clearInterval(speakTimerRef.current);
      setIsPart2Speaking(false);
      speechEngine.stopListening();
      setActiveRecordClipKey('');
      setIsMicConnecting(false);
    } else {
      setIsMicConnecting(true);
      setActiveRecordClipKey(clipKey);
      setSpeakSecondsElapsed(0);
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(clipKey);

      try {
        await speechEngine.startListening(clipKey);
        setIsPart2Speaking(true);
        if (speakTimerRef.current) clearInterval(speakTimerRef.current);
        speakTimerRef.current = setInterval(() => {
          setSpeakSecondsElapsed(prev => {
            if (prev >= 120) {
              clearInterval(speakTimerRef.current);
              setIsPart2Speaking(false);
              speechEngine.stopListening();
              setActiveRecordClipKey('');
              return 120;
            }
            return prev + 1;
          });
        }, 1000);
      } catch (err) {
        console.warn('Part 2 mic error:', err);
        setIsPart2Speaking(false);
        setActiveRecordClipKey('');
        alert('⚠️ Trình duyệt chưa cấp quyền truy cập Micro!\n\nVui lòng bấm vào biểu tượng Ổ khóa (🔒) trên thanh địa chỉ URL của trình duyệt và chọn "Cho phép (Allow)" Micro.');
      } finally {
        setIsMicConnecting(false);
      }
    }
  };

  // -------------------------------------------------------------
  // INSTANT SPACEBAR MIC SHORTCUT (0ms Latency)
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in form controls or a modal is open
      const tag = e.target?.tagName?.toUpperCase();
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        e.target?.isContentEditable ||
        isTopicModalOpen ||
        isEvaluationModalOpen ||
        isQuickAddQOpen
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        if (practicePart === 1) {
          const clipKey = `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`;
          handleTogglePracticeRecord(clipKey);
        } else if (practicePart === 2) {
          handleTogglePart2Speaking();
        } else if (practicePart === 3) {
          const clipKey = `p3_${currentP3Set.questions?.[0]?.qId || 0}`;
          handleTogglePracticeRecord(clipKey);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    practicePart,
    activeP1Topic.id,
    activeP1QuestionIndex,
    currentP3Set,
    isTopicModalOpen,
    isEvaluationModalOpen,
    isQuickAddQOpen,
    isPart2Speaking,
    speechEngine.isListening
  ]);

  // -------------------------------------------------------------
  // DIRECT MULTIMODAL AI AUDIO STT & TRANSCRIPTION REFINEMENT
  // -------------------------------------------------------------
  const handleRefineTranscriptWithAI = async (clipKey) => {
    const clip = speechEngine.audioClips?.[clipKey];
    if (!clip?.blob) {
      alert('Chưa tìm thấy bản ghi âm trong bộ nhớ RAM. Vui lòng ghi âm câu trả lời trước.');
      return null;
    }
    if (!apiKey) {
      if (onOpenSettings) {
        if (window.confirm('Vui lòng nhập Google Gemini API Key trong Cài đặt để AI nhận diện giọng nói chính xác cao (Multimodal Audio). Mở Cài đặt ngay?')) {
          onOpenSettings();
        }
      } else {
        alert('Vui lòng cấu hình Gemini API Key trong Cài đặt.');
      }
      return null;
    }

    setIsRefiningTranscript(true);
    setRefiningClipKey(clipKey);

    try {
      const accurateTranscript = await transcribeAudioWithGemini({
        audioBlob: clip.blob,
        apiKey,
        model
      });

      if (accurateTranscript && speechEngine.setCustomTranscript) {
        speechEngine.setCustomTranscript(accurateTranscript);
      }
      return accurateTranscript;
    } catch (err) {
      console.error('Gemini Audio STT error:', err);
      alert('Không thể nhận diện âm thanh qua Gemini: ' + (err.message || 'Lỗi không xác định'));
      return null;
    } finally {
      setIsRefiningTranscript(false);
      setRefiningClipKey('');
    }
  };

  // -------------------------------------------------------------
  // DUAL-ENGINE EVALUATION HANDLERS & ZERO VOICE RETENTION
  // -------------------------------------------------------------

  // 1. ALGORITHMIC EVALUATION (100% Offline, Instant 0.02ms, Free)
  const handleEvaluateAlgorithmically = (clipKey, questionText, topicTitle, partNum) => {
    let currentTranscript = evaluationContext?.candidateTranscript || speechEngine.transcript?.trim();
    if (clipKey && speechEngine.transcript?.trim()) {
      currentTranscript = speechEngine.transcript.trim();
    }
    const clip = clipKey ? speechEngine.audioClips?.[clipKey] : null;

    if (!currentTranscript || currentTranscript.split(/\s+/).filter(Boolean).length < 3) {
      alert('Câu trả lời của bạn quá ngắn hoặc micro chưa thu âm được từ ngữ. Vui lòng nói ít nhất vài câu để thuật toán có thể phân tích độ trôi chảy, ngữ pháp và từ vựng.');
      return;
    }

    const durationSec = clip?.duration || evaluationContext?.durationSec || (partNum === 2 ? speakSecondsElapsed : 35);
    const activePart = partNum || evaluationContext?.part || 1;
    const finalTopic = topicTitle || evaluationContext?.topicTitle || `IELTS Speaking Part ${activePart}`;
    const finalQuestion = questionText || evaluationContext?.questionText || finalTopic;

    try {
      const result = evaluateSinglePracticeAnswerAlgorithmically({
        part: activePart,
        topicTitle: finalTopic,
        questionText: finalQuestion,
        cueBullets: activePart === 2 ? (activeP2Card?.cueCard?.bullets || []) : null,
        candidateTranscript: currentTranscript,
        durationSec
      });

      setEvaluationContext({
        clipKey: clipKey || evaluationContext?.clipKey,
        questionText: finalQuestion,
        topicTitle: finalTopic,
        candidateTranscript: currentTranscript,
        durationSec,
        part: activePart
      });
      setSingleEvaluationResult(result);
      setIsEvaluationModalOpen(true);
    } catch (err) {
      console.error('Error in algorithmic evaluation:', err);
      alert('Lỗi khi chấm bài bằng thuật toán máy tính: ' + (err.message || 'Vui lòng thử lại.'));
    }
  };

  // 2. AI EXAMINER EVALUATION (Cambridge AI qualitative analysis)
  const handleEvaluateWithAI = async (clipKey, questionText, topicTitle, partNum) => {
    if (!apiKey) {
      if (onOpenSettings) {
        if (window.confirm('Vui lòng nhập Google Gemini API Key trong phần Cài đặt để sử dụng tính năng Chấm điểm bằng AI. Mở Cài đặt ngay?')) {
          onOpenSettings();
        }
      } else {
        alert('Vui lòng cấu hình Gemini API Key trong Cài đặt để chấm điểm bài nói.');
      }
      return;
    }

    let currentTranscript = evaluationContext?.candidateTranscript || speechEngine.transcript?.trim();
    if (clipKey && speechEngine.transcript?.trim()) {
      currentTranscript = speechEngine.transcript.trim();
    }
    const clip = clipKey ? speechEngine.audioClips?.[clipKey] : null;

    // AUTO GEMINI MULTIMODAL STT FALLBACK:
    // If Web Speech API was empty or too brief (< 3 words) but user actually spoke (audio clip exists in RAM)
    if ((!currentTranscript || currentTranscript.split(/\s+/).filter(Boolean).length < 3) && clip?.blob) {
      setIsEvaluatingSingle(true);
      if (clipKey) setEvaluatingClipKey(clipKey);
      try {
        const aiTranscribed = await transcribeAudioWithGemini({
          audioBlob: clip.blob,
          apiKey,
          model
        });
        if (aiTranscribed) {
          currentTranscript = aiTranscribed.trim();
          if (speechEngine.setCustomTranscript) {
            speechEngine.setCustomTranscript(aiTranscribed);
          }
        }
      } catch (sttErr) {
        console.warn('Auto Gemini STT fallback failed:', sttErr);
      } finally {
        setIsEvaluatingSingle(false);
        setEvaluatingClipKey('');
      }
    }

    if (!currentTranscript || currentTranscript.split(/\s+/).filter(Boolean).length < 3) {
      alert('Câu trả lời của bạn quá ngắn hoặc mic chưa nhận diện được từ ngữ. Vui lòng bấm "Bật Micro Luyện Nói" và trả lời ít nhất vài câu trước khi yêu cầu AI chấm điểm.');
      return;
    }

    const durationSec = clip?.duration || evaluationContext?.durationSec || (partNum === 2 ? speakSecondsElapsed : 35);
    const activePart = partNum || evaluationContext?.part || 1;
    const finalTopic = topicTitle || evaluationContext?.topicTitle || `IELTS Speaking Part ${activePart}`;
    const finalQuestion = questionText || evaluationContext?.questionText || finalTopic;

    setIsEvaluatingSingle(true);
    if (clipKey) setEvaluatingClipKey(clipKey);

    try {
      const result = await evaluateSpeakingPracticeAnswer({
        part: activePart,
        topicTitle: finalTopic,
        questionText: finalQuestion,
        cueBullets: activePart === 2 ? (activeP2Card?.cueCard?.bullets || []) : null,
        candidateTranscript: currentTranscript,
        durationSec,
        apiKey,
        model
      });

      setEvaluationContext({
        clipKey: clipKey || evaluationContext?.clipKey,
        questionText: finalQuestion,
        topicTitle: finalTopic,
        candidateTranscript: currentTranscript,
        durationSec,
        part: activePart
      });
      setSingleEvaluationResult(result);
      setIsEvaluationModalOpen(true);
    } catch (err) {
      console.error('Error evaluating practice answer:', err);
      alert(err.message || 'Lỗi khi chấm bài nói. Vui lòng thử lại.');
    } finally {
      setIsEvaluatingSingle(false);
      setEvaluatingClipKey('');
    }
  };

  // Backward compatibility alias
  const handleEvaluateAnswer = handleEvaluateWithAI;

  const handleSaveEvaluationAndCleanVoice = () => {
    if (!singleEvaluationResult || !evaluationContext) return;

    // 1. Build persistent submission record (ONLY text evaluation report, NO audio binary)
    const subRecord = {
      id: `spk-prac-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      mockPack: {
        id: `practice-p${evaluationContext.part}`,
        title: `Luyện tập Part ${evaluationContext.part}: ${evaluationContext.topicTitle}`,
        targetBand: 'Luyện tập Tự Do'
      },
      examiner: {
        name: activeExaminer?.name || 'Giám Khảo AI Cambridge',
        accent: activeExaminer?.accent || 'Cambridge Standard'
      },
      durationSec: evaluationContext.durationSec || 30,
      evaluation: singleEvaluationResult,
      dialogueHistory: [
        { speaker: 'examiner', text: evaluationContext.questionText },
        { speaker: 'candidate', text: evaluationContext.candidateTranscript }
      ]
    };

    if (onPracticeAnswerSubmitted) {
      onPracticeAnswerSubmitted(subRecord);
    }

    // 2. CRITICAL ZERO VOICE RETENTION: Purge audio clip & revoke RAM Blob URL immediately!
    if (evaluationContext.clipKey && speechEngine.deleteAudioClip) {
      speechEngine.deleteAudioClip(evaluationContext.clipKey);
    }
    if (practiceAudioRef.current) {
      practiceAudioRef.current.pause();
      setIsPlayingPracticeAudio(false);
    }
  };

  // Quick Add Question to Current Topic
  const handleQuickAddQuestion = () => {
    if (!quickQText.trim()) return;

    if (practicePart === 1 && activeP1Topic) {
      const newQ = {
        qId: `p1-q-user-${Date.now()}`,
        question: quickQText.trim(),
        focus: 'Câu hỏi bổ sung',
        strategy: quickQStrategy.trim() || 'A.R.E.A Framework: Answer -> Reason -> Example -> Alternative',
        vocabHints: [],
        sampleAnswer: ''
      };
      if (onAddP1Question) {
        onAddP1Question(activeP1Topic.id, newQ);
      } else {
        if (activeP1Topic.questions) {
          activeP1Topic.questions.push(newQ);
        } else {
          activeP1Topic.questions = [newQ];
        }
      }
      setActiveP1QuestionIndex(activeP1Topic.questions ? activeP1Topic.questions.length : 0);
    } else if (practicePart === 3 && currentP3Set) {
      const newQ = {
        qId: `p3-q-user-${Date.now()}`,
        question: quickQText.trim(),
        analysisType: 'Thảo luận sâu',
        strategy: quickQStrategy.trim() || 'PEEL Framework: Point -> Explanation -> Example -> Link',
        sampleAnswer: ''
      };
      if (onAddP3Question) {
        onAddP3Question(currentP3Set.linkedPart2Id || currentP3Set.id, newQ);
      } else {
        if (currentP3Set.questions) {
          currentP3Set.questions.push(newQ);
        } else {
          currentP3Set.questions = [newQ];
        }
      }
    }

    setQuickQText('');
    setQuickQStrategy('');
    setIsQuickAddQOpen(false);
  };

  // Render Playback Voice Box & AI Evaluation
  const renderAudioPlayback = (clipKey, questionText, topicTitle, partNum) => {
    const clip = speechEngine.audioClips[clipKey];
    const hasTranscript = !!speechEngine.transcript?.trim();
    if (!clip && !hasTranscript) return null;
    if (speechEngine.isListening) return null;

    const handleTogglePlay = () => {
      if (!clip?.url) return;
      if (!practiceAudioRef.current) {
        practiceAudioRef.current = new Audio(clip.url);
        practiceAudioRef.current.onended = () => setIsPlayingPracticeAudio(false);
        practiceAudioRef.current.onerror = () => setIsPlayingPracticeAudio(false);
      } else if (practiceAudioRef.current.src !== clip.url) {
        practiceAudioRef.current.src = clip.url;
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

    const handleClearClip = () => {
      if (practiceAudioRef.current) {
        practiceAudioRef.current.pause();
        setIsPlayingPracticeAudio(false);
      }
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip(clipKey);
      }
      speechEngine.resetTranscript();
    };

    return (
      <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-2.5 animate-in fade-in duration-150">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Nghe lại & Đánh giá câu trả lời ({clip?.duration || 1}s):</span>
          </span>
          <span className="text-[10px] text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/40">
            RAM-Only (Tự hủy khi lưu)
          </span>
        </div>

        {/* Live Speaking Fluency & Filler Words Tracker */}
        {speechEngine.transcript && (
          <SpeakingFillerTracker 
            transcript={speechEngine.transcript} 
            durationSec={clip?.duration || 30} 
          />
        )}

        <div className="flex flex-wrap items-center gap-2">
          {clip && (
            <button
              onClick={handleTogglePlay}
              className={`flex-1 sm:flex-none py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                isPlayingPracticeAudio
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-600/40'
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
                  <span>🔊 Nghe Lại Giọng</span>
                </>
              )}
            </button>
          )}

          {/* AI AUDIO MULTIMODAL STT BUTTON */}
          {clip?.blob && (
            <button
              onClick={() => handleRefineTranscriptWithAI(clipKey)}
              disabled={isRefiningTranscript}
              className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white border border-indigo-700/60 text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
              title="Dùng Gemini Multimodal Audio nghe file âm thanh từ RAM để phiên âm chuẩn xác 99.5%"
            >
              {isRefiningTranscript && refiningClipKey === clipKey ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>AI Đang Nghe...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>✨ AI Nhận Diện Lại</span>
                </>
              )}
            </button>
          )}

          {/* DUAL EVALUATION ENGINES: MACHINE (OFFLINE) VS AI */}
          <button
            onClick={() => handleEvaluateAlgorithmically(clipKey, questionText, topicTitle, partNum)}
            className="flex-1 min-w-[140px] py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-950/40 flex items-center justify-center space-x-1.5 cursor-pointer transition-all hover:scale-[1.01]"
            title="Chấm điểm tức thì (0.02ms) bằng thuật toán 4 tiêu chí Cambridge, 100% Offline & Miễn phí"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>⚡ Chấm Máy (Tức Thì)</span>
          </button>

          <button
            onClick={() => handleEvaluateWithAI(clipKey, questionText, topicTitle, partNum)}
            disabled={isEvaluatingSingle}
            className="flex-1 min-w-[140px] py-2.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-purple-950/50 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60 transition-all hover:scale-[1.01]"
            title="Giám khảo AI chấm phân tích sâu, sửa câu & viết lại bản Band 8.5+"
          >
            {isEvaluatingSingle && evaluatingClipKey === clipKey ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI Đang Chấm...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span>🤖 Chấm Bằng AI</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearClip}
            className="py-2 px-2.5 sm:px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer transition-colors"
            title="Xóa âm thanh ngay khỏi bộ nhớ RAM để tiết kiệm tài nguyên"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xóa File Tạm</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Navigation & Part Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-2xl">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => {
              setPracticePart(1);
              setShowSampleAnswer(false);
              speechEngine.resetTranscript();
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              practicePart === 1 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Part 1<span className="hidden sm:inline">: Phỏng Vấn (A.R.E.A)</span></span>
          </button>

          <button
            onClick={() => {
              setPracticePart(2);
              setShowSampleAnswer(false);
              speechEngine.resetTranscript();
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              practicePart === 2 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Part 2<span className="hidden sm:inline">: Cue Card & Pacing</span></span>
          </button>

          <button
            onClick={() => {
              setPracticePart(3);
              setShowSampleAnswer(false);
              speechEngine.resetTranscript();
            }}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              practicePart === 3 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Part 3<span className="hidden sm:inline">: Thảo Luận (PEEL)</span></span>
          </button>
        </div>

        {/* Action Tools: AI Generator, Idea Matrix & Shadowing Studio */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 overflow-x-auto no-scrollbar max-w-full pb-0.5 sm:pb-0">
          <button
            onClick={() => {
              setTopicModalPart(practicePart);
              setIsTopicModalOpen(true);
            }}
            className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-black transition-all cursor-pointer shadow-md shadow-purple-900/40 shrink-0 whitespace-nowrap"
            title="Dùng Gemini AI để tạo chủ đề và câu hỏi mới cho Part này"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>✨ Sinh Chủ Đề (AI)</span>
          </button>

          <button
            onClick={onOpenIdeaMatrix}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-purple-200 border border-purple-700/50 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
            title="Mở bảng ma trận gợi ý ý tưởng 5W1H & Đa góc nhìn"
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Idea Matrix</span>
          </button>

          <button
            onClick={onOpenShadowing}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-slate-700 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
            title="Luyện nghe và nhại lại giọng đọc chuẩn Band 8.5+"
          >
            <Headphones className="w-3.5 h-3.5 shrink-0" />
            <span>Shadowing 8.5</span>
          </button>
        </div>
      </div>

      {/* Permission Warning Banner if Microphone is blocked */}
      {speechEngine.speechError === 'not-allowed' && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500/70 text-rose-200 flex items-start space-x-3 shadow-xl animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-white text-sm">Trình duyệt chưa cho phép truy cập Micro!</h4>
            <p className="text-rose-200 leading-relaxed">
              Để luyện nói và chấm điểm, bạn vui lòng nhấp vào biểu tượng <strong>Ổ khóa (🔒)</strong> hoặc <strong>Cài đặt trang web</strong> trên thanh địa chỉ URL của trình duyệt, chọn <strong>Cho phép (Allow)</strong> Microphone, sau đó bấm nút Bật Micro lại.
            </p>
          </div>
        </div>
      )}

      {/* Practice Welcome & Quick AI Generator Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Luyện Tập Tự Do Không Giới Hạn
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Tích hợp chấm điểm AI Cambridge</span>
          </div>
          <p className="text-xs text-slate-300">
            Luyện từng câu hỏi độc lập, nhận ngay nhận xét 4 tiêu chí khảo thí & bản nâng cấp Band 8.5+. Bạn có thể sinh thêm bất kỳ chủ đề/câu hỏi nào bằng Gemini AI!
          </p>
        </div>

        <button
          onClick={() => {
            setTopicModalPart(practicePart);
            setIsTopicModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-purple-950/60 flex items-center space-x-2 cursor-pointer transition-all hover:scale-[1.02] shrink-0"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>✨ Sinh Chủ Đề Bằng AI (Gemini)</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. PART 1 PRACTICE VIEW                                    */}
      {/* ========================================================= */}
      {practicePart === 1 && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Part 1 Topic Control Bar with AI Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2.5 flex-wrap">
              <span className="text-xs font-bold text-slate-200">Chủ đề phỏng vấn:</span>
              <span className="text-[11px] text-purple-300 font-semibold bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/40">
                {part1Topics.length} chủ đề
              </span>

              {/* Ẩn chủ đề đã thuộc Checkbox */}
              <label className="flex items-center space-x-1.5 text-xs text-slate-400 cursor-pointer select-none px-2 py-0.5 rounded-lg hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={hideMastered}
                  onChange={handleToggleHideMastered}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="whitespace-nowrap font-medium text-[11px]">Ẩn chủ đề đã thuộc</span>
              </label>
            </div>

            <button
              onClick={() => {
                setTopicModalPart(1);
                setIsTopicModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center justify-center space-x-1.5 shadow-md shadow-purple-900/40 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>+ Sinh Chủ Đề & Câu Hỏi Part 1 Bằng AI (Gemini)</span>
            </button>
          </div>

          {/* Topic Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {/* Front AI button */}
            <button
              onClick={() => {
                setTopicModalPart(1);
                setIsTopicModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-600/50 text-xs font-bold whitespace-nowrap flex items-center space-x-1 cursor-pointer shrink-0"
              title="Sinh chủ đề luyện tập Part 1 mới bằng Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Tạo Mới (AI)</span>
            </button>

            {(hideMastered ? part1Topics.filter(t => !masteredIds.includes(t.id)) : part1Topics).map(topic => (
              <div key={topic.id} className="relative group shrink-0">
                <button
                  onClick={() => {
                    setSelectedP1TopicId(topic.id);
                    setActiveP1QuestionIndex(0);
                    setShowSampleAnswer(false);
                    speechEngine.resetTranscript();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                    selectedP1TopicId === topic.id
                      ? 'bg-purple-600 text-white border border-purple-400 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{topic.title}</span>
                  {masteredIds.includes(topic.id) && (
                    <GraduationCap className="w-3 h-3 text-emerald-400 shrink-0" title="Chủ đề đã thuộc" />
                  )}
                  {topic.isCommunity || (topic.isPublic && topic.isCustom) ? (
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/80 rounded text-emerald-300 border border-emerald-500/40">
                      🌐 Cộng Đồng
                    </span>
                  ) : topic.isCustom ? (
                    <span className="text-[9px] px-1.5 py-0.2 bg-amber-950/80 rounded text-amber-300 border border-amber-500/40">
                      🔒 Riêng
                    </span>
                  ) : null}
                </button>
              </div>
            ))}
          </div>

          {/* Question Card */}
          {currentP1Question && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Câu {activeP1QuestionIndex + 1} / {activeP1Topic.questions.length}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{activeP1Topic.title}</span>
                  {onToggleMastered && activeP1Topic.id && (
                    <button
                      type="button"
                      onClick={() => onToggleMastered(activeP1Topic.id)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1 cursor-pointer border ${
                        masteredIds.includes(activeP1Topic.id)
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                      }`}
                      title={
                        masteredIds.includes(activeP1Topic.id)
                          ? 'Đã thuộc chủ đề này (Bấm để bỏ đánh dấu)'
                          : 'Đánh dấu đã thuộc chủ đề này'
                      }
                    >
                      <GraduationCap className="w-3 h-3" />
                      <span>{masteredIds.includes(activeP1Topic.id) ? 'Đã thuộc' : 'Thuộc chủ đề'}</span>
                    </button>
                  )}
                  {activeP1Topic.isCustom && onDeleteP1Topic && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc muốn xóa chủ đề "${activeP1Topic.title}"?`)) {
                          onDeleteP1Topic(activeP1Topic.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer ml-1"
                      title="Xóa chủ đề tự tạo này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setIsQuickAddQOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 transition-colors cursor-pointer flex items-center space-x-1"
                    title="Thêm câu hỏi mới vào chủ đề hiện tại"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Thêm Câu Hỏi</span>
                  </button>
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

              {/* The Question Text with Examiner Voice */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Câu hỏi khảo thí:</span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleReadText(currentP1Question.question)}
                      className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{speechEngine.isSpeaking ? 'Đang đọc...' : 'Nghe Giám khảo đọc câu hỏi'}</span>
                    </button>
                    {(currentP1Question?.qId?.includes('user') || activeP1Topic.isCustom || (activeP1Topic.questions && activeP1Topic.questions.length > 1)) && onDeleteP1Question && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc muốn xóa câu hỏi này khỏi chủ đề ("${(currentP1Question.question || '').substring(0, 45)}...")?`)) {
                            const targetQId = currentP1Question.qId || currentP1Question.id;
                            onDeleteP1Question(activeP1Topic.id, targetQId);
                            setActiveP1QuestionIndex(prev => Math.max(0, prev - 1));
                          }
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                        title="Xóa câu hỏi này khỏi chủ đề"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                  "{currentP1Question.question}"
                </h2>
                <p className="text-xs text-slate-400 italic">
                  💡 {currentP1Question.strategy}
                </p>
              </div>

              {/* Interactive Recorder Box */}
              <div className={`p-4 rounded-2xl border space-y-3 transition-all ${
                speechEngine.isListening 
                  ? 'bg-slate-950 border-rose-500/60 shadow-xl shadow-rose-950/40 ring-2 ring-rose-500/30' 
                  : isMicConnecting
                  ? 'bg-slate-950 border-amber-500/60 shadow-xl shadow-amber-950/40 ring-2 ring-amber-500/30'
                  : 'bg-slate-950 border-slate-800/90'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-lg border transition-colors ${
                      speechEngine.isListening 
                        ? 'bg-rose-950 text-rose-400 border-rose-500/50 animate-pulse' 
                        : isMicConnecting
                        ? 'bg-amber-950 text-amber-400 border-amber-500/50 animate-spin'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {speechEngine.isListening ? <Mic className="w-4 h-4" /> : isMicConnecting ? <Loader2 className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block text-white">
                        {speechEngine.isListening ? '🔴 Đang Thu Âm Trả Lời' : isMicConnecting ? '⏳ Đang Kích Hoạt Micro...' : 'Luyện Nói Cho Câu Này'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {speechEngine.isListening 
                          ? 'Giọng bạn đang được phân tích trực tiếp' 
                          : isMicConnecting
                          ? 'Vui lòng bấm Cho Phép nếu trình duyệt yêu cầu'
                          : 'Bấm nút "Bật Micro Luyện Nói" bên dưới để trả lời'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {speechEngine.isListening ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-black animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span>REC<span className="hidden sm:inline"> • MICRO ĐANG BẬT</span></span>
                      </span>
                    ) : isMicConnecting ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>ĐANG KẾT NỐI</span>
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

                <div className={`h-16 rounded-xl border overflow-hidden transition-all ${
                  speechEngine.isListening 
                    ? 'bg-slate-900 border-rose-500/40 ring-2 ring-rose-500/20' 
                    : isMicConnecting
                    ? 'bg-slate-900 border-amber-500/40 ring-2 ring-amber-500/20'
                    : 'bg-slate-900 border-slate-800'
                }`}>
                  <SpeechWaveVisualizer
                    mode={speechEngine.isListening ? 'candidate_speaking' : speechEngine.isSpeaking ? 'examiner_speaking' : 'idle'}
                    analyserNode={speechEngine.analyserNode}
                    className="w-full h-full"
                  />
                </div>

                {/* Realtime Live Transcript */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs min-h-[50px] flex items-center justify-between">
                  <p className="italic leading-relaxed text-slate-200">
                    {speechEngine.transcript || speechEngine.interimTranscript ? (
                      <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                    ) : isMicConnecting ? (
                      <span className="text-amber-400">Đang bật micro... Vui lòng chuẩn bị nói.</span>
                    ) : (
                      <span className="text-slate-500">Bấm nút "Bật Micro Luyện Nói" bên dưới và bắt đầu trả lời bằng tiếng Anh...</span>
                    )}
                  </p>
                  <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                    {speechEngine.audioClips?.[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`]?.blob && !speechEngine.isListening && (
                      <button
                        onClick={() => handleRefineTranscriptWithAI(`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`)}
                        disabled={isRefiningTranscript}
                        className="px-2 py-1 rounded-lg text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                        title="AI Gemini nghe trực tiếp file ghi âm để sửa lỗi nhận diện giọng nói chính xác 99.5%"
                      >
                        {isRefiningTranscript && refiningClipKey === `p1_${activeP1Topic.id}_${activeP1QuestionIndex}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                        )}
                        <span className="hidden sm:inline">AI Chuẩn Hóa</span>
                      </button>
                    )}
                    {speechEngine.transcript && !speechEngine.isListening && (
                      <button
                        onClick={() => {
                          speechEngine.resetTranscript();
                          const key = `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`;
                          if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(key);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Xóa làm lại câu này"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Speaking Fluency & Filler Words Live Alert */}
                {speechEngine.transcript && !speechEngine.isListening && (
                  <SpeakingFillerTracker 
                    transcript={speechEngine.transcript}
                    durationSec={speechEngine.audioClips?.[`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`]?.duration || 30}
                  />
                )}

                {/* Action Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                  <span className="text-[11px] text-slate-400">
                    {speechEngine.transcript ? (
                      <span className="text-purple-300 font-semibold">Đã nói: {speechEngine.transcript.split(' ').filter(Boolean).length} từ</span>
                    ) : (
                      <span>
                        <span className="hidden sm:inline">💡 Mẹo: Nhấn phím Space để bật/tắt mic nhanh</span>
                        <span className="sm:hidden">💡 Chạm nút bên dưới để bật/tắt micro luyện nói</span>
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => handleTogglePracticeRecord(`p1_${activeP1Topic.id}_${activeP1QuestionIndex}`)}
                    disabled={isMicConnecting}
                    className={`px-5 py-3 sm:py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 w-full sm:w-auto ${
                      isMicConnecting
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40 ring-4 ring-amber-400/40 animate-pulse cursor-wait'
                        : speechEngine.isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-4 ring-rose-500/40 animate-pulse' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                    }`}
                  >
                    {isMicConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>ĐANG KẾT NỐI MICRO...</span>
                      </>
                    ) : speechEngine.isListening ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current text-white" />
                        <span>🔴 DỪNG THU ÂM (HOÀN TẤT)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>BẬT MICRO LUYỆN NÓI</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Microphone Error / Permission Alert Banner */}
                {micErrorDetail && (
                  <div className="p-3.5 rounded-xl bg-rose-950/95 border-2 border-rose-500/80 text-rose-200 text-xs flex items-start space-x-2.5 shadow-xl animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1.5">
                      <p className="font-bold text-white text-xs leading-snug">{micErrorDetail}</p>
                      <div className="text-[11px] text-rose-300 leading-relaxed bg-rose-900/40 p-2 rounded-lg border border-rose-800/50 space-y-1">
                        <p><strong>👉 Cách cấp quyền Micro trên trình duyệt:</strong></p>
                        <p>1. Bấm vào biểu tượng <strong>Ổ khóa (🔒)</strong> hoặc <strong>Cài đặt trang web</strong> ở đầu thanh địa chỉ URL.</p>
                        <p>2. Chuyển mục <strong>Microphone</strong> sang <strong>Cho phép (Allow)</strong>.</p>
                        <p>3. Bấm nút <strong>"Kích Hoạt Lại Micro"</strong> bên dưới hoặc tải lại trang (F5).</p>
                      </div>
                      <button
                        onClick={handleRequestMicPermissionDirectly}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Kích Hoạt Lại Micro Ngay</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setMicErrorDetail(null)}
                      className="text-rose-400 hover:text-white text-xs font-bold p-1 rounded bg-rose-900/60 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Playback Box & AI Evaluation */}
                {renderAudioPlayback(
                  `p1_${activeP1Topic.id}_${activeP1QuestionIndex}`,
                  currentP1Question.question,
                  activeP1Topic.title,
                  1
                )}
              </div>

              {/* Vocab Hints */}
              {showVocabHints && currentP1Question.vocabHints?.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Gợi ý Collocations & Idioms Band 7.5+:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentP1Question.vocabHints.map((v, idx) => (
                      <div key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs flex items-center space-x-1">
                        <span className="font-bold text-purple-300">{v.phrase}</span>
                        <span className="text-slate-400 text-[11px]">({v.meaningVi})</span>
                        {onSaveToVocabNotebook && (
                          <button
                            onClick={() => onSaveToVocabNotebook({
                              id: `v-spk-${Date.now()}-${idx}`,
                              phrase: v.phrase,
                              meaningVi: v.meaningVi,
                              example: currentP1Question.sampleAnswer,
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

              {/* Sample Answer */}
              {showSampleAnswer && currentP1Question.sampleAnswer && (
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      Câu trả lời mẫu Band 8.5+ (Theo công thức A.R.E.A):
                    </span>
                    <button
                      onClick={() => handleReadText(currentP1Question.sampleAnswer)}
                      className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Nghe đọc mẫu</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{currentP1Question.sampleAnswer}"
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
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Câu Kế Tiếp →
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PART 2 PRACTICE VIEW WITH PACING BAR & 60s PREP TIMER  */}
      {/* ========================================================= */}
      {practicePart === 2 && activeP2Card && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-150 shadow-xl">
          
          {/* Header & Cue Card Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Part 2 Long Turn (2 Phút Nói)
                </span>
                <span className="text-xs text-slate-400 font-semibold">{activeP2Card.category}</span>
                {onToggleMastered && activeP2Card.id && (
                  <button
                    type="button"
                    onClick={() => onToggleMastered(activeP2Card.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1 cursor-pointer border ${
                      masteredIds.includes(activeP2Card.id)
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                    }`}
                    title={
                      masteredIds.includes(activeP2Card.id)
                        ? 'Đã thuộc Cue Card này (Bấm để bỏ đánh dấu)'
                        : 'Đánh dấu đã thuộc Cue Card này'
                    }
                  >
                    <GraduationCap className="w-3 h-3" />
                    <span>{masteredIds.includes(activeP2Card.id) ? 'Đã thuộc' : 'Thuộc Card'}</span>
                  </button>
                )}
                {activeP2Card.isCustom && onDeleteP2Card && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc muốn xóa Cue Card "${activeP2Card.title}"?`)) {
                        onDeleteP2Card(activeP2Card.id);
                      }
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Xóa Cue Card tự tạo này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">{activeP2Card.title}</h3>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedP2CueCardId}
                onChange={(e) => {
                  setSelectedP2CueCardId(e.target.value);
                  setShowSampleAnswer(false);
                  setSpeakSecondsElapsed(0);
                  setIsPart2Speaking(false);
                  setIsPrepping(false);
                  speechEngine.resetTranscript();
                }}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-bold focus:outline-none cursor-pointer flex-1 sm:flex-initial"
              >
                {(hideMastered ? part2Cards.filter(c => !masteredIds.includes(c.id)) : part2Cards).map(c => (
                  <option key={c.id} value={c.id}>
                    {masteredIds.includes(c.id) ? '🎓 ' : ''}{c.title} {c.isCommunity || (c.isPublic && c.isCustom) ? '(🌐 Cộng Đồng)' : c.isCustom ? '(🔒 Riêng)' : ''}
                  </option>
                ))}
              </select>

              {/* ADD CUE CARD BUTTON (AI / MANUAL) */}
              <button
                onClick={() => {
                  setTopicModalPart(2);
                  setIsTopicModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-900/30 cursor-pointer shrink-0"
                title="Thêm Cue Card luyện tập Part 2 mới bằng AI (Gemini)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ Sinh Cue Card Bằng AI (Gemini)</span>
              </button>
            </div>
          </div>

          {/* Cue Card Frame */}
          <div className="p-5 rounded-2xl bg-slate-950 border-2 border-purple-500/40 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">{activeP2Card.cueCard?.intro}</span>
              <button
                onClick={() => handleReadText(`${activeP2Card.title}. ${activeP2Card.cueCard?.bullets.join('. ')}`)}
                className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe đọc đề</span>
              </button>
            </div>
            <ul className="space-y-2 pl-4 list-disc text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {activeP2Card.cueCard?.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          </div>

          {/* 60s PREPARATION TIMER & 4-QUADRANT MINDMAP */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Giai đoạn 1: Chuẩn bị 1 Phút (60s Note-taking)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-mono font-black ${
                  prepSecondsRemaining <= 10 && prepSecondsRemaining > 0 ? 'text-rose-400 animate-ping' : 'text-emerald-400'
                }`}>
                  00:{prepSecondsRemaining.toString().padStart(2, '0')}
                </span>
                <button
                  onClick={handleStartPart2Prep}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isPrepping 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}
                >
                  {isPrepping ? 'Dừng Nháp' : 'Bắt Đầu Đếm 60s Nháp'}
                </button>
              </div>
            </div>

            {/* 4-Quadrant Mindmap Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeP2Card.mindmapNotes?.map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-purple-400 mr-1.5">Ô {idx + 1}:</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2-MINUTE PACING BAR & LIVE RECORDER */}
          <div className={`p-5 rounded-2xl border space-y-4 transition-all ${
            isPart2Speaking || speechEngine.isListening
              ? 'bg-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/30'
              : 'bg-slate-950 border-slate-800'
          }`}>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white block">
                  Giai đoạn 2: Luyện Nói 2 Phút (Pacing Bar)
                </span>
                <span className="text-[11px] text-slate-400">
                  Thanh định nhịp giúp bạn căn chuẩn mốc 1:30 - 2:00 mà không bị non giờ
                </span>
              </div>
              <span className="text-sm font-mono font-black text-emerald-400">
                {Math.floor(speakSecondsElapsed / 60)}:{(speakSecondsElapsed % 60).toString().padStart(2, '0')} / 02:00
              </span>
            </div>

            {/* CALM 3-STAGE PACING BAR */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                {/* 0 - 60s (Emerald) */}
                <div 
                  className="bg-emerald-500 transition-all duration-300 h-full"
                  style={{ width: `${Math.min(50, (speakSecondsElapsed / 120) * 100)}%` }}
                  title="0 - 60s: Mở đầu & bối cảnh"
                />
                {/* 60 - 90s (Amber) */}
                <div 
                  className="bg-amber-500 transition-all duration-300 h-full"
                  style={{ width: `${Math.max(0, Math.min(25, ((speakSecondsElapsed - 60) / 120) * 100))}%` }}
                  title="60 - 90s: Chi tiết cốt lõi & cảm xúc"
                />
                {/* 90 - 120s (Purple/Rose) */}
                <div 
                  className="bg-rose-500 transition-all duration-300 h-full"
                  style={{ width: `${Math.max(0, Math.min(25, ((speakSecondsElapsed - 90) / 120) * 100))}%` }}
                  title="90 - 120s: Kết luận & bài học"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>0s<span className="hidden sm:inline"> (Bắt đầu)</span></span>
                <span className="text-emerald-400">60s<span className="hidden sm:inline"> (Đã đủ bối cảnh)</span></span>
                <span className="text-amber-400">90s<span className="hidden sm:inline"> (Vùng an toàn 7.0+)</span></span>
                <span className="text-rose-400">120s<span className="hidden sm:inline"> (Chuẩn Cambridge)</span></span>
              </div>
            </div>

            {/* Waveform */}
            <div className="h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
              <SpeechWaveVisualizer
                mode={isPart2Speaking || speechEngine.isListening ? 'candidate_speaking' : 'idle'}
                analyserNode={speechEngine.analyserNode}
                className="w-full h-full"
              />
            </div>

            {/* Live Transcript */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs min-h-[50px] text-slate-200 flex items-center justify-between">
              <p className="italic leading-relaxed flex-1">
                {speechEngine.transcript || speechEngine.interimTranscript ? (
                  <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                ) : (
                  <span className="text-slate-500">Bấm nút "Bắt Đầu Nói 2 Phút" bên dưới khi bạn đã sẵn sàng...</span>
                )}
              </p>
              <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                {speechEngine.audioClips?.[`p2_${activeP2Card.id}`]?.blob && !speechEngine.isListening && (
                  <button
                    onClick={() => handleRefineTranscriptWithAI(`p2_${activeP2Card.id}`)}
                    disabled={isRefiningTranscript}
                    className="px-2 py-1 rounded-lg text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    title="AI Gemini nghe trực tiếp file ghi âm để sửa lỗi nhận diện giọng nói chính xác 99.5%"
                  >
                    {isRefiningTranscript && refiningClipKey === `p2_${activeP2Card.id}` ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                    )}
                    <span className="hidden sm:inline">AI Chuẩn Hóa</span>
                  </button>
                )}
                {speechEngine.transcript && !speechEngine.isListening && (
                  <button
                    onClick={() => {
                      speechEngine.resetTranscript();
                      const key = `p2_${activeP2Card.id}`;
                      if (speechEngine.deleteAudioClip) speechEngine.deleteAudioClip(key);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Xóa làm lại câu này"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Speaking Fluency & Filler Words Live Alert */}
            {speechEngine.transcript && !speechEngine.isListening && (
              <SpeakingFillerTracker 
                transcript={speechEngine.transcript}
                durationSec={speechEngine.audioClips?.[`p2_${activeP2Card.id}`]?.duration || (120 - part2PacingSeconds)}
              />
            )}

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <span className="text-[11px] text-slate-400">
                {speechEngine.transcript ? (
                  <span className="text-purple-300 font-semibold">Đã nói: {speechEngine.transcript.split(' ').filter(Boolean).length} từ</span>
                ) : (
                  <span>
                    <span className="hidden sm:inline">Phím tắt: [Space] bật/tắt</span>
                    <span className="sm:hidden">💡 Chạm nút bên dưới để bắt đầu nói 2 phút</span>
                  </span>
                )}
              </span>

              <button
                onClick={handleTogglePart2Speaking}
                disabled={isMicConnecting}
                className={`px-6 py-3 sm:py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 w-full sm:w-auto ${
                  isMicConnecting
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40 ring-4 ring-amber-400/40 animate-pulse cursor-wait'
                    : isPart2Speaking || speechEngine.isListening
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 ring-4 ring-rose-500/40 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                }`}
              >
                {isMicConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>ĐANG KẾT NỐI MICRO...</span>
                  </>
                ) : isPart2Speaking || speechEngine.isListening ? (
                  <>
                    <Square className="w-4 h-4 fill-current text-white" />
                    <span>🔴 DỪNG NÓI PART 2</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>BẮT ĐẦU NÓI 2 PHÚT</span>
                  </>
                )}
              </button>
            </div>

            {/* Part 2 Microphone Error / Permission Alert Banner */}
            {micErrorDetail && (
              <div className="p-3.5 rounded-xl bg-rose-950/95 border-2 border-rose-500/80 text-rose-200 text-xs flex items-start space-x-2.5 shadow-xl animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <p className="font-bold text-white text-xs leading-snug">{micErrorDetail}</p>
                  <button
                    onClick={handleRequestMicPermissionDirectly}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Cấp Lại Quyền Micro</span>
                  </button>
                </div>
                <button
                  onClick={() => setMicErrorDetail(null)}
                  className="text-rose-400 hover:text-white text-xs font-bold p-1 rounded bg-rose-900/60 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Playback Box & AI Evaluation */}
            {renderAudioPlayback(
              `p2_${activeP2Card.id}`,
              activeP2Card.cueCard?.intro || activeP2Card.title,
              activeP2Card.title,
              2
            )}

          </div>

          {/* Sample Answer Band 8.5 */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 cursor-pointer transition-colors"
              >
                {showSampleAnswer ? 'Ẩn Bài Mẫu Band 8.5' : 'Xem & Nghe Bài Mẫu Band 8.5 Cho Part 2'}
              </button>

              {showSampleAnswer && (
                <button
                  onClick={() => handleReadText(activeP2Card.sampleAnswer)}
                  className="text-xs text-purple-300 hover:text-white font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe Giám khảo đọc toàn bộ bài mẫu</span>
                </button>
              )}
            </div>

            {showSampleAnswer && activeP2Card.sampleAnswer && (
              <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3 animate-in fade-in duration-150">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line italic">
                  {activeP2Card.sampleAnswer}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PART 3 PRACTICE VIEW (PEEL FRAMEWORK)                   */}
      {/* ========================================================= */}
      {practicePart === 3 && currentP3Set && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in duration-150 shadow-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Part 3: Thảo Luận Hai Chiều (Chuyên Sâu)
              </span>
              <span className="text-xs font-bold text-slate-300">{currentP3Set.topic}</span>
              {onToggleMastered && (currentP3Set.linkedPart2Id || currentP3Set.id) && (
                <button
                  type="button"
                  onClick={() => onToggleMastered(currentP3Set.linkedPart2Id || currentP3Set.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1 cursor-pointer border ${
                    masteredIds.includes(currentP3Set.linkedPart2Id || currentP3Set.id)
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                  }`}
                  title={
                    masteredIds.includes(currentP3Set.linkedPart2Id || currentP3Set.id)
                      ? 'Đã thuộc bộ thảo luận này (Bấm để bỏ đánh dấu)'
                      : 'Đánh dấu đã thuộc bộ thảo luận này'
                  }
                >
                  <GraduationCap className="w-3 h-3" />
                  <span>
                    {masteredIds.includes(currentP3Set.linkedPart2Id || currentP3Set.id)
                      ? 'Đã thuộc'
                      : 'Thuộc bộ câu hỏi'}
                  </span>
                </button>
              )}
              {currentP3Set.isCustom && onDeleteP3Set && (
                <button
                  onClick={() => {
                    if (window.confirm(`Bạn có chắc muốn xóa bộ thảo luận "${currentP3Set.topic}"?`)) {
                      onDeleteP3Set(currentP3Set.linkedPart2Id || currentP3Set.id);
                    }
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Xóa bộ thảo luận tự tạo này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedP3Id}
                onChange={(e) => setSelectedP3Id(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none cursor-pointer flex-1 sm:flex-initial"
              >
                {(hideMastered ? part3Sets.filter(s => !masteredIds.includes(s.linkedPart2Id || s.id)) : part3Sets).map((s, idx) => (
                  <option key={s.linkedPart2Id || s.id || idx} value={s.linkedPart2Id || s.id || idx}>
                    {masteredIds.includes(s.linkedPart2Id || s.id) ? '🎓 ' : ''}{s.topic} {s.isCommunity || (s.isPublic && s.isCustom) ? '(🌐 Cộng Đồng)' : s.isCustom ? '(🔒 Riêng)' : ''}
                  </option>
                ))}
              </select>

              {/* ADD PART 3 TOPIC BUTTON */}
              <button
                onClick={() => {
                  setTopicModalPart(3);
                  setIsTopicModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-purple-900/30 cursor-pointer shrink-0"
                title="Thêm bộ câu hỏi thảo luận Part 3 mới bằng AI (Gemini)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ Sinh Bộ Thảo Luận<span className="hidden sm:inline"> Bằng AI (Gemini)</span></span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {currentP3Set.questions?.map((q, idx) => {
              const clipKey = `p3_${q.qId || idx}`;
              return (
                <div key={q.qId || idx} className="p-3.5 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                      Câu hỏi {idx + 1} ({q.analysisType || 'Thảo luận'})
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleReadText(q.question)}
                        className="flex items-center space-x-1 text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/40 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe đọc</span>
                      </button>
                      {(q.qId?.includes('user') || currentP3Set.isCustom || (currentP3Set.questions && currentP3Set.questions.length > 1)) && onDeleteP3Question && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa câu hỏi thảo luận này?`)) {
                              const targetQId = q.qId || q.id;
                              onDeleteP3Question(currentP3Set.linkedPart2Id || currentP3Set.id, targetQId);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                          title="Xóa câu hỏi thảo luận này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    "{q.question}"
                  </h4>
                  <p className="text-xs text-slate-400 italic">
                    💡 Chiến lược PEEL: {q.strategy}
                  </p>

                  {/* Micro recorder for this Part 3 question */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
                    <span className="text-[11px] text-slate-500">
                      Cấu trúc PEEL: Point $\rightarrow$ Explanation $\rightarrow$ Example $\rightarrow$ Link
                    </span>
                    <button
                      onClick={() => handleTogglePracticeRecord(clipKey)}
                      disabled={isMicConnecting}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md active:scale-95 w-full sm:w-auto ${
                        isMicConnecting && activeRecordClipKey === clipKey
                          ? 'bg-amber-600 text-white animate-pulse cursor-wait ring-2 ring-amber-400'
                          : speechEngine.isListening && (activeRecordClipKey === clipKey || !activeRecordClipKey)
                          ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30 shadow-rose-900/40' 
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                      }`}
                    >
                      {isMicConnecting && activeRecordClipKey === clipKey ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Đang Kết Nối Micro...</span>
                        </>
                      ) : speechEngine.isListening && (activeRecordClipKey === clipKey || !activeRecordClipKey) ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current text-white" />
                          <span>🔴 Dừng Thu Âm Câu Này</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Luyện Nói Câu Này</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Part 3 Mic Error Banner */}
                  {micErrorDetail && activeRecordClipKey === clipKey && (
                    <div className="p-3 rounded-xl bg-rose-950/95 border border-rose-500 text-rose-200 text-xs flex items-center justify-between shadow-lg">
                      <span className="font-bold">{micErrorDetail}</span>
                      <button
                        onClick={handleRequestMicPermissionDirectly}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shrink-0 ml-2"
                      >
                        Cấp Lại Quyền
                      </button>
                    </div>
                  )}

                  {/* Realtime Live Wave & Transcript when recording this specific question */}
                  {speechEngine.isListening && (activeRecordClipKey === clipKey || !activeRecordClipKey) && (
                    <div className="space-y-2 p-3 rounded-xl bg-slate-900 border border-rose-500/40 ring-1 ring-rose-500/30 animate-in fade-in duration-150">
                      <div className="h-10 rounded-lg bg-slate-950 overflow-hidden">
                        <SpeechWaveVisualizer
                          mode="candidate_speaking"
                          analyserNode={speechEngine.analyserNode}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-xs italic text-slate-200">
                        {speechEngine.transcript || speechEngine.interimTranscript ? (
                          <span>"{speechEngine.transcript} <strong className="text-emerald-400 not-italic font-semibold">{speechEngine.interimTranscript}</strong>"</span>
                        ) : (
                          <span className="text-emerald-400 animate-pulse">🎤 Đang nghe giọng bạn... Hãy trả lời bằng tiếng Anh</span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Audio Playback & AI Evaluation for this question */}
                  {renderAudioPlayback(clipKey, q.question, currentP3Set.topic, 3)}
                </div>
              );
            })}
          </div>

          {/* Quick Add Question to Part 3 set */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setIsQuickAddQOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-300 text-xs font-bold border border-purple-700/50 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Câu Hỏi Vào Bộ Thảo Luận Này</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TOPIC & QUESTION CREATION MODAL (AI + MANUAL)          */}
      {/* ========================================================= */}
      <SpeakingPracticeTopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        part={topicModalPart}
        apiKey={apiKey}
        model={model}
        onTopicCreated={(newTopic) => {
          if (topicModalPart === 1 && onAddP1Topic) {
            onAddP1Topic(newTopic);
          } else if (topicModalPart === 2 && onAddP2Card) {
            onAddP2Card(newTopic);
          } else if (topicModalPart === 3 && onAddP3Set) {
            onAddP3Set(newTopic);
            setSelectedP3Id(newTopic.linkedPart2Id || newTopic.id);
          }
        }}
      />

      {/* ========================================================= */}
      {/* 6. QUICK ADD QUESTION MODAL (FOR CURRENT TOPIC)           */}
      {/* ========================================================= */}
      {isQuickAddQOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-purple-400" />
                <span>Thêm Câu Hỏi Mới Vào Chủ Đề: {practicePart === 1 ? activeP1Topic?.title : currentP3Set?.topic}</span>
              </h3>
              <button
                onClick={() => setIsQuickAddQOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Nội Dung Câu Hỏi Tiếng Anh:</label>
                <textarea
                  rows={3}
                  value={quickQText}
                  onChange={(e) => setQuickQText(e.target.value)}
                  placeholder="Ví dụ: How do you think artificial intelligence will change the way people work in the next ten years?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Mẹo / Chiến Lược Trả Lời (Tùy chọn):</label>
                <input
                  type="text"
                  value={quickQStrategy}
                  onChange={(e) => setQuickQStrategy(e.target.value)}
                  placeholder="Ví dụ: Áp dụng công thức PEEL, nêu tác động tích cực và rủi ro..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsQuickAddQOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleQuickAddQuestion}
                disabled={!quickQText.trim()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                + Thêm Câu Hỏi Này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. SINGLE ANSWER AI EVALUATION MODAL                      */}
      {/* ========================================================= */}
      <SpeakingSingleEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        evaluation={singleEvaluationResult}
        questionText={evaluationContext?.questionText || ''}
        topicTitle={evaluationContext?.topicTitle || ''}
        candidateTranscript={evaluationContext?.candidateTranscript || ''}
        part={evaluationContext?.part || 1}
        onSaveToHistoryAndCleanVoice={handleSaveEvaluationAndCleanVoice}
        onReEvaluateWithAI={() => handleEvaluateWithAI(
          evaluationContext?.clipKey,
          evaluationContext?.questionText,
          evaluationContext?.topicTitle,
          evaluationContext?.part
        )}
        onReEvaluateAlgorithmically={() => handleEvaluateAlgorithmically(
          evaluationContext?.clipKey,
          evaluationContext?.questionText,
          evaluationContext?.topicTitle,
          evaluationContext?.part
        )}
        isEvaluatingAI={isEvaluatingSingle}
      />

    </div>
  );
}
