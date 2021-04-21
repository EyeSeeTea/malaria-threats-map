import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.invasiveVectorSpecies);
    })

    it("should open a popup to click on coordinates", () => {
        cy.resetMapZoom();
       
        cy.clickOnMap(800, 300);

        cy.findByText("An. stephensi s.l.")
    })
});
