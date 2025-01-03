import { DataLabelsFormatterCallbackFunction } from "highcharts";
import i18next from "i18next";
import { PreventionChartDataItem } from "../../../store/SelectionData";
import { PreventionMapType } from "../../../store/types";
import { ChartStyles } from "../../charts/Style";

export const preventionBarChartOptions: (
    maptype: PreventionMapType,
    data: PreventionChartDataItem[],
    showTitle: boolean
) => Highcharts.Options = (maptype, data, showTitle) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: (showTitle ? 90 : 50) + data.length * 40,
        style: {
            ...ChartStyles,
        },
        marginLeft: maptype === PreventionMapType.LEVEL_OF_INVOLVEMENT ? 265 : 220,
        marginRight: 60,
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
                crop: false,
                overflow: "allow",
                formatter: function () {
                    // @ts-ignore
                    const number: number = this.point.number;
                    if (maptype === PreventionMapType.RESISTANCE_STATUS) {
                        return `(n=${number})`;
                    }
                    return `${this.y}% (${number})`;
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
        case PreventionMapType.INTENSITY_STATUS:
            return [
                {
                    value: 100,
                    color: "#D0CECE",
                },
                {
                    value: 100.001,
                    color: "#717171",
                },
            ];
        // case PreventionMapType.LEVEL_OF_INVOLVEMENT:
        //     return [
        //         {
        //             value: 90,
        //             color: "#D0CECE",
        //         },
        //         {
        //             value: 98,
        //             color: "#717171",
        //         },
        //         {
        //             value: 100.001,
        //             color: "#717171",
        //         },
        //     ];
    }
}
