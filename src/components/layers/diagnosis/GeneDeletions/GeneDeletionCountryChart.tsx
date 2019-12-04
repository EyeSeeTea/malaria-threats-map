import * as React from "react";
import styled from "styled-components";
import { Box, Button, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import {
  setCountryModeAction,
  setRegionAction
} from "../../../../store/actions/base-actions";
import ZoomIcon from "@material-ui/icons/ZoomIn";
import { DiagnosisStudy } from "../../../../types/Diagnosis";
import { selectDiagnosisFilters } from "../../../../store/reducers/diagnosis-reducer";
import { formatList, formatYears } from "../../../../utils/string-utils";

const ChatContainer = styled.div`
  max-width: 500px;
`;

const Actions = styled.div`
  display: flex;
  margin-top: 20px;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  diagnosisFilters: selectDiagnosisFilters(state)
});
const mapDispatchToProps = {
  setRegion: setRegionAction,
  setCountryMode: setCountryModeAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: DiagnosisStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const GeneDeletionCountryChart = ({
  studies,
  setRegion,
  setCountryMode,
  diagnosisFilters
}: Props) => {
  const { t } = useTranslation("common");
  const nStudies = studies.length;
  const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
  const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_START;
  const minYear = sortedStudies[0].YEAR_START;
  const onClick = () => {
    setRegion({ country: studies[0].COUNTRY_NAME });
    setCountryMode(false);
  };
  const surveyTypes = R.uniq(studies.map(study => study.SURVEY_TYPE)).map(
    type => t(type)
  );
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${t(studies[0].COUNTRY_NAME)}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {`${nStudies} survey(s) P. falciparum for ${t(
          diagnosisFilters.deletionType
        ).toLowerCase()} by ${formatList(surveyTypes)} ${formatYears(
          minYear,
          maxYear
        )}`}
      </Typography>
      <Actions>
        <FlexGrow />
        <Button
          variant="contained"
          color="default"
          size="small"
          onClick={onClick}
        >
          <ZoomIcon />
          Zoom
        </Button>
      </Actions>
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneDeletionCountryChart);
