import { themes } from "../../support/constants";

describe("Story mode", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.openStoryMode();
    });

    it("should contain expected step 1 title in the story", () => {
        cy.contains("Monitoring insecticide resistance in malaria vectors is essential");
    });

    it("should contain expected step 2 title in the story", () => {
        cy.findByText("2").click();
        cy.contains("Monitoring has found that insecticide resistance is widespread in malaria vectors");
    });

    it("should contain expected step 3 title in the story", () => {
        cy.findByText("3").click();
        cy.contains("Recent and complete data on insecticide resistance are lacking for many countries");
    });

    it("should contain expected step 4 title in the story", () => {
        cy.findByText("4").click();
        cy.contains("Increasing resistance underscores the urgent need for enhanced monitoring");
    });
});
