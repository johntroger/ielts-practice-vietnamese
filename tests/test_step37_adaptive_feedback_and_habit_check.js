import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectWritingHabits } from '../src/utils/habitDetector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Running Step 37 Test Suite: Adaptive Feedback (ZPD) & Habit Pre-Submission Checks...');

// 1. Test Task 1 Overview Detection
{
  const task1 = { taskNumber: 1, title: 'Car Production Chart' };
  const textNoOverview = 'The chart illustrates car production in the UK over a decade. In 2010, the figure was 100,000 units. By 2015, production grew to 150,000 units. In 2020, it peaked at 200,000 units.';
  const warnings = detectWritingHabits(textNoOverview, task1);
  assert.ok(warnings.some(w => w.id === 'task1_overview'), 'Should detect missing Overview in Task 1');

  const textWithOverview = 'The chart illustrates car production in the UK. Overall, production increased steadily over the period. In 2010, the figure was 100,000 units.';
  const warnings2 = detectWritingHabits(textWithOverview, task1);
  assert.strictEqual(warnings2.some(w => w.id === 'task1_overview'), false, 'Should pass when Overview clause is present');
}

// 2. Test Informal / Spoken Sentence Starters
{
  const task2 = { taskNumber: 2, title: 'Technology in Education' };
  const textWithInformal = 'Technology is widely used in classrooms. Besides, many students find computers engaging for self-study and collaborative research projects.';
  const warnings = detectWritingHabits(textWithInformal, task2);
  assert.ok(warnings.some(w => w.id === 'informal_starter'), 'Should flag informal starter "Besides, "');
}

// 3. Test Missing Comma after Conjunctive Adverbs
{
  const task2 = { taskNumber: 2 };
  const textMissingComma = 'Some people believe remote work is beneficial. However others argue that physical offices foster team bonding and higher accountability.';
  const warnings = detectWritingHabits(textMissingComma, task2);
  assert.ok(warnings.some(w => w.id === 'missing_comma'), 'Should detect missing comma after "However "');

  const textCorrectComma = 'Some people believe remote work is beneficial. However, others argue that physical offices foster team bonding.';
  const warningsCorrect = detectWritingHabits(textCorrectComma, task2);
  assert.strictEqual(warningsCorrect.some(w => w.id === 'missing_comma'), false, 'Should not flag when comma is present after However');
}

// 4. Test Extreme Run-on Sentences (> 50 words without punctuation)
{
  const task2 = { taskNumber: 2 };
  const longSentence = 'This is a very long sentence designed to test whether the heuristic detector correctly identifies run on structures that continue endlessly without any proper punctuation or full stop markers which might confuse examiners and ultimately reduce coherence and cohesion scores in standard Cambridge IELTS scoring guidelines because ideas are simply strung together without syntactical boundaries.';
  const warnings = detectWritingHabits(longSentence, task2);
  assert.ok(warnings.some(w => w.id === 'run_on'), 'Should detect run-on sentence exceeding 50 words');
}

// 5. Test Past Mistakes Log Recurrence
{
  const task2 = { taskNumber: 2 };
  const pastMistakes = [
    { original: 'discuss about', corrected: 'discuss', type: 'Collocation' },
    { original: 'in modern days', corrected: 'in contemporary society', type: 'Vocabulary' }
  ];
  const textWithMistake = 'Today we will discuss about environmental issues that threaten global biodiversity and modern urban infrastructure across the globe.';
  const warnings = detectWritingHabits(textWithMistake, task2, pastMistakes);
  assert.ok(warnings.some(w => w.id === 'past_mistake'), 'Should detect recurring mistake from pastMistakes log');
}

// 6. Verify FeedbackModal.jsx has ZPD Focus Bar and Adaptive Banners
{
  const feedbackModalPath = path.join(rootDir, 'src', 'components', 'FeedbackModal.jsx');
  const content = fs.readFileSync(feedbackModalPath, 'utf8');

  assert.ok(content.includes('pedagogicalFocus'), 'FeedbackModal must manage pedagogicalFocus state');
  assert.ok(content.includes('Mục tiêu sư phạm (ZPD):'), 'FeedbackModal must render ZPD selector bar label');
  assert.ok(content.includes('Band 5.5 - 6.5'), 'FeedbackModal must include foundation band target');
  assert.ok(content.includes('Band 7.5+'), 'FeedbackModal must include advanced band target');
  assert.ok(content.includes('filteredCorrections'), 'FeedbackModal must use filteredCorrections in Tab 3');
}

// 7. Verify App.jsx connects props to TimerBar
{
  const appPath = path.join(rootDir, 'src', 'App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');

  assert.ok(appContent.includes('essayText={currentEssay}'), 'App.jsx must pass essayText to TimerBar');
  assert.ok(appContent.includes('currentTask={currentTask}'), 'App.jsx must pass currentTask to TimerBar');
  assert.ok(appContent.includes('mistakes={mistakes}'), 'App.jsx must pass mistakes to TimerBar');
}

console.log('✅ Step 37 Test Suite: All 7 checks passed successfully!');
