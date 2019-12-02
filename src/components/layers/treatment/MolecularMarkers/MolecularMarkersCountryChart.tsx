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
import { TreatmentStudy } from "../../../../types/Treatment";
import { formatYears } from "../../../../utils/string-utils";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";
import { MOLECULAR_MARKERS } from "../../../filters/MolecularMarkerFilter";

const ChatContainer = styled.div`
  min-width: 500px;
`;

const Actions = styled.div`
  display: flex;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  treatmentFilters: selectTreatmentFilters(state)
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

const MolecularMarkersCountryChart = ({
  studies,
  setRegion,
  setCountryMode,
  treatmentFilters
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
  const molecularMarker = t(
    MOLECULAR_MARKERS.find(
      (m: any) => m.value === treatmentFilters.molecularMarker
    ).label
  );
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${t(studies[0].COUNTRY_NAME)}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {`${nStudies} molecular marker studies conducted on ${molecularMarker} ${formatYears(
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
)(MolecularMarkersCountryChart);
