/**
 * Comprehensive Test Suite for Step 4: Writing Task 1 Map & Process Scoring
 * Validates:
 * 1. detectTask1Subtype accuracy (map, process, chart_graph)
 * 2. MAP_SPATIAL_PATTERNS & analyzeTask1MapFeatures
 * 3. PROCESS_SEQUENTIAL_PATTERNS & analyzeTask1ProcessFeatures
 * 4. Zero-penalty evaluation on high-scoring Map & Process model essays
 * 5. Cambridge-standard hard caps & actionable feedback on flawed Map/Process essays
 * 6. Regression check on traditional Chart/Graph essays
 */

import {
  detectTask1Subtype,
  MAP_SPATIAL_PATTERNS,
  PROCESS_SEQUENTIAL_PATTERNS,
  analyzeTask1MapFeatures,
  analyzeTask1ProcessFeatures,
  evaluateEssayAlgorithmically
} from '../src/services/algorithmicEvaluationService.js';
import { PROCESS_AND_MAP_TASKS } from '../src/data/processAndMapTasks.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('=== TEST SUITE: STEP 4 TASK 1 MAP & PROCESS ALGORITHMIC SCORING ===\n');

// -------------------------------------------------------------
// 1. SUBTYPE DETECTION
// -------------------------------------------------------------
console.log('--- 1. Subtype Detection Engine ---');
const cementTask = PROCESS_AND_MAP_TASKS[0]; // Process
const seasideMapTask = PROCESS_AND_MAP_TASKS[1]; // Map

assert(detectTask1Subtype(cementTask) === 'process', 'Detects type: "process" from explicit task object');
assert(detectTask1Subtype(seasideMapTask) === 'map', 'Detects type: "map" from explicit task object');

const mapByPrompt = { taskNumber: 1, prompt: 'The two maps below illustrate the urban changes that took place in Porton between 1995 and 2025.' };
assert(detectTask1Subtype(mapByPrompt) === 'map', 'Detects "map" from prompt text without explicit type');

const processByPrompt = { taskNumber: 1, prompt: 'The diagram below shows the stages involved in the production of olive oil.' };
assert(detectTask1Subtype(processByPrompt) === 'process', 'Detects "process" from prompt keywords (stages, diagram, production)');

const chartTask = { taskNumber: 1, prompt: 'The line graph below compares the percentage of car ownership in three European countries from 2000 to 2020.' };
assert(detectTask1Subtype(chartTask) === 'chart_graph', 'Detects "chart_graph" for traditional statistical charts');

const mapByEssay = { taskNumber: 1 };
const mapEssaySample = 'To the north of the town, agricultural land was demolished and converted into a residential complex. Meanwhile, the southern harbor was relocated to the eastern quadrant adjacent to the marina.';
assert(detectTask1Subtype(mapByEssay, mapEssaySample) === 'map', 'Falls back to essay vocabulary for map detection');

const processByEssay = { taskNumber: 1 };
const processEssaySample = 'In the initial stage, raw clay is crushed into fine powder. Subsequently, it is heated inside a kiln before being filtered and packaged for distribution.';
assert(detectTask1Subtype(processByEssay, processEssaySample) === 'process', 'Falls back to essay vocabulary for process detection');

// -------------------------------------------------------------
// 2. MAP PATTERNS & ANALYZER
// -------------------------------------------------------------
console.log('\n--- 2. Map Features Analyzer (Spatial, Compass, Transformation) ---');
const mapParagraphs = [
  'The two maps illustrate the extensive urban transformation experienced by Porton between 1995 and 2025.',
  'Overall, the village underwent a complete modernization, evolving from an agrarian settlement into a commercial hub.',
  'In 1995, the northwestern quadrant was dominated by agricultural farmland. By 2025, this green space had been entirely eradicated to accommodate a residential complex. Concurrently, the central thoroughfare was widened into a dual carriageway.',
  'Turning to the coastal perimeter, the traditional fishing dock in the south was dismantled to make way for a contemporary marina. Additionally, untouched marshland along the eastern shoreline was developed into a multi-story hotel resort, adjacent to a paved promenade.'
];

const mapAnalysis = analyzeTask1MapFeatures(mapParagraphs, 1);
assert(mapAnalysis.cardinalCount >= 3, `Extracts cardinal directions (found: ${mapAnalysis.cardinalCount})`);
assert(mapAnalysis.transformationCount >= 4, `Extracts transformation verbs (found: ${mapAnalysis.transformationCount})`);
assert(mapAnalysis.prepositionCount >= 1, `Extracts spatial prepositions (found: ${mapAnalysis.prepositionCount})`);
assert(mapAnalysis.categories.demolition.length >= 2, `Identifies demolition vocabulary (${mapAnalysis.categories.demolition.join(', ')})`);
assert(mapAnalysis.categories.replacement.length >= 1, `Identifies replacement vocabulary (${mapAnalysis.categories.replacement.join(', ')})`);

