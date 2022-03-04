import * as React from "react";
import { useState } from "react";
import Highcharts, { DataLabelsFormatterCallbackFunction } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { ConfirmationStatusColors } from "./symbols";
import * as R from "ramda";
import { isNull, isNotNull } from "../../../../utils/number-utils";
import Citation from "../../../charts/Citation";
import Pagination from "../../../charts/Pagination";
import Curation from "../../../Curation";
import IntegrationReactSelect from "../../../BasicSelect";
import FormLabel from "@mui/material/FormLabel";
import { sendAnalytics } from "../../../../utils/analytics";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import Hidden from "../../../hidden/Hidden";

const options: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    chart: {
        maxPointWidth: 20,
        type: "column",
        height: 300,
        style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
        },
    },
    title: {
        text: translations.mosquito_mortality,
    },
    xAxis: {
        type: "category",
        labels: {
            rotation: -45,
            style: {
                whiteSpace: "nowrap",
            },
        },
    },
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: translations.mortality,
        },
        plotLines: [
            {
                value: 90,
                color: "#d43501",
                dashStyle: "LongDashDot",
                width: 2,
                zIndex: 5,
                label: {
                    text: "",
                },
            },
        ],
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
                    value: 90,
                    color: ConfirmationStatusColors.Confirmed[0],
                },
                {
                    value: 98,
                    color: ConfirmationStatusColors.Possible[0],
                },
                {
                    value: 100.001,
                    color: ConfirmationStatusColors.Susceptible[0],
                },
            ],
        },
    },
    tooltip: {
        formatter: function () {
            const point = this.point as any;

            const bottomText = isNull(point.citationUrl)
                ? `<br>${translations.type}: ${point.type}<br> ${point.citation}`
                : "";

            return `
                <b><i>${point.species}</i></b><br>
                ${translations.mortality} (%): ${point.y}<br>
                ${translations.tested}: ${point.number}
                ${bottomText}`;
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

const StyledSelect = styled(IntegrationReactSelect)`
    margin-bottom: 4px;
    margin-left: 16px;
`;

const Flex = styled.div`
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const ResistanceStatusChart = ({ studies: baseStudies }: Props) => {
    const { t } = useTranslation();
    const [study, setStudy] = useState(0);
    const speciesOptions = R.uniq(R.map(s => s.SPECIES, baseStudies));
    const suggestions: any[] = speciesOptions.map((specie: string) => ({
        label: specie,
        value: specie,
    }));
    const [species, setSpecies] = useState<any[]>(suggestions);
    const onSpeciesChange = (value: any) => {
        sendAnalytics({ type: "event", category: "popup", action: "filter" });
        setSpecies(value);
    };
    const groupedStudies = R.values(
        R.groupBy(
            R.prop("CITATION_URL"),
            baseStudies.filter(
                study => !species || !species.length || species.map(s => s.value).includes(study.SPECIES)
            )
        )
    );
    const studies = groupedStudies[study];
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_CONC}`;
    }, sortedStudies);

    const simplifiedStudies = R.sortWith(
        [R.ascend(R.prop("YEAR_START")), R.ascend(R.prop("INSECTICIDE_TYPE"))],
        R.values(cleanedStudies).map(
            (groupStudies: PreventionStudy[]) =>
                R.sortBy(study => parseFloat(study.MORTALITY_ADJUSTED), groupStudies)[0]
        )
    );
    const data = simplifiedStudies.map(study => ({
        name: `${study.YEAR_START}, ${t(study.INSECTICIDE_TYPE)} ${t(study.INSECTICIDE_CONC)}`,
        y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
        species: t(study.SPECIES),
        number: study.NUMBER,
        type: t(study.TYPE),
        citation: study.CITATION_LONG || study.INSTITUTE,
        citationUrl: study.CITATION_URL,
    }));
    const studyObject = groupedStudies[study][0];
    const translations = {
        mortality: t("common.prevention.chart.resistance_status.mortality"),
        mosquito_mortality: `${t("common.prevention.chart.resistance_status.mosquito_mortality")} (${t(
            "common.prevention.chart.resistance_status.number_of_tests"
        )})`,
        tested: t("common.prevention.chart.resistance_status.tested"),
        type: t("common.prevention.chart.resistance_status.type"),
    };

    const subtitle = isNotNull(studyObject.CITATION_URL)
        ? `${t(studyObject.ASSAY_TYPE)}, ${t(studyObject.TYPE)}`
        : t(studyObject.ASSAY_TYPE);

    const content = () => (
        <>
            {groupedStudies.length > 1 && <Pagination studies={groupedStudies} setStudy={setStudy} study={study} />}
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}, ${t(
                    `${studyObject.ISO2 === "NA" ? "common.COUNTRY_NA" : studyObject.ISO2}`
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">{subtitle}</Typography>
            {suggestions.length > 1 && (
                <Flex>
                    <FormLabel component="legend">Species</FormLabel>
                    <StyledSelect
                        isClearable
                        isMulti
                        suggestions={suggestions}
                        onChange={onSpeciesChange}
                        value={species}
                    />
                </Flex>
            )}
            <HighchartsReact highcharts={Highcharts} options={options(data, translations)} />
            <Citation study={studyObject} allStudiesGroup={groupedStudies[study]} />
            <Curation study={studyObject} />
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
export default connect(mapStateToProps)(ResistanceStatusChart);
