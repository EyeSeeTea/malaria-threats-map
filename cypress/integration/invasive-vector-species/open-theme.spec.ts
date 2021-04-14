describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
        cy.contains("INVASIVE VECTOR SPECIES").click();
    })

    it("should contains vector occurrence subtheme by default", () => {
        cy.contains("Vector occurrence");
    });
    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
