import { combineEpics } from "redux-observable";
import * as PreventionEpics from "../malaria/prevention/epics";
import * as DiagnosisEpics from "../malaria/diagnosis/epics";
import * as TreatmentEpics from "../malaria/treatment/epics";
import * as InvasiveEpics from "../malaria/invasive/epics";
import * as TranslationsEpics from "../malaria/translations/epics";

const rootEpic = combineEpics(
  ...Object.values(PreventionEpics),
  ...Object.values(DiagnosisEpics),
  ...Object.values(TreatmentEpics),
  ...Object.values(InvasiveEpics),
  ...Object.values(TranslationsEpics)
);

export default rootEpic;
