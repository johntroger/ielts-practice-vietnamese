import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Swords, Flame, Trophy, Play, RotateCcw, X, ShieldAlert, Maximize2, Minimize2, Share2, Check } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { 
  useArenaSprintEngine, 
  ARENA_SPRINT_PHASES,
  computeSprintDiagnostics,
  getCambridgeTheoryPrescription
} from '../../hooks/useArenaSprintEngine.js';
import { useArenaAudio } from '../../hooks/useArenaAudio.js';
import { openModal } from '../../core/modalStore.js';
import { setupKeyboardNavigation } from '../../utils/keyboardNavigator.js';
import { getIsoWeekKey } from '../../utils/dateHelper.js';
import { 
  getUnifiedStreakCount,
  evaluateWeeklyLeagueTransition
} from '../../services/gamification/leagueEngine.js';
import { 
  fetchRealLeaderboard, 
  reconcileRealLeaderboard, 
  submitRealSprintScore 
} from '../../services/gamification/realLeaderboardService.js';
import { calculateLevelFromXp, getLevelTierInfo } from '../../services/gamification/levelEngine.js';
import { calculateSprintXp } from '../../services/gamification/xpCalculator.js';
import ArenaHeaderBar from './ArenaHeaderBar.jsx';
import ArenaQuestionCard from './ArenaQuestionCard.jsx';
import ArenaRelativeLeaderboard from './ArenaRelativeLeaderboard.jsx';
import ArenaSprintSummaryModal from './ArenaSprintSummaryModal.jsx';
import ArenaLeaguePromotionModal from './ArenaLeaguePromotionModal.jsx';
import PublicLearnerProfileModal from './PublicLearnerProfileModal.jsx';
import LevelUpCelebrationModal from './LevelUpCelebrationModal.jsx';
import ArenaDifficultySelector from './ArenaDifficultySelector.jsx';
import { isAnswerAcceptable, isNearMissAnswer } from '../../services/gamification/cambridgeAnswerValidator.js';
import { 
  ARENA_STORAGE_KEYS, 
  ARENA_DIFFICULTY_LEVELS, 
  ARENA_DIFFICULTY_CONFIG, 
  ARENA_IELTS_TOPICS 
} from '../../utils/arenaStorageKeys.js';
import { safeGet, safeSet } from '../../utils/storageService.js';
import { 
  getUnresolvedMistakeCount, 
  generateRevengeSprintQuestions 
} from '../../services/gamification/mistakeVaultService.js';
import { generateR2ListeningSprintQuestions } from '../../adapters/sprintQuestionAdapter.js';
import { ARENA_PERK_LIST, getPerkById } from '../../services/gamification/tacticalPerksService.js';
import { triggerHaptic } from '../../utils/hapticHelper.js';
import ArenaGhostDuelBar from './ArenaGhostDuelBar.jsx';
import ArenaWorldBossCard from './ArenaWorldBossCard.jsx';
import { createGhostDuel } from '../../services/gamification/ghostDuelService.js';
import { initOfflineQueueAutoSync } from '../../services/gamification/offlineQueueService.js';
import ArenaTowerMapView from './tower/ArenaTowerMapView.jsx';
import ArenaTowerRelicPickerModal from './tower/ArenaTowerRelicPickerModal.jsx';
import ArenaTowerShopModal from './tower/ArenaTowerShopModal.jsx';
import ArenaTowerCampfireModal from './tower/ArenaTowerCampfireModal.jsx';
import ArenaTowerBossFightCard from './tower/ArenaTowerBossFightCard.jsx';
import {
  startNewTowerRun,
  getActiveTowerRun,
  saveActiveTowerRun,
  generateThreeRandomRelics,
  calculateBossDamage,
  TOWER_STORAGE_KEYS,
  TOWER_NODE_TYPES,
  TOWER_RELICS_CATALOG
} from '../../services/gamification/towerOfBabelEngine.js';
import { getQuestionsByTierAndTopic } from '../../data/arenaQuestionBank.js';

/**
 * src/components/arena/AtlasEnglishArenaModal.jsx
 * 
 * Standalone Fast-Paced eSports Sprint Modal for Atlas English Arena.
 * Delivers an immersive full-screen eSports experience with HTML5 Fullscreen support.
 * 100% Real-User Leaderboard: completely eliminates fake bot rivals and highlights real users (e.g. tranthanhtung37).
 */
