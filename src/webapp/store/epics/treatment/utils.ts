import i18next from "i18next";
import { getSiteTitle } from "../../../components/site-title/utils";
import {
    AditionalInformation,
    CitationDataSource,
    MOLECULAR_MARKERS_ONGOING_STUDY_DETAILS_KEYS,
    MolecularMarkersOngoingStudiesData,
    ONGOING_AND_PLANNED_TREATMENT_STUDY_OVERVIEW_INFO_KEYS,
    OngoingAndPlannedTreatmentStudiesOverviewInfo,
    SelectionData,
    THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS,
    TherapeuticEfficacyStudiesData,
    TreatmentChartData,
    TreatmentMolecularMarkersChartData,
} from "../../SelectionData";
import * as R from "ramda";
import _ from "lodash";
import { SiteSelection, TreatmentFilters, TreatmentMapType } from "../../types";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../components/filters/PlasmodiumSpeciesFilter";
import { isNotNull } from "../../../utils/number-utils";
import { MutationColors } from "../../../components/layers/treatment/MolecularMarkers/utils";
import { molecularMarkersMap, MOLECULAR_MARKERS } from "../../../components/filters/MolecularMarkerRadioFilter";
import { createCitationDataSources, selectDataSourcesByStudies } from "../common/utils";
import LineSymbol from "../../../assets/img/line.svg";
import { getMolecularMarkersOngoingStudiesStatusFromStatusId } from "../../../components/layers/treatment/MolecularMarkersOngoingStudies/utils";

export function createTreatmentSelectionData(
    theme: string,
    treatmentFilters: TreatmentFilters,
    yearFilters: number[],
    selection: SiteSelection | null,
    filteredStudies: TreatmentStudy[]
): SelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    if (siteFilteredStudies.length === 0) return null;

    const sortedStudies = sortStudies(siteFilteredStudies, treatmentFilters);
    const dataSources = createCitationDataSources(theme, sortedStudies);

    const studyObject = sortedStudies[0];

    return {
        kind: "common",
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        subtitle: geSubtitle(treatmentFilters, studyObject),
        filterOptions: [],
        filterSelection: [],
        studyObject,
        data: getTreatmentDataByMapType(sortedStudies, dataSources, { treatmentFilters, yearFilters }),
        dataSources: treatmentFilters.mapType === TreatmentMapType.MOLECULAR_MARKERS ? dataSources : undefined,
        curations: [],
        othersDetected: [],
        aditionalInformation:
            treatmentFilters.mapType === TreatmentMapType.TREATMENT_FAILURE ||
            treatmentFilters.mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE
                ? createTreatmentAditionalInfo(sortedStudies)
                : undefined,
    };
}

function getTreatmentDataByMapType(
    sortedStudies: TreatmentStudy[],
    dataSources: CitationDataSource[],
    filters: {
        treatmentFilters: TreatmentFilters;
        yearFilters: number[];
    }
) {
    switch (filters.treatmentFilters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return createTreatmentFailureChartData(sortedStudies, filters.yearFilters);
        case TreatmentMapType.MOLECULAR_MARKERS:
            return createMolecularMarkersChartData(sortedStudies, dataSources, filters.treatmentFilters);
        case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
            return createTherapeuticEfficacyStudies(sortedStudies);
        case TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES:
            return createMolecularMarkersOngoingStudies(sortedStudies);
    }
}

export function sortOngoingAndPlannedStudies(studies: TreatmentStudy[]) {
    return _.orderBy(studies, ["STUDY_SEQ"]);
}

function sortStudies(studies: TreatmentStudy[], treatmentFilters: TreatmentFilters) {
    switch (treatmentFilters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
        case TreatmentMapType.MOLECULAR_MARKERS:
            return _.orderBy(
                studies,
                study => parseInt(study.YEAR_START),
                treatmentFilters.mapType === TreatmentMapType.MOLECULAR_MARKERS ? "desc" : "asc"
            );
        case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
        case TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES:
            return sortOngoingAndPlannedStudies(studies);
    }
}

