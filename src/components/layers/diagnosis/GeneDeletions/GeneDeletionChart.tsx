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

const ChatContainer = styled.div`
  max-width: 500px;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state)
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: DiagnosisStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto",
    margin: "20px 0"
  }
});

const GeneDeletionChart = ({ studies }: Props) => {
  const { t } = useTranslation("common");
  const classes = useStyles({});
  const studyObject = studies[0];
  const formatPercentage = (value: string) =>
    `${(parseFloat(value) * 100).toFixed(1)}%`;
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${t(
          studyObject.COUNTRY_NAME
        )}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {`${studies.length} survey(s)`}
      </Typography>
      <div className={classes.root}>
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align={"center"}>Deletion type</TableCell>
              <TableCell align={"center"}>No. tested</TableCell>
              <TableCell align={"center"}>
                Percentage deletion(s) in ${studyObject.YEAR_START}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align={"center"}>HRP2</TableCell>
              <TableCell align={"center"}>{studyObject.HRP2_TESTED}</TableCell>
              <TableCell align={"center"}>
                {formatPercentage(studyObject.HRP2_PROPORTION_DELETION)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align={"center"}>HRP3</TableCell>
              <TableCell align={"center"}>{studyObject.HRP3_TESTED}</TableCell>
              <TableCell align={"center"}>
                {formatPercentage(studyObject.HRP3_PROPORTION_DELETION)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align={"center"}>HRP2 & 3</TableCell>
              <TableCell align={"center"}>
                {studyObject.HRP2_HRP3_TESTED}
              </TableCell>
              <TableCell align={"center"}>
                {formatPercentage(studyObject.HRP2_HRP3_PROPORTION_DELETION)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Citation study={studyObject} />
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneDeletionChart);
