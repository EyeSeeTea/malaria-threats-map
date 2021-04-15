import { themes } from "../../support/constants";

describe("Story mode", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.findByRole('button', { name: "Story mode" }).click();
    })
    it("should contains expected step 1 title in the story", () => {
        cy.contains("Malaria parasites repeatedly develop resistance to antimalarial treatment")
    });

    it("should contains expected step 2 title in the story", () => {
        cy.findByText("2").click();
        cy.contains("Routine monitoring of the efficacy of artemisinin-based combination therapies (ACTs) is essential to ensure that patients receive effective treatment")
    });

    it("should contains expected step 3 title in the story", () => {
        cy.findByText("3").click();
        cy.contains("Studies of molecular prevention provide essential data for detecting and tracking antimalarial drug resistance")
    });

    it("should contains expected step 4 title in the story", () => {
        cy.findByText("4").click();
        cy.contains("Drug resistance is a challenge in both P. vivax and P. falciparum, the two most common human malaria parasite species")
    });
});
