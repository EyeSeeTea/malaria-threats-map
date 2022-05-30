import { DataLabelsFormatterCallbackFunction } from "highcharts";
import i18next from "i18next";
import { PreventionChartDataItem } from "../../../store/types";
import { ConfirmationStatusColors } from "../../layers/prevention/ResistanceStatus/symbols";

export const chartOptions: (
    data: PreventionChartDataItem[],
    translations: any,
    showTitle: boolean
) => Highcharts.Options = (data, translations, showTitle) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 90 + data.length * 40,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
        marginLeft: 210,
    },
    title: {
        text: showTitle ? `<b>${translations.mosquito_mortality}</b>` : undefined,
        style: {
            fontSize: "11px",
        },
        x: 80,
    },
    xAxis: {
        type: "category",
        labels: {
            style: {
                whiteSpace: "nowrap",
            },
            align: "left",
            reserveSpace: true,
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

export const getTranslations = () => ({
    mortality: i18next.t("common.prevention.chart.resistance_status.mortality"),
    mosquito_mortality: `${i18next.t("common.prevention.chart.resistance_status.mosquito_mortality")}<br/>(${i18next.t(
        "common.prevention.chart.resistance_status.number_of_tests"
    )})`,
    tested: i18next.t("common.prevention.chart.resistance_status.tested"),
    type: i18next.t("common.prevention.chart.resistance_status.type"),
});
