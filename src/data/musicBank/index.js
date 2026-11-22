/**
 * src/data/musicBank/index.js
 *
 * Dedicated, Forward-Compatible Music Bank Registry for /music-listening.
 *
 * Architecture for Progressive Batch Scaling (Batch 1 -> Batch N):
 * - Batch 1 (FREE Starter, 6 songs): Always includes 1 curated track from each of the 6 musical genres
 *   so Guests & new learners experience every style immediately.
 * - Batch 2 (650 Gold, 6 songs): Expansion wave #1 with 1 new track per genre.
 * - Future Expansion Batches (Batch 3, 4, ... N):
 *   To add new songs gradually over time without EVER shifting existing unlocked batches,
 *   create a new module (e.g., `src/data/musicBank/batch3Tracks.js`) and append it to
 *   `FUTURE_MUSIC_BANK_BATCHES` below. `batchProgressionService` automatically slices every
 *   6 appended tracks into Batch 3, Batch 4, ... Batch N.
 */

import { MUSIC_GENRES, MUSIC_LISTENING_TRACKS } from '../musicListeningData.js';

// Canonical Batch 1 (FREE Starter — 1 song per genre across all 6 genres)
const BATCH_1_CANONICAL_IDS = [
  'music-acoustic-crazy-glue',
  'music-indiepop-bad-sign',
  'music-storypop-hollow-grove',
  'music-jazz-cant-give-you-anything-but-love',
  'music-country-follow-the-road',
  'music-altrock-destroy-something-beautiful'
];

// Canonical Batch 2 (Expansion Wave 1 — 1 song per genre across all 6 genres)
const BATCH_2_CANONICAL_IDS = [
  'music-acoustic-branches',
  'music-indiepop-this-is-everything',
  'music-storypop-gemini',
  'music-jazz-invisible-light',
  'music-country-your-feets-too-big',
  'music-altrock-memory-replaced'
];

// Append future batch arrays here (e.g. ...batch3Tracks, ...batch4Tracks)
// Existing Batch 1 & Batch 2 indices will NEVER shift when new songs are appended.
const FUTURE_MUSIC_BANK_BATCHES = [];

/**
 * Returns the deterministic, forward-compatible canonical song list for `buildTrackBatches`.
 */
export function getCanonicalMusicBankTracks() {
  const trackById = new Map();
  MUSIC_LISTENING_TRACKS.forEach((tr) => {
    if (tr?.id) trackById.set(tr.id, tr);
  });

  const ordered = [];
  const seen = new Set();

  const pushById = (id) => {
    if (seen.has(id)) return;
    const found = trackById.get(id);
    if (found) {
      ordered.push(found);
      seen.add(id);
    }
  };

  // 1. Batch 1 (Starter 6 songs — all 6 genres represented)
  BATCH_1_CANONICAL_IDS.forEach(pushById);

  // 2. Batch 2 (Expansion 6 songs — all 6 genres represented)
  BATCH_2_CANONICAL_IDS.forEach(pushById);

  // 3. Any remaining tracks in MUSIC_LISTENING_TRACKS not yet listed
  MUSIC_LISTENING_TRACKS.forEach((tr) => {
    if (tr?.id && !seen.has(tr.id)) {
      ordered.push(tr);
      seen.add(tr.id);
    }
  });

  // 4. Future expansion batches appended over time
  FUTURE_MUSIC_BANK_BATCHES.forEach((tr) => {
    if (tr?.id && !seen.has(tr.id)) {
      ordered.push(tr);
      seen.add(tr.id);
    }
  });

  return ordered;
}

export const CANONICAL_MUSIC_BANK = getCanonicalMusicBankTracks();

export const MUSIC_BANK_MANIFEST = {
  trackKey: 'music_dictation',
  starterBatchSize: 6,
  expansionBatchSize: 6,
  unlockCostGold: 650,
  totalSongs: CANONICAL_MUSIC_BANK.length,
  totalGenres: MUSIC_GENRES.filter(g => g.id !== 'all').length
};

export { MUSIC_GENRES };
