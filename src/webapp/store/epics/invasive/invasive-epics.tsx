import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import {
    fetchInvasiveStudiesError,
    fetchInvasiveStudiesRequest,
    fetchInvasiveStudiesSuccess,
    setInvasiveFilteredStudiesAction,
    setInvasiveMapType,
} from "../../actions/invasive-actions";
import {
    setFiltersAction,
    setThemeAction,
    logPageViewAction,
    setSelectionData,
    setMaxMinYearsAction,
} from "../../actions/base-actions";
import { InvasiveMapType, State } from "../../types";
import { addNotificationAction } from "../../actions/notifier-actions";
import { getAnalyticsPageView } from "../../analytics";
import { fromFuture } from "../utils";
import { EpicDependencies } from "../../index";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";
import { createInvasiveSelectionData } from "./utils";
import { getMinMaxYears } from "../../../../domain/entities/Study";
import { resetDatesRequired } from "../common/utils";

export const getInvasiveStudiesEpic = (
    action$: Observable<ActionType<typeof fetchInvasiveStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchInvasiveStudiesRequest),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            if (state.invasive.studies.length === 0 && !state.invasive.error) {
                return fromFuture(compositionRoot.invasive.getStudies()).pipe(
                    mergeMap((studies: InvasiveStudy[]) => {
                        return of(
                            ...resetDatesRequired({
                                minMaxYears: () => getMinMaxYears(studies),
                                theme: "invasive",
                                state,
                            }),
                            fetchInvasiveStudiesSuccess(studies)
                        );
                    }),
                    catchError((error: Error) => of(addNotificationAction(error.message), fetchInvasiveStudiesError()))
                );
            } else {
                return of(fetchInvasiveStudiesSuccess(state.invasive.studies));
            }
        })
    );

export const setTreatmentMapTypeEpic = (action$: Observable<ActionType<typeof setInvasiveMapType>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetInvasiveMapType),
        switchMap(action => {
            const pageView = getAnalyticsPageView({ page: "invasive", section: action.payload });
            const logPageView = logPageViewAction(pageView);
            if (action.payload === InvasiveMapType.VECTOR_OCCURANCE) {
                return of(logPageView);
            }
            return of();
        })
    );

export const setInvasiveThemeEpic = (
    action$: Observable<ActionType<typeof setThemeAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetTheme),
        withLatestFrom(state$),
        switchMap(([$action, $state]) => {
            if ($action.payload !== "invasive") {
                return of();
            }

            const studies = $state.invasive.studies;
            const minMax = studies.length ? getMinMaxYears(studies, false) : undefined;
            return of(setMaxMinYearsAction(minMax), setFiltersAction(minMax));
        })
    );

export const setInvasiveFilteredStudiesEpic = (
    action$: Observable<ActionType<typeof setInvasiveFilteredStudiesAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe().pipe(
        ofType(ActionTypeEnum.SetInvasiveFilteredStudies),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            const selectionData = createInvasiveSelectionData(
                state.malaria.theme,
                state.malaria.selection,
                state.invasive.filteredStudies
            );

            return of(setSelectionData(null), setSelectionData(selectionData));
        })
    );
