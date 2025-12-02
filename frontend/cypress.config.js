import { defineConfig } from 'cypress';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./', '.env') });

export default defineConfig({
  projectId: 'kz76nf',
  retries: { runMode: 1, openMode: 0 },
  defaultBrowser: 'electron',
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: true,
  screenshots: true,
  downloadsFolder: 'cypress/downloads',
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: process.env.VITE_APP_URL || 'https://www.jakekohl.dev',
  },
  component: {
    specPattern: 'src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
  env: {
    VITE_API_URL: process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev',
  },
});
