/**
 * scripts/build-pronunciation-bank-shards.mjs
 *
 * Build-time Sharding Pipeline for Scalable Pronunciation Banks (1,000 -> 22,000+ items).
 * Reads canonical vocabulary sources (starting with Harold Levine 22,000 Essential Words),
 * sanitizes OCR typos, enforces 100% English-only fields for Global English UI,
 * deduplicates against built-in curated drills, and outputs:
 *   - public/data/banks/pron_words/manifest.json + shard-001.json ...
 *   - public/data/banks/pron_sentences/manifest.json + shard-001.json ...
 *
 * Usage:
 *   npm run banks:build
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HAROLD_LEVINE_22000_DECKS } from '../src/data/haroldLevine22000Data.js';
import {
  PRONUNCIATION_WORD_DRILLS,
  PRONUNCIATION_SENTENCE_DRILLS
} from '../src/data/pronunciationData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BANKS_ROOT = path.join(ROOT_DIR, 'public', 'data', 'banks');

const SHARD_SIZE = 100;

const VI_CHAR_REGEX =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

const OCR_TYPO_FIXES = [
  [/\bApprehed\b/g, 'Apprehend'],
  [/\bborken\b/gi, 'broken'],
  [/\bPrirate\b/g, 'Pirate'],
  [/\bforeited\b/g, 'forfeited'],
  [/\bgovernement\b/g, 'government'],
  [/\bmemebers\b/g, 'members'],
  [/\bFobid\b/g, 'Forbid'],
  [/\bdiapproval\b/g, 'disapproval'],
  [/\bplayinjg\b/g, 'playing'],
  [/\bboserye\b/g, 'observe'],
  [/\bacclient\b/g, 'accident'],
  [/\bsubstitude\b/g, 'substitute'],
  [/\breparing\b/g, 'repairing'],
  [/\bLierally\b/g, 'Literally'],
  [/\bhe cam over\b/g, 'he came over'],
  [/\bwill only aggravated it\b/g, 'will only aggravate it'],
  [/\bwil be glad\b/g, 'will be glad'],
  [/\bwater shortage in abating\b/g, 'water shortage is abating'],
  [/\bcrowed\b/g, 'crowded'],
  [/\brelinquished he seat\b/g, 'relinquished his seat'],
  [/\bMidred\b/g, 'Mildred'],
  [/\bSabdra\b/g, 'Sandra'],
  [/\bShakespear\b/g, 'Shakespeare'],
  [/\bwith out\b/gi, 'without'],
  [/&rdquo;?/g, '"'],
  [/&ldquo;?/g, '"'],
  [/\.\,\/$/g, '.']
];

function applyOcrFixes(text = '') {
  let out = String(text || '');
  for (const [pattern, replacement] of OCR_TYPO_FIXES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

function cleanWhitespace(text = '') {
  return String(text || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTerm(raw = '') {
  let t = applyOcrFixes(raw);
  // Remove leading numbers, punctuation, stray symbols
  t = t.replace(/^\d+\s*[.)-]?\s*/, '');
  t = t.replace(/\(.*?\)/g, '');
  t = t.replace(/\[.*?\]/g, '');
  t = t.replace(/[/:;=]+.*$/, '');
  t = cleanWhitespace(t);
  return t;
}

