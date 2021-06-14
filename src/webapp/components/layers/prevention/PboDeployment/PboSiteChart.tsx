import * as React from "react";
import styled from "styled-components";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";
import { ChartContainer } from "../../../Chart";
import * as R from "ramda";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import {
    filterByCriteria1,
    filterByCriteria3,
    getMostRecent,
    getMostRecentByCriteria2,
    getMostRecentByCriteria3,
} from "../utils";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const StyledHeaderCell = styled(TableCell)<{ borderLeft?: boolean }>`
    ${props => (props.borderLeft ? "border-left: 1px solid rgba(224, 224, 224, 1);" : "")}
    font-size: 0.8rem !important;
    line-height: 1rem !important;
    color: rgba(0, 0, 0, 0.87) !important;
    font-weight: 550 !important;
    padding: 2px !important;
`;

const StyledBodyCell = styled(TableCell)<{ borderLeft?: boolean }>`
    ${props => (props.borderLeft ? "border-left: 1px solid rgba(224, 224, 224, 1);" : "")}
    font-size: 0.875rem !important;
    color: rgba(0, 0, 0, 0.87) !important;
    font-weight: 400 !important;
`;

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        overflowX: "auto",
        margin: "20px 0",
    },
    table: {
        marginTop: 10,
    },
    head: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.background.default,
    },
}));

const PboSiteChart = ({ studies }: Props) => {
    const { t } = useTranslation("common");
    const siteSubtitleTranslation = t(
        "Compliance with WHO recommended criteria for Pyrethroid-PBO nets deployment by vector species"
    );

    const classes = useStyles({});

    const studiesBySpecies = R.groupBy(R.prop("SPECIES"), studies);
    const rows = Object.entries(studiesBySpecies).map(([species, specieStudies]) => {
        const group1Studies = filterByCriteria1(specieStudies);

        const mostRecentByCriteria2 = getMostRecentByCriteria2(group1Studies);
        const mostRecentPyrethroidStudy = mostRecentByCriteria2 || getMostRecent(group1Studies);

        const group2Studies = filterByCriteria3(specieStudies);
        const mostRecentMonoOxygenasesStudies: any = R.reverse(R.sortBy(R.prop("YEAR_START"), group2Studies)) || [];
        const mostRecentByCriteria3 = getMostRecentByCriteria3(group2Studies);
        const mostRecentMonoOxygenasesStudy = mostRecentByCriteria3 || getMostRecent(group2Studies);

        const monoOxygenaseMeasuredBy = R.uniq(
            mostRecentMonoOxygenasesStudies.map((study: any) => t(study.ASSAY_TYPE))
        ).join(", ");

        return {
            species,
            pyrethroidResistance: mostRecentPyrethroidStudy ? t(mostRecentPyrethroidStudy.RESISTANCE_STATUS) : "-",
            adjustedMortality:
                mostRecentPyrethroidStudy !== undefined
                    ? mostRecentPyrethroidStudy === mostRecentByCriteria2
                        ? "Yes"
                        : "No"
                    : "-",
            pyrethroidMostRecentYear: mostRecentPyrethroidStudy ? mostRecentPyrethroidStudy.YEAR_START : "-",
            conferred: mostRecentMonoOxygenasesStudy ? t(mostRecentMonoOxygenasesStudy.MECHANISM_STATUS) : "-",
            monoOxygenaseMeasuredBy: monoOxygenaseMeasuredBy || "-",
            monoOxygenaseMostRecentYear: mostRecentMonoOxygenasesStudy ? mostRecentMonoOxygenasesStudy.YEAR_START : "-",
        };
    });
    const studyObject = studies[0];
    return (
        <ChartContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}, ${t(
                    studyObject.ISO2 === "NA" ? "COUNTRY_NA" : studyObject.ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">{siteSubtitleTranslation}</Typography>
            <div className={classes.root}>
                <Table aria-label="simple table" size="small" className={classes.table}>
                    <TableHead className={classes.head}>
                        <TableRow>
                            <StyledHeaderCell align={"center"}>{t("Vector species")}</StyledHeaderCell>
                            <StyledHeaderCell align={"center"} borderLeft>
                                {t("Pyrethroid resistance status")}
                            </StyledHeaderCell>
                            <StyledHeaderCell align={"center"}>
                                {t("Adj. mortality against pyrethroids between 10% and 80%")}
                            </StyledHeaderCell>
                            <StyledHeaderCell align={"center"}>
                                {t("Most recent pyrethroid susceptibility test results")}
                            </StyledHeaderCell>
                            <StyledHeaderCell align={"center"} borderLeft>
                                {t("Conferred (at least in part) by mono-oxygenase")}
                            </StyledHeaderCell>
                            <StyledHeaderCell align={"center"}>{t("Mono-oxygenase measured by")}</StyledHeaderCell>
                            <StyledHeaderCell align={"center"}>
                                {t("Most recent mono-oxygenase involvement results")}
                            </StyledHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => {
                            return (
                                <TableRow key={row.species}>
                                    <StyledBodyCell align={"center"}>{row.species}</StyledBodyCell>
                                    <StyledBodyCell align={"center"} borderLeft>
                                        {row.pyrethroidResistance}
                                    </StyledBodyCell>
                                    <StyledBodyCell align={"center"}>{row.adjustedMortality}</StyledBodyCell>
                                    <StyledBodyCell align={"center"}>{row.pyrethroidMostRecentYear}</StyledBodyCell>
                                    <StyledBodyCell align={"center"} borderLeft>
                                        {row.conferred}
                                    </StyledBodyCell>
                                    <StyledBodyCell align={"center"}>{row.monoOxygenaseMeasuredBy}</StyledBodyCell>
                                    <StyledBodyCell align={"center"}>{row.monoOxygenaseMostRecentYear}</StyledBodyCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </ChartContainer>
    );
};
export default connect(mapStateToProps)(PboSiteChart);
