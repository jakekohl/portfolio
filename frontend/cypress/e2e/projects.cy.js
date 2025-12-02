describe('Projects', () => {
  const ongoingProjects = [];
  const completedProjects = [];

  beforeEach(() => {
    cy.intercept('GET', '**/projects').as('getProjects');

    cy.visit('/');
    cy.clickDataTest('nav-projects');
    cy.url().should('include', '/projects');
    cy.wait('@getProjects').then((getProjectsResponse) => {
      ongoingProjects.push(...getProjectsResponse.response.body.filter((project) => project.status === 'In Development'));
      completedProjects.push(...getProjectsResponse.response.body.filter((project) => project.status === 'Completed'));
    });
  });

  it('should show a list of ongoing projects', () => {
    cy.getDataTest('ongoing-projects').should('be.visible').within(() => {
      ongoingProjects.forEach((project) => {
        cy.validateProjectCard(project);
      });
    });
  });

  it('should show a list of completed projects', () => {
    cy.getDataTest('completed-projects').should('be.visible').within(() => {
      completedProjects.forEach((project) => {
        cy.validateProjectCard(project);
      });
    });
  });
});
