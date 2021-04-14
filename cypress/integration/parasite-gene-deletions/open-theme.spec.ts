import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.contains("Close").click();
        cy.contains(themes.parasiteGeneDeletions).click();
    })

    it("should contains pfhrp2/3 gene deletions subtheme by default", () => {
        cy.contains("pfhrp2/3 gene deletions");
    });

    it("should contains english language by default", () => {
        cy.contains("English");
    });
});
