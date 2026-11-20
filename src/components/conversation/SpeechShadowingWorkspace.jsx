import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Mic,
  Volume2,
  Play,
  Trash2,
  Search,
  Sparkles,
  List,
  RotateCcw,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Layers,
  Lock,
  Sliders
} from 'lucide-react';
import {
  SHADOWING_DEFAULT_THRESHOLD,
  SHADOWING_PARTS,
  SHADOWING_CHUNK_MODES,
  SHADOWING_STARTER_TASKS,
  resolveShadowingSegments,
  evaluateShadowingSegment,
  buildCustomShadowingTask,
  summarizeShadowingSession,
  loadSpeakingBankShadowingTasks
} from '../../data/shadowingData';
import { safeGet, safeSet } from '../../utils/storageService';
import { speakingSoundEffects } from '../../utils/speakingSoundEffects';
import { triggerHaptic } from '../../utils/hapticHelper';
import { callGeminiApi } from '../../services/ai/coreGeminiClient';
import ShadowingSegmentCard from './ShadowingSegmentCard';
import ConversationSummaryCard from './ConversationSummaryCard';

const CUSTOM_SHADOW_STORAGE_KEY = 'ielts_shadowing_custom_v1';
const SHADOW_STATS_STORAGE_KEY = 'ielts_shadowing_stats_v1';
const SHADOW_CHUNK_MODE_KEY = 'ielts_shadowing_chunk_mode_v1';
const SHADOW_RESUME_SESSION_KEY = 'ielts_shadowing_resume_v1';

