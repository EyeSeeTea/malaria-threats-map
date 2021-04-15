declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to visit root endpoint and close tour guide
         * @example cy.login('greeting')
        */
        loadPage(theme?: string): Chainable<Element>
    }
}