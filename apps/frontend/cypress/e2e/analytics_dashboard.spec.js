describe('Customizable Dashboards', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/dashboards')
  })

  it('loads existing dashboards', () => {
    cy.intercept('GET', '**/api/analytics/dashboards').as('getDashboards')
    cy.wait('@getDashboards').its('response.statusCode').should('eq', 200)
    cy.get('[data-testid=dashboard-list]').should('exist')
  })

  it('creates a new dashboard', () => {
    cy.intercept('POST', '**/api/analytics/dashboards').as('createDashboard')
    cy.get('button').contains('New Dashboard').click()
    cy.get('input[name=name]').type('E2E Dash')
    // pick a widget, e.g. daily chart
    cy.get('select[name=widgetType]').select('daily-chart')
    cy.get('input[name=campaignId]').type('14')
    cy.get('button').contains('Save Dashboard').click()

    cy.wait('@createDashboard').its('response.statusCode').should('eq', 201)
    cy.contains('E2E Dash')
  })

  it('renders the grid and a chart', () => {
    cy.contains('E2E Dash').click()
    cy.get('.react-grid-layout').should('exist')
    cy.get('svg').should('have.length.greaterThan', 0)
  })
})
