import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only run TypeScript sources; never compiled copies under dist/.
    include: ['src/**/*.test.ts'],
  },
});
