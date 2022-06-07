import { themes } from "../../support/constants";

describe("Open subthemes", () => {
    const defaultSubtheme = "Treatment failure";

    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
    });

    it("should open Molecular markers of drug resistance subtheme", () => {
        cy.contains(defaultSubtheme).click();

        cy.findByText("Molecular markers of drug resistance").click();

        cy.findByLegendTitle("Molecular markers of drug resistance");
    });

    it("should open Delayed parasite clearance subtheme", () => {
        cy.contains(defaultSubtheme).click();

        cy.findByText("Delayed parasite clearance", { exact: false }).click();

        cy.findByLegendTitle("Delayed parasite clearance");
    });
});
