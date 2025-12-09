import { test, expect } from '@playwright/test';

const apiUrl = process.env.VITE_API_URL || 'https://portfolio.jakekohl.dev';

test.describe('Projects API Tests', () => {
  test('GET /projects - should return a 200 status code and return a list of projects', async ({ request }) => {
    const projectsPromise = await request.get(`${apiUrl}/projects`);
    const projectsResponse = await projectsPromise;
    const projectsResponseBody = await projectsResponse.json();

    expect(projectsResponse.status()).toBe(200);
    expect(projectsResponseBody).toBeInstanceOf(Array);
    for (const project of projectsResponseBody) {
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('technologies');
      expect(project).toHaveProperty('skillsLeveraged');
      expect(project).toHaveProperty('status');
      expect(project).toHaveProperty('github');
      expect(project).toHaveProperty('demo');
      expect(project).toHaveProperty('features');
      expect(project).toHaveProperty('dataTest');
      expect(project).toHaveProperty('images');
    }
  });

  test('GET /projects/entities - should return a 200 status code and a list of entities', async ({ request }) => {
    const projectEntitiesPromise = await request.get(`${apiUrl}/projects/entities`);
    const projectEntitiesResponse = await projectEntitiesPromise;
    const projectEntitiesResponseBody = await projectEntitiesResponse.json();

    expect(projectEntitiesResponse.status()).toBe(200);
    expect(projectEntitiesResponseBody.entities).toBeInstanceOf(Array);
  });
});
