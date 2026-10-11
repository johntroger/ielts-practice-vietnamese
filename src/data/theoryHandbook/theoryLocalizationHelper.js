/**
 * src/data/theoryHandbook/theoryLocalizationHelper.js
 * Centralized localization service for Theory Handbook articles, stages, titles, summaries, and Markdown content.
 * Supports all 113 topics across all 5 skills: Writing, Reading, Listening, Speaking, and Grammar & Vocab.
 */

import { WRITING_THEORY_ARTICLES_EN } from './writingTheoryDataEn.js';
import { READING_THEORY_ARTICLES_EN } from './readingTheoryDataEn.js';
import { LISTENING_THEORY_ARTICLES_EN } from './listeningTheoryDataEn.js';
import { SPEAKING_THEORY_ARTICLES_EN } from './speakingTheoryDataEn.js';
import { GRAMMAR_VOCAB_THEORY_ARTICLES_EN } from './grammarVocabTheoryDataEn.js';
import { THEORY_I18N_EN } from '../../services/theoryContextService.js';

export const STAGE_LOCALIZATION = {
  'Chặng 1: Nền Tảng & Cứu Sinh (Band 4.0 – 5.0)': 'Stage 1: Foundation & Survival (Band 4.0 – 5.0)',
  'Chặng 2: Làm Chủ Toàn Bộ Dạng Bài Task 1 & Task 2 (Band 5.5 – 6.5)': 'Stage 2: Master All Task 1 & 2 Types (Band 5.5 – 6.5)',
  'Chặng 3: Bứt Phá Chuyên Sâu & Bẻ Bẫy (Band 7.0 – 8.5+)': 'Stage 3: Advanced Mastery & Trap Decoders (Band 7.0 – 8.5+)',
  'Chặng 4: Kỹ Năng Thi Máy Tính (CDI) & One Skill Retake': 'Stage 4: Computer-Delivered Exam (CDI) & One Skill Retake',
  'Chặng 1: Nền Tảng & Kỹ Năng Cốt Lõi (Band 4.0 – 5.0)': 'Stage 1: Foundation & Core Skills (Band 4.0 – 5.0)',
  'Chặng 2: Nắm Vững Toàn Bộ Dạng Bài Thực Chiến (Band 5.5 – 6.5)': 'Stage 2: Master All Practical Types (Band 5.5 – 6.5)',
  'Chặng 3: Đọc Hiểu Chuyên Sâu, Bẻ Bẫy & Chiến Thuật Làm Bài (Band 7.0 – 9.0)': 'Stage 3: In-Depth Reading, Trap Decoders & Tactics (Band 7.0 – 9.0)',
  'Chặng 4: Kỹ Thuật Đọc Thi Máy Tính (CDI)': 'Stage 4: CDI Computer Reading Techniques',
  'Chặng 1: Nền Tảng & Phản Xạ Âm Học (Band 4.0 – 5.0)': 'Stage 1: Foundation & Acoustic Reflexes (Band 4.0 – 5.0)',
  'Chặng 2: Nắm Vững 4 Phần Thi & Bẫy Kinh Điển (Band 5.5 – 6.5)': 'Stage 2: Master All 4 Sections & Classic Traps (Band 5.5 – 6.5)',
  'Chặng 3: Bẻ Khóa Đối Thoại & Bài Giảng Học Thuật (Band 7.0 – 9.0)': 'Stage 3: Dialogue Analysis & Academic Lectures (Band 7.0 – 9.0)',
  'Chặng 4: Kỹ Năng Thi Listening Trên Máy Tính (CDI)': 'Stage 4: CDI Computer Listening Skills',
  'Chặng 1: Nền Tảng Phản Xạ & Xóa Sợ Nói (Band 4.0 – 5.0)': 'Stage 1: Reflex Foundation & Speaking Confidence (Band 4.0 – 5.0)',
  'Chặng 2: Làm Chủ Part 1 & Storytelling Part 2 (Band 5.5 – 6.5)': 'Stage 2: Master Part 1 & Part 2 Storytelling (Band 5.5 – 6.5)',
  'Chặng 3: Tư Duy Phản Biện & Collocations C1/C2 (Band 7.0 – 8.5+)': 'Stage 3: Critical Thinking & C1/C2 Collocations (Band 7.0 – 8.5+)',
  'Chặng 4: Tâm Lý Phòng Thi & Tương Tác Giám Khảo': 'Stage 4: Exam Room Mindset & Examiner Interaction',
  'Core Grammar & Vocab Guide': 'Core Grammar & Vocab Guide'
};

/**
 * Returns localized stage label
 */
export function getLocalizedStage(stage, isEn) {
  if (!isEn || !stage) return stage;
  return STAGE_LOCALIZATION[stage] || stage;
}

/**
 * Returns localized article object containing title, summary, content, and stage
 */
export function getLocalizedArticle(item, isEn) {
  if (!item) return item;
  if (!isEn) return item;

  let enArticle = null;
  if (item.skill === 'writing') {
    enArticle = WRITING_THEORY_ARTICLES_EN[item.id];
  } else if (item.skill === 'reading') {
    enArticle = READING_THEORY_ARTICLES_EN[item.id];
  } else if (item.skill === 'listening') {
    enArticle = LISTENING_THEORY_ARTICLES_EN[item.id];
  } else if (item.skill === 'speaking') {
    enArticle = SPEAKING_THEORY_ARTICLES_EN[item.id];
  } else if (item.skill === 'grammar-vocab') {
    enArticle = GRAMMAR_VOCAB_THEORY_ARTICLES_EN[item.id];
  }

  // Fallback check across all collections
  if (!enArticle) {
    enArticle =
      WRITING_THEORY_ARTICLES_EN[item.id] ||
      READING_THEORY_ARTICLES_EN[item.id] ||
      LISTENING_THEORY_ARTICLES_EN[item.id] ||
      SPEAKING_THEORY_ARTICLES_EN[item.id] ||
      GRAMMAR_VOCAB_THEORY_ARTICLES_EN[item.id];
  }

  const enMeta = THEORY_I18N_EN[item.id];

  const title = (enArticle?.title) || (enMeta?.title) || item.title;
  const summary = (enArticle?.summary) || (enMeta?.tip) || item.summary;
  const content = (enArticle?.content) || item.content;
  const stage = (enArticle?.stage) || getLocalizedStage(item.stage, true);

  return {
    ...item,
    title,
    summary,
    content,
    stage
  };
}

export { 
  WRITING_THEORY_ARTICLES_EN,
  READING_THEORY_ARTICLES_EN,
  LISTENING_THEORY_ARTICLES_EN,
  SPEAKING_THEORY_ARTICLES_EN,
  GRAMMAR_VOCAB_THEORY_ARTICLES_EN
};
