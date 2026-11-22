import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  X,
  Music,
  Search,
  Shuffle,
  RotateCcw,
  Share2,
  Check,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Flame,
  Sparkles,
  CheckCircle2,
  Eye,
  Languages,
  Trash2,
  ListMusic,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  MUSIC_GENRES,
  CANONICAL_MUSIC_BANK,
  loadMusicBankManifest,
  loadMusicBankShard,
  buildExpansionPlaceholders
} from '../data/musicBank/index.js';
import {
  MUSIC_PRACTICE_MODES,
  MUSIC_DIFFICULTY_LEVELS,
  buildMusicDictationBlueprint,
  evaluateWordBlankAttempt,
  evaluateSentenceBlankAttempt
} from '../utils/musicDictationGenerator.js';
import { useAudioEngine } from '../hooks/useAudioEngine.js';
import { useYouTubeAudioEngine } from '../hooks/useYouTubeAudioEngine.js';
import { useVisualViewport } from '../hooks/useVisualViewport.js';
import { deleteAudioBlob } from '../utils/audioStorage.js';
import { useTranslation } from '../i18n/index.js';
import { safeGet, safeSet, safeRemove } from '../utils/storageService.js';
import {
  submitRealSprintScore,
  getCurrentUserTotalXp
} from '../services/gamification/realLeaderboardService.js';
import {
  calculateLevelProgress,
  getLevelTierInfo
} from '../services/gamification/levelEngine.js';
import { getWallet, addGold } from '../services/gamification/atlasWalletService.js';
import * as eventBus from '../services/gamification/eventBus.js';
import {
  buildTrackBatches,
  purchaseBatchUnlock
} from '../services/gamification/batchProgressionService.js';
import BatchSelectorStrip, { GoldWalletHeaderBadge } from './common/BatchSelectorStrip.jsx';
import BatchUnlockGateCard from './common/BatchUnlockGateCard.jsx';
import { getUnifiedStreakCount } from '../services/gamification/leagueEngine.js';
import { speakingSoundEffects } from '../utils/speakingSoundEffects.js';
import { triggerHaptic } from '../utils/hapticHelper.js';
import MusicAudioControlDock from './music/MusicAudioControlDock.jsx';
import MusicLyricsCanvas from './music/MusicLyricsCanvas.jsx';
import MusicSessionSummaryCard from './music/MusicSessionSummaryCard.jsx';
import MusicCustomSongModal from './music/MusicCustomSongModal.jsx';

const LEGACY_CUSTOM_SONGS_KEY = 'ielts_music_custom_songs_v1';
const MUSIC_RESUME_STORAGE_KEY = 'ielts_music_resume_v1';
const MUSIC_COMPLETED_STORAGE_KEY = 'ielts_music_completed_v1';
const MUSIC_BATCH_STORAGE_KEY = 'ielts_music_batch_v1';

/**
 * Returns the per-account storage key for custom linked songs.
 * Each user account has its own isolated key so custom songs are strictly private to that account.
 */
function getAccountCustomSongsKey(userId) {
  return userId
    ? `ielts_music_custom_songs_v2_${userId}`
    : 'ielts_music_custom_songs_guest_v1';
}

function loadAccountCustomSongs(userId) {
  const accountKey = getAccountCustomSongsKey(userId);
  const stored = safeGet(accountKey, null);
  if (Array.isArray(stored)) {
    return stored.filter(
      (s) =>
        s &&
        !s.localAudioId &&
        (userId ? (!s.ownerUserId || s.ownerUserId === userId) : (!s.ownerUserId || s.ownerUserId === 'guest'))
    );
  }

  // One-time migration from legacy key (only link-based tracks without local file blobs), then purge legacy global key
  if (userId) {
    const legacyList = safeGet(LEGACY_CUSTOM_SONGS_KEY, []);
    if (Array.isArray(legacyList) && legacyList.length > 0) {
      const migrated = legacyList
        .filter((s) => s && !s.localAudioId && (!s.ownerUserId || s.ownerUserId === userId))
        .map((s) => ({ ...s, ownerUserId: userId }));
      safeSet(accountKey, migrated);
      safeRemove(LEGACY_CUSTOM_SONGS_KEY);
      return migrated;
    }
  }
  return [];
}

