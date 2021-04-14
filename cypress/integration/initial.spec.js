describe("Initial page", () => {
    it("title", () => {
        cy.visit("/");

        cy.contains("Malaria Threats Map");
    });
});
