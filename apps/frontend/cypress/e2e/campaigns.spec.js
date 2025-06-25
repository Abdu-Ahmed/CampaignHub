describe('Campaign CRUD', () => {
  beforeEach(() => {
    // ensure logged in
    cy.login() // implement a custom command that sets localStorage token
    cy.intercept('query GetCampaigns').as('getCampaigns')
    cy.visit('/')
    cy.wait('@getCampaigns')
  })

  it('creates a new campaign', () => {
    cy.get('button').contains('+ New Campaign').click()
    cy.get('input[name=title]').type('E2E Campaign')
    cy.get('input[name=start_date]').type('2025-12-01')
    cy.get('button').contains('Create').click()

    // form submission triggers GraphQL CREATE_CAMPAIGN
    cy.wait('@getCampaigns')
    cy.contains('E2E Campaign')
  })

  it('edits an existing campaign', () => {
    cy.contains('E2E Campaign').parent().within(() => {
      cy.contains('Edit').click()
    })
    cy.get('input[name=title]').clear().type('E2E Campaign Updated')
    cy.get('button').contains('Save').click()

    cy.wait('@getCampaigns')
    cy.contains('E2E Campaign Updated')
  })

  it('duplicates a campaign', () => {
    cy.contains('E2E Campaign Updated').parent().within(() => {
      cy.contains('Duplicate').click()
    })
    cy.on('window:confirm', () => true)
    cy.wait('@getCampaigns')
    cy.contains(/Copy of E2E Campaign Updated/i)
  })

  it('deletes a campaign', () => {
    cy.contains(/Copy of E2E Campaign Updated/).parent().within(() => {
      cy.contains('Delete').click()
    })
    cy.on('window:confirm', () => true)
    cy.wait('@getCampaigns')
    cy.contains(/Copy of E2E Campaign Updated/).should('not.exist')
  })
})
