import { test, expect } from '@playwright/test';

const apiUrl = process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev';

test.describe('Me API Tests', () => {
  test('GET /me - should return a 200 status code and return data about the user', async ({ request }) => {
    const mePromise = await request.get(`${apiUrl}/me`);
    const meResponse = await mePromise;
    const meResponseBody = await meResponse.json();

    expect(meResponse.status()).toBe(200);
    expect(meResponseBody).toBeInstanceOf(Object);
    expect(meResponseBody).toHaveProperty('name');
    expect(meResponseBody).toHaveProperty('experiences');
    expect(meResponseBody.experiences).toBeInstanceOf(Array);
    for (const experience of meResponseBody.experiences) {
      expect(experience).toHaveProperty('name');
      expect(experience).toHaveProperty('years');
    }
  });
});
