import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
    });

    it("should contain treatment failure subtheme by default", () => {
        cy.contains("Treatment failure");
    });

    it("should contain english language by default", () => {
        cy.contains("English");
    });
});
