import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, skip, switchMap, withLatestFrom } from "rxjs/operators";
import {
    fetchDiagnosisStudiesError,
    fetchDiagnosisStudiesRequest,
    fetchDiagnosisStudiesSuccess,
    setDiagnosisDataset,
    setDiagnosisDeletionType,
    setDiagnosisFilteredStudiesAction,
    setDiagnosisMapType,
} from "../../actions/diagnosis-actions";
import {
    logEventAction,
    setFiltersAction,
    setThemeAction,
    logPageViewAction,
    setSelectionData,
    setMaxMinYearsAction,
} from "../../actions/base-actions";
import { DiagnosisFilters, DiagnosisMapType, State } from "../../types";
import { addNotificationAction } from "../../actions/notifier-actions";
import { getAnalyticsPageView } from "../../analytics";
import { fromFuture } from "../utils";
import { EpicDependencies } from "../../index";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import { ActionTypeEnum } from "../../actions";
import { createDiagnosisSelectionData } from "./utils";
import { DELETION_TYPES } from "../../../components/filters/DeletionTypeFilter";
import { getMinMaxYears } from "../../../../domain/entities/Study";
import { resetDatesRequired } from "../common/utils";

export const getDiagnosisStudiesEpic = (
    action$: Observable<ActionType<typeof fetchDiagnosisStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchDiagnosisStudiesRequest),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            if (state.diagnosis.studies.length === 0 && !state.diagnosis.error) {
                return fromFuture(compositionRoot.diagnosis.getStudies()).pipe(
                    mergeMap((studies: DiagnosisStudy[]) => {
                        return of(
                            ...resetDatesRequired({
                                minMaxYears: () => getMinMaxYears(studies, false),
                                theme: "diagnosis",
                                state,
                            }),
                            fetchDiagnosisStudiesSuccess(studies)
                        );
                    }),
                    catchError((error: Error) => of(addNotificationAction(error.message), fetchDiagnosisStudiesError()))
                );
            } else {
                return of(fetchDiagnosisStudiesSuccess(state.diagnosis.studies));
            }
        })
    );

export const setDiagnosisThemeEpic = (
    action$: Observable<ActionType<typeof setThemeAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetTheme),
        withLatestFrom(state$),
        switchMap(([$action, $state]) => {
            if ($action.payload !== "diagnosis") {
                return of();
            }
            const [start, end] = getMinMaxYears($state.diagnosis.studies, false);

            const base = [setMaxMinYearsAction([start, end]), setFiltersAction([start, end])];

            if ($action.from === "map") {
                return of(...base, setDiagnosisDeletionType(DELETION_TYPES.HRP2_PROPORTION_DELETION.value));
            } else {
                return of(...base, setDiagnosisDeletionType(null));
            }
        })
    );

export const setDiagnosisMapTypeEpic = (
    action$: Observable<ActionType<typeof setDiagnosisMapType>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetDiagnosisMapType),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const isOnGoing = isDiagnosisMapTypeOngoing(state.diagnosis.filters);
            const maxAsCurrent = !isOnGoing;

            const [start, end] = getMinMaxYears(state.diagnosis.studies, maxAsCurrent, isOnGoing ? 2018 : undefined);

            const base = [setMaxMinYearsAction([start, end]), setFiltersAction([start, end])];

            const pageView = getAnalyticsPageView({ page: "diagnosis", section: action.payload });
            const logPageView = logPageViewAction(pageView);

            return of(...base, logPageView);
        })
    );

export const setDiagnosisDatasetEpic = (
    action$: Observable<ActionType<typeof setDiagnosisDataset>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetDiagnosisDataset),
        withLatestFrom(state$),
        switchMap(([_, state]) => {
            const isOnGoing = isDiagnosisDatasetOngoing(state.diagnosis.filters);
            const maxAsCurrent = !isOnGoing;

            const [start, end] = getMinMaxYears(state.diagnosis.studies, maxAsCurrent, isOnGoing ? 2018 : undefined);

            return of(setMaxMinYearsAction([start, end]), setFiltersAction([start, end]));
        })
    );

export const setDiagnosisDeletionTypeEpic = (action$: Observable<ActionType<typeof setDiagnosisDeletionType>>) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetDeletionType),
        switchMap(action => {
            return of(
                logEventAction({
                    category: "filter",
                    action: "deletionType",
                    label: action.payload,
                })
            );
        })
    );

export const setDiagnosisFilteredStudiesEpic = (
    action$: Observable<ActionType<typeof setDiagnosisFilteredStudiesAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetDiagnosisFilteredStudies),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            const selectionData = createDiagnosisSelectionData(
                state.malaria.theme,
                state.malaria.selection,
                state.diagnosis.filters,
                state.diagnosis.filteredStudies
            );

            return of(setSelectionData(null), setSelectionData(selectionData));
        })
    );

function isDiagnosisMapTypeOngoing(diagnosisFilters: DiagnosisFilters) {
    return diagnosisFilters.mapType === DiagnosisMapType.HRP23_STUDIES;
}

function isDiagnosisDatasetOngoing(diagnosisFilters: DiagnosisFilters) {
    return diagnosisFilters.dataset === "HRPO";
}