export default function MusicListeningStudioModal({
  isOpen,
  onClose,
  currentUser = null,
  onOpenAuth,
  onOpenArena,
  onSaveToNotebook,
  onOpenPronunciation,
  initialOptions = null
}) {
  const { isEn } = useTranslation();

  // 1. Per-account custom songs, completed state, Sharded Expansion Bank & Progressive Batch State
  const [customSongs, setCustomSongs] = useState(() => loadAccountCustomSongs(currentUser?.id));
  const [completedMap, setCompletedMap] = useState(() => safeGet(MUSIC_COMPLETED_STORAGE_KEY, {}));
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(() =>
    safeGet(MUSIC_BATCH_STORAGE_KEY, 1)
  );
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Reload customSongs whenever the active user account changes or cloud sync completes
  useEffect(() => {
    const nextList = loadAccountCustomSongs(currentUser?.id);
    setCustomSongs(nextList);
    if (nextList.length === 0) {
      setSelectedBatchIndex((prev) => {
        if (prev === 'personal') {
          safeSet(MUSIC_BATCH_STORAGE_KEY, 1);
          return 1;
        }
        return prev;
      });
    }

    const handleCloudSynced = (payload) => {
      if (currentUser?.id && Array.isArray(payload?.musicCustomSongs)) {
        setCustomSongs(
          payload.musicCustomSongs.filter(
            (s) => s && (!s.ownerUserId || s.ownerUserId === currentUser.id) && !s.localAudioId
          )
        );
      }
    };
    const unsub = eventBus.on('cloud_batch_progress_synced', handleCloudSynced);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [currentUser?.id]);

  const [expansionPlaceholders, setExpansionPlaceholders] = useState([]);
  const [hydratedExpansionById, setHydratedExpansionById] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    loadMusicBankManifest().then((manifest) => {
      if (!active || !manifest) return;
      setExpansionPlaceholders(buildExpansionPlaceholders(manifest));
    });
    return () => {
      active = false;
    };
  }, [isOpen]);

  const fullCanonicalBank = useMemo(() => {
    if (expansionPlaceholders.length === 0) return CANONICAL_MUSIC_BANK;
    const expanded = expansionPlaceholders.map((p) => hydratedExpansionById[p.id] || p);
    return [...CANONICAL_MUSIC_BANK, ...expanded];
  }, [expansionPlaceholders, hydratedExpansionById]);

  const allTracks = useMemo(
    () => [...customSongs, ...fullCanonicalBank],
    [customSongs, fullCanonicalBank]
  );

  // 2. Parse initial URL / initialOptions parameters
  const getInitialParam = (key, validValues, fallback) => {
    if (initialOptions && initialOptions[key]) {
      if (!validValues || validValues.includes(initialOptions[key])) {
        return initialOptions[key];
      }
    }
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const val = search.get(key);
      if (val && (!validValues || validValues.includes(val))) {
        return val;
      }
    }
    return fallback;
  };

  // Saved resume session
  const savedResume = useMemo(() => safeGet(MUSIC_RESUME_STORAGE_KEY, null), []);

  const [selectedGenre, setSelectedGenre] = useState(() =>
    getInitialParam('genre', MUSIC_GENRES.map(g => g.id), savedResume?.genre || 'all')
  );
  const [selectedTrackId, setSelectedTrackId] = useState(() =>
    getInitialParam('song', null, savedResume?.trackId || CANONICAL_MUSIC_BANK[0]?.id)
  );
  const [practiceMode, setPracticeMode] = useState(() =>
    getInitialParam('mode', ['full', 'sentence', 'word', 'mixed'], savedResume?.mode || 'mixed')
  );
  const [difficulty, setDifficulty] = useState(() =>
    getInitialParam('level', ['easy', 'medium', 'hard'], savedResume?.difficulty || 'medium')
  );
  const [seed, setSeed] = useState(() => savedResume?.seed || 1);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileLibraryOpen, setIsMobileLibraryOpen] = useState(false);
  const [isMobileOptionsOpen, setIsMobileOptionsOpen] = useState(false);
  const [isDesktopOptionsOpen, setIsDesktopOptionsOpen] = useState(false);
  const desktopOptionsRef = useRef(null);
  const [showVocabFocusDrawer, setShowVocabFocusDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const { isKeyboardOpen } = useVisualViewport();

  // Pedagogical display toggles
  const [showTranslation, setShowTranslation] = useState(true);
  const [showPhoneticTips, setShowPhoneticTips] = useState(true);

  // Dictation audio assist switches
  const [isAutoLoopLine, setIsAutoLoopLine] = useState(false);
  const [isAutoPauseLine, setIsAutoPauseLine] = useState(false);

  // User inputs per line
  const [wordInputs, setWordInputs] = useState(() =>
    savedResume?.trackId === selectedTrackId && savedResume?.mode === practiceMode
      ? (savedResume?.wordInputs || {})
      : {}
  );
  const [sentenceInputs, setSentenceInputs] = useState(() =>
    savedResume?.trackId === selectedTrackId && savedResume?.mode === practiceMode
      ? (savedResume?.sentenceInputs || {})
      : {}
  );
  const [revealedLines, setRevealedLines] = useState({});
  const [hasClaimedReward, setHasClaimedReward] = useState(false);

  // Gamification header stats & live wallet synchronization
  const [totalXp, setTotalXp] = useState(() => getCurrentUserTotalXp());
  const [wallet, setWallet] = useState(() => getWallet());
  const streakCount = useMemo(() => getUnifiedStreakCount(), []);
  const levelProgress = useMemo(() => calculateLevelProgress(totalXp), [totalXp]);
  const tierInfo = useMemo(() => getLevelTierInfo(levelProgress.level), [levelProgress.level]);

  useEffect(() => {
    setWallet(getWallet());
    const handleWalletUpdate = (updated) => {
      setWallet(updated || getWallet());
    };
    const unsub = eventBus.on('wallet_updated', handleWalletUpdate);
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [isOpen]);

  // Close desktop options dropdown on outside click or Escape
  useEffect(() => {
    if (!isDesktopOptionsOpen) return;
    const handleOutside = (e) => {
      if (desktopOptionsRef.current && !desktopOptionsRef.current.contains(e.target)) {
        setIsDesktopOptionsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsDesktopOptionsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isDesktopOptionsOpen]);

  // Progressive Batch Slicing for the Canonical Music Bank (Batch 1 = 6 FREE starter songs, Batch 2..N = 6 songs each)
  const musicBatches = useMemo(() => {
    const completedIdSet = new Set(Object.keys(completedMap || {}));
    return buildTrackBatches({
      items: fullCanonicalBank,
      trackKey: 'music_dictation',
      completedIdSet,
      wallet,
      currentUser
    });
  }, [fullCanonicalBank, completedMap, wallet, currentUser]);

  const activeBatchObj = useMemo(() => {
    if (selectedBatchIndex === 'personal') return null;
    return (
      musicBatches.find(b => b.batchIndex === selectedBatchIndex) ||
      musicBatches[0] ||
      null
    );
  }, [selectedBatchIndex, musicBatches]);

  // Lazily hydrate expansion shard JSON whenever user views an unlocked expansion batch
  useEffect(() => {
    if (!isOpen || !activeBatchObj || !activeBatchObj.isUnlocked) return;
    const shardIndicesToLoad = new Set();
    activeBatchObj.items.forEach((item) => {
      if (item?._isShardPlaceholder && typeof item.shardIndex === 'number') {
        shardIndicesToLoad.add(item.shardIndex);
      }
    });
    if (shardIndicesToLoad.size === 0) return;

    let active = true;
    Promise.all(Array.from(shardIndicesToLoad).map(idx => loadMusicBankShard(idx))).then((chunks) => {
      if (!active) return;
      const merged = {};
      chunks.flat().forEach((tr) => {
        if (tr?.id) merged[tr.id] = tr;
      });
      if (Object.keys(merged).length > 0) {
        setHydratedExpansionById(prev => ({ ...prev, ...merged }));
      }
    });
    return () => {
      active = false;
    };
  }, [isOpen, activeBatchObj]);

  const isViewingLockedBatch = Boolean(activeBatchObj && !activeBatchObj.isUnlocked);

  const nextLockedBatch = useMemo(() => {
    if (!activeBatchObj || !activeBatchObj.isUnlocked) return null;
    return (
      musicBatches.find(
        b => b.batchIndex === activeBatchObj.batchIndex + 1 && !b.isUnlocked
      ) || null
    );
  }, [activeBatchObj, musicBatches]);

  const handleSelectBatch = useCallback((nextBatchIdx) => {
    setSelectedBatchIndex(nextBatchIdx);
    safeSet(MUSIC_BATCH_STORAGE_KEY, nextBatchIdx);
    if (nextBatchIdx === 'personal') {
      if (customSongs[0]?.id) setSelectedTrackId(customSongs[0].id);
      return;
    }
    const targetBatch = musicBatches.find(b => b.batchIndex === nextBatchIdx);
    if (targetBatch?.isUnlocked && targetBatch.items[0]?.id) {
      setSelectedTrackId(targetBatch.items[0].id);
    }
  }, [customSongs, musicBatches]);

  const handlePurchaseMusicBatch = useCallback((batch) => {
    if (!batch) return;
    const res = purchaseBatchUnlock({
      batchId: batch.batchId,
      batchLabel: `Music & Lyrics Bank Batch ${batch.batchIndex}`,
      costGold: batch.costGold,
      currentUser
    });
    if (res?.success) {
      setWallet(getWallet());
      setSelectedBatchIndex(batch.batchIndex);
      safeSet(MUSIC_BATCH_STORAGE_KEY, batch.batchIndex);
      if (batch.items[0]?.id) {
        setSelectedTrackId(batch.items[0].id);
      }
      try {
        speakingSoundEffects.playCelebrationFanfare?.();
        triggerHaptic('success');
      } catch (e) {}
    } else if (res?.message === 'need_auth') {
      onOpenAuth?.();
    }
  }, [currentUser, onOpenAuth]);

  // Apply external initialOptions when deep-linked while mounted
  useEffect(() => {
    if (!initialOptions || typeof initialOptions !== 'object') return;
    if (initialOptions.genre && MUSIC_GENRES.some(g => g.id === initialOptions.genre)) {
      setSelectedGenre(initialOptions.genre);
    }
    if (initialOptions.song && allTracks.some(t => t.id === initialOptions.song)) {
      setSelectedTrackId(initialOptions.song);
    }
    if (initialOptions.mode && ['full', 'sentence', 'word', 'mixed'].includes(initialOptions.mode)) {
      setPracticeMode(initialOptions.mode);
    }
    if (initialOptions.level && ['easy', 'medium', 'hard'].includes(initialOptions.level)) {
      setDifficulty(initialOptions.level);
    }
  }, [initialOptions, allTracks]);

  // Sync URL address bar query params when inside /music-listening
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams();
      if (selectedGenre && selectedGenre !== 'all') params.set('genre', selectedGenre);
      if (selectedTrackId) params.set('song', selectedTrackId);
      if (practiceMode) params.set('mode', practiceMode);
      if (difficulty) params.set('level', difficulty);
      const qs = params.toString();
      const targetUrl = qs ? `/music-listening?${qs}` : '/music-listening';
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.replaceState({ modal: 'musicListening' }, '', targetUrl);
      }
    } catch (e) {}
  }, [isOpen, selectedGenre, selectedTrackId, practiceMode, difficulty]);

  // Scope tracks to the currently selected Batch (or Personal Vault) + Genre + Search filter
  const batchScopedTracks = useMemo(() => {
    if (selectedBatchIndex === 'personal') {
      return customSongs;
    }
    return activeBatchObj?.items || fullCanonicalBank;
  }, [selectedBatchIndex, customSongs, activeBatchObj, fullCanonicalBank]);

  const filteredTracks = useMemo(() => {
    return batchScopedTracks.filter((tr) => {
      const matchesGenre = selectedGenre === 'all' || tr.genreId === selectedGenre;
      if (!matchesGenre) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (tr.title && tr.title.toLowerCase().includes(q)) ||
        (tr.artist && tr.artist.toLowerCase().includes(q)) ||
        (tr.pedagogicalFocusEn && tr.pedagogicalFocusEn.toLowerCase().includes(q))
      );
    });
  }, [batchScopedTracks, selectedGenre, searchQuery]);

  const currentTrack = useMemo(() => {
    const unlockedTracks = [
      ...customSongs,
      ...musicBatches.filter(b => b.isUnlocked).flatMap(b => b.items)
    ];
    return (
      unlockedTracks.find(t => t.id === selectedTrackId) ||
      filteredTracks[0] ||
      CANONICAL_MUSIC_BANK[0]
    );
  }, [customSongs, musicBatches, filteredTracks, selectedTrackId]);

  // Resolve direct online audio URL for non-YouTube tracks (0 local file storage used)
  const resolvedAudioSrc = currentTrack?.audioUrl || '';

  // Build deterministic exercise blueprint for current track + mode + difficulty + seed
  const blueprint = useMemo(() => {
    return buildMusicDictationBlueprint({
      track: currentTrack,
      mode: practiceMode,
      difficulty,
      seed
    });
  }, [currentTrack, practiceMode, difficulty, seed]);

  // Isolate activeLineIndex so lyric cards don't re-render on every timeupdate tick
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const activeLineIndexRef = useRef(0);
  activeLineIndexRef.current = activeLineIndex;

  const autoLoopRef = useRef(isAutoLoopLine);
  autoLoopRef.current = isAutoLoopLine;
  const autoPauseRef = useRef(isAutoPauseLine);
  autoPauseRef.current = isAutoPauseLine;
  const blueprintLinesRef = useRef(blueprint.lines);
  blueprintLinesRef.current = blueprint.lines;
  const pausedForLineRef = useRef(-1);

  const isYouTubeTrack = Boolean(currentTrack?.sourceType === 'youtube' && currentTrack?.youtubeId);

  const htmlAudioEngine = useAudioEngine({
    initialSrc: isYouTubeTrack ? '' : resolvedAudioSrc,
    fallbackSrc: isYouTubeTrack ? '' : (currentTrack?.fallbackAudioUrl || currentTrack?.audioUrl || ''),
    examMode: 'practice'
  });

  const ytAudioEngine = useYouTubeAudioEngine({
    youtubeId: currentTrack?.youtubeId || '',
    enabled: isOpen && isYouTubeTrack
  });

  const audioEngine = isYouTubeTrack ? ytAudioEngine : htmlAudioEngine;

  // Monitor audioEngine.currentTime for active line sync, A-B Line Loop, and Auto-Pause at Line End
  useEffect(() => {
    const cur = audioEngine.currentTime || 0;
    const lines = blueprintLinesRef.current || [];
    if (lines.length === 0) return;

    const currentActiveLine = lines[activeLineIndexRef.current];

    // 1. Check A-B Line Loop or Auto-Pause on the currently focused line
    if (audioEngine.isPlaying && currentActiveLine) {
      const lineEnd = currentActiveLine.effectiveEnd || currentActiveLine.end;
      if (autoLoopRef.current && cur >= lineEnd) {
        audioEngine.seek(currentActiveLine.start);
        return;
      }
      if (
        autoPauseRef.current &&
        cur >= lineEnd &&
        pausedForLineRef.current !== currentActiveLine.index
      ) {
        pausedForLineRef.current = currentActiveLine.index;
        audioEngine.pause();
        return;
      }
    }

    // 2. Otherwise update activeLineIndex when song naturally crosses into another line
    if (!autoLoopRef.current) {
      let matchedIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (cur >= lines[i].start && cur < (lines[i].end || lines[i].start + 5)) {
          matchedIdx = i;
          break;
        }
      }
      if (matchedIdx !== -1 && matchedIdx !== activeLineIndexRef.current) {
        setActiveLineIndex(matchedIdx);
        pausedForLineRef.current = -1;
      }
    }
  }, [audioEngine.currentTime, audioEngine.isPlaying]);

  // Persist session progress automatically (Auto-Resume)
  useEffect(() => {
    if (!currentTrack) return;
    safeSet(MUSIC_RESUME_STORAGE_KEY, {
      genre: selectedGenre,
      trackId: currentTrack.id,
      mode: practiceMode,
      difficulty,
      seed,
      wordInputs,
      sentenceInputs,
      updatedAt: Date.now()
    });
  }, [selectedGenre, currentTrack, practiceMode, difficulty, seed, wordInputs, sentenceInputs]);

  // Reset session helper
  const handleResetSession = useCallback(() => {
    setWordInputs({});
    setSentenceInputs({});
    setRevealedLines({});
    setHasClaimedReward(false);
    setActiveLineIndex(0);
    pausedForLineRef.current = -1;
  }, []);

  const handleSelectTrack = (trackId) => {
    if (trackId === selectedTrackId) return;
    setSelectedTrackId(trackId);
    handleResetSession();
  };

  const handleChangeMode = (newMode) => {
    if (newMode === practiceMode) return;
    setPracticeMode(newMode);
    handleResetSession();
  };

  const handleChangeDifficulty = (newDiff) => {
    if (newDiff === difficulty) return;
    setDifficulty(newDiff);
    handleResetSession();
  };

  const handleShuffleBlanks = () => {
    setSeed(prev => prev + 1);
    handleResetSession();
  };

  // Seek to a specific lyric line (with smart guard so tapping 2nd blank on the same actively playing line doesn't restart it)
  const handleSeekToLine = useCallback(
    (lineIdx, autoPlay = true, options = {}) => {
      const targetLine = blueprint.lines[lineIdx];
      if (!targetLine) return;

      const cur = audioEngine.currentTime || 0;
      const isAlreadyPlayingThisLine =
        audioEngine.isPlaying &&
        activeLineIndexRef.current === lineIdx &&
        cur >= targetLine.start - 0.5 &&
        cur < (targetLine.end || targetLine.start + 5);

      if (options?.skipIfAlreadyPlayingLine && isAlreadyPlayingThisLine) {
        return;
      }

      setActiveLineIndex(lineIdx);
      pausedForLineRef.current = -1;
      audioEngine.seek(targetLine.start);
      if (autoPlay && !audioEngine.isPlaying) {
        audioEngine.play();
      }
    },
    [blueprint.lines, audioEngine]
  );

  // Replay a specific line (or currently active line) from its start timestamp
  const handleReplayLine = useCallback(
    (lineIdx = activeLineIndexRef.current) => {
      const targetLine = blueprint.lines[lineIdx];
      if (!targetLine) return;
      setActiveLineIndex(lineIdx);
      pausedForLineRef.current = -1;
      audioEngine.seek(targetLine.start);
      if (!audioEngine.isPlaying) {
        audioEngine.play();
      }
    },
    [blueprint.lines, audioEngine]
  );

  // Handle inline word blank input changes
  const handleWordInputChange = useCallback(
    (lineIdx, tokenIdx, value, targetCoreWord) => {
      setWordInputs((prev) => {
        const prevLineObj = prev[lineIdx] || {};
        const prevVal = prevLineObj[tokenIdx] || '';
        const wasCorrect = evaluateWordBlankAttempt(targetCoreWord, prevVal).isCorrect;
        const isNowCorrect = evaluateWordBlankAttempt(targetCoreWord, value).isCorrect;

        if (!wasCorrect && isNowCorrect) {
          try {
            speakingSoundEffects.playCorrectChime?.();
            triggerHaptic('light');
          } catch (e) {}
        }

        return {
          ...prev,
          [lineIdx]: {
            ...prevLineObj,
            [tokenIdx]: value
          }
        };
      });
    },
    []
  );

  // Handle full sentence blank input changes
  const handleSentenceInputChange = useCallback(
    (lineIdx, value) => {
      const targetLine = blueprintLinesRef.current[lineIdx];
      setSentenceInputs((prev) => {
        const prevVal = prev[lineIdx] || '';
        if (targetLine) {
          const wasPassed = evaluateSentenceBlankAttempt(targetLine.text, prevVal).isPassed;
          const isNowPassed = evaluateSentenceBlankAttempt(targetLine.text, value).isPassed;
          if (!wasPassed && isNowPassed) {
            try {
              speakingSoundEffects.playCorrectChime?.();
              triggerHaptic('medium');
            } catch (e) {}
          }
        }
        return {
          ...prev,
          [lineIdx]: value
        };
      });
    },
    []
  );

  // Hint handler: fills the next missing word in a word_blank or sentence_blank line
  const handleHintLine = useCallback(
    (lineIdx) => {
      const line = blueprint.lines[lineIdx];
      if (!line) return;

      if (line.lineType === 'word_blank') {
        const currentLineInputs = wordInputs[lineIdx] || {};
        for (const tokIdx of line.blankWordIndices) {
          const tok = line.tokens[tokIdx];
          if (!tok) continue;
          const curVal = currentLineInputs[tokIdx] || '';
          const ev = evaluateWordBlankAttempt(tok.coreWord, curVal);
          if (!ev.isCorrect) {
            // Reveal first 2 characters if empty, or full word if already started
            const nextHint =
              curVal.length === 0 && tok.coreWord.length > 2
                ? tok.coreWord.slice(0, 2)
                : tok.coreWord;
            handleWordInputChange(lineIdx, tokIdx, nextHint, tok.coreWord);
            break;
          }
        }
      } else if (line.lineType === 'sentence_blank') {
        const curText = sentenceInputs[lineIdx] || '';
        const ev = evaluateSentenceBlankAttempt(line.text, curText);
        const firstMissed = ev.targetDiff.find(t => t.type !== 'correct');
        if (firstMissed) {
          const nextSentence = curText.trim()
            ? `${curText.trim()} ${firstMissed.text}`
            : firstMissed.text;
          handleSentenceInputChange(lineIdx, nextSentence);
        }
      }
      handleReplayLine(lineIdx);
    },
    [blueprint.lines, wordInputs, sentenceInputs, handleWordInputChange, handleSentenceInputChange, handleReplayLine]
  );

  // Reveal full line answer
  const handleRevealLine = useCallback((lineIdx) => {
    setRevealedLines(prev => ({ ...prev, [lineIdx]: true }));
  }, []);

  // Compute real-time completion & accuracy progress across the song
  const progressStats = useMemo(() => {
    let completedTasks = 0;
    let totalTasks = 0;
    let correctScoreSum = 0;

    blueprint.lines.forEach((line) => {
      const isRev = Boolean(revealedLines[line.index]);
      if (line.lineType === 'word_blank') {
        const lineInputs = wordInputs[line.index] || {};
        line.blankWordIndices.forEach((tokIdx) => {
          totalTasks++;
          const tok = line.tokens[tokIdx];
          const ev = evaluateWordBlankAttempt(tok?.coreWord, lineInputs[tokIdx] || '');
          if (ev.isCorrect) {
            completedTasks++;
            correctScoreSum += 100;
          } else if (isRev) {
            completedTasks++;
            correctScoreSum += 50;
          }
        });
      } else if (line.lineType === 'sentence_blank') {
        totalTasks++;
        const ev = evaluateSentenceBlankAttempt(line.text, sentenceInputs[line.index] || '');
        if (ev.isPassed) {
          completedTasks++;
          correctScoreSum += ev.accuracy;
        } else if (isRev) {
          completedTasks++;
          correctScoreSum += 50;
        }
      }
    });

    const safeTotal = Math.max(1, totalTasks);
    const progressPct = Math.min(100, Math.round((completedTasks / safeTotal) * 100));
    const accuracyPct =
      completedTasks > 0 ? Math.min(100, Math.round(correctScoreSum / completedTasks)) : 0;
    const isAllCompleted = totalTasks > 0 && completedTasks === totalTasks;

    const diffMult =
      MUSIC_DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.xpMultiplier || 1.0;
    const modeBonus =
      practiceMode === 'full' ? 1.4 : practiceMode === 'mixed' ? 1.25 : 1.0;
    const earnedXp = Math.round(50 * diffMult * modeBonus);
    const earnedGold = Math.round(25 * diffMult * modeBonus);

    return {
      completedTasks,
      totalTasks,
      progressPct,
      accuracyPct,
      isAllCompleted,
      earnedXp,
      earnedGold
    };
  }, [blueprint.lines, wordInputs, sentenceInputs, revealedLines, difficulty, practiceMode]);

  // Auto-record song mastery into completedMap when 100% tasks are completed (unlocks Batch N+1 mastery gate)
  useEffect(() => {
    if (!progressStats.isAllCompleted || !currentTrack?.id) return;
    setCompletedMap((prev) => {
      const existing = prev[currentTrack.id];
      if (existing && existing.accuracy >= progressStats.accuracyPct) return prev;
      const next = {
        ...prev,
        [currentTrack.id]: {
          accuracy: progressStats.accuracyPct,
          mode: practiceMode,
          difficulty,
          completedAt: new Date().toISOString()
        }
      };
      safeSet(MUSIC_COMPLETED_STORAGE_KEY, next);
      return next;
    });
  }, [progressStats.isAllCompleted, progressStats.accuracyPct, currentTrack, practiceMode, difficulty]);

  // Claim XP & Gold reward upon completing a song
  const handleClaimReward = useCallback(() => {
    if (hasClaimedReward || !currentTrack) return;
    setHasClaimedReward(true);

    try {
      const res = submitRealSprintScore({
        user: currentUser,
        xpEarned: progressStats.earnedXp,
        correctCount: progressStats.completedTasks,
        totalQuestions: progressStats.totalTasks,
        skill: 'listening'
      });
      if (res?.newTotalXp) setTotalXp(res.newTotalXp);

      addGold(progressStats.earnedGold, `Music Dictation: ${currentTrack.title}`, true);
      setWallet(getWallet());

      const nextCompleted = {
        ...completedMap,
        [currentTrack.id]: {
          accuracy: progressStats.accuracyPct,
          mode: practiceMode,
          difficulty,
          completedAt: new Date().toISOString()
        }
      };
      setCompletedMap(nextCompleted);
      safeSet(MUSIC_COMPLETED_STORAGE_KEY, nextCompleted);

      speakingSoundEffects.playCelebrationFanfare?.();
      triggerHaptic('success');
    } catch (e) {}
  }, [hasClaimedReward, currentTrack, currentUser, progressStats, completedMap, practiceMode, difficulty]);

  // Share deep-link URL
  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  // Add custom song handler -> works for both Guest (temporary browser) & Signed-In Users (private cloud sync)
  const handleAddCustomSong = (newTrack) => {
    const accountKey = getAccountCustomSongsKey(currentUser?.id);
    const taggedTrack = {
      ...newTrack,
      ownerUserId: currentUser?.id || 'guest',
      ownerEmail: currentUser?.email || ''
    };
    const updated = [taggedTrack, ...customSongs].slice(0, 20);
    setCustomSongs(updated);
    if (accountKey) {
      safeSet(accountKey, updated);
    }
    if (currentUser?.id) {
      eventBus.emit('batch_progress_updated');
    }
    setSelectedGenre('all');
    setSelectedBatchIndex('personal');
    safeSet(MUSIC_BATCH_STORAGE_KEY, 'personal');
    setSelectedTrackId(taggedTrack.id);
    handleResetSession();
  };

  // Delete custom song handler -> strictly scoped to currentUser.id
  const handleDeleteCustomSong = (e, track) => {
    e.stopPropagation();
    if (track.localAudioId) {
      deleteAudioBlob(track.localAudioId).catch(() => {});
    }
    const updated = customSongs.filter(s => s.id !== track.id);
    setCustomSongs(updated);
    const accountKey = getAccountCustomSongsKey(currentUser?.id);
    if (accountKey) {
      safeSet(accountKey, updated);
    }
    eventBus.emit('batch_progress_updated');
    if (selectedTrackId === track.id) {
      if (updated.length > 0) {
        setSelectedTrackId(updated[0].id);
      } else {
        setSelectedBatchIndex(1);
        safeSet(MUSIC_BATCH_STORAGE_KEY, 1);
        setSelectedTrackId(CANONICAL_MUSIC_BANK[0]?.id);
      }
      handleResetSession();
    }
  };

  // Practice speaking a song line in Pronunciation Studio (/pronunciation)
  const handlePracticeLinePronunciation = useCallback(
    (line) => {
      audioEngine.pause();
      onOpenPronunciation?.({
        tab: 'sentences',
        customSentence: line.text
      });
    },
    [audioEngine, onOpenPronunciation]
  );

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-xs flex items-center justify-center animate-in fade-in duration-150 ${
        isFullscreen ? 'p-0' : 'p-0 sm:p-3'
      }`}
    >
      <div
        className={`bg-white dark:bg-slate-900 flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all ${
          isFullscreen
            ? 'w-screen h-[100dvh] rounded-none border-0'
            : 'w-full max-w-[1440px] h-[100dvh] sm:h-[94dvh] sm:rounded-2xl'
        }`}
      >
        {/* ================================================================= */}
        {/* 1. UNIFIED ULTRA-SLIM TOP STUDIO HEADER BAR                       */}
        {/* ================================================================= */}
        <div className="px-2.5 sm:px-4 py-1.5 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          {/* Left: Sidebar Toggle / Mobile Song Sheet + Active Song Info + Progress Pill */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 min-w-0 flex-1">
            {/* Desktop Sidebar Collapse Toggle (>= 1024px) */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer shrink-0"
              title={
                isSidebarCollapsed
                  ? (isEn ? 'Show Song Library Sidebar' : 'Hiện danh sách bài hát')
                  : (isEn ? 'Collapse Song Sidebar for maximum lyrics width' : 'Thu gọn danh sách bài hát để mở rộng tối đa khung lời nhạc')
              }
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-rose-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Mobile & Tablet Song / Batch Library Drawer Button (< 1024px) */}
            <button
              type="button"
              onClick={() => setIsMobileLibraryOpen(true)}
              className="lg:hidden flex items-center space-x-1 px-2.5 h-8 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label={isEn ? 'Open Songs & Batches Library' : 'Mở danh sách Bài hát & Lô nhạc'}
            >
              <ListMusic className="w-3.5 h-3.5 shrink-0" />
              <span>
                {selectedBatchIndex === 'personal'
                  ? (isEn ? 'My Songs' : 'Tự nạp')
                  : (isEn ? `Batch ${selectedBatchIndex}` : `Lô ${selectedBatchIndex}`)}
              </span>
            </button>

            {/* Active Song Title & Artist (Tap on mobile opens song picker) */}
            <button
              type="button"
              onClick={() => setIsMobileLibraryOpen(true)}
              className="flex items-center space-x-2 min-w-0 text-left lg:pointer-events-none truncate"
            >
              <div className="hidden sm:flex w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 items-center justify-center shrink-0">
                <Music className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0 truncate">
                <span className="font-black text-xs sm:text-sm text-white truncate">
                  {currentTrack
                    ? (isEn ? (currentTrack.titleEn || currentTrack.title) : (currentTrack.titleVi || currentTrack.title))
                    : (isEn ? 'Music Dictation' : 'Nghe Nhạc Chép Lời')}
                </span>
                {currentTrack?.artist && (
                  <span className="text-[11px] text-slate-400 font-semibold ml-1.5">
                    — {currentTrack.artist}
                  </span>
                )}
              </div>
            </button>

            {/* Inline Compact Progress Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-extrabold shrink-0">
              <span className="text-purple-400">
                {progressStats.completedTasks}/{progressStats.totalTasks}
              </span>
              <span className="text-slate-400">({progressStats.progressPct}%)</span>
            </div>

            {/* Toggle Vocab & Listening Focus Drawer Button */}
            <button
              type="button"
              onClick={() => setShowVocabFocusDrawer(prev => !prev)}
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                showVocabFocusDrawer
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-purple-300 border-slate-800'
              }`}
              title={isEn ? 'Toggle Song Vocabulary & Listening Focus' : 'Ẩn/Hiện Từ vựng bài hát & Trọng tâm nghe'}
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="hidden md:inline">{isEn ? 'Vocab & Focus' : 'Từ vựng'}</span>
            </button>

            {/* Custom YouTube Song Importer Button (Visible on both Mobile & Desktop) */}
            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold whitespace-nowrap transition-colors cursor-pointer shrink-0"
              title={isEn ? 'Add personal song via YouTube link' : 'Thêm bài hát cá nhân bằng link YouTube'}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline xl:hidden">YouTube</span>
              <span className="hidden xl:inline">{isEn ? 'Add YouTube' : 'Thêm YouTube'}</span>
            </button>
          </div>

          {/* Right: Gamification Badges (Streak, Gold, Level), Share Link, Fullscreen & Close */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            <div className="hidden xl:flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold">
              <Flame className="w-3 h-3 text-orange-400 fill-current" />
              <span className="text-orange-300">{streakCount}d</span>
            </div>

            <div>
              <GoldWalletHeaderBadge
                isEn={isEn}
                compact={true}
                onOpenArena={() => {
                  audioEngine.pause();
                  onOpenArena?.();
                }}
              />
            </div>

            <div className="hidden 2xl:flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold">
              <span className="text-amber-400">Lv.{levelProgress.level}</span>
            </div>

            <button
              type="button"
              onClick={handleShareLink}
              className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
              title={isEn ? 'Copy direct link to this song & mode' : 'Sao chép đường dẫn trực tiếp tới bài hát & chế độ này'}
            >
              {isCopiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(prev => !prev)}
              className="hidden sm:flex p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? (isEn ? 'Windowed Mode' : 'Chế độ cửa sổ') : (isEn ? 'Fullscreen Mode' : 'Toàn màn hình')}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                audioEngine.pause();
                onClose?.();
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              aria-label={isEn ? 'Close Music Studio' : 'Đóng Phòng Luyện Nhạc'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. MAIN WORKSPACE: LEFT SONG SIDEBAR (LG+) + RIGHT STUDIO         */}
        {/* ================================================================= */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* LEFT SIDEBAR: Desktop Only (>= 1024px); Mobile uses Bottom Sheet Drawer */}
          {!isSidebarCollapsed && (
            <aside className="hidden lg:flex w-68 xl:w-76 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col shrink-0">
              {/* Progressive Batch Unlock Selector Strip */}
              <div className="p-2 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center justify-between mb-1 px-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {isEn ? 'Music Bank Batches' : 'Lộ Trình Mở Lô Nhạc'}
                  </span>
                  {activeBatchObj && (
                    <span className="text-[10px] font-bold text-emerald-400">
                      {activeBatchObj.completedCount}/{activeBatchObj.totalCount}{' '}
                      {isEn ? 'mastered' : 'đã xong'}
                    </span>
                  )}
                </div>
                <BatchSelectorStrip
                  batches={musicBatches}
                  selectedBatchIndex={selectedBatchIndex}
                  onSelectBatch={handleSelectBatch}
                  personalCount={customSongs.length}
                  isEn={isEn}
                />
              </div>

              {/* Search & Genre Filter inside Sidebar */}
              <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isEn ? 'Search song, artist...' : 'Tìm bài hát, ca sĩ...'
                    }
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Compact Genre Filter Pills inside Sidebar */}
                <div className="flex flex-wrap gap-1">
                  {MUSIC_GENRES.map((g) => {
                    const isSelected = selectedGenre === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGenre(g.id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {isEn ? g.shortEn : g.shortVi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Track List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                {filteredTracks.map((tr) => {
                  const isCurrent = currentTrack?.id === tr.id && !isViewingLockedBatch;
                  const doneInfo = completedMap[tr.id];
                  const genreObj = MUSIC_GENRES.find(g => g.id === tr.genreId);

                  return (
                    <div
                      key={tr.id}
                      onClick={() => {
                        if (isViewingLockedBatch) return;
                        handleSelectTrack(tr.id);
                      }}
                      className={`group relative p-3 rounded-2xl border transition-all ${
                        isViewingLockedBatch
                          ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/70 dark:border-slate-800/80 opacity-60 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/70 border-purple-400 dark:border-purple-500 shadow-xs cursor-pointer'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {isEn ? (tr.titleEn || tr.title) : (tr.titleVi || tr.title)}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {tr.artist} • {tr.bpm} BPM
                          </div>
                        </div>

                        {doneInfo ? (
                          <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-black shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{doneInfo.accuracy}%</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold shrink-0">
                            Band {tr.bandTarget}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100/70 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-bold">
                          {genreObj ? (isEn ? genreObj.shortEn : genreObj.shortVi) : tr.genreId}
                        </span>
                        <span className="text-slate-400 font-medium">
                          {tr.lines?.length || 0} {isEn ? 'lines' : 'câu hát'}
                        </span>
                      </div>

                      {tr.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomSong(e, tr)}
                          className="absolute top-2 right-2 p-1 rounded-lg bg-rose-100 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title={isEn ? 'Delete custom song' : 'Xóa bài nhạc tự nạp'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>
          )}

          {/* RIGHT WORKSPACE: Locked Batch Gate OR Active Dictation Studio */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            {isViewingLockedBatch && activeBatchObj ? (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-xl">
                  <BatchUnlockGateCard
                    targetBatch={activeBatchObj}
                    isCelebrationMode={false}
                    isEn={isEn}
                    onUnlockBatch={handlePurchaseMusicBatch}
                    onGoToPrevBatch={(prevIdx) => handleSelectBatch(prevIdx)}
                    onOpenAuth={() => {
                      audioEngine.pause();
                      onOpenAuth?.();
                    }}
                    onOpenArena={() => {
                      audioEngine.pause();
                      onOpenArena?.();
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Batch Mastery Celebration Banner when Batch N-1 is 100% completed */}
                {activeBatchObj?.isCompleted && nextLockedBatch && (
                  <div className="px-3 sm:px-5 pt-3 bg-slate-50 dark:bg-slate-950 shrink-0">
                    <BatchUnlockGateCard
                      targetBatch={nextLockedBatch}
                      isCelebrationMode={true}
                      compact={true}
                      isEn={isEn}
                      onUnlockBatch={handlePurchaseMusicBatch}
                      onGoToPrevBatch={(prevIdx) => handleSelectBatch(prevIdx)}
                      onOpenAuth={() => {
                        audioEngine.pause();
                        onOpenAuth?.();
                      }}
                      onOpenArena={() => {
                        audioEngine.pause();
                        onOpenArena?.();
                      }}
                    />
                  </div>
                )}

            {/* 3.1. Sticky Single-Line 4-Mode & Difficulty Control Bar */}
            <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-1.5 shrink-0">
              <div className="flex flex-nowrap items-center justify-between gap-2">
                {/* 4 Dictation Mode Pills — Always on 1 line */}
                <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto scrollbar-none flex-nowrap min-w-0">
                  {MUSIC_PRACTICE_MODES.map((m) => {
                    const isActiveMode = practiceMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleChangeMode(m.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                          isActiveMode
                            ? 'bg-slate-900 dark:bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                        title={isEn ? m.descEn : m.descVi}
                      >
                        <span>{isEn ? m.shortEn : m.shortVi}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Collapsible Options Toggle (< 768px) */}
                <button
                  type="button"
                  onClick={() => setIsMobileOptionsOpen(prev => !prev)}
                  className={`md:hidden flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-extrabold shrink-0 cursor-pointer transition-colors ${
                    isMobileOptionsOpen
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                  aria-label={isEn ? 'Toggle difficulty and display options' : 'Mở tùy chỉnh độ khó & hiển thị'}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Options' : 'Tùy chọn'}</span>
                </button>

                {/* Desktop Single-Line Controls (>= 768px): Difficulty Pill + Consolidated Options Dropdown */}
                <div className="hidden md:flex items-center gap-1.5 shrink-0">
                  {practiceMode !== 'full' && (
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      {MUSIC_DIFFICULTY_LEVELS.map((lv) => {
                        const shortLabel = isEn
                          ? lv.labelEn.replace(/\s*\(.*?\)/, '')
                          : lv.labelVi.replace(/\s*\(.*?\)/, '');
                        return (
                          <button
                            key={lv.id}
                            type="button"
                            onClick={() => handleChangeDifficulty(lv.id)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                              difficulty === lv.id
                                ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                            }`}
                            title={isEn ? lv.labelEn : lv.labelVi}
                          >
                            <span>{shortLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {practiceMode !== 'full' && (
                    <button
                      type="button"
                      onClick={handleShuffleBlanks}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer active:scale-95"
                      title={
                        isEn
                          ? 'Shuffle to hide different words/sentences on every click'
                          : 'Đổi ngẫu nhiên sang các từ/câu khác để luyện lại (nhấn mỗi lần đổi 1 bộ mới)'
                      }
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">{isEn ? 'Shuffle' : 'Đổi từ'}</span>
                      {seed > 1 && (
                        <span className="px-1 py-0.2 rounded bg-purple-600 text-white text-[10px] font-black leading-none">
                          #{seed}
                        </span>
                      )}
                    </button>
                  )}

                  {/* Consolidated Options Dropdown (Translation, Phonetics, Show All, Reset) */}
                  <div className="relative" ref={desktopOptionsRef}>
                    <button
                      type="button"
                      onClick={() => setIsDesktopOptionsOpen(prev => !prev)}
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                        isDesktopOptionsOpen
                          ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                      aria-expanded={isDesktopOptionsOpen}
                      aria-label={isEn ? 'Exercise options and tools' : 'Tùy chọn & công cụ bài tập'}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Options' : 'Tùy chỉnh'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isDesktopOptionsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDesktopOptionsOpen && (
                      <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                        {practiceMode !== 'full' && (
                          <button
                            type="button"
                            onClick={() => {
                              handleShuffleBlanks();
                              setIsDesktopOptionsOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <span className="inline-flex items-center space-x-2">
                              <Shuffle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                              <span>{isEn ? 'Shuffle Blanks' : 'Đổi ngẫu nhiên ô trống'}</span>
                            </span>
                          </button>
                        )}

                        {!isEn && (
                          <button
                            type="button"
                            onClick={() => setShowTranslation(prev => !prev)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <span className="inline-flex items-center space-x-2">
                              <Languages className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                              <span>Dịch nghĩa tiếng Việt</span>
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                              showTranslation
                                ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}>
                              {showTranslation ? 'ON' : 'OFF'}
                            </span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowPhoneticTips(prev => !prev)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <span className="inline-flex items-center space-x-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>{isEn ? 'Phonetics Tips' : 'Mẹo nối âm'}</span>
                          </span>
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                            showPhoneticTips
                              ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}>
                            {showPhoneticTips ? 'ON' : 'OFF'}
                          </span>
                        </button>

                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                        <button
                          type="button"
                          onClick={() => {
                            const allRev = {};
                            blueprint.lines.forEach((_, idx) => {
                              allRev[idx] = true;
                            });
                            setRevealedLines(allRev);
                            setIsDesktopOptionsOpen(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Show All Answers' : 'Hiện tất cả đáp án'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleResetSession();
                            setIsDesktopOptionsOpen(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Reset Exercise' : 'Làm lại từ đầu'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Expandable Options Tray (< 768px) */}
              {isMobileOptionsOpen && (
                <div className="md:hidden pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5 animate-in fade-in duration-150">
                  {practiceMode !== 'full' && (
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      {MUSIC_DIFFICULTY_LEVELS.map((lv) => (
                        <button
                          key={lv.id}
                          type="button"
                          onClick={() => handleChangeDifficulty(lv.id)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                            difficulty === lv.id
                              ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isEn ? lv.labelEn : lv.labelVi}
                        </button>
                      ))}
                    </div>
                  )}

                  {practiceMode !== 'full' && (
                    <button
                      type="button"
                      onClick={handleShuffleBlanks}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-bold cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Shuffle' : 'Đổi ô trống'}</span>
                    </button>
                  )}

                  {!isEn && (
                    <button
                      type="button"
                      onClick={() => setShowTranslation(prev => !prev)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer ${
                        showTranslation
                          ? 'bg-sky-50 border-sky-200 text-sky-700'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>Dịch</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPhoneticTips(prev => !prev)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer ${
                      showPhoneticTips
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-500'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Phonetics' : 'Nối âm'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const allRev = {};
                      blueprint.lines.forEach((_, idx) => {
                        allRev[idx] = true;
                      });
                      setRevealedLines(allRev);
                    }}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reveal All' : 'Đáp án'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetSession}
                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Reset' : 'Làm lại'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3.2. Collapsible Vocab & Focus Card (Only visible when toggled or 100% completed, freeing maximum vertical space for lyrics!) */}
            {!isKeyboardOpen && (showVocabFocusDrawer || progressStats.isAllCompleted) && (
              <MusicSessionSummaryCard
                track={currentTrack}
                progressStats={progressStats}
                onSaveVocabItem={onSaveToNotebook}
                onResetSession={handleResetSession}
                onShuffleBlanks={handleShuffleBlanks}
                onClaimReward={handleClaimReward}
                hasClaimedReward={hasClaimedReward}
              />
            )}

            {/* 3.3. Interactive Karaoke & Dictation Lyrics Canvas + Single Responsive Official YouTube Stream Player */}
            <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
              {isYouTubeTrack && (
                <div className="bg-slate-950 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 lg:p-0 lg:bg-black lg:block lg:absolute lg:bottom-3 lg:right-4 lg:z-20 lg:w-56 lg:h-[126px] lg:rounded-xl lg:overflow-hidden lg:shadow-2xl lg:border-2 lg:border-slate-700">
                  <div
                    ref={ytAudioEngine.containerRef}
                    className="w-28 h-16 lg:w-full lg:h-full rounded-lg lg:rounded-none overflow-hidden bg-black shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs text-slate-300 lg:hidden">
                    <div className="font-bold text-white truncate">{currentTrack?.title}</div>
                    <div className="text-[11px] text-rose-400 font-semibold">
                      {isEn ? 'Official YouTube Stream' : 'Phát trực tiếp từ YouTube Official'}
                    </div>
                  </div>
                </div>
              )}

              <MusicLyricsCanvas
                blueprint={blueprint}
                activeLineIndex={activeLineIndex}
                isPlaying={audioEngine.isPlaying}
                isEn={isEn}
                showTranslation={showTranslation}
                showPhoneticTips={showPhoneticTips}
                wordInputs={wordInputs}
                sentenceInputs={sentenceInputs}
                revealedLines={revealedLines}
                onWordInputChange={handleWordInputChange}
                onSentenceInputChange={handleSentenceInputChange}
                onRevealLine={handleRevealLine}
                onHintLine={handleHintLine}
                onSeekToLine={handleSeekToLine}
                onReplayLine={handleReplayLine}
                onPracticeLinePronunciation={handlePracticeLinePronunciation}
              />
            </div>

            {/* 3.4. Sticky Music Dictation Audio Dock */}
            <MusicAudioControlDock
              audioEngine={audioEngine}
              lines={blueprint.lines}
              activeLineIndex={activeLineIndex}
              onSelectLineIndex={handleSeekToLine}
              onReplayActiveLine={() => handleReplayLine(activeLineIndex)}
              isAutoLoopLine={isAutoLoopLine}
              onToggleAutoLoopLine={() => setIsAutoLoopLine(prev => !prev)}
              isAutoPauseLine={isAutoPauseLine}
              onToggleAutoPauseLine={() => setIsAutoPauseLine(prev => !prev)}
              isKeyboardOpen={isKeyboardOpen}
            />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Slide-Up Song Library & Batch Selector Sheet (< 1024px) */}
      {isMobileLibraryOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[65] bg-slate-950/80 backdrop-blur-xs flex items-end animate-in fade-in duration-150"
          onClick={() => setIsMobileLibraryOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[85dvh] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
          >
            {/* Mobile Sheet Header */}
            <div className="px-4 py-3 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center space-x-2 min-w-0">
                <ListMusic className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-black text-sm truncate">
                  {isEn ? 'Songs & Batches' : 'Danh Sách & Lô Nhạc'}
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileLibraryOpen(false);
                    setIsCustomModalOpen(true);
                  }}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold cursor-pointer active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Add YouTube' : 'Thêm YouTube'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileLibraryOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
                  aria-label={isEn ? 'Close song sheet' : 'Đóng danh sách bài hát'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Batch Selector inside Mobile Sheet */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 shrink-0">
              <BatchSelectorStrip
                batches={musicBatches}
                selectedBatchIndex={selectedBatchIndex}
                onSelectBatch={(idx) => {
                  handleSelectBatch(idx);
                }}
                personalCount={customSongs.length}
                isEn={isEn}
                isMobileSheet={true}
              />
            </div>

            {/* Search & Genre Filters inside Mobile Sheet */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search song or artist...' : 'Tìm tên bài hát hoặc ca sĩ...'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
                {MUSIC_GENRES.map((g) => {
                  const isSelected = selectedGenre === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGenre(g.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isEn ? g.shortEn : g.shortVi}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Sheet Track List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {isViewingLockedBatch && activeBatchObj ? (
                <BatchUnlockGateCard
                  targetBatch={activeBatchObj}
                  isCelebrationMode={false}
                  compact={true}
                  isEn={isEn}
                  onUnlockBatch={(b) => {
                    handlePurchaseMusicBatch(b);
                    setIsMobileLibraryOpen(false);
                  }}
                  onGoToPrevBatch={(prevIdx) => handleSelectBatch(prevIdx)}
                  onOpenAuth={() => {
                    setIsMobileLibraryOpen(false);
                    audioEngine.pause();
                    onOpenAuth?.();
                  }}
                  onOpenArena={() => {
                    setIsMobileLibraryOpen(false);
                    audioEngine.pause();
                    onOpenArena?.();
                  }}
                />
              ) : (
                filteredTracks.map((tr) => {
                  const isCurrent = currentTrack?.id === tr.id;
                  const doneInfo = completedMap[tr.id];
                  const genreObj = MUSIC_GENRES.find(g => g.id === tr.genreId);

                  return (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => {
                        handleSelectTrack(tr.id);
                        setIsMobileLibraryOpen(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-[0.99] ${
                        isCurrent
                          ? 'bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/70 border-purple-400 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {isEn ? (tr.titleEn || tr.title) : (tr.titleVi || tr.title)}
                          </div>
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {tr.artist} • {tr.bpm} BPM
                          </div>
                        </div>

                        {doneInfo ? (
                          <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-black shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{doneInfo.accuracy}%</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold shrink-0">
                            Band {tr.bandTarget}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-purple-100/70 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-bold">
                          {genreObj ? (isEn ? genreObj.shortEn : genreObj.shortVi) : tr.genreId}
                        </span>
                        <span className="text-slate-400 font-medium">
                          {tr.lines?.length || 0} {isEn ? 'lines' : 'câu hát'}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Song Importer Modal (Link-Only & Per-Account Private) */}
      <MusicCustomSongModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomSong={handleAddCustomSong}
        currentUser={currentUser}
        onOpenAuth={() => {
          audioEngine.pause();
          onOpenAuth?.();
        }}
      />
    </div>
  );
}
