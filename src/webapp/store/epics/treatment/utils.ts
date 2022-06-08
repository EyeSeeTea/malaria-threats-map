import i18next from "i18next";
import { getSiteTitle } from "../../../components/site-title/utils";
import {
    AditionalInformation,
    CitationDataSource,
    SelectionData,
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
import { MOLECULAR_MARKERS } from "../../../components/filters/MolecularMarkerFilter";
import { createCitationDataSources, selectDataSourcesByStudies } from "../common/utils";

export function createTreatmentSelectionData(
    theme: string,
    treatmentFilters: TreatmentFilters,
    selection: SiteSelection | null,
    filteredStudies: TreatmentStudy[]
): SelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    if (siteFilteredStudies.length === 0) return null;

    const dataSources = createCitationDataSources(theme, siteFilteredStudies);

    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), siteFilteredStudies);

    const studyObject = sortedStudies[0];

    return {
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        subtitle: geSubtitle(treatmentFilters, studyObject),
        filterOptions: [],
        filterSelection: [],
        studyObject,
        data:
            treatmentFilters.mapType === TreatmentMapType.MOLECULAR_MARKERS
                ? createMolecularMarkersChartData(sortedStudies, dataSources)
                : createTreatmentFailureChartData(sortedStudies),
        dataSources: treatmentFilters.mapType === TreatmentMapType.MOLECULAR_MARKERS ? dataSources : undefined,
        curations: [],
        othersDetected: [],
        aditionalInformation:
            treatmentFilters.mapType !== TreatmentMapType.MOLECULAR_MARKERS
                ? createTreatmentAditionalInfo(sortedStudies)
                : undefined,
    };
}

function geSubtitle(treatmentFilters: TreatmentFilters, studyObject: TreatmentStudy) {
    if (treatmentFilters.mapType === TreatmentMapType.MOLECULAR_MARKERS) {
        const molecularMarker = i18next.t(
            MOLECULAR_MARKERS.find((m: any) => m.value === treatmentFilters.molecularMarker).label
        );

        return i18next.t("common.treatment.chart.molecular_markers.subtitle", {
            molecularMarker,
        });
    } else {
        const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
            (species: any) => species.value === studyObject.PLASMODIUM_SPECIES
        ).label;

        return `${plasmodiumSpecies}, ${i18next.t(studyObject.DRUG_NAME)}`;
    }
}

function rangeYears(startYear: number, endYear: number) {
    const years = [];
    while (startYear <= endYear) {
        years.push((startYear++).toString());
    }
    return years;
}

function createTreatmentFailureChartData(studies: TreatmentStudy[]): TreatmentChartData {
    const currentYear = new Date().getFullYear();
    const years = rangeYears(2010, currentYear).sort();

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
                symbol: "diamond",
            },
        },
        PLASMODIUM_SPECIES === "P._FALCIPARUM"
            ? {
                  name: "positive_day_3",
                  color: "#FCCFA6",
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
            lineWidth: 0,
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
    dataSources: CitationDataSource[]
): TreatmentMolecularMarkersChartData {
    const sortedStudies = R.reverse(R.sortBy(study => parseInt(study.YEAR_START), studies));
    const years = sortedStudies.map(study => {
        const dataSourceKeys = selectDataSourcesByStudies(dataSources, [study]);
        return `${study.YEAR_START} (${dataSourceKeys.join(",")})`;
    });
    const groupStudies = R.flatten(sortedStudies.map(study => study.groupStudies));
    const k13Groups = R.groupBy(R.prop("GENOTYPE"), groupStudies);
    const series = Object.keys(k13Groups).map((genotype: string) => {
        const studies: TreatmentStudy[] = k13Groups[genotype];
        return {
            maxPointWidth: 20,
            name: genotype,
            color: MutationColors[genotype] ? MutationColors[genotype].color : "000",
            data: sortedStudies.map(k13Study => {
                const study = studies.find(study => k13Study.Code === study.K13_CODE);
                return {
                    y: study ? parseFloat((study.PROPORTION * 100).toFixed(1)) : undefined,
                };
            }),
        };
    });

    return {
        kind: "treatment-molecular-markers",
        data: {
            years,
            series,
            markers: {
                "Validated markers": Object.keys(k13Groups)
                    .map(genotype => ({
                        name: genotype,
                        color: MutationColors[genotype] ? MutationColors[genotype].color : "#000",
                    }))
                    .filter(marker => marker.name !== "WT"),
                "Associated markers": [],
                Wildtype: [
                    {
                        name: "WT",
                        color: MutationColors["WT"].color,
                    },
                ],
                "Other markers": [],
            },
        },
    };
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
            const followUp = `${studyObject.FOLLOW_UP} days follow-up. `;

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

    return _.compact(aditionalInfoByYears);
}
