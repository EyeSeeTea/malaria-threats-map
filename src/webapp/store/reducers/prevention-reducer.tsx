import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { PreventionDataset, PreventionFilters, PreventionMapType, PreventionState, State } from "../types";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";

const initialFilters: PreventionFilters = {
    mapType: PreventionMapType.RESISTANCE_STATUS,
    dataset: "DISCRIMINATING_CONCENTRATION_BIOASSAY",
    insecticideClass: null,
    insecticideTypes: [],
    synergistTypes: [],
    assayTypes: [],
    proxyType: null,
    type: null,
    species: [],
    onlyByHealthMinistries: false,
    onlyIncludeBioassaysWithMoreMosquitoes: 0,
};

const initialState: PreventionState = Object.freeze({
    studies: [],
    errorStudies: null,
    loadingStudies: false,

    resistanceStatusStudies: [],
    errorResistanceStatus: null,
    loadingResistanceStatus: false,

    resistanceIntensityStudies: [],
    errorResistanceIntensity: null,
    loadingResistanceIntensity: false,

    resistanceMechanismStudies: [],
    errorResistanceMechanism: null,
    loadingResistanceMechanism: false,

    synergistEffectStudies: [],
    errorSynergistEffect: null,
    loadingSynergistEffect: false,

    filteredStudies: [],
    filters: initialFilters,
    selectionStudies: [],
});

function updateFilter<T>(key: string, value: T, def?: T) {
    return (state: PreventionState) => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [key]: value || def,
            },
        };
    };
}

function updatePreventionMapType(mapType: PreventionMapType) {
    return updateFilter("mapType", mapType, PreventionMapType.RESISTANCE_STATUS);
}

function updatePreventionDataSet(dataset: PreventionDataset) {
    return updateFilter("dataset", dataset, "DISCRIMINATING_CONCENTRATION_BIOASSAY");
}

function updateInsecticideClass(insecticideClass: string) {
    return updateFilter("insecticideClass", insecticideClass);
}

function updateInsecticideTypes(insecticideTypes: string[]) {
    return updateFilter("insecticideTypes", insecticideTypes, []);
}

function updateType(type: string) {
    return updateFilter("type", type);
}

function updateProxyType(proxyType: string) {
    return updateFilter("proxyType", proxyType);
}

function updateSynergistTypes(synergistTypes: string[]) {
    return updateFilter("synergistTypes", synergistTypes, []);
}

function updateSpecies(species: string[]) {
    return updateFilter("species", species, []);
}

function updateAssayTypes(assayTypes: string[]) {
    return updateFilter("assayTypes", assayTypes, []);
}

function updateOnlyByHealthMinistries(value: boolean) {
    return updateFilter("onlyByHealthMinistries", value, false);
}

function updateOnlyIncludeBioassaysWithMoreMosquitoes(value: number) {
    return updateFilter("onlyIncludeBioassaysWithMoreMosquitoes", value, 0);
}

