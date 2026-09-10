import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SplitPane from './components/SplitPane';
import PromptPane from './components/PromptPane';
import EditorPane from './components/EditorPane';
import TimerBar from './components/TimerBar';
import FeedbackModal from './components/FeedbackModal';
import TaskGeneratorModal from './components/TaskGeneratorModal';
import TaskLibraryModal from './components/TaskLibraryModal';
import VocabNotebookModal from './components/VocabNotebookModal';
import MistakeLogModal from './components/MistakeLogModal';
import HistoryModal from './components/HistoryModal';
import TheoryHandbookModal from './components/TheoryHandbookModal';
import QuickParaphraseModal from './components/QuickParaphraseModal';
import SettingsModal from './components/SettingsModal';
import MicroDrillsModal from './components/MicroDrillsModal';
import IdeaMatrixModal from './components/IdeaMatrixModal';
import RevisionModal from './components/RevisionModal';
import WeeklyReportModal from './components/WeeklyReportModal';
import DocumentIngestModal from './components/DocumentIngestModal';
import MockTestModal from './components/MockTestModal';
import VocabGrammarSpellingModal from './components/VocabGrammarSpellingModal';
import AuthModal from './components/AuthModal';
import FeaturesGuideModal from './components/FeaturesGuideModal';
import UserProfileModal from './components/UserProfileModal';
import ContactModal from './components/ContactModal';
const ReadingWorkspace = React.lazy(() => import('./components/reading/ReadingWorkspace'));
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
  deleteUserCustomTask
} from './services/dataSyncService';

import { INITIAL_TASKS } from './data/sampleTasks';
import { evaluateEssay, brainstormIdeas } from './services/geminiService';
import { countWords } from './utils/textAnalytics';

