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
