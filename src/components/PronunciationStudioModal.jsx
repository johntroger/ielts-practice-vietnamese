import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  X,
  Mic,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award,
  Flame,
  Zap,
  Plus,
  Trash2,
  Bookmark,
  Search,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Share2,
  Check,
  AlertCircle,
  BookOpen,
  Sliders,
  Headphones,
  ArrowRight,
  Trophy,
  List,
  ChevronDown,
  Lock,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Shuffle,
  ArrowLeftRight
} from 'lucide-react';
import {
  PRONUNCIATION_TRACKS,
  PRONUNCIATION_IPA_DRILLS,
  IPA_SOUND_GROUPS,
  PRONUNCIATION_WORD_DRILLS,
  PRONUNCIATION_STRESS_SHIFT_DRILLS,
  PRONUNCIATION_PHRASE_DRILLS,
  PRONUNCIATION_SENTENCE_DRILLS,
  PRONUNCIATION_TWISTER_DRILLS,
  TWISTER_GROUPS,
  evaluatePronunciationAttempt,
  evaluateIsolatedIpaSoundAttempt,
  evaluateMinimalPairDuelAttempt,
  evaluateTwisterAttempt,
  buildPhonemeFeedbackSegments,
  buildSentenceRhythmNodes,
  buildCustomPronunciationDrill,
  mapVocabListToPronunciationDrills,
  expandConversationalTokens
} from '../data/pronunciationData';
import PronunciationCustomDrillModal from './speaking/PronunciationCustomDrillModal';
import IpaArticulationDiagram from './speaking/IpaArticulationDiagram';
import {
  runLayer2PronunciationCheck,
  SPEAKING_SPEED_MODES,
  DEFAULT_SPEAKING_SPEED
} from '../utils/speakingPracticeHelpers';
import { SPEAKING_EXAMINER_PROFILES } from '../data/speakingTopics';
import { useSpeechEngine } from '../hooks/useSpeechEngine';
import SpeechWaveVisualizer from './speaking/SpeechWaveVisualizer';
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
import {
  SHARDED_TRACKS,
  loadTrackManifest,
  buildExternalPlaceholderItems,
  hydrateBatchItems
} from '../services/data/bankShardService';
import BatchSelectorStrip, { GoldWalletHeaderBadge } from './common/BatchSelectorStrip';
import BatchUnlockGateCard from './common/BatchUnlockGateCard';
import { getUnifiedStreakCount } from '../services/gamification/leagueEngine';
import { speakingSoundEffects } from '../utils/speakingSoundEffects';
import { triggerHaptic } from '../utils/hapticHelper';

const CUSTOM_DRILLS_STORAGE_KEY = 'ielts_pronunciation_custom_drills_v1';
const PRONUNCIATION_STATS_STORAGE_KEY = 'ielts_pronunciation_stats_v1';
const PRONUNCIATION_PASS_THRESHOLD = 80;

