import { test, expect } from '@playwright/test';
import { verifyRoles } from '../../support/roles';

test.use({ baseURL: 'https://www.jakekohl.dev' });

const roles = [
  'role-qa-tagboard',
  'role-manager-infor',
  'role-senior-infor',
  'role-services-infor',
  'role-qa-infor',
  'role-support-microsoft',
];

test.describe('Roles Page', () => {
  test.beforeEach(async ({ page }) => {
    const rolesPromise = page.waitForResponse(async (response) => {
      return response.url().includes('/roles') && response.status() === 200;
    });

    await page.goto('/');
    await page.getByTestId('nav-roles').click();
    // eslint-disable-next-line no-unused-vars
    const rolesResponse = await rolesPromise;
  });

  test('should display the roles page', async ({ page }) => {
    await expect(page.getByTestId('roles-grid')).toBeVisible();
    await verifyRoles(page, roles);
  });
});
