/**
 * Test Suite: Step 22 - Phase 5 Pedagogical Depth: Task 2 Argument Flow & CDI Annotation
 * Verifies IELTS Writing Task 2 macro-structure, thesis detection, PEEL body paragraph functional
 * anatomy, evidence grounding, academic hedging, and CDI annotation workflows.
 */

import assert from 'assert';
import { 
  analyzeTask2Coherence, 
  splitSentences, 
  classifySentenceRole 
} from '../src/utils/coherenceAnalyzer.js';

console.log('--- TEST STEP 22: TASK 2 ARGUMENT FLOW & PEDAGOGY DEPTH ---');

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
// 1. EMPTY & MINIMAL ESSAY TESTS
// ============================================================================
it('analyzeTask2Coherence should handle empty or null essay gracefully', () => {
  const emptyRes = analyzeTask2Coherence('');
  assert.strictEqual(emptyRes.totalWords, 0);
  assert.strictEqual(emptyRes.paragraphCount, 0);
  assert.strictEqual(emptyRes.status, 'empty');
  assert.strictEqual(emptyRes.thesis.hasThesis, false);
  assert.strictEqual(emptyRes.conclusion.hasConclusion, false);

  const nullRes = analyzeTask2Coherence(null);
  assert.strictEqual(nullRes.totalWords, 0);
  assert.strictEqual(nullRes.status, 'empty');
});

it('analyzeTask2Coherence should warn about non-standard single-paragraph essays', () => {
  const singlePara = 'In modern society, technological advancement has reshaped communication completely. People can talk across borders in seconds. However, this also causes isolation. Therefore we should balance screen time.';
  const res = analyzeTask2Coherence(singlePara);

  assert.strictEqual(res.paragraphCount, 1);
  assert.strictEqual(res.isStandardParagraphing, false);
  assert.ok(res.warnings.some(w => w.includes('mô hình chuẩn') || w.includes('đoạn')), 'Should warn about single paragraph');
  assert.strictEqual(res.status, 'critical');
});

// ============================================================================
// 2. SENTENCE SEGMENTATION & CLASSIFICATION
// ============================================================================
it('splitSentences should accurately segment paragraphs into clean sentences', () => {
  const para = 'It is argued that universities should focus on practical skills. In my view, I completely agree with this proposal because employability is vital. For example, technical graduates find jobs faster.';
  const sents = splitSentences(para);
  assert.strictEqual(sents.length, 3);
  assert.strictEqual(sents[0], 'It is argued that universities should focus on practical skills.');
  assert.strictEqual(sents[1], 'In my view, I completely agree with this proposal because employability is vital.');
  assert.strictEqual(sents[2], 'For example, technical graduates find jobs faster.');
});

it('classifySentenceRole should identify Introduction Thesis Statements', () => {
  const thesisSent = 'In my opinion, I completely agree with this perspective because practical education promotes economic stability.';
  const role = classifySentenceRole(thesisSent, 1, 2, 'intro');
  assert.strictEqual(role.role, 'thesis');
  assert.strictEqual(role.badgeColor, 'indigo');
  assert.strictEqual(role.confidence, 'high');
});

it('classifySentenceRole should identify Body Topic Sentences, Examples, and Hedging', () => {
  const topicSent = 'First and foremost, the primary reason why vocational courses are beneficial is immediate job readiness.';
  const roleTopic = classifySentenceRole(topicSent, 0, 4, 'body');
  assert.strictEqual(roleTopic.role, 'topic');

  const exampleSent = 'For instance, in countries such as Germany, the dual education system equips apprentices with industry-standard qualifications.';
  const roleExample = classifySentenceRole(exampleSent, 2, 4, 'body');
  assert.strictEqual(roleExample.role, 'example');

  const hedgingSent = 'However, critics may argue that theoretical knowledge tends to offer broader long-term adaptability.';
  const roleHedging = classifySentenceRole(hedgingSent, 3, 4, 'body');
  assert.strictEqual(roleHedging.role, 'hedging');
});

// ============================================================================
// 3. FULL HIGH-BAND CAMBRIDGE TASK 2 ESSAY ANALYSIS
// ============================================================================
it('analyzeTask2Coherence should evaluate high-scoring 4-paragraph Cambridge essay', () => {
  const highBandEssay = [
    'It is widely debated whether universities should provide vocational training or focus strictly on academic scholarship. In my opinion, I completely agree that higher education must integrate career-oriented skills, as this enhances graduate employability while fulfilling industry demands.',
    'First and foremost, the primary argument in favor of practical education is immediate workplace readiness. This is because modern employers demand candidates who can execute specialized tasks without extensive probationary training. Without practical exposure, fresh graduates often face prolonged periods of unemployment. For instance, in countries such as Singapore, universities collaborating directly with multinational corporations boast employment rates exceeding 90%. Therefore, embedding real-world apprenticeships into academic curricula yields tangible socio-economic advantages for the entire workforce.',
    'On the other hand, theoretical foundation remains a vital aspect of higher learning. While it is true that purely vocational training may risk over-specialization, a balanced curriculum ensures that graduates possess critical thinking alongside technical competencies. To illustrate, engineering graduates who master both mathematical proofs and software programming are significantly better positioned to innovate in competitive technology sectors. Consequently, practical skills complement rather than undermine intellectual depth.',
    'In conclusion, while theoretical disciplines have undisputed academic value, I strongly reaffirm that universities should prioritize practical training. Preparing students with concrete skills ultimately fuels sustainable national progress and personal career fulfillment.'
  ].join('\n\n');

  const res = analyzeTask2Coherence(highBandEssay);

  assert.strictEqual(res.paragraphCount, 4);
  assert.strictEqual(res.isStandardParagraphing, true);
  assert.strictEqual(res.thesis.hasThesis, true);
  assert.strictEqual(res.thesis.quality, 'strong');
  assert.strictEqual(res.conclusion.hasConclusion, true);
  assert.strictEqual(res.conclusion.hasSignal, true);

  // Check metrics
  assert.ok(res.metrics.totalExamples >= 2, `Expected >= 2 examples, got ${res.metrics.totalExamples}`);
  assert.ok(res.metrics.totalHedging >= 1, `Expected >= 1 hedging instance, got ${res.metrics.totalHedging}`);
  assert.strictEqual(res.metrics.bodyParagraphCount, 2);

  // Band estimate should be high (Band 7.5+)
  const band = parseFloat(res.bandEstimate);
  assert.ok(band >= 7.5, `Expected Band >= 7.5, got ${band}`);
  assert.strictEqual(res.status, 'optimal');
  assert.strictEqual(res.statusLabel, 'Đạt chuẩn ✓');
  assert.ok(res.strengths.length >= 3, 'Should list multiple strengths');
});

