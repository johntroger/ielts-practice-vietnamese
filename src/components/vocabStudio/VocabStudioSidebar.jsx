import React, { useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Check,
  ChevronRight,
  X
} from 'lucide-react';
import { getLocalizedGrammarTitle, getLocalizedDeckTopicName } from '../../utils/vocabLocalization';

export default function VocabStudioSidebar({
  isEn,
  t,
  activeTab,
  searchQuery,
  onSearchChange,
  // Spelling category
  spellingCategories = [],
  selectedSpellingCategory,
  onSelectSpellingCategory,
  // Vocab decks
  vocabDecks = [],
  selectedDeckId,
  onSelectDeckId,
  // Items in active track
  items = [],
  currentIndex = 0,
  onSelectIndex,
  masteredIds = [],
  hideMastered,
  onToggleHideMastered,
  isMobileOpen = false,
  onCloseMobile
}) {
  // Alternating palette for index chips (ForumFlash style: Mint, Coral, Yellow, Teal)
  const getIndexBadgeColor = (idx, isSelected, isMastered) => {
    if (isMastered) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (isSelected) return 'bg-[#27c4b5] text-[#003838] font-black shadow-xs';
    const cycle = idx % 4;
    if (cycle === 0) return 'bg-[#e6f5f3] text-[#004646] border-[#27c4b5]/40';
    if (cycle === 1) return 'bg-rose-50 text-rose-800 border-rose-200';
    if (cycle === 2) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-purple-50 text-purple-800 border-purple-200';
  };

  // Compute mastered in current filtered list
  const masteredInList = useMemo(() => {
    return items.filter(item => masteredIds.includes(item.id)).length;
  }, [items, masteredIds]);

  // Partition vocab decks for categorized selection
  const coreDecks = useMemo(() => vocabDecks.filter(d => !d.id.startsWith('deck-hl-')), [vocabDecks]);
  const hlPart1Decks = useMemo(() => vocabDecks.filter(d => {
    if (!d.id.startsWith('deck-hl-w')) return false;
    const num = parseInt(d.id.replace('deck-hl-w', ''), 10);
    return num <= 26;
  }), [vocabDecks]);
  const hlPart2Decks = useMemo(() => vocabDecks.filter(d => {
    if (!d.id.startsWith('deck-hl-w')) return false;
    const num = parseInt(d.id.replace('deck-hl-w', ''), 10);
    return num > 26;
  }), [vocabDecks]);

  const getDeckLabel = (deck) => {
    const count = deck.cards?.length || 0;
    const name = getLocalizedDeckTopicName(deck, isEn);
    return `${name} (${count})`;
  };

  const trackNames = {
    spelling: isEn ? '100 Spelling Traps' : '100 Bẫy chính tả',
    grammar: isEn ? 'Grammar Architecture' : 'Ngữ pháp điểm tựa',
    vocab: isEn ? 'Thematic Vocab' : 'Từ vựng chủ đề',
    synonyms: isEn ? 'Cambridge Paraphrase' : 'Cặp từ Paraphrase'
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-auto w-[300px] sm:w-[320px] shrink-0 bg-[#fffdfa] border-r border-[#e5e9ea] flex flex-col h-full transition-transform duration-200 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOPIC RAIL HEAD (ForumFlash style Deep Teal rounded card) */}
        <div className="p-3.5 sm:p-4 shrink-0">
          <div className="relative bg-[#004646] text-white p-4 rounded-2xl overflow-hidden shadow-xs">
            {/* Subtle background ornament */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full border border-white/10 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#27c4b5] font-black">
                {isEn ? 'IELTS DIRECTORY' : 'THƯ VIỆN BÀI HỌC'}
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="relative z-10 text-base font-black text-white mt-1">
              {trackNames[activeTab] || (isEn ? 'Lesson Directory' : 'Danh mục bài học')}
            </h3>
            <p className="relative z-10 text-[11px] text-teal-100/75 mt-0.5">
              {items.length} {isEn ? 'interactive items' : 'bài học thực hành'}
            </p>
          </div>
        </div>

        {/* SEARCH & SUB-FILTERS (Minimalist & Compact) */}
        <div className="px-3.5 pb-2.5 space-y-2 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isEn ? 'Search in this track...' : 'Tìm kiếm nhanh...'}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white rounded-xl border border-[#d9e3e4] text-[#0f172a] placeholder:text-slate-400 focus:outline-none focus:border-[#27c4b5] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sub-category Filter for Spelling Track */}
          {activeTab === 'spelling' && spellingCategories.length > 0 && (
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
              {spellingCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectSpellingCategory(cat.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer transition-colors ${
                    selectedSpellingCategory === cat.id
                      ? 'bg-[#004646] text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-[#d9e3e4]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Sub-category Filter for Vocab Track (Decks) */}
          {activeTab === 'vocab' && vocabDecks.length > 0 && (
            <select
              value={selectedDeckId}
              onChange={(e) => onSelectDeckId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white rounded-xl border border-[#d9e3e4] text-[#004646] font-bold focus:outline-none cursor-pointer shadow-2xs"
            >
              {coreDecks.length > 0 && (
                <optgroup label={isEn ? `IELTS Thematic Focus (${coreDecks.length})` : `Chuyên đề IELTS Trọng tâm (${coreDecks.length})`}>
                  {coreDecks.map(deck => (
                    <option key={deck.id} value={deck.id}>
                      📚 {getDeckLabel(deck)}
                    </option>
                  ))}
                </optgroup>
              )}
              {hlPart1Decks.length > 0 && (
                <optgroup label={isEn ? `Harold Levine 22,000 Words • Part 1 (${hlPart1Decks.length} Weeks)` : `Harold Levine 22.000 Từ • Phần 1 (${hlPart1Decks.length} Tuần)`}>
                  {hlPart1Decks.map(deck => (
                    <option key={deck.id} value={deck.id}>
                      🎓 {getDeckLabel(deck)}
                    </option>
                  ))}
                </optgroup>
              )}
              {hlPart2Decks.length > 0 && (
                <optgroup label={isEn ? `Harold Levine 22,000 Words • Part 2 (${hlPart2Decks.length} Weeks)` : `Harold Levine 22.000 Từ • Phần 2 (${hlPart2Decks.length} Tuần)`}>
                  {hlPart2Decks.map(deck => (
                    <option key={deck.id} value={deck.id}>
                      ⚡ {getDeckLabel(deck)}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          )}
        </div>

        {/* VERTICAL ITEM EXPLORER (ForumFlash style clean cards) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-1 space-y-1.5 focus:outline-none scroll-smooth">
          {items.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <p>{isEn ? 'No items match your filter.' : 'Không có bài học phù hợp.'}</p>
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = currentIndex === idx;
              const isMastered = masteredIds.includes(item.id);
              const badgeColor = getIndexBadgeColor(idx, isSelected, isMastered);

              // Title resolution with strict English mode support
              let itemTitle = '';
              if (activeTab === 'grammar') {
                itemTitle = isEn
                  ? (item.titleEn || getLocalizedGrammarTitle(item.title, true))
                  : (item.title || item.titleEn);
              } else if (activeTab === 'spelling') {
                itemTitle = item.correct || item.term || `Item ${idx + 1}`;
              } else if (activeTab === 'vocab') {
                itemTitle = item.term || item.title || `Item ${idx + 1}`;
              } else {
                itemTitle = item.questionStem || item.term || item.title || `Item ${idx + 1}`;
              }

              if (typeof itemTitle === 'string') {
                itemTitle = itemTitle.replace(/^Unit\s+\d+:\s*/i, '').replace(/^Unit\s+\d+\s*[-–•]\s*/i, '');
                if (isEn) {
                  if (activeTab === 'grammar') {
                    itemTitle = getLocalizedGrammarTitle(itemTitle, true);
                  } else if (itemTitle.includes('(')) {
                    const enChunk = itemTitle.split('(')[0].trim();
                    if (enChunk.length > 3) itemTitle = enChunk;
                  }
                  itemTitle = itemTitle.replace(/^Unit\s+\d+:\s*/i, '').replace(/^Unit\s+\d+\s*[-–•]\s*/i, '');
                }
              }
              
              // Clean subtitle without duplication
              const subText = item.bandLevel ? `Band ${item.bandLevel}` : (item.bandTarget ? `Band ${item.bandTarget}` : item.category || '');

              return (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => {
                    onSelectIndex(idx);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full text-left rounded-xl p-2.5 transition-all duration-150 cursor-pointer flex items-center justify-between gap-2.5 border group ${
                    isSelected
                      ? 'bg-[#e6f5f3] border-[#27c4b5] shadow-xs translate-x-1'
                      : 'bg-white hover:bg-slate-50 border-[#e5e9ea] hover:border-[#27c4b5]/50'
                  }`}
                >
                  {/* Left: Number Box & Title */}
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border ${badgeColor}`}>
                      {isMastered ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                      ) : (
                        <span>{String(idx + 1).padStart(2, '0')}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#004646]' : 'text-slate-800'}`}>
                        {itemTitle}
                      </p>
                      {subText && (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {subText}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Status Indicator */}
                  <div className="shrink-0 flex items-center">
                    {isSelected ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27c4b5] animate-ping" />
                    ) : isMastered ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* SIDEBAR FOOTER: PROGRESS & HIDE MASTERED */}
        <div className="p-3 bg-[#f7f5ef] border-t border-[#e5e9ea] shrink-0 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>{isEn ? 'Mastery' : 'Đã thuộc'}</span>
            <span className="text-[#004646]">
              {masteredInList}/{items.length} ({items.length > 0 ? Math.round((masteredInList / items.length) * 100) : 0}%)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-[#27c4b5] transition-all duration-300"
              style={{
                width: `${items.length > 0 ? Math.round((masteredInList / items.length) * 100) : 0}%`
              }}
            />
          </div>

          <label className="flex items-center space-x-2 text-xs text-slate-500 font-semibold cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hideMastered}
              onChange={(e) => onToggleHideMastered(e.target.checked)}
              className="rounded text-[#004646] focus:ring-[#27c4b5] cursor-pointer"
            />
            <span className="text-[11px] select-none">
              {isEn ? 'Hide mastered' : 'Ẩn câu đã thuộc'}
            </span>
          </label>
        </div>
      </aside>
    </>
  );
}
