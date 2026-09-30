import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, Move } from 'lucide-react';

export default function ImageViewerModal({
  isOpen,
  onClose,
  imageUrl,
  title = 'Hình ảnh đề bài Task 1'
}) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setScale(1);
    }
  }, [isOpen, imageUrl]);

  // Keyboard shortcuts (+, -, 0, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(4, Math.round((prev + 0.25) * 100) / 100));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, Math.round((prev - 0.25) * 100) / 100));
  };

  const handleReset = () => {
    setScale(1);
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  // Drag to pan when zoomed
  const handleMouseDown = (e) => {
    if (scale <= 1 || !containerRef.current) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setScrollPos({
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    containerRef.current.scrollLeft = scrollPos.left - dx;
    containerRef.current.scrollTop = scrollPos.top - dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl max-w-6xl w-full h-[94vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Toolbar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0 z-10">
          <div className="flex items-center space-x-2.5 truncate max-w-xs sm:max-w-md md:max-w-lg">
            <span className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400">
              <Maximize2 className="w-4 h-4" />
            </span>
            <span className="text-xs sm:text-sm font-bold truncate">
              {title}
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
              title="Thu nhỏ (Phím -)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="px-2 py-0.5 text-xs font-mono font-bold text-slate-200 min-w-[52px] text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale >= 4}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
              title="Phóng to (Phím +)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700 mx-0.5" />

            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-1 rounded-lg hover:bg-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors flex items-center space-x-1"
              title="Đặt lại kích thước gốc 100% (Phím 0)"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">100%</span>
            </button>
          </div>

          {/* Close button with 40px touch target for mobile ergonomics */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Canvas */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950/60 relative ${
            scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
          }`}
        >
          <div
            className="transition-transform duration-150 ease-out origin-center flex items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              minWidth: '100%',
              minHeight: '100%'
            }}
            onDoubleClick={() => setScale(prev => (prev === 1 ? 2 : 1))}
          >
            <img
              src={imageUrl}
              alt={title}
              draggable={false}
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl shadow-2xl pointer-events-none"
            />
          </div>

          {/* Helper hint for drag when zoomed */}
          {scale > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] flex items-center space-x-1.5 shadow-lg pointer-events-none">
              <Move className="w-3.5 h-3.5 text-blue-400" />
              <span>Kéo chuột để di chuyển xem các góc chữ • Cuộn chuột hoặc +/- để phóng to</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
