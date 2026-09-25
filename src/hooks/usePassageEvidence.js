import { useState, useCallback } from 'react';

/**
 * Dedicated Custom Hook for IELTS Reading Passage Evidence Locating & Question Jumping
 * Decouples DOM element scrolling, paragraph highlighting, and responsive tab switching.
 */
export function usePassageEvidence({
  onSwitchToPassage = null,
  onSwitchToQuestions = null
} = {}) {
  const [activeEvidencePara, setActiveEvidencePara] = useState(null);

  /**
   * Jump to passage paragraph evidence and highlight it
   * @param {string|number} paraId - Identifier of paragraph (e.g. 'A', 'B', '1', '2')
   */
  const locateEvidence = useCallback((paraId) => {
    setActiveEvidencePara(paraId);

    // If mobile/tablet view requires tab switching, invoke callback
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onSwitchToPassage) {
      onSwitchToPassage();
    }

    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById(`passage-para-${paraId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [onSwitchToPassage]);

  /**
   * Jump to question card in the question pane
   * @param {number|string} questionOrder - Question number to scroll to
   */
  const jumpToQuestion = useCallback((questionOrder) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && onSwitchToQuestions) {
      onSwitchToQuestions();
    }

    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const el = document.getElementById(`question-card-${questionOrder}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [onSwitchToQuestions]);

  const clearEvidence = useCallback(() => {
    setActiveEvidencePara(null);
  }, []);

  return {
    activeEvidencePara,
    setActiveEvidencePara,
    locateEvidence,
    jumpToQuestion,
    clearEvidence
  };
}
