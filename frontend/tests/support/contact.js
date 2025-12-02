import { expect } from '@playwright/test';

/**
 * verify the specialties are displayed correctly
 * @param {Page} page - The page object
 * @param {Object} specialty - The specialty to verify
 * @param {string} specialty.dataTest - The data-test attribute of the specialty
 * @param {string} specialty.title - The title of the specialty
 * @param {string} specialty.description - The description of the specialty
 */
export async function verifySpecialties(page, specialties) {
  specialties.forEach(async (specialty) => {
    await expect(page.getByTestId(specialty.dataTest)).toBeVisible();
    await expect(page.getByTestId(specialty.dataTest).getByTestId('specialty-title')).toBeVisible();
    await expect(page.getByTestId(specialty.dataTest).getByTestId('specialty-title')).toContainText(specialty.title);
    await expect(page.getByTestId(specialty.dataTest).getByTestId('specialty-description')).toBeVisible();
    await expect(page.getByTestId(specialty.dataTest).getByTestId('specialty-description')).toContainText(specialty.description);
  });
}

/**
 * verify the contact methods are displayed correctly
 * @param {Page} page - The page object
 * @param {Object[]} contactMethods - The contact methods to verify
 * @param {string} contactMethods.dataTest - The data-test attribute of the contact method
 * @param {string} contactMethods.type - The type of the contact method
 * @param {string} contactMethods.value - The value of the contact method
 * @param {string} contactMethods.copy - The text to copy to the clipboard
 */
export async function verifyContactMethods(page, contactMethods) {
  page.context().grantPermissions(['clipboard-read']);
  contactMethods.forEach(async (contactMethod) => {
    await expect(page.getByTestId(contactMethod.dataTest)).toBeVisible();
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-type')).toBeVisible();
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-type')).toContainText(contactMethod.type);
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-value')).toBeVisible();
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-value')).toHaveAttribute('href', contactMethod.link);
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-description')).toBeVisible();
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-description')).toContainText(contactMethod.description);
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-copy')).toBeVisible();
    await expect(page.getByTestId(contactMethod.dataTest).getByTestId('contact-copy')).toBeEnabled();
    // Implement copy contact information to clipboard validation logic here
  });
}
