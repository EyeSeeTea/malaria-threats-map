import { themes } from "../../support/constants";

describe("Open popup in delayed parasite clearance subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.contains("Treatment failure").click();
        cy.findByText("Delayed parasite clearance").click();
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(545, 340);
        cy.contains("Mali");
        cy.contains(
            "10 therapeutic efficacy studies conducted on the efficacy of Artemether-lumefantrine against P. falciparum from 2010 to 2014"
        );
    });
});

describe("Open popup in molecular markers subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.contains("Treatment failure").click();
        cy.findByText("Molecular markers of drug resistance").click();
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(545, 340);
        cy.contains("Mali");
        cy.contains("16 molecular marker studies conducted on Pfkelch13 from 2010 to 2016");
    });
});

describe("Open popup in treatment failure subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.contains("Treatment failure").click();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(545, 340);
        cy.contains("Mali");
        cy.contains(
            "10 therapeutic efficacy studies conducted on the efficacy of Artemether-lumefantrine against P. falciparum from 2010 to 2014"
        );
    });
});
