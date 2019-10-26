import React from "react";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";

import styled from "styled-components";
import { State } from "../store/types";
import { connect } from "react-redux";
import { resolveMapTypeLegend as resolvePreventionMapTypeLegend } from "./layers/prevention/utils";
import { resolveMapTypeLegend as resolveDiagnosisMapTypeLegend } from "./layers/diagnosis/utils";
import { resolveMapTypeLegend as resolveTreatmentMapTypeLegend } from "./layers/treatment/utils";
import { resolveMapTypeLegend as resolveInvasiveMapTypeLegend } from "./layers/invasive/utils";
import {
  selectCountryMode,
  selectFilters,
  selectTheme
} from "../store/reducers/base-reducer";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../store/actions/prevention-actions";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../store/reducers/invasive-reducer";

export const LegendContainer = styled(Paper)`
  padding: 16px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  width: 175px;
  font-size: 12px;
`;

export const LegendEntries = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LegendTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

export const LegendFooterContainer = styled.div`
  display: flex;
  margin-top: 8px;
`;

export const LegendEntry = styled.div`
  display: flex;
  align-items: center;
`;
export const LegendSymbol = styled.span<{ color: string }>`
  background-color: ${props => props.color};
  border-radius: 99999px;
  width: 12px;
  min-width: 12px;
  height: 12px;
  margin-right: 8px;
`;
export const LegendText = styled.span`
  line-height: 24px;
`;

export const LegendTypography = styled(Typography)`
  font-size: 0.8rem !important;
`;

export const LegendTitleTypography = styled(Typography)`
  font-size: 0.9rem !important;
`;
export const LegendFooterTypography = styled(Typography)`
  font-size: 0.7rem !important;
`;
const mapStateToProps = (state: State) => ({
  filters: selectFilters(state),
  theme: selectTheme(state),
  preventionFilters: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
  treatmentFilters: selectTreatmentFilters(state),
  invasiveFilters: selectInvasiveFilters(state),
  countryMode: selectCountryMode(state)
});

const mapDispatchToProps = {
  setPreventionMapType: setPreventionMapType
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function Legend({
  theme,
  preventionFilters,
  diagnosisFilters,
  treatmentFilters,
  invasiveFilters,
  countryMode
}: Props) {
  switch (theme) {
    case "prevention":
      return resolvePreventionMapTypeLegend(preventionFilters, countryMode);
    case "diagnosis":
      return resolveDiagnosisMapTypeLegend(diagnosisFilters, countryMode);
    case "treatment":
      return resolveTreatmentMapTypeLegend(treatmentFilters, countryMode);
    case "invasive":
      return resolveInvasiveMapTypeLegend(invasiveFilters, countryMode);
    default:
      return <span />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Legend);
