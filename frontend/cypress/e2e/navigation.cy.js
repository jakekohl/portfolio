describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('Top Navigation Menubar', () => {
    const menuItems = [
      { dataTest: 'nav-home', label: 'Home', link: '/' },
      { dataTest: 'nav-roles', label: 'Career', link: '/roles' },
      { dataTest: 'nav-projects', label: 'Projects', link: '/projects' },
      { dataTest: 'nav-contact', label: 'Contact', link: '/contact' },
    ];

    it('should display the home page with the Top Navigation Menubar', () => {
      const brandText = 'Jake Kohl';

      const socialLinks = [
        { dataTest: 'social-github', link: 'https://github.com/jakekohl' },
        { dataTest: 'social-linkedin', link: 'https://linkedin.com/in/jacob-jp-kohl' },
      ];

      cy.verifyTopNavMenubar(brandText, menuItems, socialLinks);
    });
    menuItems.forEach((item) => {
      it(`should navigate to the ${item.label} page`, () => {
        cy.clickDataTest(item.dataTest);
        cy.url().should('include', item.link);
      });
    });
  });

  context('Sidebar Navigation Menu (Mobile)', () => {
    const mobileMenuItems = [
      { dataTest: 'mobile-nav-home', label: 'Home', link: '/' },
      { dataTest: 'mobile-nav-roles', label: 'Career', link: '/roles' },
      { dataTest: 'mobile-nav-projects', label: 'Projects', link: '/projects' },
      { dataTest: 'mobile-nav-contact', label: 'Contact', link: '/contact' },
    ];

    const mobileSocialLinks = [
      { dataTest: 'mobile-social-github', label: 'GitHub', link: 'https://github.com/jakekohl' },
      { dataTest: 'mobile-social-linkedin', label: 'LinkedIn', link: 'https://linkedin.com/in/jacob-jp-kohl' },
    ];

    it('should show sidebar navigation menu when the viewport is below 768px', () => {
      cy.viewport(767, 1080);
      cy.clickDataTest('mobile-menu-button');
      mobileMenuItems.forEach((item) => {
        cy.getDataTest(item.dataTest).should('be.visible');
      });
      mobileSocialLinks.forEach((link) => {
        cy.getDataTest(link.dataTest).should('be.visible').should('have.text', link.label);
        cy.getDataTest(link.dataTest).should('have.attr', 'href', link.link);
      });
    });

    mobileMenuItems.forEach((item) => {
      it(`should navigate to the ${item.label} page`, () => {
        cy.viewport(767, 1080);
        cy.clickDataTest('mobile-menu-button');
        cy.clickDataTest(item.dataTest);
        cy.url().should('include', item.link);
      });
    });
  });
});
