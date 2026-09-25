/**
 * Heuristic writing habit detector for IELTS candidates
 * Checks common writing traps before submission:
 * - Task 1: Missing Overview clause (Caps TA at Band 5.0)
 * - Informal/spoken sentence starters ("Besides, ", "And ", "So, ")
 * - Missing comma after conjunctive adverbs ("However ", "Therefore ")
 * - Extreme run-on sentences (> 50 words without punctuation)
 * - Recurrence of past mistakes from user's notebook
 */

export function detectWritingHabits(text, task, pastMistakes = []) {
  if (!text || text.trim().length < 40) return [];
  const warnings = [];

  // 1. Task 1: Missing Overview check
  if (task?.taskNumber === 1) {
    const hasOverview = /\b(overall|in summary|broadly speaking|to summarize|it is noticeable that|it is evident that|in general)\b/i.test(text);
    if (!hasOverview) {
      warnings.push({
        id: 'task1_overview',
        title: 'Thiếu đoạn Tổng quan (Overview)',
        desc: 'Task 1 bắt buộc có câu Overview tóm tắt xu hướng hoặc đặc điểm chính. Thiếu Overview sẽ bị khống chế trần Task Achievement tối đa Band 5.0.'
      });
    }
  }

  // 2. Informal or spoken sentence starters (e.g. "Besides, ", "And ", "So, ")
  const informalMatches = text.match(/(?:^|[.!?]\s+)(Besides|And|But|So|Also)\s*,/gi);
  if (informalMatches && informalMatches.length > 0) {
    const words = [...new Set(informalMatches.map(m => m.replace(/^[.!?\s]+/, '').replace(/,/g, '').trim()))];
    warnings.push({
      id: 'informal_starter',
      title: 'Từ nối mang văn phong nói',
      desc: `Phát hiện câu bắt đầu bằng từ nối văn nói (${words.slice(0, 2).join(', ')}). Trong IELTS Academic, nên thay bằng "Furthermore", "In addition", "However".`
    });
  }

  // 3. Missing comma after conjunctive adverbs (e.g. "However ", "Therefore ")
  const missingCommaMatches = text.match(/(?:^|[.!?]\s+)(However|Therefore|Moreover|Furthermore|Consequently)\s+[A-Za-z]/gi);
  if (missingCommaMatches && missingCommaMatches.length > 0) {
    const samples = [...new Set(missingCommaMatches.map(m => m.replace(/^[.!?\s]+/, '').trim()))];
    warnings.push({
      id: 'missing_comma',
      title: 'Thiếu dấu phẩy sau trạng từ nối',
      desc: `Phát hiện trạng từ đầu câu chưa có dấu phẩy (${samples.slice(0, 2).join(', ')}). Quy tắc GRA học thuật yêu cầu dấu phẩy ngay sau trạng từ nối.`
    });
  }

  // 4. Extreme run-on sentences (> 50 words without punctuation)
  const sentences = text.split(/(?<=[.!?])\s+/);
  const runOn = sentences.find(s => s.trim().split(/\s+/).filter(Boolean).length > 50);
  if (runOn) {
    warnings.push({
      id: 'run_on',
      title: 'Câu quá dài có nguy cơ run-on (> 50 từ)',
      desc: 'Phát hiện câu văn kéo dài trên 50 từ mà không có dấu ngắt câu. Giám khảo dễ trừ điểm mạch lạc (CC) và cấu trúc ngữ pháp (GRA).'
    });
  }

  // 5. Past mistakes recurrence
  if (Array.isArray(pastMistakes) && pastMistakes.length > 0) {
    const recurring = pastMistakes.find(m => {
      if (!m.original || m.original.trim().length < 3) return false;
      const escaped = m.original.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
    });
    if (recurring) {
      warnings.push({
        id: 'past_mistake',
        title: 'Tái diễn lỗi sai trong Sổ tay cá nhân',
        desc: `Bài viết có chứa cụm từ bạn từng ghi chú lỗi: "${recurring.original}" (Gợi ý sửa: "${recurring.corrected}").`
      });
    }
  }

  return warnings;
}
