import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  BookmarkPlus,
  Check,
  RotateCcw,
  Shuffle,
  BookOpen,
  Award
} from 'lucide-react';
import { useTranslation } from '../../i18n/index.js';

export default function MusicSessionSummaryCard({
  track,
  progressStats,
  onSaveVocabItem,
  onResetSession,
  onShuffleBlanks,
  onClaimReward,
  hasClaimedReward = false
}) {
  const { isEn } = useTranslation();
  const [savedWords, setSavedWords] = useState({});

  if (!track) return null;

  const {
    completedTasks = 0,
    totalTasks = 1,
    accuracyPct = 0,
    isAllCompleted = false,
    earnedXp = 60,
    earnedGold = 25
  } = progressStats || {};

  const vocabList = Array.isArray(track.vocabHighlights) ? track.vocabHighlights : [];
  const pedagogicalFocus = isEn
    ? track.pedagogicalFocusEn
    : (track.pedagogicalFocusVi || track.pedagogicalFocusEn);

  const handleSaveWord = (v) => {
    onSaveVocabItem?.({
      id: `music-vocab-${track.id}-${v.word.replace(/\s+/g, '-').toLowerCase()}`,
      word: v.word,
      phonetic: v.phonetic || '',
      meaning: isEn ? v.meaningEn : (v.meaningVi || v.meaningEn),
      meaningEn: v.meaningEn,
      meaningVi: v.meaningVi || v.meaningEn,
      example: v.example || '',
      category: 'Music & Connected Speech',
      band: track.bandTarget || '6.5+'
    });
    setSavedWords(prev => ({ ...prev, [v.word]: true }));
  };

  return (
    <div className="px-3 sm:px-5 pt-3 pb-1 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0">
      {/* Completion Celebration Banner when 100% blanks/sentences are completed */}
      {isAllCompleted && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-black text-sm sm:text-base">
                  {isEn
                    ? `Song Mastered! (${accuracyPct}% Accuracy)`
                    : `Hoàn Thành Xuất Sắc Bài Hát! (Độ chính xác ${accuracyPct}%)`}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  +{earnedXp} XP • +{earnedGold} GOLD
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                {isEn
                  ? `You completed all ${totalTasks} dictation tasks in "${track.titleEn || track.title}". Try a harder mode or shuffle new blanks!`
                  : `Bạn đã hoàn thành trọn vẹn ${totalTasks} thử thách chép lời trong bài "${track.title}". Hãy thử tăng độ khó hoặc đổi vị trí ô trống mới!`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!hasClaimedReward && onClaimReward && (
              <button
                type="button"
                onClick={onClaimReward}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{isEn ? `Claim +${earnedXp} XP` : `Nhận +${earnedXp} XP`}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onShuffleBlanks}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{isEn ? 'New Blanks' : 'Đổi ô trống mới'}</span>
            </button>
            <button
              type="button"
              onClick={onResetSession}
              className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Retry' : 'Làm lại'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Compact Pedagogical Focus + Quick Vocab Vault Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-bold text-[11px] shrink-0">
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-300" />
            <span>{isEn ? 'Listening Focus:' : 'Trọng tâm nghe:'}</span>
          </span>
          <span className="text-slate-600 dark:text-slate-300 truncate font-medium" title={pedagogicalFocus}>
            {pedagogicalFocus}
          </span>
        </div>

        {/* Song Vocab Quick-Save Pills */}
        {vocabList.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{isEn ? 'Key Vocab:' : 'Từ vựng bài hát:'}</span>
            </span>
            {vocabList.map((v) => {
              const isSaved = Boolean(savedWords[v.word]);
              return (
                <button
                  key={v.word}
                  type="button"
                  onClick={() => handleSaveWord(v)}
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  }`}
                  title={
                    isEn
                      ? `${v.word} (${v.phonetic}): ${v.meaningEn} — Click to save to Vocab Notebook`
                      : `${v.word} (${v.phonetic}): ${v.meaningVi} — Bấm để lưu vào Sổ Tay Từ Vựng`
                  }
                >
                  <span>{v.word}</span>
                  {isSaved ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <BookmarkPlus className="w-3 h-3 text-amber-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
