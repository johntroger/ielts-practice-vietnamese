import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Target, ChevronDown, BookOpen, GraduationCap, Maximize2, Minimize2, Keyboard, X } from 'lucide-react';
import Navbar from './components/Navbar';
import WritingWorkspace from './components/writing/WritingWorkspace';
// Lazy-loaded workspaces and modals for optimal initial bundle performance
const ReadingWorkspace = React.lazy(() => import('./components/reading/ReadingWorkspace'));
const ListeningWorkspace = React.lazy(() => import('./components/listening/ListeningWorkspace'));
const SpeakingWorkspace = React.lazy(() => import('./components/speaking/SpeakingWorkspace'));

import AppModalHost from './components/modals/AppModalHost';
import WorkspaceErrorBoundary from './components/common/WorkspaceErrorBoundary';
import { useModalStore } from './core/modalStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { safeGet, safeSet, safeRemove } from './utils/storageService';
import { 
  saveTwoTierSubmissions, 
  loadTwoTierSubmissions, 
  deleteSubmissionTwoTier, 
  clearSubmissionsTwoTier, 
  migrateSubmissionsToIndexedDb 
} from './utils/indexedDbStorage';
import { supabase } from './services/supabaseClient';
import { 
  fetchUserSubmissions, 
  saveUserSubmission, 
  deleteUserSubmission, 
  fetchUserVocab, 
  saveUserVocabItem, 
  deleteUserVocabItem, 
  fetchUserCustomTasks,
  fetchPublicTasks,
  saveUserCustomTask,
  toggleTaskPublicity,
  deleteUserCustomTask,
  fetchUserMasteredItems,
  saveUserMasteredItems
} from './services/dataSyncService';

import { INITIAL_TASKS, COMMUNITY_DEFAULT_TASKS } from './data/sampleTasks';
import { evaluateEssay } from './services/geminiService';
import { evaluateEssayAlgorithmically } from './services/algorithmicEvaluationService';
import { countWords } from './utils/textAnalytics';
import { setCdiFontSize as setCdiFontSizeInStore, setCdiContrast as setCdiContrastInStore, setAppState } from './core/appStore';
import { deduplicateWritingTasks, auditAndCleanWebsiteContent } from './services/deduplicationService';

