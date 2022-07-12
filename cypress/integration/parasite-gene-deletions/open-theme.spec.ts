import { themes } from "../../support/constants";

describe("Open theme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteGeneDeletions);
    });

    it("should contain pfhrp2/3 gene deletions subtheme by default", () => {
        cy.contains("pfhrp2/3 gene deletions");
    });

    it("should contain english language by default", () => {
        cy.contains("English");
    });
});
