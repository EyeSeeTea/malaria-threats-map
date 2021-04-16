import "@testing-library/cypress/add-commands";

Cypress.Commands.add("loadPage", (theme) => {
    cy.visit("/");
    cy.contains("Close").click();

    if (theme) {
        cy.contains(theme).click();
    }
});

Cypress.Commands.add("resetMapZoom", () => {
    cy.get(".mapboxgl-canvas").trigger("wheel", { deltaY: 800})
     //Wait to load points in canvas
     //Points are not at the DOM then we wait by time
     cy.wait(5000);
});

Cypress.Commands.add("clickOnMap", (x,y) => {
    cy.get(".mapboxgl-canvas").click(x, y);
});
