import React from "react";
import { State } from "../../../store/types";
import { selectFilters, selectTheme } from "../../../store/reducers/base-reducer";
import { selectPreventionFilters } from "../../../store/reducers/prevention-reducer";
import { setPreventionMapType } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../../../store/reducers/invasive-reducer";
import InsecticideClassFilter from "../InsecticideClassFilter";
import InsecticideTypeFilter from "../InsecticideTypeFilter";
import TypeFilter from "../TypeFilter";
import SpeciesFilter from "../SpeciesFilter";
import YearRangeSelector from "../../YearRangeSelector";
import MechanismTypeFilter from "../MechanismTypeFilter";
import DeletionTypeFilter from "../DeletionTypeFilter";
import SurveyTypeFilter from "../SurveyTypeFilter";
import PatientTypeFilter from "../PatientTypeFilter";
import PlasmodiumSpeciesFilter from "../PlasmodiumSpeciesFilter";
import DrugsFilter from "../DrugsFilter";
import MolecularMarkerFilter from "../MolecularMarkerFilter";
import VectorSpeciesFilter from "../VectorSpeciesFilter";

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

const DownloadFiltersContent: React.FC<Props> = ({
    theme,
    preventionFilters,
    diagnosisFilters,
    treatmentFilters,
    invasiveFilters,
}) => {
    switch (theme) {
        case "prevention":
            switch (preventionFilters.dataset) {
                case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
                    return (
                        <div>
                            <InsecticideClassFilter />
                            <InsecticideTypeFilter />
                            <TypeFilter />
                            <SpeciesFilter />
                            <YearRangeSelector
                                minYear={2010}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                case "INTENSITY_CONCENTRATION_BIOASSAY":
                    return (
                        <div>
                            <InsecticideClassFilter />
                            <InsecticideTypeFilter />
                            <TypeFilter />
                            <SpeciesFilter />
                            <YearRangeSelector
                                minYear={2010}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                case "BIOCHEMICAL_ASSAY":
                case "MOLECULAR_ASSAY":
                    return (
                        <div>
                            <MechanismTypeFilter />
                            <SpeciesFilter />
                            {/* {isSynergyst(preventionFilters) && <SynergistTypeFilter />} */}
                            <YearRangeSelector
                                minYear={2010}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                case "SYNERGIST-INSECTICIDE_BIOASSAY":
                    return (
                        <div>
                            <SpeciesFilter />
                            <YearRangeSelector
                                minYear={2010}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                default:
                    return <div />;
            }
        case "diagnosis":
            switch (diagnosisFilters.dataset) {
                case "DIAGNOSIS":
                    return (
                        <div>
                            <DeletionTypeFilter />
                            <SurveyTypeFilter />
                            <PatientTypeFilter />
                            <YearRangeSelector
                                minYear={1998}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                default:
                    return <div />;
            }
        case "treatment":
            switch (treatmentFilters.dataset) {
                case "THERAPEUTIC_EFFICACY_STUDY":
                    return (
                        <div>
                            <PlasmodiumSpeciesFilter />
                            <DrugsFilter />
                            <YearRangeSelector
                                minYear={2015}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                case "MOLECULAR_MARKER_STUDY":
                    return (
                        <div>
                            <MolecularMarkerFilter />
                            <YearRangeSelector
                                minYear={2015}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                default:
                    return <div />;
            }
        case "invasive":
            switch (invasiveFilters.dataset) {
                case "INVASIVE_VECTOR_SPECIES":
                    return (
                        <div>
                            <VectorSpeciesFilter />
                            <YearRangeSelector
                                minYear={1985}
                                maxYear={new Date().getFullYear()}
                                showTheatherMode={false}
                            />
                        </div>
                    );
                default:
                    return <div />;
            }
        default:
            return <div />;
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadFiltersContent);
