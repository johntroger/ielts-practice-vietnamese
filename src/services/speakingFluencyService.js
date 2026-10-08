/**
 * Speaking Fluency & Filler Words Diagnostic Service
 * Analyzes transcripts for hesitations, fillers, and rate per minute.
 */
import { FILLER_REGEX } from './algorithmicSpeakingService.js';

/**
 * Natural Cambridge Buying-Time Phrases to Replace Filler Words
 */
export const NATURAL_BUYING_TIME_PHRASES = [
  { filler: 'um / uh', replacement: '"Well, to be perfectly honest..."', purpose: 'Câu giờ khi bắt đầu suy nghĩ' },
  { filler: 'like', replacement: '"for instance..." / "such as..."', purpose: 'Đưa ví dụ minh họa chuẩn xác' },
  { filler: 'you know', replacement: '"as is widely acknowledged..."', purpose: 'Khẳng định điều phổ biến' },
  { filler: 'sort of / kind of', replacement: '"to some extent..." / "in a sense..."', purpose: 'Diễn tả mức độ học thuật' },
  { filler: 'actually / basically', replacement: '"fundamentally speaking..." / "in reality..."', purpose: 'Nhấn mạnh thực tế khách quan' }
];

/**
 * Analyzes transcript for classical filler words and calculates frequency/density.
 * @param {string} transcript 
 * @param {number} durationSec 
 * @returns {object} Analysis details
 */
export function analyzeFillerWords(transcript, durationSec = 30) {
  if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
    return {
      totalWords: 0,
      totalFillers: 0,
      fillerBreakdown: {},
      fillerRatePerMin: 0,
      fillerDensityPercent: 0,
      status: 'clean', // 'clean' | 'moderate' | 'high'
      statusLabel: 'Chưa có dữ liệu',
      warningMessage: null
    };
  }

  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const matches = transcript.match(FILLER_REGEX) || [];
  const totalFillers = matches.length;

  // Breakdown by individual filler word
  const fillerBreakdown = {};
  matches.forEach(m => {
    const norm = m.toLowerCase().replace(/\s+/g, ' ');
    fillerBreakdown[norm] = (fillerBreakdown[norm] || 0) + 1;
  });

  const effectiveDurationMin = Math.max(0.15, (durationSec || 30) / 60);
  const fillerRatePerMin = Number((totalFillers / effectiveDurationMin).toFixed(1));
  const fillerDensityPercent = totalWords > 0 ? Math.round((totalFillers / totalWords) * 100) : 0;

  let status = 'clean';
  let statusLabel = 'Độ trôi chảy xuất sắc (Ít từ đệm)';
  let warningMessage = null;

  if (fillerRatePerMin > 5.0 || fillerDensityPercent > 8) {
    status = 'high';
    statusLabel = 'Cảnh báo: Lạm dụng từ đệm';
    warningMessage = `Phát hiện ${totalFillers} từ đệm (${fillerRatePerMin} từ/phút). Nguy cơ bị giám khảo Cambridge trừ điểm và giới hạn Fluency & Coherence ở mức Band 5.0 - 5.5!`;
  } else if (fillerRatePerMin >= 2.5 || fillerDensityPercent >= 4) {
    status = 'moderate';
    statusLabel = 'Từ đệm ở mức trung bình';
    warningMessage = `Xuất hiện ${totalFillers} từ đệm (${fillerRatePerMin} từ/phút). Hãy thay thế bằng khoảng dừng tĩnh 1 giây để đạt Band 7.0+ Fluency.`;
  } else {
    status = 'clean';
    statusLabel = totalFillers === 0 ? 'Hoàn hảo: Không có từ đệm' : 'Trôi chảy rất tốt (Chuẩn Band 7.5 - 8.0+)';
    warningMessage = null;
  }

  return {
    totalWords,
    totalFillers,
    fillerBreakdown,
    fillerRatePerMin,
    fillerDensityPercent,
    status,
    statusLabel,
    warningMessage
  };
}

/**
 * 4 Golden Pacing Phases for IELTS Speaking Part 2
 * Standard Cambridge Long Turn timing framework.
 */
