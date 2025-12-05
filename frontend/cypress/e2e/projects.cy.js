describe('Projects', () => {
  const apiUrl = Cypress.env('VITE_API_URL') || 'https://portfolio.jakekohl.dev';

  const ongoingProjects = [];
  const completedProjects = [];

  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/projects`).as('getProjects');

    cy.visit(`${Cypress.config('baseUrl')}/projects`);
    cy.wait('@getProjects').then((getProjectsResponse) => {
      ongoingProjects.push(...getProjectsResponse.response.body.filter((project) => project.status === 'In Development'));
      completedProjects.push(...getProjectsResponse.response.body.filter((project) => project.status === 'Completed'));
    });
  });

  it('should show a list of completed projects', () => {
    const teamFilter = 'Tagboard'
    cy.getDataTest('completed-projects').should('be.visible').within(() => {
      completedProjects.forEach((project) => {
        cy.validateProjectCard(project);
      });
    });
    cy.selectTeamFilter(teamFilter, 'completed').then(() => {
      completedProjects.forEach((project) => {
        cy.getDataTest(project.dataTest).should(project.entity === teamFilter ? 'be.visible' : 'not.exist');
      })
    })
  });

  it('should show a list of ongoing projects', () => {
    const teamFilter = 'Tagboard'
    cy.getDataTest('ongoing-projects').should('be.visible').within(() => {
      ongoingProjects.forEach((project) => {
        cy.validateProjectCard(project);
      });
    });
    cy.selectTeamFilter(teamFilter, 'ongoing').then(() => {
      ongoingProjects.forEach((project) => {
        cy.getDataTest(project.dataTest).should(project.entity === teamFilter ? 'be.visible' : 'not.exist');
      })
    })
  });
});
