/**
 * src/components/arena/tower/ArenaTowerRelicPickerModal.jsx
 * 
 * Reward Screen: Choose 1 of 3 Synergistic Relics after clearing an Elite or Treasure Chamber.
 */

import React from 'react';
import { useTranslation } from '../../../i18n';
import { Sparkles, Trophy, Check } from 'lucide-react';

export default function ArenaTowerRelicPickerModal({
  isOpen,
  relics = [],
  onSelectRelic
}) {
  const { t, isEn } = useTranslation();

  if (!isOpen || !relics || relics.length === 0) return null;

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'rare':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/60 rounded-3xl shadow-2xl text-white flex flex-col p-4 sm:p-6 gap-4 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center text-center gap-1">
          <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300">
            {isEn ? 'Choose 1 Scholastic Artifact Relic' : 'Chọn 1 Cổ Vật Hàn Lâm'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isEn 
              ? 'This artifact will grant passive mastery bonuses for the remainder of your expedition.' 
              : 'Cổ vật này sẽ gia tăng vĩnh viễn sức mạnh khảo thí cho suốt chuyến leo tháp.'}
          </p>
        </div>

        {/* 3 Relic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
          {relics.map((relic) => (
            <div
              key={relic.id}
              className="flex flex-col justify-between bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 hover:border-indigo-400/80 rounded-2xl p-4 gap-3 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/20 group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner group-hover:scale-110 transition-transform">
                    {relic.icon}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRarityBadge(relic.rarity)}`}>
                    {relic.rarity}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-100 group-hover:text-indigo-200 transition-colors">
                  {isEn ? relic.nameEn : relic.nameVi}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? relic.descEn : relic.descVi}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectRelic?.(relic)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{isEn ? 'Claim Artifact' : 'Nhận Cổ Vật'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
