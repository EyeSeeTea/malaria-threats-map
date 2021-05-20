import { themes } from "../../support/constants";

describe("Open popup in pyrethroid-PBO nets deployment subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Pyrethroid-PBO nets deployment").click();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(375, 375);
        cy.findByText("Cesaree, French Guiana");
    });

    it("should contain all the Cesaree, French Guiana study information ", () => {
        cy.clickOnMap(375, 375);
        cy.findByText("Cesaree, French Guiana");
        cy.contains("Compliance with WHO recommended criteria for Pyrethroid-PBO nets deployment by vector species");

        //row titles
        cy.contains("Vector species");
        cy.contains("Pyrethroid resistance status");
        cy.contains("Adj. mortality against pyrethroids between 10% and 80%");
        cy.contains("Most recent pyrethroid susceptibility test results");
        cy.contains("Conferred (at least in part) by mono-oxygenase");
        cy.contains("Mono-oxygenase measured by");
        cy.contains("Most recent mono-oxygenase involvement results");

        //row data
        cy.contains("An. darlingi");
        cy.contains("Possible resistance");
        cy.contains("No");
        cy.contains("2017");
    });
});

describe("Open popup in insecticide resistance intensity subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Insecticide resistance intensity").click();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(680, 350);
        cy.findByText("Intensity concentration bioassay, WHO test kit bioassay");
    });

    it("should contain all the Tesseney, Eritrea study information ", () => {
        cy.clickOnMap(680, 350);
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
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(650, 435);
        cy.findByText("Biochemical assays, Mono oxygenases");
    });

    it("should contain all the Kitwe, Zambia study information", () => {
        cy.clickOnMap(650, 435);
        cy.findByText("Kitwe, Zambia");
        cy.findByText("Biochemical assays, Mono oxygenases");
        cy.contains(
            "Thomsen et al. (2014) Underpinning Sustainable Vector Control through Informed Insecticide Resistance Management.. PLoS One. 2014 Jun 16,9(6):e99822"
        );
        cy.contains("Acknowledgement for data curation");
        cy.contains("World Health Organization");
    });

    it("should have an active link to the correct study", () => {
        cy.clickOnMap(650, 435);
        cy.contains(
            "Thomsen et al. (2014) Underpinning Sustainable Vector Control through Informed Insecticide Resistance Management.. PLoS One. 2014 Jun 16,9(6):e99822"
        ).should("have.attr", "href", "https://www.ncbi.nlm.nih.gov/pubmed/24932861");
    });
});

describe("Open popup in insecticide resistance status subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(550, 360);
        cy.findByText("Discriminating concentration bioassays, WHO test kit bioassay");
    });

    it("should contain all the Wecheau, Ghana study information", () => {
        cy.clickOnMap(550, 360);
        cy.findByText("Wecheau, Ghana");
        cy.contains("Discriminating concentration bioassays, WHO test kit bioassay");
        cy.contains(
            "Dadzie et al. (2017) Evaluation of piperonyl butoxide in enhancing the efficacy of pyrethroid insecticides against resistant Anopheles gambiae s.l. in Ghana. Malar J. 2017 Aug 17;16(1):342"
        );
        cy.findByText("Acknowledgement for data curation");
        cy.contains("Acknowledgement for data curation");
        cy.contains("World Health Organization");
    });

    it("should have an active link to the correct study", () => {
        cy.clickOnMap(550, 360);
        cy.contains(
            "Dadzie et al. (2017) Evaluation of piperonyl butoxide in enhancing the efficacy of pyrethroid insecticides against resistant Anopheles gambiae s.l. in Ghana. Malar J. 2017 Aug 17;16(1):342"
        ).should("have.attr", "href", "https://www.ncbi.nlm.nih.gov/pubmed/28818077");
    });
});

describe("Open popup in synergist effect in susceptibility subtheme", () => {
    beforeEach(() => {
        cy.loadPage(themes.vectorInsecticideResistance);
        cy.contains("Insecticide resistance status").click();
        cy.findByText("Synergist effect in susceptibility").click();
        cy.resetMapZoom();
    });

    it("should open a popup to click on coordinates", () => {
        cy.clickOnMap(658, 489);
        cy.findByText("Synergist-insecticide bioassays, Mono oxygenases");
    });

    it("should contain all the Mamfene, South Africa study information", () => {
        cy.clickOnMap(658, 489);
        cy.findByText("Mamfene, South Africa");
        cy.findByText("Synergist-insecticide bioassays, Mono oxygenases");
        cy.contains(
            "Brooke et al. (2015) Insecticide resistance in the malaria vector Anopheles arabiensis in Mamfene, KwaZulu-Natal. S Afr J Sci. 111(11/12)"
        );
        cy.contains("Acknowledgement for data curation");
        cy.contains("World Health Organization");
    });

    it("should have an active link to the correct study", () => {
        cy.clickOnMap(658, 489);
        cy.contains(
            "Brooke et al. (2015) Insecticide resistance in the malaria vector Anopheles arabiensis in Mamfene, KwaZulu-Natal. S Afr J Sci. 111(11/12)"
        ).should("have.attr", "href", "https://pdfs.semanticscholar.org/47c6/6f2a59ced2840e878eff871a1b0a2e475c0a.pdf");
    });
});
