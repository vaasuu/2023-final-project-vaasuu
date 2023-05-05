// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://localhost:5173/auth");
  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get('[type="submit"]').click();
  cy.url().should("include", "/listings");
});

Cypress.Commands.add("openListingsPage", () => {
  cy.login("john.smith@example.com", "john.smith");
  cy.visit("http://localhost:5173/market/listings");
  cy.contains("Listings");
  cy.url().should("include", "/listings");
});
