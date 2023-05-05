describe("landing page", () => {
  it("loads", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Welcome to our Marketplace");
  });

  it("has links to tos, privacy policy, and acknowledgements pages", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Terms of Service").click();
    cy.url().should("include", "/tos");
    cy.contains("Terms of Service");

    cy.visit("http://localhost:5173");
    cy.contains("Privacy Policy").click();
    cy.url().should("include", "/privacy");
    cy.contains("Privacy Policy");

    cy.visit("http://localhost:5173");
    cy.contains("Acknowledgements").click();
    cy.url().should("include", "/acknowledgements");
    cy.contains("Acknowledgements");
  });

  it("has a link to the auth page", () => {
    cy.visit("http://localhost:5173");
    cy.contains("Authenticate").click();
    cy.url().should("include", "/auth");
  });

  it('opens auth page when clicking on "Explore Listings now" link without auth', () => {
    cy.visit("http://localhost:5173");
    cy.contains("Explore listings now").click();
    cy.url().should("include", "/auth");
  });
});
