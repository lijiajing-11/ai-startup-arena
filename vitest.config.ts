import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 15000,
    hookTimeout: 15000,
    exclude: ['node_modules/**', 'node_modules_bak2/**', 'dist/**'],
  },
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'lcov', 'html'],
    include: ['src/**/*.ts'],
    exclude: ['src/__tests__/**', 'src/**/*.test.ts', '**/node_modules_bak*/**'],
    thresholds: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50,
    },
  },
});
