/**
 * src/services/gamification/levelEngine.js
 * 
 * Production 100-Level Mathematical Progression Engine for Atlas English Arena.
 * Features:
 * - 100-Level Long-Term Retention Curve: XP_total(L) = 22 * (L - 1)^2 + 60 * (L - 1)
 * - Quick Early Wins: Lv.1 -> Lv.2 takes only 82 XP (1 single arena sprint)
 * - Progressive Resistance: Lv.100 reaches 221,562 XP (1-2 years of consistent learning)
 * - Exact closed-form inverse formula mapping any XP to 1-100 Level
 * - 6 Mythic Atlas Titan Tiers:
 *   1. Atlas Seeker (Lv.1 - 10)
 *   2. Atlas Gladiator (Lv.11 - 25) [Current Tier of tranthanhtung37 at Lv.20]
 *   3. Atlas Centurion (Lv.26 - 45)
 *   4. Atlas Skybearer (Lv.46 - 70)
 *   5. Atlas Titan (Lv.71 - 90)
 *   6. Primordial Atlas (Lv.91 - 100+)
 */

export const MAX_ATLAS_LEVEL = 100;

export const ATLAS_TITAN_TIERS = {
  SEEKER: {
    id: 'seeker',
    minLevel: 1,
    maxLevel: 10,
    titleVi: 'Kẻ Khởi Hành Atlas',
    titleEn: 'Atlas Seeker',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-600/60',
    ringColor: 'ring-slate-500/50',
    frameColor: 'border-slate-500 shadow-slate-500/20',
    glowColor: 'from-slate-600 to-slate-400',
    accentText: 'text-slate-300'
  },
  GLADIATOR: {
    id: 'gladiator',
    minLevel: 11,
    maxLevel: 25,
    titleVi: 'Đấu Sĩ Đấu Trường',
    titleEn: 'Atlas Gladiator',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
    ringColor: 'ring-emerald-500/50',
    frameColor: 'border-emerald-500 shadow-emerald-500/30',
    glowColor: 'from-emerald-500 to-teal-400',
    accentText: 'text-emerald-400'
  },
  CENTURION: {
    id: 'centurion',
    minLevel: 26,
    maxLevel: 45,
    titleVi: 'Chiến Tướng Atlas',
    titleEn: 'Atlas Centurion',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/50',
    ringColor: 'ring-amber-500/50',
    frameColor: 'border-amber-500 shadow-amber-500/30',
    glowColor: 'from-amber-500 to-yellow-400',
    accentText: 'text-amber-400'
  },
  SKYBEARER: {
    id: 'skybearer',
    minLevel: 46,
    maxLevel: 70,
    titleVi: 'Người Gánh Vác Bầu Trời',
    titleEn: 'Atlas Skybearer',
    badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50',
    ringColor: 'ring-cyan-500/50',
    frameColor: 'border-cyan-500 shadow-cyan-500/40',
    glowColor: 'from-cyan-500 to-blue-400',
    accentText: 'text-cyan-400'
  },
  TITAN: {
    id: 'titan',
    minLevel: 71,
    maxLevel: 90,
    titleVi: 'Đại Thần Titan',
    titleEn: 'Atlas Titan',
    badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/50',
    ringColor: 'ring-purple-500/50',
    frameColor: 'border-purple-500 shadow-purple-500/40',
    glowColor: 'from-purple-500 to-fuchsia-400',
    accentText: 'text-purple-400'
  },
  PRIMORDIAL: {
    id: 'primordial',
    minLevel: 91,
    maxLevel: 999,
    titleVi: 'Atlas Tối Thượng',
    titleEn: 'Primordial Atlas',
    badgeColor: 'bg-rose-950/90 text-rose-300 border-rose-500/60',
    ringColor: 'ring-rose-500/60 ring-offset-1',
    frameColor: 'border-rose-500 shadow-rose-500/50',
    glowColor: 'from-rose-500 via-amber-400 to-rose-600',
    accentText: 'text-rose-400'
  }
};

