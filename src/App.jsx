import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Target, ChevronDown, BookOpen, GraduationCap, Maximize2, Minimize2, Keyboard, X } from 'lucide-react';
import Navbar from './components/Navbar';
import WritingWorkspace from './components/writing/WritingWorkspace';
// Lazy-loaded workspaces and modals for optimal initial bundle performance
const ReadingWorkspace = React.lazy(() => import('./components/reading/ReadingWorkspace'));
const ListeningWorkspace = React.lazy(() => import('./components/listening/ListeningWorkspace'));
const SpeakingWorkspace = React.lazy(() => import('./components/speaking/SpeakingWorkspace'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));

import AppModalHost from './components/modals/AppModalHost';
import { useStudyData } from './hooks/useStudyData';
import { useCloudAndStorageSync } from './hooks/useCloudAndStorageSync';
import { useSubmissionAndTaskActions } from './hooks/useSubmissionAndTaskActions';
import WorkspaceErrorBoundary from './components/common/WorkspaceErrorBoundary';
import { useModalStore } from './core/modalStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { safeGet, safeSet, safeRemove } from './utils/storageService';
import { initTheme } from './utils/themeService';
import { supabase } from './services/supabaseClient';
import {
  saveUserSubmission,
  saveUserVocabItem,
  deleteUserVocabItem,
  deleteUserCustomTask
} from './services/dataSyncService';

import { INITIAL_TASKS } from './data/sampleTasks';
import { countWords } from './utils/textAnalytics';
import { setCdiFontSize as setCdiFontSizeInStore, setCdiContrast as setCdiContrastInStore } from './core/appStore';
import { auditAndCleanWebsiteContent } from './services/deduplicationService';
import { trackSkillView } from './services/analyticsService.js';
import { useTranslation } from './i18n';
import { GITBOOK_FEATURES_BASE_URL } from './core/featureRegistry';

