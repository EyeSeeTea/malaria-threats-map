import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
    })

    it("should open a popup to click on coordinates", () => {
        cy.resetMapZoom();
       
        cy.clickOnMap(550, 360);

        cy.findByText("Study year(s):")
    })
});
