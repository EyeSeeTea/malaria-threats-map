import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.loadPage(themes.invasiveVectorSpecies);
    });

    it("should contain vector occurrence subtheme by default", () => {
        cy.contains("Vector occurrence");
    });

    it("should contain english language by default", () => {
        cy.contains("English");
    });
});
