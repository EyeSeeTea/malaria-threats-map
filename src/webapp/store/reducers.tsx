import { combineReducers } from "redux";

import malariaReducer from "./reducers/base-reducer";
import preventionReducer from "./reducers/prevention-reducer";
import diagnosisReducer from "./reducers/diagnosis-reducer";
import treatmentReducer from "./reducers/treatment-reducer";
import invasiveReducer from "./reducers/invasive-reducer";
import translationsReducer from "./reducers/translations-reducer";
import countryLayerReducer from "../store/reducers/country-layer-reducer";
import districtsReducer from "../store/reducers/districts-reducer";
import notificationsReducer from "../store/reducers/notifier-reducer";
import dataDownloadReducer from "../store/reducers/data-download-reducer";

import { State } from "./types";

const rootReducer = () =>
    combineReducers<State>({
        malaria: malariaReducer,
        prevention: preventionReducer,
        diagnosis: diagnosisReducer,
        treatment: treatmentReducer,
        invasive: invasiveReducer,
        translations: translationsReducer,
        countryLayer: countryLayerReducer,
        district: districtsReducer,
        notifications: notificationsReducer,
        downloads: dataDownloadReducer
    });

export default rootReducer;
