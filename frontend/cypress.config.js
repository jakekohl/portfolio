import { defineConfig } from 'cypress';

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
    baseUrl: 'https://www.jakekohl.dev',
  },
  component: {
    specPattern: 'src/**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
  env: {
    API_URL: process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev',
  },
});
