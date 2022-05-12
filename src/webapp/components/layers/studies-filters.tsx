import { DELETION_TYPES } from "../filters/DeletionTypeFilter";
import { VectorSpeciesKey } from "../filters/VectorSpeciesFilter";
import {
    DiagnosisFilters,
    DiagnosisMapType,
    PreventionFilters,
    PreventionMapType,
    RegionState,
} from "../../store/types";
import { isSynergyst } from "./prevention/ResistanceMechanisms/ResistanceMechanismFilters";

export const filterByYearRange =
    (years: number[], allowEmpty = false) =>
    (study: any) => {
        return (
            (allowEmpty && !study.YEAR_START) ||
            (parseInt(study.YEAR_START) >= years[0] && parseInt(study.YEAR_START) <= years[1])
        );
    };

export const filterByYears = (years: number[]) => (study: any) => {
    return !years.length || years.includes(study.YEAR_START);
};

export const filterByDownload = () => (study: any) => {
    return study.DOWNLOAD === "1";
};

export const filterByIntensityStatus = (study: any) => {
    return study.ASSAY_TYPE === "INTENSITY_CONCENTRATION_BIOASSAY";
};

export const filterByResistanceStatus = (study: any) => {
    return study.ASSAY_TYPE === "DISCRIMINATING_CONCENTRATION_BIOASSAY";
};

export const filterByResistanceMechanism = (study: any) => {
    return (
        study.ASSAY_TYPE === "MOLECULAR_ASSAY" ||
        study.ASSAY_TYPE === "BIOCHEMICAL_ASSAY" ||
        study.ASSAY_TYPE === "SYNERGIST-INSECTICIDE_BIOASSAY"
    );
};

export const filterByLevelOfInvolvement = (study: any) => {
    return study.ASSAY_TYPE === "SYNERGIST-INSECTICIDE_BIOASSAY";
};

export const filterByRegion = (region: RegionState) => (study: any) => {
    if (region.country) {
        return study.COUNTRY_NAME === region.country || study.ISO2 === region.country;
    } else if (region.region) {
        return study.REGION_FULL === region.region;
    } else if (region.subRegion) {
        return study.SUBREGION === region.subRegion;
    }
    return true;
};

export const filterByCountries = (countries: string[]) => (study: any) => {
    return !countries.length || countries.includes(study.ISO2);
};

export const filterByInsecticideClass = (insecticideClass: string) => (study: any) => {
    return !study.INSECTICIDE_CLASS || study.INSECTICIDE_CLASS === insecticideClass;
};

export const filterByInsecticideClasses = (insecticideClasses: string[]) => (study: any) => {
    return !insecticideClasses.length || insecticideClasses.includes(study.INSECTICIDE_CLASS);
};

export const filterByInsecticideTypes = (insecticideTypes: string[]) => (study: any) => {
    return !insecticideTypes.length || insecticideTypes.includes(study.INSECTICIDE_TYPE);
};

export const filterByType = (type: string) => (study: any) => {
    return !type || study.TYPE === type;
};

export const filterByProxyType = (type: string) => (study: any) => {
    return !type || study.PROXY_TYPE === type;
};

export const filterByTypes = (types: string[]) => (study: any) => {
    return !types.length || types.includes(study.TYPE);
};

export const filterByTypeSynergist = (synergistTypes: string[]) => (study: any) => {
    return !synergistTypes.length || synergistTypes.includes(study.TYPE_SYNERGIST);
};

export const filterBySpecies = (species: string[]) => (study: any) => {
    return !species.length || species.includes(study.SPECIES);
};

export const filterByAssayTypes = (assayTypes: string[]) => (study: any) => {
    return !assayTypes.length || assayTypes.includes(study.ASSAY_TYPE);
};

export const filterBySurveyTypes = (surveyTypes: string[]) => (study: any) => {
    return !surveyTypes.length || surveyTypes.includes(study.SURVEY_TYPE);
};

const filterByPatientType = (patientType: string) => (study: any) => {
    return !patientType || study.PATIENT_TYPE === patientType;
};

