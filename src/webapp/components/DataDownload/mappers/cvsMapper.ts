import i18next from "i18next";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import {
    filterByAssayTypes,
    filterByCountries,
    filterByDimensionId,
    filterByDownload,
    filterByDrugs,
    filterByInsecticideClasses,
    filterByInsecticideTypes,
    filterByManyPlasmodiumSpecies,
    filterByMolecularMarkers,
    filterByMolecularMarkerStudyDimension255,
    filterBySpecies,
    filterByTypes,
    filterByYears,
} from "../../layers/studies-filters";
import mappings from "../mappings";
import * as R from "ramda";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";
import { MOLECULAR_MARKERS } from "../../filters/MolecularMarkerFilter";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../filters/PlasmodiumSpeciesFilter";
import { Option } from "../../BasicSelect";
import { DataInfo } from "../types";

export const MOLECULAR_MECHANISM_TYPES = ["MONO_OXYGENASES", "ESTERASES", "GSTS"];

export const BIOCHEMICAL_MECHANISM_TYPES = ["KDR_L1014S", "KDR_L1014F", "KDR_(MUTATION_UNSPECIFIED)", "ACE1R"];

export const mapPreventionStudiesToCSV = (preventionStudies: PreventionStudy[], dataInfo: DataInfo) => {
    switch (dataInfo.preventionDataset) {
        case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
        case "INTENSITY_CONCENTRATION_BIOASSAY": {
            const filters = [
                filterByDownload(),
                filterByAssayTypes([dataInfo.preventionDataset]),
                filterByInsecticideClasses(dataInfo.insecticideClasses),
                filterByInsecticideTypes(dataInfo.insecticideTypes),
                filterByTypes(dataInfo.types),
                filterBySpecies(dataInfo.species),
                filterByCountries(dataInfo.countries),
                filterByYears(dataInfo.years),
            ];
            const studies = filterStudies(preventionStudies, filters);
            const results = buildResults(studies, mappings[dataInfo.preventionDataset]);

            const fields = [
                "ID",
                "COUNTRY_NAME",
                "SITE_NAME",
                "ADMIN1",
                "ADMIN2",
                "SITE_CODE",
                "LATITUDE",
                "LONGITUDE",
                "TEST_TYPE",
                "INSECTICIDE_TYPE",
                "INSECTICIDE_CONCENTRATION",
                "YEAR_START",
                "VECTOR_SPECIES",
                "STAGE_ORIGIN",
                "MOSQUITO_NUMBER",
                "TIME_HOLDING_POSTEXPOSURE",
                "MORTALITY_ADJUSTED",
                "RESISTANCE_STATUS",
                "DATA_SOURCE",
                "CITATION",
                "CITATION_URL",
                "DATA_CURATOR",
            ];
            return [
                {
                    name: i18next.t("disclaimerTab.name"),
                    studies: [
                        {
                            Disclaimer: i18next.t("disclaimerTab.disclaimer"),
                        },
                    ],
                },
                {
                    name: "Data",
                    studies: results,
                },
                {
                    name: "Glossary",
                    studies: fields.map(field => ({
                        "Variable name": field,
                        Description: i18next.t(`download.discrimination.${field}`),
                    })),
                },
            ];
        }
        case "SYNERGIST-INSECTICIDE_BIOASSAY": {
            const filters = [
                filterByDownload(),
                filterByAssayTypes([dataInfo.preventionDataset]),
                filterByTypes(dataInfo.types),
                filterBySpecies(dataInfo.species),
                filterByCountries(dataInfo.countries),
                filterByYears(dataInfo.years),
            ];
            const studies = filterStudies(preventionStudies, filters);
            const results = buildResults(studies, mappings[dataInfo.preventionDataset]);
            const fields = [
                "ID",
                "COUNTRY_NAME",
                "ADMIN1",
                "ADMIN2",
                "SITE_NAME",
                "SITE_CODE",
                "LATITUDE",
                "LONGITUDE",
                "TEST_TYPE",
                "TYPE_SYNERGIST",
                "INSECTICIDE_TYPE",
                "INSECTICIDE_CONCENTRATION",
                "SYNERGIST_TYPE",
                "SYNERGIST_CONCENTRATION",
                "YEAR_START",
                "VECTOR_SPECIES",
                "STAGE_ORIGIN",
                "MOSQUITO_NUMBER",
                "TIME_HOLDING_POSTEXPOSURE",
                "MORTALITY_ADJUSTED_SYNERGIST_INSECTICIDE",
                "MORTALITY_ADJUSTED_INSECTICIDE_ONLY",
                "METABOLIC_MECHANISM_INVOLVEMENT",
                "DATA_SOURCE",
                "CITATION",
                "CITATION_URL",
                "DATA_CURATOR",
            ];
            return [
                {
                    name: i18next.t("disclaimerTab.name"),
                    studies: [
                        {
                            Disclaimer: i18next.t("disclaimerTab.disclaimer"),
                        },
                    ],
                },
                {
                    name: "Data",
                    studies: results,
                },
                {
                    name: "Glossary",
                    studies: fields.map(field => ({
                        "Variable name": field,
                        Description: i18next.t(`download.synergist.${field}`),
                    })),
                },
            ];
        }
        case "MOLECULAR_ASSAY": {
            const filters = [
                filterByDownload(),
                filterByAssayTypes(["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"]),
                filterByTypes(MOLECULAR_MECHANISM_TYPES),
                filterBySpecies(dataInfo.species),
                filterByCountries(dataInfo.countries),
                filterByYears(dataInfo.years),
            ];
            const studies = filterStudies(preventionStudies, filters);
            const results = buildResults(studies, mappings[dataInfo.preventionDataset]);
            const fields = [
                "ID",
                "COUNTRY_NAME",
                "ADMIN1",
                "ADMIN2",
                "SITE_NAME",
                "SITE_CODE",
                "LATITUDE",
                "LONGITUDE",
                "TEST_TYPE",
                "YEAR_START",
                "VECTOR_SPECIES",
                "STAGE_ORIGIN",
                "MOSQUITO_NUMBER",
                "MECHANISM_STATUS",
                "MECHANISM_FREQUENCY",
                "DATA_SOURCE",
                "CITATION",
                "CITATION_URL",
                "DATA_CURATOR",
            ];
            return [
                {
                    name: i18next.t("disclaimerTab.name"),
                    studies: [
                        {
                            Disclaimer: i18next.t("disclaimerTab.disclaimer"),
                        },
                    ],
                },
                {
                    name: "Data",
                    studies: results,
                },
                {
                    name: "Glossary",
                    studies: fields.map(field => ({
                        "Variable name": field,
                        Description: i18next.t(`download.molecular_assay.${field}`),
                    })),
                },
            ];
        }
        case "BIOCHEMICAL_ASSAY": {
            const filters = [
                filterByDownload(),
                filterByTypes(BIOCHEMICAL_MECHANISM_TYPES),
                filterBySpecies(dataInfo.species),
                filterByCountries(dataInfo.countries),
                filterByYears(dataInfo.years),
            ];
            const studies = filterStudies(preventionStudies, filters);
            const results = buildResults(studies, mappings[dataInfo.preventionDataset]);
            const fields = [
                "ID",
                "COUNTRY_NAME",
                "ADMIN1",
                "ADMIN2",
                "SITE_NAME",
                "SITE_CODE",
                "LATITUDE",
                "LONGITUDE",
                "TEST_TYPE",
                "YEAR_START",
                "VECTOR_SPECIES",
                "STAGE_ORIGIN",
                "MOSQUITO_NUMBER",
                "MECHANISM_STATUS",
                "DATA_SOURCE",
                "CITATION",
                "CITATION_URL",
                "DATA_CURATOR",
            ];
            return [
                {
                    name: i18next.t("disclaimerTab.name"),
                    studies: [
                        {
                            Disclaimer: i18next.t("disclaimerTab.disclaimer"),
                        },
                    ],
                },
                {
                    name: "Data",
                    studies: results,
                },
                {
                    name: "Glossary",
                    studies: fields.map(field => ({
                        "Variable name": field,
                        Description: i18next.t(`download.biochemical_assay.${field}`),
                    })),
                },
            ];
        }
    }
};

