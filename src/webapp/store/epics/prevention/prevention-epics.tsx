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
const requestedVIRStartDate = 2010;

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
                            filterStart: requestedVIRStartDate,
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

            const loadStatus$ = fromFuture(api.getResistanceStatusTypeStudies()).pipe(
                mergeMap(studies =>
                    of(
                        ...resetDatesRequired({
                            minMaxYears: () => getMinMaxYears(studies),
                            theme: "prevention",
                            state,
                            filterStart: requestedVIRStartDate,
                        }),
                        fetchResistanceStatusTypeStudiesSuccess(studies)
                    )
                ),
                catchError((error: Error) =>
                    of(addNotificationAction(error.message), fetchResistanceStatusTypeStudiesError())
                )
            );

            const loadIntensity$ =
                state.prevention.resistanceIntensityStudies.length === 0 && !state.prevention.errorResistanceIntensity
                    ? fromFuture(api.getResistanceIntensityTypeStudies()).pipe(
                          map(studies => fetchResistanceIntensityTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceIntensityTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadMechanism$ =
                state.prevention.resistanceMechanismStudies.length === 0 && !state.prevention.errorResistanceMechanism
                    ? fromFuture(api.getResistanceMechanismTypeStudies()).pipe(
                          map(studies => fetchResistanceMechanismTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceMechanismTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadSynergist$ =
                state.prevention.synergistEffectStudies.length === 0 && !state.prevention.errorSynergistEffect
                    ? fromFuture(api.getSynergistEffectTypeStudies()).pipe(
                          map(studies => fetchSynergistEffectTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchSynergistEffectTypeStudiesError())
                          )
                      )
                    : EMPTY;

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

            const loadIntensity$ = fromFuture(api.getResistanceIntensityTypeStudies()).pipe(
                mergeMap(studies =>
                    of(
                        ...resetDatesRequired({
                            minMaxYears: () => getMinMaxYears(studies),
                            theme: "prevention",
                            state,
                            filterStart: requestedVIRStartDate,
                        }),
                        fetchResistanceIntensityTypeStudiesSuccess(studies)
                    )
                ),
                catchError((error: Error) =>
                    of(addNotificationAction(error.message), fetchResistanceIntensityTypeStudiesError())
                )
            );

            const loadStatus$ =
                state.prevention.resistanceStatusStudies.length === 0 && !state.prevention.errorResistanceStatus
                    ? fromFuture(api.getResistanceStatusTypeStudies()).pipe(
                          map(studies => fetchResistanceStatusTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceStatusTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadMechanism$ =
                state.prevention.resistanceMechanismStudies.length === 0 && !state.prevention.errorResistanceMechanism
                    ? fromFuture(api.getResistanceMechanismTypeStudies()).pipe(
                          map(studies => fetchResistanceMechanismTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceMechanismTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadSynergist$ =
                state.prevention.synergistEffectStudies.length === 0 && !state.prevention.errorSynergistEffect
                    ? fromFuture(api.getSynergistEffectTypeStudies()).pipe(
                          map(studies => fetchSynergistEffectTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchSynergistEffectTypeStudiesError())
                          )
                      )
                    : EMPTY;

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

            const loadMechanism$ = fromFuture(api.getResistanceMechanismTypeStudies()).pipe(
                mergeMap(studies =>
                    of(
                        ...resetDatesRequired({
                            minMaxYears: () => getMinMaxYears(studies),
                            theme: "prevention",
                            state,
                            filterStart: requestedVIRStartDate,
                        }),
                        fetchResistanceMechanismTypeStudiesSuccess(studies)
                    )
                ),
                catchError((error: Error) =>
                    of(addNotificationAction(error.message), fetchResistanceMechanismTypeStudiesError())
                )
            );

            const loadStatus$ =
                state.prevention.resistanceStatusStudies.length === 0 && !state.prevention.errorResistanceStatus
                    ? fromFuture(api.getResistanceStatusTypeStudies()).pipe(
                          map(studies => fetchResistanceStatusTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceStatusTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadIntensity$ =
                state.prevention.resistanceIntensityStudies.length === 0 && !state.prevention.errorResistanceIntensity
                    ? fromFuture(api.getResistanceIntensityTypeStudies()).pipe(
                          map(studies => fetchResistanceIntensityTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceIntensityTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadSynergist$ =
                state.prevention.synergistEffectStudies.length === 0 && !state.prevention.errorSynergistEffect
                    ? fromFuture(api.getSynergistEffectTypeStudies()).pipe(
                          map(studies => fetchSynergistEffectTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchSynergistEffectTypeStudiesError())
                          )
                      )
                    : EMPTY;

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

            const loadSynergist$ = fromFuture(api.getSynergistEffectTypeStudies()).pipe(
                mergeMap(studies =>
                    of(
                        ...resetDatesRequired({
                            minMaxYears: () => getMinMaxYears(studies),
                            theme: "prevention",
                            state,
                            filterStart: requestedVIRStartDate,
                        }),
                        fetchSynergistEffectTypeStudiesSuccess(studies)
                    )
                ),
                catchError((error: Error) =>
                    of(addNotificationAction(error.message), fetchSynergistEffectTypeStudiesError())
                )
            );

            const loadStatus$ =
                state.prevention.resistanceStatusStudies.length === 0 && !state.prevention.errorResistanceStatus
                    ? fromFuture(api.getResistanceStatusTypeStudies()).pipe(
                          map(studies => fetchResistanceStatusTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceStatusTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadIntensity$ =
                state.prevention.resistanceIntensityStudies.length === 0 && !state.prevention.errorResistanceIntensity
                    ? fromFuture(api.getResistanceIntensityTypeStudies()).pipe(
                          map(studies => fetchResistanceIntensityTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceIntensityTypeStudiesError())
                          )
                      )
                    : EMPTY;

            const loadMechanism$ =
                state.prevention.resistanceMechanismStudies.length === 0 && !state.prevention.errorResistanceMechanism
                    ? fromFuture(api.getResistanceMechanismTypeStudies()).pipe(
                          map(studies => fetchResistanceMechanismTypeStudiesSuccess(studies)),
                          catchError((error: Error) =>
                              of(addNotificationAction(error.message), fetchResistanceMechanismTypeStudiesError())
                          )
                      )
                    : EMPTY;

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
                          filterStart: requestedVIRStartDate,
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
                    ? [setMaxMinYearsAction([start, end]), setFiltersAction([requestedVIRStartDate, end])]
                    : [];

                return of(...base, setInsecticideClass("PYRETHROIDS"));
            } else {
                return of(setInsecticideClass(null));
            }
        })
    );
