import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
    });

    it("should contain insecticide resistance status subtheme by default", () => {
        cy.contains("Insecticide resistance status");
    });

    it("should contain english language by default", () => {
        cy.contains("English");
    });
});
