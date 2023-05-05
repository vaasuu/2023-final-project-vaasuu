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
  cy.visit("/auth");
  cy.get("input[name=email]").type(email);
  cy.get("input[name=password]").type(password);
  cy.get('[type="submit"]').click();
  cy.url().should("include", "/listings");
});

Cypress.Commands.add("openListingsPage", () => {
  cy.login("john.smith@example.com", "john.smith");
  cy.visit("/market/listings");
  cy.contains("Listings");
  cy.url().should("include", "/listings");
});

Cypress.Commands.add("createListing", (title, description) => {
  cy.login("john.smith@example.com", "john.smith");
  cy.visit("/market/listings/new");
  cy.get("#title").type(title || "test title");
  cy.get("#description").type(description || "test description");
  cy.get("#category").select("electronics");
  cy.get("#price").type("1000.00");
  cy.get("#currency").select("USD");
  cy.get("#location").type("test location");
  cy.get("#image_urls").type("https://placekitten.com/200/300");

  cy.contains("Image URLs").click(); // click out of image url input so onBlur event is triggered

  cy.get(".listing-form__image-urls-list > li > a").should(
    "have.attr",
    "href",
    "https://placekitten.com/200/300"
  ); // check that image was actually added

  cy.get('[type="submit"]').click();
  cy.url().should("match", /\/listings\/\d+$/);
  cy.contains("test title");
  cy.contains("test description");
  cy.contains("1000.00");
  cy.contains("test location");
});
