/**
 * src/services/data/bankShardService.js
 *
 * Scalable Static-Manifest + Batch-Sharded JSON Loader for Large Practice Banks (1,000 -> 22,000+ items).
 *
 * Architecture:
 * 1. Fetches only a tiny ~1 KB `manifest.json` per sharded track (`/data/banks/<trackKey>/manifest.json`).
 * 2. Generates deterministic lightweight placeholders (`_isShardPlaceholder: true`) so `batchProgressionService`
 *    can build 100+ Batches and calculate exact `completedCount/totalCount` at 0 KB shard download cost.
 * 3. Lazily fetches ONLY the 100-item shard JSON (~13 KB gzip) required by the user's active unlocked Batch,
 *    caches it in memory, and hydrates compact records into full Pronunciation Drill objects.
 *
 * Strictly complies with Global English UI Rule (100% English fields when isEn === true).
 */

export const SHARDED_TRACKS = new Set(['pron_words', 'pron_sentences']);

const manifestCache = new Map(); // trackKey -> manifest | null
const manifestPromiseCache = new Map(); // trackKey -> Promise<manifest | null>

const shardCache = new Map(); // `${trackKey}:${shardIndex}` -> hydratedItem[]
const shardPromiseCache = new Map(); // `${trackKey}:${shardIndex}` -> Promise<hydratedItem[]>
const hydratedItemCache = new Map(); // itemId -> hydratedItem

/**
 * Expands a compact shard JSON record into a full Pronunciation Drill object.
 */
export function hydrateShardDrill(trackKey, raw) {
  if (!raw || !raw.id) return null;

  if (trackKey === 'pron_words') {
    const term = raw.targetText || '';
    const stressPattern = raw.stressPattern || '●';
    const ipa = raw.ipa || `/${term.toLowerCase()}/`;
    return {
      id: raw.id,
      type: 'words',
      targetText: term,
      ipaUk: ipa,
      ipaUs: ipa,
      syllables: raw.syllables || term,
      stressPattern,
      bandLevel: raw.bandLevel || '7.5',
      categoryEn: 'Harold Levine 22,000 Words',
      categoryVi: 'Ngân Hàng 22.000 Từ Harold Levine',
      topicEn: raw.topicEn || 'Harold Levine • Academic Core',
      topicVi: raw.topicVi || 'Harold Levine • Từ vựng Học thuật',
      meaningEn: raw.meaningEn || `Academic IELTS vocabulary item: ${term}.`,
      meaningVi: raw.meaningVi || raw.meaningEn || term,
      trapEn: `Focus on crisp primary stress and clear final consonant release in "${term}".`,
      trapVi: `Chú ý nhấn đúng trọng âm chính và bật rõ phụ âm cuối khi phát âm "${term}".`,
      mouthTipEn: `Listen to the model audio first, mirror the stress pattern (${stressPattern}), and keep unstressed vowels relaxed.`,
      mouthTipVi: `Nghe âm thanh mẫu trước, bắt chước nhịp trọng âm (${stressPattern}) và thả lỏng các âm tiết không nhấn.`,
      exampleEn: raw.exampleEn || `Academic writers use "${term}" to express ideas precisely.`,
      exampleVi: raw.exampleVi || raw.exampleEn || '',
      xpReward: 15,
      isExternalBank: true
    };
  }

  if (trackKey === 'pron_sentences') {
    const sentence = raw.targetText || '';
    const focusWord = raw.focusWord || '';
    return {
      id: raw.id,
      type: 'sentences',
      targetText: sentence,
      intonationText: raw.intonationText || sentence,
      ipaUk: raw.ipaUk || '',
      ipaUs: raw.ipaUs || '',
      bandLevel: raw.bandLevel || '7.5',
      categoryEn: 'Harold Levine Context Sentences',
      categoryVi: 'Câu Ngữ Cảnh Harold Levine',
      topicEn: raw.topicEn || 'Harold Levine • Academic Core',
      topicVi: raw.topicVi || 'Harold Levine • Từ vựng Học thuật',
      meaningEn: raw.meaningEn || (focusWord ? `Key word: "${focusWord}"` : sentence),
      meaningVi: raw.meaningVi || sentence,
      trapEn: focusWord
        ? `Keep natural rhythm across the clause and emphasize "${focusWord}" clearly.`
        : 'Maintain natural connected rhythm and clear clause-final intonation.',
      trapVi: focusWord
        ? `Giữ nhịp nối tự nhiên xuyên suốt mệnh đề và nhấn rõ từ khóa học thuật "${focusWord}".`
        : 'Giữ nhịp nối tự nhiên và hạ giọng rõ ràng ở cuối câu.',
      mouthTipEn: 'Group words into natural thought chunks, pause briefly at punctuation, and drop pitch at the end.',
      mouthTipVi: 'Ngắt câu theo cụm tư duy tự nhiên, nghỉ nhẹ ở dấu câu và hạ giọng dứt khoát cuối câu.',
      xpReward: 35,
      isExternalBank: true
    };
  }

  return { ...raw, isExternalBank: true };
}

