/**
 * Supabase Storage & Egress Guard Utility
 * 
 * NGUYÊN TẮC BẢO VỆ DUNG LƯỢNG & BĂNG THÔNG SUPABASE (FREE TIER QUOTA GUARD):
 * 1. Băng thông Egress của gói Free chỉ có 5 GB / tháng.
 * 2. Tuyệt đối KHÔNG lưu trữ hình ảnh/âm thanh Base64 dung lượng lớn (raw base64) trực tiếp vào Database.
 * 3. Dung lượng một bản ghi (row payload) khi đồng bộ lên Supabase không được vượt quá 80 KB.
 * 4. Đối với Task 1 Process & Map, hệ thống đã có ProcessMapRenderer (Vector SVG), không cần lưu ảnh PNG nặng.
 * 5. Mọi dữ liệu hình ảnh người dùng tải lên nếu muốn lưu Cloud phải được nén dưới 35 KB hoặc lưu cục bộ (IndexedDB/LocalStorage).
 */

export const SUPABASE_LIMITS = {
  MAX_ROW_PAYLOAD_BYTES: 80 * 1024,      // 80 KB tối đa cho 1 bản ghi
  MAX_INLINE_IMAGE_BYTES: 35 * 1024,     // 35 KB tối đa cho ảnh inline (nếu có)
  MAX_TASKS_PER_FETCH: 150,              // Giới hạn số lượng bản ghi tải về trong 1 query
  CACHE_TTL_MS: 30 * 60 * 1000,          // Cache client 30 phút chống query liên tục ngốn Egress
};

/**
 * Tính toán kích thước byte thực tế của một Object / Chuỗi
 */
export function getByteLength(data) {
  if (data === null || data === undefined) return 0;
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    return new Blob([str]).size;
  } catch (e) {
    return typeof data === 'string' ? data.length : JSON.stringify(data || {}).length;
  }
}

/**
 * Kiểm tra xem một chuỗi có phải là Data URL base64 nặng không
 */
export function isBloatedBase64(str, maxBytes = SUPABASE_LIMITS.MAX_INLINE_IMAGE_BYTES) {
  if (typeof str !== 'string') return false;
  if (!str.startsWith('data:')) return false;
  return str.length > maxBytes;
}

export const ENTITY_TYPES = {
  WRITING_TASK: 'writing_task',
  MICRO_DRILL: 'micro_drill',
  VOCAB_CARD: 'vocab_card',
  ARENA_PROFILE: 'arena_profile'
};

export const ARENA_ANTI_CHEAT_LIMITS = {
  MAX_TOTAL_XP: 500000,         // Trần XP tối đa hợp lệ (500,000 XP)
  MAX_XP_PER_MATCH: 2500,       // Tối đa 2,500 XP cho 1 trận đấu (kể cả Boss Raid + Booster x2)
  BASE_GRACE_XP: 3000,          // Hạn mức XP khởi đầu / thưởng nhiệm vụ cơ bản
  MAX_STREAK: 3650,             // Tối đa 10 năm chuỗi ngày liên tiếp
  MAX_MATCHES: 50000            // Giới hạn số trận tối đa hợp lý
};

/**
 * Suy luận chuẩn hóa loại thực thể (entity_type) từ ID hoặc dữ liệu bản ghi
 */
export function inferEntityType(id = '', payload = {}) {
  if (payload && typeof payload === 'object' && Object.values(ENTITY_TYPES).includes(payload.entityType)) {
    return payload.entityType;
  }
  const strId = String(id || payload?.id || '').toLowerCase();
  if (strId.startsWith('arena-score-')) {
    return ENTITY_TYPES.ARENA_PROFILE;
  }
  if (strId.startsWith('custom-drill-') || strId.startsWith('drill-') || strId.startsWith('comm-drill-')) {
    return ENTITY_TYPES.MICRO_DRILL;
  }
  if (strId.startsWith('ai-sp-') || strId.startsWith('ai-gr-') || strId.startsWith('ai-card-')) {
    return ENTITY_TYPES.VOCAB_CARD;
  }
  if (payload?.isArenaLeaderboardEntry) {
    return ENTITY_TYPES.ARENA_PROFILE;
  }
  return ENTITY_TYPES.WRITING_TASK;
}

