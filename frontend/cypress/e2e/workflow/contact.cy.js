describe('Contact Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clickDataTest('nav-contact');
    cy.url().should('include', '/contact');
  });

  it('should display topics that I could help with', () => {
    const specialties = [
      { dataTest: 'contact-test-automation', label: 'Test Automation' },
      { dataTest: 'contact-consulting-mentoring', label: 'Consulting & Mentoring' },
      { dataTest: 'contact-development-side-projects', label: 'Development Side Projects' },
    ];

    cy.getDataTest('specialties-section').should('be.visible').within(() => {
      cy.contains('What I Can Help You With').should('be.visible');
    });
    cy.verifySpecialties(specialties);
  });

  it('should display methods for contacting me', () => {
    const contactMethods = [
      { dataTest: 'contact-email', label: 'Email', link: 'mailto:jacob.jp.kohl@gmail.com', copy: 'jacob.jp.kohl@gmail.com' },
      { dataTest: 'contact-linkedin', label: 'LinkedIn', link: 'https://linkedin.com/in/jacob-jp-kohl', copy: 'https://linkedin.com/in/jacob-jp-kohl' },
      { dataTest: 'contact-github', label: 'GitHub', link: 'https://github.com/jakekohl', copy: 'https://github.com/jakekohl' },
    ];

    cy.getDataTest('contact-methods-section').should('be.visible').within(() => {
      contactMethods.forEach((contactMethod) => {
        cy.verifyContactMethods(contactMethod);
      });
    });
  });
});
