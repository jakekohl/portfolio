describe('Roles', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clickDataTest('nav-roles');
    cy.url().should('include', '/roles');
  });

  const roles = [
    'role-qa-tagboard',
    'role-manager-infor',
    'role-senior-infor',
    'role-services-infor',
    'role-qa-infor',
    'role-support-microsoft'
  ];

  it('should display the roles', () => {
    cy.getDataTest('roles-grid').should('be.visible');
    cy.validateRoles(roles);
  });
});