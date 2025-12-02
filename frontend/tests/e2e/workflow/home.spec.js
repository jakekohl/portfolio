import { test, expect } from '@playwright/test';
import { verifyTopNavMenubar, verifySectionVisibility, verifyProfessionalStats, verifyGitHubHeatmap, selectGitHubYear } from '../../support/home';

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
    const mePromise = page.waitForResponse(async (response) => {
      return response.url().includes('/me') && response.status() === 200;
    });

    const githubStatsPromise = page.waitForResponse(async (response) => {
      return response.url().includes('/github-stats') && response.status() === 200;
    });

    await page.goto('/');
    // eslint-disable-next-line no-unused-vars
    const meResponse = await mePromise;
    // eslint-disable-next-line no-unused-vars
    const githubStatsResponse = await githubStatsPromise;
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

  test('should showcase the user\'s years of experience in different domains', async ({ page }) => {
    const statsSection = page.getByTestId('stats-section');
    const stats = [
      { dataTest: 'stat-quality-assurance', label: 'Quality Assurance' },
      { dataTest: 'stat-technical-support', label: 'Technical Support' },
      { dataTest: 'stat-technical-leadership', label: 'Technical Leadership' },
      { dataTest: 'stat-management', label: 'Management' },
      { dataTest: 'stat-software-development', label: 'Software Development' },
      { dataTest: 'stat-infrastructure', label: 'Infrastructure' },
    ];

    await expect(statsSection).toBeVisible();
    await expect(statsSection.getByText('Professional Experience (Years)')).toBeVisible();

    await verifyProfessionalStats(statsSection, stats);
  });

  test('should showcase the user\'s github activity', async ({ page }) => {
    const githubStatsPromise = page.waitForResponse(async (response) => {
      return response.url().includes('/github-stats') && response.status() === 200;
    });

    const githubHeatmapSection = page.getByTestId('github-heatmap-section');
    const githubActivityLink = githubHeatmapSection.getByTestId('github-activity-link');

    await expect(githubHeatmapSection).toBeVisible();
    await expect(githubActivityLink).toBeVisible();
    await verifyGitHubHeatmap(githubHeatmapSection);
    await selectGitHubYear(page, githubHeatmapSection, '2024');

    const githubStatsResponse = await githubStatsPromise;
    const responseBody = await githubStatsResponse.json();

    await expect(githubHeatmapSection.getByTestId('github-contributions-count')).toBeVisible();
    await expect(githubHeatmapSection.getByTestId('github-contributions-count')).toContainText(responseBody.totalContributions.toString());
    await expect(githubHeatmapSection.getByTestId('github-selected-year')).toBeVisible();
    await expect(githubHeatmapSection.getByTestId('github-selected-year')).toContainText(responseBody.year.toString());
  });

  test('should display the site footer', async ({ page }) => {
    await expect(page.getByTestId('footer-text')).toBeVisible();
    await expect(page.getByTestId('footer-text')).toContainText('This site is continuously being improved and updated. New features and enhancements are regularly being worked on.');
    await expect(page.getByTestId('footer-copyright')).toBeVisible();
    await expect(page.getByTestId('footer-copyright')).toContainText(`© ${new Date().getFullYear()} Jake Kohl. Built with Vue.js and PrimeVue.`);
  });
});
