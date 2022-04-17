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
import { selectCountryMode, selectTheme, selectViewData } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import PboSiteChart from "./PboDeployment/PboSiteChart";
import PboDistrictChart from "./PboDeployment/PboDistrictChart";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    countryMode: selectCountryMode(state),
    viewData: selectViewData(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: PreventionStudy[];
    map?: mapboxgl.Map;
    popup?: boolean;
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionSelectionChart extends Component<Props> {
    render() {
        const {
            studies,
            countryMode,
            preventionFilters: { mapType },
            map,
            popup,
        } = this.props;

        return (
            <div id="fifth-duo">
                {countryMode && mapType === PreventionMapType.RESISTANCE_STATUS && (
                    <ResistanceStatusCountryChart studies={studies} />
                )}
                {countryMode && mapType === PreventionMapType.INTENSITY_STATUS && (
                    <IntensityStatusCountryChart studies={studies} />
                )}
                {countryMode && mapType === PreventionMapType.RESISTANCE_MECHANISM && (
                    <ResistanceMechanismCountryChart studies={studies} />
                )}
                {countryMode && mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT && (
                    <ResistanceMechanismCountryChart studies={studies} />
                )}
                {countryMode && mapType === PreventionMapType.PBO_DEPLOYMENT && (
                    <PboDistrictChart studies={studies} map={map} />
                )}
                {!countryMode && mapType === PreventionMapType.RESISTANCE_STATUS && (
                    <ResistanceStatusChart studies={studies} popup={popup} />
                )}
                {!countryMode && mapType === PreventionMapType.INTENSITY_STATUS && (
                    <IntensityStatusChart studies={studies} popup={popup} />
                )}
                {!countryMode && mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT && (
                    <LevelOfInvolvementChart studies={studies} popup={popup} />
                )}
                {!countryMode && mapType === PreventionMapType.RESISTANCE_MECHANISM && (
                    <ResistanceMechanismsChart studies={studies} popup={popup} />
                )}
                {!countryMode && mapType === PreventionMapType.PBO_DEPLOYMENT && (
                    <PboSiteChart studies={studies} popup={popup} />
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreventionSelectionChart);
