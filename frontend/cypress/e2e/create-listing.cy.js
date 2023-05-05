describe("create listing page", () => {
  it("loads", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/listings/new");
    cy.contains("Create Listing");
  });

  it("listing can be created", () => {
    cy.login("john.smith@example.com", "john.smith");
    cy.visit("/market/listings/new");
    cy.get("#title").type("test title");
    cy.get("#description").type("test description");
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
});
