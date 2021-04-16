import { themes } from "../../support/constants";

describe("Open subthemes", () => {
    const defaultSubtheme = "Insecticide resistance status";

    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
    })

    it("should open Pyrethroid-PBO nets deployment subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Pyrethroid-PBO nets deployment").click();

        cy.findByRole("group",{name:"Legend"}).findByText("Compliance with WHO recommended criteria for Pyrethroid-PBO nets deployment")
    })

    it("should open Insecticide resistance intensity subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Insecticide resistance intensity").click();

        cy.findByRole("group",{name:"Legend"}).findByText("Insecticide resistance intensity")
    })

    it("should open Resistance mechanisms detection subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Resistance mechanisms detection").click();

        cy.findByRole("group",{name:"Legend"}).findByText("Resistance mechanisms detection")
    })

    it("should open Metabolic mechanisms involvement subtheme", () => {
        cy.contains(defaultSubtheme).click()

        cy.findByText("Metabolic mechanisms involvement").click();

        cy.findByRole("group",{name:"Legend"}).findByText("Involvement of metabolic mechanisms")
    })
});


