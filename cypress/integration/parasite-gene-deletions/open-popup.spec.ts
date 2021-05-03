import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
    });

    it("should open a popup to click on coordinates", () => {
        cy.resetMapZoom();

        cy.clickOnMap(640, 405);

        cy.findByText("Deletions confirmed (% of samples)");
    });
});