export const mapTreatmentStudiesToCSV = (treatmentStudies: TreatmentStudy[], dataInfo: DataInfo) => {
    switch (dataInfo.treatmentDataset) {
        case "THERAPEUTIC_EFFICACY_STUDY": {
            const filters = [
                filterByDimensionId(256),
                filterByManyPlasmodiumSpecies(dataInfo.plasmodiumSpecies),
                filterByDrugs(dataInfo.drugs),
                filterByCountries(dataInfo.countries),
                filterByYears(dataInfo.years),
            ];
            const studies = filterStudies(treatmentStudies, filters);
            const results = buildResults(studies, mappings[dataInfo.treatmentDataset]);
            const fields = [
                "ID",
                "COUNTRY_NAME",
                "ADMIN2",
                "SITE_NAME",
                "LATITUDE",
                "LONGITUDE",
                "YEAR_START",
                "YEAR_END",
                "DRUG_NAME",
                "PLASMODIUM_SPECIES",
                "SAMPLE_SIZE",
                "FOLLOW_UP",
                "POSITIVE_DAY_3",
                "TREATMENT_FAILURE_PP",
                "TREATMENT_FAILURE_KM",
                "DATA_SOURCE",
                "CITATION_URL",
            ];
            return [
                {
                    name: i18next.t("disclaimerTab.name"),
                    studies: [
                        {
                            Disclaimer: i18next.t("disclaimerTab.disclaimer"),
                        },
                    ],
                },
                {
                    name: "Data",
                    studies: results,
                },
                {
                    name: "Glossary",
                    studies: fields.map(field => ({
                        "Variable name": field,
                        Description: i18next.t(`download.therapeutic_efficacy.${field}`),
                    })),
                },
            ];
        }
        case "MOLECULAR_MARKER_STUDY": {
            const filters = [
                filterByMolecularMarkerStudyDimension255(),
                filterByMolecularMarkers(dataInfo.molecularMarkers),
                filterByCountries(dataInfo.countries),
                filterByYears(dataInfo.years),
            ];
            const studies = filterStudies(treatmentStudies, filters);
            const results = buildResults(studies, mappings["MOLECULAR_MARKER_STUDY"]);
            const genes = buildResults(
                R.flatten(R.map(r => r.groupStudies, studies)),
                mappings["MOLECULAR_MARKER_STUDY_GENES"]
            );
            const fields = [
                "ID",
                "MM_TYPE",
                "COUNTRY_NAME",
                "SITE_NAME",
                "ADMIN2",
                "LATITUDE",
                "LONGITUDE",
                "YEAR_START",
                "DRUG_NAME",
                "PLASMODIUM_SPECIES",
                "SAMPLE_SIZE",
                "DATA_SOURCE",
                "CITATION_URL",
                "GENOTYPE",
                "PROPORTION",
            ];
            return [
                {
                    name: i18next.t("disclaimerTab.name"),
                    studies: [
                        {
                            Disclaimer: i18next.t("disclaimerTab.disclaimer"),
                        },
                    ],
                },
                {
                    name: "MM_StudyInfo",
                    studies: results,
                },
                {
                    name: "MM_geneMutations",
                    studies: genes,
                },
                {
                    name: "Glossary",
                    studies: fields.map(field => ({
                        "Variable name": field,
                        Description: i18next.t(`download.mm.${field}`),
                    })),
                },
            ];
        }
    }
};

