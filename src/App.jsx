import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Target, ChevronDown, BookOpen, GraduationCap, Maximize2, Minimize2, Keyboard } from 'lucide-react';
import Navbar from './components/Navbar';
import SplitPane from './components/SplitPane';
import PromptPane from './components/PromptPane';
import EditorPane from './components/EditorPane';
import TimerBar from './components/TimerBar';
import WritingSubHeaderToolbar from './components/WritingSubHeaderToolbar';
// Lazy-loaded workspaces and modals for optimal initial bundle performance
const ReadingWorkspace = React.lazy(() => import('./components/reading/ReadingWorkspace'));
const ListeningWorkspace = React.lazy(() => import('./components/listening/ListeningWorkspace'));
const SpeakingWorkspace = React.lazy(() => import('./components/speaking/SpeakingWorkspace'));

const KeyboardShortcutsModal = React.lazy(() => import('./components/KeyboardShortcutsModal'));
const FeedbackModal = React.lazy(() => import('./components/FeedbackModal'));
const TaskGeneratorModal = React.lazy(() => import('./components/TaskGeneratorModal'));
const TaskLibraryModal = React.lazy(() => import('./components/TaskLibraryModal'));
const VocabNotebookModal = React.lazy(() => import('./components/VocabNotebookModal'));
const MistakeLogModal = React.lazy(() => import('./components/MistakeLogModal'));
const HistoryModal = React.lazy(() => import('./components/HistoryModal'));
const TheoryHandbookModal = React.lazy(() => import('./components/TheoryHandbookModal'));
const QuickParaphraseModal = React.lazy(() => import('./components/QuickParaphraseModal'));
const SettingsModal = React.lazy(() => import('./components/SettingsModal'));
const MicroDrillsModal = React.lazy(() => import('./components/MicroDrillsModal'));
const IdeaMatrixModal = React.lazy(() => import('./components/IdeaMatrixModal'));
const RevisionModal = React.lazy(() => import('./components/RevisionModal'));
const WeeklyReportModal = React.lazy(() => import('./components/WeeklyReportModal'));
const DocumentIngestModal = React.lazy(() => import('./components/DocumentIngestModal'));
const MockTestModal = React.lazy(() => import('./components/MockTestModal'));
const VocabGrammarSpellingModal = React.lazy(() => import('./components/VocabGrammarSpellingModal'));
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const FeaturesGuideModal = React.lazy(() => import('./components/FeaturesGuideModal'));
const UserProfileModal = React.lazy(() => import('./components/UserProfileModal'));
const ContactModal = React.lazy(() => import('./components/ContactModal'));
const AIEvaluationProgressModal = React.lazy(() => import('./components/AIEvaluationProgressModal'));
const OnboardingModal = React.lazy(() => import('./components/OnboardingModal'));
const SpeakingResultModal = React.lazy(() => import('./components/speaking/SpeakingResultModal'));
const SlideOverToolPanel = React.lazy(() => import('./components/SlideOverToolPanel'));
const DiagnosticPlacementModal = React.lazy(() => import('./components/DiagnosticPlacementModal'));
const CDIDisplayModal = React.lazy(() => import('./components/CDIDisplayModal'));
const DailyErrorPrescriptionModal = React.lazy(() => import('./components/DailyErrorPrescriptionModal'));
const GrowthAnalyticsModal = React.lazy(() => import('./components/GrowthAnalyticsModal'));
import WorkspaceErrorBoundary from './components/common/WorkspaceErrorBoundary';
import { useModalStore } from './core/modalStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { safeGet, safeSet, safeRemove } from './utils/storageService';
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
import { evaluateEssay, brainstormIdeas } from './services/geminiService';
import { evaluateEssayAlgorithmically } from './services/algorithmicEvaluationService';
import { countWords } from './utils/textAnalytics';
import { setCdiFontSize as setCdiFontSizeInStore, setCdiContrast as setCdiContrastInStore, setAppState } from './core/appStore';

