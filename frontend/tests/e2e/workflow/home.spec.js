import { test, expect } from '@playwright/test';
import { verifyTopNavMenubar, verifySectionVisibility } from '../../support/home.js';

test.use({ baseURL: 'https://www.jakekohl.dev' });

const brandText = 'Jake Kohl';
const menuItems = [
  { dataTest: 'nav-home', label: 'Home' },
  { dataTest: 'nav-roles', label: 'Career' },
  { dataTest: 'nav-projects', label: 'Projects' },
  { dataTest: 'nav-contact', label: 'Contact' },
];
const socialLinks = [
  { dataTest: 'social-github', link: 'https://github.com/jakekohl' },
  { dataTest: 'social-linkedin', link: 'https://linkedin.com/in/jacob-jp-kohl' },
];
const sections = ['hero-section', 'stats-section'];

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the home page with the Top Navigation Menubar', async ({ page }) => {
    await verifyTopNavMenubar(page, brandText, menuItems, socialLinks);
    sections.forEach(async (section) => {
      await verifySectionVisibility(page, section);
    });
  });

  test('should inform the user whose portfolio they are looking at', async ({ page }) => {
    const heroSection = page.getByTestId('hero-section');

    await expect(heroSection).toBeVisible();
    await expect(heroSection.getByText('Jake Kohl')).toBeVisible();
    await expect(heroSection.getByText('Quality Assurance Engineer')).toBeVisible();
    await expect(heroSection.getByText('Test Automation Enthusiast')).toBeVisible();

    const profileAvatar = heroSection.getByTestId('profile-avatar');

    await expect(profileAvatar).toBeVisible();
    await expect(profileAvatar.getByRole('img')).toHaveAttribute('src', /^https:\/\/avatars\.githubusercontent\.com\/.*$/i);
  });
  test('should allow user to navigate to the projects page through the hero section', async ({ page }) => {
    const heroSection = page.getByTestId('hero-section');
    const heroProjectsButton = heroSection.getByTestId('hero-projects-button');

    await expect(heroProjectsButton).toBeVisible();
    await heroProjectsButton.click();
    await expect(page).toHaveURL('/projects');
  });
  test('should allow a user to directly download a resume from the hero section', async ({ page }) => {
    const heroSection = page.getByTestId('hero-section');
    const heroResumeButton = heroSection.getByTestId('hero-resume-button');
    const downloadPromise = page.waitForEvent('download');

    await expect(heroResumeButton).toBeVisible();
    await heroResumeButton.click();
    const download = await downloadPromise;

    await download.saveAs('tests/downloads/Resume_kohlJacob.pdf');
  });
  // test('should showcase the user\'s years of experience in different domains', async ({ page }) => {});
  // test('should showcase the user\'s years of experience in different domains', async ({ page }) => {});
  // test('should showcase the user\'s github activity', async ({ page }) => {});
  // test('should display the site footer', async ({ page }) => {});
});
