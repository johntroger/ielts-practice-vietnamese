import assert from 'node:assert';
import { getEffectiveTranscripts } from '../src/utils/transcriptParser.js';
import { INITIAL_LISTENING_TESTS } from '../src/data/listeningTasks.js';
import { cambridge17Test1 } from '../src/data/listening/cambridge17Test1.js';
import { cambridge18Test1 } from '../src/data/listening/cambridge18Test1.js';
import { cambridge19Test1 } from '../src/data/listening/cambridge19Test1.js';
import { cambridge20Test1 } from '../src/data/listening/cambridge20Test1.js';
import { cambridge8Test1 } from '../src/data/listening/cambridge8Test1.js';
import { cambridge8Test2 } from '../src/data/listening/cambridge8Test2.js';
import { cambridge8Test3 } from '../src/data/listening/cambridge8Test3.js';

console.log('--- Step 191: Cambridge Listening Transcripts Integrity Test ---');

const cambridgeTests = [
  { name: 'Cambridge 8 Test 1', test: cambridge8Test1, minSentences: 3 },
  { name: 'Cambridge 8 Test 2', test: cambridge8Test2, minSentences: 3 },
  { name: 'Cambridge 8 Test 3', test: cambridge8Test3, minSentences: 2 },
  { name: 'Cambridge 17 Test 1', test: cambridge17Test1, minSentences: 10 },
  { name: 'Cambridge 18 Test 1', test: cambridge18Test1, minSentences: 10 },
  { name: 'Cambridge 19 Test 1', test: cambridge19Test1, minSentences: 10 },
  { name: 'Cambridge 20 Test 1', test: cambridge20Test1, minSentences: 10 }
];

// 1. Verify all Cambridge tests have exactly 4 parts with valid transcripts
cambridgeTests.forEach(({ name, test, minSentences }) => {
  assert.ok(test, `${name} must be defined`);
  assert.strictEqual(test.parts?.length, 4, `${name} must have exactly 4 parts`);

  test.parts.forEach((part, partIdx) => {
    const partNum = part.partNumber || partIdx + 1;
    const transcripts = getEffectiveTranscripts(part);

    assert.ok(Array.isArray(transcripts), `${name} Part ${partNum} transcripts must be an array`);
    assert.ok(transcripts.length >= minSentences, `${name} Part ${partNum} must have at least ${minSentences} sentences, got ${transcripts.length}`);

    // Check sentence validity
    transcripts.forEach((sentence, sIdx) => {
      assert.ok(typeof sentence.start === 'number', `${name} P${partNum} S${sIdx} start must be a number`);
      assert.ok(typeof sentence.end === 'number', `${name} P${partNum} S${sIdx} end must be a number`);
      assert.ok(sentence.start < sentence.end, `${name} P${partNum} S${sIdx} start (${sentence.start}) must be < end (${sentence.end})`);
      assert.ok(typeof sentence.speaker === 'string' && sentence.speaker.trim().length > 0, `${name} P${partNum} S${sIdx} must have speaker`);
      assert.ok(typeof sentence.text === 'string' && sentence.text.trim().length > 0, `${name} P${partNum} S${sIdx} must have text`);
    });
  });
  console.log(`✓ ${name}: 4/4 parts verified with comprehensive transcripts & valid timestamps`);
});

// 2. Global verification across all 43 tests and 87 parts in INITIAL_LISTENING_TESTS
let totalParts = 0;
let validParts = 0;

INITIAL_LISTENING_TESTS.forEach(test => {
  test.parts?.forEach(part => {
    totalParts++;
    const t = getEffectiveTranscripts(part);
    if (t.length > 0) validParts++;
  });
});

assert.ok(totalParts >= 87, `Total listening parts in database must be at least 87 (got ${totalParts})`);
assert.strictEqual(validParts, totalParts, `All ${totalParts}/${totalParts} listening parts must have working interactive transcripts`);
console.log(`✓ Global Coverage: 100% of all ${totalParts} listening parts have active interactive transcripts!`);

console.log('ALL Step 191 assertions passed successfully!');
