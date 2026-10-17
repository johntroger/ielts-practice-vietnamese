/**
 * tests/test_step167_phase1_phase2_architecture_optimization.js
 *
 * Step 167: Phase 1 & Phase 2 Architecture Optimization Verification
 * 1. Startup Bundle Optimization: On-demand dynamic imports for heavy evaluation engines in App.jsx & Arena chunk splitting in vite.config.js.
 * 2. Entity Type Normalization: inferEntityType & ENTITY_TYPES across writing_task, micro_drill, vocab_card, arena_profile.
 * 3. Arena XP Anti-Cheat Engine: validateAndSanitizeArenaProfile mathematical plausibility clamping & XSS sanitization.
 * 4. Cloudflare Worker R2 Security Guard: Owner identity header check, MIME whitelist, Path Traversal guard, Edge Arena clamping.
 * 5. Database Indexing & Constraints: Composite B-Tree indexes and chk_arena_xp_anti_cheat in supabase_schema.sql.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  ENTITY_TYPES,
  ARENA_ANTI_CHEAT_LIMITS,
  inferEntityType,
  validateAndSanitizeArenaProfile,
  sanitizeTaskForCloud,
  sanitizeDrillForCloud
} from '../src/utils/supabaseStorageGuard.js';

console.log('🧪 Running Step 167 Test Suite: Phase 1 & Phase 2 Software Architecture Optimization...');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`❌ FAILED: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// 1. Dynamic Code Splitting & Startup Optimization in App.jsx and vite.config.js
test('1. App.jsx uses on-demand dynamic import() for evaluation engines and vite.config.js splits data-arena-bank', () => {
  const appCode = fs.readFileSync(path.resolve('src/App.jsx'), 'utf8');
  const topLines = appCode.split('\n').slice(0, 55).join('\n');

  assert.ok(!topLines.includes("from './services/algorithmicEvaluationService'"), 'App.jsx must not statically import algorithmicEvaluationService at top level');
  assert.ok(!topLines.includes("from './services/geminiService'"), 'App.jsx must not statically import geminiService at top level');
  assert.ok(appCode.includes("import('./services/algorithmicEvaluationService')"), 'App.jsx must dynamically import algorithmicEvaluationService on demand');
  assert.ok(appCode.includes("import('./services/geminiService')"), 'App.jsx must dynamically import geminiService on demand');

  const viteCode = fs.readFileSync(path.resolve('vite.config.js'), 'utf8');
  assert.ok(viteCode.includes("'data-arena-bank'"), 'vite.config.js must split Arena questions into data-arena-bank chunk');
});

// 2. Entity Type Normalization
test('2. inferEntityType accurately classifies all 4 entity types', () => {
  assert.strictEqual(inferEntityType('arena-score-user123'), ENTITY_TYPES.ARENA_PROFILE);
  assert.strictEqual(inferEntityType('custom-drill-999'), ENTITY_TYPES.MICRO_DRILL);
  assert.strictEqual(inferEntityType('drill-101'), ENTITY_TYPES.MICRO_DRILL);
  assert.strictEqual(inferEntityType('comm-drill-202'), ENTITY_TYPES.MICRO_DRILL);
  assert.strictEqual(inferEntityType('ai-sp-111'), ENTITY_TYPES.VOCAB_CARD);
  assert.strictEqual(inferEntityType('ai-gr-222'), ENTITY_TYPES.VOCAB_CARD);
  assert.strictEqual(inferEntityType('ai-card-333'), ENTITY_TYPES.VOCAB_CARD);
  assert.strictEqual(inferEntityType('ai-gen-444'), ENTITY_TYPES.WRITING_TASK);
  assert.strictEqual(inferEntityType('task2-education'), ENTITY_TYPES.WRITING_TASK);

  const cleanTask = sanitizeTaskForCloud({ id: 'ai-gen-500', title: 'Test Task', taskNumber: 2 });
  assert.strictEqual(cleanTask.entityType, ENTITY_TYPES.WRITING_TASK);

  const cleanDrill = sanitizeDrillForCloud({ id: 'custom-drill-500', question: 'Test Drill' });
  assert.strictEqual(cleanDrill.entityType, ENTITY_TYPES.MICRO_DRILL);
});

// 3. Arena XP Anti-Cheat Mathematical Clamping & XSS Sanitization
test('3. validateAndSanitizeArenaProfile clamps tampered XP and strips XSS vectors', () => {
  // Tampered profile: only 2 matches played, but user injected 9,999,999 XP via DevTools and XSS script in name
  const cheatedProfile = {
    id: 'arena-score-cheater',
    displayName: '<script>alert("hack")</script>HackerPro',
    avatar: '<img onerror=1>',
    title: 'javascript:evil()',
    xp: 9999999,
    matchesPlayed: 2,
    wins: 99, // more wins than matchesPlayed!
    streak: 99999,
    level: 999
  };

  const sanitized = validateAndSanitizeArenaProfile(cheatedProfile);
  const expectedMaxPlausible = ARENA_ANTI_CHEAT_LIMITS.BASE_GRACE_XP + 2 * ARENA_ANTI_CHEAT_LIMITS.MAX_XP_PER_MATCH;

  assert.strictEqual(sanitized.xp, expectedMaxPlausible, 'Cheated XP must be clamped to mathematically plausible ceiling');
  assert.strictEqual(sanitized.antiCheatClamped, true, 'Must flag antiCheatClamped: true');
  assert.strictEqual(sanitized.wins, 2, 'Wins cannot exceed matchesPlayed');
  assert.strictEqual(sanitized.winRate, 100, 'Win rate must be bounded to 100%');
  assert.strictEqual(sanitized.streak, ARENA_ANTI_CHEAT_LIMITS.MAX_STREAK, 'Streak must be clamped to MAX_STREAK');
  assert.strictEqual(sanitized.level, 100, 'Level must be clamped to 100');
  assert.ok(!sanitized.displayName.includes('<') && !sanitized.displayName.includes('>'), 'XSS angle brackets must be stripped');
  assert.ok(!sanitized.title.toLowerCase().includes('javascript:'), 'javascript: protocol must be stripped');
});

// 4. Legitimate high-level player is NOT clamped
test('4. validateAndSanitizeArenaProfile preserves legitimate high-XP player stats intact', () => {
  const legitPlayer = {
    id: 'arena-score-scholar',
    displayName: 'Minh Anh IELTS 8.0',
    xp: 12500,
    matchesPlayed: 40,
    wins: 30,
    streak: 14,
    level: 28
  };

  const res = validateAndSanitizeArenaProfile(legitPlayer);
  assert.strictEqual(res.xp, 12500, 'Legitimate XP must remain untouched');
  assert.strictEqual(res.antiCheatClamped, false, 'Legitimate profile must have antiCheatClamped: false');
  assert.strictEqual(res.winRate, 75);
  assert.strictEqual(res.entityType, ENTITY_TYPES.ARENA_PROFILE);
});

// 5. Cloudflare Worker R2 Security & Edge Anti-Cheat Verification
test('5. cloudflare/worker.js implements R2 MIME whitelist, Path Traversal guard, Owner check, and Edge Anti-Cheat', () => {
  const workerCode = fs.readFileSync(path.resolve('cloudflare/worker.js'), 'utf8');
  assert.ok(workerCode.includes('ALLOWED_R2_MIME_TYPES'), 'Worker must enforce ALLOWED_R2_MIME_TYPES whitelist');
  assert.ok(workerCode.includes('sanitizeArenaRowAtEdge'), 'Worker must sanitize Arena leaderboard rows at Edge');
  assert.ok(workerCode.includes('X-IELTS-Owner-Email'), 'Worker must check X-IELTS-Owner-Email header');
  assert.ok(workerCode.includes("includes('..')"), 'Worker must block path traversal sequences in R2 keys');
});

// 6. Database Schema Section 11 Verification
test('6. supabase_schema.sql includes Section 11 Composite Indexes and chk_arena_xp_anti_cheat', () => {
  const sqlCode = fs.readFileSync(path.resolve('supabase_schema.sql'), 'utf8');
  assert.ok(sqlCode.includes('idx_user_custom_tasks_entity_public_created'), 'SQL schema must define composite index on entityType + is_public + created_at');
  assert.ok(sqlCode.includes('idx_user_submissions_user_created'), 'SQL schema must define composite index on user_submissions');
  assert.ok(sqlCode.includes('chk_arena_xp_anti_cheat'), 'SQL schema must define chk_arena_xp_anti_cheat constraint');
});

console.log(`\n🎉 All ${passed}/${passed} unit tests passed for Step 167! (100%)\n`);
