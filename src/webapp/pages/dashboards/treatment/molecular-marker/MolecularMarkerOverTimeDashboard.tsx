import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMolecularMarker } from "./useMolecularMarkerOverTime";
import More from "highcharts/highcharts-more";
import TreatmentFilterableDashboard from "../TreatmentFilterableDashboard";
import i18next from "i18next";
import { Typography } from "@mui/material";
import { MolecularChartSerie } from "./types";
import { MolecularMarker } from "../../../../components/filters/MolecularMarkerFilter";
import styled from "styled-components";

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

    const chartComponentRefs = React.useRef([]);

    const max = React.useMemo(() => {
        if (!data) return 0;

        const dataValues = Object.values(data.seriesByCountry)
            .flat()
            .map(value => value.data)
            .flat();

        return Math.max(...dataValues);
    }, [data]);

    return (
        <TreatmentFilterableDashboard
            chartComponentRef={chartComponentRefs}
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
            <Table>
                <tbody>
                    {data &&
                        Object.keys(data.seriesByCountry).map((country, index) => {
                            const legendVisible = index === 0;

                            return (
                                <tr key={country}>
                                    <td>
                                        <Typography variant="body1" sx={{ marginLeft: 8 }}>
                                            {t(country)}
                                        </Typography>
                                    </td>

                                    <td>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            ref={(element: HighchartsReact.RefObject) =>
                                                chartComponentRefs.current.push(element)
                                            }
                                            options={chartOptions(
                                                legendVisible,
                                                data.years,
                                                data.seriesByCountry[country],
                                                molecularMarker,
                                                max
                                            )}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </TreatmentFilterableDashboard>
    );
};

export default MolecularMarkerDashboard;

const Table = styled.table`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    tr td:nth-child(2) {
        width: 80%;
    }
`;

function chartOptions(
    showLegend: boolean,
    years: number[],
    series: MolecularChartSerie[],
    molecularMarker: MolecularMarker,
    max: number
): Highcharts.Options {
    const chartPrefix = getChartPrefix(molecularMarker);

    return {
        chart: {
            type: "column",
            height: 550,
        },
        title: {
            useHTML: true,
            text:
                showLegend &&
                `<span style="width:100px;">${i18next.t(
                    `common.dashboard.MolecularMarkerSection.molecularMarkerOverTime.${chartPrefix}ChartTitle`
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
            text:
                showLegend &&
                molecularMarker === 1 &&
                `<span style="width:100px;">${i18next.t(
                    `common.dashboard.MolecularMarkerSection.molecularMarkerOverTime.${chartPrefix}ChartSubtitle`
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
            max,
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
            enabled: showLegend,
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

function getChartPrefix(molecularMarker: MolecularMarker) {
    switch (molecularMarker) {
        case 1: {
            return "artemisinin";
        }
        case 2:
            return "mutations";
        default:
            return "multiple";
    }
}
