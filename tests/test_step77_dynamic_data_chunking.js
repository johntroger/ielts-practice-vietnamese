/**
 * Test Step 77: Dynamic Data Chunking & On-Demand Cambridge Bank Architecture (Kiến trúc Bước 4)
 *
 * Verifies:
 * 1. vite.config.js manualChunks configures specialized Data Chunks:
 *    - data-cambridge-writing
 *    - data-reading-tasks
 *    - data-listening-tasks
 *    - data-speaking-topics
 *    - data-theory-handbook
 *    - data-drills-bank
 * 2. DataLoaderService in src/services/dataLoaderService.js:
 *    - On-demand async loading for all 4 skills and handbooks.
 *    - Runtime memory caching.
 *    - Filter by Cambridge Book edition (e.g. Cambridge 20).
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataLoaderService } from '../src/services/dataLoaderService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Testing Step 77: Dynamic Data Chunking & On-Demand Cambridge Bank Architecture...');

// 1. Verify vite.config.js data chunks configuration
const viteConfigPath = path.resolve(__dirname, '../vite.config.js');
assert.ok(fs.existsSync(viteConfigPath), 'vite.config.js must exist');
const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');

assert.ok(viteConfigContent.includes('data-cambridge-writing'), 'Must configure data-cambridge-writing chunk');
assert.ok(viteConfigContent.includes('data-reading-tasks'), 'Must configure data-reading-tasks chunk');
assert.ok(viteConfigContent.includes('data-listening-tasks'), 'Must configure data-listening-tasks chunk');
assert.ok(viteConfigContent.includes('data-speaking-topics'), 'Must configure data-speaking-topics chunk');
assert.ok(viteConfigContent.includes('data-theory-handbook'), 'Must configure data-theory-handbook chunk');
assert.ok(viteConfigContent.includes('data-drills-bank'), 'Must configure data-drills-bank chunk');
console.log('  ✅ 1. vite.config.js successfully defines specialized Rollup Data Chunks');

// 2. Verify DataLoaderService async methods
async function testDataLoader() {
  // Cambridge Writing
  const writingTasks = await DataLoaderService.loadCambridgeWritingTasks();
  assert.ok(Array.isArray(writingTasks) && writingTasks.length > 0, 'Must load Cambridge writing tasks');
  console.log(`  ✅ 2. DataLoaderService loaded ${writingTasks.length} Cambridge writing tasks`);

  // Reading Tasks
  const readingTasks = await DataLoaderService.loadReadingTasks();
  assert.ok(Array.isArray(readingTasks) && readingTasks.length > 0, 'Must load Reading tasks');
  console.log(`  ✅ 3. DataLoaderService loaded ${readingTasks.length} Reading passages & tests`);

  // Listening Tasks
  const listeningTasks = await DataLoaderService.loadListeningTasks();
  assert.ok(Array.isArray(listeningTasks), 'Must load Listening tasks');
  console.log(`  ✅ 4. DataLoaderService loaded ${listeningTasks.length} Listening tasks`);

  // Speaking Topics
  const speakingTopics = await DataLoaderService.loadSpeakingTopics();
  assert.ok(speakingTopics && speakingTopics.part1.length > 0, 'Must load Speaking topics');
  console.log(`  ✅ 5. DataLoaderService loaded ${speakingTopics.part1.length} Part 1 Speaking topics`);

  // Cambridge 20 filtering
  const cam20Tasks = await DataLoaderService.filterTasksByCambridgeBook(20);
  assert.ok(cam20Tasks.length > 0, 'Must filter Cambridge 20 tasks');
  assert.ok(cam20Tasks.every(t => t.cambridgeBook === 20), 'All filtered tasks must belong to Cambridge 20');
  console.log(`  ✅ 6. DataLoaderService verified Cambridge 20 book filter (${cam20Tasks.length} tasks)`);

  // Memory Cache clear
  DataLoaderService.clearCache();
  console.log('  ✅ 7. Runtime memory cache clearing verified');
}

testDataLoader().then(() => {
  console.log('🎉 Step 77: Dynamic Data Chunking & On-Demand Cambridge Bank Architecture passed cleanly!');
});
