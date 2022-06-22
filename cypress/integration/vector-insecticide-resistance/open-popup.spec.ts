import { themes } from "../../support/constants";

describe("Open popup in insecticide resistance intensity subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Insecticide resistance intensity").click();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Tesseney");
        cy.findByText("Intensity concentration bioassay, WHO test kit bioassay");

        cy.findByText("Tesseney, Eritrea");
        cy.contains("Acknowledgement for data curation");
        cy.contains("World Health Organization");
    });
});

describe("Open popup in resistance mechanisms detection subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Resistance mechanisms detection").click();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Kitwe");
        cy.findByText("Biochemical assays", { exact: false });

        cy.findByText("Kitwe, Zambia");
        cy.contains(
            "Thomsen et al. (2014) Underpinning Sustainable Vector Control through Informed Insecticide Resistance Management.. PLoS One. 2014 Jun 16,9(6):e99822"
        );
        cy.contains("Acknowledgement for data curation");
        cy.contains("World Health Organization");

        cy.contains(
            "Thomsen et al. (2014) Underpinning Sustainable Vector Control through Informed Insecticide Resistance Management.. PLoS One. 2014 Jun 16,9(6):e99822"
        ).should("have.attr", "href", "https://www.ncbi.nlm.nih.gov/pubmed/24932861");
    });
});

describe("Open popup in insecticide resistance status subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Kampti");
        cy.findByText("Discriminating concentration bioassays", { exact: false });

        cy.findByText("Kampti, Burkina Faso");
        cy.findByText("Acknowledgement for data curation");
    });
});

describe("Open popup in synergist effect in susceptibility subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Synergist effect in susceptibility").click();
    });

    it("should open a popup to click on coordinates", () => {
        cy.openSitePopup("Mamfene");
        cy.findByText("Synergist-insecticide bioassays", { exact: false });

        cy.findByText("Mamfene, South Africa");
        cy.contains(
            "Brooke et al. (2015) Insecticide resistance in the malaria vector Anopheles arabiensis in Mamfene, KwaZulu-Natal. S Afr J Sci. 111(11/12)"
        );
        cy.contains("Acknowledgement for data curation");
        cy.contains("World Health Organization");

        cy.contains(
            "Brooke et al. (2015) Insecticide resistance in the malaria vector Anopheles arabiensis in Mamfene, KwaZulu-Natal. S Afr J Sci. 111(11/12)"
        ).should("have.attr", "href", "https://pdfs.semanticscholar.org/47c6/6f2a59ced2840e878eff871a1b0a2e475c0a.pdf");
    });
});
