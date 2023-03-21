import { Stack, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { treatmentByDrugColors, TreatmentFailureSeriesItem } from "./types";
import { useTreatmentFailureByDrug } from "./useTreatmentFailureByDrug";
import More from "highcharts/highcharts-more";
import TreatmentFilterableDashboard from "../TreatmentFilterableDashboard";
import i18next from "i18next";
import { ChartStyles } from "../../../../components/charts/Style";

More(Highcharts);
const TreatmentFailureByDrugDashboard: React.FC = () => {
    const { t } = useTranslation();
    const {
        filteredStudiesForDrugs,
        selectedCountries,
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
    } = useTreatmentFailureByDrug();

    const countryLegend = React.useMemo(() => {
        return selectedCountries.map(iso => `${iso}: ${t(iso)}`).join("; ");
    }, [selectedCountries, t]);

    const drugLegend = React.useMemo(() => {
        return drugs?.length > 0 ? drugs.map(drug => `${drug.replace("DRUG_", "")}: ${t(drug)}`).join("; ") : "";
    }, [drugs, t]);

    return (
        <TreatmentFilterableDashboard
            title={t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureByDrug.title")}
            type="treatmentFailureByDrug"
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
            <Stack direction="column" alignItems="center" id="summary-treatment-failures">
                <Typography variant="body2" fontWeight="bold">
                    {t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureByDrug.studyOutcome")}
                </Typography>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={4}
                    sx={{ marginTop: 2, marginBottom: 4, width: "100%" }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LegendIcon color={treatmentByDrugColors[0]} />
                        <Typography variant="body2">
                            {t(
                                "common.dashboard.therapeuticEfficacyDashboards.treatmentFailureByDrug.lessThan10Patients"
                            )}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LegendIcon color={treatmentByDrugColors[1]} />
                        <Typography variant="body2">
                            {t(
                                "common.dashboard.therapeuticEfficacyDashboards.treatmentFailureByDrug.moreOrEqualThan10Patients"
                            )}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
            <div style={{ overflowX: "auto" }}>
                <Table width={Object.keys(data).length * 400}>
                    <thead>
                        <tr>
                            {Object.keys(data).map(drug => {
                                return <th key={drug}>{drug}</th>;
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            {Object.keys(data).map((drug, index) => {
                                return (
                                    <td key={drug}>
                                        {
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={chartOptions(index === 0, selectedCountries, data[drug])}
                                            />
                                        }
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </Table>
            </div>
            <Stack direction="column" alignItems="center" sx={{ marginBottom: 4 }}>
                <Typography variant="body2" fontWeight="bold">
                    {t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureByDrug.numStudies")}
                </Typography>
            </Stack>
            <Stack direction="column">
                <Typography variant="body2">{countryLegend}</Typography>
            </Stack>
            <Stack direction="column" sx={{ marginTop: 2 }}>
                <Typography variant="body2">{drugLegend}</Typography>
            </Stack>
        </TreatmentFilterableDashboard>
    );
};

export default TreatmentFailureByDrugDashboard;

const LegendIcon = styled.div<{ color: string }>`
    background: ${props => props.color};
    width: 12px;
    height: 12px;
`;

const Table = styled.table<{ width: number }>`
    width: ${props => props.width}px;
    table-layout: fixed;
    border-collapse: collapse;
    tr th {
        border: 2px solid #d3e0ed;
        font-size: 14px;
        font-weight: normal;
        height: 40px;
    }

    tr th {
        border-top: 0;
    }

    tr th:first-child {
        border-left: 0;
    }

    tr th:last-child {
        border-right: 0;
    }
    tr td {
        border: 2px solid #d3e0ed;
    }

    tr td:first-child {
        border-left: 0;
    }

    tr td:last-child {
        border-right: 0;
    }

    tr td {
        border-top: 0;
        border-bottom: 0;
    }
`;

function chartOptions(
    firstChart: boolean,
    countries: string[],
    series: TreatmentFailureSeriesItem[]
): Highcharts.Options {
    return {
        chart: {
            type: "bar",
            height: countries.length * 50 + 30,
            marginTop: 0,
            marginRight: 0,
            marginLeft: firstChart ? undefined : 0,
            style: {
                ...ChartStyles,
            },
        },
        title: {
            text: "",
        },
        xAxis: {
            visible: firstChart,
            categories: countries,
            labels: {
                style: {
                    fontSize: "14px",
                },
            },
        },
        yAxis: {
            tickInterval: 10,
            title: {
                text: "",
            },
        },
        plotOptions: {
            series: {
                stacking: "normal",
            },
        },
        tooltip: {
            headerFormat: "",
            pointFormatter: function () {
                return i18next.t("common.dashboard.therapeuticEfficacyDashboards.treatmentFailureByDrug.studies", {
                    count: this.y,
                });
            },
            style: {
                width: 150,
            },
        },
        series,
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
    };
}
