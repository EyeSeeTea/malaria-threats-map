import { DataLabelsFormatterCallbackFunction } from "highcharts";
import i18next from "i18next";
import { PreventionChartDataItem } from "../../../store/SelectionData";
import { PreventionMapType } from "../../../store/types";
import { IntensityStatusColors } from "../../layers/prevention/IntensityStatus/symbols";
import { INTENSITY_STATUS } from "../../layers/prevention/IntensityStatus/utils";
import { LevelOfInvolvementColors } from "../../layers/prevention/Involvement/symbols";
import { LEVEL_OF_INVOLVEMENT } from "../../layers/prevention/Involvement/utils";
import { ResistanceStatusColors } from "../../layers/prevention/ResistanceStatus/symbols";
import { ChartStyles } from "../../charts/Style";

export const preventionBarChartOptions: (
    maptype: PreventionMapType,
    data: PreventionChartDataItem[],
    showTitle: boolean
) => Highcharts.Options = (maptype, data, showTitle) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 90 + data.length * 40,
        style: {
            ...ChartStyles,
        },
        marginLeft: maptype === PreventionMapType.LEVEL_OF_INVOLVEMENT ? 265 : 210,
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
                    color: ResistanceStatusColors.Confirmed[0],
                },
                {
                    value: 98,
                    color: ResistanceStatusColors.Possible[0],
                },
                {
                    value: 100.001,
                    color: ResistanceStatusColors.Susceptible[0],
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
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return [
                {
                    value: 90,
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][0],
                },
                {
                    value: 98,
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT][0],
                },
                {
                    value: 100.001,
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][0],
                },
            ];
    }
}