function geSubtitle(treatmentFilters: TreatmentFilters, studyObject: TreatmentStudy) {
    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species: any) => species.value === studyObject.PLASMODIUM_SPECIES
    )?.label;

    const molecularMarker = i18next.t(
        MOLECULAR_MARKERS.find((m: any) => treatmentFilters.molecularMarkers.includes(m.value))?.label
    );

    switch (treatmentFilters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return `${plasmodiumSpecies}, ${i18next.t(studyObject.DRUG_NAME)}`;
        case TreatmentMapType.MOLECULAR_MARKERS:
            return i18next.t("common.treatment.chart.molecular_markers.subtitle", {
                molecularMarker,
            });
        case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
            return i18next.t("common.treatment.chart.therapeutic_efficacy_studies.subtitle");
        case TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES:
            return i18next.t("common.treatment.chart.molecular_markers_ongoing_studies.subtitle");
    }
}

function rangeYears(startYear: number, endYear: number) {
    const years = [];
    while (startYear <= endYear) {
        years.push((startYear++).toString());
    }
    return years;
}

function createTreatmentFailureChartData(studies: TreatmentStudy[], yearFilters: number[]): TreatmentChartData {
    const currentYear = new Date().getFullYear();

    const startYear = yearFilters.length !== 0 ? yearFilters[0] : currentYear - 7;
    const endYear = yearFilters.length === 2 ? yearFilters[1] : currentYear;

    const years = rangeYears(startYear, endYear).sort();

    const { PLASMODIUM_SPECIES } = studies[0];

    const keys = _([
        {
            name: "treatment_failure_pp",
            color: "#940D12",
            marker: {
                symbol: "circle",
            },
        },
        {
            name: "treatment_failure_km",
            color: "#C0575B",
            marker: {
                symbol: `url(${LineSymbol})`,
            },
        },
        PLASMODIUM_SPECIES === "P._FALCIPARUM"
            ? {
                  name: "positive_day_3",
                  color: "#FB6A4A",
                  marker: {
                      symbol: "square",
                  },
              }
            : undefined,
    ])
        .compact()
        .value();

    const series = keys.map(key => {
        return {
            name: i18next.t(`common.treatment.chart.treatment_failure.${key.name}`),
            color: key.color,
            marker: key.marker,
            data: years.map(year => {
                const yearFilters: any = studies.filter(study => parseInt(year) === parseInt(study.YEAR_START))[0];
                return yearFilters
                    ? parseFloat((parseFloat(yearFilters[key.name.toUpperCase()] || -1) * 100).toFixed(2))
                    : -1;
            }),
        };
    });

    return { kind: "treatment", data: { series, years } };
}

function createMolecularMarkersChartData(
    studies: TreatmentStudy[],
    dataSources: CitationDataSource[],
    treatmentFilters: TreatmentFilters
): TreatmentMolecularMarkersChartData {
    const studies255 = studies;

    const years = studies255.map(study => {
        const dataSourceKeys = selectDataSourcesByStudies(dataSources, [study]);
        return `${study.YEAR_START} (${dataSourceKeys.join(",")})`;
    });

    const prioritiesByMutationCategory: Record<string, number> = {
        "wild type": 4,
        validated: 3,
        associated: 2,
        other: 1,
        Mutations: 1,
        "multiple copy number": 1,
    };

    const allStudies257 = R.flatten(studies255.map(study => study.groupStudies)).filter(study => +study.PROPORTION > 0);
    const allStudies257ByPriority = R.sortBy(study => prioritiesByMutationCategory[study.MUT_CAT], allStudies257);

    const studies257ByGenotype = R.groupBy(R.prop("GENOTYPE"), allStudies257ByPriority);
    const genotypes = Object.keys(studies257ByGenotype).filter(genotype => genotype !== "unspecified");

    const series = genotypes.map((genotype: string) => {
        const studies257: TreatmentStudy[] = studies257ByGenotype[genotype];

        return {
            maxPointWidth: 20,
            name: genotype,
            color: MutationColors[genotype] ? MutationColors[genotype].color : "000",
            data: studies255.map(study255 => {
                const study257 = studies257.find(study => study255.Code === study.K13_CODE);
                return {
                    y: study257 ? parseFloat((study257.PROPORTION * 100).toFixed(1)) : undefined,
                    n: study255.N,
                };
            }),
        };
    });

    return {
        kind: "treatment-molecular-markers",
        data: {
            years,
            series,
            markers: treatmentFilters.molecularMarkers.includes(molecularMarkersMap.Pfkelch13)
                ? {
                      "Wild type": extractMarkersByMutationCategory(allStudies257, "wild type"),
                      "Validated markers": extractMarkersByMutationCategory(allStudies257, "validated"),
                      "Candidate markers": extractMarkersByMutationCategory(allStudies257, "associated"),
                      "Other markers": extractMarkersByMutationCategory(allStudies257, "other"),
                  }
                : treatmentFilters.molecularMarkers.includes(molecularMarkersMap.Pfcrt)
                ? {
                      "Wild type": extractMarkersByMutationCategory(allStudies257, "wild type"),
                      Mutations: extractMarkersByMutationCategory(allStudies257, "mutations"),
                  }
                : {
                      "Wild type": extractMarkersByMutationCategory(allStudies257, "wild type"),
                      "Multiple copy numbers": extractMarkersByMutationCategory(allStudies257, "multiple copy number"),
                  },
        },
    };
}

