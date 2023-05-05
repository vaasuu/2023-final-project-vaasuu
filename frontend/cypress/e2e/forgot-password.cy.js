describe("forgot password page", () => {
  it("loads", () => {
    cy.visit("/reset-password");
    cy.contains("Request password reset email");
  });

  it("should not send email with not registered email", () => {
    cy.visit("/reset-password");
    cy.get("input[name=email]").type("not.registered@example.com");
    cy.get('[type="submit"]').click();
    cy.contains("User with that email does not exist");
  });

  it("should not send email with empty email", () => {
    cy.visit("/reset-password");
    cy.get('[type="submit"]').click();
    cy.should("not.contain", "Password reset email sent");
  });

  it("should not send email with invalid email", () => {
    cy.visit("/reset-password");
    cy.get("input[name=email]").type("invalid.email");
    cy.get('[type="submit"]').click();
    cy.should("not.contain", "Password reset email sent");
  });

  it("should send email with registered email", () => {
    cy.visit("/reset-password");
    cy.get("input[name=email]").type("john.smith@example.com");
    cy.get('[type="submit"]').click();
    cy.contains("Password reset email sent");
  });

  let resetLink = "";
  it("should recieve email with reset link", () => {
    cy.request("http://127.0.0.1:1080/email").as("emails");

    cy.get("@emails")
      .its("body")
      .then((emails) => {
        const lastEmail = emails[emails.length - 1];
        resetLink = lastEmail.text.match(
          /http:\/\/localhost:5173\/reset-password#ey[a-zA-Z0-9._-]+/
        )[0];
        expect(resetLink).to.not.be.empty;
      });
  });

  it("should not reset password with invalid token", () => {
    cy.visit("/reset-password#invalid.token");
    cy.get("input[name=password]").type("new.password");
    cy.get('[type="submit"]').click();
    cy.contains("Unauthorized");
  });

  it("should not reset password with short password", () => {
    cy.visit(resetLink);
    cy.get("input[name=password]").type("123");
    cy.get('[type="submit"]').click();
    cy.contains('"password" length must be at least 8 characters long');
  });

  it("should reset password with valid token and password", () => {
    cy.visit(resetLink);
    cy.get("input[name=password]").type("john.smith");
    cy.get('[type="submit"]').click();
    cy.url().should("include", "/auth");
    cy.contains("Log in");
  });
});
