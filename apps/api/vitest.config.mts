import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@common': resolve(process.cwd(), 'src/common'),
      '@config': resolve(process.cwd(), 'src/config'),
      '@database': resolve(process.cwd(), 'src/database'),
      '@generated': resolve(process.cwd(), 'src/generated'),
      '@modules': resolve(process.cwd(), 'src/modules'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
