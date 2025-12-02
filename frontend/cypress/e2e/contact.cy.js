describe('Contact Page', () => {
  const specialties = [];
  const contactMethods = [];

  beforeEach(() => {
    cy.intercept('GET', '**/contact').as('getContact');

    cy.visit('/');
    cy.clickDataTest('nav-contact');
    cy.url().should('include', '/contact');
    cy.wait('@getContact').then((getContactResponse) => {
      specialties.push(...getContactResponse.response.body.specialties);
      contactMethods.push(...getContactResponse.response.body.contact);
    });
  });

  it('should display topics that I could help with', () => {
    cy.getDataTest('specialties-section').should('be.visible').within(() => {
      cy.contains('What I Can Help You With').should('be.visible');
    });
    cy.verifySpecialties(specialties);
  });

  it('should display methods for contacting me', () => {
    cy.getDataTest('contact-methods-section').should('be.visible').within(() => {
      contactMethods.forEach((contactMethod) => {
        cy.verifyContactMethods(contactMethod);
      });
    });
  });
});
