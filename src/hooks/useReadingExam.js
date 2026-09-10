import { useState, useEffect, useCallback, useMemo } from 'react';
import { calculateReadingBandScore } from '../data/readingTasks';

const STORAGE_PREFIX = 'ielts_reading_session_';

export function useReadingExam({
  testId = 'cambridge-academic-test-1',
  totalTimeMinutes = 60,
  questionsData = []
}) {
  const storageKey = `${STORAGE_PREFIX}${testId}`;

  // Load initial state from localStorage if available
  const [userAnswers, setUserAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.userAnswers || {};
      }
    } catch (e) {
      console.error('Error reading session from localStorage', e);
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

  const [timeRemaining, setTimeRemaining] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.timeRemaining === 'number' && parsed.timeRemaining > 0 && !parsed.isSubmitted) {
          return parsed.timeRemaining;
        }
      }
    } catch (e) {}
    return totalTimeMinutes * 60;
  });

  const [isRunning, setIsRunning] = useState(false);
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

  // Persist session to localStorage
  useEffect(() => {
    try {
      const sessionData = {
        testId,
        userAnswers,
        flaggedQuestions,
        timeRemaining,
        isSubmitted,
        submittedAt,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(sessionData));
    } catch (e) {
      console.error('Failed to save reading session', e);
    }
  }, [testId, userAnswers, flaggedQuestions, timeRemaining, isSubmitted, submittedAt, storageKey]);

  // Timer countdown loop
  useEffect(() => {
    let interval = null;
    if (isRunning && !isSubmitted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            setIsSubmitted(true);
            setSubmittedAt(new Date().toISOString());
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isSubmitted, timeRemaining]);

  const toggleTimer = useCallback(() => {
    if (!isSubmitted) {
      setIsRunning(prev => !prev);
    }
  }, [isSubmitted]);

  const handleAnswerChange = useCallback((questionOrder, value) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionOrder]: value
    }));
    // Auto start timer on first answer if not running
    setIsRunning(prev => (!prev && !isSubmitted ? true : prev));
  }, [isSubmitted]);

  const handleToggleFlag = useCallback((questionOrder) => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [questionOrder]: !prev[questionOrder]
    }));
  }, []);

  const handleSubmitExam = useCallback(() => {
    setIsRunning(false);
    setIsSubmitted(true);
    setSubmittedAt(new Date().toISOString());
  }, []);

  const handleResetExam = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn làm lại từ đầu? Toàn bộ câu trả lời sẽ được làm mới.')) {
      setUserAnswers({});
      setFlaggedQuestions({});
      setTimeRemaining(totalTimeMinutes * 60);
      setIsRunning(false);
      setIsSubmitted(false);
      setSubmittedAt(null);
      localStorage.removeItem(storageKey);
    }
  }, [totalTimeMinutes, storageKey]);

  // Band Score Calculation
  const bandResult = useMemo(() => {
    if (!isSubmitted || !questionsData || questionsData.length === 0) return null;

    let correctCount = 0;
    const questionsBreakdown = questionsData.map(q => {
      const uAns = userAnswers[q.order];
      let isCorrect = false;

      if (Array.isArray(uAns)) {
        const correctArr = Array.isArray(q.answer) ? q.answer : [q.answer];
        isCorrect = uAns.length === correctArr.length && uAns.every(a => correctArr.includes(a));
      } else if (uAns) {
        isCorrect = (
          String(uAns).trim().toLowerCase() === String(q.answer).trim().toLowerCase() ||
          (q.acceptableAnswers && q.acceptableAnswers.some(a => a.toLowerCase() === String(uAns).trim().toLowerCase()))
        );
      }

      if (isCorrect) correctCount++;

      return {
        order: q.order,
        questionId: q.id,
        passageNumber: q.passageNumber || 1,
        questionType: q.type || 'standard',
        questionText: q.questionText,
        userAnswer: uAns || null,
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation || '',
        evidenceParagraph: q.evidenceParagraph || ''
      };
    });

    const totalQuestions = questionsData.length;
    const band = calculateReadingBandScore(correctCount);
    const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);
    const totalTimeSeconds = totalTimeMinutes * 60;
    const timeSpentSeconds = totalTimeSeconds - timeRemaining;

    // Breakdown per Passage (Passage 1, 2, 3)
    const passageStats = [1, 2, 3].map(pNum => {
      const pQuestions = questionsBreakdown.filter(q => q.passageNumber === pNum);
      const pCorrect = pQuestions.filter(q => q.isCorrect).length;
      return {
        passageNumber: pNum,
        total: pQuestions.length,
        correct: pCorrect,
        accuracy: pQuestions.length > 0 ? Math.round((pCorrect / pQuestions.length) * 100) : 0
      };
    });

    return {
      correctCount,
      totalQuestions,
      band,
      accuracyPercent,
      timeSpentSeconds,
      passageStats,
      questionsBreakdown
    };
  }, [isSubmitted, questionsData, userAnswers, totalTimeMinutes, timeRemaining]);

  return {
    userAnswers,
    flaggedQuestions,
    timeRemaining,
    isRunning,
    isSubmitted,
    submittedAt,
    bandResult,
    toggleTimer,
    handleAnswerChange,
    handleToggleFlag,
    handleSubmitExam,
    handleResetExam,
    setTimeRemaining,
    setIsRunning
  };
}
