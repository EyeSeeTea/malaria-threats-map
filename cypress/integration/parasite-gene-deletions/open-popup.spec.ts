import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
    })

    it("should open summary report dialog", () => {
        cy.resetMapZoom();
       
        cy.clickOnMap(640, 405);

        cy.findByText("Deletions confirmed (% of samples)")
    })
});
