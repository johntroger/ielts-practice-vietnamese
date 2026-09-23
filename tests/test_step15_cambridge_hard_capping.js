/**
 * Test Suite 15: Cambridge Hard Band Capping Rules & AI Rubric Calibration
 * Verifies strict IDP/BC examiner standards across both Algorithmic & AI evaluations.
 */

import assert from 'assert';
import { applyCambridgeWritingHardCaps } from '../src/utils/ieltsScoringRules.js';

console.log('--- TEST STEP 15: CAMBRIDGE HARD BAND CAPPING RULES ---');

let testsPassed = 0;

function it(desc, fn) {
  try {
    fn();
    testsPassed++;
    console.log(`  ✓ ${desc}`);
  } catch (err) {
    console.error(`  ✗ ${desc}`);
    throw err;
  }
}

// ============================================================================
// 1. TASK 1 OVERVIEW HARD CAP (<= 5.0)
// ============================================================================
it('should cap Task 1 TA to Band 5.0 if Overview is missing, even with Band 8.0 vocabulary and grammar', () => {
  const task = { taskNumber: 1, isTask1: true, prompt: 'The chart shows car production from 2000 to 2010.', minWords: 150 };
  
  // Essay has introductory paragraph + body with 165 words and comparisons, but NO overview paragraph or sentence
  const essayText = `The provided chart illustrates vehicle production statistics in Germany between 2000 and 2010.

In 2000, sedan production commenced at approximately 300,000 units, representing the predominant manufacturing category. Over the subsequent decade, this figure witnessed an unprecedented and steady upward trajectory, eventually culminating at roughly 450,000 units in 2010. In stark contrast, sports car manufacturing exhibited a pronounced decline, plunging from 120,000 to a mere 40,000 vehicles over the same evaluated period.

Regarding electric automobiles, initial figures were virtually negligible in 2000, registering barely 5,000 units. Nevertheless, this green segment experienced exponential expansion, skyrocketing to over 200,000 vehicles by the conclusion of the timeline, thereby surpassing sports cars significantly. Finally, hybrid models demonstrated consistent and moderate increments throughout the ten years, climbing steadily from 25,000 units up to 90,000 units without encountering major fluctuations.`;

  const mockAiEvaluation = {
    overallBand: 7.5,
    criteria: {
      tr: { band: 7.5, feedback: 'Great reporting of figures', improvements: [] },
      cc: { band: 7.5, feedback: 'Smooth cohesion', improvements: [] },
      lr: { band: 8.0, feedback: 'Sophisticated academic vocabulary', improvements: [] },
      gra: { band: 8.0, feedback: 'Flawless complex structures', improvements: [] }
    }
  };

  const calibrated = applyCambridgeWritingHardCaps({ task, essayText, evaluation: mockAiEvaluation });

  assert.strictEqual(calibrated.criteria.tr.band, 5.0, `Expected TA capped at 5.0, got ${calibrated.criteria.tr.band}`);
  assert.ok(calibrated.appliedHardCaps.some(c => c.rule === 'TASK_1_MISSING_OVERVIEW'));
  assert.ok(calibrated.criteria.tr.improvements.some(msg => msg.includes('Barem khảo thí chính thức của Cambridge')));
  // Overall band should be recalculated: (5.0 + 7.5 + 8.0 + 8.0) / 4 = 28.5 / 4 = 7.125 -> 7.0
  assert.strictEqual(calibrated.overallBand, 7.0);
});

it('should NOT cap Task 1 TA if a clear Overview is present without raw data', () => {
  const task = { taskNumber: 1, isTask1: true, prompt: 'The chart shows car production from 2000 to 2010.', minWords: 150 };

  const essayText = `The provided chart illustrates vehicle production statistics in Germany between 2000 and 2010.

Overall, it is readily apparent that sedan and electric vehicle manufacturing experienced considerable growth, whereas sports car production saw a marked downward trend over the surveyed period.

In 2000, sedan production commenced at 300,000 units, representing the predominant manufacturing category. Over the subsequent decade, this figure climbed steadily to roughly 450,000 units in 2010. In stark contrast, sports car manufacturing plunged from 120,000 down to 40,000 vehicles by the conclusion of the timeline.

Meanwhile, electric automobiles experienced an exponential expansion, skyrocketing from negligible numbers in 2000 to over 200,000 vehicles in 2010, thereby comfortably surpassing sports cars. Finally, commercial trucks grew steadily from 50,000 to 95,000 units, while hybrid vehicles witnessed a progressive rise throughout the entire ten-year period without noticeable downturns. This robust growth reflected substantial investments in green automotive engineering.`;

  const mockAiEvaluation = {
    overallBand: 7.5,
    criteria: {
      tr: { band: 7.5, feedback: 'Excellent report with clear overview', improvements: [] },
      cc: { band: 7.5, feedback: 'Smooth cohesion', improvements: [] },
      lr: { band: 7.5, feedback: 'Rich vocabulary', improvements: [] },
      gra: { band: 7.5, feedback: 'Accurate structures', improvements: [] }
    }
  };

  const calibrated = applyCambridgeWritingHardCaps({ task, essayText, evaluation: mockAiEvaluation });

  assert.strictEqual(calibrated.criteria.tr.band, 7.5, 'TA should remain 7.5 when overview is valid');
  assert.strictEqual(calibrated.overallBand, 7.5);
  assert.strictEqual(calibrated.appliedHardCaps.length, 0);
});

