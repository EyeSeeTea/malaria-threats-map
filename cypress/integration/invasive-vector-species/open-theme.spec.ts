import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
        cy.contains(themes.invasiveVectorSpecies).click();
    })

    it("should contains vector occurrence subtheme by default", () => {
        cy.contains("Vector occurrence");
    });

    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
