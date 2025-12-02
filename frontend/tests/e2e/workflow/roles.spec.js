import { test, expect } from '@playwright/test';
import { verifyRoles } from '../../support/roles';

test.describe('Roles Page', () => {
  let roles = [];

  test.beforeEach(async ({ page }) => {
    roles = [];

    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByTestId('nav-roles').waitFor({ state: 'visible' });

    const rolesPromise = page.waitForResponse(
      async (response) => {
        return response.url().includes('/roles') && response.status() === 200;
      },
      { timeout: 30000 },
    );

    await page.getByTestId('nav-roles').click();

    await page.waitForURL('**/roles', { waitUntil: 'networkidle' });

    const rolesResponse = await rolesPromise;
    const rolesResponseBody = await rolesResponse.json();

    roles.push(...rolesResponseBody);
  });

  test('should display the roles page', async ({ page }) => {
    await expect(page.getByTestId('roles-grid')).toBeVisible();
    await verifyRoles(page, roles);
  });
});
