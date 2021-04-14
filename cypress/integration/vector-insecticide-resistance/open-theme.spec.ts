import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
        cy.contains(themes.vectorInsecticideResistance).click();
    })

    it("should contains insecticide resistance status subtheme by default", () => {
        cy.contains("Insecticide resistance status");
    });

    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
