import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import Citation from "../../../charts/Citation";
import * as R from "ramda";
import { ResistanceMechanismColors } from "./symbols";
import { RESISTANCE_MECHANISM } from "./utils";
import { baseChart } from "../../../charts/chart-utils";
import { isNotNull } from "../../../../utils/number-utils";
import Curation from "../../../Curation";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import Hidden from "../../../hidden/Hidden";
import { selectTranslations } from "../../../../store/reducers/translations-reducer";

const Flex = styled.div`
    display: flex;
`;

const FlexCol = styled.div<{ flex?: number }>`
    flex: ${props => props.flex || 1};
`;

const options: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    ...baseChart,
    title: {
        text: translations.title,
    },
    xAxis: {
        type: "category",
    },
    yAxis: {
        title: {
            text: translations.count,
        },
    },
    tooltip: {
        pointFormat: "<b>{point.names}</b>",
    },
    plotOptions: {
        column: {
            stacking: "normal",
            dataLabels: {
                enabled: true,
            },
        },
    },
    series: data,
});

const options2: (data: any, categories: any[], translations: any) => Highcharts.Options = (
    data,
    categories,
    translations
) => ({
    ...baseChart,
    title: {
        text: translations.title,
    },
    xAxis: { categories },
    yAxis: {
        title: {
            text: translations.count,
        },
    },
    plotOptions: {
        column: {
            dataLabels: {
                format: "{point.y}%",
                enabled: true,
            },
        },
    },
    tooltip: {
        pointFormat: "{series.name}: <b>{point.y}%</b>",
    },
    series: data,
    legend: {
        itemStyle: {
            fontSize: "9px",
        },
        enabled: true,
        maxHeight: 70,
    },
});

const ChatContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    translations: selectTranslations(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const ResistanceMechanismsChart = ({ studies, translations }: Props) => {
    const { t } = useTranslation();
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const minYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
    const maxYear = parseInt(sortedStudies[0].YEAR_START);
    const years: number[] = [];
    for (let i = minYear; i <= maxYear; i++) {
        years.push(i);
    }
    const detected = years.map(year => {
        const yearStudies = studies.filter(study => parseInt(study.YEAR_START) === year);
        const d = yearStudies.filter(study => study.MECHANISM_STATUS === "DETECTED");
        return {
            name: year,
            y: d.length,
            names: R.uniq(d.map(s => s.SPECIES)).join(", "),
        };
    });
    const notDetected = years.map(year => {
        const yearStudies = studies.filter(study => parseInt(study.YEAR_START) === year);
        const nD = yearStudies.filter(study => study.MECHANISM_STATUS !== "DETECTED");
        return {
            name: year,
            y: nD.length,
            names: R.uniq(nD.map(s => s.SPECIES)).join(", "),
        };
    });
    const data = [
        {
            maxPointWidth: 20,
            type: "column",
            name: t("common.prevention.chart.resistance_mechanism.DETECTED"),
            color: ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
            data: detected,
        },
        {
            maxPointWidth: 20,
            type: "column",
            name: t("common.prevention.chart.resistance_mechanism.NOT_DETECTED"),
            color: ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
            data: notDetected,
        },
    ];
    const groups = R.groupBy(R.prop("SPECIES"), sortedStudies);
    const baseSeries = Object.keys(groups).map((specie: string) => {
        const studies: PreventionStudy[] = groups[specie];
        return {
            maxPointWidth: 20,
            type: "column",
            name: specie,
            data: years.map(year => {
                const study = studies
                    .filter(s => isNotNull(s.MECHANISM_FREQUENCY))
                    .filter(study => year === parseInt(study.YEAR_START))[0];
                return {
                    name: `${year}`,
                    y: study ? parseFloat(study.MECHANISM_FREQUENCY) : undefined,
                };
            }),
        };
    });
    const mechanismTranslations = {
        count: t("common.prevention.chart.resistance_mechanism.count"),
        title: t("common.prevention.chart.resistance_mechanism.title"),
    };
    const mechanismTranslations2 = {
        count: t("common.prevention.chart.resistance_mechanism.frequency"),
        title: t("common.prevention.chart.resistance_mechanism.allelic"),
    };

    const series = R.filter(serie => R.any(data => !!data.y, serie.data), baseSeries);

    const showAllelic = R.any(serie => R.any(data => data.y !== undefined, serie.data), series);

    const resistanceMechanismsFiltersValue = React.useCallback(() => {
        if (!translations) return;
        return { studies };
    }, [studies, translations]);

    const selectedFilters = React.useMemo(() => {
        if (!translations) return;
        return resistanceMechanismsFiltersValue();
    }, [translations, resistanceMechanismsFiltersValue]);

    const content = () => (
        <>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${selectedFilters.studies[0].VILLAGE_NAME}, ${t(
                    selectedFilters.studies[0].ISO2 === "NA" ? "common.COUNTRY_NA" : selectedFilters.studies[0].ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">{`${t(selectedFilters.studies[0].ASSAY_TYPE)}, ${t(
                selectedFilters.studies[0].TYPE
            )}`}</Typography>
            <Flex>
                <FlexCol>
                    <HighchartsReact highcharts={Highcharts} options={options(data, mechanismTranslations)} />
                </FlexCol>
                {showAllelic && (
                    <FlexCol>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={options2(series, years, mechanismTranslations2)}
                        />
                    </FlexCol>
                )}
            </Flex>
            <Citation study={studies[0]} />
            <Curation study={studies[0]} />
        </>
    );
    return (
        <>
            <Hidden smUp>
                <ChatContainer width={"100%"}>{content()}</ChatContainer>
            </Hidden>
            <Hidden smDown>
                <ChatContainer width={"500px"}>{content()}</ChatContainer>
            </Hidden>
        </>
    );
};
export default connect(mapStateToProps)(ResistanceMechanismsChart);
