import { PreventionStudy } from "../../types/Prevention";

export const filterByYearRange = (years: number[]) => (
  study: PreventionStudy
) => {
  return (
    parseInt(study.YEAR_START) >= years[0] &&
    parseInt(study.YEAR_START) <= years[1]
  );
};

export const filterByIntensityStatus = (study: any) => {
  return study.ASSAY_TYPE === "INTENSITY_CONCENTRATION_BIOASSAY";
};

export const filterByResistanceStatus = (study: any) => {
  return study.ASSAY_TYPE === "DISCRIMINATING_CONCENTRATION_BIOASSAY";
};
