import { test, expect } from '@playwright/test';

const apiUrl = process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev';

test.describe('Health API Tests', () => {
  test('GET /health - should return a 200 status code and return a message indicating the API is running', async ({ request }) => {
    const healthPromise = await request.get(`${apiUrl}/health`);
    const healthResponse = await healthPromise;
    const healthResponseBody = await healthResponse.json();

    expect(healthResponse.status()).toBe(200);
    expect(healthResponseBody).toBeInstanceOf(Object);
    expect(healthResponseBody.status).toBe('ok');
    expect(healthResponseBody.message).toBe('API is running');
    expect(healthResponseBody.version).toBeDefined();
    expect(healthResponseBody.timestamp).toBeDefined();
  });
});
