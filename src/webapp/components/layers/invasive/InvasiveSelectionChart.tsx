import React, { Component } from "react";
import { InvasiveMapType, State } from "../../../store/types";
import { selectCountryMode, selectViewData, selectTheme, selectSelection } from "../../../store/reducers/base-reducer";
import { connect } from "react-redux";
import VectorOccurrenceChart from "./VectorOccurance/VectorOccurranceChart";
import { selectInvasiveFilters } from "../../../store/reducers/invasive-reducer";
import { setInvasiveFilteredStudiesAction } from "../../../store/actions/invasive-actions";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    invasiveFilters: selectInvasiveFilters(state),
    countryMode: selectCountryMode(state),
    viewData: selectViewData(state),
    selection: selectSelection(state)
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
            countryMode,
            selection,
            viewData,
            popup,
            invasiveFilters: { mapType },
        } = this.props;
        /*if (!viewData) {
            return <div />;
        }*/
        const filteredStudies = studies.filter(study =>
            countryMode ? study.ISO2 === selection.ISO_2_CODE : study.SITE_ID === selection.SITE_ID
        );
        if (!filteredStudies.length || theme !== "invasive") {
            return <div />;
        }
        return (
            <>
                {!countryMode && mapType === InvasiveMapType.VECTOR_OCCURANCE && (
                    <VectorOccurrenceChart studies={filteredStudies} popup={popup} />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvasiveSelectionChart);
