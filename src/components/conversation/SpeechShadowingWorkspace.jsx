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
  Sliders,
  Shuffle,
  Loader2,
  SkipForward,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import {
  SHADOWING_DEFAULT_THRESHOLD,
  SHADOWING_PARTS,
  SHADOWING_CHUNK_MODES,
  SHADOWING_STARTER_TASKS,
  resolveShadowingSegments,
  getShadowingTaskSegmentCount,
  evaluateShadowingSegment,
  summarizeShadowingSession,
  loadSpeakingBankShadowingTasks
} from '../../data/shadowingData';
import { safeGet, safeSet } from '../../utils/storageService';
import { speakingSoundEffects } from '../../utils/speakingSoundEffects';
import { triggerHaptic } from '../../utils/hapticHelper';
import ShadowingSegmentCard from './ShadowingSegmentCard';
import ConversationSummaryCard from './ConversationSummaryCard';
import ShadowingCustomCreatorModal from './ShadowingCustomCreatorModal';
import { runLayer2PronunciationCheck, NOOP } from '../../utils/speakingPracticeHelpers';
import { getWallet } from '../../services/gamification/atlasWalletService';
import {
  buildTrackBatches,
  purchaseBatchUnlock
} from '../../services/gamification/batchProgressionService';
import BatchSelectorStrip from '../common/BatchSelectorStrip';
import BatchUnlockGateCard from '../common/BatchUnlockGateCard';

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
  currentUser = null,
  walletSnapshot = null,
  onOpenAuth,
  onOpenArena,
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
  const [isLoadingBank, setIsLoadingBank] = useState(false);
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
    if (dynamicTasks.length === 0) setIsLoadingBank(true);
    loadSpeakingBankShadowingTasks()
      .then((loaded) => {
        if (mounted && Array.isArray(loaded)) {
          setDynamicTasks(loaded);
        }
      })
      .finally(() => {
        if (mounted) setIsLoadingBank(false);
      });
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  // 2. Filter & Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [bandFilter, setBandFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [hideCompleted, setHideCompleted] = useState(() =>
    Boolean(safeGet('ielts_shadowing_hide_completed', true))
  );
  const toggleHideCompleted = () => {
    setHideCompleted(prev => {
      const next = !prev;
      safeSet('ielts_shadowing_hide_completed', next);
      return next;
    });
  };
  const [visibleTaskLimit, setVisibleTaskLimit] = useState(40);
  const [selectedTaskId, setSelectedTaskId] = useState(() => {
    if (initialTaskId) return initialTaskId;
    const savedStats = safeGet(SHADOW_STATS_STORAGE_KEY, { bestScores: {} });
    const firstUnfinished = SHADOWING_STARTER_TASKS.find(t => !savedStats?.bestScores?.[t.id]);
    return (firstUnfinished || SHADOWING_STARTER_TASKS[0]).id;
  });
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isMobileDisplayOpen, setIsMobileDisplayOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const [showPromptCard, setShowPromptCard] = useState(false);
  const [showIntonation, setShowIntonation] = useState(false);
  const [keywordsOnly, setKeywordsOnly] = useState(false);
  const [revealCurrentSeg, setRevealCurrentSeg] = useState(false);

  const [selectedShadowBatch, setSelectedShadowBatch] = useState(1);
  const [localWalletTick, setLocalWalletTick] = useState(0);

  const canonicalShadowTasks = useMemo(() => {
    return [...SHADOWING_STARTER_TASKS, ...dynamicTasks];
  }, [dynamicTasks]);

  const personalShadowTasks = useMemo(() => {
    return Array.isArray(customTasks) ? customTasks : [];
  }, [customTasks]);

  const shadowBatches = useMemo(() => {
    const completedSet = new Set(Object.keys(shadowStats.bestScores || {}));
    return buildTrackBatches({
      items: canonicalShadowTasks,
      trackKey: 'conv_shadowing',
      completedIdSet: completedSet,
      wallet: walletSnapshot || getWallet(),
      currentUser
    });
  }, [canonicalShadowTasks, shadowStats.bestScores, walletSnapshot, currentUser, localWalletTick]);

  const activeShadowBatchObj = useMemo(() => {
    if (selectedShadowBatch === 'personal') return null;
    return shadowBatches.find(b => b.batchIndex === selectedShadowBatch) || shadowBatches[0] || null;
  }, [selectedShadowBatch, shadowBatches]);

  const nextLockedShadowBatch = useMemo(() => {
    if (!activeShadowBatchObj || !activeShadowBatchObj.isUnlocked) return null;
    return shadowBatches.find(b => b.batchIndex === activeShadowBatchObj.batchIndex + 1 && !b.isUnlocked) || null;
  }, [activeShadowBatchObj, shadowBatches]);

  const handlePurchaseShadowBatch = useCallback((batch) => {
    if (!batch) return;
    const res = purchaseBatchUnlock({
      batchId: batch.batchId,
      batchLabel: `Speech Shadowing Batch ${batch.batchIndex}`,
      costGold: batch.costGold,
      currentUser
    });
    if (res.success) {
      setLocalWalletTick(t => t + 1);
      speakingSoundEffects.playCompletionChime();
      triggerHaptic('combo');
      setSelectedShadowBatch(batch.batchIndex);
      if (batch.items[0]) {
        setSelectedTaskId(batch.items[0].id);
      }
    }
  }, [currentUser]);

  const allTasks = useMemo(() => {
    if (selectedShadowBatch === 'personal') return personalShadowTasks;
    if (activeShadowBatchObj && !activeShadowBatchObj.isUnlocked) return [];
    return activeShadowBatchObj ? activeShadowBatchObj.items : canonicalShadowTasks;
  }, [selectedShadowBatch, personalShadowTasks, activeShadowBatchObj, canonicalShadowTasks]);

  const partCounts = useMemo(() => {
    const counts = { all: allTasks.length, part1: 0, part2: 0, part3: 0 };
    allTasks.forEach((t) => {
      if (t.part === 'part1') counts.part1 += 1;
      else if (t.part === 'part2') counts.part2 += 1;
      else if (t.part === 'part3') counts.part3 += 1;
    });
    return counts;
  }, [allTasks]);

  const availableSources = useMemo(() => {
    const set = new Set();
    allTasks.forEach((t) => {
      if (t.isCustom) set.add('Custom');
      else if (t.sourceTag) set.add(t.sourceTag);
      else set.add('Starter');
    });
    return ['all', ...Array.from(set)];
  }, [allTasks]);

  const segmentCountByTaskId = useMemo(() => {
    const counts = {};
    allTasks.forEach((task) => {
      counts[task.id] = getShadowingTaskSegmentCount(task, chunkMode);
    });
    return counts;
  }, [allTasks, chunkMode]);

  const filteredTasks = useMemo(() => {
    let list = allTasks;
    if (activePart !== 'all') {
      list = list.filter(t => t.part === activePart);
    }
    if (sourceFilter !== 'all') {
      list = list.filter(t => {
        const tag = t.isCustom ? 'Custom' : (t.sourceTag || 'Starter');
        return tag === sourceFilter;
      });
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
  }, [allTasks, activePart, sourceFilter, bandFilter, hideCompleted, shadowStats.bestScores, selectedTaskId, searchQuery]);

  // Reset pagination window whenever filter criteria change
  useEffect(() => {
    setVisibleTaskLimit(40);
  }, [activePart, sourceFilter, bandFilter, hideCompleted, searchQuery]);

  const visibleTasks = useMemo(() => {
    return filteredTasks.slice(0, visibleTaskLimit);
  }, [filteredTasks, visibleTaskLimit]);

  const handleListScroll = useCallback((e) => {
    const el = e.currentTarget;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 160) {
      setVisibleTaskLimit((prev) => (prev < filteredTasks.length ? prev + 40 : prev));
    }
  }, [filteredTasks.length]);

  const handlePickRandomTask = useCallback(() => {
    if (filteredTasks.length === 0) return;
    const pool = filteredTasks.length > 1
      ? filteredTasks.filter(t => t.id !== selectedTaskId)
      : filteredTasks;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) {
      setSelectedTaskId(pick.id);
      setIsMobileListOpen(false);
    }
  }, [filteredTasks, selectedTaskId]);

  const currentTask = useMemo(() => {
    return (
      allTasks.find(t => t.id === selectedTaskId) ||
      filteredTasks[0] ||
      SHADOWING_STARTER_TASKS[0]
    );
  }, [allTasks, selectedTaskId, filteredTasks]);

  const handleNextTask = useCallback(() => {
    const curId = currentTask?.id;
    const isUnfinished = (t) => !shadowStats.bestScores?.[t.id];
    const curIdx = filteredTasks.findIndex(t => t.id === curId);

    // 1. Next unfinished task after current in filteredTasks
    let next = filteredTasks.slice(curIdx + 1).find(t => t.id !== curId && isUnfinished(t));
    // 2. Wrap around to first unfinished task in filteredTasks
    if (!next) {
      next = filteredTasks.find(t => t.id !== curId && isUnfinished(t));
    }
    // 3. Fallback: any unfinished task across allTasks
    if (!next) {
      next = allTasks.find(t => t.id !== curId && isUnfinished(t));
    }
    // 4. Final fallback: next task in filteredTasks even if all completed
    if (!next && filteredTasks.length > 1) {
      next = filteredTasks[(curIdx + 1 + filteredTasks.length) % filteredTasks.length];
    }

    if (next) {
      setSelectedTaskId(next.id);
      setIsMobileListOpen(false);
    }
  }, [currentTask?.id, filteredTasks, allTasks, shadowStats.bestScores]);

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
  const [comparingSegId, setComparingSegId] = useState(null);

  // Full Speech Replay State
  const [isFullReplaying, setIsFullReplaying] = useState(false);
  const [replaySegIdx, setReplaySegIdx] = useState(0);
  const fullReplayCancelRef = useRef(false);

  // Custom Creator Modal State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

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
  const fullReplayTimerRef = useRef(null);
  const retryResetTimerRef = useRef(null);
  const compareTimerRef = useRef(null);
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
    if (fullReplayTimerRef.current) {
      clearTimeout(fullReplayTimerRef.current);
      fullReplayTimerRef.current = null;
    }
    if (retryResetTimerRef.current) {
      clearTimeout(retryResetTimerRef.current);
      retryResetTimerRef.current = null;
    }
    if (compareTimerRef.current) {
      clearTimeout(compareTimerRef.current);
      compareTimerRef.current = null;
    }
    setComparingSegId(null);
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
          const retryToken = sessionTokenRef.current;
          if (retryResetTimerRef.current) clearTimeout(retryResetTimerRef.current);
          retryResetTimerRef.current = setTimeout(() => {
            retryResetTimerRef.current = null;
            if (retryToken !== sessionTokenRef.current) return;
            speechEngine.resetTranscript({ restartRecognition: true });
          }, 550);
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
    if (targetWordCount >= 10 && spokenWordCount <= 1) {
      delayMs = 5000;
    } else if (isLongParagraph) {
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
      const stopToken = sessionTokenRef.current;
      const capturedBeforeStop = liveSpokenTextRef.current;
      speechEngine.stopListening();
      setIsWaitingForRetrySpeech(false);
      setTimeout(() => {
        if (stopToken !== sessionTokenRef.current) return;
        const captured =
          speechEngine.getLatestTranscript?.() ||
          liveSpokenTextRef.current ||
          capturedBeforeStop ||
          '';
        if (captured.trim()) {
          handleRunEvaluationRef.current?.(captured);
        } else {
          setShowManualFallback(true);
        }
      }, 260);
    } else {
      speechEngine.stopSpeaking();
      if (userAudioRef.current) {
        try {
          userAudioRef.current.pause();
          userAudioRef.current.currentTime = 0;
        } catch (e) {}
      }
      setPlayingUserClipSegId(null);
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
      { examinerId: selectedExaminerId, rate: Math.min(playbackSpeed, 0.8), silentChime: true },
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

  const handleReplayUserClip = useCallback((segId) => {
    const clipKey = `shad_${currentTask.id}_${segId}`;
    const clip = speechEngine.audioClips[clipKey];
    if (!clip?.url) return;
    speechEngine.stopListening();
    speechEngine.stopSpeaking();

    if (!userAudioRef.current) {
      userAudioRef.current = new Audio(clip.url);
    } else if (userAudioRef.current.src !== clip.url) {
      userAudioRef.current.pause();
      userAudioRef.current.currentTime = 0;
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
  }, [currentTask?.id, playingUserClipSegId, speechEngine.audioClips, speechEngine.stopListening, speechEngine.stopSpeaking]);

  const handlePlaySegModel = useCallback((s, rate) => {
    speechEngine.stopListening();
    speechEngine.speak(s.text, { examinerId: selectedExaminerId, rate: rate || playbackSpeed, silentChime: true });
  }, [playbackSpeed, selectedExaminerId, speechEngine.stopListening, speechEngine.speak]);

  const handleToggleRevealCurrentSeg = useCallback(() => {
    setRevealCurrentSeg(prev => !prev);
  }, []);

  const handleToggleManualFallback = useCallback(() => {
    setShowManualFallback(prev => !prev);
  }, []);

  const handleRunManualEvaluation = useCallback((txt) => {
    handleRunEvaluationRef.current?.(txt);
  }, []);

  const handleCompareSegAudio = useCallback((seg) => {
    if (!seg) return;
    const clipKey = `shad_${currentTask.id}_${seg.id}`;
    const clip = speechEngine.audioClips[clipKey];
    if (!clip?.url) return;

    if (comparingSegId === seg.id) {
      invalidateAndStopAudio();
      return;
    }

    invalidateAndStopAudio();
    const token = sessionTokenRef.current;
    setComparingSegId(seg.id);
    speechEngine.speak(
      seg.text,
      { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true },
      () => {
        if (token !== sessionTokenRef.current) return;
        compareTimerRef.current = setTimeout(() => {
          compareTimerRef.current = null;
          if (token !== sessionTokenRef.current) return;
          const audio = new Audio(clip.url);
          userAudioRef.current = audio;
          audio.onended = () => {
            setPlayingUserClipSegId(null);
            setComparingSegId(null);
          };
          audio.onerror = () => {
            setPlayingUserClipSegId(null);
            setComparingSegId(null);
          };
          audio.play()
            .then(() => setPlayingUserClipSegId(seg.id))
            .catch(() => setComparingSegId(null));
        }, 280);
      }
    );
  }, [comparingSegId, currentTask?.id, invalidateAndStopAudio, playbackSpeed, selectedExaminerId, speechEngine]);

  // Layer 2 Gemini Native Audio Deep Check (via shared helper)
  const handleDeepAiAudioCheck = async () => {
    if (!activeSeg || !currentAudioClip?.blob || !apiKey || isDeepAiGrading) return;
    setIsDeepAiGrading(true);
    setDeepAiError('');
    try {
      const updatedEval = await runLayer2PronunciationCheck({
        audioBlob: currentAudioClip.blob,
        targetText: activeSeg.text,
        itemType: 'sentences',
        apiKey,
        model,
        isEn,
        passThreshold,
        prevEval: evaluationResult,
        xpHigh: 45,
        xpNormal: 35
      });
      setEvaluationResult(updatedEval);
      if (updatedEval.isPassed) {
        const alreadyPassed = Boolean(segmentResults[activeSeg.id]?.isPassed);
        speechEngine.stopListening();
        speakingSoundEffects.playCompletionChime();
        triggerHaptic('combo');
        setSegmentResults(prev => ({ ...prev, [activeSeg.id]: updatedEval }));
        if (!alreadyPassed && updatedEval.xpEarned > 0 && awardXp) {
          awardXp(updatedEval.xpEarned, `Speech Shadowing AI Deep Check: ${currentTask.titleEn}`);
        }
      }
    } catch (err) {
      setDeepAiError(err.message || (isEn ? 'AI Audio evaluation failed.' : 'Không thể chấm sâu bằng AI Audio.'));
    } finally {
      setIsDeepAiGrading(false);
    }
  };

  // Full Shadowing Speech Replay (properly tracked so Stop/Close kills pending Audio & timers cleanly)
  const handleToggleFullReplay = () => {
    if (isFullReplaying) {
      invalidateAndStopAudio();
      return;
    }

    invalidateAndStopAudio();
    fullReplayCancelRef.current = false;
    setIsFullReplaying(true);

    const scheduleNext = (nextIdx) => {
      if (fullReplayTimerRef.current) clearTimeout(fullReplayTimerRef.current);
      fullReplayTimerRef.current = setTimeout(() => {
        if (!fullReplayCancelRef.current) {
          playStep(nextIdx);
        }
      }, 300);
    };

    const playStep = (idx) => {
      if (fullReplayCancelRef.current || idx >= resolvedSegments.length) {
        setIsFullReplaying(false);
        return;
      }
      setReplaySegIdx(idx);
      const seg = resolvedSegments[idx];
      if (userAudioRef.current) {
        try {
          userAudioRef.current.pause();
          userAudioRef.current.currentTime = 0;
        } catch (e) {}
      }
      if (seg.unitType !== 'prompt_only') {
        const clip = speechEngine.audioClips[`shad_${currentTask.id}_${seg.id}`];
        if (clip?.url) {
          const audio = new Audio(clip.url);
          userAudioRef.current = audio;
          audio.onended = () => scheduleNext(idx + 1);
          audio.onerror = () => scheduleNext(idx + 1);
          audio.play().catch(() => {
            if (fullReplayCancelRef.current) return;
            speechEngine.speak(seg.text, { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true }, () => {
              scheduleNext(idx + 1);
            });
          });
          return;
        }
      }
      speechEngine.speak(seg.text, { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true }, () => {
        scheduleNext(idx + 1);
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

  // Save custom task returned by ShadowingCustomCreatorModal
  const handleCreatedCustomTask = (created) => {
    if (!created) return;
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

  // Shared Task Filter & List renderer for Desktop Sidebar & Mobile Bottom Sheet (DRY)
  const renderTaskListContent = (isMobileSheet = false) => (
    <>
      <div className={`${isMobileSheet ? 'p-3' : 'p-2.5'} border-b border-slate-800/80 space-y-2 shrink-0`}>
        {shadowBatches.length > 0 && (
          <BatchSelectorStrip
            batches={shadowBatches}
            selectedBatchIndex={selectedShadowBatch}
            onSelectBatch={(nextB) => {
              setSelectedShadowBatch(nextB);
              if (nextB === 'personal' && personalShadowTasks[0]) {
                setSelectedTaskId(personalShadowTasks[0].id);
              } else if (typeof nextB === 'number') {
                const found = shadowBatches.find(b => b.batchIndex === nextB);
                if (found?.isUnlocked && found.items[0]) {
                  setSelectedTaskId(found.items[0].id);
                }
              }
            }}
            personalCount={personalShadowTasks.length}
            isEn={isEn}
            isMobileSheet={isMobileSheet}
          />
        )}
        <div className={isMobileSheet ? 'flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5' : 'flex flex-wrap gap-1'}>
          {SHADOWING_PARTS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePart(p.id)}
              className={`${isMobileSheet ? 'px-2.5 py-1.5 rounded-xl text-[11px] shrink-0' : 'px-2 py-1 rounded-lg text-[10px]'} font-black transition-all cursor-pointer whitespace-nowrap ${
                activePart === p.id
                  ? `bg-gradient-to-r ${p.badgeColor} text-white shadow-sm`
                  : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900 hover:bg-slate-800'} text-slate-400 border border-slate-800`
              }`}
            >
              {isEn ? p.labelEn : p.labelVi} ({partCounts[p.id] ?? 0})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search Speaking samples...' : 'Tìm bài mẫu Speaking...'}
              className={`w-full pl-8 pr-7 ${isMobileSheet ? 'py-2 bg-slate-950' : 'py-1.5 bg-slate-900'} rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={isEn ? 'Clear search' : 'Xóa từ khóa'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handlePickRandomTask}
            disabled={filteredTasks.length === 0}
            title={isEn ? 'Pick a random task' : 'Chọn ngẫu nhiên 1 bài'}
            aria-label={isEn ? 'Pick a random task' : 'Chọn ngẫu nhiên 1 bài'}
            className={`${
              isMobileSheet
                ? 'px-2.5 py-2 bg-slate-950 border-purple-500/30 text-[11px] font-bold flex items-center space-x-1'
                : 'p-1.5 bg-slate-900 hover:bg-purple-600/20 border-slate-800 hover:border-purple-500/40'
            } rounded-xl text-purple-300 border disabled:opacity-40 cursor-pointer shrink-0 transition-colors`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            {isMobileSheet && <span>{isEn ? 'Random' : 'Ngẫu nhiên'}</span>}
          </button>
        </div>

        {availableSources.length > 2 && (
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {availableSources.map(src => (
              <button
                key={src}
                type="button"
                onClick={() => setSourceFilter(src)}
                className={`${isMobileSheet ? 'px-2.5 py-1' : 'px-2 py-0.5'} rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer border transition-colors ${
                  sourceFilter === src
                    ? 'bg-cyan-600/25 text-cyan-200 border-cyan-500/40'
                    : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-400 border-slate-800 hover:text-slate-200`
                }`}
              >
                {src === 'all' ? (isEn ? 'All Sources' : 'Mọi nguồn') : src}
              </button>
            ))}
          </div>
        )}

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
                className={`${isMobileSheet ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[10px]'} rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                  bandFilter === b.id
                    ? 'bg-purple-600 text-white'
                    : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-400 border border-slate-800`
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleHideCompleted}
            className={`${isMobileSheet ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[10px]'} rounded-lg font-bold whitespace-nowrap cursor-pointer border ${
              hideCompleted
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-400 border-slate-800`
            }`}
          >
            {isEn ? 'Hide Done' : 'Ẩn đã xong'}
          </button>
        </div>
      </div>

      <div
        onScroll={handleListScroll}
        className={`flex-1 overflow-y-auto ${isMobileSheet ? 'p-3 space-y-2' : 'p-2 space-y-1.5'} overscroll-contain`}
      >
        {isLoadingBank && (
          <div className={`px-3 ${isMobileSheet ? 'py-2.5 bg-slate-950/90 text-xs' : 'py-2 bg-slate-900/90 text-[11px]'} rounded-xl border border-slate-800 text-cyan-300 flex items-center space-x-2`}>
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>{isEn ? 'Loading Speaking Bank...' : 'Đang tải ngân hàng đề Speaking...'}</span>
          </div>
        )}
        {activeShadowBatchObj && !activeShadowBatchObj.isUnlocked ? (
          <BatchUnlockGateCard
            targetBatch={activeShadowBatchObj}
            compact
            isEn={isEn}
            onUnlockBatch={handlePurchaseShadowBatch}
            onGoToPrevBatch={(prevIdx) => setSelectedShadowBatch(prevIdx)}
            onOpenAuth={onOpenAuth}
            onOpenArena={onOpenArena}
          />
        ) : !isLoadingBank && visibleTasks.length === 0 && nextLockedShadowBatch && activeShadowBatchObj?.isCompleted ? (
          <BatchUnlockGateCard
            targetBatch={nextLockedShadowBatch}
            isCelebrationMode
            compact
            isEn={isEn}
            onUnlockBatch={handlePurchaseShadowBatch}
            onOpenAuth={onOpenAuth}
            onOpenArena={onOpenArena}
            onShowCompletedItems={toggleHideCompleted}
          />
        ) : !isLoadingBank && visibleTasks.length === 0 && (
          <div className="p-5 text-center text-xs text-slate-400 space-y-2.5">
            <p>
              {isEn
                ? 'No Speaking samples match your current filter.'
                : 'Không có bài mẫu Speaking nào khớp bộ lọc hiện tại.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setBandFilter('all');
                setSourceFilter('all');
                setActivePart('all');
                if (hideCompleted) toggleHideCompleted();
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
            >
              {isEn ? 'Reset Filters & Show All' : 'Đặt lại bộ lọc & Hiện tất cả'}
            </button>
          </div>
        )}
        {visibleTasks.map(item => {
          const isSelected = currentTask?.id === item.id;
          const best = shadowStats.bestScores?.[item.id];
          const segCount = segmentCountByTaskId[item.id] ?? 0;
          return (
            <div
              key={item.id}
              onClick={() => {
                setSelectedTaskId(item.id);
                setIsMobileListOpen(false);
              }}
              className={`${isMobileSheet ? 'p-3 min-h-[54px] active:scale-98' : 'p-2.5'} rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                isSelected
                  ? 'bg-purple-950/65 border-purple-500/60 shadow-md'
                  : `${isMobileSheet ? 'bg-slate-950/70' : 'bg-slate-900/70 hover:bg-slate-900'} border-slate-800/80`
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
                {!isMobileSheet && (
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {isEn ? item.topicEn : item.topicVi}
                  </div>
                )}
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
        {visibleTasks.length < filteredTasks.length && (
          <button
            type="button"
            onClick={() => setVisibleTaskLimit(prev => prev + 40)}
            className={`w-full ${isMobileSheet ? 'py-2.5 rounded-2xl bg-slate-950' : 'py-2 rounded-xl bg-slate-900'} hover:bg-slate-800 border border-slate-800 text-xs font-bold text-purple-300 cursor-pointer transition-colors`}
          >
            {isEn
              ? `Show more (${filteredTasks.length - visibleTasks.length} remaining)`
              : `Xem thêm (${filteredTasks.length - visibleTasks.length} bài còn lại)`}
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
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
            onClick={handleNextTask}
            className="p-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/35 shrink-0 cursor-pointer"
            title={isEn ? 'Next task' : 'Bài kế tiếp'}
            aria-label={isEn ? 'Next task' : 'Bài kế tiếp'}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => resetShadowingState(true)}
            className="hidden sm:inline-flex p-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 shrink-0 cursor-pointer"
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
            <button
              type="button"
              onClick={() => {
                resetShadowingState(true);
                setIsMobileDisplayOpen(false);
              }}
              className="sm:hidden px-2.5 py-1 rounded-xl text-[10px] font-bold border bg-slate-950 text-slate-300 border-slate-800 cursor-pointer flex items-center space-x-1 whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEn ? 'Restart' : 'Làm lại'}</span>
            </button>
          </div>
        )}
      </div>

      {/* MAIN TWO-PANE WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* DESKTOP LEFT SIDEBAR (Collapsible for full-width shadowing focus) */}
        {isDesktopSidebarOpen && (
        <aside className="hidden lg:flex w-72 xl:w-80 bg-slate-950/60 border-r border-slate-800 flex-col shrink-0">
          {renderTaskListContent(false)}
        </aside>
        )}

        {/* MAIN SHADOWING STAGE */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-900/40">
          {activeShadowBatchObj && !activeShadowBatchObj.isUnlocked ? (
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="w-full max-w-xl">
                <BatchUnlockGateCard
                  targetBatch={activeShadowBatchObj}
                  isEn={isEn}
                  onUnlockBatch={handlePurchaseShadowBatch}
                  onGoToPrevBatch={(prevIdx) => setSelectedShadowBatch(prevIdx)}
                  onOpenAuth={onOpenAuth}
                  onOpenArena={onOpenArena}
                />
              </div>
            </div>
          ) : (
          <>
          {/* Compact 1-Row Task Header & Controls (Desktop lg+) */}
          <div className="hidden lg:flex px-4 py-2 bg-slate-950/70 border-b border-slate-800 items-center justify-between gap-2 shrink-0">
            <div className="min-w-0 flex-1 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsDesktopSidebarOpen(prev => !prev)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer shrink-0"
                title={isDesktopSidebarOpen ? (isEn ? 'Hide task list' : 'Thu gọn danh sách') : (isEn ? 'Show task list' : 'Mở danh sách')}
              >
                {isDesktopSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              </button>
              <h3 className="text-sm font-black text-white truncate">
                {isEn ? currentTask.titleEn : currentTask.titleVi}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
                {Math.min(activeSegIndex + 1, resolvedSegments.length)}/{resolvedSegments.length}
              </span>
              <button
                type="button"
                onClick={() => setShowPromptCard(prev => !prev)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border flex items-center space-x-1 shrink-0 cursor-pointer transition-colors ${
                  showPromptCard
                    ? 'bg-indigo-600/25 text-indigo-200 border-indigo-500/40'
                    : 'bg-slate-900 text-cyan-300 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>{isEn ? 'Cue Card' : 'Đề bài'}</span>
                {showPromptCard ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Compact Chunk Flow Mode Pills */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shrink-0">
                <Layers className="w-3 h-3 text-cyan-400 mx-1 shrink-0" />
                {SHADOWING_CHUNK_MODES.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectChunkMode(m.id)}
                    title={isEn ? m.descEn : m.descVi}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black cursor-pointer whitespace-nowrap transition-all ${
                      chunkMode === m.id
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isEn ? m.labelEn : m.labelVi}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowIntonation(prev => !prev)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
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
                className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer flex items-center space-x-1 ${
                  keywordsOnly
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{isEn ? 'Keywords' : 'Ẩn chữ'}</span>
              </button>

              <button
                type="button"
                onClick={handleNextTask}
                className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/35 text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                title={isEn ? 'Next task' : 'Chuyển sang bài kế tiếp'}
              >
                <span>{isEn ? 'Next' : 'Bài tiếp'}</span>
                <SkipForward className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => resetShadowingState(true)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
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
                    playbackSpeed={playbackSpeed}
                    revealThisSeg={isActive ? revealCurrentSeg : false}
                    onToggleRevealThisSeg={isActive ? handleToggleRevealCurrentSeg : NOOP}
                    onPlayModel={handlePlaySegModel}
                    onSkipReadingToSpeak={isActive ? handleSkipReadingToSpeak : NOOP}
                    isListening={isActive && speechEngine.isListening}
                    isAutoMode={isAutoMode}
                    liveSpokenText={isActive ? liveSpokenText : ''}
                    isWaitingForRetrySpeech={isActive && isWaitingForRetrySpeech}
                    speechError={isActive ? speechEngine.speechError : null}
                    analyserNode={isActive ? speechEngine.analyserNode : null}
                    micLevel={isActive ? (speechEngine.micLevel || 0) : 0}
                    hasAnalyser={Boolean(speechEngine.analyserNode)}
                    evaluationResult={isActive ? evaluationResult : segmentResults[seg.id]}
                    attemptCount={segmentAttempts[seg.id] || 0}
                    passThreshold={passThreshold}
                    currentAudioClip={clip}
                    isPlayingUserClip={playingUserClipSegId === seg.id}
                    isComparingAudio={comparingSegId === seg.id}
                    onToggleRecording={isActive ? handleToggleRecording : NOOP}
                    onReplayUserClip={handleReplayUserClip}
                    onCompareAudio={handleCompareSegAudio}
                    onListenAndRetry={isActive ? handleListenAndRetry : NOOP}
                    onSkipSegment={isActive ? handleSkipSegment : NOOP}
                    onAdvanceAfterPass={isActive ? advanceAfterPass : NOOP}
                    showManualFallback={isActive && showManualFallback}
                    onToggleManualFallback={isActive ? handleToggleManualFallback : NOOP}
                    manualSpokenInput={isActive ? manualSpokenInput : ''}
                    onChangeManualSpokenInput={isActive ? setManualSpokenInput : NOOP}
                    onRunManualEvaluation={isActive ? handleRunManualEvaluation : NOOP}
                    apiKey={apiKey}
                    isDeepAiGrading={isActive ? isDeepAiGrading : false}
                    deepAiError={isActive ? deepAiError : ''}
                    onDeepAiAudioCheck={isActive ? handleDeepAiAudioCheck : NOOP}
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
                onNextTask={handleNextTask}
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
                onOpenInPronunciation={
                  onOpenPronunciation
                    ? (wordsList) =>
                        onOpenPronunciation(
                          Array.isArray(wordsList) && wordsList.length > 0
                            ? { tab: 'words', focusWords: wordsList }
                            : { tab: 'words' }
                        )
                    : null
                }
                isEn={isEn}
              />
              </div>
            )}
            <div className="h-3 lg:hidden" />
          </div>
          </>
          )}
        </main>
      </div>

      {/* MOBILE STICKY BOTTOM THUMB-ZONE BAR (< lg) */}
      {activeSeg && !isCompleted && (
        <div className="lg:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2 z-30">
          <button
            type="button"
            onClick={() => {
              speechEngine.stopListening();
              speechEngine.speak(activeSeg.text, { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true });
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

      {/* MOBILE STICKY BOTTOM COMPLETION BAR (< lg) */}
      {isCompleted && (
        <div className="lg:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-emerald-500/30 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2 z-30">
          <button
            type="button"
            onClick={() => resetShadowingState(true)}
            className="min-h-[48px] px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Retry' : 'Làm lại'}</span>
          </button>
          <button
            type="button"
            onClick={handleNextTask}
            className="flex-1 min-h-[48px] px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-sm font-black flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all"
          >
            <span>{isEn ? 'Next Task' : 'Bài Kế Tiếp'}</span>
            <SkipForward className="w-4 h-4 shrink-0" />
          </button>
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

            {renderTaskListContent(true)}
          </div>
        </div>
      )}

      {/* CUSTOM SHADOWING SAMPLE CREATOR MODAL */}
      <ShadowingCustomCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        apiKey={apiKey}
        model={model}
        onCreatedTask={handleCreatedCustomTask}
        isEn={isEn}
      />
    </>
  );
}
