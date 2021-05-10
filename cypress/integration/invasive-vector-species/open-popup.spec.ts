import { themes } from "../../support/constants";

describe("Open popup", () => {
    beforeEach(() => {
        cy.loadPage(themes.invasiveVectorSpecies);
    });

    it("should open a popup to click on coordinates", () => {
        cy.resetMapZoom();

        cy.clickOnMap(800, 300);
        cy.findByText("An. stephensi s.l.");

    });
    it("should contain all the Kanasar & Khetusar study information ", () => {
        cy.resetMapZoom();

        cy.clickOnMap(800, 300);
        cy.findByText("An. stephensi s.l.");
        cy.findByText("Kanasar & Khetusar");
        cy.findByText("1994");
        cy.findByText("NR");
        cy.findByText("morphology");
        cy.findByText("Tyagi, B.K. and Yadav, S.P. (2001). Bionomics of malaria vectors in two physiographically different areas of the epidemic-prone Thar Desert, north-western Rajasthan (India). Journal of Arid Environments, 47(2):161-172");
        cy.findByText("Sinka et al. (2020) A new malaria vector in Africa: Predicting the expansion range of Anopheles stephensi and identifying the urban populations at risk, PNAS, DOI: 10.1073/pnas.2003976117ct");

    });
});
