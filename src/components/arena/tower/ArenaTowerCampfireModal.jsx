/**
 * src/components/arena/tower/ArenaTowerCampfireModal.jsx
 * 
 * Scholastic Campfire Rest Site:
 * Offers the tactical choice between Healing +2 Shields or Purging a Mistake from Vault.
 */

import React from 'react';
import { useTranslation } from '../../../i18n';
import { Flame, Shield, Trash2 } from 'lucide-react';

export default function ArenaTowerCampfireModal({
  isOpen,
  currentShields = 5,
  maxShields = 5,
  unresolvedMistakeCount = 0,
  onChooseRest,
  onChoosePurge
}) {
  const { t, isEn } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-slate-900 border-2 border-emerald-500/60 rounded-3xl shadow-2xl text-white flex flex-col p-4 sm:p-6 gap-4 animate-in zoom-in-95 duration-200 text-center"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1 animate-pulse text-3xl">
            ⛺
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-300">
            {isEn ? 'Scholastic Campfire Sanctuary' : 'Lửa Trại Hàn Lâm Yên Bình'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {isEn 
              ? 'The warm glow of the fire calms your scholarly mind. Choose your recovery action wisely before ascending.'
              : 'Ánh lửa trại ấm áp xoa dịu tâm trí bạn. Hãy chọn một hành động hồi phục trước khi tiếp tục cuộc hành trình.'}
          </p>
        </div>

        {/* 2 Strategic Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
          {/* Option 1: Rest & Heal Shields */}
          <button
            type="button"
            onClick={onChooseRest}
            className="flex flex-col items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/30 transition-all cursor-pointer group shadow-lg active:scale-95 text-center gap-3"
          >
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 fill-emerald-500/30" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                {isEn ? 'Rest & Repair' : 'Nghỉ Ngơi Hồi Phục'}
              </h3>
              <p className="text-xs text-slate-300">
                {isEn ? 'Restores +2 broken Shields.' : 'Hồi phục ngay +2 Khiên bị vỡ.'}
              </p>
              <span className="text-[11px] font-mono text-emerald-400 mt-1">
                {currentShields}/{maxShields} Shields
              </span>
            </div>
            <span className="w-full py-1.5 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white font-bold text-xs shadow-xs">
              {isEn ? 'Select (+2 Shields)' : 'Chọn (+2 Khiên)'}
            </span>
          </button>

          {/* Option 2: Purge a Mistake */}
          <button
            type="button"
            disabled={unresolvedMistakeCount === 0}
            onClick={onChoosePurge}
            className={`flex flex-col items-center justify-between p-4 rounded-2xl border-2 transition-all group shadow-lg text-center gap-3 ${
              unresolvedMistakeCount > 0
                ? 'bg-gradient-to-b from-slate-800/80 to-slate-900/90 border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30 cursor-pointer active:scale-95'
                : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 group-hover:scale-110 transition-transform">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                {isEn ? 'Purge Vault Mistake' : 'Thanh Tẩy Sai Lầm'}
              </h3>
              <p className="text-xs text-slate-300">
                {isEn ? 'Eliminates 1 recorded error from your Mistake Vault.' : 'Xóa vĩnh viễn 1 câu lỗi khỏi Hầm Ngục Sai Lầm.'}
              </p>
              <span className="text-[11px] font-mono text-amber-400 mt-1">
                {unresolvedMistakeCount} {isEn ? 'unresolved errors' : 'lỗi chưa chuộc'}
              </span>
            </div>
            <span className={`w-full py-1.5 rounded-lg font-bold text-xs shadow-xs ${
              unresolvedMistakeCount > 0 ? 'bg-amber-600 group-hover:bg-amber-500 text-white' : 'bg-slate-800 text-slate-500'
            }`}>
              {unresolvedMistakeCount > 0 
                ? (isEn ? 'Select (Purge 1)' : 'Chọn (Xóa 1 Lỗi)') 
                : (isEn ? 'No errors in Vault' : 'Hầm không có lỗi')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
