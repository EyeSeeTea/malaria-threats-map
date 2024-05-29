import "@testing-library/cypress/add-commands";

Cypress.Commands.add("loadPage", theme => {
    cy.visit("/");
});
