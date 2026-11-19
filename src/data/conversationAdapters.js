/**
 * src/data/conversationAdapters.js
 *
 * Dynamic Adapters that transform existing website resources into playable
 * turn-gated conversations without duplicating content:
 * 1. Speaking Topics Bank (speakingTopics.js) -> Examiner <-> Candidate dialogues
 * 2. Cambridge Listening R2 Tracks -> Real studio audio segments + Karaoke timestamps
 */

import { parseTranscriptStringToKaraoke } from '../utils/transcriptParser.js';

/**
 * Splits a long sample answer into natural conversational turns (10-24 words per turn)
 * so learners can pass pronunciation gating smoothly without STT timeouts.
 */
function splitAnswerIntoManageableTurns(sampleText = '') {
  const rawSentences = String(sampleText || '')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (rawSentences.length === 0) return [];

  // Keep up to 2 concise sentences (or 1 long sentence) per turn
  const chunks = [];
  let buffer = '';
  for (const s of rawSentences) {
    const candidate = buffer ? `${buffer} ${s}` : s;
    const wordCount = candidate.split(/\s+/).filter(Boolean).length;
    if (buffer && wordCount > 24) {
      chunks.push(buffer);
      buffer = s;
    } else {
      buffer = candidate;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks.slice(0, 2); // Keep each topic concise (4-6 total turns)
}

/**
 * Converts Speaking Part 1 & Part 3 topics into interactive Examiner <-> Candidate conversations.
 */
export function buildSpeakingTopicConversations(part1Topics = [], part3Topics = []) {
  const scenarios = [];

  (part1Topics || []).slice(0, 4).forEach((topic) => {
    const turns = [];
    (topic.questions || []).slice(0, 3).forEach((q, idx) => {
      if (!q?.question || !q?.sampleAnswer) return;
      turns.push({
        id: `${topic.id}-q${idx + 1}`,
        speaker: 'A',
        text: q.question,
        meaningEn: q.focus || 'IELTS Speaking Part 1 prompt',
        meaningVi: q.strategy || q.focus || 'Câu hỏi IELTS Speaking Part 1',
        mouthTipEn: 'Listen for the examiner’s stress on key content words.',
        mouthTipVi: 'Lắng nghe trọng âm của giám khảo ở các từ khóa chính.'
      });

      const answerParts = splitAnswerIntoManageableTurns(q.sampleAnswer);
      answerParts.forEach((ansText, partIdx) => {
        turns.push({
          id: `${topic.id}-a${idx + 1}-${partIdx + 1}`,
          speaker: 'B',
          text: ansText,
          meaningEn: partIdx === 0 ? 'Model Band 7.5+ opening answer' : 'Supporting detail & natural extension',
          meaningVi: partIdx === 0 ? 'Câu trả lời mẫu mở đầu Band 7.5+' : 'Ý mở rộng tự nhiên chuẩn Band 7.5+',
          mouthTipEn: 'Maintain steady rhythm and pronounce final consonants (/s/, /t/, /d/) clearly.',
          mouthTipVi: 'Giữ nhịp đều và bật rõ phụ âm cuối (/s/, /t/, /d/).',
          vocabHints: partIdx === 0 ? (q.vocabHints || []) : []
        });
      });
    });

    if (turns.length >= 4) {
      scenarios.push({
        id: `conv-sp1-${topic.id}`,
        track: 'ielts',
        bandLevel: '7.5',
        sourceTag: 'Speaking Bank',
        titleEn: `Speaking Part 1: ${topic.title}`,
        titleVi: `Speaking Part 1: ${topic.title}`,
        contextEn: `Adapted from IELTS Speaking Bank (${topic.category || 'Part 1'}). Practice natural Part 1 answers with pronunciation gating.`,
        contextVi: `Chuyển thể từ Kho Đề Speaking (${topic.category || 'Part 1'}). Luyện trả lời trôi chảy và chuẩn phát âm.`,
        roles: {
          A: { nameEn: 'Examiner', nameVi: 'Giám khảo IELTS', avatar: '🎓' },
          B: { nameEn: 'Candidate', nameVi: 'Thí sinh', avatar: '🎙️' }
        },
        defaultUserRole: 'B',
        xpReward: 105,
        turns
      });
    }
  });

  (part3Topics || []).slice(0, 2).forEach((topic) => {
    const turns = [];
    (topic.questions || []).slice(0, 3).forEach((q, idx) => {
      if (!q?.question || !q?.sampleAnswer) return;
      turns.push({
        id: `${topic.id}-p3-q${idx + 1}`,
        speaker: 'A',
        text: q.question,
        meaningEn: q.focus || 'IELTS Speaking Part 3 analytical prompt',
        meaningVi: q.strategy || q.focus || 'Câu hỏi phân tích IELTS Speaking Part 3',
        mouthTipEn: 'Notice rising/falling intonation on analytical questions.',
        mouthTipVi: 'Chú ý ngữ điệu lên/xuống ở câu hỏi phân tích.'
      });

      const answerParts = splitAnswerIntoManageableTurns(q.sampleAnswer);
      answerParts.forEach((ansText, partIdx) => {
        turns.push({
          id: `${topic.id}-p3-a${idx + 1}-${partIdx + 1}`,
          speaker: 'B',
          text: ansText,
          meaningEn: 'Band 8.0+ analytical Part 3 response',
          meaningVi: 'Câu trả lời phân tích Band 8.0+ Part 3',
          mouthTipEn: 'Emphasize linking words and abstract academic vocabulary.',
          mouthTipVi: 'Nhấn rõ từ nối lập luận và từ vựng học thuật.'
        });
      });
    });

    if (turns.length >= 4) {
      scenarios.push({
        id: `conv-sp3-${topic.id}`,
        track: 'ielts',
        bandLevel: '8.0',
        sourceTag: 'Speaking Bank',
        titleEn: `Speaking Part 3: ${topic.title}`,
        titleVi: `Speaking Part 3: ${topic.title}`,
        contextEn: `Adapted from IELTS Speaking Part 3 Bank. Build fluency and phonological precision on abstract topics.`,
        contextVi: `Chuyển thể từ Kho Đề Speaking Part 3. Rèn độ chuẩn âm trên chủ đề học thuật.`,
        roles: {
          A: { nameEn: 'Examiner', nameVi: 'Giám khảo IELTS', avatar: '🎓' },
          B: { nameEn: 'Candidate', nameVi: 'Thí sinh', avatar: '🎙️' }
        },
        defaultUserRole: 'B',
        xpReward: 120,
        turns
      });
    }
  });

  return scenarios;
}

/**
 * Converts a Listening Track with 2-speaker timestamped transcript & Cloudflare R2 MP3
 * into an interactive Hybrid Audio conversation (real studio voice for Partner turns + TTS fallback).
 */
function buildListeningTrackConversation({
  trackObj,
  id,
  trackCategory = 'daily',
  bandLevel = '6.5',
  titleEn,
  titleVi,
  contextEn,
  contextVi,
  roleA,
  roleB,
  maxTurns = 8,
  skipFirstNarrator = true
}) {
  const part = trackObj?.parts?.[0];
  if (!part?.transcript || !trackObj?.audioUrl) return null;

  const parsed = parseTranscriptStringToKaraoke(part.transcript, part.audioTimestampEnd || 180);
  const dialogueLines = parsed.filter((item) => {
    if (skipFirstNarrator && item.speaker === 'Narrator') return false;
    if (/^(track|part|section|conversation|discussion)\s+\d+/i.test(item.text)) return false;
    return item.text && item.text.split(/\s+/).length >= 2;
  });

  if (dialogueLines.length < 4) return null;

  const selectedLines = dialogueLines.slice(0, maxTurns);
  const turns = selectedLines.map((line, idx) => {
    // Alternate speakers cleanly for natural turn-taking if speaker label wasn't explicit
    const speaker = idx % 2 === 0 ? 'A' : 'B';
    // Split overly long lines (> 28 words) to first sentence for smooth STT evaluation
    let cleanText = line.text;
    if (cleanText.split(/\s+/).length > 28) {
      const firstSentence = cleanText.match(/^[^.!?]+[.!?]/);
      if (firstSentence && firstSentence[0].split(/\s+/).length >= 6) {
        cleanText = firstSentence[0].trim();
      }
    }

    return {
      id: `${id}-t${idx + 1}`,
      speaker,
      text: cleanText,
      audioStartSec: line.start,
      audioEndSec: line.end,
      meaningEn: `Listening Studio line (${line.speaker || (speaker === 'A' ? roleA.nameEn : roleB.nameEn)})`,
      meaningVi: `Lời thoại phòng thu Listening (${line.speaker || (speaker === 'A' ? roleA.nameVi : roleB.nameVi)})`,
      mouthTipEn: 'Match the native studio pacing and clear word endings.',
      mouthTipVi: 'Bám sát nhịp độ giọng thu âm chuẩn và bật rõ âm cuối.'
    };
  });

  return {
    id,
    track: trackCategory,
    bandLevel,
    sourceTag: 'Studio Audio R2',
    audioUrl: trackObj.audioUrl,
    fallbackAudioUrl: trackObj.fallbackAudioUrl || trackObj.audioUrl,
    titleEn,
    titleVi,
    contextEn,
    contextVi,
    roles: {
      A: roleA,
      B: roleB
    },
    defaultUserRole: 'B',
    xpReward: 100,
    turns
  };
}

let cachedDynamicConversations = null;

/**
 * Lazily loads and caches dynamic conversations from Speaking Topics & Listening R2 Tracks.
 */
export async function loadDynamicConversations() {
  if (cachedDynamicConversations) return cachedDynamicConversations;

  const results = [];

  try {
    const [
      speakingMod,
      track3Mod,
      track8Mod,
      track30Mod
    ] = await Promise.all([
      import('./speakingTopics.js'),
      import('./listening/track3PropertyEnquiry.js'),
      import('./listening/track8StudentAccommodation.js'),
      import('./listening/track30TransportConversations.js')
    ]);

    // 1. Listening Studio Audio R2 Conversations
    const r2Tracks = [
      buildListeningTrackConversation({
        trackObj: track3Mod.track3PropertyEnquiry,
        id: 'conv-r2-property',
        trackCategory: 'daily',
        bandLevel: '6.5',
        titleEn: 'Property Enquiry & Viewing Call (Studio Audio)',
        titleVi: 'Gọi Điện Hẹn Xem Nhà Thuê (Audio Phòng Thu)',
        contextEn: 'Real Cambridge Listening Track 3 dialogue between an estate agent and a prospective buyer.',
        contextVi: 'Hội thoại thật từ Listening Track 3 giữa môi giới bất động sản và người mua nhà.',
        roleA: { nameEn: 'Peter (Agent)', nameVi: 'Peter (Môi giới)', avatar: '🏠' },
        roleB: { nameEn: 'Caroline (Buyer)', nameVi: 'Caroline (Khách mua)', avatar: '📞' },
        maxTurns: 8
      }),
      buildListeningTrackConversation({
        trackObj: track8Mod.track8StudentAccommodation,
        id: 'conv-r2-housing',
        trackCategory: 'ielts',
        bandLevel: '6.5',
        titleEn: 'Student Housing Interview (Studio Audio)',
        titleVi: 'Phỏng Vấn Chỗ Ở Sinh Viên (Audio Phòng Thu)',
        contextEn: 'Real Cambridge Listening Track 8 interview about shared housing and city commutes.',
        contextVi: 'Hội thoại thật từ Listening Track 8 về nhà ở sinh viên và đi lại trong thành phố.',
        roleA: { nameEn: 'Interviewer', nameVi: 'Người phỏng vấn', avatar: '🎙️' },
        roleB: { nameEn: 'Student', nameVi: 'Sinh viên', avatar: '🎒' },
        maxTurns: 8
      }),
      buildListeningTrackConversation({
        trackObj: track30Mod.track30TransportConversations,
        id: 'conv-r2-transport',
        trackCategory: 'daily',
        bandLevel: '6.0',
        titleEn: 'Transit Delays & Train Disruption (Studio Audio)',
        titleVi: 'Xử Lý Trễ Xe Buýt & Đổi Tuyến Tàu (Audio Phòng Thu)',
        contextEn: 'Real Cambridge Listening Track 30 everyday social dialogues on urban transit.',
        contextVi: 'Hội thoại thật từ Listening Track 30 về xử lý sự cố xe buýt và tàu hỏa.',
        roleA: { nameEn: 'Commuter A', nameVi: 'Hành khách A', avatar: '🚌' },
        roleB: { nameEn: 'Commuter B', nameVi: 'Hành khách B', avatar: '🚆' },
        maxTurns: 6
      })
    ].filter(Boolean);

    results.push(...r2Tracks);

    // 2. Speaking Bank Part 1 & Part 3 Conversations
    const speakingConvs = buildSpeakingTopicConversations(
      speakingMod.SPEAKING_PART1_TOPICS || [],
      speakingMod.SPEAKING_PART3_QUESTIONS || []
    );
    results.push(...speakingConvs);
  } catch (err) {
    console.warn('[ConversationAdapters] Partial dynamic load notice:', err);
  }

  cachedDynamicConversations = results;
  return results;
}
