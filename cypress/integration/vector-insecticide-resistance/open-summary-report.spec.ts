import { themes } from "../../support/constants";

describe("Open summary report", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.openSummaryReport();
    })

    it("should open summary report dialog", () => {
        cy.findByRole('heading', { name: "Overview of insecticide resistance in malaria vectors" })
    })
});
