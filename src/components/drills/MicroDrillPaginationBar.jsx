import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  GraduationCap, 
  PenTool, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Lock 
} from 'lucide-react';
import StarRatingWidget from '../common/StarRatingWidget';
import { getLocalizedDrillTitle, getLocalizedDrillCategory } from '../../utils/drillLocalization';

export default function MicroDrillPaginationBar({
  activeTab,
  activeDrillInfo,
  allDrills,
  masteredIds,
  onToggleMastered,
  currentUser,
  onOpenAuth,
  hideMasteredDrills,
  handleToggleHideMastered,
  drillSearchQuery,
  setDrillSearchQuery,
  drillQuickFilter,
  setDrillQuickFilter,
  drillSortBy,
  setDrillSortBy,
  handleSelectDrill,
  handleToggleDrillPublic,
  isEn
}) {
  const { list = [], index = 0, setIndex, onReset } = activeDrillInfo || {};
  const currentItem = list[index];
  const total = list.length;
  const totalMasteredInThisTab = allDrills.filter(d => d.type === activeTab && (masteredIds || []).includes(d.id)).length;

  if (total === 0) {
    if (currentUser && hideMasteredDrills && totalMasteredInThisTab > 0) {
      return (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-emerald-800 font-bold">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <span>
              {isEn 
                ? `Great job! You have marked all ${totalMasteredInThisTab} exercises in this type as "Mastered".` 
                : `Tuyệt vời! Bạn đã đánh dấu "Đã thuộc" toàn bộ ${totalMasteredInThisTab} bài tập trong dạng này.`}
            </span>
          </div>
          <p className="text-xs text-emerald-700">
            {isEn 
              ? 'Mastered exercises are automatically hidden from the practice list. You can click the button below to review anytime.' 
              : 'Các bài đã thuộc được tự động ẩn khỏi danh sách luyện tập. Bạn có thể bấm nút bên dưới để ôn tập lại bất kỳ lúc nào.'}
          </p>
          <button
            type="button"
            onClick={() => handleToggleHideMastered(false)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer shadow-xs inline-flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Unhide all mastered exercises to review' : 'Hiện lại tất cả bài đã thuộc để ôn tập'}</span>
          </button>
        </div>
      );
    }
    if (drillSearchQuery || drillQuickFilter !== 'all') {
      return (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2 text-xs">
          <p className="text-slate-600 font-semibold">
            {isEn ? 'No exercises found matching the current filter.' : 'Không tìm thấy bài tập phù hợp với bộ lọc hiện tại.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setDrillSearchQuery('');
              setDrillQuickFilter('all');
              setDrillSortBy('rating_desc');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800 transition"
          >
            {isEn ? 'Reset Filters' : 'Đặt lại bộ lọc'}
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
      {/* ROW 1: Smart Filter Controls (Search, Quick Chips, Sort) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Instant Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={drillSearchQuery}
            onChange={(e) => {
              setDrillSearchQuery(e.target.value);
              setIndex?.(0);
              onReset?.();
            }}
            placeholder={isEn ? "Search exercises, topics..." : "Tìm bài tập, chủ đề..."}
            className="pl-8 pr-7 py-1 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 w-40 sm:w-52 font-medium text-slate-800 shadow-2xs placeholder:text-slate-400"
          />
          {drillSearchQuery && (
            <button
              type="button"
              onClick={() => {
                setDrillSearchQuery('');
                setIndex?.(0);
                onReset?.();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              title={isEn ? "Clear search" : "Xóa tìm kiếm"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Filter Chips */}
          <div className="flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setDrillQuickFilter('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                drillQuickFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isEn ? 'All' : 'Tất cả'}
            </button>
            <button
              type="button"
              onClick={() => setDrillQuickFilter('top_rated')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                drillQuickFilter === 'top_rated' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={isEn ? "Rated 4.8★ and above" : "Đánh giá từ 4.8★ trở lên"}
            >
              ⭐ 4.8★+
            </button>
            <button
              type="button"
              onClick={() => setDrillQuickFilter('trending')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                drillQuickFilter === 'trending' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={isEn ? "Most practiced" : "Nhiều lượt luyện tập nhất"}
            >
              🔥 Hot
            </button>
            <button
              type="button"
              onClick={() => setDrillQuickFilter('manual')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                drillQuickFilter === 'manual' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={isEn ? "Show manually created exercises only" : "Chỉ hiển thị bài tập tạo thủ công"}
            >
              <PenTool className="w-2.5 h-2.5" />
              <span>{isEn ? '✍️ Manual' : '✍️ Thủ công'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDrillQuickFilter('ai')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                drillQuickFilter === 'ai' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={isEn ? "Show AI-generated exercises only" : "Chỉ hiển thị bài tập do AI sinh"}
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>{isEn ? '🤖 AI Generated' : '🤖 AI sinh'}</span>
            </button>
          </div>

          {/* Sort Select */}
          <select
            value={drillSortBy}
            onChange={(e) => setDrillSortBy(e.target.value)}
            className="px-2 py-1 text-[11px] font-bold bg-white text-slate-700 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-2xs cursor-pointer"
          >
            <option value="rating_desc">{isEn ? '⭐ Highest Rated' : '⭐ Rating cao nhất'}</option>
            <option value="attempts_desc">{isEn ? '🔥 Most Practiced' : '🔥 Luyện nhiều nhất'}</option>
            <option value="difficulty_desc">{isEn ? '💎 Advanced' : '💎 Độ khó cao'}</option>
            <option value="difficulty_asc">{isEn ? '🌱 Basic' : '🌱 Độ khó cơ bản'}</option>
            <option value="title_asc">{isEn ? '🔤 Title A-Z' : '🔤 Tên A-Z'}</option>
          </select>
        </div>
      </div>

      {/* ROW 2: Navigation, Attempts, Star Rating & Mastered Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-bold text-slate-700 whitespace-nowrap">
            {isEn ? 'Exercise:' : 'Bài tập:'} <span className="text-red-600 font-extrabold text-sm">{index + 1}</span> / {total}
          </span>
          {total > 1 && (
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleSelectDrill(index - 1)}
                disabled={index === 0}
                className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs cursor-pointer"
                title={isEn ? "Previous exercise" : "Bài trước"}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleSelectDrill(index + 1)}
                disabled={index === total - 1}
                className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition-colors shadow-2xs cursor-pointer"
                title={isEn ? "Next exercise" : "Bài tiếp theo"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hide Mastered Checkbox */}
          {currentUser && totalMasteredInThisTab > 0 && (
            <label className="flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer bg-emerald-50/80 px-2 py-1 rounded-md border border-emerald-200 shadow-2xs">
              <input
                type="checkbox"
                checked={hideMasteredDrills}
                onChange={(e) => handleToggleHideMastered(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="font-semibold text-emerald-800 text-[11px]">
                {isEn ? `Hide mastered (${totalMasteredInThisTab})` : `Ẩn câu đã thuộc (${totalMasteredInThisTab})`}
              </span>
            </label>
          )}
        </div>

        {/* Current Drill Star Rating, Publicity Badge & Mastered Action */}
        {currentItem && (
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Interactive 5-Star Rating & Real Attempts Count */}
            <StarRatingWidget
              itemId={currentItem.id}
              size="xs"
              showAttempts={true}
            />

            {/* Mastered Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  alert(isEn 
                    ? 'The "Mastered" feature hides mastered exercises from your practice list. Please sign in to save your progress!' 
                    : 'Tính năng "Đã thuộc" giúp ẩn bài tập đã thuần thục khỏi danh sách luyện tập. Vui lòng đăng nhập để lưu tiến trình!');
                  onOpenAuth?.();
                  return;
                }
                onToggleMastered?.(currentItem.id);
              }}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border flex items-center space-x-1 transition-all cursor-pointer shadow-2xs ${
                (masteredIds || []).includes(currentItem.id)
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
              }`}
              title={(masteredIds || []).includes(currentItem.id)
                ? (isEn ? "This drill is mastered. Click to unmark (Review)" : "Bài này đã thuộc. Bấm để bỏ đánh dấu (Ôn tập lại)")
                : (isEn ? "Mark as 'Mastered' (Will be hidden if 'Hide mastered' is checked)" : "Đánh dấu 'Đã thuộc' (Sẽ ẩn khỏi danh sách luyện tập nếu bạn bật 'Ẩn câu đã thuộc')")}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span>{(masteredIds || []).includes(currentItem.id) ? (isEn ? 'Mastered' : 'Đã thuộc') : (isEn ? 'Master Drill' : 'Thuộc bài')}</span>
            </button>

            {currentItem.isCommunity || currentItem.isPublic ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>{isEn ? '🌐 Community' : '🌐 Cộng Đồng'}</span>
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-300 flex items-center gap-1 shadow-2xs">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>{isEn ? '🔒 Private' : '🔒 Riêng tư'}</span>
              </span>
            )}
            {(currentItem.isManual || (currentItem.isCustom && !currentItem.isAiGenerated)) && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs">
                <PenTool className="w-3 h-3 text-emerald-700" />
                <span>{isEn ? '✍️ Manual' : '✍️ Thủ Công'}</span>
              </span>
            )}
            {currentItem.isAiGenerated && (
              <button
                type="button"
                onClick={() => handleToggleDrillPublic?.(currentItem.id)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                title={currentItem.isPublic 
                  ? (isEn ? 'Make this drill Private' : 'Chuyển bài tập này sang Riêng tư') 
                  : (isEn ? 'Share this drill with the IELTS Community' : 'Chia sẻ bài tập này thành tài nguyên chung của web')}
              >
                {currentItem.isPublic ? (isEn ? 'Make Private' : 'Khóa riêng') : (isEn ? 'Share Public' : 'Mở chia sẻ')}
              </button>
            )}
          </div>
        )}

        {/* Quick Jump Dropdown / Pill Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full py-1">
          {total > 12 ? (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-medium whitespace-nowrap">{isEn ? 'Jump to:' : 'Chuyển nhanh:'}</span>
              <select
                value={index}
                onChange={(e) => handleSelectDrill(Number(e.target.value))}
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-2xs"
              >
                {list.map((d, i) => (
                  <option key={d.id || i} value={i}>
                    {isEn ? `Drill ${i + 1}: ` : `Bài ${i + 1}: `}{getLocalizedDrillTitle(d, isEn) || getLocalizedDrillCategory(d, isEn) || (isEn ? `Exercise ${i + 1}` : `Bài tập ${i + 1}`)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-1 overflow-x-auto py-0.5 max-w-md">
              {list.map((d, i) => (
                <button
                  key={d.id || i}
                  onClick={() => handleSelectDrill(i)}
                  className={`min-w-[28px] h-7 px-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    index === i
                      ? 'bg-red-600 text-white shadow-xs ring-2 ring-red-500/20 scale-105'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