function isValidEnglishTerm(term = '') {
  if (!term || term.length < 3 || term.length > 36) return false;
  if (VI_CHAR_REGEX.test(term)) return false;
  if (!/^[A-Za-z][A-Za-z\s'-]*[A-Za-z]$/.test(term)) return false;
  const wordCount = term.split(/\s+/).length;
  if (wordCount > 2) return false;
  return true;
}

function cleanIpa(raw = '', fallbackWord = '') {
  let ipa = String(raw || '').trim();
  if (!ipa) return '';
  // Remove corrupt emoji/control chars and Vietnamese notes inside IPA
  ipa = ipa
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[☺😎🙂😉😂😊👍Ý]/g, '')
    .replace(/đ/g, 'ð')
    .replace(/∫/g, 'ʃ')
    .replace(/η/g, 'ŋ')
    .replace(/’/g, 'ˈ')
    .replace(/'/g, 'ˈ')
    .replace(/,/g, 'ˌ')
    .replace(/\s+/g, ' ')
    .trim();

  if (VI_CHAR_REGEX.test(ipa)) return '';
  ipa = ipa.replace(/^\/+/, '').replace(/\/+$/, '').trim();
  if (ipa.length < 2 || ipa.length > 48) return '';
  // Reject malformed IPA that looks like prose
  if (ipa.split(' ').length > 3) return '';
  return `/${ipa}/`;
}

function buildSyllablesAndStress(term = '', ipa = '') {
  const cleanWord = String(term || '').trim().toLowerCase();
  const vowelGroups = cleanWord.match(/[aeiouy]+/g) || ['a'];
  const approxSyllables = Math.max(1, Math.min(6, vowelGroups.length));

  if (approxSyllables === 1) {
    return {
      syllables: cleanWord.toUpperCase(),
      stressPattern: '●'
    };
  }

  // Estimate stressed syllable index from primary stress marker ˈ in IPA
  let stressedIdx = 0;
  if (ipa && ipa.includes('ˈ')) {
    const bare = ipa.replace(/^\/|\/$/g, '');
    const stressPos = bare.indexOf('ˈ');
    const ratio = stressPos / Math.max(1, bare.length);
    stressedIdx = Math.min(approxSyllables - 1, Math.max(0, Math.round(ratio * approxSyllables)));
  }

  const pattern = Array.from({ length: approxSyllables }, (_, idx) =>
    idx === stressedIdx ? '●' : '○'
  ).join(' ');

  return {
    syllables: term,
    stressPattern: pattern
  };
}

function sanitizeEnglishMeaning(rawEn = '', wordType = '') {
  let m = applyOcrFixes(rawEn);
  // Strip embedded examples or Vietnamese annotations
  m = m.replace(/\bEx\s*\d*\s*:.*$/i, '');
  m = m.replace(/\[Từ trái nghĩa[^\]]*\]/gi, '');
  m = m.replace(/\[.*?\]/g, '');
  m = m.replace(/\(Nghĩa đen[^)]*\)/gi, '');
  m = m.replace(/\(Từ trái nghĩa[^)]*\)/gi, '');
  m = m.replace(/\([^)]*[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ][^)]*\)/gi, '');
  // If Vietnamese starts after a colon or space, strip from first Vietnamese word onward
  if (VI_CHAR_REGEX.test(m)) {
    const tokens = m.split(/\s+/);
    const firstViIdx = tokens.findIndex(tok => VI_CHAR_REGEX.test(tok));
    if (firstViIdx > 1) {
      m = tokens.slice(0, firstViIdx).join(' ');
    } else {
      m = '';
    }
  }
  m = m.replace(/^[=:\-\s]+/, '').replace(/[:;\-\s]+$/, '');
  m = cleanWhitespace(m);

  if (!m || m.length < 4 || VI_CHAR_REGEX.test(m)) {
    const pos = wordType ? ` (${wordType})` : '';
    return `High-frequency academic IELTS vocabulary item${pos} from the Harold Levine curriculum.`;
  }
  return m;
}

function sanitizeEnglishExample(rawEx = '') {
  let ex = applyOcrFixes(rawEx);
  // Strip source tags like (Từ sách ), (Từ điển ), (Sách ), (R - T3, page 9), (P 7)
  ex = ex.replace(/^\s*\((?:Từ sách|Từ điển|Sách|R\s*[–-]\s*[^)]+|T\d+[^)]*|P\s*\d+[^)]*)\)\s*/gi, '');
  // Strip bracketed Vietnamese forum notes
  ex = ex.replace(/\[[^\]]*\]/g, '');
  ex = ex.replace(/^\s*Ex\s*\d*\s*:\s*/i, '');
  ex = cleanWhitespace(ex);

  if (!ex || VI_CHAR_REGEX.test(ex)) return '';
  return ex;
}

