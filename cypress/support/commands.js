import "@testing-library/cypress/add-commands";

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
    cy.wait(2000);
});

Cypress.Commands.add("clickOnMap", (x, y) => {
    cy.get(".mapboxgl-canvas").click(x, y);
});

Cypress.Commands.add("openStoryMode", () => {
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
