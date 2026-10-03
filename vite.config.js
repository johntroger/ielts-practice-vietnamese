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
            id.includes('algorithmicEvaluationService') ||
            id.includes('algorithmicSpeakingService')
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
            if (id.includes('readingTasks')) {
              return 'data-reading-tasks';
            }
            if (id.includes('listeningTasks')) {
              return 'data-listening-tasks';
            }
            if (id.includes('speakingTopics')) {
              return 'data-speaking-topics';
            }
            if (id.includes('theoryHandbook')) {
              return 'data-theory-handbook';
            }
            if (id.includes('MicroDrills') || id.includes('microDrills') || id.includes('vocabGrammarSpellingData')) {
              return 'data-drills-bank';
            }
            return 'data-core-bank';
          }
        },
      },
    },
  },
});
