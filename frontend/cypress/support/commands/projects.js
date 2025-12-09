/**
 * Validates a project card
 *
 * @param {Object} project - The project object
 * @param {string} project.title - The project title
 * @param {string} project.status - The project status
 * @param {string[]} project.images - The project images
 * @param {string[]} project.technologies - The project technologies
 * @param {string[]} project.skillsLeveraged - The project skills leveraged
 * @param {string[]} project.features - The project features
 * @param {boolean} project.github - Whether the project has a GitHub button
 * @param {boolean} project.demo - Whether the project has a demo button
 * @param {boolean} project.url - Whether the project has a url button
 */
Cypress.Commands.add('validateProjectCard', (project) => {
  cy.getDataTest(project.dataTest).should('be.visible').within(() => {
    cy.getDataTest('project-title').should('contain', project.title);
    cy.getDataTest('project-status').should('contain', project.status);
    cy.getDataTest('project-description').should('be.visible').and('contain', project.description);
    cy.getDataTest('project-images').should(project.images.length > 0 ? 'be.visible' : 'not.exist');
    cy.getDataTest('project-technologies').should('be.visible').within(() => {
      project.technologies.forEach((technology) => {
        cy.contains(technology).should('be.visible');
      });
    });
    cy.getDataTest('project-skills').should('be.visible').within(() => {
      project.skillsLeveraged.forEach((skill) => {
        cy.contains(skill).should('be.visible');
      });
    });
    cy.getDataTest('project-features').should('be.visible').within(() => {
      project.features.forEach((feature) => {
        cy.contains(feature).should('be.visible');
      });
    });
    cy.getDataTest('project-code-button').should(project.github ? 'be.visible' : 'not.exist');
    cy.getDataTest('project-demo-button').should(project.demo ? 'be.visible' : 'not.exist');
    cy.getDataTest('project-url-button').should(project.url ? 'be.visible' : 'not.exist');
  });
});

/**
 * Selects Team Filter for Completed or Ongoing Projects
 *
 * @param value {String} - The Team value to filter on
 * @param list {String} - completed or ongoing
 */
Cypress.Commands.add('selectTeamFilter', (value, list = 'completed') => {
  cy.clickDataTest(`${list}-entity-filter`);
  cy.clickAriaLabel(value);
});
