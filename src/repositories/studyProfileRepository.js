/**
 * StudyProfileRepository
 * Data Access Layer for student learning state, vocabulary notebook, mistake log,
 * mastered topics, streak tracker, and active drafts.
 */

import { safeGet, safeSet } from '../utils/storageService.js';
import { saveUserVocabItem, deleteUserVocabItem } from '../services/dataSyncService.js';

const DEFAULT_INITIAL_VOCAB = [
  { id: 'v1', phrase: 'catalyze novel industries', meaningVi: 'thúc đẩy các ngành mới', meaningEn: 'spur / stimulate emerging industries into existence', example: 'AI will catalyze novel industries.', topic: 'tech' },
  { id: 'v2', phrase: 'pivotal element', meaningVi: 'yếu tố then chốt', meaningEn: 'crucial / essential component', example: 'Education is a pivotal element.', topic: 'edu' },
];
const DEFAULT_INITIAL_MISTAKES = [];

export const STUDY_STORAGE_KEYS = {
  VOCAB: 'ielts_vocab_notebook',
  MISTAKES: 'ielts_mistakes_log',
  NOTES: 'ielts_theory_notes',
  STREAK: 'ielts_streak_count',
  MASTERED: 'ielts_mastered_topics',
  ESSAYS_DRAFTS: 'ielts_essays_drafts',
  OUTLINES_DRAFTS: 'ielts_outlines_drafts'
};

export class StudyProfileRepository {
  static getVocabList() {
    return safeGet(STUDY_STORAGE_KEYS.VOCAB, DEFAULT_INITIAL_VOCAB);
  }

  static saveVocabList(vocab) {
    return safeSet(STUDY_STORAGE_KEYS.VOCAB, vocab);
  }

  static getMistakes() {
    return safeGet(STUDY_STORAGE_KEYS.MISTAKES, DEFAULT_INITIAL_MISTAKES);
  }

  static saveMistakes(mistakes) {
    return safeSet(STUDY_STORAGE_KEYS.MISTAKES, mistakes);
  }

  static getPersonalNotes() {
    return safeGet(STUDY_STORAGE_KEYS.NOTES, {});
  }

  static savePersonalNotes(notes) {
    return safeSet(STUDY_STORAGE_KEYS.NOTES, notes);
  }

  static getStreakCount() {
    return Number(safeGet(STUDY_STORAGE_KEYS.STREAK, '0'));
  }

  static saveStreakCount(streak) {
    return safeSet(STUDY_STORAGE_KEYS.STREAK, streak.toString());
  }

  static getMasteredIds() {
    return safeGet(STUDY_STORAGE_KEYS.MASTERED, []);
  }

  static saveMasteredIds(ids) {
    return safeSet(STUDY_STORAGE_KEYS.MASTERED, ids);
  }

  static toggleMasteredId(itemId, currentMasteredIds) {
    const isMastered = currentMasteredIds.includes(itemId);
    const updated = isMastered
      ? currentMasteredIds.filter(id => id !== itemId)
      : [...currentMasteredIds, itemId];
    this.saveMasteredIds(updated);
    return { updated, isMastered: !isMastered };
  }

  static getEssaysDrafts() {
    return safeGet(STUDY_STORAGE_KEYS.ESSAYS_DRAFTS, {});
  }

  static saveEssaysDrafts(drafts) {
    return safeSet(STUDY_STORAGE_KEYS.ESSAYS_DRAFTS, drafts);
  }

  static getOutlinesDrafts() {
    return safeGet(STUDY_STORAGE_KEYS.OUTLINES_DRAFTS, {});
  }

  static saveOutlinesDrafts(drafts) {
    return safeSet(STUDY_STORAGE_KEYS.OUTLINES_DRAFTS, drafts);
  }
}
