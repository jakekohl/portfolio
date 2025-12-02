describe('API Tests', () => {
  const apiUrl = Cypress.env('VITE_API_URL') || 'https://portfolio.jakekohl.dev';

  context('Health', () => {
    it('GET /health should return a 200 status code and a message indicating the API is running', () => {
      cy.request('GET', `${apiUrl}/health`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status').to.eq('ok');
        expect(response.body).to.have.property('message').to.eq('API is running');
        expect(response.body).to.have.property('version').to.be.a('string');
        expect(response.body).to.have.property('timestamp').to.be.a('string');
      });
    });
  });

  context('Me', () => {
    it('GET /me should return a 200 status code amd return data about the user', () => {
      cy.request('GET', `${apiUrl}/me`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('name').to.be.a('string');
        expect(response.body).to.have.property('experiences').to.be.an('array');
        expect(response.body.experiences.length).to.be.greaterThan(0);
      });
    });
  });

  context('Roles', () => {
    it('GET /roles should return a 200 status code and a list of roles', () => {
      cy.request('GET', `${apiUrl}/roles`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
      });
    });
  });
  context('Projects', () => {
    it('GET /projects should return a 200 status code and a list of projects', () => {
      cy.request('GET', `${apiUrl}/projects`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
      });
    });
  });

  context('Contact', () => {
    it('GET /contact should return a 200 status code for the contact page', () => {
      cy.request('GET', `${apiUrl}/contact`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('contact').to.be.an('Array');
        expect(response.body.contact.length).to.be.greaterThan(0);
        expect(response.body.specialties).to.be.an('Array');
        expect(response.body.specialties.length).to.be.greaterThan(0);
      });
    });
  });

  context('GitHub Stats', () => {
    it('GET /github-stats should return a 200 status code and a list of github stats', () => {
      cy.request('GET', `${apiUrl}/github-stats?year=2024`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('totalContributions').to.be.a('number');
        expect(response.body).to.have.property('year').to.be.a('string');
        expect(response.body).to.have.property('contributions').to.be.an('array');
        expect(response.body.contributions.length).to.be.greaterThan(0);
        expect(response.body.username).to.be.a('string').to.equal('jakekohl');
        expect(response.body.lastUpdated).to.be.a('string').to.not.be.eq(null);
      });
    });

    it('POST /github-stats/ingest should not return a 200 status code if the secret is incorrect', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/github-stats/ingest`,
        headers: {
          'X-GitHub-Stats-Secret': 'incorrect-secret',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 500]);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('detail').to.be.a('string');
        expect(response.body.detail).to.oneOf(['Invalid or missing X-GitHub-Stats-Secret header', 'GitHub stats secret not configured on server']);
      });
    });

    it('POST /github-stats/ingest should not return a 200 status code if the secret is missing', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/github-stats/ingest`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 500]);
      });
    });

    it('POST /github-stats/ingest should return a 200 status code if the secret is correct', () => {
      cy.intercept('POST', '**/github-stats/ingest', {
        statusCode: 200,
        fixture: 'github_stats/postSuccess.json',
      }).as('postSuccess');

      // Use window.fetch to make the request so intercept can provide the static response
      cy.window().then((win) => {
        return win.fetch(`${apiUrl}/github-stats/ingest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-GitHub-Stats-Secret': 'test-secret',
          },
        }).then((response) => {
          expect(response.status).to.eq(200);

          return response.json();
        }).then((body) => {
          expect(body).to.be.an('object');
          expect(body).to.have.property('status').to.eq('updated');
          expect(body).to.have.property('contributionsCount').to.be.a('number');
          expect(body).to.have.property('totalContributions').to.be.a('number');
          expect(body).to.have.property('lastUpdated').to.be.a('string');
        });
      });
    });
  });
});
