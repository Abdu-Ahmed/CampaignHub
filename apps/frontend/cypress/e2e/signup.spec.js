describe('Signup Flow', () => {
  beforeEach(() => {
    // alias the real endpoint
    cy.intercept('POST', '**/api/register').as('register')
    
    // Clear any existing auth state
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  it('signs up and lands on home', () => {
    // Use a unique email each time to avoid conflicts
    const timestamp = Date.now()
    const testEmail = `e2e-${timestamp}@example.com`
    
    cy.visit('/signup')
    cy.get('input[name=name]').type('E2E Test User')
    cy.get('input[name=email]').type(testEmail)
    cy.get('input[name=password]').type('Secret12234!')
    // Updated to use the correct field name
    cy.get('input[name=password_confirmation]').type('Secret12234!')
    cy.get('button[type=submit]').click()

    // wait for the POST /api/register
    cy.wait('@register').then(({ response }) => {
      // DEBUG: Log the response to see what's failing
      cy.log('Response status:', response.statusCode)
      cy.log('Response body:', JSON.stringify(response.body))
      
       expect(response.statusCode).to.be.oneOf([200, 201])
    })

    // finally, assert you've been redirected
    cy.location('pathname').should('eq', '/')
  })
})