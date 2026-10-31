import React, { useState } from 'react';

/**
 * HeadingInfoTip
 * Reusable compact info indicator ('i') placed at the end of headings.
 * Displays the description inside a floating popover on hover (desktop) or tap (mobile),
 * decluttering subtitle text beneath headers while preserving full accessibility and context.
 */
export default function HeadingInfoTip({
  content,
  title,
  className = '',
  dark = false,
  isEn = false
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <span className={`relative inline-flex items-center ml-1.5 align-middle select-none shrink-0 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center transition-all cursor-help p-0 text-[10px] sm:text-[11px] font-serif italic font-bold shrink-0 shadow-2xs ${
          dark
            ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/70 hover:border-slate-400'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-300/80 hover:border-slate-400'
        }`}
        title={typeof content === 'string' ? content : undefined}
        aria-label={isEn ? "Information" : "Thông tin chi tiết"}
      >
        <span className="leading-none select-none">i</span>
      </button>

      {isOpen && (
        <span
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50 w-64 sm:w-80 p-2.5 bg-slate-950/95 text-slate-100 text-xs font-normal rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-sm pointer-events-none text-left leading-relaxed normal-case tracking-normal animate-in fade-in zoom-in-95"
        >
          {title && (
            <span className="block font-bold text-amber-300 mb-1 border-b border-slate-800 pb-1">
              {title}
            </span>
          )}
          <span className="block text-slate-200 font-sans whitespace-pre-line text-[11px] sm:text-xs">
            {content}
          </span>
        </span>
      )}
    </span>
  );
}
