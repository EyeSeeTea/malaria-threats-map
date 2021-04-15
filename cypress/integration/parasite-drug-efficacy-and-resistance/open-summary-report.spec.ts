import { themes } from "../../support/constants";

describe("Story mode", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.findByRole('button', { name: "Summary Report" }).click();
    })

    it("should open summary report dialog", () => {
        cy.findByRole('heading', { name: "Overview of treatment failure rates among malaria infected patients (P. falciparum)" })
    })
});
