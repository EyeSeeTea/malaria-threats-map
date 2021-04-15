import "@testing-library/cypress/add-commands";

Cypress.Commands.add("loadPage", (theme) => {
    cy.visit("/");
    cy.contains("Close").click();

    if (theme) {
        cy.contains(theme).click();
        cy.findByRole("progressbar").should("not.exist");
    }
});
