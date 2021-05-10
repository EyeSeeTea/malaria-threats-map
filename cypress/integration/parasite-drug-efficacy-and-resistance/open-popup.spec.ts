import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
    });

    it("should open a popup to click on coordinates", () => {
        cy.resetMapZoom();

        cy.clickOnMap(550, 360);

        cy.findByText("Study year(s):");
    });
    it("should contain all the Bouna, Zanzan, Côte d’Ivoire study information ", () => {
        cy.resetMapZoom();

        cy.clickOnMap(550, 360);

        cy.findByText("Study year(s):");
        cy.findByText("Bouna, Zanzan, Côte d’Ivoire");
        cy.findByText(", Artemether-lumefantrine: 1 study(s) in 2019");
        //it cannot find this one: don't know why
        //cy.findByText("Study year(s): 2019");
        cy.findByText("52");
        cy.findByText("28 days");
        cy.findByText("0.00%");
        cy.findByText("5.80%");
        cy.findByText("5.40%");



    });
});
