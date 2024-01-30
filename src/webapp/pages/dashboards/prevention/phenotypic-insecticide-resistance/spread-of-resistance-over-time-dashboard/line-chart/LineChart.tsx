import Highcharts from "highcharts";
import React from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import i18next from "i18next";
import ReactDOMServer from "react-dom/server";

import {
    SpreadOfResistanceOverTimeLineChart,
    SpreadOfResistanceOverTimeLineSeries,
    SpreadOfResistanceOverTimeBySpecie,
    SpreadOfResistanceOverTimeChartType,
} from "../../types";
import LineChartLegend from "./LineChartLegend";
import Tooltip, { CustomPoint } from "./Tooltip";

const LineChart: React.FC<{
    allInsecticideClassesOrTypes: string[];
    data: SpreadOfResistanceOverTimeLineChart;
    chartComponentRefs: React.MutableRefObject<HighchartsReact.RefObject[]>;
    selectedInsecticideClassesOrTypes: string[];
    onInsecticideClassesOrTypesChange: (insecticideClassesOrTypes: string[]) => void;
    isDisaggregatedBySpecies: boolean;
    chartType: SpreadOfResistanceOverTimeChartType;
}> = ({
    allInsecticideClassesOrTypes,
    data,
    chartComponentRefs,
    isDisaggregatedBySpecies,
    selectedInsecticideClassesOrTypes,
    onInsecticideClassesOrTypesChange,
    chartType,
}) => {
    const { t } = useTranslation();
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom fontWeight="bold" marginBottom={2}>
                {t(
                    "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.sumConfirmedResistance"
                )}
            </Typography>
            <LineChartLegend
                chartType={chartType}
                allInsecticideClassesOrTypes={allInsecticideClassesOrTypes}
                onInsecticideClassesOrTypesChange={onInsecticideClassesOrTypesChange}
                selectedInsecticideClassesOrTypes={selectedInsecticideClassesOrTypes}
            />
            <Stack direction="row" alignItems="center" sx={{ minHeight: 600 }}>
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
                                            ] as SpreadOfResistanceOverTimeBySpecie;

                                            const dataBySpecie = dataOfCountry[
                                                specie
                                            ] as SpreadOfResistanceOverTimeLineSeries[];

                                            const options = chartOptions(
                                                data.years,
                                                dataBySpecie,
                                                data.maxValue,
                                                xAxisVisible,
                                                chartType
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
                                            <td>{t("common.dashboard.not-available")}</td>
                                        </NotAvailableTR>
                                    );
                                }

                                const dataOfCountry = data.dataByCountry[
                                    isoCountry
                                ] as SpreadOfResistanceOverTimeLineSeries[];

                                const options = chartOptions(
                                    data.years,
                                    dataOfCountry,
                                    data.maxValue,
                                    isLastCountry,
                                    chartType
                                );

                                return dataOfCountry.length ? (
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
                                ) : (
                                    <NotAvailableTR key={`${isoCountry}`} style={{ minHeight: 100 }}>
                                        <CountryTd>
                                            <Typography variant="body1" sx={{ marginLeft: 8 }}>
                                                {t(isoCountry)}
                                            </Typography>
                                        </CountryTd>
                                        <td>{t("common.dashboard.not-available")}</td>
                                    </NotAvailableTR>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </Stack>
        </React.Fragment>
    );
};

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

function chartOptions(
    years: number[],
    data: SpreadOfResistanceOverTimeLineSeries[],
    maxSumConfirmedResistance: number,
    xAxisVisible: boolean,
    chartType: SpreadOfResistanceOverTimeChartType
): Highcharts.Options {
    return {
        chart: {
            marginTop: 0,
            marginBottom: xAxisVisible ? 40 : 0,
            height: 250,
        },

        tooltip: {
            useHTML: true,
            formatter: function () {
                const point = this.point as CustomPoint;
                const htmlString = ReactDOMServer.renderToString(<Tooltip chartType={chartType} point={point} />);
                return htmlString;
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
            tickInterval: 20,
            min: -20,
            max: maxSumConfirmedResistance + 20,
            showFirstLabel: false,
            showLastLabel: false,
        },

        series: data as Highcharts.SeriesOptionsType[],

        credits: { enabled: false },
    };
}

export default React.memo(LineChart);
