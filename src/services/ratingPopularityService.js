/**
 * Smart Discovery & Social Proof Engine: Rating & Popularity Service
 * 
 * Provides 100% offline-first rating, attempts count tracking, and smart
 * faceted filtering & sorting across Task Library, Micro-drills, and Vocab/Grammar.
 */

const STORAGE_KEY_RATINGS = 'ielts_content_ratings_v2';
const STORAGE_KEY_ATTEMPTS = 'ielts_content_attempts_v2';
const STORAGE_KEY_PREFS = 'ielts_filter_preferences_v1';

/**
 * Simple deterministic hash generator from string ID for realistic algorithmic seeding
 */
function getDeterministicHash(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns deterministic seeded metrics for pre-loaded Cambridge content to avoid cold-start
 */
export function getSeededMetrics(itemId = '', fallbackTitle = '') {
  const seedString = `${itemId}:${fallbackTitle}`;
  const hash = getDeterministicHash(seedString);

  // Ratings between 4.6 and 5.0
  const ratingVariations = [4.7, 4.8, 4.9, 5.0, 4.8, 4.9, 4.6, 4.9, 5.0, 4.8];
  const seededRating = ratingVariations[hash % ratingVariations.length];

  // Rating count between 30 and 420
  const seededRatingCount = 30 + (hash % 390);

  // Attempts count between 150 and 3,800
  const seededAttempts = 150 + ((hash * 17) % 3650);

  return {
    rating: seededRating,
    ratingCount: seededRatingCount,
    attemptsCount: seededAttempts
  };
}

let inMemoryRatingsMap = {};
let inMemoryAttemptsMap = {};

/**
 * Safely loads ratings map from localStorage with memory fallback
 */
function loadRatingsMap() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_RATINGS);
      return raw ? JSON.parse(raw) : inMemoryRatingsMap;
    }
  } catch (e) {
    console.warn('Unable to read content ratings from localStorage:', e);
  }
  return inMemoryRatingsMap;
}

/**
 * Safely saves ratings map to localStorage with memory fallback
 */
function saveRatingsMap(ratingsMap) {
  inMemoryRatingsMap = { ...ratingsMap };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(ratingsMap));
    }
  } catch (e) {
    console.warn('Unable to persist content ratings:', e);
  }
}

/**
 * Safely loads attempts map from localStorage with memory fallback
 */
function loadAttemptsMap() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      return raw ? JSON.parse(raw) : inMemoryAttemptsMap;
    }
  } catch (e) {
    console.warn('Unable to read content attempts from localStorage:', e);
  }
  return inMemoryAttemptsMap;
}

/**
 * Safely saves attempts map to localStorage with memory fallback
 */
function saveAttemptsMap(attemptsMap) {
  inMemoryAttemptsMap = { ...attemptsMap };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(attemptsMap));
    }
  } catch (e) {
    console.warn('Unable to persist content attempts:', e);
  }
}

/**
 * Retrieves the full metrics for a specific item (task, drill, vocab card)
 * @param {string} itemId 
 * @param {string} [fallbackTitle]
 * @returns {object} { rating, ratingCount, attemptsCount, userRating, isHot, isTopRated }
 */
export function getItemMetrics(itemId = '', fallbackTitle = '') {
  if (!itemId) {
    return {
      rating: 5.0,
      ratingCount: 1,
      attemptsCount: 1,
      userRating: null,
      isHot: false,
      isTopRated: true
    };
  }

  const seeded = getSeededMetrics(itemId, fallbackTitle);
  const ratingsMap = loadRatingsMap();
  const attemptsMap = loadAttemptsMap();

  const userRecord = ratingsMap[itemId] || null;
  const attemptsBonus = attemptsMap[itemId] || 0;

  let finalRating = seeded.rating;
  let finalRatingCount = seeded.ratingCount;
  let userRating = null;

  if (userRecord) {
    userRating = userRecord.userRating || null;
    if (typeof userRecord.averageRating === 'number') {
      finalRating = userRecord.averageRating;
    }
    if (typeof userRecord.ratingCount === 'number') {
      finalRatingCount = userRecord.ratingCount;
    }
  }

  const finalAttempts = seeded.attemptsCount + attemptsBonus;

  return {
    rating: Math.round(finalRating * 10) / 10,
    ratingCount: finalRatingCount,
    attemptsCount: finalAttempts,
    userRating,
    isHot: finalAttempts >= 800,
    isTopRated: finalRating >= 4.8
  };
}

