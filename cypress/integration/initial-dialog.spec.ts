describe("Initial dialog", () => {
    it("should contains the correct title", () => {
        cy.visit("/");

        cy.contains("Malaria Threats Map");
    });
    it("should contains english language by default", () => {
        cy.visit("/");

        cy.contains("English");
    });
    it("should contains 4 theme cards", () => {
        cy.visit("/");

        cy.contains("VECTOR INSECTICIDE RESISTANCE");
        cy.contains("PARASITE pfhrp2/3 GENE DELETIONS");
        cy.contains("PARASITE DRUG EFFICACY AND RESISTANCE");
        cy.contains("INVASIVE VECTOR SPECIES");
    });
});
