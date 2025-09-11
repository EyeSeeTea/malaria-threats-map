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
    setTreatmentDrugs,
    setMolecularMarkers,
    setTreatmentMapType,
    setTreatmentPlasmodiumSpecies,
    setTreatmentDataset,
} from "../../actions/treatment-actions";
import {
    logPageViewAction,
    setFiltersAction,
    setMaxMinYearsAction,
    setRegionAction,
    setSelectionData,
    setThemeAction,
} from "../../actions/base-actions";
import { TreatmentMapType, State, TreatmentFilters } from "../../types";
import { addNotificationAction } from "../../actions/notifier-actions";
import { getAnalyticsPageView } from "../../analytics";
import { fromFuture } from "../utils";
import { EpicDependencies } from "../../index";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { createTreatmentSelectionData } from "./utils";
import { molecularMarkersMap } from "../../../components/filters/MolecularMarkerRadioFilter";
import { getMinMaxYears } from "../../../../domain/entities/Study";
import { MOLECULAR_MARKERS_MAP } from "../../../components/layers/treatment/MolecularMarkersOngoingStudies/utils";
import { resetDatesRequired } from "../common/utils";

function groupStudies(studies: TreatmentStudy[]) {
    const filteredMainStudies = studies.filter(
        study =>
            study.DimensionID === 255 ||
            study.DimensionID === 256 ||
            study.DimensionID === 300 ||
            study.DimensionID === 301
    );
    return filteredMainStudies.map(study => ({
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
                        return of(
                            ...resetDatesRequired({
                                minMaxYears: () => getMinMaxYears(studies),
                                theme: "treatment",
                                state,
                            }),
                            fetchTreatmentStudiesSuccess(groupStudies(studies))
                        );
                    }),
                    catchError((error: Error) => of(addNotificationAction(error.message), fetchTreatmentStudiesError()))
                );
            } else {
                return of(fetchTreatmentStudiesSuccess(state.treatment.studies));
            }
        })
    );

export const setTreatmentMapTypesEpic = (
    action$: Observable<ActionType<typeof setTreatmentMapType>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetTreatmentMapType),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const isOnGoing = isTreatmentMapTypeOngoing(state.treatment.filters);
            const maxAsCurrent = !isOnGoing;

            const pageView = getAnalyticsPageView({ page: "treatment", section: action.payload });
            const logPageView = logPageViewAction(pageView);

            const [start, end] = getMinMaxYears(state.treatment.studies, maxAsCurrent, isOnGoing ? 2018 : undefined);

            const base = [setMaxMinYearsAction([start, end]), setFiltersAction([start, end]), logPageView];

            if (action.payload === TreatmentMapType.MOLECULAR_MARKERS) {
                return of(...base, setMolecularMarkers([1]));
            } else if (action.payload === TreatmentMapType.DELAYED_PARASITE_CLEARANCE) {
                return of(...base, setTreatmentPlasmodiumSpecies(["P._FALCIPARUM"]));
            } else {
                return of(...base);
            }
        })
    );

export const setTreatmentDatasetEpic = (
    action$: Observable<ActionType<typeof setTreatmentDataset>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetTreatmentDataset),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const isOnGoing = isTreatmentDatasetOngoing(state.treatment.filters);
            const maxAsCurrent = !isOnGoing;

            const [start, end] = getMinMaxYears(state.treatment.studies, maxAsCurrent, isOnGoing ? 2018 : undefined);

            if (action.payload === "AMDERO_MM") {
                const molecularMarkers = Object.values(MOLECULAR_MARKERS_MAP);
                return of(
                    setMaxMinYearsAction([start, end]),
                    setFiltersAction([start, end]),
                    setMolecularMarkers(molecularMarkers)
                );
            } else {
                return of(setMaxMinYearsAction([start, end]), setFiltersAction([start, end]));
            }
        })
    );

export const setPlasmodiumSpeciesEpic = (action$: Observable<ActionType<typeof setTreatmentPlasmodiumSpecies>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetPlasmodiumSpecies),
        switchMap(action => {
            if (action.payload.includes("P._FALCIPARUM")) {
                return of(setTreatmentDrugs(["DRUG_AL"]));
            } else if (action.payload.includes("P._VIVAX")) {
                return of(setTreatmentDrugs(["DRUG_CQ"]));
            }
            return of();
        })
    );

export const setMolecularMarkersEpic = (action$: Observable<ActionType<typeof setMolecularMarkers>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetMolecularMarkers),
        switchMap(action => {
            if (action.payload.includes(molecularMarkersMap.Pfcrt) && action.payload?.length === 1) {
                return of(setRegionAction({ region: "AMERICAS" }));
            } else {
                return of(setRegionAction({}));
            }
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
            if (action.payload.some(species => ["P._FALCIPARUM", "P._KNOWLESI", "P._OVALE"].includes(species))) {
                return of(setTreatmentDrugs(["DRUG_AL"]));
            } else if (action.payload !== null && action.payload?.length) {
                return of(setTreatmentDrugs(["DRUG_CQ"]));
            } else {
                return of();
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
                state.malaria.filters,
                state.malaria.selection,
                state.treatment.filteredStudies
            );

            return of(setSelectionData(null), setSelectionData(selectionData));
        })
    );

export const setTreatmentThemeEpic = (
    action$: Observable<ActionType<typeof setThemeAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetTheme),
        withLatestFrom(state$),
        switchMap(([$action, $state]) => {
            if ($action.payload !== "treatment") {
                return of();
            }

            const [start, end] = getMinMaxYears($state.treatment.studies);

            const base = [setMaxMinYearsAction([2010, end]), setFiltersAction([start, end])];

            if ($action.from === "map") {
                return of(
                    ...base,
                    setTreatmentPlasmodiumSpecies(["P._FALCIPARUM"]),
                    setTreatmentDrugs(["DRUG_AL"]),
                    setMolecularMarkers([1])
                );
            } else {
                return of(...base, setTreatmentPlasmodiumSpecies([]), setTreatmentDrugs([]), setMolecularMarkers([]));
            }
        })
    );

function isTreatmentMapTypeOngoing(treatmentFilters: TreatmentFilters) {
    return (
        treatmentFilters.mapType === TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES ||
        treatmentFilters.mapType === TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES
    );
}

function isTreatmentDatasetOngoing(treatmentFilters: TreatmentFilters) {
    return treatmentFilters.dataset === "AMDERO_TES" || treatmentFilters.dataset === "AMDERO_MM";
}
