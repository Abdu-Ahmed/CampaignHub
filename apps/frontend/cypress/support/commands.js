Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', '/api/graphql', {
    query: `mutation($e: String!, $p: String!){ login(email: $e,password:$p) }`,
    variables: { e: email, p: password }
  }).then(resp => {
    window.localStorage.setItem('token', resp.body.data.login);
  });
});