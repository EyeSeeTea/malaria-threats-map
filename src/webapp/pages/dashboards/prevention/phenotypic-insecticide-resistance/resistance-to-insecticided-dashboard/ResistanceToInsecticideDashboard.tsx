import Highcharts from "highcharts";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../../PreventionFilterableDashboard";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Card } from "@mui/material";
import { useResistanceToInsecticide } from "./useResistanceToInsecticide";
import {
    ResistanceToInsecticideDataByClass,
    ResistanceToInsecticideDataByType,
    ResistanceToInsecticideSerie,
} from "../types";
import i18next from "i18next";
import StatusOfResistanceToInsecticidePopup from "../../../../../components/dashboards/prevention/StatusOfResistanceToInsecticidePopup";
import { useInfoPopup } from "../../../common/popup/useInfoPopup";
import { ResistanceToInsecticideChartType } from "../../types";

const ResistanceToInsecticideDashboard: React.FC = () => {
    const { t } = useTranslation();

    const { insecticideTypeOptions, chartType, chartTypes, categoriesCount, data, filters, onChartTypeChange } =
        useResistanceToInsecticide();

    const { openPopup, onChangeOpenPopup } = useInfoPopup();

    const chartComponentRefs = useRef([]);

    const handleChartTypeChange = useCallback(
        (type: unknown) => {
            onChartTypeChange(type as ResistanceToInsecticideChartType);
        },
        [onChartTypeChange]
    );

    return (
        <React.Fragment>
            <PreventionFilterableDashboard
                id="status-resistance-insecticide"
                insecticideTypeOptions={insecticideTypeOptions}
                chart="status-of-resistance-of-insecticide"
                chartTypes={chartTypes}
                chartType={chartType}
                count={categoriesCount}
                chartComponentRef={chartComponentRefs}
                title={t(
                    "common.dashboard.phenotypicInsecticideResistanceDashboards.statusOfResistanceToInsecticides.title"
                )}
                filters={filters}
                onChartTypeChange={handleChartTypeChange}
                onInfoClick={onChangeOpenPopup}
            >
                <DasboardCard elevation={0}>
                    {data.kind === "InsecticideByClass" ? (
                        <ChartByClass data={data.data} chartComponentRefs={chartComponentRefs} />
                    ) : (
                        <ChartByType data={data.data} chartComponentRefs={chartComponentRefs} />
                    )}
                </DasboardCard>
            </PreventionFilterableDashboard>
            <StatusOfResistanceToInsecticidePopup
                years={filters.years}
                openInfoModal={openPopup}
                handleCloseInfoModal={onChangeOpenPopup}
            />
        </React.Fragment>
    );
};

