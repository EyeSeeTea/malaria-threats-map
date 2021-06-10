import { ActionsObservable, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../actions";
import { of } from "rxjs";
import { catchError, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import {
    fetchInvasiveStudiesError,
    fetchInvasiveStudiesRequest,
    fetchInvasiveStudiesSuccess,
    setInvasiveMapType,
} from "../actions/invasive-actions";
import { setFiltersAction, setThemeAction, logPageViewAction } from "../actions/base-actions";
import { InvasiveMapType, State } from "../types";
import { addNotificationAction } from "../actions/notifier-actions";
import { getAnalyticsPageView } from "../analytics";
import { fromFuture } from "./utils";
import { EpicDependencies } from "../../store/index";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";

export const getInvasiveStudiesEpic = (
    action$: ActionsObservable<ActionType<typeof fetchInvasiveStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.ofType(ActionTypeEnum.FetchInvasiveStudiesRequest).pipe(
        withLatestFrom(state$),
        switchMap(([, state]) => {
            if (state.invasive.studies.length === 0 && !state.invasive.error) {
                return fromFuture(compositionRoot.invasive.getStudies()).pipe(
                    mergeMap((studies: InvasiveStudy[]) => {
                        return of(fetchInvasiveStudiesSuccess(studies));
                    }),
                    catchError((error: Error) => of(addNotificationAction(error.message), fetchInvasiveStudiesError()))
                );
            } else {
                return of(fetchInvasiveStudiesSuccess(state.invasive.studies));
            }
        })
    );

export const setTreatmentMapTypeEpic = (action$: ActionsObservable<ActionType<typeof setInvasiveMapType>>) =>
    action$.ofType(ActionTypeEnum.SetInvasiveMapType).pipe(
        switchMap(action => {
            const pageView = getAnalyticsPageView({ page: "invasive", section: action.payload });
            const logPageView = logPageViewAction(pageView);
            if (action.payload === InvasiveMapType.VECTOR_OCCURANCE) {
                return of(logPageView);
            }
            return of();
        })
    );

export const setInvasiveThemeEpic = (action$: ActionsObservable<ActionType<typeof setThemeAction>>) =>
    action$.ofType(ActionTypeEnum.MalariaSetTheme).pipe(
        switchMap($action => {
            if ($action.payload !== "invasive") {
                return of();
            }
            return of(setFiltersAction([1985, new Date().getFullYear()]));
        })
    );
