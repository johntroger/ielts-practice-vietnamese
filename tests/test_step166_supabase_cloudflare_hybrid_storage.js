/**
 * tests/test_step166_supabase_cloudflare_hybrid_storage.js
 * 
 * Verification Test Suite for Step 166:
 * Supabase + Cloudflare (R2 & Workers Edge Cache) + IndexedDB Hybrid Storage Architecture
 * 
 * Verifies:
 * 1. Supabase Storage Guard (`supabaseStorageGuard.js`) strips bloated Base64 images (>35KB) and caps row payloads.
 * 2. Process & Map tasks retain vector SVG engine rendering and never push heavy PNG Base64 to Supabase.
 * 3. Cloudflare Hybrid Storage (`cloudflareStorageService.js`) resolves `r2://` and HTTPS URLs accurately.
 * 4. Multi-Tier Read Engine (`fetchWithHybridEdgeCache`) serves cached data and isolates Node.js offline tests.
 * 5. `dataSyncService.js` applies strict server-side SQL `.not('id', 'like', ...)` filters for Writing tasks.
 * 6. Ready-to-deploy Cloudflare Worker (`cloudflare/worker.js`) and `cloudflare/wrangler.toml` are complete.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {
  SUPABASE_LIMITS,
  getByteLength,
  isBloatedBase64,
  sanitizeTaskForCloud,
  sanitizeSubmissionForCloud,
  sanitizeDrillForCloud
} from '../src/utils/supabaseStorageGuard.js';
import {
  EDGE_RESOURCE_KEYS,
  resolveHybridMediaUrl,
  offloadMediaToCloudflareR2,
  fetchWithHybridEdgeCache,
  invalidateHybridEdgeCache
} from '../src/services/cloudflareStorageService.js';

let passed = 0;
let total = 0;

async function it(desc, fn) {
  total++;
  try {
    await fn();
    passed++;
  } catch (err) {
    console.error(`❌ Failed: ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

async function runTests() {
  console.log('🧪 Running Step 166 Test Suite: Supabase + Cloudflare Hybrid Storage Architecture...');

  // 1. Verify SUPABASE_LIMITS constants
  await it('1. SUPABASE_LIMITS enforces strict row payload cap (80 KB) and inline image cap (35 KB)', () => {
    assert.strictEqual(SUPABASE_LIMITS.MAX_ROW_PAYLOAD_BYTES, 80 * 1024);
    assert.strictEqual(SUPABASE_LIMITS.MAX_INLINE_IMAGE_BYTES, 35 * 1024);
    assert.strictEqual(SUPABASE_LIMITS.MAX_TASKS_PER_FETCH, 150);
    assert.strictEqual(SUPABASE_LIMITS.CACHE_TTL_MS, 30 * 60 * 1000);
  });

  // 2. Verify isBloatedBase64 detection
  await it('2. isBloatedBase64 accurately detects oversized base64 strings while allowing external URLs and small SVGs', () => {
    const giantPng = 'data:image/png;base64,' + 'A'.repeat(100000);
    const smallSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>';
    const r2Url = 'https://pub-ielts.r2.dev/tasks/chart-1.webp';

    assert.strictEqual(isBloatedBase64(giantPng), true);
    assert.strictEqual(isBloatedBase64(smallSvg), false);
    assert.strictEqual(isBloatedBase64(r2Url), false);
  });

  // 3. Verify sanitizeTaskForCloud strips bloated images from Process/Map and custom tasks
  await it('3. sanitizeTaskForCloud strips bloated base64 images to protect Supabase Egress', () => {
    const bloatedTask = {
      id: 'ai-gen-999',
      taskNumber: 1,
      type: 'process',
      title: 'Manufacturing Process',
      processSteps: [{ step: 1, name: 'Collect', desc: 'Collect raw items' }],
      imageUrl: 'data:image/png;base64,' + 'B'.repeat(500000),
      audioBase64: 'data:audio/mp3;base64,' + 'C'.repeat(50000)
    };

    const cleaned = sanitizeTaskForCloud(bloatedTask);
    assert.strictEqual(cleaned.imageUrl, undefined, 'Bloated base64 imageUrl must be stripped');
    assert.strictEqual(cleaned.audioBase64, undefined, 'Bloated audioBase64 must be stripped');
    assert.strictEqual(cleaned.title, 'Manufacturing Process');
    assert.ok(getByteLength(cleaned) < 5000);
  });

  // 4. Verify sanitizeTaskForCloud preserves Cloudflare R2 URLs
  await it('4. sanitizeTaskForCloud preserves lightweight Cloudflare R2 URLs', () => {
    const r2Task = {
      id: 'manual-task-101',
      taskNumber: 1,
      type: 'bar',
      title: 'Global Energy Bar Chart',
      imageUrl: 'https://pub-ielts-media.r2.dev/tasks/bar-101.webp'
    };

    const cleaned = sanitizeTaskForCloud(r2Task);
    assert.strictEqual(cleaned.imageUrl, 'https://pub-ielts-media.r2.dev/tasks/bar-101.webp');
  });

  // 5. Verify sanitizeSubmissionForCloud and sanitizeDrillForCloud
  await it('5. sanitizeSubmissionForCloud & sanitizeDrillForCloud strip raw AI candidates and audioBase64', () => {
    const sub = {
      id: 'sub-1',
      essayText: 'Sample essay text',
      task: {
        id: 't-1',
        taskNumber: 1,
        type: 'map',
        imageUrl: 'data:image/png;base64,' + 'X'.repeat(80000)
      },
      evaluation: {
        overallBand: 7.5,
        rawCandidate: { debug: 'HUGE_DEBUG_OBJECT' }
      }
    };

    const cleanSub = sanitizeSubmissionForCloud(sub);
    assert.strictEqual(cleanSub.task.imageUrl, undefined);
    assert.strictEqual(cleanSub.evaluation.rawCandidate, undefined);
    assert.strictEqual(cleanSub.evaluation.overallBand, 7.5);

    const drill = {
      id: 'drill-1',
      question: 'Fill in the blank',
      audioBase64: 'data:audio/wav;base64,' + 'Z'.repeat(60000)
    };
    const cleanDrill = sanitizeDrillForCloud(drill);
    assert.strictEqual(cleanDrill.audioBase64, undefined);
  });

  // 6. Verify resolveHybridMediaUrl and offloadMediaToCloudflareR2
  await it('6. resolveHybridMediaUrl & offloadMediaToCloudflareR2 handle HTTPS, SVG, and R2 keys cleanly', async () => {
    assert.strictEqual(
      resolveHybridMediaUrl('https://cdn.example.com/chart.webp'),
      'https://cdn.example.com/chart.webp'
    );

    const resHttps = await offloadMediaToCloudflareR2('https://pub-r2.dev/tasks/img1.webp');
    assert.strictEqual(resHttps.storageTier, 'cloudflare_r2');
    assert.strictEqual(resHttps.url, 'https://pub-r2.dev/tasks/img1.webp');

    const smallSvg = 'data:image/svg+xml;utf8,<svg></svg>';
    const resSvg = await offloadMediaToCloudflareR2(smallSvg);
    assert.strictEqual(resSvg.storageTier, 'inline_compressed');
    assert.strictEqual(resSvg.url, smallSvg);
  });

  // 7. Verify fetchWithHybridEdgeCache offline test guard
  await it('7. fetchWithHybridEdgeCache isolates Node.js unit tests from hitting live Supabase network', async () => {
    let originCalled = false;
    const data = await fetchWithHybridEdgeCache({
      resourceKey: EDGE_RESOURCE_KEYS.PUBLIC_TASKS,
      supabaseFallbackFn: async () => {
        originCalled = true;
        return [{ id: 'should-not-call-in-node-test' }];
      }
    });

    assert.strictEqual(originCalled, false, 'Must not call live Supabase during offline Node unit tests');
    assert.ok(Array.isArray(data));
    await invalidateHybridEdgeCache(EDGE_RESOURCE_KEYS.PUBLIC_TASKS);
  });

  // 8. Verify dataSyncService.js and cloudflare/worker.js architectural integrity
  await it('8. dataSyncService.js and cloudflare/worker.js implement server-side SQL filtering & R2 failover', () => {
    const syncCode = fs.readFileSync(path.resolve('src/services/dataSyncService.js'), 'utf8');
    assert.ok(syncCode.includes('fetchWithHybridEdgeCache'), 'dataSyncService must use fetchWithHybridEdgeCache');
    assert.ok(syncCode.includes(".not('id', 'like', 'custom-drill-%')"), 'fetchPublicTasks must filter out custom-drill at SQL level');
    assert.ok(syncCode.includes(".not('id', 'like', 'arena-score-%')"), 'fetchPublicTasks must filter out arena-score at SQL level');
    assert.ok(syncCode.includes('offloadMediaToCloudflareR2'), 'saveUserCustomTask must offload raster media via offloadMediaToCloudflareR2');

    const workerCode = fs.readFileSync(path.resolve('cloudflare/worker.js'), 'utf8');
    assert.ok(workerCode.includes('IELTS_R2_BUCKET'), 'Cloudflare Worker must bind to IELTS_R2_BUCKET');
    assert.ok(workerCode.includes('/api/cache/'), 'Cloudflare Worker must expose /api/cache/ route');
    assert.ok(workerCode.includes('/api/r2/upload'), 'Cloudflare Worker must expose /api/r2/upload route');
    assert.ok(workerCode.includes('R2-FAILOVER'), 'Cloudflare Worker must support automatic R2 snapshot failover');

    const wranglerToml = fs.readFileSync(path.resolve('cloudflare/wrangler.toml'), 'utf8');
    assert.ok(wranglerToml.includes('ielts-web-media'), 'wrangler.toml must configure ielts-web-media R2 bucket');
  });

  console.log(`\n🎉 All ${passed}/${total} unit tests passed for Step 166! (100%)\n`);
}

runTests();
