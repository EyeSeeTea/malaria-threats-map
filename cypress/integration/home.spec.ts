describe("Home page ", () => {
    beforeEach(() => {});

    it("should load", () => {
        cy.loadPage();
        cy.contains("Malaria Threats Map");
    });
});
