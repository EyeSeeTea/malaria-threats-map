import i18next from "i18next";
import _ from "lodash";
import { Source } from "../../store/actions/base-actions";
import {
    DiagnosisFilters,
    InvasiveFilters,
    PreventionFilters,
    PreventionMapType,
    RegionState,
    TreatmentFilters,
    TreatmentMapType,
} from "../../store/types";
import {
    diagnosisDatasetSuggestions,
    invasiveDatasetSuggestions,
    preventionDatasetSuggestions,
    treatmentDatasetSuggestions,
} from "../DataDownload/filters/DataSetSelector";
import { diagnosisSuggestions } from "../filters/DiagnosisMapTypesSelector";
import { invasiveSuggestions } from "../filters/InvasiveMapTypesSelector";
import { MOLECULAR_MARKERS } from "../filters/MolecularMarkerFilter";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../filters/PlasmodiumSpeciesFilter";
import { preventionSuggestions } from "../filters/PreventionMapTypesSelector";
import { treatmentSuggestions } from "../filters/TreatmentMapTypesSelector";
import { suggestions } from "../filters/VectorSpeciesFilter";

export function filtersToString(
    theme: string,
    preventionFilters: PreventionFilters,
    treatmentFilters: TreatmentFilters,
    diagnosisFilters: DiagnosisFilters,
    invasiveFilters: InvasiveFilters,
    maxMinYears: number[],
    yearFilters: number[],
    from: Source
) {
    switch (theme) {
        case "prevention": {
            return preventionFiltersToString(preventionFilters, maxMinYears, yearFilters, from);
        }
        case "diagnosis": {
            return diagnosisFiltersToString(diagnosisFilters, maxMinYears, yearFilters, from);
        }
        case "invasive": {
            return invasiveFiltersToString(invasiveFilters, maxMinYears, yearFilters, from);
        }
        case "treatment": {
            return treatmentFiltersToString(treatmentFilters, maxMinYears, yearFilters, from);
        }
    }
}

export function getMapType(
    theme: string,
    preventionFilters: PreventionFilters,
    treatmentFilters: TreatmentFilters,
    diagnosisFilters: DiagnosisFilters,
    invasiveFilters: InvasiveFilters
) {
    switch (theme) {
        case "prevention": {
            return preventionSuggestions[preventionFilters.mapType].title;
        }
        case "diagnosis": {
            return diagnosisSuggestions[diagnosisFilters.mapType].title;
        }
        case "invasive": {
            return invasiveSuggestions[invasiveFilters.mapType].title;
        }
        case "treatment": {
            return treatmentSuggestions[treatmentFilters.mapType].title;
        }
    }
}

export function getDataset(
    theme: string,
    preventionFilters: PreventionFilters,
    treatmentFilters: TreatmentFilters,
    diagnosisFilters: DiagnosisFilters,
    invasiveFilters: InvasiveFilters
) {
    switch (theme) {
        case "prevention": {
            const dataSet = preventionDatasetSuggestions.find(
                suggestion => suggestion.value === preventionFilters.dataset
            );

            return dataSet ? i18next.t(dataSet.title) : undefined;
        }
        case "diagnosis": {
            const dataSet = diagnosisDatasetSuggestions.find(
                suggestion => suggestion.value === diagnosisFilters.dataset
            );

            return dataSet ? i18next.t(dataSet.title) : undefined;
        }
        case "invasive": {
            const dataSet = invasiveDatasetSuggestions.find(suggestion => suggestion.value === invasiveFilters.dataset);

            return dataSet ? i18next.t(dataSet.title) : undefined;
        }
        case "treatment": {
            const dataSet = treatmentDatasetSuggestions.find(
                suggestion => suggestion.value === treatmentFilters.dataset
            );

            return dataSet ? i18next.t(dataSet.title) : undefined;
        }
    }
}

export function getLocation(region: RegionState) {
    return region.region || region.subRegion || region.siteLabel || region.country;
}

export function getFilters(
    theme: string,
    preventionFilters: PreventionFilters,
    treatmentFilters: TreatmentFilters,
    diagnosisFilters: DiagnosisFilters,
    invasiveFilters: InvasiveFilters
) {
    switch (theme) {
        case "prevention": {
            return preventionFilters;
        }
        case "diagnosis": {
            return diagnosisFilters;
        }
        case "invasive": {
            return invasiveFilters;
        }
        case "treatment": {
            return treatmentFilters;
        }
    }
}

