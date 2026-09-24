/**
 * Step 32: Mandatory Visual Illustrations for IELTS Task 1 Process & Map
 * Validates the vector illustration engine, SVG synthesis, and guaranteed imageUrl attachment.
 */

import assert from 'assert';
import {
  generateProcessDiagramSvg,
  generateMapComparisonSvg,
  ensureTaskIllustration
} from '../src/services/processMapSvgEngine.js';
import { PROCESS_AND_MAP_TASKS } from '../src/data/processAndMapTasks.js';

console.log('🧪 Starting Step 32 Test Suite: Task 1 Process & Map Mandatory Illustrations...\n');

let testsPassed = 0;

// Test 1: Process Diagram SVG Generation
console.log('Test 1: generateProcessDiagramSvg creates valid Cambridge process flowchart...');
const sampleProcessTask = {
  title: 'How Instant Coffee Is Produced',
  taskNumber: 1,
  type: 'process',
  processSteps: [
    { step: 1, name: 'Harvesting', desc: 'Coffee beans picked from trees' },
    { step: 2, name: 'Drying', desc: 'Beans dried under direct sunlight' },
    { step: 3, name: 'Roasting', desc: 'Beans roasted at 220°C in industrial ovens' },
    { step: 4, name: 'Grinding', desc: 'Roasted beans crushed into fine powder' },
    { step: 5, name: 'Freeze-drying', desc: 'Moisture extracted under vacuum' }
  ]
};

const processSvg = generateProcessDiagramSvg(sampleProcessTask);
assert(typeof processSvg === 'string', 'SVG output must be a string');
assert(processSvg.includes('<svg') && processSvg.trim().endsWith('</svg>'), 'Must produce valid SVG tags');
assert(processSvg.includes('Harvesting'), 'Must contain step 1 title');
assert(processSvg.includes('Freeze-drying'), 'Must contain step 5 title');
assert(processSvg.includes('marker-end="url(#arrowhead)"'), 'Must include connection arrows');
assert(processSvg.includes('STAGE 1'), 'Must include Stage 1 badge');
assert(processSvg.includes('GIAI ĐOẠN TUẦN TỰ'), 'Must include total stages banner');
testsPassed++;
console.log('  ✅ Test 1 Passed: Process flowchart SVG generated with steps, arrows, and badges.');

// Test 2: Process SVG fallback for default/empty input
console.log('Test 2: generateProcessDiagramSvg handles empty task safely with defaults...');
const fallbackSvg = generateProcessDiagramSvg({});
assert(fallbackSvg.includes('<svg') && fallbackSvg.trim().endsWith('</svg>'), 'Fallback must produce valid SVG');
assert(fallbackSvg.includes('Collection'), 'Must fallback to default standard process');
testsPassed++;
console.log('  ✅ Test 2 Passed: Safe fallback for empty process task.');

// Test 3: Map Comparison SVG Generation
console.log('Test 3: generateMapComparisonSvg creates dual-period map comparison with compass...');
const sampleMapTask = {
  title: 'Transformation of Southside Village (2000 vs 2025)',
  taskNumber: 1,
  type: 'map',
  mapChanges: [
    { area: 'Northern Farmland', past: 'Agricultural fields', present: 'New residential housing estate' },
    { area: 'Southern Coast', past: 'Old fishing pier', present: 'Luxury yacht marina' }
  ]
};

const mapSvg = generateMapComparisonSvg(sampleMapTask);
assert(typeof mapSvg === 'string', 'Map SVG output must be a string');
assert(mapSvg.includes('<svg') && mapSvg.trim().endsWith('</svg>'), 'Must produce valid SVG tags');
assert(mapSvg.includes('compass-rose') || (mapSvg.includes('N') && mapSvg.includes('S') && mapSvg.includes('E') && mapSvg.includes('W')), 'Must contain compass directions');
assert(mapSvg.includes('MAP 1'), 'Must render Period 1 map frame');
assert(mapSvg.includes('MAP 2'), 'Must render Period 2 map frame');
assert(mapSvg.includes('Biến đổi trọng tâm') || mapSvg.includes('Farmland'), 'Must contain transformation legend');
testsPassed++;
console.log('  ✅ Test 3 Passed: Dual-period map comparison SVG generated with compass rose & zones.');

