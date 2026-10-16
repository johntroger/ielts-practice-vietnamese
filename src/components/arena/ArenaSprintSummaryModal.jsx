import React from 'react';
import { Award, Zap, Timer, CheckCircle, RotateCcw, X, BookOpen, Crown, ExternalLink, Activity } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { openModal } from '../../core/modalStore.js';

/**
 * src/components/arena/ArenaSprintSummaryModal.jsx
 * 
 * Climax Victory & Telemetry Summary Card for Atlas English Arena.
 * Features:
 * - Breakdown of Final XP (+ Speed Bonus + Streak Bonus + Boss Slayer Bonus)
 * - Accuracy & Time Spent Analytics
 * - Cambridge 4-Axis Diagnostic Skill Radar / Progress Bars
 * - 1-Click Cambridge Theory Prescription linked to TheoryHandbookModal
 * - 1-Click "Play Again" or "Return to Dashboard"
 * - Compact single-screen layout with zero scroll clipping
 */
export default function ArenaSprintSummaryModal({
  summary,
  onPlayAgain,
  onClose,
  onOpenTheory
}) {
  const { t, isEn } = useTranslation();

  if (!summary) return null;

  const handleOpenTheory = () => {
    if (summary.prescription) {
      openModal('theory', {
        skill: summary.prescription.handbookSkill,
        searchQuery: summary.prescription.searchQuery
      });
      if (onOpenTheory) {
        onOpenTheory(summary.prescription);
      }
    }
  };

  const diagnosticSkills = summary.diagnosticSkills || [];

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 text-white shadow-2xl flex flex-col items-center gap-3.5 text-center animate-fade-in max-h-[92vh] overflow-y-auto">
      {/* Icon Badge */}
      <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg ${
        summary.isBossCleared
          ? 'bg-gradient-to-br from-amber-500/30 to-purple-600/30 border border-amber-400/60 text-amber-300 shadow-amber-500/20'
          : 'bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-amber-500/10'
      }`}>
        {summary.isBossCleared ? (
          <Crown className="w-7 h-7 animate-bounce" />
        ) : (
          <Award className="w-7 h-7" />
        )}
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            {t('arena.summaryTitle')}
          </h2>
          {summary.isBossCleared && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-400/50">
              👑 {isEn ? 'BOSS SLAYER' : 'DIỆT TRÙM'}
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
          {t('arena.subtitle')}
        </p>
      </div>

      {/* XP Hero Card with Transparent 3-Tier Breakdown */}
      <div className="w-full bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-800/40 rounded-2xl p-3 sm:p-3.5 flex flex-col items-center gap-1.5">
        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-indigo-400">
          {t('arena.summaryTotalXp')}
        </span>
        <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-black text-indigo-200">
          <span>+{summary.finalXp || 0}</span>
          <span className="text-sm sm:text-base text-indigo-400 font-bold">XP</span>
        </div>

        {/* 3-Tier Transparent Decomposition Table */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1.5 border-t border-indigo-800/30 text-xs">
          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-1.5 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.baseXpLabel', { score: summary.score || 0 })}</span>
            <span className="font-bold text-indigo-300 text-xs sm:text-sm">+{summary.baseScore || (summary.score * 20) || 0}</span>
          </div>

          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-1.5 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.bossBonusLabel')}</span>
            <span className="font-bold text-amber-300 text-xs sm:text-sm">+{summary.bossBonus || 0}</span>
          </div>

          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-1.5 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.timeBonusLabel')}</span>
            <span className="font-bold text-emerald-300 text-xs sm:text-sm">+{summary.timeBonus || summary.speedBonus || 0}</span>
          </div>

          <div className="flex flex-col items-center bg-slate-900/60 rounded-lg p-1.5 border border-slate-800/60">
            <span className="text-slate-400 text-[10px]">{t('arena.streakBonusLabel')}</span>
            <span className="font-bold text-rose-300 text-xs sm:text-sm">+{summary.streakBonus || 0}</span>
          </div>

          {summary.audioBonus > 0 && (
            <div className="flex flex-col items-center bg-cyan-950/40 rounded-lg p-1.5 border border-cyan-800/60 col-span-2 sm:col-span-4">
              <span className="text-cyan-300 text-[10px] font-bold">🎧 {t('arena.audioBonusLabel')}</span>
              <span className="font-extrabold text-cyan-300 text-xs sm:text-sm">+{summary.audioBonus} XP</span>
            </div>
          )}

          {summary.revengeBonusXp > 0 && (
            <div className="flex flex-col items-center bg-amber-950/40 rounded-lg p-1.5 border border-amber-800/60 col-span-2 sm:col-span-4">
              <span className="text-amber-300 text-[10px] font-bold">⚡ {isEn ? 'Revenge Clearance Bonus' : 'Thưởng Chuộc Lỗi Phục Thù'}</span>
              <span className="font-extrabold text-amber-300 text-xs sm:text-sm">+{summary.revengeBonusXp} XP ({summary.revengeClearedCount} {isEn ? 'cleared' : 'câu'})</span>
            </div>
          )}
        </div>

        {summary.softCapMultiplier < 1.0 && (
          <span className="text-[10px] text-amber-400/90 font-medium pt-0.5">
            {t('arena.softCapNotice', { multiplier: summary.softCapMultiplier })}
          </span>
        )}
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {/* Accuracy */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2 sm:p-2.5 flex flex-col items-center">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
          <span className="text-base sm:text-lg font-black text-slate-100">
            {summary.accuracy || 0}%
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {t('arena.summaryAccuracy')}
          </span>
        </div>

        {/* Speed / Time */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2 sm:p-2.5 flex flex-col items-center">
          <Timer className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
          <span className="text-base sm:text-lg font-black text-slate-100">
            {summary.timeSpent || 0}s
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {t('arena.summarySpeed')}
          </span>
        </div>

        {/* Max Combo */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2 sm:p-2.5 flex flex-col items-center">
          <Zap className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
          <span className="text-base sm:text-lg font-black text-slate-100">
            {summary.maxCombo || 0}x
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {t('arena.maxCombo')}
          </span>
        </div>
      </div>

      {/* Cambridge 4-Axis Diagnostic Skill Radar / Progress Bars */}
      {diagnosticSkills.length > 0 && (
        <div className="w-full bg-slate-800/50 border border-slate-700/60 rounded-2xl p-3 flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('arena.diagnosticRadarTitle')}</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {t('arena.diagnosticSubtitle')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {diagnosticSkills.map((axis) => {
              const label = t(axis.nameKey) || (isEn ? axis.nameEn : axis.nameVi);
              const colorClass = axis.status === 'mastered'
                ? 'bg-emerald-500'
                : axis.status === 'warning'
                  ? 'bg-amber-500'
                  : axis.status === 'critical'
                    ? 'bg-rose-500'
                    : 'bg-slate-600';
              const textClass = axis.status === 'mastered'
                ? 'text-emerald-400'
                : axis.status === 'warning'
                  ? 'text-amber-400'
                  : axis.status === 'critical'
                    ? 'text-rose-400'
                    : 'text-slate-400';

              return (
                <div key={axis.key} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-semibold truncate pr-1" title={label}>
                      {axis.icon} {label}
                    </span>
                    <span className={`font-mono font-bold text-[11px] ${textClass}`}>
                      {axis.total > 0 ? `${axis.rate}%` : (t('arena.untestedAxis') || (isEn ? 'Not tested' : 'Chưa thi'))}
                    </span>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                      style={{ width: `${axis.total > 0 ? axis.rate : 0}%` }}
                    />
                  </div>
                  {axis.total > 0 && (
                    <span className="text-[9px] text-slate-400 font-mono text-right">
                      {axis.correct}/{axis.total} {isEn ? 'cleared' : 'đúng'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1-Click Cambridge Theory Prescription */}
      {summary.prescription && (
        <div className="w-full bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-slate-900 border border-amber-500/40 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-left shadow-lg">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span>🩺</span>
                <span>{t('arena.prescriptionTitle')}</span>
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                {isEn ? summary.prescription.titleEn : summary.prescription.titleVi}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                {isEn ? summary.prescription.recommendationEn : summary.prescription.recommendationVi}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenTheory}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('arena.reviewInHandbook')}</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2.5 w-full pt-1">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('arena.startSprint')}</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-2.5 sm:p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/80 transition-colors cursor-pointer"
          title={t('arena.backToLeaderboard')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
