/**
 * Step 170: Phase 6 Architecture Upgrade Verification
 * 1. Cloudflare Worker AI Proxy Gateway (/api/ai/generate) & SHA-256 Prompt Response Caching (Edge + R2)
 * 2. Client-side Gemini Prompt Response Caching & Edge Proxy Integration (coreGeminiClient.js)
 * 3. Lazy-Loaded Question Banks & Staged Async Hydration (arenaQuestionBank.js & dataLoaderService.js)
 * 4. Fine-Grained Vite Bundle Chunking (< 600 kB per chunk, zero build chunk warnings)
 * 5. Unified AppStore Direct State Consumption in AppModalHost & Navbar
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  computeClientPromptHash,
  getCachedGeminiResponse,
  setCachedGeminiResponse,
  clearGeminiResponseCache,
  resolveEdgeAiProxyUrl,
  callGeminiViaEdgeProxy
} from '../src/services/ai/coreGeminiClient.js';
import {
  hydrateArenaQuestionsWithMetadata,
  loadArenaQuestionBatchAsync,
  prefetchArenaQuestionBankInBackground,
  ARENA_QUESTION_BANK
} from '../src/data/arenaQuestionBank.js';
import {
  DataLoaderService,
  loadArenaQuestionsOnDemand,
  loadVocabGrammarSpellingBankOnDemand
} from '../src/services/dataLoaderService.js';

let passed = 0;
let total = 0;

async function testAsync(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

console.log('🧪 Running Step 170: Phase 6 AI Proxy Cache, Lazy Question Banks & Unified AppStore Tests...');

// 1. Verify Cloudflare Worker AI Proxy Gateway & SHA-256 Edge/R2 Caching
await testAsync('cloudflare/worker.js implements /api/ai/generate with SHA-256 prompt hashing and Edge+R2 caching', async () => {
  const workerSrc = fs.readFileSync(path.resolve('cloudflare/worker.js'), 'utf-8');
  assert.ok(workerSrc.includes('async function computePromptHash(model, body)'), 'Must define computePromptHash using Web Crypto SHA-256');
  assert.ok(workerSrc.includes("crypto.subtle.digest('SHA-256'"), 'Must compute SHA-256 digest');
  assert.ok(workerSrc.includes("path === '/api/ai/generate'"), 'Must expose POST /api/ai/generate route');
  assert.ok(workerSrc.includes('ai-cache/${promptHash}.json'), 'Must store/retrieve AI prompt cache in R2 bucket under ai-cache/');
  assert.ok(workerSrc.includes("hitHeaders.set('X-IELTS-AI-Cache', 'HIT')"), 'Must tag Edge Cache hits');
  assert.ok(workerSrc.includes("'X-IELTS-AI-Cache': 'R2-HIT'"), 'Must tag R2 Cache hits');
});

// 2. Verify Client-Side Deterministic Prompt Hash & Response Cache in coreGeminiClient.js
await testAsync('coreGeminiClient.js computes deterministic prompt hashes and caches responses with TTL', async () => {
  clearGeminiResponseCache();
  const bodyA = { contents: [{ parts: [{ text: 'Evaluate essay Task 2' }] }], generationConfig: { temperature: 0.1 } };
  const bodyB = { contents: [{ parts: [{ text: 'Evaluate essay Task 2' }] }], generationConfig: { temperature: 0.1 } };
  const bodyC = { contents: [{ parts: [{ text: 'Different essay prompt' }] }], generationConfig: { temperature: 0.1 } };

  const hashA1 = computeClientPromptHash('gemini-3.6-flash', bodyA);
  const hashA2 = computeClientPromptHash('models/gemini-3.6-flash', bodyB);
  const hashC = computeClientPromptHash('gemini-3.6-flash', bodyC);

  assert.equal(hashA1, hashA2, 'Identical model + body must produce identical hash');
  assert.notEqual(hashA1, hashC, 'Different prompt body must produce distinct hash');

  assert.equal(getCachedGeminiResponse(hashA1), null, 'Cache must initially miss');
  const mockPayload = { candidates: [{ content: { parts: [{ text: '{"overallBand":7.5}' }] } }] };
  setCachedGeminiResponse(hashA1, mockPayload, 60000);

  const cached = getCachedGeminiResponse(hashA1);
  assert.deepEqual(cached, mockPayload, 'Cache must return stored payload before TTL expiry');

  clearGeminiResponseCache();
  assert.equal(getCachedGeminiResponse(hashA1), null, 'clearGeminiResponseCache must clear entries');
  assert.equal(typeof resolveEdgeAiProxyUrl, 'function');
  assert.equal(typeof callGeminiViaEdgeProxy, 'function');
});

// 3. Verify Staged Asynchronous Arena Question Bank Hydration
await testAsync('arenaQuestionBank.js supports staged async batch loading & background prefetching', async () => {
  assert.equal(typeof hydrateArenaQuestionsWithMetadata, 'function');
  assert.equal(typeof loadArenaQuestionBatchAsync, 'function');
  assert.equal(typeof prefetchArenaQuestionBankInBackground, 'function');

  const baseBatch = await loadArenaQuestionBatchAsync('base');
  const batch1 = await loadArenaQuestionBatchAsync('batch1');
  const batch2 = await loadArenaQuestionBatchAsync('batch2');
  const batch3 = await loadArenaQuestionBatchAsync('batch3');
  const reading101 = await loadArenaQuestionBatchAsync('reading101');
  const allBatch = await loadArenaQuestionBatchAsync('all');

  assert.ok(Array.isArray(baseBatch) && baseBatch.length > 10, 'Base batch must load questions');
  assert.ok(Array.isArray(batch1) && batch1.length > 20, 'Batch 1 must load questions');
  assert.ok(Array.isArray(batch2) && batch2.length > 20, 'Batch 2 must load questions');
  assert.ok(Array.isArray(batch3) && batch3.length > 20, 'Batch 3 must load questions');
  assert.ok(Array.isArray(reading101) && reading101.length > 0, '101 Reading batch must load questions');
  assert.equal(
    baseBatch.length + batch1.length + batch2.length + batch3.length + reading101.length,
    allBatch.length,
    'Sum of staged batches must match full ARENA_QUESTION_BANK count'
  );
});

// 4. Verify DataLoaderService On-Demand Loaders for Arena & Vocab/Grammar/Spelling
await testAsync('DataLoaderService lazily loads and caches Arena batches and Vocab/Grammar/Spelling banks', async () => {
  DataLoaderService.clearCache();
  const arenaBase = await loadArenaQuestionsOnDemand('base');
  assert.ok(Array.isArray(arenaBase) && arenaBase.length > 10);

  const vgsBank = await loadVocabGrammarSpellingBankOnDemand();
  assert.ok(Array.isArray(vgsBank.vocabQuiz) && vgsBank.vocabQuiz.length > 0, 'vocabQuiz bank must be populated');
  assert.ok(Array.isArray(vgsBank.grammarDrills) && vgsBank.grammarDrills.length > 0, 'grammarDrills bank must be populated');
  assert.ok(Array.isArray(vgsBank.spellingTasks) && vgsBank.spellingTasks.length > 0, 'spellingTasks bank must be populated');
});

// 5. Verify Fine-Grained Vite Bundle Chunking Configuration
await testAsync('vite.config.js splits reading, listening, and arena translations into sub-600kB chunks', async () => {
  const viteSrc = fs.readFileSync(path.resolve('vite.config.js'), 'utf-8');
  assert.ok(viteSrc.includes("id.includes('src/data/reading/')"), 'Must match src/data/reading/ sub-modules');
  assert.ok(viteSrc.includes("id.includes('src/data/listening/')"), 'Must match src/data/listening/ sub-modules');
  assert.ok(viteSrc.includes("return 'data-listening-cambridge';"), 'Must split Cambridge listening sets into dedicated chunk');
  assert.ok(viteSrc.includes("return 'data-arena-translations';"), 'Must split arenaQuestionTranslations into dedicated chunk');
  assert.ok(viteSrc.includes("return 'data-arena-bank';"), 'Must preserve data-arena-bank chunk');
});

// 6. Verify Unified AppStore Consumption in AppModalHost & Navbar
await testAsync('AppModalHost.jsx and Navbar.jsx consume useAppStore directly for shared UI & accessibility state', async () => {
  const modalHostSrc = fs.readFileSync(path.resolve('src/components/modals/AppModalHost.jsx'), 'utf-8');
  const navbarSrc = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf-8');

  assert.ok(modalHostSrc.includes("import { useAppStore } from '../../core/appStore'"), 'AppModalHost must import useAppStore');
  assert.ok(modalHostSrc.includes('const appStore = useAppStore()'), 'AppModalHost must subscribe to useAppStore');
  assert.ok(modalHostSrc.includes('activeSkill ?? appStore.activeSkill'), 'AppModalHost must fallback activeSkill to appStore');
  assert.ok(modalHostSrc.includes('cdiFontSize ?? appStore.cdiFontSize'), 'AppModalHost must fallback cdiFontSize to appStore');

  assert.ok(navbarSrc.includes("import { useAppStore } from '../core/appStore'"), 'Navbar must import useAppStore');
  assert.ok(navbarSrc.includes('const appStore = useAppStore()'), 'Navbar must subscribe to useAppStore');
  assert.ok(navbarSrc.includes('activeSkillProp || appStore.activeSkill'), 'Navbar must fallback activeSkill to appStore');
});

console.log(`\n🎉 All ${passed}/${total} tests passed in Step 170 (Phase 6 Architecture Upgrade)!`);
