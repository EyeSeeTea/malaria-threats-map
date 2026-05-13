import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import _ from "lodash";
import { ActionTypeEnum } from "../../actions";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, mergeMap, skip, switchMap, withLatestFrom } from "rxjs/operators";

import {
    buildPreventionStudiesEpic,
    createPreventionSelectionData,
    getStudiesByMapType,
    REQUESTED_VIR_START_DATE,
} from "./utils";
import { PreventionMapType, State } from "../../types";
import { EpicDependencies } from "../..";
import { fromFuture } from "../utils";
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
    fetchResistanceIntensityTypeStudiesSuccess,
    fetchResistanceMechanismTypeStudiesSuccess,
    fetchResistanceStatusTypeStudiesSuccess,
    fetchSynergistEffectTypeStudiesSuccess,
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

export const fetchAllPreventionStudiesEpic = (
    action$: Observable<ActionType<typeof fetchPreventionStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchPreventionStudiesRequest),
        withLatestFrom(state$),
        switchMap(([, state]) => {
            const api = compositionRoot.prevention;

            return forkJoin({
                status: fromFuture(api.getResistanceStatusTypeStudies()),
                intensity: fromFuture(api.getResistanceIntensityTypeStudies()),
                mechanism: fromFuture(api.getResistanceMechanismTypeStudies()),
                synergist: fromFuture(api.getSynergistEffectTypeStudies()),
            }).pipe(
                mergeMap(({ status, intensity, mechanism, synergist }) => {
                    const allStudies = [...status, ...intensity, ...mechanism, ...synergist];

                    return of(
                        ...resetDatesRequired({
                            minMaxYears: () => getMinMaxYears(allStudies),
                            theme: "prevention",
                            state,
                            filterStart: REQUESTED_VIR_START_DATE,
                        }),
                        fetchResistanceStatusTypeStudiesSuccess(status),
                        fetchResistanceIntensityTypeStudiesSuccess(intensity),
                        fetchResistanceMechanismTypeStudiesSuccess(mechanism),
                        fetchSynergistEffectTypeStudiesSuccess(synergist)
                    );
                }),
                catchError((error: Error) => of(addNotificationAction(error.message), fetchPreventionStudiesError()))
            );
        })
    );

export const getResistanceStatusTypeStudiesEpic = buildPreventionStudiesEpic(
    ActionTypeEnum.FetchResistanceStatusTypeStudiesRequest,
    PreventionMapType.RESISTANCE_STATUS,
    [PreventionMapType.INTENSITY_STATUS, PreventionMapType.RESISTANCE_MECHANISM, PreventionMapType.LEVEL_OF_INVOLVEMENT]
);

export const getResistanceIntensityTypeStudiesEpic = buildPreventionStudiesEpic(
    ActionTypeEnum.FetchResistanceIntensityTypeStudiesRequest,
    PreventionMapType.INTENSITY_STATUS,
    [
        PreventionMapType.RESISTANCE_STATUS,
        PreventionMapType.RESISTANCE_MECHANISM,
        PreventionMapType.LEVEL_OF_INVOLVEMENT,
    ]
);

export const getResistanceMechanismTypeStudiesEpic = buildPreventionStudiesEpic(
    ActionTypeEnum.FetchResistanceMechanismTypeStudiesRequest,
    PreventionMapType.RESISTANCE_MECHANISM,
    [PreventionMapType.RESISTANCE_STATUS, PreventionMapType.INTENSITY_STATUS, PreventionMapType.LEVEL_OF_INVOLVEMENT]
);

export const getSynergistEffectTypeStudiesEpic = buildPreventionStudiesEpic(
    ActionTypeEnum.FetchSynergistEffectTypeStudiesRequest,
    PreventionMapType.LEVEL_OF_INVOLVEMENT,
    [PreventionMapType.RESISTANCE_STATUS, PreventionMapType.INTENSITY_STATUS, PreventionMapType.RESISTANCE_MECHANISM]
);

export const setPreventionMapTypeEpic = (
    action$: Observable<ActionType<typeof setPreventionMapType>>,
    state$: StateObservable<State>
) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetPreventionMapType),
        withLatestFrom(state$),
        switchMap(([action, state]) => {
            const pageView = getAnalyticsPageView({ page: "prevention", section: action.payload });
            const logPageView = logPageViewAction(pageView);

            const studiesByMapType = {
                [PreventionMapType.RESISTANCE_STATUS]: state.prevention.resistanceStatusStudies,
                [PreventionMapType.INTENSITY_STATUS]: state.prevention.resistanceIntensityStudies,
                [PreventionMapType.RESISTANCE_MECHANISM]: state.prevention.resistanceMechanismStudies,
                [PreventionMapType.LEVEL_OF_INVOLVEMENT]: state.prevention.synergistEffectStudies,
            };

            const studies = studiesByMapType[action.payload] ?? [];
            const dateResets =
                studies.length > 0
                    ? resetDatesRequired({
                          minMaxYears: () => getMinMaxYears(studies),
                          theme: "prevention",
                          state,
                          filterStart: REQUESTED_VIR_START_DATE,
                      })
                    : [];

            if (action.payload === PreventionMapType.RESISTANCE_MECHANISM) {
                return of(..._.compact([...dateResets, setType(["MONO_OXYGENASES"]), logPageView]));
            } else if (action.payload === PreventionMapType.INTENSITY_STATUS) {
                return of(..._.compact([...dateResets, setType(undefined), logPageView]));
            } else if (action.payload === PreventionMapType.RESISTANCE_STATUS) {
                return of(..._.compact([...dateResets, setType(undefined), logPageView]));
            } else if (action.payload === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
                return of(..._.compact([...dateResets, setProxyType("MONO_OXYGENASES"), logPageView]));
            } else {
                return of(..._.compact([...dateResets, setType(undefined), logPageView]));
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
            const mapType = state.prevention.filters.mapType;
            const nonFilteredStudies = getStudiesByMapType(state, mapType);

            const selectionData = createPreventionSelectionData(
                state.malaria.theme,
                state.prevention.filters.mapType,
                state.malaria.selection,
                state.prevention.filteredStudies,
                nonFilteredStudies
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
                const mapType = $state.prevention.filters.mapType;
                const mapTypeStudies = getStudiesByMapType($state, mapType);

                const [start, end] = getMinMaxYears(mapTypeStudies);

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
                const mapType = $state.prevention.filters.mapType;
                const mapTypeStudies = getStudiesByMapType($state, mapType);

                const [start, end] = getMinMaxYears(mapTypeStudies);
                const base: unknown[] = mapTypeStudies?.length
                    ? [setMaxMinYearsAction([start, end]), setFiltersAction([REQUESTED_VIR_START_DATE, end])]
                    : [];

                return of(...base, setInsecticideClass("PYRETHROIDS"));
            } else {
                return of(setInsecticideClass(null));
            }
        })
    );
