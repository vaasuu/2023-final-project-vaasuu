describe("auth page", () => {
  it("loads", () => {
    cy.visit("/auth");
    cy.contains("Log in");
  });

  it("has button to switch to signup mode", () => {
    cy.visit("/auth");
    cy.contains("Register instead?").click();
    cy.contains("Register an account");
  });

  it("has button to switch to login mode", () => {
    cy.visit("/auth");
    cy.contains("Register instead?").click();
    cy.contains("Register an account");
    cy.contains("Login instead?").click();
    cy.contains("Log in");
  });

  it("has link to reset password page", () => {
    cy.visit("/auth");
    cy.contains("Forgot your password?").click();
    cy.contains("password reset email");
  });

  it("fails to login with wrong credentials", () => {
    cy.visit("/auth");
    cy.get("input[name=email]").type("does.not.exist@example.com");
    cy.get("input[name=password]").type("wrongpassword");
    cy.get('[type="submit"]').click();
    cy.contains("Invalid credentials");
  });

  it("fails to register with invalid email", () => {
    cy.visit("/auth");
    cy.contains("Register instead?").click();
    cy.get("#name").type("Test User");
    cy.get("input[name=email]").type("invalidemail@a");
    cy.get("input[name=password]").type("password");
    cy.get("#confirmPassword").type("password");
    cy.get('[type="submit"]').click();
    cy.contains('"email" must be a valid email');
  });

  it("can login with valid credentials", () => {
    cy.visit("/auth");
    cy.get("input[name=email]").type("john.smith@example.com");
    cy.get("input[name=password]").type("john.smith");
    cy.get('[type="submit"]').click();
    cy.url().should("include", "/listings");

    cy.visit("/market/listings");
    cy.contains("Listings");
    cy.url().should("include", "/listings");
    cy.should("not.contain", "Log in");
  });

  it("should be redirected to login page from listings page when without auth", () => {
    cy.visit("/market/listings");
    cy.contains("Listings");
    cy.url().should("include", "/listings");
    cy.url().should("include", "/auth");
    cy.get("h1").contains("Log in");
  });

  it("can register with valid credentials", () => {
    // generate random string to avoid conflicts with existing users
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    cy.visit("/auth");
    cy.contains("Register instead?").click();
    cy.get("#name").type("Test User");
    cy.get("input[name=email]").type(`test.user.${randomString}@example.com`);
    cy.get("input[name=password]").type("test.user");
    cy.get("#confirmPassword").type("test.user");
    cy.get('[type="submit"]').click();
    cy.url().should("include", "/listings");
  });

  it("can't register with already registered email", () => {
    cy.register("John Smith II", "john.smith@example.com", "john.smith");
    cy.contains("User with that email already exists");
  });
});
