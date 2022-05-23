import { DataLabelsFormatterCallbackFunction } from "highcharts";
import i18next from "i18next";
import _ from "lodash";
import * as R from "ramda";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { Option } from "../../../BasicSelect";
import { ChartData, ChartDataItem } from "./ResistanceStatusChart";
import { ConfirmationStatusColors } from "./symbols";

export const resolveResistanceStatus = (percentage: number) => {
    if (percentage < 0.9) {
        return "Confirmed";
    } else if (percentage >= 0.9 && percentage < 0.98) {
        return "Possible";
    } else {
        return "Susceptible";
    }
};

export const chartOptions: (data: ChartDataItem[], translations: any) => Highcharts.Options = (data, translations) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 90 + data.length * 40,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    title: {
        text: `<b>${translations.mosquito_mortality}</b>`,
        style: {
            fontSize: "11px",
        },
    },
    subtitle: {
        text: `<b>${translations.insecticideTypeLabel}</b>:${translations.insecticideType}`,
        style: {
            fontSize: "11px",
        },
    },
    xAxis: {
        type: "category",
        labels: {
            style: {
                whiteSpace: "nowrap",
            },
        },
    },
    yAxis: {
        min: 0,
        max: 100,
        tickInterval: 50,
        title: {
            text: "",
        },
        plotLines: [
            {
                value: 90,
                color: "#d43501",
                dashStyle: "Dash",
                width: 2,
                zIndex: 5,
                label: {
                    text: "",
                },
            },
        ],
    },
    plotOptions: {
        bar: {
            dataLabels: {
                formatter: function () {
                    // @ts-ignore
                    return `${this.y}% (${this.point.number})`;
                } as DataLabelsFormatterCallbackFunction,
                enabled: true,
                style: {
                    fontWeight: "normal",
                },
            },
            zones: [
                {
                    value: 90,
                    color: ConfirmationStatusColors.Confirmed[0],
                },
                {
                    value: 98,
                    color: ConfirmationStatusColors.Possible[0],
                },
                {
                    value: 100.001,
                    color: ConfirmationStatusColors.Susceptible[0],
                },
            ],
        },
    },
    tooltip: {
        enabled: false,
    },
    series: [
        {
            maxPointWidth: 20,
            type: "bar",
            name: translations.mortality,
            data: data,
        },
    ],
    legend: {
        enabled: false,
    },
    credits: {
        enabled: false,
    },
});

export const getTranslations = (insecticide_type: string) => ({
    mortality: i18next.t("common.prevention.chart.resistance_status.mortality"),
    mosquito_mortality: `${i18next.t("common.prevention.chart.resistance_status.mosquito_mortality")}(${i18next.t(
        "common.prevention.chart.resistance_status.number_of_tests"
    )})`,
    tested: i18next.t("common.prevention.chart.resistance_status.tested"),
    type: i18next.t("common.prevention.chart.resistance_status.type"),
    insecticideTypeLabel: i18next.t("common.prevention.chart.insecticide"),
    insecticideType: i18next.t(insecticide_type),
});

export function createChartData(studies: PreventionStudy[], speciesFilter: Option[]): ChartData {
    const studiesFiltered = studies.filter(
        study => !speciesFilter || !speciesFilter.length || speciesFilter.map(s => s.value).includes(study.SPECIES)
    );

    const bySpeciesAndInsecticideType = _(studiesFiltered)
        .groupBy(({ SPECIES }) => SPECIES)
        .mapValues(studies => {
            return _(studies)
                .groupBy(({ INSECTICIDE_TYPE }) => INSECTICIDE_TYPE)
                .mapValues(studies => createChartDataItems(studies))
                .value();
        })
        .value();

    return bySpeciesAndInsecticideType;
}

export function createChartDataItems(studies: PreventionStudy[]): ChartDataItem[] {
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_CONC}`;
    }, sortedStudies);

    const simplifiedStudies = R.sortWith(
        [R.ascend(R.prop("YEAR_START")), R.ascend(R.prop("INSECTICIDE_TYPE"))],
        R.values(cleanedStudies).map(
            (groupStudies: PreventionStudy[]) =>
                R.sortBy(study => parseFloat(study.MORTALITY_ADJUSTED), groupStudies)[0]
        )
    );
    const data = simplifiedStudies.map(study => ({
        name: `${study.YEAR_START}, ${i18next.t(study.INSECTICIDE_TYPE)} ${i18next.t(study.INSECTICIDE_CONC)}`,
        y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
        number: study.NUMBER,
    }));

    return data;
}
