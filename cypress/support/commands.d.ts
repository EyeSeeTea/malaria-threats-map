declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to visit root endpoint and close tour guide
         * @example cy.login('themeName')
         */
        loadPage(theme?: string): Chainable<Element>;
    }
}
