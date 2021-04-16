import { themes } from "../../support/constants";

describe("Open summary report", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.findByRole('button', { name: "Summary Report" }).click();
    })

    it("should open summary report dialog", () => {
        cy.findByRole('heading', { name: "Overview of insecticide resistance in malaria vectors" })
    })
});
