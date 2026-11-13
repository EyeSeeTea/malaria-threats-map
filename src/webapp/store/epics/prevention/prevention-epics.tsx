import { ofType, StateObservable } from "redux-observable";
import { ActionType } from "typesafe-actions";
import _ from "lodash";
import { ActionTypeEnum } from "../../actions";
import { Observable, of } from "rxjs";
import { filter, map, skip, switchMap, withLatestFrom } from "rxjs/operators";
import { AnyAction } from "redux";

import {
    buildPreventionStudiesEpic,
    createPreventionSelectionData,
    getStudiesByMapType,
    REQUESTED_VIR_START_DATE,
} from "./utils";
import { PreventionMapType, State } from "../../types";
import { getAnalyticsPageView } from "../../analytics";
import {
    assayTypes,
    getAssayTypesDetecting,
    getInvolvementMechanisms,
    getMechanismOptions,
} from "../../../../domain/entities/ResistanceMechanism";
import { getSelectableInsecticideClasses } from "../../../../domain/entities/InsecticideClass";
import _c from "../../../../domain/entities/generic/Collection";
import {
    belongsToDisease,
    checksOptionsOnMapChange,
    getInitialDisease,
    pickOption,
} from "../../../../domain/entities/Disease";
import {
    logEventAction,
    logPageViewAction,
    setFiltersAction,
    setMaxMinYearsAction,
    setSelectionData,
    setThemeAction,
} from "../../actions/base-actions";
import {
    setAssayTypes,
    setInsecticideClass,
    setInsecticideTypes,
    setPreventionDisease,
    setPreventionFilteredStudies,
    setPreventionMapType,
    setProxyType,
    setSpecies,
    setSynergistTypes,
    setType,
} from "../../actions/prevention-actions";
import { getMinMaxYears } from "../../../../domain/entities/Study";
import { resetDatesRequired } from "../common/utils";
import { diseaseSwitches } from "../common/diseaseSwitches";
import { selectPreventionStudies } from "../../reducers/prevention-reducer";
import { selectProxyTypes } from "../../reducers/translations-reducer";
import { Translation } from "../../../types/Translation";

const defaultInsecticideClass = "PYRETHROIDS";
const defaultMechanism = "MONO_OXYGENASES";

const preventionStudiesLoaded = [
    ActionTypeEnum.FetchResistanceStatusTypeStudiesSuccess,
    ActionTypeEnum.FetchResistanceIntensityTypeStudiesSuccess,
    ActionTypeEnum.FetchResistanceMechanismTypeStudiesSuccess,
    ActionTypeEnum.FetchSynergistEffectTypeStudiesSuccess,
] as const;

type DiseaseOptions = Readonly<{
    insecticideClasses: ReadonlyArray<string>;
    mechanisms: ReadonlyArray<string>;
    proxyTypes: ReadonlyArray<string>;
}>;

/** The options the filters of a map offer for the chosen disease, as the filters compute them. */
function getDiseaseOptions(state: State, mapType: PreventionMapType): DiseaseOptions {
    const { disease } = state.prevention.filters;
    const studies = getStudiesByMapType(state, mapType).filter(study => belongsToDisease(disease, study));
    const proxyTranslations: ReadonlyArray<Translation> = selectProxyTypes(state);
    const translatedProxyTypes = proxyTranslations.map(translation => translation.VALUE_);

    return {
        insecticideClasses: getSelectableInsecticideClasses(
            _c(studies)
                .map(study => study.INSECTICIDE_CLASS)
                .uniq()
                .toArray()
        ),
        mechanisms: getMechanismOptions(studies.map(study => study.TYPE)),
        proxyTypes: getInvolvementMechanisms(translatedProxyTypes, studies),
    };
}

type MapChangeValues = Readonly<{
    mechanism: string;
    proxyType: string;
    insecticideClass: ActionType<typeof setInsecticideClass> | null;
}>;

/**
 * What a map change sets for the mechanism and the class. With malaria, or no disease, what it set
 * before the disease filter: the default mechanism, and the class untouched. With another disease,
 * the same values checked against the options of the new map for that disease.
 */
function getMapChangeValues(state: State, mapType: PreventionMapType): MapChangeValues {
    const { disease, insecticideClass } = state.prevention.filters;
    if (!checksOptionsOnMapChange(disease)) {
        return { mechanism: defaultMechanism, proxyType: defaultMechanism, insecticideClass: null };
    }

    const options = getDiseaseOptions(state, mapType);
    const checkedClass = pickOption(options.insecticideClasses, defaultInsecticideClass, insecticideClass);

    return {
        mechanism: pickOption(options.mechanisms, defaultMechanism),
        proxyType: pickOption(options.proxyTypes, defaultMechanism),
        insecticideClass: checkedClass === insecticideClass ? null : setInsecticideClass(checkedClass),
    };
}

