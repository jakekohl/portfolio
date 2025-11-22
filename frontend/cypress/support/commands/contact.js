/**
 * Verifies the specialties are displayed correctly
 * @param {Object} specialties - The specialties to verify
 * @param {string} specialties.dataTest - The data-test attribute of the specialty
 * @param {string} specialties.label - The label of the specialty
 */
Cypress.Commands.add('verifySpecialties', (specialties) => {
  specialties.forEach((specialty) => {
    cy.getDataTest(specialty.dataTest).should('be.visible').should('contain', specialty.label);
  });
});

/**
 * Verifies the contact method is displayed correctly
 * @param {Object} contactMethod - The contact method to verify
 * @param {string} contactMethod.dataTest - The data-test attribute of the contact method
 * @param {string} contactMethod.label - The label of the contact method
 * @param {string} contactMethod.link - The link of the contact method
 * @param {string} contactMethod.copy - The text to copy to the clipboard
 */
Cypress.Commands.add('verifyContactMethods', (contactMethod) => {
  cy.getDataTest(contactMethod.dataTest).should('be.visible')
    .within(() => {
      cy.getDataTest('contact-type').should('be.visible').should('contain', contactMethod.label);
      cy.getDataTest('contact-value').should('be.visible').should('have.attr', 'href', contactMethod.link);
      cy.getDataTest('contact-description').should('be.visible');
      cy.clickDataTest('contact-copy')
      cy.window().then((win) => {
        cy.wrap(win.navigator.clipboard.readText()).should('contain', contactMethod.copy);
      });
    });
});