export default function App() {
  const { modals, closeModal: triggerCloseModal } = useModalStore();

  // 1. Persistent Storage State with Quota-Resilient Storage Service
  const [apiKey, setApiKey] = useState(() => safeGet('ielts_gemini_api_key', ''));
  const [targetBand, setTargetBand] = useState(() => safeGet('ielts_target_band', '6.5'));
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !safeGet('ielts_user_onboarded', false));
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
      return [...saved, ...missingDefaults];
    }
    return defaults;
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

  // Keep active skill in localStorage safely
  useEffect(() => {
    safeSet('ielts_active_skill', activeSkill);
  }, [activeSkill]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [communityTasks, setCommunityTasks] = useState(() => {
    const cached = safeGet('ielts_public_community_tasks', null);
    if (Array.isArray(cached) && cached.length > 0) return cached;
    return COMMUNITY_DEFAULT_TASKS;
  });
  const [isDrillsOpen, setIsDrillsOpen] = useState(false);
  const [isVocabGrammarOpen, setIsVocabGrammarOpen] = useState(false);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isMistakeLogOpen, setIsMistakeLogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isParaphraseOpen, setIsParaphraseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIdeaMatrixOpen, setIsIdeaMatrixOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [readingGenTrigger, setReadingGenTrigger] = useState(0);
  const [readingIngestTrigger, setReadingIngestTrigger] = useState(0);
  const [listeningGenTrigger, setListeningGenTrigger] = useState(0);
  const [isMockTestOpen, setIsMockTestOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isFeaturesGuideOpen, setIsFeaturesGuideOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedHistorySpeakingSub, setSelectedHistorySpeakingSub] = useState(null);
  const [slideOverConfig, setSlideOverConfig] = useState({ isOpen: false, tab: 'paraphrase' });

  // Phase 1 UX: Focus Mode & Keyboard Shortcuts
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(() => safeGet('ielts_focus_mode', false));

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

  // Phase 4: CDI Accessibility & Display Settings (Font Scale & Screen Contrast)
  const [cdiFontSize, setCdiFontSize] = useState(() => safeGet('ielts_cdi_font_size', 'standard'));
  const [cdiContrast, setCdiContrast] = useState(() => safeGet('ielts_cdi_contrast', 'standard'));
  const [isCDIDisplayOpen, setIsCDIDisplayOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

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
    setIsMockTestOpen(false);
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
    setIsMockTestOpen(false);
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
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [brainstormResult, setBrainstormResult] = useState('');

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
    setBrainstormResult('');
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
          const localOnly = prev.filter(t => !cloudIds.has(t.id));
          return [...cloudTasks, ...localOnly];
        });
        setAllTasks(prev => {
          const existingIds = new Set(prev.map(t => t.id));
          const newCloudTasks = cloudTasks.filter(t => !existingIds.has(t.id));
          return newCloudTasks.length > 0 ? [...newCloudTasks, ...prev] : prev;
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
      setIsAuthOpen(true);
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

  // 5. Auto-save Effects with Quota-Resilient Storage Manager
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

  useEffect(() => {
    safeSet('ielts_submissions_history', submissions);
  }, [submissions]);

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

  // Global Keyboard Shortcuts (Phase 1 UX Improvement)
  useKeyboardShortcuts({
    toggleFocusMode,
    toggleSlimHeader,
    onOpenLibrary: () => setIsLibraryOpen(true),
    onToggleMastered: handleToggleMastered,
    currentTaskId,
    onOpenTheory: () => setIsTheoryOpen(true),
    onOpenHelp: () => setIsFeaturesGuideOpen(prev => !prev),
    isShortcutsOpen,
    setIsShortcutsOpen,
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

  const handleInsertSlideOverText = (text) => {
    const current = essays[currentTaskId] || '';
    const updated = current ? `${current.trim()} ${text} ` : `${text} `;
    handleEssayChange(updated);
  };

  const handleOutlineChange = (text) => {
    setOutlines(prev => ({ ...prev, [currentTaskId]: text }));
  };

  const handleBrainstorm = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    setIsBrainstorming(true);
    try {
      const res = await brainstormIdeas({
        promptText: currentTask.prompt,
        apiKey,
        model
      });
      setBrainstormResult(res);
    } catch (err) {
      alert(err.message || 'Lỗi gợi ý ý tưởng.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleSubmitEssay = async (method = 'ai') => {
    const wordCount = countWords(currentEssay);
    if (wordCount < 20) {
      alert('Vui lòng viết ít nhất 20 từ trước khi nộp bài để giám khảo chấm điểm.');
      return;
    }

    // If requesting AI grading but no API Key is configured, guide user to Settings
    if (method === 'ai' && !apiKey) {
      setIsSettingsOpen(true);
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
          evaluation.engineName = `Google Gemini (${model})`;
        } catch (aiErr) {
          console.warn('[Evaluation Fallback] Gemini API encountered error, switching to Algorithmic Evaluator:', aiErr);
          // Graceful fallback to algorithmic evaluator
          evaluation = evaluateEssayAlgorithmically({
            task: currentTask,
            essayText: currentEssay
          });
          evaluation.fallbackNotice = 'Máy chủ Google Gemini tạm thời quá tải hoặc chạm hạn ngạch (Quota 429). Hệ thống đã tự động chuyển sang Chế độ Chấm Bằng Máy để bạn nhận kết quả ngay tức thì!';
        }
      }

      setCurrentEvaluation(evaluation);
      setIsFeedbackOpen(true);

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
        setIsMockTestOpen(true);
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
    alert('Đã khôi phục toàn bộ cài đặt gốc.');
  };

  const handleDeleteWritingSubmission = (subId) => {
    setSubmissions(prev => {
      const updated = prev.filter(s => s.id !== subId);
      try {
        localStorage.setItem('ielts_submissions_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (currentUser) {
      deleteUserSubmission(currentUser.id, subId);
    }
  };

  const handleClearWritingHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài nộp Writing? Thao tác này sẽ dọn dẹp sạch danh sách bài viết.')) return;
    setSubmissions([]);
    try {
      localStorage.removeItem('ielts_submissions_history');
    } catch (e) {}
  };

  const handleDeleteReadingSubmission = (subId) => {
    setReadingHistory(prev => {
      const updated = prev.filter(r => r.id !== subId);
      try {
        localStorage.setItem('ielts_reading_submissions_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearReadingHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài thi Reading? Thao tác này sẽ dọn dẹp sạch danh sách bài đọc.')) return;
    setReadingHistory([]);
    try {
      localStorage.removeItem('ielts_reading_submissions_history');
    } catch (e) {}
  };

  const handleDeleteListeningSubmission = (subId) => {
    setListeningHistory(prev => {
      const updated = prev.filter(r => r.id !== subId);
      try {
        localStorage.setItem('ielts_listening_submissions_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearListeningHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài thi Listening? Thao tác này sẽ dọn dẹp sạch danh sách bài nghe.')) return;
    setListeningHistory([]);
    try {
      localStorage.removeItem('ielts_listening_submissions_history');
    } catch (e) {}
  };

  const handleDeleteSpeakingSubmission = (subId) => {
    setSpeakingHistory(prev => {
      const updated = prev.filter(r => r.id !== subId);
      try {
        localStorage.setItem('ielts_speaking_submissions_history', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearSpeakingHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử bài thi Speaking? Thao tác này sẽ dọn dẹp sạch danh sách bài nói.')) return;
    setSpeakingHistory([]);
    try {
      localStorage.removeItem('ielts_speaking_submissions_history');
    } catch (e) {}
  };

  const handleClearAllHistory = () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa TOÀN BỘ lịch sử của cả 4 kỹ năng (Writing, Reading, Listening, Speaking)? Thao tác này sẽ dọn dẹp sạch sẽ toàn bộ bài làm.')) return;
    setSubmissions([]);
    setReadingHistory([]);
    setListeningHistory([]);
    setSpeakingHistory([]);
    try {
      localStorage.removeItem('ielts_submissions_history');
      localStorage.removeItem('ielts_reading_submissions_history');
      localStorage.removeItem('ielts_listening_submissions_history');
      localStorage.removeItem('ielts_speaking_submissions_history');
    } catch (e) {}
  };

  return (
    <div 
      data-cdi-font={cdiFontSize}
      data-cdi-contrast={cdiContrast}
      className={`${(activeSkill === 'reading' || activeSkill === 'listening' || isFocusMode) ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'} flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 relative`}>
      
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
              onClick={() => setIsMockTestOpen(true)}
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

      {/* 1. Main Navigation Bar (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <Navbar
          currentTask={currentTask}
          allTasks={allTasks}
          onSelectTask={(t) => setCurrentTaskId(t.id)}
          mode={mode}
          setMode={setMode}
          streakCount={streakCount}
          onOpenVocabGrammar={() => setIsVocabGrammarOpen(true)}
          onOpenDrills={() => setIsDrillsOpen(true)}
          onOpenWeeklyReport={() => setIsWeeklyReportOpen(true)}
          onOpenMockTest={() => setIsMockTestOpen(true)}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          onOpenIngest={() => {
            if (activeSkill === 'reading') {
              setReadingIngestTrigger(Date.now());
            } else {
              setIsIngestOpen(true);
            }
          }}
          onOpenGenerator={() => {
            if (activeSkill === 'reading') {
              setReadingGenTrigger(Date.now());
            } else if (activeSkill === 'listening') {
              setListeningGenTrigger(Date.now());
            } else {
              setIsGeneratorOpen(true);
            }
          }}
          onOpenLibrary={() => setIsLibraryOpen(true)}
          onOpenNotebook={() => setIsNotebookOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTheory={() => setIsTheoryOpen(true)}
          onOpenMistakeLog={() => setIsMistakeLogOpen(true)}
          onOpenFeaturesGuide={() => setIsFeaturesGuideOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          activeSkill={activeSkill}
          onSelectSkill={(skill) => setActiveSkill(skill)}
          mistakesCount={mistakes.length}
          targetBand={targetBand}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          apiKey={apiKey}
          user={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenCDIDisplay={() => setIsCDIDisplayOpen(true)}
        />
      )}

      {/* 1.5 Global Gemini API Key Reminder Banner (Hidden in Focus Mode) */}
      {!isFocusMode && !apiKey && (
        <div className={`bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-slate-950 px-3 sm:px-6 transition-all duration-300 shadow-xs shrink-0 z-20 flex items-center justify-between gap-2 ${
          isSlimHeader ? 'py-1 text-xs' : 'py-2'
        }`}>
          {isSlimHeader ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-white shrink-0 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold text-white truncate">
                  ⚡ Chưa kết nối Gemini API (AI Chấm bài, Tra từ & Sinh đề đang chạy chế độ offline)
                </span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-2.5 py-0.5 rounded-md bg-white text-slate-900 hover:bg-amber-50 font-black text-[11px] shadow-2xs transition-all cursor-pointer"
                >
                  Kết Nối
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 min-w-0">
                <div className="p-1 rounded-md bg-white/20 text-white shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-white leading-tight min-w-0">
                  <span className="font-black text-amber-100 uppercase tracking-wider mr-1.5 text-[10px] sm:text-xs">
                    LƯU Ý KẾT NỐI AI:
                  </span>
                  <span className="hidden sm:inline font-medium text-white/95">
                    Bạn cần <button onClick={() => setIsSettingsOpen(true)} className="underline font-bold hover:text-amber-200 cursor-pointer">kết nối Google Gemini API Key</button> cá nhân (miễn phí) để sử dụng trọn vẹn mọi tính năng AI (Chấm bài Writing 4 tiêu chí, Tra từ & Giải thích Reading, Luyện thi nói với Examiner AI, Sinh đề mới).
                  </span>
                  <span className="sm:hidden font-semibold text-white/95 truncate block text-[11px]">
                    Cần kết nối Gemini API để sử dụng các tính năng AI
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1 rounded-lg bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0 flex items-center space-x-1 cursor-pointer"
              >
                <span className="text-amber-600">⚡</span>
                <span>Kết Nối Ngay</span>
              </button>
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
                masteredIds={masteredIds}
                onToggleMastered={handleToggleMastered}
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
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenTheory={() => setIsTheoryOpen(true)}
                user={currentUser}
                onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
                onOpenDrills={() => setIsDrillsOpen(true)}
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
                masteredIds={masteredIds}
                onToggleMastered={handleToggleMastered}
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
                onOpenSettings={() => setIsSettingsOpen(true)}
                user={currentUser}
                onOpenTheory={() => setIsTheoryOpen(true)}
                onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
                onSpeakingSubmitted={(sub) => {
                  setSpeakingHistory(prev => {
                    const updated = [sub, ...prev];
                    safeSet('ielts_speaking_submissions_history', updated);
                    return updated;
                  });
                }}
                masteredIds={masteredIds}
                onToggleMastered={handleToggleMastered}
              />
            </React.Suspense>
          </WorkspaceErrorBoundary>
        </div>
      ) : (
        <WorkspaceErrorBoundary skillName="IELTS Writing" emergencyData={essays[currentTaskId] || ''}>
          <>
            {/* Writing Workspace Sub-Header Toolbar (Modularized) */}
            <WritingSubHeaderToolbar
              currentTask={currentTask}
              streakCount={streakCount}
              targetBand={targetBand}
              masteredIds={masteredIds}
              onToggleMastered={handleToggleMastered}
              onOpenLibrary={() => setIsLibraryOpen(true)}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              onOpenTheory={() => setIsTheoryOpen(true)}
              onOpenMistakeLog={() => setIsMistakeLogOpen(true)}
              onOpenPrescription={() => setIsPrescriptionOpen(true)}
              mistakesCount={mistakes.length}
              isFocusMode={isFocusMode}
              toggleFocusMode={toggleFocusMode}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              weeklyWordProgress={weeklyWordProgress}
              currentWeekWords={currentWeekWords}
              weeklyWordTarget={weeklyWordTarget}
              onOpenCDIDisplay={() => setIsCDIDisplayOpen(true)}
              cdiFontSize={cdiFontSize}
              cdiContrast={cdiContrast}
              isSlimHeader={isSlimHeader}
              toggleSlimHeader={toggleSlimHeader}
            />

          {/* Writing SplitPane Workspace */}
          <SplitPane
            defaultSplit={46}
            leftPane={
              <PromptPane
                task={currentTask}
                mode={mode}
                onBrainstorm={handleBrainstorm}
                isBrainstorming={isBrainstorming}
                brainstormResult={brainstormResult}
                onOpenIdeaMatrix={() => setIsIdeaMatrixOpen(true)}
                apiKey={apiKey}
                onOpenSettings={() => setIsSettingsOpen(true)}
                isMastered={masteredIds.includes(currentTask?.id)}
                onToggleMastered={() => handleToggleMastered(currentTask?.id)}
                onOpenLibrary={() => setIsLibraryOpen(true)}
              />
            }
            rightPane={
              <EditorPane
                essayText={currentEssay}
                setEssayText={handleEssayChange}
                outlineText={currentOutline}
                setOutlineText={handleOutlineChange}
                task={currentTask}
                mode={mode}
                timeElapsed={timeElapsed}
                lastSaved={lastSaved}
                onOpenParaphrase={() => setSlideOverConfig({ isOpen: true, tab: 'paraphrase' })}
                onOpenSlideOver={(tab) => setSlideOverConfig({ isOpen: true, tab })}
                onSubmitEssay={handleSubmitEssay}
                onEditorFocus={() => {
                  if (!isSlimHeader && typeof window !== 'undefined' && window.innerHeight < 950) {
                    setIsSlimHeader(true);
                  }
                }}
              />
            }
          />

          {/* Writing TimerBar */}
          <TimerBar
            timeRemaining={timeRemaining}
            totalTime={(currentTask?.timeLimit || 40) * 60}
            isRunning={isTimerRunning}
            onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
            onResetTimer={() => {
              setTimeRemaining((currentTask?.timeLimit || 40) * 60);
              setTimeElapsed(0);
              setIsTimerRunning(false);
            }}
            onSubmitEssay={handleSubmitEssay}
            isSubmitting={isSubmitting}
            wordCount={countWords(currentEssay)}
            minWords={currentTask.minWords}
            apiKey={apiKey}
            onOpenSettings={() => setIsSettingsOpen(true)}
            essayText={currentEssay}
            currentTask={currentTask}
            mistakes={mistakes}
          />
        </>
        </WorkspaceErrorBoundary>
      )}

      {/* 3. Modals System */}
      <React.Suspense fallback={null}>
        <AIEvaluationProgressModal
          isOpen={isSubmitting}
          taskNumber={currentTask?.taskNumber || 2}
          skill="writing"
        />

      <WorkspaceErrorBoundary skillName="IELTS Vocab, Grammar & Spelling">
        <VocabGrammarSpellingModal
          isOpen={isVocabGrammarOpen || modals.vocabGrammar}
          onClose={() => { setIsVocabGrammarOpen(false); triggerCloseModal('vocabGrammar'); }}
          apiKey={apiKey}
          model={model}
          onSaveToNotebook={(v) => setVocabList(prev => [v, ...prev])}
          currentUser={currentUser}
          masteredIds={masteredIds}
          onToggleMastered={handleToggleMastered}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      </WorkspaceErrorBoundary>

      <MicroDrillsModal
        isOpen={isDrillsOpen || modals.drills}
        onClose={() => { setIsDrillsOpen(false); triggerCloseModal('drills'); }}
        apiKey={apiKey}
        model={model}
        activeSkill={activeSkill}
        currentUser={currentUser}
        masteredIds={masteredIds}
        onToggleMastered={handleToggleMastered}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <WeeklyReportModal
        isOpen={isWeeklyReportOpen || modals.weeklyReport}
        onClose={() => { setIsWeeklyReportOpen(false); triggerCloseModal('weeklyReport'); }}
        submissions={submissions}
        readingHistory={readingHistory}
        listeningHistory={listeningHistory}
        speakingHistory={speakingHistory}
        mistakes={mistakes}
        apiKey={apiKey}
        model={model}
      />

      <WorkspaceErrorBoundary skillName="IELTS Mock Exam">
        <MockTestModal
          isOpen={isMockTestOpen || modals.mockTest}
          onClose={() => { setIsMockTestOpen(false); triggerCloseModal('mockTest'); }}
          allTasks={allTasks}
          submissions={submissions}
          readingHistory={readingHistory}
          listeningHistory={listeningHistory}
          speakingHistory={speakingHistory}
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
          apiKey={apiKey}
          model={model}
          activeSkill={activeSkill}
          onSelectSkill={(skill) => setActiveSkill(skill)}
          onStartReadingMockExam={handleStartReadingMockExam}
          currentUser={currentUser}
          marathonSession={marathonSession}
          onStartMarathon={handleStartMarathon}
          onCancelMarathon={handleCancelMarathon}
        />
      </WorkspaceErrorBoundary>

      <DocumentIngestModal
        isOpen={isIngestOpen || modals.ingest}
        onClose={() => { setIsIngestOpen(false); triggerCloseModal('ingest'); }}
        onTaskImported={(newTask) => {
          setAllTasks(prev => [newTask, ...prev]);
          setCurrentTaskId(newTask.id);
          // Sync to Cloud if logged in
          if (currentUser) {
            saveUserCustomTask(currentUser.id, newTask, false, currentUser.email);
          }
        }}
        apiKey={apiKey}
        model={model}
      />

      <IdeaMatrixModal
        isOpen={isIdeaMatrixOpen || modals.ideaMatrix}
        onClose={() => { setIsIdeaMatrixOpen(false); triggerCloseModal('ideaMatrix'); }}
        promptText={currentTask.prompt}
        onInsertToOutline={(idea) => {
          setOutlines(prev => ({
            ...prev,
            [currentTaskId]: (prev[currentTaskId] || '') + `\n- [Ý tưởng]: ${idea}`
          }));
        }}
        apiKey={apiKey}
        model={model}
      />

      <RevisionModal
        isOpen={isRevisionOpen || modals.revision}
        onClose={() => { setIsRevisionOpen(false); triggerCloseModal('revision'); }}
        task={currentTask}
        v1Essay={currentEssay}
        v1Evaluation={currentEvaluation}
        onSaveV2Submission={(v2Sub) => {
          setSubmissions(prev => [v2Sub, ...prev]);
          // Sync V2 to Cloud if logged in
          if (currentUser) {
            saveUserSubmission(currentUser.id, v2Sub);
          }
        }}
        apiKey={apiKey}
        model={model}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen || modals.feedback}
        onClose={() => { setIsFeedbackOpen(false); triggerCloseModal('feedback'); }}
        evaluation={currentEvaluation}
        task={currentTask}
        essayText={currentEssay}
        stats={{
          wordCount: countWords(currentEssay),
          timeSpent: `${Math.floor(timeElapsed / 60)}p ${timeElapsed % 60}s`
        }}
        onSaveToMistakeLog={(m) => setMistakes(prev => [m, ...prev])}
        onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
        onOpenRevision={() => setIsRevisionOpen(true)}
        onReEvaluateWithAI={() => {
          setIsFeedbackOpen(false);
          handleSubmitEssay('ai');
        }}
      />

      <TaskGeneratorModal
        isOpen={isGeneratorOpen || modals.generator}
        onClose={() => { setIsGeneratorOpen(false); triggerCloseModal('generator'); }}
        apiKey={apiKey}
        model={model}
        user={currentUser}
        onTaskCreated={(newTask, isPub) => {
          setAllTasks(prev => [newTask, ...prev]);
          setCurrentTaskId(newTask.id);

          // Always add to public community repository immediately, no login required!
          if (isPub) {
            const pubTask = {
              ...newTask,
              isPublic: true,
              isCommunity: true,
              creatorEmail: currentUser?.email || 'Thành viên cộng đồng'
            };
            setCommunityTasks(prev => [pubTask, ...prev.filter(t => t.id !== newTask.id)]);
          }

          // Sync to Cloud (If public, sync to Supabase Cloud for all visitors)
          saveUserCustomTask(currentUser?.id || null, newTask, isPub, currentUser?.email || 'Thành viên cộng đồng');
        }}
        onOpenSettings={() => {
          setIsGeneratorOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      <TaskLibraryModal
        isOpen={isLibraryOpen || modals.library}
        onClose={() => { setIsLibraryOpen(false); triggerCloseModal('library'); }}
        allTasks={allTasks}
        communityTasks={communityTasks}
        user={currentUser}
        submissions={submissions}
        currentTaskId={currentTaskId}
        masteredIds={masteredIds}
        onToggleMastered={handleToggleMastered}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSelectTask={(t) => {
          setAllTasks(prev => {
            if (prev.some(existing => existing.id === t.id)) return prev;
            return [t, ...prev];
          });
          setCurrentTaskId(t.id);
        }}
        onAddNewCustomTask={(newTask) => {
          setAllTasks(prev => [newTask, ...prev]);
          setCurrentTaskId(newTask.id);
          saveUserCustomTask(currentUser?.id || null, newTask, false, currentUser?.email || 'Khách');
        }}
        onTogglePublic={(taskId, isPub) => {
          setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, isPublic: isPub } : t));
          
          // Always update public community task bank immediately, no login required!
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
          if (currentUser) {
            deleteUserCustomTask(currentUser.id, id);
          }
          if (currentTaskId === id) {
            setCurrentTaskId(INITIAL_TASKS[0]?.id || 't2-ai-workplace-2025');
          }
        }}
        onExportAllData={handleExportAllData}
        onImportData={handleImportData}
      />

      <VocabNotebookModal
        isOpen={isNotebookOpen || modals.notebook}
        onClose={() => { setIsNotebookOpen(false); triggerCloseModal('notebook'); }}
        vocabList={vocabList}
        onAddVocab={(v) => {
          setVocabList(prev => [v, ...prev]);
          if (currentUser) saveUserVocabItem(currentUser.id, v);
        }}
        onDeleteVocab={(id) => {
          setVocabList(prev => prev.filter((v, i) => (v.id || i) !== id));
          if (currentUser) deleteUserVocabItem(currentUser.id, id);
        }}
        onClearAll={() => setVocabList([])}
      />

      <MistakeLogModal
        isOpen={isMistakeLogOpen || modals.mistakeLog}
        onClose={() => { setIsMistakeLogOpen(false); triggerCloseModal('mistakeLog'); }}
        mistakes={mistakes}
        onDeleteMistake={(idx) => setMistakes(prev => prev.filter((_, i) => i !== idx))}
        onClearAll={() => setMistakes([])}
      />

      <HistoryModal
        isOpen={isHistoryOpen || modals.history}
        onClose={() => { setIsHistoryOpen(false); triggerCloseModal('history'); }}
        submissions={submissions}
        readingHistory={readingHistory}
        listeningHistory={listeningHistory}
        speakingHistory={speakingHistory}
        activeSkill={activeSkill}
        onViewSubmission={(sub) => {
          setCurrentTaskId(sub.task.id);
          setCurrentEvaluation(sub.evaluation);
          setIsFeedbackOpen(true);
        }}
        onDeleteSubmission={handleDeleteWritingSubmission}
        onClearHistory={handleClearWritingHistory}
        onDeleteReadingSubmission={handleDeleteReadingSubmission}
        onClearReadingHistory={handleClearReadingHistory}
        onDeleteListeningSubmission={handleDeleteListeningSubmission}
        onClearListeningHistory={handleClearListeningHistory}
        onDeleteSpeakingSubmission={handleDeleteSpeakingSubmission}
        onClearSpeakingHistory={handleClearSpeakingHistory}
        onClearAllHistory={handleClearAllHistory}
        onViewSpeakingSubmission={(sub) => setSelectedHistorySpeakingSub(sub)}
        masteredIds={masteredIds}
      />

      <TheoryHandbookModal
        isOpen={isTheoryOpen || modals.theory}
        onClose={() => { setIsTheoryOpen(false); triggerCloseModal('theory'); }}
        activeSkill={activeSkill}
        personalNotes={personalNotes}
        onSavePersonalNote={(note) => setPersonalNotes(prev => [note, ...prev])}
        onDeletePersonalNote={(id) => setPersonalNotes(prev => prev.filter(n => n.id !== id))}
      />

      <CDIDisplayModal
        isOpen={isCDIDisplayOpen}
        onClose={() => setIsCDIDisplayOpen(false)}
        cdiFontSize={cdiFontSize}
        onChangeFontSize={handleChangeCdiFontSize}
        cdiContrast={cdiContrast}
        onChangeContrast={handleChangeCdiContrast}
        onReset={handleResetCDIDisplay}
      />

      <QuickParaphraseModal
        isOpen={isParaphraseOpen || modals.paraphrase}
        onClose={() => { setIsParaphraseOpen(false); triggerCloseModal('paraphrase'); }}
        onSaveToNotebook={(v) => setVocabList(prev => [v, ...prev])}
      />

      <SettingsModal
        isOpen={isSettingsOpen || modals.settings}
        onClose={() => { setIsSettingsOpen(false); triggerCloseModal('settings'); }}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
        onClearAllLocalData={handleClearAllLocalData}
      />

      <AuthModal
        isOpen={isAuthOpen || modals.auth}
        onClose={() => { setIsAuthOpen(false); triggerCloseModal('auth'); }}
        user={currentUser}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      <FeaturesGuideModal
        isOpen={isFeaturesGuideOpen || modals.featuresGuide}
        onClose={() => { setIsFeaturesGuideOpen(false); triggerCloseModal('featuresGuide'); }}
        initialSkill={activeSkill}
        onNavigateWorkspace={(skill) => setActiveSkill(skill)}
        onOpenModal={(modalName) => triggerOpenModal(modalName)}
      />

      <UserProfileModal
        isOpen={isProfileOpen || modals.profile}
        onClose={() => { setIsProfileOpen(false); triggerCloseModal('profile'); }}
        user={currentUser}
        masteredIds={masteredIds}
        onToggleMastered={handleToggleMastered}
        submissions={submissions}
        readingHistory={readingHistory}
        listeningHistory={listeningHistory}
        speakingHistory={speakingHistory}
        vocabList={vocabList}
        mistakes={mistakes}
        streakCount={streakCount}
        allTasks={allTasks}
        onSelectTask={(t) => setCurrentTaskId(t.id)}
        onTogglePublic={(taskId, isPub) => {
          setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, isPublic: isPub } : t));
          if (currentUser) {
            toggleTaskPublicity(currentUser.id, taskId, isPub);
            if (isPub) {
              const taskToShare = allTasks.find(t => t.id === taskId);
              if (taskToShare) {
                setCommunityTasks(prev => [{ ...taskToShare, isPublic: true, creatorEmail: currentUser.email, isCommunity: true }, ...prev]);
              }
            } else {
              setCommunityTasks(prev => prev.filter(t => t.id !== taskId));
            }
          }
        }}
        onDeleteTask={(taskId) => {
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
          if (currentUser) {
            deleteUserCustomTask(currentUser.id, taskId);
          }
          if (currentTaskId === taskId) {
            setCurrentTaskId(INITIAL_TASKS[0]?.id || 't2-ai-workplace-2025');
          }
        }}
        onViewSubmission={(sub) => {
          setCurrentTaskId(sub.task.id);
          setCurrentEvaluation(sub.evaluation);
          setIsFeedbackOpen(true);
        }}
        onDeleteSubmission={handleDeleteWritingSubmission}
        onClearHistory={handleClearWritingHistory}
        onDeleteReadingSubmission={handleDeleteReadingSubmission}
        onClearReadingHistory={handleClearReadingHistory}
        onDeleteListeningSubmission={handleDeleteListeningSubmission}
        onClearListeningHistory={handleClearListeningHistory}
        onDeleteSpeakingSubmission={handleDeleteSpeakingSubmission}
        onClearSpeakingHistory={handleClearSpeakingHistory}
        onClearAllHistory={handleClearAllHistory}
        onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
        onSaveMistake={(m) => setMistakes(prev => [m, ...prev])}
        onSignOut={async () => {
          await supabase.auth.signOut();
          setIsProfileOpen(false);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenIngest={() => { setIsProfileOpen(false); setIsIngestOpen(true); }}
        onOpenGenerator={() => { setIsProfileOpen(false); setIsGeneratorOpen(true); }}
        onOpenLibrary={() => { setIsProfileOpen(false); setIsLibraryOpen(true); }}
        onOpenPrescription={() => { setIsProfileOpen(false); setIsPrescriptionOpen(true); }}
        onExportAllData={handleExportAllData}
        onImportData={handleImportData}
      />

      {/* Speaking Evaluation Result Modal (opened from HistoryModal) */}
      {selectedHistorySpeakingSub && (
        <SpeakingResultModal
          isOpen={!!selectedHistorySpeakingSub}
          onClose={() => setSelectedHistorySpeakingSub(null)}
          evaluation={selectedHistorySpeakingSub.evaluation}
          dialogueHistory={selectedHistorySpeakingSub.dialogueHistory}
          mockPack={selectedHistorySpeakingSub.mockPack}
          examiner={selectedHistorySpeakingSub.examiner}
          totalDurationSec={selectedHistorySpeakingSub.durationSec}
          onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
          onSaveMistake={(m) => setMistakes(prev => [m, ...prev])}
        />
      )}

      <ContactModal
        isOpen={isContactOpen || modals.contact}
        onClose={() => { setIsContactOpen(false); triggerCloseModal('contact'); }}
      />

      {/* Keyboard Shortcuts Reference Guide Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <WorkspaceErrorBoundary skillName="Diagnostic Placement & Study Plan">
        <DiagnosticPlacementModal
          isOpen={isDiagnosticOpen || modals.diagnostic}
          onClose={() => { setIsDiagnosticOpen(false); triggerCloseModal('diagnostic'); }}
          targetBand={targetBand}
          onApplyTargetBand={(newBand) => setTargetBand(newBand)}
          onOpenSkill={(skill) => setActiveSkill(skill)}
        />
      </WorkspaceErrorBoundary>

        {/* Onboarding 3-Step Tour & Target Band Selector */}
        <OnboardingModal
          isOpen={isOnboardingOpen || modals.onboarding}
          onClose={() => { setIsOnboardingOpen(false); triggerCloseModal('onboarding'); }}
          initialTargetBand={targetBand}
          currentApiKey={apiKey}
          onSaveConfig={({ targetBand: newBand, apiKey: newKey }) => {
            if (newBand) setTargetBand(newBand);
            if (newKey) setApiKey(newKey);
          }}
        />

        {/* Side Panel Tool for Paraphrase & Vocab */}
        <SlideOverToolPanel
          isOpen={slideOverConfig.isOpen}
          onClose={() => setSlideOverConfig(prev => ({ ...prev, isOpen: false }))}
          initialTab={slideOverConfig.tab}
          vocabList={vocabList}
          onInsertText={handleInsertSlideOverText}
          onAddVocab={(v) => {
            setVocabList(prev => [v, ...prev]);
            if (currentUser) saveUserVocabItem(currentUser.id, v);
          }}
          promptText={currentTask?.prompt}
        />

        {/* Daily Error Prescription Modal (Spaced Repetition Micro-Drill) */}
        <DailyErrorPrescriptionModal
          isOpen={isPrescriptionOpen || modals.prescription}
          onClose={() => { setIsPrescriptionOpen(false); triggerCloseModal('prescription'); }}
          mistakes={mistakes}
          submissions={submissions}
        />

        {/* Cambridge Growth Analytics & Target Band Prediction Modal */}
        <GrowthAnalyticsModal
          isOpen={Boolean(modals.growthAnalytics)}
          onClose={() => triggerCloseModal('growthAnalytics')}
          initialTargetBand={Number(targetBand) || 7.0}
          userScores={{
            listening: 6.5,
            reading: 6.5,
            writing: 6.0,
            speaking: 6.0,
            overall: 6.5
          }}
          onNavigateSkill={(skill) => {
            setActiveSkill(skill);
            triggerCloseModal('growthAnalytics');
          }}
        />
      </React.Suspense>

    </div>
  );
}
