import { test, expect } from '@playwright/test';
import { verifySpecialties, verifyContactMethods } from '../../support/contact';

test.describe('Contact Page', () => {
  let specialties = [];
  let contactMethods = [];

  test.beforeEach(async ({ page }) => {
    specialties = [];
    contactMethods = [];

    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByTestId('nav-contact').waitFor({ state: 'visible' });

    const contactPromise = page.waitForResponse(
      async (response) => {
        return response.url().includes('/contact') && response.status() === 200;
      },
      { timeout: 30000 },
    );

    await page.getByTestId('nav-contact').click();

    await page.waitForURL('**/contact', { waitUntil: 'networkidle' });

    const contactResponse = await contactPromise;
    const contactResponseBody = await contactResponse.json();

    specialties.push(...contactResponseBody.specialties);
    contactMethods.push(...contactResponseBody.contact);
  });

  test('should display the specialties', async ({ page }) => {
    await expect(page.getByTestId('specialties-section')).toBeVisible();
    await expect(page.getByTestId('specialties-section')).toContainText('What I Can Help You With');
    await verifySpecialties(page, specialties);
  });

  test('should display the contact methods', async ({ page }) => {
    await expect(page.getByTestId('contact-methods-section')).toBeVisible();
    await verifyContactMethods(page, contactMethods);
  });
});
