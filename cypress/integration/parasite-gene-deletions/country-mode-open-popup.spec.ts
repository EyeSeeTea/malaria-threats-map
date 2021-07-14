import { themes } from "../../support/constants";

describe("Open popup in synergist effect in susceptibility subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(280, 380);
        cy.contains("Colombia");
        cy.contains("survey(s) P. falciparum by Convenience survey");
    });
});
