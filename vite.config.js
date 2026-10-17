import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'vendor-charts';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor-libs';
          }
          if (
            id.includes('indexedDbStorage') ||
            id.includes('storageService') ||
            id.includes('submissionRepository') ||
            id.includes('backupRepository')
          ) {
            return 'core-storage';
          }
          if (
            id.includes('algorithmicEvaluationService') ||
            id.includes('algorithmicSpeakingService') ||
            id.includes('src/services/evaluation/') ||
            id.includes('src\\services\\evaluation\\')
          ) {
            return 'engine-algorithmic';
          }
          if (id.includes('geminiService') || id.includes('src/services/ai/') || id.includes('src\\services\\ai\\')) {
            return 'engine-gemini';
          }
          // Dynamic Data Chunking for Cambridge Bank & Learning Assets
          if (id.includes('src/data/') || id.includes('src\\data\\')) {
            if (id.includes('cambridgeWritingTasks') || id.includes('sampleTasks') || id.includes('processAndMapTasks')) {
              return 'data-cambridge-writing';
            }
            if (id.includes('readingTasks') || id.includes('src/data/reading/') || id.includes('src\\data\\reading\\')) {
              return 'data-reading-tasks';
            }
            if (id.includes('listeningTasks') || id.includes('src/data/listening/') || id.includes('src\\data\\listening\\')) {
              if (id.includes('cambridge18') || id.includes('cambridge20') || id.includes('academicLectures')) {
                return 'data-listening-cambridge';
              }
              return 'data-listening-tasks';
            }
            if (id.includes('speakingTopics')) {
              return 'data-speaking-topics';
            }
            // Skill-specific Dynamic Chunks for Theory & Strategy Guides
            if (id.includes('writingTheoryData')) {
              return 'data-theory-writing';
            }
            if (id.includes('readingTheoryData')) {
              return 'data-theory-reading';
            }
            if (id.includes('listeningTheoryData')) {
              return 'data-theory-listening';
            }
            if (id.includes('speakingTheoryData')) {
              return 'data-theory-speaking';
            }
            if (id.includes('grammarVocabTheoryData')) {
              return 'data-theory-grammar-vocab';
            }
            if (id.includes('theoryMetadata')) {
              return 'data-theory-metadata';
            }
            if (id.includes('theoryHandbook')) {
              return 'data-theory-handbook';
            }
            if (id.includes('MicroDrills') || id.includes('microDrills') || id.includes('vocabGrammarSpellingData')) {
              return 'data-drills-bank';
            }
            if (id.includes('arenaQuestionTranslations') || id.includes('arenaQuestions101Reading')) {
              return 'data-arena-translations';
            }
            if (id.includes('arenaQuestionBank') || id.includes('arenaQuestionsBatch') || id.includes('arenaTitansData')) {
              return 'data-arena-bank';
            }
            return 'data-core-bank';
          }
        },
      },
    },
  },
});
