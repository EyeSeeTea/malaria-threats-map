import {
    BURKINA_FASO,
    DISCRIMINATING_ASSAY,
    DJIBOUTI,
    PYRETHROIDS,
} from "../../../domain/entities/__fixtures__/studyValues";
import { Source } from "../actions/base-actions";
import {
    InvasiveFilters,
    InvasiveMapType,
    MapTheme,
    PreventionFilters,
    PreventionMapType,
    RegionState,
} from "../types";

export const PREVENTION_THEME: MapTheme = "prevention";
export const INVASIVE_THEME: MapTheme = "invasive";

export const MAP: Source = "map";
export const DOWNLOAD: Source = "download";

/** The vector species key the invasive filter sets for An. stephensi type form. */
export const STEPHENSI_TYPE_FORM_KEY = "AN_STEPHENSI_TYPE_FORM";

/** A year before the range of createYearFilter. */
export const YEAR_BEFORE_RANGE = 2015;

/** The regions of the default prevention and invasive studies. */
export const PREVENTION_STUDY_REGION: Readonly<RegionState> = { country: BURKINA_FASO.ISO2 };
export const INVASIVE_STUDY_REGION: Readonly<RegionState> = { country: DJIBOUTI.ISO2 };

// Functions, not shared objects, so every call gets its own arrays.
const defaultPreventionFilters = (): PreventionFilters => ({
    mapType: PreventionMapType.RESISTANCE_STATUS,
    dataset: DISCRIMINATING_ASSAY,
    insecticideClass: PYRETHROIDS,
    insecticideTypes: [],
    synergistTypes: [],
    assayTypes: [],
    proxyType: null,
    type: null,
    species: [],
    onlyIncludeBioassaysWithMoreMosquitoes: 0,
    onlyByHealthMinistries: false,
});

const defaultInvasiveFilters = (): InvasiveFilters => ({
    mapType: InvasiveMapType.VECTOR_OCCURANCE,
    dataset: "INVASIVE_VECTOR_SPECIES",
    vectorSpecies: [],
});

export function createYearFilter(): number[] {
    return [2018, 2022];
}

export function createPreventionFilters(overrides: Partial<PreventionFilters> = {}): PreventionFilters {
    return { ...defaultPreventionFilters(), ...overrides };
}

export function createInvasiveFilters(overrides: Partial<InvasiveFilters> = {}): InvasiveFilters {
    return { ...defaultInvasiveFilters(), ...overrides };
}
