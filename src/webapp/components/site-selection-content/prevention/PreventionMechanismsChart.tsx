import * as React from "react";
import Highcharts, { DataLabelsFormatterCallbackFunction } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { SelectionData, State } from "../../../store/types";
import { selectPreventionSelectionStudies } from "../../../store/reducers/prevention-reducer";
import { Divider, Typography } from "@mui/material";
import i18next from "i18next";

const Flex = styled.div`
    display: flex;
`;

const FlexCol = styled.div<{ flex?: number }>`
    flex: ${props => props.flex || 1};
`;

const preventionMechanismAssaysBarChartOptions: (
    data: any,
    years: string[],
    translations: any
) => Highcharts.Options = (data, years, translations) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 120 + years.length * 40,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    legend: {
        verticalAlign: "top",
        align: "center",
        x: 25,
        enabled: true,
        symbolWidth: 0.001,
        symbolPadding: 0.001,
        symbolHeight: 0.001,
        itemStyle: { fontWeight: "normal" },
    },
    credits: {
        enabled: false,
    },
    title: {
        x: 25,
        y: 25,
        text: translations.title,
        style: {
            fontSize: "12px",
        },
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

const preventionMechanismAllelicBarChartOptions: (
    data: any,
    years: string[],
    translations: any
) => Highcharts.Options = (data, years, translations) => ({
    chart: {
        maxPointWidth: 20,
        type: "bar",
        height: 120 + years.length * 40,
        width: 150,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
        marginTop: 95,
    },
    credits: {
        enabled: false,
    },
    title: {
        text: translations.title,
        style: {
            fontSize: "12px",
        },
        y: 25,
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
    },
    plotOptions: {
        bar: {
            dataLabels: {
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

const translations = {
    title: i18next.t("common.prevention.chart.resistance_mechanism.title"),
};
const translations2 = {
    title: i18next.t("common.prevention.chart.resistance_mechanism.allelic"),
};

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
                                        <Flex>
                                            <FlexCol>
                                                <HighchartsReact
                                                    highcharts={Highcharts}
                                                    options={preventionMechanismAssaysBarChartOptions(
                                                        data[specie][type].assays,
                                                        data[specie][type].years.map(year => year.toString()),
                                                        translations
                                                    )}
                                                />
                                            </FlexCol>
                                            <FlexCol>
                                                <HighchartsReact
                                                    highcharts={Highcharts}
                                                    options={preventionMechanismAllelicBarChartOptions(
                                                        data[specie][type].allelics,
                                                        data[specie][type].years.map(year => year.toString()),
                                                        translations2
                                                    )}
                                                />
                                            </FlexCol>
                                        </Flex>
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
