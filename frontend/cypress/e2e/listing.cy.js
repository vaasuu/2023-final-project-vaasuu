describe("listing", () => {
  it("loads", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/listings/1");
  });
  it("can be edited by owner", () => {
    cy.createListing(); // create a listing to edit
    cy.contains("Edit").click();
    cy.url().should("include", "/edit");
    cy.contains("Edit Listing");
    cy.get("#title").should("have.value", "test title");
    cy.get("#category").should("have.value", "electronics");
    cy.get("#price").should("have.value", "1000.00");

    // Edit listing details
    cy.get("#price").clear().type("2000.00");
    cy.get('[type="submit"]').click();
    cy.contains("test title");
    cy.contains("2000.00");
  });

  it("can be deleted by owner", () => {
    cy.createListing("test title deletion"); // create a listing to delete
    cy.contains("Edit").click();
    cy.url().should("include", "/edit");
    cy.contains("Edit Listing");
    cy.contains("Delete Listing").click();
    cy.url().should("match", /\/listings$/);
    cy.contains("No listings found").should("not.exist");
    cy.contains("test title deletion").should("not.exist");
  });
});
