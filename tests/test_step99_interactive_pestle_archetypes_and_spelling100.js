import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  IELTS_SPELLING_TRAPS, 
  CAMBRIDGE_SYNONYM_PAIRS 
} from '../src/data/vocabGrammarSpellingData.js';
import { UNIVERSAL_STORY_ARCHETYPES } from '../src/data/speakingArchetypesData.js';

console.log('🧪 RUNNING TEST SUITE STEP 99: INTERACTIVE PESTLE MATRIX, UNIVERSAL ARCHETYPES, AND 100 SPELLING DEMONS...\n');

// -------------------------------------------------------------
// 1. VERIFY 100 SPELLING DEMONS INTEGRITY & BACKWARD COMPATIBILITY
// -------------------------------------------------------------
console.log('👉 [1/6] Kiểm tra độ vẹn toàn 100 từ Spelling Demons và tính tương thích ngược...');
assert.strictEqual(IELTS_SPELLING_TRAPS.length, 100, `IELTS_SPELLING_TRAPS must contain exactly 100 items, got ${IELTS_SPELLING_TRAPS.length}`);

// Check unique IDs
const spellingIds = IELTS_SPELLING_TRAPS.map(item => item.id);
const uniqueSpellingIds = new Set(spellingIds);
assert.strictEqual(uniqueSpellingIds.size, 100, 'All 100 spelling trap IDs must be completely unique');

// Backward compatibility check for sp-1 to sp-15 and sp-b5-1 to sp-b5-5
for (let i = 1; i <= 15; i++) {
  assert(spellingIds.includes(`sp-${i}`), `Legacy spelling trap ID sp-${i} must be preserved`);
}
for (let i = 1; i <= 5; i++) {
  assert(spellingIds.includes(`sp-b5-${i}`), `Legacy spelling trap ID sp-b5-${i} must be preserved`);
}

// Check required fields for all 100 items
IELTS_SPELLING_TRAPS.forEach((item, index) => {
  assert(item.id, `Item at index ${index} must have an id`);
  assert(item.correct, `Item ${item.id} must have a correct spelling`);
  assert(Array.isArray(item.distractors) && item.distractors.length >= 2, `Item ${item.id} must have at least 2 distractors`);
  assert(item.rule, `Item ${item.id} must have a mnemonic rule`);
  assert(item.contextSentence, `Item ${item.id} must have a context sentence`);
  assert(item.explanation, `Item ${item.id} must have an explanation`);
  assert(item.category, `Item ${item.id} must have a category`);
  assert(item.bandLevel, `Item ${item.id} must have a bandLevel`);
});

// Check representation of major categories
const categories = new Set(IELTS_SPELLING_TRAPS.map(item => item.category));
console.log(`   - Detected categories: ${Array.from(categories).join(', ')}`);
assert(categories.has('Double Letters'), 'Must contain Double Letters category');
assert(categories.has('Vowel Traps'), 'Must contain Vowel Traps category');
assert(categories.has('Silent Letters'), 'Must contain Silent Letters category');
assert(categories.has('Plural Demons'), 'Must contain Plural Demons category');
assert(categories.has('Campus & Jobs'), 'Must contain Campus & Jobs category');
console.log('   ✅ 100 từ Spelling Demons đạt chuẩn 100% không trùng lặp và bảo toàn backwards compatibility!');

// -------------------------------------------------------------
// 2. VERIFY CAMBRIDGE SYNONYM LEXICON (50 PAIRS)
// -------------------------------------------------------------
console.log('\n👉 [2/6] Kiểm tra 50 Cặp Từ Paraphrase Cambridge 10-19 (Synonym Lexicon)...');
assert(Array.isArray(CAMBRIDGE_SYNONYM_PAIRS), 'CAMBRIDGE_SYNONYM_PAIRS must be exported as an array');
assert.strictEqual(CAMBRIDGE_SYNONYM_PAIRS.length, 50, `CAMBRIDGE_SYNONYM_PAIRS must contain exactly 50 pairs, got ${CAMBRIDGE_SYNONYM_PAIRS.length}`);

