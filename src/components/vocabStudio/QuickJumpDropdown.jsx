import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Check, X, Sparkles } from 'lucide-react';
import { getLocalizedGrammarTitle } from '../../utils/vocabLocalization';

export default function QuickJumpDropdown({
  isOpen,
  onClose,
  items = [],
  currentIndex = 0,
  onSelectIndex,
  masteredIds = [],
  isEn = false,
  type = 'grammar'
}) {
  const [search, setSearch] = useState('');
  const activeItemRef = useRef(null);
  const searchInputRef = useRef(null);

  // Auto-focus search input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Auto-scroll to active item when opened
  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Extract clean localized title for each item
  const getItemDetails = (item, idx) => {
    let title = '';
    let badge = '';

    if (type === 'grammar') {
      const raw = item.title || item.titleEn || `Rule ${idx + 1}`;
      title = getLocalizedGrammarTitle(raw, isEn);
      badge = item.bandTarget || (item.bandLevel ? `Band ${item.bandLevel}` : 'Band 7.0+');
    } else if (type === 'spelling') {
      title = item.correct || item.term || `Trap ${idx + 1}`;
      badge = item.bandLevel ? `Band ${item.bandLevel}` : item.category || 'Band 6.5';
    } else if (type === 'vocab') {
      title = item.term || item.title || `Card ${idx + 1}`;
      badge = item.bandScore || item.bandLevel ? `Band ${item.bandScore || item.bandLevel}` : 'Band 7.0';
    } else {
      title = item.questionStem ? `${item.questionStem} ➔ ${item.passageMatch}` : (item.term || `Pair ${idx + 1}`);
      badge = item.category || (isEn ? 'Reading' : 'Đọc hiểu');
    }

    return { title, badge };
  };

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items.map((item, idx) => ({ item, originalIdx: idx }));
    const q = search.trim().toLowerCase();
    return items
      .map((item, idx) => ({ item, originalIdx: idx }))
      .filter(({ item, originalIdx }) => {
        const { title, badge } = getItemDetails(item, originalIdx);
        const numStr = String(originalIdx + 1);
        return (
          numStr === q ||
          title.toLowerCase().includes(q) ||
          badge.toLowerCase().includes(q) ||
          (item.correct && item.correct.toLowerCase().includes(q)) ||
          (item.term && item.term.toLowerCase().includes(q)) ||
          (item.questionStem && item.questionStem.toLowerCase().includes(q))
        );
      });
  }, [items, search, type, isEn]);

  if (!isOpen) return null;

  const typeLabels = {
    grammar: {
      en: 'Grammar Architectures',
      vi: 'Kiến Trúc Ngữ Pháp',
      placeholderEn: 'Search rule name or # (e.g. 12, inversion, relative)...',
      placeholderVi: 'Tìm tên bài hoặc số thứ tự (ví dụ: 12, đảo ngữ)...'
    },
    spelling: {
      en: 'Listening Spelling Demons',
      vi: 'Bẫy Chính Tả Listening',
      placeholderEn: 'Search spelling trap (e.g. accommodate, rhythm)...',
      placeholderVi: 'Tìm từ chính tả (ví dụ: accommodate, rhythm)...'
    },
    vocab: {
      en: 'Thematic Flashcards',
      vi: 'Thẻ Từ Vựng Chuyên Đề',
      placeholderEn: 'Search vocabulary phrase or collocation...',
      placeholderVi: 'Tìm cụm từ vựng hoặc collocation...'
    },
    synonyms: {
      en: 'Cambridge Paraphrase Pairs',
      vi: 'Cặp Paraphrase Cambridge',
      placeholderEn: 'Search synonym keyword transformation...',
      placeholderVi: 'Tìm từ đồng nghĩa hoặc câu hỏi...'
    }
  };

  const currentTypeInfo = typeLabels[type] || typeLabels.grammar;

  return (
    <>
      {/* Semi-transparent backdrop for mobile and backdrop click */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
        aria-hidden="true"
      />

      {/* Floating Dropdown Card */}
      <div
        className="fixed inset-x-3 top-20 sm:top-24 bottom-20 sm:bottom-auto sm:inset-x-auto sm:absolute sm:top-full sm:left-3 sm:mt-2 sm:w-[460px] sm:max-h-[460px] bg-white rounded-2xl border border-[#d9e3e4] shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Dropdown Header */}
        <div className="p-3 sm:p-3.5 bg-[#f7f5ef] border-b border-[#e5e9ea] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-lg bg-[#004646] text-[#27c4b5] flex items-center justify-center font-black text-xs shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-extrabold text-xs text-[#004646] tracking-tight">
              {isEn ? currentTypeInfo.en : currentTypeInfo.vi}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-[#d9e3e4]">
              {items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label={isEn ? "Close selector" : "Đóng"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 sm:p-3 border-b border-[#e5e9ea] bg-white shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? currentTypeInfo.placeholderEn : currentTypeInfo.placeholderVi}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-white rounded-xl border border-[#d9e3e4] text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:border-[#27c4b5] focus:bg-white transition-colors shadow-2xs font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-transparent">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-medium">
              {isEn ? 'No matching items found.' : 'Không tìm thấy kết quả phù hợp.'}
            </div>
          ) : (
            filteredItems.map(({ item, originalIdx }) => {
              const isSelected = originalIdx === currentIndex;
              const isMastered = item.id ? masteredIds.includes(item.id) : false;
              const { title, badge } = getItemDetails(item, originalIdx);

              return (
                <button
                  key={item.id || originalIdx}
                  ref={isSelected ? activeItemRef : null}
                  type="button"
                  onClick={() => onSelectIndex(originalIdx)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2.5 border group ${
                    isSelected
                      ? 'bg-[#e6f5f3] border-[#27c4b5] shadow-xs ring-1 ring-[#27c4b5]/30'
                      : 'bg-white hover:bg-slate-50 border-transparent hover:border-[#e5e9ea]'
                  }`}
                >
                  {/* Left: Number & Title */}
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border ${
                        isSelected
                          ? 'bg-[#004646] text-[#27c4b5] border-[#004646]'
                          : isMastered
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:border-[#27c4b5]/40'
                      }`}
                    >
                      {isMastered ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                      ) : (
                        <span>{String(originalIdx + 1).padStart(2, '0')}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate leading-snug ${
                          isSelected ? 'text-[#004646]' : 'text-slate-800 group-hover:text-[#004646]'
                        }`}
                      >
                        {title}
                      </p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {badge}
                        </span>
                        {isMastered && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {isEn ? 'Mastered' : 'Đã thuộc'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Selected indicator */}
                  {isSelected && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#004646] text-[#27c4b5] shrink-0">
                      {isEn ? 'Active' : 'Đang học'}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Dropdown Footer Tip */}
        <div className="px-3 py-2 bg-[#f7f5ef] border-t border-[#e5e9ea] text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <span>{isEn ? 'Click item to switch' : 'Nhấn vào bài để chuyển'}</span>
          <span className="font-mono text-[10px] text-slate-400">Esc to close</span>
        </div>
      </div>
    </>
  );
}
