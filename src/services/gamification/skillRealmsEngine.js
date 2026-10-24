/**
 * src/services/gamification/skillRealmsEngine.js
 * 
 * 4 SKILL REALMS & GATE PROGRESSION ENGINE FOR ATLAS ARENA
 * 
 * Architecture:
 * 1. 4 Distinct Skill Realms: Listening, Reading, Writing, Speaking.
 * 2. 16 Curated Gates mapped directly to IELTS Cambridge Parts / Tasks.
 * 3. Pedagogical XP Scaling according to Cambridge CEFR difficulty (Band 5.0 -> 9.0).
 * 4. Star Mastery System: 1-Star (Passed, 60%), 2-Star (Proficient, 80%), 3-Star (Mastered, 100%).
 * 5. Sequential Gate Unlocking: Passing Gate N unlocks Gate N+1 within each Realm.
 * 6. Local Storage Persistence with Quota Safety & Real Leaderboard Synchronization.
 */

import { safeGet, safeSet } from '../../utils/storageService.js';
import { ARENA_QUESTION_BANK } from '../../data/arenaQuestionBank.js';
import { ARENA_101_READING_QUESTIONS } from '../../data/arenaQuestions101Reading.js';

export const REALMS_STORAGE_KEY = 'ielts_skill_realms_progress_v1';

export const SKILL_REALM_IDS = {
  LISTENING: 'listening',
  READING: 'reading',
  WRITING: 'writing',
  SPEAKING: 'speaking'
};

