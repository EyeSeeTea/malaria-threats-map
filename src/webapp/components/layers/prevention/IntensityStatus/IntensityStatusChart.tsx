import * as React from "react";
import { useState } from "react";
import Highcharts, { DataLabelsFormatterCallbackFunction } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Hidden, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import Citation from "../../../charts/Citation";
import * as R from "ramda";
import Pagination from "../../../charts/Pagination";
import { baseChart } from "../../../charts/chart-utils";
import Curation from "../../../Curation";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";

const options: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    ...baseChart,
    title: {
        text: translations.mosquito_mortality,
    },
    xAxis: {
        type: "category",
    },
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: translations.mortality,
        },
    },
    plotOptions: {
        column: {
            dataLabels: {
                formatter: function () {
                    // @ts-ignore
                    return `${this.y}% (${this.point.number})`;
                } as DataLabelsFormatterCallbackFunction,
                enabled: true,
            },
            zones: [
                {
                    value: 97.001,
                    color: "#D3D3D3",
                },
                {
                    value: 100.001,
                    color: "#2f4f4f",
                },
            ],
        },
    },
    tooltip: {
        formatter: function () {
            const point = this.point as any;
            return `
<b><i>${point.species}</i></b><br>
${translations.mortality} (%): ${point.y}<br>
${translations.tested}: ${point.number}
`;
        },
    },
    series: [
        {
            maxPointWidth: 20,
            type: "column",
            name: translations.mortality,
            data: data,
        },
    ],
    legend: {
        enabled: false,
    },
    credits: {
        enabled: false,
    },
});

const ChatContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const IntensityStatusChart = ({ studies: baseStudies }: Props) => {
    const { t } = useTranslation();
    const [study, setStudy] = useState(0);
    const groupedStudies = R.values(R.groupBy(R.prop("CITATION_URL"), baseStudies));
    const studies = groupedStudies[study];
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_INTENSITY}`;
    }, sortedStudies);
    const simplifiedStudies = R.values(cleanedStudies).map(
        (groupStudies: PreventionStudy[]) => R.sortBy(study => -parseInt(study.MORTALITY_ADJUSTED), groupStudies)[0]
    );
    const data = simplifiedStudies.map(study => ({
        name: `${study.YEAR_START}, ${t(study.INSECTICIDE_INTENSITY)} ${t(study.INSECTICIDE_TYPE)}`,
        y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
        species: study.SPECIES,
        number: study.NUMBER,
    }));
    const studyObject = simplifiedStudies[study];
    const translations = {
        mortality: t("common.prevention.chart.resistance_intensity.mortality"),
        mosquito_mortality: `${t("common.prevention.chart.resistance_intensity.mosquito_mortality")} (${t(
            "common.prevention.chart.resistance_intensity.number_of_tests"
        )})`,
        tested: t("common.prevention.chart.resistance_intensity.tested"),
    };
    const content = () => (
        <>
            {groupedStudies.length > 1 && <Pagination studies={groupedStudies} setStudy={setStudy} study={study} />}
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}, ${t(
                    studyObject.ISO2 === "NA" ? "COUNTRY_NA" : studyObject.ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">{`${t(studyObject.ASSAY_TYPE)}, ${t(studyObject.TYPE)}`}</Typography>
            <HighchartsReact highcharts={Highcharts} options={options(data, translations)} />
            <Citation study={studyObject} />
            <Curation study={studyObject} />
        </>
    );
    return (
        <>
            <Hidden smUp>
                <ChatContainer width={"100%"}>{content()}</ChatContainer>
            </Hidden>
            <Hidden xsDown>
                <ChatContainer width={"500px"}>{content()}</ChatContainer>
            </Hidden>
        </>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(IntensityStatusChart);