it('should cap Task 1 TA to Band 5.5 if Overview is contaminated with specific numerical figures', () => {
  const task = { taskNumber: 1, isTask1: true, prompt: 'The chart shows car production from 2000 to 2010.', minWords: 150 };

  const essayText = `The provided chart illustrates vehicle production in Germany from 2000 to 2010.

Overall, sedans grew dramatically from 300,000 to 450,000 units, while sports cars plummeted to only 40,000 units in 2010.

Looking at sedans in detail, initial production stood at 300,000 units before escalating consistently over the decade to reach 450,000 units in 2010. Meanwhile, electric vehicles expanded steadily throughout the timeframe, climbing from 5,000 units to reach 200,000 units by the end of the survey.

Regarding the remaining categories, sports car manufacturing commenced at 120,000 units and experienced a steady decline to approximately 40,000 units. Furthermore, hybrid passenger vehicles maintained a stable upward trajectory across the entire decade, closing at 90,000 total manufactured units in 2010, thereby easily outstripping early projections made by international industry analysts. These comprehensive indicators highlighted the significant modernization within the German domestic transportation sector during the analyzed decade.`;

  const mockAiEvaluation = {
    overallBand: 7.0,
    criteria: {
      tr: { band: 7.0, feedback: 'Good', improvements: [] },
      cc: { band: 7.0, feedback: 'Good', improvements: [] },
      lr: { band: 7.0, feedback: 'Good', improvements: [] },
      gra: { band: 7.0, feedback: 'Good', improvements: [] }
    }
  };

  const calibrated = applyCambridgeWritingHardCaps({ task, essayText, evaluation: mockAiEvaluation });

  assert.strictEqual(calibrated.criteria.tr.band, 5.5, `Expected TA capped at 5.5 for data-heavy overview, got ${calibrated.criteria.tr.band}`);
  assert.ok(calibrated.appliedHardCaps.some(c => c.rule === 'TASK_1_OVERVIEW_RAW_DATA'));
});

// ============================================================================
// 2. WORD COUNT UNDERLENGTH PENALTIES
// ============================================================================
it('should penalize Task 1 when word count is below 150 words', () => {
  const task = { taskNumber: 1, isTask1: true, prompt: 'The chart shows car production.', minWords: 150 };
  
  // 90 words essay
  const shortEssay = 'The chart illustrates car production. Overall, sedans grew while trucks declined. In 2000, sedans stood at 100 units and climbed steadily. Trucks began at 200 units before decreasing significantly. By contrast, electric cars started slowly but finished strongly. In conclusion, distinct variations were visible across all categories throughout the ten-year period without hesitation.';

  const mockEvaluation = {
    overallBand: 6.5,
    criteria: {
      tr: { band: 6.5, feedback: 'OK', improvements: [] },
      cc: { band: 6.5, feedback: 'OK', improvements: [] },
      lr: { band: 6.5, feedback: 'OK', improvements: [] },
      gra: { band: 6.5, feedback: 'OK', improvements: [] }
    }
  };

  const calibrated = applyCambridgeWritingHardCaps({ task, essayText: shortEssay, evaluation: mockEvaluation });

  assert.ok(calibrated.criteria.tr.band <= 4.0, `Expected TA <= 4.0 for <100 words, got ${calibrated.criteria.tr.band}`);
  assert.ok(calibrated.appliedHardCaps.some(c => c.rule === 'TASK_1_SEVERE_UNDERLENGTH'));
});

