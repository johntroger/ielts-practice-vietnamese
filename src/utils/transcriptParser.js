/**
 * Transcript Parsing & Formatting Engine for IELTS Listening
 * Converts timestamped transcript strings into structured sentence arrays for Interactive Karaoke.
 */

/**
 * Parses timestamp string "MM:SS" or "HH:MM:SS" into total seconds.
 * Supports decimal seconds (e.g. "01:23.50").
 */
export function parseTimestampToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  return Number(timeStr) || 0;
}

/**
 * Formats total seconds into "MM:SS" string.
 */
export function formatSecondsToTimestamp(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Auto-parses raw transcript text with timestamps like:
 * "[00:02] Jane: Have you got the results... \n[00:10] Bill: Yes, Jane..."
 * into an array of sentence objects:
 * [{ start: 2, end: 10, speaker: "Jane", text: "Have you got the results..." }]
 */
export function parseTranscriptStringToKaraoke(transcriptText, audioTimestampEnd = null, defaultSpeaker = 'Speaker') {
  if (!transcriptText || typeof transcriptText !== 'string') return [];

  // Regex matches [MM:SS] or [HH:MM:SS] (with optional decimals)
  const timestampRegex = /\[(\d{1,2}:(?:\d{2}:)?\d{2}(?:\.\d+)?)\]/g;
  const matches = [];
  let match;

  while ((match = timestampRegex.exec(transcriptText)) !== null) {
    matches.push({
      timeStr: match[1],
      index: match.index,
      length: match[0].length
    });
  }

  // If no timestamp tags found, return a single block if text exists
  if (matches.length === 0) {
    const clean = transcriptText.trim();
    if (!clean) return [];
    return [{
      start: 0,
      end: typeof audioTimestampEnd === 'number' && audioTimestampEnd > 0 ? audioTimestampEnd : 60,
      speaker: defaultSpeaker,
      text: clean
    }];
  }

  const result = [];

  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const textStart = cur.index + cur.length;
    const textEnd = next ? next.index : transcriptText.length;
    const rawContent = transcriptText.substring(textStart, textEnd).trim();

    if (!rawContent) continue;

    let speaker = defaultSpeaker;
    let text = rawContent;

    // Check if rawContent starts with Speaker:
    // Regex looks for "Speaker Name:" followed by non-empty text
    const speakerMatch = rawContent.match(/^([A-Za-z0-9\s'.-]{1,35}):\s+([\s\S]+)$/);
    if (speakerMatch) {
      speaker = speakerMatch[1].trim();
      text = speakerMatch[2].trim();
    } else if (/^(track\s+\d+|part\s+\d+|section\s+\d+|conversation\s+\d+)/i.test(rawContent)) {
      speaker = 'Narrator';
    }

    const startSec = parseTimestampToSeconds(cur.timeStr);
    let endSec;

    if (next) {
      endSec = parseTimestampToSeconds(next.timeStr);
      // Fallback if timestamps are equal or out of order
      if (endSec <= startSec) {
        endSec = startSec + 4;
      }
    } else {
      // Last sentence duration calculation
      if (typeof audioTimestampEnd === 'number' && audioTimestampEnd > startSec) {
        endSec = audioTimestampEnd;
      } else {
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        const estimatedDuration = Math.min(Math.max(Math.ceil(wordCount / 2.5), 4), 25);
        endSec = startSec + estimatedDuration;
      }
    }

    // Normalize internal whitespaces and linebreaks into clean single spaces
    text = text.replace(/\s+/g, ' ').trim();

    result.push({
      start: startSec,
      end: endSec,
      speaker,
      text
    });
  }

  return result;
}

/**
 * Universal helper that retrieves parsed karaoke sentences for any listening part.
 * Checks for pre-computed `partData.transcripts` array first.
 * If absent or empty, falls back to parsing `partData.transcript` string on-the-fly.
 */
export function getEffectiveTranscripts(partData) {
  if (!partData) return [];
  if (Array.isArray(partData.transcripts) && partData.transcripts.length > 0) {
    return partData.transcripts;
  }
  if (typeof partData.transcript === 'string' && partData.transcript.trim()) {
    return parseTranscriptStringToKaraoke(partData.transcript, partData.audioTimestampEnd);
  }
  return [];
}
