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

export const filterByResistanceMechanism = (study: any) => {
  return (
    study.ASSAY_TYPE === "MOLECULAR_ASSAY" ||
    study.ASSAY_TYPE === "BIOCHEMICAL_ASSAY" ||
    study.ASSAY_TYPE === "SYNERGIST-INSECTICIDE_BIOASSAY"
  );
};
export const filterByLevelOfInvolvement = (study: any) => {
  return (
    study.ASSAY_TYPE === "SYNERGIST-INSECTICIDE_BIOASSAY" &&
    study.MECHANISM_PROXY !== "CANNOT_BE_RELIABLY_ASSESSED" &&
    study.MECHANISM_PROXY !== "NEGATIVE_INVOLVEMENT" &&
    study.MECHANISM_PROXY !== "NA"
  );
};

export const filterByCountry = (country: string) => (study: any) => {
  return !country || study.COUNTRY_NAME === country;
};

export const filterByInsecticideClass = (insecticideClass: string) => (
  study: any
) => {
  return study.INSECTICIDE_CLASS === insecticideClass;
};

export const filterByInsecticideTypes = (insecticideTypes: string[]) => (
  study: any
) => {
  return (
    !insecticideTypes.length ||
    insecticideTypes.includes(study.INSECTICIDE_TYPE)
  );
};

export const filterByType = (type: string) => (study: any) => {
  return !type || study.TYPE === type;
};

export const filterBySpecies = (species: string[]) => (study: any) => {
  return !species.length || species.includes(study.SPECIES);
};
