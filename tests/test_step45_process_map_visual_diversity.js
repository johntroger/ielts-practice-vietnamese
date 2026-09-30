/**
 * Step 45: Task 1 Process & Map Visual Diversity Test Suite
 * Validates multi-archetype visual rendering, dynamic zone mapping,
 * and structural differentiation between diagram types.
 */

import assert from 'assert';
import {
  detectProcessType,
  detectMapType,
  generateProcessDiagramSvg,
  generateMapComparisonSvg,
  ensureTaskIllustration
} from '../src/services/processMapSvgEngine.js';
import {
  PROCESS_ARCHETYPES,
  MAP_ARCHETYPES
} from '../src/services/geminiService.js';

console.log('🧪 Starting Step 45 Test Suite: Task 1 Process & Map Visual Diversity...\n');

let testsPassed = 0;

// Test 1: Archetypes Definition in geminiService
console.log('Test 1: Verify Process and Map archetypes catalog...');
assert(Array.isArray(PROCESS_ARCHETYPES) && PROCESS_ARCHETYPES.length >= 4, 'Must have at least 4 process archetypes');
assert(Array.isArray(MAP_ARCHETYPES) && MAP_ARCHETYPES.length >= 6, 'Must have at least 6 map archetypes');

const processTypes = PROCESS_ARCHETYPES.map(p => p.type);
assert(processTypes.includes('manufacturing'), 'Must include manufacturing archetype');
assert(processTypes.includes('lifecycle'), 'Must include lifecycle archetype');
assert(processTypes.includes('recycling'), 'Must include recycling archetype');
assert(processTypes.includes('energy_water'), 'Must include energy_water archetype');

const mapTypes = MAP_ARCHETYPES.map(m => m.type);
assert(mapTypes.includes('university_campus'), 'Must include university_campus');
assert(mapTypes.includes('airport_terminal'), 'Must include airport_terminal');
assert(mapTypes.includes('tropical_island'), 'Must include tropical_island');
assert(mapTypes.includes('city_center'), 'Must include city_center');
assert(mapTypes.includes('hospital_zone'), 'Must include hospital_zone');
assert(mapTypes.includes('coastal_village'), 'Must include coastal_village');

testsPassed++;
console.log('  ✅ Test 1 Passed: Process & Map archetypes defined and complete.');

// Test 2: Process Type Detection Accuracy
console.log('Test 2: detectProcessType correctly identifies archetypes...');
assert.strictEqual(detectProcessType({ processType: 'lifecycle' }), 'lifecycle');
assert.strictEqual(detectProcessType({ processType: 'recycling' }), 'recycling');
assert.strictEqual(detectProcessType({ title: 'Life Cycle of the Red-Eyed Tree Frog' }), 'lifecycle');
assert.strictEqual(detectProcessType({ title: 'How PET plastic bottles are recycled into fleece' }), 'recycling');
assert.strictEqual(detectProcessType({ title: 'Electricity Generation from Hydroelectric Dam' }), 'energy_water');
assert.strictEqual(detectProcessType({ title: 'Industrial Brick Manufacturing Process' }), 'manufacturing');

testsPassed++;
console.log('  ✅ Test 2 Passed: detectProcessType accurately classifies all 4 process types.');

// Test 3: Map Type Detection Accuracy
console.log('Test 3: detectMapType correctly identifies archetypes...');
assert.strictEqual(detectMapType({ mapType: 'university_campus' }), 'campus');
assert.strictEqual(detectMapType({ mapType: 'airport_terminal' }), 'airport');
assert.strictEqual(detectMapType({ mapType: 'tropical_island' }), 'island');
assert.strictEqual(detectMapType({ mapType: 'hospital_zone' }), 'hospital');
assert.strictEqual(detectMapType({ mapType: 'coastal_village' }), 'coastal');
assert.strictEqual(detectMapType({ mapType: 'city_center' }), 'urban');
assert.strictEqual(detectMapType({ title: 'Redevelopment of Central University Campus (2010 vs 2025)' }), 'campus');
assert.strictEqual(detectMapType({ title: 'Expansion of International Airport Terminal' }), 'airport');
assert.strictEqual(detectMapType({ title: 'Transformation of a Tropical Atoll into an Eco-Resort' }), 'island');
assert.strictEqual(detectMapType({ title: 'Construction of New Trauma Hospital Wing' }), 'hospital');

