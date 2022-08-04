import React, { Component } from "react";
import { State } from "../../../store/types";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import { setInvasiveFilteredStudiesAction } from "../../../store/actions/invasive-actions";
import { InvasiveStudy } from "../../../../domain/entities/InvasiveStudy";
import SelectionDataContent from "../../site-selection-content/SelectionDataContent";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setInvasiveFilteredStudiesAction,
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: InvasiveStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

class PreventionSelectionChart extends Component<Props> {
    render() {
        const { theme, studies, selection } = this.props;
        if (!selection) {
            return <div />;
        }
        const filteredStudies = studies.filter(study => study.SITE_ID === selection.SITE_ID);
        if (!filteredStudies.length || theme !== "invasive") {
            return <div />;
        }
        return (
            <>
                <SelectionDataContent />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreventionSelectionChart);
