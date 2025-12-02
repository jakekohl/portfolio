import { test } from '@playwright/test';
import { verifyProjects } from '../../support/projects';

test.describe('Projects Page', () => {
  let ongoingProjects = [];
  let completedProjects = [];

  test.beforeEach(async ({ page }) => {
    ongoingProjects = [];
    completedProjects = [];

    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByTestId('nav-projects').waitFor({ state: 'visible' });

    const projectsPromise = page.waitForResponse(
      async (response) => {
        return response.url().includes('/projects') && response.status() === 200;
      },
      { timeout: 30000 },
    );

    await page.getByTestId('nav-projects').click();

    await page.waitForURL('**/projects', { waitUntil: 'networkidle' });

    const projectsResponse = await projectsPromise;
    const projectsResponseBody = await projectsResponse.json();

    ongoingProjects.push(...projectsResponseBody.filter((project) => project.status === 'In Development'));
    completedProjects.push(...projectsResponseBody.filter((project) => project.status === 'Completed'));
  });

  test('should show a list of ongoing projects', async ({ page }) => {
    await verifyProjects(page, ongoingProjects);
  });

  test('should show a list of completed projects', async ({ page }) => {
    await verifyProjects(page, completedProjects);
  });
});
