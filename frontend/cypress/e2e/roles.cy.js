describe('Roles', () => {
  const roles = [];

  beforeEach(() => {
    cy.intercept('GET', '**/roles').as('getRoles');

    cy.visit('/');
    cy.clickDataTest('nav-roles');
    cy.url().should('include', '/roles');
    cy.wait('@getRoles').then((getRolesResponse) => {
      roles.push(...getRolesResponse.response.body);
    });
  });

  it('should display the roles', () => {
    cy.getDataTest('roles-grid').should('be.visible');
    cy.validateRoles(roles);
  });
});
