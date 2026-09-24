import React from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Star, 
  Flame, 
  Target, 
  GraduationCap, 
  Award, 
  SlidersHorizontal, 
  RotateCcw 
} from 'lucide-react';

export default function SmartContentFilterBar({
  searchQuery = '',
  onSearchChange,
  quickFilter = 'all',
  onQuickFilterChange,
  sortBy = 'rating_desc',
  onSortByChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  categoryOptions = [],
  totalCount = 0,
  filteredCount = 0,
  onResetFilters,
  placeholder = 'Tìm kiếm theo từ khóa, dạng bài, chủ đề...',
  showQuickChips = true,
  showCategoryFilter = true,
  hasActiveFilters = false
}) {
  const quickChips = [
    { id: 'all', label: 'Tất Cả', icon: Sparkles, color: 'text-slate-700' },
    { id: 'top_rated', label: '⭐ Đánh Giá Cao (≥4.8★)', icon: Star, color: 'text-amber-600' },
    { id: 'trending', label: '🔥 Thịnh Hành', icon: Flame, color: 'text-rose-600' },
    { id: 'unattempted', label: '🎯 Chưa Làm', icon: Target, color: 'text-blue-600' },
    { id: 'mastered', label: '🎓 Đã Thuộc', icon: GraduationCap, color: 'text-emerald-700' },
    { id: 'band_high', label: '💎 Band 7.5+', icon: Award, color: 'text-purple-600' },
  ];

  const sortOptions = [
    { value: 'rating_desc', label: '⭐ Đánh giá cao nhất' },
    { value: 'attempts_desc', label: '🔥 Nhiều người làm nhất' },
    { value: 'newest', label: '🆕 Mới nhất' },
    { value: 'difficulty_desc', label: '💎 Độ khó cao (Band 7.5+)' },
    { value: 'difficulty_asc', label: '🌱 Độ khó cơ bản (Band 5.5 - 6.5)' },
    { value: 'title_asc', label: '🔤 Theo thứ tự A - Z' },
  ];

  const isFiltered = hasActiveFilters || 
    Boolean(searchQuery.trim()) || 
    quickFilter !== 'all' || 
    (showCategoryFilter && categoryFilter !== 'all') || 
    sortBy !== 'rating_desc';

  return (
    <div className="space-y-2.5 bg-slate-50/80 p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
      
      {/* ROW 1: QUICK FILTER PILL CHIPS */}
      {showQuickChips && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {quickChips.map((chip) => {
            const Icon = chip.icon;
            const isActive = quickFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onQuickFilterChange?.(chip.id)}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs scale-102 ring-1 ring-slate-800'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : chip.color}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ROW 2: SEARCH + CATEGORY + SORT SELECTORS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        
        {/* Instant Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category / Subtype Dropdown (Optional) */}
        {showCategoryFilter && categoryOptions.length > 0 && (
          <div className="sm:w-44 shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange?.(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs cursor-pointer"
            >
              <option value="all">Tất cả phân loại</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort Selector Dropdown */}
        <div className="sm:w-52 shrink-0 flex items-center space-x-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange?.(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-2xs cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ROW 3: STATUS COUNTER & RESET FILTER */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-0.5">
        <div className="flex items-center space-x-1.5">
          <span>
            Hiển thị <strong className="text-slate-800 font-bold">{filteredCount}</strong> / {totalCount} mục
          </span>
          {isFiltered && (
            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium text-[10px]">
              Đang áp dụng bộ lọc
            </span>
          )}
        </div>

        {isFiltered && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 font-bold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}
      </div>

    </div>
  );
}
