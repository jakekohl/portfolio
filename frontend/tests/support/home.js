import { expect } from '@playwright/test';

/**
 * Verify the top navigation menubar
 * @param {Page} page - The page object
 * @param {string} brandText - The text for the brand slot
 * @param {Object[]} menuItems - The menu items to verify
 * @param {Object[]} socialLinks - The social links to verify
 */
export async function verifyTopNavMenubar(page, brandText, menuItems, socialLinks) {
  await expect(page.getByTestId('nav-top-menubar')).toBeVisible();
  await expect(page.getByTestId('brand-slot')).toHaveText(brandText);
  menuItems.forEach(async ({ dataTest, label }) => {
    await expect(page.getByTestId(dataTest)).toHaveText(label);
  });
  socialLinks.forEach(async ({ dataTest, link }) => {
    await expect(page.getByTestId(dataTest)).toHaveAttribute('href', link);
  });
}

/**
 * Verify the visibility of a section
 * @param {Page} page - The page object
 * @param {string} sectionSelector - The data test selector for the section
 */
export async function verifySectionVisibility(page, sectionSelector) {
  await expect(page.getByTestId(sectionSelector)).toBeVisible();
}


/**
 * Verify the professional stats
 * @param {ElementHandle} statsSection - The stats section element
 * @param {Object[]} stats - The stats to verify
 * @param {string} stat.dataTest - The data test selector for the stat
 * @param {string} stat.label - The label for the stat
 */
export async function verifyProfessionalStats(statsSection, stats) {
  stats.forEach(async (stat) => {
    await expect(statsSection.getByTestId(stat.dataTest)).toBeVisible();
    await expect(statsSection.getByTestId(stat.dataTest)).toContainText(stat.label);
  });
}

/**
 * Verify the github heatmap component
 * @param {ElementHandle} githubHeatmapSection - The github heatmap section element
 */
export async function verifyGitHubHeatmap(githubHeatmapSection) {
  await expect(githubHeatmapSection.getByTestId('github-heatmap-component')).toBeVisible();
  await expect(githubHeatmapSection.getByTestId('github-contributions-count')).toBeVisible();
  await expect(githubHeatmapSection.getByTestId('github-year-selector')).toBeVisible();
  await expect(githubHeatmapSection.getByTestId('github-last-updated')).toBeVisible();
}

/**
 * Select a github year
 * @param {Page} page - The page object
 * @param {ElementHandle} githubHeatmapSection - The github heatmap section element
 * @param {string} year - The year to select
 */
export async function selectGitHubYear(page, githubHeatmapSection, year) {
  await githubHeatmapSection.getByTestId('github-year-selector').click({ force: true });
  await page.getByRole('option', { name: year }).click({ force: true });
}
