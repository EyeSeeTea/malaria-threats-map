import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(640, 405);
        cy.findByText("Deletions confirmed (% of samples)");
    });
    
    it("should contain all the Democratic Republic of the Congo study information ", () => {
        cy.clickOnMap(640, 405);

        //headings 
        cy.findByText("Democratic Republic of the Congo");
        cy.contains("1 survey(s) hrp2 by DHS in 2013");
        cy.findByText("Deletions confirmed (% of samples)");

        //getting table column headings
        cy.contains("Deletion type");
        cy.contains("No. tested");
        cy.contains("Percentage deletion(s) in 2013");

        //getting row 1
        cy.contains("HRP2");
        cy.findByText("182");
        cy.findByText("7.1%");

        //getting row 2 
        cy.contains("HRP3");
        cy.contains("0.0%");

        //getting row 3
        cy.contains("HRP2 & 3");

        //study link
        cy.contains("Parr JB, Verity R, Doctor SM, Janko M, Carey-Ewend K, Turman BJ et al. Pfhrp2-Deleted Plasmodium falciparum Parasites in the Democratic Republic of the Congo: A National Cross-sectional Survey.");
    });

   it("should have an active link to the correct study", () => {
        cy.clickOnMap(640, 405);
        cy.contains("Parr JB, Verity R, Doctor SM, Janko M, Carey-Ewend K, Turman BJ et al. Pfhrp2-Deleted Plasmodium falciparum Parasites in the Democratic Republic of the Congo: A National Cross-sectional Survey.")
          .should("have.attr", "href", "https://www.ncbi.nlm.nih.gov/pubmed/28177502?dopt=Citation");
   });
});
