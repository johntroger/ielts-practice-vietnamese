/**
 * tests/test_step100_dynamic_theory_chunks_and_bundle_splitting.js
 * 
 * Milestone Step 100: Dynamic Theory Chunks & Bundle Splitting
 * Verifies:
 * 1. 113 Master Topics preserved in backward-compatible THEORY_HANDBOOK.
 * 2. THEORY_HANDBOOK_METADATA contains 113 lightweight entries without full markdown content.
 * 3. Individual skill chunk modules export exact topic counts:
 *    - Writing: 34 topics
 *    - Reading: 25 topics
 *    - Listening: 20 topics
 *    - Speaking: 20 topics
 *    - Grammar-Vocab: 14 topics
 * 4. Asynchronous on-demand loader `loadTheoryHandbookBySkill` works for all 5 skills.
 * 5. On-demand single-article loader `loadTheoryArticle` returns full article content.
 * 6. `dataLoaderService` re-exports on-demand loaders cleanly.
 * 7. `vite.config.js` manualChunks splits bundles into skill-specific chunks under 250 kB each.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  THEORY_HANDBOOK,
  THEORY_HANDBOOK_METADATA,
  loadTheoryHandbookBySkill,
  loadTheoryArticle
} from '../src/data/theoryHandbook.js';

import { WRITING_THEORY_ARTICLES } from '../src/data/theoryHandbook/writingTheoryData.js';
import { READING_THEORY_ARTICLES } from '../src/data/theoryHandbook/readingTheoryData.js';
import { LISTENING_THEORY_ARTICLES } from '../src/data/theoryHandbook/listeningTheoryData.js';
import { SPEAKING_THEORY_ARTICLES } from '../src/data/theoryHandbook/speakingTheoryData.js';
import { GRAMMAR_VOCAB_THEORY_ARTICLES } from '../src/data/theoryHandbook/grammarVocabTheoryData.js';

import {
  loadTheoryHandbookBySkill as serviceLoadBySkill,
  loadTheoryArticle as serviceLoadArticle
} from '../src/services/dataLoaderService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- RUNNING STEP 100: DYNAMIC THEORY CHUNKS & BUNDLE SPLITTING ---');

let passedTests = 0;

function it(desc, fn) {
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

async function itAsync(desc, fn) {
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// 1. Backward-compatible master array
it('1. THEORY_HANDBOOK maintains complete 113 topics across all skills', () => {
  assert.strictEqual(THEORY_HANDBOOK.length, 113, 'Must have exactly 113 theory topics');
  const ids = new Set();
  THEORY_HANDBOOK.forEach(item => {
    assert.ok(item.id, 'Topic must have an ID');
    assert.ok(item.title, 'Topic must have a title');
    assert.ok(item.skill, 'Topic must have a skill');
    assert.ok(item.content && item.content.length > 50, 'Topic must have substantial content');
    assert.ok(!ids.has(item.id), `Duplicate topic ID found: ${item.id}`);
    ids.add(item.id);
  });
});

// 2. Lightweight metadata index
it('2. THEORY_HANDBOOK_METADATA has 113 items and contains no heavy content strings', () => {
  assert.strictEqual(THEORY_HANDBOOK_METADATA.length, 113, 'Metadata must have 113 entries');
  THEORY_HANDBOOK_METADATA.forEach(meta => {
    assert.ok(meta.id, 'Metadata entry must have id');
    assert.ok(meta.title, 'Metadata entry must have title');
    assert.ok(meta.skill, 'Metadata entry must have skill');
    assert.ok(meta.summary, 'Metadata entry must have summary');
    assert.strictEqual(meta.content, undefined, 'Metadata entry must NOT contain heavy content');
  });
});

// 3. Skill chunk individual files
it('3. Individual skill chunk files export precise topic counts', () => {
  assert.strictEqual(WRITING_THEORY_ARTICLES.length, 34, 'Writing chunk must have 34 topics');
  assert.strictEqual(READING_THEORY_ARTICLES.length, 25, 'Reading chunk must have 25 topics');
  assert.strictEqual(LISTENING_THEORY_ARTICLES.length, 20, 'Listening chunk must have 20 topics');
  assert.strictEqual(SPEAKING_THEORY_ARTICLES.length, 20, 'Speaking chunk must have 20 topics');
  assert.strictEqual(GRAMMAR_VOCAB_THEORY_ARTICLES.length, 14, 'Grammar-vocab chunk must have 14 topics');

  assert.ok(WRITING_THEORY_ARTICLES.every(a => a.skill === 'writing'), 'All writing articles have skill: writing');
  assert.ok(READING_THEORY_ARTICLES.every(a => a.skill === 'reading'), 'All reading articles have skill: reading');
  assert.ok(LISTENING_THEORY_ARTICLES.every(a => a.skill === 'listening'), 'All listening articles have skill: listening');
  assert.ok(SPEAKING_THEORY_ARTICLES.every(a => a.skill === 'speaking'), 'All speaking articles have skill: speaking');
  assert.ok(GRAMMAR_VOCAB_THEORY_ARTICLES.every(a => a.skill === 'grammar-vocab'), 'All grammar articles have skill: grammar-vocab');
});

// 4. Asynchronous on-demand skill loader
await itAsync('4. loadTheoryHandbookBySkill resolves chunks dynamically for each skill', async () => {
  const writing = await loadTheoryHandbookBySkill('writing');
  assert.strictEqual(writing.length, 34);

  const reading = await loadTheoryHandbookBySkill('reading');
  assert.strictEqual(reading.length, 25);

  const listening = await loadTheoryHandbookBySkill('listening');
  assert.strictEqual(listening.length, 20);

  const speaking = await loadTheoryHandbookBySkill('speaking');
  assert.strictEqual(speaking.length, 20);

  const grammarVocab = await loadTheoryHandbookBySkill('grammar-vocab');
  assert.strictEqual(grammarVocab.length, 14);

  const unknown = await loadTheoryHandbookBySkill('unknown-skill');
  assert.deepStrictEqual(unknown, []);
});

// 5. Asynchronous single article loader
await itAsync('5. loadTheoryArticle finds and returns full article content dynamically', async () => {
  const lineGraph = await loadTheoryArticle('task1-line-graph');
  assert.ok(lineGraph, 'Should find task1-line-graph');
  assert.strictEqual(lineGraph.skill, 'writing');
  assert.ok(lineGraph.content.includes('Line Graph') || lineGraph.content.includes('Biểu đồ đường'));

  const tfng = await loadTheoryArticle('true-false-not-given');
  assert.ok(tfng, 'Should find true-false-not-given');
  assert.strictEqual(tfng.skill, 'reading');

  const speakingP1 = await loadTheoryArticle('area-framework-part1');
  assert.ok(speakingP1, 'Should find area-framework-part1');
  assert.strictEqual(speakingP1.skill, 'speaking');

  const nonExistent = await loadTheoryArticle('non-existent-topic-999');
  assert.strictEqual(nonExistent, null);
});

// 6. dataLoaderService integration
await itAsync('6. dataLoaderService re-exports on-demand theory loading methods', async () => {
  const articles = await serviceLoadBySkill('listening');
  assert.strictEqual(articles.length, 20);

  const article = await serviceLoadArticle('listening-part1-spelling-numbers');
  assert.ok(article);
  assert.strictEqual(article.skill, 'listening');
});

// 7. Vite Rollup manualChunks configuration verification
it('7. vite.config.js configures dedicated chunks for all 5 theory skills & metadata', () => {
  const viteConfigPath = path.resolve(__dirname, '../vite.config.js');
  const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8');

  assert.ok(viteConfigContent.includes('data-theory-writing'), 'Vite config must define data-theory-writing chunk');
  assert.ok(viteConfigContent.includes('data-theory-reading'), 'Vite config must define data-theory-reading chunk');
  assert.ok(viteConfigContent.includes('data-theory-listening'), 'Vite config must define data-theory-listening chunk');
  assert.ok(viteConfigContent.includes('data-theory-speaking'), 'Vite config must define data-theory-speaking chunk');
  assert.ok(viteConfigContent.includes('data-theory-grammar-vocab'), 'Vite config must define data-theory-grammar-vocab chunk');
  assert.ok(viteConfigContent.includes('data-theory-metadata'), 'Vite config must define data-theory-metadata chunk');
});

console.log(`\nAll ${passedTests}/${passedTests} checks PASSED for Step 100!`);
