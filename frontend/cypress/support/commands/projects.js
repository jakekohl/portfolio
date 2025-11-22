/**
 * Validates a project card
 *
 * @param {Object} project - The project object
 * @param {string} project.title - The project title
 * @param {string} project.status - The project status
 * @param {string[]} project.images - The project images
 * @param {string[]} project.technologies - The project technologies
 * @param {string[]} project.skills - The project skills
 * @param {string[]} project.features - The project features
 * @param {boolean} project.githubButton - Whether the project has a GitHub button
 * @param {boolean} project.demoButton - Whether the project has a demo button
 */
Cypress.Commands.add('validateProjectCard', (project) => {
  cy.getDataTest(project.dataTest).should('be.visible').within(() => {
    cy.getDataTest('project-title').should('contain', project.title);
    cy.getDataTest('project-status').should('contain', project.status);
    cy.getDataTest('project-description').should('be.visible');
    cy.getDataTest('project-images').should(project.images.length > 0 ? 'be.visible' : 'not.exist');
    cy.getDataTest('project-technologies').should('be.visible');
    cy.getDataTest('project-skills').should('be.visible');
    cy.getDataTest('project-features').should('be.visible');
    cy.getDataTest('project-code-button').should(project.githubButton ? 'be.visible' : 'not.exist');
    cy.getDataTest('project-demo-button').should(project.demoButton ? 'be.visible' : 'not.exist');
  });
});
