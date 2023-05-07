describe("users page", () => {
  it("needs auth", () => {
    cy.visit("/market/users");
    cy.url().should("include", "/auth");
  });

  it("loads", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users");
    cy.contains("Users");
    cy.url().should("include", "/users");
    cy.get(".search-bar-input").should("be.visible");
    cy.contains("John Smith").should("be.visible");
  });

  it("has clickable user cards", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users");
    cy.contains("John Smith").click();
    cy.get(".user-profile-details").should("be.visible");
  });

  it("has working search", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users");
    cy.get(".search-bar-input").type("John Smith");
    cy.contains("John Smith").should("be.visible");
    cy.contains("Jane Doe").should("not.exist");
  });

  it("has working search with no results", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users");
    cy.get(".search-bar-input").type("asdfasdfasdfasdfasdf");
    cy.contains("No users found").should("be.visible");
  });
});
