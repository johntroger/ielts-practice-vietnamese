/**
 * analyticsService.js
 * Google Analytics 4 (GA4) Integration & Virtual Routing Engine for Single-Page Application (SPA).
 * Enables granular section-by-section tracking, virtual pageviews, and custom exam event analytics.
 */

export const GA_MEASUREMENT_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID) || 'G-H2Z67KN0ZX';

/**
 * Sends a Virtual Pageview to GA4 so SPA section switches appear as distinct pages.
 * @param {string} path - Virtual path (e.g., '/writing', '/modals/mock-test-60m')
 * @param {string} title - Human-readable screen title
 */
export function trackPageView(path, title) {
  if (typeof window === 'undefined') return;

  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const origin = window.location ? window.location.origin : 'https://ielts-practice.local';

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: fullPath,
      page_title: title || fullPath,
      page_location: `${origin}${fullPath}`
    });
  }
}

/**
 * Sends a custom conversion / engagement event to GA4.
 * @param {string} eventName - GA4 event name (e.g. 'submit_essay', 'start_speaking_exam')
 * @param {object} params - Key-value event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

/**
 * Tracks when user switches between IELTS Skills (Writing, Reading, Listening, Speaking).
 * @param {string} skill - 'writing' | 'reading' | 'listening' | 'speaking'
 */
export function trackSkillView(skill) {
  const titles = {
    writing: 'IELTS Writing Workspace (Examiner AI)',
    reading: 'IELTS Reading Workspace (14 Question Types)',
    listening: 'IELTS Listening Workspace (Acoustic Evidence)',
    speaking: 'IELTS Speaking Studio (1-on-1 AI Examiner)'
  };

  const currentTitle = titles[skill] || `IELTS ${String(skill).toUpperCase()} Workspace`;
  const path = `/${skill}`;

  trackPageView(path, currentTitle);
  trackEvent('skill_switch', {
    skill,
    skill_title: currentTitle
  });
}

/**
 * Tracks when any modal or tool is opened, virtualizing it as an interactive screen.
 * @param {string} modalName - Modal identifier from modalStore
 */
export function trackModalView(modalName) {
  if (!modalName) return;

  const modalTitles = {
    mockTest: '60-Minute High-Pressure Mock Test',
    drills: 'Targeted Micro-Drills Studio',
    theory: 'Cambridge Theory & Distractor Traps Handbook',
    vocabGrammar: 'Vocab, Grammar & 100 Spelling Demons',
    diagnostic: 'Diagnostic Placement Test & 30-Day Plan',
    adaptiveSprint: 'Adaptive 30-Minute Sprint Coach',
    atlasArena: 'Atlas English Arena (High-Speed eSports Reflex Battle)',
    library: 'Cambridge Authentic Task Library',
    feedback: 'AI Assessment & Examiner Feedback',
    mistakeLog: 'Academic Mistake Notebook & Spaced Repetition',
    growthAnalytics: 'Growth Analytics & Band Progress',
    ideaMatrix: 'PESTLE Idea Matrix & Brainstorming',
    generator: 'AI Writing Prompt Generator',
    featuresGuide: 'Interactive Platform Feature Guide',
    history: 'Submission & Practice History',
    notebook: 'Personal Vocabulary Notebook',
    trfSimulator: 'Official Cambridge TRF Simulator',
    settings: 'Platform Settings & AI Configuration',
    auth: 'User Authentication & Cloud Sync'
  };

  const title = modalTitles[modalName] || `Tool: ${modalName}`;
  const path = `/modals/${modalName}`;

  trackPageView(path, title);
  trackEvent('modal_open', {
    modal_name: modalName,
    modal_title: title
  });
}
