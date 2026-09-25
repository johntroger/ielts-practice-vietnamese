import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCdiTimerStatus } from '../utils/cdiExamSimulator.js';

/**
 * Dedicated Custom Hook for Reading Exam Timing & CDI Timer Alerts
 * Encapsulates countdown format, official CDI 10m/5m warning triggers,
 * and notice banner lifecycle.
 */
export function useReadingExamTimer({
  timeRemaining = 3600,
  isRunning = false,
  isSubmitted = false,
  onTimeExpired = null
}) {
  const [activeCdiNotice, setActiveCdiNotice] = useState(null);

  // Monitor CDI Official Exam Timer Warnings (10m and 5m triggers)
  useEffect(() => {
    if (!isSubmitted && isRunning) {
      const status = getCdiTimerStatus(timeRemaining);
      if (status.noticeText && (!activeCdiNotice || activeCdiNotice.text !== status.noticeText)) {
        setActiveCdiNotice({ text: status.noticeText, severity: status.severity });
      }
    }
  }, [timeRemaining, isSubmitted, isRunning, activeCdiNotice]);

  // Trigger onTimeExpired callback if remaining reaches zero while running
  useEffect(() => {
    if (isRunning && !isSubmitted && timeRemaining <= 0 && onTimeExpired) {
      onTimeExpired();
    }
  }, [timeRemaining, isRunning, isSubmitted, onTimeExpired]);

  // Format timer (MM:SS)
  const formatTimer = useCallback((seconds) => {
    const s = Math.max(0, typeof seconds === 'number' ? seconds : timeRemaining);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  const dismissCdiNotice = useCallback(() => {
    setActiveCdiNotice(null);
  }, []);

  const isLowTime = useMemo(() => {
    return timeRemaining <= 300 && timeRemaining > 0; // Under 5 minutes
  }, [timeRemaining]);

  const isCriticalTime = useMemo(() => {
    return timeRemaining <= 60 && timeRemaining > 0; // Under 1 minute
  }, [timeRemaining]);

  const timerStatus = useMemo(() => {
    return getCdiTimerStatus(timeRemaining);
  }, [timeRemaining]);

  return {
    formatTimer,
    activeCdiNotice,
    setActiveCdiNotice,
    dismissCdiNotice,
    isLowTime,
    isCriticalTime,
    timerStatus
  };
}
