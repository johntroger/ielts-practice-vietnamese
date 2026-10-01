/**
 * User Permissions and Owner Verification Service
 * Controls access to media upload/generation (images & audio) based on owner email.
 * 
 * Rules:
 * - Only the Owner (tranthanhtung37@gmail.com) can create or upload manual tasks containing images or audio files.
 * - Other users (or anonymous/guest users) are informed about website storage limits and guided to create text-only tasks.
 */

export const OWNER_EMAIL = 'tranthanhtung37@gmail.com';

/**
 * Check if the provided user object belongs to the website owner.
 * @param {Object|null|undefined} user - Supabase user object or session user
 * @returns {boolean} True if user email matches OWNER_EMAIL
 */
export function isOwnerUser(user) {
  if (!user || typeof user !== 'object') return false;
  const email = user.email || user.user_metadata?.email;
  if (!email || typeof email !== 'string') return false;
  return email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase();
}

/**
 * Standard explanation message shown when a non-owner attempts to upload or attach images/audio.
 */
export const OWNER_MEDIA_RESTRICTION_MESSAGE = 
  'Do dung lượng website giới hạn nên tính năng tải lên / nạp hình ảnh & âm thanh đề bài hiện chỉ dành riêng cho Quản trị viên (tranthanhtung37@gmail.com). Bạn vẫn có thể nạp đề văn bản để luyện tập bình thường.';

/**
 * Audio-specific restriction message.
 */
export const OWNER_AUDIO_RESTRICTION_MESSAGE = 
  'Do dung lượng website giới hạn nên tính năng tải lên tệp âm thanh hiện chỉ dành riêng cho Quản trị viên (tranthanhtung37@gmail.com). Bạn có thể luyện tập với hàng chục bài nghe bản xứ có sẵn hoặc đề nghe sinh từ liên kết.';

/**
 * Validates whether a manual task containing media (image or audio) is permissible for the given user.
 * @param {Object} task - Task or exercise object with potential imageUrl or audioUrl
 * @param {Object|null} user - Current user object
 * @returns {{ allowed: boolean, message?: string }}
 */
export function validateManualMediaPermission(task, user) {
  const hasImage = Boolean(task?.imageUrl && typeof task.imageUrl === 'string' && task.imageUrl.trim().length > 0);
  const hasAudio = Boolean(
    (task?.audioUrl && typeof task.audioUrl === 'string' && task.audioUrl.trim().length > 0 && !task.audioUrl.startsWith('http')) ||
    task?.audioBase64 ||
    task?.isUploadedFile
  );

  if ((hasImage || hasAudio) && !isOwnerUser(user)) {
    return {
      allowed: false,
      message: OWNER_MEDIA_RESTRICTION_MESSAGE
    };
  }

  return { allowed: true };
}

/**
 * Strips media from task if user is not authorized, ensuring text-only persistence.
 * @param {Object} task
 * @param {Object|null} user
 * @returns {Object} Cleaned task
 */
export function sanitizeTaskForStorage(task, user) {
  if (!task) return task;
  if (isOwnerUser(user)) return task;

  const sanitized = { ...task };
  if (sanitized.imageUrl) delete sanitized.imageUrl;
  if (sanitized.audioBase64) delete sanitized.audioBase64;
  if (sanitized.isUploadedFile) sanitized.isUploadedFile = false;

  return sanitized;
}
