import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  X,
  Mic,
  Volume2,
  Play,
  Square,
  Plus,
  Trash2,
  Search,
  Maximize2,
  Minimize2,
  Share2,
  Check,
  Sparkles,
  Trophy,
  Zap,
  Flame,
  List,
  ArrowLeftRight,
  Sliders,
  Headphones,
  MessageSquare,
  Radio,
  RotateCcw,
  Eye
} from 'lucide-react';
import {
  CONVERSATION_DEFAULT_THRESHOLD,
  CONVERSATION_THRESHOLD_OPTIONS,
  CONVERSATION_TRACKS,
  CONVERSATION_SCENARIOS,
  buildCustomConversation,
  evaluateConversationTurn,
  summarizeConversationSession
} from '../data/conversationData';
import { loadDynamicConversations } from '../data/conversationAdapters';
import { useSpeechEngine } from '../hooks/useSpeechEngine';
import { useTranslation } from '../i18n';
import { safeGet, safeSet } from '../utils/storageService';
import {
  submitRealSprintScore,
  getCurrentUserTotalXp
} from '../services/gamification/realLeaderboardService';
import {
  calculateLevelProgress,
  calculateLevelFromXp,
  getLevelTierInfo
} from '../services/gamification/levelEngine';
import { addGold } from '../services/gamification/atlasWalletService';
import { getUnifiedStreakCount } from '../services/gamification/leagueEngine';
import { speakingSoundEffects } from '../utils/speakingSoundEffects';
import { triggerHaptic } from '../utils/hapticHelper';
import { callGeminiApi } from '../services/ai/coreGeminiClient';
import ConversationTurnCard from './conversation/ConversationTurnCard';
import ConversationSummaryCard from './conversation/ConversationSummaryCard';
import SpeakingSoundcheckModal from './speaking/SpeakingSoundcheckModal';

const CUSTOM_CONV_STORAGE_KEY = 'ielts_conversation_custom_v1';
const CONV_STATS_STORAGE_KEY = 'ielts_conversation_stats_v1';
const CONV_RESUME_SESSION_KEY = 'ielts_conversation_resume_v1';

