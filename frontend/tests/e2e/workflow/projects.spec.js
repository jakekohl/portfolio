import { test } from '@playwright/test';
import { verifyProjects } from '../../support/projects';

test.use({ baseURL: 'https://www.jakekohl.dev' });

test.describe('Projects Page', () => {
  const ongoingProjects = [];
  const completedProjects = [];

  test.beforeEach(async ({ page }) => {
    const projectsPromise = page.waitForResponse(async (response) => {
      return response.url().includes('/projects') && response.status() === 200;
    });


    await page.goto('/');
    await page.getByTestId('nav-projects').click();

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
