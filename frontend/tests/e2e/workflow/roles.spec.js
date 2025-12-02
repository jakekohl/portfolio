import { test, expect } from '@playwright/test';
import { verifyRoles } from '../../support/roles';

const roles = [];

test.describe('Roles Page', () => {
  test.beforeEach(async ({ page }) => {
    const rolesPromise = page.waitForResponse(async (response) => {
      return response.url().includes('/roles') && response.status() === 200;
    });

    await page.goto('/');
    await page.getByTestId('nav-roles').click();

    const rolesResponse = await rolesPromise;
    const rolesResponseBody = await rolesResponse.json();

    roles.push(...rolesResponseBody);
  });

  test('should display the roles page', async ({ page }) => {
    await expect(page.getByTestId('roles-grid')).toBeVisible();
    await verifyRoles(page, roles);
  });
});
