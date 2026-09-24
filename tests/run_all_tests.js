/**
 * Unified Test Runner for IELTS Web Platform
 * Executes all 7 Cambridge assessment test suites sequentially and reports summary.
 */

import { execSync } from 'child_process';
import path from 'path';

const testSuites = [
  { name: 'Step 1: Reading Scorer & Formatting', file: 'tests/test_step1_reading_scorer.js' },
  { name: 'Step 2: Speaking Algorithmic Engine', file: 'tests/test_step2_speaking_algorithmic.js' },
  { name: 'Step 3: Listening Scorer & Word Limit', file: 'tests/test_step3_listening_scorer.js' },
  { name: 'Step 4: Task 1 Map & Process Scoring', file: 'tests/test_step4_task1_map_process.js' },
  { name: 'Step 5: Full 60-Min Writing Mock Exam', file: 'tests/test_step5_full_writing_exam.js' },
  { name: 'Step 6: Reading AC vs GT & Distractor Traps', file: 'tests/test_step6_reading_gt_distractor.js' },
  { name: 'Step 7: Safe Storage & Quota Resilience', file: 'tests/test_step7_storage_resilience.js' },
  { name: 'Step 8: Spaced Repetition (SM-2) & Rewrite Scorer', file: 'tests/test_step8_srs_rewrite.js' },
  { name: 'Step 9: Task 1 Overview & Academic Hedging', file: 'tests/test_step9_overview_hedging.js' },
  { name: 'Step 10: CDI Exam Simulation & Split-Pane', file: 'tests/test_step10_cdi_simulation.js' },
  { name: 'Step 11: Diagnostic Placement & IndexedDB', file: 'tests/test_step11_placement_and_indexeddb.js' },
  { name: 'Step 12: Speech Audio Chunking & Anti-Cutoff', file: 'tests/test_speech_audio_chunking.js' },
  { name: 'Step 13: Public AI Content & Zero-Auth Resources', file: 'tests/test_step13_public_ai_content_no_auth.js' },
  { name: 'Step 14: Mastered Items & History Preservation', file: 'tests/test_step14_mastered_items_feature.js' },
  { name: 'Step 15: Cambridge Hard Band Capping Rules', file: 'tests/test_step15_cambridge_hard_capping.js' },
  { name: 'Step 16: Modal Store Pub/Sub State Engine', file: 'tests/test_step16_modal_store.js' },
  { name: 'Step 17: All-Skill Mastered (Đã Thuộc) System', file: 'tests/test_step17_all_skills_mastered.js' },
  { name: 'Step 18: Focus Mode & Keyboard Shortcuts (Phase 1)', file: 'tests/test_step18_focus_mode_shortcuts.js' },
  { name: 'Step 19: CDI Marathon & Task 1 Coverage (Phase 2)', file: 'tests/test_step19_marathon_and_task1_inspector.js' },
  { name: 'Step 20: Architecture Refactoring & Modular Components (Phase 3)', file: 'tests/test_step20_architecture_refactor.js' },
  { name: 'Step 21: UI/UX De-cluttering & CDI Exam Accessibility (Phase 4)', file: 'tests/test_step21_ui_ux_cdi_accessibility.js' },
  { name: 'Step 22: Task 2 Argument Flow & Pedagogy Depth (Phase 5)', file: 'tests/test_step22_pedagogy_argument_flow.js' },
  { name: 'Step 23: Multi-Model AI Adapter & Mobile Viewport Resilience (Phase 6)', file: 'tests/test_step23_ai_adapter_and_mobile_viewport.js' },
  { name: 'Step 24: Speaking Dual-Engine & Computer Algorithmic Scorer', file: 'tests/test_step24_speaking_dual_engine.js' },
  { name: 'Step 25: Self-Updating Feature Registry & Help Center Hub', file: 'tests/test_step25_help_registry.js' },
  { name: 'Step 26: Cambridge GRA Sentence Structure Heatmap & Analyzer', file: 'tests/test_step26_gra_sentence_analyzer.js' },
  { name: 'Step 27: Speaking Fluency Filler Words Tracker & Audio Visualizer', file: 'tests/test_step27_speaking_fluency_filler_tracker.js' }
];

console.log('===============================================================');
console.log('🧪 RUNNING ALL CAMBRIDGE ASSESSMENT TEST SUITES (100% OFFLINE)');
console.log('===============================================================\n');

let totalSuitesPassed = 0;
let totalTestsCount = 0;
const startTime = Date.now();

for (const suite of testSuites) {
  process.stdout.write(`▶ Running: ${suite.name} ... `);
  try {
    const output = execSync(`node "${suite.file}"`, { encoding: 'utf-8', stdio: 'pipe' });
    totalSuitesPassed++;
    const match = output.match(/All (\d+)\/\1/i) || output.match(/(\d+)\s*\/\s*\1/i) || output.match(/Passed:\s*(\d+)/i);
    if (match) {
      totalTestsCount += parseInt(match[1], 10);
    }
    console.log('✅ PASSED');
  } catch (err) {
    console.log('❌ FAILED');
    console.error(`\nError in ${suite.file}:\n`, err.stdout || err.message);
    process.exit(1);
  }
}

const elapsedMs = Date.now() - startTime;

console.log('\n===============================================================');
console.log(`🎉 ALL ${totalSuitesPassed}/${testSuites.length} TEST SUITES PASSED CLEANLY in ${elapsedMs}ms!`);
console.log(`💯 ${totalTestsCount} / ${totalTestsCount} TOTAL UNIT TESTS PASSING (100%)`);
console.log('===============================================================\n');
process.exit(0);