/**
 * Loads and caches the tiny ~1 KB manifest for a sharded track.
 */
export async function loadTrackManifest(trackKey) {
  if (!SHARDED_TRACKS.has(trackKey)) return null;
  if (manifestCache.has(trackKey)) return manifestCache.get(trackKey);
  if (manifestPromiseCache.has(trackKey)) return manifestPromiseCache.get(trackKey);

  const promise = (async () => {
    try {
      const res = await fetch(`/data/banks/${trackKey}/manifest.json`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) {
        manifestCache.set(trackKey, null);
        return null;
      }
      const data = await res.json();
      if (!data || !Array.isArray(data.shards) || !data.totalItems) {
        manifestCache.set(trackKey, null);
        return null;
      }
      manifestCache.set(trackKey, data);
      return data;
    } catch (err) {
      console.warn(`[BankShardService] Manifest unavailable for ${trackKey}:`, err);
      manifestCache.set(trackKey, null);
      return null;
    } finally {
      manifestPromiseCache.delete(trackKey);
    }
  })();

  manifestPromiseCache.set(trackKey, promise);
  return promise;
}

/**
 * Builds deterministic lightweight placeholder items for `buildTrackBatches()`
 * without fetching any shard payload.
 */
export function buildExternalPlaceholderItems(manifest) {
  if (!manifest || !manifest.totalItems || !manifest.idPrefix) return [];
  const total = Number(manifest.totalItems) || 0;
  const shardSize = Math.max(1, Number(manifest.shardSize) || 100);
  const prefix = String(manifest.idPrefix);
  const items = new Array(total);

  for (let i = 0; i < total; i++) {
    const id = `${prefix}${String(i + 1).padStart(4, '0')}`;
    const cached = hydratedItemCache.get(id);
    if (cached) {
      items[i] = cached;
    } else {
      items[i] = {
        id,
        _isShardPlaceholder: true,
        _shardIndex: Math.floor(i / shardSize)
      };
    }
  }
  return items;
}

/**
 * Fetches and caches a single 100-item shard JSON file.
 */
export async function loadTrackShard(trackKey, manifest, shardIndex) {
  if (!manifest || !Array.isArray(manifest.shards)) return [];
  const shardMeta = manifest.shards[shardIndex];
  if (!shardMeta || !shardMeta.file) return [];

  const cacheKey = `${trackKey}:${shardIndex}`;
  if (shardCache.has(cacheKey)) return shardCache.get(cacheKey);
  if (shardPromiseCache.has(cacheKey)) return shardPromiseCache.get(cacheKey);

  const promise = (async () => {
    try {
      const res = await fetch(`/data/banks/${trackKey}/${shardMeta.file}`, {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) return [];
      const rawItems = await res.json();
      if (!Array.isArray(rawItems)) return [];
      const hydrated = rawItems
        .map(item => hydrateShardDrill(trackKey, item))
        .filter(Boolean);
      for (let i = 0; i < hydrated.length; i++) {
        hydratedItemCache.set(hydrated[i].id, hydrated[i]);
      }
      shardCache.set(cacheKey, hydrated);
      return hydrated;
    } catch (err) {
      console.warn(`[BankShardService] Failed to load shard ${cacheKey}:`, err);
      return [];
    } finally {
      shardPromiseCache.delete(cacheKey);
    }
  })();

  shardPromiseCache.set(cacheKey, promise);
  return promise;
}

/**
 * Hydrates only the shard(s) needed by the currently selected unlocked Batch.
 * Returns the resolved list of full drill items (preserving exact batch order).
 */
export async function hydrateBatchItems(trackKey, manifest, batchItems = []) {
  if (!Array.isArray(batchItems) || batchItems.length === 0) return [];

  const neededShardIndices = new Set();
  for (let i = 0; i < batchItems.length; i++) {
    const item = batchItems[i];
    if (item?._isShardPlaceholder && !hydratedItemCache.has(item.id)) {
      neededShardIndices.add(item._shardIndex);
    }
  }

  if (neededShardIndices.size > 0 && manifest) {
    await Promise.all(
      Array.from(neededShardIndices).map(idx => loadTrackShard(trackKey, manifest, idx))
    );
  }

  return batchItems
    .map(item => (item?._isShardPlaceholder ? hydratedItemCache.get(item.id) || null : item))
    .filter(Boolean);
}

/**
 * Synchronous lookup for already-hydrated shard items.
 */
export function getCachedHydratedItem(id) {
  return hydratedItemCache.get(id) || null;
}

/**
 * Test/reset helper.
 */
export function clearBankShardCaches() {
  manifestCache.clear();
  manifestPromiseCache.clear();
  shardCache.clear();
  shardPromiseCache.clear();
  hydratedItemCache.clear();
}
