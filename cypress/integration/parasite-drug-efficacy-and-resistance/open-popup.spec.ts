import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
    })

    it("should open summary report dialog", () => {
        cy.resetMapZoom();
       
        cy.clickOnMap(550, 360);

        cy.findByText("Study year(s):")
    })
});