export default function App() {
  const { modals, openModal, closeModal, toggleModal } = useModalStore();

  // 1. Persistent Storage State with Quota-Resilient Storage Service
  const [apiKey, setApiKey] = useState(() => safeGet('ielts_gemini_api_key', ''));
  const [targetBand, setTargetBand] = useState(() => safeGet('ielts_target_band', '6.5'));
  const [model, setModel] = useState(() => {
    const saved = safeGet('ielts_gemini_model', '');
    const validModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-pro-preview'];
    return (saved && validModels.includes(saved)) ? saved : 'gemini-3.6-flash';
  });
  
  const [allTasks, setAllTasks] = useState(() => {
    const saved = safeGet('ielts_all_tasks', null);
    const defaults = [...INITIAL_TASKS, ...COMMUNITY_DEFAULT_TASKS];
    if (Array.isArray(saved) && saved.length > 0) {
      const savedIds = new Set(saved.map(t => t.id));
      const missingDefaults = defaults.filter(d => !savedIds.has(d.id));
      const combined = [...saved, ...missingDefaults];
      const { cleanedTasks } = deduplicateWritingTasks(combined, 0.75);
      return cleanedTasks;
    }
    const { cleanedTasks } = deduplicateWritingTasks(defaults, 0.75);
    return cleanedTasks;
  });
  const [currentTaskId, setCurrentTaskId] = useState(() => {
    return safeGet('ielts_current_task_id', 't2-ai-workplace-2025');
  });

  const [essays, setEssays] = useState(() => safeGet('ielts_essays_drafts', {}));
  const [outlines, setOutlines] = useState(() => safeGet('ielts_outlines_drafts', {}));
  const [submissions, setSubmissions] = useState(() => safeGet('ielts_submissions_history', []));
  const [readingHistory, setReadingHistory] = useState(() => safeGet('ielts_reading_submissions_history', []));
  const [listeningHistory, setListeningHistory] = useState(() => safeGet('ielts_listening_submissions_history', []));
  const [speakingHistory, setSpeakingHistory] = useState(() => safeGet('ielts_speaking_submissions_history', []));
  const [vocabList, setVocabList] = useState(() => safeGet('ielts_vocab_notebook', [
    { id: 'v1', phrase: 'catalyze novel industries', meaningVi: 'thúc đẩy các ngành mới', example: 'AI will catalyze novel industries.', topic: 'tech' },
    { id: 'v2', phrase: 'pivotal element', meaningVi: 'yếu tố then chốt', example: 'Education is a pivotal element.', topic: 'edu' },
  ]));
  const [mistakes, setMistakes] = useState(() => safeGet('ielts_mistakes_log', []));
  const [personalNotes, setPersonalNotes] = useState(() => safeGet('ielts_theory_notes', []));
  const [streakCount, setStreakCount] = useState(() => Number(safeGet('ielts_streak_count', 3)) || 3);
  const [masteredIds, setMasteredIds] = useState(() => safeGet('ielts_mastered_items', []));

  // 2. UI & Mode State
  const [activeSkill, setActiveSkill] = useState(() => safeGet('ielts_active_skill', 'writing'));
  const [mode, setMode] = useState('exam'); // 'exam' | 'practice'
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isApiKeyBannerDismissed, setIsApiKeyBannerDismissed] = useState(() => safeGet('ielts_dismiss_api_banner', false));

  // Keep active skill in localStorage safely
  useEffect(() => {
    safeSet('ielts_active_skill', activeSkill);
  }, [activeSkill]);

  // Real-time synchronization across browser tabs, windows and Supabase Cloud
  useEffect(() => {
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('ielts_tasks_realtime');
        bc.onmessage = (event) => {
          const { type, taskId, task, isPublic } = event.data || {};
          if (type === 'DELETE_TASK' && taskId) {
            setAllTasks(prev => {
              const updated = prev.filter(t => t.id !== taskId);
              safeSet('ielts_all_tasks', updated);
              return updated;
            });
            setCommunityTasks(prev => {
              const updated = prev.filter(t => t.id !== taskId);
              safeSet('ielts_public_community_tasks', updated);
              return updated;
            });
          } else if (type === 'ADD_TASK' && task) {
            setAllTasks(prev => {
              if (prev.some(t => t.id === task.id)) return prev;
              const next = [task, ...prev];
              safeSet('ielts_all_tasks', next);
              return next;
            });
            if (isPublic) {
              setCommunityTasks(prev => {
                if (prev.some(t => t.id === task.id)) return prev;
                const next = [task, ...prev];
                safeSet('ielts_public_community_tasks', next);
                return next;
              });
            }
          } else if (type === 'TOGGLE_PUBLIC' && taskId !== undefined) {
            setAllTasks(prev => {
              const next = prev.map(t => t.id === taskId ? { ...t, isPublic } : t);
              safeSet('ielts_all_tasks', next);
              return next;
            });
            setCommunityTasks(prev => {
              let next;
              if (isPublic) {
                const found = allTasks.find(t => t.id === taskId);
                if (found && !prev.some(t => t.id === taskId)) {
                  next = [{ ...found, isPublic: true, isCommunity: true }, ...prev];
                } else {
                  next = prev;
                }
              } else {
                next = prev.filter(t => t.id !== taskId);
              }
              safeSet('ielts_public_community_tasks', next);
              return next;
            });
          }
        };
      }
    } catch (e) {}

    const handleStorageChange = (e) => {
      if (e.key === 'ielts_all_tasks') {
        const updated = safeGet('ielts_all_tasks', null);
        if (Array.isArray(updated) && updated.length > 0) {
          setAllTasks(updated);
        }
      }
      if (e.key === 'ielts_public_community_tasks') {
        const updated = safeGet('ielts_public_community_tasks', null);
        if (Array.isArray(updated)) {
          setCommunityTasks(updated);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Supabase Realtime Channel for global cloud updates
    let channel = null;
    try {
      channel = supabase
        .channel('realtime_public_custom_tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_custom_tasks' }, (payload) => {
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setAllTasks(prev => {
                const updated = prev.filter(t => t.id !== deletedId);
                safeSet('ielts_all_tasks', updated);
                return updated;
              });
              setCommunityTasks(prev => {
                const updated = prev.filter(t => t.id !== deletedId);
                safeSet('ielts_public_community_tasks', updated);
                return updated;
              });
            }
          } else if (payload.eventType === 'INSERT') {
            const row = payload.new;
            if (row && row.is_public && !row.id.startsWith('custom-drill-') && !row.id.startsWith('drill-') && (!row.task_data || !row.task_data.isDrill)) {
              const formatted = {
                ...row.task_data,
                id: row.id,
                isPublic: true,
                creatorEmail: row.creator_email,
                isCommunity: true
              };
              setAllTasks(prev => {
                if (prev.some(t => t.id === formatted.id)) return prev;
                const next = [formatted, ...prev];
                safeSet('ielts_all_tasks', next);
                return next;
              });
              setCommunityTasks(prev => {
                if (prev.some(t => t.id === formatted.id)) return prev;
                const next = [formatted, ...prev];
                safeSet('ielts_public_community_tasks', next);
                return next;
              });
            }
          }
        })
        .subscribe();
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      if (channel) {
        try { supabase.removeChannel(channel); } catch (e) {}
      }
    };
  }, []);

  // User & Workspace States
  const [currentUser, setCurrentUser] = useState(null);
  const [communityTasks, setCommunityTasks] = useState(() => {
    const cached = safeGet('ielts_public_community_tasks', null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return COMMUNITY_DEFAULT_TASKS;
  });
  const [readingGenTrigger, setReadingGenTrigger] = useState(0);
  const [readingIngestTrigger, setReadingIngestTrigger] = useState(0);
  const [readingLibraryTrigger, setReadingLibraryTrigger] = useState(0);
  const [listeningGenTrigger, setListeningGenTrigger] = useState(0);
  const [listeningLibraryTrigger, setListeningLibraryTrigger] = useState(0);
  const [speakingGenTrigger, setSpeakingGenTrigger] = useState(0);
  const [speakingLibraryTrigger, setSpeakingLibraryTrigger] = useState(0);
  const [selectedHistorySpeakingSub, setSelectedHistorySpeakingSub] = useState(null);

  // Phase 1 UX: Focus Mode & Modal Store Compatibility Aliases
  const [isFocusMode, setIsFocusMode] = useState(() => safeGet('ielts_focus_mode', false));
  const isShortcutsOpen = Boolean(modals.shortcuts);
  const isPrescriptionOpen = Boolean(modals.prescription);

  // Centralized Modal Container (AppModalHost) delegates rendering for:
  // KeyboardShortcutsModal, CDIDisplayModal, DailyErrorPrescriptionModal, GrowthAnalyticsModal

  const toggleFocusMode = () => {
    setIsFocusMode(prev => {
      const next = !prev;
      safeSet('ielts_focus_mode', next);
      return next;
    });
  };

  // Phase 1 Ergonomics: Slim Header for Laptop Vertical Space
  const [isSlimHeader, setIsSlimHeader] = useState(() => safeGet('ielts_slim_header', false));

  const toggleSlimHeader = () => {
    setIsSlimHeader(prev => {
      const next = !prev;
      safeSet('ielts_slim_header', next);
      return next;
    });
  };

  // Mobile / Tablet Virtual Keyboard VisualViewport adaptation:
  // Automatically activate slim header when virtual keyboard opens to preserve maximum vertical typing space
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleViewportResize = () => {
      const vv = window.visualViewport;
      if (vv.height < window.innerHeight * 0.78) {
        setIsSlimHeader(true);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportResize);
    return () => {
      window.visualViewport.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  // Phase 4: CDI Accessibility & Display Settings (Font Scale & Screen Contrast)
  const [cdiFontSize, setCdiFontSize] = useState(() => safeGet('ielts_cdi_font_size', 'standard'));
  const [cdiContrast, setCdiContrast] = useState(() => safeGet('ielts_cdi_contrast', 'standard'));

  const handleChangeCdiFontSize = (size) => {
    setCdiFontSize(size);
    safeSet('ielts_cdi_font_size', size);
    setCdiFontSizeInStore(size);
  };

  const handleChangeCdiContrast = (contrast) => {
    setCdiContrast(contrast);
    safeSet('ielts_cdi_contrast', contrast);
    setCdiContrastInStore(contrast);
  };

  const handleResetCDIDisplay = () => {
    handleChangeCdiFontSize('standard');
    handleChangeCdiContrast('standard');
  };

  // Reading Mock Test Exam State
  const [readingMockTestId, setReadingMockTestId] = useState(null);
  const [readingMockExamMode, setReadingMockExamMode] = useState(null);

  const handleStartReadingMockExam = (testId) => {
    setActiveSkill('reading');
    setReadingMockTestId(testId);
    setReadingMockExamMode('exam');
    closeModal('mockTest');
  };

  // CDI Full Marathon 3-Skill State (Listening -> Reading -> Writing)
  const [marathonSession, setMarathonSession] = useState(() => safeGet('ielts_marathon_session', null));

  const handleStartMarathon = () => {
    const session = {
      active: true,
      stage: 'listening',
      startedAt: Date.now(),
      listeningScore: null,
      readingScore: null,
      writingScore: null
    };
    setMarathonSession(session);
    safeSet('ielts_marathon_session', session);
    setActiveSkill('listening');
    closeModal('mockTest');
  };

  const handleCancelMarathon = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy phiên thi marathon 3 kỹ năng này? Toàn bộ tiến trình liên hoàn sẽ được đặt lại.')) {
      setMarathonSession(null);
      safeRemove('ielts_marathon_session');
    }
  };

  // AI Operation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  // 3. Current Task & Text Derivations
  const currentTask = allTasks.find(t => t.id === currentTaskId) || allTasks[0];
  const currentEssay = essays[currentTaskId] || '';
  const currentOutline = outlines[currentTaskId] || '';

  // Weekly Word Target calculation (Target: 2500 words/week)
  const weeklyWordTarget = 2500;
  const currentWeekWords = submissions.slice(0, 7).reduce((acc, s) => acc + (s.stats?.wordCount || 0), 0) + countWords(currentEssay);
  const weeklyWordProgress = Math.min(100, Math.round((currentWeekWords / weeklyWordTarget) * 100));

  // 4. Timer Logic
  const defaultSeconds = (currentTask?.timeLimit || 40) * 60;
  const [timeRemaining, setTimeRemaining] = useState(defaultSeconds);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sync Timer when task changes
  useEffect(() => {
    setTimeRemaining((currentTask?.timeLimit || 40) * 60);
    setTimeElapsed(0);
    setIsTimerRunning(false);
  }, [currentTaskId]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Supabase Auth listener & Cloud Sync
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Public Community Tasks on initial load and merge with local community bank
  useEffect(() => {
    fetchPublicTasks().then(cloudTasks => {
      if (cloudTasks && cloudTasks.length > 0) {
        setCommunityTasks(prev => {
          const cloudIds = new Set(cloudTasks.map(t => t.id));
          const defaultCommIds = new Set(COMMUNITY_DEFAULT_TASKS.map(d => d.id));
          // Prune stale community tasks that were deleted from Supabase cloud
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
          // Prune stale public tasks that were deleted from Supabase cloud
          const cleanedPrev = (prev || []).filter(t => {
            if (defaultTaskIds.has(t.id)) return true;
            if (t.isOwnTask || (t.isCustom && !t.isCommunity && !t.isPublic)) return true;
            // For community/public tasks, keep ONLY if it exists in the fresh cloudTasks
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
  }, []);

  // Fetch from Cloud when user logs in with Bi-directional Auto-Sync
  useEffect(() => {
    if (currentUser) {
      // 1. Fetch Cloud Submissions
      fetchUserSubmissions(currentUser.id).then(cloudSubs => {
        if (cloudSubs && cloudSubs.length > 0) {
          setSubmissions(cloudSubs);
        } else if (submissions && submissions.length > 0) {
          // Auto-migrate local submissions to Supabase Cloud for this user
          submissions.forEach(sub => saveUserSubmission(currentUser.id, sub));
        }
      });

      // 2. Fetch Cloud Vocab Notebook
      fetchUserVocab(currentUser.id).then(cloudVocab => {
        if (cloudVocab && cloudVocab.length > 0) {
          setVocabList(cloudVocab);
        } else if (vocabList && vocabList.length > 0) {
          // Auto-migrate local vocab to Supabase Cloud
          vocabList.forEach(v => saveUserVocabItem(currentUser.id, v));
        }
      });

      // 3. Fetch User's Cloud Custom & AI Tasks
      fetchUserCustomTasks(currentUser.id).then(cloudTasks => {
        if (cloudTasks && cloudTasks.length > 0) {
          setAllTasks(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newToAdd = cloudTasks.filter(t => !existingIds.has(t.id));
            return [...newToAdd, ...prev];
          });
        } else {
          // Auto-migrate local custom tasks to Supabase Cloud
          const localCustom = (allTasks || []).filter(t => t.isOwnTask || t.id?.startsWith('task-') || t.id?.startsWith('custom-'));
          localCustom.forEach(t => saveUserCustomTask(currentUser.id, t, t.isPublic || false, currentUser.email));
        }
      });

      // 4. Fetch User's Mastered Tasks & Drills
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

  // Mastered Items Toggle Handler (Requires Login)
  const handleToggleMastered = (itemId) => {
    if (!currentUser) {
      alert('Tính năng "Đã thuộc" giúp cá nhân hóa và ẩn câu hỏi đã thuần thục khỏi giao diện luyện tập. Vui lòng Đăng nhập để lưu tiến trình!');
      openModal('auth');
      return;
    }
    setMasteredIds(prev => {
      const isAlready = prev.includes(itemId);
      const updated = isAlready ? prev.filter(id => id !== itemId) : [...prev, itemId];
      safeSet('ielts_mastered_items', updated);
      saveUserMasteredItems(currentUser.id, updated);
      return updated;
    });
  };

  // 5. Automated Content Deduplication & Sanitization on startup
  useEffect(() => {
    try {
      const report = auditAndCleanWebsiteContent(0.75);
      if (report.hasDuplicates) {
        console.log(`[IELTS Deduplication] Auto-cleaned ${report.totalRemoved} duplicate AI prompts across storage.`, report);
      }
    } catch (err) {
      console.warn('Auto deduplication audit notice:', err);
    }
  }, []);

  // 6. Auto-save Effects with Quota-Resilient Storage Manager
  useEffect(() => {
    safeSet('ielts_gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    safeSet('ielts_gemini_model', model);
  }, [model]);

  useEffect(() => {
    safeSet('ielts_all_tasks', allTasks);
  }, [allTasks]);

  useEffect(() => {
    safeSet('ielts_current_task_id', currentTaskId);
  }, [currentTaskId]);

  useEffect(() => {
    safeSet('ielts_essays_drafts', essays);
    setLastSaved(new Date());
  }, [essays]);

  useEffect(() => {
    safeSet('ielts_outlines_drafts', outlines);
  }, [outlines]);

  // Asynchronous Two-Tier IndexedDB Hydration & Storage Migration
  useEffect(() => {
    let isMounted = true;
    async function hydrateTwoTierHistory() {
      try {
        await migrateSubmissionsToIndexedDb();
        const [fullWriting, fullReading, fullListening, fullSpeaking] = await Promise.all([
          loadTwoTierSubmissions('ielts_submissions_history', null),
          loadTwoTierSubmissions('ielts_reading_submissions_history', null),
          loadTwoTierSubmissions('ielts_listening_submissions_history', null),
          loadTwoTierSubmissions('ielts_speaking_submissions_history', null)
        ]);
        if (!isMounted) return;
        if (Array.isArray(fullWriting) && fullWriting.length > 0) setSubmissions(fullWriting);
        if (Array.isArray(fullReading) && fullReading.length > 0) setReadingHistory(fullReading);
        if (Array.isArray(fullListening) && fullListening.length > 0) setListeningHistory(fullListening);
        if (Array.isArray(fullSpeaking) && fullSpeaking.length > 0) setSpeakingHistory(fullSpeaking);
      } catch (err) {
        console.warn('[Storage] Two-tier history hydration error:', err);
      }
    }
    hydrateTwoTierHistory();
    return () => { isMounted = false; };
  }, []);

  // Two-Tier Submissions Persistence (Full in IndexedDB, Ultra-lightweight Summary in LocalStorage)
  useEffect(() => {
    saveTwoTierSubmissions('ielts_submissions_history', submissions);
  }, [submissions]);

  useEffect(() => {
    saveTwoTierSubmissions('ielts_reading_submissions_history', readingHistory);
  }, [readingHistory]);

  useEffect(() => {
    saveTwoTierSubmissions('ielts_listening_submissions_history', listeningHistory);
  }, [listeningHistory]);

  useEffect(() => {
    saveTwoTierSubmissions('ielts_speaking_submissions_history', speakingHistory);
  }, [speakingHistory]);

  useEffect(() => {
    safeSet('ielts_vocab_notebook', vocabList);
  }, [vocabList]);

  useEffect(() => {
    safeSet('ielts_mistakes_log', mistakes);
  }, [mistakes]);

  useEffect(() => {
    safeSet('ielts_theory_notes', personalNotes);
  }, [personalNotes]);

  useEffect(() => {
    safeSet('ielts_streak_count', streakCount.toString());
  }, [streakCount]);

  useEffect(() => {
    safeSet('ielts_public_community_tasks', communityTasks);
  }, [communityTasks]);

  // Launch onboarding for first-time visitors
  useEffect(() => {
    if (!safeGet('ielts_user_onboarded', false)) {
      openModal('onboarding');
    }
  }, []);

  // Global Keyboard Shortcuts (Phase 1 UX Improvement)
  useKeyboardShortcuts({
    toggleFocusMode,
    toggleSlimHeader,
    onOpenLibrary: () => openModal('library'),
    onToggleMastered: handleToggleMastered,
    currentTaskId,
    onOpenTheory: () => openModal('theory'),
    onOpenHelp: () => toggleModal('featuresGuide'),
    isShortcutsOpen: Boolean(modals.shortcuts),
    setIsShortcutsOpen: (val) => (typeof val === 'function' ? (val(Boolean(modals.shortcuts)) ? openModal('shortcuts') : closeModal('shortcuts')) : (val ? openModal('shortcuts') : closeModal('shortcuts'))),
    isFocusMode,
    setIsFocusMode: (val) => {
      setIsFocusMode(val);
      safeSet('ielts_focus_mode', val);
    }
  });

  // Handlers
  const handleEssayChange = (text) => {
    setEssays(prev => ({ ...prev, [currentTaskId]: text }));
    if (!isTimerRunning && timeElapsed === 0 && text.trim().length > 0) {
      setIsTimerRunning(true);
    }
  };

  const handleOutlineChange = (text) => {
    setOutlines(prev => ({ ...prev, [currentTaskId]: text }));
  };

  const handleSubmitEssay = async (method = 'ai') => {
    const wordCount = countWords(currentEssay);
    if (wordCount < 20) {
      alert('Vui lòng viết ít nhất 20 từ trước khi nộp bài để giám khảo chấm điểm.');
      return;
    }

    // If requesting AI grading but no API Key is configured, guide user to Settings
    if (method === 'ai' && !apiKey) {
      openModal('settings');
      return;
    }

    setIsSubmitting(true);
    setIsTimerRunning(false);

    try {
      let evaluation = null;

      if (method === 'algorithmic') {
        // Fast offline deterministic Cambridge grading
        await new Promise(resolve => setTimeout(resolve, 350));
        evaluation = evaluateEssayAlgorithmically({
          task: currentTask,
          essayText: currentEssay
        });
      } else {
        // AI In-depth Grading with Gemini
        try {
          evaluation = await evaluateEssay({
            task: currentTask,
            essayText: currentEssay,
            apiKey,
            model
          });
          evaluation.evaluationMethod = 'ai';
          evaluation.engineName = `Trí Tuệ Nhân Tạo AI (${model})`;
        } catch (aiErr) {
          console.warn('[Evaluation Fallback] AI API encountered error, switching to Algorithmic Evaluator:', aiErr);
          // Graceful fallback to algorithmic evaluator
          evaluation = evaluateEssayAlgorithmically({
            task: currentTask,
            essayText: currentEssay
          });
          evaluation.fallbackNotice = 'Dịch vụ AI tạm thời quá tải hoặc chạm hạn ngạch (Quota 429). Hệ thống đã tự động chuyển sang Chế độ Chấm Bằng Máy để bạn nhận kết quả ngay tức thì!';
        }
      }

      setCurrentEvaluation(evaluation);
      openModal('feedback');

      // Save to submissions history (strictly preserve scores, evaluation, text; drop heavy ephemeral media)
      const cleanTask = {
        ...currentTask,
        imageUrl: (currentTask?.imageUrl && currentTask.imageUrl.startsWith('data:')) ? '' : (currentTask?.imageUrl || '')
      };

      const newSubmission = {
        id: `sub-${Date.now()}`,
        task: cleanTask,
        essayText: currentEssay,
        evaluation,
        stats: {
          wordCount,
          timeSpent: `${Math.floor(timeElapsed / 60)} phút ${timeElapsed % 60} giây`
        },
        date: new Date().toLocaleDateString('vi-VN', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      };

      setSubmissions(prev => [newSubmission, ...prev]);

      // Ephemeral media cleanup: Once task is finished/submitted, wipe any base64 image from active task to reclaim RAM & storage
      if (currentTask?.imageUrl && currentTask.imageUrl.startsWith('data:')) {
        setAllTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, imageUrl: '' } : t));
      }

      // Cloud Sync if logged in
      if (currentUser) {
        saveUserSubmission(currentUser.id, newSubmission);
      }

      // CDI Marathon Final Stage completion check
      if (marathonSession?.active && marathonSession.stage === 'writing') {
        const band = evaluation?.overallBand || evaluation?.band || '6.5';
        const finalSession = {
          ...marathonSession,
          stage: 'completed',
          writingScore: {
            band,
            submittedAt: new Date().toISOString()
          }
        };
        setMarathonSession(finalSession);
        safeSet('ielts_marathon_session', finalSession);
        alert(`🏆 XUẤT SẮC! BẠN ĐÃ HOÀN THÀNH TRỌN VẸN FULL CDI MARATHON 3 KỸ NĂNG LIÊN HOÀN!\n\n🎧 Listening: Band ${finalSession.listeningScore?.band || 'N/A'}\n📖 Reading: Band ${finalSession.readingScore?.band || 'N/A'}\n✍️ Writing: Band ${band}\n\nĐang mở Bảng điểm tổng kết TRF Simulator...`);
        openModal('mockTest');
      }

    } catch (err) {
      alert(err.message || 'Lỗi khi chấm bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export / Import All Data JSON
  const handleExportAllData = () => {
    const data = {
      allTasks,
      essays,
      outlines,
      submissions,
      readingHistory,
      listeningHistory,
      speakingHistory,
      vocabList,
      mistakes,
      personalNotes,
      streakCount,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IELTS_Mastery_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (data) => {
    if (data.allTasks) setAllTasks(data.allTasks);
    if (data.essays) setEssays(data.essays);
    if (data.outlines) setOutlines(data.outlines);
    if (data.submissions) setSubmissions(data.submissions);
    if (data.readingHistory) {
      setReadingHistory(data.readingHistory);
      try {
        localStorage.setItem('ielts_reading_submissions_history', JSON.stringify(data.readingHistory));
      } catch (e) {}
    }
    if (data.listeningHistory) {
      setListeningHistory(data.listeningHistory);
      try {
        localStorage.setItem('ielts_listening_submissions_history', JSON.stringify(data.listeningHistory));
      } catch (e) {}
    }
    if (data.speakingHistory) {
      setSpeakingHistory(data.speakingHistory);
      try {
        localStorage.setItem('ielts_speaking_submissions_history', JSON.stringify(data.speakingHistory));
      } catch (e) {}
    }
    if (data.vocabList) setVocabList(data.vocabList);
    if (data.mistakes) setMistakes(data.mistakes);
    if (data.personalNotes) setPersonalNotes(data.personalNotes);
    alert('Đã khôi phục dữ liệu thành công!');
  };

  const handleClearAllLocalData = () => {
    localStorage.clear();
    setAllTasks(INITIAL_TASKS);
    setCurrentTaskId(INITIAL_TASKS[0].id);
    setEssays({});
    setOutlines({});
    setSubmissions([]);
    setReadingHistory([]);
    setListeningHistory([]);
    setSpeakingHistory([]);
    setVocabList([]);
    setMistakes([]);
    setPersonalNotes([]);
    setApiKey('');
    clearSubmissionsTwoTier('ielts_submissions_history');
    clearSubmissionsTwoTier('ielts_reading_submissions_history');
    clearSubmissionsTwoTier('ielts_listening_submissions_history');
    clearSubmissionsTwoTier('ielts_speaking_submissions_history');
    alert('Đã khôi phục toàn bộ cài đặt gốc.');
  };

  const handleDeleteWritingSubmission = (subId) => {
    setSubmissions(prev => {
      const updated = prev.filter(s => s.id !== subId);
      deleteSubmissionTwoTier('ielts_submissions_history', subId);
      return updated;
    });
    if (currentUser) {
      deleteUserSubmission(currentUser.id, subId);
    }
  };

  const handleClearWritingHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài nộp Writing? Thao tác này sẽ dọn dẹp sạch danh sách bài viết.')) return;
    setSubmissions([]);
    clearSubmissionsTwoTier('ielts_submissions_history');
  };

  const handleDeleteReadingSubmission = (subId) => {
    setReadingHistory(prev => {
      const updated = prev.filter(r => r.id !== subId);
      deleteSubmissionTwoTier('ielts_reading_submissions_history', subId);
      return updated;
    });
  };

  const handleClearReadingHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài thi Reading? Thao tác này sẽ dọn dẹp sạch danh sách bài đọc.')) return;
    setReadingHistory([]);
    clearSubmissionsTwoTier('ielts_reading_submissions_history');
  };

  const handleDeleteListeningSubmission = (subId) => {
    setListeningHistory(prev => {
      const updated = prev.filter(r => r.id !== subId);
      deleteSubmissionTwoTier('ielts_listening_submissions_history', subId);
      return updated;
    });
  };

  const handleClearListeningHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài thi Listening? Thao tác này sẽ dọn dẹp sạch danh sách bài nghe.')) return;
    setListeningHistory([]);
    clearSubmissionsTwoTier('ielts_listening_submissions_history');
  };

  const handleDeleteSpeakingSubmission = (subId) => {
    setSpeakingHistory(prev => {
      const updated = prev.filter(r => r.id !== subId);
      deleteSubmissionTwoTier('ielts_speaking_submissions_history', subId);
      return updated;
    });
  };

  const handleClearSpeakingHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài thi Speaking? Thao tác này sẽ dọn dẹp sạch danh sách bài nói.')) return;
    setSpeakingHistory([]);
    clearSubmissionsTwoTier('ielts_speaking_submissions_history');
  };

  const handleClearAllHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa TOÀN BỘ lịch sử của cả 4 kỹ năng (Writing, Reading, Listening, Speaking)? Thao tác này sẽ dọn dẹp sạch sẽ toàn bộ bài làm.')) return;
    setSubmissions([]);
    setReadingHistory([]);
    setListeningHistory([]);
    setSpeakingHistory([]);
    clearSubmissionsTwoTier('ielts_submissions_history');
    clearSubmissionsTwoTier('ielts_reading_submissions_history');
    clearSubmissionsTwoTier('ielts_listening_submissions_history');
    clearSubmissionsTwoTier('ielts_speaking_submissions_history');
  };

  return (
    <div 
      data-cdi-font={cdiFontSize}
      data-cdi-contrast={cdiContrast}
      className={`${(activeSkill === 'reading' || activeSkill === 'listening' || isFocusMode) ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh] md:h-[100dvh] md:overflow-hidden'} flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 relative overflow-x-hidden w-full max-w-full`}>
      
      {/* Focus Mode Floating Exit Pill */}
      {isFocusMode && (
        <div className="fixed top-3 right-4 z-50 flex items-center space-x-2 bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full shadow-xl border border-slate-700/80 transition-all backdrop-blur-md animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Chế độ Tập Trung</span>
          <button
            onClick={toggleFocusMode}
            className="ml-2 flex items-center space-x-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer"
            title="Thoát chế độ tập trung (Alt + F hoặc Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-slate-300" />
            <span>Thoát</span>
            <kbd className="hidden sm:inline text-[10px] text-slate-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">Alt+F</kbd>
          </button>
        </div>
      )}

      {/* CDI Full Marathon Sticky Progress Banner */}
      {marathonSession?.active && (
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-3 sm:px-6 py-2 flex items-center justify-between text-xs border-b border-indigo-500/30 shadow-lg shrink-0 z-30 animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="font-black text-amber-400 uppercase tracking-wider text-[10px] sm:text-xs shrink-0">
              CDI Marathon:
            </span>
            <div className="flex items-center space-x-1.5 font-bold text-slate-200 truncate text-[11px] sm:text-xs">
              <span className={marathonSession.stage === 'listening' ? 'text-amber-300 underline font-black' : 'text-slate-400'}>
                1. Listening {marathonSession.listeningScore ? `(Band ${marathonSession.listeningScore.band})` : ''}
              </span>
              <span className="text-slate-500">➔</span>
              <span className={marathonSession.stage === 'reading' ? 'text-amber-300 underline font-black' : 'text-slate-400'}>
                2. Reading {marathonSession.readingScore ? `(Band ${marathonSession.readingScore.band})` : ''}
              </span>
              <span className="text-slate-500">➔</span>
              <span className={marathonSession.stage === 'writing' ? 'text-amber-300 underline font-black' : 'text-slate-400'}>
                3. Writing
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => openModal('mockTest')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              Xem TRF
            </button>
            <button
              onClick={handleCancelMarathon}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
              title="Hủy phiên thi Marathon"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* 1. Main Navigation Bar (Hidden in Focus Mode or when Workspace is Expanded via Alt+Z) */}
      {!isFocusMode && !isSlimHeader && (
        <Navbar
          currentTask={currentTask}
          allTasks={allTasks}
          onSelectTask={(t) => setCurrentTaskId(t.id)}
          mode={mode}
          setMode={setMode}
          streakCount={streakCount}
          onOpenVocabGrammar={() => openModal('vocabGrammar')}
          onOpenDrills={() => openModal('drills')}
          onOpenWeeklyReport={() => openModal('weeklyReport')}
          onOpenMockTest={() => openModal('mockTest')}
          onOpenDiagnostic={() => openModal('diagnostic')}
          onOpenIngest={() => {
            if (activeSkill === 'reading') {
              setReadingIngestTrigger(Date.now());
            } else {
              openModal('ingest');
            }
          }}
          onOpenGenerator={() => {
            if (activeSkill === 'reading') {
              setReadingGenTrigger(Date.now());
            } else if (activeSkill === 'listening') {
              setListeningGenTrigger(Date.now());
            } else if (activeSkill === 'speaking') {
              setSpeakingGenTrigger(Date.now());
            } else {
              openModal('generator');
            }
          }}
          onOpenLibrary={() => {
            if (activeSkill === 'reading') {
              setReadingLibraryTrigger(Date.now());
            } else if (activeSkill === 'listening') {
              setListeningLibraryTrigger(Date.now());
            } else if (activeSkill === 'speaking') {
              setSpeakingLibraryTrigger(Date.now());
            } else {
              openModal('library');
            }
          }}
          onOpenNotebook={() => openModal('notebook')}
          onOpenHistory={() => openModal('history')}
          onOpenSettings={() => openModal('settings')}
          onOpenTheory={() => openModal('theory')}
          onOpenMistakeLog={() => openModal('mistakeLog')}
          onOpenFeaturesGuide={() => openModal('featuresGuide')}
          onOpenProfile={() => openModal('profile')}
          onOpenContact={() => openModal('contact')}
          activeSkill={activeSkill}
          onSelectSkill={(skill) => setActiveSkill(skill)}
          mistakesCount={mistakes.length}
          targetBand={targetBand}
          onOpenOnboarding={() => openModal('onboarding')}
          apiKey={apiKey}
          user={currentUser}
          onOpenAuth={() => openModal('auth')}
          onOpenCDIDisplay={() => openModal('cdiDisplay')}
        />
      )}

      {/* 1.5 Global Gemini API Key Reminder Banner (Dismissible & Hidden in Focus Mode) */}
      {!isFocusMode && !apiKey && !isApiKeyBannerDismissed && (
        <div className={`bg-amber-50/95 border-b border-amber-200/90 text-amber-950 px-3 sm:px-6 transition-all duration-300 shadow-2xs shrink-0 z-20 flex items-center justify-between gap-2.5 ${
          isSlimHeader ? 'py-1 text-xs' : 'py-1.5'
        }`}>
          {isSlimHeader ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-semibold text-amber-900 truncate">
                  ⚡ Chưa kết nối AI API Key (AI Chấm bài, Tra từ & Sinh đề đang chạy chế độ offline)
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => openModal('settings')}
                  className="px-2.5 py-0.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                >
                  Kết Nối
                </button>
                <button
                  onClick={() => {
                    setIsApiKeyBannerDismissed(true);
                    safeSet('ielts_dismiss_api_banner', true);
                  }}
                  className="p-1 rounded-md text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Ẩn thông báo"
                  aria-label="Ẩn thông báo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-1 rounded-lg bg-amber-100 text-amber-700 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-amber-900 leading-tight min-w-0">
                  <span className="font-extrabold text-amber-800 uppercase tracking-wider mr-1.5 text-[10px] sm:text-xs">
                    LƯU Ý KẾT NỐI AI:
                  </span>
                  <span className="hidden sm:inline font-medium text-amber-900">
                    Bạn cần <button onClick={() => openModal('settings')} className="underline font-bold text-amber-900 hover:text-amber-700 cursor-pointer">kết nối AI API Key</button> cá nhân (miễn phí) để sử dụng đầy đủ các tính năng AI (Chấm bài 4 tiêu chí, Tra từ & Giải thích, Examiner AI, Sinh đề).
                  </span>
                  <span className="sm:hidden font-semibold text-amber-900 truncate block text-[11px]">
                    Cần kết nối AI API Key để sử dụng tính năng AI
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                <button
                  onClick={() => openModal('settings')}
                  className="px-2.5 sm:px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 shrink-0 flex items-center space-x-1 cursor-pointer"
                >
                  <span className="text-amber-200">⚡</span>
                  <span>Kết Nối Ngay</span>
                </button>
                <button
                  onClick={() => {
                    setIsApiKeyBannerDismissed(true);
                    safeSet('ielts_dismiss_api_banner', true);
                  }}
                  className="p-1 sm:p-1.5 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Ẩn thông báo này"
                  aria-label="Ẩn thông báo"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Workspace Conditional Rendering based on activeSkill */}
      {activeSkill === 'reading' ? (
        <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
          <WorkspaceErrorBoundary skillName="IELTS Reading">
            <React.Suspense fallback={
              <div className="flex-1 flex items-center justify-center p-12 text-slate-500 font-bold text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
                  <span>Đang tải phân hệ IELTS Reading Studio...</span>
                </div>
              </div>
            }>
              <ReadingWorkspace
                apiKey={apiKey}
                model={model}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenTheory={() => setIsTheoryOpen(true)}
                user={currentUser}
                onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
                onReadingSubmitted={(sub) => {
                  setReadingHistory(prev => {
                    const updated = [sub, ...prev];
                    safeSet('ielts_reading_submissions_history', updated);
                    return updated;
                  });

                  if (marathonSession?.active && marathonSession.stage === 'reading') {
                    const band = sub?.overallBand || sub?.band || '6.5';
                    const updatedSession = {
                      ...marathonSession,
                      stage: 'writing',
                      readingScore: {
                        band,
                        correctCount: sub?.correctAnswers || sub?.correctCount || 0,
                        totalQuestions: sub?.totalQuestions || 40,
                        submittedAt: new Date().toISOString()
                      }
                    };
                    setMarathonSession(updatedSession);
                    safeSet('ielts_marathon_session', updatedSession);
                    alert(`🎉 CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH CHẶNG 2: READING (Band ${band})!\n\nHệ thống đang chuyển tiếp bạn sang Chặng 3: IELTS Writing (Task 1 & Task 2 - 60 phút).\nHãy hoàn thành nốt chặng cuối để nhận Bảng điểm Marathon TRF!`);
                    setActiveSkill('writing');
                  }
                }}
                initialTestId={readingMockTestId}
                initialExamMode={readingMockExamMode}
                openGeneratorTrigger={readingGenTrigger}
                openIngestTrigger={readingIngestTrigger}
                openLibraryTrigger={readingLibraryTrigger}
                masteredIds={masteredIds}
                onToggleMastered={handleToggleMastered}
                isSlimHeader={isSlimHeader}
                toggleSlimHeader={toggleSlimHeader}
              />
            </React.Suspense>
          </WorkspaceErrorBoundary>
        </div>
      ) : activeSkill === 'listening' ? (
        <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
          <WorkspaceErrorBoundary skillName="IELTS Listening">
            <React.Suspense fallback={
              <div className="flex-1 flex items-center justify-center p-12 text-slate-500 font-bold text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping" />
                  <span>Đang tải phân hệ IELTS Listening Studio...</span>
                </div>
              </div>
            }>
              <ListeningWorkspace
                apiKey={apiKey}
                model={model}
                onOpenSettings={() => openModal('settings')}
                onOpenTheory={() => openModal('theory')}
                user={currentUser}
                onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
                onOpenDrills={() => openModal('drills')}
                onListeningSubmitted={(sub) => {
                  setListeningHistory(prev => {
                    const updated = [sub, ...prev];
                    safeSet('ielts_listening_submissions_history', updated);
                    return updated;
                  });

                  if (marathonSession?.active && marathonSession.stage === 'listening') {
                    const band = sub?.overallBand || sub?.band || '6.5';
                    const updatedSession = {
                      ...marathonSession,
                      stage: 'reading',
                      listeningScore: {
                        band,
                        correctCount: sub?.correctAnswers || sub?.correctCount || 0,
                        totalQuestions: sub?.totalQuestions || 40,
                        submittedAt: new Date().toISOString()
                      }
                    };
                    setMarathonSession(updatedSession);
                    safeSet('ielts_marathon_session', updatedSession);
                    alert(`🎉 CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH CHẶNG 1: LISTENING (Band ${band})!\n\nHệ thống đang chuyển bạn sang Chặng 2: IELTS Reading (Thời lượng 60 phút).\nHãy sẵn sàng làm bài!`);
                    setActiveSkill('reading');
                  }
                }}
                openGeneratorTrigger={listeningGenTrigger}
                openLibraryTrigger={listeningLibraryTrigger}
                masteredIds={masteredIds}
                onToggleMastered={handleToggleMastered}
                isSlimHeader={isSlimHeader}
                toggleSlimHeader={toggleSlimHeader}
              />
            </React.Suspense>
          </WorkspaceErrorBoundary>
        </div>
      ) : activeSkill === 'speaking' ? (
        <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
          <WorkspaceErrorBoundary skillName="IELTS Speaking">
            <React.Suspense fallback={
              <div className="flex-1 flex items-center justify-center p-12 text-slate-400 font-bold text-sm bg-slate-950">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-purple-600 animate-ping" />
                  <span>Đang tải phân hệ IELTS Speaking Studio...</span>
                </div>
              </div>
            }>
              <SpeakingWorkspace
                apiKey={apiKey}
                model={model}
                onOpenSettings={() => openModal('settings')}
                user={currentUser}
                onOpenTheory={() => openModal('theory')}
                onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
                onSpeakingSubmitted={(sub) => {
                  setSpeakingHistory(prev => {
                    const updated = [sub, ...prev];
                    safeSet('ielts_speaking_submissions_history', updated);
                    return updated;
                  });
                }}
                openGeneratorTrigger={speakingGenTrigger}
                openLibraryTrigger={speakingLibraryTrigger}
                masteredIds={masteredIds}
                onToggleMastered={handleToggleMastered}
                isSlimHeader={isSlimHeader}
                toggleSlimHeader={toggleSlimHeader}
              />
            </React.Suspense>
          </WorkspaceErrorBoundary>
        </div>
      ) : (
        <WorkspaceErrorBoundary skillName="IELTS Writing" emergencyData={essays[currentTaskId] || ''}>
          <WritingWorkspace
            currentTask={currentTask}
            currentEssay={currentEssay}
            essayText={currentEssay}
            onEssayChange={handleEssayChange}
            currentOutline={currentOutline}
            onOutlineChange={handleOutlineChange}
            mode={mode}
            apiKey={apiKey}
            model={model}
            timeElapsed={timeElapsed}
            timeRemaining={timeRemaining}
            isTimerRunning={isTimerRunning}
            onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
            onResetTimer={() => {
              setTimeRemaining((currentTask?.timeLimit || 40) * 60);
              setTimeElapsed(0);
              setIsTimerRunning(false);
            }}
            isSubmitting={isSubmitting}
            onSubmitEssay={handleSubmitEssay}
            lastSaved={lastSaved}
            streakCount={streakCount}
            targetBand={targetBand}
            masteredIds={masteredIds}
            onToggleMastered={handleToggleMastered}
            onOpenLibrary={() => openModal('library')}
            onOpenGenerator={() => openModal('generator')}
            onOpenOnboarding={() => openModal('onboarding')}
            onOpenTheory={() => openModal('theory')}
            onOpenMistakeLog={() => openModal('mistakeLog')}
            onOpenPrescription={() => openModal('prescription')}
            onOpenShortcuts={() => openModal('shortcuts')}
            onOpenCDIDisplay={() => openModal('cdiDisplay')}
            onOpenIdeaMatrix={() => openModal('ideaMatrix')}
            onOpenSettings={() => openModal('settings')}
            mistakes={mistakes}
            isFocusMode={isFocusMode}
            toggleFocusMode={toggleFocusMode}
            weeklyWordProgress={weeklyWordProgress}
            currentWeekWords={currentWeekWords}
            weeklyWordTarget={weeklyWordTarget}
            cdiFontSize={cdiFontSize}
            cdiContrast={cdiContrast}
            isSlimHeader={isSlimHeader}
            toggleSlimHeader={toggleSlimHeader}
            setIsSlimHeader={setIsSlimHeader}
            vocabList={vocabList}
            onAddVocab={(v) => {
              setVocabList(prev => [v, ...prev]);
              if (currentUser) saveUserVocabItem(currentUser.id, v);
            }}
            currentUser={currentUser}
          />
        </WorkspaceErrorBoundary>
      )}

      {/* 3. Centralized Modals System (Grouped into Exam, Learning, and System Clusters) */}
      <AppModalHost
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
        targetBand={targetBand}
        setTargetBand={setTargetBand}
        activeSkill={activeSkill}
        setActiveSkill={setActiveSkill}
        masteredIds={masteredIds}
        onToggleMastered={handleToggleMastered}
        currentTask={currentTask}
        currentTaskId={currentTaskId}
        setCurrentTaskId={setCurrentTaskId}
        allTasks={allTasks}
        setAllTasks={setAllTasks}
        communityTasks={communityTasks}
        setCommunityTasks={setCommunityTasks}
        currentEssay={currentEssay}
        currentOutline={currentOutline}
        setOutlines={setOutlines}
        timeElapsed={timeElapsed}
        isSubmitting={isSubmitting}
        currentEvaluation={currentEvaluation}
        setCurrentEvaluation={setCurrentEvaluation}
        onSubmitEssay={handleSubmitEssay}
        submissions={submissions}
        setSubmissions={setSubmissions}
        readingHistory={readingHistory}
        listeningHistory={listeningHistory}
        speakingHistory={speakingHistory}
        selectedHistorySpeakingSub={selectedHistorySpeakingSub}
        setSelectedHistorySpeakingSub={setSelectedHistorySpeakingSub}
        onDeleteWritingSubmission={handleDeleteWritingSubmission}
        onClearWritingHistory={handleClearWritingHistory}
        onDeleteReadingSubmission={handleDeleteReadingSubmission}
        onClearReadingHistory={handleClearReadingHistory}
        onDeleteListeningSubmission={handleDeleteListeningSubmission}
        onClearListeningHistory={handleClearListeningHistory}
        onDeleteSpeakingSubmission={handleDeleteSpeakingSubmission}
        onClearSpeakingHistory={handleClearSpeakingHistory}
        onClearAllHistory={handleClearAllHistory}
        vocabList={vocabList}
        setVocabList={setVocabList}
        mistakes={mistakes}
        setMistakes={setMistakes}
        personalNotes={personalNotes}
        setPersonalNotes={setPersonalNotes}
        streakCount={streakCount}
        setStreakCount={setStreakCount}
        marathonSession={marathonSession}
        onStartMarathon={handleStartMarathon}
        onCancelMarathon={handleCancelMarathon}
        onStartReadingMockExam={handleStartReadingMockExam}
        cdiFontSize={cdiFontSize}
        onChangeCdiFontSize={handleChangeCdiFontSize}
        cdiContrast={cdiContrast}
        onChangeCdiContrast={handleChangeCdiContrast}
        onResetCDIDisplay={handleResetCDIDisplay}
        onAddNewCustomTask={(newTask, isPub) => {
          setAllTasks(prev => {
            const combined = [newTask, ...prev];
            const { cleanedTasks } = deduplicateWritingTasks(combined, 0.75);
            return cleanedTasks;
          });
          setCurrentTaskId(newTask.id);

          if (isPub) {
            const pubTask = {
              ...newTask,
              isPublic: true,
              isCommunity: true,
              creatorEmail: currentUser?.email || 'Thành viên cộng đồng'
            };
            setCommunityTasks(prev => [pubTask, ...prev.filter(t => t.id !== newTask.id)]);
          }

          saveUserCustomTask(currentUser?.id || null, newTask, isPub, currentUser?.email || 'Khách');
          try {
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_tasks_realtime');
              bc.postMessage({ type: 'ADD_TASK', task: newTask, isPublic: Boolean(isPub) });
              bc.close();
            }
          } catch (e) {}
        }}
        onTogglePublic={(taskId, isPub) => {
          setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, isPublic: isPub } : t));
          if (isPub) {
            const taskToShare = allTasks.find(t => t.id === taskId);
            if (taskToShare) {
              const pubTask = {
                ...taskToShare,
                isPublic: true,
                creatorEmail: currentUser?.email || 'Thành viên cộng đồng',
                isCommunity: true
              };
              setCommunityTasks(prev => [pubTask, ...prev.filter(t => t.id !== taskId)]);
            }
          } else {
            setCommunityTasks(prev => prev.filter(t => t.id !== taskId));
          }
          if (currentUser) {
            toggleTaskPublicity(currentUser.id, taskId, isPub);
          }
          try {
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_tasks_realtime');
              bc.postMessage({ type: 'TOGGLE_PUBLIC', taskId, isPublic: isPub });
              bc.close();
            }
          } catch (e) {}
        }}
        onDeleteTask={(id) => {
          setAllTasks(prev => {
            const updated = prev.filter(t => t.id !== id);
            safeSet('ielts_all_tasks', updated);
            return updated;
          });
          setCommunityTasks(prev => {
            const updated = prev.filter(t => t.id !== id);
            safeSet('ielts_public_community_tasks', updated);
            return updated;
          });
          deleteUserCustomTask(currentUser?.id || null, id);
          try {
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              const bc = new BroadcastChannel('ielts_tasks_realtime');
              bc.postMessage({ type: 'DELETE_TASK', taskId: id });
              bc.close();
            }
          } catch (e) {}
          if (currentTaskId === id) {
            setCurrentTaskId(INITIAL_TASKS[0]?.id || 't2-ai-workplace-2025');
          }
        }}
        onSaveMockResult={(res) => {
          setStreakCount(prev => prev + 1);
          setSubmissions(prev => {
            const updated = [
              {
                id: `mock-${Date.now()}`,
                task: { title: 'Full Mock Test 60 phút', taskNumber: '1 & 2' },
                essayText: 'Completed both Task 1 and Task 2',
                evaluation: { overallBand: res.finalOverall },
                stats: { wordCount: res.t1Words + res.t2Words, timeSpent: '60 phút' },
                date: res.date
              },
              ...prev
            ];
            safeSet('ielts_submissions_history', updated);
            return updated;
          });
        }}
        onSaveV2Submission={(v2Sub) => {
          setSubmissions(prev => [v2Sub, ...prev]);
          if (currentUser) {
            saveUserSubmission(currentUser.id, v2Sub);
          }
        }}
        onTaskImported={(newTask) => {
          setAllTasks(prev => [newTask, ...prev]);
          setCurrentTaskId(newTask.id);
          if (currentUser) {
            saveUserCustomTask(currentUser.id, newTask, false, currentUser.email);
          }
        }}
        onSaveUserVocab={(v) => {
          if (currentUser) saveUserVocabItem(currentUser.id, v);
        }}
        onDeleteUserVocab={(id) => {
          if (currentUser) deleteUserVocabItem(currentUser.id, id);
        }}
        onSignOut={async () => {
          await supabase.auth.signOut();
          closeModal('profile');
        }}
        onClearAllLocalData={handleClearAllLocalData}
        onExportAllData={handleExportAllData}
        onImportData={handleImportData}
      />

    </div>
  );
}
