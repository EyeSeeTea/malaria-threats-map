import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.loadPage(themes.invasiveVectorSpecies);
    })

    it("should contains vector occurrence subtheme by default", () => {
        cy.contains("Vector occurrence");
    });

    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
