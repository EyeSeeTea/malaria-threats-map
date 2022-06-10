import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, skip, switchMap, withLatestFrom } from "rxjs/operators";
import {
    fetchTreatmentStudiesError,
    fetchTreatmentStudiesRequest,
    fetchTreatmentStudiesSuccess,
    setFilteredStudiesAction,
    setMolecularMarker,
    setTreatmentDrug,
    setTreatmentMapType,
    setTreatmentPlasmodiumSpecies,
} from "../../actions/treatment-actions";
import { logPageViewAction, setSelectionData } from "../../actions/base-actions";
import { TreatmentMapType, State } from "../../types";
import { addNotificationAction } from "../../actions/notifier-actions";
import { getAnalyticsPageView } from "../../analytics";
import { fromFuture } from "../utils";
import { EpicDependencies } from "../../index";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { createTreatmentSelectionData } from "./utils";

function groupStudies(studies: TreatmentStudy[]) {
    const filtered255Studies = studies.filter(study => study.DimensionID === 255 || study.DimensionID === 256);
    return filtered255Studies.map(study => ({
        ...study,
        groupStudies: studies.filter(
            relatedStudy => relatedStudy.DimensionID === 257 && relatedStudy.K13_CODE === study.Code
        ),
    }));
}

export const getTreatmentStudiesEpic = (
    action$: Observable<ActionType<typeof fetchTreatmentStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchTreatmentStudiesRequest),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            if (state.treatment.studies.length === 0 && !state.treatment.error) {
                return fromFuture(compositionRoot.treatment.getStudies()).pipe(
                    mergeMap((studies: TreatmentStudy[]) => {
                        return of(fetchTreatmentStudiesSuccess(groupStudies(studies)));
                    }),
                    catchError((error: Error) => of(addNotificationAction(error.message), fetchTreatmentStudiesError()))
                );
            } else {
                return of(fetchTreatmentStudiesSuccess(state.treatment.studies));
            }
        })
    );

export const setTreatmentThemeEpic = (action$: Observable<ActionType<typeof setTreatmentMapType>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetTreatmentMapType),
        switchMap(action => {
            if (action.payload === 2) {
                return of(setMolecularMarker(0));
            }
            return of();
        })
    );

export const setPlasmodiumSpeciesEpic = (action$: Observable<ActionType<typeof setTreatmentPlasmodiumSpecies>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetPlasmodiumSpecies),
        switchMap(action => {
            if (action.payload === "P._FALCIPARUM") {
                return of(setTreatmentDrug("DRUG_AL"));
            } else if (action.payload === "P._VIVAX") {
                return of(setTreatmentDrug("DRUG_CQ"));
            }
            return of();
        })
    );

export const setTreatmentMapTypeEpic = (action$: Observable<ActionType<typeof setTreatmentMapType>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetTreatmentMapType),
        switchMap(action => {
            const pageView = getAnalyticsPageView({ page: "treatment", section: action.payload });
            const logPageView = logPageViewAction(pageView);
            if (action.payload === TreatmentMapType.TREATMENT_FAILURE) {
                return of(logPageView);
            } else if (action.payload === TreatmentMapType.MOLECULAR_MARKERS) {
                return of(logPageView);
            } else if (action.payload === TreatmentMapType.DELAYED_PARASITE_CLEARANCE) {
                return of(logPageView);
            }
            return of();
        })
    );

export const setTreatmentPlasmodiumSpeciesEpic = (
    action$: Observable<ActionType<typeof setTreatmentPlasmodiumSpecies>>
) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetPlasmodiumSpecies),
        switchMap(action => {
            if (["P._FALCIPARUM", "P._KNOWLESI", "P._OVALE"].includes(action.payload)) {
                return of(setTreatmentDrug("DRUG_AL"));
            } else {
                return of(setTreatmentDrug("DRUG_CQ"));
            }
        })
    );

export const setTreatmentFilteredStudiesEpic = (
    action$: Observable<ActionType<typeof setFilteredStudiesAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetTreatmentFilteredStudies),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            const selectionData = createTreatmentSelectionData(
                state.malaria.theme,
                state.treatment.filters,
                state.malaria.selection,
                state.treatment.filteredStudies
            );

            return of(setSelectionData(selectionData));
        })
    );