// -------------------------------------------------------------
// 3. PROCESS PATTERNS & ANALYZER
// -------------------------------------------------------------
console.log('\n--- 3. Process Features Analyzer (Sequential, Passive Voice) ---');
const processParagraphs = [
  'The diagrams delineate the multi-stage procedure by which cement is industrially manufactured.',
  'Overall, the creation of cement is a linear process encompassing four primary phases, beginning with pulverisation and culminating in packaging.',
  'In the initial stage, raw limestone and clay are crushed into fine powder. This blended material then passes through a mixer before entering a rotating kiln. Within this chamber, the compound is heated at high temperature.',
  'Subsequently, the resultant clinker is cooled and fed into a grinder, where it is pulverised into cement. Finally, the finished commodity is packaged into bags and transported to commercial clients.'
];

const processAnalysis = analyzeTask1ProcessFeatures(processParagraphs, 1);
assert(processAnalysis.totalSequentialCount >= 4, `Extracts stage sequence linkers (found: ${processAnalysis.totalSequentialCount})`);
assert(processAnalysis.passiveVoiceCount >= 4, `Extracts operational passive verbs (found: ${processAnalysis.passiveVoiceCount})`);
assert(processAnalysis.hasInitialStage === true, 'Identifies initial stage marker (In the initial stage)');
assert(processAnalysis.hasConcludingStage === true, 'Identifies concluding stage marker (Finally)');

// -------------------------------------------------------------
// 4. FULL EVALUATION ON HIGH-SCORING MODEL ESSAYS
// -------------------------------------------------------------
console.log('\n--- 4. Full Evaluation on Cambridge Band 8+ Model Answers ---');
const mapEval = evaluateEssayAlgorithmically({
  task: seasideMapTask,
  essayText: seasideMapTask.modelAnswer
});

assert(mapEval.task1Subtype === 'map', 'Task 1 subtype identified as "map"');
assert(mapEval.task1MapStats !== null, 'task1MapStats is properly returned');
assert(mapEval.task1ComparisonStats === null, 'task1ComparisonStats is omitted for maps');
assert(mapEval.criteria.tr.band >= 7.5, `Map model answer achieves high TR band (Band ${mapEval.criteria.tr.band})`);
assert(!mapEval.criteria.tr.improvements.some(imp => imp.includes('thiếu số liệu hoặc dẫn chứng cụ thể')), 'Map model essay is NOT penalized for lack of statistical data points');
assert(!mapEval.criteria.tr.improvements.some(imp => imp.includes('BẪY LIỆT KÊ SỐ LIỆU CƠ HỌC')), 'Map model essay is NOT penalized for mechanical data listing');
assert(mapEval.overallBand >= 7.5, `Map model answer achieves Overall Band >= 7.5 (Got Band ${mapEval.overallBand})`);

const processEval = evaluateEssayAlgorithmically({
  task: cementTask,
  essayText: cementTask.modelAnswer
});

assert(processEval.task1Subtype === 'process', 'Task 1 subtype identified as "process"');
assert(processEval.task1ProcessStats !== null, 'task1ProcessStats is properly returned');
assert(processEval.task1ComparisonStats === null, 'task1ComparisonStats is omitted for processes');
assert(processEval.criteria.tr.band >= 7.5, `Process model answer achieves high TR band (Band ${processEval.criteria.tr.band})`);
assert(!processEval.criteria.tr.improvements.some(imp => imp.includes('thiếu số liệu hoặc dẫn chứng cụ thể')), 'Process model essay is NOT penalized for lack of statistical data points');
assert(!processEval.criteria.tr.improvements.some(imp => imp.includes('BẪY LIỆT KÊ SỐ LIỆU CƠ HỌC')), 'Process model essay is NOT penalized for mechanical data listing');
assert(processEval.overallBand >= 7.5, `Process model answer achieves Overall Band >= 7.5 (Got Band ${processEval.overallBand})`);

// -------------------------------------------------------------
// 5. HARD CAPS & EXAMINER DIAGNOSTICS FOR FLAWED ESSAYS
// -------------------------------------------------------------
console.log('\n--- 5. Flawed Map & Process Hard Caps ---');

// Map with missing overview
const mapNoOverview = `The two maps illustrate the urban changes in the seaside town of Porton between 1995 and 2025.
In 1995, the northern part had agricultural farmland and forestry. By 2025, houses were constructed and access roads were built to accommodate new residents.
In the southern area, the old fishing dock was demolished and a new marina was built. On the eastern shore, a large hotel was erected next to the beach.`;

const evalMapNoOverview = evaluateEssayAlgorithmically({ task: seasideMapTask, essayText: mapNoOverview });
assert(evalMapNoOverview.criteria.tr.band <= 5.0, `Map without Overview is hard capped at TR Band 5.0 (Got ${evalMapNoOverview.criteria.tr.band})`);
assert(evalMapNoOverview.criteria.tr.improvements.some(imp => imp.includes('thiếu đoạn Tổng quan (Overview)')), 'Includes missing Overview warning');

// Map with zero spatial directions / compass
const mapNoDirections = `The two maps illustrate the urban changes in Porton between 1995 and 2025.
Overall, the town experienced widespread redevelopment, transforming from a rural area to a tourist center.
The farmland was eradicated and replaced by a residential complex. A new dual carriageway was widened for cars.
The dock was demolished to make way for a marina. A hotel was erected along with a promenade for visitors.`;

