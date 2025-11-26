/**
 * Validates that the roles are displayed in the roles grid
 * @param {Array} roles - The roles to validate
 * @example
 * cy.validateRoles(['role-qa-tagboard', 'role-manager-infor', 'role-senior-infor', 'role-services-infor', 'role-qa-infor', 'role-support-microsoft']);
 */
Cypress.Commands.add('validateRoles', (roles) => {
  roles.forEach(role => {
    cy.getDataTest(role).should('be.visible');
  });
});