import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const DEFAULT_WEB_PORT = '5173';
const DEFAULT_API_PORT = '3000';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(process.cwd(), '../..'), '');

  return {
    plugins: [react()],
    server: {
      port: Number(env['WEB_PORT'] ?? DEFAULT_WEB_PORT),
      proxy: {
        '/api': { target: `http://localhost:${env['API_PORT'] ?? DEFAULT_API_PORT}` },
      },
    },
  };
});
