import React, {useEffect, useState} from "react";
import { DiagnosisMapType, InvasiveMapType, PreventionMapType, State, TreatmentMapType } from "../../../store/types";
import { selectFilters, selectTheme } from "../../../store/reducers/base-reducer";
import { selectPreventionFilters, selectPreventionStudies } from "../../../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import ResistanceStatusFilters from "../../layers/prevention/ResistanceStatus/ResistanceStatusFilters";
import IntensityStatusFilters from "../../layers/prevention/IntensityStatus/IntensityStatusFilters";
import ResistanceMechanismFilters from "../../layers/prevention/ResistanceMechanisms/ResistanceMechanismFilters";
import LevelOfInvolvementFilters from "../../layers/prevention/Involvement/LevelOfInvolvementFilters";
import GeneDeletionFilters from "../../layers/diagnosis/GeneDeletions/GeneDeletionFilters";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import PboDeploymentFilters from "../../layers/prevention/PboDeployment/PboDeploymentFilters";
import TreatmentFailureFilters from "../../layers/treatment/TreatmentFailure/TreatmentFailureFilters";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import VectorOccuranceFilters from "../../layers/invasive/VectorOccurance/VectorOccuranceFilters";
import { selectInvasiveFilters } from "../../../store/reducers/invasive-reducer";
import DelayedParasiteClearanceFilters from "../../layers/treatment/DelayedParasiteClearance/DelayedParasiteClearanceFilters";
import MolecularMarkerFilters from "../../layers/treatment/MolecularMarkers/MolecularMarkerFilters";
import { setFiltersOpen } from "../../../store/actions/base-actions";

const mapStateToProps = (state: State) => ({
    filters: selectFilters(state),
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    preventionStudies: selectPreventionStudies(state),


});

const mapDispatchToProps = {
    setPreventionMapType: setPreventionMapType,
    setFiltersOpen: setFiltersOpen,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const FiltersContent: React.FC<Props> = ({
    theme,
    preventionFilters,
    diagnosisFilters,
    treatmentFilters,
    invasiveFilters,
    preventionStudies,
}) => {
    const [years, setYears] = useState({minYear: 1978, maxYear: new Date().getFullYear()});
    useEffect(() => {
        if(preventionStudies.length !== 0) {
            const yearStartedStudies = preventionStudies.map(study => Number(study.YEAR_START));
            const minYear = Math.min(...yearStartedStudies);
            const maxYear = Math.max(...yearStartedStudies);
            setYears({minYear, maxYear});
        }
    }, [preventionStudies]);

    switch (theme) {
        case "prevention":
            switch (preventionFilters.mapType) {
                case PreventionMapType.RESISTANCE_STATUS:
                    return <ResistanceStatusFilters years={years} />;
                case PreventionMapType.INTENSITY_STATUS:
                    return <IntensityStatusFilters years={years} />;
                case PreventionMapType.RESISTANCE_MECHANISM:
                    return <ResistanceMechanismFilters />;
                case PreventionMapType.LEVEL_OF_INVOLVEMENT:
                    return <LevelOfInvolvementFilters />;
                case PreventionMapType.PBO_DEPLOYMENT:
                    return <PboDeploymentFilters />;
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

export default connect(mapStateToProps, mapDispatchToProps)(FiltersContent);
