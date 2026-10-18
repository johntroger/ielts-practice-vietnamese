import assert from 'node:assert';
import { 
  parseTimestampToSeconds, 
  formatSecondsToTimestamp, 
  parseTranscriptStringToKaraoke, 
  getEffectiveTranscripts 
} from '../src/utils/transcriptParser.js';
import { track37AshtownUrbanTransformation } from '../src/data/listening/track37AshtownUrbanTransformation.js';

console.log('--- Step 190: Listening Transcript Parser & Fallback Test ---');

// 1. Test parseTimestampToSeconds
assert.strictEqual(parseTimestampToSeconds('00:00'), 0);
assert.strictEqual(parseTimestampToSeconds('01:30'), 90);
assert.strictEqual(parseTimestampToSeconds('02:08.5'), 128.5);
assert.strictEqual(parseTimestampToSeconds('01:02:03'), 3723);
console.log('✓ parseTimestampToSeconds passed');

// 2. Test formatSecondsToTimestamp
assert.strictEqual(formatSecondsToTimestamp(0), '00:00');
assert.strictEqual(formatSecondsToTimestamp(90), '01:30');
assert.strictEqual(formatSecondsToTimestamp(128), '02:08');
console.log('✓ formatSecondsToTimestamp passed');

// 3. Test parseTranscriptStringToKaraoke with raw dialogue string
const sampleRaw = `[00:00] Track 1.
[00:02] Jane: Have you got the results, Bill?
[00:10] Bill: Yes, Jane. There were many changes.`;

const parsed = parseTranscriptStringToKaraoke(sampleRaw, 30);
assert.strictEqual(parsed.length, 3);
assert.strictEqual(parsed[0].start, 0);
assert.strictEqual(parsed[0].end, 2);
assert.strictEqual(parsed[0].speaker, 'Narrator');
assert.strictEqual(parsed[0].text, 'Track 1.');

assert.strictEqual(parsed[1].start, 2);
assert.strictEqual(parsed[1].end, 10);
assert.strictEqual(parsed[1].speaker, 'Jane');
assert.strictEqual(parsed[1].text, 'Have you got the results, Bill?');

assert.strictEqual(parsed[2].start, 10);
assert.strictEqual(parsed[2].end, 30);
assert.strictEqual(parsed[2].speaker, 'Bill');
assert.strictEqual(parsed[2].text, 'Yes, Jane. There were many changes.');
console.log('✓ parseTranscriptStringToKaraoke with speaker names passed');

// 4. Test Track 37 Part 1 & Part 2 with getEffectiveTranscripts
const t37Part1 = track37AshtownUrbanTransformation.parts[0];
const t37Part1Transcripts = getEffectiveTranscripts(t37Part1);

assert.ok(Array.isArray(t37Part1Transcripts), 'Track 37 Part 1 transcripts should be an array');
assert.ok(t37Part1Transcripts.length >= 8, `Track 37 Part 1 should produce at least 8 sentences, got ${t37Part1Transcripts.length}`);

// Check that Jane and Bill are recognized as speakers
const speakersP1 = new Set(t37Part1Transcripts.map(s => s.speaker));
assert.ok(speakersP1.has('Jane'), 'Should detect Jane as speaker');
assert.ok(speakersP1.has('Bill'), 'Should detect Bill as speaker');
assert.strictEqual(t37Part1Transcripts[1].speaker, 'Jane');
assert.ok(t37Part1Transcripts[1].text.includes('Have you got the results from the survey'));
console.log('✓ Track 37 Part 1 getEffectiveTranscripts passed (found ' + t37Part1Transcripts.length + ' sentences)');

// 5. Test Track 37 Part 2
const t37Part2 = track37AshtownUrbanTransformation.parts[1];
const t37Part2Transcripts = getEffectiveTranscripts(t37Part2);
assert.ok(Array.isArray(t37Part2Transcripts), 'Track 37 Part 2 transcripts should be an array');
assert.ok(t37Part2Transcripts.length >= 8, `Track 37 Part 2 should produce at least 8 sentences, got ${t37Part2Transcripts.length}`);

const speakersP2 = new Set(t37Part2Transcripts.map(s => s.speaker));
assert.ok(speakersP2.has('Jane'), 'Part 2 should have Jane');
assert.ok(speakersP2.has('Bill'), 'Part 2 should have Bill');
assert.strictEqual(t37Part2Transcripts[0].start, 128); // 02:08
assert.ok(t37Part2Transcripts[0].text.includes('Okay. Now shall we have a look at how some of the buildings have changed?'));
console.log('✓ Track 37 Part 2 getEffectiveTranscripts passed (found ' + t37Part2Transcripts.length + ' sentences)');

// 6. Test edge case: part with pre-existing transcripts array takes precedence
const preExistingPart = {
  transcripts: [{ start: 5, end: 15, speaker: 'Host', text: 'Pre-existing array' }],
  transcript: '[00:00] Old string'
};
const effectivePreExisting = getEffectiveTranscripts(preExistingPart);
assert.strictEqual(effectivePreExisting.length, 1);
assert.strictEqual(effectivePreExisting[0].text, 'Pre-existing array');
console.log('✓ Pre-existing transcripts precedence passed');

// 7. Test edge case: null or undefined part
assert.deepStrictEqual(getEffectiveTranscripts(null), []);
assert.deepStrictEqual(getEffectiveTranscripts({}), []);
console.log('✓ Null / empty object handling passed');

console.log('ALL Step 190 assertions passed successfully!');
