import Highcharts from "highcharts";
import React from "react";
//import BubbleChartHelpImage from "../../../../assets/img/dashboards/bubble-chart-help.png";

import HighchartsReact from "highcharts-react-official";
import More from "highcharts/highcharts-more";
import i18next from "i18next";
import { ChartStyles } from "../../../../../../components/charts/Style";
import { ChartSerie, TreatmentOverTimeType } from "../TreatmentOverTimeState";

More(Highcharts);

interface TreatmentOverTimeGraphProps {
    type: TreatmentOverTimeType;
    series: ChartSerie[];
    ref: React.MutableRefObject<any>;
}

interface CustomPoint extends Highcharts.Point {
    z: number;
    drug: string;
    site: string;
    country: string;
    url: string;
    urlText: string;
}

const TreatmentOverTimeGraph: React.FC<TreatmentOverTimeGraphProps> = ({ type, series, ref }) => {
    return <HighchartsReact highcharts={Highcharts} options={chartOptions(type, series)} ref={ref} />;
};

export default React.memo(TreatmentOverTimeGraph);

function chartOptions(type: TreatmentOverTimeType, series: ChartSerie[]): Highcharts.Options {
    return {
        chart: {
            type: "bubble",
            height: "600px",
            style: {
                ...ChartStyles,
            },
        },
        plotOptions: {
            bubble: {
                minSize: 1,
                maxSize: 25,
            },
        },
        legend: {
            enabled: true,
            verticalAlign: "top",
            align: "center",
            y: 20,
        },

        title: {
            text: "",
            // useHTML: true,
            // text: `<div style="display: flex;flex-direction: row;align-items: center;">
            //         ${i18next.t(
            //             "common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.numberPatients"
            //         )}
            //         <img width="120px" src=${BubbleChartHelpImage} alt='' />
            //        </div>`,
            // x: 0,
            // y: -8,
            // align: "right",
            // verticalAlign: "bottom",
            // style: {
            //     fontSize: "14px",
            //     fontWeight: "bold",
            // },
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.year"),
                margin: 20,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "black",
                },
            },
            tickInterval: 1,
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text:
                    type === "treatmentFailure"
                        ? i18next.t(
                              "common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.treatmentFailure"
                          )
                        : i18next.t(
                              "common.dashboard.therapeuticEfficacyDashboards.parasiteClearanceOverTime.parasitemiaOnDay3"
                          ),
                margin: 40,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "black",
                },
            },
            maxPadding: 0.2,
            plotLines:
                type === "treatmentFailure"
                    ? [
                          {
                              color: "#d43616",
                              dashStyle: "Solid",
                              width: 3,
                              value: 10,
                              zIndex: 3,
                          },
                      ]
                    : [],
            min: 0,
        },
        tooltip: {
            useHTML: true,
            formatter: function () {
                const point = this.point as CustomPoint;
                return `
                    <table>
                        <tr><th colspan="2"><h3>${point.site}, ${i18next.t(point.country)} (${point.x})</h3></th></tr>
                        <tr><th>${i18next.t("common.dashboard.tooltip.drug")}</th><td>${i18next.t(point.drug)}</td></tr>
                        <tr><th>${i18next.t("common.dashboard.tooltip.numberOfPatients")}</th><td>${point.z}</td></tr>
                        <tr><th>${
                            type === "treatmentFailure"
                                ? i18next.t("common.dashboard.tooltip.treatmentFailureRate")
                                : i18next.t("common.dashboard.tooltip.patientsWithParasitemiaOnDay3")
                        }</th><td>${point.y}%</td></tr>
                        <br/>
                        <tr><th>${i18next.t("common.dashboard.tooltip.source.label")}</th><td><a href=${
                    point.url
                } target='_blank'><i>${point.urlText}</i></a></td></tr>
                    </table>
                `;
            },
            style: {
                pointerEvents: "auto",
            },
            borderRadius: 30,
            shadow: { color: "#000000", offsetX: 1, offsetY: 3, opacity: 0.1, width: 6 },
            borderColor: "#ffffff8b",
            backgroundColor: "white",
        },
        series,
        credits: {
            enabled: false,
        },
    };
}
