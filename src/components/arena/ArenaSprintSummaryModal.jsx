import React from 'react';
import { Award, Zap, Timer, CheckCircle, RotateCcw, X } from 'lucide-react';
import { useTranslation } from '../../i18n';

/**
 * src/components/arena/ArenaSprintSummaryModal.jsx
 * 
 * Climax Victory & Telemetry Summary Card for Atlas English Arena.
 * Features:
 * - Breakdown of Final XP (+ Speed Bonus + Streak Bonus)
 * - Accuracy & Time Spent Analytics
 * - 1-Click "Play Again" or "Return to Dashboard"
 */
export default function ArenaSprintSummaryModal({
  summary,
  onPlayAgain,
  onClose
}) {
  const { t, isEn } = useTranslation();

  if (!summary) return null;

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl flex flex-col items-center gap-6 text-center animate-fade-in">
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
        <Award className="w-8 h-8" />
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-100 tracking-tight">
          {t('arena.summaryTitle')}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {t('arena.subtitle')}
        </p>
      </div>

      {/* XP Hero Card with Transparent 3-Tier Breakdown */}
      <div className="w-full bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-800/40 rounded-2xl p-4 flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
          {t('arena.summaryTotalXp')}
        </span>
        <div className="flex items-baseline gap-1 text-4xl font-black text-indigo-200">
          <span>+{summary.finalXp || 0}</span>
          <span className="text-base text-indigo-400 font-bold">XP</span>
        </div>

        {/* 3-Tier Transparent Decomposition Table */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-800/30 text-xs">
          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-2 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.baseXpLabel', { score: summary.score || 0 })}</span>
            <span className="font-bold text-indigo-300">+{summary.baseScore || (summary.score * 20) || 0}</span>
          </div>

          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-2 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.bossBonusLabel')}</span>
            <span className="font-bold text-amber-300">+{summary.bossBonus || 0}</span>
          </div>

          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-2 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.timeBonusLabel')}</span>
            <span className="font-bold text-emerald-300">+{summary.timeBonus || summary.speedBonus || 0}</span>
          </div>

          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-2 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.streakBonusLabel')}</span>
            <span className="font-bold text-rose-300">+{summary.streakBonus || 0}</span>
          </div>

          {summary.revengeBonusXp > 0 && (
            <div className="flex flex-col items-center bg-amber-950/40 rounded-lg p-2 border border-amber-800/60 col-span-2 sm:col-span-4">
              <span className="text-amber-300 text-[10px] font-bold">⚡ {isEn ? 'Revenge Clearance Bonus' : 'Thưởng Chuộc Lỗi Phục Thù'}</span>
              <span className="font-extrabold text-amber-300">+{summary.revengeBonusXp} XP ({summary.revengeClearedCount} {isEn ? 'cleared' : 'câu'})</span>
            </div>
          )}
        </div>

        {summary.softCapMultiplier < 1.0 && (
          <span className="text-[11px] text-amber-400/90 font-medium pt-1">
            {t('arena.softCapNotice', { multiplier: summary.softCapMultiplier })}
          </span>
        )}
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {/* Accuracy */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col items-center">
          <CheckCircle className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-lg font-black text-slate-100">
            {summary.accuracy || 0}%
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {t('arena.summaryAccuracy')}
          </span>
        </div>

        {/* Speed / Time */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col items-center">
          <Timer className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-lg font-black text-slate-100">
            {summary.timeSpent || 0}s
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {t('arena.summarySpeed')}
          </span>
        </div>

        {/* Max Combo */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col items-center">
          <Zap className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-lg font-black text-slate-100">
            {summary.maxCombo || 0}x
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {t('arena.maxCombo')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full pt-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('arena.startSprint')}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
          title={t('arena.backToLeaderboard')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
