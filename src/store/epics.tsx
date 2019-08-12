import { combineEpics } from "redux-observable";
import * as PreventionEpics from "../malaria/prevention/epics";
import * as DiagnosisEpics from "../malaria/diagnosis/epics";
import * as TreatmentEpics from "../malaria/treatment/epics";
import * as InvasiveEpics from "../malaria/invasive/epics";

const rootEpic = combineEpics(
  ...Object.values(PreventionEpics),
  ...Object.values(DiagnosisEpics),
  ...Object.values(TreatmentEpics),
  ...Object.values(InvasiveEpics)
);

export default rootEpic;
