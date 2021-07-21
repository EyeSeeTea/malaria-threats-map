import { themes } from "../../support/constants";

describe("Open popup in synergist effect in susceptibility subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openCountryPopup("Colombia");
        cy.wait(2000);
        cy.clickOnMap(320, 295);
        cy.contains("Colombia");
        cy.contains("survey(s) P. falciparum by Convenience survey");
    });
});
