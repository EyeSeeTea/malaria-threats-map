import {ActionsObservable, StateObservable} from "redux-observable";
import {ActionType} from "typesafe-actions";
import {ActionTypeEnum} from "../../store/actions";
import {of} from "rxjs";
import {catchError, mergeMap, skip, switchMap} from "rxjs/operators";
import {
    fetchDiagnosisStudiesError,
    fetchDiagnosisStudiesRequest,
    fetchDiagnosisStudiesSuccess,
    setDiagnosisDeletionType,
    setDiagnosisMapType,
} from "../actions/diagnosis-actions";
import {
    logEventAction,
    setFiltersAction,
    setThemeAction,
    logPageViewAction,
} from "../actions/base-actions";
import {DiagnosisMapType, State} from "../types";
import {addNotificationAction} from "../actions/notifier-actions";
import {getAnalyticsPageView} from "../analytics";
import {fromFuture} from "./utils";
import {EpicDependencies} from "../../store/index";
import {DiagnosisStudy} from "../../../domain/entities/DiagnosisStudy";

export const getDiagnosisStudiesEpic = (
    action$: ActionsObservable<ActionType<typeof fetchDiagnosisStudiesRequest>>,
    _state$: StateObservable<State>,
    {compositionRoot}: EpicDependencies
) =>
    action$.ofType(ActionTypeEnum.FetchDiagnosisStudiesRequest).pipe(
        switchMap(() => {
            return fromFuture(compositionRoot.diagnosis.getStudies()).pipe(
                mergeMap((studies: DiagnosisStudy[]) => {
                    return of(fetchDiagnosisStudiesSuccess(studies));
                }),
                catchError((error: Error) =>
                    of(
                        addNotificationAction(error.message),
                        fetchDiagnosisStudiesError(error.message)
                    )
                )
            );
        })
    );

export const setDiagnosisThemeEpic = (
    action$: ActionsObservable<ActionType<typeof setThemeAction>>
) =>
    action$.ofType(ActionTypeEnum.MalariaSetTheme).pipe(
        switchMap(($action) => {
            if ($action.payload !== "diagnosis") {
                return of();
            }
            return of(setFiltersAction([1998, new Date().getFullYear()]));
        })
    );

export const setDiagnosisMapTypeEpic = (
    action$: ActionsObservable<ActionType<typeof setDiagnosisMapType>>
) =>
    action$.ofType(ActionTypeEnum.SetDiagnosisMapType).pipe(
        switchMap((action) => {
            const pageView = getAnalyticsPageView({page: "diagnosis", section: action.payload});
            const logPageView = logPageViewAction(pageView);

            if (action.payload === DiagnosisMapType.GENE_DELETIONS) {
                return of(logPageView);
            }
            return of();
        })
    );

export const setDiagnosisDeletionTypeEpic = (
    action$: ActionsObservable<ActionType<typeof setDiagnosisDeletionType>>
) =>
    action$
        .ofType(ActionTypeEnum.SetDeletionType)
        .pipe(skip(1))
        .pipe(
            switchMap((action) => {
                return of(
                    logEventAction({
                        category: "filter",
                        action: "deletionType",
                        label: action.payload,
                    })
                );
            })
        );