export default function ConversationStudioModal({
  isOpen,
  onClose,
  apiKey = '',
  model = 'gemini-3.6-flash',
  currentUser = null,
  onSaveToNotebook,
  onSaveMistake,
  onOpenPronunciation,
  initialOptions = null
}) {
  const { isEn } = useTranslation();

  // 1. Track & Scenario Selection
  const validTracks = ['all', 'daily', 'ielts', 'academic'];
  const [activeTrack, setActiveTrack] = useState(() => {
    if (initialOptions?.track && validTracks.includes(initialOptions.track)) {
      return initialOptions.track;
    }
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('track');
      if (param && validTracks.includes(param)) return param;
    }
    return 'all';
  });

  const [dynamicScenarios, setDynamicScenarios] = useState([]);
  const [customScenarios, setCustomScenarios] = useState(() =>
    safeGet(CUSTOM_CONV_STORAGE_KEY, [])
  );
  const [convStats, setConvStats] = useState(() =>
    safeGet(CONV_STATS_STORAGE_KEY, {
      totalXpEarned: 0,
      completedCount: 0,
      bestScores: {},
      streak: 0
    })
  );

  // Load dynamic conversations (Listening Studio R2 + Speaking Topics Bank + optional passed scenario)
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    loadDynamicConversations().then((loaded) => {
      if (mounted && Array.isArray(loaded)) {
        const extra = initialOptions?.customScenario ? [initialOptions.customScenario] : [];
        const merged = [...extra, ...loaded.filter(d => !extra.some(e => e.id === d.id))];
        setDynamicScenarios(merged);
        if (initialOptions?.customScenario?.id) {
          setSelectedScenarioId(initialOptions.customScenario.id);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, [isOpen, initialOptions?.customScenario?.id]);

  // 2. UI & Audio Settings
  const [isExpanded, setIsExpanded] = useState(() =>
    Boolean(safeGet('ielts_conversation_expanded', false))
  );
  const [selectedExaminerId, setSelectedExaminerId] = useState(() =>
    safeGet('ielts_conversation_examiner', 'examiner-arthur')
  );
  const [playbackSpeed, setPlaybackSpeed] = useState(0.95);
  const [passThreshold, setPassThreshold] = useState(() =>
    Number(safeGet('ielts_conversation_threshold', CONVERSATION_DEFAULT_THRESHOLD)) || CONVERSATION_DEFAULT_THRESHOLD
  );
  const [isAutoMode, setIsAutoMode] = useState(() =>
    Boolean(safeGet('ielts_conversation_auto_mode', true))
  );
  const [showIntonation, setShowIntonation] = useState(false);
  const [keywordsOnly, setKeywordsOnly] = useState(false);
  const [revealCurrentTurn, setRevealCurrentTurn] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [bandFilter, setBandFilter] = useState('all');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState(() =>
    initialOptions?.scenario || CONVERSATION_SCENARIOS[0].id
  );
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isSoundcheckOpen, setIsSoundcheckOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // 3. Gamification & XP State
  const [userTotalXp, setUserTotalXp] = useState(() => getCurrentUserTotalXp(currentUser));
  const [sessionXp, setSessionXp] = useState(0);
  const [xpToast, setXpToast] = useState(null);
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setUserTotalXp(getCurrentUserTotalXp(currentUser));
    }
  }, [isOpen, currentUser]);

  const levelProgress = useMemo(() => calculateLevelProgress(userTotalXp), [userTotalXp]);

  // 4. Speech & Studio Audio Engines
  const speechEngine = useSpeechEngine({ examinerId: selectedExaminerId });
  const r2AudioRef = useRef(null);
  const r2SegmentTimerRef = useRef(null);
  const userAudioRef = useRef(null);
  const [isPlayingR2Segment, setIsPlayingR2Segment] = useState(false);
  const [playingUserClipTurnId, setPlayingUserClipTurnId] = useState(null);

  // Combine built-in + dynamic + custom scenarios (100% open access)
  const allScenarios = useMemo(() => {
    const customList = Array.isArray(customScenarios) ? customScenarios : [];
    return [...customList, ...CONVERSATION_SCENARIOS, ...dynamicScenarios];
  }, [customScenarios, dynamicScenarios]);

  const filteredScenarios = useMemo(() => {
    let list = allScenarios;
    if (activeTrack !== 'all') {
      list = list.filter(s => s.track === activeTrack);
    }
    if (bandFilter === 'foundation') {
      list = list.filter(s => parseFloat(s.bandLevel) <= 6.5);
    } else if (bandFilter === 'band7') {
      list = list.filter(s => parseFloat(s.bandLevel) >= 7.0 && parseFloat(s.bandLevel) <= 7.5);
    } else if (bandFilter === 'band8') {
      list = list.filter(s => parseFloat(s.bandLevel) >= 8.0);
    }
    if (hideCompleted) {
      list = list.filter(s => !convStats.bestScores?.[s.id] || s.id === selectedScenarioId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.titleEn?.toLowerCase().includes(q) ||
        s.titleVi?.toLowerCase().includes(q) ||
        s.contextEn?.toLowerCase().includes(q) ||
        s.contextVi?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allScenarios, activeTrack, bandFilter, hideCompleted, convStats.bestScores, selectedScenarioId, searchQuery]);

  const currentScenario = useMemo(() => {
    return (
      allScenarios.find(s => s.id === selectedScenarioId) ||
      filteredScenarios[0] ||
      CONVERSATION_SCENARIOS[0]
    );
  }, [allScenarios, selectedScenarioId, filteredScenarios]);

  // 5. Turn-Taking Conversation State Machine
  const [userRole, setUserRole] = useState(() => currentScenario?.defaultUserRole || 'B');
  const [activeTurnIndex, setActiveTurnIndex] = useState(0);
  const [hasStartedDialogue, setHasStartedDialogue] = useState(false);
  const [turnResults, setTurnResults] = useState({});
  const [turnAttempts, setTurnAttempts] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isWaitingForRetrySpeech, setIsWaitingForRetrySpeech] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [manualSpokenInput, setManualSpokenInput] = useState('');
  const [isDeepAiGrading, setIsDeepAiGrading] = useState(false);
  const [deepAiError, setDeepAiError] = useState('');
  const [totalSpeakingSec, setTotalSpeakingSec] = useState(0);

  // Full Dialogue Replay State
  const [isFullReplaying, setIsFullReplaying] = useState(false);
  const [replayTurnIdx, setReplayTurnIdx] = useState(0);
  const fullReplayCancelRef = useRef(false);

  // Custom Creator Drawer State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customTrack, setCustomTrack] = useState('daily');
  const [customBand, setCustomBand] = useState('7.0');
  const [customRoleA, setCustomRoleA] = useState('Partner');
  const [customRoleB, setCustomRoleB] = useState('You');
  const [customScript, setCustomScript] = useState(
    'A: Hi! Have you finished reviewing the quarterly presentation?\nB: Almost! I am just polishing the final financial summary.'
  );
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');
  const [isGeneratingAiScript, setIsGeneratingAiScript] = useState(false);

  // Refs for async timers & auto-evaluation
  const turnsContainerRef = useRef(null);
  const liveSpokenTextRef = useRef('');
  const lastAutoEvaluatedRef = useRef('');
  const handleRunEvaluationRef = useRef(null);
  const advanceTimerRef = useRef(null);
  const completedScenarioAwardedRef = useRef(false);

  const turns = currentScenario?.turns || [];
  const isCompleted = turns.length > 0 && activeTurnIndex >= turns.length;
  const activeTurn = !isCompleted ? turns[activeTurnIndex] : null;
  const isActiveUserTurn = Boolean(activeTurn && activeTurn.speaker === userRole);
  const currentClipKey = activeTurn ? `conv_${currentScenario.id}_${activeTurn.id}` : 'conv_default';
  const currentAudioClip = speechEngine.audioClips[currentClipKey];

  const isMobileDevice =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

  // Stop all audio helper
  const stopAllAudio = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (r2SegmentTimerRef.current) {
      clearTimeout(r2SegmentTimerRef.current);
      r2SegmentTimerRef.current = null;
    }
    if (r2AudioRef.current) {
      try {
        r2AudioRef.current.pause();
      } catch (e) {}
    }
    setIsPlayingR2Segment(false);
    if (userAudioRef.current) {
      try {
        userAudioRef.current.pause();
        userAudioRef.current.currentTime = 0;
      } catch (e) {}
    }
    setPlayingUserClipTurnId(null);
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    if (speechEngine.isListening) speechEngine.stopListening();
    fullReplayCancelRef.current = true;
    setIsFullReplaying(false);
  }, [speechEngine]);

  // Reset state when switching scenario or role
  const resetDialogueState = useCallback(
    (nextRole = null, clearSavedProgress = true) => {
      stopAllAudio();
      if (clearSavedProgress && typeof window !== 'undefined') {
        try { window.sessionStorage.removeItem(CONV_RESUME_SESSION_KEY); } catch (e) {}
      }
      const targetRole = nextRole || currentScenario?.defaultUserRole || 'B';
      setUserRole(targetRole);
      setActiveTurnIndex(0);
      setHasStartedDialogue(false);
      setTurnResults({});
      setTurnAttempts({});
      setEvaluationResult(null);
      setIsWaitingForRetrySpeech(false);
      setShowManualFallback(false);
      setManualSpokenInput('');
      setRevealCurrentTurn(false);
      setIsDeepAiGrading(false);
      setDeepAiError('');
      setTotalSpeakingSec(0);
      completedScenarioAwardedRef.current = false;
      liveSpokenTextRef.current = '';
      lastAutoEvaluatedRef.current = '';
      speechEngine.resetTranscript();
    },
    [stopAllAudio, currentScenario?.defaultUserRole, speechEngine]
  );

  // Switch scenario
  const handleSelectScenario = (scenario) => {
    if (!scenario) return;
    setSelectedScenarioId(scenario.id);
    setIsMobileListOpen(false);
  };

  // Restore saved in-progress session from sessionStorage if matching currentScenario
  useEffect(() => {
    if (!isOpen) {
      stopAllAudio();
      return;
    }
    let restored = false;
    if (typeof window !== 'undefined' && currentScenario?.id) {
      try {
        const raw = window.sessionStorage.getItem(CONV_RESUME_SESSION_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (
            saved &&
            saved.scenarioId === currentScenario.id &&
            typeof saved.activeTurnIndex === 'number' &&
            saved.activeTurnIndex > 0 &&
            saved.activeTurnIndex < (currentScenario.turns?.length || 0)
          ) {
            stopAllAudio();
            setUserRole(saved.userRole || currentScenario.defaultUserRole || 'B');
            setActiveTurnIndex(saved.activeTurnIndex);
            setHasStartedDialogue(false);
            setTurnResults(saved.turnResults || {});
            setTurnAttempts(saved.turnAttempts || {});
            setTotalSpeakingSec(saved.totalSpeakingSec || 0);
            setEvaluationResult(null);
            restored = true;
          }
        }
      } catch (e) {}
    }
    if (!restored) {
      resetDialogueState(currentScenario?.defaultUserRole || 'B', false);
    }
  }, [currentScenario?.id, isOpen]);

  // Persist in-progress turn state to sessionStorage for Auto-Resume
  useEffect(() => {
    if (!isOpen || !currentScenario?.id || typeof window === 'undefined') return;
    try {
      if (activeTurnIndex > 0 && !isCompleted) {
        window.sessionStorage.setItem(
          CONV_RESUME_SESSION_KEY,
          JSON.stringify({
            scenarioId: currentScenario.id,
            userRole,
            activeTurnIndex,
            turnResults,
            turnAttempts,
            totalSpeakingSec
          })
        );
      } else if (isCompleted) {
        window.sessionStorage.removeItem(CONV_RESUME_SESSION_KEY);
      }
    } catch (e) {}
  }, [isOpen, currentScenario?.id, userRole, activeTurnIndex, isCompleted, turnResults, turnAttempts, totalSpeakingSec]);

  // Keyboard shortcuts (Alt+Z fullscreen, Esc close)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        setIsExpanded(prev => {
          const next = !prev;
          safeSet('ielts_conversation_expanded', next);
          return next;
        });
      } else if (e.key === 'Escape' && !isCreatorOpen && !isSoundcheckOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCreatorOpen, isSoundcheckOpen, onClose]);

  // Scroll smoothly to active turn
  useEffect(() => {
    if (turnsContainerRef.current) {
      try {
        turnsContainerRef.current.scrollTo({
          top: turnsContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } catch (e) {}
    }
  }, [activeTurnIndex, isCompleted, evaluationResult]);

  // Hybrid Audio Player for Partner Turns (uses real R2 studio segment when available, falls back to TTS)
  const playPartnerTurnAudio = useCallback(
    (turn, rateOverride = null, onEnd = null) => {
      if (!turn) {
        if (onEnd) onEnd();
        return;
      }
      if (speechEngine.isListening) speechEngine.stopListening();
      if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
      if (r2SegmentTimerRef.current) {
        clearTimeout(r2SegmentTimerRef.current);
        r2SegmentTimerRef.current = null;
      }

      const rate = rateOverride || playbackSpeed;
      const canUseR2 =
        Boolean(currentScenario?.audioUrl) &&
        typeof turn.audioStartSec === 'number' &&
        typeof turn.audioEndSec === 'number' &&
        turn.audioEndSec > turn.audioStartSec;

      if (canUseR2) {
        try {
          if (!r2AudioRef.current) {
            r2AudioRef.current = new Audio();
          }
          const audio = r2AudioRef.current;
          if (audio.src !== currentScenario.audioUrl) {
            audio.src = currentScenario.audioUrl;
          }
          audio.playbackRate = rate;
          audio.currentTime = turn.audioStartSec;
          setIsPlayingR2Segment(true);

          const segmentDurationMs = Math.max(
            1200,
            ((turn.audioEndSec - turn.audioStartSec) / rate) * 1000
          );

          audio
            .play()
            .then(() => {
              r2SegmentTimerRef.current = setTimeout(() => {
                try {
                  audio.pause();
                } catch (e) {}
                setIsPlayingR2Segment(false);
                if (onEnd) onEnd();
              }, segmentDurationMs);
            })
            .catch(() => {
              // Fallback cleanly to TTS if R2 blocked or offline
              setIsPlayingR2Segment(false);
              speechEngine.speak(
                turn.text,
                { examinerId: selectedExaminerId, rate, silentChime: true },
                onEnd
              );
            });
          return;
        } catch (e) {
          setIsPlayingR2Segment(false);
        }
      }

      speechEngine.speak(
        turn.text,
        { examinerId: selectedExaminerId, rate, silentChime: true },
        onEnd
      );
    },
    [currentScenario?.audioUrl, playbackSpeed, selectedExaminerId, speechEngine]
  );

  // Triggered when entering a Partner turn during an active dialogue
  const runPartnerTurnSequence = useCallback(
    (turn) => {
      if (!turn) return;
      playPartnerTurnAudio(turn, playbackSpeed, () => {
        speakingSoundEffects.playReadyToSpeakChime();
        setActiveTurnIndex((prev) => {
          const nextIdx = prev + 1;
          return nextIdx;
        });
      });
    },
    [playPartnerTurnAudio, playbackSpeed]
  );

  // Auto-open mic on Desktop when transitioning into a User turn during active dialogue
  useEffect(() => {
    if (!isOpen || !hasStartedDialogue || isCompleted || !activeTurn) return;

    if (activeTurn.speaker !== userRole) {
      // Partner turn -> speak automatically
      const timer = setTimeout(() => {
        runPartnerTurnSequence(activeTurn);
      }, 280);
      return () => clearTimeout(timer);
    } else if (isAutoMode && !isMobileDevice && !speechEngine.isListening) {
      // User turn on Desktop Auto-Mode -> open mic automatically
      const clipKey = `conv_${currentScenario.id}_${activeTurn.id}`;
      const timer = setTimeout(() => {
        setEvaluationResult(null);
        setIsWaitingForRetrySpeech(true);
        lastAutoEvaluatedRef.current = '';
        liveSpokenTextRef.current = '';
        speechEngine.resetTranscript();
        speechEngine.startListening(clipKey).catch(() => {
          setShowManualFallback(true);
        });
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [activeTurnIndex, hasStartedDialogue, isOpen, isCompleted]);

  // Start / Resume Dialogue button handler
  const handleStartDialogue = () => {
    setHasStartedDialogue(true);
    if (!activeTurn) return;
    if (activeTurn.speaker !== userRole) {
      runPartnerTurnSequence(activeTurn);
    } else {
      handleToggleRecording();
    }
  };

  // Award XP & Gold
  const awardXp = useCallback(
    async (deltaXp, label) => {
      if (!deltaXp || deltaXp <= 0) return;
      const oldLevel = calculateLevelFromXp(userTotalXp);
      const newTotalXp = userTotalXp + deltaXp;
      const newLevel = calculateLevelFromXp(newTotalXp);

      setUserTotalXp(newTotalXp);
      setSessionXp(prev => prev + deltaXp);

      try {
        addGold(Math.max(4, Math.round(deltaXp * 0.4)), label, true);
      } catch (e) {}

      setXpToast({ xp: deltaXp, label });
      setTimeout(() => setXpToast(null), 3200);

      if (newLevel > oldLevel) {
        setLevelUpBanner({
          oldLevel,
          newLevel,
          tier: getLevelTierInfo(newLevel)
        });
      }

      try {
        const globalStreak = Math.max(1, getUnifiedStreakCount());
        await submitRealSprintScore({
          currentUser,
          deltaXp,
          streakCount: globalStreak
        });
      } catch (e) {}
    },
    [userTotalXp, currentUser]
  );

  // Advance to next turn after passing current user turn
  const advanceAfterUserPass = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setEvaluationResult(null);
    setRevealCurrentTurn(false);
    setShowManualFallback(false);
    setManualSpokenInput('');
    setIsWaitingForRetrySpeech(false);
    setActiveTurnIndex(prev => prev + 1);
  }, []);

  // Run pronunciation evaluation on active user turn
  const handleRunEvaluation = useCallback(
    (spokenTextToEvaluate, { isAutoTriggered = false } = {}) => {
      if (!activeTurn || activeTurn.speaker !== userRole) return;
      const cleanSpoken = String(spokenTextToEvaluate || '').trim();
      const confidence = speechEngine.speechConfidenceStats?.averageConfidence || 0.88;
      const alternatives = speechEngine.speechAlternativesRef?.current || [];
      const acousticMetrics = speechEngine.getAcousticMetrics ? speechEngine.getAcousticMetrics() : null;

      const result = evaluateConversationTurn({
        targetText: activeTurn.text,
        spokenText: cleanSpoken,
        confidence,
        streak: convStats.streak || 0,
        alternatives,
        acousticMetrics,
        threshold: passThreshold
      });

      setDeepAiError('');
      const prevAttempts = turnAttempts[activeTurn.id] || 0;
      const nextAttempts = prevAttempts + 1;
      setTurnAttempts(prev => ({ ...prev, [activeTurn.id]: nextAttempts }));

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

        const durationSec = acousticMetrics?.elapsedMs ? Math.round(acousticMetrics.elapsedMs / 1000) : 5;
        setTotalSpeakingSec(prev => prev + Math.max(3, durationSec));

        setTurnResults(prev => ({ ...prev, [activeTurn.id]: fullResult }));

        // Update streak & award turn XP
        const nextStreak = (convStats.streak || 0) + 1;
        const nextStats = {
          ...convStats,
          streak: nextStreak,
          totalXpEarned: (convStats.totalXpEarned || 0) + (result.xpEarned || 0)
        };
        setConvStats(nextStats);
        safeSet(CONV_STATS_STORAGE_KEY, nextStats);

        if (result.xpEarned > 0) {
          awardXp(result.xpEarned, `Conversation Turn: ${currentScenario.titleEn}`);
        }

        // Auto-advance after brief celebratory pause
        advanceTimerRef.current = setTimeout(() => {
          advanceAfterUserPass();
        }, 1050);
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
      activeTurn,
      userRole,
      speechEngine,
      convStats,
      passThreshold,
      turnAttempts,
      currentScenario?.titleEn,
      awardXp,
      isAutoMode,
      advanceAfterUserPass
    ]
  );

  useEffect(() => {
    handleRunEvaluationRef.current = handleRunEvaluation;
  }, [handleRunEvaluation]);

  // Live spoken text sync + Smart End-of-Utterance Auto-Grade
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
      !activeTurn ||
      activeTurn.speaker !== userRole ||
      !liveSpokenText
    ) {
      return;
    }

    setIsWaitingForRetrySpeech(false);
    if (liveSpokenText === lastAutoEvaluatedRef.current) return;

    const targetWordCount = activeTurn.text.trim().split(/\s+/).filter(Boolean).length;
    const spokenWordCount = liveSpokenText.split(/\s+/).filter(Boolean).length;

    // Longer pause allowance for multi-clause conversational sentences
    let delayMs = 1200;
    if (spokenWordCount >= targetWordCount) {
      delayMs = targetWordCount <= 5 ? 850 : 1150;
    } else if (spokenWordCount >= Math.ceil(targetWordCount * 0.6)) {
      delayMs = 1750;
    } else {
      delayMs = 2400;
    }

    const timer = setTimeout(() => {
      if (!speechEngine.isListening) return;
      lastAutoEvaluatedRef.current = liveSpokenText;
      handleRunEvaluationRef.current?.(liveSpokenText, { isAutoTriggered: true });
    }, delayMs);

    return () => clearTimeout(timer);
  }, [
    isOpen,
    isAutoMode,
    speechEngine.isListening,
    speechEngine.transcript,
    speechEngine.interimTranscript,
    liveSpokenText,
    activeTurn,
    userRole
  ]);

  // Save completion stats & bonus XP when dialogue finishes
  const sessionSummary = useMemo(() => {
    if (!isCompleted) return null;
    return summarizeConversationSession({
      scenario: currentScenario,
      userRole,
      turnResults,
      turnAttempts
    });
  }, [isCompleted, currentScenario, userRole, turnResults, turnAttempts]);

  useEffect(() => {
    if (isCompleted && sessionSummary && !completedScenarioAwardedRef.current) {
      completedScenarioAwardedRef.current = true;
      speakingSoundEffects.playCompletionChime();
      triggerHaptic('combo');

      const prevBest = convStats.bestScores?.[currentScenario.id];
      const updatedStats = {
        ...convStats,
        completedCount: (convStats.completedCount || 0) + 1,
        totalXpEarned: (convStats.totalXpEarned || 0) + (sessionSummary.bonusXp || 0),
        bestScores: {
          ...(convStats.bestScores || {}),
          [currentScenario.id]: {
            accuracy: Math.max(prevBest?.accuracy || 0, sessionSummary.avgAccuracy),
            band: sessionSummary.estimatedBand,
            updatedAt: new Date().toISOString()
          }
        }
      };
      setConvStats(updatedStats);
      safeSet(CONV_STATS_STORAGE_KEY, updatedStats);

      if (sessionSummary.bonusXp > 0) {
        awardXp(sessionSummary.bonusXp, `Completed Dialogue: ${currentScenario.titleEn}`);
      }
    }
  }, [isCompleted, sessionSummary]);

  // Toggle Microphone Recording
  const handleToggleRecording = async () => {
    if (!activeTurn || activeTurn.speaker !== userRole) return;
    setHasStartedDialogue(true);

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
          handleRunEvaluationRef.current?.(captured, { isAutoTriggered: false });
        } else {
          setShowManualFallback(true);
        }
      }, 260);
    } else {
      if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
      if (r2AudioRef.current) {
        try { r2AudioRef.current.pause(); } catch (e) {}
      }
      setEvaluationResult(null);
      setIsWaitingForRetrySpeech(false);
      lastAutoEvaluatedRef.current = '';
      liveSpokenTextRef.current = '';
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip(currentClipKey);
      }
      try {
        await speechEngine.startListening(currentClipKey);
      } catch (err) {
        setShowManualFallback(true);
      }
    }
  };

  const handleListenAndRetry = () => {
    if (!activeTurn) return;
    if (speechEngine.isListening) speechEngine.stopListening();
    setIsWaitingForRetrySpeech(false);
    speechEngine.resetTranscript();
    speechEngine.speak(
      activeTurn.text,
      { examinerId: selectedExaminerId, rate: 0.85, silentChime: true },
      async () => {
        lastAutoEvaluatedRef.current = '';
        liveSpokenTextRef.current = '';
        if (speechEngine.deleteAudioClip) {
          speechEngine.deleteAudioClip(currentClipKey);
        }
        try {
          await speechEngine.startListening(currentClipKey);
          setIsWaitingForRetrySpeech(true);
        } catch (err) {
          setShowManualFallback(true);
        }
      }
    );
  };

  const handleSkipTurn = () => {
    if (!activeTurn) return;
    if (speechEngine.isListening) speechEngine.stopListening();
    setTurnResults(prev => ({
      ...prev,
      [activeTurn.id]: {
        overallAccuracy: 0,
        estimatedBand: '5.0',
        isPassed: true,
        skipped: true,
        xpEarned: 0,
        wordBreakdown: []
      }
    }));
    advanceAfterUserPass();
  };

  const handleReplayUserClip = (turnId) => {
    const clipKey = `conv_${currentScenario.id}_${turnId}`;
    const clip = speechEngine.audioClips[clipKey];
    if (!clip?.url) return;
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();

    if (!userAudioRef.current) {
      userAudioRef.current = new Audio(clip.url);
    } else if (userAudioRef.current.src !== clip.url) {
      userAudioRef.current.src = clip.url;
    }

    userAudioRef.current.onended = () => setPlayingUserClipTurnId(null);
    userAudioRef.current.onerror = () => setPlayingUserClipTurnId(null);

    if (playingUserClipTurnId === turnId) {
      userAudioRef.current.pause();
      userAudioRef.current.currentTime = 0;
      setPlayingUserClipTurnId(null);
    } else {
      userAudioRef.current
        .play()
        .then(() => setPlayingUserClipTurnId(turnId))
        .catch(() => setPlayingUserClipTurnId(null));
    }
  };

  // Layer 2 Gemini Audio Deep Check
  const handleDeepAiAudioCheck = async () => {
    if (!activeTurn || !currentAudioClip?.blob || !apiKey || isDeepAiGrading) return;
    setIsDeepAiGrading(true);
    setDeepAiError('');
    try {
      const { evaluatePronunciationWithGeminiAudio } = await import('../services/ai/speakingAiService');
      const aiRes = await evaluatePronunciationWithGeminiAudio({
        audioBlob: currentAudioClip.blob,
        targetText: activeTurn.text,
        itemType: 'sentences',
        apiKey,
        model,
        language: isEn ? 'en' : 'vi'
      });

      const isPassed = aiRes.overallAccuracy >= passThreshold;
      setEvaluationResult(prev => ({
        ...(prev || {}),
        overallAccuracy: aiRes.overallAccuracy,
        estimatedBand: aiRes.estimatedBand,
        spokenTranscript: aiRes.heardTranscript || prev?.spokenTranscript || activeTurn.text,
        wordBreakdown:
          aiRes.wordBreakdown && aiRes.wordBreakdown.length > 0
            ? aiRes.wordBreakdown.map(w => ({
                word: w.word,
                cleanWord: w.word,
                status: w.status || (w.similarity >= 84 ? 'correct' : w.similarity >= 52 ? 'near' : 'missed'),
                similarity: Number(w.similarity) || 80
              }))
            : prev?.wordBreakdown || [],
        coachFeedbackEn: aiRes.coachFeedback,
        coachFeedbackVi: aiRes.coachFeedback,
        isPassed,
        engineTier: 'layer2_gemini_audio'
      }));
    } catch (err) {
      setDeepAiError(err.message || (isEn ? 'AI Audio evaluation failed.' : 'Không thể chấm sâu bằng AI Audio.'));
    } finally {
      setIsDeepAiGrading(false);
    }
  };

  // Full Dialogue Replay (alternating Partner R2/TTS + User RAM clip)
  const handleToggleFullReplay = () => {
    if (isFullReplaying) {
      fullReplayCancelRef.current = true;
      setIsFullReplaying(false);
      stopAllAudio();
      return;
    }

    fullReplayCancelRef.current = false;
    setIsFullReplaying(true);

    const playStep = (idx) => {
      if (fullReplayCancelRef.current || idx >= turns.length) {
        setIsFullReplaying(false);
        return;
      }
      setReplayTurnIdx(idx);
      const t = turns[idx];
      const isUser = t.speaker === userRole;

      if (isUser) {
        const clip = speechEngine.audioClips[`conv_${currentScenario.id}_${t.id}`];
        if (clip?.url) {
          const audio = new Audio(clip.url);
          audio.onended = () => setTimeout(() => playStep(idx + 1), 350);
          audio.onerror = () => setTimeout(() => playStep(idx + 1), 350);
          audio.play().catch(() => {
            speechEngine.speak(t.text, { examinerId: selectedExaminerId, rate: 1.0, silentChime: true }, () => {
              setTimeout(() => playStep(idx + 1), 350);
            });
          });
          return;
        }
      }

      playPartnerTurnAudio(t, 1.0, () => {
        setTimeout(() => playStep(idx + 1), 350);
      });
    };

    playStep(0);
  };

  // Custom Scenario Creation (Manual + Optional Gemini AI Script Generator)
  const handleGenerateAiScript = async () => {
    if (!apiKey || !aiTopicPrompt.trim() || isGeneratingAiScript) return;
    setIsGeneratingAiScript(true);
    try {
      const prompt = `Create a natural 6-turn English dialogue (alternating A: and B:) for IELTS Band ${customBand} practice on the topic: "${aiTopicPrompt.trim()}".
Return ONLY plain dialogue lines starting with "A:" and "B:", 1-2 sentences per turn, no extra commentary.`;
      const res = await callGeminiApi({
        model,
        apiKey,
        body: { contents: [{ parts: [{ text: prompt }] }] }
      });
      const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text.trim()) {
        setCustomScript(text.trim());
        if (!customTitle.trim()) {
          setCustomTitle(aiTopicPrompt.trim());
        }
      }
    } catch (err) {
      alert(err.message || (isEn ? 'Failed to generate dialogue.' : 'Không thể tạo hội thoại bằng AI.'));
    } finally {
      setIsGeneratingAiScript(false);
    }
  };

  const handleCreateCustomScenario = (e) => {
    e?.preventDefault();
    const created = buildCustomConversation({
      title: customTitle,
      track: customTrack,
      bandLevel: customBand,
      roleAName: customRoleA,
      roleBName: customRoleB,
      rawScript: customScript
    });
    if (!created.turns || created.turns.length < 2) {
      alert(isEn ? 'Please enter at least 2 dialogue lines (A: ... / B: ...).' : 'Vui lòng nhập ít nhất 2 dòng thoại (A: ... / B: ...).');
      return;
    }
    const nextList = [created, ...(Array.isArray(customScenarios) ? customScenarios : [])];
    setCustomScenarios(nextList);
    safeSet(CUSTOM_CONV_STORAGE_KEY, nextList);
    setIsCreatorOpen(false);
    setSelectedScenarioId(created.id);
    setActiveTrack('all');
  };

  const handleDeleteCustomScenario = (id, e) => {
    e?.stopPropagation();
    const nextList = (Array.isArray(customScenarios) ? customScenarios : []).filter(s => s.id !== id);
    setCustomScenarios(nextList);
    safeSet(CUSTOM_CONV_STORAGE_KEY, nextList);
    if (selectedScenarioId === id) {
      setSelectedScenarioId(CONVERSATION_SCENARIOS[0].id);
    }
  };

  const handleShareUrl = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/conversation${activeTrack !== 'all' ? `?track=${activeTrack}` : ''}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  if (!isOpen) return null;

  const combinedUserTranscript = turns
    .filter(t => t.speaker === userRole && turnResults[t.id] && !turnResults[t.id].skipped)
    .map(t => turnResults[t.id].spokenTranscript || t.text)
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-2 md:p-4 overflow-hidden animate-in fade-in duration-150">
      <div
        className={`bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isExpanded
            ? 'w-screen h-[100dvh] max-w-none rounded-none'
            : 'w-full max-w-[1480px] h-[100dvh] sm:h-[94dvh] sm:rounded-3xl'
        }`}
      >
        {/* 1. HEADER */}
        <header className="px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-slate-950 via-cyan-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h2 className="text-xs sm:text-base font-black text-white tracking-tight truncate">
                  {isEn ? 'Conversation Studio' : 'Luyện Hội Thoại'}
                </h2>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  /conversation
                </span>
                <span className={`sm:hidden px-1.5 py-0.5 rounded-md text-[10px] font-black border shrink-0 ${levelProgress.tier.badgeColor}`}>
                  Lv.{levelProgress.level}
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 truncate">
                {isEn
                  ? 'Turn-gated roleplay dialogues: pronounce accurately to unlock every next line'
                  : 'Đối thoại theo lượt có kiểm định phát âm: đọc đạt chuẩn tối thiểu mới mở khóa câu tiếp theo'}
              </p>
            </div>
          </div>

          {/* Center XP Bar */}
          <div className="hidden sm:flex items-center space-x-3 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-2xl">
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${levelProgress.tier.badgeColor}`}>
              Lv.{levelProgress.level}
            </span>
            <div className="w-24">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-0.5">
                <span className="text-amber-400 font-black">{userTotalXp.toLocaleString()} XP</span>
                <span>{levelProgress.progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${levelProgress.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center space-x-1.5 pl-1.5 border-l border-slate-800 text-[11px] font-black">
              <span className="inline-flex items-center space-x-0.5 text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                <Zap className="w-3 h-3 fill-current" />
                <span>+{sessionXp} XP</span>
              </span>
              <span className="inline-flex items-center space-x-0.5 text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                <Flame className="w-3 h-3 fill-current" />
                <span>{convStats.streak || 0}</span>
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSoundcheckOpen(true)}
              className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
              title={isEn ? 'Test Mic & Speaker' : 'Kiểm tra Micro & Loa'}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEn ? 'Mic Test' : 'Test Mic'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreatorOpen(true)}
              className="flex items-center space-x-1 px-2.5 sm:px-3 min-h-[36px] py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEn ? 'New Script' : 'Tạo Hội Thoại'}</span>
              <span className="sm:hidden">{isEn ? 'New' : 'Tạo'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareUrl}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsExpanded(prev => {
                  const next = !prev;
                  safeSet('ielts_conversation_expanded', next);
                  return next;
                });
              }}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title={isEn ? 'Toggle Fullscreen (Alt+Z)' : 'Phóng to toàn màn hình (Alt+Z)'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title={isEn ? 'Close (Esc)' : 'Đóng (Esc)'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* XP Toast & Level Up */}
        {xpToast && (
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-b border-emerald-500/40 px-4 py-1.5 flex items-center justify-center space-x-2 text-xs font-bold text-emerald-200 shrink-0">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>
              {isEn ? `+${xpToast.xp} XP Earned!` : `🎉 +${xpToast.xp} XP Điểm Kinh Nghiệm!`}
            </span>
          </div>
        )}
        {levelUpBanner && (
          <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 px-4 py-2 flex items-center justify-between text-xs font-black text-white shrink-0">
            <span>
              {isEn
                ? `🏆 LEVEL UP! Lv.${levelUpBanner.oldLevel} ➔ Lv.${levelUpBanner.newLevel}`
                : `🏆 THĂNG CẤP! Lv.${levelUpBanner.oldLevel} ➔ Lv.${levelUpBanner.newLevel}`}
            </span>
            <button type="button" onClick={() => setLevelUpBanner(null)} className="px-2 py-0.5 rounded bg-black/25 text-[10px] cursor-pointer">
              {isEn ? 'Dismiss' : 'Đóng'}
            </button>
          </div>
        )}

        {/* 2. TRACK SWITCHER, VOICE, SPEED & PASS THRESHOLD BAR */}
        <div className="px-3 sm:px-6 py-2 bg-slate-950/80 border-b border-slate-800/90 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            {CONVERSATION_TRACKS.map(track => (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveTrack(track.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  activeTrack === track.id
                    ? `bg-gradient-to-r ${track.badgeColor} text-white shadow-md`
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {isEn ? track.labelEn : track.labelVi}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Threshold Selector (Default 75%) */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5" title={isEn ? 'Minimum pronunciation pass score' : 'Ngưỡng điểm tối thiểu để qua câu'}>
              <Sliders className="w-3 h-3 text-amber-400 mx-1.5 shrink-0" />
              {CONVERSATION_THRESHOLD_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPassThreshold(opt.value);
                    safeSet('ielts_conversation_threshold', opt.value);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black cursor-pointer whitespace-nowrap ${
                    passThreshold === opt.value
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.value}%
                </button>
              ))}
            </div>

            {/* Voice Accent */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              {[
                { id: 'examiner-arthur', label: '🇬🇧 UK' },
                { id: 'examiner-oliver', label: '🇺🇸 US' }
              ].map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setSelectedExaminerId(v.id);
                    safeSet('ielts_conversation_examiner', v.id);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap ${
                    selectedExaminerId === v.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Playback Speed */}
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              {[0.8, 0.95, 1.0].map(rate => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackSpeed(rate)}
                  className={`px-1.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                    playbackSpeed === rate ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE SCENARIO SELECTOR BAR (< lg) */}
        <div className="lg:hidden px-3 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileListOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold shrink-0 cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
            <span>{isEn ? `Scenarios (${filteredScenarios.length})` : `Kịch bản (${filteredScenarios.length})`}</span>
          </button>

          <div className="min-w-0 flex-1 text-center text-[11px] font-extrabold text-white truncate">
            {isEn ? currentScenario.titleEn : currentScenario.titleVi}
          </div>

          <button
            type="button"
            onClick={() => resetDialogueState(userRole === 'B' ? 'A' : 'B')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center space-x-1 shrink-0 cursor-pointer"
            title={isEn ? 'Swap Role A/B' : 'Đổi vai A/B'}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>{userRole}</span>
          </button>
        </div>

        {/* 3. MAIN WORKSPACE */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:flex w-80 xl:w-96 bg-slate-950/60 border-r border-slate-800 flex-col shrink-0">
            <div className="p-3 border-b border-slate-800/80 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search scenarios or topics...' : 'Tìm kịch bản hoặc chủ đề...'}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
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
                        bandFilter === b.id ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
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
              {filteredScenarios.map(item => {
                const isSelected = currentScenario?.id === item.id;
                const best = convStats.bestScores?.[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectScenario(item)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-500/60 shadow-md'
                        : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/80'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                          Band {item.bandLevel}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.turns?.length || 0} {isEn ? 'turns' : 'lượt'}
                        </span>
                        {item.sourceTag && (
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                            {item.sourceTag}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-extrabold text-white truncate">
                        {isEn ? item.titleEn : item.titleVi}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {isEn ? item.contextEn : item.contextVi}
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
                          onClick={e => handleDeleteCustomScenario(item.id, e)}
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

          {/* MAIN DIALOGUE STAGE */}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-900/40">
            {/* Scenario Context & Role Control Strip */}
            <div className="px-4 sm:px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm sm:text-base font-black text-white truncate">
                    {isEn ? currentScenario.titleEn : currentScenario.titleVi}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                    {Math.min(activeTurnIndex + 1, turns.length)}/{turns.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {isEn ? currentScenario.contextEn : currentScenario.contextVi}
                </p>
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
                  onClick={() => resetDialogueState(userRole === 'B' ? 'A' : 'B')}
                  className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/35 text-[11px] font-bold cursor-pointer"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>
                    {isEn
                      ? `Role: ${currentScenario.roles[userRole]?.nameEn} (Swap)`
                      : `Vai: ${currentScenario.roles[userRole]?.nameVi} (Đổi)`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => resetDialogueState(userRole)}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                  title={isEn ? 'Restart dialogue' : 'Chơi lại từ đầu'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dialogue Progress Bar */}
            <div className="h-1 w-full bg-slate-950 shrink-0">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${turns.length > 0 ? Math.round((activeTurnIndex / turns.length) * 100) : 0}%` }}
              />
            </div>

            {/* Scrollable Chat Thread */}
            <div
              ref={turnsContainerRef}
              className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3.5 overscroll-contain"
            >
              {/* Start Dialogue Banner before first turn */}
              {!hasStartedDialogue && !isCompleted && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/50 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-slate-200">
                    <strong className="text-cyan-300">
                      {isEn ? 'Ready to start?' : 'Sẵn sàng đối thoại?'}
                    </strong>{' '}
                    {isEn
                      ? `You play "${currentScenario.roles[userRole]?.nameEn}". Score ≥${passThreshold}% on each turn to unlock the next line.`
                      : `Bạn đóng vai "${currentScenario.roles[userRole]?.nameVi}". Đạt chuẩn ≥${passThreshold}% ở mỗi lượt nói để mở khóa câu tiếp theo.`}
                  </div>
                  <button
                    type="button"
                    onClick={handleStartDialogue}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg flex items-center space-x-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isEn ? 'Start Conversation' : 'Bắt Đầu Hội Thoại'}</span>
                  </button>
                </div>
              )}

              {turns.map((turn, idx) => {
                const isUser = turn.speaker === userRole;
                const status =
                  idx < activeTurnIndex
                    ? 'past_done'
                    : idx === activeTurnIndex
                    ? 'active'
                    : 'locked';
                const isActive = status === 'active';
                const clip = speechEngine.audioClips[`conv_${currentScenario.id}_${turn.id}`];

                return (
                  <ConversationTurnCard
                    key={turn.id}
                    turn={turn}
                    turnIndex={idx}
                    totalTurns={turns.length}
                    roleMeta={currentScenario.roles[turn.speaker]}
                    isUserTurn={isUser}
                    status={status}
                    isPartnerSpeakingNow={isActive && !isUser && (speechEngine.isSpeaking || isPlayingR2Segment)}
                    hasStudioAudio={Boolean(currentScenario.audioUrl && typeof turn.audioStartSec === 'number')}
                    showIntonation={showIntonation}
                    keywordsOnly={keywordsOnly}
                    revealThisTurn={revealCurrentTurn}
                    onToggleRevealThisTurn={() => setRevealCurrentTurn(prev => !prev)}
                    onPlayPartnerLine={(t, rate) => playPartnerTurnAudio(t, rate)}
                    onPlayUserModel={(t, rate) =>
                      speechEngine.speak(t.text, { examinerId: selectedExaminerId, rate, silentChime: true })
                    }
                    isListening={isActive && speechEngine.isListening}
                    isAutoMode={isAutoMode}
                    liveSpokenText={isActive ? liveSpokenText : ''}
                    isWaitingForRetrySpeech={isActive && isWaitingForRetrySpeech}
                    speechError={isActive ? speechEngine.speechError : null}
                    analyserNode={speechEngine.analyserNode}
                    evaluationResult={isActive ? evaluationResult : turnResults[turn.id]}
                    attemptCount={turnAttempts[turn.id] || 0}
                    passThreshold={passThreshold}
                    currentAudioClip={clip}
                    isPlayingUserClip={playingUserClipTurnId === turn.id}
                    onToggleRecording={handleToggleRecording}
                    onReplayUserClip={handleReplayUserClip}
                    onListenAndRetry={handleListenAndRetry}
                    onSkipTurn={handleSkipTurn}
                    onAdvanceAfterPass={advanceAfterUserPass}
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
                );
              })}

              {isCompleted && sessionSummary && (
                <ConversationSummaryCard
                  scenario={currentScenario}
                  summary={sessionSummary}
                  combinedUserTranscript={combinedUserTranscript}
                  totalSpeakingDurationSec={totalSpeakingSec}
                  isFullReplaying={isFullReplaying}
                  replayTurnIdx={replayTurnIdx}
                  onToggleFullReplay={handleToggleFullReplay}
                  onRestart={() => resetDialogueState(userRole)}
                  onSwapRolesAndRestart={() => resetDialogueState(userRole === 'B' ? 'A' : 'B')}
                  onPlayWord={(word) =>
                    speechEngine.speak(word, { examinerId: selectedExaminerId, rate: 0.85, silentChime: true })
                  }
                  onSaveWordToNotebook={
                    onSaveToNotebook
                      ? (w) =>
                          onSaveToNotebook({
                            id: `vocab-conv-${w.cleanWord}`,
                            word: w.word,
                            meaning: isEn ? 'From Conversation Studio' : 'Từ luyện tập Hội Thoại',
                            example: currentScenario.titleEn,
                            band: `Band ${currentScenario.bandLevel || '7.0'}`,
                            topic: isEn ? currentScenario.titleEn : currentScenario.titleVi
                          })
                      : null
                  }
                  onSaveWordToMistakes={
                    onSaveMistake
                      ? (w) =>
                          onSaveMistake({
                            id: `mistake-conv-${w.cleanWord}-${Date.now()}`,
                            type: 'Pronunciation',
                            word: w.word,
                            original: w.word,
                            correction: `Accuracy ${w.similarity}% in "${currentScenario.titleEn}"`,
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
              )}
              <div className="h-3 lg:hidden" />
            </div>
          </main>
        </div>

        {/* MOBILE STICKY BOTTOM THUMB-ZONE BAR (< lg) */}
        {activeTurn && !isCompleted && (
          <div className="lg:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2 z-30">
            <button
              type="button"
              onClick={() =>
                isActiveUserTurn
                  ? speechEngine.speak(activeTurn.text, { examinerId: selectedExaminerId, rate: 0.85, silentChime: true })
                  : playPartnerTurnAudio(activeTurn, playbackSpeed)
              }
              className="min-h-[46px] px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isEn ? 'Model' : 'Nghe mẫu'}</span>
            </button>

            {isActiveUserTurn ? (
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`flex-1 min-h-[46px] px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg cursor-pointer ${
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
                    ? isAutoMode
                      ? isEn ? 'Auto-Listening...' : 'Đang nghe...'
                      : isEn ? 'Stop & Score' : 'Dừng & Chấm'
                    : isEn
                    ? 'Tap to Speak'
                    : 'Bấm để Nói'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartDialogue}
                className="flex-1 min-h-[46px] px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs sm:text-sm font-black flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isEn ? 'Play Partner Line' : 'Phát Lượt Máy'}</span>
              </button>
            )}
          </div>
        )}

        {/* MOBILE SCENARIO LIST BOTTOM SHEET (< lg) */}
        {isMobileListOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end justify-center"
            onClick={() => setIsMobileListOpen(false)}
          >
            <div
              className="w-full bg-slate-900 border-t border-slate-700 rounded-t-3xl h-[80dvh] flex flex-col overflow-hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-black text-white">
                  {isEn ? `Select Scenario (${filteredScenarios.length})` : `Chọn Kịch Bản (${filteredScenarios.length})`}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileListOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredScenarios.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectScenario(item)}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer ${
                      currentScenario?.id === item.id
                        ? 'bg-cyan-950/70 border-cyan-500/60'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-black text-cyan-300">
                        Band {item.bandLevel} • {item.turns?.length || 0} {isEn ? 'turns' : 'lượt'}
                      </div>
                      <div className="text-xs font-extrabold text-white truncate">
                        {isEn ? item.titleEn : item.titleVi}
                      </div>
                    </div>
                    {convStats.bestScores?.[item.id] ? (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                        {convStats.bestScores[item.id].accuracy}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 text-amber-400">
                        +{item.xpReward} XP
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM CONVERSATION CREATOR MODAL */}
        {isCreatorOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <form
              onSubmit={handleCreateCustomScenario}
              className="bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[92dvh] overflow-y-auto p-5 sm:p-6 space-y-4 text-slate-100 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white">
                  {isEn ? 'Create Custom Conversation' : 'Tạo Kịch Bản Hội Thoại Mới'}
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
                    <span>{isEn ? 'Optional: Generate Script with Gemini AI' : 'Tùy chọn: Tạo nhanh kịch bản bằng Gemini AI'}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiTopicPrompt}
                      onChange={e => setAiTopicPrompt(e.target.value)}
                      placeholder={isEn ? 'e.g. Returning a defective laptop at a store' : 'VD: Đổi trả laptop bị lỗi tại cửa hàng'}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateAiScript}
                      disabled={isGeneratingAiScript}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingAiScript ? (isEn ? 'Generating...' : 'Đang tạo...') : (isEn ? 'AI Write' : 'AI Viết')}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder={isEn ? 'Scenario title...' : 'Tiêu đề hội thoại...'}
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  required
                />
                <select
                  value={customTrack}
                  onChange={e => setCustomTrack(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="daily">{isEn ? 'Daily & Travel' : 'Đời Sống'}</option>
                  <option value="ielts">IELTS Speaking</option>
                  <option value="academic">{isEn ? 'Workplace & Academic' : 'Học Thuật'}</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <input
                  type="text"
                  value={customRoleA}
                  onChange={e => setCustomRoleA(e.target.value)}
                  placeholder="Role A"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  value={customRoleB}
                  onChange={e => setCustomRoleB(e.target.value)}
                  placeholder="Role B"
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <select
                  value={customBand}
                  onChange={e => setCustomBand(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="6.0">Band 6.0</option>
                  <option value="7.0">Band 7.0</option>
                  <option value="8.0">Band 8.0</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  {isEn ? 'Dialogue Lines (prefix with A: and B:)' : 'Nội dung thoại (mỗi dòng bắt đầu bằng A: hoặc B:)'}
                </label>
                <textarea
                  rows={6}
                  value={customScript}
                  onChange={e => setCustomScript(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-black cursor-pointer"
                >
                  {isEn ? 'Save & Practice' : 'Lưu & Thực Hành'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SOUNDCHECK MODAL */}
        {isSoundcheckOpen && (
          <SpeakingSoundcheckModal
            isOpen={isSoundcheckOpen}
            onClose={() => setIsSoundcheckOpen(false)}
            onPassedSoundcheck={() => setIsSoundcheckOpen(false)}
            examiner={{ id: selectedExaminerId, name: 'Atlas Audio Check' }}
            speechEngine={speechEngine}
          />
        )}
      </div>
    </div>
  );
}
