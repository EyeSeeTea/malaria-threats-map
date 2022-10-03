import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, skip, switchMap, withLatestFrom } from "rxjs/operators";
import {
    fetchDiagnosisStudiesError,
    fetchDiagnosisStudiesRequest,
    fetchDiagnosisStudiesSuccess,
    setDiagnosisDeletionType,
    setDiagnosisFilteredStudiesAction,
    setDiagnosisMapType,
    setDiagnosisSelectionStudies,
} from "../../actions/diagnosis-actions";
import {
    logEventAction,
    setFiltersAction,
    setThemeAction,
    logPageViewAction,
    setSelectionData,
} from "../../actions/base-actions";
import { DiagnosisMapType, State } from "../../types";
import { addNotificationAction } from "../../actions/notifier-actions";
import { getAnalyticsPageView } from "../../analytics";
import { fromFuture } from "../utils";
import { EpicDependencies } from "../../index";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import { ActionTypeEnum } from "../../actions";
import { createDiagnosisSelectionData } from "./utils";
import { DELETION_TYPES } from "../../../components/filters/DeletionTypeFilter";

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
                        return of(fetchDiagnosisStudiesSuccess(studies));
                    }),
                    catchError((error: Error) => of(addNotificationAction(error.message), fetchDiagnosisStudiesError()))
                );
            } else {
                return of(fetchDiagnosisStudiesSuccess(state.diagnosis.studies));
            }
        })
    );

export const setDiagnosisThemeEpic = (action$: Observable<ActionType<typeof setThemeAction>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetTheme),
        switchMap($action => {
            if ($action.payload !== "diagnosis") {
                return of();
            }

            const base = [setFiltersAction([1998, new Date().getFullYear()])];

            if ($action.from === "map") {
                return of(...base, setDiagnosisDeletionType(DELETION_TYPES.HRP2_PROPORTION_DELETION.value));
            } else {
                return of(...base, setDiagnosisDeletionType(null));
            }
        })
    );

export const setDiagnosisMapTypeEpic = (action$: Observable<ActionType<typeof setDiagnosisMapType>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetDiagnosisMapType),
        switchMap(action => {
            const pageView = getAnalyticsPageView({ page: "diagnosis", section: action.payload });
            const logPageView = logPageViewAction(pageView);

            if (action.payload === DiagnosisMapType.GENE_DELETIONS) {
                return of(logPageView);
            }
            return of();
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
            const siteFilteredStudies = state.malaria.selection
                ? state.diagnosis.filteredStudies.filter(study => study.SITE_ID === state.malaria.selection.SITE_ID)
                : [];

            const selectionData = createDiagnosisSelectionData(
                state.malaria.theme,
                state.malaria.selection,
                siteFilteredStudies
            );

            return of(setDiagnosisSelectionStudies(siteFilteredStudies), setSelectionData(selectionData));
        })
    );