/**
 * Records an interactive user star rating (1 to 5 stars)
 * @param {string} itemId 
 * @param {number} stars (1 to 5)
 * @param {string} [feedback]
 * @returns {object} Updated item metrics
 */
export function rateItem(itemId, stars, feedback = '') {
  if (!itemId) return null;
  const numStars = Math.max(1, Math.min(5, Math.round(Number(stars) || 5)));

  const current = getItemMetrics(itemId);
  const ratingsMap = loadRatingsMap();

  let newRatingCount = current.ratingCount;
  let newAvgRating = current.rating;

  if (current.userRating === null) {
    // New rating from user
    const totalScore = (current.rating * current.ratingCount) + numStars;
    newRatingCount += 1;
    newAvgRating = totalScore / newRatingCount;
  } else {
    // Updating existing rating from user
    const totalScore = (current.rating * current.ratingCount) - current.userRating + numStars;
    newAvgRating = totalScore / current.ratingCount;
  }

  ratingsMap[itemId] = {
    userRating: numStars,
    averageRating: Math.round(newAvgRating * 10) / 10,
    ratingCount: newRatingCount,
    feedback: feedback || '',
    updatedAt: new Date().toISOString()
  };

  saveRatingsMap(ratingsMap);

  return getItemMetrics(itemId);
}

/**
 * Records that a user has opened, started or finished practicing an item
 * @param {string} itemId 
 * @returns {number} New total attempts count
 */
export function recordAttempt(itemId) {
  if (!itemId) return 0;
  const attemptsMap = loadAttemptsMap();
  attemptsMap[itemId] = (attemptsMap[itemId] || 0) + 1;
  saveAttemptsMap(attemptsMap);

  const updated = getItemMetrics(itemId);
  return updated.attemptsCount;
}

/**
 * Normalizes Vietnamese string for fast tone-insensitive and case-insensitive searching
 */
