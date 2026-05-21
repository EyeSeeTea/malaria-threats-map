import { combineEpics, Epic } from "redux-observable";
import * as PreventionEpics from "./epics/prevention/prevention-epics";
import * as DiagnosisEpics from "./epics/diagnosis/diagnosis-epics";
import * as TreatmentEpics from "./epics/treatment/treatment-epics";
import * as InvasiveEpics from "./epics/invasive/invasive-epics";
import * as TranslationsEpics from "./epics/translations-epics";
import * as CountryLayerEpics from "./epics/country-layer-epics";
import * as DistrictEpics from "./epics/districts-epics";
import * as DataDownloadEpics from "./epics/data-download-epics";
import * as BaseEpics from "./epics/base-epics";
import * as FeedbackEpics from "./epics/feedback-epics";
import { AnyAction } from "redux";

const rootEpic = combineEpics(
    ...[
        ...Object.values(PreventionEpics),
        ...Object.values(DiagnosisEpics),
        ...Object.values(DiagnosisEpics),
        ...Object.values(TreatmentEpics),
        ...Object.values(InvasiveEpics),
        ...Object.values(TranslationsEpics),
        ...Object.values(CountryLayerEpics),
        ...Object.values(DistrictEpics),
        ...Object.values(DataDownloadEpics),
        ...Object.values(FeedbackEpics),
        ...Object.values(BaseEpics),
    ].map(epic => epic as Epic<AnyAction>)
);

export default rootEpic;
