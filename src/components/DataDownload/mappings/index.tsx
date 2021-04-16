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
};

export default mappings;
