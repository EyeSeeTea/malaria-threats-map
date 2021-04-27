import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./webapp/App";
import * as serviceWorker from "./serviceWorker";
import "./webapp/config/i18next";
import ReactGA from "react-ga";
import { initHotjar } from "./hotjar";
import config from "./webapp/config";

declare global {
    interface Window {
        hj?: Hotjar;
    }
}

interface Hotjar {
    (command: "stateChange", path: string): void;
    debug: { on(): void; off(): void };
}

const { gaAppId, hotjar: hotjarConfig } = config;

if (hotjarConfig) {
    initHotjar(hotjarConfig.hjid, hotjarConfig.hjsv, true);
}

ReactGA.initialize(gaAppId, {
    debug: true,
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
