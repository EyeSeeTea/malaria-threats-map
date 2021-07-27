import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Hidden, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import Citation from "../../../charts/Citation";
import Pagination from "../../../charts/Pagination";
import Curation from "../../../Curation";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import preventionChartOptions from "../common/preventionChartOptions";

const options: (data: any, translations: any) => Highcharts.Options = (data, translations) => ({
    ...preventionChartOptions(data, translations),
});

const ChatContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const LevelOfInvolvementChart = ({ studies: baseStudies, theme }: Props) => {
    const { t } = useTranslation();
    const [study, setStudy] = useState(0);
    const groupedStudies = R.values(R.groupBy(R.prop("CITATION_URL"), baseStudies));
    const studies = groupedStudies[study];

    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const data = sortedStudies.map(study => {
        const base = `${study.YEAR_START}, ${t(study.INSECTICIDE_TYPE)} ${t(study.INSECTICIDE_CONC)}`;
        const syn =
            study.SYNERGIST_TYPE === "NO"
                ? t("common.prevention.chart.synergist_involvement.no_synergist")
                : `${t(study.SYNERGIST_TYPE)} ${t(study.SYNERGIST_CONC)}`;
        return {
            name: `${base}, ${syn}`,
            y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
            species: study.SPECIES,
            number: study.NUMBER,
        };
    });
    const studyObject = sortedStudies[study];
    const translations = {
        mortality: t("common.prevention.chart.synergist_involvement.mortality"),
        mosquito_mortality: `${t("common.prevention.chart.synergist_involvement.mosquito_mortality")} (${t(
            "common.prevention.chart.synergist_involvement.number_of_tests"
        )})`,
        tested: t("common.prevention.chart.synergist_involvement.tested"),
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
            <Citation theme={theme} study={studyObject} />
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
export default connect(mapStateToProps)(LevelOfInvolvementChart);
