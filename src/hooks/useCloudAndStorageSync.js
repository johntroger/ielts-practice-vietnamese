import { useEffect, useRef } from 'react';
import { safeGet, safeSet } from '../utils/storageService';
import { supabase } from '../services/supabaseClient';
import {
  fetchUserSubmissions,
  saveUserSubmissionsBatch,
  fetchUserVocab,
  saveUserVocabBatch,
  fetchUserCustomTasks,
  fetchPublicTasks,
  saveUserCustomTasksBatch,
  fetchUserMasteredItems,
  saveUserMasteredItems,
  fetchUserWalletAndBatchProgress,
  saveUserWalletAndBatchProgress
} from '../services/dataSyncService';
import { getWallet, saveWallet } from '../services/gamification/atlasWalletService';
import * as eventBus from '../services/gamification/eventBus';
import { INITIAL_TASKS, COMMUNITY_DEFAULT_TASKS } from '../data/sampleTasks';

/**
 * Custom hook encapsulating Supabase Auth session synchronization,
 * bi-directional Cloud & LocalStorage auto-sync, Two-Tier IndexedDB hydration,
 * and shared URL task parsing.
 */
export function useCloudAndStorageSync({
  currentUser,
  setCurrentUser,
  apiKey,
  model,
  allTasks,
  setAllTasks,
  communityTasks,
  setCommunityTasks,
  currentTaskId,
  setCurrentTaskId,
  essays,
  outlines,
  setLastSaved,
  submissions,
  setSubmissions,
  readingHistory,
  setReadingHistory,
  listeningHistory,
  setListeningHistory,
  speakingHistory,
  setSpeakingHistory,
  vocabList,
  setVocabList,
  mistakes,
  personalNotes,
  streakCount,
  masteredIds,
  setMasteredIds,
  openModal
}) {
  // 1. Supabase Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setCurrentUser]);

  // 2. Fetch Public Community Tasks on initial load and merge with local community bank + Shared URL hash
  useEffect(() => {
    fetchPublicTasks().then(cloudTasks => {
      if (cloudTasks && cloudTasks.length > 0) {
        setCommunityTasks(prev => {
          const cloudIds = new Set(cloudTasks.map(t => t.id));
          const defaultCommIds = new Set(COMMUNITY_DEFAULT_TASKS.map(d => d.id));
          const validLocalOnly = (prev || []).filter(t =>
            !cloudIds.has(t.id) && (defaultCommIds.has(t.id) || (t.isCustom && !t.isPublic))
          );
          const combined = [...cloudTasks];
          for (const d of COMMUNITY_DEFAULT_TASKS) {
            if (!cloudIds.has(d.id) && !combined.some(c => c.id === d.id)) {
              combined.push(d);
            }
          }
          for (const local of validLocalOnly) {
            if (!combined.some(c => c.id === local.id)) {
              combined.push(local);
            }
          }
          safeSet('ielts_public_community_tasks', combined);
          return combined;
        });
        setAllTasks(prev => {
          const cloudIds = new Set(cloudTasks.map(t => t.id));
          const defaultTaskIds = new Set([...INITIAL_TASKS, ...COMMUNITY_DEFAULT_TASKS].map(d => d.id));
          const cleanedPrev = (prev || []).filter(t => {
            if (defaultTaskIds.has(t.id)) return true;
            if (t.isOwnTask || (t.isCustom && !t.isCommunity && !t.isPublic)) return true;
            return cloudIds.has(t.id);
          });
          const existingIds = new Set(cleanedPrev.map(t => t.id));
          const newCloudTasks = cloudTasks.filter(t => !existingIds.has(t.id));
          const finalAll = newCloudTasks.length > 0 ? [...newCloudTasks, ...cleanedPrev] : cleanedPrev;
          safeSet('ielts_all_tasks', finalAll);
          return finalAll;
        });
      }
    });

    // Handle Instant URL Shared Task / Question (Cross-tab & Incognito instant transfer)
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#shared-task=')) {
        const raw = decodeURIComponent(hash.replace('#shared-task=', ''));
        const jsonStr = decodeURIComponent(escape(atob(raw)));
        const parsed = JSON.parse(jsonStr);
        if (parsed && parsed.id && (parsed.prompt || parsed.title)) {
          const formatted = {
            ...parsed,
            isPublic: true,
            isCommunity: true,
            creatorEmail: parsed.creatorEmail || 'Chia sẻ qua liên kết'
          };
          setAllTasks(prev => {
            if (prev.some(t => t.id === formatted.id)) return prev;
            return [formatted, ...prev];
          });
          setCommunityTasks(prev => {
            if (prev.some(t => t.id === formatted.id)) return prev;
            return [formatted, ...prev];
          });
          setCurrentTaskId(formatted.id);
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch (e) {
      console.warn('Could not parse shared task from URL hash:', e);
    }
  }, [setAllTasks, setCommunityTasks, setCurrentTaskId]);

  const submissionsRef = useRef(submissions);
  submissionsRef.current = submissions;
  const vocabListRef = useRef(vocabList);
  vocabListRef.current = vocabList;
  const allTasksRef = useRef(allTasks);
  allTasksRef.current = allTasks;
  const masteredIdsRef = useRef(masteredIds);
  masteredIdsRef.current = masteredIds;

  // 3. Fetch from Cloud when user logs in with Bi-directional Merge & Auto-Sync
  useEffect(() => {
    if (currentUser) {
      fetchUserSubmissions(currentUser.id).then(cloudSubs => {
        const localSubs = submissionsRef.current || [];
        if (cloudSubs && cloudSubs.length > 0) {
          const cloudIds = new Set(cloudSubs.map(s => s.id));
          const localOnlySubs = localSubs.filter(s => s?.id && !cloudIds.has(s.id));
          if (localOnlySubs.length > 0) {
            setSubmissions([...localOnlySubs, ...cloudSubs]);
            saveUserSubmissionsBatch(currentUser.id, localOnlySubs);
          } else {
            setSubmissions(cloudSubs);
          }
        } else if (localSubs.length > 0) {
          saveUserSubmissionsBatch(currentUser.id, localSubs);
        }
      });

      fetchUserVocab(currentUser.id).then(cloudVocab => {
        const localVocab = vocabListRef.current || [];
        if (cloudVocab && cloudVocab.length > 0) {
          const cloudIds = new Set(cloudVocab.map(v => v.id));
          const cloudPhrases = new Set(cloudVocab.map(v => (v.phrase || '').trim().toLowerCase()));
          const localOnlyVocab = localVocab.filter(
            v => v?.id && !cloudIds.has(v.id) && !cloudPhrases.has((v.phrase || '').trim().toLowerCase())
          );
          if (localOnlyVocab.length > 0) {
            setVocabList([...localOnlyVocab, ...cloudVocab]);
            saveUserVocabBatch(currentUser.id, localOnlyVocab);
          } else {
            setVocabList(cloudVocab);
          }
        } else if (localVocab.length > 0) {
          saveUserVocabBatch(currentUser.id, localVocab);
        }
      });

      fetchUserCustomTasks(currentUser.id).then(cloudTasks => {
        if (cloudTasks && cloudTasks.length > 0) {
          setAllTasks(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newToAdd = cloudTasks.filter(t => !existingIds.has(t.id));
            return [...newToAdd, ...prev];
          });
        } else {
          const localCustom = (allTasksRef.current || []).filter(t => t.isOwnTask || t.id?.startsWith('task-') || t.id?.startsWith('custom-'));
          if (localCustom.length > 0) {
            saveUserCustomTasksBatch(currentUser.id, localCustom, currentUser.email);
          }
        }
      });

      fetchUserMasteredItems(currentUser.id).then(cloudMastered => {
        const localMastered = masteredIdsRef.current || [];
        if (cloudMastered && cloudMastered.length > 0) {
          setMasteredIds(prev => {
            const combined = Array.from(new Set([...prev, ...cloudMastered]));
            safeSet('ielts_mastered_items', combined);
            return combined;
          });
        } else if (localMastered.length > 0) {
          saveUserMasteredItems(currentUser.id, localMastered);
        }
      });

      // Sync Atlas Wallet (Gold, Diamonds, Unlocked Batches), Pronunciation/Conversation & Private Custom Music Songs
      const pronKey = `ielts_pronunciation_passed_ids_v1_${currentUser.id}`;
      const musicCustomKey = `ielts_music_custom_songs_v2_${currentUser.id}`;
      fetchUserWalletAndBatchProgress(currentUser.id).then(cloudData => {
        const localWallet = getWallet();
        const localPronPassed = safeGet(pronKey, []);
        const localConvStats = safeGet('ielts_conversation_stats_v1', { totalXpEarned: 0, completedCount: 0, bestScores: {}, streak: 0 });
        const localShadowStats = safeGet('ielts_shadowing_stats_v1', { totalXpEarned: 0, completedCount: 0, bestScores: {}, streak: 0 });
        const localMusicCustom = safeGet(musicCustomKey, []);

        if (cloudData && typeof cloudData === 'object') {
          const cloudWallet = cloudData.wallet || {};
          const cloudTs = Date.parse(cloudWallet.updatedAt || 0) || 0;
          const localTs = Date.parse(localWallet.updatedAt || 0) || 0;
          const useCloudBalances = cloudTs >= localTs;

          // Union-merge inventory so unlocked batches & purchased items are never lost across devices
          const mergedInventory = { ...(localWallet.inventory || {}) };
          Object.entries(cloudWallet.inventory || {}).forEach(([itemId, itemVal]) => {
            const existing = mergedInventory[itemId];
            if (!existing || (itemVal?.quantity || 0) > (existing?.quantity || 0)) {
              mergedInventory[itemId] = itemVal;
            }
          });

          const mergedWallet = {
            ...(useCloudBalances ? cloudWallet : localWallet),
            gold: useCloudBalances
              ? Math.max(0, Number(cloudWallet.gold) || 0)
              : Math.max(0, Number(localWallet.gold) || 0),
            diamonds: useCloudBalances
              ? Math.max(0, Number(cloudWallet.diamonds) || 0)
              : Math.max(0, Number(localWallet.diamonds) || 0),
            inventory: mergedInventory,
            transactions: useCloudBalances
              ? (Array.isArray(cloudWallet.transactions) ? cloudWallet.transactions : localWallet.transactions)
              : localWallet.transactions,
            backfillClaimed: Boolean(cloudWallet.backfillClaimed || localWallet.backfillClaimed)
          };

          const mergedPronPassed = Array.from(
            new Set([
              ...(Array.isArray(localPronPassed) ? localPronPassed : []),
              ...(Array.isArray(cloudData.pronPassedIds) ? cloudData.pronPassedIds : [])
            ])
          );

          const mergeBestScores = (localMap = {}, cloudMap = {}) => {
            const merged = { ...localMap };
            Object.entries(cloudMap || {}).forEach(([id, scoreObj]) => {
              if (!merged[id] || (scoreObj?.accuracy || 0) > (merged[id]?.accuracy || 0)) {
                merged[id] = scoreObj;
              }
            });
            return merged;
          };

          const mergedConvBest = mergeBestScores(localConvStats.bestScores, cloudData.convBestScores);
          const mergedShadowBest = mergeBestScores(localShadowStats.bestScores, cloudData.shadowBestScores);

          // Merge user's private link-based custom songs (strictly scoped to currentUser.id, max 20 songs)
          const customSongMap = new Map();
          [
            ...(Array.isArray(localMusicCustom) ? localMusicCustom : []),
            ...(Array.isArray(cloudData.musicCustomSongs) ? cloudData.musicCustomSongs : [])
          ].forEach((song) => {
            if (
              song &&
              song.id &&
              (!song.ownerUserId || song.ownerUserId === currentUser.id) &&
              !song.localAudioId
            ) {
              customSongMap.set(song.id, { ...song, ownerUserId: currentUser.id });
            }
          });
          const mergedMusicCustom = Array.from(customSongMap.values()).slice(0, 20);

          isApplyingCloudWalletRef.current = true;
          saveWallet(mergedWallet);
          safeSet(pronKey, mergedPronPassed);
          safeSet(musicCustomKey, mergedMusicCustom);
          safeSet('ielts_conversation_stats_v1', {
            ...localConvStats,
            bestScores: mergedConvBest,
            completedCount: Object.keys(mergedConvBest).length
          });
          safeSet('ielts_shadowing_stats_v1', {
            ...localShadowStats,
            bestScores: mergedShadowBest,
            completedCount: Object.keys(mergedShadowBest).length
          });
          eventBus.emit('cloud_batch_progress_synced', {
            pronPassedIds: mergedPronPassed,
            convBestScores: mergedConvBest,
            shadowBestScores: mergedShadowBest,
            musicCustomSongs: mergedMusicCustom
          });
          setTimeout(() => {
            isApplyingCloudWalletRef.current = false;
          }, 300);
        } else {
          // First-time cloud seed from current device
          saveUserWalletAndBatchProgress(currentUser.id, {
            wallet: localWallet,
            pronPassedIds: Array.isArray(localPronPassed) ? localPronPassed : [],
            convBestScores: localConvStats.bestScores || {},
            shadowBestScores: localShadowStats.bestScores || {},
            musicCustomSongs: Array.isArray(localMusicCustom) ? localMusicCustom.slice(0, 20) : [],
            updatedAt: new Date().toISOString()
          });
        }
      });
    }
  }, [currentUser]);

  const isApplyingCloudWalletRef = useRef(false);

  // 3b. Debounced auto-push Wallet & Batch Progression to Supabase Cloud
  useEffect(() => {
    if (!currentUser) return;
    let pushTimer = null;

    const scheduleCloudPush = () => {
      if (isApplyingCloudWalletRef.current) return;
      if (pushTimer) clearTimeout(pushTimer);
      pushTimer = setTimeout(() => {
        const pronKey = `ielts_pronunciation_passed_ids_v1_${currentUser.id}`;
        const musicCustomKey = `ielts_music_custom_songs_v2_${currentUser.id}`;
        const localWallet = getWallet();
        const localPronPassed = safeGet(pronKey, []);
        const localConvStats = safeGet('ielts_conversation_stats_v1', { bestScores: {} });
        const localShadowStats = safeGet('ielts_shadowing_stats_v1', { bestScores: {} });
        const localMusicCustom = safeGet(musicCustomKey, []);

        saveUserWalletAndBatchProgress(currentUser.id, {
          wallet: localWallet,
          pronPassedIds: Array.isArray(localPronPassed) ? localPronPassed : [],
          convBestScores: localConvStats.bestScores || {},
          shadowBestScores: localShadowStats.bestScores || {},
          musicCustomSongs: Array.isArray(localMusicCustom) ? localMusicCustom.slice(0, 20) : [],
          updatedAt: new Date().toISOString()
        });
      }, 1200);
    };

    const unsubWallet = eventBus.on('wallet_updated', scheduleCloudPush);
    const unsubBatch = eventBus.on('batch_progress_updated', scheduleCloudPush);

    return () => {
      if (pushTimer) clearTimeout(pushTimer);
      if (typeof unsubWallet === 'function') unsubWallet();
      if (typeof unsubBatch === 'function') unsubBatch();
    };
  }, [currentUser]);

  // 4. Auto-save API Key & Model settings (study data persistence is handled by useStudyData)
  useEffect(() => {
    safeSet('ielts_gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    safeSet('ielts_gemini_model', model);
  }, [model]);

  // 5. Launch onboarding for first-time visitors (skip if landing directly on a dedicated studio deep-link URL)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const isDedicatedStudioPath =
        path.includes('/music-listening') ||
        path.includes('/music-dictation') ||
        path.includes('/luyen-nghe-nhac') ||
        path.includes('/pronunciation') ||
        path.includes('/conversation') ||
        path.includes('/shadowing') ||
        path.includes('/micro-drills') ||
        path.includes('/atlas-arena') ||
        path.includes('/arena') ||
        path.includes('/vocab-studio') ||
        path.includes('/about');
      if (isDedicatedStudioPath) return;
    }
    if (!safeGet('ielts_user_onboarded', false)) {
      openModal('onboarding');
    }
  }, [openModal]);
}
