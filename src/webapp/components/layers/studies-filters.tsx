import { VectorSpeciesKey } from "../filters/VectorSpeciesFilter";
import {
    DiagnosisFilters,
    DiagnosisMapType,
    InvasiveFilters,
    InvasiveMapType,
    PreventionFilters,
    PreventionMapType,
    RegionState,
    TreatmentFilters,
    TreatmentMapType,
} from "../../store/types";
import { isSynergyst } from "./prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { DiagnosisStudy } from "../../../domain/entities/DiagnosisStudy";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";
import { BIOCHEMICAL_MECHANISM_TYPES, MOLECULAR_MECHANISM_TYPES } from "../DataDownload/mappers/cvsMapper";
import { Source } from "../../store/actions/base-actions";
import { MOLECULAR_MARKERS_MAP } from "./treatment/MolecularMarkersOngoingStudies/utils";

export const DELETION_TYPES = {
    HRP2_PROPORTION_DELETION: {
        label: "pfhrp2",
        value: "HRP2_PROPORTION_DELETION",
    },
    HRP2_HRP3_PROPORTION_DELETION: {
        label: "pfhrp2 + pfhrp3 (dual)",
        value: "HRP2_HRP3_PROPORTION_DELETION",
    },
};

export const filterPreventionStudies = (
    studies: PreventionStudy[],
    preventionFilters: PreventionFilters,
    yearFilters: number[],
    region: RegionState,
    from: Source = "map"
) => {
    const filters = buildPreventionFilters(preventionFilters, yearFilters, region, from);
    const result = filters.reduce((studies, filter) => studies.filter(filter), studies);
    return result;
};

export const filterDiagnosisStudies = (
    studies: DiagnosisStudy[],
    diagnosisFilters: DiagnosisFilters,
    yearFilters: number[],
    region: RegionState,
    from: Source = "map"
) => {
    const filters = buildDiagnosisFilters(diagnosisFilters, yearFilters, region, from);
    return filters.reduce((studies, filter) => studies.filter(filter), studies);
};

export const filterTreatmentStudies = (
    studies: TreatmentStudy[],
    treatmentFilters: TreatmentFilters,
    yearFilters: number[],
    region: RegionState,
    from: Source = "map"
) => {
    const filters = buildTreatmentFilters(treatmentFilters, yearFilters, region, from);
    return filters.reduce((studies, filter) => studies.filter(filter), studies);
};

export const filterInvasiveStudies = (
    studies: InvasiveStudy[],
    invasiveFilters: InvasiveFilters,
    yearFilters: number[],
    region: RegionState,
    from: Source = "map"
) => {
    const filters = buildInvasiveFilters(invasiveFilters, yearFilters, region, from);
    return filters.reduce((studies, filter) => studies.filter(filter), studies);
};

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
    return !insecticideClass || study.INSECTICIDE_CLASS === insecticideClass;
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
    return !types || !types.length || types.includes(study.TYPE);
};

export const filterByOnlyDataByHealthMinistries = (value: boolean) => (study: PreventionStudy) => {
    return value ? study.INSTITUTION_TYPE === "MoH" : true;
};

export const filterByOnlyIncludeBioassaysWithMoreMosquitoes =
    (numberMosquitoes: number) => (study: PreventionStudy) => {
        return +study.NUMBER >= numberMosquitoes;
    };

export const filterByTypeSynergist = (synergistTypes: string[]) => (study: any) => {
    return !synergistTypes.length || synergistTypes.includes(study.TYPE);
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
    if (!deletionType) return true;

    return deletionType === DELETION_TYPES.HRP2_PROPORTION_DELETION.value
        ? study.HRP2_PROPORTION_DELETION !== "NR" && study.HRP2_PROPORTION_DELETION !== null
        : study.HRP2_HRP3_PROPORTION_DELETION !== "NR" && study.HRP2_HRP3_PROPORTION_DELETION !== null;
};

export const filterByDimensionId = (dimensionId: number) => (study: any) => {
    return study.DimensionID === dimensionId;
};

export const filterByDiagnosisGeneDeletions = () => (study: any) => {
    return study?.DimensionID !== 302;
};

export const filterByPlasmodiumSpecie = (plasmodiumSpecie: string) => (study: any) => {
    return !plasmodiumSpecie || study.PLASMODIUM_SPECIES === plasmodiumSpecie;
};