/**
 * Làm sạch chuỗi văn bản chống XSS cơ bản
 */
function sanitizeSafeString(str, maxLength = 80, fallback = '') {
  if (typeof str !== 'string') return fallback;
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, maxLength) || fallback;
}

/**
 * Kiểm tra & Chống gian lận điểm số Atlas Arena (Anti-Cheat Validator)
 * Đảm bảo người dùng không thể dùng DevTools F12 để bơm triệu XP ảo lên bảng xếp hạng.
 */
export function validateAndSanitizeArenaProfile(profile) {
  if (!profile || typeof profile !== 'object') return null;

  const rawMatches = Math.max(0, Math.min(ARENA_ANTI_CHEAT_LIMITS.MAX_MATCHES, Math.floor(Number(profile.matchesPlayed) || 0)));
  const rawWins = Math.max(0, Math.min(rawMatches, Math.floor(Number(profile.wins) || 0)));
  const rawStreak = Math.max(0, Math.min(ARENA_ANTI_CHEAT_LIMITS.MAX_STREAK, Math.floor(Number(profile.streak) || 0)));
  const rawXp = Math.max(0, Math.floor(Number(profile.xp) || 0));

  // Tính trần XP hợp lệ theo số trận đã chơi (tránh trường hợp matchesPlayed = 1 nhưng xp = 999,999)
  const effectiveMatches = Math.max(1, rawMatches);
  const maxPlausibleXp = Math.min(
    ARENA_ANTI_CHEAT_LIMITS.MAX_TOTAL_XP,
    ARENA_ANTI_CHEAT_LIMITS.BASE_GRACE_XP + effectiveMatches * ARENA_ANTI_CHEAT_LIMITS.MAX_XP_PER_MATCH
  );

  const clampedXp = Math.min(rawXp, maxPlausibleXp);
  const antiCheatClamped = rawXp > maxPlausibleXp;

  const computedWinRate = rawMatches > 0
    ? Math.min(100, Math.max(0, Math.round((rawWins / rawMatches) * 100)))
    : Math.min(100, Math.max(0, Math.round(Number(profile.winRate) || 0)));

  return {
    ...profile,
    entityType: ENTITY_TYPES.ARENA_PROFILE,
    isArenaLeaderboardEntry: true,
    displayName: sanitizeSafeString(profile.displayName, 45, 'Học Viên IELTS'),
    avatar: sanitizeSafeString(profile.avatar, 16, '🧑‍🎓'),
    title: sanitizeSafeString(profile.title, 60, 'Tân Binh IELTS'),
    xp: clampedXp,
    matchesPlayed: rawMatches,
    wins: rawWins,
    winRate: computedWinRate,
    streak: rawStreak,
    level: Math.max(1, Math.min(100, Math.floor(Number(profile.level) || 1))),
    antiCheatClamped
  };
}

/**
 * Làm sạch và tối ưu hóa Task trước khi đẩy lên Supabase Cloud
 */
