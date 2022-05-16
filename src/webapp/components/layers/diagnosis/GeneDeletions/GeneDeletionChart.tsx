import * as React from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { connect } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import Citation from "../../../charts/Citation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatList, formatYears } from "../../../../utils/string-utils";
import * as R from "ramda";
import { selectDiagnosisFilters } from "../../../../store/reducers/diagnosis-reducer";
import { DiagnosisStudy } from "../../../../../domain/entities/DiagnosisStudy";
import { isNotNull, isNull } from "../../../../utils/number-utils";
import { selectViewData } from "../../../../store/reducers/base-reducer";

const ChatContainer = styled.div`
    max-width: 500px;
    width: 100%;
    padding: ${(props: { popup: boolean }) => (props.popup ? "0" : "25px")};
`;

const SpacedTypography = styled(Typography)`
    margin-bottom: 5px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    viewData: selectViewData(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: DiagnosisStudy[];
    popup: boolean;
};
type Props = StateProps & OwnProps;

const StyledHeaderCell = styled(TableCell)`
    font-size: 0.875rem !important;
    line-height: 1.5rem !important;
    color: rgba(0, 0, 0, 0.87) !important;
    font-weight: 550 !important;
`;

const StyledBodyCell = styled(TableCell)`
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

const GeneDeletionChart = ({ studies, diagnosisFilters, viewData, popup }: Props) => {
    const { t } = useTranslation();
    console.log(studies)
    const classes = useStyles({});
    const nStudies = studies.length;
    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
    const sortedStudies2 = R.sortBy(study => parseInt(study.YEAR_END), studies);
    const maxYear = sortedStudies2[sortedStudies2.length - 1].YEAR_END;
    const minYear = sortedStudies[0].YEAR_START;
    const studyObject = studies[0];
    console.log(studyObject)
    const surveyTypes = R.uniq(studies.map(study => study.SURVEY_TYPE)).map(type => t(type));
    const formatPercentage = (value: string) => `${(parseFloat(value) * 100).toFixed(1)}%`;
    console.log(t(studyObject.ISO2));

    return (
        <ChatContainer popup={popup}>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">
                    {isNotNull(studyObject.TOOLTIP_SITENAME) && `${t(studyObject.TOOLTIP_SITENAME)}, `}
                    {t(isNull(studyObject.ISO2) ? "common.COUNTRY_NA" : studyObject.ISO2)}
                </Box>
            </Typography>
            {viewData !== null && !popup && (
                <>
                    <SpacedTypography variant="subtitle2">
                        {t("common.diagnosis.chart.gene_deletions.content_1", {
                            nStudies,
                        })}
                        <i>{t(diagnosisFilters.deletionType).toLowerCase()}</i>
                        {t("common.diagnosis.chart.gene_deletions.content_2", {
                            surveyTypes: formatList(
                                surveyTypes.map(st => {
                                    const dhs = t("common.diagnosis.chart.gene_deletions.DHS");
                                    return st.toLowerCase().replace(new RegExp(dhs, "i"), dhs);
                                })
                            ),
                            years: formatYears(minYear, maxYear),
                        })}
                    </SpacedTypography>
                    {isNotNull(studyObject.SAMPLE_ORIGIN) && (
                        <SpacedTypography variant="subtitle2">{t(studyObject.SAMPLE_ORIGIN)}</SpacedTypography>
                    )}
                    {isNotNull(studyObject.PF_POS_SAMPLES) && (
                        <SpacedTypography variant="subtitle2">
                            <Trans
                                i18nKey="common.diagnosis.chart.gene_deletions.content_3"
                                values={{ pfPosSamples: studyObject.PF_POS_SAMPLES }}
                                t={t}
                            >
                                Number of <i>P. falciparum</i> positive samples from the study population:
                            </Trans>
                        </SpacedTypography>
                    )}
                    {isNotNull(studyObject.TYPE_SAMPL_ANALYZED) && (
                        <SpacedTypography variant="subtitle2">
                            {t("common.diagnosis.chart.gene_deletions.content_4", {
                                typeSampleAnalyzed: t(studyObject.TYPE_SAMPL_ANALYZED),
                            })}
                        </SpacedTypography>
                    )}
                    <div className={classes.root}>
                        <Typography variant={"caption"}>
                            {t("common.diagnosis.chart.gene_deletions.deletions_confirmed")}
                        </Typography>
                        <Table aria-label="simple table" size="small" className={classes.table}>
                            <TableHead className={classes.head}>
                                <TableRow>
                                    <StyledHeaderCell align={"center"}>
                                        {t("common.diagnosis.chart.gene_deletions.deletion_type")}
                                    </StyledHeaderCell>
                                    <StyledHeaderCell align={"center"}>
                                        {t("common.diagnosis.chart.gene_deletions.no_tested")}
                                    </StyledHeaderCell>
                                    <StyledHeaderCell align={"center"}>
                                        {t("common.diagnosis.chart.gene_deletions.percentage")} {studyObject.YEAR_START}
                                    </StyledHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <StyledBodyCell align={"center"}>HRP2</StyledBodyCell>
                                    <StyledBodyCell align={"center"}>{studyObject.HRP2_TESTED || "N/A"}</StyledBodyCell>
                                    <StyledBodyCell align={"center"}>
                                        {!Number.isNaN(parseFloat(studyObject.HRP2_PROPORTION_DELETION))
                                            ? formatPercentage(studyObject.HRP2_PROPORTION_DELETION)
                                            : "N/A"}
                                    </StyledBodyCell>
                                </TableRow>
                                <TableRow>
                                    <StyledBodyCell align={"center"}>HRP3</StyledBodyCell>
                                    <StyledBodyCell align={"center"}>{studyObject.HRP3_TESTED || "N/A"}</StyledBodyCell>
                                    <StyledBodyCell align={"center"}>
                                        {!Number.isNaN(parseFloat(studyObject.HRP3_PROPORTION_DELETION))
                                            ? formatPercentage(studyObject.HRP3_PROPORTION_DELETION)
                                            : "N/A"}
                                    </StyledBodyCell>
                                </TableRow>
                                <TableRow>
                                    <StyledBodyCell align={"center"}>HRP2 & 3</StyledBodyCell>
                                    <StyledBodyCell align={"center"}>
                                        {studyObject.HRP2_HRP3_TESTED || "N/A"}
                                    </StyledBodyCell>
                                    <StyledBodyCell align={"center"}>
                                        {!Number.isNaN(parseFloat(studyObject.HRP2_HRP3_TESTED))
                                            ? formatPercentage(studyObject.HRP2_HRP3_PROPORTION_DELETION)
                                            : "N/A"}
                                    </StyledBodyCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <Citation study={studyObject} />
                </>
            )}
        </ChatContainer>
    );
};
export default connect(mapStateToProps)(GeneDeletionChart);
