import "@testing-library/cypress/add-commands";
//import { cy } from "date-fns/locale";

Cypress.Commands.add("loadPage", theme => {
    cy.visit("/");
    cy.contains("Close").click();

    if (theme) {
        cy.contains(theme).click();
    }
});

Cypress.Commands.add("resetMapZoom", () => {
    cy.get(".mapboxgl-canvas").trigger("wheel", { deltaY: 800 });
    //Wait to load points in canvas
    //Points are not at the DOM then we wait by time
    cy.wait(4000);
});

Cypress.Commands.add("clickOnMap", (x, y) => {
    cy.get(".mapboxgl-canvas").click(x, y);
});

Cypress.Commands.add("openSitePopup", name => {
    cy.findByText(/regions/i).click();
    cy.findByText(/select site/i).type(`${name}{enter}`);
});

Cypress.Commands.add("openCountryPopup", name => {
    cy.findByText(/regions/i).click();
    cy.findByText(/select country/i).type(`${name}{enter}`);
});

Cypress.Commands.add("openStoryMode", () => {
    cy.findByRole("button", { name: "Filters" }).click();
    cy.findByRole("button", { name: "Story mode" }).click();
});

Cypress.Commands.add("openCountryMode", () => {
    cy.findByRole("button", { name: "Show studies per country" }).click();
});

Cypress.Commands.add("openSummaryReport", () => {
    cy.findByRole("button", { name: "Summary Report" }).click();
});

Cypress.Commands.add("findByLegendTitle", title => {
    cy.findByRole("group", { name: "Legend" }).findByText(title, { exact: false });
});
