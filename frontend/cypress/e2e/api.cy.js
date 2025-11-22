describe('API Tests', () => {

  it('GET /health should return a 200 status code and a message indicating the API is running', () => {
    cy.request('GET', 'http://localhost:8000/health').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('status').to.eq('ok')
      expect(response.body).to.have.property('message').to.eq('API is running')
      expect(response.body).to.have.property('version').to.be.a('string')
      expect(response.body).to.have.property('timestamp').to.be.a('string')
    })
  })

  it('GET /me should return a 200 status code and a message indicating the API is running', () => {
    cy.request('GET', 'http://localhost:8000/me').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('name').to.be.a('string')
      expect(response.body).to.have.property('experiences').to.be.an('array')
      expect(response.body.experiences.length).to.be.greaterThan(0)
    })
  })

  it('GET /projects should return a 200 status code and a list of projects', () => {
    cy.request('GET', 'http://localhost:8000/projects').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.be.greaterThan(0)
    })
  })

  it('GET /contact should return a 200 status code for the contact page', () => {
    cy.request('GET', 'http://localhost:8000/contact').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('contact').to.be.an('Array')
      expect(response.body.contact.length).to.be.greaterThan(0)
      expect(response.body.specialties).to.be.an('Array')
      expect(response.body.specialties.length).to.be.greaterThan(0)
    })
  })
})