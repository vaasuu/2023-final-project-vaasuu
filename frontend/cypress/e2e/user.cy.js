describe("user page", () => {
  it("needs auth", () => {
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    cy.url().should("include", "/auth");
  });

  it("loads", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    cy.contains("John Smith");
    cy.url().should("include", "/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    cy.get(".user-profile-details").should("be.visible");
  });

  it("shows users listings", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    cy.contains("MacBook Pro").should("be.visible");
  });

  it("has settings button visible to owner", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    cy.get("#editProfileLink").should("be.visible");
  });

  it("has settings button visible to admin", () => {
    cy.login("bob.johnson@example.com", "bob.johnson");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    cy.get("#editProfileLink").should("be.visible");
  });

  it("has no settings button visible to normal user that is non-owner", () => {
    cy.login("jane.doe@example.com", "jane.doe");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c");
    cy.contains("#editProfileLink").should("not.exist");
  });
});
