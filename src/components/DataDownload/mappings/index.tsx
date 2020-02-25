import concentrationMappings from "./discriminating-concentration-bioassay";
import intensityMappings from "./intensity-concentration-bioassay";
import synergistMappings from "./synergist-bioassay";
import molecularMappings from "./molecular-bioassay";
import biochemicalMappings from "./biochemical-bioassay";
import { Option } from "../../BasicSelect";

const mappings: { [key: string]: Option[] } = {
  DISCRIMINATING_CONCENTRATION_BIOASSAY: concentrationMappings,
  INTENSITY_CONCENTRATION_BIOASSAY: intensityMappings,
  "SYNERGIST-INSECTICIDE_BIOASSAY": synergistMappings,
  MOLECULAR_ASSAY: molecularMappings,
  BIOCHEMICAL_ASSAY: biochemicalMappings
};

export default mappings;
