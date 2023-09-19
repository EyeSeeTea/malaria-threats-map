import i18next from "i18next";
import _ from "lodash";
import React, { useCallback } from "react";
import { TreatmentStudy } from "../../../../../../domain/entities/TreatmentStudy";
import { treatmentdashboardColors } from "../types";
import { useTreatment } from "../../useTreatment";
import { Option } from "../../../common/types";
import { ChartSerie, ChartType, TreatmentOverTimeState, TreatmentOverTimeType } from "./TreatmentOverTimeState";

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

    const [data, setData] = React.useState<ChartSerie[]>([]);
    const [chartType, setChartType] = React.useState<ChartType>(chartTypes[0].value);

    React.useEffect(() => {
        setData(createTreatmentBubbleChartData(filteredStudies, treatmentType, filters.years));
    }, [filteredStudies, treatmentType, filters.years]);

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
): ChartSerie[] {
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

    return series;
}
