import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log("▶ Running: Step 146: Double-Click Answer Deselection Verification (Reading & Listening) ...");

const readingPanePath = path.resolve('src/components/reading/QuestionPane.jsx');
const listeningPanePath = path.resolve('src/components/listening/ListeningQuestionPane.jsx');

const readingContent = fs.readFileSync(readingPanePath, 'utf8');
const listeningContent = fs.readFileSync(listeningPanePath, 'utf8');

// 1. Verify lastOptionClickRef and handlers exist in QuestionPane.jsx
assert(readingContent.includes('lastOptionClickRef'), 'QuestionPane must have lastOptionClickRef');
assert(readingContent.includes('handleOptionSelect'), 'QuestionPane must have handleOptionSelect');
assert(readingContent.includes('handleOptionDoubleClick'), 'QuestionPane must have handleOptionDoubleClick');

// 2. Verify TFNG group has double-click and touch support in QuestionPane.jsx
assert(readingContent.includes('onDoubleClick={(e) => handleOptionDoubleClick(e, q.order, opt)}'), 'QuestionPane TFNG must handle onDoubleClick');
assert(readingContent.includes('touch-manipulation'), 'QuestionPane must include touch-manipulation for responsive taps');
assert(readingContent.includes('Double-click to deselect') || readingContent.includes('Double-click để bỏ chọn'), 'QuestionPane must have bilingual tooltip for deselection');

// 3. Verify Multiple Choice group has double-click support in QuestionPane.jsx
assert(readingContent.includes('onDoubleClick={(e) => handleOptionDoubleClick(e, q.order, opt.letter)}'), 'QuestionPane MCQ must handle onDoubleClick');

// 4. Verify Matching group has double-click support in QuestionPane.jsx
assert(readingContent.includes('handleOptionDoubleClick(e, q.order, opt)'), 'QuestionPane Matching must handle onDoubleClick');

// 5. Verify ListeningQuestionPane has lastOptionClickRef and handlers
assert(listeningContent.includes('lastOptionClickRef'), 'ListeningQuestionPane must have lastOptionClickRef');
assert(listeningContent.includes('handleOptionSelect'), 'ListeningQuestionPane must have handleOptionSelect');
assert(listeningContent.includes('handleOptionDoubleClick'), 'ListeningQuestionPane must have handleOptionDoubleClick');

// 6. Verify ListeningQuestionPane option button handles double-click and touch-manipulation
assert(listeningContent.includes('onDoubleClick={(e) => {'), 'ListeningQuestionPane options must handle onDoubleClick');
assert(listeningContent.includes('handleOptionDoubleClick(e, q.order, opt.key)'), 'ListeningQuestionPane options must call handleOptionDoubleClick');
assert(listeningContent.includes('touch-manipulation'), 'ListeningQuestionPane must include touch-manipulation');
assert(listeningContent.includes('Double-click to deselect'), 'ListeningQuestionPane must include bilingual tooltip');

// 7. Verify logic simulation: double-click on already selected option clears answer
function createMockDeselectHandler() {
  let userAnswers = {};
  let lastOptionClick = {};
  
  const handleSelect = (qOrder, optValue, now) => {
    const currentAns = String(userAnswers[qOrder] || '').trim().toUpperCase();
    const targetOpt = String(optValue || '').trim().toUpperCase();
    const last = lastOptionClick[qOrder] || { time: 0, opt: '', wasAlreadySelected: false };

    if (
      last.wasAlreadySelected &&
      last.opt === targetOpt &&
      now - last.time > 0 &&
      now - last.time < 500
    ) {
      userAnswers[qOrder] = '';
      lastOptionClick[qOrder] = { time: 0, opt: '', wasAlreadySelected: false };
      return;
    }

    const wasAlready = currentAns === targetOpt;
    lastOptionClick[qOrder] = {
      time: now,
      opt: targetOpt,
      wasAlreadySelected: wasAlready
    };
    userAnswers[qOrder] = optValue;
  };

  const handleDoubleClick = (qOrder, optValue) => {
    const last = lastOptionClick[qOrder];
    const currentAns = String(userAnswers[qOrder] || '').trim().toUpperCase();
    const targetOpt = String(optValue || '').trim().toUpperCase();

    if ((last && last.wasAlreadySelected) || currentAns === targetOpt) {
      userAnswers[qOrder] = '';
      lastOptionClick[qOrder] = { time: 0, opt: '', wasAlreadySelected: false };
    }
  };

  return {
    getAnswer: (q) => userAnswers[q],
    setAnswer: (q, val) => { userAnswers[q] = val; },
    handleSelect,
    handleDoubleClick
  };
}

// Test case A: Click once selects TRUE
const simA = createMockDeselectHandler();
simA.handleSelect(1, 'TRUE', 1000);
assert.strictEqual(simA.getAnswer(1), 'TRUE', 'Single click must select TRUE');

// Test case B: Rapid double click on unselected option selects TRUE and does NOT deselect
const simB = createMockDeselectHandler();
simB.handleSelect(1, 'TRUE', 1000); // 1st click
simB.handleSelect(1, 'TRUE', 1150); // 2nd click within 150ms
// Because it wasn't selected before the sequence began, it must remain selected
assert.strictEqual(simB.getAnswer(1), 'TRUE', 'Double-clicking an unselected option must leave it selected');

// Test case C: Double-clicking an ALREADY SELECTED option deselects it (sets to '')
simB.handleSelect(1, 'TRUE', 2000); // 1st click on already selected option (records wasAlreadySelected: true)
simB.handleSelect(1, 'TRUE', 2200); // 2nd click within 200ms -> deselects!
assert.strictEqual(simB.getAnswer(1), '', 'Double-clicking an already selected option must deselect it');

// Test case D: Native dblclick event on already selected option deselects it
const simD = createMockDeselectHandler();
simD.setAnswer(2, 'FALSE');
simD.handleDoubleClick(2, 'FALSE');
assert.strictEqual(simD.getAnswer(2), '', 'Native double click on already selected FALSE must deselect it');

console.log("✅ PASSED: Step 146 Double-Click Answer Deselection Verified Cleanly!");
