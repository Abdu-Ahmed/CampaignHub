
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8001/api/login',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json'
    },
    body: { email, password },
    failOnStatusCode: false    // so we can see the actual JSON error if it’s not 2xx
  })
  .then((res) => {
    // DEBUG: dump the entire response so you can inspect it in the Test Runner
    // You can remove the next line once you confirm the shape is correct.
    // eslint-disable-next-line no-console
    console.log('login response:', res);

    expect(res.status).to.be.oneOf([200, 201], 'login should return 200 or 201');
    expect(res.body).to.have.property('token');

    return res.body.token;
  })
  .then(token => {
    window.localStorage.setItem('token', token);
  });
});