// Test 4: ensureTaskIllustration guarantees imageUrl on Process task
console.log('Test 4: ensureTaskIllustration attaches data URL to Process task lacking imageUrl...');
const rawProcessTask = {
  id: 'task-proc-test',
  taskNumber: 1,
  type: 'process',
  title: 'Water Purification Flow',
  processSteps: [{ step: 1, name: 'Sedimentation', desc: 'Heavy particles settle' }]
};

const guaranteedProcess = ensureTaskIllustration(rawProcessTask);
assert(guaranteedProcess.imageUrl, 'imageUrl must be defined');
assert(guaranteedProcess.imageUrl.startsWith('data:image/svg+xml;utf8,'), 'imageUrl must be an SVG data URL');
assert(decodeURIComponent(guaranteedProcess.imageUrl).includes('Sedimentation'), 'Decoded SVG must contain step content');
testsPassed++;
console.log('  ✅ Test 4 Passed: ensureTaskIllustration attached valid SVG data URI to Process task.');

// Test 5: ensureTaskIllustration guarantees imageUrl on Map task
console.log('Test 5: ensureTaskIllustration attaches data URL to Map task lacking imageUrl...');
const rawMapTask = {
  id: 'task-map-test',
  taskNumber: 1,
  type: 'map',
  title: 'Island Development',
  mapChanges: [{ area: 'Beach', past: 'Empty sand', present: 'Bungalows' }]
};

const guaranteedMap = ensureTaskIllustration(rawMapTask);
assert(guaranteedMap.imageUrl, 'imageUrl must be defined');
assert(guaranteedMap.imageUrl.startsWith('data:image/svg+xml;utf8,'), 'imageUrl must be an SVG data URL');
testsPassed++;
console.log('  ✅ Test 5 Passed: ensureTaskIllustration attached valid SVG data URI to Map task.');

// Test 6: AI-provided raw svgIllustration is properly preserved and converted
console.log('Test 6: ensureTaskIllustration converts raw AI svgIllustration if present...');
const aiTaskWithSvg = {
  taskNumber: 1,
  type: 'process',
  title: 'AI Custom Diagram',
  svgIllustration: '<svg xmlns="http://www.w3.org/2000/svg"><text>Custom AI Vector</text></svg>'
};

const resultAiTask = ensureTaskIllustration(aiTaskWithSvg);
assert(resultAiTask.imageUrl.startsWith('data:image/svg+xml;utf8,'), 'imageUrl must be data URI');
assert(decodeURIComponent(resultAiTask.imageUrl).includes('Custom AI Vector'), 'Must wrap AI provided SVG');
testsPassed++;
console.log('  ✅ Test 6 Passed: AI raw svgIllustration safely converted to imageUrl.');

// Test 7: Task 2 and non-map/process tasks remain untouched
console.log('Test 7: ensureTaskIllustration leaves Task 2 unaffected...');
const task2 = {
  id: 'task2-essay',
  taskNumber: 2,
  type: 'agree_disagree',
  prompt: 'Some people think technology causes loneliness...'
};

const unchangedTask2 = ensureTaskIllustration(task2);
assert.strictEqual(unchangedTask2.imageUrl, undefined, 'Task 2 should not have an imageUrl generated');
testsPassed++;
console.log('  ✅ Test 7 Passed: Task 2 is unaffected.');

// Test 8: Process and Map tasks in standard library all have valid imageUrl
console.log('Test 8: Verify all tasks in PROCESS_AND_MAP_TASKS have imageUrl...');
assert(Array.isArray(PROCESS_AND_MAP_TASKS) && PROCESS_AND_MAP_TASKS.length > 0, 'Library must contain tasks');
for (const task of PROCESS_AND_MAP_TASKS) {
  assert(task.imageUrl, `Task "${task.title}" must have an imageUrl`);
  assert(
    task.imageUrl.startsWith('data:image/svg+xml') || task.imageUrl.startsWith('http'),
    `Task "${task.title}" imageUrl must be a data URI or URL`
  );
}
testsPassed++;
console.log(`  ✅ Test 8 Passed: All ${PROCESS_AND_MAP_TASKS.length} library Process/Map tasks possess guaranteed visual illustrations.`);

console.log(`\n===============================================================`);
console.log(`🎉 All ${testsPassed}/${testsPassed} tests passed cleanly in Step 32!`);
console.log(`===============================================================\n`);