export function preventionFiltersToString(
    preventionFilters: PreventionFilters,
    maxMinYears: number[],
    yearFilters: number[],
    from: Source
) {
    const years = getYearsSummary(maxMinYears, yearFilters);
    const insecticideClass = i18next.t(preventionFilters.insecticideClass);
    const insecticideTypes = preventionFilters.insecticideTypes.map(item => i18next.t(item));
    const type = preventionFilters.type?.map(item => i18next.t(item));
    const species = preventionFilters.species.map(item => i18next.t(item));
    const assayTypes = preventionFilters.assayTypes.map(item => i18next.t(item));
    const synergistTypes = preventionFilters.synergistTypes.map(item => i18next.t(item));

    if (from === "map") {
        switch (preventionFilters.mapType) {
            case PreventionMapType.RESISTANCE_STATUS: {
                return _.compact([insecticideClass, ...insecticideTypes, type, ...species, years]).join(" | ");
            }
            case PreventionMapType.INTENSITY_STATUS: {
                return _.compact([insecticideClass, ...insecticideTypes, type, ...species, years]).join(" | ");
            }
            case PreventionMapType.RESISTANCE_MECHANISM: {
                return _.compact([type, ...assayTypes, ...species, years]).join(" | ");
            }
            case PreventionMapType.LEVEL_OF_INVOLVEMENT: {
                return _.compact([type, ...synergistTypes, ...species, years]).join(" | ");
            }
        }
    } else {
        switch (preventionFilters.dataset) {
            case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
            case "INTENSITY_CONCENTRATION_BIOASSAY": {
                return _.compact([insecticideClass, ...insecticideTypes, type, ...species, years]).join(" | ");
            }
            case "MOLECULAR_ASSAY":
            case "BIOCHEMICAL_ASSAY": {
                return _.compact([type, ...species, years]).join(" | ");
            }
            case "SYNERGIST-INSECTICIDE_BIOASSAY": {
                return _.compact([...species, years]).join(" | ");
            }
        }
    }
}

export function treatmentFiltersToString(
    treatmentFilters: TreatmentFilters,
    maxMinYears: number[],
    yearFilters: number[],
    from: Source
) {
    const years = getYearsSummary(maxMinYears, yearFilters);
    const exlude = treatmentFilters.excludeLowerPatients
        ? i18next.t("common.filters.exclude_lower_patients")
        : undefined;
    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        item => item.value === treatmentFilters.plasmodiumSpecies
    );
    const drug = i18next.t(treatmentFilters.drug);
    const molecularMarker = MOLECULAR_MARKERS.find(item => item.value === treatmentFilters.molecularMarker);

    if (from === "map") {
        switch (treatmentFilters.mapType) {
            case TreatmentMapType.TREATMENT_FAILURE:
            case TreatmentMapType.DELAYED_PARASITE_CLEARANCE: {
                return _.compact([plasmodiumSpecies?.label, drug, exlude, years]).join(" | ");
            }
            case TreatmentMapType.MOLECULAR_MARKERS: {
                return _.compact([molecularMarker?.label, exlude, years]).join(" | ");
            }
        }
    } else {
        switch (treatmentFilters.dataset) {
            case "THERAPEUTIC_EFFICACY_STUDY": {
                return _.compact([plasmodiumSpecies?.label, drug, exlude, years]).join(" | ");
            }
            case "MOLECULAR_MARKER_STUDY": {
                return _.compact([molecularMarker?.label, exlude, years]).join(" | ");
            }
        }
    }
}

export function diagnosisFiltersToString(
    diagnosisFilters: DiagnosisFilters,
    maxMinYears: number[],
    yearFilters: number[],
    _from: Source
) {
    const years = getYearsSummary(maxMinYears, yearFilters);

    const deletionType = i18next.t(diagnosisFilters.deletionType);
    const surveyTypes = diagnosisFilters.surveyTypes.map(item => i18next.t(item));
    const patientType = i18next.t(diagnosisFilters.patientType);

    return _.compact([deletionType, ...surveyTypes, patientType, years]).join(" | ");
}

export function invasiveFiltersToString(
    invasiveFilters: InvasiveFilters,
    maxMinYears: number[],
    yearFilters: number[],
    _from: Source
) {
    const years = getYearsSummary(maxMinYears, yearFilters);

    const vectorSpecies = invasiveFilters.vectorSpecies.map(item => {
        const vectorSpecie = suggestions.find(sug => sug.value === item);
        return vectorSpecie.label;
    });

    return _.compact([...vectorSpecies, years]).join(" | ");
}

function getYearsSummary(maxMinYears: number[], yearFilters: number[]) {
    return maxMinYears[0] === yearFilters[0] && maxMinYears[1] === yearFilters[1] ? "" : yearFilters.join("-");
}
