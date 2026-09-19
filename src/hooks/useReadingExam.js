import { useState, useEffect, useCallback, useMemo } from 'react';
import { calculateReadingBandScore } from '../data/readingTasks';
import { scoreReadingExam } from '../utils/readingScorer';

const STORAGE_PREFIX = 'ielts_reading_session_';

export function useReadingExam({
  testId = 'cambridge-academic-test-1',
  totalTimeMinutes = 60,
  questionsData = [],
  testData = null
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

  // Band Score Calculation via Standardized Cambridge Reading Scoring Engine
  const bandResult = useMemo(() => {
    if (!isSubmitted || (!questionsData?.length && !testData?.passages?.length)) return null;

    const totalTimeSeconds = totalTimeMinutes * 60;
    const timeSpentSeconds = Math.max(0, totalTimeSeconds - timeRemaining);

    return scoreReadingExam({
      testData,
      questionsData,
      userAnswers,
      timeSpentSeconds,
      totalTimeMinutes,
      moduleType: testData?.moduleType || testData?.module || 'academic'
    });
  }, [isSubmitted, testData, questionsData, userAnswers, totalTimeMinutes, timeRemaining]);

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
