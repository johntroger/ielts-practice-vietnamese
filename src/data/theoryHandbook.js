/**
 * theoryHandbook.js - Master Theory & Exam Strategy Handbook
 * Modularized Architecture with Dynamic Chunking & On-Demand Loading.
 * 
 * Provides:
 * 1. THEORY_HANDBOOK: Complete 113 topics (backward compatible).
 * 2. THEORY_HANDBOOK_METADATA: Lightweight index (~15kB gzip) for instant UI rendering.
 * 3. loadTheoryHandbookBySkill(skill): Dynamic import of skill-specific chunk on demand.
 * 4. loadTheoryArticle(id): On-demand retrieval of individual full-content article.
 */

import { WRITING_THEORY_ARTICLES } from './theoryHandbook/writingTheoryData.js';
import { READING_THEORY_ARTICLES } from './theoryHandbook/readingTheoryData.js';
import { LISTENING_THEORY_ARTICLES } from './theoryHandbook/listeningTheoryData.js';
import { SPEAKING_THEORY_ARTICLES } from './theoryHandbook/speakingTheoryData.js';
import { GRAMMAR_VOCAB_THEORY_ARTICLES } from './theoryHandbook/grammarVocabTheoryData.js';
import { THEORY_HANDBOOK_METADATA } from './theoryHandbook/theoryMetadata.js';

// Backward-compatible unified array containing all 113 topics
export const THEORY_HANDBOOK = [
  ...WRITING_THEORY_ARTICLES,
  ...READING_THEORY_ARTICLES,
  ...LISTENING_THEORY_ARTICLES,
  ...SPEAKING_THEORY_ARTICLES,
  ...GRAMMAR_VOCAB_THEORY_ARTICLES
];

export { THEORY_HANDBOOK_METADATA };

// In-memory cache for dynamically imported chunks
const skillChunkCache = new Map([
  ['writing', WRITING_THEORY_ARTICLES],
  ['reading', READING_THEORY_ARTICLES],
  ['listening', LISTENING_THEORY_ARTICLES],
  ['speaking', SPEAKING_THEORY_ARTICLES],
  ['grammar-vocab', GRAMMAR_VOCAB_THEORY_ARTICLES]
]);

/**
 * Loads theory articles dynamically by skill.
 * Supported skills: 'writing', 'reading', 'listening', 'speaking', 'grammar-vocab'
 */
export async function loadTheoryHandbookBySkill(skill) {
  if (skillChunkCache.has(skill)) {
    return skillChunkCache.get(skill);
  }

  let chunk = [];
  switch (skill) {
    case 'writing': {
      const mod = await import('./theoryHandbook/writingTheoryData.js');
      chunk = mod.WRITING_THEORY_ARTICLES || mod.default || [];
      break;
    }
    case 'reading': {
      const mod = await import('./theoryHandbook/readingTheoryData.js');
      chunk = mod.READING_THEORY_ARTICLES || mod.default || [];
      break;
    }
    case 'listening': {
      const mod = await import('./theoryHandbook/listeningTheoryData.js');
      chunk = mod.LISTENING_THEORY_ARTICLES || mod.default || [];
      break;
    }
    case 'speaking': {
      const mod = await import('./theoryHandbook/speakingTheoryData.js');
      chunk = mod.SPEAKING_THEORY_ARTICLES || mod.default || [];
      break;
    }
    case 'grammar-vocab': {
      const mod = await import('./theoryHandbook/grammarVocabTheoryData.js');
      chunk = mod.GRAMMAR_VOCAB_THEORY_ARTICLES || mod.default || [];
      break;
    }
    default:
      chunk = (!skill || skill === 'all') ? THEORY_HANDBOOK : [];
  }

  skillChunkCache.set(skill, chunk);
  return chunk;
}

/**
 * Loads a single article by ID using lightweight metadata routing.
 */
export async function loadTheoryArticle(articleId) {
  const meta = THEORY_HANDBOOK_METADATA.find(m => m.id === articleId);
  if (!meta) {
    return THEORY_HANDBOOK.find(a => a.id === articleId) || null;
  }

  const skillArticles = await loadTheoryHandbookBySkill(meta.skill);
  return skillArticles.find(a => a.id === articleId) || null;
}

export default THEORY_HANDBOOK;
