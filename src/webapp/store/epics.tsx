import { combineEpics, Epic } from "redux-observable";
import * as PreventionEpics from "./epics/prevention/prevention-epics";
import * as DiagnosisEpics from "./epics/diagnosis/diagnosis-epics";
import * as TreatmentEpics from "./epics/treatment-epics";
import * as InvasiveEpics from "./epics/invasive/invasive-epics";
import * as TranslationsEpics from "./epics/translations-epics";
import * as CountryLayerEpics from "./epics/country-layer-epics";
import * as DistrictEpics from "./epics/districts-epics";
import * as DataDownloadEpics from "./epics/data-download-epics";
import * as BaseEpics from "./epics/base-epics";
import { AnyAction } from "redux";

//TODO: redux-observable 2.0 has breaking changes for combineEpics
// https://redux-observable.js.org/CHANGELOG.html
// the TS type definition for combineEpics() no longer accepts any unsafe overloads. Cast to any if you need to provide unsafe/untyped Epics.
// we should create types for all actions and type epics with all actions and filter
// by the input action, example:
// export const getPreventionStudiesEpic:Epic<AllActions> = (
//     action$: Observable<AllActions>,
//     state$: StateObservable<State>,
//     { compositionRoot }: EpicDependencies
// ) =>
// action$.pipe(
//     filter(isOfType((ActionTypeEnum.FetchPreventionStudiesRequest))),
//     withLatestFrom(state$),
//     switchMap(([, state]) => {
//         if (state.prevention.studies.length === 0 && !state.prevention.error) {
//             return fromFuture(compositionRoot.prevention.getStudies()).pipe(
//                 mergeMap((studies: PreventionStudy[]) => {
//                     return of(fetchPreventionStudiesSuccess(studies));
//                 }),
//                 catchError((error: Error) =>
//                     of(addNotificationAction(error.message), fetchPreventionStudiesError())
//                 )
//             );
//         } else {
//             return of(fetchPreventionStudiesSuccess(state.prevention.studies));
//         }
//     })
// );

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
        ...Object.values(BaseEpics),
    ].map(epic => epic as Epic<AnyAction>)
);

export default rootEpic;
