/**
 * Computer-Delivered IELTS (CDI) Simulation Utility
 * Standardized exam environment helpers replicating official IDP / British Council test delivery.
 */

/**
 * Clamps split-pane width percentage to ensure usable layout across viewports.
 * 
 * @param {number} width - Requested width percentage (0 - 100)
 * @param {number} [min=25] - Minimum allowable percentage
 * @param {number} [max=75] - Maximum allowable percentage
 * @returns {number} Clamped percentage
 */
export function clampSplitWidth(width, min = 25, max = 75) {
  const num = Number(width);
  if (isNaN(num)) return 50;
  return Math.min(max, Math.max(min, Math.round(num * 10) / 10));
}

/**
 * CDI Official High-Contrast Accessibility Themes.
 */
export const CDI_CONTRAST_THEMES = {
  STANDARD: 'standard',
  BLACK_ON_WHITE: 'black-on-white',
  WHITE_ON_BLACK: 'white-on-black',
  YELLOW_ON_BLACK: 'yellow-on-black'
};

/**
 * Returns Tailwind CSS class descriptors matching official CDI exam display modes.
 * 
 * @param {string} theme - 'standard' | 'black-on-white' | 'white-on-black' | 'yellow-on-black'
 * @returns {Object} { containerClass, headerClass, textClass, borderClass }
 */
export function getContrastThemeStyles(theme = 'standard') {
  switch (theme) {
    case CDI_CONTRAST_THEMES.BLACK_ON_WHITE:
      return {
        themeKey: 'black-on-white',
        label: 'Đen trên Trắng (Tương phản cao)',
        containerClass: 'bg-white text-black border-black',
        headerClass: 'bg-white text-black border-b-2 border-black shadow-none',
        textClass: 'text-black',
        borderClass: 'border-black'
      };

    case CDI_CONTRAST_THEMES.WHITE_ON_BLACK:
      return {
        themeKey: 'white-on-black',
        label: 'Trắng trên Đen (Chế độ tối)',
        containerClass: 'bg-black text-white border-zinc-800',
        headerClass: 'bg-zinc-900 text-white border-b border-zinc-800',
        textClass: 'text-white',
        borderClass: 'border-zinc-800'
      };

    case CDI_CONTRAST_THEMES.YELLOW_ON_BLACK:
      return {
        themeKey: 'yellow-on-black',
        label: 'Vàng trên Đen (Chuẩn trợ năng)',
        containerClass: 'bg-black text-yellow-300 border-zinc-800',
        headerClass: 'bg-zinc-950 text-yellow-300 border-b border-yellow-700/60',
        textClass: 'text-yellow-300',
        borderClass: 'border-yellow-700/60'
      };

    case CDI_CONTRAST_THEMES.STANDARD:
    default:
      return {
        themeKey: 'standard',
        label: 'Tiêu chuẩn (Mặc định)',
        containerClass: 'bg-slate-50 text-slate-900 border-slate-200',
        headerClass: 'bg-white text-slate-900 border-b border-slate-200',
        textClass: 'text-slate-900',
        borderClass: 'border-slate-200'
      };
  }
}

/**
 * Evaluates CDI time remaining and determines warning thresholds.
 * Official IDP/BC exams trigger visual notices at 10 minutes and 5 minutes remaining.
 * 
 * @param {number} secondsRemaining - Number of seconds left
 * @returns {Object} Diagnostic timer status and alert notices
 */
export function getCdiTimerStatus(secondsRemaining) {
  const secs = Math.max(0, Number(secondsRemaining) || 0);

  const is10MinWarning = secs <= 600 && secs > 300;
  const is5MinWarning = secs <= 300 && secs > 60;
  const isCritical = secs <= 60 && secs > 0;
  const isExpired = secs === 0;

  let noticeText = null;
  let severity = 'normal';

  if (secs === 600 || (secs < 600 && secs >= 595)) {
    noticeText = '⏱️ Thông báo Khảo thí: Còn 10 phút làm bài! Hãy bắt đầu kiểm tra và rà soát lại các câu hỏi trên thanh điều hướng.';
    severity = 'warning';
  } else if (secs === 300 || (secs < 300 && secs >= 295)) {
    noticeText = '⚠️ Cảnh báo khẩn: Còn 5 phút làm bài! Thí sinh chú ý hoàn thành và kiểm tra toàn bộ đáp án.';
    severity = 'urgent';
  } else if (isCritical) {
    noticeText = '🚨 Thời gian sắp hết! Dưới 1 phút cuối cùng.';
    severity = 'critical';
  }

  return {
    is10MinWarning,
    is5MinWarning,
    isCritical,
    isExpired,
    severity,
    noticeText
  };
}

/**
 * Formats seconds into MM:SS display.
 */
export function formatCdiTime(seconds) {
  const secs = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(secs / 60);
  const remainderSecs = secs % 60;
  return `${String(mins).padStart(2, '0')}:${String(remainderSecs).padStart(2, '0')}`;
}
