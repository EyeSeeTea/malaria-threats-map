import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
        cy.contains(themes.parasiteDrugEfficacy).click();
    })

    it("should contains treatment failure subtheme by default", () => {
        cy.contains("Treatment failure");
    });

    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
