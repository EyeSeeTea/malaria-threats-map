import { themes } from "../../support/constants";

describe("Open popup in treatment failure subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Bouna");

        //headings
        cy.findByText(/bouna, zanzan, côte d'ivoire/i);
        cy.contains("P. falciparum, Artemether-lumefantrine: 1 study(s) in 2019");

        //titles
        cy.findByText("Study year(s):");
        cy.findByText("Number of patients:");
        cy.findByText("Follow-up:");
        cy.findByText("Positive after day 3:");
        cy.findByText("Patients with treatment failure, per protocol:");
        cy.findByText("Patients with treatment failure, Kaplan-Meier:");

        //data
        cy.findByText("52");
        cy.findByText("28 days");
        cy.findByText("0.0%");
        cy.findAllByText("5.8%");
        cy.findAllByText("5.4%");
    });
});

describe("Open popup in molecular markers subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.contains("Treatment failure").click();
        cy.findByText("Molecular markers of drug resistance").click();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Abidjan");
        cy.findByText(/abidjan, côte d’ivoire \(2013\-2014\)/i);
    });
});

describe("Open popup in delayed parasite clearance subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.contains("Treatment failure").click();
        cy.findByText("Delayed parasite clearance", { exact: false }).click();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Paramaribo");
        cy.contains("Paramaribo, Suriname");
        cy.contains("P. falciparum, Artemether-lumefantrine: 1 study(s) in 2011");
        cy.contains("Study year(s):");
        cy.contains("Number of patients:");
        cy.contains("Follow-up:");
        cy.contains("Positive after day 3:");
        cy.contains("Patients with treatment failure, per protocol:");
        cy.contains("Patients with treatment failure, Kaplan-Meier:");

        cy.contains("2011");
        cy.contains("28 days");
        cy.contains("31.2%");
        cy.contains("0.0%");

        cy.contains("Foundation for Scientific Research Suriname, Paramaribo");

        cy.contains("Foundation for Scientific Research Suriname, Paramaribo").should(
            "have.attr",
            "href",
            "http://www.ncbi.nlm.nih.gov/pubmed/24402149"
        );
    });
});
