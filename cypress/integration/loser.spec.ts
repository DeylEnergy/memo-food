describe("Player can lose", () => {
  it("loses the game by wrong pick", () => {
    cy.visit("/");

    cy.findByText(/start game/i).click();

    cy.findByRole("button").click();

    cy.findAllByTestId("hidden-card").first().click();

    cy.findAllByTestId("hidden-card").last().click();

    cy.findByText(/you lost/i).should("exist");
  });

  it("exists in Stats", () => {
    cy.findByText(/stats/i).click();

    cy.findByText(/Default/i).should("exist");

    cy.findAllByTestId(/player-points/i).should("have.text", "0");

    cy.get("body").click();
  });

  it("returns to profile", () => {
    cy.findByTestId("new-game").click();

    cy.findByText(/player profile/i).should("exist");
  });

  it("loses the game when time is over", () => {
    cy.findByText(/start game/i).click();

    cy.findByRole("button").click();

    cy.findAllByTestId("hidden-card").first().click();

    cy.wait(5000);

    cy.findByText(/you lost/i).should("exist");
  });
});