export default function AtlasEnglishArenaModal({
  isOpen = false,
  onClose,
  currentUser = null,
  onOpenTheory = null
}) {
  const { t, isEn } = useTranslation();
  const { isMuted, toggleMute, playChime, playSfx, speak, stopAudio, unlockAudio } = useArenaAudio();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // State for real-user leaderboard data
  const [leaderboardData, setLeaderboardData] = useState(() => 
    reconcileRealLeaderboard([], currentUser)
  );
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);
  const [weeklyTransition, setWeeklyTransition] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareArena = useCallback(() => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/atlas-arena`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  }, []);

  // Difficulty & Topic States
  const [selectedDifficulty, setSelectedDifficulty] = useState(() => 
    safeGet(ARENA_STORAGE_KEYS.LAST_DIFFICULTY, ARENA_DIFFICULTY_LEVELS.MEDIUM)
  );

  const [currentTopic, setCurrentTopic] = useState(() => {
    const idx = Math.floor(Math.random() * ARENA_IELTS_TOPICS.length);
    return ARENA_IELTS_TOPICS[idx] || ARENA_IELTS_TOPICS[0];
  });

  const [selectedPerk, setSelectedPerk] = useState(() => 
    safeGet(ARENA_STORAGE_KEYS.EQUIPPED_PERK, 'none')
  );

  // Mobile Tab Navigation State: 'match' | 'leaderboard'
  const [activeMobileTab, setActiveMobileTab] = useState('match');

  // Game Mode State: 'blitz' (3-Min Quick Run) | 'tower' (Roguelite Expedition)
  const [gameMode, setGameMode] = useState(() => safeGet('ielts_arena_game_mode', 'blitz'));
  const [towerRun, setTowerRun] = useState(() => getActiveTowerRun());
  const [activeTowerFloor, setActiveTowerFloor] = useState(null);
  const [isTowerRelicModalOpen, setIsTowerRelicModalOpen] = useState(false);
  const [towerRewardRelics, setTowerRewardRelics] = useState([]);
  const [isTowerShopModalOpen, setIsTowerShopModalOpen] = useState(false);
  const [isTowerCampfireModalOpen, setIsTowerCampfireModalOpen] = useState(false);
  const [towerBossState, setTowerBossState] = useState(null);
  const [towerLastDamage, setTowerLastDamage] = useState(0);
  const [towerIsCrit, setTowerIsCrit] = useState(false);

  // Tower Actions
  const handleStartNewTowerExpedition = useCallback(() => {
    const newRun = startNewTowerRun(selectedDifficulty);
    setTowerRun(newRun);
    setActiveTowerFloor(null);
    playChime();
  }, [selectedDifficulty, playChime]);

  const handleAbandonTowerRun = useCallback(() => {
    saveActiveTowerRun(null);
    setTowerRun(null);
    setActiveTowerFloor(null);
    setTowerBossState(null);
  }, []);

  const handleEnterTowerFloor = useCallback((floor) => {
    if (!floor) return;
    setActiveTowerFloor(floor);

    if (floor.type === TOWER_NODE_TYPES.CAMPFIRE) {
      setIsTowerCampfireModalOpen(true);
      return;
    }
    if (floor.type === TOWER_NODE_TYPES.SHOP) {
      setIsTowerShopModalOpen(true);
      return;
    }
    if (floor.type === TOWER_NODE_TYPES.TREASURE) {
      const owned = (towerRun?.relics || []).map(r => r.id);
      const picks = generateThreeRandomRelics(owned);
      setTowerRewardRelics(picks);
      setIsTowerRelicModalOpen(true);
      return;
    }

    // Battle, Elite, or Boss
    const questions = getQuestionsByTierAndTopic(floor.difficulty || 'medium');
    const shuffled = [...questions].sort(() => 0.5 - Math.random()).slice(0, floor.type === TOWER_NODE_TYPES.BOSS ? 5 : 3);
    if (floor.type === TOWER_NODE_TYPES.BOSS) {
      setTowerBossState(floor.boss);
    }
    sprint.startSprint(shuffled, floor.difficulty || 'medium', { isTowerFloor: true });
  }, [towerRun, sprint]);

  const handleSelectTowerRelic = useCallback((relic) => {
    if (!relic || !towerRun) return;
    const nextRelics = [...(towerRun.relics || []), relic];
    const nextFloorIdx = Math.min((towerRun.floors?.length || 10) - 1, (towerRun.currentFloorIndex || 0) + 1);
    const updatedRun = {
      ...towerRun,
      relics: nextRelics,
      currentFloorIndex: nextFloorIdx
    };
    saveActiveTowerRun(updatedRun);
    setTowerRun(updatedRun);
    setIsTowerRelicModalOpen(false);
    playChime();
  }, [towerRun, playChime]);

  const handleTowerBuyItem = useCallback((item, isRelic = false) => {
    if (!item || !towerRun) return;
    const cost = item.cost || item.price || 0;
    if (towerRun.gold < cost) return;

    let updatedRun = {
      ...towerRun,
      gold: towerRun.gold - cost
    };

    if (isRelic) {
      updatedRun.relics = [...(updatedRun.relics || []), item];
    } else if (item.effectType === 'heal_shield') {
      updatedRun.shields = Math.min(updatedRun.maxShields || 5, (updatedRun.shields || 0) + (item.effectValue || 2));
    } else if (item.effectType === 'add_time') {
      updatedRun.timeRemaining = (updatedRun.timeRemaining || 0) + (item.effectValue || 20);
    }

    saveActiveTowerRun(updatedRun);
    setTowerRun(updatedRun);
    playSfx('correct');
  }, [towerRun, playSfx]);

  const handleTowerChooseRest = useCallback(() => {
    if (!towerRun) return;
    const nextFloorIdx = Math.min((towerRun.floors?.length || 10) - 1, (towerRun.currentFloorIndex || 0) + 1);
    const updatedRun = {
      ...towerRun,
      shields: Math.min(towerRun.maxShields || 5, (towerRun.shields || 0) + 2),
      currentFloorIndex: nextFloorIdx
    };
    saveActiveTowerRun(updatedRun);
    setTowerRun(updatedRun);
    setIsTowerCampfireModalOpen(false);
    playChime();
  }, [towerRun, playChime]);

  const handleTowerChoosePurge = useCallback(() => {
    if (!towerRun) return;
    const nextFloorIdx = Math.min((towerRun.floors?.length || 10) - 1, (towerRun.currentFloorIndex || 0) + 1);
    const updatedRun = {
      ...towerRun,
      currentFloorIndex: nextFloorIdx
    };
    saveActiveTowerRun(updatedRun);
    setTowerRun(updatedRun);
    setIsTowerCampfireModalOpen(false);
    playSfx('correct');
  }, [towerRun, playSfx]);

  const handleDifficultyChange = useCallback((diff) => {
    setSelectedDifficulty(diff);
    safeSet(ARENA_STORAGE_KEYS.LAST_DIFFICULTY, diff);
  }, []);

  const streak = useMemo(() => getUnifiedStreakCount(), []);

  // Fetch real users from Supabase / cache whenever modal opens or user auth changes
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetchRealLeaderboard(currentUser).then(res => {
      if (isMounted && res) {
        setLeaderboardData(res);
      }
    });
    return () => { isMounted = false; };
  }, [isOpen, currentUser]);

  // Resilient offline queue auto-sync upon network reconnection
  useEffect(() => {
    if (!isOpen) return;
    const cleanup = initOfflineQueueAutoSync(currentUser);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [isOpen, currentUser]);

  // Evaluate weekly league rollover upon opening modal
  useEffect(() => {
    if (!isOpen || !leaderboardData?.leaderboard?.length) return;
    const currentWeekKey = getIsoWeekKey();
    const lastEvaluatedWeek = safeGet(ARENA_STORAGE_KEYS.LAST_EVALUATED_WEEK, '');

    if (lastEvaluatedWeek && lastEvaluatedWeek !== currentWeekKey) {
      const result = evaluateWeeklyLeagueTransition({
        currentWeekKey,
        lastEvaluatedWeek,
        currentTier: leaderboardData.leagueTier,
        userRank: leaderboardData.currentRank,
        totalPlayers: leaderboardData.leaderboard.length,
        weeklyXp: leaderboardData.userWeeklyXp || 0
      });

      if (result.isNewWeek && result.action === 'promoted') {
        setWeeklyTransition(result);
        playChime();
        submitRealSprintScore({
          currentUser,
          deltaXp: result.bonusXp,
          streakCount: streak
        }).catch(() => {});
      }
      safeSet(ARENA_STORAGE_KEYS.LAST_EVALUATED_WEEK, currentWeekKey);
    } else if (!lastEvaluatedWeek) {
      safeSet(ARENA_STORAGE_KEYS.LAST_EVALUATED_WEEK, currentWeekKey);
    }
  }, [isOpen, currentUser, leaderboardData, playChime, streak]);

  const sprint = useArenaSprintEngine({
    user: currentUser,
    onSprintEnd: async (summary) => {
      if (summary && summary.finalXp > 0) {
        // Calculate old and new level to detect Level-Up
        const currentTotalXp = leaderboardData.userWeeklyXp || 0;
        const oldLevel = calculateLevelFromXp(currentTotalXp);
        const newLevel = calculateLevelFromXp(currentTotalXp + summary.finalXp);

        await submitRealSprintScore({
          currentUser,
          deltaXp: summary.finalXp,
          streakCount: streak + 1
        });
        const updated = await fetchRealLeaderboard(currentUser);
        setLeaderboardData(updated);

        if (newLevel > oldLevel) {
          playChime();
          setLevelUpData({
            oldLevel,
            newLevel,
            tier: getLevelTierInfo(newLevel)
          });
        }
      }
    }
  });

  // Fullscreen toggle support
  const toggleFullscreen = useCallback(() => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const handleClose = useCallback(() => {
    stopAudio();
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    onClose?.();
  }, [onClose, stopAudio]);

  const handleReturnToLobby = useCallback(async () => {
    stopAudio();
    if (sprint.phase === ARENA_SPRINT_PHASES.DEFEATED && sprint.score > 0) {
      const partialXp = calculateSprintXp({
        correctAnswers: sprint.score,
        streakCount: streak,
        totalSeconds: (sprint.duration || 180) - Math.max(0, sprint.timeRemaining),
        difficulty: selectedDifficulty,
        timeRemaining: 0,
        isBossCleared: false
      });
      if (partialXp.finalXp > 0) {
        await submitRealSprintScore({
          currentUser,
          deltaXp: partialXp.finalXp,
          streakCount: streak
        }).catch(() => {});
      }
    }
    sprint.resetSprint();
    const updated = await fetchRealLeaderboard(currentUser);
    if (updated) setLeaderboardData(updated);
  }, [sprint, currentUser, streak, selectedDifficulty, stopAudio]);

  const handleDefeatedRestart = useCallback(async () => {
    stopAudio();
    if (sprint.score > 0) {
      const partialXp = calculateSprintXp({
        correctAnswers: sprint.score,
        streakCount: streak,
        totalSeconds: (sprint.duration || 180) - Math.max(0, sprint.timeRemaining),
        difficulty: selectedDifficulty,
        timeRemaining: 0,
        isBossCleared: false
      });
      if (partialXp.finalXp > 0) {
        await submitRealSprintScore({
          currentUser,
          deltaXp: partialXp.finalXp,
          streakCount: streak
        }).catch(() => {});
      }
    }
    sprint.startSprint(null, selectedDifficulty);
  }, [sprint, currentUser, streak, selectedDifficulty, stopAudio]);

  // Ensure all audio is immediately killed if modal is closed or unmounted
  useEffect(() => {
    if (!isOpen) {
      stopAudio();
    }
    return () => {
      stopAudio();
    };
  }, [isOpen, stopAudio]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Pre-fetch audio assets in active sprint to eliminate in-match latency
  useEffect(() => {
    if (sprint.phase === ARENA_SPRINT_PHASES.ACTIVE && Array.isArray(sprint.questions)) {
      sprint.questions.forEach(q => {
        if (q.audioUrl) {
          try {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = q.audioUrl;
          } catch (e) {
            // Silently ignore prefetch errors
          }
        }
      });
    }
  }, [sprint.phase, sprint.questions]);

  // Speedrun Mode state (Auto-advances immediately on correct answer)
  const [isSpeedrunMode, setIsSpeedrunMode] = useState(() => {
    try {
      return localStorage.getItem('ielts_arena_speedrun_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSpeedrun = useCallback(() => {
    setIsSpeedrunMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ielts_arena_speedrun_mode', String(next));
      } catch {}
      return next;
    });
  }, []);

  // Screen shake & damage juice effect state
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const triggerShake = useCallback(() => {
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 380);
  }, []);

  // Auto-advance timer ref for speedrun mode
  const autoAdvanceTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleOpenTheoryPrescription = useCallback((prescription) => {
    if (prescription) {
      openModal('theory', {
        skill: prescription.handbookSkill || 'grammar-vocab',
        searchQuery: prescription.searchQuery || ''
      });
      if (onOpenTheory) {
        onOpenTheory(prescription);
      }
    }
  }, [onOpenTheory]);

  const defeatedDiagnostics = useMemo(() => {
    if (sprint.phase !== ARENA_SPRINT_PHASES.DEFEATED) return null;
    return computeSprintDiagnostics(sprint.questionHistory, sprint.questions);
  }, [sprint.phase, sprint.questionHistory, sprint.questions]);

  const defeatedPrescription = useMemo(() => {
    if (!defeatedDiagnostics) return null;
    return getCambridgeTheoryPrescription(defeatedDiagnostics.weakestSkill);
  }, [defeatedDiagnostics]);

  const handleCheckAnswer = useCallback(() => {
    if (sprint.phase === ARENA_SPRINT_PHASES.ACTIVE) {
      const curQ = sprint.questions[sprint.currentIndex];
      const isTextInput = curQ?.interactionType === 'text_input';

      if (isTextInput) {
        if (!sprint.userInputText || !sprint.userInputText.trim()) return;
        const acceptable = curQ.acceptableAnswers || [curQ.correctAnswer || (curQ.options && curQ.options[curQ.correctIndex])];
        const isCorrect = isAnswerAcceptable(sprint.userInputText, acceptable, {
          strictSpelling: curQ.strictSpelling ?? true,
          ignoreAccents: true
        });
        if (isCorrect) {
          playSfx('correct');
          sprint.checkAnswer();
          if (isSpeedrunMode) {
            if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = setTimeout(() => {
              sprint.nextQuestion();
            }, 550);
          }
        } else {
          const nearMissCheck = isNearMissAnswer(sprint.userInputText, acceptable);
          if (nearMissCheck.isNearMiss && !sprint.hasUsedNearMiss) {
            playSfx('click');
          } else {
            playSfx('wrong');
            triggerShake();
          }
          sprint.checkAnswer();
        }
      } else if (sprint.selectedOption !== null) {
        const isCorrect = curQ && sprint.selectedOption === curQ.correctIndex;
        if (isCorrect) {
          playSfx('correct');
          sprint.checkAnswer();
          if (isSpeedrunMode) {
            if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = setTimeout(() => {
              sprint.nextQuestion();
            }, 420);
          }
        } else {
          playSfx('wrong');
          triggerShake();
          sprint.checkAnswer();
        }
      }
    }
  }, [sprint, playSfx, isSpeedrunMode, triggerShake]);

  const handleSelectOption = useCallback((idx) => {
    if (sprint.phase !== ARENA_SPRINT_PHASES.ACTIVE || sprint.isAnswerChecked) return;
    sprint.selectOption(idx);

    if (isSpeedrunMode) {
      const curQ = sprint.questions[sprint.currentIndex];
      const isCorrect = curQ && idx === curQ.correctIndex;
      if (isCorrect) {
        playSfx('correct');
        sprint.checkAnswer();
        if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = setTimeout(() => {
          sprint.nextQuestion();
        }, 420);
      } else {
        playSfx('wrong');
        triggerShake();
        sprint.checkAnswer();
      }
    }
  }, [sprint, isSpeedrunMode, playSfx, triggerShake]);

  const handleSkipQuestion = useCallback(() => {
    if (sprint.phase === ARENA_SPRINT_PHASES.ACTIVE) {
      playSfx('wrong');
      triggerShake();
      sprint.skipQuestion();
    } else if (sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
      sprint.nextQuestion();
    }
  }, [sprint, playSfx, triggerShake]);

  // Keyboard navigation wiring
  useEffect(() => {
    if (!isOpen) return;

    return setupKeyboardNavigation({
      isActive: isOpen,
      onSelectOption: (idx) => {
        if (sprint.phase === ARENA_SPRINT_PHASES.ACTIVE) {
          handleSelectOption(idx);
        }
      },
      onSubmit: () => {
        if (sprint.phase === ARENA_SPRINT_PHASES.ACTIVE) {
          const curQ = sprint.questions[sprint.currentIndex];
          const isTextInput = curQ?.interactionType === 'text_input';
          if (isTextInput) {
            if (sprint.userInputText && sprint.userInputText.trim()) {
              handleCheckAnswer();
            }
          } else if (sprint.selectedOption !== null) {
            handleCheckAnswer();
          }
        } else if (sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) {
          sprint.nextQuestion();
        }
      },
      onSkip: () => {
        handleSkipQuestion();
      },
      onSpaceAudio: () => {
        const curQ = sprint.questions[sprint.currentIndex];
        if (curQ?.audioText || curQ?.audioUrl) {
          speak(curQ.audioText || 'audio', curQ);
        }
      }
    });
  }, [isOpen, sprint, speak, handleCheckAnswer, handleSelectOption, handleSkipQuestion]);

  // Auto-play audio when an active Listening question loads
  useEffect(() => {
    if (!isOpen || sprint.phase !== ARENA_SPRINT_PHASES.ACTIVE) {
      stopAudio();
      return;
    }
    const curQ = sprint.questions[sprint.currentIndex];
    if (curQ && (curQ.skillCategory === 'listening' || curQ.type === 'listening_trap' || curQ.type === 'listening_spelling' || curQ.isR2Audio)) {
      speak(curQ.audioText || 'audio', curQ);
    }
    return () => {
      stopAudio();
    };
  }, [isOpen, sprint.phase, sprint.currentIndex, sprint.questions, speak, stopAudio]);

  if (!isOpen) return null;

  const currentQ = sprint.questions[sprint.currentIndex];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col w-full h-[100dvh] overflow-hidden select-none animate-fade-in"
      onClick={unlockAudio}
    >
      <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
        {/* State 1: IDLE / Full-Screen Lobby Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.IDLE && (
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            {/* Top Navigation Bar (Sticky on Mobile to prevent clipping) */}
            <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 shrink-0">
                  <Swords className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xs sm:text-base font-black tracking-wide bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent leading-snug truncate">
                    {t('arena.title')}
                  </h1>
                  <p className="text-[11px] text-slate-400 hidden sm:block leading-none">
                    {t('arena.subtitle')}
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                {streak > 0 && (
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg text-amber-400 text-[11px] sm:text-xs font-bold">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                    <span>{streak} {isEn ? 'd' : 'ngày'}</span>
                  </div>
                )}

                {/* 1-Click Share Direct /atlas-arena URL */}
                <button
                  type="button"
                  onClick={handleShareArena}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  title={isEn ? "Copy direct link to Atlas Arena (/atlas-arena)" : "Sao chép liên kết trực tiếp Đấu Trường (/atlas-arena)"}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-indigo-400" />}
                  <span className="hidden sm:inline font-bold">
                    {copiedLink ? t('arena.linkCopied') : t('arena.shareArena')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                  title={isFullscreen ? t('arena.minimizeWindow') : t('arena.fullscreenWindow')}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                  title={t('arena.exitArena')}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </header>

            {/* Mobile Tab Navigation Bar (Sticky Segmented Controller for < lg screens) */}
            <div className="lg:hidden sticky top-[49px] sm:top-[53px] z-20 w-full px-3 pt-2 pb-1 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
              <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab('match');
                    triggerHaptic('chipTap');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    activeMobileTab === 'match'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Arena Battle' : 'Đấu Trường'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab('leaderboard');
                    triggerHaptic('chipTap');
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    activeMobileTab === 'leaderboard'
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isEn ? 'Ranks & Boss' : 'Bảng Vàng & Boss'}</span>
                </button>
              </div>
            </div>

            {/* Main Fullscreen Lobby Body */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3 md:py-4 flex flex-col justify-center min-h-0">
              {/* Game Mode Switcher Tab Bar */}
              <div className="w-full flex items-center justify-center gap-2 mb-2 shrink-0">
                <div className="flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner max-w-md w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setGameMode('blitz');
                      safeSet('ielts_arena_game_mode', 'blitz');
                      triggerHaptic('chipTap');
                    }}
                    className={`flex-1 py-1.5 sm:py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      gameMode === 'blitz'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{t('arena.modeBlitz')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGameMode('tower');
                      safeSet('ielts_arena_game_mode', 'tower');
                      triggerHaptic('chipTap');
                    }}
                    className={`flex-1 py-1.5 sm:py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      gameMode === 'tower'
                        ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-600/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{t('arena.modeTower')}</span>
                  </button>
                </div>
              </div>

              {gameMode === 'tower' ? (
                towerRun && !towerRun.isCompleted && !towerRun.isDefeated ? (
                  <ArenaTowerMapView
                    runState={towerRun}
                    onEnterFloor={handleEnterTowerFloor}
                    onAbandonRun={handleAbandonTowerRun}
                  />
                ) : (
                  <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center p-5 sm:p-7 bg-gradient-to-b from-amber-950/30 via-slate-900/80 to-purple-950/30 border-2 border-amber-500/40 rounded-2xl shadow-2xl gap-3.5 animate-fade-in my-auto">
                    <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/50 text-3xl animate-bounce">
                      🏰
                    </div>
                    <div className="flex flex-col gap-1 max-w-lg">
                      <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300">
                        {isEn ? 'The Cambridge Tower of Babel' : 'Tháp Khảo Thí Babel - Roguelite'}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {isEn
                          ? 'Embark on a procedural 10-floor roguelite expedition. Ascend through battle chambers, discover ancient relics, visit scholar merchants, rest at campfires, and defeat the Floor 10 Inquisitor Boss!'
                          : 'Bước vào chiến dịch leo 10 tầng tháp cổ: tích lũy cổ vật thần kỳ, kiếm vàng mua bình dược, hồi phục tại lửa trại và tiêu diệt Trùm Khảo Thí Tầng 10!'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-md my-1 text-xs">
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center gap-1">
                        <span className="text-lg">⚔️</span>
                        <span className="font-bold text-slate-200">{isEn ? '10 Floors' : '10 Tầng Tháp'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center gap-1">
                        <span className="text-lg">💎</span>
                        <span className="font-bold text-slate-200">{isEn ? '16+ Relics' : '16 Cổ Vật'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center gap-1">
                        <span className="text-lg">🏪</span>
                        <span className="font-bold text-slate-200">{isEn ? 'Merchant' : 'Nhà Buôn'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center gap-1">
                        <span className="text-lg">👑</span>
                        <span className="font-bold text-slate-200">{isEn ? 'Boss Fight' : 'Trùm Khảo Thí'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartNewTowerExpedition}
                      className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                      {isEn ? 'Begin Ascension →' : 'Bắt Đầu Chuyến Leo Tháp →'}
                    </button>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-6 items-start pb-1 sm:pb-2">
                {/* Left: Hero Banner, Difficulty & Action Controls */}
                <div className={`lg:col-span-6 xl:col-span-7 flex flex-col gap-2 sm:gap-2.5 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-indigo-900/40 rounded-2xl p-3.5 sm:p-4.5 md:p-5 backdrop-blur-md shadow-xl ${
                  activeMobileTab === 'match' ? 'flex' : 'hidden lg:flex'
                }`}>
                  <div className="flex items-center justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] sm:text-xs font-black uppercase tracking-wider min-w-0">
                      <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{t('arena.rulesBadge')}</span>
                    </div>

                    {/* Mobile Quick Switch Pill to World Boss */}
                    <button
                      type="button"
                      onClick={() => setActiveMobileTab('leaderboard')}
                      className="lg:hidden shrink-0 flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full cursor-pointer active:scale-95 transition-transform"
                    >
                      <span>🔥 {isEn ? 'Boss Raid' : 'Săn Boss'}</span>
                      <span>→</span>
                    </button>
                  </div>

                  <h2 className="text-sm sm:text-xl lg:text-2xl font-black text-slate-100 leading-tight sm:leading-snug tracking-tight">
                    {t('arena.heroTitle')}
                  </h2>

                  <p className="text-xs text-slate-300/90 leading-relaxed font-sans hidden sm:block line-clamp-2">
                    {t('arena.heroDescription')}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg py-1.5 px-2 text-center shadow-xs">
                      <div className="text-sm sm:text-base font-black text-indigo-300 font-mono">180s</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">{t('arena.durationLabel')}</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg py-1.5 px-2 text-center shadow-xs">
                      <div className="text-sm sm:text-base font-black text-emerald-300 flex items-center justify-center gap-1">
                        <span>{t('arena.shieldsUnit')}</span>
                        <span className="text-xs">🛡️</span>
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">{t('arena.shieldsLabel')}</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-lg py-1.5 px-2 text-center shadow-xs">
                      <div className="text-sm sm:text-base font-black text-amber-300 font-mono">
                        ~{ARENA_DIFFICULTY_CONFIG[selectedDifficulty]?.maxSprintXp || 200}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">{t('arena.maxRewardLabel')}</div>
                    </div>
                  </div>

                  {/* 4-Tier Difficulty Selector & Topic Preview */}
                  <ArenaDifficultySelector
                    selectedDifficulty={selectedDifficulty}
                    onSelectDifficulty={handleDifficultyChange}
                    currentTopic={currentTopic}
                  />

                  {/* Compact Tactical Perk Selector (Select 1 of 4) */}
                  <div className="flex flex-col gap-1 pt-0.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-indigo-300">
                        <span>⚡</span>
                        <span>{isEn ? 'Tactical Perk:' : 'Thẻ Bổ Trợ Chiến Thuật:'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {isEn ? getPerkById(selectedPerk).descEn : getPerkById(selectedPerk).descVi}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {ARENA_PERK_LIST.map((perk) => {
                        const isSelected = selectedPerk === perk.id;
                        return (
                          <button
                            key={perk.id}
                            type="button"
                            onClick={() => {
                              setSelectedPerk(perk.id);
                              safeSet(ARENA_STORAGE_KEYS.EQUIPPED_PERK, perk.id);
                              triggerHaptic('chipTap');
                            }}
                            className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg border text-left transition-all cursor-pointer select-none text-[11px] font-bold ${
                              isSelected
                                ? 'bg-indigo-600/30 border-indigo-400 text-white ring-1 ring-indigo-500/50 shadow-xs'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                            title={isEn ? perk.descEn : perk.descVi}
                          >
                            <span className="text-sm shrink-0">{perk.icon}</span>
                            <span className="truncate">{isEn ? perk.nameEn : perk.nameVi}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons: Primary Full-Width + Secondary Row on Mobile */}
                  <div className="mt-1 sm:mt-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextTopic = ARENA_IELTS_TOPICS[Math.floor(Math.random() * ARENA_IELTS_TOPICS.length)];
                        setCurrentTopic(nextTopic);
                        sprint.startSprint(null, selectedDifficulty);
                      }}
                      className="w-full sm:flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm sm:text-base py-2.5 sm:py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-white shrink-0" />
                      <span>{t('arena.startSprint')}</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          const r2SprintQuestions = generateR2ListeningSprintQuestions({
                            count: 7,
                            difficulty: selectedDifficulty
                          });
                          if (r2SprintQuestions.length > 0) {
                            sprint.startSprint(r2SprintQuestions, selectedDifficulty, { isAudioSprint: true });
                          } else {
                            sprint.startSprint(null, selectedDifficulty, { isAudioSprint: true });
                          }
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-xl shadow-md shadow-cyan-600/30 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.98] border border-cyan-400/40 min-w-0"
                        title={t('arena.audioBlitzDesc')}
                      >
                        <span className="shrink-0">🎧</span>
                        <span className="sm:hidden font-black truncate">{isEn ? 'Audio Blitz' : 'Lôi Đài Nghe'}</span>
                        <span className="hidden sm:inline truncate">{t('arena.audioBlitzTitle')}</span>
                      </button>

                      {getUnresolvedMistakeCount() > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const revengeQuestions = generateRevengeSprintQuestions({ count: 10 });
                            if (revengeQuestions.length > 0) {
                              sprint.startSprint(revengeQuestions, selectedDifficulty);
                            }
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs sm:text-base py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.98] min-w-0"
                          title={t('arena.revengeSprintTitle')}
                        >
                          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="sm:hidden font-black truncate">{isEn ? `Revenge (${getUnresolvedMistakeCount()})` : `Phục Thù (${getUnresolvedMistakeCount()})`}</span>
                          <span className="hidden sm:inline truncate">{t('arena.revengeSprint', { count: getUnresolvedMistakeCount() })}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Real Learner Leaderboard & Daily World Boss Raid */}
                <div className={`lg:col-span-6 xl:col-span-5 w-full flex flex-col gap-2.5 sm:gap-3 min-w-0 ${
                  activeMobileTab === 'leaderboard' ? 'flex' : 'hidden lg:flex'
                }`}>
                  <ArenaRelativeLeaderboard
                    rivals={leaderboardData.leaderboard}
                    currentUserId={currentUser?.id}
                    currentUserEmail={currentUser?.email}
                    userWeeklyXp={leaderboardData.userWeeklyXp}
                    leagueTier={leaderboardData.leagueTier}
                    onSelectLearner={setSelectedLearner}
                  />
                  <ArenaWorldBossCard 
                    isEn={isEn} 
                    onStartSprint={() => sprint.startSprint(null, selectedDifficulty)}
                  />

                  {/* Mobile Back-to-Battle Quick Action */}
                  <div className="lg:hidden pt-1 pb-3">
                    <button
                      type="button"
                      onClick={() => setActiveMobileTab('match')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-98"
                    >
                      <Swords className="w-4 h-4" />
                      <span>{isEn ? 'Return to Battle Setup' : 'Quay Lại Sảnh Trận Đấu'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
            {/* Safe area bottom padding for mobile devices */}
            <div className="lg:hidden h-16 pb-[env(safe-area-inset-bottom,1.5rem)] shrink-0" />
          </div>
        )}

        {/* State 2 & 3: ACTIVE & REVIEWING_ANSWER Screens */}
        {(sprint.phase === ARENA_SPRINT_PHASES.ACTIVE || sprint.phase === ARENA_SPRINT_PHASES.REVIEWING_ANSWER) && (
          <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
            <ArenaHeaderBar
              timeRemaining={sprint.timeRemaining}
              remainingShields={sprint.shieldState.remainingShields}
              combo={sprint.combo}
              currentIndex={sprint.currentIndex}
              totalQuestions={sprint.questions.length}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              isSpeedrunMode={isSpeedrunMode}
              onToggleSpeedrun={toggleSpeedrun}
              onToggleMute={toggleMute}
              onToggleFullscreen={toggleFullscreen}
              onClose={handleReturnToLobby}
            />
            <div className="px-3 sm:px-6 py-1.5 sm:py-2.5 flex-1 min-h-0 flex flex-col items-center justify-start overflow-y-auto">
              <div className={`w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl pb-2 sm:pb-3 transition-all duration-300 ${
                isScreenShaking ? 'animate-arena-shake ring-2 ring-rose-500/50 rounded-2xl' : ''
              }`}>
                {sprint.activeGhostDuel && (
                  <ArenaGhostDuelBar
                    duel={sprint.activeGhostDuel}
                    elapsedSeconds={(sprint.duration || 180) - Math.max(0, sprint.timeRemaining)}
                    userScore={sprint.score}
                    userQuestionIndex={sprint.currentIndex}
                    totalQuestions={sprint.questions.length}
                    isEn={isEn}
                  />
                )}
                {activeTowerFloor?.type === TOWER_NODE_TYPES.BOSS && towerBossState && (
                  <ArenaTowerBossFightCard
                    boss={towerBossState}
                    lastDamageDealt={towerLastDamage}
                    isCriticalHit={towerIsCrit}
                  />
                )}
                {currentQ && (
                  <ArenaQuestionCard
                    question={currentQ}
                    selectedOption={sprint.selectedOption}
                    userInputText={sprint.userInputText}
                    onUserInputChange={sprint.setUserInputText}
                    validationResult={sprint.validationResult}
                    isAnswerChecked={sprint.isAnswerChecked}
                    isCorrect={sprint.isCorrect}
                    isSkipped={sprint.isSkipped}
                    nearMissState={sprint.nearMissState}
                    equippedPerk={sprint.equippedPerk}
                    isPerkUsed={sprint.isPerkUsed}
                    eliminatedOptions={sprint.eliminatedOptions}
                    onActivatePerk={sprint.activatePerk}
                    onSelectOption={handleSelectOption}
                    onCheckAnswer={handleCheckAnswer}
                    onSubmitAnswer={handleCheckAnswer}
                    onSkipQuestion={handleSkipQuestion}
                    onSkip={handleSkipQuestion}
                    onNextQuestion={sprint.nextQuestion}
                    onPlayAudio={(text, qObj) => speak(text, qObj || currentQ)}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* State 4: DEFEATED Screen */}
        {sprint.phase === ARENA_SPRINT_PHASES.DEFEATED && (
          <div className="flex flex-col flex-1 h-full overflow-y-auto">
            <header className="w-full bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>{t('arena.shieldsExhausted')}</span>
              </div>
              <button
                type="button"
                onClick={handleReturnToLobby}
                className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                title={t('arena.backToLeaderboard')}
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 mb-6 animate-bounce">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">{t('arena.arenaPaused')}</h2>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                {t('arena.defeatedDescription')}
              </p>

              {/* 1-Click Cambridge Theory Prescription for Defeated State */}
              {defeatedPrescription && (
                <div className="w-full bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3.5 mb-5 text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">🩺</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                        {t('arena.prescriptionTitle')}
                      </span>
                      <span className="text-xs font-bold text-white truncate mt-0.5">
                        {isEn ? defeatedPrescription.titleEn : defeatedPrescription.titleVi}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenTheoryPrescription(defeatedPrescription)}
                    className="w-full sm:w-auto px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
                  >
                    {t('arena.reviewInHandbook')}
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={sprint.retrySprint}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('arena.reviveShields')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDefeatedRestart}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 px-6 rounded-xl transition-colors cursor-pointer border border-slate-700"
                >
                  {t('arena.restartFromBeginning')}
                </button>
              </div>
            </main>
          </div>
        )}

        {/* State 5: COMPLETED Screen / Summary Modal */}
        {sprint.phase === ARENA_SPRINT_PHASES.COMPLETED && sprint.summary && (
          <div className="flex flex-col flex-1 min-h-full items-center justify-center p-4">
            <ArenaSprintSummaryModal
              summary={sprint.summary}
              onPlayAgain={() => sprint.startSprint(null, selectedDifficulty)}
              onClose={handleReturnToLobby}
              onOpenTheory={handleOpenTheoryPrescription}
            />
          </div>
        )}

        {/* Public Learner Profile Modal (Peer Profile Viewer) */}
        {selectedLearner && (
          <PublicLearnerProfileModal
            isOpen={Boolean(selectedLearner)}
            learner={selectedLearner}
            onClose={() => setSelectedLearner(null)}
            onChallengeSprint={() => {
              createGhostDuel(selectedLearner);
              setSelectedLearner(null);
              sprint.startSprint();
            }}
          />
        )}

        {/* Level-Up Celebration Modal (High-Octane Fanfare) */}
        {levelUpData && (
          <LevelUpCelebrationModal
            isOpen={Boolean(levelUpData)}
            oldLevel={levelUpData.oldLevel}
            newLevel={levelUpData.newLevel}
            tier={levelUpData.tier}
            onClose={() => setLevelUpData(null)}
            onContinue={() => {
              setLevelUpData(null);
              sprint.startSprint();
            }}
          />
        )}

        {/* Weekly League Promotion Celebration Modal */}
        {weeklyTransition && (
          <ArenaLeaguePromotionModal
            isOpen={Boolean(weeklyTransition)}
            transition={weeklyTransition}
            onClose={() => setWeeklyTransition(null)}
          />
        )}

        {/* Tower of Babel Modals: Relic Picker, Merchant Shop, Campfire Sanctuary */}
        <ArenaTowerRelicPickerModal
          isOpen={isTowerRelicModalOpen}
          relics={towerRewardRelics}
          onSelectRelic={handleSelectTowerRelic}
        />

        <ArenaTowerShopModal
          isOpen={isTowerShopModalOpen}
          gold={towerRun?.gold || 0}
          currentRelics={towerRun?.relics || []}
          onBuyItem={handleTowerBuyItem}
          onLeaveShop={() => {
            setIsTowerShopModalOpen(false);
            if (towerRun) {
              const nextFloorIdx = Math.min((towerRun.floors?.length || 10) - 1, (towerRun.currentFloorIndex || 0) + 1);
              const updated = { ...towerRun, currentFloorIndex: nextFloorIdx };
              saveActiveTowerRun(updated);
              setTowerRun(updated);
            }
          }}
        />

        <ArenaTowerCampfireModal
          isOpen={isTowerCampfireModalOpen}
          currentShields={towerRun?.shields || 5}
          maxShields={towerRun?.maxShields || 5}
          unresolvedMistakeCount={getUnresolvedMistakeCount()}
          onChooseRest={handleTowerChooseRest}
          onChoosePurge={handleTowerChoosePurge}
        />
      </div>
    </div>
  );
}
