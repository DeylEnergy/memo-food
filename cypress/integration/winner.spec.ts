describe("Player can recall all cards", () => {
  it("wins the game", () => {
    cy.visit("/");

    cy.findByRole("textbox").clear().type("Joe");

    cy.findByText(/start game/i).click();

    cy.findByRole("button").click();

    cy.findAllByTestId("hidden-card").each((el) => el.trigger("click"));

    cy.findByText(/you won/i).should("exist");
  });

  it("exists in Stats", () => {
    cy.findByText(/stats/i).click();

    cy.findByText(/Joe/i).should("exist");

    cy.findAllByTestId("player-points").should("have.text", "18");

    cy.get("body").click();
  });

  it("returns to profile", () => {
    cy.findByTestId("new-game").click();

    cy.findByText(/player profile/i).should("exist");
  });
});
