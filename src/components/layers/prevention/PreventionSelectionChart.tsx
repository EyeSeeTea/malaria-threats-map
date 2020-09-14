import React, { Component } from "react";
import { PreventionMapType, State } from "../../../store/types";
import ResistanceStatusCountryChart from "./ResistanceStatus/ResistanceStatusCountryChart";
import IntensityStatusCountryChart from "./IntensityStatus/IntensityStatusCountryChart";
import ResistanceMechanismCountryChart from "./ResistanceMechanisms/ResistanceMechanismCountryChart";
import ResistanceStatusChart from "./ResistanceStatus/ResistanceStatusChart";
import IntensityStatusChart from "./IntensityStatus/IntensityStatusChart";
import LevelOfInvolvementChart from "./Involvement/LevelOfInvolvementChart";
import ResistanceMechanismsChart from "./ResistanceMechanisms/ResistanceMechanismsChart";
import { selectPreventionFilters } from "../../../store/reducers/prevention-reducer";
import {
  selectCountryMode,
  selectSelection,
  selectTheme,
} from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import { PreventionStudy } from "../../../types/Prevention";
import PboSiteChart from "./PboDeployment/PboSiteChart";

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  preventionFilters: selectPreventionFilters(state),
  countryMode: selectCountryMode(state),
  selection: selectSelection(state),
});

const mapDispatchToProps = {
  setFilteredStudies: setPreventionFilteredStudiesAction,
  setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
  studies: PreventionStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionSelectionChart extends Component<Props> {
  render() {
    const {
      theme,
      studies,
      countryMode,
      selection,
      preventionFilters: { mapType },
    } = this.props;
    if (!selection) {
      return <div />;
    }
    const filteredStudies = studies.filter((study) =>
      countryMode
        ? study.ISO2 === selection.ISO_2_CODE
        : study.SITE_ID === selection.SITE_ID
    );
    if (!filteredStudies.length || theme !== "prevention") {
      return <div />;
    }
    return (
      <div id="fifth-duo">
        {countryMode && mapType === PreventionMapType.RESISTANCE_STATUS && (
          <ResistanceStatusCountryChart studies={filteredStudies} />
        )}
        {countryMode && mapType === PreventionMapType.INTENSITY_STATUS && (
          <IntensityStatusCountryChart studies={filteredStudies} />
        )}
        {countryMode && mapType === PreventionMapType.RESISTANCE_MECHANISM && (
          <ResistanceMechanismCountryChart studies={filteredStudies} />
        )}
        {countryMode && mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT && (
          <ResistanceMechanismCountryChart studies={filteredStudies} />
        )}
        {!countryMode && mapType === PreventionMapType.RESISTANCE_STATUS && (
          <ResistanceStatusChart studies={filteredStudies} />
        )}
        {!countryMode && mapType === PreventionMapType.INTENSITY_STATUS && (
          <IntensityStatusChart studies={filteredStudies} />
        )}
        {!countryMode && mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT && (
          <LevelOfInvolvementChart studies={filteredStudies} />
        )}
        {!countryMode && mapType === PreventionMapType.RESISTANCE_MECHANISM && (
          <ResistanceMechanismsChart studies={filteredStudies} />
        )}
        {!countryMode && mapType === PreventionMapType.PBO_DEPLOYMENT && (
          <PboSiteChart studies={filteredStudies} />
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreventionSelectionChart);