export const mapInvasiveStudiesToCSV = (invasiveStudies: InvasiveStudy[], dataInfo: DataInfo) => {
    if (dataInfo.invasiveDataset === "INVASIVE_VECTOR_SPECIES") {
        const filters = [
            filterBySpecies(dataInfo.species),
            filterByCountries(dataInfo.countries),
            filterByYears(dataInfo.years),
        ];
        const studies = filterStudies(invasiveStudies, filters);
        const results = buildResults(studies, mappings[dataInfo.invasiveDataset]);
        const fields = [
            "ID",
            "COUNTRY_NAME",
            "SITE_NAME",
            "LATITUDE",
            "LONGITUDE",
            "VECTOR_SPECIES_COMPLEX",
            "VECTOR_SPECIES",
            "STAGE",
            "YEAR_START",
            "MONTH_START",
            "YEAR_END",
            "MONTH_END",
            "SAMPLING_METHOD",
            "MOSQUITO_NUMBER",
            "BREEDING_HABITAT",
            "ID_METHOD",
            "DATA_SOURCE",
            "CITATION",
            "CITATION_URL",
            "DATA_CURATOR",
            "INVASIVE_STATUS",
        ];
        return [
            {
                name: i18next.t("disclaimerTab.name"),
                studies: [
                    {
                        Disclaimer: i18next.t("disclaimerTab.disclaimer"),
                    },
                ],
            },
            {
                name: "Data",
                studies: results,
            },
            {
                name: "Glossary",
                studies: fields.map(field => ({
                    "Variable name": field,
                    Description: i18next.t(`download.invasive.${field}`),
                })),
            },
        ];
    }
};

