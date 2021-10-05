import { themes } from "../../support/constants";

describe("Open popup in insecticide resistance intensity subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Insecticide resistance intensity").click();
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openCountryPopup("Senegal");
        cy.wait(1000);
        cy.clickOnMap(310, 295);
        cy.contains("Senegal");
        cy.contains(
            "178 test(s) on Anopheles malaria vectors via intensity concentration bioassay(s) with selected Pyrethroids from 2018 to 2019"
        );
    });
});

describe("Open popup in resistance mechanisms detection subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Resistance mechanisms detection").click();
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openCountryPopup("Senegal");
        cy.wait(1000);
        cy.clickOnMap(310, 295);
        cy.contains("Senegal");
        cy.contains(
            "35 test(s) on Anopheles malaria vectors via Molecular assays, Biochemical assays, Synergist-insecticide bioassays with selected Pyrethroids from 2015 to 2019"
        );
    });
});

describe("Open popup in insecticide resistance status subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openCountryPopup("Senegal");
        cy.wait(1000);
        cy.clickOnMap(310, 295);
        cy.contains("Senegal");
        cy.contains(
            "578 test(s) on Anopheles malaria vectors via discriminating concentration bioassay(s) with selected Pyrethroids from 2010 to 2019"
        );
    });
});

describe("Open popup in synergist effect in susceptibility subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Synergist effect in susceptibility").click();
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openCountryPopup("Senegal");
        cy.wait(1000);
        cy.clickOnMap(310, 295);
        cy.contains("Senegal");
        cy.contains(
            "35 test(s) on Anopheles malaria vectors via Molecular assays, Biochemical assays, Synergist-insecticide bioassays with selected Pyrethroids from 2015 to 2019"
        );
    });
});
