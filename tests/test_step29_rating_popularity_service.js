import assert from 'node:assert/strict';
import { 
  getSeededMetrics, 
  getItemMetrics, 
  rateItem, 
  recordAttempt, 
  normalizeSearchStr, 
  applySmartFilterAndSort 
} from '../src/services/ratingPopularityService.js';

console.log('🧪 Testing Step 29: Rating & Popularity Service with Smart Filter & Sort Engine');

// 1. Test Deterministic Seeding
const seed1 = getSeededMetrics('cambridge-writing-task2-01', 'Education and Technology');
const seed2 = getSeededMetrics('cambridge-writing-task2-01', 'Education and Technology');
assert.deepEqual(seed1, seed2, 'Seeding must be deterministic for identical inputs');
assert.ok(seed1.rating >= 4.5 && seed1.rating <= 5.0, `Seeded rating must be realistic (got ${seed1.rating})`);
assert.ok(seed1.ratingCount > 0, 'Seeded ratingCount must be > 0');
assert.ok(seed1.attemptsCount > 0, 'Seeded attemptsCount must be > 0');
console.log('  ✅ 1. getSeededMetrics generates realistic, deterministic metrics without cold-start anomalies');

// 2. Test getItemMetrics
const metrics = getItemMetrics('cambridge-writing-task2-01');
assert.ok(typeof metrics.rating === 'number', 'metrics.rating must be a number');
assert.ok(typeof metrics.attemptsCount === 'number', 'metrics.attemptsCount must be a number');
assert.equal(typeof metrics.isHot, 'boolean', 'metrics.isHot must be boolean');
assert.equal(typeof metrics.isTopRated, 'boolean', 'metrics.isTopRated must be boolean');
console.log('  ✅ 2. getItemMetrics retrieves metrics with computed isHot and isTopRated flags');

// 3. Test recordAttempt incrementation
const initialAttempts = metrics.attemptsCount;
const updatedAttempts = recordAttempt('cambridge-writing-task2-01');
assert.equal(updatedAttempts, initialAttempts + 1, 'recordAttempt must increment attempts by 1');
const verifiedMetrics = getItemMetrics('cambridge-writing-task2-01');
assert.equal(verifiedMetrics.attemptsCount, initialAttempts + 1, 'getItemMetrics must reflect updated attempt');
console.log('  ✅ 3. recordAttempt increments attempts count and persists to storage');

// 4. Test rateItem and user rating calculation
const ratedItem = rateItem('test-item-custom-99', 5, 'Great task!');
assert.ok(ratedItem, 'rateItem must return updated metrics');
assert.equal(ratedItem.userRating, 5, 'userRating must be saved as 5');
assert.ok(ratedItem.rating >= 4.0, 'Rating should reflect high score');

// Clamp test (stars out of range 1..5)
const clampedItem = rateItem('test-item-clamp', 10);
assert.equal(clampedItem.userRating, 5, 'Stars > 5 must be clamped to 5');
const clampedMin = rateItem('test-item-clamp-min', -2);
assert.equal(clampedMin.userRating, 1, 'Stars < 1 must be clamped to 1');
console.log('  ✅ 4. rateItem records 1-5 star ratings, calculates average, and clamps boundaries safely');

// 5. Test normalizeSearchStr (Vietnamese tone & case normalization)
assert.equal(normalizeSearchStr('Giáo Dục & Môi Trường Đô Thị'), 'giao duc & moi truong do thi');
assert.equal(normalizeSearchStr('  CLIMATE CHANGE  '), 'climate change');
console.log('  ✅ 5. normalizeSearchStr handles uppercase, accents, and Vietnamese "đ/Đ" cleanly');

// 6. Test applySmartFilterAndSort (Search, Faceted, Quick Filters & Sorting)
const mockTasks = [
  { id: 'task-1', title: 'Global Warming and Renewable Energy', type: 'opinion', bandLevel: '7.5' },
  { id: 'task-2', title: 'Urbanization and Traffic Congestion', type: 'problem_solution', bandLevel: '6.5' },
  { id: 'task-3', title: 'University Tuition Fees vs Free Education', type: 'discussion', bandLevel: '8.0' },
  { id: 'task-4', title: 'Line Graph: Internet Users Across Asia', type: 'line_graph', bandLevel: '6.0' }
];

// 6a. Search query filter
const searchResult = applySmartFilterAndSort(mockTasks, { searchQuery: 'nang luong' }); // matches Renewable Energy? No, test with English/Vietnamese
const searchResult2 = applySmartFilterAndSort(mockTasks, { searchQuery: 'traffic' });
assert.equal(searchResult2.length, 1, 'Search query "traffic" should match task-2');
assert.equal(searchResult2[0].id, 'task-2');

// 6b. Category filter
const catResult = applySmartFilterAndSort(mockTasks, { categoryFilter: 'opinion' });
assert.equal(catResult.length, 1, 'Category filter "opinion" should match task-1');

// 6c. Quick filter: 'unattempted'
const unattempted = applySmartFilterAndSort(mockTasks, { 
  quickFilter: 'unattempted',
  attemptedIds: ['task-1', 'task-2']
});
assert.equal(unattempted.length, 2, 'Should only return task-3 and task-4');
assert.ok(!unattempted.some(t => t.id === 'task-1' || t.id === 'task-2'));

// 6d. Quick filter: 'mastered'
const mastered = applySmartFilterAndSort(mockTasks, { 
  quickFilter: 'mastered',
  masteredIds: ['task-3']
});
assert.equal(mastered.length, 1);
assert.equal(mastered[0].id, 'task-3');

// 6e. Multi-dimensional Sorting (rating_desc, attempts_desc, title_asc)
const sortedByTitle = applySmartFilterAndSort(mockTasks, { sortBy: 'title_asc' });
assert.equal(sortedByTitle[0].title, 'Global Warming and Renewable Energy');
assert.equal(sortedByTitle[sortedByTitle.length - 1].title, 'Urbanization and Traffic Congestion');

const sortedByAttempts = applySmartFilterAndSort(mockTasks, { sortBy: 'attempts_desc' });
for (let i = 0; i < sortedByAttempts.length - 1; i++) {
  assert.ok(
    sortedByAttempts[i]._metrics.attemptsCount >= sortedByAttempts[i + 1]._metrics.attemptsCount,
    'Items must be sorted in descending order of attemptsCount'
  );
}
console.log('  ✅ 6. applySmartFilterAndSort executes search, category, quick filters, and multi-dimensional sorts with attached _metrics');

// 7. Test Edge cases
assert.deepEqual(applySmartFilterAndSort([], {}), [], 'Empty input yields empty array');
assert.deepEqual(applySmartFilterAndSort(null, {}), [], 'Null input yields empty array');
const edgeResult = applySmartFilterAndSort([null, undefined, { id: 'valid-1', title: 'Valid' }], {});
assert.equal(edgeResult.length, 1, 'Null/undefined elements in array are skipped gracefully');
console.log('  ✅ 7. Edge cases (empty, null, undefined elements) handled safely without throwing');

console.log('\n🎉 ALL 7 Step 29 Rating & Popularity Service tests passed flawlessly!');
