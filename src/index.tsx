import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./config/i18next";
import ReactGA from "react-ga";
import config from "./config";
import { hotjar } from "react-hotjar"

const gaAppId = config.gaAppId;

hotjar.initialize(2269048, 6);

ReactGA.initialize(gaAppId, {
  debug: true
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
