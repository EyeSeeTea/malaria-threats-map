import { themes } from "../../support/constants";

describe("Open popup in pyrethroid-PBO nets deployment subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Pyrethroid-PBO nets deployment").click();
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(540, 340);
        cy.clickOnMap(545, 330);
        cy.contains("Compliance with WHO recommended criteria for Pyrethroid-PBO nets deployment");
    });

    it("should contain all the Tombouctou study information", () => {
        cy.clickOnMap(540, 340);
        cy.clickOnMap(545, 330);
        cy.contains("Tombouctou");
        cy.contains("Compliance with WHO recommended criteria for Pyrethroid-PBO nets deployment");
        cy.contains("Number of sites that meet criteria:");
        cy.contains("Vector species that meet criteria:");
        cy.contains("Most recent pyrethroid susceptibility test results:");
        cy.contains("2010");
        cy.contains("Most recent mono-oxygenase involvement results:");
    });
});

describe("Open popup in insecticide resistance intensity subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Insecticide resistance intensity").click();
        cy.openCountryMode();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(515, 350);
        cy.contains("Senegal");
        cy.contains(
            "173 test(s) on Anopheles malaria vectors via intensity concentration bioassay(s) with selected Pyrethroids from 2018 to 2019"
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
        cy.clickOnMap(515, 350);
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
        cy.clickOnMap(515, 350);
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
        cy.clickOnMap(515, 350);
        cy.contains("Senegal");
        cy.contains(
            "35 test(s) on Anopheles malaria vectors via Molecular assays, Biochemical assays, Synergist-insecticide bioassays with selected Pyrethroids from 2015 to 2019"
        );
    });
});
