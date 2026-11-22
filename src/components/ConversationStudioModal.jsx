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
  Eye,
  Lock,
  SkipForward,
  PanelLeftClose,
  PanelLeftOpen,
  Shuffle
} from 'lucide-react';
import {
  CONVERSATION_DEFAULT_THRESHOLD,
  CONVERSATION_THRESHOLD_OPTIONS,
  CONVERSATION_TRACKS,
  CONVERSATION_SCENARIOS,
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
import { getWallet } from '../services/gamification/atlasWalletService';
import * as eventBus from '../services/gamification/eventBus';
import {
  buildTrackBatches,
  purchaseBatchUnlock
} from '../services/gamification/batchProgressionService';
import BatchSelectorStrip, { GoldWalletHeaderBadge } from './common/BatchSelectorStrip';
import BatchUnlockGateCard from './common/BatchUnlockGateCard';
import { getUnifiedStreakCount } from '../services/gamification/leagueEngine';
import { speakingSoundEffects } from '../utils/speakingSoundEffects';
import { triggerHaptic } from '../utils/hapticHelper';
import ConversationTurnCard from './conversation/ConversationTurnCard';
import ConversationSummaryCard from './conversation/ConversationSummaryCard';
import SpeechShadowingWorkspace from './conversation/SpeechShadowingWorkspace';
import ConversationCustomCreatorModal from './conversation/ConversationCustomCreatorModal';
import SpeakingSoundcheckModal from './speaking/SpeakingSoundcheckModal';
import {
  runLayer2PronunciationCheck,
  NOOP,
  SPEAKING_SPEED_MODES,
  DEFAULT_SPEAKING_SPEED
} from '../utils/speakingPracticeHelpers';

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
  onOpenAuth,
  onOpenArena,
  initialOptions = null
}) {
  const { isEn } = useTranslation();

  // 0. Studio Mode Tab ('roleplay' | 'shadowing')
  const [studioTab, setStudioTab] = useState(() => {
    if (initialOptions?.tab === 'shadowing') return 'shadowing';
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      if (
        search.get('tab') === 'shadowing' ||
        search.get('mode') === 'shadowing' ||
        pathname.endsWith('/shadowing') ||
        pathname.endsWith('/speech-shadowing') ||
        hash === '#shadowing' ||
        hash === '#speech-shadowing'
      ) {
        return 'shadowing';
      }
    }
    return 'roleplay';
  });
  const [shadowingCreatorTrigger, setShadowingCreatorTrigger] = useState(0);

  useEffect(() => {
    if (initialOptions?.tab === 'shadowing' || initialOptions?.tab === 'roleplay') {
      setStudioTab(initialOptions.tab);
    }
  }, [initialOptions?.tab]);

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
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    const saved = Number(safeGet('ielts_conversation_speed', DEFAULT_SPEAKING_SPEED));
    return SPEAKING_SPEED_MODES.some(m => m.rate === saved) ? saved : DEFAULT_SPEAKING_SPEED;
  });
  useEffect(() => {
    safeSet('ielts_conversation_speed', playbackSpeed);
  }, [playbackSpeed]);
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
  const [sourceFilter, setSourceFilter] = useState('all');
  const [hideCompleted, setHideCompleted] = useState(() =>
    Boolean(safeGet('ielts_conversation_hide_completed', true))
  );
  const toggleHideCompleted = () => {
    setHideCompleted(prev => {
      const next = !prev;
      safeSet('ielts_conversation_hide_completed', next);
      return next;
    });
  };
  const [selectedScenarioId, setSelectedScenarioId] = useState(() => {
    if (initialOptions?.scenario) return initialOptions.scenario;
    const savedStats = safeGet(CONV_STATS_STORAGE_KEY, { bestScores: {} });
    const firstUnfinished = CONVERSATION_SCENARIOS.find(s => !savedStats?.bestScores?.[s.id]);
    return (firstUnfinished || CONVERSATION_SCENARIOS[0]).id;
  });
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isDesktopSettingsOpen, setIsDesktopSettingsOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
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

  // 4. Speech & Studio Audio Engines (rawPhoneticMode preserves true spoken errors without ESL auto-correct)
  const speechEngine = useSpeechEngine({ examinerId: selectedExaminerId, rawPhoneticMode: true });
  const r2AudioRef = useRef(null);
  const r2SegmentTimerRef = useRef(null);
  const userAudioRef = useRef(null);
  const compareTimerRef = useRef(null);
  const [isPlayingR2Segment, setIsPlayingR2Segment] = useState(false);
  const [playingUserClipTurnId, setPlayingUserClipTurnId] = useState(null);
  const [comparingTurnId, setComparingTurnId] = useState(null);

  // Wallet & Progressive Batch State for Roleplay Conversations
  const [walletSnapshot, setWalletSnapshot] = useState(() => getWallet());
  const [selectedRoleplayBatch, setSelectedRoleplayBatch] = useState(() =>
    safeGet('ielts_conv_roleplay_batch_v1', 1)
  );

  const handleSelectRoleplayBatch = useCallback((nextB) => {
    if (speechEngine.isListening) speechEngine.stopListening();
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    setSelectedRoleplayBatch(nextB);
    safeSet('ielts_conv_roleplay_batch_v1', nextB);
  }, [speechEngine.isListening, speechEngine.stopListening, speechEngine.isSpeaking, speechEngine.stopSpeaking]);

  useEffect(() => {
    setWalletSnapshot(getWallet());
    const onWalletUpdate = (updated) => {
      setWalletSnapshot(updated || getWallet());
    };
    const onCloudBatchSync = (payload) => {
      if (payload?.convBestScores) {
        setConvStats(prev => ({
          ...prev,
          bestScores: payload.convBestScores,
          completedCount: Object.keys(payload.convBestScores).length
        }));
      }
    };
    const unsub = eventBus.on('wallet_updated', onWalletUpdate);
    const unsubCloud = eventBus.on('cloud_batch_progress_synced', onCloudBatchSync);
    return () => {
      if (typeof unsub === 'function') unsub();
      if (typeof unsubCloud === 'function') unsubCloud();
    };
  }, [isOpen]);

  const handleOpenArenaSafe = useCallback(() => {
    if (speechEngine.isListening) speechEngine.stopListening();
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    onOpenArena?.();
  }, [speechEngine.isListening, speechEngine.stopListening, speechEngine.isSpeaking, speechEngine.stopSpeaking, onOpenArena]);

  // Deterministic canonical list: static scenarios first, then dynamic scenarios (prevents Batch 1 flicker)
  const canonicalRoleplayScenarios = useMemo(() => {
    return [...CONVERSATION_SCENARIOS, ...dynamicScenarios];
  }, [dynamicScenarios]);

  const personalRoleplayScenarios = useMemo(() => {
    return Array.isArray(customScenarios) ? customScenarios : [];
  }, [customScenarios]);

  const roleplayBatches = useMemo(() => {
    const completedSet = new Set(Object.keys(convStats.bestScores || {}));
    return buildTrackBatches({
      items: canonicalRoleplayScenarios,
      trackKey: 'conv_roleplay',
      completedIdSet: completedSet,
      wallet: walletSnapshot,
      currentUser
    });
  }, [canonicalRoleplayScenarios, convStats.bestScores, walletSnapshot, currentUser]);

  const activeRoleplayBatchObj = useMemo(() => {
    if (selectedRoleplayBatch === 'personal') return null;
    return roleplayBatches.find(b => b.batchIndex === selectedRoleplayBatch) || roleplayBatches[0] || null;
  }, [selectedRoleplayBatch, roleplayBatches]);

  const nextLockedRoleplayBatch = useMemo(() => {
    if (!activeRoleplayBatchObj || !activeRoleplayBatchObj.isUnlocked) return null;
    return roleplayBatches.find(b => b.batchIndex === activeRoleplayBatchObj.batchIndex + 1 && !b.isUnlocked) || null;
  }, [activeRoleplayBatchObj, roleplayBatches]);

  const handlePurchaseRoleplayBatch = useCallback((batch) => {
    if (!batch) return;
    const res = purchaseBatchUnlock({
      batchId: batch.batchId,
      batchLabel: `Conversation Roleplay Batch ${batch.batchIndex}`,
      costGold: batch.costGold,
      currentUser
    });
    if (res.success) {
      setWalletSnapshot(getWallet());
      speakingSoundEffects.playCompletionChime();
      triggerHaptic('combo');
      handleSelectRoleplayBatch(batch.batchIndex);
      if (batch.items[0]) {
        setSelectedScenarioId(batch.items[0].id);
      }
    }
  }, [currentUser, handleSelectRoleplayBatch]);

  const allScenarios = useMemo(() => {
    if (selectedRoleplayBatch === 'personal') return personalRoleplayScenarios;
    if (activeRoleplayBatchObj && !activeRoleplayBatchObj.isUnlocked) return [];
    return activeRoleplayBatchObj ? activeRoleplayBatchObj.items : canonicalRoleplayScenarios;
  }, [selectedRoleplayBatch, personalRoleplayScenarios, activeRoleplayBatchObj, canonicalRoleplayScenarios]);

  const availableSources = useMemo(() => {
    const set = new Set();
    allScenarios.forEach((s) => {
      if (s.isCustom) set.add('Custom');
      else if (s.sourceTag) set.add(s.sourceTag);
      else set.add('Core');
    });
    return ['all', ...Array.from(set)];
  }, [allScenarios]);

  const filteredScenarios = useMemo(() => {
    let list = allScenarios;
    if (activeTrack !== 'all') {
      list = list.filter(s => s.track === activeTrack);
    }
    if (sourceFilter !== 'all') {
      list = list.filter(s => {
        const tag = s.isCustom ? 'Custom' : (s.sourceTag || 'Core');
        return tag === sourceFilter;
      });
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
  }, [allScenarios, activeTrack, sourceFilter, bandFilter, hideCompleted, convStats.bestScores, selectedScenarioId, searchQuery]);

  const handlePickRandomScenario = useCallback(() => {
    if (filteredScenarios.length === 0) return;
    const pool = filteredScenarios.length > 1
      ? filteredScenarios.filter(s => s.id !== selectedScenarioId)
      : filteredScenarios;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) {
      setSelectedScenarioId(pick.id);
      setIsMobileListOpen(false);
    }
  }, [filteredScenarios, selectedScenarioId]);

  const currentScenario = useMemo(() => {
    return (
      allScenarios.find(s => s.id === selectedScenarioId) ||
      filteredScenarios[0] ||
      CONVERSATION_SCENARIOS[0]
    );
  }, [allScenarios, selectedScenarioId, filteredScenarios]);

  const handleNextScenario = useCallback(() => {
    const curId = currentScenario?.id;
    const isUnfinished = (s) => !convStats.bestScores?.[s.id];
    const curIdx = filteredScenarios.findIndex(s => s.id === curId);

    let next = filteredScenarios.slice(curIdx + 1).find(s => s.id !== curId && isUnfinished(s));
    if (!next) {
      next = filteredScenarios.find(s => s.id !== curId && isUnfinished(s));
    }
    if (!next) {
      next = allScenarios.find(s => s.id !== curId && isUnfinished(s));
    }
    if (!next && filteredScenarios.length > 1) {
      next = filteredScenarios[(curIdx + 1 + filteredScenarios.length) % filteredScenarios.length];
    }

    if (next) {
      setSelectedScenarioId(next.id);
      setIsMobileListOpen(false);
    }
  }, [currentScenario?.id, filteredScenarios, allScenarios, convStats.bestScores]);

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

  // Custom Creator Modal State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Refs for async timers & auto-evaluation
  const turnsContainerRef = useRef(null);
  const activeTurnRef = useRef(null);
  const summaryRef = useRef(null);
  const liveSpokenTextRef = useRef('');
  const lastAutoEvaluatedRef = useRef('');
  const handleRunEvaluationRef = useRef(null);
  const advanceTimerRef = useRef(null);
  const micAutoStartTimerRef = useRef(null);
  const fullReplayTimerRef = useRef(null);
  const completedScenarioAwardedRef = useRef(false);
  const dialogueSessionTokenRef = useRef(0);
  const lastAutoHandledTurnKeyRef = useRef('');

  const turns = currentScenario?.turns || [];
  const isCompleted = turns.length > 0 && activeTurnIndex >= turns.length;
  const activeTurn = !isCompleted ? turns[activeTurnIndex] : null;
  const isActiveUserTurn = Boolean(activeTurn && activeTurn.speaker === userRole);
  const currentClipKey = activeTurn ? `conv_${currentScenario.id}_${activeTurn.id}` : 'conv_default';
  const currentAudioClip = speechEngine.audioClips[currentClipKey];

  const ua = typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '';
  const isMobileDevice =
    /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ||
    (/Macintosh/i.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1);

  // Stop all audio helper
  const stopAllAudio = useCallback(() => {
    dialogueSessionTokenRef.current += 1;
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (micAutoStartTimerRef.current) {
      clearTimeout(micAutoStartTimerRef.current);
      micAutoStartTimerRef.current = null;
    }
    if (fullReplayTimerRef.current) {
      clearTimeout(fullReplayTimerRef.current);
      fullReplayTimerRef.current = null;
    }
    if (r2SegmentTimerRef.current) {
      clearTimeout(r2SegmentTimerRef.current);
      r2SegmentTimerRef.current = null;
    }
    if (compareTimerRef.current) {
      clearTimeout(compareTimerRef.current);
      compareTimerRef.current = null;
    }
    setComparingTurnId(null);
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
    speechEngine.stopSpeaking();
    speechEngine.stopListening();
    fullReplayCancelRef.current = true;
    setIsFullReplaying(false);
  }, [speechEngine.stopSpeaking, speechEngine.stopListening]);

  // Reset state when switching scenario or role
  const resetDialogueState = useCallback(
    (nextRole = null, clearSavedProgress = true) => {
      stopAllAudio();
      lastAutoHandledTurnKeyRef.current = '';
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
    [stopAllAudio, currentScenario?.defaultUserRole, speechEngine.resetTranscript]
  );

  // Switch scenario
  const handleSelectScenario = (scenario) => {
    if (!scenario) return;
    setSelectedScenarioId(scenario.id);
    setIsMobileListOpen(false);
  };

  // Restore saved in-progress session from sessionStorage if matching currentScenario
  useEffect(() => {
    if (!isOpen || studioTab !== 'roleplay') {
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
            lastAutoHandledTurnKeyRef.current = '';
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
  }, [currentScenario?.id, isOpen, studioTab]);

  // Persist in-progress turn state to sessionStorage for Auto-Resume
  useEffect(() => {
    if (!isOpen || studioTab !== 'roleplay' || !currentScenario?.id || typeof window === 'undefined') return;
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

  // Scroll smoothly so the active turn (or completion summary) stays front-and-center inside the thread container
  useEffect(() => {
    if (!isOpen || studioTab !== 'roleplay') return;
    const rafId = requestAnimationFrame(() => {
      const container = turnsContainerRef.current;
      const targetEl = isCompleted ? summaryRef.current : activeTurnRef.current;
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
    studioTab,
    activeTurnIndex,
    isCompleted,
    evaluationResult,
    hasStartedDialogue,
    speechEngine.isListening
  ]);

  // Hybrid Audio Player for Partner Turns (uses real R2 studio segment when available, falls back to TTS)
  const playPartnerTurnAudio = useCallback(
    (turn, rateOverride = null, onEnd = null) => {
      if (!turn) {
        if (onEnd) onEnd();
        return;
      }
      speechEngine.stopListening();
      speechEngine.stopSpeaking();
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
    [
      currentScenario?.audioUrl,
      playbackSpeed,
      selectedExaminerId,
      speechEngine.stopListening,
      speechEngine.stopSpeaking,
      speechEngine.speak
    ]
  );

  // Triggered when entering a Partner turn during an active dialogue
  const runPartnerTurnSequence = useCallback(
    (turn) => {
      if (!turn) return;
      const token = ++dialogueSessionTokenRef.current;
      playPartnerTurnAudio(turn, playbackSpeed, () => {
        if (token !== dialogueSessionTokenRef.current) return;
        speakingSoundEffects.playReadyToSpeakChime();
        setActiveTurnIndex((prev) => prev + 1);
      });
    },
    [playPartnerTurnAudio, playbackSpeed]
  );

  // Auto-open mic on Desktop when transitioning into a User turn during active dialogue
  useEffect(() => {
    if (!isOpen || studioTab !== 'roleplay' || !hasStartedDialogue || isCompleted || !activeTurn) return;
    const turnKey = `${currentScenario?.id || ''}:${userRole}:${activeTurnIndex}`;
    if (lastAutoHandledTurnKeyRef.current === turnKey) return;
    lastAutoHandledTurnKeyRef.current = turnKey;

    if (activeTurn.speaker !== userRole) {
      // Partner turn -> speak automatically
      const token = ++dialogueSessionTokenRef.current;
      const timer = setTimeout(() => {
        if (token !== dialogueSessionTokenRef.current) return;
        runPartnerTurnSequence(activeTurn);
      }, 240);
      return () => clearTimeout(timer);
    } else if (isAutoMode && !isMobileDevice) {
      // User turn on Desktop Auto-Mode -> open mic automatically after chime finishes
      const clipKey = `conv_${currentScenario.id}_${activeTurn.id}`;
      const token = dialogueSessionTokenRef.current;
      micAutoStartTimerRef.current = setTimeout(() => {
        if (token !== dialogueSessionTokenRef.current) return;
        setEvaluationResult(null);
        setIsWaitingForRetrySpeech(true);
        lastAutoEvaluatedRef.current = '';
        liveSpokenTextRef.current = '';
        speechEngine.resetTranscript();
        speechEngine.startListening(clipKey).catch(() => {
          setShowManualFallback(true);
        });
      }, 500);
      return () => {
        if (micAutoStartTimerRef.current) {
          clearTimeout(micAutoStartTimerRef.current);
          micAutoStartTimerRef.current = null;
        }
      };
    }
  }, [
    activeTurnIndex,
    hasStartedDialogue,
    isOpen,
    isCompleted,
    studioTab,
    currentScenario?.id,
    userRole,
    activeTurn,
    isAutoMode,
    isMobileDevice,
    runPartnerTurnSequence,
    speechEngine.resetTranscript,
    speechEngine.startListening
  ]);

  // Start / Resume Dialogue button handler
  const handleStartDialogue = () => {
    if (!activeTurn) return;
    const turnKey = `${currentScenario?.id || ''}:${userRole}:${activeTurnIndex}`;
    lastAutoHandledTurnKeyRef.current = turnKey;
    setHasStartedDialogue(true);
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
      studioTab !== 'roleplay' ||
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
    if (targetWordCount >= 10 && spokenWordCount <= 1) {
      delayMs = 4500;
    } else if (spokenWordCount >= targetWordCount) {
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
      eventBus.emit('batch_progress_updated');

      if (sessionSummary.bonusXp > 0) {
        awardXp(sessionSummary.bonusXp, `Completed Dialogue: ${currentScenario.titleEn}`);
      }
    }
  }, [isCompleted, sessionSummary]);

  // Toggle Microphone Recording
  const handleToggleRecording = () => {
    if (!activeTurn || activeTurn.speaker !== userRole) return;
    const turnKey = `${currentScenario?.id || ''}:${userRole}:${activeTurnIndex}`;
    lastAutoHandledTurnKeyRef.current = turnKey;
    dialogueSessionTokenRef.current += 1;
    if (micAutoStartTimerRef.current) {
      clearTimeout(micAutoStartTimerRef.current);
      micAutoStartTimerRef.current = null;
    }
    setHasStartedDialogue(true);

    if (speechEngine.isListening) {
      const stopToken = dialogueSessionTokenRef.current;
      const capturedBeforeStop = liveSpokenTextRef.current;
      speechEngine.stopListening();
      setIsWaitingForRetrySpeech(false);
      setTimeout(() => {
        if (stopToken !== dialogueSessionTokenRef.current) return;
        const captured =
          speechEngine.getLatestTranscript?.() ||
          liveSpokenTextRef.current ||
          capturedBeforeStop ||
          '';
        if (captured.trim()) {
          handleRunEvaluationRef.current?.(captured, { isAutoTriggered: false });
        } else {
          setShowManualFallback(true);
        }
      }, 260);
    } else {
      speechEngine.stopSpeaking();
      if (r2AudioRef.current) {
        try { r2AudioRef.current.pause(); } catch (e) {}
      }
      if (userAudioRef.current) {
        try {
          userAudioRef.current.pause();
          userAudioRef.current.currentTime = 0;
        } catch (e) {}
      }
      setPlayingUserClipTurnId(null);
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
    if (!activeTurn) return;
    if (micAutoStartTimerRef.current) {
      clearTimeout(micAutoStartTimerRef.current);
      micAutoStartTimerRef.current = null;
    }
    const turnKey = `${currentScenario?.id || ''}:${userRole}:${activeTurnIndex}`;
    lastAutoHandledTurnKeyRef.current = turnKey;
    setHasStartedDialogue(true);
    speechEngine.stopListening();
    speechEngine.stopSpeaking();
    const token = ++dialogueSessionTokenRef.current;
    setIsWaitingForRetrySpeech(false);
    speechEngine.resetTranscript();
    speechEngine.speak(
      activeTurn.text,
      { examinerId: selectedExaminerId, rate: Math.min(playbackSpeed, 0.8), silentChime: true },
      () => {
        if (token !== dialogueSessionTokenRef.current) return;
        speakingSoundEffects.playReadyToSpeakChime();
        lastAutoEvaluatedRef.current = '';
        liveSpokenTextRef.current = '';
        if (speechEngine.deleteAudioClip) {
          speechEngine.deleteAudioClip(currentClipKey);
        }
        setIsWaitingForRetrySpeech(true);
        if (!isMobileDevice) {
          micAutoStartTimerRef.current = setTimeout(() => {
            if (token !== dialogueSessionTokenRef.current) return;
            speechEngine.startListening(currentClipKey).catch(() => {
              setShowManualFallback(true);
            });
          }, 420);
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

  const handleReplayUserClip = useCallback((turnId) => {
    const clipKey = `conv_${currentScenario.id}_${turnId}`;
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
  }, [currentScenario?.id, playingUserClipTurnId, speechEngine.audioClips, speechEngine.stopListening, speechEngine.stopSpeaking]);

  const handlePlayPartnerLine = useCallback((t, rate) => {
    playPartnerTurnAudio(t, rate);
  }, [playPartnerTurnAudio]);

  const handlePlayUserModel = useCallback((t, rate) => {
    speechEngine.stopListening();
    speechEngine.speak(t.text, { examinerId: selectedExaminerId, rate: rate || playbackSpeed, silentChime: true });
  }, [playbackSpeed, selectedExaminerId, speechEngine.stopListening, speechEngine.speak]);

  const handleToggleRevealCurrentTurn = useCallback(() => {
    setRevealCurrentTurn(prev => !prev);
  }, []);

  const handleToggleManualFallback = useCallback(() => {
    setShowManualFallback(prev => !prev);
  }, []);

  const handleRunManualEvaluation = useCallback((txt) => {
    handleRunEvaluationRef.current?.(txt);
  }, []);

  const handleCompareTurnAudio = useCallback((turn) => {
    if (!turn) return;
    const clipKey = `conv_${currentScenario.id}_${turn.id}`;
    const clip = speechEngine.audioClips[clipKey];
    if (!clip?.url) return;

    if (comparingTurnId === turn.id) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    const token = dialogueSessionTokenRef.current;
    setComparingTurnId(turn.id);
    speechEngine.speak(
      turn.text,
      { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true },
      () => {
        if (token !== dialogueSessionTokenRef.current) return;
        compareTimerRef.current = setTimeout(() => {
          compareTimerRef.current = null;
          if (token !== dialogueSessionTokenRef.current) return;
          const audio = new Audio(clip.url);
          userAudioRef.current = audio;
          audio.onended = () => {
            setPlayingUserClipTurnId(null);
            setComparingTurnId(null);
          };
          audio.onerror = () => {
            setPlayingUserClipTurnId(null);
            setComparingTurnId(null);
          };
          audio.play()
            .then(() => setPlayingUserClipTurnId(turn.id))
            .catch(() => setComparingTurnId(null));
        }, 280);
      }
    );
  }, [comparingTurnId, currentScenario?.id, playbackSpeed, selectedExaminerId, speechEngine, stopAllAudio]);

  // Layer 2 Gemini Audio Deep Check (via shared helper)
  const handleDeepAiAudioCheck = async () => {
    if (!activeTurn || !currentAudioClip?.blob || !apiKey || isDeepAiGrading) return;
    setIsDeepAiGrading(true);
    setDeepAiError('');
    try {
      const updatedEval = await runLayer2PronunciationCheck({
        audioBlob: currentAudioClip.blob,
        targetText: activeTurn.text,
        itemType: 'sentences',
        apiKey,
        model,
        isEn,
        passThreshold,
        prevEval: evaluationResult,
        xpHigh: 35,
        xpNormal: 25
      });
      setEvaluationResult(updatedEval);
      if (updatedEval.isPassed) {
        const alreadyPassed = Boolean(turnResults[activeTurn.id]?.isPassed);
        speechEngine.stopListening();
        speakingSoundEffects.playCompletionChime();
        triggerHaptic('combo');
        setTurnResults(prev => ({ ...prev, [activeTurn.id]: updatedEval }));
        if (!alreadyPassed && updatedEval.xpEarned > 0) {
          awardXp(updatedEval.xpEarned, `Conversation AI Deep Check: ${currentScenario.titleEn}`);
        }
      }
    } catch (err) {
      setDeepAiError(err.message || (isEn ? 'AI Audio evaluation failed.' : 'Không thể chấm sâu bằng AI Audio.'));
    } finally {
      setIsDeepAiGrading(false);
    }
  };

  // Full Dialogue Replay (alternating Partner R2/TTS + User RAM clip, properly tracked against Stop/Close leaks)
  const handleToggleFullReplay = () => {
    if (isFullReplaying) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    fullReplayCancelRef.current = false;
    setIsFullReplaying(true);

    const scheduleNext = (nextIdx) => {
      if (fullReplayTimerRef.current) clearTimeout(fullReplayTimerRef.current);
      fullReplayTimerRef.current = setTimeout(() => {
        if (!fullReplayCancelRef.current) {
          playStep(nextIdx);
        }
      }, 350);
    };

    const playStep = (idx) => {
      if (fullReplayCancelRef.current || idx >= turns.length) {
        setIsFullReplaying(false);
        return;
      }
      setReplayTurnIdx(idx);
      const t = turns[idx];
      const isUser = t.speaker === userRole;

      if (userAudioRef.current) {
        try {
          userAudioRef.current.pause();
          userAudioRef.current.currentTime = 0;
        } catch (e) {}
      }

      if (isUser) {
        const clip = speechEngine.audioClips[`conv_${currentScenario.id}_${t.id}`];
        if (clip?.url) {
          const audio = new Audio(clip.url);
          userAudioRef.current = audio;
          audio.onended = () => scheduleNext(idx + 1);
          audio.onerror = () => scheduleNext(idx + 1);
          audio.play().catch(() => {
            if (fullReplayCancelRef.current) return;
            speechEngine.speak(t.text, { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true }, () => {
              scheduleNext(idx + 1);
            });
          });
          return;
        }
      }

      playPartnerTurnAudio(t, playbackSpeed, () => {
        scheduleNext(idx + 1);
      });
    };

    playStep(0);
  };

  // Save custom scenario returned by ConversationCustomCreatorModal
  const handleCreatedCustomScenario = (created) => {
    if (!created) return;
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

  const handleSwitchStudioTab = (nextTab) => {
    if (nextTab === studioTab) return;
    stopAllAudio();
    speechEngine.resetTranscript();
    setStudioTab(nextTab);
    try {
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname.toLowerCase();
        if (pathname.includes('/conversation') || pathname.includes('/luyen-hoi-thoai') || pathname.includes('/shadowing')) {
          const url = new URL(window.location.href);
          if (nextTab === 'shadowing') {
            url.searchParams.set('tab', 'shadowing');
          } else {
            url.searchParams.delete('tab');
          }
          window.history.replaceState(window.history.state, '', '/conversation' + url.search);
        }
      }
    } catch (e) {}
  };

  const handleShareUrl = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (studioTab === 'shadowing') params.set('tab', 'shadowing');
    else if (activeTrack !== 'all') params.set('track', activeTrack);
    const qs = params.toString();
    const shareUrl = `${window.location.origin}/conversation${qs ? `?${qs}` : ''}`;
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

  // Shared Scenario Filter & List renderer for Desktop Sidebar & Mobile Bottom Sheet (DRY)
  const renderScenarioListContent = (isMobileSheet = false) => (
    <>
      <div className={`${isMobileSheet ? 'p-3' : 'p-2.5'} border-b border-slate-800/80 space-y-2 shrink-0`}>
        {roleplayBatches.length > 0 && (
          <BatchSelectorStrip
            batches={roleplayBatches}
            selectedBatchIndex={selectedRoleplayBatch}
            onSelectBatch={(nextB) => {
              handleSelectRoleplayBatch(nextB);
              if (nextB === 'personal' && personalRoleplayScenarios[0]) {
                setSelectedScenarioId(personalRoleplayScenarios[0].id);
              } else if (typeof nextB === 'number') {
                const found = roleplayBatches.find(b => b.batchIndex === nextB);
                if (found?.isUnlocked && found.items[0]) {
                  setSelectedScenarioId(found.items[0].id);
                }
              }
            }}
            personalCount={personalRoleplayScenarios.length}
            isEn={isEn}
            isMobileSheet={isMobileSheet}
          />
        )}
        <div className={isMobileSheet ? 'flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-0.5' : 'flex flex-wrap gap-1'}>
          {CONVERSATION_TRACKS.map(track => (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveTrack(track.id)}
              className={`${isMobileSheet ? 'px-2.5 py-1.5 rounded-xl text-[11px] shrink-0' : 'px-2 py-1 rounded-lg text-[10px]'} font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTrack === track.id
                  ? `bg-gradient-to-r ${track.badgeColor} text-white shadow-sm`
                  : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900 hover:bg-slate-800'} text-slate-400 border border-slate-800`
              }`}
            >
              {isEn ? track.labelEn : track.labelVi}
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
              placeholder={isEn ? 'Search scenarios or topics...' : 'Tìm kịch bản hoặc chủ đề...'}
              className={`w-full pl-8 pr-7 ${isMobileSheet ? 'py-2 bg-slate-950' : 'py-1.5 bg-slate-900'} rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500`}
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
            onClick={handlePickRandomScenario}
            disabled={filteredScenarios.length === 0}
            title={isEn ? 'Pick a random scenario' : 'Chọn ngẫu nhiên 1 kịch bản'}
            aria-label={isEn ? 'Pick a random scenario' : 'Chọn ngẫu nhiên 1 kịch bản'}
            className={`${
              isMobileSheet
                ? 'px-2.5 py-2 bg-slate-950 border-cyan-500/30 text-[11px] font-bold flex items-center space-x-1'
                : 'p-1.5 bg-slate-900 hover:bg-cyan-600/20 border-slate-800 hover:border-cyan-500/40'
            } rounded-xl text-cyan-300 border disabled:opacity-40 cursor-pointer shrink-0 transition-colors`}
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
                    ? 'bg-cyan-600 text-white'
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

      <div className={`flex-1 overflow-y-auto ${isMobileSheet ? 'p-3 space-y-2' : 'p-2 space-y-1.5'} overscroll-contain`}>
        {activeRoleplayBatchObj && !activeRoleplayBatchObj.isUnlocked ? (
          <BatchUnlockGateCard
            targetBatch={activeRoleplayBatchObj}
            compact
            isEn={isEn}
            onUnlockBatch={handlePurchaseRoleplayBatch}
            onGoToPrevBatch={(prevIdx) => handleSelectRoleplayBatch(prevIdx)}
            onOpenAuth={onOpenAuth}
            onOpenArena={handleOpenArenaSafe}
          />
        ) : filteredScenarios.length === 0 && nextLockedRoleplayBatch && activeRoleplayBatchObj?.isCompleted ? (
          <BatchUnlockGateCard
            targetBatch={nextLockedRoleplayBatch}
            isCelebrationMode
            compact
            isEn={isEn}
            onUnlockBatch={handlePurchaseRoleplayBatch}
            onOpenAuth={onOpenAuth}
            onOpenArena={handleOpenArenaSafe}
            onShowCompletedItems={toggleHideCompleted}
          />
        ) : filteredScenarios.length === 0 ? (
          <div className="p-5 text-center text-xs text-slate-400 space-y-2.5">
            <p>
              {isEn
                ? 'No scenarios match your current filter.'
                : 'Không có kịch bản nào khớp bộ lọc hiện tại.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setBandFilter('all');
                setSourceFilter('all');
                setActiveTrack('all');
                if (hideCompleted) toggleHideCompleted();
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer"
            >
              {isEn ? 'Reset Filters & Show All' : 'Đặt lại bộ lọc & Hiện tất cả'}
            </button>
          </div>
        ) : filteredScenarios.map(item => {
          const isSelected = currentScenario?.id === item.id;
          const best = convStats.bestScores?.[item.id];
          return (
            <div
              key={item.id}
              onClick={() => handleSelectScenario(item)}
              className={`${isMobileSheet ? 'p-3 min-h-[54px] active:scale-98' : 'p-2.5'} rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                isSelected
                  ? 'bg-cyan-950/65 border-cyan-500/60 shadow-md'
                  : `${isMobileSheet ? 'bg-slate-950/70' : 'bg-slate-900/70 hover:bg-slate-900'} border-slate-800/80`
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
                {!isMobileSheet && (
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {isEn ? item.contextEn : item.contextVi}
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
    </>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-1.5 md:p-2 overflow-hidden animate-in fade-in duration-150">
      <div
        className={`bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isExpanded
            ? 'w-screen h-[100dvh] max-w-none rounded-none'
            : 'w-full max-w-[1520px] h-[100dvh] sm:h-[96dvh] sm:rounded-2xl'
        }`}
      >
        {/* 1. COMPACT UNIFIED HEADER (1 single row on Desktop lg+) */}
        <header className="px-3 sm:px-4 py-2 bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
                {isEn ? 'Conversation Studio' : 'Luyện Hội Thoại'}
              </h2>
              <span className={`sm:hidden px-1.5 py-0.5 rounded-md text-[10px] font-black border shrink-0 ${levelProgress.tier.badgeColor}`}>
                Lv.{levelProgress.level}
              </span>
            </div>

            {/* Inline Mode Switcher on Desktop (lg+) to save an entire vertical bar */}
            <div className="hidden lg:inline-flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchStudioTab('roleplay')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  studioTab === 'roleplay'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Dialogue Roleplay' : 'Hội Thoại Đối Đáp'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchStudioTab('shadowing')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  studioTab === 'shadowing'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 shrink-0" />
                <span>Speech Shadowing</span>
              </button>
            </div>
          </div>

          {/* Right Actions + Inline Desktop Speed Selector + Compact XP */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Inline 1-Click Desktop Speed Selector (lg+) */}
            <div
              className="hidden lg:inline-flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0"
              title={isEn ? 'Speech Playback Speed' : 'Chọn chế độ tốc độ nói'}
            >
              {SPEAKING_SPEED_MODES.map(m => (
                <button
                  key={m.rate}
                  type="button"
                  onClick={() => setPlaybackSpeed(m.rate)}
                  title={isEn ? `${m.rate}x — ${m.labelEn}` : `${m.rate}x — ${m.labelVi}`}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer whitespace-nowrap ${
                    playbackSpeed === m.rate
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.rate}x
                </button>
              ))}
            </div>

            {/* Compact Desktop Audio/Threshold Settings Toggle (lg+) */}
            <button
              type="button"
              onClick={() => setIsDesktopSettingsOpen(prev => !prev)}
              className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-colors ${
                isDesktopSettingsOpen
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title={isEn ? 'Audio, Accent & Pass Threshold Settings' : 'Cài đặt Âm thanh, Giọng & Ngưỡng đạt'}
            >
              <Sliders className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-amber-300 font-black">{passThreshold}%</span>
              <span className="text-slate-600">•</span>
              <span>{selectedExaminerId === 'examiner-oliver' ? '🇺🇸 US' : '🇬🇧 UK'}</span>
            </button>

            {/* Live Atlas Gold Balance Pill */}
            <GoldWalletHeaderBadge
              isEn={isEn}
              onOpenArena={handleOpenArenaSafe}
            />

            {/* Compact XP & Streak Pill (sm+) */}
            <div
              className="hidden sm:flex items-center space-x-1.5 bg-slate-950/90 border border-slate-800 px-2 py-1 rounded-xl text-[10px] font-black"
              title={`${userTotalXp.toLocaleString()} XP (${levelProgress.progressPercent}%)`}
            >
              <span className={`px-1.5 py-0.5 rounded-md border ${levelProgress.tier.badgeColor}`}>
                Lv.{levelProgress.level}
              </span>
              {sessionXp > 0 && (
                <span className="inline-flex items-center space-x-0.5 text-emerald-400">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>+{sessionXp}</span>
                </span>
              )}
              <span className="inline-flex items-center space-x-0.5 text-amber-400">
                <Flame className="w-3 h-3 fill-current" />
                <span>{convStats.streak || 0}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsSoundcheckOpen(true)}
              className="flex items-center justify-center space-x-1 w-9 h-9 md:w-auto md:px-2.5 md:h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
              title={isEn ? 'Test Mic & Speaker' : 'Kiểm tra Micro & Loa'}
              aria-label={isEn ? 'Test Mic & Speaker' : 'Kiểm tra Micro & Loa'}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden xl:inline">{isEn ? 'Mic Test' : 'Test Mic'}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                studioTab === 'shadowing'
                  ? setShadowingCreatorTrigger(c => c + 1)
                  : setIsCreatorOpen(true)
              }
              className="flex items-center space-x-1 px-2.5 h-9 sm:h-8 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {studioTab === 'shadowing'
                  ? isEn ? 'Add Sample' : 'Thêm Mẫu'
                  : isEn ? 'New Script' : 'Tạo Mới'}
              </span>
              <span className="sm:hidden">{isEn ? 'New' : 'Tạo'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareUrl}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title={isEn ? 'Copy link' : 'Sao chép liên kết'}
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

        {/* Collapsible Desktop Audio & Threshold Settings Bar (lg+, only when toggled open) */}
        {isDesktopSettingsOpen && (
          <div className="hidden lg:flex px-4 py-1.5 bg-slate-950 border-b border-slate-800 items-center justify-between gap-3 shrink-0 animate-in fade-in duration-150">
            <span className="text-[11px] font-bold text-slate-400">
              {isEn ? 'Audio & Grading Settings' : 'Cài đặt Âm thanh & Ngưỡng điểm đạt'}
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                <Sliders className="w-3 h-3 text-amber-400 mx-1.5 shrink-0" />
                {CONVERSATION_THRESHOLD_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPassThreshold(opt.value);
                      safeSet('ielts_conversation_threshold', opt.value);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black cursor-pointer whitespace-nowrap ${
                      passThreshold === opt.value
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.value}%
                  </button>
                ))}
              </div>

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
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap ${
                      selectedExaminerId === v.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                {SPEAKING_SPEED_MODES.map(m => (
                  <button
                    key={m.rate}
                    type="button"
                    onClick={() => setPlaybackSpeed(m.rate)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap ${
                      playbackSpeed === m.rate ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.rate}x {isEn ? m.labelEn : m.labelVi}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

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

        {/* 2. STUDIO MODE TABS & SHARED AUDIO SETTINGS (Mobile/Tablet < lg; Desktop lg+ is unified in Header above) */}
        <div className="lg:hidden px-3 sm:px-6 py-1.5 sm:py-2 bg-slate-950/90 border-b border-slate-800/90 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            {/* Primary Studio Tab Switcher */}
            <div className="flex-1 sm:flex-none grid grid-cols-2 sm:inline-flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchStudioTab('roleplay')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  studioTab === 'roleplay'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Dialogue Roleplay' : 'Hội Thoại Đối Đáp'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchStudioTab('shadowing')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  studioTab === 'shadowing'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 shrink-0" />
                <span>{isEn ? 'Speech Shadowing' : 'Speech Shadowing'}</span>
                <span className="hidden sm:inline px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">NEW</span>
              </button>
            </div>

            {/* Mobile Settings Toggle Pill (< sm) */}
            <button
              type="button"
              onClick={() => setIsMobileSettingsOpen(prev => !prev)}
              className={`sm:hidden px-2.5 py-1.5 rounded-xl border text-[11px] font-black flex items-center space-x-1 shrink-0 cursor-pointer transition-all ${
                isMobileSettingsOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-amber-300 border-slate-800'
              }`}
              title={isEn ? 'Audio & Threshold Settings' : 'Cài đặt Âm thanh & Ngưỡng điểm'}
              aria-label={isEn ? 'Audio & Threshold Settings' : 'Cài đặt Âm thanh & Ngưỡng điểm'}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span>{passThreshold}%</span>
            </button>

            {/* Shared Audio & Threshold Controls (Desktop/Tablet sm+) */}
            <div className="hidden sm:flex items-center justify-end space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
              {/* Threshold Selector (Default 75%) */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0" title={isEn ? 'Minimum pronunciation pass score' : 'Ngưỡng điểm tối thiểu để qua đoạn/câu'}>
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
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
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
              <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
                {SPEAKING_SPEED_MODES.map(m => (
                  <button
                    key={m.rate}
                    type="button"
                    onClick={() => setPlaybackSpeed(m.rate)}
                    className={`px-1.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap ${
                      playbackSpeed === m.rate ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Mobile Settings Tray (< sm) */}
          {isMobileSettingsOpen && (
            <div className="sm:hidden pt-1.5 border-t border-slate-800/80 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
                  <Sliders className="w-3 h-3 text-amber-400 mx-1 shrink-0" />
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

                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
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
              </div>

              <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
                  {SPEAKING_SPEED_MODES.map(m => (
                    <button
                      key={m.rate}
                      type="button"
                      onClick={() => setPlaybackSpeed(m.rate)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer whitespace-nowrap ${
                        playbackSpeed === m.rate ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.rate}x
                    </button>
                  ))}
                </div>

                {studioTab === 'roleplay' && (
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowIntonation(prev => !prev)}
                      className={`px-2 py-1 rounded-xl text-[10px] font-bold border cursor-pointer ${
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
                      className={`px-2 py-1 rounded-xl text-[10px] font-bold border cursor-pointer flex items-center space-x-1 ${
                        keywordsOnly
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isEn ? 'Keywords' : 'Ẩn chữ'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {studioTab === 'shadowing' ? (
          <SpeechShadowingWorkspace
            isOpen={isOpen && studioTab === 'shadowing'}
            speechEngine={speechEngine}
            selectedExaminerId={selectedExaminerId}
            playbackSpeed={playbackSpeed}
            passThreshold={passThreshold}
            isAutoMode={isAutoMode}
            apiKey={apiKey}
            model={model}
            isEn={isEn}
            awardXp={awardXp}
            onSaveToNotebook={onSaveToNotebook}
            onSaveMistake={onSaveMistake}
            onOpenPronunciation={onOpenPronunciation}
            currentUser={currentUser}
            walletSnapshot={walletSnapshot}
            onOpenAuth={onOpenAuth}
            onOpenArena={handleOpenArenaSafe}
            creatorTrigger={shadowingCreatorTrigger}
            initialTaskId={initialOptions?.shadowingTask}
          />
        ) : (
          <>
            {/* MOBILE SCENARIO SELECTOR BAR (< lg) */}
        <div className="lg:hidden px-3 py-1.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileListOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold shrink-0 cursor-pointer"
          >
            <List className="w-3.5 h-3.5" />
            <span>{isEn ? `Scenarios (${filteredScenarios.length})` : `Kịch bản (${filteredScenarios.length})`}</span>
          </button>

          <div className="min-w-0 flex-1 flex items-center justify-center space-x-1.5">
            <span className="text-[11px] font-extrabold text-white truncate">
              {isEn ? currentScenario.titleEn : currentScenario.titleVi}
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
              {Math.min(activeTurnIndex + 1, turns.length)}/{turns.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowIntonation(prev => !prev)}
            className={`hidden sm:inline-flex px-2 py-1.5 rounded-xl text-[11px] font-bold border shrink-0 cursor-pointer ${
              showIntonation
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isEn ? 'Intonation' : 'Ngữ điệu'}
          </button>

          <button
            type="button"
            onClick={() => setKeywordsOnly(prev => !prev)}
            className={`hidden sm:inline-flex items-center space-x-1 px-2 py-1.5 rounded-xl text-[11px] font-bold border shrink-0 cursor-pointer ${
              keywordsOnly
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{isEn ? 'Keywords' : 'Ẩn chữ'}</span>
          </button>

          <button
            type="button"
            onClick={() => resetDialogueState(userRole === 'B' ? 'A' : 'B')}
            className="px-2 py-1.5 rounded-xl bg-slate-800 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center space-x-1 shrink-0 cursor-pointer"
            title={isEn ? 'Swap Role A/B' : 'Đổi vai A/B'}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>{userRole}</span>
          </button>

          <button
            type="button"
            onClick={handleNextScenario}
            className="p-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/35 shrink-0 cursor-pointer"
            title={isEn ? 'Next scenario' : 'Hội thoại kế tiếp'}
            aria-label={isEn ? 'Next scenario' : 'Hội thoại kế tiếp'}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => resetDialogueState(userRole)}
            className="hidden sm:inline-flex p-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 shrink-0 cursor-pointer"
            title={isEn ? 'Restart dialogue' : 'Chơi lại từ đầu'}
            aria-label={isEn ? 'Restart dialogue' : 'Chơi lại từ đầu'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. MAIN WORKSPACE */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* DESKTOP SIDEBAR (Collapsible for full-width dialogue focus) */}
          {isDesktopSidebarOpen && (
          <aside className="hidden lg:flex w-72 xl:w-80 bg-slate-950/60 border-r border-slate-800 flex-col shrink-0">
            {renderScenarioListContent(false)}
          </aside>
          )}

          {/* MAIN DIALOGUE STAGE */}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-900/40">
            {activeRoleplayBatchObj && !activeRoleplayBatchObj.isUnlocked ? (
              <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="w-full max-w-xl">
                  <BatchUnlockGateCard
                    targetBatch={activeRoleplayBatchObj}
                    isEn={isEn}
                    onUnlockBatch={handlePurchaseRoleplayBatch}
                    onGoToPrevBatch={(prevIdx) => handleSelectRoleplayBatch(prevIdx)}
                    onOpenAuth={onOpenAuth}
                    onOpenArena={handleOpenArenaSafe}
                  />
                </div>
              </div>
            ) : (
            <>
            {/* Compact 1-Row Scenario Context & Role Control Strip (Desktop lg+) */}
            <div className="hidden lg:flex px-4 py-2 bg-slate-950/70 border-b border-slate-800 items-center justify-between gap-2 shrink-0">
              <div className="min-w-0 flex-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDesktopSidebarOpen(prev => !prev)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer shrink-0"
                  title={isDesktopSidebarOpen ? (isEn ? 'Hide scenario list' : 'Thu gọn danh sách') : (isEn ? 'Show scenario list' : 'Mở danh sách')}
                >
                  {isDesktopSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
                </button>
                <h3 className="text-sm font-black text-white truncate">
                  {isEn ? currentScenario.titleEn : currentScenario.titleVi}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                  {Math.min(activeTurnIndex + 1, turns.length)}/{turns.length}
                </span>
                <span className="hidden xl:inline text-[11px] text-slate-400 truncate">
                  — {isEn ? currentScenario.contextEn : currentScenario.contextVi}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
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
                  onClick={() => resetDialogueState(userRole === 'B' ? 'A' : 'B')}
                  className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/35 text-[11px] font-bold cursor-pointer"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>
                    {isEn
                      ? `${currentScenario.roles[userRole]?.nameEn}`
                      : `${currentScenario.roles[userRole]?.nameVi}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleNextScenario}
                  className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/35 text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                  title={isEn ? 'Next conversation' : 'Hội thoại kế tiếp'}
                >
                  <span>{isEn ? 'Next' : 'Bài tiếp'}</span>
                  <SkipForward className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => resetDialogueState(userRole)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
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
              {/* Start Dialogue Banner before first turn (Desktop lg+) */}
              {!hasStartedDialogue && !isCompleted && (
                <div className="hidden lg:flex p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/50 to-slate-900 border border-cyan-500/40 sm:items-center justify-between gap-3">
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
                if (idx > activeTurnIndex) return null;
                const isUser = turn.speaker === userRole;
                const status = idx < activeTurnIndex ? 'past_done' : 'active';
                const isActive = status === 'active';
                const clip = speechEngine.audioClips[`conv_${currentScenario.id}_${turn.id}`];

                return (
                  <div key={turn.id} ref={isActive ? activeTurnRef : null}>
                    <ConversationTurnCard
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
                      playbackSpeed={playbackSpeed}
                      revealThisTurn={isActive ? revealCurrentTurn : false}
                      onToggleRevealThisTurn={isActive ? handleToggleRevealCurrentTurn : NOOP}
                      onPlayPartnerLine={handlePlayPartnerLine}
                      onPlayUserModel={handlePlayUserModel}
                      isListening={isActive && speechEngine.isListening}
                      isAutoMode={isAutoMode}
                      liveSpokenText={isActive ? liveSpokenText : ''}
                      isWaitingForRetrySpeech={isActive && isWaitingForRetrySpeech}
                      speechError={isActive ? speechEngine.speechError : null}
                      analyserNode={isActive ? speechEngine.analyserNode : null}
                      micLevel={isActive ? (speechEngine.micLevel || 0) : 0}
                      hasAnalyser={Boolean(speechEngine.analyserNode)}
                      evaluationResult={isActive ? evaluationResult : turnResults[turn.id]}
                      attemptCount={turnAttempts[turn.id] || 0}
                      passThreshold={passThreshold}
                      currentAudioClip={clip}
                      isPlayingUserClip={playingUserClipTurnId === turn.id}
                      isComparingAudio={comparingTurnId === turn.id}
                      onToggleRecording={isActive ? handleToggleRecording : NOOP}
                      onReplayUserClip={handleReplayUserClip}
                      onCompareAudio={handleCompareTurnAudio}
                      onListenAndRetry={isActive ? handleListenAndRetry : NOOP}
                      onSkipTurn={isActive ? handleSkipTurn : NOOP}
                      onAdvanceAfterPass={isActive ? advanceAfterUserPass : NOOP}
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

              {/* Compact Next-Turn Locked Preview Bar (replaces stacked locked cards so active turn stays centered) */}
              {!isCompleted && activeTurnIndex < turns.length - 1 && (() => {
                const nextLockedTurn = turns[activeTurnIndex + 1];
                const remainingLocked = turns.length - 1 - activeTurnIndex;
                return (
                  <div className={`flex ${nextLockedTurn.speaker === userRole ? 'justify-end' : 'justify-start'} opacity-65 select-none`}>
                    <div className="px-3.5 py-2 rounded-2xl bg-slate-900/75 border border-slate-800/90 flex items-center space-x-2 text-[11px] text-slate-400">
                      <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-semibold">
                        {isEn
                          ? `Next: Turn ${activeTurnIndex + 2} (${currentScenario.roles[nextLockedTurn.speaker]?.nameEn || ''})${remainingLocked > 1 ? ` (+${remainingLocked - 1} more)` : ''} — Pass ≥${passThreshold}% to unlock`
                          : `Tiếp theo: Lượt ${activeTurnIndex + 2} (${currentScenario.roles[nextLockedTurn.speaker]?.nameVi || ''})${remainingLocked > 1 ? ` (+${remainingLocked - 1} lượt)` : ''} — Đạt ≥${passThreshold}% để mở`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {isCompleted && sessionSummary && (
                <div ref={summaryRef}>
                  <ConversationSummaryCard
                  scenario={currentScenario}
                  summary={sessionSummary}
                  combinedUserTranscript={combinedUserTranscript}
                  totalSpeakingDurationSec={totalSpeakingSec}
                  isFullReplaying={isFullReplaying}
                  replayTurnIdx={replayTurnIdx}
                  onToggleFullReplay={handleToggleFullReplay}
                  onRestart={() => resetDialogueState(userRole)}
                  onNextTask={handleNextScenario}
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
        {activeTurn && !isCompleted && (!activeRoleplayBatchObj || activeRoleplayBatchObj.isUnlocked) && (
          <div className="lg:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2 z-30">
            <button
              type="button"
              onClick={() => {
                speechEngine.stopListening();
                if (isActiveUserTurn) {
                  speechEngine.speak(activeTurn.text, { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true });
                } else {
                  playPartnerTurnAudio(activeTurn, playbackSpeed);
                }
              }}
              className="min-h-[48px] px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Model' : 'Nghe mẫu'}</span>
            </button>

            {isActiveUserTurn ? (
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
                        ? `Speak Again (#${(turnAttempts[activeTurn.id] || 0) + 1})`
                        : `Đọc lại (#${(turnAttempts[activeTurn.id] || 0) + 1})`
                      : isAutoMode
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
                className="flex-1 min-h-[48px] px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 active:scale-95 text-white text-xs sm:text-sm font-black flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>
                  {!hasStartedDialogue
                    ? isEn ? 'Start Conversation' : 'Bắt Đầu Hội Thoại'
                    : isEn ? 'Play Partner Line' : 'Phát Lượt Máy'}
                </span>
              </button>
            )}

            {isActiveUserTurn && currentAudioClip?.url && !speechEngine.isListening && (
              <button
                type="button"
                onClick={() => handleReplayUserClip(activeTurn.id)}
                className="min-h-[48px] px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-300 border border-slate-700 text-xs font-bold flex items-center justify-center shrink-0 cursor-pointer"
                title={isEn ? 'Replay your voice' : 'Nghe lại giọng bạn'}
                aria-label={isEn ? 'Replay your voice' : 'Nghe lại giọng bạn'}
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
              onClick={() => resetDialogueState(userRole)}
              className="min-h-[48px] px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 shrink-0 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Retry' : 'Làm lại'}</span>
            </button>
            <button
              type="button"
              onClick={handleNextScenario}
              className="flex-1 min-h-[48px] px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-sm font-black flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all"
            >
              <span>{isEn ? 'Next Conversation' : 'Hội Thoại Kế Tiếp'}</span>
              <SkipForward className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        {/* MOBILE SCENARIO LIST BOTTOM SHEET (< lg) */}
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
                  {isEn ? `Select Scenario (${filteredScenarios.length})` : `Chọn Kịch Bản (${filteredScenarios.length})`}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileListOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {renderScenarioListContent(true)}
            </div>
          </div>
        )}
          </>
        )}

        {/* CUSTOM CONVERSATION CREATOR MODAL */}
        <ConversationCustomCreatorModal
          isOpen={isCreatorOpen}
          onClose={() => setIsCreatorOpen(false)}
          apiKey={apiKey}
          model={model}
          onCreatedScenario={handleCreatedCustomScenario}
          isEn={isEn}
        />

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
