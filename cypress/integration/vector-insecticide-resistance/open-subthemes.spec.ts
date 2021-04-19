import { themes } from "../../support/constants";

describe("Open subthemes", () => {
    const defaultSubtheme = "Insecticide resistance status";

    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
    })

    it("should open Pyrethroid-PBO nets deployment subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Pyrethroid-PBO nets deployment").click();

        cy.findByLegendTitle("Compliance with WHO recommended criteria for Pyrethroid-PBO nets deployment")
    })

    it("should open Insecticide resistance intensity subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Insecticide resistance intensity").click();

        cy.findByLegendTitle("Insecticide resistance intensity")
    })

    it("should open Resistance mechanisms detection subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Resistance mechanisms detection").click();

        cy.findByLegendTitle("Resistance mechanisms detection")
    })

    it("should open Metabolic mechanisms involvement subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Metabolic mechanisms involvement").click();

        cy.findByLegendTitle("Involvement of metabolic mechanisms")
    })
});


