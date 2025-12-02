import { test, expect } from '@playwright/test';

const apiUrl = process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev';

test.describe('Roles API Tests', () => {
  test('GET /roles - should return a 200 status code and return a list of roles', async ({ request }) => {
    const rolesPromise = await request.get(`${apiUrl}/roles`);

    const rolesResponse = await rolesPromise;
    const rolesResponseBody = await rolesResponse.json();

    expect(rolesResponse.status()).toBe(200);
    expect(rolesResponseBody).toBeInstanceOf(Array);
    expect(rolesResponseBody.length).toBeGreaterThan(0);
    for (const role of rolesResponseBody) {
      expect(role).toHaveProperty('title');
      expect(role).toHaveProperty('company');
      expect(role).toHaveProperty('location');
      expect(role).toHaveProperty('startDate');
      expect(role).toHaveProperty('endDate');
      expect(role).toHaveProperty('description');
      expect(role).toHaveProperty('url');
    }
  });
});
