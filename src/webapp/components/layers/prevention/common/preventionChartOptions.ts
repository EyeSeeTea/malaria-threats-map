import { DataLabelsFormatterCallbackFunction } from "highcharts";
import { baseChart } from "../../../charts/chart-utils";

const preventionChartOptions: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    ...baseChart,
    title: {
        text: translations.mosquito_mortality,
    },
    xAxis: {
        type: "category",
    },
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: translations.mortality,
        },
    },
    plotOptions: {
        column: {
            dataLabels: {
                formatter: function () {
                    // @ts-ignore
                    return `${this.y}% (${this.point.number})`;
                } as DataLabelsFormatterCallbackFunction,
                enabled: true,
            },
            zones: [
                {
                    value: 97.001,
                    color: "#D3D3D3",
                },
                {
                    value: 100.001,
                    color: "#2f4f4f",
                },
            ],
        },
    },
    tooltip: {
        formatter: function () {
            const point = this.point as any;
            return `
<b><i>${point.species}</i></b><br>
${translations.mortality} (%): ${point.y}<br>
${translations.tested}: ${point.number}
`;
        },
    },
    series: [
        {
            maxPointWidth: 20,
            type: "column",
            name: translations.mortality,
            data: data,
        },
    ],
});
export default preventionChartOptions;
