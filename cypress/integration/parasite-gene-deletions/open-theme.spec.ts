describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
        cy.contains("PARASITE pfhrp2/3 GENE DELETIONS").click();
    })

    it("should contains pfhrp2/3 gene deletions subtheme by default", () => {
        cy.contains("pfhrp2/3 gene deletions");
    });

    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
