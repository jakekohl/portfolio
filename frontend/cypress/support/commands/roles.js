/**
 * Formats a date string to a human readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
const formatDate = (dateString) => {
  if (!dateString) {return 'Present';}
  try {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return dateString;
  }
};

/**
 * Validates that the roles are displayed in the roles grid
 * @param {Array} roles - The roles to validate
 * @example
 * cy.validateRoles(['role-qa-tagboard', 'role-manager-infor']);
 */
Cypress.Commands.add('validateRoles', (roles) => {
  roles.forEach(role => {
    cy.getDataTest(role.dataTest).should('be.visible').within(() => {
      cy.getDataTest('role-title').should('be.visible').should('contain', role.title);
      cy.getDataTest('role-company').should('be.visible').should('contain', role.company);
      cy.getDataTest('role-status').should('be.visible').should('contain', role.endDate ? 'Previous' : 'Current');
      cy.getDataTest('role-location').should('be.visible').should('contain', role.location);
      cy.getDataTest('role-dates').should('be.visible').should('contain', `${formatDate(role.startDate)} - ${formatDate(role.endDate)}`);
      cy.getDataTest('role-description').should('be.visible').within(() => {
        role.description.forEach(description => {
          cy.contains(description).should('be.visible');
        });
      });
      cy.getDataTest('role-url-button').should('be.visible').should('be.enabled');
    });
  });
});
