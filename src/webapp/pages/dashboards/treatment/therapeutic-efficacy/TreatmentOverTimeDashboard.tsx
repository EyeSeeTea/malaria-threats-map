import { Card, Grid, Stack } from "@mui/material";
import Highcharts from "highcharts";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import TreatmentFilters from "../filters/TreatmentFilters";
import BubbleChartHelpImage from "../../../../assets/img/dashboards/bubble-chart-help.png";
import { BubleChartGroup, TreatmentOverTimeType } from "./types";
import { useTreatmentOverTime } from "./useTreatmentOverTime";
import HighchartsReact from "highcharts-react-official";
import More from "highcharts/highcharts-more";

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

    return (
        <React.Fragment>
            <Title>
                {type === "treatmentFailure"
                    ? t("common.dashboard.therapeuticEfficacySection.treatmentFailureOverTime.title")
                    : t("common.dashboard.therapeuticEfficacySection.parasiteClearanceOverTime.title")}
            </Title>

            <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                    <Stack direction="column">
                        <TreatmentFilters
                            studies={filteredStudiesForDrugs}
                            drugsClearable={true}
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
                        <StudiesCountCard elevation={0}>
                            {t("common.dashboard.therapeuticEfficacySection.treatmentFailureOverTime.numStudies", {
                                count: studiesCount,
                            })}
                        </StudiesCountCard>
                    </Stack>
                </Grid>
                <Grid item md={9} xs={12}>
                    <DasboardCard elevation={0} sx={{ padding: "16px 32px 16px 32px" }}>
                        <HighchartsReact highcharts={Highcharts} options={chartOptions(type, series)} />
                    </DasboardCard>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default React.memo(TreatmentOverTimeDashboard);

const DasboardCard = styled(Card)`
    height: 600px;
`;

const StudiesCountCard = styled(Card)`
    padding: 24px;
`;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
`;

function chartOptions(type: TreatmentOverTimeType, series: BubleChartGroup[]): Highcharts.Options {
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
            y: 70,
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
