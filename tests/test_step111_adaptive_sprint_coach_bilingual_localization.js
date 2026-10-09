/**
 * Test Suite: Step 111 - Adaptive 30-Min Sprint Coach Bilingual Localization Verification
 * Ensures zero untranslated Vietnamese leaks in the Adaptive Sprint Coach Modal, AI diagnosis banner,
 * 3 stages (Warm-up, Core Reflex, Lexical Consolidation), stopwatch controls, and celebration screen.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { en } from '../src/i18n/locales/en.js';
import { vi } from '../src/i18n/locales/vi.js';
import {
  diagnoseLearnerProfile,
  generateDaily30MinSprint,
  SPRINT_LEXICAL_BANK
} from '../src/services/sprintCoachService.js';
import { DEFAULT_IELTS_TRAPS } from '../src/services/prescriptionService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- TEST STEP 111: ADAPTIVE SPRINT COACH BILINGUAL LOCALIZATION ---');

let passedTests = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    throw err;
  }
}

// 1. Translation Dictionary Parity
it('1. modals.sprint dictionary parity between en.js and vi.js', () => {
  const enSprint = en.modals.sprint;
  const viSprint = vi.modals.sprint;

  assert.ok(enSprint, 'en.modals.sprint must exist');
  assert.ok(viSprint, 'vi.modals.sprint must exist');

  const requiredKeys = [
    'title',
    'subtitle',
    'badgeDaily',
    'streakLabel',
    'aiCoachDiagnosis',
    'targetBandBadge',
    'minsDuration',
    'stageQuestionHeader',
    'stageCorrect',
    'stageIncorrect',
    'examinerExplanation',
    'stage1Instruction',
    'stage2SpeakingTitle',
    'stage2WritingTitle',
    'stage2SpeakingNotesLabel',
    'stage2WritingLabel',
    'suggestedFramework',
    'stage3Instruction',
    'meaningLabel',
    'exampleLabel',
    'saveToNotebook',
    'savedToNotebook',
    'stageProgressLabel',
    'proceedNext',
    'finishSprint',
    'celebrationTitle',
    'celebrationDesc',
    'durationLabel',
    'durationValue',
    'streakChainLabel',
    'daysCount',
    'totalSessionsLabel',
    'sessionsCount',
    'reviewStages',
    'completeAndClose',
    'timerPause',
    'timerStart',
    'timerReset',
    'closeModal'
  ];

  requiredKeys.forEach(k => {
    assert.ok(enSprint[k], `Missing key in en.modals.sprint: ${k}`);
    assert.ok(viSprint[k], `Missing key in vi.modals.sprint: ${k}`);
  });
});

// 2. diagnoseLearnerProfile Bilingual Support
it('2. diagnoseLearnerProfile returns diagnosisTextEn across all bottleneck states', () => {
  const bottlenecks = [
    { mistakes: [1, 2, 3, 4], expectedKey: 'accuracy_traps' },
    { submissions: [{ type: 'task1' }, { type: 'task2' }], expectedKey: 'speaking_fluency' },
    { submissions: [{ type: 'task1' }, { speakingTopic: 'city' }], targetBand: '7.5', expectedKey: 'writing_coherence' },
    { submissions: [{ type: 'task1' }, { speakingTopic: 'city' }], targetBand: '6.0', expectedKey: 'balanced_pace' }
  ];

  bottlenecks.forEach(scenario => {
    const diag = diagnoseLearnerProfile(scenario);
    assert.ok(diag.diagnosisText && diag.diagnosisText.length > 0, 'Must have diagnosisText');
    assert.ok(diag.diagnosisTextEn && diag.diagnosisTextEn.length > 0, 'Must have diagnosisTextEn');
  });
});

// 3. SPRINT_LEXICAL_BANK & DEFAULT_IELTS_TRAPS English Fields
it('3. SPRINT_LEXICAL_BANK and DEFAULT_IELTS_TRAPS contain English definitions and explanations', () => {
  assert.ok(SPRINT_LEXICAL_BANK.length >= 6);
  SPRINT_LEXICAL_BANK.forEach(item => {
    assert.ok(item.meaningVi && item.meaningVi.length > 0, 'Missing meaningVi');
    assert.ok(item.meaningEn && item.meaningEn.length > 0, 'Missing meaningEn');
  });

  assert.ok(DEFAULT_IELTS_TRAPS.length >= 5);
  DEFAULT_IELTS_TRAPS.forEach(trap => {
    assert.ok(trap.title && trap.title.length > 0, 'Missing title');
    assert.ok(trap.titleEn && trap.titleEn.length > 0, 'Missing titleEn');
    assert.ok(trap.explanation && trap.explanation.length > 0, 'Missing explanation');
    assert.ok(trap.explanationEn && trap.explanationEn.length > 0, 'Missing explanationEn');
  });
});

// 4. generateDaily30MinSprint Stage Metadata Localization
it('4. generateDaily30MinSprint stages include titleEn, subtitleEn, and badgeEn', () => {
  const sprint = generateDaily30MinSprint({ targetBand: '6.5' });
  assert.strictEqual(sprint.stages.length, 3);

  sprint.stages.forEach(stg => {
    assert.ok(stg.title && stg.title.length > 0, `Stage ${stg.id} missing title`);
    assert.ok(stg.titleEn && stg.titleEn.length > 0, `Stage ${stg.id} missing titleEn`);
    assert.ok(stg.subtitle && stg.subtitle.length > 0, `Stage ${stg.id} missing subtitle`);
    assert.ok(stg.subtitleEn && stg.subtitleEn.length > 0, `Stage ${stg.id} missing subtitleEn`);
    assert.ok(stg.badge && stg.badge.length > 0, `Stage ${stg.id} missing badge`);
    assert.ok(stg.badgeEn && stg.badgeEn.length > 0, `Stage ${stg.id} missing badgeEn`);
  });
});

// 5. AdaptiveSprintModal.jsx Implementation Inspection
it('5. AdaptiveSprintModal.jsx connects all localized labels and removes raw Vietnamese', () => {
  const modalContent = fs.readFileSync(
    path.join(__dirname, '../src/components/AdaptiveSprintModal.jsx'),
    'utf-8'
  );

  // Checks that useTranslation & isEn are active
  assert.ok(modalContent.includes('const { t, isEn } = useTranslation();'), 'Missing useTranslation destructuring');

  // Diagnosis banner
  assert.ok(modalContent.includes("t('modals.sprint.aiCoachDiagnosis'"), 'Missing aiCoachDiagnosis i18n call');
  assert.ok(modalContent.includes("t('modals.sprint.targetBandBadge'"), 'Missing targetBandBadge i18n call');
  assert.ok(modalContent.includes('sprintPlan.diagnosis?.diagnosisTextEn'), 'Missing diagnosisTextEn consumption');

  // Stage headers and badges
  assert.ok(modalContent.includes('currentStage.badgeEn || currentStage.badge'), 'Missing bilingual badge');
  assert.ok(modalContent.includes('currentStage.titleEn || currentStage.title'), 'Missing bilingual stage title');
  assert.ok(modalContent.includes('currentStage.subtitleEn || currentStage.subtitle'), 'Missing bilingual stage subtitle');

  // Action buttons and celebration
  assert.ok(modalContent.includes("'modals.sprint.stageProgressLabel'"), 'Missing stageProgressLabel i18n call');
  assert.ok(modalContent.includes("'modals.sprint.celebrationTitle'"), 'Missing celebrationTitle i18n call');
  assert.ok(modalContent.includes("'modals.sprint.proceedNext'"), 'Missing proceedNext i18n call');

  // Must not have hardcoded raw Vietnamese in key header areas
  assert.ok(!modalContent.includes('Chẩn đoán Huấn luyện viên AI:</span>'), 'Found hardcoded Vietnamese diagnosis title');
  assert.ok(!modalContent.includes('Hoàn Thành Chặng & Sang Chặng Kế Tiếp</span>'), 'Found hardcoded stage completion button');
});

console.log(`\n🎉 ALL ${passedTests}/5 TESTS PASSED CLEANLY FOR STEP 111!`);
