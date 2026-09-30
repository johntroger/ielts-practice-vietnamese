/**
 * Step 46: Google Banana (Gemini Image) Generation Test Suite
 * Validates prompt builders, API response handling, and integration
 * with Task 1 Process & Map generation.
 */

import assert from 'assert';
import {
  buildGoogleBananaMapPrompt,
  buildGoogleBananaProcessPrompt,
  generateGoogleBananaImage
} from '../src/services/geminiService.js';
import { ensureTaskIllustration } from '../src/services/processMapSvgEngine.js';

console.log('🧪 Starting Step 46 Test Suite: Google Banana AI Image Generation...\n');

let testsPassed = 0;

// Test 1: Google Banana Map Prompt Builder
console.log('Test 1: buildGoogleBananaMapPrompt formats authentic IELTS Dual Map requirements...');
const sampleMapTask = {
  title: 'Redevelopment of Central Harbour (2000 vs 2025)',
  mapChanges: [
    { feature: 'North Pier', past: 'Old wooden fishing dock', present: 'Modern yacht marina & promenade' },
    { feature: 'East Warehouses', past: 'Derelict brick buildings', present: 'Luxury seaside resort & spa' }
  ]
};

const mapPrompt = buildGoogleBananaMapPrompt(sampleMapTask);
assert(typeof mapPrompt === 'string', 'Must produce a string prompt');
assert(mapPrompt.includes('Cambridge IELTS'), 'Must specify Cambridge IELTS style');
assert(mapPrompt.includes('DUAL-MAP') || mapPrompt.includes('EXACTLY TWO maps'), 'Must require dual map layout');
assert(mapPrompt.includes('North Pier'), 'Must include custom feature 1');
assert(mapPrompt.includes('East Warehouses'), 'Must include custom feature 2');
assert(mapPrompt.includes('Modern yacht marina'), 'Must include present state description');
assert(mapPrompt.includes('Compass Rose'), 'Must instruct to include compass rose');

testsPassed++;
console.log('  ✅ Test 1 Passed: buildGoogleBananaMapPrompt formats complete dual-map guidelines.');

// Test 2: Google Banana Process Prompt Builder
console.log('Test 2: buildGoogleBananaProcessPrompt formats sequential technical flowchart requirements...');
const sampleProcessTask = {
  title: 'Manufacturing of Artisanal Olive Oil',
  processSteps: [
    { step: 1, name: 'Harvesting', desc: 'Olives gathered from orchard trees' },
    { step: 2, name: 'Cold Pressing', desc: 'Fruit crushed under hydraulic press' },
    { step: 3, name: 'Centrifugation', desc: 'Oil separated from water and solids' }
  ]
};

const processPrompt = buildGoogleBananaProcessPrompt(sampleProcessTask);
assert(typeof processPrompt === 'string', 'Must produce a string prompt');
assert(processPrompt.includes('Cambridge IELTS'), 'Must specify Cambridge IELTS style');
assert(processPrompt.includes('Sequential stages') || processPrompt.includes('Flowchart'), 'Must require sequential flow');
assert(processPrompt.includes('Harvesting'), 'Must include stage 1 name');
assert(processPrompt.includes('Cold Pressing'), 'Must include stage 2 name');
assert(processPrompt.includes('Centrifugation'), 'Must include stage 3 name');
assert(processPrompt.includes('hydraulic press'), 'Must include apparatus details');

testsPassed++;
console.log('  ✅ Test 2 Passed: buildGoogleBananaProcessPrompt formats complete process flowchart guidelines.');

// Test 3: Safe handling of empty or missing parameters
console.log('Test 3: generateGoogleBananaImage safely handles null/empty input...');
const emptyResult1 = await generateGoogleBananaImage({});
const emptyResult2 = await generateGoogleBananaImage({ prompt: 'test', apiKey: '' });
const emptyResult3 = await generateGoogleBananaImage({ prompt: '', apiKey: 'key-123' });

assert.strictEqual(emptyResult1, null, 'Must return null when missing parameters');
assert.strictEqual(emptyResult2, null, 'Must return null when apiKey is empty');
assert.strictEqual(emptyResult3, null, 'Must return null when prompt is empty');

testsPassed++;
console.log('  ✅ Test 3 Passed: Safe null return on missing apiKey or prompt.');

// Test 4: ensureTaskIllustration preserves Google Banana base64 image URL
console.log('Test 4: ensureTaskIllustration preserves Google Banana generated image...');
const fakeBananaImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

const taskWithBananaImage = {
  id: 'banana-task-1',
  taskNumber: 1,
  type: 'map',
  title: 'Island Transformation',
  imageUrl: fakeBananaImage,
  imageSource: 'google_banana'
};

const preservedTask = ensureTaskIllustration(taskWithBananaImage);
assert.strictEqual(preservedTask.imageUrl, fakeBananaImage, 'Must preserve existing Google Banana image');
assert.strictEqual(preservedTask.imageSource, 'google_banana', 'Must preserve image source metadata');

testsPassed++;
console.log('  ✅ Test 4 Passed: ensureTaskIllustration preserves Google Banana image without overwriting.');

// Test 5: Fallback safety when no imageUrl is provided
console.log('Test 5: Fallback safety triggers vector engine if Banana image unavailable...');
const taskWithoutImage = {
  id: 'fallback-task-1',
  taskNumber: 1,
  type: 'process',
  title: 'Water Desalination Flow',
  processSteps: [{ step: 1, name: 'Intake', desc: 'Seawater drawn from ocean' }]
};

const fallbackResult = ensureTaskIllustration(taskWithoutImage);
assert(fallbackResult.imageUrl, 'Must generate fallback illustration');
assert(fallbackResult.imageUrl.startsWith('data:image/svg+xml;utf8,'), 'Fallback must produce SVG data URL');
assert(decodeURIComponent(fallbackResult.imageUrl).includes('Seawater drawn'), 'Fallback must contain step content');

testsPassed++;
console.log('  ✅ Test 5 Passed: Graceful fallback to vector engine ensures zero broken images.');

console.log('\n===============================================================');
console.log(`🎉 All ${testsPassed}/${testsPassed} tests passed cleanly in Step 46!`);
console.log('===============================================================\n');
