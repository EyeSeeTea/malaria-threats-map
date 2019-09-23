import { combineReducers } from "redux";

import malariaReducer from "../malaria/reducer";
import preventionReducer from "../malaria/prevention/reducer";
import diagnosisReducer from "../malaria/diagnosis/reducer";
import treatmentReducer from "../malaria/treatment/reducer";
import invasiveReducer from "../malaria/invasive/reducer";
import translationsReducer from "../malaria/translations/reducer";
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
