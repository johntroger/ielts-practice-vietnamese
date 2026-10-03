/**
 * Gemini AI Facade Layer (Backward Compatibility Adapter)
 * Re-exports all domain AI services to preserve existing import contracts across the entire platform.
 */

export * from './ai/coreGeminiClient.js';
export * from './ai/writingAiService.js';
export * from './ai/speakingAiService.js';
export * from './ai/readingListeningAiService.js';
export * from './ai/practiceDrillsAiService.js';
