import * as React from "react";
import styled from "styled-components";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import Citation from "../../../charts/Citation";
import { DiagnosisStudy } from "../../../../types/Diagnosis";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { formatList, formatYears } from "../../../../utils/string-utils";
import * as R from "ramda";
import { selectDiagnosisFilters } from "../../../../store/reducers/diagnosis-reducer";

const ChatContainer = styled.div`
  max-width: 500px;
  width: 100%;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  diagnosisFilters: selectDiagnosisFilters(state),
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: DiagnosisStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

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

const useStyles = makeStyles((theme) => ({
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

const GeneDeletionChart = ({ studies, diagnosisFilters }: Props) => {
  const { t } = useTranslation("common");
  const classes = useStyles({});
  const nStudies = studies.length;
  const sortedStudies = R.sortBy(
    (study) => parseInt(study.YEAR_START),
    studies
  );
  const sortedStudies2 = R.sortBy((study) => parseInt(study.YEAR_END), studies);
  const maxYear = sortedStudies2[sortedStudies2.length - 1].YEAR_END;
  const minYear = sortedStudies[0].YEAR_START;
  const studyObject = studies[0];
  const surveyTypes = R.uniq(
    studies.map((study) => study.SURVEY_TYPE)
  ).map((type) => t(type));
  const formatPercentage = (value: string) =>
    `${(parseFloat(value) * 100).toFixed(1)}%`;
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${t(
          studyObject.ISO2 === "NA" ? "COUNTRY_NA" : studyObject.ISO2
        )}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {t(`diagnosis.chart.gene_deletions.content_1`, {
          nStudies: nStudies,
        })}
        <i>{t(diagnosisFilters.deletionType).toLowerCase()}</i>
        {t(`diagnosis.chart.gene_deletions.content_2`, {
          surveyTypes: formatList(
            surveyTypes.map((st) =>
              t(st) === "DHS" ? t(st) : t(st).toLowerCase()
            )
          ),
          years: formatYears(minYear, maxYear),
        })}
      </Typography>
      <div className={classes.root}>
        <Typography variant={"caption"}>
          {t(`diagnosis.chart.gene_deletions.deletions_confirmed`)}
        </Typography>
        <Table aria-label="simple table" size="small" className={classes.table}>
          <TableHead className={classes.head}>
            <TableRow>
              <StyledHeaderCell align={"center"}>
                {t(`diagnosis.chart.gene_deletions.deletion_type`)}
              </StyledHeaderCell>
              <StyledHeaderCell align={"center"}>
                {t(`diagnosis.chart.gene_deletions.no_tested`)}
              </StyledHeaderCell>
              <StyledHeaderCell align={"center"}>
                {t(`diagnosis.chart.gene_deletions.percentage`)}{" "}
                {studyObject.YEAR_START}
              </StyledHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <StyledBodyCell align={"center"}>HRP2</StyledBodyCell>
              <StyledBodyCell align={"center"}>
                {studyObject.HRP2_TESTED || "N/A"}
              </StyledBodyCell>
              <StyledBodyCell align={"center"}>
                {!Number.isNaN(parseFloat(studyObject.HRP2_PROPORTION_DELETION))
                  ? formatPercentage(studyObject.HRP2_PROPORTION_DELETION)
                  : "N/A"}
              </StyledBodyCell>
            </TableRow>
            <TableRow>
              <StyledBodyCell align={"center"}>HRP3</StyledBodyCell>
              <StyledBodyCell align={"center"}>
                {studyObject.HRP3_TESTED || "N/A"}
              </StyledBodyCell>
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
    </ChatContainer>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(GeneDeletionChart);
