/**
 * src/utils/dateHelper.js
 * 
 * Deterministic ISO-8601 Calendar & Date utilities.
 * Synchronizes 100% with PostgreSQL TO_CHAR(NOW() AT TIME ZONE 'UTC', 'IYYY-"W"IW').
 */

/**
 * Returns the ISO-8601 Week Key string (e.g. '2026-W41') for any given Date.
 * Starts on Monday (ISO standard).
 * @param {Date} [d=new Date()]
 * @returns {string} e.g. '2026-W41'
 */
export function getIsoWeekKey(d = new Date()) {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Day number: Monday = 1, Sunday = 7
  const dayNum = target.getUTCDay() || 7;
  // Nearest Thursday: target + 4 - dayNum
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Returns UTC Month Key string (e.g. '2026-10')
 * @param {Date} [d=new Date()]
 * @returns {string} e.g. '2026-10'
 */
export function getUtcMonthKey(d = new Date()) {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Returns local YYYY-MM-DD string for calculating daily streak and soft-cap reset.
 * @param {Date} [d=new Date()]
 * @returns {string} e.g. '2026-10-11'
 */
export function getLocalDateKey(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