it('should penalize Task 2 when word count is substantially below 250 words', () => {
  const task = { taskNumber: 2, isTask1: false, prompt: 'Some believe community service should be compulsory. Discuss both views.', minWords: 250 };
  
  // ~65 words essay (severely underlength)
  const shortTask2 = `Many people debate whether volunteering should be obligatory for secondary school students. In my perspective, I firmly agree with this statement.
  
Firstly, participating in unpaid service fosters civic responsibility and empathy towards underprivileged demographics. Adolescents discover practical skills.
  
Secondly, community engagement assists young individuals in acquiring professional competence and interpersonal prowess.
  
In conclusion, mandatory volunteering provides undeniable benefits to both pupils and societal prosperity.`;

  const mockEvaluation = {
    overallBand: 7.0,
    criteria: {
      tr: { band: 7.0, feedback: 'Good', improvements: [] },
      cc: { band: 7.0, feedback: 'Good', improvements: [] },
      lr: { band: 7.0, feedback: 'Good', improvements: [] },
      gra: { band: 7.0, feedback: 'Good', improvements: [] }
    }
  };

  const calibrated = applyCambridgeWritingHardCaps({ task, essayText: shortTask2, evaluation: mockEvaluation });

  assert.ok(calibrated.criteria.tr.band <= 4.0, `Expected TR <= 4.0 for short essay, got ${calibrated.criteria.tr.band}`);
  assert.ok(calibrated.appliedHardCaps.some(c => c.rule === 'TASK_2_CRITICAL_UNDERLENGTH' || c.rule === 'TASK_2_SEVERE_UNDERLENGTH'));
});

// ============================================================================
// 3. TASK 2 UNFULFILLED MULTI-PART PROMPT (<= 5.0)
// ============================================================================
it('should cap Task 2 TR to Band 5.0 if one part of a two-question prompt is completely omitted', () => {
  const task = { 
    taskNumber: 2, 
    isTask1: false, 
    prompt: 'Nowadays many people choose to live alone. Why is this the case? Is this a positive or negative development?', 
    minWords: 250 
  };

  // Full length essay, but completely IGNORES question 2 (Positive or Negative), only writes about causes/reasons
  const p1 = 'It is universally acknowledged that in recent decades an unprecedented proportion of contemporary citizens opt to establish independent single-person households. There are several principal socio-economic factors and structural catalysts contributing directly to this widespread residential transition across modern urban landscapes.';
  const p2 = 'First and foremost, significant improvements in personal economic self-sufficiency enable working individuals to sustain their own domestic households with relative financial ease. With ascending average disposable incomes and robust professional remuneration in major metropolitan districts, young professionals can comfortably afford private rental apartments without necessitating cost-sharing compromises with roommates or extended relatives. Consequently, this financial autonomy leads directly to greater personal discretion over discretionary expenditure, personal space, and domestic living arrangements.';
  const p3 = 'Furthermore, cultural attitudes have shifted decisively towards self-actualisation, personal privacy, and unhindered autonomy. Solitary residence offers total flexibility regarding daily routines, professional working schedules, domestic habits, and social engagements, liberating modern inhabitants from restrictive domestic friction and traditional familial constraints. Additionally, delayed marriage represents another critical structural driver propelling this demographic pattern forward, as career-driven citizens deliberately postpone matrimonial obligations to prioritize individual achievements.';
  const p4 = 'In conclusion, individual financial empowerment, evolving societal values emphasizing personal autonomy, and shifting marital timelines represent the primary causes driving modern citizens toward independent living.';
  const essayCausesOnly = [p1, p2, p3, p4].join('\n\n');

  const mockEvaluation = {
    overallBand: 7.0,
    criteria: {
      tr: { band: 7.0, feedback: 'Well developed points', improvements: [] },
      cc: { band: 7.0, feedback: 'Logical flow', improvements: [] },
      lr: { band: 7.0, feedback: 'Good vocabulary', improvements: [] },
      gra: { band: 7.0, feedback: 'Accurate syntax', improvements: [] }
    }
  };

  const calibrated = applyCambridgeWritingHardCaps({ task, essayText: essayCausesOnly, evaluation: mockEvaluation });

  assert.strictEqual(calibrated.criteria.tr.band, 5.0, `Expected TR capped at 5.0 for missing entire prompt question, got ${calibrated.criteria.tr.band}`);
  assert.ok(calibrated.appliedHardCaps.some(c => c.rule === 'TASK_2_UNFULFILLED_PART'));
});

console.log(`\n🎉 ALL ${testsPassed}/6 STEP 15 UNIT TESTS PASSED CLEANLY!`);
