import i18next from "i18next";
import _ from "lodash";
import React, { useCallback } from "react";
import { TreatmentStudy } from "../../../../../../domain/entities/TreatmentStudy";
import { treatmentdashboardColors } from "../types";
import { useTreatment } from "../../useTreatment";
import { Option } from "../../../common/types";
import {
    ChartType,
    TreatmentOverTimeData,
    TreatmentOverTimeGraphData,
    TreatmentOverTimeState,
    TreatmentOverTimeTableData,
    TreatmentOverTimeType,
} from "./TreatmentOverTimeState";
import * as R from "ramda";
import { isNotNull } from "../../../../../utils/number-utils";
import { getComparator, percentile } from "../../../../../components/Report/utils";
import { TableData } from "./table/TableData";

const chartTypes: Option<ChartType>[] = [
    {
        label: i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.graph"),
        value: "graph",
    },
    {
        label: i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.table"),
        value: "table",
    },
];

export function useTreatmentOverTime(treatmentType: TreatmentOverTimeType): TreatmentOverTimeState {
    const { filteredStudies, filteredStudiesForDrugs, studiesCount, filters } = useTreatment(false);

    const [data, setData] = React.useState<TreatmentOverTimeData>({ kind: "GraphData", series: [] });
    const [chartType, setChartType] = React.useState<ChartType>(chartTypes[0].value);

    React.useEffect(() => {
        if (chartType === "graph") {
            setData(createTreatmentBubbleChartData(filteredStudies, treatmentType, filters.years));
        } else {
            setData(createTreatmentTableData(filteredStudies));
        }
    }, [filteredStudies, treatmentType, filters.years, chartType]);

    const onChartTypeChange = useCallback((type: ChartType) => {
        setChartType(type);
    }, []);

    return {
        chartTypes,
        chartType,
        studiesCount,
        filteredStudiesForDrugs,
        data,
        filters,
        onChartTypeChange,
    };
}

export function createTreatmentBubbleChartData(
    studies: TreatmentStudy[],
    type: TreatmentOverTimeType,
    yearsFilter: [number, number]
): TreatmentOverTimeGraphData {
    const countries = _.uniq(studies.map(study => study.ISO2));

    const years = _.range(yearsFilter[0], yearsFilter[1] + 1);

    const series = countries.map((iso2, index) => {
        const studiesByCountry = studies.filter(study => study.ISO2 === iso2);
        const yearsWithStudies = _.uniq(studiesByCountry.map(study => +study.YEAR_START));
        const yearsWithoutStudies = years.filter(year => !yearsWithStudies.includes(year));
        const emptyStudies = yearsWithoutStudies.map(year => {
            return {
                YEAR_START: year,
                TREATMENT_FAILURE_PP: "-1",
                TREATMENT_FAILURE_KM: "-1",
                POSITIVE_DAY_3: " -1",
                SITE_NAME: "",
                ISO2: "",
                DRUG_NAME: "",
                N: 0,
                CITATION_URL: "",
                INSTITUTION: "",
            };
        });

        const finalStudies = [...studiesByCountry, ...emptyStudies];

        return {
            type: "bubble" as const,
            name: i18next.t(iso2),
            color: index <= treatmentdashboardColors.length - 1 ? treatmentdashboardColors[index] : "#000000",
            data: finalStudies.map(study => {
                const rawValue =
                    type === "treatmentFailure"
                        ? parseFloat(study.TREATMENT_FAILURE_PP) || parseFloat(study.TREATMENT_FAILURE_KM)
                        : parseFloat(study.POSITIVE_DAY_3);

                const fixedRawValue = isNaN(rawValue) ? -1 : rawValue;

                const value = +(fixedRawValue * 100).toFixed(2);

                const fixedValue = value > 100 ? 100 : value;

                return {
                    x: +study.YEAR_START,
                    y: fixedValue,
                    z: +study.N,
                    site: study.SITE_NAME,
                    country: study.ISO2,
                    drug: study.DRUG_NAME,
                    url: study.CITATION_URL,
                    urlText: study.INSTITUTION,
                };
            }),
        };
    });

    return {
        kind: "GraphData",
        series,
    };
}

export function createTreatmentTableData(studies: TreatmentStudy[]): TreatmentOverTimeTableData {
    const countryStudyGroups = R.groupBy((study: TreatmentStudy) => `${study.ISO2}`, studies);

    const rows: TableData[] = R.flatten(
        Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
            const countrySpeciesGroup = R.groupBy((study: TreatmentStudy) => `${study.DRUG_NAME}`, countryStudies);
            const entries = Object.entries(countrySpeciesGroup);
            let nStudies = 0;
            return R.flatten(
                entries.map(([drug, countrySpeciesStudies]) => {
                    const followUpCountrySpeciesGroup = R.groupBy(
                        (study: TreatmentStudy) => `${study.FOLLOW_UP}`,
                        countrySpeciesStudies
                    );

                    const followUpCountrySpeciesGroupStudies = Object.entries(followUpCountrySpeciesGroup);
                    nStudies += followUpCountrySpeciesGroupStudies.length;
                    return followUpCountrySpeciesGroupStudies.map(([followUpDays, followUpCountrySpeciesStudies]) => {
                        const yearSortedStudies = followUpCountrySpeciesStudies
                            .map((study: TreatmentStudy) => parseInt(study.YEAR_START))
                            .sort();
                        const minYear = yearSortedStudies[0];
                        const maxYear = yearSortedStudies[yearSortedStudies.length - 1];

                        const defaultProp = "TREATMENT_FAILURE_PP";
                        const fallbackProp = "TREATMENT_FAILURE_KM";

                        const rawValues = followUpCountrySpeciesStudies.map((study: TreatmentStudy) =>
                            isNotNull(study[defaultProp]) ? study[defaultProp] : study[fallbackProp]
                        );

                        const values = rawValues.map(value => parseFloat(value)).filter(value => !Number.isNaN(value));
                        const sortedValues = values.sort();

                        const min = values.length ? sortedValues[0] * 100 : "-";
                        const max = values.length ? sortedValues[values.length - 1] * 100 : "-";
                        const median = values.length ? R.median(sortedValues) * 100 : "-";
                        const percentile25 = values.length ? percentile(sortedValues, 0.25) * 100 : "-";
                        const percentile75 = values.length ? percentile(sortedValues, 0.75) * 100 : "-";

                        return {
                            ID: `${country}_${drug}`,
                            COUNTRY: i18next.t(`COUNTRY_NAME.${country}`),
                            ISO2: country,
                            DRUG: i18next.t(drug),
                            COUNTRY_NUMBER: nStudies,
                            FOLLOW_UP: followUpDays,
                            STUDY_YEARS: `${minYear} - ${maxYear}`,
                            NUMBER_OF_STUDIES: followUpCountrySpeciesStudies.length,
                            MEDIAN: median,
                            MIN: min,
                            MAX: max,
                            PERCENTILE_25: percentile25,
                            PERCENTILE_75: percentile75,
                        };
                    });
                    //.sort(getComparator(order, orderBy));
                })
            );
        })
    );

    return {
        kind: "TableData",
        rows,
    };
}
