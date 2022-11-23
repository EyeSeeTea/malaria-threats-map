import { themes } from "../../support/constants";

describe("Story mode", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
        cy.openStoryMode();
    });
    it("should contain expected step 1 title in the story", () => {
        cy.contains("Gene deletions among malaria parasites causes false-negative diagnostic test results");
    });

    it("should contain expected step 2 title in the story", () => {
        cy.findByText("2").click();
        cy.contains("pfhrp2/3 gene deletions may have significant implications for public health");
    });

    it("should contain expected step 3 title in the story", () => {
        cy.findByText("3").click();
        cy.contains("Increased monitoring of P. falciparum populations for pfhrp2/3 gene deletions is essential");
    });
});
