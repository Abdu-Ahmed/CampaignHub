describe('Login Flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/login').as('login')
  })

  it('allows an existing user to log in', () => {
    cy.visit('/login')

    cy.get('input[name=email]').type('e2e@example.com')
    cy.get('input[name=password]').type('Secret1234!')
    cy.get('button[type=submit]').click()

    cy.wait('@login').its('response.statusCode').should('be.oneOf', [200, 201])
    cy.location('pathname').should('eq', '/')
  })
})
