import { safeSet } from '../utils/storageService';
import {
  deleteSubmissionTwoTier,
  clearSubmissionsTwoTier
} from '../utils/indexedDbStorage';
import {
  saveUserSubmission,
  deleteUserSubmission,
  saveUserCustomTask,
  toggleTaskPublicity,
  saveUserMasteredItems
} from '../services/dataSyncService';
import { INITIAL_TASKS } from '../data/sampleTasks';
import { deduplicateWritingTasks } from '../services/deduplicationService';

/**
 * Custom hook encapsulating submission history operations across all 4 skills,
 * custom task creation/sharing, and JSON backup import/export.
 */
export function useSubmissionAndTaskActions({
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
}) {
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

  const handleAddNewCustomTask = (newTask, isPub) => {
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
  };

  const handleTogglePublic = (taskId, isPub) => {
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
  };

  const handleSaveMockResult = (res) => {
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
  };

  const handleSaveV2Submission = (v2Sub) => {
    setSubmissions(prev => [v2Sub, ...prev]);
    if (currentUser) {
      saveUserSubmission(currentUser.id, v2Sub);
    }
  };

  const handleTaskImported = (newTask) => {
    setAllTasks(prev => [newTask, ...prev]);
    setCurrentTaskId(newTask.id);
    if (currentUser) {
      saveUserCustomTask(currentUser.id, newTask, false, currentUser.email);
    }
  };

  return {
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
  };
}
