declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to visit root endpoint and close tour guide
         * @example cy.login('themeName')
        */
        loadPage(theme?: string): Chainable<Element>
    }
    interface Chainable {
        /**
         * Custom command to reset zoom (zoom out)
         * @example cy.resetMapZoom()
        */
         resetMapZoom(theme?: string): Chainable<Element>
    }
    interface Chainable {
        /**
         * Click on Map at specific coordinates
         * @example cy.clickOnMap(15, 40)
        */
         clickOnMap(x: number, y: number): Chainable<Element>
    }
}
