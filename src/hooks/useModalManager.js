import { useState, useCallback } from 'react';

/**
 * Custom hook to streamline modal state management in IELTS Studio.
 * Eliminates 20+ standalone useState hooks in App.jsx.
 */
export function useModalManager() {
  const [modals, setModals] = useState({});

  const isOpen = useCallback((modalName) => !!modals[modalName], [modals]);

  const open = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const close = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const toggle = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  const closeAll = useCallback(() => {
    setModals({});
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    closeAll,
    modals
  };
}
