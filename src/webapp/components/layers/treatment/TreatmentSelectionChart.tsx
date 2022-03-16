import React, { Component } from "react";
import { State, TreatmentMapType } from "../../../store/types";
import { selectCountryMode, selectTheme, selectViewData } from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import MolecularMarkersChart from "./MolecularMarkers/MolecularMarkersChart";
import TreatmentFailureChart from "./TreatmentFailure/TreatmentFailureChart";
import TreatmentFailureCountryChart from "./TreatmentFailure/TreatmentFailureCountryChart";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import MolecularMarkersCountryChart from "./MolecularMarkers/MolecularMarkersCountryChart";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    treatmentFilters: selectTreatmentFilters(state),
    countryMode: selectCountryMode(state),
    viewData: selectViewData(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: TreatmentStudy[];
};
type Props = StateProps & DispatchProps & OwnProps;

class TreatmentSelectionChart extends Component<Props> {
    render() {
        const {
            theme,
            studies,
            countryMode,
            viewData,
            treatmentFilters: { mapType },
        } = this.props;
        if (!viewData) {
            return <div />;
        }
        const filteredStudies = studies.filter(study =>
            countryMode ? study.ISO2 === viewData.ISO_2_CODE : study.SITE_ID === viewData.SITE_ID
        );
        if (!filteredStudies.length || theme !== "treatment") {
            return <div />;
        }

        return (
            <>
                {!countryMode && mapType === TreatmentMapType.MOLECULAR_MARKERS && (
                    <MolecularMarkersChart studies={filteredStudies} />
                )}
                {!countryMode &&
                    (mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE ||
                        mapType === TreatmentMapType.TREATMENT_FAILURE) && (
                        <TreatmentFailureChart studies={filteredStudies} />
                    )}
                {countryMode && mapType === TreatmentMapType.TREATMENT_FAILURE && (
                    <TreatmentFailureCountryChart studies={filteredStudies} />
                )}
                {countryMode && mapType === TreatmentMapType.DELAYED_PARASITE_CLEARANCE && (
                    <TreatmentFailureCountryChart studies={filteredStudies} />
                )}
                {countryMode && mapType === TreatmentMapType.MOLECULAR_MARKERS && (
                    <MolecularMarkersCountryChart studies={filteredStudies} />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentSelectionChart);
