import i18next from "i18next";
import { getSiteTitle } from "../../../components/site-title/utils";
import { AditionalInformation, SelectionData, TreatmentChartData } from "../../SelectionData";
import * as R from "ramda";
import _ from "lodash";
import { SiteSelection } from "../../types";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../components/filters/PlasmodiumSpeciesFilter";
import { isNotNull } from "../../../utils/number-utils";
import LineSymbol from "../../../assets/img/line.svg";

export function createTreatmentSelectionData(
    theme: string,
    selection: SiteSelection | null,
    filteredStudies: TreatmentStudy[]
): SelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);

    if (siteFilteredStudies.length === 0) return null;

    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), siteFilteredStudies);

    const studyObject = sortedStudies[0];

    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species: any) => species.value === sortedStudies[0].PLASMODIUM_SPECIES
    ).label;

    const subtitle = `${plasmodiumSpecies}, ${i18next.t(sortedStudies[0].DRUG_NAME)}`;

    return {
        kind: "common",
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        subtitle,
        filterOptions: [],
        filterSelection: [],
        studyObject,
        data: createTreatmentFailureChartData(sortedStudies),
        dataSources: undefined,
        curations: [],
        othersDetected: [],
        aditionalInformation: createTreatmentAditionalInfo(sortedStudies),
    };
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
    const years = rangeYears(currentYear - 7, currentYear).sort();

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
