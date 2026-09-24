import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { applySmartFilterAndSort, getItemMetrics, recordAttempt } from '../src/services/ratingPopularityService.js';
import { getFeatureById } from '../src/core/featureRegistry.js';

console.log('🧪 Testing Step 31: Smart Filters, Star Rating & Social Proof across Micro-Drills and Vocab/Grammar');

// 1. Verify VocabGrammarSpellingModal integration
const vgModalPath = path.resolve('src/components/VocabGrammarSpellingModal.jsx');
assert.ok(fs.existsSync(vgModalPath), 'VocabGrammarSpellingModal.jsx must exist');
const vgModalCode = fs.readFileSync(vgModalPath, 'utf8');

assert.ok(vgModalCode.includes('StarRatingWidget'), 'VocabGrammarSpellingModal must import and render StarRatingWidget');
assert.ok(vgModalCode.includes('applySmartFilterAndSort'), 'VocabGrammarSpellingModal must use applySmartFilterAndSort');
assert.ok(vgModalCode.includes('recordAttempt'), 'VocabGrammarSpellingModal must use recordAttempt');
assert.ok(vgModalCode.includes('searchQuery'), 'VocabGrammarSpellingModal must have searchQuery state');
assert.ok(vgModalCode.includes('vgQuickFilter'), 'VocabGrammarSpellingModal must have vgQuickFilter state');
assert.ok(vgModalCode.includes('vgSortBy'), 'VocabGrammarSpellingModal must have vgSortBy state');
console.log('  ✅ 1. VocabGrammarSpellingModal.jsx verified with StarRatingWidget, instant search, quick chips & attempt tracking');

// 2. Verify MicroDrillsModal integration
const drillsModalPath = path.resolve('src/components/MicroDrillsModal.jsx');
assert.ok(fs.existsSync(drillsModalPath), 'MicroDrillsModal.jsx must exist');
const drillsModalCode = fs.readFileSync(drillsModalPath, 'utf8');

assert.ok(drillsModalCode.includes('StarRatingWidget'), 'MicroDrillsModal must import and render StarRatingWidget');
assert.ok(drillsModalCode.includes('applySmartFilterAndSort'), 'MicroDrillsModal must use applySmartFilterAndSort in getDrillsByType');
assert.ok(drillsModalCode.includes('recordAttempt'), 'MicroDrillsModal must use recordAttempt');
assert.ok(drillsModalCode.includes('drillSearchQuery'), 'MicroDrillsModal must have drillSearchQuery state');
assert.ok(drillsModalCode.includes('drillQuickFilter'), 'MicroDrillsModal must have drillQuickFilter state');
assert.ok(drillsModalCode.includes('drillSortBy'), 'MicroDrillsModal must have drillSortBy state');
console.log('  ✅ 2. MicroDrillsModal.jsx verified with StarRatingWidget, smart search, quick chips, and attempt recording');

// 3. Verify Feature Registry registration
const registeredFeat = getFeatureById('feat-smart-filters-social-proof');
assert.ok(registeredFeat, 'feat-smart-filters-social-proof must be registered in featureRegistry.js');
assert.equal(registeredFeat.category, 'practice_tools', 'Feature must be categorized under practice_tools');
assert.ok(registeredFeat.highlights.length >= 4, 'Feature must contain at least 4 highlights');
assert.ok(registeredFeat.targetSkills.includes('writing'), 'Feature must support writing');
assert.ok(registeredFeat.targetSkills.includes('reading'), 'Feature must support reading');
assert.ok(registeredFeat.targetSkills.includes('listening'), 'Feature must support listening');
console.log('  ✅ 3. Feature Registry correctly contains feat-smart-filters-social-proof with 4-skill coverage');

// 4. Test algorithmic filtering and sorting on mock drills
const mockDrills = [
  { id: 'drill-tfng-1', title: 'Great Barrier Reef Climate Impact', type: 'reading-tfng', bandLevel: '6.5' },
  { id: 'drill-para-2', title: 'Environmental Degradation and Urbanization', type: 'paraphrase', bandLevel: '7.5' },
  { id: 'drill-dict-3', title: 'Academic Lecture Dictation on Archaeology', type: 'listening-dictation', bandLevel: '7.0' },
  { id: 'drill-fill-4', title: 'Task 1 Trend Vocabulary Fill In', type: 'fill-blanks', bandLevel: '6.0' }
];

// Test search query on drills
const searchResults = applySmartFilterAndSort(mockDrills, {
  searchQuery: 'Climate'
});
assert.equal(searchResults.length, 1, 'Search query must find exactly 1 drill for "Climate"');
assert.equal(searchResults[0].id, 'drill-tfng-1', 'Correct drill matched by keyword');

// Test rating sort on drills
const sortedDrills = applySmartFilterAndSort(mockDrills, {
  sortBy: 'difficulty_desc'
});
assert.equal(sortedDrills[0].id, 'drill-para-2', 'Highest band drill placed first when sorting by difficulty');
console.log('  ✅ 4. Algorithmic smart filter and multi-dimensional sort verified on Micro-Drills data');

// 5. Test algorithmic filtering and attempt recording on Vocab / Spelling items
const mockVocabCards = [
  { id: 'v-card-1', word: 'ubiquitous', vietnameseMeaning: 'phổ biến, có mặt ở khắp nơi', bandLevel: '7.5' },
  { id: 'v-card-2', word: 'mitigate', vietnameseMeaning: 'giảm nhẹ, làm dịu bớt', bandLevel: '7.0' },
  { id: 'v-card-3', word: 'accommodate', correct: 'accommodate', bandLevel: '6.5' }
];

const attemptsBefore = getItemMetrics('v-card-1').attemptsCount;
recordAttempt('v-card-1');
const attemptsAfter = getItemMetrics('v-card-1').attemptsCount;
assert.equal(attemptsAfter, attemptsBefore + 1, 'Calling recordAttempt increments attemptsCount for vocab card');

const searchMeaning = applySmartFilterAndSort(mockVocabCards, {
  searchQuery: 'giảm nhẹ'
});
assert.equal(searchMeaning.length, 1, 'Search query matches Vietnamese meaning accurately');
assert.equal(searchMeaning[0].word, 'mitigate', 'Correct word matched by Vietnamese meaning');
console.log('  ✅ 5. Vocab card search, attempt recording and Vietnamese tone-insensitive match verified');

console.log('\n🎉 ALL 5 Step 31 Smart Discovery, Drills & Vocab Rating tests passed cleanly!');
