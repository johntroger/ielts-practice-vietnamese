import React, { useState, useMemo } from 'react';
import { 
  X, Search, Layers, Clock, Award, Shield, CheckCircle2, 
  ChevronRight, Sparkles, PenTool, GraduationCap, Trash2, 
  BookOpen, Filter, ArrowRight, Check
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function SpeakingMockLibraryModal({
  isOpen,
  onClose,
  allMockPacks = [],
  selectedMockId,
  onSelectMockPack,
  onDeleteCustomPack,
  onOpenManualCreate,
  onOpenAiGenerate,
  masteredIds = [],
  onToggleMastered,
  mockFilter = 'all',
  setMockFilter,
  mockPackCounts
}) {
  if (!isOpen) return null;

  const { t, isEn } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [hideMastered, setHideMastered] = useState(false);

  // Filter and search logic
  const displayedPacks = useMemo(() => {
    return allMockPacks.filter(pack => {
      // Source filter
      if (mockFilter === 'cambridge' && !(pack.isCambridge || !pack.isCustom)) return false;
      if (mockFilter === 'manual' && !(pack.isManual || (pack.isCustom && !pack.isAiGenerated))) return false;
      if (mockFilter === 'ai' && !pack.isAiGenerated) return false;
      if (mockFilter === 'mastered' && !masteredIds.includes(pack.id)) return false;

      // Hide mastered toggle
      if (hideMastered && masteredIds.includes(pack.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (pack.title || '').toLowerCase().includes(query);
        const summaryMatch = (pack.summary || '').toLowerCase().includes(query);
        const p1Match = (pack.part1?.topic?.title || '').toLowerCase().includes(query);
        const p2Match = (pack.part2?.cueCard?.title || '').toLowerCase().includes(query);
        const p3Match = (pack.part3?.discussion?.topic || '').toLowerCase().includes(query);
        const camMatch = pack.cambridgeBook ? `cam ${pack.cambridgeBook}`.includes(query) : false;
        return titleMatch || summaryMatch || p1Match || p2Match || p3Match || camMatch;
      }

      return true;
    });
  }, [allMockPacks, mockFilter, hideMastered, masteredIds, searchQuery]);

  const masteredCount = useMemo(() => {
    return allMockPacks.filter(p => masteredIds.includes(p.id)).length;
  }, [allMockPacks, masteredIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl h-[92vh] max-h-[860px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/95 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-950/50 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isEn ? 'Speaking Mock Test Library' : 'Kho Đề Thi Thử IELTS Speaking'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {allMockPacks.length} {isEn ? 'Packs' : 'Bộ Đề'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isEn 
                  ? 'Official Cambridge standards, customized practice packs & AI-generated topics' 
                  : 'Đề thi chuẩn Cambridge, đề luyện tập thủ công & đề thi AI tự sinh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onOpenManualCreate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenManualCreate();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                title={isEn ? 'Create custom Speaking pack manually' : 'Tạo bộ đề thi Speaking mới thủ công'}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isEn ? '✍️ Manual' : '✍️ Thủ Công'}</span>
              </button>
            )}

            {onOpenAiGenerate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAiGenerate();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-purple-950/40 transition-all cursor-pointer"
                title={isEn ? 'Generate new Speaking test pack with AI' : 'Dùng AI sinh bộ đề thi Speaking mới'}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEn ? 'AI Gen' : 'AI Sinh'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isEn ? 'Close library' : 'Đóng thư viện'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search by title, topic, Cambridge book..." : "Tìm theo tên đề thi, chủ đề, sách Cam..."}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMockFilter('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mockFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isEn ? 'All' : 'Tất Cả'} ({mockPackCounts?.all ?? allMockPacks.length})
            </button>

            <button
              type="button"
              onClick={() => setMockFilter('cambridge')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                mockFilter === 'cambridge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>🏛️ {isEn ? 'Cambridge' : 'Chuẩn Cam'} ({mockPackCounts?.cambridge ?? 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setMockFilter('manual')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                mockFilter === 'manual'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>{isEn ? 'Manual' : 'Thủ Công'} ({mockPackCounts?.manual ?? 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setMockFilter('ai')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                mockFilter === 'ai'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-purple-300 hover:text-purple-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isEn ? 'AI' : 'AI Sinh'} ({mockPackCounts?.ai ?? 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setMockFilter('mastered')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                mockFilter === 'mastered'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>{isEn ? 'Mastered' : 'Đã Thuộc'} ({masteredCount})</span>
            </button>

            {/* Hide mastered checkbox */}
            <label className="ml-1 sm:ml-2 flex items-center space-x-1.5 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideMastered}
                onChange={(e) => setHideMastered(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
              />
              <span className="hidden sm:inline">{isEn ? 'Hide mastered' : 'Ẩn đề đã thuộc'}</span>
            </label>
          </div>
        </div>

        {/* TEST PACKS GRID (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {displayedPacks.length === 0 ? (
            <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400 text-2xl">
                📂
              </div>
              <h4 className="font-bold text-slate-300 text-sm">
                {isEn ? 'No Speaking test packs found' : 'Không tìm thấy bộ đề Speaking phù hợp'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isEn 
                  ? 'Try adjusting your search query or switching to another filter.' 
                  : 'Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc khác.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 cursor-pointer"
                >
                  {isEn ? 'Clear search' : 'Xóa bộ lọc tìm kiếm'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {displayedPacks.map(pack => {
                const isSelected = selectedMockId === pack.id;
                const isManual = pack.isManual || (pack.isCustom && !pack.isAiGenerated);
                const isAi = pack.isAiGenerated || (pack.isCustom && !pack.isManual);
                const isMastered = masteredIds.includes(pack.id);

                return (
                  <div
                    key={pack.id}
                    onClick={() => {
                      onSelectMockPack(pack.id);
                      onClose();
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                      isSelected 
                        ? 'bg-purple-950/50 border-purple-500 shadow-xl shadow-purple-950/60 ring-1 ring-purple-500/50' 
                        : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-purple-300 border border-slate-700">
                            {pack.difficulty} • Target {pack.targetBand}
                          </span>

                          {isMastered && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                              <GraduationCap className="w-3 h-3 text-emerald-400" />
                              <span>{isEn ? 'Mastered' : 'Đã thuộc'}</span>
                            </span>
                          )}

                          {(pack.isCambridge || !pack.isCustom) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              🏛️ {pack.cambridgeBook ? (isEn ? `Cam ${pack.cambridgeBook}` : `Chuẩn Cam ${pack.cambridgeBook}`) : 'Cambridge'}
                            </span>
                          )}

                          {isManual && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                              <PenTool className="w-2.5 h-2.5" />
                              <span>{isEn ? '✍️ Manual' : '✍️ Thủ Công'}</span>
                            </span>
                          )}

                          {isAi && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                              <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                              <span>{isEn ? 'AI Gen' : 'AI Sinh'}</span>
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-slate-400 font-bold flex items-center space-x-1 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{pack.estTime || '11 – 14 Mins'}</span>
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <h4 className="font-bold text-sm sm:text-base text-white leading-snug group-hover:text-purple-200 transition-colors">
                        {pack.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {pack.summary}
                      </p>

                      {/* Part 1, 2, 3 quick pill preview */}
                      <div className="pt-1.5 flex flex-wrap gap-1.5 text-[10px] text-slate-400 font-medium">
                        <span className="px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800">
                          <strong>P1:</strong> {pack.part1?.topic?.title || 'Interview'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800">
                          <strong>P2:</strong> {pack.part2?.cueCard?.title ? (pack.part2.cueCard.title.slice(0, 30) + '...') : 'Cue Card'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800">
                          <strong>P3:</strong> {pack.part3?.discussion?.topic || 'Discussion'}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        {onToggleMastered && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleMastered(pack.id);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors flex items-center space-x-1 cursor-pointer ${
                              isMastered
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <GraduationCap className="w-3 h-3" />
                            <span>{isEn ? (isMastered ? 'Mastered' : 'Master') : (isMastered ? 'Đã thuộc' : 'Thuộc đề')}</span>
                          </button>
                        )}

                        {pack.isCustom && onDeleteCustomPack && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCustomPack(pack.id, e);
                            }}
                            className="text-slate-500 hover:text-rose-400 px-2 py-1 rounded-lg transition-colors text-[10px] font-bold cursor-pointer"
                            title={isEn ? 'Delete this pack' : 'Xóa bộ đề này'}
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            {isEn ? 'Delete' : 'Xóa'}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 font-bold">
                        {isSelected ? (
                          <span className="px-2.5 py-1 rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[11px] flex items-center space-x-1">
                            <Check className="w-3 h-3 text-purple-400" />
                            <span>{isEn ? 'Selected' : 'Đang chọn'}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] flex items-center space-x-1 transition-colors shadow-xs"
                          >
                            <span>{isEn ? 'Select Pack' : 'Chọn Đề Này'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            {isEn ? 'Showing ' : 'Đang hiển thị '}
            <strong className="text-white">{displayedPacks.length}</strong> / {allMockPacks.length} {isEn ? 'test packs' : 'bộ đề'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
}
