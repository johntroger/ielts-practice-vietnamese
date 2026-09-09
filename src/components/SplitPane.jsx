import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, PenLine, Columns } from 'lucide-react';

export default function SplitPane({ leftPane, rightPane, defaultSplit = 50 }) {
  const [splitRatio, setSplitRatio] = useState(defaultSplit); // percentage for left pane
  // Mobile active tab: 'both' | 'editor' | 'prompt'
  const [mobileTab, setMobileTab] = useState('both'); 
  const isDragging = useRef(false);
  const containerRef = useRef(null);

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
    // Constrain between 30% and 70%
    if (newRatio >= 28 && newRatio <= 72) {
      setSplitRatio(newRatio);
    }
  };

  useEffect(() => {
    const onMove = (e) => handleMouseMove(e);
    const onUp = () => stopDragging();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full min-h-0">
      
      {/* MOBILE ONLY: Segmented View Controller (Tiêu điểm làm bài trên mobile) */}
      <div className="lg:hidden bg-slate-200/80 p-1.5 flex items-center justify-center border-b border-slate-300 gap-1 sticky top-[105px] z-20 backdrop-blur-md">
        <button
          onClick={() => setMobileTab('both')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === 'both' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Đề & Bài Viết</span>
        </button>

        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === 'editor' 
              ? 'bg-white text-red-700 shadow-sm ring-1 ring-red-200' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PenLine className="w-3.5 h-3.5 text-red-600" />
          <span>Soạn Bài Rộng Rãi</span>
        </button>

        <button
          onClick={() => setMobileTab('prompt')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === 'prompt' 
              ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-200' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Xem Đề Bài</span>
        </button>
      </div>

      {/* Main Two-Pane Container */}
      <div 
        ref={containerRef} 
        className="flex flex-col lg:flex-row flex-1 w-full relative lg:overflow-hidden lg:h-[calc(100vh-64px)]"
      >
        {/* Left Pane (Prompt / Chart / Notes) */}
        <div 
          className={`w-full lg:h-full shrink-0 lg:shrink overflow-y-auto bg-white border-b lg:border-b-0 lg:border-r border-slate-200 transition-all ${
            mobileTab === 'editor' ? 'hidden lg:block' : 'block'
          }`}
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${splitRatio}%` : '100%' }}
        >
          {leftPane}
        </div>

        {/* Resizer Handle for Desktop */}
        <div
          onMouseDown={startDragging}
          className="hidden lg:flex items-center justify-center w-2 hover:w-2.5 bg-slate-200 hover:bg-red-500 cursor-col-resize transition-all z-20 group relative select-none"
          title="Kéo thả để chỉnh độ rộng 2 màn hình"
        >
          <div className="h-10 w-1 bg-slate-400 group-hover:bg-white rounded-full transition-colors"></div>
        </div>

        {/* Right Pane (Editor / Stats / Tools) */}
        <div 
          className={`w-full overflow-y-auto bg-slate-50/50 flex flex-col flex-1 transition-all ${
            mobileTab === 'prompt' ? 'hidden lg:flex' : 'flex'
          } ${mobileTab === 'editor' ? 'min-h-[75vh]' : 'min-h-[620px]'} lg:min-h-0 lg:h-full`}
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 - splitRatio}%` : '100%' }}
        >
          {rightPane}
        </div>
      </div>

    </div>
  );
}
