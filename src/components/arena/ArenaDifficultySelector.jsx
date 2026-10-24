/**
 * src/components/arena/ArenaDifficultySelector.jsx
 * 
 * Interactive 4-Tier Difficulty Selector & Topic Preview Card for Atlas English Arena.
 * Allows learners to choose their challenge level before starting the 180s sprint.
 */

import React from 'react';
import { Zap, ShieldCheck, Flame, Skull, Sparkles } from 'lucide-react';
import { ARENA_DIFFICULTY_CONFIG } from '../../utils/arenaStorageKeys.js';
import { useTranslation } from '../../i18n';

export default function ArenaDifficultySelector({
  selectedDifficulty = 'medium',
  onSelectDifficulty,
  currentTopic = null
}) {
  const { t, isEn } = useTranslation();

  const difficultyList = [
    {
      ...ARENA_DIFFICULTY_CONFIG.easy,
      icon: ShieldCheck,
      descVi: 'Từ vựng & bẫy cơ bản',
      descEn: 'Basic vocabulary & traps'
    },
    {
      ...ARENA_DIFFICULTY_CONFIG.medium,
      icon: Zap,
      descVi: 'Paraphrase B2 & bẫy nghe',
      descEn: 'B2 paraphrase & audio traps'
    },
    {
      ...ARENA_DIFFICULTY_CONFIG.hard,
      icon: Flame,
      descVi: 'Từ vựng C1 & bẫy logic',
      descEn: 'C1 lexicon & logic traps'
    },
    {
      ...ARENA_DIFFICULTY_CONFIG.nightmare,
      icon: Skull,
      descVi: 'Từ vựng C2 & logic cao cấp',
      descEn: 'C2 mastery & complex logic'
    }
  ];

  const selectedDiffObj = difficultyList.find(d => d.id === selectedDifficulty) || difficultyList[1];

  const getThemeByDiffId = (id) => {
    switch (id) {
      case 'easy':
        return {
          border: 'border-emerald-500/70',
          bg: 'bg-emerald-950/40 shadow-lg shadow-emerald-950/30',
          ring: 'ring-emerald-500/50',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs',
          text: 'text-emerald-300'
        };
      case 'medium':
        return {
          border: 'border-blue-500/70',
          bg: 'bg-blue-950/40 shadow-lg shadow-blue-950/30',
          ring: 'ring-blue-500/50',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-xs',
          text: 'text-blue-300'
        };
      case 'hard':
        return {
          border: 'border-purple-500/70',
          bg: 'bg-purple-950/40 shadow-lg shadow-purple-950/30',
          ring: 'ring-purple-500/50',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-xs',
          text: 'text-purple-300'
        };
      case 'nightmare':
        return {
          border: 'border-rose-500/70',
          bg: 'bg-rose-950/40 shadow-lg shadow-rose-950/30',
          ring: 'ring-rose-500/50',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs',
          text: 'text-rose-300'
        };
      default:
        return {
          border: 'border-slate-700',
          bg: 'bg-slate-900',
          ring: 'ring-slate-700',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          text: 'text-slate-300'
        };
    }
  };

  const activeMobileTheme = getThemeByDiffId(selectedDiffObj.id);

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 select-none">
      {/* Header: Label + Topic Pill */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEn ? 'Difficulty' : 'Cấp Độ'}</span>
        </label>
        {currentTopic && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 truncate max-w-[190px] sm:max-w-none">
            <span className="text-xs shrink-0">{currentTopic.icon}</span>
            <span className="truncate">{isEn ? currentTopic.nameEn : currentTopic.nameVi}</span>
          </div>
        )}
      </div>

      {/* MOBILE ONLY (sm:hidden): Native 4-Segment Tab Bar + Active Detail Card */}
      <div className="flex flex-col gap-1.5 sm:hidden">
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {difficultyList.map(diff => {
            const isSelected = selectedDifficulty === diff.id;
            const Icon = diff.icon;
            const theme = getThemeByDiffId(diff.id);

            let tabClass = 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40';
            if (isSelected) {
              tabClass = `${theme.bg} ${theme.text} border ${theme.border} font-bold shadow-sm`;
            }

            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => onSelectDifficulty?.(diff.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all cursor-pointer ${tabClass}`}
              >
                <Icon className="w-3.5 h-3.5 mb-0.5 shrink-0" />
                <span className="text-[11px] font-bold leading-none truncate w-full text-center">
                  {diff.id === 'nightmare' ? (isEn ? 'Nightm.' : 'Ác Mộng') : (isEn ? diff.nameEn.split(' ')[0] : diff.name.split(' ')[0])}
                </span>
                <span className="text-[9px] opacity-75 font-mono mt-0.5 leading-none">
                  +{diff.baseXpPerQuestion}XP
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Difficulty Full Un-truncated Detail Card */}
        <div className={`p-2 rounded-xl border transition-all ${activeMobileTheme.border} ${activeMobileTheme.bg}`}>
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5">
              <selectedDiffObj.icon className={`w-3.5 h-3.5 ${activeMobileTheme.text} shrink-0`} />
              <span className="text-xs font-black text-slate-100">
                {isEn ? selectedDiffObj.nameEn : selectedDiffObj.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <span className="text-emerald-400 font-bold">+{selectedDiffObj.baseXpPerQuestion} {isEn ? 'XP/q' : 'XP/câu'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-bold">~{selectedDiffObj.maxSprintXp} XP</span>
            </div>
          </div>
          <p className="text-[10.5px] text-slate-300 leading-tight">
            {isEn ? selectedDiffObj.descEn : selectedDiffObj.descVi}
          </p>
        </div>
      </div>

      {/* DESKTOP / TABLET (hidden sm:grid): 4-Column Card Grid */}
      <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-2">
        {difficultyList.map(diff => {
          const isSelected = selectedDifficulty === diff.id;
          const Icon = diff.icon;
          const theme = getThemeByDiffId(diff.id);

          let ringColor = 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300';
          let activeBadge = 'bg-slate-800 text-slate-400';

          if (isSelected) {
            ringColor = `${theme.border} ${theme.bg} ring-2 ${theme.ring} text-slate-100`;
            activeBadge = `${theme.badge} border`;
          }

          return (
            <button
              key={diff.id}
              type="button"
              onClick={() => onSelectDifficulty?.(diff.id)}
              className={`p-2 sm:p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] ${ringColor}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeBadge}`}>
                    +{diff.baseXpPerQuestion} XP
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-100 leading-tight">
                  {isEn ? diff.nameEn : diff.name}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-1 line-clamp-1 sm:line-clamp-2 leading-tight">
                  {isEn ? diff.descEn : diff.descVi}
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">{isEn ? 'Max' : 'Tối đa'}:</span>
                <span className="font-mono font-bold text-amber-400">~{diff.maxSprintXp} XP</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
