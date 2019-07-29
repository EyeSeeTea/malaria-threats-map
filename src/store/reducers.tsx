import { combineReducers } from "redux";

import malariaReducer from "../malaria/reducer";

const rootReducer = () =>
  combineReducers({
    malaria: malariaReducer
  } as any);

export default rootReducer;
