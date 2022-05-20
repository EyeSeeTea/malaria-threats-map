import * as React from "react";
import { PreventionMapType, State } from "../../../store/types";
import ResistanceStatusChart from "./ResistanceStatus/ResistanceStatusChart";
import IntensityStatusChart from "./IntensityStatus/IntensityStatusChart";
import LevelOfInvolvementChart from "./Involvement/LevelOfInvolvementChart";
import ResistanceMechanismsChart from "./ResistanceMechanisms/ResistanceMechanismsChart";
import { selectPreventionFilters, selectPreventionStudies } from "../../../store/reducers/prevention-reducer";
import { selectSelection, selectTheme } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { setSelection } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    preventionStudies: selectPreventionStudies(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
    setSelection: setSelection,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    siteFilteredStudies: PreventionStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

const PreventionSelectionChart: React.FC<Props> = ({
    theme,
    siteFilteredStudies,
    preventionStudies,
    selection,
    preventionFilters: { mapType },
}) => {
    const [filteredStudies, setFilteredStudies] = React.useState<PreventionStudy[]>([]);
    const [nonFilteredStudies, setNonFilteredStudies] = React.useState<PreventionStudy[]>([]);

    React.useEffect(() => {
        setFilteredStudies(siteFilteredStudies.filter(study => study.SITE_ID === selection.SITE_ID));
    }, [siteFilteredStudies, selection]);

    React.useEffect(() => {
        setNonFilteredStudies(preventionStudies.filter(study => study.SITE_ID === selection.SITE_ID));
    }, [preventionStudies, selection]);

    return !selection || !filteredStudies.length || theme !== "prevention" ? (
        <div />
    ) : (
        <div id="fifth-duo">
            {mapType === PreventionMapType.RESISTANCE_STATUS && (
                <ResistanceStatusChart
                    siteFilteredStudies={filteredStudies}
                    siteNonFilteredStudies={nonFilteredStudies}
                />
            )}
            {mapType === PreventionMapType.INTENSITY_STATUS && <IntensityStatusChart studies={filteredStudies} />}
            {mapType === PreventionMapType.LEVEL_OF_INVOLVEMENT && (
                <LevelOfInvolvementChart studies={filteredStudies} />
            )}
            {mapType === PreventionMapType.RESISTANCE_MECHANISM && (
                <ResistanceMechanismsChart studies={filteredStudies} />
            )}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PreventionSelectionChart);