export default createReducer<PreventionState>(initialState, {
    [ActionTypeEnum.FetchPreventionStudiesRequest]: () => (state: PreventionState) => ({
        ...state,
        loadingStudies: true,
    }),
    [ActionTypeEnum.FetchPreventionStudiesError]: () => (state: PreventionState) => ({
        ...state,
        errorStudies: "There was a problem loading studies",
        loadingStudies: false,
    }),

    [ActionTypeEnum.FetchResistanceStatusTypeStudiesRequest]: () => (state: PreventionState) => ({
        ...state,
        loadingResistanceStatus: true,
    }),
    [ActionTypeEnum.FetchResistanceStatusTypeStudiesSuccess]:
        (studies: PreventionStudy[]) => (state: PreventionState) => ({
            ...state,
            loadingStudies: false,
            loadingResistanceStatus: false,
            resistanceStatusStudies: studies,
        }),
    [ActionTypeEnum.FetchResistanceStatusTypeStudiesError]: () => (state: PreventionState) => ({
        ...state,
        errorResistanceStatus: "There was a problem loading resistance status type studies",
        loadingResistanceStatus: false,
    }),

    [ActionTypeEnum.FetchResistanceIntensityTypeStudiesRequest]: () => (state: PreventionState) => ({
        ...state,
        loadingResistanceIntensity: true,
    }),
    [ActionTypeEnum.FetchResistanceIntensityTypeStudiesSuccess]:
        (studies: PreventionStudy[]) => (state: PreventionState) => ({
            ...state,
            loadingStudies: false,
            loadingResistanceIntensity: false,
            resistanceIntensityStudies: studies,
        }),
    [ActionTypeEnum.FetchResistanceIntensityTypeStudiesError]: () => (state: PreventionState) => ({
        ...state,
        errorResistanceIntensity: "There was a problem loading resistance intensity type studies",
        loadingResistanceIntensity: false,
    }),

    [ActionTypeEnum.FetchResistanceMechanismTypeStudiesRequest]: () => (state: PreventionState) => ({
        ...state,
        loadingResistanceMechanism: true,
    }),
    [ActionTypeEnum.FetchResistanceMechanismTypeStudiesSuccess]:
        (studies: PreventionStudy[]) => (state: PreventionState) => ({
            ...state,
            loadingStudies: false,
            loadingResistanceMechanism: false,
            resistanceMechanismStudies: studies,
        }),
    [ActionTypeEnum.FetchResistanceMechanismTypeStudiesError]: () => (state: PreventionState) => ({
        ...state,
        errorResistanceMechanism: "There was a problem loading resistance mechanism type studies",
        loadingResistanceMechanism: false,
    }),

    [ActionTypeEnum.FetchSynergistEffectTypeStudiesRequest]: () => (state: PreventionState) => ({
        ...state,
        loadingSynergistEffect: true,
    }),
    [ActionTypeEnum.FetchSynergistEffectTypeStudiesSuccess]:
        (studies: PreventionStudy[]) => (state: PreventionState) => ({
            ...state,
            loadingStudies: false,
            loadingSynergistEffect: false,
            synergistEffectStudies: studies,
        }),
    [ActionTypeEnum.FetchSynergistEffectTypeStudiesError]: () => (state: PreventionState) => ({
        ...state,
        errorSynergistEffect: "There was a problem loading synergist effect type studies",
        loadingSynergistEffect: false,
    }),

    [ActionTypeEnum.SetPreventionMapType]: updatePreventionMapType,
    [ActionTypeEnum.SetPreventionDataset]: updatePreventionDataSet,
    [ActionTypeEnum.SetInsecticideClass]: updateInsecticideClass,
    [ActionTypeEnum.SetInsecticideTypes]: updateInsecticideTypes,
    [ActionTypeEnum.SetAssayTypes]: updateAssayTypes,
    [ActionTypeEnum.SetSynergistTypes]: updateSynergistTypes,
    [ActionTypeEnum.SetType]: updateType,
    [ActionTypeEnum.SetProxyType]: updateProxyType,
    [ActionTypeEnum.SetSpecies]: updateSpecies,
    [ActionTypeEnum.SetPreventionFilteredStudies]: (filteredStudies: PreventionStudy[]) =>
        R.assoc("filteredStudies", filteredStudies),
    [ActionTypeEnum.SetPreventionSelectionStudies]: (studies: PreventionStudy[]) => (state: PreventionState) => ({
        ...state,
        selectionStudies: studies,
    }),
    [ActionTypeEnum.SetOnlyByHealthMinistries]: updateOnlyByHealthMinistries,
    [ActionTypeEnum.SetOnlyIncludeBioassaysWithMoreMosquitoes]: updateOnlyIncludeBioassaysWithMoreMosquitoes,
});

const selectPreventionState = (state: State) => state.prevention;

export const selectPreventionStudies = createSelector(selectPreventionState, state => {
    return [
        ...state.resistanceStatusStudies,
        ...state.resistanceIntensityStudies,
        ...state.resistanceMechanismStudies,
        ...state.synergistEffectStudies,
    ];
});

export const selectPreventionStudiesByMapTypeSelected = createSelector(selectPreventionState, state => {
    const studiesByMapType: Record<PreventionMapType, PreventionStudy[]> = {
        [PreventionMapType.RESISTANCE_STATUS]: state.resistanceStatusStudies,
        [PreventionMapType.INTENSITY_STATUS]: state.resistanceIntensityStudies,
        [PreventionMapType.RESISTANCE_MECHANISM]: state.resistanceMechanismStudies,
        [PreventionMapType.LEVEL_OF_INVOLVEMENT]: state.synergistEffectStudies,
    };

    return studiesByMapType[state.filters.mapType] ?? [];
});

export const selectResistanceStatusStudies = createSelector(
    selectPreventionState,
    state => state.resistanceStatusStudies
);
export const selectResistanceIntensityStudies = createSelector(
    selectPreventionState,
    state => state.resistanceIntensityStudies
);
export const selectResistanceMechanismStudies = createSelector(
    selectPreventionState,
    state => state.resistanceMechanismStudies
);
export const selectSynergistEffectStudies = createSelector(
    selectPreventionState,
    state => state.synergistEffectStudies
);

export const selectResistanceStatusStudiesLoading = createSelector(
    selectPreventionState,
    state => state.loadingResistanceStatus
);

export const selectResistanceIntensityStudiesLoading = createSelector(
    selectPreventionState,
    state => state.loadingResistanceIntensity
);

export const selectSynergistEffectStudiesLoading = createSelector(
    selectPreventionState,
    state => state.loadingSynergistEffect
);

export const selectResistanceMechanismStudiesLoading = createSelector(
    selectPreventionState,
    state => state.loadingResistanceMechanism
);

export const selectResistanceStatusStudiesError = createSelector(
    selectPreventionState,
    state => state.errorResistanceStatus
);
export const selectResistanceIntensityStudiesError = createSelector(
    selectPreventionState,
    state => state.errorResistanceIntensity
);
export const selectResistanceMechanismStudiesError = createSelector(
    selectPreventionState,
    state => state.errorResistanceMechanism
);
export const selectSynergistEffectStudiesError = createSelector(
    selectPreventionState,
    state => state.errorSynergistEffect
);

export const selectFilteredPreventionStudies = createSelector(selectPreventionState, state => state.filteredStudies);

export const selectPreventionFilters = createSelector(selectPreventionState, state => state.filters);
