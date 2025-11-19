/**
 * Get an element using the data-test attribute
 * @param {string} selector - The data-test attribute value
 * @returns {Cypress.Chainable} - The element
 */
Cypress.Commands.add('getDataTest', (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

/**
 * Click an element using the data-test attribute
 * @param {string} selector - The data-test attribute value
 * @param {Object} options - The options for the click
 * @returns {Cypress.Chainable} - The element
 */
Cypress.Commands.add('clickDataTest', (selector, options) => {
  return cy.getDataTest(selector).click(options);
});
