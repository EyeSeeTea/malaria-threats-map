import _ from "lodash";
import { RegionState } from "../../webapp/store/types";

export interface Study {
    OBJECTID: number;
    VILLAGE_NAME: string;
    SITE_ID: string;
    SITE_NAME: string;
    ISO2: string;
    CITATION_LONG: string;
    INSTITUTE_CURATION: string;
    CURATION: string;
    CITATION_URL: string;
    CITATION: string;
    DRUG_NAME?: string;
    FUNDING_SOURCE?: string;
    Latitude: string;
    Longitude: string;
    INSTITUTION?: string;
    INSTITUTION_CITY?: string;
    INSTITUTION_TYPE?: string;
    ASSAY_TYPE: string;
    COUNTRY_NAME: string;
    INSECTICIDE_CLASS: string;
    INSECTICIDE_CONC: string;
    INSECTICIDE_INTENSITY: string;
    INSECTICIDE_TYPE: string;
    INSTITUTE: string;
    INVESTIGATION_TYPE: string;
    MALARIA_ENDEMIC: number;
    MECHANISM_FREQUENCY: string;
    MECHANISM_PROXY: string;
    MECHANISM_STATUS: string;
    METHOD_STANDARD: number;
    MM_LIST?: string;
    MONTH_END: string;
    MONTH_START: string;
    MORTALITY_ADJUSTED: string;
    NUMBER: string;
    PLASMODIUM_SPECIES?: string;
    PROXY_TYPE: string;
    REGION_FULL: string;
    RESISTANCE_FREQUENCY: string;
    RESISTANCE_INTENSITY: string;
    RESISTANCE_STATUS: string;
    RESISTANCE_STATUS_NUMERIC: number;
    SPECIES: string;
    STAGE_ORIGIN: string;
    SUBREGION: string;
    SURV_STATUS?: number;
    SYNERGIST_CONC: string;
    SYNERGIST_TYPE: string;
    TIME: string;
    TYPE: string;
    TYPE_SYNERGIST: string;
    VERSION: number;
    YEAR_END: string;
    YEAR_START: string;
}

export function getMaxMinYears(studies: Study[]): [number, number] {
    if (studies.length === 0) return [2010, new Date().getFullYear()];
    const years = _.compact(_.uniq(studies.map(study => parseInt(study.YEAR_START)).sort()));

    const min = Math.min(...years);
    const max = Math.max(...years);

    return [min, max];
}

export function getRegionBySite(study: Study): RegionState {
    return {
        siteLabel: study.SITE_NAME || study.VILLAGE_NAME,
        site: study.SITE_ID,
        siteIso2: study.ISO2,
        siteCoordinates: [+study.Latitude, +study.Longitude],
        region: study.REGION_FULL,
        country: study.ISO2,
    };
}