export const filterByPlasmodiumSpecies = (plasmodiumSpecies: string[]) => (study: any) => {
    return !plasmodiumSpecies.length || plasmodiumSpecies.includes(study.PLASMODIUM_SPECIES);
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

export const filterByMolecularMarker = (molecularMarker?: number) => (study: any) => {
    return !molecularMarker || study.MM_TYPE === molecularMarker.toString();
};

export const filterByTheMolecularMarkerInStudy = (molecularMarkers: number[]) => (study: any) => {
    return !molecularMarkers.length || molecularMarkers.includes(parseInt(study.MM_TYPE));
};

export const filterByManyMolecularMarkersInStudies = (molecularMarkers: number[]) => (study: any) => {
    return Object.entries(MOLECULAR_MARKERS_MAP).some(
        ([key, value]) => study[key] === 1 && molecularMarkers.includes(value)
    );
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
    region: RegionState,
    from: Source = "map"
) => {
    return from === "map"
        ? buildPreventionFiltersByMap(preventionFilters, filters, region)
        : buildPreventionFiltersByDownload(preventionFilters, filters, region);
};

export const buildDiagnosisFilters = (
    diagnosisFilters: DiagnosisFilters,
    filters: number[],
    region: RegionState,
    from: Source = "map"
) => {
    return from === "map"
        ? buildDiagnosisFiltersByMap(diagnosisFilters, filters, region)
        : buildDiagnosisFiltersByDownload(diagnosisFilters, filters, region);
};

export const buildTreatmentFilters = (
    treatmentFilters: TreatmentFilters,
    filters: number[],
    region: RegionState,
    from: Source = "map"
) => {
    return from === "map"
        ? buildTreatmentFiltersByMap(treatmentFilters, filters, region)
        : buildTreatmentFiltersByDownload(treatmentFilters, filters, region);
};

export const buildInvasiveFilters = (
    invasiveFilters: InvasiveFilters,
    filters: number[],
    region: RegionState,
    from: Source = "map"
) => {
    return from === "map"
        ? buildInvasiveFiltersByMap(invasiveFilters, filters, region)
        : buildInvasiveFiltersByDownload(invasiveFilters, filters, region);
};
function buildInvasiveFiltersByMap(invasiveFilters: InvasiveFilters, filters: number[], region: RegionState) {
    switch (invasiveFilters.mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return [
                filterByVectorSpecies(invasiveFilters.vectorSpecies),
                filterByYearRange(filters, true),
                filterByRegion(region),
            ];
        default:
            return [filterByRegion(region)];
    }
}

function buildInvasiveFiltersByDownload(invasiveFilters: InvasiveFilters, filters: number[], region: RegionState) {
    switch (invasiveFilters.mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return [
                filterByVectorSpecies(invasiveFilters.vectorSpecies),
                filterByYearRange(filters, true),
                filterByRegion(region),
            ];
        default:
            return [filterByRegion(region)];
    }
}

function buildDiagnosisFiltersByMap(diagnosisFilters: DiagnosisFilters, filters: number[], region: RegionState) {
    switch (diagnosisFilters.mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return [
                filterByDiagnosisGeneDeletions(),
                filterByDeletionType(diagnosisFilters.deletionType),
                filterBySurveyTypes(diagnosisFilters.surveyTypes),
                filterByPatientType(diagnosisFilters.patientType),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        case DiagnosisMapType.HRP23_STUDIES:
            return [filterByDimensionId(302), filterByYearRange(filters), filterByRegion(region)];
        default:
            return [];
    }
}

function buildDiagnosisFiltersByDownload(diagnosisFilters: DiagnosisFilters, filters: number[], region: RegionState) {
    switch (diagnosisFilters.dataset) {
        case "PFHRP23_GENE_DELETIONS":
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
}

function buildTreatmentFiltersByMap(treatmentFilters: TreatmentFilters, filters: number[], region: RegionState) {
    switch (treatmentFilters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
            return [
                filterByDimensionId(256),
                filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
                filterByDrugs(treatmentFilters.drugs),
                filterByYearRange(filters),
                filterByRegion(region),
                filterByExcludeLowerPatients(treatmentFilters.excludeLowerPatients),
            ];
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return [
                filterByDimensionId(256),
                filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
                filterByDrugs(treatmentFilters.drugs),
                filterByYearRange(filters),
                filterByRegion(region),
                filterByExcludeLowerPatients(treatmentFilters.excludeLowerPatients),
            ];
        case TreatmentMapType.MOLECULAR_MARKERS:
            return [
                filterByMolecularMarkerStudy(),
                filterByTheMolecularMarkerInStudy(treatmentFilters.molecularMarkers),
                filterByYearRange(filters),
                filterByRegion(region),
                filterByExcludeLowerSamples(treatmentFilters.excludeLowerSamples),
            ];
        case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
            return [
                filterByDimensionId(300),
                filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
                filterByDrugs(treatmentFilters.drugs),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        case TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES:
            return [
                filterByDimensionId(301),
                filterByManyMolecularMarkersInStudies(treatmentFilters.molecularMarkers),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        default:
            return [];
    }
}

function buildTreatmentFiltersByDownload(treatmentFilters: TreatmentFilters, filters: number[], region: RegionState) {
    switch (treatmentFilters.dataset) {
        case "THERAPEUTIC_EFFICACY_STUDY":
            return [
                filterByDimensionId(256),
                filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
                filterByDrugs(treatmentFilters.drugs),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        case "MOLECULAR_MARKER_STUDY":
            return [
                filterByMolecularMarkerStudyDimension255(),
                filterByTheMolecularMarkerInStudy(treatmentFilters.molecularMarkers),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        case "AMDERO_TES":
            return [
                filterByDimensionId(300),
                filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
                filterByDrugs(treatmentFilters.drugs),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        default:
            return [];
    }
}

function buildPreventionFiltersByMap(preventionFilters: PreventionFilters, filters: number[], region: RegionState) {
    switch (preventionFilters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return [
                filterByResistanceStatus,
                filterByInsecticideClass(preventionFilters.insecticideClass),
                filterByInsecticideTypes(preventionFilters.insecticideTypes),
                filterByTypes(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByYearRange(filters),
                filterByRegion(region),
                filterByOnlyDataByHealthMinistries(preventionFilters.onlyByHealthMinistries),
                filterByOnlyIncludeBioassaysWithMoreMosquitoes(
                    preventionFilters.onlyIncludeBioassaysWithMoreMosquitoes
                ),
            ];
        case PreventionMapType.INTENSITY_STATUS:
            return [
                filterByIntensityStatus,
                filterByInsecticideClass(preventionFilters.insecticideClass),
                filterByInsecticideTypes(preventionFilters.insecticideTypes),
                filterByTypes(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByYearRange(filters),
                filterByRegion(region),
                filterByOnlyDataByHealthMinistries(preventionFilters.onlyByHealthMinistries),
                filterByOnlyIncludeBioassaysWithMoreMosquitoes(
                    preventionFilters.onlyIncludeBioassaysWithMoreMosquitoes
                ),
            ];
        case PreventionMapType.RESISTANCE_MECHANISM: {
            const base = [
                filterByResistanceMechanism,
                filterByTypes(preventionFilters.type),
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
                filterByProxyType(preventionFilters.proxyType),
                filterBySpecies(preventionFilters.species),
                filterByTypeSynergist(preventionFilters.synergistTypes),
                filterByYearRange(filters),
                filterByRegion(region),
            ];
        default:
            return [];
    }
}

function buildPreventionFiltersByDownload(
    preventionFilters: PreventionFilters,
    filters: number[],
    region: RegionState
) {
    switch (preventionFilters.dataset) {
        case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
        case "INTENSITY_CONCENTRATION_BIOASSAY": {
            return [
                filterByDownload(),
                filterByAssayTypes([preventionFilters.dataset]),
                filterByInsecticideClass(preventionFilters.insecticideClass),
                filterByInsecticideTypes(preventionFilters.insecticideTypes),
                filterByTypes(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByRegion(region),
                filterByYearRange(filters),
            ];
        }
        case "SYNERGIST-INSECTICIDE_BIOASSAY": {
            return [
                filterByDownload(),
                filterByAssayTypes([preventionFilters.dataset]),
                filterByTypes(preventionFilters.type),
                filterBySpecies(preventionFilters.species),
                filterByRegion(region),
                filterByYearRange(filters),
            ];
        }
        case "MOLECULAR_ASSAY": {
            return [
                filterByDownload(),
                filterByAssayTypes(["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"]),
                filterByTypes(MOLECULAR_MECHANISM_TYPES),
                filterBySpecies(preventionFilters.species),
                filterByRegion(region),
                filterByRegion(region),
            ];
        }
        case "BIOCHEMICAL_ASSAY": {
            return [
                filterByDownload(),
                filterByTypes(BIOCHEMICAL_MECHANISM_TYPES),
                filterBySpecies(preventionFilters.species),
                filterByRegion(region),
                filterByYearRange(filters),
            ];
        }
        default:
            return [];
    }
}
