import * as React from "react";
import Highcharts, { DataLabelsFormatterCallbackFunction } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { State } from "../../../store/types";
import { selectPreventionSelectionStudies } from "../../../store/reducers/prevention-reducer";
import { Divider, Typography } from "@mui/material";
import { SelectionData } from "../../../store/SelectionData";
import { ChartStyles } from "../../charts/Style";

function calculateChartHeight(yearsCount: number) {
    return yearsCount * 60;
}

const preventionMechanismAssaysBarChartOptions: (data: any, years: string[]) => Highcharts.Options = (data, years) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: calculateChartHeight(years.length),
        style: {
            ...ChartStyles,
        },
    },
    legend: {
        enabled: false,
    },
    credits: {
        enabled: false,
    },
    title: {
        text: "",
    },
    xAxis: [
        {
            type: "category",
        },
    ],
    yAxis: {
        title: {
            text: "",
        },
        min: -10,
        max: 10,
        tickAmount: 3,
        labels: {
            enabled: false,
        },
    },
    tooltip: {
        pointFormat: "<b>{point.names}</b>",
    },
    plotOptions: {
        bar: {
            crop: false,
            overflow: "none",
            dataLabels: {
                formatter: function () {
                    // @ts-ignore
                    return this.y < 0 ? this.y * -1 : this.y;
                } as DataLabelsFormatterCallbackFunction,
                enabled: true,
            },
            stacking: "normal",
        },
    },
    series: data,
});

const preventionMechanismAllelicBarChartOptions: (data: any, years: string[]) => Highcharts.Options = (
    data,
    years
) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: calculateChartHeight(years.length),
        style: {
            ...ChartStyles,
        },
    },
    credits: {
        enabled: false,
    },
    title: {
        text: "",
    },
    xAxis: {
        categories: years,
        visible: false,
    },
    yAxis: {
        title: {
            text: "",
        },
        visible: false,
        min: 0,
        max: 100,
    },
    plotOptions: {
        bar: {
            dataLabels: {
                crop: false,
                overflow: "allow",
                formatter: function () {
                    // @ts-ignore
                    return this.point.value;
                } as DataLabelsFormatterCallbackFunction,
                enabled: true,
            },
        },
    },
    series: data,
    legend: {
        enabled: false,
    },
});

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionSelectionStudies: selectPreventionSelectionStudies(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    selectionData?: SelectionData;
};
type Props = StateProps & OwnProps;

const PreventionMechanismsChart = ({ selectionData }: Props) => {
    const { t } = useTranslation();

    const data = React.useMemo(() => {
        if (selectionData.data.kind === "prevention-mechanism") {
            return selectionData.data.data;
        } else {
            return null;
        }
    }, [selectionData]);

    return (
        <React.Fragment>
            {Object.keys(data).map((specie, specieIndex) => {
                const dataItems = Object.keys(data[specie]);

                return (
                    <React.Fragment key={specie}>
                        <Typography color="primary" variant="body2" fontWeight="bold" key={specie}>
                            {t(specie)}
                        </Typography>
                        {dataItems.map((type, typeIndex) => {
                            return (
                                <>
                                    <Typography key={`type_${type}`} variant="caption" fontWeight="bold">
                                        {t(type)}
                                    </Typography>
                                    <div key={`chart_${type}`}>
                                        <Table height={calculateChartHeight(data[specie][type].years.length)}>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        {t("common.prevention.chart.resistance_mechanism.DETECTED")}
                                                    </th>
                                                    <th>
                                                        {t("common.prevention.chart.resistance_mechanism.NOT_DETECTED")}
                                                    </th>
                                                    <th>{t("common.prevention.chart.resistance_mechanism.allelic")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan={2}>
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={preventionMechanismAssaysBarChartOptions(
                                                                data[specie][type].assays,
                                                                data[specie][type].years.map(year => year.toString())
                                                            )}
                                                        />
                                                    </td>
                                                    <td>
                                                        <HighchartsReact
                                                            highcharts={Highcharts}
                                                            options={preventionMechanismAllelicBarChartOptions(
                                                                data[specie][type].allelics,
                                                                data[specie][type].years.map(year => year.toString())
                                                            )}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        {typeIndex < dataItems.length - 1 ? <Divider sx={{ marginBottom: 2 }} /> : null}
                                    </div>
                                </>
                            );
                        })}
                        {specieIndex < Object.keys(data).length - 1 ? (
                            <Divider sx={{ marginBottom: 2, borderBottomWidth: 2 }} />
                        ) : null}
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
};
export default connect(mapStateToProps)(PreventionMechanismsChart);

const Table = styled.table<{ height: number }>`
    height: ${props => props.height}px;
    margin-top: 24px;
    width: 100%;
    border-collapse: collapse;
    tr th {
        font-weight: normal;
        text-align: left;
        vertical-align: top;
    }
    tr th:nth-child(1) {
        padding-left: 60px;
        width: 35%;
    }
    tr th:nth-child(2) {
        padding-left: 10px;
        padding-right: 5px;
        width: 30%;
    }
    tr th:nth-child(3) {
        width: 30%;
    }
`;
