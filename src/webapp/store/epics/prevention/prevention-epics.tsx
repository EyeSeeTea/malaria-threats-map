import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import _ from "lodash";
import { ActionTypeEnum } from "../../actions";
import { EMPTY, forkJoin, merge, Observable, of } from "rxjs";
import { catchError, filter, map, mergeMap, skip, switchMap, withLatestFrom } from "rxjs/operators";

import { createPreventionSelectionData } from "./utils";
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
    fetchResistanceIntensityTypeStudiesError,
    fetchResistanceIntensityTypeStudiesRequest,
    fetchResistanceIntensityTypeStudiesSuccess,
    fetchResistanceMechanismTypeStudiesError,
    fetchResistanceMechanismTypeStudiesRequest,
    fetchResistanceMechanismTypeStudiesSuccess,
    fetchResistanceStatusTypeStudiesError,
    fetchResistanceStatusTypeStudiesRequest,
    fetchResistanceStatusTypeStudiesSuccess,
    fetchSynergistEffectTypeStudiesError,
    fetchSynergistEffectTypeStudiesRequest,
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
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { FutureData } from "../../../../domain/common/FutureData";
import { CompositionRoot } from "../../../../CompositionRoot";

const REQUESTED_VIR_START_DATE = 2010;

type Action =
    | ActionType<typeof fetchResistanceStatusTypeStudiesSuccess>
    | ActionType<typeof fetchResistanceStatusTypeStudiesError>
    | ActionType<typeof fetchResistanceIntensityTypeStudiesSuccess>
    | ActionType<typeof fetchResistanceIntensityTypeStudiesError>
    | ActionType<typeof fetchResistanceMechanismTypeStudiesSuccess>
    | ActionType<typeof fetchResistanceMechanismTypeStudiesError>
    | ActionType<typeof fetchSynergistEffectTypeStudiesSuccess>
    | ActionType<typeof fetchSynergistEffectTypeStudiesError>
    | ActionType<typeof addNotificationAction>
    | ActionType<typeof setFiltersAction>
    | ActionType<typeof setMaxMinYearsAction>;

type StudyConfig = {
    studies: PreventionStudy[];
    error: string | null;
    fetchStudies: () => FutureData<PreventionStudy[]>;
    onSuccess: (studies: PreventionStudy[]) => Action;
    onError: () => Action;
};

const getStudyConfigs = (api: CompositionRoot["prevention"], state: State): Record<PreventionMapType, StudyConfig> => ({
    [PreventionMapType.RESISTANCE_STATUS]: {
        studies: state.prevention.resistanceStatusStudies,
        error: state.prevention.errorResistanceStatus,
        fetchStudies: () => api.getResistanceStatusTypeStudies(),
        onSuccess: fetchResistanceStatusTypeStudiesSuccess,
        onError: fetchResistanceStatusTypeStudiesError,
    },
    [PreventionMapType.INTENSITY_STATUS]: {
        studies: state.prevention.resistanceIntensityStudies,
        error: state.prevention.errorResistanceIntensity,
        fetchStudies: () => api.getResistanceIntensityTypeStudies(),
        onSuccess: fetchResistanceIntensityTypeStudiesSuccess,
        onError: fetchResistanceIntensityTypeStudiesError,
    },
    [PreventionMapType.RESISTANCE_MECHANISM]: {
        studies: state.prevention.resistanceMechanismStudies,
        error: state.prevention.errorResistanceMechanism,
        fetchStudies: () => api.getResistanceMechanismTypeStudies(),
        onSuccess: fetchResistanceMechanismTypeStudiesSuccess,
        onError: fetchResistanceMechanismTypeStudiesError,
    },
    [PreventionMapType.LEVEL_OF_INVOLVEMENT]: {
        studies: state.prevention.synergistEffectStudies,
        error: state.prevention.errorSynergistEffect,
        fetchStudies: () => api.getSynergistEffectTypeStudies(),
        onSuccess: fetchSynergistEffectTypeStudiesSuccess,
        onError: fetchSynergistEffectTypeStudiesError,
    },
});

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

const buildPrimaryStream$ = (config: StudyConfig, state: State): Observable<Action> =>
    fromFuture(config.fetchStudies()).pipe(
        mergeMap(studies =>
            of(
                ...resetDatesRequired({
                    minMaxYears: () => getMinMaxYears(studies),
                    theme: "prevention",
                    state,
                    filterStart: REQUESTED_VIR_START_DATE,
                }),
                config.onSuccess(studies)
            )
        ),
        catchError((error: Error) => of(addNotificationAction(error.message), config.onError()))
    );