export const filterByDeletionType = (deletionType: string) => (study: any) => {
    return deletionType === DELETION_TYPES.HRP2_PROPORTION_DELETION.value
        ? study.HRP2_PROPORTION_DELETION !== "NR" && study.HRP2_PROPORTION_DELETION !== null
        : study.HRP2_HRP3_PROPORTION_DELETION !== "NR" && study.HRP2_HRP3_PROPORTION_DELETION !== null;
};

export const filterByDimensionId = (dimensionId: number) => (study: any) => {
    return study.DimensionID === dimensionId;
};

export const filterByPlasmodiumSpecies = (plasmodiumSpecies: string) => (study: any) => {
    return study.PLASMODIUM_SPECIES === plasmodiumSpecies;
};

export const filterByManyPlasmodiumSpecies = (plasmodiumSpecies: string[]) => (study: any) => {
    return !plasmodiumSpecies.length || plasmodiumSpecies.includes(study.PLASMODIUM_SPECIES);
};

export const filterByDrug = (drug: string) => (study: any) => {
    return study.DRUG_NAME === drug;
};

export const filterByDrugs = (drugs: string[]) => (study: any) => {
    return !drugs.length || drugs.includes(study.DRUG_NAME);
};

export const filterByVectorSpecies = (species: string[]) => (study: any) => {
    return !species.length || species.map(specie => VectorSpeciesKey[specie]).includes(study.VECTOR_SPECIES);
};

export const filterByMolecularMarkerStudy = () => (study: any) => {
    return study.DimensionID === 255 || study.DimensionID === 257;
};

export const filterByMolecularMarkerStudyDimension255 = () => (study: any) => {
    return study.DimensionID === 255;
};

export const filterByMolecularMarkerStudyDimension256 = () => (study: any) => {
    return study.DimensionID === 256;
};

export const filterByMolecularMarker = (molecularMarker: number) => (study: any) => {
    return study.MM_TYPE === molecularMarker.toString();
};

export const filterByMolecularMarkers = (molecularMarkers: string[]) => (study: any) => {
    return !molecularMarkers.length || molecularMarkers.includes(study.MM_TYPE);
};

export const filterByExcludeLowerPatients = (value: boolean) => (study: any) => {
    return (value && study.N > 20) || !value;
};

export const filterByExcludeLowerSamples = (value: boolean) => (study: any) => {
    return (value && study.N > 20) || !value;
};

export const buildPreventionFilters = (
    preventionFilters: PreventionFilters,
    filters: number[],
    region: RegionState
) => {
    switch (preventionFilters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return [
                filterByResistanceStatus,
                filterByInsecticideClass(preventionFilters.insecticideClass),
                filterByInsecticideTypes(preventionFilters.insecticideTypes),
                filterByType(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        case PreventionMapType.INTENSITY_STATUS:
            return [
                filterByIntensityStatus,
                filterByInsecticideClass(preventionFilters.insecticideClass),
                filterByInsecticideTypes(preventionFilters.insecticideTypes),
                filterByType(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        case PreventionMapType.RESISTANCE_MECHANISM: {
            const base = [
                filterByResistanceMechanism,
                filterByType(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByAssayTypes(preventionFilters.assayTypes),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
            return isSynergyst(preventionFilters)
                ? [...base, filterByTypeSynergist(preventionFilters.synergistTypes)]
                : base;
        }
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return [
                filterByLevelOfInvolvement,
                filterByType(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByTypeSynergist(preventionFilters.synergistTypes),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        default:
            return [];
    }
};

export const buildDiagnosisFilters = (diagnosisFilters: DiagnosisFilters, filters: number[], region: RegionState) => {
    switch (diagnosisFilters.mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return [
                filterByDeletionType(diagnosisFilters.deletionType),
                filterBySurveyTypes(diagnosisFilters.surveyTypes),
                filterByPatientType(diagnosisFilters.patientType),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        default:
            return [];
    }
};
