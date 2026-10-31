/**
 * src/services/gamification/atlasTreasuryCatalog.js
 * 
 * Master Catalog of Items & Perks available in Atlas Treasury Store.
 * Pure ES module (clean separation from JSX component for unit tests and headless runtime).
 */

import { CURRENCY_TYPES } from './atlasWalletService.js';

export const TREASURY_TABS = {
  SURVIVAL: 'survival',
  TACTICAL: 'tactical',
  SCHOLASTIC: 'scholastic',
  PRESTIGE: 'prestige'
};

export const TREASURY_ITEMS = [
  // --- Section 1: Survival & Discipline ---
  {
    id: 'item_streak_freeze',
    section: TREASURY_TABS.SURVIVAL,
    nameVi: 'Băng Giữ Chuỗi (Streak Freeze)',
    nameEn: 'Atlas Streak Freeze',
    descVi: 'Tự động cứu chuỗi ngày học nếu bạn bận đột xuất 1 ngày (tối đa dự trữ 2 khiên).',
    descEn: 'Automatically saves your streak if you miss a day of practice (max 2 held).',
    price: 350,
    currency: CURRENCY_TYPES.GOLD,
    icon: '🛡️',
    isConsumable: true,
    maxHolding: 2
  },
  {
    id: 'item_aegis_elixir',
    section: TREASURY_TABS.SURVIVAL,
    nameVi: 'Đan Dược Hồi Khiên (Aegis Elixir)',
    nameEn: 'Aegis Shield Elixir',
    descVi: 'Hồi phục ngay +1 khiên dự phòng khi trận đấu chỉ còn 1 khiên duy nhất.',
    descEn: 'Restores +1 backup tactical shield when down to your final shield in combat.',
    price: 120,
    currency: CURRENCY_TYPES.GOLD,
    icon: '🧪',
    isConsumable: true,
    maxHolding: 5
  },
  {
    id: 'item_vault_pardon',
    section: TREASURY_TABS.SURVIVAL,
    nameVi: 'Khế Ước Thanh Tẩy (Pardon Scroll)',
    nameEn: 'Mistake Pardon Scroll',
    descVi: 'Miễn trừ 2 câu hỏi sai đã nắm vững ra khỏi Hầm Ngục Sai Lầm.',
    descEn: 'Pardons and removes 2 mastered questions from your Mistake Vault.',
    price: 150,
    currency: CURRENCY_TYPES.GOLD,
    icon: '📜',
    isConsumable: true,
    maxHolding: 10
  },

  // --- Section 2: Tactical Lab ---
  {
    id: 'item_dual_perk_slot',
    section: TREASURY_TABS.TACTICAL,
    nameVi: 'Khe Bổ Trợ Thứ 2 (Dual Perk Slot)',
    nameEn: 'Dual-Perk Harness Slot',
    descVi: 'Mở khóa vĩnh viễn: Cho phép trang bị đồng thời 2 Phép Bổ Trợ khi vào trận.',
    descEn: 'Permanent Unlock: Equip 2 Tactical Perks simultaneously in any arena sprint.',
    price: 80,
    currency: CURRENCY_TYPES.DIAMONDS,
    icon: '⚡',
    isConsumable: false,
    maxHolding: 1
  },
  {
    id: 'item_signpost_radar',
    section: TREASURY_TABS.TACTICAL,
    nameVi: 'Kính Soi Từ Khóa (Signpost Radar)',
    nameEn: 'Signpost Keyword Radar',
    descVi: 'Tự động làm nổi bật các liên từ chuyển hướng (However, Despite) trong câu hỏi khó (5 lượt).',
    descEn: 'Highlights key contrast discourse markers in complex reading items (5 charges).',
    price: 100,
    currency: CURRENCY_TYPES.GOLD,
    icon: '🧭',
    isConsumable: true,
    maxHolding: 15
  },

  // --- Section 3: Scholastic Mastery VIP ---
  {
    id: 'item_c1_c2_collocations',
    section: TREASURY_TABS.SCHOLASTIC,
    nameVi: '100 C1/C2 Academic Collocations',
    nameEn: '100 C1/C2 Academic Collocations',
    descVi: 'Mở khóa trọn bộ 100 cụm từ kết hợp học thuật C1/C2 cao cấp vào Sổ Tay Từ Vựng.',
    descEn: 'Permanent access to 100 C1/C2 golden academic collocations in your Vocab Notebook.',
    price: 50,
    currency: CURRENCY_TYPES.DIAMONDS,
    icon: '📚',
    isConsumable: false,
    maxHolding: 1
  },
  {
    id: 'item_rare_accents_pack',
    section: TREASURY_TABS.SCHOLASTIC,
    nameVi: 'Bộ Đề Nghe Giọng Hiếm (Rare Accents)',
    nameEn: 'Rare Accents Listening Pack',
    descVi: 'Bổ sung các câu hỏi nghe giọng địa phương Scotland, xứ Wales và New Zealand.',
    descEn: 'Unlocks rare dialect audio listening drills (Scottish, Welsh, and Kiwi accents).',
    price: 60,
    currency: CURRENCY_TYPES.DIAMONDS,
    icon: '🎧',
    isConsumable: false,
    maxHolding: 1
  },

  // --- Section 4: Pantheon Prestige ---
  {
    id: 'item_titan_gold_frame',
    section: TREASURY_TABS.PRESTIGE,
    nameVi: 'Khung Avatar Hoàng Kim Titan',
    nameEn: 'Golden Titan Avatar Frame',
    descVi: 'Khung viền phát sáng hoàng kim vinh danh trên Bảng Xếp Hạng thực và hồ sơ.',
    descEn: 'Gleaming golden neon border displayed on your profile and Real Leaderboard.',
    price: 150,
    currency: CURRENCY_TYPES.DIAMONDS,
    icon: '👑',
    isConsumable: false,
    maxHolding: 1
  },
  {
    id: 'item_title_lexical_alchemist',
    section: TREASURY_TABS.PRESTIGE,
    nameVi: 'Danh Hiệu: The Lexical Alchemist',
    nameEn: 'Title: The Lexical Alchemist',
    descVi: 'Danh xưng huyền thoại dành cho bậc thầy từ vựng học thuật.',
    descEn: 'Exclusive prestigious title badge displayed beside your learner name.',
    price: 40,
    currency: CURRENCY_TYPES.DIAMONDS,
    icon: '✨',
    isConsumable: false,
    maxHolding: 1
  }
];

export function getTreasuryItemById(id) {
  return TREASURY_ITEMS.find(item => item.id === id) || null;
}