export default function App() {
  // 1. Persistent Storage State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ielts_gemini_api_key') || '');
  const [model, setModel] = useState(() => {
    const saved = localStorage.getItem('ielts_gemini_model');
    const deprecated = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.0-pro', 'gemini-pro'];
    if (!saved || deprecated.includes(saved) || saved.startsWith('gemini-1.') || saved.startsWith('gemini-2.0')) {
      return 'gemini-2.5-flash';
    }
    return saved;
  });
  
  const [allTasks, setAllTasks] = useState(() => {
    const saved = localStorage.getItem('ielts_all_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  const [currentTaskId, setCurrentTaskId] = useState(() => {
    return localStorage.getItem('ielts_current_task_id') || allTasks[0]?.id || 't2-ai-workplace-2025';
  });

  const [essays, setEssays] = useState(() => {
    const saved = localStorage.getItem('ielts_essays_drafts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  const [outlines, setOutlines] = useState(() => {
    const saved = localStorage.getItem('ielts_outlines_drafts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('ielts_submissions_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [readingHistory, setReadingHistory] = useState(() => {
    const saved = localStorage.getItem('ielts_reading_submissions_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [vocabList, setVocabList] = useState(() => {
    const saved = localStorage.getItem('ielts_vocab_notebook');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'v1', phrase: 'catalyze novel industries', meaningVi: 'thúc đẩy các ngành mới', example: 'AI will catalyze novel industries.', topic: 'tech' },
      { id: 'v2', phrase: 'pivotal element', meaningVi: 'yếu tố then chốt', example: 'Education is a pivotal element.', topic: 'edu' },
    ];
  });

  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('ielts_mistakes_log');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [personalNotes, setPersonalNotes] = useState(() => {
    const saved = localStorage.getItem('ielts_theory_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [streakCount, setStreakCount] = useState(() => {
    return Number(localStorage.getItem('ielts_streak_count')) || 3;
  });

  // 2. UI & Mode State
  const [activeSkill, setActiveSkill] = useState(() => localStorage.getItem('ielts_active_skill') || 'writing');
  const [mode, setMode] = useState('exam'); // 'exam' | 'practice'
  const [lastSaved, setLastSaved] = useState(new Date());

  // Keep active skill in localStorage
  useEffect(() => {
    localStorage.setItem('ielts_active_skill', activeSkill);
  }, [activeSkill]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [communityTasks, setCommunityTasks] = useState([]);
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
  const [isMockTestOpen, setIsMockTestOpen] = useState(false);
  const [isFeaturesGuideOpen, setIsFeaturesGuideOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Reading Mock Test Exam State
  const [readingMockTestId, setReadingMockTestId] = useState(null);
  const [readingMockExamMode, setReadingMockExamMode] = useState(null);

  const handleStartReadingMockExam = (testId) => {
    setActiveSkill('reading');
    setReadingMockTestId(testId);
    setReadingMockExamMode('exam');
    setIsMockTestOpen(false);
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

  // Fetch Public Community Tasks on initial load
  useEffect(() => {
    fetchPublicTasks().then(tasks => {
      if (tasks && tasks.length > 0) {
        setCommunityTasks(tasks);
      }
    });
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
    }
  }, [currentUser]);

  // 5. Auto-save Effects
  useEffect(() => {
    localStorage.setItem('ielts_gemini_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('ielts_gemini_model', model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem('ielts_all_tasks', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    localStorage.setItem('ielts_current_task_id', currentTaskId);
  }, [currentTaskId]);

  useEffect(() => {
    localStorage.setItem('ielts_essays_drafts', JSON.stringify(essays));
    setLastSaved(new Date());
  }, [essays]);

  useEffect(() => {
    localStorage.setItem('ielts_outlines_drafts', JSON.stringify(outlines));
  }, [outlines]);

  useEffect(() => {
    localStorage.setItem('ielts_submissions_history', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('ielts_vocab_notebook', JSON.stringify(vocabList));
  }, [vocabList]);

  useEffect(() => {
    localStorage.setItem('ielts_mistakes_log', JSON.stringify(mistakes));
  }, [mistakes]);

  useEffect(() => {
    localStorage.setItem('ielts_theory_notes', JSON.stringify(personalNotes));
  }, [personalNotes]);

  useEffect(() => {
    localStorage.setItem('ielts_streak_count', streakCount.toString());
  }, [streakCount]);

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

  const handleSubmitEssay = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    const wordCount = countWords(currentEssay);
    if (wordCount < 20) {
      alert('Vui lòng viết ít nhất 20 từ trước khi nộp bài để giám khảo AI chấm điểm.');
      return;
    }

    setIsSubmitting(true);
    setIsTimerRunning(false);

    try {
      const evaluation = await evaluateEssay({
        task: currentTask,
        essayText: currentEssay,
        apiKey,
        model
      });

      setCurrentEvaluation(evaluation);
      setIsFeedbackOpen(true);

      // Save to submissions history
      const newSubmission = {
        id: `sub-${Date.now()}`,
        task: currentTask,
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

      // Cloud Sync if logged in
      if (currentUser) {
        saveUserSubmission(currentUser.id, newSubmission);
      }

    } catch (err) {
      alert(err.message || 'Lỗi khi chấm bài với Gemini. Vui lòng kiểm tra lại API Key.');
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
    setVocabList([]);
    setMistakes([]);
    setPersonalNotes([]);
    setApiKey('');
    alert('Đã khôi phục toàn bộ cài đặt gốc.');
  };

  return (
    <div className={`${activeSkill === 'reading' ? 'h-screen overflow-hidden' : 'min-h-screen'} flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900`}>
      
      {/* 1. Main Navigation Bar */}
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
        onOpenIngest={() => setIsIngestOpen(true)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
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
        apiKey={apiKey}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* 2. Workspace Conditional Rendering based on activeSkill */}
      {activeSkill === 'reading' ? (
        <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
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
              user={currentUser}
              onSaveToVocabNotebook={(v) => setVocabList(prev => [v, ...prev])}
              onReadingSubmitted={(sub) => {
                setReadingHistory(prev => {
                  const updated = [sub, ...prev];
                  try {
                    localStorage.setItem('ielts_reading_submissions_history', JSON.stringify(updated));
                  } catch (e) {}
                  return updated;
                });
              }}
              initialTestId={readingMockTestId}
              initialExamMode={readingMockExamMode}
            />
          </React.Suspense>
        </div>
      ) : (
        <>
          {/* Writing Workspace Secondary Sub-Bar */}
          <div className="hidden sm:flex bg-slate-100 border-b border-slate-200 px-4 py-1.5 items-center justify-between text-xs gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsTheoryOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-red-700 font-bold border border-slate-200 shadow-2xs transition-colors"
              >
                <span>📖 Cẩm Nang Lý Thuyết</span>
              </button>

              <button
                onClick={() => setIsMistakeLogOpen(true)}
                className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                <span>⚠️ Sổ tay lỗi sai ({mistakes.length})</span>
              </button>
            </div>

            {/* Weekly Word Target Progress Bar */}
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="hidden md:inline font-medium">Mục tiêu tuần:</span>
              <div className="w-28 sm:w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${weeklyWordProgress}%` }}
                />
              </div>
              <span className="font-bold text-slate-800">{currentWeekWords}/{weeklyWordTarget} từ ({weeklyWordProgress}%)</span>
            </div>
          </div>

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
                onOpenParaphrase={() => setIsParaphraseOpen(true)}
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
          />
        </>
      )}

      {/* 3. Modals System */}
      <VocabGrammarSpellingModal
        isOpen={isVocabGrammarOpen}
        onClose={() => setIsVocabGrammarOpen(false)}
        apiKey={apiKey}
        model={model}
        onSaveToNotebook={(v) => setVocabList(prev => [v, ...prev])}
      />

      <MicroDrillsModal
        isOpen={isDrillsOpen}
        onClose={() => setIsDrillsOpen(false)}
        apiKey={apiKey}
        model={model}
        activeSkill={activeSkill}
      />

      <WeeklyReportModal
        isOpen={isWeeklyReportOpen}
        onClose={() => setIsWeeklyReportOpen(false)}
        submissions={submissions}
        mistakes={mistakes}
        apiKey={apiKey}
        model={model}
      />

      <MockTestModal
        isOpen={isMockTestOpen}
        onClose={() => setIsMockTestOpen(false)}
        allTasks={allTasks}
        onSaveMockResult={(res) => {
          setStreakCount(prev => prev + 1);
          setSubmissions(prev => [
            {
              id: `mock-${Date.now()}`,
              task: { title: 'Full Mock Test 60 phút', taskNumber: '1 & 2' },
              essayText: 'Completed both Task 1 and Task 2',
              evaluation: { overallBand: res.finalOverall },
              stats: { wordCount: res.t1Words + res.t2Words, timeSpent: '60 phút' },
              date: res.date
            },
            ...prev
          ]);
        }}
        apiKey={apiKey}
        model={model}
        activeSkill={activeSkill}
        onStartReadingMockExam={handleStartReadingMockExam}
        currentUser={currentUser}
      />

      <DocumentIngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
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
        isOpen={isIdeaMatrixOpen}
        onClose={() => setIsIdeaMatrixOpen(false)}
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
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
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
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
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
      />

      <TaskGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        apiKey={apiKey}
        model={model}
        user={currentUser}
        onTaskCreated={(newTask, isPub) => {
          setAllTasks(prev => [newTask, ...prev]);
          setCurrentTaskId(newTask.id);
          // Sync to Cloud if logged in
          if (currentUser) {
            saveUserCustomTask(currentUser.id, newTask, isPub, currentUser.email);
            if (isPub) {
              setCommunityTasks(prev => [newTask, ...prev]);
            }
          }
        }}
        onOpenSettings={() => {
          setIsGeneratorOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      <TaskLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        allTasks={allTasks}
        communityTasks={communityTasks}
        user={currentUser}
        currentTaskId={currentTaskId}
        onSelectTask={(t) => setCurrentTaskId(t.id)}
        onAddNewCustomTask={(newTask) => {
          setAllTasks(prev => [newTask, ...prev]);
          setCurrentTaskId(newTask.id);
          if (currentUser) {
            saveUserCustomTask(currentUser.id, newTask, false, currentUser.email);
          }
        }}
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
        onDeleteTask={(id) => {
          setAllTasks(prev => prev.filter(t => t.id !== id));
          setCommunityTasks(prev => prev.filter(t => t.id !== id));
          if (currentUser) {
            deleteUserCustomTask(currentUser.id, id);
          }
          if (currentTaskId === id) {
            setCurrentTaskId(INITIAL_TASKS[0].id);
          }
        }}
        onExportAllData={handleExportAllData}
        onImportData={handleImportData}
      />

      <VocabNotebookModal
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
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
        isOpen={isMistakeLogOpen}
        onClose={() => setIsMistakeLogOpen(false)}
        mistakes={mistakes}
        onDeleteMistake={(idx) => setMistakes(prev => prev.filter((_, i) => i !== idx))}
        onClearAll={() => setMistakes([])}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        submissions={submissions}
        onViewSubmission={(sub) => {
          setCurrentTaskId(sub.task.id);
          setCurrentEvaluation(sub.evaluation);
          setIsFeedbackOpen(true);
        }}
        onDeleteSubmission={(id) => {
          setSubmissions(prev => prev.filter(s => s.id !== id));
          if (currentUser) deleteUserSubmission(currentUser.id, id);
        }}
        onClearHistory={() => setSubmissions([])}
      />

      <TheoryHandbookModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
        personalNotes={personalNotes}
        onSavePersonalNote={(note) => setPersonalNotes(prev => [note, ...prev])}
        onDeletePersonalNote={(id) => setPersonalNotes(prev => prev.filter(n => n.id !== id))}
      />

      <QuickParaphraseModal
        isOpen={isParaphraseOpen}
        onClose={() => setIsParaphraseOpen(false)}
        onSaveToNotebook={(v) => setVocabList(prev => [v, ...prev])}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
        onClearAllLocalData={handleClearAllLocalData}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      <FeaturesGuideModal
        isOpen={isFeaturesGuideOpen}
        onClose={() => setIsFeaturesGuideOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        submissions={submissions}
        readingHistory={readingHistory}
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
          setAllTasks(prev => prev.filter(t => t.id !== taskId));
          setCommunityTasks(prev => prev.filter(t => t.id !== taskId));
          if (currentUser) {
            deleteUserCustomTask(currentUser.id, taskId);
          }
        }}
        onViewSubmission={(sub) => {
          setCurrentTaskId(sub.task.id);
          setCurrentEvaluation(sub.evaluation);
          setIsFeedbackOpen(true);
        }}
        onDeleteReadingSubmission={(subId) => {
          setReadingHistory(prev => {
            const updated = prev.filter(r => r.id !== subId);
            try {
              localStorage.setItem('ielts_reading_submissions_history', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }}
        onClearReadingHistory={() => {
          setReadingHistory([]);
          try {
            localStorage.removeItem('ielts_reading_submissions_history');
          } catch (e) {}
        }}
        onSignOut={async () => {
          await supabase.auth.signOut();
          setIsProfileOpen(false);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenIngest={() => { setIsProfileOpen(false); setIsIngestOpen(true); }}
        onOpenGenerator={() => { setIsProfileOpen(false); setIsGeneratorOpen(true); }}
        onOpenLibrary={() => { setIsProfileOpen(false); setIsLibraryOpen(true); }}
        onExportAllData={handleExportAllData}
        onImportData={handleImportData}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

    </div>
  );
}