function isGoodSentenceDrill(sentence = '') {
  if (!sentence || VI_CHAR_REGEX.test(sentence)) return false;
  if (sentence.length < 28 || sentence.length > 185) return false;
  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length < 6 || words.length > 26) return false;
  // Exclude dialogue scripts with "A:" / "B:" / "–" speaker turns
  if (/(?:^|\s)[A-Z][a-z]*\s*:\s*["“]/.test(sentence)) return false;
  // Must end with sentence punctuation
  if (!/[.!?]["”']?$/.test(sentence)) return false;
  // Must not contain weird forum artifacts
  if (/[\[\]{}@#$%^&*_~<>]|=>|\?\!\?/.test(sentence)) return false;
  return true;
}

function normalizeBand(raw = '7.5') {
  const m = String(raw || '7.5').match(/\d+(\.\d+)?/);
  return m ? m[0] : '7.5';
}

function extractTopicEn(topicName = '') {
  const clean = cleanWhitespace(topicName);
  const match = clean.match(/Week\s*(\d+)/i);
  const weekLabel = match ? `Week ${match[1]}` : 'Academic Core';
  if (/Word Roots|Prefixes/i.test(clean)) {
    return `Harold Levine • ${weekLabel} (Roots & Prefixes)`;
  }
  return `Harold Levine • ${weekLabel} (Academic Core)`;
}

function extractTopicVi(topicName = '') {
  const clean = cleanWhitespace(topicName);
  const match = clean.match(/Week\s*(\d+)/i);
  const weekLabel = match ? `Tuần ${match[1]}` : 'Học Thuật Cốt Lõi';
  if (/Word Roots|Prefixes/i.test(clean)) {
    return `Harold Levine • ${weekLabel} (Gốc từ & Tiền tố)`;
  }
  return `Harold Levine • ${weekLabel} (Từ vựng Học thuật)`;
}

function writeShardedTrack({ trackKey, idPrefix, sourceLabel, items }) {
  const trackDir = path.join(BANKS_ROOT, trackKey);
  fs.mkdirSync(trackDir, { recursive: true });

  // Clean old shard files so stale shards never linger
  for (const existing of fs.readdirSync(trackDir)) {
    if (existing.endsWith('.json')) {
      fs.unlinkSync(path.join(trackDir, existing));
    }
  }

  const shardsMeta = [];
  for (let i = 0; i < items.length; i += SHARD_SIZE) {
    const shardIndex = Math.floor(i / SHARD_SIZE);
    const slice = items.slice(i, i + SHARD_SIZE);
    const fileName = `shard-${String(shardIndex + 1).padStart(3, '0')}.json`;
    const filePath = path.join(trackDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(slice), 'utf8');
    shardsMeta.push({
      index: shardIndex,
      file: fileName,
      count: slice.length
    });
  }

  const manifest = {
    version: 1,
    trackKey,
    source: sourceLabel,
    idPrefix,
    totalItems: items.length,
    shardSize: SHARD_SIZE,
    shards: shardsMeta
  };

  fs.writeFileSync(
    path.join(trackDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  return manifest;
}

function buildBanks() {
  const existingWordSet = new Set(
    PRONUNCIATION_WORD_DRILLS.map(d => String(d.targetText || '').toLowerCase().trim())
  );
  const existingSentenceSet = new Set(
    PRONUNCIATION_SENTENCE_DRILLS.map(d => String(d.targetText || '').toLowerCase().trim())
  );

  const wordDrills = [];
  const sentenceDrills = [];

  for (const deck of HAROLD_LEVINE_22000_DECKS) {
    const topicEn = extractTopicEn(deck.topicName);
    const topicVi = extractTopicVi(deck.topicName);

    for (const card of deck.cards || []) {
      const term = cleanTerm(card.term);
      const termKey = term.toLowerCase();
      const bandLevel = normalizeBand(card.bandLevel || card.bandScore);
      const wordType = cleanWhitespace(card.wordType || '').replace(/[^a-zA-Z,.\s]/g, '');
      const ipa = cleanIpa(card.phonetic, term);
      const meaningEn = sanitizeEnglishMeaning(card.meaningEn, wordType);
      const meaningVi = cleanWhitespace(card.meaningVi || '') || meaningEn;
      const exampleEn = sanitizeEnglishExample(card.example);
      const exampleVi = cleanWhitespace(card.exampleVi || '') || exampleEn;

      // 1. Build Word Drill (deduplicated)
      if (isValidEnglishTerm(term) && !existingWordSet.has(termKey)) {
        existingWordSet.add(termKey);
        const seq = String(wordDrills.length + 1).padStart(4, '0');
        const { syllables, stressPattern } = buildSyllablesAndStress(term, ipa);
        wordDrills.push({
          id: `pron-hl-w-${seq}`,
          targetText: term,
          ipa: ipa || `/${term.toLowerCase()}/`,
          stressPattern,
          bandLevel,
          topicEn,
          topicVi,
          meaningEn,
          meaningVi,
          exampleEn: exampleEn || `Academic writers frequently use "${term}" to express ideas with precision.`,
          exampleVi: exampleVi || `Người viết học thuật thường dùng từ "${term}" để diễn đạt ý tưởng chính xác.`
        });
      }

      // 2. Build Sentence Drill (deduplicated, high-quality full academic sentences)
      if (exampleEn && isGoodSentenceDrill(exampleEn)) {
        const sentKey = exampleEn.toLowerCase();
        if (!existingSentenceSet.has(sentKey)) {
          existingSentenceSet.add(sentKey);
          const seq = String(sentenceDrills.length + 1).padStart(4, '0');
          sentenceDrills.push({
            id: `pron-hl-s-${seq}`,
            targetText: exampleEn,
            focusWord: term,
            bandLevel,
            topicEn,
            topicVi,
            meaningEn: `Key word: "${term}" — ${meaningEn}`,
            meaningVi: exampleVi || `Từ khóa: "${term}" — ${meaningVi}`
          });
        }
      }
    }
  }

  // Strict Global English UI Audit before writing
  const enFields = ['targetText', 'meaningEn', 'exampleEn', 'categoryEn', 'topicEn', 'trapEn', 'mouthTipEn'];
  let viLeaks = 0;
  for (const item of [...wordDrills, ...sentenceDrills]) {
    for (const f of enFields) {
      if (item[f] && VI_CHAR_REGEX.test(item[f])) {
        viLeaks++;
        console.error(`[VI LEAK] ${item.id}.${f}:`, item[f]);
      }
    }
  }
  if (viLeaks > 0) {
    throw new Error(`Global English UI Audit failed with ${viLeaks} Vietnamese leaks!`);
  }

  const wordsManifest = writeShardedTrack({
    trackKey: 'pron_words',
    idPrefix: 'pron-hl-w-',
    sourceLabel: 'Harold Levine 22,000 Essential Words (Sanitized)',
    items: wordDrills
  });

  const sentencesManifest = writeShardedTrack({
    trackKey: 'pron_sentences',
    idPrefix: 'pron-hl-s-',
    sourceLabel: 'Harold Levine 22,000 Essential Words Context Sentences (Sanitized)',
    items: sentenceDrills
  });

  console.log('✅ Built sharded pronunciation banks:');
  console.log(`   - pron_words: ${wordsManifest.totalItems} items across ${wordsManifest.shards.length} shards`);
  console.log(`   - pron_sentences: ${sentencesManifest.totalItems} items across ${sentencesManifest.shards.length} shards`);
}

buildBanks();