const filterStudies = (baseStudies: any[], filters: any[]) => {
    return filters.reduce((studies, filter) => studies.filter(filter), baseStudies);
};

const buildResults = (studies: any, mappings: Option[]) => {
    return studies.map((study: { [key: string]: any }) =>
        mappings.reduce(
            (acc: any, field: Option) => ({
                ...acc,
                [field.label]: resolveValue(field, study),
            }),
            {}
        )
    );
};

const resolveValue = (field: Option, study: any) => {
    if (field.value === "MM_TYPE") {
        return MOLECULAR_MARKERS.find(mm => mm.value === Number(study[field.value])).label;
    }
    if (field.value === "PLASMODIUM_SPECIES") {
        const value = PLASMODIUM_SPECIES_SUGGESTIONS.find(species => species.value === study[field.value]);

        return value ? value.label : undefined;
    }
    if (["Latitude", "Longitude"].includes(field.value)) {
        return Number(study[field.value]).toFixed(6);
    }
    if (
        [
            "CITATION",
            "CITATION_LONG",
            "CITATION_URL",
            "PROVINCE",
            "OBJECTID",
            "MONTH_END",
            "MONTH_START",
            "YEAR_END",
            "YEAR_START",
        ].includes(field.value)
    ) {
        return study[field.value];
    }
    if (["STAGE_ORIGIN", "STAGE"].includes(field.value)) {
        return String(study[field.value]).toUpperCase();
    }
    if (
        ["POSITIVE_DAY_3", "TREATMENT_FAILURE_PP", "TREATMENT_FAILURE_KM", "MORTALITY_ADJUSTED", "PROPORTION"].includes(
            field.value
        )
    ) {
        if (!isNaN(study[field.value])) {
            return (parseFloat(study[field.value]) * 100).toFixed(2);
        }
        return study[field.value];
    }
    if (field.value === "ISO2") {
        if (field.label === "ISO2") {
            return study[field.value];
        } else {
            return i18next.t(`${study[field.value] === "NA" ? "common.COUNTRY_NA" : study[field.value]}`);
        }
    }
    if (!isNaN(study[field.value])) {
        return study[field.value];
    } else {
        return i18next.t(`${study[field.value]}`);
    }
};
