import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Compass,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { 
  getSmartDailyRecommendations, 
  isRecommendationDismissedToday, 
  dismissRecommendationForToday,
  resetRecommendationDismissal,
  getSavedRecommendationIndex,
  saveRecommendationIndex
} from '../services/recommendationService';
import { safeGet, safeSet } from '../utils/storageService';
import { useTranslation } from '../i18n';

/**
 * SmartRecommendationBanner.jsx
 * 
 * Non-intrusive, pedagogically-driven daily recommendation card.
 * Suggests the best next exercise based on learner history (Task 1 balance, mistakes SRS, micro-drills).
 */
export default function SmartRecommendationBanner({
  submissions = [],
  mistakes = [],
  vocabList = [],
  targetBand = '6.5',
  allTasks = [],
  currentTaskId = '',
  onSelectTask,
  onOpenModal,
  isFocusMode = false,
  writingViewMode = 'pro'
}) {
  const { t, isEn } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(() => isRecommendationDismissedToday());
  const [isCollapsed, setIsCollapsed] = useState(() => safeGet('ielts_rec_banner_collapsed', 'false') === 'true');
  const [currentIndex, setCurrentIndex] = useState(() => getSavedRecommendationIndex());

  // Generate prioritized recommendations list
  const recommendations = useMemo(() => {
    return getSmartDailyRecommendations({
      submissions,
      mistakes,
      vocabList,
      targetBand,
      allTasks,
      currentTaskId,
      isEn
    });
  }, [submissions, mistakes, vocabList, targetBand, allTasks, currentTaskId, isEn]);

  // If dismissed or in focus mode, do not render
  if (isDismissed || isFocusMode || recommendations.length === 0) {
    return null;
  }

  // Current active recommendation (safe index)
  const activeRec = recommendations[currentIndex % recommendations.length] || recommendations[0];

  // Cycle to next recommendation
  const handleNextRecommendation = (e) => {
    e?.stopPropagation();
    const nextIdx = (currentIndex + 1) % recommendations.length;
    setCurrentIndex(nextIdx);
    saveRecommendationIndex(nextIdx);
  };

  // Toggle collapsed state
  const handleToggleCollapse = (e) => {
    e?.stopPropagation();
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    safeSet('ielts_rec_banner_collapsed', String(nextState));
  };

  // Dismiss for today
  const handleDismiss = (e) => {
    e?.stopPropagation();
    setIsDismissed(true);
    dismissRecommendationForToday();
  };

  // Execute primary action
  const handleExecuteAction = () => {
    if (!activeRec) return;
    if (activeRec.actionType === 'select_task' && activeRec.actionPayload) {
      onSelectTask?.(activeRec.actionPayload);
    } else if (activeRec.actionType === 'open_modal' && activeRec.actionPayload) {
      onOpenModal?.(activeRec.actionPayload);
    }
  };

  // Badge color mapping
  const badgeColors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  };

  const badgeStyle = badgeColors[activeRec.badgeColor] || badgeColors.indigo;

  // COMPACT / COLLAPSED VIEW
  if (isCollapsed) {
    return (
      <aside 
        aria-label={isEn ? "Collapsed smart practice recommendation bar" : "Thanh gợi ý bài tập thông minh thu gọn"}
        className="bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs border-b border-slate-800 transition-all shadow-2xs shrink-0 select-none"
      >
        <div 
          onClick={handleToggleCollapse}
          className="flex items-center space-x-2 truncate cursor-pointer group flex-1 mr-2"
        >
          <div className="w-5 h-5 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-3 h-3 animate-pulse" />
          </div>
          <span className="font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
            <span className="text-amber-300 font-bold mr-1.5">{isEn ? "Today's Pick:" : "Gợi ý hôm nay:"}</span>
            {activeRec.title}
          </span>
          <span className="hidden md:inline-flex text-[10px] text-slate-400 font-normal">
            ({activeRec.estimatedMinutes} {isEn ? "mins" : "phút"})
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={handleExecuteAction}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-transform active:scale-95 cursor-pointer shadow-xs"
            title={isEn ? "Practice recommended exercise" : "Luyện ngay đề thi hoặc công cụ được gợi ý"}
          >
            <span>{isEn ? "Practice now" : "Luyện ngay"}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={handleToggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isEn ? "Expand suggestion details" : "Mở rộng chi tiết gợi ý"}
            aria-label={isEn ? "Expand suggestion details" : "Mở rộng gợi ý bài tập"}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
            title={isEn ? "Dismiss suggestion for today" : "Đóng gợi ý trong hôm nay"}
            aria-label={isEn ? "Dismiss suggestion for today" : "Đóng gợi ý trong hôm nay"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    );
  }

  // EXPANDED VIEW
  return (
    <aside 
      aria-label={isEn ? "Smart practice recommendation card" : "Thẻ gợi ý bài tập thông minh"}
      className="bg-gradient-to-r from-amber-50/90 via-white to-indigo-50/70 border-b border-slate-200/90 px-3 sm:px-4 lg:px-6 py-2.5 transition-all shadow-2xs shrink-0 relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 relative z-10">
        
        {/* Left: Indicator & Content */}
        <div className="flex items-start space-x-2.5 sm:space-x-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Compass className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-0.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeStyle}`}>
                {activeRec.badge}
              </span>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                ~{activeRec.estimatedMinutes} {isEn ? "mins" : "phút"}
              </span>
              {recommendations.length > 1 && (
                <span className="text-[10px] text-slate-400 font-semibold">
                  ({isEn ? "Suggestion" : "Gợi ý"} {(currentIndex % recommendations.length) + 1}/{recommendations.length})
                </span>
              )}
            </div>

            <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug truncate">
              {activeRec.title}
            </h4>

            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed font-normal">
              {activeRec.description}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 self-end sm:self-center shrink-0 pt-1 sm:pt-0">
          {/* Primary Action Button */}
          <button
            onClick={handleExecuteAction}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            title={isEn ? "Start recommended exercise" : "Luyện ngay bài tập được gợi ý"}
          >
            <span>{activeRec.actionLabel || (isEn ? 'Practice now' : 'Luyện ngay')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Change Recommendation (Cycle) */}
          {recommendations.length > 1 && (
            <button
              onClick={handleNextRecommendation}
              className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
              title={isEn ? "Switch to next suggestion" : "Đổi gợi ý bài tập khác"}
            >
              <RotateCw className="w-3 h-3 text-slate-500" />
              <span className="hidden md:inline">{isEn ? "Next suggestion" : "Đổi gợi ý"}</span>
            </button>
          )}

          {/* Collapse Button */}
          <button
            onClick={handleToggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isEn ? "Collapse suggestion banner" : "Thu nhỏ thanh gợi ý"}
            aria-label={isEn ? "Collapse suggestion banner" : "Thu nhỏ thanh gợi ý"}
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title={isEn ? "Dismiss suggestion for today" : "Ẩn gợi ý trong hôm nay"}
            aria-label={isEn ? "Dismiss suggestion for today" : "Ẩn gợi ý trong hôm nay"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>
  );
}
