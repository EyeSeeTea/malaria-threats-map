import { Card, Grid, Stack } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import More from "highcharts/highcharts-more";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "../filters/TreatmentFilters";
import BubbleChartHelpImage from "../../../../assets/img/dashboards/bubble-chart-help.png";
import { BubleChartGroup, useTreatmentFailureOverTime } from "./useTreatmentFailureOverTime";

More(Highcharts);

const TreatmentFailureOverTimeDashboard: React.FC = () => {
    const { t } = useTranslation();
    const {
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
    } = useTreatmentFailureOverTime();

    return (
        <React.Fragment>
            <Title>{t("common.dashboard.therapeuticEfficacySection.treatmentFailureOverTime.title")}</Title>

            <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                    <Stack direction="column">
                        <TreatmentFilters
                            plasmodiumSpecies={plasmodiumSpecies}
                            drugs={drugs}
                            molecularMarker={molecularMarker}
                            years={years}
                            excludeLowerPatients={excludeLowerPatients}
                            onPlasmodiumSpeciesChange={onPlasmodiumChange}
                            onDrugsChange={onDrugsChange}
                            onMolecularMarkerChange={onMolecularMarkerChange}
                            onYearsChange={onYearsChange}
                            onExcludeLowerPatientsChange={onExcludeLowerPatientsChange}
                        ></TreatmentFilters>
                        <StudiesCountCard elevation={0}></StudiesCountCard>
                    </Stack>
                </Grid>
                <Grid item md={9} xs={12}>
                    <DasboardCard elevation={0} sx={{ padding: "16px 32px 16px 32px" }}>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions(series)} />
                    </DasboardCard>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default React.memo(TreatmentFailureOverTimeDashboard);

const DasboardCard = styled(Card)`
    height: 600px;
`;

const StudiesCountCard = styled(Card)`
    height: 60px;
`;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
`;

function chartOptions(series: BubleChartGroup[]): Highcharts.Options {
    return {
        chart: {
            type: "bubble",
            height: "600px",
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
            y: 60,
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
                text: "Treatment Failure %",
                margin: 40,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                },
            },
            maxPadding: 0.2,
            plotLines: [
                {
                    color: "#d43616",
                    dashStyle: "Solid",
                    width: 3,
                    value: 10,
                    zIndex: 3,
                },
            ],
            min: 0,
            tickInterval: 20,
        },
        tooltip: {
            enabled: true,
            pointFormat: "Patients {point.z}",
        },
        series,
        // : [
        //     {
        //         type: "bubble",
        //         name: "Belgium",
        //         color: "rgba(223, 83, 83, .5)",
        //         data: [
        //             { x: 2010, y: 5, z: 20, name: "BE" },
        //             { x: 2012, y: 20, z: 30, name: "BE" },
        //             { x: 2014, y: 40, z: 40, name: "BE" },
        //         ],
        //     },
        //     {
        //         type: "bubble",
        //         name: "Spain",
        //         color: "rgba(150, 83, 83, .5)",
        //         data: [
        //             { x: 2012, y: 8, z: 10, name: "BE" },
        //             { x: 2016, y: 17, z: 20, name: "BE" },
        //             { x: 2018, y: 30, z: 24, name: "BE" },
        //         ],
        //     },
        // ],
        credits: {
            enabled: false,
        },
    };
}
