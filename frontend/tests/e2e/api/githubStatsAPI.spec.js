import { test, expect } from '@playwright/test';

const apiUrl = process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev';

test.describe('GitHub Stats API Tests', () => {
  test('GET /github-stats - should return a 200 status code and return a list of github stats', async ({ request }) => {
    const githubStatsPromise = await request.get(`${apiUrl}/github-stats`);
    const githubStatsResponse = await githubStatsPromise;
    const githubStatsResponseBody = await githubStatsResponse.json();

    expect(githubStatsResponse.status()).toBe(200);
    expect(githubStatsResponseBody).toBeInstanceOf(Object);
    expect(githubStatsResponseBody.contributions).toBeInstanceOf(Array);
    expect(githubStatsResponseBody.totalContributions).toBeGreaterThan(0);
    expect(githubStatsResponseBody.lastUpdated).toBeDefined();
    expect(githubStatsResponseBody.username).toBeDefined();
    expect(githubStatsResponseBody.year).toBeDefined();
    expect(githubStatsResponseBody.years).toBeDefined();
  });

  test('GET /github-stats?year=2024 - should return a 200 status code and return a list of github stats for the year 2024', async ({ request }) => {
    const githubStatsPromise = await request.get(`${apiUrl}/github-stats?year=2024`);
    const githubStatsResponse = await githubStatsPromise;
    const githubStatsResponseBody = await githubStatsResponse.json();

    expect(githubStatsResponse.status()).toBe(200);
    expect(githubStatsResponseBody).toBeInstanceOf(Object);
    expect(githubStatsResponseBody.contributions).toBeInstanceOf(Array);
  });

  // Don't run this test locally since 
  if (!apiUrl.includes('localhost')) {
    test('POST /github-stats/ingest - should return a 401 status code and return a message indicating the secret is incorrect', async ({ request }) => {
      const githubStatsPromise = await request.post(`${apiUrl}/github-stats/ingest`, {
        headers: {
          'X-GitHub-Stats-Secret': 'incorrect-secret',
        },
      });
      const githubStatsResponse = await githubStatsPromise;
      const githubStatsResponseBody = await githubStatsResponse.json();
  
      expect(githubStatsResponse.status()).toBe(401);
      expect(githubStatsResponseBody).toBeInstanceOf(Object);
      expect(githubStatsResponseBody.detail).toBe('Invalid or missing X-GitHub-Stats-Secret header');
    });
  }
  

  // TODO: Add tests for the rate limit and for a successful ingestion using fixture response
});
