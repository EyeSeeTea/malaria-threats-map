import { themes } from "../../support/constants";

describe("Open popup in treatment failure subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(550, 360);

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
        cy.contains("Programme National de Lutte contre le Paludisme");

        //data
        cy.findByText("52");
        cy.findByText("28 days");
        cy.findByText("0.00%");
        cy.findByText("5.80%");
        cy.findByText("5.40%");
    });
});

describe("Open popup in molecular markers subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.contains("Treatment failure").click();
        cy.findByText("Molecular markers of drug resistance").click();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(550, 395);
        cy.contains("Multiple sites in Nanoro, Banfora, Niangoloko, Burkina Faso (2014-2014)");

        cy.contains("Multiple sites in Nanoro, Banfora, Niangoloko, Burkina Faso (2014-2014)");
        cy.contains("In this 2014 study, the following Pfkelch13 mutations were observed among 114 samples");
        cy.contains("Medicines for Malaria Venture, Geneva");

        cy.contains("Medicines for Malaria Venture, Geneva").should(
            "have.attr",
            "href",
            "https://www.ncbi.nlm.nih.gov/pubmed/30967148"
        );
    });
});

describe("Open popup in delayed parasite clearance subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.parasiteDrugEfficacy);
        cy.contains("Treatment failure").click();
        cy.findByText("Delayed parasite clearance").click();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(375, 380);

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
        cy.contains("31.20%");
        cy.contains("0.00%");

        cy.contains("Foundation for Scientific Research Suriname, Paramaribo");

        cy.contains("Foundation for Scientific Research Suriname, Paramaribo").should(
            "have.attr",
            "href",
            "http://www.ncbi.nlm.nih.gov/pubmed/24402149"
        );
    });
});