const buildSecondaryStream$ = (config: StudyConfig): Observable<Action> =>
    config.studies.length === 0 && !config.error
        ? fromFuture(config.fetchStudies()).pipe(
              map(studies => config.onSuccess(studies)),
              catchError((error: Error) => of(addNotificationAction(error.message), config.onError()))
          )
        : EMPTY;

export const getResistanceStatusTypeStudiesEpic = (
    action$: Observable<ActionType<typeof fetchResistanceStatusTypeStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchResistanceStatusTypeStudiesRequest),
        withLatestFrom(state$),
        filter(
            ([, state]) =>
                state.prevention.resistanceStatusStudies.length === 0 && !state.prevention.errorResistanceStatus
        ),
        switchMap(([, state]) => {
            const api = compositionRoot.prevention;

            const loadStatus$ = buildPrimaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_STATUS],
                state
            );

            const loadIntensity$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.INTENSITY_STATUS]
            );

            const loadMechanism$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_MECHANISM]
            );

            const loadSynergist$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.LEVEL_OF_INVOLVEMENT]
            );

            return merge(loadStatus$, loadIntensity$, loadMechanism$, loadSynergist$);
        })
    );

export const getResistanceIntensityTypeStudiesEpic = (
    action$: Observable<ActionType<typeof fetchResistanceIntensityTypeStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchResistanceIntensityTypeStudiesRequest),
        withLatestFrom(state$),
        filter(
            ([, state]) =>
                state.prevention.resistanceIntensityStudies.length === 0 && !state.prevention.errorResistanceIntensity
        ),
        switchMap(([, state]) => {
            const api = compositionRoot.prevention;

            const loadIntensity$ = buildPrimaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.INTENSITY_STATUS],
                state
            );

            const loadStatus$ = buildSecondaryStream$(getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_STATUS]);

            const loadMechanism$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_MECHANISM]
            );

            const loadSynergist$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.LEVEL_OF_INVOLVEMENT]
            );

            return merge(loadIntensity$, loadStatus$, loadMechanism$, loadSynergist$);
        })
    );

export const getResistanceMechanismTypeStudiesEpic = (
    action$: Observable<ActionType<typeof fetchResistanceMechanismTypeStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchResistanceMechanismTypeStudiesRequest),
        withLatestFrom(state$),
        filter(
            ([, state]) =>
                state.prevention.resistanceMechanismStudies.length === 0 && !state.prevention.errorResistanceMechanism
        ),
        switchMap(([, state]) => {
            const api = compositionRoot.prevention;

            const loadMechanism$ = buildPrimaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_MECHANISM],
                state
            );

            const loadStatus$ = buildSecondaryStream$(getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_STATUS]);

            const loadIntensity$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.INTENSITY_STATUS]
            );

            const loadSynergist$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.LEVEL_OF_INVOLVEMENT]
            );

            return merge(loadMechanism$, loadStatus$, loadIntensity$, loadSynergist$);
        })
    );

export const getSynergistEffectTypeStudiesEpic = (
    action$: Observable<ActionType<typeof fetchSynergistEffectTypeStudiesRequest>>,
    state$: StateObservable<State>,
    { compositionRoot }: EpicDependencies
) =>
    action$.pipe(
        ofType(ActionTypeEnum.FetchSynergistEffectTypeStudiesRequest),
        withLatestFrom(state$),
        filter(
            ([, state]) =>
                state.prevention.synergistEffectStudies.length === 0 && !state.prevention.errorSynergistEffect
        ),
        switchMap(([, state]) => {
            const api = compositionRoot.prevention;

            const loadSynergist$ = buildPrimaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.LEVEL_OF_INVOLVEMENT],
                state
            );

            const loadStatus$ = buildSecondaryStream$(getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_STATUS]);

            const loadIntensity$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.INTENSITY_STATUS]
            );

            const loadMechanism$ = buildSecondaryStream$(
                getStudyConfigs(api, state)[PreventionMapType.RESISTANCE_MECHANISM]
            );

            return merge(loadSynergist$, loadStatus$, loadIntensity$, loadMechanism$);
        })
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
                    ? [setMaxMinYearsAction([start, end]), setFiltersAction([REQUESTED_VIR_START_DATE, end])]
                    : [];

                return of(...base, setInsecticideClass("PYRETHROIDS"));
            } else {
                return of(setInsecticideClass(null));
            }
        })
    );
