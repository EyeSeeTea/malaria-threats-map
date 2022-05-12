import React, { Component } from "react";
import { PreventionMapType, State } from "../../../store/types";
import ResistanceStatusChart from "./ResistanceStatus/ResistanceStatusChart";
import IntensityStatusChart from "./IntensityStatus/IntensityStatusChart";
import LevelOfInvolvementChart from "./Involvement/LevelOfInvolvementChart";
import ResistanceMechanismsChart from "./ResistanceMechanisms/ResistanceMechanismsChart";
import { selectPreventionFilters } from "../../../store/reducers/prevention-reducer";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: PreventionStudy[];
    popup?: boolean;
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionSelectionChart extends Component<Props> {
    render() {
        const {
            studies,
            preventionFilters: { mapType },
            popup,
        } = this.props;

        return (
            <div id="fifth-duo">
                {mapType === PreventionMapType.RESISTANCE_STATUS && (
                    <ResistanceStatusChart studies={studies} popup={popup} />
                )}
                {mapType === PreventionMapType.INTENSITY_STATUS && (
                    <IntensityStatusChart studies={studies} popup={popup} />
                )}
                {mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT && (
                    <LevelOfInvolvementChart studies={studies} popup={popup} />
                )}
                {mapType === PreventionMapType.RESISTANCE_MECHANISM && (
                    <ResistanceMechanismsChart studies={studies} popup={popup} />
                )}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreventionSelectionChart);
