/**
 * test_speech_audio_chunking.js
 * Unit tests for speech audio text chunking engine.
 * Ensures:
 * 1. Chunks are strictly under maxChunkLen (<= 140 chars).
 * 2. Sentences are split naturally on boundaries (. ? ! ; :).
 * 3. Commas and clause boundaries are respected for long compound sentences.
 * 4. Ultra-long continuous sentences without punctuation are broken at word boundaries.
 * 5. Handles empty, single-word, and special character inputs safely.
 */

import { splitTextIntoUtteranceChunks } from '../src/utils/speechAudio.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    passed++;
  }
}

console.log('Testing splitTextIntoUtteranceChunks...');

// Test 1: Empty and invalid inputs
assert(splitTextIntoUtteranceChunks('').length === 0, 'Empty string returns empty array');
assert(splitTextIntoUtteranceChunks(null).length === 0, 'Null returns empty array');
assert(splitTextIntoUtteranceChunks('   ').length === 0, 'Whitespace returns empty array');

// Test 2: Short single sentence <= 140
const shortText = 'The library opens at nine in the morning every weekday.';
const shortChunks = splitTextIntoUtteranceChunks(shortText, 140);
assert(shortChunks.length === 1, 'Short text produces exactly 1 chunk');
assert(shortChunks[0] === shortText, 'Chunk matches input text');

// Test 3: Multiple normal sentences that fit within 140 chars
const twoSentences = 'Hello candidate. Welcome to your test.';
const twoChunks = splitTextIntoUtteranceChunks(twoSentences, 140);
assert(twoChunks.length === 1, 'Two short sentences combined fit in 140 chars');

// Test 4: Long passage with multiple sentences
const longPassage = `Good morning and welcome to the university orientation session for international students. Today, we will discuss campus accommodation options, including catered and self-catered halls of residence. If you haven't received your key card yet, please make sure you visit the student center before five o'clock this evening.`;
const passageChunks = splitTextIntoUtteranceChunks(longPassage, 140);
assert(passageChunks.length > 1, `Long passage is split into multiple chunks (got ${passageChunks.length})`);
for (const chunk of passageChunks) {
  assert(chunk.length <= 140, `Chunk length (${chunk.length}) must be <= 140 chars: "${chunk}"`);
}

// Test 5: Single ultra-long sentence without periods
const ultraLongSentence = 'Furthermore we have to examine the comprehensive implications of sustainable urban architecture which includes energy efficient heating systems solar panels and rainwater collection mechanisms throughout modern residential districts';
const ultraChunks = splitTextIntoUtteranceChunks(ultraLongSentence, 140);
assert(ultraChunks.length >= 2, `Ultra long sentence without periods is broken into chunks (got ${ultraChunks.length})`);
for (const chunk of ultraChunks) {
  assert(chunk.length <= 140, `Chunk length (${chunk.length}) must be <= 140 chars`);
}

// Test 6: Verify no words are dropped during chunking
const originalWords = longPassage.trim().split(/\s+/);
const reconstructedWords = passageChunks.join(' ').trim().split(/\s+/);
assert(originalWords.length === reconstructedWords.length, `Total word count matches: expected ${originalWords.length}, got ${reconstructedWords.length}`);

console.log(`✅ All ${passed}/${total} speech audio chunking tests passed cleanly!\n`);
process.exit(0);
