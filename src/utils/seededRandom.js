/**
 * src/utils/seededRandom.js
 * 
 * Deterministic Pseudo-Random Number Generator (PRNG) using Mulberry32 & MurmurHash3.
 * Generates immutable offline rivals, consistent shuffling seeds, and deterministic baseline stats.
 */

/**
 * Creates a 32-bit hash from a string seed.
 * @param {string} str 
 * @returns {number}
 */
export function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/**
 * Mulberry32 PRNG generator for deterministic float numbers [0, 1).
 * @param {number} seed 
 * @returns {() => number}
 */
export function createMulberry32(seed) {
  let s = seed >>> 0;
  return function next() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a seeded random integer in range [min, max] inclusive.
 * @param {() => number} rng 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function seededInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}