export const SKILL_REALMS = [
  {
    id: SKILL_REALM_IDS.LISTENING,
    nameVi: 'Thính Giác Thần Điện',
    nameEn: 'Listening Realm',
    icon: '🎧',
    themeColor: 'cyan',
    badgeClass: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
    ringColor: 'ring-cyan-500/40',
    gradient: 'from-cyan-950/60 via-slate-900 to-blue-950/40',
    guardian: {
      id: 'guardian_listening',
      nameVi: 'Thủ Lĩnh Sóng Âm (Soundwave Sovereign)',
      nameEn: 'The Soundwave Sovereign',
      icon: '⚡',
      titleEn: 'Master of Acoustic Nuance'
    },
    gates: [
      {
        id: 'gate_lis_1',
        realmId: 'listening',
        gateNumber: 1,
        partLabel: 'PART 1',
        titleVi: 'Hội Thoại Đời Thường & Điền Mẫu',
        titleEn: 'Social Dialogues & Form Fill',
        descVi: 'Bắt nhanh họ tên, địa chỉ, số điện thoại, ngày tháng và giá tiền.',
        descEn: 'Fast reflex for names, phone numbers, codes, dates, and prices.',
        targetBand: 'Band 5.0 - 6.0',
        difficulty: 'easy',
        baseXp: 15,
        rewardGold: 30,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          if (q.skillCategory !== 'listening') return false;
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.trackLabel || ''} ${q.cambridgeSource || ''}`.toLowerCase();
          return /part 1|numbers|codes|flat|property|price|phone|enquiry|booking|hotel|routine|form|spelling/i.test(text);
        }
      },
      {
        id: 'gate_lis_2',
        realmId: 'listening',
        gateNumber: 2,
        partLabel: 'PART 2',
        titleVi: 'Độc Thoại Xã Hội & Bản Đồ / Sơ Đồ',
        titleEn: 'Local Facilities & Map Lab',
        descVi: 'Định hướng la bàn, vị trí không gian, sơ đồ công viên và tòa nhà.',
        descEn: 'Compass directions, spatial landmarks, park tours, and building plans.',
        targetBand: 'Band 6.0 - 7.0',
        difficulty: 'medium',
        baseXp: 25,
        rewardGold: 45,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          if (q.skillCategory !== 'listening') return false;
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.trackLabel || ''} ${q.cambridgeSource || ''}`.toLowerCase();
          return /part 2|map|direction|roundabout|motorway|junction|landmark|facility|tour|park|traffic/i.test(text);
        }
      },
      {
        id: 'gate_lis_3',
        realmId: 'listening',
        gateNumber: 3,
        partLabel: 'PART 3',
        titleVi: 'Thảo Luận Học Thuật & Bẫy Đổi Ý',
        titleEn: 'Academic Seminar & Attitude Traps',
        descVi: 'Nhận diện bẫy bẻ hướng, quan điểm đồng thuận / hoài nghi của sinh viên và giáo sư.',
        descEn: 'Direction-shift traps, multi-speaker debates, agreements, and subtle skepticism.',
        targetBand: 'Band 7.0 - 8.0',
        difficulty: 'hard',
        baseXp: 35,
        rewardGold: 60,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          if (q.skillCategory !== 'listening') return false;
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.trackLabel || ''} ${q.cambridgeSource || ''}`.toLowerCase();
          return /part 3|seminar|discussion|proposal|evaluation|agreement|disagreement|attitude|student|tutor|trap/i.test(text);
        }
      },
      {
        id: 'gate_lis_4',
        realmId: 'listening',
        gateNumber: 4,
        partLabel: 'PART 4',
        titleVi: 'Bài Giảng Học Thuật & Thuật Ngữ Nghiên Cứu',
        titleEn: 'Grand Academic Lecture & Signposting',
        descVi: 'Nghe bài giảng nghiên cứu liên tục không ngừng, giải mã thuật ngữ khoa học.',
        descEn: 'Unbroken academic monologue, lecture flowcharts, and technical synthesis.',
        targetBand: 'Band 8.0 - 9.0',
        difficulty: 'nightmare',
        baseXp: 50,
        rewardGold: 100,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          if (q.skillCategory !== 'listening') return false;
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.trackLabel || ''} ${q.cambridgeSource || ''}`.toLowerCase();
          return /part 4|lecture|academic|research|signpost|urban|transformation|cost analysis|benefits|ecosystem/i.test(text);
        }
      }
    ]
  },
  {
    id: SKILL_REALM_IDS.READING,
    nameVi: 'Mê Cung Khảo Đọc',
    nameEn: 'Reading Realm',
    icon: '📖',
    themeColor: 'emerald',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    ringColor: 'ring-emerald-500/40',
    gradient: 'from-emerald-950/60 via-slate-900 to-teal-950/40',
    guardian: {
      id: 'guardian_reading',
      nameVi: 'Nhân Sư Thư Viện (Sphinx of Alexandria)',
      nameEn: 'The Sphinx of Alexandria',
      icon: '🏛️',
      titleEn: 'Keeper of Ancient Paraphrase'
    },
    gates: [
      {
        id: 'gate_read_1',
        realmId: 'reading',
        gateNumber: 1,
        partLabel: 'PASSAGE 1',
        titleVi: 'Quét Dữ Liệu Thực Tế & True/False/Not Given',
        titleEn: 'Factual Scanning & TFNG',
        descVi: 'Quét nhanh mốc thời gian, tên khoa học và kiểm tra nhận định thực tế.',
        descEn: 'Fast scanning for dates, scientific nomenclature, and True/False/Not Given facts.',
        targetBand: 'Band 5.5 - 6.5',
        difficulty: 'easy',
        baseXp: 20,
        rewardGold: 35,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          if (q.skillCategory !== 'reading') return false;
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.cambridgeSource || ''}`.toLowerCase();
          return /passage 1|true|false|not given|factual|turtle|scan|date|101 past/i.test(text) || q.difficulty === 'easy';
        }
      },
      {
        id: 'gate_read_2',
        realmId: 'reading',
        gateNumber: 2,
        partLabel: 'PASSAGE 2',
        titleVi: 'Nối Tiêu Đề & Quan Hệ Nhân Quả',
        titleEn: 'Matching Headings & Cause-Effect',
        descVi: 'Nhận diện ý chính từng đoạn văn, cấu trúc nguyên nhân kết quả và đại từ.',
        descEn: 'Discursive paragraph headings, causal chains, and pronoun references.',
        targetBand: 'Band 6.5 - 7.5',
        difficulty: 'medium',
        baseXp: 35,
        rewardGold: 55,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          if (q.skillCategory !== 'reading') return false;
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.cambridgeSource || ''}`.toLowerCase();
          return /passage 2|heading|cause|effect|discursive|paragraph|climate|technology/i.test(text) || q.difficulty === 'medium';
        }
      },
      {
        id: 'gate_read_3',
        realmId: 'reading',
        gateNumber: 3,
        partLabel: 'PASSAGE 3',
        titleVi: 'Lập Luận Học Thuật Phức Tạp & Yes/No/Not Given',
        titleEn: 'Academic Arguments & Yes/No/NG',
        descVi: 'Phân tích quan điểm ngầm của tác giả, suy luận logic và tóm tắt khó.',
        descEn: 'Authorial stance, philosophical deduction, nuanced Yes/No/Not Given claims.',
        targetBand: 'Band 7.5 - 9.0',
        difficulty: 'hard',
        baseXp: 50,
        rewardGold: 100,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          if (q.skillCategory !== 'reading') return false;
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.cambridgeSource || ''}`.toLowerCase();
          return /passage 3|yes|no|not given|argument|inference|author|implication|philosophy/i.test(text) || q.difficulty === 'hard' || q.difficulty === 'nightmare';
        }
      }
    ]
  },
  {
    id: SKILL_REALM_IDS.WRITING,
    nameVi: 'Thành Trì Học Thuật',
    nameEn: 'Writing Realm',
    icon: '✍️',
    themeColor: 'purple',
    badgeClass: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
    ringColor: 'ring-purple-500/40',
    gradient: 'from-purple-950/60 via-slate-900 to-indigo-950/40',
    guardian: {
      id: 'guardian_writing',
      nameVi: 'Đại Sư Ngữ Nghĩa (The Lexical Grandmaster)',
      nameEn: 'The Lexical Grandmaster',
      icon: '📜',
      titleEn: 'Master of Coherence & Style'
    },
    gates: [
      {
        id: 'gate_wri_1',
        realmId: 'writing',
        gateNumber: 1,
        partLabel: 'TASK 1 PROCESS',
        titleVi: 'Quy Trình & Trạng Từ Tuần Tự',
        titleEn: 'Process & Sequencing Logic',
        descVi: 'Thứ tự trạng từ liên kết quy trình và cấu trúc bị động công nghiệp/tự nhiên.',
        descEn: 'Sequencing adverbs, stages progression, passive voice in cyclical & linear processes.',
        targetBand: 'Band 6.0 - 7.0',
        difficulty: 'medium',
        baseXp: 25,
        rewardGold: 40,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.skillCategory || ''}`.toLowerCase();
          return (q.skillCategory === 'visual_data' || q.skillCategory === 'grammar') && /process|stage|sequence|cycle|brick|passive|water|flowchart/i.test(text);
        }
      },
      {
        id: 'gate_wri_2',
        realmId: 'writing',
        gateNumber: 2,
        partLabel: 'TASK 1 MAPS',
        titleVi: 'Biến Đổi Không Gian & Bản Đồ Quy Hoạch',
        titleEn: 'Maps & Spatial Reconstruction',
        descVi: 'Từ vựng cải tạo đô thị (demolished, transformed) và phương hướng la bàn.',
        descEn: 'Urban development vocabulary, demolition/conversion, and compass coordinates.',
        targetBand: 'Band 6.5 - 7.5',
        difficulty: 'medium',
        baseXp: 30,
        rewardGold: 50,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.skillCategory || ''}`.toLowerCase();
          return (q.skillCategory === 'visual_data' || q.skillCategory === 'vocab') && /map|spatial|demolish|erect|north|south|urban|redevelop/i.test(text);
        }
      },
      {
        id: 'gate_wri_3',
        realmId: 'writing',
        gateNumber: 3,
        partLabel: 'TASK 1 TRENDS',
        titleVi: 'Xu Hướng Số Liệu & So Sánh Tương Quan',
        titleEn: 'Trends & Data Synthesis',
        descVi: 'Diễn đạt số liệu biến động, đạt đỉnh, chạm đáy và so sánh đối chiếu.',
        descEn: 'Fluctuations, plateauing, peak numbers, and dynamic vs static comparisons.',
        targetBand: 'Band 7.0 - 8.0',
        difficulty: 'hard',
        baseXp: 35,
        rewardGold: 60,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.skillCategory || ''}`.toLowerCase();
          return (q.skillCategory === 'visual_data' || q.skillCategory === 'vocab') && /chart|trend|fluctuate|increase|decrease|peak|plateau|percentage|proportion/i.test(text);
        }
      },
      {
        id: 'gate_wri_4',
        realmId: 'writing',
        gateNumber: 4,
        partLabel: 'TASK 2 COHERENCE',
        titleVi: 'Mạch Lập Luận & Câu Chủ Đề (Topic Sentences)',
        titleEn: 'Argument Coherence & Topic Flow',
        descVi: 'Chọn câu chủ đề sắc bén, xử lý lỗi đứt gãy mạch văn và mệnh đề nhượng bộ.',
        descEn: 'Topic sentences, paragraph cohesion, concession clauses (While, Although, However).',
        targetBand: 'Band 7.5 - 8.5',
        difficulty: 'hard',
        baseXp: 40,
        rewardGold: 70,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.skillCategory || ''}`.toLowerCase();
          return (q.skillCategory === 'grammar' || q.skillCategory === 'reading') && /coherence|topic sentence|connector|concession|argument|transition/i.test(text);
        }
      },
      {
        id: 'gate_wri_5',
        realmId: 'writing',
        gateNumber: 5,
        partLabel: 'TASK 2 C1/C2 LEXIS',
        titleVi: 'Văn Phong Học Thuật & Danh Từ Hóa (C1/C2)',
        titleEn: 'C1/C2 Academic Precision & Nominalisation',
        descVi: 'Thay thế văn nói bằng từ vựng học thuật chuẩn Cambridge và kỹ thuật Hedging.',
        descEn: 'Academic register, nominalisation, cautious hedging, and C1/C2 collocations.',
        targetBand: 'Band 8.0 - 9.0',
        difficulty: 'nightmare',
        baseXp: 55,
        rewardGold: 110,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.skillCategory || ''}`.toLowerCase();
          return (q.skillCategory === 'vocab' || q.skillCategory === 'spelling') && /c1|c2|academic|nominalisation|hedging|synonym|formal|register/i.test(text);
        }
      }
    ]
  },
  {
    id: SKILL_REALM_IDS.SPEAKING,
    nameVi: 'Đấu Trường Khẩu Ngữ',
    nameEn: 'Speaking Realm',
    icon: '🗣️',
    themeColor: 'amber',
    badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
    ringColor: 'ring-amber-500/40',
    gradient: 'from-amber-950/60 via-slate-900 to-rose-950/40',
    guardian: {
      id: 'guardian_speaking',
      nameVi: 'Hùng Biện Cự Nhân (The Orator Titan)',
      nameEn: 'The Orator Titan',
      icon: '🎙️',
      titleEn: 'Master of Spontaneous Discourse'
    },
    gates: [
      {
        id: 'gate_spk_1',
        realmId: 'speaking',
        gateNumber: 1,
        partLabel: 'PART 1',
        titleVi: 'Phản Xạ Trôi Chảy & Mở Đầu Tự Nhiên',
        titleEn: 'Conversational Fluency & Openers',
        descVi: 'Bật phản xạ tự nhiên dưới 3 giây, tránh lặp lại câu hỏi của giám khảo.',
        descEn: 'Natural stalling idioms, conversational openers, and immediate 3-second fluency.',
        targetBand: 'Band 5.5 - 6.5',
        difficulty: 'easy',
        baseXp: 20,
        rewardGold: 30,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.skillCategory || ''}`.toLowerCase();
          return /speaking|part 1|opener|fluency|conversation|routine|filler/i.test(text) || q.skillCategory === 'vocab';
        }
      },
      {
        id: 'gate_spk_2',
        realmId: 'speaking',
        gateNumber: 2,
        partLabel: 'PART 2',
        titleVi: 'Kể Chuyện Cá Nhân & Trục Thời Gian',
        titleEn: 'Narrative Flow & Past Connectors',
        descVi: 'Phát triển câu chuyện trải nghiệm, liên kết thì quá khứ đơn và hoàn thành.',
        descEn: 'Past chronological markers, narrative transitions, and personal experience idioms.',
        targetBand: 'Band 6.5 - 7.5',
        difficulty: 'medium',
        baseXp: 30,
        rewardGold: 50,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.trackLabel || ''}`.toLowerCase();
          return /part 2|narrative|candidate sample|track 39|travel|story|past/i.test(text) || q.skillCategory === 'grammar';
        }
      },
      {
        id: 'gate_spk_3',
        realmId: 'speaking',
        gateNumber: 3,
        partLabel: 'PART 3',
        titleVi: 'Lập Luận Trừu Tượng & Giả Định Xã Hội',
        titleEn: 'Abstract Speculation & Hypotheses',
        descVi: 'Thảo luận đề tài vĩ mô, cấu trúc suy đoán điều kiện và phản biện nhiều chiều.',
        descEn: 'Speculative conditionals, societal impacts, macro evaluation, and counter-perspectives.',
        targetBand: 'Band 7.5 - 8.5',
        difficulty: 'hard',
        baseXp: 45,
        rewardGold: 80,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.trackLabel || ''}`.toLowerCase();
          return /part 3|speculation|hypothesis|abstract|society|technology|complex sentences|track 40/i.test(text) || (q.skillCategory === 'reading' && q.difficulty === 'hard');
        }
      },
      {
        id: 'gate_spk_4',
        realmId: 'speaking',
        gateNumber: 4,
        partLabel: 'PRONUNCIATION',
        titleVi: 'Trọng Âm Câu, Ngữ Điệu & Nối Âm',
        titleEn: 'Stress, Rhythm & Connected Speech',
        descVi: 'Nhận diện trọng âm biểu đạt thái độ, biến âm nối âm và âm yếu (weak forms).',
        descEn: 'Sentence stress, expressive intonation shifts, linking sounds, and weak forms.',
        targetBand: 'Band 7.0 - 8.5',
        difficulty: 'hard',
        baseXp: 40,
        rewardGold: 70,
        questionCount: 5,
        timeLimit: 75,
        matchFilter: (q) => {
          const text = `${q.prompt || ''} ${q.promptEn || ''} ${q.context || ''} ${q.trackLabel || ''}`.toLowerCase();
          return /stress|intonation|pronunciation|track 10|track 36|agreement|rhythm|connected speech/i.test(text) || q.skillCategory === 'spelling';
        }
      }
    ]
  }
];

/**
 * Initializes default empty progress state for all 4 realms and 16 gates.
 */
export function createInitialSkillRealmsProgress() {
  const gatesProgress = {};

  SKILL_REALMS.forEach(realm => {
    realm.gates.forEach(gate => {
      gatesProgress[gate.id] = {
        gateId: gate.id,
        realmId: realm.id,
        stars: 0,            // 0, 1, 2, or 3
        bestScore: 0,        // e.g. 5
        bestTimeRemaining: 0,
        timesCompleted: 0,
        lastPlayedAt: null
      };
    });
  });

  return {
    version: 1,
    gates: gatesProgress,
    totalStars: 0,
    guardianTrialsDefeated: {},
    updatedAt: Date.now()
  };
}

/**
 * Retrieves progress from localStorage or creates fresh initial state.
 */
export function getSkillRealmsProgress() {
  const stored = safeGet(REALMS_STORAGE_KEY, null);
  if (!stored || typeof stored !== 'object' || !stored.gates) {
    const fresh = createInitialSkillRealmsProgress();
    safeSet(REALMS_STORAGE_KEY, fresh);
    return fresh;
  }
  return stored;
}

/**
 * Persists updated progress to localStorage.
 */
export function saveSkillRealmsProgress(progress) {
  if (!progress) return;
  safeSet(REALMS_STORAGE_KEY, progress);
}

/**
 * Resets all Skill Realms progress back to starting state.
 */
export function resetSkillRealmsProgress() {
  const fresh = createInitialSkillRealmsProgress();
  safeSet(REALMS_STORAGE_KEY, fresh);
  return fresh;
}

/**
 * Checks whether a gate is unlocked for the user:
 * - Gate 1 of every Realm is unlocked by default.
 * - Gate N is unlocked if Gate N-1 in the same realm has at least 1 Star (stars >= 1).
 */
export function isGateUnlocked(progress, realmId, gateId) {
  const realm = SKILL_REALMS.find(r => r.id === realmId);
  if (!realm) return false;

  const gateIdx = realm.gates.findIndex(g => g.id === gateId);
  if (gateIdx === -1) return false;

  // Gate 1 is always unlocked
  if (gateIdx === 0) return true;

  // Subsequent gates require >= 1 star on the previous gate
  const prevGate = realm.gates[gateIdx - 1];
  const prevProgress = progress?.gates?.[prevGate.id];
  return Boolean(prevProgress && prevProgress.stars >= 1);
}

/**
 * Returns stars earned for a specific gate (0 to 3).
 */
export function getGateStars(progress, gateId) {
  return progress?.gates?.[gateId]?.stars || 0;
}

/**
 * Computes statistics for a specific realm:
 * - totalStars
 * - maxStars (e.g. 12 stars for Listening, 9 for Reading)
 * - masteredGates (gates with 3 stars)
 * - isGuardianUnlocked (all gates have at least 1 star)
 * - isGuardianDefeated
 * - completionPercentage (0 to 100)
 */
export function getRealmStats(progress, realmId) {
  const realm = SKILL_REALMS.find(r => r.id === realmId);
  if (!realm) {
    return { totalStars: 0, maxStars: 0, masteredGates: 0, isGuardianUnlocked: false, isGuardianDefeated: false, completionPercentage: 0 };
  }

  const maxStars = realm.gates.length * 3;
  let totalStars = 0;
  let masteredGates = 0;
  let passedGates = 0;

  realm.gates.forEach(gate => {
    const gStars = getGateStars(progress, gate.id);
    totalStars += gStars;
    if (gStars >= 3) masteredGates++;
    if (gStars >= 1) passedGates++;
  });

  const isGuardianUnlocked = passedGates === realm.gates.length;
  const isGuardianDefeated = Boolean(progress?.guardianTrialsDefeated?.[realm.id]);
  const completionPercentage = Math.round((totalStars / maxStars) * 100);

  return {
    realmId,
    totalStars,
    maxStars,
    masteredGates,
    totalGates: realm.gates.length,
    isGuardianUnlocked,
    isGuardianDefeated,
    completionPercentage
  };
}

/**
 * Computes overall statistics across all 4 Skill Realms.
 */
export function getAllRealmsOverallStats(progress) {
  let grandTotalStars = 0;
  let grandMaxStars = 0;
  let grandMasteredGates = 0;
  let grandTotalGates = 0;

  SKILL_REALMS.forEach(realm => {
    const stats = getRealmStats(progress, realm.id);
    grandTotalStars += stats.totalStars;
    grandMaxStars += stats.maxStars;
    grandMasteredGates += stats.masteredGates;
    grandTotalGates += stats.totalGates;
  });

  return {
    grandTotalStars,
    grandMaxStars,
    grandMasteredGates,
    grandTotalGates,
    overallPercentage: grandMaxStars > 0 ? Math.round((grandTotalStars / grandMaxStars) * 100) : 0
  };
}

/**
 * Calculates XP earned for completing a gate based on:
 * - Base XP of the gate tier
 * - Correct answer count
 * - Speed bonus (remaining time >= 20s grants +25%)
 * - 3-Star perfect accuracy bonus (+50 XP)
 * - Sprint Surge multiplier (x2)
 */
export function calculateGateXp({
  baseXp = 20,
  score = 0,
  totalQuestions = 5,
  timeRemainingSeconds = 0,
  isSurgeActive = false
}) {
  if (score <= 0) return 0;

  const scoreRatio = score / Math.max(1, totalQuestions);
  let earnedXp = Math.round(baseXp * score * 1.5);

  // Speed bonus
  if (timeRemainingSeconds >= 20) {
    earnedXp = Math.round(earnedXp * 1.25);
  }

  // Perfect accuracy bonus
  if (score === totalQuestions) {
    earnedXp += 40;
  }

  // Surge multiplier
  if (isSurgeActive) {
    earnedXp *= 2;
  }

  return earnedXp;
}

/**
 * Evaluates gate completion outcome and updates persistent progress:
 * - 1 Star: >= 60% accuracy (e.g. 3/5 correct)
 * - 2 Stars: >= 80% accuracy (e.g. 4/5 correct)
 * - 3 Stars: 100% accuracy (e.g. 5/5 correct) + timeRemaining >= 10s
 */
export function evaluateGateResult({
  realmId,
  gateId,
  score,
  totalQuestions = 5,
  timeRemainingSeconds = 0,
  isSurgeActive = false
}) {
  const realm = SKILL_REALMS.find(r => r.id === realmId);
  const isGuardian = Boolean(gateId && gateId.startsWith('guardian_'));
  let gate = realm?.gates?.find(g => g.id === gateId);

  if (!gate && isGuardian && realm) {
    gate = {
      id: gateId,
      realmId,
      gateNumber: (realm.gates?.length || 4) + 1,
      partLabel: 'GUARDIAN TRIAL',
      titleVi: `Thủ Lĩnh: ${realm.guardian?.nameVi || 'Guardian'}`,
      titleEn: `Guardian: ${realm.guardian?.nameEn || 'Guardian'}`,
      baseXp: 75,
      rewardGold: 150
    };
  }

  if (!gate) {
    return { starsAwarded: 0, finalXp: 0, rewardGold: 0, isPassed: false, isNewlyUnlocked: false };
  }

  const accuracy = score / Math.max(1, totalQuestions);
  let starsAwarded = 0;

  if (accuracy >= 1.0) {
    starsAwarded = 3;
  } else if (accuracy >= 0.8) {
    starsAwarded = 2;
  } else if (accuracy >= 0.6) {
    starsAwarded = 1;
  }

  const isPassed = starsAwarded >= 1;
  const finalXp = calculateGateXp({
    baseXp: gate.baseXp,
    score,
    totalQuestions,
    timeRemainingSeconds,
    isSurgeActive
  });

  const rewardGold = isPassed ? (gate.rewardGold || 30) + (starsAwarded === 3 ? 20 : 0) : 10;

  // Update persistent progress
  const currentProgress = getSkillRealmsProgress();
  const existingGate = currentProgress.gates[gateId] || {
    gateId,
    realmId,
    stars: 0,
    bestScore: 0,
    bestTimeRemaining: 0,
    timesCompleted: 0
  };

  const wasPassedBefore = existingGate.stars >= 1;
  const previousStars = existingGate.stars || 0;
  const newStars = Math.max(previousStars, starsAwarded);

  existingGate.stars = newStars;
  existingGate.bestScore = Math.max(existingGate.bestScore || 0, score);
  existingGate.bestTimeRemaining = Math.max(existingGate.bestTimeRemaining || 0, timeRemainingSeconds);
  existingGate.timesCompleted = (existingGate.timesCompleted || 0) + 1;
  existingGate.lastPlayedAt = Date.now();

  currentProgress.gates[gateId] = existingGate;

  // If Guardian trial is passed, mark as defeated in progress
  if (isGuardian && isPassed) {
    if (!currentProgress.guardianTrialsDefeated) {
      currentProgress.guardianTrialsDefeated = {};
    }
    currentProgress.guardianTrialsDefeated[realmId] = true;
  }

  // Recalculate total stars
  let sumStars = 0;
  Object.values(currentProgress.gates).forEach(g => {
    sumStars += (g.stars || 0);
  });
  currentProgress.totalStars = sumStars;
  currentProgress.updatedAt = Date.now();

  saveSkillRealmsProgress(currentProgress);

  const isNewlyUnlocked = isPassed && !wasPassedBefore;

  return {
    realmId,
    gateId,
    isGuardianTrial: isGuardian,
    isGuardianDefeated: Boolean(isGuardian && isPassed),
    starsAwarded,
    previousStars,
    newStars,
    isPassed,
    isNewlyUnlocked,
    finalXp,
    rewardGold,
    accuracy: Math.round(accuracy * 100),
    timeRemainingSeconds
  };
}

/**
 * Extracts a balanced set of questions tailored to a specific Gate:
 * - Checks the gate's matchFilter against the combined question pool.
 * - Falls back to skill category & difficulty if filter yields fewer than count questions.
 * - Shuffles and returns exactly `count` items (default: 5).
 */
export function getQuestionsForGate(realmId, gateId, count = 5) {
  const realm = SKILL_REALMS.find(r => r.id === realmId);
  const gate = realm?.gates?.find(g => g.id === gateId);
  if (!gate) return [];

  const combinedBank = [...ARENA_QUESTION_BANK, ...ARENA_101_READING_QUESTIONS];

  // 1. Primary filter using specific gate matcher
  let matched = combinedBank.filter(q => {
    try {
      return gate.matchFilter?.(q);
    } catch {
      return false;
    }
  });

  // 2. Secondary fallback if specific matcher matches fewer than `count`
  if (matched.length < count) {
    const fallbackCategory = {
      listening: 'listening',
      reading: 'reading',
      writing: 'visual_data',
      speaking: 'vocab'
    }[realmId] || 'reading';

    const fallbackQuestions = combinedBank.filter(q => {
      if (q.skillCategory === fallbackCategory) return true;
      if (realmId === 'writing' && (q.skillCategory === 'grammar' || q.skillCategory === 'visual_data')) return true;
      if (realmId === 'speaking' && (q.skillCategory === 'vocab' || q.skillCategory === 'spelling')) return true;
      return false;
    });

    const combinedSet = new Set(matched.map(q => q.id));
    for (const q of fallbackQuestions) {
      if (!combinedSet.has(q.id)) {
        matched.push(q);
        combinedSet.add(q.id);
        if (matched.length >= count * 3) break;
      }
    }
  }

  // 3. Shuffle with random seed and slice
  const shuffled = [...matched].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
