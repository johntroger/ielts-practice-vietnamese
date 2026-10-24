/**
 * src/components/arena/tower/ArenaTowerShopModal.jsx
 * 
 * Scholar Merchant Store: Spend Scholastic Gold on Potions, Relics, and Shields.
 */

import React from 'react';
import { useTranslation } from '../../../i18n';
import { 
  TOWER_CONSUMABLES_SHOP, 
  TOWER_RELICS_CATALOG 
} from '../../../services/gamification/towerOfBabelEngine.js';
import { Coins, ShoppingBag, Check, Shield, Clock, Sparkles } from 'lucide-react';

export default function ArenaTowerShopModal({
  isOpen,
  gold = 0,
  currentRelics = [],
  onBuyItem,
  onLeaveShop
}) {
  const { t, isEn } = useTranslation();

  if (!isOpen) return null;

  // Shop offers 3 consumables + 2 random unowned relics
  const ownedIds = currentRelics.map(r => r.id);
  const unownedRelics = TOWER_RELICS_CATALOG.filter(r => !ownedIds.includes(r.id)).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/60 rounded-3xl shadow-2xl text-white flex flex-col p-4 sm:p-6 gap-4 animate-in zoom-in-95 duration-200 max-h-[92dvh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Shop Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xl">
              🏪
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {isEn ? 'Mystic Scholar Merchant' : 'Quán Thương Nhân Cổ Ngữ'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEn ? '"Knowledge has a price, scholar. Spend your gold wisely."' : '"Tri thức luôn có giá, hỡi người leo tháp. Hãy tiêu vàng khôn ngoan."'}
              </p>
            </div>
          </div>

          {/* Current Gold Wallet */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm shadow-xs">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{gold}</span>
            <span className="text-[10px] text-amber-400 font-sans uppercase font-bold">Gold</span>
          </div>
        </div>

        {/* Consumable Potions Section */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            {isEn ? 'Consumable Elixirs & Shields' : 'Bình Dược Hồi Phục & Bùa Phép'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {TOWER_CONSUMABLES_SHOP.map((item) => {
              const canAfford = gold >= item.cost;
              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 gap-2 shadow-xs"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded-lg">
                        <Coins className="w-3 h-3" />
                        <span>{item.cost}</span>
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-100">
                      {isEn ? item.nameEn : item.nameVi}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isEn ? item.descEn : item.descVi}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => onBuyItem?.(item)}
                    className={`w-full mt-2 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                      canAfford
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 cursor-pointer active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{canAfford ? (isEn ? 'Buy' : 'Mua') : (isEn ? 'Not enough gold' : 'Thiếu vàng')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rare Artifact Relics for Sale */}
        {unownedRelics.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Ancient Relics for Sale' : 'Cổ Vật Quý Giá Bày Bán'}</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {unownedRelics.map((relic) => {
                const canAfford = gold >= relic.price;
                return (
                  <div
                    key={relic.id}
                    className="flex flex-col justify-between bg-purple-950/30 border border-purple-800/50 rounded-xl p-3 gap-2 shadow-xs"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{relic.icon}</span>
                        <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded-lg">
                          <Coins className="w-3 h-3" />
                          <span>{relic.price}</span>
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-purple-200">
                        {isEn ? relic.nameEn : relic.nameVi}
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        {isEn ? relic.descEn : relic.descVi}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => onBuyItem?.(relic, true)}
                      className={`w-full mt-2 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 cursor-pointer active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{canAfford ? (isEn ? 'Buy Relic' : 'Mua Cổ Vật') : (isEn ? 'Not enough gold' : 'Thiếu vàng')}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leave Shop Action */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onLeaveShop}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm active:scale-95"
          >
            {isEn ? 'Continue Ascension →' : 'Tiếp Tục Leo Tháp →'}
          </button>
        </div>
      </div>
    </div>
  );
}
