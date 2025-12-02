/**
 * Verifies the specialties are displayed correctly
 * @param {Object} specialties - The specialties to verify
 * @param {string} specialties.dataTest - The data-test attribute of the specialty
 * @param {string} specialties.title - The title of the specialty
 * @param {string} specialties.description - The description of the specialty
 */
Cypress.Commands.add('verifySpecialties', (specialties) => {
  specialties.forEach((specialty) => {
    cy.getDataTest(specialty.dataTest).should('be.visible').within(() => {
      cy.getDataTest('specialty-title').should('be.visible').should('contain', specialty.title);
      cy.getDataTest('specialty-description').should('be.visible').should('contain', specialty.description);
    });
  });
});

/**
 * Verifies the contact method is displayed correctly
 * @param {Object} contactMethod - The contact method to verify
 * @param {string} contactMethod.dataTest - The data-test attribute of the contact method
 * @param {string} contactMethod.type - The type of the contact method
 * @param {string} contactMethod.link - The link of the contact method
 */
Cypress.Commands.add('verifyContactMethods', (contactMethod) => {
  cy.getDataTest(contactMethod.dataTest).should('be.visible')
    .within(() => {
      cy.getDataTest('contact-type').should('be.visible').should('contain', contactMethod.type);
      cy.getDataTest('contact-value').should('be.visible').should('have.attr', 'href', contactMethod.link);
      cy.getDataTest('contact-description').should('be.visible');
      cy.clickDataTest('contact-copy');
      cy.window().then((win) => {
        cy.wrap(win.navigator.clipboard.readText()).should('contain', contactMethod.type === 'Email' ? contactMethod.value : contactMethod.link);
      });
    });
});

