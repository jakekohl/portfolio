describe('Roles', () => {
  const apiUrl = Cypress.env('VITE_API_URL') || 'https://portfolio.jakekohl.dev';

  const roles = [];

  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/roles`).as('getRoles');

    cy.visit(`${Cypress.config('baseUrl')}/roles`);
    cy.wait('@getRoles').then((getRolesResponse) => {
      roles.push(...getRolesResponse.response.body);
    });
  });

  it('should display the roles', () => {
    cy.getDataTest('roles-grid').should('be.visible');
    cy.validateRoles(roles);
  });
});
