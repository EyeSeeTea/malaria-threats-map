import React, { Component } from "react";
import { InvasiveMapType, State } from "../../../store/types";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import VectorOccurrenceChart from "./VectorOccurance/VectorOccurranceChart";
import { selectInvasiveFilters } from "../../../store/reducers/invasive-reducer";
import { setInvasiveFilteredStudiesAction } from "../../../store/actions/invasive-actions";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    invasiveFilters: selectInvasiveFilters(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setInvasiveFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: InvasiveStudy[];
    popup?: boolean;
};
type Props = StateProps & DispatchProps & OwnProps;

class InvasiveSelectionChart extends Component<Props> {
    render() {
        const {
            theme,
            studies,
            popup,
            selection,
            invasiveFilters: { mapType },
        } = this.props;
        if (!selection) {
            return <div />;
        }
        const filteredStudies = studies.filter(study => study.SITE_ID === selection.SITE_ID);
        if (!filteredStudies.length || theme !== "invasive") {
            return <div />;
        }
        return (
            <>
                {mapType === InvasiveMapType.VECTOR_OCCURANCE && (
                    <VectorOccurrenceChart studies={studies} popup={popup} />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvasiveSelectionChart);