/**
 * The top filter of the current map after a disease switch. The existing chain then empties the
 * filters below it: class, insecticide types, test type or mechanism, species. On Resistance
 * mechanisms the class is left alone, because the chain would empty the mechanism; the map change
 * checks it later.
 */
function getActionsAfterDiseaseSwitch(state: State): ReadonlyArray<AnyAction> {
    const { mapType } = state.prevention.filters;
    const options = getDiseaseOptions(state, mapType);
    const emptySynergistTypes = setSynergistTypes([]);
    const insecticideClass = setInsecticideClass(pickOption(options.insecticideClasses, defaultInsecticideClass));

    switch (mapType) {
        case PreventionMapType.RESISTANCE_MECHANISM:
            return [emptySynergistTypes, setType([pickOption(options.mechanisms, defaultMechanism)])];
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return [
                emptySynergistTypes,
                setProxyType(pickOption(options.proxyTypes, defaultMechanism)),
                insecticideClass,
            ];
        default:
            return [emptySynergistTypes, insecticideClass];
    }
}

export const fetchAllPreventionStudiesEpic = buildPreventionStudiesEpic(
    ActionTypeEnum.FetchPreventionStudiesRequest,
    PreventionMapType.RESISTANCE_STATUS,
    [PreventionMapType.INTENSITY_STATUS, PreventionMapType.RESISTANCE_MECHANISM, PreventionMapType.LEVEL_OF_INVOLVEMENT]
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

            const studies = getStudiesByMapType(state, action.payload);
            const dateResets =
                studies.length > 0
                    ? resetDatesRequired({
                          minMaxYears: () => getMinMaxYears(studies),
                          theme: "prevention",
                          state,
                          filterStart: REQUESTED_VIR_START_DATE,
                      })
                    : [];

            const mapChange = getMapChangeValues(state, action.payload);

            if (action.payload === PreventionMapType.RESISTANCE_MECHANISM) {
                return of(..._.compact([...dateResets, setType([mapChange.mechanism]), logPageView]));
            } else if (action.payload === PreventionMapType.INTENSITY_STATUS) {
                return of(..._.compact([...dateResets, setType(undefined), mapChange.insecticideClass, logPageView]));
            } else if (action.payload === PreventionMapType.RESISTANCE_STATUS) {
                return of(..._.compact([...dateResets, setType(undefined), mapChange.insecticideClass, logPageView]));
            } else if (action.payload === PreventionMapType.LEVEL_OF_INVOLVEMENT) {
                return of(
                    ..._.compact([
                        ...dateResets,
                        setProxyType(mapChange.proxyType),
                        mapChange.insecticideClass,
                        logPageView,
                    ])
                );
            } else {
                return of(..._.compact([...dateResets, setType(undefined), logPageView]));
            }
        })
    );

export const setPreventionTypeEpic = (action$: Observable<ActionType<typeof setType>>) =>
    action$.pipe(
        ofType(ActionTypeEnum.SetType),
        switchMap(action => {
            // Only the first mechanism counts. An unknown one, or none, selects every assay type.
            const detecting = getAssayTypesDetecting(action.payload?.[0]) ?? assayTypes;
            return of(setAssayTypes([...detecting]));
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

export const setInitialPreventionDiseaseEpic = (action$: Observable<AnyAction>, state$: StateObservable<State>) =>
    action$.pipe(
        ofType(...preventionStudiesLoaded, ActionTypeEnum.SetPreventionDisease),
        withLatestFrom(state$),
        filter(([, state]) => state.prevention.filters.disease === undefined),
        map(([, state]) => getInitialDisease(selectPreventionStudies(state))),
        filter((disease): disease is string => disease !== undefined),
        map(disease => setPreventionDisease(disease))
    );

export const resetPreventionFiltersOnDiseaseSwitchEpic = (
    action$: Observable<ActionType<typeof setPreventionDisease>>,
    state$: StateObservable<State>
) =>
    diseaseSwitches(
        action$.pipe(
            ofType(ActionTypeEnum.SetPreventionDisease),
            map(action => action.payload)
        )
    ).pipe(
        withLatestFrom(state$),
        switchMap(([, state]) => of(...getActionsAfterDiseaseSwitch(state)))
    );
