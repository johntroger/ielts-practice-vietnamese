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
      
      {/* MOBILE ONLY: Sticky Segmented View Controller (Tiêu điểm làm bài trên mobile) */}
      <div className="lg:hidden sticky top-14 sm:top-16 bg-white/95 backdrop-blur-md p-1.5 flex items-center justify-center border-b border-slate-200 gap-1.5 shadow-xs z-30">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mobileTab === 'editor' 
              ? 'bg-red-50 text-red-700 shadow-xs border border-red-200 ring-1 ring-red-300' 
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <PenLine className="w-3.5 h-3.5 text-red-600" />
          <span>Soạn Bài</span>
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
          <span>Xem Đề Bài</span>
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
          <span>Chia Đôi</span>
        </button>
      </div>

      {/* Main Two-Pane Container */}
      <div 
        ref={containerRef} 
        className="flex flex-col lg:flex-row flex-1 w-full relative lg:min-h-[740px] xl:min-h-[840px]"
      >
        {/* Left Pane (Prompt / Chart / Notes) */}
        <div 
          className={`w-full lg:min-h-[740px] xl:min-h-[840px] shrink-0 lg:shrink overflow-y-auto bg-white border-b lg:border-b-0 lg:border-r border-slate-200 transition-all ${
            mobileTab === 'editor' ? 'hidden lg:block' : 'block'
          } ${mobileTab === 'both' ? 'max-h-[48vh] lg:max-h-none' : ''}`}
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
          } ${mobileTab === 'editor' ? 'min-h-[calc(100vh-140px)]' : mobileTab === 'both' ? 'min-h-[50vh]' : 'min-h-[620px]'} lg:min-h-[740px] xl:min-h-[840px]`}
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 - splitRatio}%` : '100%' }}
        >
          {rightPane}
        </div>
      </div>

    </div>
  );
}
