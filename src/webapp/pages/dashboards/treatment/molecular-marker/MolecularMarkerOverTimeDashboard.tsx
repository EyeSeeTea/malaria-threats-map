import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMolecularMarker } from "./useMolecularMarkerOverTime";
import More from "highcharts/highcharts-more";
import TreatmentFilterableDashboard from "../TreatmentFilterableDashboard";
import i18next from "i18next";
import { Stack, Typography } from "@mui/material";
import { MolecularChartSerie } from "./types";

More(Highcharts);
const MolecularMarkerDashboard: React.FC = () => {
    const { t } = useTranslation();
    const {
        filteredStudiesForDrugs,
        studiesCount,
        plasmodiumSpecies,
        drugs,
        molecularMarker,
        years,
        excludeLowerPatients,
        data,
        onPlasmodiumChange,
        onDrugsChange,
        onYearsChange,
        onExcludeLowerPatientsChange,
        onMolecularMarkerChange,
    } = useMolecularMarker();

    return (
        <TreatmentFilterableDashboard
            id="summary-molecular-marker"
            isMolecularMarkerChart={true}
            title={t("common.dashboard.MolecularMarkerSection.molecularMarkerOverTime.title")}
            type="molecularMarkerStudy"
            drugsMultiple={true}
            drugsClearable={true}
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
            {data &&
                Object.keys(data.seriesByCountry).map(country => {
                    return (
                        <React.Fragment key={country}>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={chartOptions(data.years, data.seriesByCountry[country])}
                            />
                            <Stack direction="column" alignItems="center">
                                <Typography variant="body1" fontWeight="bold" sx={{ marginLeft: 8 }}>
                                    {t(country)}
                                </Typography>
                            </Stack>
                        </React.Fragment>
                    );
                })}
        </TreatmentFilterableDashboard>
    );
};

export default MolecularMarkerDashboard;

function chartOptions(years: number[], series: MolecularChartSerie[]): Highcharts.Options {
    return {
        chart: {
            type: "column",
            height: 550,
        },
        title: {
            useHTML: true,
            text: `<span style="width:100px;">${i18next.t(
                "common.dashboard.MolecularMarkerSection.molecularMarkerOverTime.chartTitle"
            )}</span>`,
            align: "center",
            style: {
                fontWeight: "bold",
                color: "black",
                fontSize: "14px",
            },
            widthAdjust: -200,
        },
        subtitle: {
            useHTML: true,
            text: `<span style="width:100px;">${i18next.t(
                "common.dashboard.MolecularMarkerSection.molecularMarkerOverTime.chartSubtitle"
            )}</span>`,
            align: "center",
            style: {
                fontWeight: "bold",
                color: "black",
                fontSize: "14px",
            },
            widthAdjust: -200,
        },
        xAxis: {
            categories: years.map(year => year.toString()),
            title: {
                text: i18next.t("common.dashboard.MolecularMarkerSection.molecularMarkerOverTime.year"),
                style: {
                    fontWeight: "bold",
                    color: "black",
                    fontSize: "14px",
                },
                margin: 20,
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: i18next.t("common.dashboard.MolecularMarkerSection.molecularMarkerOverTime.numStudies"),
                style: {
                    fontWeight: "bold",
                    color: "black",
                    fontSize: "14px",
                },
                margin: 32,
            },
        },
        legend: {
            align: "center",
            verticalAlign: "top",
            reversed: true,
        },
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
        series,
        credits: {
            enabled: false,
        },
    };
}
