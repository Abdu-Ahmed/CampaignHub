describe('Campaign Details & Metrics', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/')
    cy.contains('E2E Campaign Updated').click()
    cy.url().should('match', /campaign\/\d+$/)
  })

  it('shows the campaign info', () => {
    cy.contains('E2E Campaign Updated')
    cy.contains('Status:')
  })

  it('renders the metrics chart', () => {
    cy.get('a').contains('Metrics').click()
    cy.url().should('include', '/metrics')
    cy.contains('Campaign').parent().within(() => {
      cy.get('.recharts-wrapper').should('exist')
    })
  })

  it('has a back button', () => {
    cy.get('a').contains('← Back to Home').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
