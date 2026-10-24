import { useEffect } from 'react';
import { safeGet, safeSet } from '../utils/storageService';
import { supabase } from '../services/supabaseClient';
import {
  fetchUserSubmissions,
  saveUserSubmission,
  fetchUserVocab,
  saveUserVocabItem,
  fetchUserCustomTasks,
  fetchPublicTasks,
  saveUserCustomTask,
  fetchUserMasteredItems,
  saveUserMasteredItems
} from '../services/dataSyncService';
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

  // 3. Fetch from Cloud when user logs in with Bi-directional Auto-Sync
  useEffect(() => {
    if (currentUser) {
      fetchUserSubmissions(currentUser.id).then(cloudSubs => {
        if (cloudSubs && cloudSubs.length > 0) {
          setSubmissions(cloudSubs);
        } else if (submissions && submissions.length > 0) {
          submissions.forEach(sub => saveUserSubmission(currentUser.id, sub));
        }
      });

      fetchUserVocab(currentUser.id).then(cloudVocab => {
        if (cloudVocab && cloudVocab.length > 0) {
          setVocabList(cloudVocab);
        } else if (vocabList && vocabList.length > 0) {
          vocabList.forEach(v => saveUserVocabItem(currentUser.id, v));
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
          const localCustom = (allTasks || []).filter(t => t.isOwnTask || t.id?.startsWith('task-') || t.id?.startsWith('custom-'));
          localCustom.forEach(t => saveUserCustomTask(currentUser.id, t, t.isPublic || false, currentUser.email));
        }
      });

      fetchUserMasteredItems(currentUser.id).then(cloudMastered => {
        if (cloudMastered && cloudMastered.length > 0) {
          setMasteredIds(prev => {
            const combined = Array.from(new Set([...prev, ...cloudMastered]));
            safeSet('ielts_mastered_items', combined);
            return combined;
          });
        } else if (masteredIds && masteredIds.length > 0) {
          saveUserMasteredItems(currentUser.id, masteredIds);
        }
      });
    }
  }, [currentUser]);

  // 4. Auto-save API Key & Model settings (study data persistence is handled by useStudyData)
  useEffect(() => {
    safeSet('ielts_gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    safeSet('ielts_gemini_model', model);
  }, [model]);

  // 5. Launch onboarding for first-time visitors
  useEffect(() => {
    if (!safeGet('ielts_user_onboarded', false)) {
      openModal('onboarding');
    }
  }, [openModal]);
}
