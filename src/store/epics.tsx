import { combineEpics } from "redux-observable";
import * as PreventionEpics from "./epics/prevention-epics";
import * as DiagnosisEpics from "./epics/diagnosis-epics";
import * as TreatmentEpics from "./epics/treatment-epics";
import * as InvasiveEpics from "./epics/invasive-epics";
import * as TranslationsEpics from "./epics/translations-epics";
import * as CountryLayerEpics from "./epics/country-layer-epics";
import * as DistrictEpics from "./epics/districts-epics";
import * as BaseEpics from "./epics/base-epics";

const rootEpic = combineEpics(
  ...Object.values(PreventionEpics),
  ...Object.values(DiagnosisEpics),
  ...Object.values(TreatmentEpics),
  ...Object.values(InvasiveEpics),
  ...Object.values(TranslationsEpics),
  ...Object.values(CountryLayerEpics),
  ...Object.values(DistrictEpics),
  ...Object.values(BaseEpics)
);

export default rootEpic;