function createOngoingAndPlannedTreatmentStudiesOverviewInfo(
    studyObject: TreatmentStudy
): OngoingAndPlannedTreatmentStudiesOverviewInfo {
    const status = getMolecularMarkersOngoingStudiesStatusFromStatusId(studyObject.SURV_STATUS);

    const overviewInfo = {
        [ONGOING_AND_PLANNED_TREATMENT_STUDY_OVERVIEW_INFO_KEYS.STATUS]: {
            label: i18next.t(`common.treatment.chart.ongoing_and_planned_treatment_studies.status`),
            value: status,
        },
        [ONGOING_AND_PLANNED_TREATMENT_STUDY_OVERVIEW_INFO_KEYS.PROPOSED_TIMEFRAME]: {
            label: i18next.t(`common.treatment.chart.ongoing_and_planned_treatment_studies.proposed_timeframe`),
            value: `${studyObject.YEAR_START} - ${studyObject.YEAR_END}`,
        },
        [ONGOING_AND_PLANNED_TREATMENT_STUDY_OVERVIEW_INFO_KEYS.LEAD_INSTITUTION]: {
            label: i18next.t(`common.treatment.chart.ongoing_and_planned_treatment_studies.lead_institution`),
            value: `${studyObject.INSTITUTION}${
                studyObject.INSTITUTION_CITY ? `, ${studyObject.INSTITUTION_CITY}` : ""
            }`,
        },
        [ONGOING_AND_PLANNED_TREATMENT_STUDY_OVERVIEW_INFO_KEYS.FUNDING_SOURCE]: {
            label: i18next.t(`common.treatment.chart.ongoing_and_planned_treatment_studies.funding_source`),
            value: studyObject.FUNDING_SOURCE,
        },
    };

    return overviewInfo;
}

function createTherapeuticEfficacyStudies(sortedStudies: TreatmentStudy[]): TherapeuticEfficacyStudiesData {
    const studyObject = sortedStudies[0];

    const studiesDetailsConfig = sortedStudies.map(study => ({
        title: i18next.t(`common.treatment.chart.ongoing_and_planned_treatment_studies.study_details`, {
            number: study.STUDY_SEQ,
            count: sortedStudies.length,
        }),
        studyDetails: {
            [THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS.AGE_GROUP]: {
                label: i18next.t(`common.treatment.chart.therapeutic_efficacy_studies.age_group`),
                value: study.AGE_GP,
            },
            [THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS.SPECIES]: {
                label: i18next.t(`common.treatment.chart.therapeutic_efficacy_studies.species`),
                value:
                    PLASMODIUM_SPECIES_SUGGESTIONS.find(species => species.value === study.PLASMODIUM_SPECIES)?.label ||
                    study.PLASMODIUM_SPECIES,
            },
            [THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS.DRUG]: {
                label: i18next.t(`common.treatment.chart.therapeutic_efficacy_studies.drug`),
                value: i18next.t(study.DRUG_NAME),
            },
            [THERAPEUTIC_EFFICACY_STUDY_DETAILS_KEYS.GENOTYPING]: {
                label: i18next.t(`common.treatment.chart.therapeutic_efficacy_studies.genotyping`),
                value: study.MM_LIST,
            },
        },
    }));

    return {
        kind: "therapeutic-efficacy-studies",
        data: {
            overviewInfo: createOngoingAndPlannedTreatmentStudiesOverviewInfo(studyObject),
            studiesDetailsConfig,
        },
    };
}

