describe('Projects', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clickDataTest('nav-projects');
    cy.url().should('include', '/projects');
  });

  it('should show a list of current projects', () => {
    const currentProjects = [
      {
        title: 'Personal Portfolio Website',
        status: 'In Development',
        images: [
          'portfolio1.png',
          'portfolio2.png',
          'portfolio3.png',
        ],
        dataTest: 'project-portfolio',
        githubButton: true,
        demoButton: true,
      },
      {
        title: 'Stride Builder',
        status: 'In Development',
        images: [],
        dataTest: 'project-stride-builder',
        githubButton: true,
        demoButton: true,
      },
      {
        title: 'Calculator',
        status: 'In Development',
        images: [],
        dataTest: 'project-calculator',
        githubButton: true,
        demoButton: false,
      },
    ];

    cy.getDataTest('ongoing-projects').should('be.visible').within(() => {
      currentProjects.forEach((project) => {
        cy.validateProjectCard(project);
      });
    });
  });

  it('should show a list of completed projects', () => {
    const completedProjects = [
      {
        dataTest: 'project-nurtured-heart-ai',
        title: 'Nurtured Heart AI',
        status: 'Completed',
        images: [
          'nha1.png',
          'nha2.png',
          'nha3.png',
        ],
        githubButton: true,
        demoButton: true,
      },
    ];

    cy.getDataTest('completed-projects').should('be.visible').within(() => {
      completedProjects.forEach((project) => {
        cy.validateProjectCard(project);
      });
    });
  });
});
