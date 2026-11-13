import { DISCRIMINATING, PYRETHROIDS } from "../../../domain/entities/__fixtures__/studyValues";
import { InvasiveFilters, InvasiveMapType, PreventionFilters, PreventionMapType } from "../types";

// Functions, not shared objects, so every call gets its own arrays.
const defaultPreventionFilters = (): PreventionFilters => ({
    mapType: PreventionMapType.RESISTANCE_STATUS,
    dataset: DISCRIMINATING,
    insecticideClass: PYRETHROIDS,
    insecticideTypes: [],
    synergistTypes: [],
    assayTypes: [],
    proxyType: null,
    type: null,
    species: [],
    onlyIncludeBioassaysWithMoreMosquitoes: 0,
    onlyByHealthMinistries: false,
    disease: undefined,
});

const defaultInvasiveFilters = (): InvasiveFilters => ({
    mapType: InvasiveMapType.VECTOR_OCCURANCE,
    dataset: "INVASIVE_VECTOR_SPECIES",
    vectorSpecies: [],
    disease: undefined,
});

export function createPreventionFilters(overrides: Partial<PreventionFilters> = {}): PreventionFilters {
    return { ...defaultPreventionFilters(), ...overrides };
}

export function createInvasiveFilters(overrides: Partial<InvasiveFilters> = {}): InvasiveFilters {
    return { ...defaultInvasiveFilters(), ...overrides };
}
