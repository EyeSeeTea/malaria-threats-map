describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
        cy.contains("PARASITE DRUG EFFICACY AND RESISTANCE").click();
    })

    it("should contains treatment failure subtheme by default", () => {
        cy.contains("Treatment failure");
    });
    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
