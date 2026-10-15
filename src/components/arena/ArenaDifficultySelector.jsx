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
      descVi: 'Từ vựng & bẫy cơ bản, biểu đồ đọc nhanh, nhịp độ vừa sức.',
      descEn: 'Basic vocabulary, simple traps, quick metrics reading.'
    },
    {
      ...ARENA_DIFFICULTY_CONFIG.medium,
      icon: Zap,
      descVi: 'Paraphrase học thuật B2, True/False/Not Given, bẫy nghe tự sửa.',
      descEn: 'B2 academic paraphrase, TFNG, self-correction audio traps.'
    },
    {
      ...ARENA_DIFFICULTY_CONFIG.hard,
      icon: Flame,
      descVi: 'Từ vựng C1 sắc bén, bẫy logic suy luận ngầm, bản đồ maps.',
      descEn: 'Sharp C1 vocabulary, implicit logic traps, spatial maps.'
    },
    {
      ...ARENA_DIFFICULTY_CONFIG.nightmare,
      icon: Skull,
      descVi: 'Từ vựng C2 đỉnh cao, logic phản chứng kép, biểu đồ mật độ cao.',
      descEn: 'Elite C2 lexicon, double-negative logic, dense charts.'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 select-none">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isEn ? 'Choose Difficulty Level' : 'Chọn Cấp Độ Thử Thách'}</span>
        </label>
        {currentTopic && (
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
            <span className="text-xs">{currentTopic.icon}</span>
            <span>{isEn ? currentTopic.nameEn : currentTopic.nameVi}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {difficultyList.map(diff => {
          const isSelected = selectedDifficulty === diff.id;
          const Icon = diff.icon;

          let ringColor = 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300';
          let activeBadge = 'bg-slate-800 text-slate-400';

          if (isSelected) {
            if (diff.id === 'easy') {
              ringColor = 'border-emerald-500/80 bg-emerald-950/30 ring-2 ring-emerald-500/40 text-emerald-200';
              activeBadge = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
            } else if (diff.id === 'medium') {
              ringColor = 'border-blue-500/80 bg-blue-950/30 ring-2 ring-blue-500/40 text-blue-200';
              activeBadge = 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
            } else if (diff.id === 'hard') {
              ringColor = 'border-purple-500/80 bg-purple-950/30 ring-2 ring-purple-500/40 text-purple-200';
              activeBadge = 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
            } else if (diff.id === 'nightmare') {
              ringColor = 'border-rose-500/80 bg-rose-950/30 ring-2 ring-rose-500/40 text-rose-200';
              activeBadge = 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
            }
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
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded ${activeBadge}`}>
                    +{diff.baseXpPerQuestion} {isEn ? 'XP/item' : 'XP/câu'}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-100 leading-tight">
                  {isEn ? diff.nameEn : diff.name}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 line-clamp-1 sm:line-clamp-2 leading-tight">
                  {isEn ? diff.descEn : diff.descVi}
                </div>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">{isEn ? 'Max Reward' : 'Tối Đa'}:</span>
                <span className="font-mono font-bold text-amber-400">~{diff.maxSprintXp} XP</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
