import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setupVitest.js'],
    include: ['tests/**/*.{test,spec}.{js,jsx}', 'tests/**/test_*.js'],
    testTimeout: 10000
  }
});
