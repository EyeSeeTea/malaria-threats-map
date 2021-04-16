import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.invasiveVectorSpecies);
    })

    it("should open summary report dialog", () => {
        cy.resetMapZoom();
       
        cy.clickOnMap(800, 300);

        cy.findByText("An. stephensi s.l.")
    })
});
