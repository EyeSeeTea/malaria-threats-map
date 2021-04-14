describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
    })

    it("should contains insecticide resistance status sub theme by default", () => {
        cy.contains("Malaria Threats Map");
    });
    it("should contains english language by default", () => {
        cy.contains("English");
    });
    it("should contains 4 theme cards", () => {
        cy.contains("VECTOR INSECTICIDE RESISTANCE");
        cy.contains("PARASITE pfhrp2/3 GENE DELETIONS");
        cy.contains("PARASITE DRUG EFFICACY AND RESISTANCE");
        cy.contains("INVASIVE VECTOR SPECIES");
    });
});
