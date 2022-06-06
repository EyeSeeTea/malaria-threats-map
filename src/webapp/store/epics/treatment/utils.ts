import i18next from "i18next";
import { getSiteTitle } from "../../../components/site-title/utils";
import { SelectionData, TreatmentChartData } from "../../SelectionData";
import * as R from "ramda";
import _ from "lodash";
import { SiteSelection } from "../../types";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../components/filters/PlasmodiumSpeciesFilter";

export function createTreatmentSelectionData(
    theme: string,
    selection: SiteSelection | null,
    filteredStudies: TreatmentStudy[]
): SelectionData | null {
    if (!selection) return null;

    const siteFilteredStudies = filteredStudies.filter(study => study.SITE_ID === selection.SITE_ID);
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), siteFilteredStudies);

    const studyObject = sortedStudies[0];

    const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
        (species: any) => species.value === sortedStudies[0].PLASMODIUM_SPECIES
    ).label;

    const subtitle = `${plasmodiumSpecies}, ${i18next.t(sortedStudies[0].DRUG_NAME)}`;

    console.log({ sortedStudies });

    return {
        title: siteFilteredStudies.length > 0 ? getSiteTitle(theme, siteFilteredStudies[0]) : "",
        subtitle,
        filterOptions: [],
        filterSelection: [],
        studyObject,
        data: createTreatmentFailureChartData(sortedStudies),
        dataSources: [],
        curations: [],
        othersDetected: [],
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
                    ? parseFloat((parseFloat(yearFilters[key.name.toUpperCase()] || "0") * 100).toFixed(2))
                    : -1;
            }),
        };
    });

    return { kind: "treatment", data: { series, years } };
}