function createMolecularMarkersOngoingStudies(sortedStudies: TreatmentStudy[]): MolecularMarkersOngoingStudiesData {
    const studyObject = sortedStudies[0];

    const studiesDetailsConfig = sortedStudies.map(study => ({
        title: i18next.t(`common.treatment.chart.ongoing_and_planned_treatment_studies.study_details`, {
            number: study.STUDY_SEQ,
            count: sortedStudies.length,
        }),
        studyDetails: {
            [MOLECULAR_MARKERS_ONGOING_STUDY_DETAILS_KEYS.PROMPT_NAME]: {
                label: i18next.t(`common.treatment.chart.molecular_markers_ongoing_studies.study_initiated_following`),
                value: study.PROMPT_NAME,
            },
            [MOLECULAR_MARKERS_ONGOING_STUDY_DETAILS_KEYS.GEOGR_SCOPE_NAME]: {
                label: i18next.t(`common.treatment.chart.molecular_markers_ongoing_studies.sampling_strategy`),
                value: i18next.t(study.GEOGR_SCOPE_NAME),
            },
            [MOLECULAR_MARKERS_ONGOING_STUDY_DETAILS_KEYS.PROT_TYPE_NAME]: {
                label: i18next.t(`common.treatment.chart.molecular_markers_ongoing_studies.study_design`),
                value: study.PROT_TYPE_NAME,
            },
        },
    }));

    return {
        kind: "molecular-markers-ongoing-studies",
        data: {
            overviewInfo: createOngoingAndPlannedTreatmentStudiesOverviewInfo(studyObject),
            studiesDetailsConfig,
        },
    };
}

function extractMarkersByMutationCategory(mutationStudies: TreatmentStudy[], category: String) {
    const k13Mutations = _.uniqBy(
        mutationStudies.map(s => ({ GENOTYPE: s.GENOTYPE, MUT_CAT: s.MUT_CAT, MUT_ORDER: +s.MUT_ORDER })),
        "GENOTYPE"
    );

    return _.orderBy(
        k13Mutations.filter(m => m.MUT_CAT === category),
        "MUT_ORDER",
        "asc"
    ).map(mutation => ({
        name: mutation.GENOTYPE,
        color: MutationColors[mutation.GENOTYPE] ? MutationColors[mutation.GENOTYPE].color : "#000",
    }));
}

function createTreatmentAditionalInfo(studies: TreatmentStudy[]): AditionalInformation[] {
    const years = rangeYears(2010, new Date().getFullYear()).sort();

    const aditionalInfoByYears = years.map(year => {
        const studiesByYear: TreatmentStudy[] = studies.filter(study => parseInt(year) === parseInt(study.YEAR_START));

        if (studiesByYear.length === 0) {
            return undefined;
        } else {
            const studyObject = studiesByYear[0];

            const healthFacilityName =
                isNotNull(studyObject.HEALTHFACILITY_NAME) && studyObject.HEALTHFACILITY_NAME !== "Not applicable"
                    ? `${i18next.t("common.treatment.chart.treatment_failure.health_facility_name")} ${
                          studyObject.HEALTHFACILITY_NAME
                      }. `
                    : "";

            const numberOfPatients = `${studyObject.N} patients included`;
            const followUp = `${studyObject.FOLLOW_UP}${i18next.t(
                "common.treatment.chart.treatment_failure.follow_up"
            )}`;

            return {
                year,
                text: `${healthFacilityName} ${numberOfPatients} ${followUp}`,
                conducted: {
                    label: `Study conducted by`,
                    link: studyObject.CITATION_URL,
                    text: studyObject.INSTITUTION,
                },
            };
        }
    });

    return _.compact(_.orderBy(aditionalInfoByYears, "year", "desc"));
}