export function sanitizeTaskForCloud(task) {
  if (!task || typeof task !== 'object') return task;

  const sanitized = {
    ...task,
    entityType: inferEntityType(task.id, task)
  };

  // Nếu là hồ sơ Arena, chạy qua bộ lọc Anti-Cheat
  if (sanitized.entityType === ENTITY_TYPES.ARENA_PROFILE) {
    return validateAndSanitizeArenaProfile(sanitized);
  }

  // 1. Kiểm tra và xử lý imageUrl
  if (sanitized.imageUrl) {
    // Nếu là bài Process hoặc Map: Luôn gỡ bỏ ảnh base64 nặng vì ProcessMapRenderer tự vẽ vector cực đẹp
    const isProcessOrMap = sanitized.taskNumber === 1 && (
      sanitized.type === 'process' ||
      sanitized.type === 'map' ||
      Boolean(sanitized.processSteps) ||
      Boolean(sanitized.mapChanges)
    );

    if (isProcessOrMap && isBloatedBase64(sanitized.imageUrl, 20 * 1024)) {
      console.info(`[SupabaseGuard] Stripped heavy base64 image from Process/Map task "${sanitized.title || sanitized.id}". Vector renderer will handle visuals.`);
      delete sanitized.imageUrl;
    } else if (isBloatedBase64(sanitized.imageUrl, SUPABASE_LIMITS.MAX_INLINE_IMAGE_BYTES)) {
      console.warn(`[SupabaseGuard] Image in task "${sanitized.title || sanitized.id}" is too large (${Math.round(sanitized.imageUrl.length / 1024)} KB). Stripping from cloud sync to protect Egress.`);
      delete sanitized.imageUrl;
    }
  }

  // 2. Gỡ bỏ audioBase64 nếu có
  if (sanitized.audioBase64 && isBloatedBase64(sanitized.audioBase64, 20 * 1024)) {
    console.warn(`[SupabaseGuard] Stripped large audioBase64 from task "${sanitized.id}".`);
    delete sanitized.audioBase64;
  }

  // 3. Kiểm tra tổng dung lượng payload
  const currentBytes = getByteLength(sanitized);
  if (currentBytes > SUPABASE_LIMITS.MAX_ROW_PAYLOAD_BYTES) {
    console.warn(`[SupabaseGuard] Task payload is ${Math.round(currentBytes / 1024)} KB (exceeds limit ${SUPABASE_LIMITS.MAX_ROW_PAYLOAD_BYTES / 1024} KB). Stripping non-essential fields.`);
    // Gỡ các trường phụ trợ nặng nếu vượt trần
    delete sanitized.rawAiResponse;
    delete sanitized.debugLog;
    delete sanitized.svgIllustration;
  }

  return sanitized;
}

/**
 * Làm sạch bài nộp người dùng (submission) trước khi lưu Cloud
 */
export function sanitizeSubmissionForCloud(submission) {
  if (!submission || typeof submission !== 'object') return submission;

  const sanitized = { ...submission };

  // Đảm bảo không kèm ảnh base64 trong bài nộp
  if (sanitized.task) {
    sanitized.task = sanitizeTaskForCloud(sanitized.task);
  }

  // Loại bỏ dữ liệu debug / raw candidates của AI nếu có
  if (sanitized.evaluation?.rawCandidate) {
    delete sanitized.evaluation.rawCandidate;
  }

  const currentBytes = getByteLength(sanitized);
  if (currentBytes > SUPABASE_LIMITS.MAX_ROW_PAYLOAD_BYTES) {
    console.warn(`[SupabaseGuard] Submission payload size ${Math.round(currentBytes / 1024)} KB is high. Trimming verbose feedback.`);
    if (sanitized.evaluation?.detailedGrammarFeedback?.length > 30) {
      sanitized.evaluation.detailedGrammarFeedback = sanitized.evaluation.detailedGrammarFeedback.slice(0, 30);
    }
  }

  return sanitized;
}

/**
 * Làm sạch drill / bài tập micro trước khi lưu Cloud
 */
export function sanitizeDrillForCloud(drill) {
  if (!drill || typeof drill !== 'object') return drill;
  const sanitized = {
    ...drill,
    entityType: inferEntityType(drill.id, { ...drill, entityType: ENTITY_TYPES.MICRO_DRILL })
  };

  if (sanitized.audioBase64) {
    delete sanitized.audioBase64; // Dùng Web Speech API / TTS thay vì nhét audio file nặng vào DB
  }
  if (sanitized.imageUrl && isBloatedBase64(sanitized.imageUrl, SUPABASE_LIMITS.MAX_INLINE_IMAGE_BYTES)) {
    delete sanitized.imageUrl;
  }

  return sanitized;
}

