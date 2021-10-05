import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Bekaria");

        //headings
        cy.findByText("India");
        cy.contains("survey(s) hrp2 by cross-sectional prospective survey");
        cy.findByText("Deletions confirmed (% of samples)");

        //getting table column headings
        cy.contains("Deletion type");
        cy.contains("No. tested");
        cy.contains("Percentage deletion(s)");

        //getting row 1
        cy.contains("HRP2");
    });
});
