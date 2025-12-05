import { test, expect } from '@playwright/test';
import { verifyProjects } from '../../support/projects';

const apiUrl = process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev'

test.describe('Projects Page', () => {
  const teamFilter = 'Tagboard';

  let ongoingProjects = [];
  let completedProjects = [];

  test.beforeEach(async ({ page }) => {
    ongoingProjects = [];
    completedProjects = [];

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByTestId('nav-projects').waitFor({ state: 'visible' });

    const projectsPromise = page.waitForResponse(
      async (response) => {
        return response.url() === (`${apiUrl}/projects`) && response.status() === 200;
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
    await page.getByTestId('ongoing-entity-filter').click();
    await page.getByRole('option', { name: teamFilter }).click();

    for (const project of ongoingProjects) {
      await expect(page.getByTestId(project.dataTest)).toBeVisible({visible: project.entity === teamFilter ? true : false});
    }
  });

  test('should show a list of completed projects', async ({ page }) => {
    await verifyProjects(page, completedProjects);
    await page.getByTestId('completed-entity-filter').click();
    await page.getByRole('option', { name: teamFilter }).click();

    for (const project of completedProjects) {
      await expect(page.getByTestId(project.dataTest)).toBeVisible({visible: project.entity === teamFilter ? true : false});
    }
  });
});