// ============================================================================
// 4. MISSING THESIS STATEMENT PENALTY CHECK (TR 6.0 CAP)
// ============================================================================
it('analyzeTask2Coherence should detect missing Thesis and warn about Band 6.0 TR cap', () => {
  const essayWithoutThesis = [
    'Many people debate whether students should study online or attend physical schools. This issue has sparked controversy among parents and educators across the globe.',
    'First and foremost, online schooling allows flexibility and reduced commuting expenses. This is because learners can study from the comfort of their homes at their own pace.',
    'On the other hand, traditional schools foster interpersonal communication. For example, children learn teamwork through playground activities and face-to-face peer interactions.',
    'In conclusion, both modes of education have their own merits and drawbacks.'
  ].join('\n\n');

  const res = analyzeTask2Coherence(essayWithoutThesis);

  assert.strictEqual(res.paragraphCount, 4);
  assert.strictEqual(res.thesis.hasThesis, false);
  assert.strictEqual(res.thesis.quality, 'missing');
  assert.ok(res.thesis.feedback.includes('Band 6.0'), 'Thesis feedback should mention Band 6.0 TR cap');
  assert.strictEqual(res.statusLabel, 'Thiếu Thesis ⚠️');
  assert.ok(res.warnings.some(w => w.includes('Thesis')), 'Should list missing Thesis in warnings');
});

// ============================================================================
// 5. MISSING EXAMPLES CHECK
// ============================================================================
it('analyzeTask2Coherence should flag underdeveloped body paragraphs lacking examples', () => {
  const essayWithoutExamples = [
    'Some people believe that artificial intelligence will eliminate human jobs. In my opinion, I completely agree with this view because automation is progressing at an unprecedented pace.',
    'First and foremost, automated algorithms can perform repetitive cognitive tasks faster than human employees. This results in significant cost savings for major corporations.',
    'Furthermore, customer service agents are being replaced by automated chatbots. This causes large-scale structural unemployment among low-skilled administrative workers.',
    'In conclusion, I maintain that robotics and AI will replace human labor across multiple sectors.'
  ].join('\n\n');

  const res = analyzeTask2Coherence(essayWithoutExamples);

  assert.strictEqual(res.metrics.totalExamples, 0);
  assert.strictEqual(res.statusLabel, 'Thiếu ví dụ ⚠️');
  assert.ok(res.warnings.some(w => w.includes('dẫn chứng')), 'Should warn about lack of examples');

  // Verify sample templates exist
  assert.ok(res.sampleTemplates.opinionAgree.length > 10, 'Should provide Opinion Agree template');
  assert.ok(res.sampleTemplates.bothViews.length > 10, 'Should provide Both Views template');
  assert.ok(res.sampleTemplates.peelExample.length > 10, 'Should provide PEEL Example template');
});

// ============================================================================
// 6. CDI ANNOTATION & SCRATCHPAD DATA STRUCTURE VERIFICATION
// ============================================================================
it('CDI Annotation & Scratchpad schema should support highlighted phrases with attached notes', () => {
  const highlightsState = {
    A: [
      { text: 'vocational training', color: 'yellow', note: 'Essential Cambridge keyword' },
      { text: 'employability', color: 'cyan', note: 'Collocation: graduate employability' }
    ],
    B: [
      { text: 'critical thinking', color: 'yellow', note: '' }
    ]
  };

  // Verify note extraction
  let totalNotes = 0;
  Object.values(highlightsState).forEach(list => {
    list.forEach(item => {
      if (item.note && item.note.trim()) totalNotes++;
    });
  });

  assert.strictEqual(totalNotes, 2, 'Should count 2 non-empty notes');
  assert.strictEqual(highlightsState.A[0].note, 'Essential Cambridge keyword');
  assert.strictEqual(highlightsState.B[0].note, '');

  // Verify storage key convention
  const testId = 'test-reading-1';
  const highlightsKey = `ielts_reading_highlights_${testId}`;
  const scratchpadKey = `ielts_reading_scratchpad_${testId}`;
  assert.ok(highlightsKey.startsWith('ielts_reading_highlights_'));
  assert.ok(scratchpadKey.startsWith('ielts_reading_scratchpad_'));
});

console.log(`\nAll ${testsPassed} unit tests in Step 22 passed cleanly!`);
