/**
 * src/data/musicBank/index.js
 *
 * Dedicated, Forward-Compatible & Sharded Music Bank Registry for /music-listening.
 *
 * Architecture for Progressive Batch Scaling (Batch 1 -> Batch 17+ / 100+ Songs):
 * - Core Batch 1 (FREE Starter, 6 R2 songs) & Batch 2 (650 Gold, 6 R2 songs) are bundled directly.
 * - Expansion Batches 3..N (~90+ Hybrid songs: 30 Official US-UK YouTube Hits + 60 R2 Classic/CC-BY tracks)
 *   are stored in static sharded JSONs at `/data/banks/music_dictation/manifest.json` & `shard-*.json`
 *   so initial JS bundle size stays 0 KB heavier while scaling to 100+ songs!
 */

import { MUSIC_GENRES, MUSIC_LISTENING_TRACKS } from '../musicListeningData.js';

// Canonical Batch 1 (FREE Starter — 1 song per genre across all 6 core R2 genres)
const BATCH_1_CANONICAL_IDS = [
  'music-acoustic-crazy-glue',
  'music-indiepop-bad-sign',
  'music-storypop-hollow-grove',
  'music-jazz-cant-give-you-anything-but-love',
  'music-country-follow-the-road',
  'music-altrock-destroy-something-beautiful'
];

// Canonical Batch 2 (Expansion Wave 1 — 1 song per genre across all 6 core R2 genres)
const BATCH_2_CANONICAL_IDS = [
  'music-acoustic-branches',
  'music-indiepop-this-is-everything',
  'music-storypop-gemini',
  'music-jazz-invisible-light',
  'music-country-your-feets-too-big',
  'music-altrock-memory-replaced'
];

/**
 * Returns the deterministic core 12-song canonical list (Batch 1 & Batch 2).
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

  BATCH_1_CANONICAL_IDS.forEach(pushById);
  BATCH_2_CANONICAL_IDS.forEach(pushById);

  MUSIC_LISTENING_TRACKS.forEach((tr) => {
    if (tr?.id && !seen.has(tr.id)) {
      ordered.push(tr);
      seen.add(tr.id);
    }
  });

  return ordered;
}

export const CANONICAL_MUSIC_BANK = getCanonicalMusicBankTracks();

// =============================================================================
// LAZY SHARDED EXPANSION LOADER (/data/banks/music_dictation/)
// =============================================================================
let cachedManifest = null;
let manifestPromise = null;
const shardCache = new Map();
const shardPromiseCache = new Map();

export async function loadMusicBankManifest() {
  if (cachedManifest) return cachedManifest;
  if (manifestPromise) return manifestPromise;

  manifestPromise = (async () => {
    try {
      const res = await fetch('/data/banks/music_dictation/manifest.json', {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !Array.isArray(data.items)) return null;
      cachedManifest = data;
      return data;
    } catch {
      return null;
    }
  })();

  return manifestPromise;
}

export async function loadMusicBankShard(shardIndex) {
  if (shardCache.has(shardIndex)) return shardCache.get(shardIndex);
  if (shardPromiseCache.has(shardIndex)) return shardPromiseCache.get(shardIndex);

  const promise = (async () => {
    try {
      const res = await fetch(`/data/banks/music_dictation/shard-${shardIndex}.json`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) return [];
      const data = await res.json();
      if (Array.isArray(data)) {
        shardCache.set(shardIndex, data);
        return data;
      }
      return [];
    } catch {
      return [];
    }
  })();

  shardPromiseCache.set(shardIndex, promise);
  return promise;
}

/**
 * Builds lightweight placeholder track entries from manifest.json so `buildTrackBatches`
 * immediately creates all 17+ Batches without downloading full lyric payloads until needed.
 */
export function buildExpansionPlaceholders(manifest) {
  if (!manifest || !Array.isArray(manifest.items)) return [];
  return manifest.items.map((item) => ({
    ...item,
    _isShardPlaceholder: true,
    lines: [],
    vocabHighlights: []
  }));
}

export const MUSIC_BANK_MANIFEST = {
  trackKey: 'music_dictation',
  starterBatchSize: 6,
  expansionBatchSize: 6,
  unlockCostGold: 650,
  totalCoreSongs: CANONICAL_MUSIC_BANK.length,
  totalGenres: MUSIC_GENRES.filter(g => g.id !== 'all').length
};

export { MUSIC_GENRES };
