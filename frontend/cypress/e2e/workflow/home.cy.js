describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the home page with the Top Navigation Menubar', () => {
    const brandText = 'Jake Kohl';
    const menuItems = [
      { dataTest: 'nav-home', label: 'Home' },
      { dataTest: 'nav-projects', label: 'Projects' },
      { dataTest: 'nav-contact', label: 'Contact' },
    ];
    const socialLinks = [
      { dataTest: 'social-github', link: 'https://github.com/jakekohl' },
      { dataTest: 'social-linkedin', link: 'https://linkedin.com/in/jacob-jp-kohl' },
    ];
    const sections = ['hero-section', 'stats-section', 'skills-section', 'cta-section'];

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

  it.skip('should allow a user to directly download a resume from the hero section', () => {
    cy.getDataTest('hero-section').should('be.visible').within(() => {
      cy.clickDataTest('hero-resume-button');
    });
  });

  it('should showcase the user\'s years of experience in different domains', () => {
    const stats = [
      {
        dataTest: 'quality-assurance',
        value: 5,
        label: 'Quality Assurance',
      },
      {
        dataTest: 'technical-support',
        value: 8,
        label: 'Technical Support',
      },
      {
        dataTest: 'technical-leadership',
        value: 4,
        label: 'Technical Leadership',
      },
      {
        dataTest: 'management',
        value: 1,
        label: 'Management',
      },
      {
        dataTest: 'software-development',
        value: 3,
        label: 'Software Development',
      },
      {
        dataTest: 'infrastructure',
        value: 6,
        label: 'Infrastructure',
      },
    ];

    cy.getDataTest('stats-section').should('be.visible').within(() => {
      cy.contains('Professional Experience (Years)').should('be.visible');
      cy.verifyProfessionalStats(stats);
    });
  });

  it('should showcase the user\'s technical skills in high level categories', () => {
    const categories = ['development', 'testing', 'infrastructure', 'support', 'soft-skills'];

    categories.forEach((category) => {
      cy.getDataTest(`skill-domain-${category}`).should('be.visible');
    });
  });

  it('should show a call-to-action featuring a button link for connecting with the user', () => {
    cy.getDataTest('cta-section').should('be.visible').within(() => {
      cy.clickDataTest('contact-cta-button');
      cy.url().should('include', '/contact');
    });
  });
});