export default function SpeechShadowingWorkspace({
  isOpen,
  speechEngine,
  selectedExaminerId,
  playbackSpeed,
  passThreshold = SHADOWING_DEFAULT_THRESHOLD,
  isAutoMode,
  apiKey = '',
  model = 'gemini-3.6-flash',
  isEn,
  awardXp,
  onSaveToNotebook,
  onSaveMistake,
  onOpenPronunciation,
  creatorTrigger = 0,
  initialTaskId = null
}) {
  // 1. Part Filter, Chunk Mode & Task Bank
  const [activePart, setActivePart] = useState('all');
  const [chunkMode, setChunkMode] = useState(() => {
    const saved = safeGet(SHADOW_CHUNK_MODE_KEY, 'auto');
    return ['auto', 'sentence', 'paragraph'].includes(saved) ? saved : 'auto';
  });
  const [dynamicTasks, setDynamicTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState(() =>
    safeGet(CUSTOM_SHADOW_STORAGE_KEY, [])
  );
  const [shadowStats, setShadowStats] = useState(() =>
    safeGet(SHADOW_STATS_STORAGE_KEY, {
      totalXpEarned: 0,
      completedCount: 0,
      bestScores: {},
      streak: 0
    })
  );

  // Load Speaking Bank dynamically when tab becomes active
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    loadSpeakingBankShadowingTasks().then((loaded) => {
      if (mounted && Array.isArray(loaded)) {
        setDynamicTasks(loaded);
      }
    });
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // 2. Filter & Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [bandFilter, setBandFilter] = useState('all');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(() =>
    initialTaskId || SHADOWING_STARTER_TASKS[0].id
  );
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isMobileDisplayOpen, setIsMobileDisplayOpen] = useState(false);

  const [showPromptCard, setShowPromptCard] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 640 : true
  );
  const [showIntonation, setShowIntonation] = useState(false);
  const [keywordsOnly, setKeywordsOnly] = useState(false);
  const [revealCurrentSeg, setRevealCurrentSeg] = useState(false);

  const allTasks = useMemo(() => {
    const customList = Array.isArray(customTasks) ? customTasks : [];
    return [...customList, ...SHADOWING_STARTER_TASKS, ...dynamicTasks];
  }, [customTasks, dynamicTasks]);

  const filteredTasks = useMemo(() => {
    let list = allTasks;
    if (activePart !== 'all') {
      list = list.filter(t => t.part === activePart);
    }
    if (bandFilter === 'foundation') {
      list = list.filter(t => parseFloat(t.bandLevel) <= 6.5);
    } else if (bandFilter === 'band7') {
      list = list.filter(t => parseFloat(t.bandLevel) >= 7.0 && parseFloat(t.bandLevel) <= 7.5);
    } else if (bandFilter === 'band8') {
      list = list.filter(t => parseFloat(t.bandLevel) >= 8.0);
    }
    if (hideCompleted) {
      list = list.filter(t => !shadowStats.bestScores?.[t.id] || t.id === selectedTaskId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(t =>
        t.titleEn?.toLowerCase().includes(q) ||
        t.titleVi?.toLowerCase().includes(q) ||
        t.topicEn?.toLowerCase().includes(q) ||
        t.topicVi?.toLowerCase().includes(q) ||
        t.promptEn?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allTasks, activePart, bandFilter, hideCompleted, shadowStats.bestScores, selectedTaskId, searchQuery]);

  const currentTask = useMemo(() => {
    return (
      allTasks.find(t => t.id === selectedTaskId) ||
      filteredTasks[0] ||
      SHADOWING_STARTER_TASKS[0]
    );
  }, [allTasks, selectedTaskId, filteredTasks]);

  const resolvedSegments = useMemo(() => {
    return resolveShadowingSegments(currentTask, chunkMode);
  }, [currentTask, chunkMode]);

  // 3. Shadowing State Machine
  const [activeSegIndex, setActiveSegIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'machine_reading' | 'user_shadowing'
  const [segmentResults, setSegmentResults] = useState({});
  const [segmentAttempts, setSegmentAttempts] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isWaitingForRetrySpeech, setIsWaitingForRetrySpeech] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [manualSpokenInput, setManualSpokenInput] = useState('');
  const [isDeepAiGrading, setIsDeepAiGrading] = useState(false);
  const [deepAiError, setDeepAiError] = useState('');
  const [totalSpeakingSec, setTotalSpeakingSec] = useState(0);
  const [playingUserClipSegId, setPlayingUserClipSegId] = useState(null);

  // Full Speech Replay State
  const [isFullReplaying, setIsFullReplaying] = useState(false);
  const [replaySegIdx, setReplaySegIdx] = useState(0);
  const fullReplayCancelRef = useRef(false);

  // Custom Creator Modal State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPart, setCustomPart] = useState('part2');
  const [customBand, setCustomBand] = useState('7.5');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customRawText, setCustomRawText] = useState(
    'I would like to talk about a memorable book that reshaped how I manage my time.\n\nRoughly two years ago, I felt constantly overwhelmed by university deadlines. Reading about deliberate focus habits helped me restructure my mornings and boost my productivity.'
  );
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');
  const [isGeneratingAiSample, setIsGeneratingAiSample] = useState(false);

  // Refs & Monotonic Session Guard
  const segContainerRef = useRef(null);
  const activeSegRef = useRef(null);
  const summaryRef = useRef(null);
  const userAudioRef = useRef(null);
  const liveSpokenTextRef = useRef('');
  const lastAutoEvaluatedRef = useRef('');
  const handleRunEvaluationRef = useRef(null);
  const advanceTimerRef = useRef(null);
  const micAutoStartTimerRef = useRef(null);
  const promptAdvanceTimerRef = useRef(null);
  const completedAwardedRef = useRef(false);
  const sessionTokenRef = useRef(0);
  const lastAutoReadKeyRef = useRef('');

  const isCompleted = resolvedSegments.length > 0 && activeSegIndex >= resolvedSegments.length;
  const activeSeg = !isCompleted ? resolvedSegments[activeSegIndex] : null;
  const currentClipKey = activeSeg ? `shad_${currentTask.id}_${activeSeg.id}` : 'shad_default';
  const currentAudioClip = speechEngine.audioClips[currentClipKey];

  const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
  const isMobileDevice =
    /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ||
    (/Macintosh/i.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1);

  // Open creator when triggered from ConversationStudioModal header button
  const lastCreatorTriggerRef = useRef(creatorTrigger);
  useEffect(() => {
    if (creatorTrigger > 0 && creatorTrigger !== lastCreatorTriggerRef.current) {
      lastCreatorTriggerRef.current = creatorTrigger;
      setIsCreatorOpen(true);
    }
  }, [creatorTrigger]);

  const invalidateAndStopAudio = useCallback(() => {
    sessionTokenRef.current += 1;
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (micAutoStartTimerRef.current) {
      clearTimeout(micAutoStartTimerRef.current);
      micAutoStartTimerRef.current = null;
    }
    if (promptAdvanceTimerRef.current) {
      clearTimeout(promptAdvanceTimerRef.current);
      promptAdvanceTimerRef.current = null;
    }
    if (userAudioRef.current) {
      try {
        userAudioRef.current.pause();
        userAudioRef.current.currentTime = 0;
      } catch (e) {}
    }
    setPlayingUserClipSegId(null);
    speechEngine.stopSpeaking();
    speechEngine.stopListening();
    fullReplayCancelRef.current = true;
    setIsFullReplaying(false);
  }, [speechEngine.stopSpeaking, speechEngine.stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      invalidateAndStopAudio();
    };
  }, []);

  const resetShadowingState = useCallback(
    (clearSavedProgress = true) => {
      invalidateAndStopAudio();
      lastAutoReadKeyRef.current = '';
      if (clearSavedProgress && typeof window !== 'undefined') {
        try { window.sessionStorage.removeItem(SHADOW_RESUME_SESSION_KEY); } catch (e) {}
      }
      setActiveSegIndex(0);
      setHasStarted(false);
      setPhase('idle');
      setSegmentResults({});
      setSegmentAttempts({});
      setEvaluationResult(null);
      setIsWaitingForRetrySpeech(false);
      setShowManualFallback(false);
      setManualSpokenInput('');
      setRevealCurrentSeg(false);
      setIsDeepAiGrading(false);
      setDeepAiError('');
      setTotalSpeakingSec(0);
      completedAwardedRef.current = false;
      liveSpokenTextRef.current = '';
      lastAutoEvaluatedRef.current = '';
      speechEngine.resetTranscript();
    },
    [invalidateAndStopAudio, speechEngine.resetTranscript]
  );

  // Restore saved progress from sessionStorage when opening or switching task/chunkMode
  useEffect(() => {
    if (!isOpen) {
      invalidateAndStopAudio();
      return;
    }

    let restored = false;
    if (typeof window !== 'undefined' && currentTask?.id) {
      try {
        const raw = window.sessionStorage.getItem(SHADOW_RESUME_SESSION_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (
            saved &&
            saved.taskId === currentTask.id &&
            saved.chunkMode === chunkMode &&
            typeof saved.activeSegIndex === 'number' &&
            saved.activeSegIndex > 0 &&
            saved.activeSegIndex < resolvedSegments.length
          ) {
            invalidateAndStopAudio();
            lastAutoReadKeyRef.current = '';
            setActiveSegIndex(saved.activeSegIndex);
            setHasStarted(false);
            setPhase('idle');
            setSegmentResults(saved.segmentResults || {});
            setSegmentAttempts(saved.segmentAttempts || {});
            setTotalSpeakingSec(saved.totalSpeakingSec || 0);
            setEvaluationResult(null);
            restored = true;
          }
        }
      } catch (e) {}
    }

    if (!restored) {
      resetShadowingState(false);
    }
  }, [currentTask?.id, chunkMode, isOpen]);

  // Persist mid-task progress to sessionStorage
  useEffect(() => {
    if (!isOpen || !currentTask?.id || typeof window === 'undefined') return;
    try {
      if (activeSegIndex > 0 && !isCompleted) {
        window.sessionStorage.setItem(
          SHADOW_RESUME_SESSION_KEY,
          JSON.stringify({
            taskId: currentTask.id,
            chunkMode,
            activeSegIndex,
            segmentResults,
            segmentAttempts,
            totalSpeakingSec
          })
        );
      } else if (isCompleted) {
        window.sessionStorage.removeItem(SHADOW_RESUME_SESSION_KEY);
      }
    } catch (e) {}
  }, [isOpen, currentTask?.id, chunkMode, activeSegIndex, isCompleted, segmentResults, segmentAttempts, totalSpeakingSec]);

  // Auto-scroll active segment (or completion summary) cleanly into view inside container
  useEffect(() => {
    if (!isOpen) return;
    const rafId = requestAnimationFrame(() => {
      const container = segContainerRef.current;
      const targetEl = isCompleted ? summaryRef.current : activeSegRef.current;
      if (!container || !targetEl) return;
      try {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const paddingTop = targetRect.height + 64 <= containerRect.height ? 32 : 8;
        const desiredTop = container.scrollTop + (targetRect.top - containerRect.top) - paddingTop;
        container.scrollTo({
          top: Math.max(0, desiredTop),
          behavior: 'smooth'
        });
      } catch (e) {}
    });
    return () => cancelAnimationFrame(rafId);
  }, [
    isOpen,
    activeSegIndex,
    isCompleted,
    evaluationResult,
    phase,
    hasStarted,
    speechEngine.isListening
  ]);

  // Trigger machine reading for a given segment with monotonic session guard
  const runMachineReadForSegment = useCallback(
    (seg) => {
      if (!seg) return;
      if (micAutoStartTimerRef.current) {
        clearTimeout(micAutoStartTimerRef.current);
        micAutoStartTimerRef.current = null;
      }
      if (promptAdvanceTimerRef.current) {
        clearTimeout(promptAdvanceTimerRef.current);
        promptAdvanceTimerRef.current = null;
      }
      speechEngine.stopListening();
      speechEngine.stopSpeaking();

      const token = ++sessionTokenRef.current;
      setPhase('machine_reading');
      setEvaluationResult(null);
      setIsWaitingForRetrySpeech(false);
      lastAutoEvaluatedRef.current = '';
      liveSpokenTextRef.current = '';
      speechEngine.resetTranscript();

      speechEngine.speak(
        seg.text,
        { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true },
        () => {
          if (token !== sessionTokenRef.current) return;
          speakingSoundEffects.playReadyToSpeakChime();

          if (seg.unitType === 'prompt_only') {
            setSegmentResults(prev => ({
              ...prev,
              [seg.id]: { isPassed: true, isPromptCue: true }
            }));
            promptAdvanceTimerRef.current = setTimeout(() => {
              if (token !== sessionTokenRef.current) return;
              setActiveSegIndex(prev => prev + 1);
            }, 350);
            return;
          }

          setPhase('user_shadowing');
          if (!isMobileDevice && isAutoMode) {
            const clipKey = `shad_${currentTask.id}_${seg.id}`;
            micAutoStartTimerRef.current = setTimeout(() => {
              if (token !== sessionTokenRef.current) return;
              setIsWaitingForRetrySpeech(true);
              speechEngine.startListening(clipKey).catch(() => {
                setShowManualFallback(true);
              });
            }, 500);
          }
        }
      );
    },
    [
      currentTask?.id,
      isAutoMode,
      isMobileDevice,
      playbackSpeed,
      selectedExaminerId,
      speechEngine.speak,
      speechEngine.stopListening,
      speechEngine.stopSpeaking,
      speechEngine.resetTranscript,
      speechEngine.startListening
    ]
  );

  // Auto-start machine reading whenever activeSegIndex advances during an active session
  useEffect(() => {
    if (!isOpen || !hasStarted || isCompleted || !activeSeg) return;
    const segKey = `${currentTask?.id || ''}:${chunkMode}:${activeSegIndex}`;
    if (lastAutoReadKeyRef.current === segKey) return;
    lastAutoReadKeyRef.current = segKey;
    const timer = setTimeout(() => {
      runMachineReadForSegment(activeSeg);
    }, 220);
    return () => clearTimeout(timer);
  }, [activeSegIndex, hasStarted, isOpen, isCompleted, currentTask?.id, chunkMode, activeSeg, runMachineReadForSegment]);

  const handleStartShadowing = () => {
    if (!activeSeg) return;
    const segKey = `${currentTask?.id || ''}:${chunkMode}:${activeSegIndex}`;
    lastAutoReadKeyRef.current = segKey;
    setHasStarted(true);
    runMachineReadForSegment(activeSeg);
  };

  const handleSkipReadingToSpeak = () => {
    if (!activeSeg || activeSeg.unitType === 'prompt_only') return;
    const segKey = `${currentTask?.id || ''}:${chunkMode}:${activeSegIndex}`;
    lastAutoReadKeyRef.current = segKey;
    invalidateAndStopAudio();
    setHasStarted(true);
    setPhase('user_shadowing');
    setEvaluationResult(null);
    setIsWaitingForRetrySpeech(true);
    lastAutoEvaluatedRef.current = '';
    liveSpokenTextRef.current = '';
    speechEngine.resetTranscript();
    if (speechEngine.deleteAudioClip) {
      speechEngine.deleteAudioClip(currentClipKey);
    }
    speechEngine.startListening(currentClipKey).catch(() => {
      setShowManualFallback(true);
    });
  };

  const advanceAfterPass = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setEvaluationResult(null);
    setRevealCurrentSeg(false);
    setShowManualFallback(false);
    setManualSpokenInput('');
    setIsWaitingForRetrySpeech(false);
    setPhase('idle');
    setActiveSegIndex(prev => prev + 1);
  }, []);

  // Score shadowed speech against passThreshold
  const handleRunEvaluation = useCallback(
    (spokenTextToEvaluate) => {
      if (!activeSeg || activeSeg.unitType === 'prompt_only') return;
      const cleanSpoken = String(spokenTextToEvaluate || '').trim();
      const confidence = speechEngine.speechConfidenceStats?.averageConfidence || 0.88;
      const alternatives = speechEngine.speechAlternativesRef?.current || [];
      const acousticMetrics = speechEngine.getAcousticMetrics ? speechEngine.getAcousticMetrics() : null;

      const result = evaluateShadowingSegment({
        targetText: activeSeg.text,
        spokenText: cleanSpoken,
        confidence,
        streak: shadowStats.streak || 0,
        alternatives,
        acousticMetrics,
        threshold: passThreshold,
        unitType: activeSeg.unitType
      });

      setDeepAiError('');
      const prevAttempts = segmentAttempts[activeSeg.id] || 0;
      const nextAttempts = prevAttempts + 1;
      setSegmentAttempts(prev => ({ ...prev, [activeSeg.id]: nextAttempts }));

      const fullResult = {
        ...result,
        attemptNumber: nextAttempts
      };
      setEvaluationResult(fullResult);

      if (result.isPassed) {
        setIsWaitingForRetrySpeech(false);
        if (speechEngine.isListening) {
          speechEngine.stopListening();
        }
        speakingSoundEffects.playCompletionChime();
        triggerHaptic('combo');

        const durationSec = acousticMetrics?.elapsedMs ? Math.round(acousticMetrics.elapsedMs / 1000) : 6;
        setTotalSpeakingSec(prev => prev + Math.max(4, durationSec));
        setSegmentResults(prev => ({ ...prev, [activeSeg.id]: fullResult }));

        const nextStreak = (shadowStats.streak || 0) + 1;
        const nextStats = {
          ...shadowStats,
          streak: nextStreak,
          totalXpEarned: (shadowStats.totalXpEarned || 0) + (result.xpEarned || 0)
        };
        setShadowStats(nextStats);
        safeSet(SHADOW_STATS_STORAGE_KEY, nextStats);

        if (result.xpEarned > 0 && awardXp) {
          awardXp(result.xpEarned, `Speech Shadowing: ${currentTask.titleEn}`);
        }

        const token = sessionTokenRef.current;
        advanceTimerRef.current = setTimeout(() => {
          if (token !== sessionTokenRef.current) return;
          advanceAfterPass();
        }, 950);
      } else {
        speakingSoundEffects.playRetryChime();
        triggerHaptic('wrong');

        if (isAutoMode && speechEngine.isListening) {
          setIsWaitingForRetrySpeech(true);
          lastAutoEvaluatedRef.current = '';
          liveSpokenTextRef.current = '';
          speechEngine.resetTranscript({ restartRecognition: true });
        }
      }
    },
    [
      activeSeg,
      speechEngine,
      shadowStats,
      passThreshold,
      segmentAttempts,
      currentTask?.titleEn,
      awardXp,
      isAutoMode,
      advanceAfterPass
    ]
  );

  useEffect(() => {
    handleRunEvaluationRef.current = handleRunEvaluation;
  }, [handleRunEvaluation]);

  // Live STT tracking & Paragraph-Aware Auto-Grading
  const liveSpokenText = useMemo(() => {
    return [speechEngine.transcript, speechEngine.interimTranscript]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [speechEngine.transcript, speechEngine.interimTranscript]);

  useEffect(() => {
    liveSpokenTextRef.current = liveSpokenText;
  }, [liveSpokenText]);

  useEffect(() => {
    if (
      !isOpen ||
      !isAutoMode ||
      !speechEngine.isListening ||
      phase !== 'user_shadowing' ||
      !activeSeg ||
      activeSeg.unitType === 'prompt_only' ||
      !liveSpokenText
    ) {
      return;
    }

    setIsWaitingForRetrySpeech(false);
    if (liveSpokenText === lastAutoEvaluatedRef.current) return;

    const targetWordCount = activeSeg.text.trim().split(/\s+/).filter(Boolean).length;
    const spokenWordCount = liveSpokenText.split(/\s+/).filter(Boolean).length;
    const ratio = targetWordCount > 0 ? spokenWordCount / targetWordCount : 1;
    const isLongParagraph = activeSeg.unitType === 'paragraph' || targetWordCount >= 20;

    let delayMs = 2000;
    if (isLongParagraph) {
      if (ratio >= 0.92) delayMs = 1400;
      else if (ratio >= 0.55) delayMs = 3300;
      else delayMs = 4200;
    } else {
      if (ratio >= 0.92) delayMs = 1050;
      else if (ratio >= 0.55) delayMs = 2000;
      else delayMs = 2600;
    }

    const timer = setTimeout(() => {
      if (!speechEngine.isListening) return;
      lastAutoEvaluatedRef.current = liveSpokenText;
      handleRunEvaluationRef.current?.(liveSpokenText);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [
    isOpen,
    isAutoMode,
    speechEngine.isListening,
    speechEngine.transcript,
    speechEngine.interimTranscript,
    phase,
    liveSpokenText,
    activeSeg
  ]);

  // Completion Summary & Bonus XP
  const sessionSummary = useMemo(() => {
    if (!isCompleted) return null;
    return summarizeShadowingSession({
      task: currentTask,
      segments: resolvedSegments,
      segmentResults,
      segmentAttempts
    });
  }, [isCompleted, currentTask, resolvedSegments, segmentResults, segmentAttempts]);

  useEffect(() => {
    if (isCompleted && sessionSummary && !completedAwardedRef.current) {
      completedAwardedRef.current = true;
      speakingSoundEffects.playCompletionChime();
      triggerHaptic('combo');

      const prevBest = shadowStats.bestScores?.[currentTask.id];
      const updatedStats = {
        ...shadowStats,
        completedCount: (shadowStats.completedCount || 0) + 1,
        totalXpEarned: (shadowStats.totalXpEarned || 0) + (sessionSummary.bonusXp || 0),
        bestScores: {
          ...(shadowStats.bestScores || {}),
          [currentTask.id]: {
            accuracy: Math.max(prevBest?.accuracy || 0, sessionSummary.avgAccuracy),
            band: sessionSummary.estimatedBand,
            updatedAt: new Date().toISOString()
          }
        }
      };
      setShadowStats(updatedStats);
      safeSet(SHADOW_STATS_STORAGE_KEY, updatedStats);

      if (sessionSummary.bonusXp > 0 && awardXp) {
        awardXp(sessionSummary.bonusXp, `Completed Shadowing: ${currentTask.titleEn}`);
      }
    }
  }, [isCompleted, sessionSummary]);

  const handleToggleRecording = () => {
    if (!activeSeg || activeSeg.unitType === 'prompt_only') return;
    const segKey = `${currentTask?.id || ''}:${chunkMode}:${activeSegIndex}`;
    lastAutoReadKeyRef.current = segKey;
    sessionTokenRef.current += 1;
    if (micAutoStartTimerRef.current) {
      clearTimeout(micAutoStartTimerRef.current);
      micAutoStartTimerRef.current = null;
    }
    setHasStarted(true);
    setPhase('user_shadowing');

    if (speechEngine.isListening) {
      const capturedBeforeStop = liveSpokenTextRef.current;
      speechEngine.stopListening();
      setIsWaitingForRetrySpeech(false);
      setTimeout(() => {
        const captured =
          liveSpokenTextRef.current ||
          capturedBeforeStop ||
          speechEngine.transcriptsByClip?.[currentClipKey] ||
          '';
        if (captured.trim()) {
          handleRunEvaluationRef.current?.(captured);
        } else {
          setShowManualFallback(true);
        }
      }, 260);
    } else {
      speechEngine.stopSpeaking();
      setEvaluationResult(null);
      setIsWaitingForRetrySpeech(false);
      lastAutoEvaluatedRef.current = '';
      liveSpokenTextRef.current = '';
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip(currentClipKey);
      }
      speechEngine.startListening(currentClipKey).catch(() => {
        setShowManualFallback(true);
      });
    }
  };

  const handleListenAndRetry = () => {
    if (!activeSeg) return;
    if (micAutoStartTimerRef.current) {
      clearTimeout(micAutoStartTimerRef.current);
      micAutoStartTimerRef.current = null;
    }
    const segKey = `${currentTask?.id || ''}:${chunkMode}:${activeSegIndex}`;
    lastAutoReadKeyRef.current = segKey;
    setHasStarted(true);
    speechEngine.stopListening();
    speechEngine.stopSpeaking();
    const token = ++sessionTokenRef.current;
    setPhase('machine_reading');
    setIsWaitingForRetrySpeech(false);
    speechEngine.resetTranscript();

    speechEngine.speak(
      activeSeg.text,
      { examinerId: selectedExaminerId, rate: 0.85, silentChime: true },
      () => {
        if (token !== sessionTokenRef.current) return;
        speakingSoundEffects.playReadyToSpeakChime();
        setPhase('user_shadowing');
        lastAutoEvaluatedRef.current = '';
        liveSpokenTextRef.current = '';
        if (speechEngine.deleteAudioClip) {
          speechEngine.deleteAudioClip(currentClipKey);
        }
        setIsWaitingForRetrySpeech(true);
        if (!isMobileDevice) {
          micAutoStartTimerRef.current = setTimeout(() => {
            if (token !== sessionTokenRef.current) return;
            speechEngine.startListening(currentClipKey).catch(() => {
              setShowManualFallback(true);
            });
          }, 420);
        }
      }
    );
  };

  const handleSkipSegment = () => {
    if (!activeSeg) return;
    if (speechEngine.isListening) speechEngine.stopListening();
    setSegmentResults(prev => ({
      ...prev,
      [activeSeg.id]: {
        overallAccuracy: 0,
        estimatedBand: '5.0',
        isPassed: true,
        skipped: true,
        xpEarned: 0,
        wordBreakdown: []
      }
    }));
    advanceAfterPass();
  };

  const handleReplayUserClip = (segId) => {
    const clipKey = `shad_${currentTask.id}_${segId}`;
    const clip = speechEngine.audioClips[clipKey];
    if (!clip?.url) return;
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();

    if (!userAudioRef.current) {
      userAudioRef.current = new Audio(clip.url);
    } else if (userAudioRef.current.src !== clip.url) {
      userAudioRef.current.src = clip.url;
    }

    userAudioRef.current.onended = () => setPlayingUserClipSegId(null);
    userAudioRef.current.onerror = () => setPlayingUserClipSegId(null);

    if (playingUserClipSegId === segId) {
      userAudioRef.current.pause();
      userAudioRef.current.currentTime = 0;
      setPlayingUserClipSegId(null);
    } else {
      userAudioRef.current
        .play()
        .then(() => setPlayingUserClipSegId(segId))
        .catch(() => setPlayingUserClipSegId(null));
    }
  };

  // Layer 2 Gemini Native Audio Deep Check
  const handleDeepAiAudioCheck = async () => {
    if (!activeSeg || !currentAudioClip?.blob || !apiKey || isDeepAiGrading) return;
    setIsDeepAiGrading(true);
    setDeepAiError('');
    try {
      const { evaluatePronunciationWithGeminiAudio } = await import('../../services/ai/speakingAiService');
      const aiRes = await evaluatePronunciationWithGeminiAudio({
        audioBlob: currentAudioClip.blob,
        targetText: activeSeg.text,
        itemType: 'sentences',
        apiKey,
        model,
        language: isEn ? 'en' : 'vi'
      });

      const isPassed = aiRes.overallAccuracy >= passThreshold;
      const mappedWords =
        aiRes.wordBreakdown && aiRes.wordBreakdown.length > 0
          ? aiRes.wordBreakdown.map(w => ({
              word: w.word,
              cleanWord: w.word,
              status: w.status || (w.similarity >= 84 ? 'correct' : w.similarity >= 52 ? 'near' : 'missed'),
              similarity: Number(w.similarity) || 80
            }))
          : evaluationResult?.wordBreakdown || [];
      const updatedEval = {
        ...(evaluationResult || {}),
        overallAccuracy: aiRes.overallAccuracy,
        estimatedBand: aiRes.estimatedBand,
        spokenTranscript: aiRes.heardTranscript || evaluationResult?.spokenTranscript || activeSeg.text,
        wordBreakdown: mappedWords,
        coachFeedbackEn: aiRes.coachFeedback,
        coachFeedbackVi: aiRes.coachFeedback,
        isPassed,
        engineTier: 'layer2_gemini_audio'
      };
      setEvaluationResult(updatedEval);
      if (isPassed) {
        setSegmentResults(prev => ({ ...prev, [activeSeg.id]: updatedEval }));
      }
    } catch (err) {
      setDeepAiError(err.message || (isEn ? 'AI Audio evaluation failed.' : 'Không thể chấm sâu bằng AI Audio.'));
    } finally {
      setIsDeepAiGrading(false);
    }
  };

  // Full Shadowing Speech Replay
  const handleToggleFullReplay = () => {
    if (isFullReplaying) {
      invalidateAndStopAudio();
      return;
    }

    fullReplayCancelRef.current = false;
    setIsFullReplaying(true);

    const playStep = (idx) => {
      if (fullReplayCancelRef.current || idx >= resolvedSegments.length) {
        setIsFullReplaying(false);
        return;
      }
      setReplaySegIdx(idx);
      const seg = resolvedSegments[idx];
      if (seg.unitType !== 'prompt_only') {
        const clip = speechEngine.audioClips[`shad_${currentTask.id}_${seg.id}`];
        if (clip?.url) {
          const audio = new Audio(clip.url);
          audio.onended = () => setTimeout(() => playStep(idx + 1), 300);
          audio.onerror = () => setTimeout(() => playStep(idx + 1), 300);
          audio.play().catch(() => {
            speechEngine.speak(seg.text, { examinerId: selectedExaminerId, rate: 1.0, silentChime: true }, () => {
              setTimeout(() => playStep(idx + 1), 300);
            });
          });
          return;
        }
      }
      speechEngine.speak(seg.text, { examinerId: selectedExaminerId, rate: 1.0, silentChime: true }, () => {
        setTimeout(() => playStep(idx + 1), 300);
      });
    };

    playStep(0);
  };

  // Cycle chunk mode smoothly on mobile
  const handleSelectChunkMode = (modeId) => {
    invalidateAndStopAudio();
    setChunkMode(modeId);
    safeSet(SHADOW_CHUNK_MODE_KEY, modeId);
  };

  const handleCycleChunkMode = () => {
    const order = ['auto', 'sentence', 'paragraph'];
    const next = order[(order.indexOf(chunkMode) + 1) % order.length];
    handleSelectChunkMode(next);
  };

  // Custom Sample Generator & Save
  const handleGenerateAiSample = async () => {
    if (!apiKey || !aiTopicPrompt.trim() || isGeneratingAiSample) return;
    setIsGeneratingAiSample(true);
    try {
      const prompt = `Write an authentic IELTS Speaking ${customPart.toUpperCase()} Band ${customBand} sample response on the topic: "${aiTopicPrompt.trim()}".
Separate paragraphs with a blank line. If ${customPart} is part1 or part3, prefix 2 examiner questions with "Examiner: " before the sample answers. Return ONLY the clean script text.`;
      const res = await callGeminiApi({
        model,
        apiKey,
        body: { contents: [{ parts: [{ text: prompt }] }] }
      });
      const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text.trim()) {
        setCustomRawText(text.trim());
        if (!customTitle.trim()) setCustomTitle(aiTopicPrompt.trim());
        if (!customPrompt.trim()) setCustomPrompt(aiTopicPrompt.trim());
      }
    } catch (err) {
      alert(err.message || (isEn ? 'Failed to generate sample.' : 'Không thể tạo bài mẫu bằng AI.'));
    } finally {
      setIsGeneratingAiSample(false);
    }
  };

  const handleCreateCustomTask = (e) => {
    e?.preventDefault();
    const created = buildCustomShadowingTask({
      title: customTitle,
      part: customPart,
      bandLevel: customBand,
      prompt: customPrompt,
      rawText: customRawText
    });
    if (!created.segments || created.segments.length === 0) {
      alert(isEn ? 'Please enter at least 1 sentence or paragraph.' : 'Vui lòng nhập ít nhất 1 câu hoặc 1 đoạn.');
      return;
    }
    const nextList = [created, ...(Array.isArray(customTasks) ? customTasks : [])];
    setCustomTasks(nextList);
    safeSet(CUSTOM_SHADOW_STORAGE_KEY, nextList);
    setIsCreatorOpen(false);
    setSelectedTaskId(created.id);
    setActivePart('all');
  };

  const handleDeleteCustomTask = (id, e) => {
    e?.stopPropagation();
    const nextList = (Array.isArray(customTasks) ? customTasks : []).filter(t => t.id !== id);
    setCustomTasks(nextList);
    safeSet(CUSTOM_SHADOW_STORAGE_KEY, nextList);
    if (selectedTaskId === id) {
      setSelectedTaskId(SHADOWING_STARTER_TASKS[0].id);
    }
  };

  const combinedShadowTranscript = resolvedSegments
    .filter(seg => seg.unitType !== 'prompt_only' && segmentResults[seg.id] && !segmentResults[seg.id].skipped)
    .map(seg => segmentResults[seg.id].spokenTranscript || seg.text)
    .join(' ');

  const currentChunkMeta = SHADOWING_CHUNK_MODES.find(m => m.id === chunkMode) || SHADOWING_CHUNK_MODES[0];

  return (
    <>
      {/* PART & CHUNK FLOW FILTER STRIP (Desktop/Tablet lg+) */}
      <div className="hidden lg:flex px-6 py-2 bg-slate-950/70 border-b border-slate-800/90 items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center space-x-1.5 shrink-0">
          {SHADOWING_PARTS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePart(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activePart === p.id
                  ? `bg-gradient-to-r ${p.badgeColor} text-white shadow-md`
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {isEn ? p.labelEn : p.labelVi}
            </button>
          ))}
        </div>

        {/* Chunk Flow Mode Pills (Desktop/Tablet) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
          <Layers className="w-3 h-3 text-cyan-400 mx-1.5 shrink-0" />
          {SHADOWING_CHUNK_MODES.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelectChunkMode(m.id)}
              title={isEn ? m.descEn : m.descVi}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer whitespace-nowrap transition-all ${
                chunkMode === m.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? m.labelEn : m.labelVi}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE TASK SELECTOR & CHUNK MODE BAR (< lg) */}
      <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 shrink-0">
        <div className="px-3 py-1.5 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => setIsMobileListOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-purple-300 border border-purple-500/30 text-[11px] font-bold shrink-0 cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
            <span>{isEn ? `Tasks (${filteredTasks.length})` : `Bài mẫu (${filteredTasks.length})`}</span>
          </button>

          <div className="min-w-0 flex-1 flex items-center justify-center space-x-1.5">
            <span className="text-[11px] font-extrabold text-white truncate">
              {isEn ? currentTask.titleEn : currentTask.titleVi}
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
              {Math.min(activeSegIndex + 1, resolvedSegments.length)}/{resolvedSegments.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCycleChunkMode}
            className="px-2 py-1.5 rounded-xl bg-slate-800 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center space-x-1 shrink-0 cursor-pointer"
            title={isEn ? 'Switch segmentation mode (Smart Flow / 1 Sentence / Paragraph)' : 'Đổi kiểu ngắt câu/đoạn'}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">{isEn ? currentChunkMeta.labelEn : currentChunkMeta.labelVi}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileDisplayOpen(prev => !prev)}
            className={`p-1.5 rounded-xl border shrink-0 cursor-pointer transition-colors ${
              isMobileDisplayOpen
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title={isEn ? 'Cue Card & Display Options' : 'Đề bài & Tùy chọn hiển thị'}
            aria-label={isEn ? 'Cue Card & Display Options' : 'Đề bài & Tùy chọn hiển thị'}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => resetShadowingState(true)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 shrink-0 cursor-pointer"
            title={isEn ? 'Restart task' : 'Làm lại từ đầu'}
            aria-label={isEn ? 'Restart task' : 'Làm lại từ đầu'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {isMobileDisplayOpen && (
          <div className="px-3 pb-2 pt-1 border-t border-slate-800/80 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setShowPromptCard(prev => !prev)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
                showPromptCard
                  ? 'bg-indigo-600/25 text-indigo-200 border-indigo-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>{isEn ? 'Cue Card' : 'Đề bài'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowIntonation(prev => !prev)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border cursor-pointer whitespace-nowrap ${
                showIntonation
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {isEn ? 'Intonation' : 'Ngữ điệu'}
            </button>
            <button
              type="button"
              onClick={() => setKeywordsOnly(prev => !prev)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
                keywordsOnly
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>{isEn ? 'Keywords' : 'Ẩn chữ'}</span>
            </button>
          </div>
        )}
      </div>

      {/* MAIN TWO-PANE WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="hidden lg:flex w-80 xl:w-96 bg-slate-950/60 border-r border-slate-800 flex-col shrink-0">
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search Speaking samples...' : 'Tìm bài mẫu Speaking...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: isEn ? 'All' : 'Tất cả' },
                  { id: 'foundation', label: '5.5-6.5' },
                  { id: 'band7', label: '7.0-7.5' },
                  { id: 'band8', label: '8.0+' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBandFilter(b.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                      bandFilter === b.id ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setHideCompleted(prev => !prev)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer border ${
                  hideCompleted
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {isEn ? 'Hide Done' : 'Ẩn đã xong'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 overscroll-contain">
            {filteredTasks.map(item => {
              const isSelected = currentTask?.id === item.id;
              const best = shadowStats.bestScores?.[item.id];
              const segCount = resolveShadowingSegments(item, chunkMode).filter(s => s.unitType !== 'prompt_only').length;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedTaskId(item.id);
                    setIsMobileListOpen(false);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500/60 shadow-md'
                      : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/80'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-purple-300">
                        {item.part?.toUpperCase()} • Band {item.bandLevel}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {segCount} {isEn ? 'parts' : 'đoạn'}
                      </span>
                      {item.sourceTag && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300">
                          {item.sourceTag}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-extrabold text-white truncate">
                      {isEn ? item.titleEn : item.titleVi}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {isEn ? item.topicEn : item.topicVi}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    {best ? (
                      <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {best.accuracy}%
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 text-amber-400">
                        +{item.xpReward} XP
                      </span>
                    )}
                    {item.isCustom && (
                      <button
                        type="button"
                        onClick={e => handleDeleteCustomTask(item.id, e)}
                        className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* MAIN SHADOWING STAGE */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-900/40">
          {/* Task Header & Display Controls (Desktop lg+) */}
          <div className="hidden lg:flex px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-black text-white truncate">
                  {isEn ? currentTask.titleEn : currentTask.titleVi}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
                  {Math.min(activeSegIndex + 1, resolvedSegments.length)}/{resolvedSegments.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptCard(prev => !prev)}
                className="text-[11px] text-cyan-300 hover:text-cyan-200 font-bold flex items-center space-x-1 mt-0.5 cursor-pointer"
              >
                <BookOpen className="w-3 h-3" />
                <span>{showPromptCard ? (isEn ? 'Hide Task Prompt' : 'Ẩn Đề Bài') : (isEn ? 'View Task Prompt / Cue Card' : 'Xem Đề Bài / Cue Card')}</span>
                {showPromptCard ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowIntonation(prev => !prev)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer ${
                  showIntonation
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {isEn ? 'Intonation' : 'Ngữ điệu'}
              </button>

              <button
                type="button"
                onClick={() => setKeywordsOnly(prev => !prev)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border cursor-pointer flex items-center space-x-1 ${
                  keywordsOnly
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{isEn ? 'Keywords' : 'Ẩn bớt chữ'}</span>
              </button>

              <button
                type="button"
                onClick={() => resetShadowingState(true)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                title={isEn ? 'Restart task' : 'Làm lại từ đầu'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collapsible Prompt / Cue Card Box */}
          {showPromptCard && (
            <div className="px-4 sm:px-6 py-2.5 bg-indigo-950/35 border-b border-indigo-500/25 text-xs text-slate-200 space-y-1.5 shrink-0">
              <p className="font-bold text-indigo-200">
                {isEn ? currentTask.promptEn : currentTask.promptVi}
              </p>
              {Array.isArray(isEn ? currentTask.cueBulletsEn : currentTask.cueBulletsVi) &&
                (isEn ? currentTask.cueBulletsEn : currentTask.cueBulletsVi).length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-slate-300 list-disc list-inside">
                    {(isEn ? currentTask.cueBulletsEn : currentTask.cueBulletsVi).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="h-1 w-full bg-slate-950 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${resolvedSegments.length > 0 ? Math.round((activeSegIndex / resolvedSegments.length) * 100) : 0}%` }}
            />
          </div>

          {/* Scrollable Shadowing Segments */}
          <div
            ref={segContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3.5 overscroll-contain"
          >
            {!hasStarted && !isCompleted && (
              <div className="hidden lg:flex p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900 border border-purple-500/40 sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-200">
                  <strong className="text-purple-300">
                    {isEn ? 'Speech Shadowing Ready' : 'Sẵn sàng Speech Shadowing'}
                  </strong>{' '}
                  {isEn
                    ? `The machine reads each sentence or paragraph aloud first. Repeat with ≥${passThreshold}% accuracy to unlock the next part.`
                    : `Máy sẽ đọc trước từng câu hoặc đoạn theo mạch bài. Bạn lặp lại đạt chuẩn ≥${passThreshold}% mới mở khóa phần tiếp theo.`}
                </div>
                <button
                  type="button"
                  onClick={handleStartShadowing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg flex items-center space-x-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isEn ? 'Start Shadowing' : 'Bắt Đầu Luyện'}</span>
                </button>
              </div>
            )}

            {resolvedSegments.map((seg, idx) => {
              if (idx > activeSegIndex) return null;
              const status = idx < activeSegIndex ? 'past_done' : 'active';
              const isActive = status === 'active';
              const clip = speechEngine.audioClips[`shad_${currentTask.id}_${seg.id}`];

              return (
                <div key={seg.id} ref={isActive ? activeSegRef : null}>
                  <ShadowingSegmentCard
                    segment={seg}
                    segmentIndex={idx}
                    totalSegments={resolvedSegments.length}
                    status={status}
                    phase={isActive ? phase : 'idle'}
                    isMachineSpeakingNow={isActive && phase === 'machine_reading' && speechEngine.isSpeaking}
                    showIntonation={showIntonation}
                    keywordsOnly={keywordsOnly}
                    revealThisSeg={revealCurrentSeg}
                    onToggleRevealThisSeg={() => setRevealCurrentSeg(prev => !prev)}
                    onPlayModel={(s, rate) => {
                      speechEngine.stopListening();
                      speechEngine.speak(s.text, { examinerId: selectedExaminerId, rate, silentChime: true });
                    }}
                    onSkipReadingToSpeak={handleSkipReadingToSpeak}
                    isListening={isActive && speechEngine.isListening}
                    isAutoMode={isAutoMode}
                    liveSpokenText={isActive ? liveSpokenText : ''}
                    isWaitingForRetrySpeech={isActive && isWaitingForRetrySpeech}
                    speechError={isActive ? speechEngine.speechError : null}
                    analyserNode={speechEngine.analyserNode}
                    micLevel={speechEngine.micLevel || 0}
                    hasAnalyser={Boolean(speechEngine.analyserNode)}
                    evaluationResult={isActive ? evaluationResult : segmentResults[seg.id]}
                    attemptCount={segmentAttempts[seg.id] || 0}
                    passThreshold={passThreshold}
                    currentAudioClip={clip}
                    isPlayingUserClip={playingUserClipSegId === seg.id}
                    onToggleRecording={handleToggleRecording}
                    onReplayUserClip={handleReplayUserClip}
                    onListenAndRetry={handleListenAndRetry}
                    onSkipSegment={handleSkipSegment}
                    onAdvanceAfterPass={advanceAfterPass}
                    showManualFallback={isActive && showManualFallback}
                    onToggleManualFallback={() => setShowManualFallback(prev => !prev)}
                    manualSpokenInput={manualSpokenInput}
                    onChangeManualSpokenInput={setManualSpokenInput}
                    onRunManualEvaluation={(txt) => handleRunEvaluation(txt)}
                    apiKey={apiKey}
                    isDeepAiGrading={isDeepAiGrading}
                    deepAiError={deepAiError}
                    onDeepAiAudioCheck={handleDeepAiAudioCheck}
                    isEn={isEn}
                  />
                </div>
              );
            })}

            {/* Compact Next-Segment Locked Preview Bar (keeps active segment front-and-center) */}
            {!isCompleted && activeSegIndex < resolvedSegments.length - 1 && (() => {
              const nextSeg = resolvedSegments[activeSegIndex + 1];
              const remainingLocked = resolvedSegments.length - 1 - activeSegIndex;
              const nextLabel =
                nextSeg.unitType === 'prompt_only'
                  ? isEn ? 'Examiner Prompt' : 'Câu hỏi Giám khảo'
                  : nextSeg.unitType === 'paragraph'
                  ? isEn ? 'Paragraph' : 'Đoạn văn'
                  : isEn ? '1 Sentence' : '1 Câu';
              return (
                <div className={`flex ${nextSeg.unitType === 'prompt_only' ? 'justify-start' : 'justify-end'} opacity-65 select-none`}>
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-900/75 border border-slate-800/90 flex items-center space-x-2 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-semibold">
                      {isEn
                        ? `Next: #${activeSegIndex + 2} (${nextLabel})${remainingLocked > 1 ? ` (+${remainingLocked - 1} more)` : ''} — Pass ≥${passThreshold}% to unlock`
                        : `Tiếp theo: #${activeSegIndex + 2} (${nextLabel})${remainingLocked > 1 ? ` (+${remainingLocked - 1} phần)` : ''} — Đạt ≥${passThreshold}% để mở`}
                    </span>
                  </div>
                </div>
              );
            })()}

            {isCompleted && sessionSummary && (
              <div ref={summaryRef}>
                <ConversationSummaryCard
                scenario={currentTask}
                summary={sessionSummary}
                mode="shadowing"
                combinedUserTranscript={combinedShadowTranscript}
                totalSpeakingDurationSec={totalSpeakingSec}
                isFullReplaying={isFullReplaying}
                replayTurnIdx={replaySegIdx}
                onToggleFullReplay={handleToggleFullReplay}
                onRestart={() => resetShadowingState(true)}
                onPlayWord={(word) =>
                  speechEngine.speak(word, { examinerId: selectedExaminerId, rate: 0.85, silentChime: true })
                }
                onSaveWordToNotebook={
                  onSaveToNotebook
                    ? (w) =>
                        onSaveToNotebook({
                          id: `vocab-shad-${w.cleanWord}`,
                          word: w.word,
                          meaning: isEn ? 'From Speech Shadowing' : 'Từ luyện Speech Shadowing',
                          example: currentTask.titleEn,
                          band: `Band ${currentTask.bandLevel || '7.5'}`,
                          topic: isEn ? currentTask.titleEn : currentTask.titleVi
                        })
                    : null
                }
                onSaveWordToMistakes={
                  onSaveMistake
                    ? (w) =>
                        onSaveMistake({
                          id: `mistake-shad-${w.cleanWord}-${Date.now()}`,
                          type: 'Pronunciation',
                          word: w.word,
                          original: w.word,
                          correction: `Accuracy ${w.similarity}% in "${currentTask.titleEn}"`,
                          explanation: w.missingCoda
                            ? isEn
                              ? 'Final consonant (coda) was weak or dropped.'
                              : 'Âm cuối (coda) bị nhẹ hoặc rơi.'
                            : isEn
                            ? 'Pronunciation accuracy below 84%.'
                            : 'Độ chuẩn phát âm dưới 84%.',
                          date: new Date().toLocaleDateString('vi-VN')
                        })
                    : null
                }
                onOpenInPronunciation={onOpenPronunciation}
                isEn={isEn}
              />
              </div>
            )}
            <div className="h-3 lg:hidden" />
          </div>
        </main>
      </div>

      {/* MOBILE STICKY BOTTOM THUMB-ZONE BAR (< lg) */}
      {activeSeg && !isCompleted && (
        <div className="lg:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2 z-30">
          <button
            type="button"
            onClick={() => {
              speechEngine.stopListening();
              speechEngine.speak(activeSeg.text, { examinerId: selectedExaminerId, rate: 0.85, silentChime: true });
            }}
            className="min-h-[48px] px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Model' : 'Nghe mẫu'}</span>
          </button>

          {!hasStarted ? (
            <button
              type="button"
              onClick={handleStartShadowing}
              className="flex-1 min-h-[48px] px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 active:scale-95 text-white text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>{isEn ? 'Start Shadowing' : 'Bắt Đầu Luyện'}</span>
            </button>
          ) : activeSeg.unitType === 'prompt_only' ? (
            <button
              type="button"
              onClick={() => runMachineReadForSegment(activeSeg)}
              className="flex-1 min-h-[48px] px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 active:scale-95 text-white text-xs sm:text-sm font-black flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <Volume2 className="w-4 h-4 shrink-0 animate-pulse" />
              <span>{isEn ? 'Listening to Examiner...' : 'Đang nghe Giám khảo...'}</span>
            </button>
          ) : phase === 'machine_reading' ? (
            <button
              type="button"
              onClick={handleSkipReadingToSpeak}
              className="flex-1 min-h-[48px] px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all"
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span className="truncate">{isEn ? 'Reading... (Tap to Speak)' : 'Máy đang đọc... (Bấm để Nói)'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleRecording}
              className={`flex-1 min-h-[48px] px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer ${
                speechEngine.isListening
                  ? evaluationResult && !evaluationResult.isPassed
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
              }`}
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {speechEngine.isListening
                  ? evaluationResult && !evaluationResult.isPassed
                    ? isEn
                      ? `Repeat (#${(segmentAttempts[activeSeg.id] || 0) + 1})`
                      : `Lặp lại (#${(segmentAttempts[activeSeg.id] || 0) + 1})`
                    : isAutoMode
                    ? isEn ? 'Auto-Listening...' : 'Đang nghe...'
                    : isEn ? 'Stop & Score' : 'Dừng & Chấm'
                  : isEn
                  ? 'Tap to Repeat'
                  : 'Bấm để Lặp Lại'}
              </span>
            </button>
          )}

          {currentAudioClip?.url && !speechEngine.isListening && (
            <button
              type="button"
              onClick={() => handleReplayUserClip(activeSeg.id)}
              className="min-h-[48px] px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-300 border border-slate-700 text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer"
              title={isEn ? 'Replay your voice' : 'Nghe lại giọng bạn'}
            >
              <Play className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* MOBILE TASK LIST BOTTOM SHEET (< lg) */}
      {isMobileListOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-150"
          onClick={() => setIsMobileListOpen(false)}
        >
          <div
            className="w-full bg-slate-900 border-t border-slate-700 rounded-t-3xl h-[85dvh] flex flex-col overflow-hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-white">
                {isEn ? `Speaking Samples (${filteredTasks.length})` : `Chọn Bài Mẫu (${filteredTasks.length})`}
              </h3>
              <button
                type="button"
                onClick={() => setIsMobileListOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800/80 space-y-2 shrink-0">
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {SHADOWING_PARTS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePart(p.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      activePart === p.id
                        ? `bg-gradient-to-r ${p.badgeColor} text-white shadow-sm`
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {isEn ? p.labelEn : p.labelVi}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search Speaking samples...' : 'Tìm bài mẫu Speaking...'}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: isEn ? 'All' : 'Tất cả' },
                    { id: 'foundation', label: '5.5-6.5' },
                    { id: 'band7', label: '7.0-7.5' },
                    { id: 'band8', label: '8.0+' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBandFilter(b.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                        bandFilter === b.id ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setHideCompleted(prev => !prev)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer border ${
                    hideCompleted
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {isEn ? 'Hide Done' : 'Ẩn đã xong'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 overscroll-contain">
              {filteredTasks.map(item => {
                const segCount = resolveShadowingSegments(item, chunkMode).filter(s => s.unitType !== 'prompt_only').length;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedTaskId(item.id);
                      setIsMobileListOpen(false);
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2 min-h-[54px] active:scale-98 transition-all cursor-pointer ${
                      currentTask?.id === item.id
                        ? 'bg-purple-950/70 border-purple-500/60'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-black text-purple-300">
                        <span>{item.part?.toUpperCase()} • Band {item.bandLevel} • {segCount} {isEn ? 'parts' : 'đoạn'}</span>
                      </div>
                      <div className="text-xs font-extrabold text-white truncate">
                        {isEn ? item.titleEn : item.titleVi}
                      </div>
                    </div>
                    {shadowStats.bestScores?.[item.id] ? (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                        {shadowStats.bestScores[item.id].accuracy}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 text-amber-400">
                        +{item.xpReward} XP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM SHADOWING SAMPLE CREATOR MODAL */}
      {isCreatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleCreateCustomTask}
            className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92dvh] overflow-y-auto p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-4 text-slate-100 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">
                {isEn ? 'Add Speaking Sample for Shadowing' : 'Thêm Bài Mẫu Speaking Luyện Shadowing'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatorOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {apiKey && (
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Optional: Generate Band Sample with Gemini AI' : 'Tùy chọn: Tạo bài mẫu nhanh bằng Gemini AI'}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiTopicPrompt}
                    onChange={e => setAiTopicPrompt(e.target.value)}
                    placeholder={isEn ? 'e.g. Describe a helpful neighbour' : 'VD: Describe a helpful neighbour'}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiSample}
                    disabled={isGeneratingAiSample}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingAiSample ? (isEn ? 'Writing...' : 'Đang viết...') : (isEn ? 'AI Write' : 'AI Viết')}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder={isEn ? 'Sample title...' : 'Tiêu đề bài mẫu...'}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                required
              />
              <select
                value={customPart}
                onChange={e => setCustomPart(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="part1">Part 1</option>
                <option value="part2">Part 2 Cue Card</option>
                <option value="part3">Part 3 Discussion</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder={isEn ? 'Speaking prompt / cue card question...' : 'Đề bài / câu hỏi gợi ý...'}
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <select
                value={customBand}
                onChange={e => setCustomBand(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="6.5">Band 6.5</option>
                <option value="7.0">Band 7.0</option>
                <option value="7.5">Band 7.5</option>
                <option value="8.0">Band 8.0</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                {isEn
                  ? 'Sample Text (separate segments/paragraphs with a blank line; optional "Examiner:" prefix for questions)'
                  : 'Nội dung bài mẫu (cách nhau bởi 1 dòng trống để chia câu/đoạn; có thể thêm "Examiner:" cho câu hỏi)'}
              </label>
              <textarea
                rows={6}
                value={customRawText}
                onChange={e => setCustomRawText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreatorOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Hủy'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black cursor-pointer"
              >
                {isEn ? 'Save & Shadow' : 'Lưu & Luyện Tập'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
