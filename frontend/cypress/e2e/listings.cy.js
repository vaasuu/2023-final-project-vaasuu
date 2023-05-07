describe("listings page", () => {
  it("needs auth", () => {
    cy.visit("/market/listings");
    cy.url().should("include", "/auth");
  });

  it("loads", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/listings");
    cy.contains("Listings");
    cy.url().should("include", "/listings");
    cy.get(".search-bar-input").should("be.visible");
    cy.contains("MacBook Pro").should("be.visible");
  });

  it("has clickable listing cards", () => {
    cy.openListingsPage();
    cy.get(".listing-card").first().click();
    cy.get(".listing").should("be.visible");
  });

  it("has working search", () => {
    cy.openListingsPage();
    cy.get(".search-bar-input").type("iPhone");
    cy.contains("iPhone").should("be.visible");
    cy.contains("MacBook Pro").should("not.exist");
  });

  it("has working search with no results", () => {
    cy.openListingsPage();
    cy.get(".search-bar-input").type("asdfasdfasdfasdfasdf");
    cy.contains("No listings found").should("be.visible");
  });
});
