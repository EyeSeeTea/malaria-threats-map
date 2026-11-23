import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import { ActionTypeEnum } from "../../actions";
import { Observable, of } from "rxjs";
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import { AnyAction } from "redux";
import {
    fetchInvasiveStudiesError,
    fetchInvasiveStudiesRequest,
    fetchInvasiveStudiesSuccess,
    setInvasiveDisease,
    setInvasiveFilteredStudiesAction,
    setInvasiveMapType,
    setInvasiveVectorSpecies,
} from "../../actions/invasive-actions";
import {
    setFiltersAction,
    setThemeAction,
    logPageViewAction,
    setSelection,
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
import { diseaseSwitches } from "../common/diseaseSwitches";
import { getDiseaseToSelect } from "../common/initialDisease";
import { getStudiesForYearRange } from "../common/yearRange";
import { selectInvasiveStudiesOfDefaultDisease } from "../../reducers/invasive-reducer";

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
                                minMaxYears: () =>
                                    getMinMaxYears(getStudiesForYearRange(studies, state.invasive.filters.disease)),
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

            // Data Download shows the studies of the default disease only, so its years come from them.
            const studies =
                $action.from === "download"
                    ? selectInvasiveStudiesOfDefaultDisease($state)
                    : getStudiesForYearRange($state.invasive.studies, $state.invasive.filters.disease);
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

export const setInitialInvasiveDiseaseEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchInvasiveStudiesSuccess, ActionTypeEnum.SetInvasiveDisease),
        withLatestFrom(state$),
        map(([, state]) => getDiseaseToSelect(state.invasive.filters.disease, state.invasive.studies)),
        filter((disease): disease is string => disease !== undefined),
        map(disease => setInvasiveDisease(disease))
    );

/** On a disease switch, empties the species and closes the side panel: the selected site may be of the other disease. */
export const resetInvasiveFiltersOnDiseaseSwitchEpic = (action$: Observable<ActionType<typeof setInvasiveDisease>>) =>
    diseaseSwitches(
        action$.pipe(
            ofType(ActionTypeEnum.SetInvasiveDisease),
            map(action => action.payload)
        )
    ).pipe(switchMap(() => of(setInvasiveVectorSpecies([]), setSelection(null))));

/**
 * The year range of the map when its disease is set or switched, from the studies of that disease, as
 * loading the studies computes it: it changes only when the first year changes, so with malaria nothing moves.
 */
export const setInvasiveYearRangeOfDiseaseEpic = (
    action$: Observable<ActionType<typeof setInvasiveDisease>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetInvasiveDisease),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            const studies = getStudiesForYearRange(state.invasive.studies, state.invasive.filters.disease);
            const dateResets =
                studies.length > 0
                    ? resetDatesRequired({ minMaxYears: () => getMinMaxYears(studies), theme: "invasive", state })
                    : [];

            return of(...dateResets);
        })
    );
