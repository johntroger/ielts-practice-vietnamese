/**
 * src/services/gamification/tacticalPerksService.js
 * 
 * Tactical Perks & Booster System for Atlas English Arena.
 * Allows learners to equip 1 strategic active/passive perk per sprint:
 * - TITAN_ARMOR (Passive): +1 Backup Tactical Shield (starts with 6 shields instead of 5)
 * - CHRONOS_FREEZE (Active 1-time): Freezes and adds +15 seconds to the match clock
 * - ORACLE_INSIGHT (Active 1-time): Instantly identifies and eliminates 1 false distractor trap
 */

export const ARENA_PERKS = {
  NONE: {
    id: 'none',
    nameVi: 'Thuần Phản Xạ',
    nameEn: 'Pure Reflex',
    icon: '⚡',
    badgeColor: 'border-slate-700 bg-slate-800/60 text-slate-400',
    descVi: 'Thi đấu thuần phản xạ tự nhiên không dùng bổ trợ',
    descEn: 'Natural reflex challenge without tactical boosters'
  },
  TITAN_ARMOR: {
    id: 'titan_armor',
    nameVi: 'Giáp Titan (+1 Khiên)',
    nameEn: 'Titan Armor (+1 Shield)',
    icon: '🛡️',
    badgeColor: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300',
    descVi: 'Tăng cường 1 khiên bảo hộ dự phòng (tổng 6 khiên thay vì 5)',
    descEn: 'Grants +1 backup tactical shield (6 shields instead of 5)'
  },
  CHRONOS_FREEZE: {
    id: 'chronos_freeze',
    nameVi: 'Ngưng Đọng Thời Gian (+15s)',
    nameEn: 'Chronos Freeze (+15s)',
    icon: '⏳',
    badgeColor: 'border-amber-500/50 bg-amber-950/40 text-amber-300',
    descVi: 'Đóng băng và cộng ngay 15 giây quý giá vào đồng hồ thi đấu',
    descEn: 'Freezes and adds +15 precious seconds to match timer'
  },
  ORACLE_INSIGHT: {
    id: 'oracle_insight',
    nameVi: 'Thấu Kính Triệt Tiêu (Loại 1 Bẫy)',
    nameEn: 'Oracle Trap Eliminator',
    icon: '🔍',
    badgeColor: 'border-purple-500/50 bg-purple-950/40 text-purple-300',
    descVi: 'Soi sáng và loại bỏ ngay 1 đáp án nhiễu sai trong câu hỏi',
    descEn: 'Instantly identifies and eliminates 1 false distractor'
  }
};

export const ARENA_PERK_LIST = [
  ARENA_PERKS.NONE,
  ARENA_PERKS.TITAN_ARMOR,
  ARENA_PERKS.CHRONOS_FREEZE,
  ARENA_PERKS.ORACLE_INSIGHT
];

/**
 * Returns perk details by id.
 */
export function getPerkById(perkId) {
  if (!perkId) return ARENA_PERKS.NONE;
  return Object.values(ARENA_PERKS).find(p => p.id === perkId) || ARENA_PERKS.NONE;
}
