import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import _ from "lodash";
import { ActionTypeEnum } from "../../actions";
import { Observable, of } from "rxjs";
import { catchError, mergeMap, skip, switchMap, withLatestFrom } from "rxjs/operators";

import { createPreventionSelectionData } from "./utils";
import { PreventionMapType, State } from "../../types";
import { EpicDependencies } from "../..";
import { fromFuture } from "../utils";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { getAnalyticsPageView } from "../../analytics";
import { addNotificationAction } from "../../actions/notifier-actions";
import { ASSAY_TYPES } from "../../../components/filters/AssayTypeCheckboxFilter";
import {
    logEventAction,
    logPageViewAction,
    setFiltersAction,
    setMaxMinYearsAction,
    setSelectionData,
    setThemeAction,
} from "../../actions/base-actions";
import {
    fetchPreventionStudiesError,
    fetchPreventionStudiesRequest,
    fetchPreventionStudiesSuccess,
    setAssayTypes,
    setInsecticideClass,
    setInsecticideTypes,
    setPreventionFilteredStudies,
    setPreventionMapType,
    setProxyType,
    setSpecies,
    setType,
} from "../../actions/prevention-actions";
import { getMinMaxYears } from "../../../../domain/entities/Study";
import { resetDatesRequired } from "../common/utils";
const requestedVIRStartDate = 2010;

export const getPreventionStudiesEpic = (
    action$: Observable<ActionType<typeof fetchPreventionStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchPreventionStudiesRequest),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            if (state.prevention.studies.length === 0 && !state.prevention.error) {
                return fromFuture(compositionRoot.prevention.getStudies()).pipe(
                    mergeMap((studies: PreventionStudy[]) => {
                        return of(
                            ...resetDatesRequired({
                                minMaxYears: () => getMinMaxYears(studies),
                                theme: "prevention",
                                state,
                                filterStart: requestedVIRStartDate,
                            }),
                            fetchPreventionStudiesSuccess(studies)
                        );
                    }),
                    catchError((error: Error) =>
                        of(addNotificationAction(error.message), fetchPreventionStudiesError())
                    )
                );
            } else {
                return of(fetchPreventionStudiesSuccess(state.prevention.studies));
            }
        })
    );

export const setPreventionMapTypeEpic = (
    action$: Observable<ActionType<typeof setPreventionMapType>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetPreventionMapType),
        withLatestFrom(state$),
        switchMap(([action, _state]) => {
            const pageView = getAnalyticsPageView({ page: "prevention", section: action.payload });

            const logPageView = logPageViewAction(pageView);

            if (action.payload === PreventionMapType.RESISTANCE_MECHANISM) {
                return of(..._.compact([setType(["MONO_OXYGENASES"]), logPageView]));
            } else if (action.payload === PreventionMapType.INTENSITY_STATUS) {
                return of(..._.compact([setType(undefined), logPageView]));
            } else if (action.payload === PreventionMapType.RESISTANCE_STATUS) {
                return of(..._.compact([setType(undefined), logPageView]));
            } else if (action.payload === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
                return of(..._.compact([setProxyType("MONO_OXYGENASES"), logPageView]));
            } else {
                return of(..._.compact([setType(undefined), logPageView]));
            }
        })
    );

export const setPreventionTypeEpic = (action$: Observable<ActionType<typeof setType>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetType),
        switchMap(action => {
            const kdr = ["KDR_L1014S", "KDR_L1014F", "KDR_(MUTATION_UNSPECIFIED)"];
            if (action.payload && kdr.includes(action.payload[0])) {
                return of(setAssayTypes([ASSAY_TYPES[0]]));
            } else if (action.payload && ["ACE1R"].includes(action.payload[0])) {
                return of(setAssayTypes([ASSAY_TYPES[0], ASSAY_TYPES[1]]));
            } else {
                return of(setAssayTypes(ASSAY_TYPES));
            }
        })
    );

export const setPreventionInsecticideClassEpic = (
    action$: Observable<ActionType<typeof setInsecticideClass>>,
    state$: StateObservable<State>
) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetInsecticideClass),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const isTourOpen = state.malaria.tour.open;
            const actions = _.compact([
                setInsecticideTypes([]),
                setType(state.prevention.filters.type ? [state.prevention.filters.type[0]] : ["MONO_OXYGENASES"]),
                setSpecies([]),
                isTourOpen
                    ? null
                    : logEventAction({ category: "filter", action: "insecticideClass", label: action.payload }),
            ]);
            return of(...actions);
        })
    );

export const setPreventionInsecticideTypeEpic = (action$: Observable<ActionType<typeof setInsecticideTypes>>) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetInsecticideTypes),
        switchMap(() => {
            const actions: any[] = [setType(undefined), setSpecies([])];
            return of(...actions);
        })
    );

export const setPreventionTypeResetEpic = (action$: Observable<ActionType<typeof setType>>) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetType),
        switchMap(_action => {
            return of(setSpecies([]));
        })
    );

export const setPreventionFilteredStudiesEpic = (
    action$: Observable<ActionType<typeof setPreventionFilteredStudies>>,
    state$: StateObservable<State>
) =>
    action$.pipe(skip(1)).pipe(
        ofType(ActionTypeEnum.SetPreventionFilteredStudies),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            const selectionData = createPreventionSelectionData(
                state.malaria.theme,
                state.prevention.filters.mapType,
                state.malaria.selection,
                state.prevention.filteredStudies,
                state.prevention.studies
            );

            return of(setSelectionData(null), setSelectionData(selectionData));
        })
    );

export const setYearsFiltersEpic = (
    action$: Observable<ActionType<typeof setFiltersAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetFilters),
        withLatestFrom(state$),
        switchMap(([$action, $state]) => {
            if ($action.payload === undefined && $state.malaria.theme === "prevention") {
                const [start, end] = getMinMaxYears($state.prevention.studies);

                return of(setMaxMinYearsAction([start, end]), setFiltersAction([start, end]));
            } else {
                return of();
            }
        })
    );

export const setPreventionThemeEpic = (
    action$: Observable<ActionType<typeof setThemeAction>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.MalariaSetTheme),
        withLatestFrom(state$),
        switchMap(([$action, $state]) => {
            if ($action.payload !== "prevention") {
                return of();
            }

            if ($action.from === "map") {
                const [start, end] = getMinMaxYears($state.prevention.studies);
                const base: unknown[] = $state.prevention.studies?.length
                    ? [setMaxMinYearsAction([start, end]), setFiltersAction([requestedVIRStartDate, end])]
                    : [];

                return of(...base, setInsecticideClass("PYRETHROIDS"));
            } else {
                return of(setInsecticideClass(null));
            }
        })
    );
