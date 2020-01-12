import * as React from "react";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import {
  setCountryModeAction,
  setRegionAction
} from "../../../../store/actions/base-actions";
import { TreatmentStudy } from "../../../../types/Treatment";
import { formatYears } from "../../../../utils/string-utils";
import { ZoomButton } from "../../../Chart";

const ChatContainer = styled.div`
  max-width: 500px;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state)
});
const mapDispatchToProps = {
  setRegion: setRegionAction,
  setCountryMode: setCountryModeAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: TreatmentStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const TreatmentFailureCountryChart = ({
  studies,
  setRegion,
  setCountryMode
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
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${t(studies[0].COUNTRY_NAME)}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {t(`treatment.chart.treatment_failure.content`, {
          nStudies: nStudies,
          drug: t(sortedStudies[0].DRUG_NAME),
          plasmodiumSpecies: t(
            sortedStudies[0].PLASMODIUM_SPECIES.replace(".", "%2E")
          ),
          years: formatYears(minYear, maxYear)
        })}
      </Typography>
      <Actions>
        <FlexGrow />
        <ZoomButton onClick={onClick} />
      </Actions>
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentFailureCountryChart);
