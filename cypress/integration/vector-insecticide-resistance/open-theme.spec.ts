import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
    })

    it("should contains insecticide resistance status subtheme by default", () => {
        cy.contains("Insecticide resistance status");
    });

    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
