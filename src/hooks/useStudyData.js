/**
 * useStudyData Custom Hook
 * Connects the Presentation Layer (App.jsx) with the Data Access Layer (Repositories).
 * Encapsulates Two-Tier state hydration, auto-persistence, and history CRUD operations.
 */

import { useState, useEffect, useRef } from 'react';
import {
  TaskRepository,
  SubmissionRepository,
  SUBMISSION_STORAGE_KEYS,
  StudyProfileRepository,
  BackupRepository
} from '../repositories/index.js';
import { INITIAL_TASKS } from '../data/sampleTasks.js';
import { isEnglish } from '../i18n/i18nService.js';

/**
 * Skips running an effect on the initial mount so read-from-storage states
 * do not immediately write back to localStorage / IndexedDB on page load.
 */
function useAfterMountEffect(effect, deps) {
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    return effect();
  }, deps);
}

export function useStudyData(currentUser = null) {
  // Tasks
  const [allTasks, setAllTasks] = useState(() => TaskRepository.getInitialTasks());
  const [communityTasks, setCommunityTasks] = useState(() => TaskRepository.getCommunityTasks());
  const [currentTaskId, setCurrentTaskId] = useState(() => {
    return localStorage.getItem('ielts_current_task_id') || 't2-ai-workplace-2025';
  });

  // Drafts
  const [essays, setEssays] = useState(() => StudyProfileRepository.getEssaysDrafts());
  const [outlines, setOutlines] = useState(() => StudyProfileRepository.getOutlinesDrafts());
  const [lastSaved, setLastSaved] = useState(new Date());

  // Submissions & Histories
  const [submissions, setSubmissions] = useState(() =>
    SubmissionRepository.getInitialHistory(SUBMISSION_STORAGE_KEYS.WRITING)
  );
  const [readingHistory, setReadingHistory] = useState(() =>
    SubmissionRepository.getInitialHistory(SUBMISSION_STORAGE_KEYS.READING)
  );
  const [listeningHistory, setListeningHistory] = useState(() =>
    SubmissionRepository.getInitialHistory(SUBMISSION_STORAGE_KEYS.LISTENING)
  );
  const [speakingHistory, setSpeakingHistory] = useState(() =>
    SubmissionRepository.getInitialHistory(SUBMISSION_STORAGE_KEYS.SPEAKING)
  );

  // Profile & Mastery
  const [vocabList, setVocabList] = useState(() => StudyProfileRepository.getVocabList());
  const [mistakes, setMistakes] = useState(() => StudyProfileRepository.getMistakes());
  const [personalNotes, setPersonalNotes] = useState(() => StudyProfileRepository.getPersonalNotes());
  const [streakCount, setStreakCount] = useState(() => StudyProfileRepository.getStreakCount());
  const [masteredIds, setMasteredIds] = useState(() => StudyProfileRepository.getMasteredIds());

  // 1. Two-Tier IndexedDB Asynchronous Hydration
  useEffect(() => {
    let isMounted = true;
    async function hydrate() {
      const res = await SubmissionRepository.hydrateAllTwoTierHistories();
      if (!isMounted) return;
      if (res.writing) setSubmissions(res.writing);
      if (res.reading) setReadingHistory(res.reading);
      if (res.listening) setListeningHistory(res.listening);
      if (res.speaking) setSpeakingHistory(res.speaking);
    }
    hydrate();
    return () => { isMounted = false; };
  }, []);

  // 2. Auto-Persistence Effects (skip initial mount to eliminate boot write thrashing)
  useAfterMountEffect(() => {
    TaskRepository.saveAllTasks(allTasks);
  }, [allTasks]);

  useAfterMountEffect(() => {
    TaskRepository.saveCommunityTasks(communityTasks);
  }, [communityTasks]);

  useAfterMountEffect(() => {
    localStorage.setItem('ielts_current_task_id', currentTaskId);
  }, [currentTaskId]);

  useAfterMountEffect(() => {
    const timer = setTimeout(() => {
      StudyProfileRepository.saveEssaysDrafts(essays);
      setLastSaved(new Date());
    }, 400);
    return () => clearTimeout(timer);
  }, [essays]);

  useAfterMountEffect(() => {
    const timer = setTimeout(() => {
      StudyProfileRepository.saveOutlinesDrafts(outlines);
    }, 400);
    return () => clearTimeout(timer);
  }, [outlines]);

  useAfterMountEffect(() => {
    SubmissionRepository.saveSubmissions(SUBMISSION_STORAGE_KEYS.WRITING, submissions);
  }, [submissions]);

  useAfterMountEffect(() => {
    SubmissionRepository.saveSubmissions(SUBMISSION_STORAGE_KEYS.READING, readingHistory);
  }, [readingHistory]);

  useAfterMountEffect(() => {
    SubmissionRepository.saveSubmissions(SUBMISSION_STORAGE_KEYS.LISTENING, listeningHistory);
  }, [listeningHistory]);

  useAfterMountEffect(() => {
    SubmissionRepository.saveSubmissions(SUBMISSION_STORAGE_KEYS.SPEAKING, speakingHistory);
  }, [speakingHistory]);

  useAfterMountEffect(() => {
    StudyProfileRepository.saveVocabList(vocabList);
  }, [vocabList]);

  useAfterMountEffect(() => {
    StudyProfileRepository.saveMistakes(mistakes);
  }, [mistakes]);

  useAfterMountEffect(() => {
    StudyProfileRepository.savePersonalNotes(personalNotes);
  }, [personalNotes]);

  useAfterMountEffect(() => {
    StudyProfileRepository.saveStreakCount(streakCount);
  }, [streakCount]);

  useAfterMountEffect(() => {
    StudyProfileRepository.saveMasteredIds(masteredIds);
  }, [masteredIds]);

  // 3. Action Handlers
  const handleToggleMastered = (itemId) => {
    const { updated } = StudyProfileRepository.toggleMasteredId(itemId, masteredIds);
    setMasteredIds(updated);
  };

  const handleDeleteWritingSubmission = async (subId) => {
    const updated = await SubmissionRepository.deleteSubmission(
      SUBMISSION_STORAGE_KEYS.WRITING,
      subId,
      submissions,
      currentUser
    );
    setSubmissions(updated);
  };

  const handleClearWritingHistory = async () => {
    await SubmissionRepository.clearSkillHistory(SUBMISSION_STORAGE_KEYS.WRITING);
    setSubmissions([]);
  };

  const handleDeleteReadingSubmission = async (subId) => {
    const updated = await SubmissionRepository.deleteSubmission(
      SUBMISSION_STORAGE_KEYS.READING,
      subId,
      readingHistory,
      currentUser
    );
    setReadingHistory(updated);
  };

  const handleClearReadingHistory = async () => {
    await SubmissionRepository.clearSkillHistory(SUBMISSION_STORAGE_KEYS.READING);
    setReadingHistory([]);
  };

  const handleDeleteListeningSubmission = async (subId) => {
    const updated = await SubmissionRepository.deleteSubmission(
      SUBMISSION_STORAGE_KEYS.LISTENING,
      subId,
      listeningHistory,
      currentUser
    );
    setListeningHistory(updated);
  };

  const handleClearListeningHistory = async () => {
    await SubmissionRepository.clearSkillHistory(SUBMISSION_STORAGE_KEYS.LISTENING);
    setListeningHistory([]);
  };

  const handleDeleteSpeakingSubmission = async (subId) => {
    const updated = await SubmissionRepository.deleteSubmission(
      SUBMISSION_STORAGE_KEYS.SPEAKING,
      subId,
      speakingHistory,
      currentUser
    );
    setSpeakingHistory(updated);
  };

  const handleClearSpeakingHistory = async () => {
    await SubmissionRepository.clearSkillHistory(SUBMISSION_STORAGE_KEYS.SPEAKING);
    setSpeakingHistory([]);
  };

  const handleClearAllHistory = async () => {
    await SubmissionRepository.clearAllHistories();
    setSubmissions([]);
    setReadingHistory([]);
    setListeningHistory([]);
    setSpeakingHistory([]);
  };

  const handleExportAllData = () => {
    BackupRepository.exportDataPackage({
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
      streakCount
    });
  };

  const handleImportData = (data) => {
    if (data.allTasks) setAllTasks(data.allTasks);
    if (data.essays) setEssays(data.essays);
    if (data.outlines) setOutlines(data.outlines);
    if (data.submissions) setSubmissions(data.submissions);
    if (data.readingHistory) setReadingHistory(data.readingHistory);
    if (data.listeningHistory) setListeningHistory(data.listeningHistory);
    if (data.speakingHistory) setSpeakingHistory(data.speakingHistory);
    if (data.vocabList) setVocabList(data.vocabList);
    if (data.mistakes) setMistakes(data.mistakes);
    if (data.personalNotes) setPersonalNotes(data.personalNotes);
    alert(isEnglish() ? 'Data restored successfully!' : 'Đã khôi phục dữ liệu thành công!');
  };

  const handleClearAllLocalData = async () => {
    await BackupRepository.wipeAllStorage();
    setAllTasks(INITIAL_TASKS);
    setCurrentTaskId(INITIAL_TASKS[0]?.id || 't2-ai-workplace-2025');
    setEssays({});
    setOutlines({});
    setSubmissions([]);
    setReadingHistory([]);
    setListeningHistory([]);
    setSpeakingHistory([]);
    setVocabList([]);
    setMistakes([]);
    setPersonalNotes({});
    alert(isEnglish() ? 'All local data has been reset to factory defaults.' : 'Đã khôi phục toàn bộ cài đặt gốc.');
  };

  return {
    allTasks,
    setAllTasks,
    communityTasks,
    setCommunityTasks,
    currentTaskId,
    setCurrentTaskId,
    essays,
    setEssays,
    outlines,
    setOutlines,
    lastSaved,
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
    setMistakes,
    personalNotes,
    setPersonalNotes,
    streakCount,
    setStreakCount,
    masteredIds,
    setMasteredIds,
    handleToggleMastered,
    handleDeleteWritingSubmission,
    handleClearWritingHistory,
    handleDeleteReadingSubmission,
    handleClearReadingHistory,
    handleDeleteListeningSubmission,
    handleClearListeningHistory,
    handleDeleteSpeakingSubmission,
    handleClearSpeakingHistory,
    handleClearAllHistory,
    handleExportAllData,
    handleImportData,
    handleClearAllLocalData
  };
}
