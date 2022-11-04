import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import BubbleChartHelpImage from "../../../../assets/img/dashboards/bubble-chart-help.png";
import { BubleChartGroup, TreatmentOverTimeType } from "./types";
import { useTreatmentOverTime } from "./useTreatmentOverTime";
import HighchartsReact from "highcharts-react-official";
import More from "highcharts/highcharts-more";
import TreatmentFilterableDashboard from "../TreatmentFilterableDashboard";
import i18next from "i18next";
import { ChartStyles } from "../../../../components/charts/Style";

More(Highcharts);

interface TreatmentOverTimeDashboardProps {
    id?: string;
    type: TreatmentOverTimeType;
}

interface CustomPoint extends Highcharts.Point {
    z: number;
    drug: string;
    site: string;
    country: string;
}

const TreatmentOverTimeDashboard: React.FC<TreatmentOverTimeDashboardProps> = ({ id, type }) => {
    const { t } = useTranslation();
    const {
        filteredStudiesForDrugs,
        studiesCount,
        series,
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        excludeLowerPatients,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onMolecularMarkerChange,
    } = useTreatmentOverTime(type);

    const chartComponentRef = useRef(null);

    return (
        <TreatmentFilterableDashboard
            id={id}
            chartComponentRef={chartComponentRef}
            title={
                type === "treatmentFailure"
                    ? t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.title")
                    : t("common.dashboard.therapeuticEfficacyDashboards.parasiteClearanceOverTime.title")
            }
            type={type}
            drugsMultiple={false}
            drugsClearable={false}
            filteredStudiesForDrugs={filteredStudiesForDrugs}
            studiesCount={studiesCount}
            plasmodiumSpecies={plasmodiumSpecies}
            drugs={drugs}
            molecularMarker={molecularMarker}
            years={years}
            excludeLowerPatients={excludeLowerPatients}
            onPlasmodiumChange={onPlasmodiumChange}
            onDrugsChange={onDrugsChange}
            onYearsChange={onYearsChange}
            onExcludeLowerPatientsChange={onExcludeLowerPatientsChange}
            onMolecularMarkerChange={onMolecularMarkerChange}
        >
            <HighchartsReact highcharts={Highcharts} options={chartOptions(type, series)} ref={chartComponentRef} />
        </TreatmentFilterableDashboard>
    );
};

export default React.memo(TreatmentOverTimeDashboard);

function chartOptions(type: TreatmentOverTimeType, series: BubleChartGroup[]): Highcharts.Options {
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
                maxSize: 30,
            },
        },
        legend: {
            enabled: true,
            verticalAlign: "top",
            align: "left",
            x: 50,
            margin: 20,
        },

        title: {
            useHTML: true,
            text: `<div style="display: flex;flex-direction: row;align-items: center;"> 
                    ${i18next.t(
                        "common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.numberPatients"
                    )} 
                    <img width="100px" src=${BubbleChartHelpImage} alt='' />
                   </div>`,
            align: "right",
            x: -30,
            y: 40,
            margin: 20,
            style: {
                fontSize: "14px",
                fontWeight: "bold",
            },
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureOverTime.year"),
                margin: 20,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
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
                        <tr><th>${i18next.t("common.dashboard.tooltip.treatmentFailureRate")}</th><td>${
                    point.y
                }%</td></tr>
                        <br/>
                        <tr><th>${i18next.t(
                            "common.dashboard.tooltip.source.label"
                        )}</th><td><a href='https://www.niaid.nih.gov/' target='_blank'><i>${i18next.t(
                    "common.dashboard.tooltip.source.link"
                )}</i></a></td></tr>
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
