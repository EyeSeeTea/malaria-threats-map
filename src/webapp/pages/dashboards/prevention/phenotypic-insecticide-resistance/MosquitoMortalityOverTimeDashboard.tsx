import Highcharts from "highcharts";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import PreventionFilterableDashboard from "../PreventionFilterableDashboard";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import More from "highcharts/highcharts-more";
import { useMosquitoMortalityOverTime } from "./useMosquitoMortalityOverTime";
import { MosquitoOverTimeData } from "./types";
import { Stack } from "@mui/material";
import i18next from "i18next";
import { useInfoPopup } from "../../common/popup/useInfoPopup";
import MosquitoMortalityOverTimePopup from "../../../../components/dashboards/prevention/MosquitoMortalityOverTimePopup";
More(Highcharts);

const MosquitoOverTimeDashboard: React.FC = () => {
    const { t } = useTranslation();

    const {
        insecticideTypeOptions,
        speciesOptions,
        typeOptions,
        count,
        data,
        filters,
        onInsecticideClassChange,
        onSpeciesChange,
        onYearsChange,
        onTypeChange,
        onOnlyIncludeBioassaysWithMoreMosquitoesChange,
        onOnlyIncludeDataByHealthChange,
    } = useMosquitoMortalityOverTime();

    const { openPopup, onChangeOpenPopup } = useInfoPopup();

    const chartComponentRefs = useRef([]);

    return (
        <React.Fragment>
            <PreventionFilterableDashboard
                id="mosquito-mortality-over-time"
                chart="mosquito-mortality-overtime"
                insecticideTypeOptions={insecticideTypeOptions}
                count={count}
                chartComponentRef={chartComponentRefs}
                title={t("common.dashboard.phenotypicInsecticideResistanceDashboards.mosquitoMortalityOverTime.title")}
                filters={filters}
                speciesOptions={speciesOptions}
                typeOptions={typeOptions}
                onInsecticideClassesChange={onInsecticideClassChange}
                onSpeciesChange={onSpeciesChange}
                onTypeChange={onTypeChange}
                onOnlyIncludeBioassaysWithMoreMosquitoesChange={onOnlyIncludeBioassaysWithMoreMosquitoesChange}
                onOnlyIncludeDataByHealthChange={onOnlyIncludeDataByHealthChange}
                onYearsChange={onYearsChange}
                onInsecticideTypesChange={undefined}
                onInfoClick={onChangeOpenPopup}
            >
                <Stack direction="row" alignItems="center" sx={{ minHeight: 250 }}>
                    <YAxisTitle>
                        {t(
                            "common.dashboard.phenotypicInsecticideResistanceDashboards.mosquitoMortalityOverTime.adjustedMortality"
                        )}
                    </YAxisTitle>

                    <div style={{ overflowX: "auto" }}>
                        <Table>
                            <tbody>
                                {Object.keys(data.dataByCountry).map((isoCountry, countryIndex) => {
                                    const species = Object.keys(data.dataByCountry[isoCountry]);

                                    return species.length > 0 ? (
                                        species.map((specie, specieIndex) => {
                                            const isLastCountry =
                                                countryIndex === Object.keys(data.dataByCountry).length - 1;
                                            const isLastSpecie = specieIndex === species.length - 1;
                                            const xAxisVisible = isLastCountry && isLastSpecie;

                                            const dataBySpecie = data.dataByCountry[isoCountry][specie];

                                            const options = chartOptions(data.years, dataBySpecie, xAxisVisible);

                                            return (
                                                <tr key={`${isoCountry}-${specie}`}>
                                                    {specieIndex === 0 && (
                                                        <td rowSpan={species.length}>{t(isoCountry)}</td>
                                                    )}
                                                    <td>{specie}</td>
                                                    <td>
                                                        <StyledHighcharts
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
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Stack>
            </PreventionFilterableDashboard>
            <MosquitoMortalityOverTimePopup
                years={filters.years}
                openInfoModal={openPopup}
                handleCloseInfoModal={onChangeOpenPopup}
            />
        </React.Fragment>
    );
};

export default React.memo(MosquitoOverTimeDashboard);

const YAxisTitle = styled.span`
    transform: matrix(0, -1, 1, 0, 0, 0);
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

const NotAvailableTR = styled.tr`
    height: 100px;
`;

const StyledHighcharts = styled(HighchartsReact)``;

function chartOptions(years: number[], data: MosquitoOverTimeData, xAxisVisible: boolean): Highcharts.Options {
    return {
        chart: {
            type: "boxplot",
            height: 300,
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
                text: i18next.t(
                    "common.dashboard.phenotypicInsecticideResistanceDashboards.mosquitoMortalityOverTime.year"
                ),
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                },
            },
            margin: 40,
            visible: xAxisVisible,
        },

        yAxis: {
            title: {
                text: "",
            },
            labels: {
                formatter: function () {
                    const label = this.axis.defaultLabelFormatter.call(this);

                    // Use thousands separator for four-digit numbers too
                    if (+label > 100) {
                        return "";
                    }
                    return label;
                },
            },
            min: 0,
            max: 120,
        },

        series: [
            {
                name: "Mortality",
                type: "boxplot",
                color: "#707070",
                fillColor: "#EAEAEAB3",
                data: data.boxplotData,
            },
            {
                name: "",
                type: "scatter",
                data: data.outliersData,
                marker: {
                    fillColor: "#2F559780",
                    lineWidth: 1,
                },
                tooltip: {
                    pointFormatter: function () {
                        return `x: ${this.category} y: ${this.y}`;
                    },
                },
            },
        ],
        credits: { enabled: false },
    };
}