export const PACING_PHASES = [
  {
    phase: 1,
    id: 'context',
    start: 0,
    end: 30,
    duration: 30,
    titleVi: 'Chặng 1: Mở Đầu & Bối Cảnh',
    titleEn: 'Phase 1: Context & Hook',
    bulletTarget: 'Who, Where, When',
    badgeColor: 'emerald',
    barColor: 'bg-emerald-500',
    strategyVi: 'Nói thong thả, hít thở đều. Giới thiệu bối cảnh, nhân vật, thời gian hoặc địa điểm. Đừng vội vã.',
    strategyEn: 'Speak smoothly, breathe calmly. Introduce the background, characters, time, or location. Do not rush.'
  },
  {
    phase: 2,
    id: 'narrative',
    start: 30,
    end: 75,
    duration: 45,
    titleVi: 'Chặng 2: Diễn Biến & Chi Tiết Cốt Lõi',
    titleEn: 'Phase 2: Core Narrative & Details',
    bulletTarget: 'What happened, How',
    badgeColor: 'blue',
    barColor: 'bg-blue-500',
    strategyVi: 'Đi sâu vào chi tiết câu chuyện. Sử dụng các câu ghép, câu phức và tính từ miêu tả cụ thể.',
    strategyEn: 'Delve into the core narrative. Use compound and complex sentences with precise descriptive adjectives.'
  },
  {
    phase: 3,
    id: 'climax',
    start: 75,
    end: 105,
    duration: 30,
    titleVi: 'Chặng 3: Cao Trào & Điểm Nhấn',
    titleEn: 'Phase 3: Climax & Turning Point',
    bulletTarget: 'Why it was memorable',
    badgeColor: 'amber',
    barColor: 'bg-amber-500',
    strategyVi: 'Kể về khó khăn vượt qua hoặc khoảnh khắc ấn tượng nhất. Nâng ngữ điệu biểu cảm (Intonation)!',
    strategyEn: 'Describe obstacles overcome or the most vivid highlight. Elevate expressive intonation!'
  },
  {
    phase: 4,
    id: 'reflection',
    start: 105,
    end: 120,
    duration: 15,
    titleVi: 'Chặng 4: Bài Học & Đúc Kết',
    titleEn: 'Phase 4: Reflective Wrap-up',
    bulletTarget: 'Feelings, Lessons',
    badgeColor: 'rose',
    barColor: 'bg-rose-500',
    strategyVi: 'Đúc kết bài học hoặc cảm xúc ("All in all, this taught me..."). Kết bài tròn vẹn trước khi giám khảo ngắt lời!',
    strategyEn: 'Conclude with lessons or emotions ("All in all, this taught me..."). Finish smoothly before examiner stops you!'
  }
];

/**
 * Helper: Identify active phase based on seconds elapsed
 */
export function getActivePacingPhase(secondsElapsed = 0) {
  const sec = Math.max(0, Math.min(120, Number(secondsElapsed) || 0));
  if (sec <= 30) return PACING_PHASES[0];
  if (sec <= 75) return PACING_PHASES[1];
  if (sec <= 105) return PACING_PHASES[2];
  return PACING_PHASES[3];
}

/**
 * Helper: Assess fluency safe zone status
 */
export function getFluencySafeZone(secondsElapsed = 0) {
  const sec = Number(secondsElapsed) || 0;
  if (sec < 75) {
    return {
      status: 'under_time',
      label: 'Non giờ (< 1:15)',
      labelEn: 'Under Time (< 1:15)',
      badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-700/60',
      adviceVi: 'Nói dưới 1:15 khiến giám khảo phải im lặng chờ bạn, nguy cơ kẹt ở Band 5.0 Fluency.',
      adviceEn: 'Speaking under 1:15 leaves awkward silence; risk of being capped at Band 5.0 Fluency.',
      isUnderDanger: sec < 45,
      isWarning: sec >= 45 && sec < 75,
      isSafe: false,
      isMastery: false,
      isOver: false
    };
  }
  if (sec < 105) {
    return {
      status: 'safe_zone',
      label: 'Vùng An Toàn (1:15 - 1:45)',
      labelEn: 'Safe Zone (1:15 - 1:45)',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
      adviceVi: 'Đã đạt thời lượng an toàn cho Band 6.5 - 7.0. Tiếp tục nói để chạm mốc xuất sắc.',
      adviceEn: 'Met safe duration for Band 6.5 - 7.0. Continue speaking to reach mastery.',
      isUnderDanger: false,
      isWarning: false,
      isSafe: true,
      isMastery: false,
      isOver: false
    };
  }
  if (sec <= 120) {
    return {
      status: 'mastery',
      label: 'Chuẩn Xuất Sắc (1:45 - 2:00)',
      labelEn: 'Mastery Standard (1:45 - 2:00)',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      adviceVi: 'Tuyệt vời! Bạn đã hoàn thành trọn vẹn 2 phút chuẩn Cambridge Band 7.5 - 8.5+.',
      adviceEn: 'Excellent! You fulfilled the full 2-minute Cambridge Band 7.5 - 8.5+ benchmark.',
      isUnderDanger: false,
      isWarning: false,
      isSafe: true,
      isMastery: true,
      isOver: false
    };
  }
  return {
    status: 'over_time',
    label: 'Hết Giờ (> 2:00)',
    labelEn: 'Time Up (> 2:00)',
    badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    adviceVi: 'Giám khảo sẽ ngắt lời tại giây 120. Bài thi không bị trừ điểm nếu bạn đã kết bài.',
    adviceEn: 'Examiner stops you at 120s. No penalty if your concluding thought is reached.',
    isUnderDanger: false,
    isWarning: false,
    isSafe: true,
    isMastery: true,
    isOver: true
  };
}

