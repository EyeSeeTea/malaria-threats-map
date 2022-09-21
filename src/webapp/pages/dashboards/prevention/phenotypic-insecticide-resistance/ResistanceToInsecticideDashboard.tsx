import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../PreventionFilterableDashboard";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { useResistanceToInsecticide } from "./useResistanceToInsecticide";
import { ResistanceToInsecticideSerie } from "./types";

const ResistanceToInsecticideDashboard: React.FC = () => {
    const { t } = useTranslation();

    const {
        categories,
        data,
        filters,
        onInsecticideClassChange,
        onYearsChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = useResistanceToInsecticide();

    const chartComponentRefs = useRef([]);

    return (
        <PreventionFilterableDashboard
            chartComponentRef={chartComponentRefs}
            title={t(
                "common.dashboard.phenotypicInsecticideResistanceDashboards.statusOfResistanceToInsecticides.title"
            )}
            filters={filters}
            onInsecticideClassesChange={onInsecticideClassChange}
            onYearsChange={onYearsChange}
            onOnlyIncludeBioassaysWithMoreMosquitoesChange={onOnlyIncludeBioassaysWithMoreMosquitoesChange}
            onOnlyIncludeDataByHealthChange={onOnlyIncludeDataByHealthChange}
        >
            <div style={{ overflowX: "auto" }}>
                <Table>
                    {Object.keys(data).map((isoCountry, index) => {
                        return (
                            <tr key={isoCountry}>
                                <td>{t(isoCountry)}</td>
                                <td>
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={chartOptions(
                                            data[isoCountry],
                                            categories,
                                            index === 0,
                                            index === Object.keys(data).length - 1
                                        )}
                                        ref={element => chartComponentRefs.current.push(element)}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </Table>
            </div>
        </PreventionFilterableDashboard>
    );
};

export default React.memo(ResistanceToInsecticideDashboard);

const Table = styled.table`
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    tr:nth-child(even) {
        border-bottom: 2px solid #0000001a;
        border-top: 2px solid #0000001a;
    }
    tr td:nth-child(2) {
        width: 100%;
    }
`;

function chartOptions(
    series: ResistanceToInsecticideSerie[],
    categories: string[],
    enabledLegend: boolean,
    visibleYAxisLabels: boolean
): Highcharts.Options {
    return {
        chart: {
            type: "bar",
            height: enabledLegend || visibleYAxisLabels ? 250 : 200,
            marginTop: enabledLegend ? 60 : 0,
            marginBottom: visibleYAxisLabels ? 60 : 0,
        },
        title: {
            align: "left",
            text: enabledLegend ? "Insecticide resistance status" : "",
            style: { fontSize: "14px", fontWeight: "bold", color: "black" },
        },
        xAxis: {
            categories,
        },
        yAxis: {
            title: {
                text: visibleYAxisLabels ? "Number of sites" : "",
                style: { fontSize: "14px", fontWeight: "bold", color: "black" },
                y: 20,
                x: -50,
            },
            labels: {
                enabled: visibleYAxisLabels,
            },
        },
        legend: {
            verticalAlign: "top",
            align: "center",

            enabled: enabledLegend,
            y: -40,
            x: 0,
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
