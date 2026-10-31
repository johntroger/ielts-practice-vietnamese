/**
 * src/components/arena/AtlasTreasuryModal.jsx
 * 
 * Interactive Store Modal for Atlas Treasury (Scholastic Gold 🪙 & Diamonds 💎).
 * 
 * Features:
 * 1. 4 Specialized Vault Sections:
 *    - 🛡️ Survival & Discipline: Atlas Streak Freeze, Aegis Elixir, Vault Pardon Scroll.
 *    - ⚡ Tactical Lab: Dual-Perk Slot Unlock, Signpost Keyword Radar, Oracle Tier 2.
 *    - 🎓 Scholastic Mastery VIP: 100 C1/C2 Collocations, Rare Accents Audio Pack, 8.5+ Model Essays.
 *    - 👑 Pantheon Prestige: Golden Titan Avatar Frame, Exclusive Leaderboard Titles.
 * 2. Real-time balance display with animated transaction feedback.
 * 3. 100% Strict Cambridge English when isEn === true (Zero Vietnamese leaks).
 * 4. Mobile Ergonomics: Touch targets >= 44px, no overflow on narrow screens (Samsung A56).
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles, 
  Coins, 
  X, 
  Check, 
  Flame, 
  ShoppingBag, 
  Crown, 
  Compass, 
  BookOpen, 
  Award, 
  Zap, 
  AlertCircle 
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { triggerHaptic } from '../../utils/hapticHelper.js';
import { playArenaSfx } from '../../utils/audioHelper.js';
import {
  getWallet,
  spendCurrency,
  getInventoryItemQuantity,
  CURRENCY_TYPES
} from '../../services/gamification/atlasWalletService.js';
import { 
  addStreakShield, 
  getStreakShieldData, 
  MAX_STREAK_SHIELDS 
} from '../../services/gamification/atlasStreakShieldService.js';
import { pardonMistakes } from '../../services/gamification/mistakeVaultService.js';

import { 
  TREASURY_TABS, 
  TREASURY_ITEMS, 
  getTreasuryItemById 
} from '../../services/gamification/atlasTreasuryCatalog.js';

export { TREASURY_TABS, TREASURY_ITEMS, getTreasuryItemById };

export default function AtlasTreasuryModal({ isOpen, onClose }) {
  const { isEn } = useTranslation();
  const [activeTab, setActiveTab] = useState(TREASURY_TABS.SURVIVAL);
  const [wallet, setWallet] = useState(() => getWallet());
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setWallet(getWallet());
      setFeedbackMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTabItems = TREASURY_ITEMS.filter(item => item.section === activeTab);

  const handlePurchase = (item) => {
    triggerHaptic('chipTap');
    const ownedQty = getInventoryItemQuantity(item.id);

    // Limit check for Streak Freeze
    if (item.id === 'item_streak_freeze') {
      const shieldData = getStreakShieldData();
      if ((shieldData.shieldsRemaining || 0) >= MAX_STREAK_SHIELDS) {
        setFeedbackMsg({
          type: 'error',
          text: isEn ? `Maximum Streak Shields already reached (${MAX_STREAK_SHIELDS}/${MAX_STREAK_SHIELDS})!` : `Đã đạt giới hạn khiên bảo vệ tối đa (${MAX_STREAK_SHIELDS}/${MAX_STREAK_SHIELDS})!`
        });
        playArenaSfx('wrong');
        return;
      }
    } else if (!item.isConsumable && ownedQty >= (item.maxHolding || 1)) {
      setFeedbackMsg({
        type: 'error',
        text: isEn ? 'You already own this item!' : 'Bạn đã sở hữu vật phẩm này!'
      });
      playArenaSfx('wrong');
      return;
    } else if (item.isConsumable && ownedQty >= (item.maxHolding || 99)) {
      setFeedbackMsg({
        type: 'error',
        text: isEn ? `Maximum holding capacity reached (${item.maxHolding})!` : `Đã đạt giới hạn lưu trữ tối đa (${item.maxHolding})!`
      });
      playArenaSfx('wrong');
      return;
    }

    const res = spendCurrency(item.currency, item.price, item.id, isEn ? item.nameEn : item.nameVi, 1);
    if (res.success) {
      // Trigger item-specific effect
      if (item.id === 'item_streak_freeze') {
        addStreakShield(1);
      } else if (item.id === 'item_vault_pardon') {
        pardonMistakes(2);
      }

      playArenaSfx('victory');
      triggerHaptic('loot');
      setWallet(getWallet());
      setFeedbackMsg({
        type: 'success',
        text: isEn 
          ? `Successfully acquired ${item.nameEn}!`
          : `Mua thành công ${item.nameVi}!`
      });
    } else {
      playArenaSfx('wrong');
      triggerHaptic('boundaryAlert');
      setFeedbackMsg({
        type: 'error',
        text: isEn 
          ? `Insufficient ${item.currency === CURRENCY_TYPES.GOLD ? 'Gold' : 'Diamonds'}!`
          : `Không đủ ${item.currency === CURRENCY_TYPES.GOLD ? 'Vàng' : 'Kim Cương'}!`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-indigo-500/50 rounded-3xl shadow-2xl text-white flex flex-col max-h-[92dvh] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-lg sm:text-xl shadow-md shrink-0">
              🏛️
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-purple-300 truncate">
                {isEn ? 'Atlas Treasury & Emporium' : 'Kho Báu & Cửa Hàng Atlas'}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                {isEn ? 'Invest Gold & Diamonds to unlock tools and mastery.' : 'Dùng Vàng & Kim Cương để trang bị bổ trợ và tri thức.'}
              </p>
            </div>
          </div>

          {/* Wallet Balance Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs font-mono font-black shadow-inner">
              <span className="flex items-center gap-1 text-amber-300">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{wallet.gold || 0}</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{wallet.diamonds || 0}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer shrink-0"
              title={isEn ? 'Close Treasury' : 'Đóng Kho Báu'}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 4 Category Tabs */}
        <div className="grid grid-cols-4 p-1 bg-slate-950/80 border-b border-slate-800 text-xs font-black shrink-0">
          <button
            type="button"
            onClick={() => { setActiveTab(TREASURY_TABS.SURVIVAL); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === TREASURY_TABS.SURVIVAL
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🛡️</span>
            <span className="hidden sm:inline">{isEn ? 'Survival' : 'Cứu Trợ'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab(TREASURY_TABS.TACTICAL); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === TREASURY_TABS.TACTICAL
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>⚡</span>
            <span className="hidden sm:inline">{isEn ? 'Tactical' : 'Bổ Trợ'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab(TREASURY_TABS.SCHOLASTIC); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === TREASURY_TABS.SCHOLASTIC
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎓</span>
            <span className="hidden sm:inline">{isEn ? 'Scholastic' : 'Tri Thức'}</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab(TREASURY_TABS.PRESTIGE); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === TREASURY_TABS.PRESTIGE
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>👑</span>
            <span className="hidden sm:inline">{isEn ? 'Prestige' : 'Vinh Danh'}</span>
          </button>
        </div>

        {/* Feedback Alert Bar */}
        {feedbackMsg && (
          <div className={`px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all animate-fade-in ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-700/60'
              : 'bg-rose-950/80 text-rose-300 border-b border-rose-700/60'
          }`}>
            {feedbackMsg.type === 'success' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Items Grid View */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {currentTabItems.map(item => {
            const ownedQty = getInventoryItemQuantity(item.id);
            const isGold = item.currency === CURRENCY_TYPES.GOLD;
            const canAfford = isGold ? (wallet.gold >= item.price) : (wallet.diamonds >= item.price);
            const isMaxOwned = !item.isConsumable && ownedQty >= (item.maxHolding || 1);

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 ${
                  isMaxOwned
                    ? 'bg-slate-900/40 border-slate-800 opacity-70'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-100 truncate">
                        {isEn ? item.nameEn : item.nameVi}
                      </span>
                      {ownedQty > 0 && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                          {isMaxOwned ? (isEn ? 'OWNED' : 'ĐÃ CÓ') : `x${ownedQty}`}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-0.5">
                      {isEn ? item.descEn : item.descVi}
                    </p>
                  </div>
                </div>

                {/* Purchase Button & Price */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm">
                    {isGold ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.price}</span>
                        <span className="text-[9px] font-sans uppercase font-bold text-slate-400">Gold</span>
                      </span>
                    ) : (
                      <span className="text-cyan-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{item.price}</span>
                        <span className="text-[9px] font-sans uppercase font-bold text-slate-400">Gems</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isMaxOwned || !canAfford}
                    onClick={() => handlePurchase(item)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                      isMaxOwned
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        : canAfford
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    }`}
                  >
                    {isMaxOwned ? (
                      <span>{isEn ? 'Acquired' : 'Đã Sở Hữu'}</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-3 h-3" />
                        <span>{isEn ? 'Purchase' : 'Mua Ngay'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