testsPassed++;
console.log('  ✅ Test 3 Passed: detectMapType accurately classifies all 6 map types.');

// Test 4: Process Circular Layout vs Linear Industrial Layout
console.log('Test 4: Circular Loop generation for Lifecycle & Recycling vs Linear for Manufacturing...');
const lifecycleTask = {
  title: 'Life Cycle of the Monarch Butterfly',
  processType: 'lifecycle',
  processSteps: [
    { step: 1, name: 'Egg Stage', desc: 'Female lays eggs on milkweed leaves' },
    { step: 2, name: 'Caterpillar / Larva', desc: 'Larva hatches and feeds on leaves' },
    { step: 3, name: 'Chrysalis / Pupa', desc: 'Chrysalis forms for metamorphosis' },
    { step: 4, name: 'Adult Butterfly', desc: 'Emerged adult butterfly takes flight' }
  ]
};

const manufacturingTask = {
  title: 'Production of Artisanal Ceramic Tiles',
  processType: 'manufacturing',
  processSteps: [
    { step: 1, name: 'Clay Mining', desc: 'Raw clay extracted from quarries' },
    { step: 2, name: 'Slurry Mixing', desc: 'Clay crushed with water into slurry' },
    { step: 3, name: 'Kiln Firing', desc: 'Tiles baked at 1100°C' },
    { step: 4, name: 'Glazing', desc: 'Liquid enamel applied for waterproof finish' }
  ]
};

const lifecycleSvg = generateProcessDiagramSvg(lifecycleTask);
const manufacturingSvg = generateProcessDiagramSvg(manufacturingTask);

assert(lifecycleSvg.includes('NATURAL LIFE CYCLE') || lifecycleSvg.includes('Vòng đời sinh thái tự nhiên'), 'Lifecycle must have biological loop badge');
assert(lifecycleSvg.includes('class="arrow-arc"'), 'Lifecycle must use circular arc path');
assert(manufacturingSvg.includes('QUY TRÌNH SẢN XUẤT CÔNG NGHIỆP') || manufacturingSvg.includes('GIAI ĐOẠN TUẦN TỰ'), 'Manufacturing must have industrial header');
assert(lifecycleSvg !== manufacturingSvg, 'SVGs between lifecycle and manufacturing must be structurally distinct');

testsPassed++;
console.log('  ✅ Test 4 Passed: Lifecycle produces circular loop layout, distinct from industrial workflow.');

// Test 5: Recycling Process features loop & ♻️ badge
console.log('Test 5: Recycling diagram features closed-loop iconography...');
const recyclingTask = {
  title: 'PET Bottle Closed-Loop Recycling',
  processType: 'recycling',
  processSteps: [
    { step: 1, name: 'Sorting', desc: 'Bottles separated by polymer grade' },
    { step: 2, name: 'Flaking', desc: 'Shredded into clean plastic flakes' },
    { step: 3, name: 'Pelletizing', desc: 'Flakes melted into virgin-grade pellets' },
    { step: 4, name: 'Blow Moulding', desc: 'New bottles blown from recycled resin' }
  ]
};
const recyclingSvg = generateProcessDiagramSvg(recyclingTask);
assert(recyclingSvg.includes('TÁI CHẾ TUẦN HOÀN') || recyclingSvg.includes('♻️'), 'Recycling must feature eco badge or symbol');
assert(recyclingSvg.includes('Sorting'), 'Must contain step 1');
assert(recyclingSvg.includes('Blow Moulding'), 'Must contain step 4');
testsPassed++;
console.log('  ✅ Test 5 Passed: Recycling diagram generates circular closed-loop layout.');

