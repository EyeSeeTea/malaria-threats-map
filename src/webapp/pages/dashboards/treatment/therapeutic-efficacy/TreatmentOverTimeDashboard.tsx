import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import BubbleChartHelpImage from "../../../../assets/img/dashboards/bubble-chart-help.png";
import { BubleChartGroup, TreatmentOverTimeType } from "./types";
import { useTreatmentOverTime } from "./useTreatmentOverTime";
import HighchartsReact from "highcharts-react-official";
import More from "highcharts/highcharts-more";
import TreatmentFilterableDashboard from "./TreatmentFilterableDashboard";

More(Highcharts);

interface TreatmentOverTimeDashboardProps {
    type: TreatmentOverTimeType;
}

const TreatmentOverTimeDashboard: React.FC<TreatmentOverTimeDashboardProps> = ({ type }) => {
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
            chartComponentRef={chartComponentRef}
            title={t("common.dashboard.therapeuticEfficacySection.treatmentFailureByDrug.title")}
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
            events: {
                load() {
                    setTimeout(this.reflow.bind(this), 0);
                },
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
                        Number of Patients <img width="100px" src=${BubbleChartHelpImage} alt='' />
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
                text: "Year",
                margin: 20,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                },
            },
            tickInterval: 2,
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text:
                    type === "treatmentFailure"
                        ? "Treatment Failure %"
                        : "Percentage of patients with parasitemia on day 3 (%)",
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
            enabled: true,
            pointFormat: "Patients {point.z}",
        },
        series,
        credits: {
            enabled: false,
        },
    };
}
