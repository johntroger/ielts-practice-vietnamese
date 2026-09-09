import React, { useState, useRef, useEffect } from 'react';

export default function SplitPane({ leftPane, rightPane, defaultSplit = 50 }) {
  const [splitRatio, setSplitRatio] = useState(defaultSplit); // percentage for left pane
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
    <div 
      ref={containerRef} 
      className="flex flex-col lg:flex-row flex-1 w-full relative overflow-y-auto lg:overflow-hidden lg:h-[calc(100vh-64px)]"
    >
      {/* Left Pane (Prompt / Chart / Notes) */}
      <div 
        className="w-full lg:h-full shrink-0 lg:shrink overflow-y-auto bg-white border-b lg:border-b-0 lg:border-r border-slate-200"
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
        className="w-full min-h-[500px] lg:min-h-0 lg:h-full overflow-y-auto bg-slate-50/50 flex flex-col flex-1"
        style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 - splitRatio}%` : '100%' }}
      >
        {rightPane}
      </div>
    </div>
  );
}
