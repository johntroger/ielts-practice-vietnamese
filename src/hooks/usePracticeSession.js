import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { speakingSoundEffects } from '../utils/speakingSoundEffects';
import { transcribeAudioWithGemini } from '../services/geminiService';
import { evaluateSinglePracticeAnswerAlgorithmically } from '../services/algorithmicSpeakingService';
import { evaluateSpeakingPracticeAnswer } from '../services/ai/speakingAiService';

export function usePracticeSession({
  speechEngine,
  activeExaminer,
  activeP1Topic,
  activeP1QuestionIndex,
  activeP2Card,
  currentP3Set,
  practicePart,
  apiKey,
  model,
  onOpenSettings,
  onPracticeAnswerSubmitted,
  isEn = false
}) {
  // Part 2 Timers & Pacing State
  const [prepSecondsRemaining, setPrepSecondsRemaining] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [speakSecondsElapsed, setSpeakSecondsElapsed] = useState(0);
  const [isPart2Speaking, setIsPart2Speaking] = useState(false);
  const prepTimerRef = useRef(null);
  const speakTimerRef = useRef(null);

  // Active clip recording key & mic connection state
  const [activeRecordClipKey, setActiveRecordClipKey] = useState('');
  const [isMicConnecting, setIsMicConnecting] = useState(false);
  const [micErrorDetail, setMicErrorDetail] = useState(null);

  // AI Multimodal STT refinement state
  const [isRefiningTranscript, setIsRefiningTranscript] = useState(false);
  const [refiningClipKey, setRefiningClipKey] = useState('');
  const [refinedClips, setRefinedClips] = useState({});

  // Single practice evaluation modal & results
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [singleEvaluationResult, setSingleEvaluationResult] = useState(null);
  const [evaluationContext, setEvaluationContext] = useState(null);
  const [isEvaluatingSingle, setIsEvaluatingSingle] = useState(false);
  const [evaluatingClipKey, setEvaluatingClipKey] = useState('');

  // Audio Playback
  const [isPlayingPracticeAudio, setIsPlayingPracticeAudio] = useState(false);
  const practiceAudioRef = useRef(null);

  // Transcript Inline Editing State
  const [editingTranscriptKey, setEditingTranscriptKey] = useState(null);
  const [editedTranscriptText, setEditedTranscriptText] = useState('');

  // Cleanup on unmount or tab/topic switch
  useEffect(() => {
    return () => {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
      if (practiceAudioRef.current) {
        practiceAudioRef.current.pause();
        setIsPlayingPracticeAudio(false);
      }
    };
  }, [practicePart, activeP1Topic?.id, activeP1QuestionIndex, activeP2Card?.id]);

  // Read examiner text with TTS
  const handleReadText = useCallback((text) => {
    if (speechEngine?.speak) {
      speechEngine.speak(text, { examinerId: activeExaminer?.id });
    }
  }, [speechEngine, activeExaminer?.id]);

  // Direct Mic Permission Requester
  const handleRequestMicPermissionDirectly = useCallback(async () => {
    setMicErrorDetail(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ getUserMedia.');
      }
      const testStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      testStream.getTracks().forEach(track => track.stop());
      alert(isEn 
        ? 'Microphone is ready! You can click "TURN ON MIC" to start speaking.' 
        : 'Micro đã sẵn sàng! Bạn có thể nhấn nút "BẬT MICRO LUYỆN NÓI" để bắt đầu trả lời.');
    } catch (err) {
      console.warn('Direct mic permission test error:', err);
      setMicErrorDetail(err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
        ? (isEn 
            ? 'Browser blocked microphone! Click the Lock (🔒) icon next to the URL bar to allow microphone.' 
            : 'Trình duyệt đang CHẶN Microphone! Hãy nhấp vào biểu tượng Ổ khóa (🔒) bên trái thanh URL để Cho phép Micro.')
        : (err.message || (isEn ? 'Cannot connect to microphone. Please check your device.' : 'Không thể kết nối Micro. Hãy kiểm tra thiết bị của bạn.')));
    }
  }, [isEn]);

  // Toggle generic practice recording with visible feedback
  const handleTogglePracticeRecord = useCallback(async (clipKey) => {
    setMicErrorDetail(null);
    if (isMicConnecting) return;

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
      setMicErrorDetail(err.message || (isEn 
        ? 'Browser microphone permission denied. Click the Lock icon (🔒) on the URL bar to allow.' 
        : 'Trình duyệt chưa cho phép truy cập Micro. Hãy bấm vào biểu tượng Ổ khóa (🔒) trên thanh URL để Cho phép Micro.'));
    } finally {
      setIsMicConnecting(false);
    }
  }, [isMicConnecting, speechEngine, isEn]);

  // Part 2 Prep Timer
  const handleStartPart2Prep = useCallback(() => {
    if (isPrepping) {
      if (prepTimerRef.current) clearInterval(prepTimerRef.current);
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
  }, [isPrepping]);

  // Part 2 Speaking Timer
  const handleTogglePart2Speaking = useCallback(async () => {
    if (isMicConnecting) return;
    const clipKey = `p2_${activeP2Card?.id || 'card'}`;

    if (isPart2Speaking || speechEngine.isListening) {
      if (speakTimerRef.current) clearInterval(speakTimerRef.current);
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
          ? 'Microphone permission denied!\n\nPlease click the Lock (🔒) icon on your browser URL bar and choose "Allow" for Microphone.' 
          : 'Trình duyệt chưa cấp quyền truy cập Micro!\n\nVui lòng bấm vào biểu tượng Ổ khóa (🔒) trên thanh địa chỉ URL của trình duyệt và chọn "Cho phép (Allow)" Micro.');
      } finally {
        setIsMicConnecting(false);
      }
    }
  }, [isMicConnecting, activeP2Card?.id, isPart2Speaking, speechEngine, isEn]);

  // AI Multimodal STT Refinement
  const handleRefineTranscriptWithAI = useCallback(async (clipKey) => {
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
        speechEngine.setCustomTranscript(accurateTranscript, clipKey);
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
  }, [speechEngine, apiKey, model, onOpenSettings, isEn]);

  // Algorithmic Offline Evaluation
  const handleEvaluateAlgorithmically = useCallback((clipKey, questionText, topicTitle, partNum) => {
    const clipSpecificText = clipKey
      ? (speechEngine.transcriptsByClip?.[clipKey] ?? (speechEngine.activeClipId === clipKey ? speechEngine.transcript : ''))
      : speechEngine.transcript;
    let currentTranscript = clipSpecificText?.trim() || evaluationContext?.candidateTranscript || speechEngine.transcript?.trim();
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
        cueBullets: activePart === 2 ? (activeP2Card?.cueCard?.bullets || activeP2Card?.cueBullets || activeP2Card?.prompts || []) : null,
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
  }, [speechEngine, evaluationContext, speakSecondsElapsed, activeP2Card, isEn]);

  // AI Examiner Evaluation with Auto Multimodal Fallback
  const handleEvaluateWithAI = useCallback(async (clipKey, questionText, topicTitle, partNum) => {
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

    const clipSpecificText = clipKey
      ? (speechEngine.transcriptsByClip?.[clipKey] ?? (speechEngine.activeClipId === clipKey ? speechEngine.transcript : ''))
      : speechEngine.transcript;
    let currentTranscript = clipSpecificText?.trim() || evaluationContext?.candidateTranscript || speechEngine.transcript?.trim();
    const clip = clipKey ? speechEngine.audioClips?.[clipKey] : null;

    // AUTO GEMINI MULTIMODAL STT FALLBACK:
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
            speechEngine.setCustomTranscript(aiTranscribed, clipKey);
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
        cueBullets: activePart === 2 ? (activeP2Card?.cueCard?.bullets || activeP2Card?.cueBullets || activeP2Card?.prompts || []) : null,
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
      alert(err.message || (isEn ? 'Error grading speech. Please try again.' : 'Lỗi khi chấm bài nói. Vui lòng thử lại.'));
    } finally {
      setIsEvaluatingSingle(false);
      setEvaluatingClipKey('');
    }
  }, [apiKey, onOpenSettings, isEn, speechEngine, evaluationContext, speakSecondsElapsed, activeP2Card, model]);

  // Save Evaluation & Zero Voice Retention
  const handleSaveEvaluationAndCleanVoice = useCallback(() => {
    if (!singleEvaluationResult || !evaluationContext) return;

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

    if (evaluationContext.clipKey && speechEngine.deleteAudioClip) {
      speechEngine.deleteAudioClip(evaluationContext.clipKey);
    }
    if (practiceAudioRef.current) {
      practiceAudioRef.current.pause();
      setIsPlayingPracticeAudio(false);
    }
  }, [singleEvaluationResult, evaluationContext, activeExaminer, onPracticeAnswerSubmitted, speechEngine]);

  return {
    // Prep & Speaking timers
    prepSecondsRemaining,
    isPrepping,
    handleStartPart2Prep,
    speakSecondsElapsed,
    isPart2Speaking,
    handleTogglePart2Speaking,

    // Recording & Mic
    activeRecordClipKey,
    setActiveRecordClipKey,
    isMicConnecting,
    micErrorDetail,
    setMicErrorDetail,
    handleRequestMicPermissionDirectly,
    handleTogglePracticeRecord,

    // Refinement & Editing
    isRefiningTranscript,
    refiningClipKey,
    refinedClips,
    setRefinedClips,
    handleRefineTranscriptWithAI,
    editingTranscriptKey,
    setEditingTranscriptKey,
    editedTranscriptText,
    setEditedTranscriptText,

    // Evaluation
    isEvaluationModalOpen,
    setIsEvaluationModalOpen,
    singleEvaluationResult,
    setSingleEvaluationResult,
    evaluationContext,
    setEvaluationContext,
    isEvaluatingSingle,
    evaluatingClipKey,
    handleEvaluateAlgorithmically,
    handleEvaluateWithAI,
    handleSaveEvaluationAndCleanVoice,

    // Audio Playback
    isPlayingPracticeAudio,
    setIsPlayingPracticeAudio,
    practiceAudioRef,

    // Examiner speech
    handleReadText
  };
}