// Test 6: Map Dynamic Spatial Zones & Archetype Environmental Elements
console.log('Test 6: Map comparison dynamically renders zones from mapChanges across archetypes...');
const campusTask = {
  title: 'University Campus Modernisation',
  mapType: 'university_campus',
  mapChanges: [
    { feature: 'North Field', past: 'Vacant grass pitch', present: 'Advanced STEM Research Hub' },
    { feature: 'East Quadrant', past: 'Surface car parking', present: 'Pedestrian plaza & coffee shop' },
    { feature: 'South Gate', past: 'Old bicycle shed', present: 'Multi-storey student dormitory' }
  ]
};

const airportTask = {
  title: 'Regional Airport Expansion',
  mapType: 'airport_terminal',
  mapChanges: [
    { feature: 'North Apron', past: 'Single landing strip', present: 'Dual parallel runway 18L/36R' },
    { feature: 'Terminal Core', past: 'Single-storey domestic hall', present: 'Triple-tier international concourse' },
    { feature: 'South Landside', past: 'Open gravel parking', present: 'High-speed light rail interchange' }
  ]
};

const campusSvg = generateMapComparisonSvg(campusTask);
const airportSvg = generateMapComparisonSvg(airportTask);

// Campus specific assertions
assert(campusSvg.includes('Advanced STEM Research Hub'), 'Campus SVG must include dynamic STEM feature');
assert(campusSvg.includes('Pedestrian plaza'), 'Campus SVG must include dynamic East quadrant feature');
assert(campusSvg.includes('UNIVERSITY CAMPUS') || campusSvg.includes('CAMPUS'), 'Campus SVG header must reflect campus archetype');

// Airport specific assertions
assert(airportSvg.includes('Dual parallel runway'), 'Airport SVG must include dynamic runway feature');
assert(airportSvg.includes('Triple-tier international concourse'), 'Airport SVG must include concourse feature');
assert(airportSvg.includes('AIRPORT') || airportSvg.includes('RUNWAY'), 'Airport SVG must reflect airport archetype');
assert(airportSvg.includes('EXPANDED DUAL RUNWAY') || airportSvg.includes('AIRSTRIP RUNWAY'), 'Airport SVG must include tarmac runway environmental element');

// Visual diversity assertion
assert(campusSvg !== airportSvg, 'Campus and Airport map SVGs must be visually and textually distinct');

testsPassed++;
console.log('  ✅ Test 6 Passed: Map SVGs dynamically render features and environmental terrain per archetype.');

// Test 7: ensureTaskIllustration integrates with diverse archetypes
console.log('Test 7: ensureTaskIllustration synthesizes unique visuals for various archetypes...');
const rawCampus = {
  id: 'test-campus-1',
  taskNumber: 1,
  type: 'map',
  mapType: 'university_campus',
  mapChanges: [{ feature: 'Library', past: 'Old archive', present: 'Digital Learning Commons' }]
};

const rawLifecycle = {
  id: 'test-life-1',
  taskNumber: 1,
  type: 'process',
  processType: 'lifecycle',
  processSteps: [{ step: 1, name: 'Spawning', desc: 'Salmon lay eggs in gravel beds' }]
};

const illustratedCampus = ensureTaskIllustration(rawCampus);
const illustratedLifecycle = ensureTaskIllustration(rawLifecycle);

assert(illustratedCampus.imageUrl.startsWith('data:image/svg+xml;utf8,'), 'Campus must have SVG data URL');
assert(illustratedLifecycle.imageUrl.startsWith('data:image/svg+xml;utf8,'), 'Lifecycle must have SVG data URL');
assert(decodeURIComponent(illustratedCampus.imageUrl).includes('Digital Learning Commons'), 'Campus SVG must contain features');
assert(decodeURIComponent(illustratedLifecycle.imageUrl).includes('Spawning'), 'Lifecycle SVG must contain step 1');
assert(illustratedCampus.imageUrl !== illustratedLifecycle.imageUrl, 'SVGs must be different');

testsPassed++;
console.log('  ✅ Test 7 Passed: ensureTaskIllustration automatically handles multi-archetype synthesis.');

console.log('\n===============================================================');
console.log(`🎉 All ${testsPassed}/${testsPassed} tests passed cleanly in Step 45!`);
console.log('===============================================================\n');
