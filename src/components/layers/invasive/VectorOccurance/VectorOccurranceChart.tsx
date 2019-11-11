import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { InvasiveStudy } from "../../../../types/Invasive";
import Citation from "../../../charts/Citation";
import { getMonthFromNumber } from "./utils";
import { lowerCase } from "change-case";
import Pagination from "../../../charts/Pagination";

const ChatContainer = styled.div`
  max-width: 500px;
`;

const Flex = styled.div`
  display: flex;
`;

const Margin = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state)
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: InvasiveStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const VectorOccurrenceChart = ({ theme, studies }: Props) => {
  // const { t } = useTranslation("common");
  const [study, setStudy] = useState(0);
  const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);

  const studyObject = sortedStudies[study];

  const monthStart = getMonthFromNumber(parseInt(studyObject.MONTH_START));
  const monthEnd = getMonthFromNumber(parseInt(studyObject.MONTH_END));
  const yearStart = parseInt(studyObject.YEAR_START);
  const yearEnd = parseInt(studyObject.YEAR_END);

  const start = monthStart ? `${monthStart}, ${yearStart}` : `${yearStart}`;
  const end = monthEnd ? `${monthEnd}, ${yearEnd}` : `${yearEnd}`;

  const unique = yearStart === yearEnd && monthStart === monthEnd;
  const partial = (() => {
    if (!Number.isNaN(yearStart) && !Number.isNaN(yearEnd)) {
      return `${start} to ${end}`;
    } else if (!Number.isNaN(yearStart) && Number.isNaN(yearEnd)) {
      return start;
    } else if (Number.isNaN(yearStart) && !Number.isNaN(yearEnd)) {
      return end;
    }
  })();

  const duration = (unique ? start : partial) || "";

  return (
    <ChatContainer>
      {sortedStudies.length > 1 && (
        <Pagination studies={studies} study={study} setStudy={setStudy} />
      )}
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}`}</Box>
      </Typography>
      <Margin>
        <Flex>
          <Typography variant="body2">
            <b>Species:&nbsp;</b>
            {studyObject.SPECIES}
          </Typography>
        </Flex>
        <Flex>
          <Typography variant="body2">
            <b>Sampling period:&nbsp;</b>
            {duration}
          </Typography>
        </Flex>
        <Flex>
          <Typography variant="body2">
            <b>Sampling method:&nbsp;</b>{" "}
            {studyObject.SAMPLING_METHOD || "No available"}
          </Typography>
        </Flex>
        <Flex>
          <Typography variant="body2">
            <b>Species identification method:&nbsp;</b>
            {studyObject.ID_METHOD
              ? lowerCase(studyObject.ID_METHOD)
              : "No available"}
          </Typography>
        </Flex>
      </Margin>
      <Margin>
        <Citation study={studyObject} />
      </Margin>
      <Margin>
        <Typography variant="body2">
          <b>Acknowledgement for data collation:</b>
        </Typography>
        <Typography variant="body2">
          {studyObject.INSTITUTE_CURATION}
        </Typography>
      </Margin>
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VectorOccurrenceChart);