/**
 * Calculates total cumulative XP required to reach Level L.
 * Formula: 22 * (L - 1)^2 + 60 * (L - 1)
 * @param {number} level 
 * @returns {number}
 */
export function calculateXpForLevel(level) {
  const L = Math.max(1, Math.floor(Number(level) || 1));
  if (L === 1) return 0;
  return 22 * Math.pow(L - 1, 2) + 60 * (L - 1);
}

/**
 * Calculates Level (1-100+) from cumulative Lifetime XP using the exact inverse formula:
 * 22*(L-1)^2 + 60*(L-1) - XP = 0
 * L - 1 = (-60 + sqrt(3600 + 88 * XP)) / 44
 * @param {number} totalXp 
 * @returns {number} Level (integer between 1 and MAX_ATLAS_LEVEL)
 */
export function calculateLevelFromXp(totalXp) {
  const xp = Math.max(0, Number(totalXp) || 0);
  if (xp === 0) return 1;

  const delta = 3600 + 88 * xp;
  const levelFloat = (-60 + Math.sqrt(delta)) / 44 + 1;
  const level = Math.max(1, Math.floor(levelFloat));
  return Math.min(MAX_ATLAS_LEVEL, level);
}

/**
 * Returns Atlas Titan tier metadata for a given level.
 * @param {number} level 
 * @returns {Object} Tier object
 */
export function getLevelTierInfo(level) {
  const L = Math.max(1, Math.floor(Number(level) || 1));
  if (L >= ATLAS_TITAN_TIERS.PRIMORDIAL.minLevel) return ATLAS_TITAN_TIERS.PRIMORDIAL;
  if (L >= ATLAS_TITAN_TIERS.TITAN.minLevel) return ATLAS_TITAN_TIERS.TITAN;
  if (L >= ATLAS_TITAN_TIERS.SKYBEARER.minLevel) return ATLAS_TITAN_TIERS.SKYBEARER;
  if (L >= ATLAS_TITAN_TIERS.CENTURION.minLevel) return ATLAS_TITAN_TIERS.CENTURION;
  if (L >= ATLAS_TITAN_TIERS.GLADIATOR.minLevel) return ATLAS_TITAN_TIERS.GLADIATOR;
  return ATLAS_TITAN_TIERS.SEEKER;
}

/**
 * Detailed level progression payload for UI rendering (progress bar, xp remaining, next level base).
 * @param {number} totalXp 
 * @returns {{
 *   level: number,
 *   currentLevelBaseXp: number,
 *   nextLevelBaseXp: number,
 *   xpIntoLevel: number,
 *   xpRequiredForNextLevel: number,
 *   xpRemaining: number,
 *   progressPercent: number,
 *   tier: Object,
 *   isMaxLevel: boolean
 * }}
 */
export function calculateLevelProgress(totalXp) {
  const xp = Math.max(0, Number(totalXp) || 0);
  const level = calculateLevelFromXp(xp);
  const isMaxLevel = level >= MAX_ATLAS_LEVEL;

  const currentLevelBaseXp = calculateXpForLevel(level);
  const nextLevelBaseXp = isMaxLevel ? currentLevelBaseXp : calculateXpForLevel(level + 1);

  const xpRequiredForNextLevel = Math.max(1, nextLevelBaseXp - currentLevelBaseXp);
  const xpIntoLevel = Math.max(0, xp - currentLevelBaseXp);
  const xpRemaining = isMaxLevel ? 0 : Math.max(0, nextLevelBaseXp - xp);
  const progressPercent = isMaxLevel ? 100 : Math.min(100, Math.max(0, Math.round((xpIntoLevel / xpRequiredForNextLevel) * 100)));

  return {
    level,
    currentLevelBaseXp,
    nextLevelBaseXp,
    xpIntoLevel,
    xpRequiredForNextLevel,
    xpRemaining,
    progressPercent,
    tier: getLevelTierInfo(level),
    isMaxLevel
  };
}
