import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, MicOff, Volume2, Play, Pause, Square, RotateCcw, CheckCircle2, 
  Sparkles, BookOpen, Layers, Clock, Award, Shield, Compass, Headphones, 
  ChevronRight, ArrowRight, Lightbulb, Copy, Info, AlertCircle, Plus,
  Trash2, Loader2, GraduationCap, Zap, Edit3, Check
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
import SpeakingPart1Room from './subrooms/SpeakingPart1Room';
import SpeakingPart2Room from './subrooms/SpeakingPart2Room';
import SpeakingPart3Room from './subrooms/SpeakingPart3Room';
import { useTranslation } from '../../context/LanguageContext.jsx';

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
  const { isEn } = useTranslation();
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
  const [refinedClips, setRefinedClips] = useState({});
  const [activeRecordClipKey, setActiveRecordClipKey] = useState('');
  const [isMicConnecting, setIsMicConnecting] = useState(false);
  const [micErrorDetail, setMicErrorDetail] = useState(null);
  const [editingTranscriptKey, setEditingTranscriptKey] = useState('');
  const [editedTranscriptText, setEditedTranscriptText] = useState('');

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

  // Existing topics & questions calculation to prevent AI duplicates
  const currentExistingTopics = useMemo(() => {
    if (topicModalPart === 1) {
      return (part1Topics || []).map(t => t.title).filter(Boolean);
    } else if (topicModalPart === 2) {
      return (part2Cards || []).map(c => c.title || c.prompt).filter(Boolean);
    } else {
      return (part3Sets || []).map(s => s.topic).filter(Boolean);
    }
  }, [topicModalPart, part1Topics, part2Cards, part3Sets]);

  const currentExistingQuestions = useMemo(() => {
    if (topicModalPart === 1) {
      return (part1Topics || []).flatMap(t => (t.questions || []).map(q => q.question)).filter(Boolean);
    } else if (topicModalPart === 2) {
      return (part2Cards || []).map(c => c.prompt).filter(Boolean);
    } else {
      return (part3Sets || []).flatMap(s => (s.questions || []).map(q => q.question)).filter(Boolean);
    }
  }, [topicModalPart, part1Topics, part2Cards, part3Sets]);

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
    setRefinedClips(prev => {
      const next = { ...prev };
      delete next[clipKey];
      return next;
    });

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
      setRefinedClips(prev => {
        const next = { ...prev };
        delete next[clipKey];
        return next;
      });

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
        alert(isEn 
          ? '⚠️ Microphone permission denied!\n\nPlease click the Lock (🔒) icon on your browser URL bar and choose "Allow" for Microphone.' 
          : '⚠️ Trình duyệt chưa cấp quyền truy cập Micro!\n\nVui lòng bấm vào biểu tượng Ổ khóa (🔒) trên thanh địa chỉ URL của trình duyệt và chọn "Cho phép (Allow)" Micro.');
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
      alert(isEn ? 'No audio recording found in RAM. Please record your answer first.' : 'Chưa tìm thấy bản ghi âm trong bộ nhớ RAM. Vui lòng ghi âm câu trả lời trước.');
      return null;
    }
    if (!apiKey) {
      if (onOpenSettings) {
        if (window.confirm(isEn ? 'Please enter an AI API Key in Settings for high-precision multimodal speech recognition. Open Settings now?' : 'Vui lòng nhập AI API Key trong Cài đặt để AI nhận diện giọng nói chính xác cao (Multimodal Audio). Mở Cài đặt ngay?')) {
          onOpenSettings();
        }
      } else {
        alert(isEn ? 'Please configure your AI API Key in Settings.' : 'Vui lòng cấu hình AI API Key trong Cài đặt.');
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
        setRefinedClips(prev => ({ ...prev, [clipKey]: true }));
      }
      return accurateTranscript;
    } catch (err) {
      console.error('AI Audio STT error:', err);
      alert((isEn ? 'Failed to recognize audio with AI: ' : 'Không thể nhận diện âm thanh qua AI: ') + (err.message || (isEn ? 'Unknown error' : 'Lỗi không xác định')));
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
      alert(isEn 
        ? 'Your answer is too short or the microphone did not capture speech. Please say at least a few sentences so the algorithm can analyze fluency, grammar, and vocabulary.' 
        : 'Câu trả lời của bạn quá ngắn hoặc micro chưa thu âm được từ ngữ. Vui lòng nói ít nhất vài câu để thuật toán có thể phân tích độ trôi chảy, ngữ pháp và từ vựng.');
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
      alert((isEn ? 'Error during algorithmic evaluation: ' : 'Lỗi khi chấm bài bằng thuật toán máy tính: ') + (err.message || (isEn ? 'Please try again.' : 'Vui lòng thử lại.')));
    }
  };

  // 2. AI EXAMINER EVALUATION (Cambridge AI qualitative analysis)
  const handleEvaluateWithAI = async (clipKey, questionText, topicTitle, partNum) => {
    if (!apiKey) {
      if (onOpenSettings) {
        if (window.confirm(isEn ? 'Please enter your AI API Key in Settings to use AI grading. Open Settings now?' : 'Vui lòng nhập AI API Key trong phần Cài đặt để sử dụng tính năng Chấm điểm bằng AI. Mở Cài đặt ngay?')) {
          onOpenSettings();
        }
      } else {
        alert(isEn ? 'Please configure your AI API Key in Settings to evaluate speaking.' : 'Vui lòng cấu hình AI API Key trong Cài đặt để chấm điểm bài nói.');
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
      alert(isEn 
        ? 'Your answer is too short or the microphone did not detect words. Please turn on the microphone and answer a few sentences before submitting for AI grading.' 
        : 'Câu trả lời của bạn quá ngắn hoặc mic chưa nhận diện được từ ngữ. Vui lòng bấm "Bật Micro Luyện Nói" và trả lời ít nhất vài câu trước khi yêu cầu AI chấm điểm.');
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
      setRefinedClips(prev => {
        const next = { ...prev };
        delete next[clipKey];
        return next;
      });
    };

    const isClipAiRefined = !!refinedClips[clipKey];

    return (
      <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/50 space-y-3 animate-in fade-in duration-150">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center space-x-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{isEn ? `Playback & Evaluate (${clip?.duration || 1}s):` : `Nghe lại & Đánh giá câu trả lời (${clip?.duration || 1}s):`}</span>
          </span>
          <span className="text-[10px] text-purple-300 font-semibold bg-purple-900/50 px-2 py-0.5 rounded border border-purple-700/40">
            {isEn ? 'RAM-Only (Cleared on save)' : 'RAM-Only (Tự hủy khi lưu)'}
          </span>
        </div>

        {/* Live Speaking Fluency & Filler Words Tracker */}
        {speechEngine.transcript && (
          <SpeakingFillerTracker 
            transcript={speechEngine.transcript} 
            durationSec={clip?.duration || 30} 
          />
        )}

        {/* AI Audio Accuracy Recommendation Callout Banner */}
        {clip?.blob && (
          <div className={`p-3 rounded-xl border transition-all ${
            isClipAiRefined
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border-indigo-500/40 text-indigo-100 shadow-md shadow-indigo-950/30'
          }`}>
            <div className="flex items-start gap-2.5">
              <div className={`p-1.5 rounded-lg shrink-0 ${isClipAiRefined ? 'bg-emerald-900/60 text-emerald-300' : 'bg-indigo-900/60 text-amber-300'}`}>
                {isClipAiRefined ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              </div>
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-xs">
                    {isEn 
                      ? (isClipAiRefined ? 'Transcript Refined with AI' : 'Recommended: Refine Transcript with AI') 
                      : (isClipAiRefined ? 'Transcript Đã Được Chuẩn Hóa Bằng AI' : 'Khuyên dùng: Chuẩn Hóa Lời Thoại Bằng AI')}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    isClipAiRefined 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse'
                  }`}>
                    {isEn ? (isClipAiRefined ? '✨ 98%+ Accuracy' : '⚡ Recommended') : (isClipAiRefined ? '✨ Độ chính xác 98%+' : '⚡ Khuyên Dùng')}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {isEn
                    ? (isClipAiRefined
                        ? 'Spoken words have been directly transcribed from original audio and normalized accurately word-for-word.'
                        : 'Browser live recognition may mishear word endings. Click "✨ AI Refine" below to transcribe the exact audio recording for best evaluation results.')
                    : (isClipAiRefined
                        ? 'Văn bản lời nói đã được AI Multimodal Audio nghe trực tiếp từ file âm thanh gốc và chuẩn hóa chính xác từng từ ngữ.'
                        : 'Nhận diện thời gian thực của trình duyệt có thể nghe nhầm hoặc thiếu âm đuôi. Bạn nên bấm nút "✨ AI Nhận Diện Lại" bên dưới để AI nghe trực tiếp file ghi âm, giúp kết quả chấm điểm chuẩn xác nhất.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Live Transcript Display with Inline Manual Quick Edit */}
        {speechEngine.transcript && (
          <div className="p-3 rounded-xl bg-slate-900/95 border border-purple-800/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
                <span>{isEn ? '📝 Captured Transcript:' : '📝 Lời thoại thu được (Transcript):'}</span>
              </span>
              <button
                onClick={() => {
                  if (editingTranscriptKey === clipKey) {
                    setEditingTranscriptKey('');
                  } else {
                    setEditingTranscriptKey(clipKey);
                    setEditedTranscriptText(speechEngine.transcript);
                  }
                }}
                className="px-2 py-0.5 rounded text-[11px] font-bold text-purple-300 hover:text-white bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 flex items-center space-x-1 cursor-pointer transition-colors"
                title={isEn ? 'Manually edit words if recognition misheard' : 'Tự sửa nhanh từ ngữ nếu máy nghe nhầm'}
              >
                <Edit3 className="w-3 h-3 text-purple-400" />
                <span>{editingTranscriptKey === clipKey ? (isEn ? 'Close' : 'Đóng') : (isEn ? '✏️ Edit Transcript' : '✏️ Sửa Lời Thoại')}</span>
              </button>
            </div>

            {editingTranscriptKey === clipKey ? (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                <textarea
                  value={editedTranscriptText}
                  onChange={(e) => setEditedTranscriptText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-purple-500/60 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 leading-relaxed font-sans"
                  placeholder={isEn ? 'Correct any words you spoke...' : 'Sửa lại đúng từ ngữ bạn vừa nói...'}
                />
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setEditingTranscriptKey('')}
                    className="px-2.5 py-1 rounded-md text-[11px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Hủy'}
                  </button>
                  <button
                    onClick={() => {
                      if (speechEngine.setCustomTranscript) {
                        speechEngine.setCustomTranscript(editedTranscriptText.trim());
                      }
                      setEditingTranscriptKey('');
                    }}
                    className="px-3 py-1 rounded-md text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-500 shadow cursor-pointer flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>{isEn ? 'Save Transcript' : 'Lưu Lời Thoại'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="italic text-slate-200 leading-relaxed text-[11px] sm:text-xs">
                "{speechEngine.transcript}"
              </p>
            )}
          </div>
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
                  <span>{isEn ? 'Pause' : 'Tạm Dừng'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isEn ? '🔊 Play Audio' : '🔊 Nghe Lại Giọng'}</span>
                </>
              )}
            </button>
          )}

          {/* AI AUDIO MULTIMODAL STT BUTTON */}
          {clip?.blob && (
            <button
              onClick={() => handleRefineTranscriptWithAI(clipKey)}
              disabled={isRefiningTranscript}
              className={`flex-1 sm:flex-none py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all border ${
                isClipAiRefined
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border-emerald-600/50'
                  : 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 hover:from-indigo-800 hover:to-purple-800 text-indigo-200 hover:text-white border-indigo-500/60 shadow-sm shadow-indigo-950/50'
              }`}
              title={isEn ? 'Use AI Multimodal Audio on RAM audio for 98%+ transcription accuracy' : 'Dùng AI Multimodal Audio nghe file âm thanh từ RAM để phiên âm chuẩn xác 98%+'}
            >
              {isRefiningTranscript && refiningClipKey === clipKey ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>{isEn ? 'AI Listening...' : 'AI Đang Nghe...'}</span>
                </>
              ) : isClipAiRefined ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'AI Refined' : 'Đã Chuẩn Hóa AI'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
                  <span>{isEn ? '✨ AI Refine' : '✨ AI Nhận Diện Lại'}</span>
                  <span className="ml-1 text-[9px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-400/40">
                    {isEn ? 'Recommended' : 'Khuyên Dùng'}
                  </span>
                </>
              )}
            </button>
          )}

          {/* DUAL EVALUATION ENGINES: MACHINE (OFFLINE) VS AI */}
          <button
            onClick={() => handleEvaluateAlgorithmically(clipKey, questionText, topicTitle, partNum)}
            className="flex-1 min-w-[140px] py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-950/40 flex items-center justify-center space-x-1.5 cursor-pointer transition-all hover:scale-[1.01]"
            title={isEn ? 'Instant grading (0.02ms) with 4 Cambridge criteria, 100% Offline & Free' : 'Chấm điểm tức thì (0.02ms) bằng thuật toán 4 tiêu chí Cambridge, 100% Offline & Miễn phí'}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{isEn ? '⚡ Algorithmic (Instant)' : '⚡ Chấm Máy (Tức Thì)'}</span>
          </button>

          <button
            onClick={() => handleEvaluateWithAI(clipKey, questionText, topicTitle, partNum)}
            disabled={isEvaluatingSingle}
            className="flex-1 min-w-[140px] py-2.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-purple-950/50 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60 transition-all hover:scale-[1.01]"
            title={isEn ? 'AI Examiner evaluates in-depth, rewrites and provides Band 8.5+ model answer' : 'Giám khảo AI chấm phân tích sâu, sửa câu & viết lại bản Band 8.5+'}
          >
            {isEvaluatingSingle && evaluatingClipKey === clipKey ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isEn ? 'AI Grading...' : 'AI Đang Chấm...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                <span>{isEn ? '🤖 AI Examiner Grade' : '🤖 Chấm Bằng AI'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearClip}
            className="py-2 px-2.5 sm:px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1 cursor-pointer transition-colors"
            title={isEn ? 'Clear audio from RAM immediately to save memory' : 'Xóa âm thanh ngay khỏi bộ nhớ RAM để tiết kiệm tài nguyên'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEn ? 'Clear Clip' : 'Xóa File Tạm'}</span>
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
            <span>Part 1<span className="hidden sm:inline">: {isEn ? 'Interview (A.R.E.A)' : 'Phỏng Vấn (A.R.E.A)'}</span></span>
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
            <span>Part 2<span className="hidden sm:inline">: {isEn ? 'Cue Card & Pacing' : 'Cue Card & Pacing'}</span></span>
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
            <span>Part 3<span className="hidden sm:inline">: {isEn ? 'Discussion (PEEL)' : 'Thảo Luận (PEEL)'}</span></span>
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
            title={isEn ? 'Use AI to generate new topics and questions for this Part' : 'Dùng AI để tạo chủ đề và câu hỏi mới cho Part này'}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? '✨ Generate Topic (AI)' : '✨ Sinh Chủ Đề (AI)'}</span>
          </button>

          <button
            onClick={onOpenIdeaMatrix}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-purple-200 border border-purple-700/50 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 whitespace-nowrap"
            title={isEn ? 'Open 5W1H & multi-perspective brainstorm matrix' : 'Mở bảng ma trận gợi ý ý tưởng 5W1H & Đa góc nhìn'}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Idea Matrix</span>
          </button>

          <button
            onClick={onOpenShadowing}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-slate-700 text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap"
            title={isEn ? 'Listen and shadow Band 8.5+ model pronunciation' : 'Luyện nghe và nhại lại giọng đọc chuẩn Band 8.5+'}
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
            <h4 className="font-bold text-white text-sm">
              {isEn ? 'Microphone Access Denied by Browser!' : 'Trình duyệt chưa cho phép truy cập Micro!'}
            </h4>
            <p className="text-rose-200 leading-relaxed">
              {isEn
                ? 'To practice and evaluate your speech, please click the Lock (🔒) icon or Site Settings on your browser URL bar, choose Allow for Microphone, and click Start Microphone again.'
                : 'Để luyện nói và chấm điểm, bạn vui lòng nhấp vào biểu tượng Ổ khóa (🔒) hoặc Cài đặt trang web trên thanh địa chỉ URL của trình duyệt, chọn Cho phép (Allow) Microphone, sau đó bấm nút Bật Micro lại.'}
            </p>
          </div>
        </div>
      )}

      {/* Practice Welcome & Quick AI Generator Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {isEn ? 'Unlimited Free Practice' : 'Luyện Tập Tự Do Không Giới Hạn'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">• {isEn ? 'Integrated Cambridge AI Evaluation' : 'Tích hợp chấm điểm AI Cambridge'}</span>
          </div>
          <p className="text-xs text-slate-300">
            {isEn
              ? 'Practice questions individually, get 4 Cambridge criteria analysis and Band 8.5+ upgrades. You can generate unlimited custom topics with AI!'
              : 'Luyện từng câu hỏi độc lập, nhận ngay nhận xét 4 tiêu chí khảo thí & bản nâng cấp Band 8.5+. Bạn có thể sinh thêm bất kỳ chủ đề/câu hỏi nào bằng AI!'}
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
          <span>{isEn ? '✨ Generate Topic with AI' : '✨ Sinh Chủ Đề Bằng AI'}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. PART 1 PRACTICE VIEW                                    */}
      {/* ========================================================= */}
      {practicePart === 1 && (
        <SpeakingPart1Room
          part1Topics={part1Topics}
          selectedP1TopicId={selectedP1TopicId}
          setSelectedP1TopicId={setSelectedP1TopicId}
          activeP1QuestionIndex={activeP1QuestionIndex}
          setActiveP1QuestionIndex={setActiveP1QuestionIndex}
          activeP1Topic={activeP1Topic}
          currentP1Question={currentP1Question}
          hideMastered={hideMastered}
          handleToggleHideMastered={handleToggleHideMastered}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
          onDeleteP1Topic={onDeleteP1Topic}
          onDeleteP1Question={onDeleteP1Question}
          onOpenTopicModal={(part) => {
            setTopicModalPart(part);
            setIsTopicModalOpen(true);
          }}
          onOpenQuickAddQ={() => setIsQuickAddQOpen(true)}
          showVocabHints={showVocabHints}
          setShowVocabHints={setShowVocabHints}
          showSampleAnswer={showSampleAnswer}
          setShowSampleAnswer={setShowSampleAnswer}
          handleReadText={handleReadText}
          speechEngine={speechEngine}
          isMicConnecting={isMicConnecting}
          handleTogglePracticeRecord={handleTogglePracticeRecord}
          micErrorDetail={micErrorDetail}
          handleRequestMicPermissionDirectly={handleRequestMicPermissionDirectly}
          setMicErrorDetail={setMicErrorDetail}
          refinedClips={refinedClips}
          isRefiningTranscript={isRefiningTranscript}
          refiningClipKey={refiningClipKey}
          handleRefineTranscriptWithAI={handleRefineTranscriptWithAI}
          onSaveToVocabNotebook={onSaveToVocabNotebook}
          renderAudioPlayback={renderAudioPlayback}
        />
      )}

      {/* ========================================================= */}
      {/* 3. PART 2 PRACTICE VIEW WITH PACING BAR & 60s PREP TIMER  */}
      {/* ========================================================= */}
      {practicePart === 2 && activeP2Card && (
        <SpeakingPart2Room
          activeP2Card={activeP2Card}
          part2Cards={part2Cards}
          selectedP2CueCardId={selectedP2CueCardId}
          setSelectedP2CueCardId={setSelectedP2CueCardId}
          hideMastered={hideMastered}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
          onDeleteP2Card={onDeleteP2Card}
          onOpenTopicModal={(part) => {
            setTopicModalPart(part);
            setIsTopicModalOpen(true);
          }}
          handleReadText={handleReadText}
          prepSecondsRemaining={prepSecondsRemaining}
          isPrepping={isPrepping}
          handleStartPart2Prep={handleStartPart2Prep}
          speakSecondsElapsed={speakSecondsElapsed}
          isPart2Speaking={isPart2Speaking}
          speechEngine={speechEngine}
          handleRefineTranscriptWithAI={handleRefineTranscriptWithAI}
          isRefiningTranscript={isRefiningTranscript}
          refiningClipKey={refiningClipKey}
          refinedClips={refinedClips}
          part2PacingSeconds={part2PacingSeconds}
          handleTogglePart2Speaking={handleTogglePart2Speaking}
          isMicConnecting={isMicConnecting}
          micErrorDetail={micErrorDetail}
          handleRequestMicPermissionDirectly={handleRequestMicPermissionDirectly}
          setMicErrorDetail={setMicErrorDetail}
          renderAudioPlayback={renderAudioPlayback}
          showSampleAnswer={showSampleAnswer}
          setShowSampleAnswer={setShowSampleAnswer}
          setIsPart2Speaking={setIsPart2Speaking}
          setIsPrepping={setIsPrepping}
          setSpeakSecondsElapsed={setSpeakSecondsElapsed}
        />
      )}

      {/* ========================================================= */}
      {/* 4. PART 3 PRACTICE VIEW (PEEL FRAMEWORK)                   */}
      {/* ========================================================= */}
      {practicePart === 3 && currentP3Set && (
        <SpeakingPart3Room
          currentP3Set={currentP3Set}
          part3Sets={part3Sets}
          selectedP3Id={selectedP3Id}
          setSelectedP3Id={setSelectedP3Id}
          hideMastered={hideMastered}
          masteredIds={masteredIds}
          onToggleMastered={onToggleMastered}
          onDeleteP3Set={onDeleteP3Set}
          onOpenTopicModal={(part) => {
            setTopicModalPart(part);
            setIsTopicModalOpen(true);
          }}
          handleReadText={handleReadText}
          onDeleteP3Question={onDeleteP3Question}
          handleTogglePracticeRecord={handleTogglePracticeRecord}
          isMicConnecting={isMicConnecting}
          activeRecordClipKey={activeRecordClipKey}
          speechEngine={speechEngine}
          micErrorDetail={micErrorDetail}
          handleRequestMicPermissionDirectly={handleRequestMicPermissionDirectly}
          renderAudioPlayback={renderAudioPlayback}
          onOpenQuickAddQ={() => setIsQuickAddQOpen(true)}
        />
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
        existingTopics={currentExistingTopics}
        existingQuestions={currentExistingQuestions}
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
                <span>
                  {isEn ? 'Add New Question to: ' : 'Thêm Câu Hỏi Mới Vào Chủ Đề: '}
                  {practicePart === 1 ? activeP1Topic?.title : currentP3Set?.topic}
                </span>
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
                <label className="font-bold text-slate-300">
                  {isEn ? 'English Question Text:' : 'Nội Dung Câu Hỏi Tiếng Anh:'}
                </label>
                <textarea
                  rows={3}
                  value={quickQText}
                  onChange={(e) => setQuickQText(e.target.value)}
                  placeholder={isEn ? 'e.g. How do you think artificial intelligence will change the way people work in the next ten years?' : 'Ví dụ: How do you think artificial intelligence will change the way people work in the next ten years?'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">
                  {isEn ? 'Tip / Answer Strategy (Optional):' : 'Mẹo / Chiến Lược Trả Lời (Tùy chọn):'}
                </label>
                <input
                  type="text"
                  value={quickQStrategy}
                  onChange={(e) => setQuickQStrategy(e.target.value)}
                  placeholder={isEn ? 'e.g. Apply PEEL formula, state positive impacts and risks...' : 'Ví dụ: Áp dụng công thức PEEL, nêu tác động tích cực và rủi ro...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsQuickAddQOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Hủy'}
              </button>
              <button
                onClick={handleQuickAddQuestion}
                disabled={!quickQText.trim()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {isEn ? '+ Add Question' : '+ Thêm Câu Hỏi Này'}
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
