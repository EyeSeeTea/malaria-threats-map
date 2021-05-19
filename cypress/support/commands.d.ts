declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to visit root endpoint and close tour guide
         * @example cy.login('themeName')
         */
        loadPage(theme?: string): Chainable<Element>;
    }
    interface Chainable {
        /**
         * Custom command to open story mode
         * @example cy.openStoryMode('')
         */
        openStoryMode(): Chainable<Element>;
    }
    interface Chainable {
        /**
         * Custom command to open summary report
         * @example cy.openCountryMode('')
         */
        openCountryMode(): Chainable<Element>;
    }
    interface Chainable {
        /**
         * Custom command to open summary report
         * @example cy.openSummaryReport('')
         */
        openSummaryReport(): Chainable<Element>;
    }
    interface Chainable {
        /**
         * Custom command to find a legend title
         * @example cy.findByLegendTitle('title')
         */
        findByLegendTitle(title: string): Chainable<Element>;
    }
    interface Chainable {
        /**
         * Custom command to reset zoom (zoom out)
         * @example cy.resetMapZoom()
         */
        resetMapZoom(theme?: string): Chainable<Element>;
    }
    interface Chainable {
        /**
         * Click on Map at specific coordinates
         * @example cy.clickOnMap(15, 40)
         */
        clickOnMap(x: number, y: number): Chainable<Element>;
    }
}