export default function App() {
  const { t, language } = useTranslation();
  const { modals, openModal, closeModal, toggleModal } = useModalStore();

  // 1. Persistent Storage State with Quota-Resilient Storage Service
  const [apiKey, setApiKey] = useState(() => safeGet('ielts_gemini_api_key', ''));
  const [targetBand, setTargetBand] = useState(() => safeGet('ielts_target_band', '6.5'));
  const [model, setModel] = useState(() => {
    const saved = safeGet('ielts_gemini_model', '');
    const validModels = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.1-pro-preview'];
    return (saved && validModels.includes(saved)) ? saved : 'gemini-3.6-flash';
  });
  
  // User state
  const [currentUser, setCurrentUser] = useState(null);

  // Repository Layer Integration (Step 76: Data Access Layer Architecture)
  const {
    allTasks, setAllTasks,
    communityTasks, setCommunityTasks,
    currentTaskId, setCurrentTaskId,
    essays, setEssays,
    outlines, setOutlines,
    lastSaved, setLastSaved,
    submissions, setSubmissions,
    readingHistory, setReadingHistory,
    listeningHistory, setListeningHistory,
    speakingHistory, setSpeakingHistory,
    vocabList, setVocabList,
    mistakes, setMistakes,
    personalNotes, setPersonalNotes,
    streakCount, setStreakCount,
    masteredIds, setMasteredIds
  } = useStudyData(currentUser);

  // 2. UI & Mode State
  const [activeSkill, setActiveSkill] = useState(() => safeGet('ielts_active_skill', 'writing'));
  const [mode, setMode] = useState('exam'); // 'exam' | 'practice'
  const [isApiKeyBannerDismissed, setIsApiKeyBannerDismissed] = useState(() => safeGet('ielts_dismiss_api_banner', false));
  const [isBeginnerBannerDismissed, setIsBeginnerBannerDismissed] = useState(() => safeGet('ielts_dismiss_beginner_banner', false));
  const [isAboutViewOpen, setIsAboutViewOpen] = useState(false);

  // Keep active skill in localStorage safely & track virtual pageview in GA4
  useEffect(() => {
    safeSet('ielts_active_skill', activeSkill);
    trackSkillView(activeSkill);
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_custom_tasks', filter: 'is_public=eq.true' }, (payload) => {
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
            const isNonWritingRow = (row?.entity_type && row.entity_type !== 'writing_task') || (row?.id && (
              row.id.startsWith('custom-drill-') ||
              row.id.startsWith('drill-') ||
              row.id.startsWith('comm-drill-') ||
              row.id.startsWith('ai-sp-') ||
              row.id.startsWith('ai-gr-') ||
              row.id.startsWith('ai-card-') ||
              row.id.startsWith('arena-score-')
            ));
            if (row && row.is_public && !isNonWritingRow && (!row.task_data || (!row.task_data.isDrill && row.task_data.type !== 'arena_leaderboard_entry'))) {
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

  // Workspace Trigger States
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

  // Cloud Sync, Supabase Auth, Two-Tier IndexedDB Hydration & LocalStorage Persistence Hook
  useCloudAndStorageSync({
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
  });

  // Submission History, Custom Task Management & Backup Import/Export Actions Hook
  const {
    handleToggleMastered,
    handleExportAllData,
    handleImportData,
    handleClearAllLocalData,
    handleDeleteWritingSubmission,
    handleClearWritingHistory,
    handleDeleteReadingSubmission,
    handleClearReadingHistory,
    handleDeleteListeningSubmission,
    handleClearListeningHistory,
    handleDeleteSpeakingSubmission,
    handleClearSpeakingHistory,
    handleClearAllHistory,
    handleAddNewCustomTask,
    handleTogglePublic,
    handleSaveMockResult,
    handleSaveV2Submission,
    handleTaskImported
  } = useSubmissionAndTaskActions({
    currentUser,
    allTasks,
    setAllTasks,
    setCommunityTasks,
    setCurrentTaskId,
    essays,
    setEssays,
    outlines,
    setOutlines,
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
    setMistakes,
    personalNotes,
    setPersonalNotes,
    streakCount,
    setStreakCount,
    setMasteredIds,
    setApiKey,
    openModal
  });

  // Dedicated Two-Way URL Routing & Deep-Linking for Atlas Arena (/atlas-arena & /arena)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIsArenaRoute = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      return (
        pathname === '/atlas-arena' ||
        pathname.endsWith('/atlas-arena') ||
        pathname === '/arena' ||
        pathname.endsWith('/arena') ||
        hash === '#atlas-arena' ||
        hash === '#arena' ||
        search.get('mode') === 'atlas-arena' ||
        search.get('mode') === 'arena'
      );
    };

    // 1. Direct entry check on mount (e.g. user visits domain.com/atlas-arena)
    if (checkIsArenaRoute()) {
      openModal('atlasArena');
    }

    // 2. Handle browser Back / Forward navigation (popstate & hashchange)
    const handleLocationChange = () => {
      const isRouteMatch = checkIsArenaRoute();
      if (isRouteMatch) {
        openModal('atlasArena');
      } else {
        closeModal('atlasArena');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [openModal, closeModal]);

  // Sync address bar when modals.atlasArena opens or closes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isArenaOpen = Boolean(modals.atlasArena);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnArenaUrl =
      pathname === '/atlas-arena' ||
      pathname.endsWith('/atlas-arena') ||
      pathname === '/arena' ||
      pathname.endsWith('/arena') ||
      hash === '#atlas-arena' ||
      hash === '#arena';

    if (isArenaOpen && !isCurrentlyOnArenaUrl) {
      try {
        window.history.pushState({ modal: 'atlasArena' }, '', '/atlas-arena');
      } catch (e) {
        window.location.hash = 'atlas-arena';
      }
    } else if (!isArenaOpen && isCurrentlyOnArenaUrl) {
      try {
        if (hash === '#atlas-arena' || hash === '#arena') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.atlasArena]);

  // Dedicated Two-Way URL Routing & Deep-Linking for About Page (/about & /gioi-thieu)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIsAboutRoute = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      return (
        pathname === '/about' ||
        pathname.endsWith('/about') ||
        pathname === '/gioi-thieu' ||
        pathname.endsWith('/gioi-thieu') ||
        hash === '#about' ||
        hash === '#gioi-thieu' ||
        search.get('page') === 'about' ||
        search.get('view') === 'about'
      );
    };

    // 1. Direct entry check on mount (e.g. user visits domain.com/about)
    if (checkIsAboutRoute()) {
      setIsAboutViewOpen(true);
      trackSkillView('about');
    }

    // 2. Handle browser Back / Forward navigation (popstate & hashchange)
    const handleLocationChange = () => {
      const isRouteMatch = checkIsAboutRoute();
      setIsAboutViewOpen(isRouteMatch);
      if (isRouteMatch) {
        trackSkillView('about');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Sync address bar when isAboutViewOpen toggles
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnAboutUrl =
      pathname === '/about' ||
      pathname.endsWith('/about') ||
      pathname === '/gioi-thieu' ||
      pathname.endsWith('/gioi-thieu') ||
      hash === '#about' ||
      hash === '#gioi-thieu';

    if (isAboutViewOpen && !isCurrentlyOnAboutUrl) {
      try {
        window.history.pushState({ page: 'about' }, '', '/about');
      } catch (e) {
        window.location.hash = 'about';
      }
      trackSkillView('about');
    } else if (!isAboutViewOpen && isCurrentlyOnAboutUrl) {
      try {
        if (hash === '#about' || hash === '#gioi-thieu') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [isAboutViewOpen]);

  // Dedicated Two-Way URL Routing & Deep-Linking for Micro-Drills (/micro-drills, /micro-drill, /drills)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkIsDrillsRoute = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = new URLSearchParams(window.location.search);

      const isPathMatch = (
        pathname === '/micro-drills' ||
        pathname.endsWith('/micro-drills') ||
        pathname === '/micro-drill' ||
        pathname.endsWith('/micro-drill') ||
        pathname === '/microdrills' ||
        pathname.endsWith('/microdrills') ||
        pathname === '/microdrill' ||
        pathname.endsWith('/microdrill') ||
        pathname === '/drills' ||
        pathname.endsWith('/drills') ||
        pathname === '/drill' ||
        pathname.endsWith('/drill') ||
        pathname === '/luyen-phan-xa' ||
        pathname.endsWith('/luyen-phan-xa') ||
        pathname.startsWith('/micro-drills/') ||
        pathname.startsWith('/micro-drill/') ||
        pathname.startsWith('/drills/')
      );

      const isHashMatch = (
        hash === '#micro-drills' ||
        hash === '#micro-drill' ||
        hash === '#microdrills' ||
        hash === '#microdrill' ||
        hash === '#drills' ||
        hash === '#drill' ||
        hash === '#luyen-phan-xa' ||
        hash.startsWith('#micro-drills') ||
        hash.startsWith('#drills')
      );

      const mode = search.get('mode');
      const view = search.get('view');
      const page = search.get('page');
      const modal = search.get('modal');
      const isSearchMatch = (
        mode === 'drills' || mode === 'micro-drills' || mode === 'micro-drill' || mode === 'microdrills' ||
        view === 'drills' || view === 'micro-drills' || view === 'micro-drill' || view === 'microdrills' ||
        page === 'drills' || page === 'micro-drills' || page === 'micro-drill' ||
        modal === 'drills' || modal === 'micro-drills'
      );

      return isPathMatch || isHashMatch || isSearchMatch;
    };

    const extractDrillParams = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const search = new URLSearchParams(window.location.search);
      let room = search.get('room') || search.get('skill');
      let tab = search.get('tab');
      let drillId = search.get('drill') || search.get('id') || search.get('drillid');

      // Check subpath e.g. /micro-drills/reading or /micro-drills/listening
      const subpathMatch = pathname.match(/\/(?:micro-drills|micro-drill|drills|drill)\/([a-z0-9_-]+)/i);
      if (subpathMatch && subpathMatch[1]) {
        const sub = subpathMatch[1].toLowerCase();
        if (['general', 'writing', 'reading', 'listening', 'speaking'].includes(sub)) {
          room = sub;
        }
      }

      return { room, tab, drillId };
    };

    // 1. Direct entry check on mount (e.g. user visits domain.com/micro-drills)
    if (checkIsDrillsRoute()) {
      const { room, tab, drillId } = extractDrillParams();
      openModal('drills', { room, tab, drillId });
    }

    // 2. Handle browser Back / Forward navigation (popstate & hashchange)
    const handleLocationChange = () => {
      const isRouteMatch = checkIsDrillsRoute();
      if (isRouteMatch) {
        const { room, tab, drillId } = extractDrillParams();
        openModal('drills', { room, tab, drillId });
      } else {
        closeModal('drills');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [openModal, closeModal]);

  // Sync address bar when modals.drills opens or closes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDrillsOpen = Boolean(modals.drills);
    const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const hash = window.location.hash.toLowerCase();
    const isCurrentlyOnDrillsUrl = (
      pathname === '/micro-drills' ||
      pathname.endsWith('/micro-drills') ||
      pathname === '/micro-drill' ||
      pathname.endsWith('/micro-drill') ||
      pathname === '/microdrills' ||
      pathname.endsWith('/microdrills') ||
      pathname === '/microdrill' ||
      pathname.endsWith('/microdrill') ||
      pathname === '/drills' ||
      pathname.endsWith('/drills') ||
      pathname === '/drill' ||
      pathname.endsWith('/drill') ||
      pathname === '/luyen-phan-xa' ||
      pathname.endsWith('/luyen-phan-xa') ||
      pathname.startsWith('/micro-drills/') ||
      pathname.startsWith('/micro-drill/') ||
      pathname.startsWith('/drills/') ||
      hash === '#micro-drills' ||
      hash === '#micro-drill' ||
      hash === '#microdrills' ||
      hash === '#microdrill' ||
      hash === '#drills' ||
      hash === '#drill' ||
      hash === '#luyen-phan-xa' ||
      hash.startsWith('#micro-drills') ||
      hash.startsWith('#drills')
    );

    if (isDrillsOpen && !isCurrentlyOnDrillsUrl) {
      try {
        const drillsPayload = typeof modals.drills === 'object' && modals.drills !== null ? modals.drills : null;
        const targetUrl = drillsPayload?.room 
          ? `/micro-drills?room=${drillsPayload.room}` 
          : '/micro-drills';
        window.history.pushState({ modal: 'drills' }, '', targetUrl);
      } catch (e) {
        window.location.hash = 'micro-drills';
      }
    } else if (!isDrillsOpen && isCurrentlyOnDrillsUrl) {
      try {
        if (hash.startsWith('#micro-drill') || hash.startsWith('#drills') || hash === '#drill' || hash === '#luyen-phan-xa') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', '/');
        }
      } catch (e) {
        window.history.replaceState(null, '', '/');
      }
    }
  }, [modals.drills]);

  // 5. Automated Content Deduplication & Sanitization & Theme init on startup
  useEffect(() => {
    initTheme();
    const idleTimer = setTimeout(() => {
      try {
        const report = auditAndCleanWebsiteContent(0.75);
        if (report.hasDuplicates) {
          console.log(`[IELTS Deduplication] Auto-cleaned ${report.totalRemoved} duplicate AI prompts across storage.`, report);
        }
      } catch (err) {
        console.warn('Auto deduplication audit notice:', err);
      }
    }, 1200);
    return () => clearTimeout(idleTimer);
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
        // Fast offline deterministic Cambridge grading (loaded on-demand)
        const [{ evaluateEssayAlgorithmically }] = await Promise.all([
          import('./services/algorithmicEvaluationService'),
          new Promise(resolve => setTimeout(resolve, 350))
        ]);
        evaluation = evaluateEssayAlgorithmically({
          task: currentTask,
          essayText: currentEssay
        });
      } else {
        // AI In-depth Grading with Gemini (loaded on-demand)
        try {
          const { evaluateEssay } = await import('./services/geminiService');
          evaluation = await evaluateEssay({
            task: currentTask,
            essayText: currentEssay,
            apiKey,
            model,
            language
          });
          evaluation.evaluationMethod = 'ai';
          evaluation.engineName = language === 'en' ? `AI Examiner (${model})` : `Trí Tuệ Nhân Tạo AI (${model})`;
        } catch (aiErr) {
          console.warn('[Evaluation Fallback] AI API encountered error, switching to Algorithmic Evaluator:', aiErr);
          // Graceful fallback to algorithmic evaluator
          const { evaluateEssayAlgorithmically } = await import('./services/algorithmicEvaluationService');
          evaluation = evaluateEssayAlgorithmically({
            task: currentTask,
            essayText: currentEssay
          });
          evaluation.fallbackNotice = language === 'en'
            ? 'AI service is temporarily busy (Quota 429). The system seamlessly evaluated your essay using the Cambridge Algorithmic Engine!'
            : 'Dịch vụ AI tạm thời quá tải hoặc chạm hạn ngạch (Quota 429). Hệ thống đã tự động chuyển sang Chế độ Chấm Bằng Máy để bạn nhận kết quả ngay tức thì!';
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

  return (
    <div 
      data-cdi-font={cdiFontSize}
      data-cdi-contrast={cdiContrast}
      className={`${isAboutViewOpen ? 'min-h-[100dvh] overflow-y-auto' : (activeSkill === 'reading' || activeSkill === 'listening' || activeSkill === 'speaking' || isFocusMode) ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh] md:h-[100dvh] md:overflow-hidden'} flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 relative overflow-x-hidden w-full max-w-full`}>
      
      {isAboutViewOpen ? (
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center p-12 text-slate-500 font-bold text-sm bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 animate-ping" />
              <span>{language === 'en' ? 'Loading About page...' : 'Đang tải trang giới thiệu...'}</span>
            </div>
          </div>
        }>
          <AboutPage
            onStartPractice={() => {
              setIsAboutViewOpen(false);
            }}
            onSelectSkill={(skill) => {
              setActiveSkill(skill);
              setIsAboutViewOpen(false);
            }}
            onOpenArena={() => {
              openModal('atlasArena');
            }}
            onOpenGitBook={() => {
              window.open(GITBOOK_FEATURES_BASE_URL, '_blank');
            }}
          />
        </React.Suspense>
      ) : (
        <>
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
          onOpenAbout={() => setIsAboutViewOpen(true)}
        />
      )}

      {/* 1.5 Global Gemini API Key Reminder Banner (Ultra-slim, Peaceful & Dismissible) */}
      {!isFocusMode && !apiKey && !isApiKeyBannerDismissed && (
        <div className="bg-amber-50/90 border-b border-amber-200/80 text-amber-950 px-3 sm:px-6 py-1 text-xs transition-all duration-300 shadow-2xs shrink-0 z-20 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <div className="text-[11px] sm:text-xs text-amber-900 leading-tight min-w-0 truncate">
              <span className="font-bold text-amber-800 mr-1.5">
                {language === 'en' ? 'Tip:' : 'Gợi ý:'}
              </span>
              <span className="font-medium text-amber-900">
                {language === 'en' 
                  ? 'You can practice and grade essays instantly. Connect free AI API Key for deep 4-criteria feedback.' 
                  : 'Bạn có thể làm bài và chấm điểm ngay. Kết nối AI API Key (miễn phí) để mở khóa nhận xét 4 tiêu chí.'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => openModal('settings')}
              className="px-2.5 py-0.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-2xs transition-all active:scale-95 shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <span>{language === 'en' ? 'Connect AI' : 'Kết Nối AI'}</span>
            </button>
            <button
              onClick={() => {
                setIsApiKeyBannerDismissed(true);
                safeSet('ielts_dismiss_api_banner', true);
              }}
              className="p-1 rounded-md text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
              title={language === 'en' ? 'Dismiss' : 'Ẩn thông báo'}
              aria-label={language === 'en' ? 'Dismiss' : 'Ẩn thông báo'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1.6 Global Beginner & Zero-Overwhelm Guidance Banner (Slim & Dismissible - Secondary to API banner on phone to avoid clutter) */}
      {!isFocusMode && !isBeginnerBannerDismissed && (
        <div className={`bg-emerald-50/95 border-b border-emerald-200/90 text-emerald-950 px-3 sm:px-6 py-1.5 text-xs transition-all duration-300 shadow-2xs shrink-0 z-20 flex items-center justify-between gap-2 ${(!apiKey && !isApiKeyBannerDismissed) ? 'hidden sm:flex' : ''}`}>
          <div className="flex items-center space-x-2 min-w-0">
            <span className="text-base shrink-0 leading-none">🌱</span>
            <div className="text-[11px] sm:text-xs text-emerald-900 leading-tight min-w-0 truncate">
              <span className="font-extrabold text-emerald-800 mr-1.5">
                {language === 'en' ? 'New to IELTS?' : 'Chưa có nền tảng vững?'}
              </span>
              <span className="font-medium text-emerald-950">
                {language === 'en'
                  ? 'Feeling overwhelmed? Follow the 4-step gentle path with 90s games & 3-min micro-drills!'
                  : 'Đừng lo nếu thấy hơi ngợp! Bạn không cần viết ngay 250 từ. Hãy bắt đầu với game 90s Arena & luyện câu 3 phút.'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => openModal('beginnerGuide')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-all active:scale-95 shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <span>{language === 'en' ? 'Quick Guide' : 'Xem Lộ Trình'}</span>
            </button>
            <button
              onClick={() => {
                setIsBeginnerBannerDismissed(true);
                safeSet('ielts_dismiss_beginner_banner', true);
              }}
              className="p-1 rounded-md text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 transition-colors cursor-pointer"
              title={language === 'en' ? 'Dismiss' : 'Ẩn thông báo'}
              aria-label={language === 'en' ? 'Dismiss' : 'Ẩn thông báo'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
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
                onOpenSettings={() => openModal('settings')}
                onOpenTheory={(opts) => openModal('theory', { skill: 'reading', ...(typeof opts === 'object' ? opts : {}) })}
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
                onOpenTheory={(opts) => openModal('theory', { skill: 'listening', ...(typeof opts === 'object' ? opts : {}) })}
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
                onOpenTheory={(opts) => openModal('theory', { skill: 'speaking', ...(typeof opts === 'object' ? opts : {}) })}
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
            allTasks={allTasks}
            submissions={submissions}
            onSelectTask={(t) => setCurrentTaskId(t.id)}
            onOpenModal={(modal) => openModal(modal)}
          />
        </WorkspaceErrorBoundary>
      )}
        </>
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
        onAddNewCustomTask={handleAddNewCustomTask}
        onTogglePublic={handleTogglePublic}
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
        onSaveMockResult={handleSaveMockResult}
        onSaveV2Submission={handleSaveV2Submission}
        onTaskImported={handleTaskImported}
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
