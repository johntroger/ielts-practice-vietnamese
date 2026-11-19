import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * HeadingInfoTip
 * Reusable compact info indicator ('i') placed at the end of headings.
 * - Desktop: Hover popover (pointerType === 'mouse') or click toggle.
 * - Mobile (< sm): Centered modal/bottom-sheet popover with backdrop tap-to-close,
 *   preventing left/right viewport clipping and touch double-tap conflicts.
 */
export default function HeadingInfoTip({
  content,
  title,
  className = '',
  dark = false,
  isEn = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('pointerdown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  if (!content) return null;

  return (
    <span ref={containerRef} className={`relative inline-flex items-center ml-1.5 align-middle select-none shrink-0 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setIsOpen(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setIsOpen(false);
        }}
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-help p-0 text-[10px] sm:text-[11px] font-serif italic font-bold shrink-0 shadow-2xs ${
          dark
            ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/70 hover:border-slate-400'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-300/80 hover:border-slate-400'
        }`}
        title={typeof content === 'string' ? content : undefined}
        aria-label={isEn ? "Information" : "Thông tin chi tiết"}
        aria-expanded={isOpen}
      >
        <span className="leading-none select-none">i</span>
      </button>

      {isOpen && (
        <>
          {/* Mobile (< sm): Safe Centered Bottom Sheet / Floating Card */}
          <div
            className="sm:hidden fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-[2px] flex items-end justify-center p-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <div
              role="tooltip"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm p-4 bg-slate-900 text-slate-100 text-xs font-normal rounded-2xl shadow-2xl border border-slate-700 text-left leading-relaxed normal-case tracking-normal animate-in slide-in-from-bottom-4 duration-150"
            >
              <div className="flex items-center justify-between gap-2 mb-2 border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300 text-sm">
                  {title || (isEn ? 'Details' : 'Thông tin chi tiết')}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-1.5 -mr-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  aria-label={isEn ? 'Close' : 'Đóng'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="block text-slate-200 font-sans whitespace-pre-line text-xs leading-relaxed">
                {content}
              </span>
            </div>
          </div>

          {/* Desktop / Tablet (sm+): Hover Popover */}
          <span
            role="tooltip"
            className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50 w-72 md:w-80 max-w-[calc(100vw-2rem)] p-2.5 bg-slate-950/95 text-slate-100 text-xs font-normal rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-sm pointer-events-none text-left leading-relaxed normal-case tracking-normal animate-in fade-in zoom-in-95"
          >
            {title && (
              <span className="block font-bold text-amber-300 mb-1 border-b border-slate-800 pb-1">
                {title}
              </span>
            )}
            <span className="block text-slate-200 font-sans whitespace-pre-line text-xs">
              {content}
            </span>
          </span>
        </>
      )}
    </span>
  );
}
