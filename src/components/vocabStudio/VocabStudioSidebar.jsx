import React, { useMemo } from 'react';
import {
  SpellCheck2,
  Award,
  BookOpen,
  Compass,
  Search,
  Filter,
  CheckCircle2,
  Check,
  ChevronRight,
  Flame,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export default function VocabStudioSidebar({
  isEn,
  t,
  activeTab,
  onSelectTab,
  selectedBandTier,
  onSelectBandTier,
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
  // Track Catalog Definition
  const tracks = [
    {
      id: 'spelling',
      icon: SpellCheck2,
      label: isEn ? 'Spelling Demons' : 'Bẫy Chính Tả',
      count: '98',
      color: 'text-rose-500'
    },
    {
      id: 'grammar',
      icon: Award,
      label: isEn ? 'Grammar Scaffold' : 'Ngữ Pháp Điểm Tựa',
      count: '10',
      color: 'text-indigo-500'
    },
    {
      id: 'vocab',
      icon: BookOpen,
      label: isEn ? 'Thematic Vocab' : 'Từ Vựng Thematic',
      count: '24',
      color: 'text-emerald-500'
    },
    {
      id: 'synonyms',
      icon: Compass,
      label: isEn ? 'Cambridge Paraphrase' : 'Cặp Paraphrase',
      count: '50',
      color: 'text-purple-500'
    }
  ];

  // Band Levels
  const bandTiers = [
    { id: 'all', label: isEn ? 'All' : 'Tất cả' },
    { id: 'band-5.5', label: '5.5 - 6.0' },
    { id: 'band-6', label: '6.0 - 6.5' },
    { id: 'band-7', label: '7.0 - 7.5+' }
  ];

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

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-auto w-[310px] sm:w-[330px] shrink-0 bg-[#fffdfa] border-r border-[#d9e3e4] flex flex-col h-full transition-transform duration-200 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* TOPIC RAIL HEAD (ForumFlash style Deep Teal card) */}
        <div className="relative bg-[#004646] text-white p-4 sm:p-5 shrink-0 overflow-hidden shadow-xs">
          {/* Subtle curved background ornament */}
          <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -top-4 -right-2 w-16 h-16 rounded-full border border-white/10 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#27c4b5] font-black">
              {isEn ? 'CAMBRIDGE MASTER STUDY' : 'THƯ VIỆN IELTS CAMBRIDGE'}
            </span>
            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="relative z-10 text-lg font-black text-white mt-1">
            {isEn ? 'Explore Modules' : 'Chọn nội dung học'}
          </h3>
          <p className="relative z-10 text-[11px] text-teal-100/75 mt-0.5">
            {isEn ? '4 skill tracks • 180+ drills & active cards' : '4 phân hệ • 180+ bài tập & thẻ phản xạ'}
          </p>

          {/* SEGMENTED TRACK SWITCHER (Grid 2x2 or 4 buttons) */}
          <div className="relative z-10 grid grid-cols-2 gap-1.5 mt-3.5 bg-black/20 p-1 rounded-xl border border-white/10">
            {tracks.map(trk => {
              const isActive = activeTab === trk.id;
              const IconComp = trk.icon;
              return (
                <button
                  key={trk.id}
                  type="button"
                  onClick={() => onSelectTab(trk.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#27c4b5] text-[#003838] shadow-xs'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate text-[11px]">{trk.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTROLS AREA: BAND FILTER & SEARCH */}
        <div className="p-3 bg-[#f7f4ed] border-b border-[#d9e3e4] space-y-2 shrink-0">
          {/* Band Level Filter */}
          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-xl border border-[#d9e3e4] shadow-2xs">
            {bandTiers.map(tier => (
              <button
                key={tier.id}
                type="button"
                onClick={() => onSelectBandTier(tier.id)}
                className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center whitespace-nowrap ${
                  selectedBandTier === tier.id
                    ? 'bg-[#004646] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isEn ? 'Search words, rules, traps...' : 'Tìm từ vựng, quy tắc, bẫy...'}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white rounded-xl border border-[#d9e3e4] text-[#0f172a] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#27c4b5]/40 shadow-2xs"
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
                      ? 'bg-rose-600 text-white shadow-2xs'
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
              className="w-full px-2 py-1.5 text-xs bg-white rounded-xl border border-[#d9e3e4] text-[#004646] font-bold focus:outline-none cursor-pointer shadow-2xs"
            >
              {vocabDecks.map(deck => (
                <option key={deck.id} value={deck.id}>
                  📚 {deck.topicName || deck.id} ({deck.cards?.length || 0})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* VERTICAL ITEM EXPLORER (ForumFlash style .world-list) */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 focus:outline-none scroll-smooth">
          {items.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <p>{isEn ? 'No items match your filter.' : 'Không có bài học phù hợp với bộ lọc.'}</p>
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = currentIndex === idx;
              const isMastered = masteredIds.includes(item.id);
              const badgeColor = getIndexBadgeColor(idx, isSelected, isMastered);

              // Title resolution based on track
              let itemTitle = item.correct || item.title || item.term || item.questionStem || `Item ${idx + 1}`;
              let subLabel = item.bandLevel ? `Band ${item.bandLevel}` : (item.bandTarget ? `Band ${item.bandTarget}` : item.category || '');

              return (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => {
                    onSelectIndex(idx);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full text-left rounded-2xl p-2.5 transition-all duration-150 cursor-pointer flex items-center justify-between gap-2.5 border group ${
                    isSelected
                      ? 'bg-[#e6f5f3] border-[#27c4b5] shadow-xs translate-x-1'
                      : 'bg-white hover:bg-slate-50 border-[#d9e3e4] hover:border-[#27c4b5]/60 hover:translate-x-0.5'
                  }`}
                >
                  {/* Left: Number Box & Titles */}
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    {/* Index Box */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${badgeColor}`}>
                      {isMastered ? (
                        <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                      ) : (
                        <span>{String(idx + 1).padStart(2, '0')}</span>
                      )}
                    </div>

                    {/* Word / Rule Name & Subtext */}
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-extrabold truncate ${isSelected ? 'text-[#004646]' : 'text-slate-800'}`}>
                        {itemTitle}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        {subLabel && (
                          <span className="font-semibold text-teal-800 bg-teal-50 px-1 rounded">
                            {subLabel}
                          </span>
                        )}
                        {item.category && activeTab !== 'spelling' && (
                          <span className="truncate opacity-75">{item.category}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right Status Indicator */}
                  <div className="shrink-0 flex items-center">
                    {isSelected ? (
                      <span className="w-2 h-2 rounded-full bg-[#27c4b5] animate-ping" />
                    ) : isMastered ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* SIDEBAR FOOTER: PROGRESS & HIDE MASTERED TOGGLE */}
        <div className="p-3 bg-[#f7f4ed] border-t border-[#d9e3e4] shrink-0 space-y-2">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span>{isEn ? 'Track Mastery' : 'Tiến độ phân hệ'}</span>
            <span className="text-[#004646]">
              {masteredInList}/{items.length} ({items.length > 0 ? Math.round((masteredInList / items.length) * 100) : 0}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#27c4b5] to-emerald-500 transition-all duration-300"
              style={{
                width: `${items.length > 0 ? Math.round((masteredInList / items.length) * 100) : 0}%`
              }}
            />
          </div>

          {/* Hide Mastered Checkbox */}
          <label className="flex items-center space-x-2 text-xs text-slate-600 font-semibold cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hideMastered}
              onChange={(e) => onToggleHideMastered(e.target.checked)}
              className="rounded text-[#004646] focus:ring-[#27c4b5] cursor-pointer"
            />
            <span className="text-[11px] select-none">
              {isEn ? 'Hide mastered items' : 'Ẩn bài đã thành thạo'}
            </span>
          </label>
        </div>
      </aside>
    </>
  );
}
