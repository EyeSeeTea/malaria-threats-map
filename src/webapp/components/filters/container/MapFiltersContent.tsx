import React from "react";
import { DiagnosisMapType, InvasiveMapType, PreventionMapType, State, TreatmentMapType } from "../../../store/types";
import { selectFilters, selectTheme } from "../../../store/reducers/base-reducer";
import { selectPreventionFilters } from "../../../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import ResistanceStatusFilters from "../../layers/prevention/ResistanceStatus/ResistanceStatusFilters";
import IntensityStatusFilters from "../../layers/prevention/IntensityStatus/IntensityStatusFilters";
import ResistanceMechanismFilters from "../../layers/prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import LevelOfInvolvementFilters from "../../layers/prevention/Involvement/LevelOfInvolvementFilters";
import GeneDeletionFilters from "../../layers/diagnosis/GeneDeletions/GeneDeletionFilters";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import TreatmentFailureFilters from "../../layers/treatment/TreatmentFailure/TreatmentFailureFilters";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import VectorOccuranceFilters from "../../layers/invasive/VectorOccurance/VectorOccuranceFilters";
import { selectInvasiveFilters } from "../../../store/reducers/invasive-reducer";
import DelayedParasiteClearanceFilters from "../../layers/treatment/DelayedParasiteClearance/DelayedParasiteClearanceFilters";
import MolecularMarkerFilters from "../../layers/treatment/MolecularMarkers/MolecularMarkerFilters";
import TherapeuticEfficacyStudiesFilters from "../../layers/treatment/TherapeuticEfficacyStudies/TherapeuticEfficacyStudiesFilters";

const mapStateToProps = (state: State) => ({
    filters: selectFilters(state),
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
});

const mapDispatchToProps = {
    setPreventionMapType: setPreventionMapType,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const MapFiltersContent: React.FC<Props> = ({
    theme,
    preventionFilters,
    diagnosisFilters,
    treatmentFilters,
    invasiveFilters,
}) => {
    switch (theme) {
        case "prevention":
            switch (preventionFilters.mapType) {
                case PreventionMapType.RESISTANCE_STATUS:
                    return <ResistanceStatusFilters />;
                case PreventionMapType.INTENSITY_STATUS:
                    return <IntensityStatusFilters />;
                case PreventionMapType.RESISTANCE_MECHANISM:
                    return <ResistanceMechanismFilters />;
                case PreventionMapType.LEVEL_OF_INVOLVEMENT:
                    return <LevelOfInvolvementFilters />;
                default:
                    return <div />;
            }
        case "diagnosis":
            switch (diagnosisFilters.mapType) {
                case DiagnosisMapType.GENE_DELETIONS:
                    return <GeneDeletionFilters />;
                default:
                    return <div />;
            }
        case "treatment":
            switch (treatmentFilters.mapType) {
                case TreatmentMapType.TREATMENT_FAILURE:
                    return <TreatmentFailureFilters />;
                case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
                    return <DelayedParasiteClearanceFilters />;
                case TreatmentMapType.MOLECULAR_MARKERS:
                    return <MolecularMarkerFilters />;
                case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
                    return <TherapeuticEfficacyStudiesFilters />;
                default:
                    return <div />;
            }
        case "invasive":
            switch (invasiveFilters.mapType) {
                case InvasiveMapType.VECTOR_OCCURANCE:
                    return <VectorOccuranceFilters />;
                default:
                    return <div />;
            }
        default:
            return <div />;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MapFiltersContent);
