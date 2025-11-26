/**
 * Validates that the roles are displayed in the roles grid
 * @param {Array} roles - The roles to validate
 * @example
 * cy.validateRoles(['role-qa-tagboard', 'role-manager-infor']);
 */
Cypress.Commands.add('validateRoles', (roles) => {
  roles.forEach(role => {
    cy.getDataTest(role).should('be.visible').within(() => {
      cy.getDataTest('role-title').should('be.visible');
      cy.getDataTest('role-company').should('be.visible');
      cy.getDataTest('role-status').should('be.visible');
      cy.getDataTest('role-location').should('be.visible');
      cy.getDataTest('role-dates').should('be.visible');
      cy.getDataTest('role-description').should('be.visible');
      cy.getDataTest('role-url-button').should('be.visible');
    });
  });
});
