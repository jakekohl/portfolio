import { expect, test } from '@playwright/test';

const menuItems = [
  { dataTest: 'nav-home', label: 'Home', link: '/' },
  { dataTest: 'nav-roles', label: 'Career', link: '/roles' },
  { dataTest: 'nav-projects', label: 'Projects', link: '/projects' },
  { dataTest: 'nav-contact', label: 'Contact', link: '/contact' },
];

const socialLinks = [
  { dataTest: 'social-github', link: 'https://github.com/jakekohl' },
  { dataTest: 'social-linkedin', link: 'https://linkedin.com/in/jacob-jp-kohl' },
];

const mobileMenuItems = [
  { dataTest: 'mobile-nav-home', label: 'Home', link: '/' },
  { dataTest: 'mobile-nav-roles', label: 'Career', link: '/roles' },
  { dataTest: 'mobile-nav-projects', label: 'Projects', link: '/projects' },
  { dataTest: 'mobile-nav-contact', label: 'Contact', link: '/contact' },
];

const mobileSocialLinks = [
  { dataTest: 'mobile-social-github', label: 'GitHub', link: 'https://github.com/jakekohl' },
  { dataTest: 'mobile-social-linkedin', label: 'LinkedIn', link: 'https://linkedin.com/in/jacob-jp-kohl' },
];

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test.describe('Top Navigation Menubar', () => {
    test('should display the home page with the Top Navigation Menubar', async ({ page }) => {
      for (const item of menuItems) {
        await expect(page.getByTestId(item.dataTest)).toBeVisible();
      }
      for (const link of socialLinks) {
        await expect(page.getByTestId(link.dataTest)).toBeVisible();
      }
    });
    for (const item of menuItems) {
      test(`should navigate to the ${item.label} page`, async ({ page }) => {
        await page.getByTestId(item.dataTest).click();
        await page.waitForURL(item.link);
        expect(page.url()).toContain(item.link);
      });
    }
  });

  test.describe('Sidebar Navigation Menu (Mobile)', () => {
    test('should show sidebar navigation menu when the viewport is below 768px', async ({ page }) => {
      await page.setViewportSize({ width: 767, height: 1080 });
      await page.getByTestId('mobile-menu-button').click();
      for (const item of mobileMenuItems) {
        await expect(page.getByTestId(item.dataTest)).toBeVisible();
      }
      for (const link of mobileSocialLinks) {
        await expect(page.getByTestId(link.dataTest)).toBeVisible();
      }
    });
    for (const item of mobileMenuItems) {
      test(`should navigate to the ${item.label} page`, async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 1080 });
        await page.getByTestId('mobile-menu-button').click();
        await page.getByTestId(item.dataTest).click();
        await page.waitForURL(item.link);
        expect(page.url()).toContain(item.link);
      });
    }
  });
});
