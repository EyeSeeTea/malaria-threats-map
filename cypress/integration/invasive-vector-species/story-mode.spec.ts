import { themes } from "../../support/constants";

describe("Story mode", () => {
    beforeEach(() => {
        cy.loadPage(themes.invasiveVectorSpecies);
        cy.openStoryMode();
    });

    it("should contains expected step 1 title in the story", () => {
        cy.contains(
            "The recent detection of An. stephensi in Sri Lanka and the horn of Africa underscores the potential for vector species to spread and establish in new geographical areas"
        );
    });

    it("should contains expected step 2 title in the story", () => {
        cy.findByText("2").click();
        cy.contains("Timely detection of invasive vector species is crucial to contain their spread");
    });

    it("should contains expected step 3 title in the story", () => {
        cy.findByText("3").click();
        cy.contains(
            "Control strategies should be informed by best practices from other countries, be adequately monitored and evaluated, and be modified where required"
        );
    });
});
