import { themes } from "../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.loadPage();
    });

    it("should contain insecticide resistance status sub theme by default", () => {
        cy.contains("Malaria Threats Map");
    });

    it("should contain english language by default", () => {
        cy.contains("English");
    });

    it("should contain 4 theme cards", () => {
        cy.contains(themes.vectorInsecticideResistance);
        cy.contains(themes.parasiteGeneDeletions);
        cy.contains(themes.parasiteDrugEfficacy);
        cy.contains(themes.invasiveVectorSpecies);
    });
});
