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
  Trophy
} from 'lucide-react';
import {
  PRONUNCIATION_TRACKS,
  PRONUNCIATION_WORD_DRILLS,
  PRONUNCIATION_PHRASE_DRILLS,
  PRONUNCIATION_SENTENCE_DRILLS,
  evaluatePronunciationAttempt,
  buildCustomPronunciationDrill
} from '../data/pronunciationData';
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
import { addGold } from '../services/gamification/atlasWalletService';
import { getUnifiedStreakCount } from '../services/gamification/leagueEngine';

const CUSTOM_DRILLS_STORAGE_KEY = 'ielts_pronunciation_custom_drills_v1';
const PRONUNCIATION_STATS_STORAGE_KEY = 'ielts_pronunciation_stats_v1';

export default function PronunciationStudioModal({
  isOpen,
  onClose,
  currentUser = null,
  vocabList = [],
  onSaveToNotebook,
  masteredIds = [],
  onToggleMastered,
  initialOptions = null
}) {
  const { isEn } = useTranslation();

  const validTabs = ['words', 'phrases', 'sentences'];

  // 1. Active Track Tab ('words' | 'phrases' | 'sentences')
  const [activeTab, setActiveTab] = useState(() => {
    if (initialOptions?.tab && validTabs.includes(initialOptions.tab)) {
      return initialOptions.tab;
    }
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const tabParam = search.get('tab');
      if (tabParam && validTabs.includes(tabParam)) return tabParam;
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.endsWith('/phrases')) return 'phrases';
      if (pathname.endsWith('/sentences')) return 'sentences';
      if (pathname.endsWith('/words')) return 'words';
    }
    return safeGet('ielts_pronunciation_active_tab', 'words');
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

  // 2. Expanded / Fullscreen State (Alt+Z)
  const [isExpanded, setIsExpanded] = useState(() =>
    Boolean(safeGet('ielts_pronunciation_expanded', false))
  );

  const toggleExpanded = () => {
    setIsExpanded(prev => {
      const next = !prev;
      safeSet('ielts_pronunciation_expanded', next);
      return next;
    });
  };

  // 3. Voice Accent & Playback Speed
  const [selectedExaminerId, setSelectedExaminerId] = useState(() =>
    safeGet('ielts_pronunciation_examiner', 'examiner-arthur')
  );
  const [playbackSpeed, setPlaybackSpeed] = useState(0.9); // 0.75 | 0.9 | 1.0

  useEffect(() => {
    safeSet('ielts_pronunciation_examiner', selectedExaminerId);
  }, [selectedExaminerId]);

  const speechEngine = useSpeechEngine({
    examinerId: selectedExaminerId
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

  // 6. Filters & Drill List
  const [searchQuery, setSearchQuery] = useState('');
  const [bandFilter, setBandFilter] = useState('all'); // 'all' | 'foundation' | 'band7' | 'band8'
  const [hideMastered, setHideMastered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // 7. Create Custom Drill Modal / Drawer State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customType, setCustomType] = useState('auto');
  const [customMeaning, setCustomMeaning] = useState('');
  const [customBand, setCustomBand] = useState('7.0');

  // 8. Practice & Evaluation State for Current Drill
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [manualSpokenInput, setManualSpokenInput] = useState('');
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [isPlayingUserClip, setIsPlayingUserClip] = useState(false);
  const [isComparingAudio, setIsComparingAudio] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [savedToVaultToast, setSavedToVaultToast] = useState(false);
  const userAudioRef = useRef(null);

  // Combine built-in drills + custom drills for active tab
  const activeTrackDrills = useMemo(() => {
    const baseList =
      activeTab === 'words'
        ? PRONUNCIATION_WORD_DRILLS
        : activeTab === 'phrases'
        ? PRONUNCIATION_PHRASE_DRILLS
        : PRONUNCIATION_SENTENCE_DRILLS;

    const customForTab = (Array.isArray(customDrills) ? customDrills : []).filter(
      d => d.type === activeTab
    );

    let combined = [...customForTab, ...baseList];

    if (bandFilter === 'foundation') {
      combined = combined.filter(d => parseFloat(d.bandLevel) <= 6.5);
    } else if (bandFilter === 'band7') {
      combined = combined.filter(d => parseFloat(d.bandLevel) === 7.0 || parseFloat(d.bandLevel) === 7.5);
    } else if (bandFilter === 'band8') {
      combined = combined.filter(d => parseFloat(d.bandLevel) >= 8.0);
    }

    if (hideMastered && Array.isArray(masteredIds) && masteredIds.length > 0) {
      combined = combined.filter(d => !masteredIds.includes(d.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      combined = combined.filter(
        d =>
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
  }, [activeTab, customDrills, bandFilter, hideMastered, masteredIds, searchQuery]);

  const currentDrill = activeTrackDrills[selectedIdx] || activeTrackDrills[0] || null;
  const clipKey = currentDrill ? `pron_clip_${currentDrill.id}` : 'pron_clip_default';
  const currentAudioClip = speechEngine.audioClips[clipKey];

  // Reset evaluation when switching drill
  useEffect(() => {
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
    speechEngine.resetTranscript();
  }, [currentDrill?.id]);

  // Clean up audio on modal close
  useEffect(() => {
    if (!isOpen) {
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

  // Keyboard shortcut Alt+Z for fullscreen
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        toggleExpanded();
      } else if (e.key === 'Escape' && !isCreatorOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCreatorOpen, onClose]);

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

      // 3. Award Scholastic Gold
      const goldReward = Math.max(5, Math.round(totalDeltaXp * 0.4));
      try {
        addGold(goldReward, `Pronunciation Practice: ${drill.targetText.slice(0, 24)}`, true);
      } catch (e) {}

      // 4. Show Floating XP Toast
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

  // Run scoring on spoken transcript
  const handleRunEvaluation = useCallback(
    (spokenTextToEvaluate) => {
      if (!currentDrill) return;
      const cleanSpoken = String(spokenTextToEvaluate || '').trim();
      const confidence = speechEngine.speechConfidenceStats?.averageConfidence || 0.88;

      const result = evaluatePronunciationAttempt({
        targetText: currentDrill.targetText,
        spokenText: cleanSpoken,
        confidence,
        itemType: currentDrill.type,
        streak: pronStats.streak || 0
      });

      setEvaluationResult({
        ...result,
        spokenTranscript: cleanSpoken
      });

      if (result.overallAccuracy > 0 && result.xpEarned > 0) {
        awardPronunciationXp(result, currentDrill);
      }
    },
    [currentDrill, speechEngine.speechConfidenceStats, pronStats.streak, awardPronunciationXp]
  );

  // Play native TTS model
  const handlePlayModel = (customRate = null, textOverride = null) => {
    if (!currentDrill && !textOverride) return;
    if (speechEngine.isListening) {
      speechEngine.stopListening();
    }
    const textToSpeak = textOverride || currentDrill.targetText;
    const rateToUse = customRate || playbackSpeed;
    speechEngine.speak(textToSpeak, {
      examinerId: selectedExaminerId,
      rate: rateToUse
    });
  };

  // Start / Stop Microphone Recording
  const handleToggleRecording = async () => {
    if (!currentDrill) return;

    if (speechEngine.isListening) {
      speechEngine.stopListening();
      // Wait 250ms for final transcript buffer flush, then evaluate
      setTimeout(() => {
        const captured =
          speechEngine.transcript ||
          speechEngine.interimTranscript ||
          speechEngine.transcriptsByClip?.[clipKey] ||
          '';
        if (captured.trim()) {
          handleRunEvaluation(captured);
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
    setIsComparingAudio(true);
    speechEngine.speak(
      currentDrill.targetText,
      { examinerId: selectedExaminerId, rate: playbackSpeed },
      () => {
        setTimeout(() => {
          handleReplayUserAudio();
        }, 300);
      }
    );
  };

  // Create custom pronunciation exercise
  const handleCreateCustomDrill = (e) => {
    e?.preventDefault();
    if (!customText.trim()) return;

    const newDrill = buildCustomPronunciationDrill({
      text: customText.trim(),
      type: customType,
      bandLevel: customBand,
      topic: isEn ? 'Custom Drill' : 'Bài tập tự tạo',
      meaning: customMeaning.trim()
    });

    const nextList = [newDrill, ...(Array.isArray(customDrills) ? customDrills : [])];
    setCustomDrills(nextList);
    safeSet(CUSTOM_DRILLS_STORAGE_KEY, nextList);

    setCustomText('');
    setCustomMeaning('');
    setIsCreatorOpen(false);
    handleSelectTab(newDrill.type);
    setSelectedIdx(0);
  };

  // Quick import from user's Personal Vocabulary Notebook
  const handleImportFromVocabVault = (vocabItem) => {
    if (!vocabItem?.word) return;
    const newDrill = buildCustomPronunciationDrill({
      text: vocabItem.word,
      type: 'auto',
      bandLevel: vocabItem.band || '7.0',
      topic: vocabItem.topic || (isEn ? 'Vocab Vault' : 'Sổ tay từ vựng'),
      meaning: vocabItem.meaning || ''
    });
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-2 md:p-4 overflow-hidden animate-in fade-in duration-150">
      <div
        className={`bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isExpanded
            ? 'w-screen h-[100dvh] max-w-none rounded-none'
            : 'w-full max-w-[1480px] h-[100dvh] sm:h-[94dvh] sm:rounded-3xl'
        }`}
      >
        {/* ================================================================= */}
        {/* 1. TOP HEADER BAR WITH LIVE XP, LEVEL PROGRESS & VOICE SETTINGS   */}
        {/* ================================================================= */}
        <header className="px-3 sm:px-6 py-3 bg-gradient-to-r from-slate-950 via-indigo-950/70 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Brand & URL Pill */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                  {isEn ? 'Pronunciation & Intonation Studio' : 'Phòng Luyện Phát Âm & Ngữ Điệu'}
                </h2>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  /pronunciation
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {isEn
                  ? 'Cambridge phonological training for individual words, linked phrases & full sentences'
                  : 'Luyện phát âm chuẩn Cambridge cho từng từ đơn, cụm từ nối âm & ngữ điệu cả câu'}
              </p>
            </div>
          </div>

          {/* Center: Live XP & Level Progress Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner">
            <div className="flex items-center space-x-1.5">
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border ${levelProgress.tier.badgeColor}`}>
                Lv.{levelProgress.level}
              </span>
              <span className="hidden lg:inline text-[11px] font-bold text-slate-300">
                {isEn ? levelProgress.tier.titleEn : levelProgress.tier.titleVi}
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="w-20 sm:w-28">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-0.5">
                <span className="text-amber-400 font-black">{userTotalXp.toLocaleString()} XP</span>
                <span>{levelProgress.progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-500"
                  style={{ width: `${levelProgress.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Session XP & Streak */}
            <div className="flex items-center space-x-1.5 pl-1.5 border-l border-slate-800 text-[11px] font-black">
              <span className="inline-flex items-center space-x-0.5 text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                <Zap className="w-3 h-3 fill-current" />
                <span>+{sessionXp} XP</span>
              </span>
              <span
                className="inline-flex items-center space-x-0.5 text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-lg"
                title={isEn ? 'Consecutive clear pronunciation streak' : 'Chuỗi phát âm chuẩn liên tiếp'}
              >
                <Flame className="w-3 h-3 fill-current" />
                <span>{pronStats.streak || 0}</span>
              </span>
            </div>
          </div>

          {/* Right: Actions (Create Drill, Share, Expand, Close) */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreatorOpen(true)}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              title={isEn ? 'Create custom word, phrase, or sentence drill' : 'Tạo bài tập phát âm từ, cụm từ hoặc câu mới'}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? 'Create Drill' : 'Tạo Bài Tập'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareUrl}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              title={isEn ? 'Copy direct link (/pronunciation)' : 'Sao chép đường dẫn (/pronunciation)'}
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">{copiedUrl ? (isEn ? 'Copied!' : 'Đã chép!') : (isEn ? 'Share' : 'Chia sẻ')}</span>
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
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title={isEn ? 'Close Pronunciation Studio (Esc)' : 'Đóng phòng luyện phát âm (Esc)'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

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
        {/* 2. TRACK SWITCHER (WORDS / PHRASES / SENTENCES) & VOICE TOOLBAR   */}
        {/* ================================================================= */}
        <div className="px-3 sm:px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* 3 Track Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {PRONUNCIATION_TRACKS.map(track => {
              const isActive = activeTab === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTab(track.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r ${track.badgeColor} text-white shadow-lg`
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{isEn ? track.labelEn : track.labelVi}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-black/25 text-white' : 'bg-slate-800 text-amber-400'
                    }`}
                  >
                    +{track.baseXp} XP
                  </span>
                </button>
              );
            })}
          </div>

          {/* Native Voice Accent & Speed Controls */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Examiner Voice Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {SPEAKING_EXAMINER_PROFILES.map(ex => {
                const isSelected = selectedExaminerId === ex.id;
                const shortLabel =
                  ex.id === 'examiner-arthur'
                    ? '🇬🇧 UK Male'
                    : ex.id === 'examiner-eleanor'
                    ? '🇬🇧 UK Female'
                    : '🇺🇸 US Male';
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setSelectedExaminerId(ex.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Playback Speed Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
              {[
                { rate: 0.75, label: isEn ? '0.75x Slow' : '0.75x Chậm' },
                { rate: 0.9, label: isEn ? '0.9x Clear' : '0.9x Chuẩn' },
                { rate: 1.0, label: isEn ? '1.0x Native' : '1.0x Tự nhiên' }
              ].map(sp => (
                <button
                  key={sp.rate}
                  type="button"
                  onClick={() => setPlaybackSpeed(sp.rate)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    playbackSpeed === sp.rate
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. MAIN WORKSPACE: LEFT EXERCISE QUEUE + RIGHT PRACTICE STAGE     */}
        {/* ================================================================= */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* LEFT SIDEBAR: Exercise List & Search/Band Filter */}
          <aside className="w-full lg:w-80 xl:w-96 bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0 max-h-52 lg:max-h-none">
            {/* Search & Band Filter Bar */}
            <div className="p-3 border-b border-slate-800/80 space-y-2">
              <div className="relative">
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
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: isEn ? 'All' : 'Tất cả' },
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
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                        bandFilter === b.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setHideMastered(prev => !prev)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer border ${
                    hideMastered
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                  title={isEn ? 'Hide mastered items' : 'Ẩn các bài đã thuộc'}
                >
                  {isEn ? 'Hide Mastered' : 'Ẩn đã thuộc'}
                </button>
              </div>
            </div>

            {/* Drill Items Scroll List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 overscroll-contain">
              {activeTrackDrills.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                  <p>
                    {isEn
                      ? 'No pronunciation drills match your filter.'
                      : 'Không có bài tập phát âm nào khớp bộ lọc.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setBandFilter('all');
                      setHideMastered(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                  >
                    {isEn ? 'Reset Filters' : 'Đặt lại bộ lọc'}
                  </button>
                </div>
              ) : (
                activeTrackDrills.map((item, idx) => {
                  const isSelected = currentDrill?.id === item.id;
                  const best = pronStats.bestScores?.[item.id];
                  const itemMastered = Array.isArray(masteredIds) && masteredIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`group w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-950/70 border-indigo-500/60 shadow-md'
                          : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300">
                            Band {item.bandLevel}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate">
                            {isEn ? item.topicEn : item.topicVi}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                              {isEn ? 'Custom' : 'Tự tạo'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-extrabold text-white truncate">
                          {item.targetText}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {isEn ? item.meaningEn : item.meaningVi}
                        </div>
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
                })
              )}
            </div>
          </aside>

          {/* RIGHT MAIN STAGE: Phonetic Target, Live Mic Recorder & Word-by-Word Diagnostics */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 overscroll-contain">
            {currentDrill ? (
              <>
                {/* ========================================================= */}
                {/* CARD 1: TARGET PHONETIC & INTONATION DISPLAY              */}
                {/* ========================================================= */}
                <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl space-y-4">
                  {/* Top Meta Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {isEn ? currentDrill.categoryEn : currentDrill.categoryVi}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">
                        {isEn ? currentDrill.topicEn : currentDrill.topicVi}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Target Band {currentDrill.bandLevel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>+{currentDrill.xpReward} XP</span>
                      </span>
                    </div>

                    {/* Save to Vocab Vault & Mastered Buttons */}
                    <div className="flex items-center space-x-2">
                      {onSaveToNotebook && (
                        <button
                          type="button"
                          onClick={handleSaveCurrentToVocab}
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>
                            {savedToVaultToast
                              ? isEn
                                ? 'Saved!'
                                : 'Đã lưu!'
                              : isEn
                              ? 'Save to Vault'
                              : 'Lưu Sổ Từ'}
                          </span>
                        </button>
                      )}

                      {onToggleMastered && (
                        <button
                          type="button"
                          onClick={() => onToggleMastered(currentDrill.id)}
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            isMastered
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {isMastered
                              ? isEn
                                ? 'Mastered'
                                : 'Đã thuộc'
                              : isEn
                              ? 'Mark Mastered'
                              : 'Đánh dấu thuộc'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Target Text & Phonetic Breakdown */}
                  <div className="space-y-2.5 py-2">
                    <div className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                      {currentDrill.targetText}
                    </div>

                    {/* Track-specific visual pronunciation guide */}
                    {currentDrill.type === 'words' && currentDrill.syllables && (
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                        <span className="px-3 py-1 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-indigo-200 font-mono font-bold">
                          {currentDrill.syllables}
                        </span>
                        {currentDrill.stressPattern && (
                          <span
                            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-black tracking-widest"
                            title={isEn ? 'Syllable stress rhythm (● = Stressed, ○ = Unstressed)' : 'Nhịp trọng âm (● = Nhấn mạnh, ○ = Không nhấn)'}
                          >
                            {currentDrill.stressPattern}
                          </span>
                        )}
                      </div>
                    )}

                    {currentDrill.type === 'phrases' && currentDrill.connectedText && (
                      <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                          {isEn
                            ? 'Connected Speech & Linking Map (‿ = Link smoothly without pausing):'
                            : 'Sơ Đồ Nối Âm Tự Nhiên (‿ = Nối liền phụ âm cuối sang nguyên âm đầu):'}
                        </div>
                        <div className="text-sm sm:text-base font-mono font-bold text-amber-300">
                          {currentDrill.connectedText}
                        </div>
                      </div>
                    )}

                    {currentDrill.type === 'sentences' && currentDrill.intonationText && (
                      <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                            {isEn
                              ? 'Intonation & Thought-Group Pacing Map:'
                              : 'Bản Đồ Ngữ Điệu & Ngắt Nhịp Cụm Tư Duy:'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isEn
                              ? '↗ Rise • ↘ Fall • / Short Pause • // Clause Break'
                              : '↗ Lên giọng • ↘ Xuống giọng • / Nghỉ ngắn • // Ngắt mệnh đề'}
                          </span>
                        </div>
                        <div className="text-sm sm:text-base font-bold text-amber-200 leading-relaxed">
                          {currentDrill.intonationText}
                        </div>
                      </div>
                    )}

                    {/* IPA UK / US Row & Meaning */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-cyan-300">
                        🇬🇧 UK: {currentDrill.ipaUk}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-rose-300">
                        🇺🇸 US: {currentDrill.ipaUs}
                      </span>
                      <span className="text-slate-300 font-semibold">
                        — {isEn ? currentDrill.meaningEn : currentDrill.meaningVi}
                      </span>
                    </div>
                  </div>

                  {/* Action Row: Listen to Native Model (Normal & Slow 0.75x) */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handlePlayModel(playbackSpeed)}
                      className="flex-1 min-w-[180px] py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg shadow-indigo-950/50 transition-all active:scale-98 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 shrink-0" />
                      <span>
                        {speechEngine.isSpeaking
                          ? isEn
                            ? 'Speaking Model...'
                            : 'Đang phát giọng mẫu...'
                          : isEn
                          ? `1. Listen to Native Model (${playbackSpeed}x)`
                          : `1. Nghe Giọng Mẫu Bản Xứ (${playbackSpeed}x)`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePlayModel(0.75)}
                      className="py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-98 cursor-pointer"
                      title={isEn ? 'Listen slowly at 0.75x to hear every phoneme clearly' : 'Nghe tách âm chậm 0.75x để nghe rõ từng âm tiết'}
                    >
                      <Headphones className="w-4 h-4 shrink-0" />
                      <span>{isEn ? 'Slow Breakdown (0.75x)' : 'Nghe Chậm Tách Âm (0.75x)'}</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* CARD 2: MICROPHONE RECORDER, WAVEFORM & SCORING ENGINE    */}
                {/* ========================================================= */}
                <div
                  className={`p-4 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                    speechEngine.isListening
                      ? 'bg-slate-950 border-emerald-500/70 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/90 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                        {isEn
                          ? '2. Speak & Get Instant Phonetic Score (+XP)'
                          : '2. Phát Âm Qua Micro & Nhận Điểm Kinh Nghiệm (+XP)'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {speechEngine.isListening ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-black animate-pulse">
                          {isEn ? '● REC • LISTENING TO YOUR VOICE' : '● REC • ĐANG NGHE BẠN PHÁT ÂM'}
                        </span>
                      ) : currentBest ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                          {isEn
                            ? `Personal Best: ${currentBest.accuracy}% (Band ${currentBest.band})`
                            : `Kỷ lục bài này: ${currentBest.accuracy}% (Band ${currentBest.band})`}
                        </span>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setShowManualFallback(prev => !prev)}
                        className="text-[11px] text-slate-400 hover:text-indigo-300 underline cursor-pointer"
                      >
                        {isEn ? 'No Mic / Text Test?' : 'Không có Mic / Nhập thử?'}
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
                    {(speechEngine.transcript || speechEngine.interimTranscript) && (
                      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-2xs flex items-center justify-center px-4 text-center">
                        <p className="text-xs sm:text-sm font-bold text-emerald-300 truncate">
                          "{speechEngine.transcript} {speechEngine.interimTranscript}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Primary Record / Stop Button */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleToggleRecording}
                      className={`flex-1 min-w-[220px] py-3 px-5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer ${
                        speechEngine.isListening
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-950/50'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50'
                      }`}
                    >
                      <Mic className="w-4 h-4 shrink-0" />
                      <span>
                        {speechEngine.isListening
                          ? isEn
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
                            isPlayingUserClip
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                          }`}
                        >
                          {isPlayingUserClip ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isEn ? 'Replay My Voice' : 'Nghe Lại Giọng Bạn'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCompareSideBySide}
                          disabled={isComparingAudio}
                          className="py-3 px-4 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Compare Model ➔ Yours' : 'So Sánh Mẫu ➔ Giọng Bạn'}</span>
                        </button>
                      </>
                    )}
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
                            setManualSpokenInput(currentDrill.targetText);
                            handleRunEvaluation(currentDrill.targetText);
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
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 space-y-4 animate-in fade-in duration-200">
                      {/* Score Summary Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black border ${
                              evaluationResult.overallAccuracy >= 85
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : evaluationResult.overallAccuracy >= 65
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            <span className="text-lg leading-none">{evaluationResult.overallAccuracy}%</span>
                            <span className="text-[9px] uppercase tracking-wider mt-0.5">
                              {isEn ? 'Score' : 'Độ chuẩn'}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm sm:text-base font-black text-white">
                                {isEn
                                  ? `Pronunciation Band: ${evaluationResult.estimatedBand}`
                                  : `Band Phát Âm Ước Tính: ${evaluationResult.estimatedBand}`}
                              </span>
                              {evaluationResult.xpEarned > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-sm">
                                  +{evaluationResult.xpEarned} XP
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isEn
                                ? `Recognized speech: "${evaluationResult.spokenTranscript || '...'}"`
                                : `Hệ thống ghi nhận: "${evaluationResult.spokenTranscript || '...'}"`}
                            </p>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center space-x-2 text-[10px] font-bold">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {isEn ? '● Accurate (≥84%)' : '● Chuẩn xác (≥84%)'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {isEn ? '● Near (52-83%)' : '● Gần đúng (52-83%)'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {isEn ? '● Retry (<52%)' : '● Cần đọc lại (<52%)'}
                          </span>
                        </div>
                      </div>

                      {/* Word-by-Word Interactive Chips (Click any word to hear it pronounced individually!) */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-400">
                          {isEn
                            ? 'Word-by-Word Phonetic Diagnosis (Click any word below to hear its isolated pronunciation):'
                            : 'Chẩn Đoán Từng Từ (Nhấp vào bất kỳ từ nào bên dưới để nghe phát âm mẫu riêng từ đó):'}
                        </div>
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
                                onClick={() => handlePlayModel(0.85, wb.cleanWord || wb.word)}
                                className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black flex items-center space-x-1.5 transition-all cursor-pointer ${chipStyle}`}
                                title={
                                  isEn
                                    ? `Click to listen to "${wb.word}" (${wb.similarity}% match)`
                                    : `Bấm để nghe phát âm riêng từ "${wb.word}" (Khớp ${wb.similarity}%)`
                                }
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
                      </div>

                      {/* Examiner Coach Feedback */}
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start space-x-2.5">
                        <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-amber-400 mr-1.5">
                            {isEn ? 'Examiner Feedback:' : 'Nhận xét từ Giám khảo:'}
                          </span>
                          <span>
                            {isEn ? evaluationResult.coachFeedbackEn : evaluationResult.coachFeedbackVi}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ========================================================= */}
                {/* CARD 3: ARTICULATION GUIDE, PRONUNCIATION TRAP & EXAMPLE  */}
                {/* ========================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Common Pronunciation Trap & Mouth/Tongue Placement */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>
                          {isEn ? 'Common Pronunciation Trap' : 'Bẫy Phát Âm Học Viên Hay Mắc'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isEn ? currentDrill.trapEn : currentDrill.trapVi}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {isEn
                            ? 'Articulation & Mouth/Tongue Tip'
                            : 'Bí Quyết Đặt Khẩu Hình & Lưỡi'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isEn ? currentDrill.mouthTipEn : currentDrill.mouthTipVi}
                      </p>
                    </div>
                  </div>

                  {/* Contextual Example & Prev/Next Navigation */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center space-x-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>
                            {isEn ? 'IELTS Context & Example' : 'Ngữ Cảnh & Câu Ví Dụ IELTS'}
                          </span>
                        </span>
                        {(currentDrill.exampleEn || currentDrill.targetText) && (
                          <button
                            type="button"
                            onClick={() =>
                              handlePlayModel(playbackSpeed, currentDrill.exampleEn || currentDrill.targetText)
                            }
                            className="px-2 py-0.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{isEn ? 'Listen Example' : 'Nghe câu ví dụ'}</span>
                          </button>
                        )}
                      </div>
                      <p className="text-xs font-bold text-white leading-relaxed">
                        "{currentDrill.exampleEn || currentDrill.targetText}"
                      </p>
                      {!isEn && currentDrill.exampleVi && (
                        <p className="text-[11px] text-slate-400 italic">
                          {currentDrill.exampleVi}
                        </p>
                      )}
                    </div>

                    {/* Prev / Next Exercise Navigation Buttons */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIdx(prev =>
                            prev > 0 ? prev - 1 : activeTrackDrills.length - 1
                          )
                        }
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{isEn ? 'Previous' : 'Bài trước'}</span>
                      </button>

                      <span className="text-[11px] font-bold text-slate-400">
                        {selectedIdx + 1} / {activeTrackDrills.length}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedIdx(prev =>
                            prev < activeTrackDrills.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md cursor-pointer"
                      >
                        <span>{isEn ? 'Next Drill' : 'Bài tiếp theo'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </main>
        </div>

        {/* ================================================================= */}
        {/* 4. CUSTOM PRONUNCIATION DRILL CREATOR MODAL OVERLAY               */}
        {/* ================================================================= */}
        {isCreatorOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-black text-white">
                    {isEn
                      ? 'Create Custom Pronunciation Exercise'
                      : 'Tạo Bài Tập Phát Âm Mới (Từ / Cụm Từ / Câu)'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatorOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomDrill} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isEn
                      ? 'Target English Word, Phrase, or Full Sentence *'
                      : 'Nhập Từ đơn, Cụm từ hoặc Câu tiếng Anh cần luyện phát âm *'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder={
                      isEn
                        ? 'e.g., conscientious, play a pivotal role in, or a full IELTS Speaking sentence...'
                        : 'VD: conscientious, play a pivotal role in, hoặc cả một câu IELTS Speaking...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? 'Exercise Track' : 'Phân loại bài tập'}
                    </label>
                    <select
                      value={customType}
                      onChange={e => setCustomType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="auto">
                        {isEn ? 'Auto-detect (Word/Phrase/Sentence)' : 'Tự động nhận diện (Từ/Cụm/Câu)'}
                      </option>
                      <option value="words">{isEn ? 'Single Word (+15 XP)' : 'Từ đơn (+15 XP)'}</option>
                      <option value="phrases">{isEn ? 'Phrase / Collocation (+25 XP)' : 'Cụm từ (+25 XP)'}</option>
                      <option value="sentences">{isEn ? 'Full Sentence (+35 XP)' : 'Cả câu (+35 XP)'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {isEn ? 'Target Band Level' : 'Mức Band mục tiêu'}
                    </label>
                    <select
                      value={customBand}
                      onChange={e => setCustomBand(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="6.0">Band 6.0</option>
                      <option value="6.5">Band 6.5</option>
                      <option value="7.0">Band 7.0</option>
                      <option value="7.5">Band 7.5</option>
                      <option value="8.0">Band 8.0+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {isEn ? 'Meaning or Pronunciation Note (Optional)' : 'Nghĩa hoặc ghi chú phát âm (Tùy chọn)'}
                  </label>
                  <input
                    type="text"
                    value={customMeaning}
                    onChange={e => setCustomMeaning(e.target.value)}
                    placeholder={
                      isEn
                        ? 'e.g., Thorough and careful; pay attention to /ʃ/ sound'
                        : 'VD: Tận tâm, chu đáo; chú ý âm /ʃ/ ở giữa từ'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                {/* Quick Import from Personal Vocabulary Notebook if available */}
                {Array.isArray(vocabList) && vocabList.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-amber-400 mb-1.5">
                      {isEn
                        ? 'Or 1-Click Import from Your Personal Vocabulary Notebook:'
                        : 'Hoặc nạp nhanh 1-chạm từ Sổ Tay Từ Vựng Cá Nhân của bạn:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {vocabList.slice(0, 12).map(v => (
                        <button
                          key={v.id || v.word}
                          type="button"
                          onClick={() => handleImportFromVocabVault(v)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-[11px] font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                        >
                          + {v.word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatorOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Hủy'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg cursor-pointer"
                  >
                    {isEn ? 'Create & Practice Now' : 'Tạo Bài Tập & Luyện Ngay'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
