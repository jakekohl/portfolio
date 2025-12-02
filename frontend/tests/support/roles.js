import { expect } from '@playwright/test';

/**
 * Verify the roles are displayed in the roles grid
 * @param {Page} page - The page object
 * @param {string[]} roles - The roles to verify
 */
export async function verifyRoles(page, roles) {
  roles.forEach(async (role) => {
    await expect(page.getByTestId(role)).toBeVisible();
    await expect(page.getByTestId(role).getByTestId('role-title')).toBeVisible();
    await expect(page.getByTestId(role).getByTestId('role-company')).toBeVisible();
    await expect(page.getByTestId(role).getByTestId('role-status')).toBeVisible();
    await expect(page.getByTestId(role).getByTestId('role-location')).toBeVisible();
    await expect(page.getByTestId(role).getByTestId('role-dates')).toBeVisible();
    await expect(page.getByTestId(role).getByTestId('role-description')).toBeVisible();
    await expect(page.getByTestId(role).getByTestId('role-url-button')).toBeVisible();
  });
}