const synonymIds = new Set(CAMBRIDGE_SYNONYM_PAIRS.map(x => x.id));
assert.strictEqual(synonymIds.size, 50, 'All 50 synonym pair IDs must be unique');

CAMBRIDGE_SYNONYM_PAIRS.forEach((item, idx) => {
  assert(item.id, `Synonym item #${idx + 1} must have an id`);
  assert(item.questionStem && item.questionStem.length > 2, `Synonym item #${idx + 1} must have a valid questionStem`);
  assert(item.passageMatch && item.passageMatch.length > 2, `Synonym item #${idx + 1} must have a valid passageMatch`);
  assert(item.category, `Synonym item #${idx + 1} must have a category`);
});
console.log('   ✅ 50 Cặp Từ Paraphrase Cambridge đạt chuẩn cấu trúc và kiểm thử chất lượng!');

// -------------------------------------------------------------
// 3. VERIFY 5 UNIVERSAL STORY ARCHETYPES FOR PART 2
// -------------------------------------------------------------
console.log('\n👉 [3/6] Kiểm tra Bộ 5 Cốt Truyện Vạn Năng (Universal Story Archetypes)...');
assert(Array.isArray(UNIVERSAL_STORY_ARCHETYPES), 'UNIVERSAL_STORY_ARCHETYPES must be exported as an array');
assert.strictEqual(UNIVERSAL_STORY_ARCHETYPES.length, 5, 'Must have exactly 5 universal archetypes');

UNIVERSAL_STORY_ARCHETYPES.forEach((arch, idx) => {
  assert.strictEqual(arch.number, idx + 1, `Archetype #${idx + 1} must have matching sequence number`);
  assert(arch.id, `Archetype #${idx + 1} must have an id`);
  assert(arch.title, `Archetype #${idx + 1} must have a title`);
  assert(arch.pivotStrategy && arch.pivotStrategy.length > 15, `Archetype #${idx + 1} must have detailed pivotStrategy`);
  assert(Array.isArray(arch.quadrantSuggestions) && arch.quadrantSuggestions.length === 4, `Archetype #${idx + 1} must have 4 quadrant suggestions`);
  assert(Array.isArray(arch.collocations) && arch.collocations.length >= 4, `Archetype #${idx + 1} must have at least 4 C1/C2 collocations`);
});
console.log('   ✅ 5 Cốt Truyện Vạn Năng cho Part 2 có đầy đủ 4 ô nháp và chiến lược Pivot bẻ lái chuẩn mực!');

// -------------------------------------------------------------
// 4. VERIFY IDEA MATRIX MODAL (PESTLE + STAKEHOLDERS)
// -------------------------------------------------------------
console.log('\n👉 [4/6] Kiểm tra mã nguồn IdeaMatrixModal.jsx (6 Lăng Kính PESTLE)...');
const ideaMatrixPath = path.resolve('src/components/IdeaMatrixModal.jsx');
const ideaMatrixCode = fs.readFileSync(ideaMatrixPath, 'utf8');

assert(ideaMatrixCode.includes('pestle'), 'IdeaMatrixModal must support pestle tab mode');
assert(ideaMatrixCode.includes('stakeholders'), 'IdeaMatrixModal must support stakeholders tab mode');
assert(ideaMatrixCode.includes('Political & Institutional'), 'IdeaMatrixModal must define Political dimension');
assert(ideaMatrixCode.includes('Economic & Financial'), 'IdeaMatrixModal must define Economic dimension');
assert(ideaMatrixCode.includes('Social & Cultural'), 'IdeaMatrixModal must define Social dimension');
assert(ideaMatrixCode.includes('Technological & Digital'), 'IdeaMatrixModal must define Technological dimension');
assert(ideaMatrixCode.includes('Legal & Compliance'), 'IdeaMatrixModal must define Legal dimension');
assert(ideaMatrixCode.includes('Environmental & Ecological'), 'IdeaMatrixModal must define Environmental dimension');
assert(ideaMatrixCode.includes('onInsertToOutline'), 'IdeaMatrixModal must support 1-click outline insertion');
assert(ideaMatrixCode.includes('getGitBookBaseUrl'), 'IdeaMatrixModal must use getGitBookBaseUrl() for docs linking');
assert(!ideaMatrixCode.includes('https://vneconomics.gitbook.io'), 'IdeaMatrixModal must not hardcode raw gitbook URL');
console.log('   ✅ IdeaMatrixModal hỗ trợ đầy đủ 6 lăng kính PESTLE và 4 Stakeholders!');