const ChartByClass: React.FC<{
    data: ResistanceToInsecticideDataByClass;
    chartComponentRefs: React.MutableRefObject<HighchartsReact.RefObject[]>;
}> = ({ data, chartComponentRefs }) => {
    const { t } = useTranslation();

    const maxStackedColumn = React.useMemo(() => {
        return getMaxStakedColumnByClass(data);
    }, [data]);

    return (
        <div style={{ overflowX: "auto" }}>
            <TableByClass>
                <tbody>
                    {Object.keys(data).map((isoCountry, index) => {
                        return (
                            <tr key={isoCountry}>
                                <td>{t(isoCountry)}</td>
                                <td>
                                    <StyledHighcharts
                                        highcharts={Highcharts}
                                        options={chartOptions(
                                            data[isoCountry].series,
                                            data[isoCountry].categories,
                                            index === 0,
                                            index === Object.keys(data).length - 1,
                                            maxStackedColumn
                                        )}
                                        ref={(element: HighchartsReact.RefObject) =>
                                            chartComponentRefs.current.push(element)
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </TableByClass>
        </div>
    );
};

const ChartByType: React.FC<{
    data: ResistanceToInsecticideDataByType;
    chartComponentRefs: React.MutableRefObject<HighchartsReact.RefObject[]>;
}> = ({ data, chartComponentRefs }) => {
    const { t } = useTranslation();

    const maxStackedColumn = React.useMemo(() => {
        return getMaxStakedColumnByType(data);
    }, [data]);

    return (
        <div style={{ overflowX: "auto" }}>
            <TableByType>
                <tbody>
                    {Object.keys(data).map((isoCountry, countryIndex) => {
                        const rowSpan = Object.values(data[isoCountry]).length;

                        return Object.keys(data[isoCountry]).map((subGroup, groupIndex) => {
                            const isLastChart =
                                countryIndex === Object.keys(data).length - 1 &&
                                groupIndex === Object.values(data[isoCountry]).length - 1;

                            const isFirstChart = countryIndex === 0 && groupIndex === 0;

                            return (
                                <tr key={`${isoCountry}-${subGroup}`}>
                                    {groupIndex === 0 && <td rowSpan={rowSpan}>{t(isoCountry)}</td>}

                                    <td>{<strong>{t(subGroup)}</strong>}</td>
                                    <td>
                                        <StyledHighcharts
                                            highcharts={Highcharts}
                                            options={chartOptions(
                                                data[isoCountry][subGroup].series,
                                                data[isoCountry][subGroup].categories,
                                                isFirstChart,
                                                isLastChart,
                                                maxStackedColumn
                                            )}
                                            ref={(element: HighchartsReact.RefObject) =>
                                                chartComponentRefs.current.push(element)
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        });
                    })}
                </tbody>
            </TableByType>
        </div>
    );
};

export default React.memo(ResistanceToInsecticideDashboard);

const TableByClass = styled.table`
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
    tr td:nth-child(1) {
        width: 10%;
        font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
        font-size: 11px;
        color: #666666;
    }

    tr td:nth-child(2) {
        width: 90%;
    }
    tr:nth-child(1) td:nth-child(2) {
        padding-top: 80px;
    }
    tr:nth-child(1) td:nth-child(1) {
        padding-top: 80px;
    }

    tr:last-child td:nth-child(1) {
        padding-bottom: 50px;
    }
`;

const TableByType = styled.table`
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
    tr td:nth-child(1) {
        width: 10%;
        font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
        font-size: 11px;
        color: #666666;
    }
    tr td:nth-child(2) {
        width: 15%;
        font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
        font-size: 11px;
        color: #666666;
    }
    tr td:nth-child(3) {
        width: 75%;
    }
    tr:nth-child(1) td:nth-child(2) {
        padding-top: 80px;
    }
    tr:nth-child(1) td:nth-child(1) {
        padding-top: 80px;
    }

    tr:last-child td:nth-child(1) {
        padding-bottom: 50px;
    }
`;

const DasboardCard = styled(Card)`
    min-height: 500px;
    padding: 42px;
`;

const StyledHighcharts = styled(HighchartsReact)``;

// function getMaxStakedColumn(chartData: ResistanceToInsecticideChartData) {
//     switch (chartData.kind) {
//         case "InsecticideByClass":
//             return getMaxStakedColumnByClass(chartData.data);
//         case "InsecticideByType":
//             return getMaxStakedColumnByType(chartData.data);
//     }
// }

function getMaxStakedColumnByType(data: ResistanceToInsecticideDataByType) {
    const valuesBySubGroups = Object.values(data);
    const values = valuesBySubGroups
        .map(group => Object.values(group))
        .flat()
        .map(({ series }) => series);

    const maxValues = values.reduce((acc: number[], countrySeries: ResistanceToInsecticideSerie[]) => {
        const maxValuesByType = countrySeries.reduce((acc, serieItem) => {
            if (acc.length === 0) {
                return serieItem.data;
            } else {
                return serieItem.data.map((value, index) => value + acc[index]);
            }
        }, []);

        return [...acc, ...maxValuesByType];
    }, []);

    return Math.max(...maxValues);
}

function getMaxStakedColumnByClass(data: ResistanceToInsecticideDataByClass) {
    const maxValues = Object.values(data).reduce(
        (acc: number[], dataByCountry: { categories: string[]; series: ResistanceToInsecticideSerie[] }) => {
            const maxValuesByType = dataByCountry.series.reduce((acc, serieItem) => {
                if (acc.length === 0) {
                    return serieItem.data;
                } else {
                    return serieItem.data.map((value, index) => value + acc[index]);
                }
            }, []);

            return [...acc, ...maxValuesByType];
        },
        []
    );

    return Math.max(...maxValues);
}

function chartOptions(
    series: ResistanceToInsecticideSerie[],
    categories: string[],
    enabledLegend: boolean,
    visibleYAxisLabels: boolean,
    max: number
): Highcharts.Options {
    const tickInterval = Math.floor(max / 20);

    return {
        chart: {
            type: "bar",
            height: categories.length * 50 + (enabledLegend ? 100 : 0) + (visibleYAxisLabels ? 60 : 0),
            marginTop: enabledLegend ? 100 : 0,
            marginBottom: visibleYAxisLabels ? 90 : 0,
            marginLeft: 150,
        },
        title: {
            align: "center",
            text: enabledLegend
                ? i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.insecticideResistanceStatus")
                : "",
            style: { fontSize: "14px", fontWeight: "bold", color: "black" },
        },
        xAxis: {
            categories,
        },
        yAxis: {
            title: {
                text: visibleYAxisLabels
                    ? i18next.t("common.dashboard.phenotypicInsecticideResistanceDashboards.numSites")
                    : "",
                style: { fontSize: "14px", fontWeight: "bold", color: "black" },
                y: 15,
                x: -50,
            },
            labels: {
                enabled: visibleYAxisLabels,
            },
            min: 0,
            max: max,
            tickInterval: tickInterval,
        },
        legend: {
            verticalAlign: "top",
            align: "center",
            reversed: true,
            enabled: enabledLegend,
            y: -10,
            x: -20,
        },
        plotOptions: {
            series: {
                stacking: "normal",
            },
        },
        series,
        credits: {
            enabled: false,
        },
    };
}
