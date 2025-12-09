import { expect } from '@playwright/test';

/**
 * Verify the projects are displayed in the projects grid
 * @param {Page} page - The page object
 * @param {string[]} projects - The projects to verify
 */
export async function verifyProjects(page, projects) {
  for (const project of projects) {
    await expect(page.getByTestId(project.dataTest)).toBeVisible();
    await expect(page.getByTestId(project.dataTest).getByTestId('project-title')).toBeVisible({ visible: project.title.length > 0 ? true : false });
    await expect(page.getByTestId(project.dataTest).getByTestId('project-title')).toContainText(project.title);
    await expect(page.getByTestId(project.dataTest).getByTestId('project-status')).toBeVisible({ visible: project.status.length > 0 ? true : false });
    await expect(page.getByTestId(project.dataTest).getByTestId('project-status')).toContainText(project.status);
    await expect(page.getByTestId(project.dataTest).getByTestId('project-description')).toBeVisible({ visible: project.description.length > 0 ? true : false });
    await expect(page.getByTestId(project.dataTest).getByTestId('project-description')).toContainText(project.description);
    await expect(page.getByTestId(project.dataTest).getByTestId('project-technologies')).toBeVisible({ visible: project.technologies.length > 0 ? true : false });
    for (const technology of project.technologies) {
      await expect(page.getByTestId(project.dataTest).getByTestId('project-technologies')).toContainText(technology);
    }
    await expect(page.getByTestId(project.dataTest).getByTestId('project-skills')).toBeVisible({ visible: project.skillsLeveraged.length > 0 ? true : false });
    for (const skill of project.skillsLeveraged) {
      await expect(page.getByTestId(project.dataTest).getByTestId('project-skills')).toContainText(skill);
    }
    await expect(page.getByTestId(project.dataTest).getByTestId('project-features')).toBeVisible({ visible: project.features.length > 0 ? true : false });
    for (const feature of project.features) {
      await expect(page.getByTestId(project.dataTest).getByTestId('project-features')).toContainText(feature);
    }
    await expect(page.getByTestId(project.dataTest).getByTestId('project-images')).toBeVisible({ visible: project.images.length > 0 ? true : false });
    await expect(page.getByTestId(project.dataTest).getByTestId('project-code-button')).toBeVisible({ visible: project.github ? true : false });
    await expect(page.getByTestId(project.dataTest).getByTestId('project-demo-button')).toBeVisible({ visible: project.demo ? true : false });
    await expect(page.getByTestId(project.dataTest).getByTestId('project-url-button')).toBeVisible({ visible: project.url ? true : false });
  }
}
