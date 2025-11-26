describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the home page with the Top Navigation Menubar', () => {
    const brandText = 'Jake Kohl';
    const menuItems = [
      { dataTest: 'nav-home', label: 'Home' },
      { dataTest: 'nav-roles', label: 'Career' },
      { dataTest: 'nav-projects', label: 'Projects' },
      { dataTest: 'nav-contact', label: 'Contact' },
    ];
    const socialLinks = [
      { dataTest: 'social-github', link: 'https://github.com/jakekohl' },
      { dataTest: 'social-linkedin', link: 'https://linkedin.com/in/jacob-jp-kohl' },
    ];
    const sections = ['hero-section', 'stats-section'];

    cy.verifyTopNavMenubar(brandText, menuItems, socialLinks);
    sections.forEach((section) => {
      cy.verifySectionVisibility(section);
    });
  });

  it('should inform the user whose portfolio they are looking at', () => {
    cy.getDataTest('hero-section').should('be.visible').within(() => {
      cy.contains('Jake Kohl').should('be.visible');
      cy.contains('Quality Assurance Engineer').should('be.visible');
      cy.contains('Test Automation Enthusiast').should('be.visible');
      cy.getDataTest('profile-avatar').should('be.visible').children().should('have.attr', 'src').and('include', 'https://avatars.githubusercontent.com/');
    });
  });

  it('should allow user to navigate to the projects page through the hero section', () => {
    cy.getDataTest('hero-section').should('be.visible').within(() => {
      cy.clickDataTest('hero-projects-button');
    });
    cy.url().should('include', '/projects');
  });

  it('should allow a user to directly download a resume from the hero section', () => {
    cy.getDataTest('hero-section').should('be.visible').within(() => {
      cy.clickDataTest('hero-resume-button');
    });
    cy.readFile('cypress/downloads/Resume_kohlJacob.pdf').should('exist');
  });

  it('should showcase the user\'s years of experience in different domains', () => {
    const stats = [
      {
        dataTest: 'stat-quality-assurance',
        label: 'Quality Assurance',
      },
      {
        dataTest: 'stat-technical-support',
        label: 'Technical Support',
      },
      {
        dataTest: 'stat-technical-leadership',
        label: 'Technical Leadership',
      },
      {
        dataTest: 'stat-management',
        label: 'Management',
      },
      {
        dataTest: 'stat-software-development',
        label: 'Software Development',
      },
      {
        dataTest: 'stat-infrastructure',
        label: 'Infrastructure',
      },
    ];

    cy.getDataTest('stats-section').should('be.visible').within(() => {
      cy.contains('Professional Experience (Years)').should('be.visible');
      cy.verifyProfessionalStats(stats);
    });
  });

  it('should showcase the user\'s github activity', () => {
    cy.getDataTest('github-heatmap-section').should('be.visible').within(() => {
      cy.intercept('GET', '/github-stats?year=2024').as('githubStats');
      cy.contains('GitHub Activity').should('be.visible');
      cy.getDataTest('github-activity-link').should('be.visible').and('have.attr', 'href', 'https://github.com/jakekohl');
      cy.verifyGitHubHeatmap();
    });
    cy.selectGitHubYear('2024');
    cy.wait('@githubStats').then(response => {
      cy.getDataTest('github-contributions-count').should('be.visible').and('contain', response.response.body.totalContributions.toString());
      cy.getDataTest('github-selected-year').should('be.visible').and('contain', response.response.body.year.toString());
    });
  });

  it('should display the site footer', () => {
    cy.getDataTest('footer-text').should('be.visible').and('contain', 'This site is continuously being improved and updated. New features and enhancements are regularly being worked on.');
    cy.getDataTest('footer-copyright').should('be.visible').and('contain', `© ${new Date().getFullYear()} Jake Kohl. Built with Vue.js and PrimeVue.`);
  });
});
