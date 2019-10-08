import { combineReducers } from "redux";

import malariaReducer from "./reducers/base-reducer";
import preventionReducer from "./reducers/prevention-reducer";
import diagnosisReducer from "./reducers/diagnosis-reducer";
import treatmentReducer from "./reducers/treatment-reducer";
import invasiveReducer from "./reducers/invasive-reducer";
import translationsReducer from "./reducers/translations-reducer";
import countryLayerReducer from "../store/reducers/country-layer-reducer";

const rootReducer = () =>
  combineReducers({
    malaria: malariaReducer,
    prevention: preventionReducer,
    diagnosis: diagnosisReducer,
    treatment: treatmentReducer,
    invasive: invasiveReducer,
    translations: translationsReducer,
    countryLayer: countryLayerReducer
  } as any);

export default rootReducer;
