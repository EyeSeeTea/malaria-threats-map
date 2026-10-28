import { InvasiveFilters, InvasiveMapType, PreventionFilters, PreventionMapType } from "../types";

const defaultPreventionFilters: Readonly<PreventionFilters> = {
    mapType: PreventionMapType.RESISTANCE_STATUS,
    dataset: "DISCRIMINATING_CONCENTRATION_BIOASSAY",
    insecticideClass: "PYRETHROIDS",
    insecticideTypes: [],
    synergistTypes: [],
    assayTypes: [],
    proxyType: null,
    type: null,
    species: [],
    onlyIncludeBioassaysWithMoreMosquitoes: 0,
    onlyByHealthMinistries: false,
};

const defaultInvasiveFilters: Readonly<InvasiveFilters> = {
    mapType: InvasiveMapType.VECTOR_OCCURANCE,
    dataset: "INVASIVE_VECTOR_SPECIES",
    vectorSpecies: [],
};

export function createPreventionFilters(overrides: Partial<PreventionFilters> = {}): PreventionFilters {
    return { ...defaultPreventionFilters, ...overrides };
}

export function createInvasiveFilters(overrides: Partial<InvasiveFilters> = {}): InvasiveFilters {
    return { ...defaultInvasiveFilters, ...overrides };
}