const evalMapNoDirections = evaluateEssayAlgorithmically({ task: seasideMapTask, essayText: mapNoDirections });
assert(evalMapNoDirections.criteria.tr.improvements.some(imp => imp.includes('QUAN TRỌNG (Dạng bài Map): Thân bài hoàn toàn thiếu phương hướng la bàn')), 'Flags missing cardinal directions in Map essay');

// Map with zero transformation verbs
const mapNoTransforms = `The two maps illustrate the urban changes in Porton between 1995 and 2025.
Overall, the town experienced significant changes over the period.
In the north, there are houses and roads. Near the center, there is a large retail street with shops.
In the south, there is a marina with boats. On the east side, there is a large hotel and a walkway near the ocean.`;

const evalMapNoTransforms = evaluateEssayAlgorithmically({ task: seasideMapTask, essayText: mapNoTransforms });
assert(evalMapNoTransforms.criteria.tr.improvements.some(imp => imp.includes('QUAN TRỌNG (Dạng bài Map): Thân bài hoàn toàn thiếu các động từ biến đổi hạ tầng')), 'Flags missing transformation verbs in Map essay');

// Process with missing sequence linkers
const processNoSequencers = `The diagram shows the manufacturing of cement.
Overall, the process consists of four stages from raw material to finished product.
Limestone and clay are crushed into powder. The mixture enters a mixer. It is heated in a kiln.
The clinker is cooled. It is fed into a grinder. Cement is packaged into bags.`;

const evalProcessNoSeq = evaluateEssayAlgorithmically({ task: cementTask, essayText: processNoSequencers });
assert(evalProcessNoSeq.criteria.tr.improvements.some(imp => imp.includes('QUAN TRỌNG (Dạng bài Process): Thân bài hoàn toàn thiếu các liên từ chỉ thứ tự các bước')), 'Flags missing sequence linkers in Process essay');

// Process with active voice instead of passive voice
const processActiveVoice = `The diagram shows the manufacturing of cement.
Overall, the process consists of several stages from raw material to finished product.
Initially, the machine crushes limestone and clay into powder. Subsequently, workers mix the materials before they put the mixture into a rotating kiln. Workers heat the kiln at high temperature.
Finally, workers cool the clinker. The grinder grinds the clinker into fine cement and trucks deliver the bags to shops.`;

const evalProcessActive = evaluateEssayAlgorithmically({ task: cementTask, essayText: processActiveVoice });
assert(evalProcessActive.criteria.tr.improvements.some(imp => imp.includes('CẦN TĂNG CƯỜNG THỂ BỊ ĐỘNG') || imp.includes('QUAN TRỌNG (Dạng bài Process): Thân bài hoàn toàn thiếu cấu trúc thể bị động')), 'Flags lack of passive voice in Process essay');

// -------------------------------------------------------------
// 6. REGRESSION CHECK: TRADITIONAL STATISTICAL CHART
// -------------------------------------------------------------
console.log('\n--- 6. Regression Check on Traditional Chart/Graph Essays ---');
const chartPrompt = 'The bar chart below shows the divorce rates in two European countries from 2011 to 2015.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.';
const chartTaskObj = {
  id: 't1-chart-divorce',
  taskNumber: 1,
  type: 'chart',
  title: 'Divorce Rates in Finland and Sweden (2011-2015)',
  prompt: chartPrompt
};

const chartEssayWithoutComparisons = `The bar chart illustrates the divorce rates in Finland and Sweden over a five-year period from 2011 to 2015.

Overall, Sweden experienced a downward trend in divorce rates, whereas Finland witnessed an upward trajectory over the surveyed timeframe.

In 2011, the divorce rate in Sweden was 45%. In 2012, this figure was 47%. In 2013, the rate stood at 43%. In 2014, it was 41%, and in 2015, it was 38%.

In Finland, the divorce rate was 36% in 2011. In 2012, it was 33%. In 2013, it was 39%. In 2014, it reached 42%, and in 2015, it was 41%.`;

const chartEval = evaluateEssayAlgorithmically({ task: chartTaskObj, essayText: chartEssayWithoutComparisons });
assert(chartEval.task1Subtype === 'chart_graph', 'Traditional chart identified as "chart_graph"');
assert(chartEval.task1ComparisonStats !== null, 'task1ComparisonStats populated for chart');
assert(chartEval.task1ComparisonStats.isMechanicalListing === true, 'Mechanical listing trap correctly detected on chart lacking comparisons');
assert(chartEval.criteria.tr.improvements.some(imp => imp.includes('BẪY LIỆT KÊ SỐ LIỆU CƠ HỌC')), 'Mechanical data listing penalty still enforced for chart');

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log(`\n=================================================`);
console.log(`STEP 4 TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
console.log(`=================================================`);

if (passedTests === totalTests) {
  console.log('✓ ALL STEP 4 TESTS PASSED CLEANLY!');
  process.exit(0);
} else {
  console.error('✗ SOME TESTS FAILED!');
  process.exit(1);
}
