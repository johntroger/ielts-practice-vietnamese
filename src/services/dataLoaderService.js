/**
 * Dynamic Data Loader Service (Step 77: Dynamic Data Chunking Architecture)
 * Provides on-demand, memory-cached lazy loading for heavy Cambridge exam banks
 * and educational handbooks, optimizing initial bundle footprint and runtime memory.
 */

// In-memory runtime cache for loaded data modules
const dataCache = new Map();

export class DataLoaderService {
  /**
   * Lazily loads authentic Cambridge Writing Tasks bank.
   */
  static async loadCambridgeWritingTasks() {
    if (dataCache.has('cambridgeWritingTasks')) {
      return dataCache.get('cambridgeWritingTasks');
    }
    const module = await import('../data/cambridgeWritingTasks.js');
    const tasks = module.CAMBRIDGE_WRITING_TASKS || [];
    dataCache.set('cambridgeWritingTasks', tasks);
    return tasks;
  }

  /**
   * Lazily loads Cambridge Reading Passages & Exam Questions.
   */
  static async loadReadingTasks() {
    if (dataCache.has('readingTasks')) {
      return dataCache.get('readingTasks');
    }
    const module = await import('../data/readingTasks.js');
    const tasks = module.INITIAL_READING_TESTS || module.READING_TASKS || [];
    dataCache.set('readingTasks', tasks);
    return tasks;
  }

  /**
   * Lazily loads Cambridge Listening Audio Transcripts & Questions.
   */
  static async loadListeningTasks() {
    if (dataCache.has('listeningTasks')) {
      return dataCache.get('listeningTasks');
    }
    const module = await import('../data/listeningTasks.js');
    const tasks = module.INITIAL_LISTENING_TESTS || module.LISTENING_TASKS || [];
    dataCache.set('listeningTasks', tasks);
    return tasks;
  }

  /**
   * Lazily loads Speaking Topics & 3-Part Questions Bank.
   */
  static async loadSpeakingTopics() {
    if (dataCache.has('speakingTopics')) {
      return dataCache.get('speakingTopics');
    }
    const module = await import('../data/speakingTopics.js');
    const topics = {
      part1: module.SPEAKING_PART1_TOPICS || [],
      part2: module.SPEAKING_PART2_CUECARDS || [],
      part3: module.SPEAKING_PART3_QUESTIONS || [],
      mockPacks: module.SPEAKING_MOCK_TEST_PACKS || [],
      examiners: module.SPEAKING_EXAMINER_PROFILES || []
    };
    dataCache.set('speakingTopics', topics);
    return topics;
  }

  /**
   * Lazily loads Cambridge Theory Handbook content.
   */
  static async loadTheoryHandbook() {
    if (dataCache.has('theoryHandbook')) {
      return dataCache.get('theoryHandbook');
    }
    const module = await import('../data/theoryHandbook.js');
    const handbook = module.THEORY_HANDBOOK || module.default || [];
    dataCache.set('theoryHandbook', handbook);
    return handbook;
  }

  /**
   * Lazily loads Theory Handbook chunk for a specific skill.
   */
  static async loadTheoryHandbookBySkill(skill) {
    const cacheKey = `theoryHandbook_${skill}`;
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    const module = await import('../data/theoryHandbook.js');
    const items = await module.loadTheoryHandbookBySkill(skill);
    dataCache.set(cacheKey, items);
    return items;
  }

  /**
   * Lazily loads a single Theory Article on demand.
   */
  static async loadTheoryArticle(articleId) {
    const module = await import('../data/theoryHandbook.js');
    return module.loadTheoryArticle(articleId);
  }

  /**
   * Filters Cambridge tasks by book edition (e.g. Cambridge 18, 19, 20).
   */
  static async filterTasksByCambridgeBook(bookNumber) {
    const all = await this.loadCambridgeWritingTasks();
    return all.filter(t => t.cambridgeBook === Number(bookNumber));
  }

  /**
   * Lazily loads Atlas English Arena Question Bank or a specific batch on demand.
   */
  static async loadArenaQuestionsOnDemand(batchName = 'all') {
    const cacheKey = `arenaQuestions_${batchName}`;
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }
    const module = await import('../data/arenaQuestionBank.js');
    const items = typeof module.loadArenaQuestionBatchAsync === 'function'
      ? await module.loadArenaQuestionBatchAsync(batchName)
      : (module.ARENA_QUESTION_BANK || []);
    dataCache.set(cacheKey, items);
    return items;
  }

  /**
   * Lazily loads Vocabulary, Grammar & Spelling Master Bank on demand.
   */
  static async loadVocabGrammarSpellingBankOnDemand() {
    if (dataCache.has('vocabGrammarSpellingBank')) {
      return dataCache.get('vocabGrammarSpellingBank');
    }
    const module = await import('../data/vocabGrammarSpellingData.js');
    const bank = {
      vocabQuiz: module.IELTS_THEMATIC_VOCAB_DECKS || module.VOCAB_QUIZ_BANK || [],
      grammarDrills: module.IELTS_GRAMMAR_PACK || module.GRAMMAR_DRILLS_BANK || [],
      spellingTasks: module.IELTS_SPELLING_TRAPS || module.SPELLING_TASKS_BANK || [],
      synonymPairs: module.CAMBRIDGE_SYNONYM_PAIRS || []
    };
    dataCache.set('vocabGrammarSpellingBank', bank);
    return bank;
  }

  /**
   * Clears the in-memory cache to free RAM when necessary.
   */
  static clearCache() {
    dataCache.clear();
  }
}

export const loadTheoryHandbookBySkill = (skill) => DataLoaderService.loadTheoryHandbookBySkill(skill);
export const loadTheoryArticle = (articleId) => DataLoaderService.loadTheoryArticle(articleId);
export const loadArenaQuestionsOnDemand = (batchName = 'all') => DataLoaderService.loadArenaQuestionsOnDemand(batchName);
export const loadVocabGrammarSpellingBankOnDemand = () => DataLoaderService.loadVocabGrammarSpellingBankOnDemand();
