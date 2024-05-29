import concentrationMappings from "./discriminating-concentration-bioassay";
import intensityMappings from "./intensity-concentration-bioassay";
import synergistMappings from "./synergist-bioassay";
import molecularMappings from "./molecular-bioassay";
import biochemicalMappings from "./biochemical-bioassay";
import therapeuticMappings from "./therapeutic-efficacy-studies";
import molecularMarkerMappings1 from "./molecular-marker-studies-tab1";
import molecularMarkerMappings2 from "./molecular-marker-studies-tab2";
import invasiveMappings from "./invasive-detections";
import { Option } from "../../BasicSelect";
import diagnosisMappings from "./pfhrp23-gene-deletions";
import ongoingTherapeuticMappings from "./ongoing-therapeutic-efficacy-studies";
import ongoingMolecularMarkerMappings from "./ongoing-molecular-marker-studies";
import pfhrp23GeneDeletionsStudies from "./pfhrp23-gene-deletions-studies";

const mappings: { [key: string]: Option[] } = {
    DISCRIMINATING_CONCENTRATION_BIOASSAY: concentrationMappings,
    INTENSITY_CONCENTRATION_BIOASSAY: intensityMappings,
    "SYNERGIST-INSECTICIDE_BIOASSAY": synergistMappings,
    MOLECULAR_ASSAY: molecularMappings,
    BIOCHEMICAL_ASSAY: biochemicalMappings,
    THERAPEUTIC_EFFICACY_STUDY: therapeuticMappings,
    MOLECULAR_MARKER_STUDY: molecularMarkerMappings1,
    MOLECULAR_MARKER_STUDY_GENES: molecularMarkerMappings2,
    INVASIVE_VECTOR_SPECIES: invasiveMappings,
    PFHRP23_GENE_DELETIONS: diagnosisMappings,
    AMDERO_TES: ongoingTherapeuticMappings,
    AMDERO_MM: ongoingMolecularMarkerMappings,
    HRPO: pfhrp23GeneDeletionsStudies,
};

export default mappings;
