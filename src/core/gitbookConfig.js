/**
 * Lightweight GitBook Documentation URL Constants
 * Kept separate from featureRegistry.js (~120 KB) so Navbar & App initial bundle
 * do not eagerly pull the entire Help Center localization catalog.
 */

export const GITBOOK_CATEGORY_SLUGS = {
  ai_evaluation: 'ai-evaluation',
  practice_tools: 'practice-tools',
  exam_simulation: 'exam-simulation',
  theory_vocab: 'theory-vocab',
  analytics_profile: 'analytics-profile',
  shortcuts_ux: 'shortcuts-ux'
};

export const getGitBookBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITBOOK_URL) {
    return import.meta.env.VITE_GITBOOK_URL.replace(/\/+$/, '');
  }
  return 'https://vneconomics.gitbook.io/vneconomics-docs';
};

export const GITBOOK_DOCS_BASE_URL = getGitBookBaseUrl();
export const GITBOOK_FEATURES_BASE_URL = `${getGitBookBaseUrl()}/huong-dan-su-dung-and-tinh-nang-he-thong`;