export default function PronunciationStudioModal({
  isOpen,
  onClose,
  apiKey = '',
  model = 'gemini-3.6-flash',
  currentUser = null,
  vocabList = [],
  onSaveToNotebook,
  masteredIds = [],
  onToggleMastered,
  onOpenAuth,
  onOpenArena,
  onOpenVocabNotebook,
  onOpenConversation,
  initialOptions = null
}) {
  const { isEn } = useTranslation();

  const validTabs = ['ipa', 'words', 'stress', 'phrases', 'sentences', 'twisters'];

  // 1. Active Track Tab ('ipa' | 'words' | 'stress' | 'phrases' | 'sentences' | 'twisters')
  const [activeTab, setActiveTab] = useState(() => {
    if (initialOptions?.tab && validTabs.includes(initialOptions.tab)) {
      return initialOptions.tab;
    }
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const tabParam = search.get('tab');
      if (tabParam && validTabs.includes(tabParam)) return tabParam;
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.endsWith('/ipa')) return 'ipa';
      if (pathname.endsWith('/stress')) return 'stress';
      if (pathname.endsWith('/phrases')) return 'phrases';
      if (pathname.endsWith('/sentences')) return 'sentences';
      if (pathname.endsWith('/twisters')) return 'twisters';
      if (pathname.endsWith('/words')) return 'words';
    }
    const savedTab = safeGet('ielts_pronunciation_active_tab', 'words');
    return validTabs.includes(savedTab) ? savedTab : 'words';
  });

  useEffect(() => {
    if (initialOptions?.tab && validTabs.includes(initialOptions.tab)) {
      setActiveTab(initialOptions.tab);
    }
  }, [initialOptions?.tab]);

  const handleSelectTab = (tabId) => {
    if (!validTabs.includes(tabId)) return;
    setActiveTab(tabId);
    safeSet('ielts_pronunciation_active_tab', tabId);
    setSelectedIdx(0);
    setEvaluationResult(null);
    try {
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname.toLowerCase();
        if (pathname.includes('/pronunciation') || pathname.includes('/luyen-phat-am')) {
          const url = new URL(window.location.href);
          if (tabId === 'words') {
            url.searchParams.delete('tab');
          } else {
            url.searchParams.set('tab', tabId);
          }
          window.history.replaceState(window.history.state, '', url.pathname + url.search);
        }
      }
    } catch (e) {}
  };

  // 2. Expanded / Fullscreen State (Alt+Z) & Desktop Focus Controls
  const [isExpanded, setIsExpanded] = useState(() =>
    Boolean(safeGet('ielts_pronunciation_expanded', false))
  );
  const [isDesktopSettingsOpen, setIsDesktopSettingsOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(prev => {
      const next = !prev;
      safeSet('ielts_pronunciation_expanded', next);
      return next;
    });
  };

  // 3. Voice Accent & Playback Speed (persisted)
  const [selectedExaminerId, setSelectedExaminerId] = useState(() =>
    safeGet('ielts_pronunciation_examiner', 'examiner-arthur')
  );
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    const saved = Number(safeGet('ielts_pronunciation_speed', DEFAULT_SPEAKING_SPEED));
    return SPEAKING_SPEED_MODES.some(m => m.rate === saved) ? saved : DEFAULT_SPEAKING_SPEED;
  });

  useEffect(() => {
    safeSet('ielts_pronunciation_examiner', selectedExaminerId);
  }, [selectedExaminerId]);

  useEffect(() => {
    safeSet('ielts_pronunciation_speed', playbackSpeed);
  }, [playbackSpeed]);

  const speechEngine = useSpeechEngine({
    examinerId: selectedExaminerId,
    rawPhoneticMode: true
  });

  // 4. Custom Drills & Persistent Stats
  const [customDrills, setCustomDrills] = useState(() =>
    safeGet(CUSTOM_DRILLS_STORAGE_KEY, [])
  );

  const [pronStats, setPronStats] = useState(() =>
    safeGet(PRONUNCIATION_STATS_STORAGE_KEY, {
      totalXpEarned: 0,
      completedCount: 0,
      bestScores: {}, // { [drillId]: { accuracy, band, xp } }
      streak: 0
    })
  );

  // 5. Global User XP & Level State
  const [userTotalXp, setUserTotalXp] = useState(() => getCurrentUserTotalXp(currentUser));
  const [sessionXp, setSessionXp] = useState(0);
  const [xpToast, setXpToast] = useState(null); // { xp, label, levelUp }
  const [levelUpBanner, setLevelUpBanner] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setUserTotalXp(getCurrentUserTotalXp(currentUser));
    }
  }, [isOpen, currentUser]);

  const levelProgress = useMemo(() => calculateLevelProgress(userTotalXp), [userTotalXp]);

  // 6. Filters, Passed Auto-Hide & Drill List
  const [searchQuery, setSearchQuery] = useState('');
  const [bandFilter, setBandFilter] = useState('all'); // 'all' | 'foundation' | 'band7' | 'band8'
  const [ipaGroupFilter, setIpaGroupFilter] = useState('all'); // 'all' | 'monophthongs' | 'diphthongs' | 'consonants'
  const [twisterGroupFilter, setTwisterGroupFilter] = useState('all'); // 'all' | 'classic' | 'academic' | 'weak'
  const [showIpaChart, setShowIpaChart] = useState(true);
  const [ipaPracticeMode, setIpaPracticeMode] = useState('sound'); // 'sound' (Chính âm IPA) | 'words' (Từ ví dụ) | 'duel'
  const twisterSpeakStartRef = useRef(0);
  const [hidePassed, setHidePassed] = useState(() =>
    Boolean(safeGet('ielts_pronunciation_hide_passed', true))
  );
  const passedStorageKey = `ielts_pronunciation_passed_ids_v1_${currentUser?.id || 'guest'}`;
  const [passedDrillIds, setPassedDrillIds] = useState(() =>
    safeGet(passedStorageKey, [])
  );
  const [justPassedDrillId, setJustPassedDrillId] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  useEffect(() => {
    setPassedDrillIds(safeGet(passedStorageKey, []));
  }, [passedStorageKey]);

  const toggleHidePassed = () => {
    setHidePassed(prev => {
      const next = !prev;
      safeSet('ielts_pronunciation_hide_passed', next);
      return next;
    });
  };

  // 7. Create Custom Drill Modal & Imported Focus State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [importedFocusBanner, setImportedFocusBanner] = useState(null); // { count, firstWord }
  const handledFocusRef = useRef(null);

  // 8. Practice & Evaluation State for Current Drill
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [manualSpokenInput, setManualSpokenInput] = useState('');
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [isPlayingUserClip, setIsPlayingUserClip] = useState(false);
  const [isComparingAudio, setIsComparingAudio] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [savedToVaultToast, setSavedToVaultToast] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(() =>
    Boolean(safeGet('ielts_pronunciation_auto_mode', true))
  );
  const [attemptCount, setAttemptCount] = useState(0);
  const [isWaitingForRetrySpeech, setIsWaitingForRetrySpeech] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isDeepAiGrading, setIsDeepAiGrading] = useState(false);
  const [deepAiError, setDeepAiError] = useState('');
  const userAudioRef = useRef(null);
  const compareTimerRef = useRef(null);
  const sessionTokenRef = useRef(0);
  const hasAwardedXpRef = useRef(false);
  const lastAutoEvaluatedRef = useRef('');
  const liveSpokenTextRef = useRef('');
  const attemptCountRef = useRef(0);
  const handleRunEvaluationRef = useRef(null);
  const handleToggleRecordingRef = useRef(null);
  const handlePlayModelRef = useRef(null);
  const handleAdvanceToNextDrillRef = useRef(null);

  const toggleAutoMode = () => {
    setIsAutoMode(prev => {
      const next = !prev;
      safeSet('ielts_pronunciation_auto_mode', next);
      return next;
    });
  };

  // Wallet snapshot (auto-synced with Atlas English Arena Gold via eventBus)
  const [walletSnapshot, setWalletSnapshot] = useState(() => getWallet());
  const [selectedBatchByTab, setSelectedBatchByTab] = useState(() =>
    safeGet('ielts_pronunciation_selected_batches_v1', {
      words: 1,
      stress: 1,
      phrases: 1,
      sentences: 1,
      twisters: 1
    })
  );

  useEffect(() => {
    setWalletSnapshot(getWallet());
    const onWalletUpdate = (updated) => {
      setWalletSnapshot(updated || getWallet());
    };
    const onCloudBatchSync = (payload) => {
      if (Array.isArray(payload?.pronPassedIds)) {
        setPassedDrillIds(payload.pronPassedIds);
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

  const selectedBatchIndex = activeTab === 'ipa' ? 1 : (selectedBatchByTab[activeTab] || 1);

  const handleSelectBatch = useCallback((nextBatch) => {
    if (speechEngine.isListening) speechEngine.stopListening();
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
    setSelectedBatchByTab(prev => {
      const updated = { ...prev, [activeTab]: nextBatch };
      safeSet('ielts_pronunciation_selected_batches_v1', updated);
      return updated;
    });
    setSelectedIdx(0);
    setEvaluationResult(null);
    setJustPassedDrillId(null);
  }, [activeTab, speechEngine.isListening, speechEngine.stopListening, speechEngine.isSpeaking, speechEngine.stopSpeaking]);

  // Scalable Batch-Sharded External Bank State (loads only ~1 KB manifest + active unlocked shard JSON)
  const [externalManifests, setExternalManifests] = useState({});
  const [shardHydrationTick, setShardHydrationTick] = useState(0);
  const [isLoadingBatchShard, setIsLoadingBatchShard] = useState(false);

  const activeTrackKey = `pron_${activeTab}`;

  useEffect(() => {
    if (!isOpen || !SHARDED_TRACKS.has(activeTrackKey)) return;
    if (externalManifests[activeTrackKey] !== undefined) return;
    let cancelled = false;
    loadTrackManifest(activeTrackKey).then((manifest) => {
      if (!cancelled) {
        setExternalManifests(prev => ({ ...prev, [activeTrackKey]: manifest || null }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, activeTrackKey, externalManifests]);

  // Step 1: Canonical Bank & Personal Vault Separation (prevents custom/vocab items from shifting batches)
  const rawBaseForTab = useMemo(() => {
    const builtIn =
      activeTab === 'ipa'
        ? PRONUNCIATION_IPA_DRILLS
        : activeTab === 'words'
        ? PRONUNCIATION_WORD_DRILLS
        : activeTab === 'stress'
        ? PRONUNCIATION_STRESS_SHIFT_DRILLS
        : activeTab === 'phrases'
        ? PRONUNCIATION_PHRASE_DRILLS
        : activeTab === 'twisters'
        ? PRONUNCIATION_TWISTER_DRILLS
        : PRONUNCIATION_SENTENCE_DRILLS;

    const manifest = externalManifests[activeTrackKey];
    if (!manifest || activeTab === 'ipa') return builtIn;
    const externalItems = buildExternalPlaceholderItems(manifest);
    return externalItems.length > 0 ? [...builtIn, ...externalItems] : builtIn;
  }, [activeTab, activeTrackKey, externalManifests, shardHydrationTick]);

  const personalDrillsForTab = useMemo(() => {
    const existingTexts = new Set(
      rawBaseForTab
        .filter(d => d && !d._isShardPlaceholder && d.targetText)
        .map(d => d.targetText.toLowerCase().trim())
    );
    const vocabDrillsForTab =
      currentUser && activeTab !== 'ipa' && activeTab !== 'stress' && activeTab !== 'twisters'
        ? mapVocabListToPronunciationDrills(vocabList, existingTexts).filter(d => d.type === activeTab)
        : [];
    const customForTab = (Array.isArray(customDrills) ? customDrills : []).filter(
      d => d.type === activeTab
    );
    return [...customForTab, ...vocabDrillsForTab];
  }, [rawBaseForTab, activeTab, currentUser, vocabList, customDrills]);

  // Step 2: Deterministic Auto-Expanding Batches (IPA is unbatched & always 100% open)
  const trackBatches = useMemo(() => {
    if (activeTab === 'ipa') return [];
    const passedSet = new Set(Array.isArray(passedDrillIds) ? passedDrillIds : []);
    return buildTrackBatches({
      items: rawBaseForTab,
      trackKey: activeTrackKey,
      completedIdSet: passedSet,
      wallet: walletSnapshot,
      currentUser
    });
  }, [activeTab, activeTrackKey, rawBaseForTab, passedDrillIds, walletSnapshot, currentUser]);

  const activeBatchObj = useMemo(() => {
    if (activeTab === 'ipa' || selectedBatchIndex === 'personal') return null;
    return trackBatches.find(b => b.batchIndex === selectedBatchIndex) || trackBatches[0] || null;
  }, [activeTab, selectedBatchIndex, trackBatches]);

  // Step 2b: On-Demand Shard Hydration — only fetches the shard JSON when an unlocked Batch contains unloaded external items
  useEffect(() => {
    if (!isOpen || !activeBatchObj || !activeBatchObj.isUnlocked) {
      setIsLoadingBatchShard(false);
      return;
    }
    const manifest = externalManifests[activeTrackKey];
    const needsHydration =
      manifest &&
      Array.isArray(activeBatchObj.items) &&
      activeBatchObj.items.some(item => item?._isShardPlaceholder);

    if (!needsHydration) {
      setIsLoadingBatchShard(false);
      return;
    }

    let cancelled = false;
    setIsLoadingBatchShard(true);
    hydrateBatchItems(activeTrackKey, manifest, activeBatchObj.items)
      .then(() => {
        if (!cancelled) {
          setShardHydrationTick(t => t + 1);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingBatchShard(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, activeTrackKey, externalManifests, activeBatchObj]);

  const nextLockedBatchAfterCurrent = useMemo(() => {
    if (!activeBatchObj || !activeBatchObj.isUnlocked) return null;
    return trackBatches.find(b => b.batchIndex === activeBatchObj.batchIndex + 1 && !b.isUnlocked) || null;
  }, [activeBatchObj, trackBatches]);

  const handlePurchaseBatch = useCallback((batch) => {
    if (!batch) return;
    const res = purchaseBatchUnlock({
      batchId: batch.batchId,
      batchLabel: `${activeTab.toUpperCase()} Batch ${batch.batchIndex}`,
      costGold: batch.costGold,
      currentUser
    });
    if (res.success) {
      setWalletSnapshot(getWallet());
      speakingSoundEffects.playCompletionChime();
      triggerHaptic('combo');
      handleSelectBatch(batch.batchIndex);
      setIsMobileListOpen(false);
    }
  }, [activeTab, currentUser, handleSelectBatch]);

  const allUnfilteredForTab = useMemo(() => {
    if (activeTab === 'ipa') return [...personalDrillsForTab, ...rawBaseForTab];
    if (selectedBatchIndex === 'personal') return personalDrillsForTab;
    if (activeBatchObj && !activeBatchObj.isUnlocked) return [];
    const items = activeBatchObj ? activeBatchObj.items : rawBaseForTab;
    return items.filter(item => item && !item._isShardPlaceholder);
  }, [activeTab, selectedBatchIndex, personalDrillsForTab, rawBaseForTab, activeBatchObj]);

  const lockedCountForGuest = useMemo(() => {
    if (activeTab === 'ipa' || currentUser) return 0;
    return trackBatches.filter(b => !b.isUnlocked).reduce((sum, b) => sum + b.totalCount, 0);
  }, [activeTab, currentUser, trackBatches]);

  const passedCountInTab = useMemo(() => {
    const passedSet = new Set(Array.isArray(passedDrillIds) ? passedDrillIds : []);
    return allUnfilteredForTab.filter(d => passedSet.has(d.id)).length;
  }, [allUnfilteredForTab, passedDrillIds]);

  const weakCountInTab = useMemo(() => {
    const scores = pronStats?.bestScores || {};
    return allUnfilteredForTab.filter(
      d => scores[d.id] && scores[d.id].accuracy < PRONUNCIATION_PASS_THRESHOLD
    ).length;
  }, [allUnfilteredForTab, pronStats?.bestScores]);

  const masteredIpaCount = useMemo(() => {
    const passedSet = new Set(Array.isArray(passedDrillIds) ? passedDrillIds : []);
    const scores = pronStats?.bestScores || {};
    return PRONUNCIATION_IPA_DRILLS.filter(
      d => passedSet.has(d.id) || (scores[d.id] && scores[d.id].accuracy >= PRONUNCIATION_PASS_THRESHOLD)
    ).length;
  }, [passedDrillIds, pronStats?.bestScores]);

  const handleJumpToIpaSymbol = useCallback((symbol) => {
    const idx = PRONUNCIATION_IPA_DRILLS.findIndex(d => d.ipaSymbol === symbol);
    if (idx === -1) return;
    setActiveTab('ipa');
    safeSet('ielts_pronunciation_active_tab', 'ipa');
    setIpaGroupFilter('all');
    setIpaPracticeMode('sound');
    setHidePassed(false);
    setSearchQuery('');
    setSelectedIdx(idx);
    setEvaluationResult(null);
  }, []);

  const activeTrackDrills = useMemo(() => {
    let combined = allUnfilteredForTab;
    const scores = pronStats?.bestScores || {};

    if (activeTab === 'ipa') {
      if (ipaGroupFilter === 'weak') {
        combined = combined.filter(
          d => scores[d.id] && scores[d.id].accuracy < PRONUNCIATION_PASS_THRESHOLD
        );
      } else if (ipaGroupFilter !== 'all') {
        combined = combined.filter(d => d.ipaGroup === ipaGroupFilter);
      }
    } else if (activeTab === 'twisters') {
      if (twisterGroupFilter === 'weak') {
        combined = combined.filter(
          d => scores[d.id] && scores[d.id].accuracy < PRONUNCIATION_PASS_THRESHOLD
        );
      } else if (twisterGroupFilter !== 'all') {
        combined = combined.filter(d => d.twisterGroup === twisterGroupFilter);
      }
    } else if (bandFilter === 'weak') {
      combined = combined.filter(
        d => scores[d.id] && scores[d.id].accuracy < PRONUNCIATION_PASS_THRESHOLD
      );
    } else if (bandFilter === 'foundation') {
      combined = combined.filter(d => parseFloat(d.bandLevel) <= 6.5);
    } else if (bandFilter === 'band7') {
      combined = combined.filter(d => parseFloat(d.bandLevel) === 7.0 || parseFloat(d.bandLevel) === 7.5);
    } else if (bandFilter === 'band8') {
      combined = combined.filter(d => parseFloat(d.bandLevel) >= 8.0);
    }

    // Auto-hide drills that the learner has already pronounced accurately (>= 80%),
    // while keeping `justPassedDrillId` visible until the user advances to the next item.
    if (hidePassed) {
      const passedSet = new Set(Array.isArray(passedDrillIds) ? passedDrillIds : []);
      combined = combined.filter(
        d => d.id === justPassedDrillId || !passedSet.has(d.id)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      combined = combined.filter(
        d =>
          d.ipaSymbol?.toLowerCase().includes(q) ||
          d.sampleWord?.toLowerCase().includes(q) ||
          d.targetText?.toLowerCase().includes(q) ||
          d.topicEn?.toLowerCase().includes(q) ||
          d.topicVi?.toLowerCase().includes(q) ||
          d.categoryEn?.toLowerCase().includes(q) ||
          d.categoryVi?.toLowerCase().includes(q) ||
          d.meaningEn?.toLowerCase().includes(q) ||
          d.meaningVi?.toLowerCase().includes(q)
      );
    }

    return combined;
  }, [allUnfilteredForTab, activeTab, ipaGroupFilter, twisterGroupFilter, bandFilter, hidePassed, passedDrillIds, justPassedDrillId, searchQuery, pronStats?.bestScores]);

  const currentDrill = activeTrackDrills[selectedIdx] || activeTrackDrills[0] || null;
  const clipKey = currentDrill ? `pron_clip_${currentDrill.id}` : 'pron_clip_default';
  const currentAudioClip = speechEngine.audioClips[clipKey];

  const handleAdvanceToNextDrill = useCallback(() => {
    const wasShowingJustPassed =
      hidePassed && justPassedDrillId && currentDrill?.id === justPassedDrillId;
    setJustPassedDrillId(null);
    if (wasShowingJustPassed) {
      // Removing the current passed item naturally shifts the next unpassed item into selectedIdx
      setSelectedIdx(prev => Math.max(0, Math.min(prev, activeTrackDrills.length - 2)));
    } else {
      setSelectedIdx(prev => (prev < activeTrackDrills.length - 1 ? prev + 1 : 0));
    }
  }, [hidePassed, justPassedDrillId, currentDrill?.id, activeTrackDrills.length]);

  const handlePickRandomDrill = useCallback(() => {
    if (activeTrackDrills.length <= 1) return;
    let nextIdx = selectedIdx;
    for (let tries = 0; tries < 6 && nextIdx === selectedIdx; tries++) {
      nextIdx = Math.floor(Math.random() * activeTrackDrills.length);
    }
    setJustPassedDrillId(null);
    setSelectedIdx(nextIdx);
    setIsMobileListOpen(false);
  }, [activeTrackDrills.length, selectedIdx]);

  // Receive struggled words sent directly from /conversation Summary Card
  useEffect(() => {
    const focusWords = initialOptions?.focusWords;
    if (!isOpen || !Array.isArray(focusWords) || focusWords.length === 0) return;
    const signature = focusWords.map(w => w?.cleanWord || w?.word || '').join('|');
    if (!signature || handledFocusRef.current === signature) return;
    handledFocusRef.current = signature;

    setActiveTab('words');
    setSearchQuery('');
    setBandFilter('all');

    const builtInWords = new Set(
      PRONUNCIATION_WORD_DRILLS.map(d => d.targetText?.toLowerCase().trim())
    );
    const existingCustomList = Array.isArray(customDrills) ? customDrills : [];
    const existingCustomTexts = new Set(
      existingCustomList.map(d => d.targetText?.toLowerCase().trim())
    );

    const newDrills = [];
    const targetCleanWords = [];
    focusWords.slice(0, 8).forEach((item, idx) => {
      const rawWord = String(item?.word || item?.cleanWord || '').trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
      if (!rawWord) return;
      const lower = rawWord.toLowerCase();
      targetCleanWords.push(lower);
      if (!builtInWords.has(lower) && !existingCustomTexts.has(lower)) {
        existingCustomTexts.add(lower);
        const note = item?.missingCoda
          ? isEn
            ? `From Conversation Studio (${item.similarity ?? 0}% — watch ending consonant)`
            : `Từ Hội Thoại (${item.similarity ?? 0}% — chú ý bật rõ âm đuôi)`
          : isEn
          ? `From Conversation Studio (scored ${item?.similarity ?? 0}%)`
          : `Từ Hội Thoại (đạt ${item?.similarity ?? 0}% — cần luyện thêm)`;
        const drill = buildCustomPronunciationDrill({
          text: rawWord,
          type: 'words',
          bandLevel: '7.0',
          topic: isEn ? 'From Conversation' : 'Từ Hội Thoại',
          meaning: note
        });
        drill.id = `pron-conv-${Date.now()}-${idx}`;
        newDrills.push(drill);
      }
    });

    if (newDrills.length > 0) {
      const nextCustom = [...newDrills, ...existingCustomList];
      setCustomDrills(nextCustom);
      safeSet(CUSTOM_DRILLS_STORAGE_KEY, nextCustom);
    }

    // Ensure these target words are not hidden if previously passed
    if (targetCleanWords.length > 0) {
      const targetSet = new Set(targetCleanWords);
      setPassedDrillIds(prev => {
        const list = Array.isArray(prev) ? prev : [];
        const allBuiltIn = PRONUNCIATION_WORD_DRILLS.filter(d => targetSet.has(d.targetText?.toLowerCase().trim())).map(d => d.id);
        const allCustom = existingCustomList.filter(d => targetSet.has(d.targetText?.toLowerCase().trim())).map(d => d.id);
        const removeSet = new Set([...allBuiltIn, ...allCustom]);
        if (removeSet.size === 0) return list;
        const nextList = list.filter(id => !removeSet.has(id));
        if (nextList.length !== list.length) {
          safeSet(passedStorageKey, nextList);
        }
        return nextList;
      });
    }

    setSelectedIdx(0);
    setImportedFocusBanner({
      count: targetCleanWords.length,
      firstWord: targetCleanWords[0] || ''
    });
  }, [isOpen, initialOptions?.focusWords]);

  // Reset evaluation when switching drill
  useEffect(() => {
    sessionTokenRef.current += 1;
    if (compareTimerRef.current) {
      clearTimeout(compareTimerRef.current);
      compareTimerRef.current = null;
    }
    if (speechEngine.isListening) {
      speechEngine.stopListening();
    }
    if (speechEngine.isSpeaking) {
      speechEngine.stopSpeaking();
    }
    if (userAudioRef.current) {
      try {
        userAudioRef.current.pause();
        userAudioRef.current.currentTime = 0;
      } catch (e) {}
    }
    setIsPlayingUserClip(false);
    setIsComparingAudio(false);
    setEvaluationResult(null);
    setManualSpokenInput('');
    setAttemptCount(0);
    setIsWaitingForRetrySpeech(false);
    setShowTips(false);
    setIsDeepAiGrading(false);
    setDeepAiError('');
    attemptCountRef.current = 0;
    hasAwardedXpRef.current = false;
    lastAutoEvaluatedRef.current = '';
    liveSpokenTextRef.current = '';
    twisterSpeakStartRef.current = 0;
    speechEngine.resetTranscript();
  }, [currentDrill?.id]);

  // Clean up audio on modal close
  useEffect(() => {
    if (!isOpen) {
      sessionTokenRef.current += 1;
      if (compareTimerRef.current) {
        clearTimeout(compareTimerRef.current);
        compareTimerRef.current = null;
      }
      if (speechEngine.isListening) speechEngine.stopListening();
      if (speechEngine.isSpeaking) speechEngine.stopSpeaking();
      if (userAudioRef.current) {
        try {
          userAudioRef.current.pause();
        } catch (e) {}
      }
      setIsPlayingUserClip(false);
      setIsComparingAudio(false);
    }
  }, [isOpen]);

  // Keyboard shortcuts: Alt+Z fullscreen, Esc close, Space Mic, L/R Listen, ArrowLeft/Right Navigate
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        toggleExpanded();
        return;
      }
      if (e.key === 'Escape' && !isCreatorOpen) {
        onClose?.();
        return;
      }
      if (isCreatorOpen || isMobileListOpen) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) {
        return;
      }
      if (e.code === 'Space' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleToggleRecordingRef.current?.();
      } else if ((e.key === 'l' || e.key === 'L' || e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handlePlayModelRef.current?.();
      } else if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleAdvanceToNextDrillRef.current?.();
      } else if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setJustPassedDrillId(null);
        setSelectedIdx(prev => (prev > 0 ? prev - 1 : Math.max(0, activeTrackDrills.length - 1)));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCreatorOpen, isMobileListOpen, onClose, activeTrackDrills.length]);

  // Award XP and update stats upon completing a pronunciation evaluation
  const awardPronunciationXp = useCallback(
    async (evalRes, drill) => {
      if (!evalRes || !drill || evalRes.xpEarned <= 0) return;

      const nextStreak = evalRes.overallAccuracy >= 65 ? (pronStats.streak || 0) + 1 : 0;
      const milestoneBonus = nextStreak > 0 && nextStreak % 5 === 0 ? 25 : 0;
      const totalDeltaXp = evalRes.xpEarned + milestoneBonus;

      // 1. Update local pronunciation stats
      const prevBest = pronStats.bestScores?.[drill.id];
      const updatedStats = {
        totalXpEarned: (pronStats.totalXpEarned || 0) + totalDeltaXp,
        completedCount: (pronStats.completedCount || 0) + 1,
        streak: nextStreak,
        bestScores: {
          ...(pronStats.bestScores || {}),
          [drill.id]: {
            accuracy: Math.max(prevBest?.accuracy || 0, evalRes.overallAccuracy),
            band: evalRes.estimatedBand,
            xp: (prevBest?.xp || 0) + totalDeltaXp,
            updatedAt: new Date().toISOString()
          }
        }
      };
      setPronStats(updatedStats);
      safeSet(PRONUNCIATION_STATS_STORAGE_KEY, updatedStats);

      // 2. Award Global Platform XP & Check Level Up
      const oldLevel = calculateLevelFromXp(userTotalXp);
      const newTotalXp = userTotalXp + totalDeltaXp;
      const newLevel = calculateLevelFromXp(newTotalXp);

      setUserTotalXp(newTotalXp);
      setSessionXp(prev => prev + totalDeltaXp);

      // 3. Show Floating XP Toast (Gold is strictly earned in Atlas English Arena)
      setXpToast({
        xp: totalDeltaXp,
        milestoneBonus,
        streak: nextStreak,
        accuracy: evalRes.overallAccuracy
      });
      setTimeout(() => {
        setXpToast(null);
      }, 3600);

      if (newLevel > oldLevel) {
        const tierInfo = getLevelTierInfo(newLevel);
        setLevelUpBanner({
          oldLevel,
          newLevel,
          tier: tierInfo
        });
      }

      // 5. Persist to Global Leaderboard & User Profile Storage
      try {
        const globalStreak = Math.max(1, getUnifiedStreakCount());
        await submitRealSprintScore({
          currentUser,
          deltaXp: totalDeltaXp,
          streakCount: globalStreak
        });
      } catch (e) {
        console.warn('[Pronunciation XP] Sync notice:', e);
      }
    },
    [pronStats, userTotalXp, currentUser]
  );

  // Run scoring on spoken transcript (with Auto-Retry on < 80% and Auto-Stop on >= 80%)
  const handleRunEvaluation = useCallback(
    (spokenTextToEvaluate, { isAutoTriggered = false } = {}) => {
      if (!currentDrill) return;
      const cleanSpoken = String(spokenTextToEvaluate || '').trim();
      const confidence = speechEngine.speechConfidenceStats?.averageConfidence || 0.88;
      const alternatives = speechEngine.speechAlternativesRef?.current || [];
      const acousticMetrics = speechEngine.getAcousticMetrics ? speechEngine.getAcousticMetrics() : null;

      const result =
        currentDrill.type === 'ipa' && ipaPracticeMode === 'sound'
          ? evaluateIsolatedIpaSoundAttempt({
              drill: currentDrill,
              spokenText: cleanSpoken,
              confidence,
              streak: pronStats.streak || 0,
              alternatives,
              acousticMetrics
            })
          : currentDrill.type === 'ipa' && ipaPracticeMode === 'duel'
          ? evaluateMinimalPairDuelAttempt({
              drill: currentDrill,
              spokenText: cleanSpoken,
              confidence,
              streak: pronStats.streak || 0,
              alternatives
            })
          : currentDrill.type === 'twisters'
          ? evaluateTwisterAttempt({
              drill: currentDrill,
              spokenText: cleanSpoken,
              confidence,
              streak: pronStats.streak || 0,
              alternatives,
              acousticMetrics,
              durationSeconds:
                twisterSpeakStartRef.current > 0
                  ? (Date.now() - twisterSpeakStartRef.current) / 1000
                  : null
            })
          : evaluatePronunciationAttempt({
              targetText: currentDrill.targetText,
              spokenText: cleanSpoken,
              confidence,
              itemType: currentDrill.type,
              streak: pronStats.streak || 0,
              alternatives,
              acousticMetrics
            });

      setDeepAiError('');

      const isPassed = result.overallAccuracy >= PRONUNCIATION_PASS_THRESHOLD;
      const nextAttempt = attemptCountRef.current + 1;
      attemptCountRef.current = nextAttempt;
      setAttemptCount(nextAttempt);

      setEvaluationResult({
        ...result,
        spokenTranscript: cleanSpoken,
        isPassed,
        attemptNumber: nextAttempt
      });

      if (isPassed) {
        // Passed (>= 80%): Auto-stop microphone, record passed ID (auto-hide on next switch), play chime & award XP
        setIsWaitingForRetrySpeech(false);
        setJustPassedDrillId(currentDrill.id);
        setPassedDrillIds(prev => {
          const prevList = Array.isArray(prev) ? prev : [];
          if (prevList.includes(currentDrill.id)) return prevList;
          const nextList = [...prevList, currentDrill.id];
          safeSet(passedStorageKey, nextList);
          eventBus.emit('batch_progress_updated');
          return nextList;
        });
        if (speechEngine.isListening) {
          speechEngine.stopListening();
        }
        speakingSoundEffects.playCompletionChime();
        triggerHaptic('combo');
        if (result.overallAccuracy > 0 && result.xpEarned > 0 && !hasAwardedXpRef.current) {
          hasAwardedXpRef.current = true;
          awardPronunciationXp(result, currentDrill);
        }
      } else {
        // Needs Retry (< 80%): Auto-reveal Mouth Tip & Trap, play gentle retry cue, keep mic active & reset buffer if in Auto Mode
        setShowTips(true);
        speakingSoundEffects.playRetryChime();
        triggerHaptic('wrong');
        if (isAutoMode && speechEngine.isListening) {
          setIsWaitingForRetrySpeech(true);
          lastAutoEvaluatedRef.current = '';
          liveSpokenTextRef.current = '';
          speechEngine.resetTranscript({ restartRecognition: true });
        } else if (!isAutoTriggered && result.overallAccuracy > 0 && result.xpEarned > 0 && !hasAwardedXpRef.current) {
          hasAwardedXpRef.current = true;
          awardPronunciationXp(result, currentDrill);
        }
      }
    },
    [
      currentDrill,
      speechEngine.speechConfidenceStats,
      speechEngine.isListening,
      speechEngine.stopListening,
      speechEngine.resetTranscript,
      pronStats.streak,
      awardPronunciationXp,
      isAutoMode,
      ipaPracticeMode
    ]
  );

  useEffect(() => {
    handleRunEvaluationRef.current = handleRunEvaluation;
  }, [handleRunEvaluation]);

  // Layer 2: Native Multimodal AI Audio Deep Check (listens directly to raw voice blob)
  const handleDeepAiAudioCheck = async () => {
    if (!currentDrill || !currentAudioClip?.blob || !apiKey || isDeepAiGrading) return;
    setIsDeepAiGrading(true);
    setDeepAiError('');
    try {
      const updated = await runLayer2PronunciationCheck({
        audioBlob: currentAudioClip.blob,
        targetText: currentDrill.targetText,
        ipa: selectedExaminerId === 'examiner-oliver' ? currentDrill.ipaUs : currentDrill.ipaUk,
        itemType: currentDrill.type,
        apiKey,
        model,
        isEn,
        passThreshold: PRONUNCIATION_PASS_THRESHOLD,
        prevEval: evaluationResult
      });
      setEvaluationResult(updated);
    } catch (err) {
      setDeepAiError(err.message || (isEn ? 'AI Audio evaluation failed.' : 'Không thể chấm sâu bằng AI Audio.'));
    } finally {
      setIsDeepAiGrading(false);
    }
  };

  // Keep liveSpokenTextRef synced and run Smart End-of-Utterance Auto-Evaluation when Auto Mode is enabled
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
    if (!isOpen || !isAutoMode || !speechEngine.isListening || !currentDrill || !liveSpokenText) {
      return;
    }

    // User has started speaking again
    setIsWaitingForRetrySpeech(false);
    if (!twisterSpeakStartRef.current) {
      twisterSpeakStartRef.current = Date.now();
    }

    if (liveSpokenText === lastAutoEvaluatedRef.current) {
      return;
    }

    const targetWordCount =
      currentDrill.type === 'ipa' && ipaPracticeMode === 'sound'
        ? 1
        : currentDrill.type === 'ipa' && ipaPracticeMode === 'duel'
        ? 2
        : currentDrill.targetText
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;
    const spokenWordCount = liveSpokenText.split(/\s+/).filter(Boolean).length;
    const isFinalized = Boolean(speechEngine.transcript && !speechEngine.interimTranscript);

    let delayMs = 950;
    if (spokenWordCount >= targetWordCount) {
      if (targetWordCount <= 1) {
        delayMs = isFinalized ? 380 : 550;
      } else if (targetWordCount <= 5) {
        delayMs = 750;
      } else {
        delayMs = 950;
      }
    } else {
      if (targetWordCount <= 1) {
        delayMs = 950;
      } else if (targetWordCount <= 5) {
        delayMs = 1500;
      } else {
        delayMs = 2100;
      }
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
    currentDrill
  ]);

  // Play native TTS model
  const handlePlayModel = (customRate = null, textOverride = null) => {
    if (!currentDrill && !textOverride) return;
    sessionTokenRef.current += 1;
    if (compareTimerRef.current) {
      clearTimeout(compareTimerRef.current);
      compareTimerRef.current = null;
    }
    setIsComparingAudio(false);
    if (speechEngine.isListening) {
      speechEngine.stopListening();
    }
    const defaultModelText =
      currentDrill?.type === 'ipa' && ipaPracticeMode === 'sound'
        ? currentDrill.pureSoundCue || currentDrill.sampleWord || currentDrill.targetText
        : currentDrill?.type === 'ipa' && ipaPracticeMode === 'duel'
        ? currentDrill.minimalPair?.speakText || currentDrill.targetText
        : currentDrill?.targetText;
    const textToSpeak = textOverride || defaultModelText;
    const rateToUse = customRate || playbackSpeed;
    speechEngine.speak(textToSpeak, {
      examinerId: selectedExaminerId,
      rate: rateToUse,
      silentChime: true
    });
  };

  // Play native model at 0.85x and automatically open microphone immediately after for seamless retry
  const handleListenAndRetry = () => {
    if (!currentDrill) return;
    const token = ++sessionTokenRef.current;
    if (compareTimerRef.current) {
      clearTimeout(compareTimerRef.current);
      compareTimerRef.current = null;
    }
    setIsComparingAudio(false);
    if (speechEngine.isListening) {
      speechEngine.stopListening();
    }
    setIsWaitingForRetrySpeech(false);
    speechEngine.resetTranscript();
    const retryModelText =
      currentDrill.type === 'ipa' && ipaPracticeMode === 'sound'
        ? currentDrill.pureSoundCue || currentDrill.sampleWord || currentDrill.targetText
        : currentDrill.type === 'ipa' && ipaPracticeMode === 'duel'
        ? currentDrill.minimalPair?.speakText || currentDrill.targetText
        : currentDrill.targetText;
    speechEngine.speak(
      retryModelText,
      { examinerId: selectedExaminerId, rate: Math.min(playbackSpeed, 0.8), silentChime: true },
      async () => {
        if (token !== sessionTokenRef.current) return;
        lastAutoEvaluatedRef.current = '';
        liveSpokenTextRef.current = '';
        if (speechEngine.deleteAudioClip) {
          speechEngine.deleteAudioClip(clipKey);
        }
        try {
          await speechEngine.startListening(clipKey);
          if (token === sessionTokenRef.current) {
            setIsWaitingForRetrySpeech(true);
          }
        } catch (err) {
          if (token === sessionTokenRef.current) {
            setShowManualFallback(true);
          }
        }
      }
    );
  };

  // Start / Stop Microphone Recording
  const handleToggleRecording = async () => {
    if (!currentDrill) return;
    const token = ++sessionTokenRef.current;
    if (compareTimerRef.current) {
      clearTimeout(compareTimerRef.current);
      compareTimerRef.current = null;
    }
    setIsComparingAudio(false);

    if (speechEngine.isListening) {
      const capturedBeforeStop = liveSpokenTextRef.current;
      speechEngine.stopListening();
      setIsWaitingForRetrySpeech(false);
      // Wait 260ms for final transcript buffer flush, then evaluate
      setTimeout(() => {
        if (token !== sessionTokenRef.current) return;
        const captured =
          speechEngine.getLatestTranscript?.() ||
          liveSpokenTextRef.current ||
          capturedBeforeStop ||
          speechEngine.transcriptsByClip?.[clipKey] ||
          '';
        if (captured.trim()) {
          handleRunEvaluationRef.current?.(captured, { isAutoTriggered: false });
        } else {
          // If browser STT didn't return text (e.g. Firefox/Safari without Web Speech STT), open quick self-check / transcript box
          setShowManualFallback(true);
        }
      }, 260);
    } else {
      if (speechEngine.isSpeaking) {
        speechEngine.stopSpeaking();
      }
      setEvaluationResult(null);
      setIsWaitingForRetrySpeech(false);
      lastAutoEvaluatedRef.current = '';
      liveSpokenTextRef.current = '';
      speechEngine.resetTranscript();
      if (speechEngine.deleteAudioClip) {
        speechEngine.deleteAudioClip(clipKey);
      }
      try {
        await speechEngine.startListening(clipKey);
      } catch (err) {
        setShowManualFallback(true);
      }
    }
  };

  // Play user's recorded voice clip
  const handleReplayUserAudio = () => {
    if (!currentAudioClip?.url) return;
    if (speechEngine.isSpeaking) speechEngine.stopSpeaking();

    if (!userAudioRef.current) {
      userAudioRef.current = new Audio(currentAudioClip.url);
    } else if (userAudioRef.current.src !== currentAudioClip.url) {
      userAudioRef.current.src = currentAudioClip.url;
    }

    userAudioRef.current.onended = () => {
      setIsPlayingUserClip(false);
      setIsComparingAudio(false);
    };
    userAudioRef.current.onerror = () => {
      setIsPlayingUserClip(false);
      setIsComparingAudio(false);
    };

    if (isPlayingUserClip) {
      userAudioRef.current.pause();
      userAudioRef.current.currentTime = 0;
      setIsPlayingUserClip(false);
    } else {
      userAudioRef.current
        .play()
        .then(() => setIsPlayingUserClip(true))
        .catch(() => setIsPlayingUserClip(false));
    }
  };

  // Compare Side-by-Side: Plays Native Model first, then immediately plays User's Recording
  const handleCompareSideBySide = () => {
    if (!currentDrill || !currentAudioClip?.url) return;
    if (isComparingAudio) {
      sessionTokenRef.current += 1;
      if (compareTimerRef.current) {
        clearTimeout(compareTimerRef.current);
        compareTimerRef.current = null;
      }
      speechEngine.stopSpeaking();
      if (userAudioRef.current) {
        try {
          userAudioRef.current.pause();
          userAudioRef.current.currentTime = 0;
        } catch (e) {}
      }
      setIsPlayingUserClip(false);
      setIsComparingAudio(false);
      return;
    }

    const token = ++sessionTokenRef.current;
    if (compareTimerRef.current) {
      clearTimeout(compareTimerRef.current);
      compareTimerRef.current = null;
    }
    if (speechEngine.isListening) speechEngine.stopListening();
    setIsComparingAudio(true);
    speechEngine.speak(
      currentDrill.targetText,
      { examinerId: selectedExaminerId, rate: playbackSpeed, silentChime: true },
      () => {
        if (token !== sessionTokenRef.current) return;
        compareTimerRef.current = setTimeout(() => {
          compareTimerRef.current = null;
          if (token !== sessionTokenRef.current) return;
          handleReplayUserAudio();
        }, 280);
      }
    );
  };

  // Sync refs for Desktop Keyboard Shortcuts
  useEffect(() => {
    handleToggleRecordingRef.current = handleToggleRecording;
    handlePlayModelRef.current = () => handlePlayModel(playbackSpeed);
    handleAdvanceToNextDrillRef.current = handleAdvanceToNextDrill;
  });

  // Save custom drill returned by PronunciationCustomDrillModal
  const handleCreatedCustomDrill = (newDrill) => {
    if (!newDrill) return;
    const nextList = [newDrill, ...(Array.isArray(customDrills) ? customDrills : [])];
    setCustomDrills(nextList);
    safeSet(CUSTOM_DRILLS_STORAGE_KEY, nextList);
    setIsCreatorOpen(false);
    handleSelectTab(newDrill.type);
    setSelectedIdx(0);
  };

  const handleDeleteCustomDrill = (drillId, e) => {
    e?.stopPropagation();
    const nextList = (Array.isArray(customDrills) ? customDrills : []).filter(d => d.id !== drillId);
    setCustomDrills(nextList);
    safeSet(CUSTOM_DRILLS_STORAGE_KEY, nextList);
    if (selectedIdx >= activeTrackDrills.length - 1) {
      setSelectedIdx(Math.max(0, activeTrackDrills.length - 2));
    }
  };

  const handleShareUrl = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/pronunciation${activeTab !== 'words' ? `?tab=${activeTab}` : ''}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  const handleSaveCurrentToVocab = () => {
    if (!currentDrill || !onSaveToNotebook) return;
    onSaveToNotebook({
      id: `vocab-pron-${currentDrill.id}`,
      word: currentDrill.targetText,
      meaning: isEn ? currentDrill.meaningEn : currentDrill.meaningVi,
      example: isEn ? currentDrill.exampleEn || currentDrill.targetText : currentDrill.exampleVi || currentDrill.targetText,
      band: `Band ${currentDrill.bandLevel || '7.0'}`,
      topic: isEn ? currentDrill.topicEn : currentDrill.topicVi
    });
    setSavedToVaultToast(true);
    setTimeout(() => setSavedToVaultToast(false), 2200);
  };

  if (!isOpen) return null;

  const isMastered = currentDrill && Array.isArray(masteredIds) && masteredIds.includes(currentDrill.id);
  const currentBest = currentDrill ? pronStats.bestScores?.[currentDrill.id] : null;

  // Shared Filter & Drill List renderer for both Desktop Sidebar and Mobile Bottom Sheet (DRY)
  const renderDrillListContent = (isMobileSheet = false) => (
    <>
      <div className="p-3 border-b border-slate-800/80 space-y-2 shrink-0">
        {activeTab !== 'ipa' && trackBatches.length > 0 && (
          <BatchSelectorStrip
            batches={trackBatches}
            selectedBatchIndex={selectedBatchIndex}
            onSelectBatch={handleSelectBatch}
            personalCount={personalDrillsForTab.length}
            isEn={isEn}
            isMobileSheet={isMobileSheet}
          />
        )}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSelectedIdx(0);
              }}
              placeholder={
                isEn
                  ? 'Search words, phrases, or topics...'
                  : 'Tìm từ, cụm từ, câu hoặc chủ đề...'
              }
              className={`w-full pl-8 pr-7 ${isMobileSheet ? 'py-2 bg-slate-950' : 'py-1.5 bg-slate-900'} rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIdx(0);
                }}
                aria-label={isEn ? 'Clear search' : 'Xóa từ khóa'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handlePickRandomDrill}
            disabled={activeTrackDrills.length <= 1}
            title={isEn ? 'Pick a random drill' : 'Chọn ngẫu nhiên 1 bài'}
            aria-label={isEn ? 'Pick a random drill' : 'Chọn ngẫu nhiên 1 bài'}
            className={`${
              isMobileSheet
                ? 'px-2.5 py-2 bg-slate-950 border-indigo-500/30 text-[11px] font-bold flex items-center space-x-1'
                : 'p-1.5 bg-slate-900 hover:bg-indigo-600/20 border-slate-800 hover:border-indigo-500/40'
            } rounded-xl text-indigo-300 border disabled:opacity-40 cursor-pointer shrink-0 transition-colors`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            {isMobileSheet && <span>{isEn ? 'Random' : 'Ngẫu nhiên'}</span>}
          </button>
        </div>

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {activeTab === 'ipa'
              ? [
                  ...IPA_SOUND_GROUPS,
                  ...(weakCountInTab > 0
                    ? [{ id: 'weak', labelEn: `Needs Polish (${weakCountInTab})`, labelVi: `Cần sửa (${weakCountInTab})` }]
                    : [])
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setIpaGroupFilter(g.id);
                      setSelectedIdx(0);
                    }}
                    className={`${isMobileSheet ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[10px]'} rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                      ipaGroupFilter === g.id
                        ? g.id === 'weak'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-600 text-white'
                        : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-400 hover:text-slate-200 border border-slate-800`
                    }`}
                  >
                    {isEn ? g.labelEn : g.labelVi}
                  </button>
                ))
              : activeTab === 'twisters'
              ? [
                  ...TWISTER_GROUPS,
                  ...(weakCountInTab > 0
                    ? [{ id: 'weak', labelEn: `Needs Polish (${weakCountInTab})`, labelVi: `Cần sửa (${weakCountInTab})` }]
                    : [])
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setTwisterGroupFilter(g.id);
                      setSelectedIdx(0);
                    }}
                    className={`${isMobileSheet ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[10px]'} rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                      twisterGroupFilter === g.id
                        ? g.id === 'weak'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-fuchsia-600 text-white'
                        : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-400 hover:text-slate-200 border border-slate-800`
                    }`}
                  >
                    {isEn ? g.labelEn : g.labelVi}
                  </button>
                ))
              : [
                  { id: 'all', label: isEn ? 'All' : 'Tất cả' },
                  ...(weakCountInTab > 0
                    ? [{ id: 'weak', label: isEn ? `Needs Polish (${weakCountInTab})` : `Cần sửa (${weakCountInTab})` }]
                    : []),
                  { id: 'foundation', label: 'Band 5.5-6.5' },
                  { id: 'band7', label: 'Band 7.0-7.5' },
                  { id: 'band8', label: 'Band 8.0+' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setBandFilter(b.id);
                      setSelectedIdx(0);
                    }}
                    className={`${isMobileSheet ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[10px]'} rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                      bandFilter === b.id
                        ? b.id === 'weak'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-indigo-600 text-white'
                        : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-400 hover:text-slate-200 border border-slate-800`
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
          </div>

          <button
            type="button"
            onClick={toggleHidePassed}
            className={`${isMobileSheet ? 'px-2.5 py-1.5 text-[11px]' : 'px-2 py-1 text-[10px]'} rounded-lg font-bold whitespace-nowrap cursor-pointer border ${
              hidePassed
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : `${isMobileSheet ? 'bg-slate-950' : 'bg-slate-900'} text-slate-400 border-slate-800`
            }`}
            title={isEn ? 'Auto-hide items you already pronounced accurately (≥80%)' : 'Tự động ẩn bài đã phát âm chuẩn (≥80%)'}
          >
            {isEn
              ? `Hide Passed (${passedCountInTab})`
              : `Ẩn đã đạt (${passedCountInTab})`}
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${isMobileSheet ? 'p-3 space-y-2' : 'p-2 space-y-1.5'} overscroll-contain`}>
        {activeBatchObj && !activeBatchObj.isUnlocked ? (
          <BatchUnlockGateCard
            targetBatch={activeBatchObj}
            compact
            isEn={isEn}
            onUnlockBatch={handlePurchaseBatch}
            onGoToPrevBatch={(prevIdx) => handleSelectBatch(prevIdx)}
            onOpenAuth={onOpenAuth}
            onOpenArena={handleOpenArenaSafe}
          />
        ) : activeTrackDrills.length === 0 && nextLockedBatchAfterCurrent && activeBatchObj?.isCompleted ? (
          <BatchUnlockGateCard
            targetBatch={nextLockedBatchAfterCurrent}
            isCelebrationMode
            compact
            isEn={isEn}
            onUnlockBatch={handlePurchaseBatch}
            onOpenAuth={onOpenAuth}
            onOpenArena={handleOpenArenaSafe}
            onShowCompletedItems={toggleHidePassed}
          />
        ) : isLoadingBatchShard ? (
          <div className="p-6 text-center text-xs text-indigo-300 space-y-2 animate-pulse">
            <p className="font-bold">
              {isEn
                ? `Loading Batch ${activeBatchObj?.batchIndex || ''}...`
                : `Đang tải Lô ${activeBatchObj?.batchIndex || ''}...`}
            </p>
          </div>
        ) : activeTrackDrills.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-2.5">
            <p>
              {passedCountInTab > 0 && hidePassed
                ? isEn
                  ? `🎉 You've mastered all ${passedCountInTab} drills! Add new words (with collocation & example sentence) to your Vocab Notebook to keep practicing.`
                  : `🎉 Bạn đã phát âm chuẩn toàn bộ ${passedCountInTab} bài! Hãy chủ động thêm từ mới (kèm cụm từ đi kèm & câu ví dụ) vào Sổ Tay để luyện tiếp.`
                : isEn
                ? 'No pronunciation drills match your filter.'
                : 'Không có bài tập phát âm nào khớp bộ lọc.'}
            </p>
            <div className="flex flex-col gap-1.5 items-center">
              {currentUser && onOpenVocabNotebook && passedCountInTab > 0 && hidePassed && (
                <button
                  type="button"
                  onClick={() => onOpenVocabNotebook()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer"
                >
                  {isEn ? '+ Add Word to Notebook' : '+ Thêm từ vào Sổ Tay'}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setBandFilter('all');
                  if (hidePassed && passedCountInTab > 0) {
                    toggleHidePassed();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
              >
                {passedCountInTab > 0 && hidePassed
                  ? isEn
                    ? `Show Passed Drills (${passedCountInTab})`
                    : `Hiện lại bài đã đạt (${passedCountInTab})`
                  : isEn
                  ? 'Reset Filters'
                  : 'Đặt lại bộ lọc'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTrackDrills.map((item, idx) => {
              const isSelected = currentDrill?.id === item.id;
              const best = pronStats.bestScores?.[item.id];
              const itemMastered = Array.isArray(masteredIds) && masteredIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setJustPassedDrillId(null);
                    setSelectedIdx(idx);
                    if (isMobileSheet) setIsMobileListOpen(false);
                  }}
                  className={`group w-full ${isMobileSheet ? 'p-3 min-h-[54px] active:scale-98' : 'p-2.5'} rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-950/75 border-indigo-500/60 shadow-md'
                      : `${isMobileSheet ? 'bg-slate-950/70' : 'bg-slate-900/70 hover:bg-slate-900'} border-slate-800/80`
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      {item.ipaSymbol ? (
                        <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {item.ipaSymbol}
                        </span>
                      ) : item.phonemeTag ? (
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                          {item.phonemeTag}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300">
                          Band {item.bandLevel}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 truncate">
                        {isEn ? item.topicEn : item.topicVi}
                      </span>
                      {item.isFromVocabVault && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          {isEn ? '📒 Vault' : '📒 Sổ Tay'}
                        </span>
                      )}
                      {item.isCustom && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                          {isEn ? 'Custom' : 'Tự tạo'}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-extrabold text-white truncate">
                      {item.targetText}
                    </div>
                    {!isMobileSheet && (
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {isEn ? item.meaningEn : item.meaningVi}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    {best ? (
                      <span
                        className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black ${
                          best.accuracy >= 85
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {best.accuracy}%
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 text-amber-400">
                        +{item.xpReward} XP
                      </span>
                    )}

                    <div className="flex items-center space-x-1">
                      {itemMastered && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {item.isCustom && (
                        <button
                          type="button"
                          onClick={e => handleDeleteCustomDrill(item.id, e)}
                          className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                          title={isEn ? 'Delete custom drill' : 'Xóa bài tập tự tạo'}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Guest Unlock Prompt Card */}
            {!currentUser && lockedCountForGuest > 0 && (
              <button
                type="button"
                onClick={() => onOpenAuth?.()}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-purple-950/70 border border-indigo-500/30 hover:border-indigo-400/60 text-left space-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-xs font-black text-indigo-300">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isEn
                      ? `Unlock +${lockedCountForGuest} Pro Drills & Vocab Sync`
                      : `Mở khóa thêm +${lockedCountForGuest} bài & Sổ Tay Từ Vựng`}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {isEn
                    ? 'Sign in free to unlock Band 7.0-8.5+ drills and practice words from your personal notebook.'
                    : 'Đăng nhập miễn phí để mở kho nâng cao và luyện phát âm chính các từ trong Sổ Tay của bạn.'}
                </p>
              </button>
            )}
          </>
        )}
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
        {/* ================================================================= */}
        {/* 1. COMPACT UNIFIED TOP HEADER (1 SINGLE ROW ON DESKTOP lg+)       */}
        {/* ================================================================= */}
        <header className="px-3 sm:px-4 py-2 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          {/* Brand + Inline Desktop Track Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
              <h2 className="text-xs sm:text-sm font-black text-white tracking-tight truncate">
                {isEn ? 'Pronunciation Studio' : 'Luyện Phát Âm'}
              </h2>
              {/* Compact Mobile XP + Level Pill (< sm) */}
              <span className={`sm:hidden px-1.5 py-0.5 rounded-md text-[10px] font-black border shrink-0 ${levelProgress.tier.badgeColor}`}>
                Lv.{levelProgress.level}
              </span>
              <span className="sm:hidden inline-flex items-center space-x-0.5 text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-md text-[10px] font-black shrink-0">
                <Zap className="w-2.5 h-2.5 fill-current" />
                <span>+{sessionXp}</span>
              </span>
            </div>

            {/* Inline Track Switcher on Desktop (lg+) to save an entire vertical bar */}
            <div className="hidden lg:inline-flex bg-slate-900 border border-slate-800 rounded-xl p-0.5 shrink-0">
              {PRONUNCIATION_TRACKS.map(track => {
                const isActive = activeTab === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleSelectTab(track.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? `bg-gradient-to-r ${track.badgeColor} text-white shadow-sm`
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isEn ? track.labelEn : track.labelVi}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Inline Desktop Speed Modes + Compact Audio Pill + XP + Actions */}
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

            {/* Compact Desktop Audio Settings Toggle (lg+) */}
            <button
              type="button"
              onClick={() => setIsDesktopSettingsOpen(prev => !prev)}
              className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-colors ${
                isDesktopSettingsOpen
                  ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title={isEn ? 'Accent & Playback Speed Settings' : 'Cài đặt Giọng đọc & Tốc độ'}
            >
              <Sliders className="w-3 h-3 text-indigo-400 shrink-0" />
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
              <span
                className="inline-flex items-center space-x-0.5 text-amber-400"
                title={isEn ? 'Consecutive clear pronunciation streak' : 'Chuỗi phát âm chuẩn liên tiếp'}
              >
                <Flame className="w-3 h-3 fill-current" />
                <span>{pronStats.streak || 0}</span>
              </span>
            </div>

            {onOpenConversation && (
              <button
                type="button"
                onClick={onOpenConversation}
                className="flex items-center justify-center space-x-1 w-9 h-9 md:w-auto md:px-2.5 md:h-8 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/35 text-xs font-bold transition-colors cursor-pointer"
                title={isEn ? 'Switch to Conversation Studio (/conversation)' : 'Chuyển sang Luyện Hội Thoại (/conversation)'}
                aria-label={isEn ? 'Switch to Conversation Studio' : 'Chuyển sang Luyện Hội Thoại'}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">/conversation</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCreatorOpen(true)}
              className="flex items-center space-x-1 px-2.5 h-9 sm:h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              title={isEn ? 'Create custom word, phrase, or sentence drill' : 'Tạo bài tập phát âm từ, cụm từ hoặc câu mới'}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="sm:hidden">{isEn ? 'New' : 'Tạo'}</span>
              <span className="hidden sm:inline">{isEn ? 'Create Drill' : 'Tạo Bài'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareUrl}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title={isEn ? 'Copy direct link (/pronunciation)' : 'Sao chép đường dẫn (/pronunciation)'}
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={toggleExpanded}
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title={isEn ? 'Toggle Fullscreen (Alt+Z)' : 'Phóng to toàn màn hình (Alt+Z)'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title={isEn ? 'Close Pronunciation Studio (Esc)' : 'Đóng phòng luyện phát âm (Esc)'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Collapsible Desktop Accent & Speed Tray (lg+, only when toggled) */}
        {isDesktopSettingsOpen && (
          <div className="hidden lg:flex px-4 py-1.5 bg-slate-950 border-b border-slate-800 items-center justify-between gap-3 shrink-0 animate-in fade-in duration-150">
            <span className="text-[11px] font-bold text-slate-400">
              {isEn ? 'Accent & Playback Speed' : 'Cài đặt Giọng đọc & Tốc độ'}
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                {[
                  { id: 'examiner-arthur', label: '🇬🇧 UK' },
                  { id: 'examiner-oliver', label: '🇺🇸 US' }
                ].map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedExaminerId(v.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedExaminerId === v.id || (v.id === 'examiner-arthur' && selectedExaminerId === 'examiner-eleanor')
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
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
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      playbackSpeed === m.rate
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.rate}x {isEn ? m.labelEn : m.labelVi}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FLOATING XP EARNED TOAST & LEVEL UP BANNER */}
        {xpToast && (
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-b border-emerald-500/40 px-4 py-1.5 flex items-center justify-center space-x-3 text-xs font-bold text-emerald-200 animate-in slide-in-from-top duration-200 shrink-0">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>
              {isEn
                ? `🎉 +${xpToast.xp} XP Earned! (Accuracy: ${xpToast.accuracy}%${xpToast.milestoneBonus ? ` • +${xpToast.milestoneBonus} XP 5-Streak Bonus!` : ''})`
                : `🎉 +${xpToast.xp} XP Điểm Kinh Nghiệm! (Độ chuẩn xác: ${xpToast.accuracy}%${xpToast.milestoneBonus ? ` • Thưởng +${xpToast.milestoneBonus} XP chuỗi 5 bài liên tiếp!` : ''})`}
            </span>
          </div>
        )}

        {levelUpBanner && (
          <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 px-4 py-2 flex items-center justify-between text-xs font-black text-white shrink-0 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
              <span>
                {isEn
                  ? `🏆 LEVEL UP! You advanced from Lv.${levelUpBanner.oldLevel} ➔ Lv.${levelUpBanner.newLevel} (${levelUpBanner.tier.titleEn})!`
                  : `🏆 THĂNG CẤP! Bạn đã lên Lv.${levelUpBanner.oldLevel} ➔ Lv.${levelUpBanner.newLevel} (${levelUpBanner.tier.titleVi})!`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLevelUpBanner(null)}
              className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/40 text-white text-[10px] cursor-pointer"
            >
              {isEn ? 'Dismiss' : 'Đóng'}
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* 2. COMPACT TRACK SWITCHER & ACCENT/SPEED BAR (Mobile/Tablet < lg) */}
        {/* ================================================================= */}
        <div className="lg:hidden px-3 sm:px-6 py-2 bg-slate-950/80 border-b border-slate-800/90 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          {/* 3 Track Tabs */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {PRONUNCIATION_TRACKS.map(track => {
              const isActive = activeTab === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTab(track.id)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r ${track.badgeColor} text-white shadow-md`
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {isEn ? track.labelEn : track.labelVi}
                </button>
              );
            })}
          </div>

          {/* Ultra-Compact Accent (UK / US) & Speed Toggle */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              {[
                { id: 'examiner-arthur', label: '🇬🇧 UK' },
                { id: 'examiner-oliver', label: '🇺🇸 US' }
              ].map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedExaminerId(v.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedExaminerId === v.id || (v.id === 'examiner-arthur' && selectedExaminerId === 'examiner-eleanor')
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
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
                  className={`px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    playbackSpeed === m.rate
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE DRILL & BATCH SELECTOR BAR (< lg): Frees up 100% of phone screen for practicing */}
        <div className="lg:hidden relative px-3 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileListOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 min-h-[36px] rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-bold shrink-0 cursor-pointer active:scale-95"
          >
            <List className="w-3.5 h-3.5 shrink-0" />
            {activeTab !== 'ipa' && trackBatches.length > 0 ? (
              selectedBatchIndex === 'personal' ? (
                <span>{isEn ? `📒 Vault (${personalDrillsForTab.length})` : `📒 Sổ Tay (${personalDrillsForTab.length})`}</span>
              ) : (
                <span className="flex items-center space-x-1">
                  <span>
                    {isEn
                      ? `B${activeBatchObj?.batchIndex || 1}/${trackBatches.length}`
                      : `Lô ${activeBatchObj?.batchIndex || 1}/${trackBatches.length}`}
                  </span>
                  <span className="text-[10px] font-mono opacity-80">
                    {activeBatchObj?.isUnlocked
                      ? `${activeBatchObj.completedCount}/${activeBatchObj.totalCount}`
                      : '🔒'}
                  </span>
                </span>
              )
            ) : (
              <span>
                {isEn ? `Drills (${activeTrackDrills.length})` : `Danh sách (${activeTrackDrills.length})`}
              </span>
            )}
          </button>

          <div className="min-w-0 flex-1 text-center">
            <div className="text-[11px] font-extrabold text-white truncate">
              {activeBatchObj && !activeBatchObj.isUnlocked ? (
                <span className="text-amber-300">
                  {isEn
                    ? `🔒 Batch ${activeBatchObj.batchIndex} • ${activeBatchObj.costGold} 🪙`
                    : `🔒 Lô ${activeBatchObj.batchIndex} • ${activeBatchObj.costGold} 🪙`}
                </span>
              ) : isLoadingBatchShard ? (
                <span className="text-indigo-300 animate-pulse">
                  {isEn ? `Loading Batch ${activeBatchObj?.batchIndex || ''}...` : `Đang tải Lô ${activeBatchObj?.batchIndex || ''}...`}
                </span>
              ) : activeTrackDrills.length > 0 ? (
                `${selectedIdx + 1}/${activeTrackDrills.length} • ${currentDrill?.targetText || ''}`
              ) : (
                <span className="text-emerald-300">
                  {isEn ? '🎉 Batch Complete' : '🎉 Hoàn thành Lô'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              type="button"
              disabled={activeTrackDrills.length <= 1}
              onClick={() =>
                setSelectedIdx(prev => (prev > 0 ? prev - 1 : activeTrackDrills.length - 1))
              }
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer disabled:cursor-not-allowed active:scale-95"
              aria-label={isEn ? 'Previous drill' : 'Bài trước'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={activeTrackDrills.length <= 1}
              onClick={handleAdvanceToNextDrill}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 flex items-center justify-center border border-slate-700 cursor-pointer disabled:cursor-not-allowed active:scale-95"
              aria-label={isEn ? 'Next drill' : 'Bài tiếp'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Razor-thin 2px live Batch Progress Bar along bottom edge (0 extra vertical space) */}
          {activeBatchObj && activeBatchObj.isUnlocked && (
            <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  activeBatchObj.isCompleted
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.round((activeBatchObj.completedCount / Math.max(1, activeBatchObj.totalCount)) * 100))}%`
                }}
              />
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 3. MAIN WORKSPACE: DESKTOP SIDEBAR + MAIN PRACTICE STAGE          */}
        {/* ================================================================= */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* DESKTOP LEFT SIDEBAR (Collapsible for full-width pronunciation focus) */}
          {isDesktopSidebarOpen && (
          <aside className="hidden lg:flex w-72 xl:w-80 bg-slate-950/60 border-r border-slate-800 flex-col shrink-0">
            {renderDrillListContent(false)}
          </aside>
          )}

          {/* RIGHT MAIN STAGE: Phonetic Target, Live Mic Recorder & Word-by-Word Diagnostics */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 overscroll-contain">
            {importedFocusBanner && importedFocusBanner.count > 0 && (
              <div className="px-3.5 py-2 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-between gap-2 text-xs text-cyan-200 animate-in fade-in duration-150">
                <span className="font-bold">
                  {isEn
                    ? `🎯 Loaded ${importedFocusBanner.count} word${importedFocusBanner.count > 1 ? 's' : ''} to polish from Conversation Studio.`
                    : `🎯 Đã nạp ${importedFocusBanner.count} từ cần luyện thêm từ phòng Luyện Hội Thoại.`}
                </span>
                <button
                  type="button"
                  onClick={() => setImportedFocusBanner(null)}
                  className="p-1 rounded-lg hover:bg-cyan-500/20 text-cyan-300 cursor-pointer shrink-0"
                  aria-label={isEn ? 'Dismiss' : 'Đóng'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {activeTab === 'ipa' && (
              <div className="p-3 sm:p-4 rounded-3xl bg-slate-950/90 border border-emerald-500/30 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black font-mono">
                      IPA {masteredIpaCount}/44
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      {isEn ? 'Interactive Cambridge 44-Sound IPA Chart' : 'Bảng 44 Âm Quốc Tế IPA (Chạm để nghe & luyện)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="hidden sm:flex items-center space-x-1">
                      {IPA_SOUND_GROUPS.map(g => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setIpaGroupFilter(g.id);
                            setSelectedIdx(0);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            ipaGroupFilter === g.id
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {isEn ? g.labelEn : g.labelVi}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowIpaChart(prev => !prev)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] font-bold cursor-pointer"
                    >
                      {showIpaChart ? (isEn ? 'Collapse Chart' : 'Thu gọn bảng') : (isEn ? 'Expand Chart' : 'Mở bảng IPA')}
                    </button>
                  </div>
                </div>

                {showIpaChart && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-1.5 pt-1">
                    {activeTrackDrills.map((ipaItem, idx) => {
                      const isActiveTile = currentDrill?.id === ipaItem.id;
                      const tileBest = pronStats.bestScores?.[ipaItem.id];
                      const isPassedTile =
                        (tileBest && tileBest.accuracy >= PRONUNCIATION_PASS_THRESHOLD) ||
                        (Array.isArray(passedDrillIds) && passedDrillIds.includes(ipaItem.id));

                      return (
                        <button
                          key={ipaItem.id}
                          type="button"
                          onClick={() => {
                            setJustPassedDrillId(null);
                            setSelectedIdx(idx);
                            handlePlayModel(
                              playbackSpeed,
                              ipaPracticeMode === 'sound'
                                ? ipaItem.pureSoundCue || ipaItem.sampleWord
                                : ipaItem.targetText
                            );
                          }}
                          className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                            isActiveTile
                              ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-500/40 shadow-md'
                              : isPassedTile
                              ? 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-950/60'
                              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                          }`}
                          title={`${ipaItem.ipaSymbol} (${ipaItem.targetText})`}
                        >
                          <span className={`text-xs sm:text-sm font-mono font-black ${isActiveTile ? 'text-emerald-300' : 'text-white'}`}>
                            {ipaItem.ipaSymbol}
                          </span>
                          <span className="text-[9px] text-slate-400 truncate max-w-full">
                            {ipaItem.sampleWord}
                          </span>
                          {tileBest && (
                            <span className={`text-[8px] font-black mt-0.5 ${tileBest.accuracy >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {tileBest.accuracy}%
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {currentDrill ? (
              <>
                {/* ========================================================= */}
                {/* CARD 1: CLEAN TARGET DISPLAY & MODEL AUDIO                */}
                {/* ========================================================= */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/35 border border-indigo-500/30 shadow-xl space-y-3">
                  {/* Minimal Top Meta Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsDesktopSidebarOpen(prev => !prev)}
                        className="hidden lg:inline-flex p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                        title={isDesktopSidebarOpen ? (isEn ? 'Hide drill list' : 'Thu gọn danh sách') : (isEn ? 'Show drill list' : 'Mở danh sách')}
                      >
                        {isDesktopSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
                      </button>
                      {currentDrill.type === 'ipa' && currentDrill.ipaSymbol ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {currentDrill.ipaSymbol} • {isEn ? currentDrill.categoryEn : currentDrill.categoryVi}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Band {currentDrill.bandLevel}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        <span>+{currentDrill.xpReward} XP</span>
                      </span>
                    </div>

                    {/* Icon-only Save & Mastered + Desktop Prev/Next */}
                    <div className="flex items-center space-x-1.5">
                      {onSaveToNotebook && (
                        <button
                          type="button"
                          onClick={handleSaveCurrentToVocab}
                          className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                            savedToVaultToast
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border-slate-700'
                          }`}
                          title={isEn ? 'Save to Vocabulary Notebook' : 'Lưu vào Sổ Tay Từ Vựng'}
                        >
                          {savedToVaultToast ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {onToggleMastered && (
                        <button
                          type="button"
                          onClick={() => onToggleMastered(currentDrill.id)}
                          className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                            isMastered
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                          title={isMastered ? (isEn ? 'Mastered' : 'Đã thuộc') : (isEn ? 'Mark as mastered' : 'Đánh dấu đã thuộc')}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="hidden lg:flex items-center space-x-1 pl-1 border-l border-slate-800">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedIdx(prev => (prev > 0 ? prev - 1 : activeTrackDrills.length - 1))
                          }
                          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                          title={isEn ? 'Previous drill' : 'Bài trước'}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleAdvanceToNextDrill}
                          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                          title={isEn ? 'Next drill' : 'Bài tiếp theo'}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Target Text & Phonetic Breakdown */}
                  <div className="space-y-2.5 py-1">
                    {currentDrill.type === 'ipa' && (
                      <div className="flex flex-wrap items-center gap-1.5 pb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIpaPracticeMode('sound');
                            setEvaluationResult(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                            ipaPracticeMode === 'sound'
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                          }`}
                        >
                          <span>🎯</span>
                          <span>
                            {isEn
                              ? `1. Practice Pure Sound ${currentDrill.ipaSymbol}`
                              : `1. Luyện Chính Âm ${currentDrill.ipaSymbol}`}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIpaPracticeMode('words');
                            setEvaluationResult(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                            ipaPracticeMode === 'words'
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                          }`}
                        >
                          <span>📖</span>
                          <span>
                            {isEn
                              ? `2. Example Words`
                              : `2. Từ Ví Dụ`}
                          </span>
                        </button>
                        {currentDrill.minimalPair && (
                          <button
                            type="button"
                            onClick={() => {
                              setIpaPracticeMode('duel');
                              setEvaluationResult(null);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                              ipaPracticeMode === 'duel'
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
                                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            <span>⚔️</span>
                            <span>
                              {isEn
                                ? `3. Minimal Pair Duel (${currentDrill.minimalPair.speakText.replace(',', ' ↔')})`
                                : `3. Thử Thách Cặp Âm (${currentDrill.minimalPair.speakText.replace(',', ' ↔')})`}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {currentDrill.type === 'ipa' && ipaPracticeMode === 'duel' && currentDrill.minimalPair ? (
                      <div className="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-500/40 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-xs sm:text-sm font-black text-amber-200">
                            {isEn
                              ? '⚔️ Minimal Pair Duel — Pronounce BOTH contrasting words clearly in one go:'
                              : '⚔️ Thử Thách Cặp Âm — Đọc liền mạch CẢ 2 TỪ đối lập thật tách bạch:'}
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlayModel(0.8, currentDrill.minimalPair.speakText)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Listen Contrast' : 'Nghe Đối Chiếu'}</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {currentDrill.minimalPair.speakText
                            .split(',')
                            .map(w => w.trim())
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((pairWord, pIdx) => {
                              const pairRes = evaluationResult?.pairResults?.[pIdx];
                              return (
                                <button
                                  key={pairWord}
                                  type="button"
                                  onClick={() => handlePlayModel(playbackSpeed, pairWord)}
                                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                    pairRes
                                      ? pairRes.matched
                                        ? 'bg-emerald-950/60 border-emerald-500/60'
                                        : 'bg-rose-950/50 border-rose-500/50'
                                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700'
                                  }`}
                                >
                                  <div className="text-lg sm:text-2xl font-black text-white">{pairWord}</div>
                                  <div className="text-[11px] font-bold text-slate-400 mt-0.5 flex items-center justify-center gap-1">
                                    <Volume2 className="w-3 h-3 text-amber-400" />
                                    {pairRes ? (
                                      <span className={pairRes.matched ? 'text-emerald-300' : 'text-rose-300'}>
                                        {pairRes.matched ? `✓ ${pairRes.similarity}%` : `✗ "${pairRes.spokenMatch}"`}
                                      </span>
                                    ) : (
                                      <span>{pIdx === 0 ? (isEn ? 'Word A (Tap to hear)' : 'Từ A (Chạm nghe)') : (isEn ? 'Word B (Tap to hear)' : 'Từ B (Chạm nghe)')}</span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    ) : currentDrill.type === 'ipa' && ipaPracticeMode === 'sound' ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/60 text-emerald-300 font-mono text-3xl sm:text-4xl font-black shadow-lg shrink-0">
                            {currentDrill.ipaSymbol}
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm sm:text-base font-black text-white">
                              {isEn ? currentDrill.pureSoundGuideEn : currentDrill.pureSoundGuideVi}
                            </div>
                            <p className="text-xs text-emerald-200/90 font-semibold">
                              {isEn
                                ? `🎙️ Tap Mic and pronounce the pure sound ${currentDrill.ipaSymbol} directly (or link it into "${currentDrill.sampleWord}")`
                                : `🎙️ Bấm Mic và phát âm trực tiếp chính âm ${currentDrill.ipaSymbol} (hoặc bật âm nối vào từ mẫu "${currentDrill.sampleWord}")`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePlayModel(0.85, currentDrill.pureSoundCue)}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-1.5 shadow-md cursor-pointer transition-all"
                          >
                            <Volume2 className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {isEn
                                ? `Listen Pure ${currentDrill.ipaSymbol}`
                                : `Nghe Chính Âm ${currentDrill.ipaSymbol}`}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handlePlayModel(0.85, `${currentDrill.pureSoundCue}, ${currentDrill.sampleWord}`)
                            }
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
                          >
                            <Volume2 className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {currentDrill.ipaSymbol} ➔ {currentDrill.sampleWord}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : speechEngine.isListening && liveSpokenText && currentDrill.type !== 'words' ? (() => {
                      const spokenSet = new Set(expandConversationalTokens(liveSpokenText));
                      return (
                        <div className="text-2xl sm:text-3xl font-black tracking-tight leading-snug flex flex-wrap gap-x-2 gap-y-1">
                          {currentDrill.targetText.split(/\s+/).map((w, idx) => {
                            const expandedTokens = expandConversationalTokens(w);
                            const matched =
                              expandedTokens.length > 0 &&
                              (expandedTokens.every(tok => spokenSet.has(tok)) ||
                                (expandedTokens.length >= 2 && spokenSet.has(expandedTokens.join(''))));
                            return (
                              <span
                                key={`${w}-${idx}`}
                                className={matched ? 'text-emerald-300 underline decoration-emerald-500/60' : 'text-white'}
                              >
                                {w}
                              </span>
                            );
                          })}
                        </div>
                      );
                    })() : currentDrill.type === 'twisters' ? (() => {
                      const patterns = Array.isArray(currentDrill.targetPhonemes)
                        ? currentDrill.targetPhonemes
                            .map(tp => {
                              // Strip outer capturing parens if present, convert any inner capturing groups to non-capturing
                              const cleanSrc = String(tp.regex || '')
                                .replace(/^\((.*)\)$/, '$1')
                                .replace(/\((?!\?)/g, '(?:');
                              try {
                                return {
                                  ...tp,
                                  rx: new RegExp(cleanSrc, 'gi')
                                };
                              } catch (e) {
                                return null;
                              }
                            })
                            .filter(Boolean)
                        : [];

                      const highlightWord = (word) => {
                        if (patterns.length === 0) return word;
                        // Build non-overlapping highlight ranges (earlier pattern in list takes priority)
                        const charColor = new Array(word.length).fill(null);
                        patterns.forEach(p => {
                          p.rx.lastIndex = 0;
                          let m;
                          while ((m = p.rx.exec(word)) !== null) {
                            if (m[0].length === 0) {
                              p.rx.lastIndex += 1;
                              continue;
                            }
                            let canFill = true;
                            for (let k = m.index; k < m.index + m[0].length; k++) {
                              if (charColor[k] !== null) {
                                canFill = false;
                                break;
                              }
                            }
                            if (canFill) {
                              for (let k = m.index; k < m.index + m[0].length; k++) {
                                charColor[k] = p.color;
                              }
                            }
                          }
                        });

                        const runs = [];
                        let i = 0;
                        while (i < word.length) {
                          const c = charColor[i];
                          let j = i + 1;
                          while (j < word.length && charColor[j] === c) j++;
                          runs.push({ text: word.slice(i, j), color: c });
                          i = j;
                        }

                        return runs.map((run, idx) =>
                          run.color ? (
                            <span
                              key={idx}
                              className={
                                run.color === 'fuchsia'
                                  ? 'text-fuchsia-300 underline decoration-fuchsia-500/70'
                                  : 'text-cyan-300 underline decoration-cyan-500/70'
                              }
                            >
                              {run.text}
                            </span>
                          ) : (
                            <span key={idx}>{run.text}</span>
                          )
                        );
                      };

                      return (
                        <div className="space-y-3">
                          <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
                            {currentDrill.targetText.split(/\s+/).map((w, idx) => (
                              <span key={`${w}-${idx}`}>{highlightWord(w)}</span>
                            ))}
                          </div>

                          {/* Target Repeated Phoneme Legend + 3-Speed Challenge Quick Listen */}
                          <div className="p-3 rounded-2xl bg-fuchsia-950/25 border border-fuchsia-500/35 space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                <span className="text-[11px] font-black text-fuchsia-300">
                                  {isEn ? '🎯 Target Repeated Sounds:' : '🎯 Bản đồ Âm Lặp:'}
                                </span>
                                {(currentDrill.targetPhonemes || []).map(tp => (
                                  <span
                                    key={tp.symbol}
                                    className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-black border ${
                                      tp.color === 'fuchsia'
                                        ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
                                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    }`}
                                  >
                                    {tp.symbol}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center gap-1">
                                {[
                                  { rate: 0.65, labelVi: '🐢 0.65x Chậm', labelEn: '🐢 0.65x Slow' },
                                  { rate: 0.85, labelVi: '🚶 0.85x Vừa', labelEn: '🚶 0.85x Steady' },
                                  { rate: 1.0, labelVi: '⚡ 1.0x Nhanh', labelEn: '⚡ 1.0x Fast' }
                                ].map(sp => (
                                  <button
                                    key={sp.rate}
                                    type="button"
                                    onClick={() => {
                                      setPlaybackSpeed(sp.rate);
                                      handlePlayModel(sp.rate, currentDrill.targetText);
                                    }}
                                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-fuchsia-950/80 border border-slate-700 hover:border-fuchsia-400/60 text-[10px] font-bold text-slate-200 cursor-pointer transition-all"
                                  >
                                    {isEn ? sp.labelEn : sp.labelVi}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-400 pt-1 border-t border-fuchsia-500/20">
                              <span className="text-amber-300">⭐ {isEn ? '≥80% Clear' : '≥80% Chuẩn'}</span>
                              <span className="text-amber-300">⭐⭐ {isEn ? '≥85% & 105+ WPM' : '≥85% & 105+ từ/phút'}</span>
                              <span className="text-fuchsia-300 font-black">⭐⭐⭐ {isEn ? '≥90% & 135+ WPM (+50 XP)' : '≥90% & 135+ từ/phút (+50 XP)'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                        {currentDrill.targetText}
                      </div>
                    )}

                    {/* Track-specific visual pronunciation guide */}
                    {currentDrill.type === 'ipa' && (
                      <div className="space-y-2.5 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">
                            {isEn ? 'Example words with this sound:' : 'Từ ví dụ chứa âm này (chạm để nghe lẻ):'}
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {currentDrill.targetText
                              .split(',')
                              .map(w => w.trim())
                              .filter(Boolean)
                              .map(word => (
                                <button
                                  key={word}
                                  type="button"
                                  onClick={() => handlePlayModel(playbackSpeed, word)}
                                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-indigo-950/80 border border-slate-700 hover:border-indigo-400/60 text-xs font-extrabold text-white flex items-center space-x-1 cursor-pointer transition-all"
                                  title={isEn ? `Listen to "${word}"` : `Nghe từ "${word}"`}
                                >
                                  <Volume2 className="w-3 h-3 text-indigo-400" />
                                  <span>{word}</span>
                                </button>
                              ))}
                          </div>
                          {currentDrill.minimalPair && (
                            <button
                              type="button"
                              onClick={() => handlePlayModel(0.8, currentDrill.minimalPair.speakText)}
                              className="px-2.5 py-1 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all"
                              title={isEn ? 'Compare minimal pair contrast' : 'Nghe phân biệt cặp âm dễ nhầm'}
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>
                                {isEn ? 'Minimal Pair: ' : 'Cặp đối lập: '}
                                <strong className="font-mono">{currentDrill.minimalPair.pairText}</strong>
                              </span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/25 text-slate-200">
                            <span className="font-black text-emerald-300 mr-1">
                              {isEn ? '👄 Mouth & Tongue:' : '👄 Khẩu hình miệng & lưỡi:'}
                            </span>
                            {isEn ? currentDrill.mouthTipEn : currentDrill.mouthTipVi}
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/25 text-slate-200">
                            <span className="font-black text-rose-300 mr-1">
                              {isEn ? '⚠️ Common Trap:' : '⚠️ Lỗi dễ mắc:'}
                            </span>
                            {isEn ? currentDrill.trapEn : currentDrill.trapVi}
                          </div>
                        </div>

                        <IpaArticulationDiagram
                          ipaSymbol={currentDrill.ipaSymbol}
                          ipaGroup={currentDrill.ipaGroup}
                          isEn={isEn}
                        />
                      </div>
                    )}

                    {(currentDrill.type === 'words' || currentDrill.type === 'stress') && currentDrill.syllables && (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                          <span className="px-2.5 py-1 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-indigo-200 font-mono font-bold">
                            {currentDrill.syllables}
                          </span>
                          {currentDrill.stressPattern && (
                            <span className="px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-black tracking-widest">
                              {currentDrill.stressPattern}
                            </span>
                          )}
                        </div>
                        {currentDrill.type === 'stress' && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-bold text-slate-400">
                              {isEn ? 'Tap each word to hear shift:' : 'Chạm từng từ để nghe chuyển trọng âm:'}
                            </span>
                            {currentDrill.targetText
                              .split(',')
                              .map(w => w.trim())
                              .filter(Boolean)
                              .map(word => (
                                <button
                                  key={word}
                                  type="button"
                                  onClick={() => handlePlayModel(0.85, word)}
                                  className="px-2.5 py-1 rounded-xl bg-amber-950/50 hover:bg-amber-900/70 border border-amber-500/40 text-xs font-extrabold text-amber-200 flex items-center space-x-1 cursor-pointer transition-all"
                                >
                                  <Volume2 className="w-3 h-3 text-amber-400" />
                                  <span>{word}</span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                    {currentDrill.type === 'phrases' && currentDrill.connectedText && (
                      <div className="px-3 py-2 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-sm font-mono font-bold text-amber-300">
                        {currentDrill.connectedText}
                      </div>
                    )}

                    {currentDrill.type === 'sentences' && (() => {
                      const rhythm = buildSentenceRhythmNodes(currentDrill.targetText, currentDrill.intonationText);
                      return (
                        <div className="space-y-2">
                          {currentDrill.intonationText && (
                            <div className="px-3 py-2 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-sm font-bold text-amber-200 leading-relaxed">
                              {currentDrill.intonationText}
                            </div>
                          )}
                          {rhythm.nodes.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                              <div className="text-[10px] font-black text-slate-400 flex items-center justify-between">
                                <span>
                                  {isEn
                                    ? '🎵 Pitch & Rhythm Contour (● = Stress High, • = Weak Fast)'
                                    : '🎵 Sơ đồ Nhịp điệu & Ngữ điệu (● = Nhấn cao, • = Lướt nhẹ)'}
                                </span>
                                <span className="text-amber-300 font-mono">{rhythm.endArrow}</span>
                              </div>
                              <div className="flex flex-wrap items-end gap-x-2 gap-y-1.5 pt-1">
                                {rhythm.nodes.map((node, nIdx) => (
                                  <div key={`${node.word}-${nIdx}`} className="flex flex-col items-center">
                                    <span
                                      className={`leading-none mb-0.5 ${
                                        node.isNuclear
                                          ? 'text-amber-400 text-sm font-black'
                                          : node.isStressed
                                          ? 'text-indigo-300 text-xs font-bold'
                                          : 'text-slate-600 text-[10px]'
                                      }`}
                                    >
                                      {node.isStressed ? '●' : '•'}
                                    </span>
                                    <span
                                      className={`text-[11px] leading-tight ${
                                        node.isNuclear
                                          ? 'font-black text-amber-200'
                                          : node.isStressed
                                          ? 'font-bold text-slate-200'
                                          : 'text-slate-500'
                                      }`}
                                    >
                                      {node.word}
                                    </span>
                                  </div>
                                ))}
                                <span className="text-sm font-black text-amber-400 self-end pb-0.5">
                                  {rhythm.endArrow}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Single Matching IPA (based on UK/US selection) + Meaning */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-cyan-300">
                        {selectedExaminerId === 'examiner-oliver' ? `🇺🇸 ${currentDrill.ipaUs}` : `🇬🇧 ${currentDrill.ipaUk}`}
                      </span>
                      <span className="text-slate-300 font-medium">
                        — {isEn ? currentDrill.meaningEn : currentDrill.meaningVi}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Listen Buttons (Hidden on Mobile since Mobile has Sticky Bottom Thumb-Zone Bar) */}
                  <div className="hidden lg:flex items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePlayModel(playbackSpeed)}
                      className="flex-1 py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black flex items-center justify-center space-x-2 shadow-lg shadow-indigo-950/50 transition-all active:scale-98 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 shrink-0" />
                      <span>
                        {speechEngine.isSpeaking
                          ? isEn
                            ? 'Speaking Model...'
                            : 'Đang phát giọng mẫu...'
                          : isEn
                          ? `Listen Model (${playbackSpeed}x)`
                          : `Nghe Giọng Mẫu (${playbackSpeed}x)`}
                      </span>
                    </button>

                    {playbackSpeed > 0.65 && (
                      <button
                        type="button"
                        onClick={() => handlePlayModel(0.65)}
                        className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-sm font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-98 cursor-pointer"
                      >
                        <Headphones className="w-4 h-4 shrink-0" />
                        <span>{isEn ? '0.65x Very Slow' : 'Nghe Rất Chậm 0.65x'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ========================================================= */}
                {/* CARD 2: MICROPHONE RECORDER, WAVEFORM & SCORING ENGINE    */}
                {/* ========================================================= */}
                <div
                  className={`p-4 sm:p-5 rounded-3xl border transition-all space-y-3 ${
                    speechEngine.isListening
                      ? 'bg-slate-950 border-emerald-500/70 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/90 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={toggleAutoMode}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black border transition-all cursor-pointer flex items-center space-x-1 ${
                        isAutoMode
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <Zap className={`w-3 h-3 ${isAutoMode ? 'fill-current text-emerald-400' : ''}`} />
                      <span>
                        {isEn
                          ? isAutoMode
                            ? 'Auto-Grade & Auto-Stop: ON'
                            : 'Auto-Grade: OFF'
                          : isAutoMode
                          ? 'Tự động chấm & dừng Mic: BẬT'
                          : 'Tự động chấm: TẮT'}
                      </span>
                    </button>

                    <div className="flex items-center space-x-2">
                      {currentBest && !speechEngine.isListening && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                          {isEn ? `Best: ${currentBest.accuracy}%` : `Kỷ lục: ${currentBest.accuracy}%`}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowManualFallback(prev => !prev)}
                        className="text-[11px] text-slate-400 hover:text-indigo-300 underline cursor-pointer"
                      >
                        {isEn ? 'Text Test?' : 'Nhập thử?'}
                      </button>
                    </div>
                  </div>

                  {/* Audio Waveform Visualizer */}
                  <div className="h-14 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative">
                    <SpeechWaveVisualizer
                      mode={
                        speechEngine.isListening
                          ? 'candidate_speaking'
                          : speechEngine.isSpeaking
                          ? 'examiner_speaking'
                          : 'idle'
                      }
                      analyserNode={speechEngine.analyserNode}
                      className="w-full h-full"
                    />
                    {liveSpokenText ? (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xs flex flex-col items-center justify-center px-4 text-center">
                        <p className="text-xs sm:text-sm font-bold text-emerald-300 truncate max-w-full">
                          "{liveSpokenText}"
                        </p>
                        {isAutoMode && speechEngine.isListening && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {isEn
                              ? '⚡ Auto-grading right after you pause...'
                              : '⚡ Máy sẽ tự chấm ngay khi bạn nói xong...'}
                          </span>
                        )}
                      </div>
                    ) : speechEngine.isListening && isWaitingForRetrySpeech ? (
                      <div className="absolute inset-0 bg-amber-950/40 flex items-center justify-center px-4 text-center">
                        <p className="text-xs font-extrabold text-amber-300 animate-pulse flex items-center gap-2">
                          <span>
                            {isEn
                              ? '🎙️ Mic is still open — pronounce it again clearly now!'
                              : '🎙️ Micro vẫn đang mở — bạn hãy đọc lại rõ ràng ngay bây giờ!'}
                          </span>
                          {Boolean(speechEngine.analyserNode) && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/40 text-[10px] font-mono">
                              {speechEngine.micLevel || 0}%
                            </span>
                          )}
                        </p>
                      </div>
                    ) : speechEngine.isListening ? (
                      <div className="absolute inset-0 bg-emerald-950/35 flex items-center justify-center px-4 text-center">
                        <p className="text-xs font-extrabold text-emerald-300 animate-pulse flex items-center gap-2">
                          <span>
                            {Boolean(speechEngine.analyserNode)
                              ? isEn ? '🎙️ Listening...' : '🎙️ Đang nghe...'
                              : isEn ? '🎙️ Mic active — speak now!' : '🎙️ Micro đang bật — hãy nói ngay!'}
                          </span>
                          {Boolean(speechEngine.analyserNode) && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono">
                              Mic {speechEngine.micLevel || 0}%
                            </span>
                          )}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {speechEngine.speechError && (
                    <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>
                        {speechEngine.speechError === 'not-allowed'
                          ? isEn
                            ? 'Microphone permission is blocked. Please allow Microphone access in your browser site settings (🔒 icon next to the URL).'
                            : 'Trình duyệt đang chặn quyền Micro. Hãy bấm biểu tượng 🔒 cạnh thanh địa chỉ để cho phép Micro.'
                          : speechEngine.speechError === 'audio-capture'
                          ? isEn
                            ? 'Could not capture microphone audio. Close other apps/tabs using the mic and try again.'
                            : 'Không thể thu âm từ Micro. Hãy đóng các ứng dụng/tab khác đang dùng mic rồi thử lại.'
                          : isEn
                          ? 'Voice recognition is unavailable on this browser. Please use Chrome/Safari over HTTPS or tap "Text Test?".'
                          : 'Nhận diện giọng nói chưa khả dụng trên trình duyệt này. Hãy dùng Chrome/Safari (HTTPS) hoặc bấm "Kiểm Tra Chữ?".'}
                      </span>
                    </div>
                  )}

                  {/* Primary Record / Stop Button */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleToggleRecording}
                      className={`hidden lg:flex flex-1 min-w-[220px] py-3 px-5 rounded-2xl text-xs sm:text-sm font-black items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
                        speechEngine.isListening
                          ? evaluationResult && !evaluationResult.isPassed
                            ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse shadow-amber-950/50'
                            : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-950/50'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50'
                      }`}
                    >
                      <Mic className="w-4 h-4 shrink-0" />
                      <span>
                        {speechEngine.isListening
                          ? evaluationResult && !evaluationResult.isPassed
                            ? isEn
                              ? `Mic Listening — Speak Again Now (Try #${attemptCount + 1})`
                              : `Micro Đang Mở — Đọc Lại Ngay (Lần #${attemptCount + 1})`
                            : isAutoMode
                            ? isEn
                              ? 'Listening (Auto-Grade ON) • Tap to Stop'
                              : 'Đang Nghe (Tự Chấm Bật) • Bấm Để Dừng'
                            : isEn
                            ? 'Stop Recording & Score Pronunciation'
                            : 'Dừng Ghi Âm & Chấm Điểm Phát Âm'
                          : isEn
                          ? 'Start Microphone & Pronounce Now'
                          : 'Bấm Bật Micro & Phát Âm Ngay'}
                      </span>
                    </button>

                    {currentAudioClip?.url && !speechEngine.isListening && (
                      <>
                        <button
                          type="button"
                          onClick={handleReplayUserAudio}
                          className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                            isPlayingUserClip && !isComparingAudio
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                          }`}
                        >
                          {isPlayingUserClip && !isComparingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isEn ? 'Replay Voice' : 'Nghe Lại'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCompareSideBySide}
                          className={`py-3 px-4 rounded-2xl text-xs font-bold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                            isComparingAudio
                              ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                              : 'bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border-cyan-500/40'
                          }`}
                          title={isEn ? 'Play native model followed immediately by your recording' : 'Nghe đối chiếu giọng mẫu nối tiếp giọng bạn'}
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {isComparingAudio
                              ? isEn ? 'Comparing...' : 'Đang đối chiếu...'
                              : isEn ? 'Compare Model ↔ You' : 'So Sánh Mẫu ↔ Bạn'}
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Subtle Desktop Keyboard Shortcuts Hint */}
                  <div className="hidden lg:flex items-center justify-end text-[10px] text-slate-500 space-x-3">
                    <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">Space</kbd> {isEn ? 'Mic' : 'Bật/Tắt Mic'}</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">L</kbd> {isEn ? 'Listen' : 'Nghe mẫu'}</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">→</kbd> {isEn ? 'Navigate' : 'Chuyển bài'}</span>
                  </div>

                  {/* Manual / Fallback Self-Evaluation Box (For browsers without Web Speech STT or noisy environments) */}
                  {showManualFallback && (
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">
                          {isEn
                            ? ' Fallback / Practice Transcript Verification:'
                            : 'Chế độ kiểm tra phát âm dự phòng (khi trình duyệt chặn STT hoặc ồn):'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const verifyTarget =
                              currentDrill.type === 'ipa' && ipaPracticeMode === 'sound'
                                ? currentDrill.pureSoundCue || currentDrill.sampleWord
                                : currentDrill.type === 'ipa' && ipaPracticeMode === 'duel'
                                ? currentDrill.minimalPair?.speakText || currentDrill.targetText
                                : currentDrill.targetText;
                            setManualSpokenInput(verifyTarget);
                            handleRunEvaluation(verifyTarget);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                        >
                          {isEn ? '✓ I Pronounced It Clearly (Self-Verify)' : '✓ Tôi đã đọc to rõ theo mẫu (Tự xác nhận)'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={manualSpokenInput}
                          onChange={e => setManualSpokenInput(e.target.value)}
                          placeholder={
                            isEn
                              ? 'Or type what you pronounced to test word-by-word diagnostics...'
                              : 'Hoặc nhập nội dung vừa đọc để chấm phân tích từng từ...'
                          }
                          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRunEvaluation(manualSpokenInput)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                        >
                          {isEn ? 'Evaluate' : 'Chấm điểm'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ======================================================= */}
                  {/* WORD-BY-WORD DIAGNOSTIC & SCORE REPORT                  */}
                  {/* ======================================================= */}
                  {evaluationResult && (
                    <div
                      className={`p-4 sm:p-5 rounded-2xl border space-y-4 animate-in fade-in duration-200 ${
                        evaluationResult.isPassed
                          ? 'bg-gradient-to-br from-emerald-950/50 via-slate-900 to-indigo-950/40 border-emerald-500/50'
                          : 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-rose-950/30 border-amber-500/50'
                      }`}
                    >
                      {/* Pass / Retry Status Action Banner */}
                      {evaluationResult.isPassed ? (
                        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center space-x-2.5 text-xs sm:text-sm font-bold text-emerald-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                            <span>
                              {isEn
                                ? `✅ Accurate pronunciation (${evaluationResult.overallAccuracy}%)! Mic auto-stopped — Tap [Next Drill ➔] below to continue.`
                                : `✅ Phát âm chuẩn xác (${evaluationResult.overallAccuracy}%)! Hệ thống đã tự động tắt Mic — Hãy nhấn [Qua từ tiếp theo ➔] bên dưới.`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleAdvanceToNextDrill}
                            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-indigo-950/50 ring-2 ring-indigo-400/60 flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                          >
                            <span>{isEn ? 'Next Drill' : 'Qua từ tiếp theo'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start sm:items-center space-x-2.5 text-xs sm:text-sm font-bold text-amber-200">
                            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>
                              {isEn
                                ? `🔄 Pronunciation needs retry (${evaluationResult.overallAccuracy}% — need ≥ ${PRONUNCIATION_PASS_THRESHOLD}% • Try #${evaluationResult.attemptNumber || 1}). ${
                                    speechEngine.isListening
                                      ? 'Mic is still open — pronounce it again now!'
                                      : 'Tap the Mic to try again!'
                                  }`
                                : `🔄 Phát âm chưa chuẩn (${evaluationResult.overallAccuracy}% — cần ≥ ${PRONUNCIATION_PASS_THRESHOLD}% • Lần #${evaluationResult.attemptNumber || 1}). ${
                                    speechEngine.isListening
                                      ? 'Micro vẫn đang mở, bạn hãy phát âm lại ngay!'
                                      : 'Hãy bấm Micro để phát âm lại!'
                                  }`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleListenAndRetry}
                            className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
                          >
                            <Volume2 className="w-4 h-4 shrink-0" />
                            <span>{isEn ? '🔊 Listen Model & Retry' : '🔊 Nghe mẫu & Đọc lại'}</span>
                          </button>
                        </div>
                      )}

                      {/* Twister 3-Star Speed & Repeated Phoneme Combo Banner */}
                      {evaluationResult.twisterMetrics && (
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-fuchsia-950/60 via-slate-900 to-amber-950/40 border border-fuchsia-500/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-base tracking-widest">
                              {evaluationResult.twisterMetrics.stars === 3
                                ? '⭐⭐⭐'
                                : evaluationResult.twisterMetrics.stars === 2
                                ? '⭐⭐☆'
                                : evaluationResult.twisterMetrics.stars === 1
                                ? '⭐☆☆'
                                : '☆☆☆'}
                            </span>
                            <span className="font-black text-white">
                              {isEn
                                ? evaluationResult.twisterMetrics.tierLabelEn
                                : evaluationResult.twisterMetrics.tierLabelVi}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold text-[11px]">
                              ⚡ {evaluationResult.twisterMetrics.wpm} {isEn ? 'WPM' : 'từ/phút'} ({evaluationResult.twisterMetrics.durationSec}s)
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-200 font-bold text-[11px]">
                              🔥 {isEn ? 'Phoneme Combo:' : 'Combo Âm Lặp:'}{' '}
                              {evaluationResult.twisterMetrics.comboHits}/{evaluationResult.twisterMetrics.comboTotal}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Score Summary Row */}
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center font-black border shrink-0 ${
                              evaluationResult.overallAccuracy >= 85
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : evaluationResult.overallAccuracy >= 65
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            <span className="text-base sm:text-lg leading-none">{evaluationResult.overallAccuracy}%</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm sm:text-base font-black text-white">
                                Band {evaluationResult.estimatedBand}
                              </span>
                              {evaluationResult.xpEarned > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-slate-950">
                                  +{evaluationResult.xpEarned} XP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              "{evaluationResult.spokenTranscript || '...'}"
                            </p>
                          </div>
                        </div>

                        {/* Engine Tier Badge & Optional Layer 2 Gemini Native Audio Deep Check */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                              evaluationResult.engineTier === 'layer2_gemini_audio'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {evaluationResult.engineTier === 'layer2_gemini_audio'
                              ? '🤖 Gemini Native Audio'
                              : '⚡ Phonetic + N-Best DSP'}
                          </span>

                          {apiKey && currentAudioClip?.blob && !speechEngine.isListening && evaluationResult.engineTier !== 'layer2_gemini_audio' && (
                            <button
                              type="button"
                              onClick={handleDeepAiAudioCheck}
                              disabled={isDeepAiGrading}
                              className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer disabled:opacity-50"
                              title={isEn ? 'Let Gemini AI listen directly to your raw voice for stress & IPA precision' : 'Cho Gemini AI nghe trực tiếp sóng âm giọng bạn để bắt lỗi trọng âm & IPA'}
                            >
                              <Sparkles className={`w-3 h-3 ${isDeepAiGrading ? 'animate-spin' : ''}`} />
                              <span>
                                {isDeepAiGrading
                                  ? isEn
                                    ? 'AI Listening...'
                                    : 'AI đang nghe...'
                                  : isEn
                                  ? 'AI Audio Deep Check'
                                  : 'AI Nghe & Chấm Sâu'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Color-Coded IPA Syllable & Phoneme Breakdown */}
                      {currentDrill.type !== 'sentences' && (() => {
                        const accentKey = selectedExaminerId === 'examiner-oliver' ? 'us' : 'uk';
                        const ipaSegments = buildPhonemeFeedbackSegments({
                          drill: currentDrill,
                          evaluationResult,
                          accent: accentKey
                        });
                        if (ipaSegments.length === 0) return null;

                        // Find up to 3 weak IPA symbols from PRONUNCIATION_IPA_DRILLS to offer a 1-click bridge
                        const weakIpaString = ipaSegments
                          .filter(s => !s.isSeparator && s.status !== 'correct')
                          .map(s => s.ipa)
                          .join(' ');
                        const suggestedIpaDrills =
                          currentDrill.type !== 'ipa' && weakIpaString
                            ? PRONUNCIATION_IPA_DRILLS.filter(d => {
                                const rawSym = d.ipaSymbol.replace(/\//g, '');
                                return rawSym.length >= 1 && weakIpaString.includes(rawSym);
                              }).slice(0, 3)
                            : [];

                        return (
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-black text-slate-400 mr-1">
                                {isEn ? 'IPA Phoneme Map:' : 'Chi tiết âm tiết IPA:'}
                              </span>
                              {ipaSegments.map(seg =>
                                seg.isSeparator ? (
                                  <span key={seg.id} className="text-slate-600 font-bold px-0.5">
                                    •
                                  </span>
                                ) : (
                                  <span
                                    key={seg.id}
                                    className={`px-2 py-0.5 rounded-lg font-mono font-bold border ${
                                      seg.status === 'correct'
                                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                                        : seg.status === 'approximate'
                                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                        : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                                    }`}
                                    title={
                                      seg.isCodaWarning
                                        ? isEn
                                          ? 'Missing/weak final consonant sound'
                                          : 'Âm cuối bị nuốt hoặc bật chưa rõ'
                                        : undefined
                                    }
                                  >
                                    /{seg.ipa}/
                                    {seg.isCodaWarning && <span className="ml-1 text-[9px] font-sans">⚠️</span>}
                                  </span>
                                )
                              )}
                            </div>

                            {suggestedIpaDrills.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
                                <span className="text-[10px] font-bold text-amber-300">
                                  {isEn ? '🎯 Drill weak IPA sound directly:' : '🎯 Luyện riêng khẩu hình âm chưa chuẩn:'}
                                </span>
                                {suggestedIpaDrills.map(ipaD => (
                                  <button
                                    key={ipaD.id}
                                    type="button"
                                    onClick={() => handleJumpToIpaSymbol(ipaD.ipaSymbol)}
                                    className="px-2 py-0.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-black cursor-pointer transition-all"
                                  >
                                    {ipaD.ipaSymbol} ({ipaD.sampleWord}) ➔
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {deepAiError && (
                        <div className="text-[11px] text-rose-400 font-semibold">
                          {deepAiError}
                        </div>
                      )}

                      {/* Layer 2 Heard IPA, Stress, Endings & Prosody Breakdown (if AI Audio checked) */}
                      {(evaluationResult.heardIpa || evaluationResult.stressFeedback || evaluationResult.endingFeedback || evaluationResult.prosodyNote) && (
                        <div className="space-y-2 text-[11px]">
                          {evaluationResult.heardIpa && (
                            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/35 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="font-black text-indigo-300 mr-1.5">
                                  {isEn ? 'Expected IPA:' : 'IPA Chuẩn:'}
                                </span>
                                <span className="font-mono text-cyan-300">
                                  {selectedExaminerId === 'examiner-oliver' ? currentDrill.ipaUs : currentDrill.ipaUk}
                                </span>
                              </div>
                              <div>
                                <span className="font-black text-amber-300 mr-1.5">
                                  {isEn ? 'Heard IPA:' : 'IPA Nghe Được:'}
                                </span>
                                <span className="font-mono text-amber-200">{evaluationResult.heardIpa}</span>
                              </div>
                            </div>
                          )}
                          {(evaluationResult.stressFeedback || evaluationResult.endingFeedback || evaluationResult.prosodyNote) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {evaluationResult.stressFeedback && (
                                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
                                  <span className="font-black text-purple-300 mr-1">
                                    {isEn ? 'Stress:' : 'Trọng âm:'}
                                  </span>
                                  <span>{evaluationResult.stressFeedback}</span>
                                </div>
                              )}
                              {evaluationResult.endingFeedback && (
                                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                                  <span className="font-black text-cyan-300 mr-1">
                                    {isEn ? 'Endings & Linking:' : 'Âm đuôi & Nối âm:'}
                                  </span>
                                  <span>{evaluationResult.endingFeedback}</span>
                                </div>
                              )}
                              {evaluationResult.prosodyNote && (
                                <div className="sm:col-span-2 p-2.5 rounded-xl bg-emerald-950/35 border border-emerald-500/30 text-emerald-200">
                                  <span className="font-black text-emerald-300 mr-1">
                                    {isEn ? 'Intonation & Rhythm:' : 'Ngữ điệu & Nhịp nói:'}
                                  </span>
                                  <span>{evaluationResult.prosodyNote}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Word-by-Word Interactive Chips */}
                      <div className="flex flex-wrap gap-2">
                        {evaluationResult.wordBreakdown.map((wb, i) => {
                          const chipStyle =
                            wb.status === 'correct'
                              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                              : wb.status === 'near'
                              ? 'bg-amber-950/90 text-amber-300 border-amber-500/50 hover:bg-amber-900'
                              : 'bg-rose-950/90 text-rose-300 border-rose-500/50 hover:bg-rose-900';
                          return (
                            <button
                              key={`${wb.word}-${i}`}
                              type="button"
                              onClick={() => handlePlayModel(Math.min(playbackSpeed, 0.85), wb.cleanWord || wb.word)}
                              className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black flex items-center space-x-1.5 transition-all cursor-pointer ${chipStyle}`}
                              title={isEn ? `Listen to "${wb.word}"` : `Nghe từ "${wb.word}"`}
                            >
                              <Volume2 className="w-3 h-3 opacity-75 shrink-0" />
                              <span>{wb.word}</span>
                              <span className="text-[10px] opacity-80 font-mono">
                                {wb.similarity}%
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Concise Coach Feedback */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isEn ? evaluationResult.coachFeedbackEn : evaluationResult.coachFeedbackVi}
                      </p>
                    </div>
                  )}
                </div>

                {/* ========================================================= */}
                {/* COLLAPSIBLE PRONUNCIATION TIPS & EXAMPLE ACCORDION        */}
                {/* ========================================================= */}
                <div className="rounded-2xl bg-slate-950/75 border border-slate-800 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowTips(prev => !prev)}
                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {isEn
                          ? 'Pronunciation Trap, Mouth Tip & Example'
                          : 'Bẫy phát âm, Khẩu hình & Câu ví dụ'}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        showTips ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showTips && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs animate-in fade-in duration-150">
                      <div>
                        <div className="font-bold text-rose-400 mb-0.5">
                          {isEn ? 'Common Trap:' : 'Bẫy hay mắc:'}
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {isEn ? currentDrill.trapEn : currentDrill.trapVi}
                        </p>
                      </div>

                      <div>
                        <div className="font-bold text-emerald-400 mb-0.5">
                          {isEn ? 'Mouth & Tongue Tip:' : 'Đặt khẩu hình & lưỡi:'}
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {isEn ? currentDrill.mouthTipEn : currentDrill.mouthTipVi}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/70">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-indigo-400">
                            {isEn ? 'Example:' : 'Câu ví dụ:'}
                          </span>
                          {(currentDrill.exampleEn || currentDrill.targetText) && (
                            <button
                              type="button"
                              onClick={() =>
                                handlePlayModel(playbackSpeed, currentDrill.exampleEn || currentDrill.targetText)
                              }
                              className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>{isEn ? 'Listen' : 'Nghe'}</span>
                            </button>
                          )}
                        </div>
                        <p className="font-semibold text-white">
                          "{currentDrill.exampleEn || currentDrill.targetText}"
                        </p>
                        {!isEn && currentDrill.exampleVi && (
                          <p className="text-[11px] text-slate-400 italic mt-0.5">
                            {currentDrill.exampleVi}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-3 lg:hidden" />
              </>
            ) : activeBatchObj && !activeBatchObj.isUnlocked ? (
              <div className="my-auto">
                <BatchUnlockGateCard
                  targetBatch={activeBatchObj}
                  isEn={isEn}
                  onUnlockBatch={handlePurchaseBatch}
                  onGoToPrevBatch={(prevIdx) => handleSelectBatch(prevIdx)}
                  onOpenAuth={onOpenAuth}
                  onOpenArena={handleOpenArenaSafe}
                />
              </div>
            ) : nextLockedBatchAfterCurrent && activeBatchObj?.isCompleted ? (
              <div className="my-auto">
                <BatchUnlockGateCard
                  targetBatch={nextLockedBatchAfterCurrent}
                  isCelebrationMode
                  isEn={isEn}
                  onUnlockBatch={handlePurchaseBatch}
                  onOpenAuth={onOpenAuth}
                  onOpenArena={handleOpenArenaSafe}
                  onShowCompletedItems={toggleHidePassed}
                />
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 text-center space-y-3 my-auto">
                <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-black text-white">
                  {passedCountInTab > 0 && hidePassed
                    ? isEn
                      ? `All ${passedCountInTab} drills in this track mastered!`
                      : `Chúc mừng! Bạn đã phát âm chuẩn toàn bộ ${passedCountInTab} bài trong mục này!`
                    : isEn
                    ? 'No drills match your current filter'
                    : 'Không có bài tập nào khớp bộ lọc hiện tại'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {passedCountInTab > 0 && hidePassed
                    ? isEn
                      ? 'You have completed all available drills in this bank! Proactively add new words (with a collocation & example sentence) to your Vocab Notebook to keep expanding your pronunciation bank.'
                      : 'Bạn đã luyện xong toàn bộ ngân hàng hiện có! Hãy chủ động thêm từ mới (gồm từ, cụm từ hay đi kèm và câu ví dụ) vào Sổ Tay Từ Vựng để tiếp tục mở rộng ngân hàng phát âm.'
                    : isEn
                    ? 'Passed drills are automatically hidden to keep your queue focused. You can reveal them anytime or switch to another track.'
                    : 'Các bài bạn đã phát âm chuẩn (≥80%) được tự động ẩn đi để đỡ rối. Bạn có thể hiện lại bất cứ lúc nào hoặc thêm từ mới.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {currentUser && onOpenVocabNotebook && (
                    <button
                      type="button"
                      onClick={() => onOpenVocabNotebook()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
                    >
                      {isEn ? '+ Add Word to Vocab Notebook' : '+ Thêm từ mới vào Sổ Tay'}
                    </button>
                  )}
                  {passedCountInTab > 0 && hidePassed && (
                    <button
                      type="button"
                      onClick={toggleHidePassed}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                    >
                      {isEn ? `Show Passed (${passedCountInTab})` : `Hiện lại bài đã đạt (${passedCountInTab})`}
                    </button>
                  )}
                  {!currentUser && (
                    <button
                      type="button"
                      onClick={() => onOpenAuth?.()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer"
                    >
                      {lockedCountForGuest > 0
                        ? isEn
                          ? `Sign in to unlock +${lockedCountForGuest} drills & Vocab Notebook`
                          : `Đăng nhập mở +${lockedCountForGuest} bài & Sổ Tay`
                        : isEn
                        ? 'Sign in to add your own words'
                        : 'Đăng nhập để thêm từ vào Sổ Tay'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* ================================================================= */}
        {/* MOBILE STICKY BOTTOM THUMB-ZONE ACTION BAR (< lg)                 */}
        {/* ================================================================= */}
        {currentDrill && (
          <div className="lg:hidden shrink-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex items-center gap-2 z-30">
            <button
              type="button"
              onClick={() => handlePlayModel(playbackSpeed)}
              className="min-h-[46px] px-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              title={isEn ? 'Listen to native model' : 'Nghe giọng mẫu'}
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Listen' : 'Nghe'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleRecording}
              className={`flex-1 min-h-[46px] px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer ${
                speechEngine.isListening
                  ? evaluationResult && !evaluationResult.isPassed
                    ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                    : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {speechEngine.isListening
                  ? evaluationResult && !evaluationResult.isPassed
                    ? isEn
                      ? `Speak Again... (#${attemptCount + 1})`
                      : `Đọc lại ngay... (Lần #${attemptCount + 1})`
                    : isAutoMode
                    ? isEn
                      ? 'Auto-Listening...'
                      : 'Đang nghe (Tự chấm)...'
                    : isEn
                    ? 'Stop & Score'
                    : 'Dừng & Chấm'
                  : isEn
                  ? 'Tap to Speak'
                  : 'Bấm để Nói'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleAdvanceToNextDrill}
              className={`min-h-[46px] px-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer shrink-0 ${
                evaluationResult?.isPassed
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 shadow-lg ring-2 ring-indigo-400/70 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title={isEn ? 'Next drill' : 'Bài tiếp theo'}
            >
              <span>{evaluationResult?.isPassed ? (isEn ? 'Next Word' : 'Từ tiếp') : (isEn ? 'Next' : 'Tiếp')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* MOBILE DRILL LIST BOTTOM SHEET (< lg)                             */}
        {/* ================================================================= */}
        {isMobileListOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-150"
            onClick={() => setIsMobileListOpen(false)}
          >
            <div
              className="w-full bg-slate-900 border-t border-slate-700 rounded-t-3xl h-[82dvh] flex flex-col overflow-hidden shadow-2xl pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <List className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-black text-white">
                    {isEn
                      ? `Select Drill (${activeTrackDrills.length})`
                      : `Chọn Bài Luyện Phát Âm (${activeTrackDrills.length})`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileListOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {renderDrillListContent(true)}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* 4. CUSTOM PRONUNCIATION DRILL CREATOR MODAL OVERLAY               */}
        {/* ================================================================= */}
        <PronunciationCustomDrillModal
          isOpen={isCreatorOpen}
          onClose={() => setIsCreatorOpen(false)}
          apiKey={apiKey}
          model={model}
          vocabList={vocabList}
          onCreatedDrill={handleCreatedCustomDrill}
          isEn={isEn}
        />
      </div>
    </div>
  );
}
