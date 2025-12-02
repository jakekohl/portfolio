import { expect } from '@playwright/test';

/**
 * Formats a date string to a human readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) {return 'Present';}
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

/**
 * Verify the roles are displayed in the roles grid
 * @param {Page} page - The page object
 * @param {string[]} roles - The roles to verify
 */
export async function verifyRoles(page, roles) {
  for (const role of roles) {
    await expect(page.getByTestId(role.dataTest)).toBeVisible();
    await expect(page.getByTestId(role.dataTest).getByTestId('role-title')).toBeVisible();
    await expect(page.getByTestId(role.dataTest).getByTestId('role-title')).toContainText(role.title);
    await expect(page.getByTestId(role.dataTest).getByTestId('role-company')).toBeVisible();
    await expect(page.getByTestId(role.dataTest).getByTestId('role-company')).toContainText(role.company);
    await expect(page.getByTestId(role.dataTest).getByTestId('role-status')).toBeVisible();
    await expect(page.getByTestId(role.dataTest).getByTestId('role-status')).toContainText(role.endDate ? 'Previous' : 'Current');
    await expect(page.getByTestId(role.dataTest).getByTestId('role-location')).toBeVisible();
    await expect(page.getByTestId(role.dataTest).getByTestId('role-location')).toContainText(role.location);
    await expect(page.getByTestId(role.dataTest).getByTestId('role-dates')).toBeVisible();
    await expect(page.getByTestId(role.dataTest).getByTestId('role-dates')).toContainText(`${formatDate(role.startDate)} - ${formatDate(role.endDate)}`);
    await expect(page.getByTestId(role.dataTest).getByTestId('role-description')).toBeVisible();
    for (const description of role.description) {
      await expect(page.getByTestId(role.dataTest).getByTestId('role-description')).toContainText(description);
    }
    await expect(page.getByTestId(role.dataTest).getByTestId('role-url-button')).toBeVisible();
    await expect(page.getByTestId(role.dataTest).getByTestId('role-url-button')).toBeEnabled();
  }
}
