import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, PenLine, Columns } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function SplitPane({ leftPane, rightPane, defaultSplit = 50 }) {
  const { t, isEn } = useTranslation();
  const [splitRatio, setSplitRatio] = useState(defaultSplit); // percentage for left pane
  // Mobile active tab: 'both' | 'editor' | 'prompt'
  const [mobileTab, setMobileTab] = useState('both'); 
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Responsive state for screen width >= 768px (Tablets portrait/landscape and Desktops)
  const [isTabletOrDesktop, setIsTabletOrDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const startDragging = (e) => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const stopDragging = () => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
    // Constrain between 28% and 72%
    if (newRatio >= 28 && newRatio <= 72) {
      setSplitRatio(newRatio);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !containerRef.current || !e.touches || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newRatio = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    if (newRatio >= 28 && newRatio <= 72) {
      setSplitRatio(newRatio);
    }
  };

  useEffect(() => {
    const onMove = (e) => handleMouseMove(e);
    const onTouch = (e) => handleTouchMove(e);
    const onUp = () => stopDragging();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full min-h-0 h-full overflow-hidden">
      
      {/* MOBILE ONLY (< 768px): Segmented View Controller */}
      <div className="md:hidden bg-slate-50/90 backdrop-blur-xs p-1.5 flex items-center justify-center border-b border-slate-200 gap-1.5 shadow-2xs shrink-0 z-10">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === 'editor' 
              ? 'bg-red-50 text-red-700 shadow-xs border border-red-200 ring-1 ring-red-300' 
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <PenLine className="w-3.5 h-3.5 text-red-600" />
          <span>{isEn ? 'Editor' : 'Soạn Bài'}</span>
        </button>

        <button
          onClick={() => setMobileTab('prompt')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === 'prompt' 
              ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200 ring-1 ring-blue-300' 
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>{isEn ? 'Task Prompt' : 'Xem Đề Bài'}</span>
        </button>

        <button
          onClick={() => setMobileTab('both')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === 'both' 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>{isEn ? 'Split View' : 'Chia Đôi'}</span>
        </button>
      </div>

      {/* Main Two-Pane Container */}
      <div 
        ref={containerRef} 
        className="flex flex-col md:flex-row flex-1 w-full h-full min-h-0 relative overflow-hidden"
      >
        {/* Left Pane (Prompt / Chart / Notes) */}
        <div 
          className={`w-full md:h-full shrink-0 md:shrink overflow-y-auto bg-white border-b md:border-b-0 md:border-r border-slate-200 transition-all ${
            mobileTab === 'editor' ? 'hidden md:block' : 'block'
          } ${mobileTab === 'both' ? 'max-h-[46vh] md:max-h-none' : ''}`}
          style={{ width: isTabletOrDesktop ? `${splitRatio}%` : '100%' }}
        >
          {leftPane}
        </div>

        {/* Resizer Handle for Desktop & Tablet */}
        <div
          onMouseDown={startDragging}
          onTouchStart={startDragging}
          className="hidden md:flex items-center justify-center w-2 hover:w-2.5 bg-slate-200 hover:bg-red-500 cursor-col-resize transition-all z-20 group relative select-none touch-none shrink-0"
          title={isEn ? "Drag to resize split panes" : "Kéo thả để chỉnh độ rộng 2 màn hình"}
        >
          <div className="h-10 w-1 bg-slate-400 group-hover:bg-white rounded-full transition-colors"></div>
        </div>

        {/* Right Pane (Editor / Stats / Tools) */}
        <div 
          className={`w-full md:h-full overflow-y-auto bg-slate-50/50 flex flex-col flex-1 min-h-0 transition-all ${
            mobileTab === 'prompt' ? 'hidden md:flex' : 'flex'
          } ${mobileTab === 'editor' ? 'min-h-[calc(100vh-140px)] md:min-h-0' : mobileTab === 'both' ? 'min-h-[48vh] md:min-h-0' : 'min-h-[300px] md:min-h-0'}`}
          style={{ width: isTabletOrDesktop ? `${100 - splitRatio}%` : '100%' }}
        >
          {rightPane}
        </div>
      </div>

    </div>
  );
}
