import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./webapp/App";
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
