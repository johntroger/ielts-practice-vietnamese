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
  { name: 'Step 27: Speaking Fluency Filler Words Tracker & Audio Visualizer', file: 'tests/test_step27_speaking_fluency_filler_tracker.js' },
  { name: 'Step 28: Daily Error Prescription & Spaced Repetition Loop', file: 'tests/test_step28_daily_error_prescription.js' },
  { name: 'Step 29: Rating & Popularity Service with Smart Filter & Sort Engine', file: 'tests/test_step29_rating_popularity_service.js' },
  { name: 'Step 30: Task Library Smart Filter Bar & Interactive Rating', file: 'tests/test_step30_task_library_smart_filters.js' },
  { name: 'Step 31: Smart Filters & Rating across Micro-Drills & Vocab/Grammar', file: 'tests/test_step31_smart_filters_drills_and_vocab.js' },
  { name: 'Step 32: Task 1 Process & Map Mandatory Vector Illustrations Engine', file: 'tests/test_step32_process_map_illustrations.js' },
  { name: 'Step 33: Real-Time Synchronization for Deleting Added Questions and Tasks', file: 'tests/test_step33_realtime_delete_tasks_and_questions.js' },
  { name: 'Step 34: Responsive Navigation Audit & Mobile UX Verification', file: 'tests/test_step34_navbar_responsive_audit.js' },
  { name: 'Step 35: Comprehensive Mobile UI/UX Audit & Verification', file: 'tests/test_step35_mobile_ui_comprehensive_audit.js' },
  { name: 'Step 36: Distraction-Free Zen Typing Mode & Mobile Bottom Sheets', file: 'tests/test_step36_zen_mode_and_bottom_sheets.js' },
  { name: 'Step 37: Adaptive Feedback (ZPD) & Habit Pre-Submission Checks', file: 'tests/test_step37_adaptive_feedback_and_habit_check.js' },
  { name: 'Step 38: Clean Architecture Custom Hooks & Unified AppStore', file: 'tests/test_step38_clean_architecture_hooks_and_store.js' },
  { name: 'Step 39: Official Cambridge TRF Simulator & PDF Export', file: 'tests/test_step39_trf_simulator_export.js' },
  { name: 'Step 40: Interactive Speaking Examiner Flow & Adaptive Branching', file: 'tests/test_step40_speaking_examiner_flow.js' },
  { name: 'Step 41: Growth Analytics & Target Band Prediction Engine', file: 'tests/test_step41_growth_analytics_predictor.js' },
  { name: 'Step 42: Speaking Client-Side Audio & STT Accuracy Engine', file: 'tests/test_step42_speaking_audio_stt_accuracy.js' },
  { name: 'Step 43: AI Prompt Diversity, Sub-Angle Matrices & Anti-Duplication System', file: 'tests/test_step43_ai_prompt_diversity_and_deduplication.js' },
  { name: 'Step 44: AI Content Deduplication & Automated Cleanup Engine', file: 'tests/test_step44_ai_content_deduplication_and_autoclean.js' },
  { name: 'Step 45: Task 1 Process & Map Visual Diversity Engine', file: 'tests/test_step45_process_map_visual_diversity.js' },
  { name: 'Step 46: Google Banana AI Image Generation Engine', file: 'tests/test_step46_google_banana_image_generation.js' },
  { name: 'Step 47: Interactive Image Viewer & Zoom In / Zoom Out Controls', file: 'tests/test_step47_image_zoom_modal.js' },
  { name: 'Step 48: Tablet Viewport Audit & Menu Display Verification', file: 'tests/test_step48_tablet_viewport_audit.js' },
  { name: 'Step 49: Speaking Fluency & Reflex Micro-Drills Studio', file: 'tests/test_step49_speaking_micro_drills.js' },
  { name: 'Step 50: Speaking Ready Action Box Responsive Overflow Fix', file: 'tests/test_step50_speaking_action_box_overflow.js' },
  { name: 'Step 51: Manual Task Generator & Fast Source Filtering', file: 'tests/test_step51_manual_task_generator_and_filtering.js' },
  { name: 'Step 52: Owner Media Permission Guard & Quota Restriction', file: 'tests/test_step52_owner_media_permission_guard.js' },
  { name: 'Step 53: Authentic Cambridge Test Bank & Dedicated Badging Across All 4 Skills', file: 'tests/test_step53_cambridge_test_bank_and_badging.js' },
  { name: 'Step 54: Website QR Code Modal & Navbar Quick Access', file: 'tests/test_step54_website_qr_code_modal.js' },
  { name: 'Step 55: Mobile & Tablet Popup UI/UX Audit & Skill-Aware Library Routing', file: 'tests/test_step55_mobile_tablet_popup_audit.js' },
  { name: 'Step 56: Top Navbar Direct Contact & Feedback Button', file: 'tests/test_step56_navbar_contact_button.js' },
  { name: 'Step 57: GitBook Documentation & Auto-Sync Integration', file: 'tests/test_step57_gitbook_docs_integration.js' },
  { name: 'Step 58: Two-Tier High Capacity Storage (IndexedDB Archive & LocalStorage Index)', file: 'tests/test_step58_two_tier_indexeddb_storage.js' },
  { name: 'Step 59: Automated Features Documentation & GitBook Sync Engine', file: 'tests/test_step59_automated_features_docs_sync.js' },
  { name: 'Step 60: Minimal Focus View & Cognitive Decluttering (Phase 3.1)', file: 'tests/test_step60_minimal_focus_view.js' },
  { name: 'Step 61: Speaking Mock Room ReferenceError Fix (Phase 1)', file: 'tests/test_step61_speaking_mock_error_fix.js' },
  { name: 'Step 62: Authentic English Exam Questions & Practice Prompts (Phase 2)', file: 'tests/test_step62_english_exam_questions_standardization.js' },
  { name: 'Step 63: Modal Layout Overflow & Top Cut-Off UI Fix (Phase 3)', file: 'tests/test_step63_modal_overflow_ui_fix.js' },
  { name: 'Step 64: Listening Header Overlap Fix & Non-obstructive Scratchpad UX (Phase 4)', file: 'tests/test_step64_listening_header_and_scratchpad_ux.js' },
  { name: 'Step 65: Soundcheck Audio Gain Balance (Phase 5)', file: 'tests/test_step65_soundcheck_audio_gain_balance.js' },
  { name: 'Step 66: Full Notion Bugfix Regression & Integration (Phase 6)', file: 'tests/test_step66_full_notion_bugfix_regression.js' },
  { name: 'Step 67: Workspace Expansion & Header Toggle (Alt+Z)', file: 'tests/test_step67_workspace_expansion_header_toggle.js' },
  { name: 'Step 68: Grammar & Vocabulary Documentation Integrity', file: 'tests/test_step68_grammar_vocab_docs.js' },
  { name: 'Step 69: Micro-Drills & Vocab/Grammar Workspace Expansion', file: 'tests/test_step69_micro_drills_and_vocab_expansion.js' },
  { name: 'Step 70: Header Decluttering & Hierarchy Upgrade', file: 'tests/test_step70_header_decluttering_and_optimization.js' },
  { name: 'Step 71: Academic Typography & Visual Tokens', file: 'tests/test_step71_typography_and_visual_tokens.js' },
  { name: 'Step 72: Slide-Over Utility Panel (Vocab, Paraphrase & Mistakes)', file: 'tests/test_step72_slide_over_utility_panel.js' },
  { name: 'Step 73: Skimmable Actionable Feedback & 3-Second Action Plan', file: 'tests/test_step73_skimmable_actionable_feedback.js' },
  { name: 'Step 74: AI Domain Adapters Modularization & Facade', file: 'tests/test_step74_ai_domain_adapters_modularization.js' },
  { name: 'Step 75: Micro-Drills Sub-Rooms Architecture Modularization', file: 'tests/test_step75_micro_drills_modularization.js' },
  { name: 'Step 76: Repository Pattern & App.jsx Data Access Streamlining', file: 'tests/test_step76_repository_pattern_and_app_streamlining.js' },
  { name: 'Step 77: Dynamic Data Chunking & On-Demand Cambridge Bank Architecture', file: 'tests/test_step77_dynamic_data_chunking.js' },
  { name: 'Step 78: Standardized Testing & DOM Simulation Mock Engine Architecture', file: 'tests/test_step78_testing_mock_engine_and_dom_simulation.js' },
  { name: 'Step 79: Spelling Demons & Natural Fillers Academic Integrity', file: 'tests/test_step79_demons_and_fillers.js' },
  { name: 'Step 80: Spelling & Units & Speaking Descriptors Academic Integrity', file: 'tests/test_step80_spelling_units_and_speaking_criteria.js' },
  { name: 'Step 81: Writing Task 1 Model Essays & Assessment Integrity', file: 'tests/test_step81_task1_model_essays.js' },
  { name: 'Step 82: Writing Task 2 Model Essays & Assessment Integrity', file: 'tests/test_step82_task2_model_essays.js' },
  { name: 'Step 83: Mobile Drawer Portal & Viewport Escape Verification', file: 'tests/test_step83_mobile_drawer_portal_containment.js' },
  { name: 'Step 84: Reading Micro-Drills & Listening Audioscript Distractors Integrity', file: 'tests/test_step84_micro_drills_and_audioscripts.js' },
  { name: 'Step 85: Smart Daily Recommendation Engine & UI Integration', file: 'tests/test_step85_smart_daily_recommendation.js' },
  { name: 'Step 86: Academic Error Log & Paraphrase Journal Template Integrity', file: 'tests/test_step86_error_log_and_paraphrase_template.js' },
  { name: 'Step 87: Comprehensive Dark Mode Theme System', file: 'tests/test_step87_dark_mode_theme_system.js' },
  { name: 'Step 88: GitBook URL Abstraction & .gitattributes Normalization', file: 'tests/test_step88_gitbook_url_abstraction.js' },
  { name: 'Step 89: Markdown Link Integrity & Documentation Graph Verification', file: 'tests/test_step89_markdown_links_integrity.js' },
  { name: 'Step 90: CI/CD GitHub Actions & One-Way Sync Guard Integrity', file: 'tests/test_step90_ci_pipeline_and_docs_sync_guard.js' },
  { name: 'Step 91: PEEL Argument Coherence Checker (Task 2 Cambridge TR & CC)', file: 'tests/test_step91_peel_argument_coherence_checker.js' },
  { name: 'Step 92: In-situ Lexical Upgrader (Cambridge LR Band 7.0 - 8.5+)', file: 'tests/test_step92_in_situ_lexical_upgrader.js' },
  { name: 'Step 93: Distractor Trap Decoder (Reading & Listening Cambridge Traps)', file: 'tests/test_step93_distractor_trap_decoder.js' },
  { name: 'Step 94: Speaking Part 2 Pacing Bar (Thanh Căn Nhịp Độ 2 Phút)', file: 'tests/test_step94_speaking_pacing_bar.js' },
  { name: 'Step 95: Code Health, Architecture & Answer Evaluation Integrity', file: 'tests/test_step95_code_health_and_architecture.js' },
  { name: 'Step 96: Adaptive 30-Min Sprint Coach Integrity', file: 'tests/test_step96_adaptive_30min_sprint_coach.js' },
  { name: 'Step 97: GitBook Curriculum Integration & Theory Handbook Expansion', file: 'tests/test_step97_gitbook_theory_handbook_expansion.js' },
  { name: 'Step 98: GitBook Deep-Linking & Contextual Strategy Coaching', file: 'tests/test_step98_gitbook_deep_linking_and_contextual_coaching.js' },
  { name: 'Step 99: Interactive PESTLE Matrix, 5 Universal Archetypes & 100 Spelling Demons', file: 'tests/test_step99_interactive_pestle_archetypes_and_spelling100.js' },
  { name: 'Step 100: Dynamic Theory Chunks & Bundle Splitting (Performance & Milestone 100)', file: 'tests/test_step100_dynamic_theory_chunks_and_bundle_splitting.js' },
  { name: 'Step 101: Internationalization (i18n) Core Architecture & Language Switching', file: 'tests/test_step101_i18n_core_and_language_switching.js' },
  { name: 'Step 102: Workspaces & UI Shell Localization (Bilingual Phase 2)', file: 'tests/test_step102_i18n_workspaces_localization.js' },
  { name: 'Step 103: Bilingual AI Evaluation & Feedback Engine (Phase 3)', file: 'tests/test_step103_i18n_ai_evaluation_localization.js' },
  { name: 'Step 104: Bilingual Modals & Study Tools Localization (Phase 4)', file: 'tests/test_step104_i18n_modals_and_tools_localization.js' }
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
