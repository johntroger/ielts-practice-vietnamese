import { useState, useEffect, useCallback, useMemo } from 'react';
import { calculateListeningBandScore } from '../data/listeningTasks';

const STORAGE_PREFIX = 'ielts_listening_session_';

export function useListeningExam({
  testId = 'cambridge-18-test-1',
  audioEngine = null,
  examMode = 'practice', // 'strict' | 'practice'
  questionsData = []
} = {}) {
  const storageKey = `${STORAGE_PREFIX}${testId}`;

  // 1. Local State from Storage or Default
  const [userAnswers, setUserAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.userAnswers || {};
      }
    } catch (e) {
      console.error('Error loading listening answers from localStorage', e);
    }
    return {};
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.flaggedQuestions || {};
      }
    } catch (e) {}
    return {};
  });

  const [activeQuestionOrder, setActiveQuestionOrder] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.isSubmitted;
      }
    } catch (e) {}
    return false;
  });

  const [submittedAt, setSubmittedAt] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.submittedAt || null;
      }
    } catch (e) {}
    return null;
  });

  // 2. Persist State to LocalStorage
  useEffect(() => {
    try {
      const sessionData = {
        testId,
        userAnswers,
        flaggedQuestions,
        isSubmitted,
        submittedAt,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(sessionData));
    } catch (e) {
      console.error('Failed to save listening session', e);
    }
  }, [testId, userAnswers, flaggedQuestions, isSubmitted, submittedAt, storageKey]);

  // 3. User Actions
  const setAnswer = useCallback((order, value) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [order]: value
    }));
  }, [isSubmitted]);

  const toggleFlag = useCallback((order) => {
    if (isSubmitted) return;
    setFlaggedQuestions(prev => ({
      ...prev,
      [order]: !prev[order]
    }));
  }, [isSubmitted]);

  const resetExam = useCallback(() => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setSubmittedAt(null);
    setActiveQuestionOrder(1);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {}
  }, [storageKey]);

  const submitExam = useCallback(() => {
    setIsSubmitted(true);
    setSubmittedAt(new Date().toISOString());
  }, []);

  // 4. Keyboard Shortcuts for Ergonomics
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid triggering when user is actively typing in an input
      const target = e.target;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      // Key 'f' to toggle flag
      if (!isInput && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        toggleFlag(activeQuestionOrder);
      }

      // Space to play/pause in practice mode
      if (!isInput && e.code === 'Space' && examMode === 'practice' && audioEngine) {
        e.preventDefault();
        audioEngine.togglePlay();
      }

      // Left / Right arrow keys to jump ±5s in practice mode
      if (!isInput && examMode === 'practice' && audioEngine) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          audioEngine.seek(audioEngine.currentTime - 5);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          audioEngine.seek(audioEngine.currentTime + 5);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuestionOrder, toggleFlag, examMode, audioEngine]);

  // Total questions count and answered count
  const answeredCount = useMemo(() => {
    return Object.values(userAnswers).filter(val => typeof val === 'string' ? val.trim().length > 0 : !!val).length;
  }, [userAnswers]);

  return {
    userAnswers,
    setAnswer,
    flaggedQuestions,
    toggleFlag,
    activeQuestionOrder,
    setActiveQuestionOrder,
    isSubmitted,
    submittedAt,
    answeredCount,
    resetExam,
    submitExam
  };
}
