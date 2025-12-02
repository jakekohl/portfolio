import { test, expect } from '@playwright/test';
import { verifySpecialties, verifyContactMethods } from '../../support/contact';

const specialties = [];
const contactMethods = [];

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    const contactPromise = page.waitForResponse(async (response) => {
      return response.url().includes('/contact') && response.status() === 200;
    });

    await page.goto('/');
    await page.getByTestId('nav-contact').click();

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
