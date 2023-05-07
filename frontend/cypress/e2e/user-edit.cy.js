describe("user edit page", () => {
  it("needs auth", () => {
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c/edit");
    cy.url().should("include", "/auth");
  });

  it("loads", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c/edit");
    cy.contains("Edit User");
  });

  it("has profile editing as owner", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c/edit");
    cy.contains("Edit User");
    cy.get("#name").should("have.value", "John Smith");
    cy.get("#email").should("have.value", "john.smith@example.com");
    cy.contains("Save").click();
    cy.url().should("match", /\/users\/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c$/);
  });

  it("has profile editing as admin", () => {
    cy.login("bob.johnson@example.com", "bob.johnson");
    cy.visit("/market/users/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c/edit");
    cy.contains("Edit User");
    cy.get("#name").should("have.value", "John Smith");
    cy.get("#email").should("have.value", "john.smith@example.com");
    cy.get('[for="isAdmin"]').should("be.visible");
    cy.get("#admin").should("be.visible"); // admin checkbox
    cy.contains("Save").click();
    cy.url().should("match", /\/users\/aaaaaaaa-0615-4d04-a795-9c5756ef5f4c$/);
  });

  it("has admin editing as admin", () => {
    cy.login("bob.johnson@example.com", "bob.johnson");
    cy.visit("/market/users/cccccccc-681d-4475-84a2-fdd1d0dcd057/edit");
    cy.contains("Edit User");
    cy.get("#name").should("have.value", "Bob Johnson");
    cy.get("#email").should("have.value", "bob.johnson@example.com");
    cy.get('[for="isAdmin"]').should("be.visible");
    cy.get("#admin").should("be.checked"); // admin checkbox
    cy.contains("Save").click();
    cy.url().should("match", /\/users\/cccccccc-681d-4475-84a2-fdd1d0dcd057$/);
  });

  it("can delete own account", () => {
    // generate random string to avoid conflicts with existing users
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    cy.register(randomString, `${randomString}@example.com`, `${randomString}`);

    cy.contains("User settings").click();
    cy.contains("Delete User").click();
    cy.url().should("include", "/auth"); // redirected to login page

    // Try to login with deleted user
    cy.get("input[name=email]").type(`${randomString}@example.com`);
    cy.get("input[name=password]").type(`${randomString}`);
    cy.get('[type="submit"]').click();

    cy.contains("Invalid credentials");
  });
});
