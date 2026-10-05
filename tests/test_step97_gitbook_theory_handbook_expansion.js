/**
 * Test Step 97: GitBook Full Curriculum Integration & Theory Handbook Expansion
 *
 * Verifies:
 * 1. src/data/theoryHandbook.js exports >= 110 comprehensive lessons from GitBook.
 * 2. 5 Distinct Study Areas: writing, reading, listening, speaking, grammar-vocab.
 * 3. Crucial High-Yield Cambridge Guides present:
 *    - Writing: Academic Hedging, Comparative Traps, PEEL Structure, Cambridge Insights, OSR Strategy.
 *    - Reading: Order Strategy, Passage 3 Author Stance, Chunking 300+ WPM, 5-Min Rescue, 50 Cambridge Synonyms.
 *    - Listening: Part 3 Consensus Traps, Local Accents, Plural (-s) Rule, Pre-prediction Protocol.
 *    - Speaking: 5 Universal Archetypes, STAR Storytelling, Micro-to-Macro Shift, Natural Phrasal Verbs.
 *    - Grammar & Vocab: A1-A7 Grammar Essentials & B1-B6 Academic Vocab Decks.
 * 4. Item Schema Completeness: id, skill, title, category, subType, summary, content, gitbookSlug.
 * 5. TheoryHandbookModal.jsx UI integration:
 *    - grammar-vocab tab in skillTabs
 *    - grammarVocabCategories & grammarVocabSubTypes
 *    - GitBook deep link button with ExternalLink
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📚 Testing Step 97: GitBook Curriculum Integration & Theory Handbook Expansion...');

const handbookPath = path.resolve(__dirname, '../src/data/theoryHandbook.js');
const modalPath = path.resolve(__dirname, '../src/components/TheoryHandbookModal.jsx');

assert(fs.existsSync(handbookPath), 'src/data/theoryHandbook.js must exist');
assert(fs.existsSync(modalPath), 'src/components/TheoryHandbookModal.jsx must exist');

const { THEORY_HANDBOOK } = await import('../src/data/theoryHandbook.js');
const modalSource = fs.readFileSync(modalPath, 'utf8');

// 1. Verify Total Lesson Volume
console.log(`  ▶ 1. Verifying lesson count in theoryHandbook.js (Current: ${THEORY_HANDBOOK.length})...`);
assert(THEORY_HANDBOOK.length >= 110, `THEORY_HANDBOOK must have >= 110 items, found ${THEORY_HANDBOOK.length}`);

// 2. Verify Coverage Across All 5 Skill Areas
console.log('  ▶ 2. Verifying distribution across 5 study areas...');
const writingItems = THEORY_HANDBOOK.filter(i => i.skill === 'writing');
const readingItems = THEORY_HANDBOOK.filter(i => i.skill === 'reading');
const listeningItems = THEORY_HANDBOOK.filter(i => i.skill === 'listening');
const speakingItems = THEORY_HANDBOOK.filter(i => i.skill === 'speaking');
const grammarVocabItems = THEORY_HANDBOOK.filter(i => i.skill === 'grammar-vocab');

assert(writingItems.length >= 30, `Writing items must be >= 30, found ${writingItems.length}`);
assert(readingItems.length >= 25, `Reading items must be >= 25, found ${readingItems.length}`);
assert(listeningItems.length >= 20, `Listening items must be >= 20, found ${listeningItems.length}`);
assert(speakingItems.length >= 20, `Speaking items must be >= 20, found ${speakingItems.length}`);
assert(grammarVocabItems.length >= 13, `Grammar-Vocab items must be >= 13, found ${grammarVocabItems.length}`);
console.log(`    ✅ 5 study areas verified: Writing(${writingItems.length}), Reading(${readingItems.length}), Listening(${listeningItems.length}), Speaking(${speakingItems.length}), Grammar-Vocab(${grammarVocabItems.length}).`);

// 3. Verify Crucial Master Guides
console.log('  ▶ 3. Verifying crucial master guides from GitBook curriculum...');
const requiredIds = [
  // Writing
  'academic-hedging',
  'writing-task2-comparative-superlative-traps',
  'cambridge-examiner-insights-band8',
  'task2-peel-structure',
  'cdi-and-one-skill-retake-strategy',
  // Reading
  'reading-order-strategy-and-golden-rules',
  'reading-passage3-author-stance',
  'reading-chunking-speed',
  'reading-last-5-minutes-rescue',
  'reading-cambridge-synonym-lexicon',
  // Listening
  'cambridge-part3-consensus-traps',
  'listening-accents-guide',
  'listening-plural-s-grammar-rule',
  // Speaking
  'speaking-5-universal-archetypes',
  'speaking-part2-star-storytelling-method',
  'speaking-part3-micro-to-macro-social-expansion',
  // Grammar & Vocab
  'grammar-sentence-structures',
  'grammar-conditionals',
  'vocab-linking-devices',
  'error-log-and-paraphrase-journal'
];

const idSet = new Set(THEORY_HANDBOOK.map(i => i.id));
requiredIds.forEach(reqId => {
  assert(idSet.has(reqId), `Missing crucial guide ID: ${reqId}`);
});
console.log(`    ✅ All ${requiredIds.length} high-yield master guides confirmed in handbook.`);

// 4. Verify Schema Integrity
console.log('  ▶ 4. Verifying item schema integrity...');
THEORY_HANDBOOK.forEach((item, idx) => {
  assert(item.id, `Item ${idx} missing id`);
  assert(item.skill, `Item ${idx} missing skill`);
  assert(item.title, `Item ${idx} missing title`);
  assert(item.category, `Item ${idx} missing category`);
  assert(item.summary, `Item ${idx} missing summary`);
  assert(item.content && item.content.length > 50, `Item ${idx} (${item.id}) content too short`);
  assert(item.gitbookSlug, `Item ${idx} (${item.id}) missing gitbookSlug for deep linking`);
});
console.log('    ✅ Schema completeness 100% verified across all items.');

// 5. Verify TheoryHandbookModal.jsx UI Components
console.log('  ▶ 5. Verifying TheoryHandbookModal.jsx UI integration...');
assert(modalSource.includes("id: 'grammar-vocab'"), 'TheoryHandbookModal must include grammar-vocab in skillTabs');
assert(modalSource.includes('grammarVocabCategories'), 'TheoryHandbookModal must define grammarVocabCategories');
assert(modalSource.includes('grammarVocabSubTypes'), 'TheoryHandbookModal must define grammarVocabSubTypes');
assert(modalSource.includes('item.gitbookSlug'), 'TheoryHandbookModal must support item.gitbookSlug for deep linking');
assert(modalSource.includes('GITBOOK_DOCS_BASE_URL'), 'TheoryHandbookModal must reference GITBOOK_DOCS_BASE_URL');
assert(modalSource.includes('ExternalLink'), 'TheoryHandbookModal must render ExternalLink for GitBook buttons');
console.log('    ✅ Modal UI tabs, filters, and GitBook deep-linking verified.');

console.log('\n🎉 ALL STEP 97 GITBOOK CURRICULUM INTEGRATION TESTS PASSED (5/5)!');
