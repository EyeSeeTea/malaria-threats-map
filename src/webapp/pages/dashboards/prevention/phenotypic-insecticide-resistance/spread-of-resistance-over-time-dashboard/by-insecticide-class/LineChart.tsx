import Highcharts from "highcharts";
import React from "react";
import { useTranslation } from "react-i18next";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import i18next from "i18next";
import {
    SpreadOfResistanceOverTimeByCountry,
    SpreadOfResistanceOverTimeChart,
    SpreadOfResistanceOverTimeSeries,
} from "../../types";
import { Stack, Typography } from "@mui/material";
import LineChartLegend from "./LineChartLegend";

const LineChart: React.FC<{
    allInsecticideClasses: string[];
    data: SpreadOfResistanceOverTimeChart;
    chartComponentRefs: React.MutableRefObject<HighchartsReact.RefObject[]>;
    selectedInsecticideClasses: string[];
    onInsecticideClassesChange: (insecticideClasses: string[]) => void;
    isDisaggregatedBySpecies: boolean;
}> = ({
    allInsecticideClasses,
    data,
    chartComponentRefs,
    isDisaggregatedBySpecies,
    selectedInsecticideClasses,
    onInsecticideClassesChange,
}) => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <LineChartLegend
                allInsecticideClasses={allInsecticideClasses}
                onInsecticideClassesChange={onInsecticideClassesChange}
                selectedInsecticideClasses={selectedInsecticideClasses}
            />
            <Stack direction="row" alignItems="center" sx={{ minHeight: 600 }}>
                <YAxisTitle>
                    {t(
                        "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.sumConfirmedResistance"
                    )}
                </YAxisTitle>

                <div style={{ overflowX: "auto" }}>
                    <Table>
                        <tbody>
                            {Object.keys(data.dataByCountry).map((isoCountry, countryIndex) => {
                                const isLastCountry = countryIndex === Object.keys(data.dataByCountry).length - 1;
                                if (isDisaggregatedBySpecies) {
                                    const species = Object.keys(data.dataByCountry[isoCountry]);

                                    return species.length > 0 ? (
                                        species.map((specie, specieIndex) => {
                                            const isLastSpecie = specieIndex === species.length - 1;
                                            const xAxisVisible = isLastCountry && isLastSpecie;

                                            const dataOfCountry = data.dataByCountry[
                                                isoCountry
                                            ] as SpreadOfResistanceOverTimeByCountry;

                                            const dataBySpecie = dataOfCountry[
                                                specie
                                            ] as SpreadOfResistanceOverTimeSeries[];

                                            const options = chartOptions(
                                                data.years,
                                                dataBySpecie,
                                                data.maxSumOfConfirmedResistance,
                                                xAxisVisible
                                            );

                                            return (
                                                <tr key={`${isoCountry}-${specie}`}>
                                                    {specieIndex === 0 && (
                                                        <td rowSpan={species.length}>{t(isoCountry)}</td>
                                                    )}
                                                    <td>{specie}</td>
                                                    <td>
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={options}
                                                            ref={(element: HighchartsReact.RefObject) =>
                                                                chartComponentRefs.current.push(element)
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <NotAvailableTR key={`${isoCountry}`} style={{ minHeight: 100 }}>
                                            <td>{t(isoCountry)}</td>
                                            <td></td>
                                            <td>{"Not available"}</td>
                                        </NotAvailableTR>
                                    );
                                }

                                const dataOfCountry = data.dataByCountry[
                                    isoCountry
                                ] as SpreadOfResistanceOverTimeSeries[];

                                const options = chartOptions(
                                    data.years,
                                    dataOfCountry,
                                    data.maxSumOfConfirmedResistance,
                                    isLastCountry
                                );

                                return (
                                    <tr key={isoCountry}>
                                        <CountryTd>
                                            <Typography variant="body1" sx={{ marginLeft: 8 }}>
                                                {t(isoCountry)}
                                            </Typography>
                                        </CountryTd>
                                        <td>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={options}
                                                ref={(element: HighchartsReact.RefObject) =>
                                                    chartComponentRefs.current.push(element)
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </Stack>
        </React.Fragment>
    );
};

const YAxisTitle = styled.span`
    display: inline-block;
    transform: rotate(-90deg);
    transform-origin: center;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    width: 60px;
`;

const Table = styled.table`
    table-layout: fixed;
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    tr:nth-child(even) {
        border-bottom: 2px solid #0000001a;
        border-top: 2px solid #0000001a;
    }
    tr:last-child {
        border-bottom: 0px;
    }
    tr td:nth-child(3) {
        width: 75%;
    }
`;

const CountryTd = styled.td`
    width: 30%;
`;

const NotAvailableTR = styled.tr`
    height: 100px;
`;

interface CustomPoint extends Highcharts.Point {
    insecticideClass: string;
    year: string;
    rangeYears: string;
    sumOfConfirmedResistanceSites: number;
    sumOfSites: number;
    numberOfSites: number;
    numberOfSitesConfirmedResistance: number;
}

function chartOptions(
    years: number[],
    data: SpreadOfResistanceOverTimeSeries[],
    maxSumConfirmedResistance: number,
    xAxisVisible: boolean
): Highcharts.Options {
    return {
        chart: {
            marginTop: 0,
            marginBottom: xAxisVisible ? 40 : 0,
        },

        tooltip: {
            useHTML: true,
            formatter: function () {
                const point = this.point as CustomPoint;
                return `
                    <div style="padding: 16px;">
                        <div><h4>${i18next.t("common.dashboard.tooltip.insecticideClass")}: ${i18next.t(
                    point.insecticideClass
                )}</h4></div>

                        <div>
                            <div style="border-bottom:1px solid #d0d0d0; display:flex; justify-content:space-between; align-items:center; padding-bottom: 10px;">
                                <div>${i18next.t(
                                    "common.dashboard.tooltip.year"
                                )}: </div><div style="padding-left:10px;">${point.year}</div>
                            </div>

                            <div style="border-bottom:1px solid #d0d0d0; display:flex; justify-content:space-between; align-items:center; padding-bottom: 10px; padding-top: 10px;">
                                <div>${i18next.t("common.dashboard.tooltip.numberOfSitesConfirmedResistance")} (${
                    point.year
                }): </div><div style="padding-left:10px;">${point.numberOfSitesConfirmedResistance}</div>
                            </div>

                            <div style="border-bottom:1px solid #d0d0d0; display:flex; justify-content:space-between; align-items:center; padding-bottom: 10px; padding-top: 10px;">
                                <div>${i18next.t("common.dashboard.tooltip.numberOfSites")} (${
                    point.year
                }): </div><div style="padding-left:10px;">${point.numberOfSites}</div>
                            </div>

                            <div style="border-bottom:1px solid #d0d0d0; display:flex; justify-content:space-between; align-items:center; padding-bottom: 10px; padding-top: 10px;">
                                <div>${i18next.t("common.dashboard.tooltip.numberOfSitesConfirmedResistance")} (${
                    point.rangeYears
                }): </div><div style="padding-left:10px;">${point.sumOfConfirmedResistanceSites}</div>
                            </div>

                            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom: 10px; padding-top: 10px;"><div>${i18next.t(
                                "common.dashboard.tooltip.numberOfSites"
                            )} (${point.rangeYears}): </div><div style="padding-left:10px;">${point.sumOfSites}</div>
                            </div>
                        </div>
                    </div>
                `;
            },
        },

        title: {
            text: "",
        },

        legend: {
            enabled: false,
        },

        xAxis: {
            categories: years.map(year => year.toString()),
            title: {
                text: xAxisVisible
                    ? i18next.t(
                          "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.year"
                      )
                    : "",
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                },
            },
            labels: {
                enabled: xAxisVisible,
            },
            gridLineWidth: 1,
            margin: 40,
            accessibility: {
                description: "Years",
            },
        },

        yAxis: {
            title: {
                text: "",
            },
            tickInterval: 5,
            min: -5,
            max: maxSumConfirmedResistance + 5,
            showFirstLabel: false,
            showLastLabel: false,
        },

        series: data as Highcharts.SeriesOptionsType[],

        credits: { enabled: false },
    };
}

export default React.memo(LineChart);
