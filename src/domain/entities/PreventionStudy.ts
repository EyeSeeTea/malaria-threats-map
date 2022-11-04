import _ from "lodash";
import { Option } from "../../webapp/components/BasicSelect";
import { Study } from "./Study";

export interface PreventionStudy extends Study {
    CITATION_LONG: string;
    CITATION_URL: string;
    STUDY_PAIRING_CODE: string;
    ADMIN1: string;
    ADMIN1_GUID: string;
    ADMIN2: string;
    ADMIN2_GUID: string;
    Code: string;
}

export function extractInsecticideClassesOptions(studies: PreventionStudy[]): Option[] {
    const uniques = _.uniq(studies.map(study => study.INSECTICIDE_CLASS)).sort();

    return uniques.map((insecticideClass: string) => ({
        label: insecticideClass,
        value: insecticideClass,
    }));
}

export function extractSpeciesOptions(studies: PreventionStudy[]): Option[] {
    const uniques = _.uniq(studies.map(study => study.SPECIES)).sort();

    return uniques.map((specie: string) => ({
        label: specie,
        value: specie,
    }));
}

export function extractTypeOptions(studies: PreventionStudy[]): Option[] {
    const uniques = _.uniq(studies.map(study => study.TYPE)).sort();

    return uniques.map((type: string) => ({
        label: type,
        value: type,
    }));
}

export function extractInsecticideTypeOptions(studies: PreventionStudy[]): Option[] {
    const uniques = _.uniq(studies.map(study => study.INSECTICIDE_TYPE));

    return uniques.map((type: string) => ({
        label: type,
        value: type,
    }));
}