export function normalizeSearchStr(str = '') {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * Smart Faceted Filter & Sorting Engine
 * Filters and sorts any collection of tasks, drills, or vocab items with high performance.
 * 
 * @param {Array} items - List of items to filter & sort
 * @param {object} criteria
 * @param {string} [criteria.searchQuery] - Search keyword
 * @param {string} [criteria.quickFilter] - 'all' | 'top_rated' | 'trending' | 'unattempted' | 'mastered' | 'band_high'
 * @param {string} [criteria.categoryFilter] - 'all' or specific subtype
 * @param {string} [criteria.sortBy] - 'rating_desc' | 'attempts_desc' | 'newest' | 'difficulty_desc' | 'difficulty_asc' | 'attempts_asc' | 'title_asc'
 * @param {Array} [criteria.masteredIds] - List of mastered item IDs
 * @param {Array} [criteria.attemptedIds] - List of attempted item IDs
 * @returns {Array} Filtered and sorted items with attached `_metrics`
 */
export function applySmartFilterAndSort(items = [], criteria = {}) {
  if (!Array.isArray(items) || items.length === 0) return [];

  const {
    searchQuery = '',
    quickFilter = 'all',
    categoryFilter = 'all',
    sortBy = 'rating_desc',
    masteredIds = [],
    attemptedIds = []
  } = criteria;

  const normalizedQuery = normalizeSearchStr(searchQuery);

  // 1. Attach metrics and filter
  const processed = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;

    const itemId = String(item.id || `item-${i}`);
    const metrics = getItemMetrics(itemId, item.title || item.prompt || '');
    const isMastered = masteredIds.includes(itemId) || masteredIds.includes(item.id);
    const isAttempted = attemptedIds.includes(itemId) || attemptedIds.includes(item.id);

    // Filter A: Search Query
    if (normalizedQuery) {
      const searchHaystack = normalizeSearchStr(
        `${item.title || ''} ${item.prompt || ''} ${item.type || ''} ${item.category || ''} ${item.topic || ''} ${item.word || ''} ${item.question || ''}`
      );
      if (!searchHaystack.includes(normalizedQuery)) {
        continue;
      }
    }

    // Filter B: Category / Subtype
    if (categoryFilter && categoryFilter !== 'all') {
      const itemCat = String(item.type || item.category || item.taskType || item.subtype || '').toLowerCase();
      if (itemCat !== String(categoryFilter).toLowerCase()) {
        continue;
      }
    }

    // Filter C: Quick Filter Chip
    if (quickFilter === 'top_rated' && !metrics.isTopRated) {
      continue;
    }
    if (quickFilter === 'trending' && !metrics.isHot) {
      continue;
    }
    if (quickFilter === 'unattempted' && isAttempted) {
      continue;
    }
    if (quickFilter === 'mastered' && !isMastered) {
      continue;
    }
    if (quickFilter === 'band_high') {
      const band = parseFloat(item.bandLevel || item.targetBand || item.band || '0');
      if (band < 7.0 && !metrics.isTopRated) {
        continue;
      }
    }

    processed.push({
      ...item,
      _metrics: metrics,
      _isMastered: isMastered,
      _isAttempted: isAttempted
    });
  }

  // 2. Multi-Dimensional Sorting
  processed.sort((a, b) => {
    switch (sortBy) {
      case 'rating_desc':
        if (b._metrics.rating !== a._metrics.rating) {
          return b._metrics.rating - a._metrics.rating;
        }
        return b._metrics.attemptsCount - a._metrics.attemptsCount;

      case 'attempts_desc':
        if (b._metrics.attemptsCount !== a._metrics.attemptsCount) {
          return b._metrics.attemptsCount - a._metrics.attemptsCount;
        }
        return b._metrics.rating - a._metrics.rating;

      case 'attempts_asc':
        return a._metrics.attemptsCount - b._metrics.attemptsCount;

      case 'newest': {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.timestamp || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.timestamp || 0);
        return timeB - timeA;
      }

      case 'difficulty_desc': {
        const bandA = parseFloat(a.bandLevel || a.targetBand || a.band || 6.5);
        const bandB = parseFloat(b.bandLevel || b.targetBand || b.band || 6.5);
        return bandB - bandA;
      }

      case 'difficulty_asc': {
        const bandA = parseFloat(a.bandLevel || a.targetBand || a.band || 6.5);
        const bandB = parseFloat(b.bandLevel || b.targetBand || b.band || 6.5);
        return bandA - bandB;
      }

      case 'title_asc': {
        const titleA = String(a.title || a.word || a.prompt || '').toLowerCase();
        const titleB = String(b.title || b.word || b.prompt || '').toLowerCase();
        return titleA.localeCompare(titleB);
      }

      default:
        return b._metrics.rating - a._metrics.rating;
    }
  });

  return processed;
}

/**
 * Saves preferred filter settings for a specific modal/view
 */
export function saveFilterPreference(viewKey, prefs = {}) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_PREFS);
      const allPrefs = raw ? JSON.parse(raw) : {};
      allPrefs[viewKey] = {
        ...allPrefs[viewKey],
        ...prefs,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(allPrefs));
    }
  } catch (e) {}
}

/**
 * Loads preferred filter settings for a specific modal/view
 */
export function getFilterPreference(viewKey, defaultPrefs = {}) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_PREFS);
      if (raw) {
        const allPrefs = JSON.parse(raw);
        return allPrefs[viewKey] || defaultPrefs;
      }
    }
  } catch (e) {}
  return defaultPrefs;
}