// -------------------------------------------------------------
// 5. VERIFY SPEAKING PART 2 ROOM INTEGRATION
// -------------------------------------------------------------
console.log('\n👉 [5/6] Kiểm tra tích hợp SpeakingPart2Room.jsx...');
const speakingP2Path = path.resolve('src/components/speaking/subrooms/SpeakingPart2Room.jsx');
const speakingP2Code = fs.readFileSync(speakingP2Path, 'utf8');

assert(speakingP2Code.includes('UniversalStoryArchetypesModal'), 'SpeakingPart2Room must import and render UniversalStoryArchetypesModal');
assert(speakingP2Code.includes('isArchetypesModalOpen'), 'SpeakingPart2Room must maintain modal open state');
assert(speakingP2Code.includes('customQuadrantNotes'), 'SpeakingPart2Room must support custom quadrant notes replacement');
assert(speakingP2Code.includes('5 Cốt Truyện Vạn Năng'), 'SpeakingPart2Room must have trigger buttons for 5 archetypes');
console.log('   ✅ SpeakingPart2Room tích hợp trơn tru 5 Cốt Truyện Vạn Năng và 4 ô nháp chuẩn bị!');

// -------------------------------------------------------------
// 6. VERIFY VOCAB GRAMMAR SPELLING MODAL INTEGRATION
// -------------------------------------------------------------
console.log('\n👉 [6/6] Kiểm tra tích hợp VocabGrammarSpellingModal.jsx...');
const vgModalPath = path.resolve('src/components/VocabGrammarSpellingModal.jsx');
const vgModalCode = fs.readFileSync(vgModalPath, 'utf8');

assert(vgModalCode.includes('CAMBRIDGE_SYNONYM_PAIRS'), 'VocabGrammarSpellingModal must import CAMBRIDGE_SYNONYM_PAIRS');
assert(vgModalCode.includes("activeTab === 'synonyms'"), 'VocabGrammarSpellingModal must support synonyms tab');
assert(vgModalCode.includes('selectedSpellingCategory'), 'VocabGrammarSpellingModal must support spelling category filtering');
assert(vgModalCode.includes('Double Letters'), 'VocabGrammarSpellingModal must support Double Letters filter');
assert(vgModalCode.includes('Vowel Traps'), 'VocabGrammarSpellingModal must support Vowel Traps filter');
assert(vgModalCode.includes('Silent Letters'), 'VocabGrammarSpellingModal must support Silent Letters filter');
assert(vgModalCode.includes('Plural Demons'), 'VocabGrammarSpellingModal must support Plural Demons filter');
assert(vgModalCode.includes('Campus & Jobs'), 'VocabGrammarSpellingModal must support Campus & Jobs filter');
assert(vgModalCode.includes('getGitBookBaseUrl'), 'VocabGrammarSpellingModal must use getGitBookBaseUrl() for handbook deep links');
assert(!vgModalCode.includes('https://vneconomics.gitbook.io'), 'VocabGrammarSpellingModal must not hardcode raw gitbook URL');
console.log('   ✅ VocabGrammarSpellingModal tích hợp đầy đủ tab Synonyms và bộ lọc nhóm 100 Spelling Demons!');

console.log('\n🎉 ALL STEP 99 VERIFICATION CHECKS PASSED WITH 100% ACCURACY!\n');
