import * as React from "react";
import { selectPreventionFilters } from "../../../store/reducers/prevention-reducer";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudies } from "../../../store/actions/prevention-actions";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import SelectionDataContent from "../../site-selection-content/SelectionDataContent";
import { State } from "../../../store/types";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudies,
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    siteFilteredStudies: PreventionStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

const PreventionSelectionChart: React.FC<Props> = ({ theme, siteFilteredStudies, selection }) => {
    const [filteredStudies, setFilteredStudies] = React.useState<PreventionStudy[]>([]);

    React.useEffect(() => {
        setFilteredStudies(siteFilteredStudies.filter(study => study.SITE_ID === selection.SITE_ID));
    }, [siteFilteredStudies, selection]);

    return !selection || !filteredStudies.length || theme !== "prevention" ? (
        <div />
    ) : (
        <div id="fifth-duo">
            <SelectionDataContent />
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PreventionSelectionChart);
