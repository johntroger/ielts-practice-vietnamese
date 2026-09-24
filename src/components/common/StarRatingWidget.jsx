import React, { useState } from 'react';
import { Star, Flame, Check } from 'lucide-react';
import { rateItem } from '../../services/ratingPopularityService';

/**
 * StarRatingWidget
 * Reusable interactive 5-star rating widget with hover animation,
 * rating count display, and attempts counter badge.
 */
export default function StarRatingWidget({
  itemId,
  initialRating = 4.8,
  initialRatingCount = 50,
  initialUserRating = null,
  attemptsCount = 0,
  size = 'sm',
  interactive = true,
  showCount = true,
  showAttempts = false,
  onRateSuccess
}) {
  const [rating, setRating] = useState(initialRating);
  const [ratingCount, setRatingCount] = useState(initialRatingCount);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);

  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };

  const textSizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm'
  };

  const handleStarClick = (e, starVal) => {
    e.stopPropagation();
    if (!interactive || !itemId) return;

    const updated = rateItem(itemId, starVal);
    if (updated) {
      setRating(updated.rating);
      setRatingCount(updated.ratingCount);
      setUserRating(updated.userRating);
      setShowFeedbackToast(true);
      setTimeout(() => setShowFeedbackToast(false), 2000);
      onRateSuccess?.(updated);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
      {/* 5-Star Interactive Row */}
      <div 
        className="flex items-center space-x-0.5"
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((starVal) => {
          const isFilled = hoverRating > 0 ? starVal <= hoverRating : starVal <= Math.round(rating);
          const isUserRated = userRating === starVal;

          return (
            <button
              key={starVal}
              type="button"
              disabled={!interactive}
              onMouseEnter={() => interactive && setHoverRating(starVal)}
              onClick={(e) => handleStarClick(e, starVal)}
              className={`transition-transform duration-150 focus:outline-none ${
                interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'
              }`}
              title={interactive ? `Chấm ${starVal} sao cho đề này` : `${rating} sao`}
            >
              <Star 
                className={`${starSizes[size] || starSizes.sm} ${
                  isFilled 
                    ? 'fill-amber-400 text-amber-500' 
                    : 'fill-slate-100 text-slate-300'
                } ${isUserRated ? 'ring-1 ring-amber-400 rounded-full' : ''}`} 
              />
            </button>
          );
        })}
      </div>

      {/* Average Score & Rating Count */}
      {showCount && (
        <span className={`font-bold text-slate-700 dark:text-slate-300 ${textSizes[size] || textSizes.sm}`}>
          {Number(rating).toFixed(1)}
          {ratingCount > 0 && (
            <span className="font-normal text-slate-400 text-[10px] ml-1">
              ({ratingCount})
            </span>
          )}
        </span>
      )}

      {/* Attempts Badge */}
      {showAttempts && attemptsCount > 0 && (
        <span className="inline-flex items-center space-x-0.5 text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
          <Flame className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
          <span>{attemptsCount >= 1000 ? `${(attemptsCount / 1000).toFixed(1)}k` : attemptsCount}</span>
        </span>
      )}

      {/* Toast Feedback confirmation */}
      {showFeedbackToast && (
        <div className="absolute -top-7 left-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg flex items-center space-x-1 animate-in fade-in duration-150 z-30 whitespace-nowrap">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Đã lưu {userRating}★ của bạn!</span>
        </div>
      )}
    </div>
  );
}
