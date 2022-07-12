import { DataLabelsFormatterCallbackFunction } from "highcharts";
import i18next from "i18next";
import { PreventionChartDataItem, PreventionMapType } from "../../../store/types";
import { IntensityStatusColors } from "../../layers/prevention/IntensityStatus/symbols";
import { INTENSITY_STATUS } from "../../layers/prevention/IntensityStatus/utils";
import { ConfirmationStatusColors } from "../../layers/prevention/ResistanceStatus/symbols";

export const chartOptions: (
    maptype: PreventionMapType,
    data: PreventionChartDataItem[],
    showTitle: boolean
) => Highcharts.Options = (maptype, data, showTitle) => ({
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
        text: showTitle
            ? `<b>${i18next.t("common.prevention.chart.resistance.mosquito_mortality")}<br/>(${i18next.t(
                  "common.prevention.chart.resistance.number_of_tests"
              )})</b>`
            : undefined,
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
        opposite: true,
        min: 0,
        max: 100,
        tickInterval: 50,
        title: {
            text: "",
        },
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
            zones: getBarZones(maptype),
        },
    },
    tooltip: {
        enabled: false,
    },
    series: [
        {
            maxPointWidth: 20,
            type: "bar",
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

function getBarZones(maptype: PreventionMapType) {
    switch (maptype) {
        case PreventionMapType.RESISTANCE_STATUS:
            return [
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
            ];
        case PreventionMapType.INTENSITY_STATUS:
            return [
                // {
                //     value: 0,
                //     color: IntensityStatusColors[INTENSITY_STATUS.UNKNOWN][0],
                // },
                // {
                //     value: 40,
                //     color: IntensityStatusColors[INTENSITY_STATUS.SUSCEPTIBLE][0],
                // },
                // {
                //     value: 50,
                //     color: IntensityStatusColors[INTENSITY_STATUS.LOW_INTENSITY][0],
                // },
                // {
                //     value: 90,
                //     color: IntensityStatusColors[INTENSITY_STATUS.MODERATE_INTENSITY][0],
                // },
                // {
                //     value: 98,
                //     color: IntensityStatusColors[INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY][0],
                // },
                // {
                //     value: 100.001,
                //     color: IntensityStatusColors[INTENSITY_STATUS.HIGH_INTENSITY][0],
                // },
                {
                    value: 90,
                    color: "#D3D3D3",
                },
                {
                    value: 98,
                    color: IntensityStatusColors[INTENSITY_STATUS.LOW_INTENSITY][0],
                },
                {
                    value: 100.001,
                    color: IntensityStatusColors[INTENSITY_STATUS.HIGH_INTENSITY][0],
                },
            ];
    }
}
