import React from "react";
import resistanceStatusSymbols from "./ResistanceStatus/symbols";
import intensityStatusSymbols from "./IntensityStatus/symbols";
import resistanceMechanismSymbols from "./ResistanceMechanisms/symbols";
import levelOfInvolvementSymbols from "./Involvement/symbols";
import PboDeploymentSymbols, {
  PboDeploymentStatus
} from "./PboDeployment/PboDeploymentSymbols";
import { default as ResistanceStatusLegend } from "./ResistanceStatus/legend";
import { default as IntensityStatusLegend } from "./IntensityStatus/legend";
import { default as ResistanceMechanismsLegend } from "./ResistanceMechanisms/legend";
import { default as LevelOfInvolvementLegend } from "./Involvement/legend";
import { PreventionFilters, PreventionMapType } from "../../../store/types";
import PboDeploymentLegend from "./PboDeployment/PboDeploymentLegend";
import * as R from "ramda";
import {
  filterByAssayTypes,
  filterByInsecticideClass,
  filterByType,
  filterByYearRange
} from "../studies-filters";
import CountrySymbols from "./Countries/CountrySymbols";
import PreventionCountryLegend from "./Countries/PreventionCountryLegend";

export const resolveMapTypeSymbols = (
  preventionFilters: PreventionFilters,
  countryMode: boolean
) => {
  if (countryMode) {
    return CountrySymbols;
  }
  switch (preventionFilters.mapType) {
    case PreventionMapType.RESISTANCE_STATUS:
      return resistanceStatusSymbols;
    case PreventionMapType.INTENSITY_STATUS:
      return intensityStatusSymbols;
    case PreventionMapType.RESISTANCE_MECHANISM:
      return resistanceMechanismSymbols;
    case PreventionMapType.LEVEL_OF_INVOLVEMENT:
      return levelOfInvolvementSymbols;
    case PreventionMapType.PBO_DEPLOYMENT:
      return PboDeploymentSymbols;
    default:
      return;
  }
};

export const resolveMapTypeLegend = (
  preventionFilters: PreventionFilters,
  countryMode: boolean
) => {
  if (countryMode) {
    return <PreventionCountryLegend />;
  }
  switch (preventionFilters.mapType) {
    case PreventionMapType.RESISTANCE_STATUS:
      return <ResistanceStatusLegend />;
    case PreventionMapType.INTENSITY_STATUS:
      return <IntensityStatusLegend />;
    case PreventionMapType.RESISTANCE_MECHANISM:
      return <ResistanceMechanismsLegend />;
    case PreventionMapType.LEVEL_OF_INVOLVEMENT:
      return <LevelOfInvolvementLegend />;
    case PreventionMapType.PBO_DEPLOYMENT:
      return <PboDeploymentLegend />;
    default:
      return <span />;
  }
};

function filterByCriteria1(group: any[]) {
  const currentYear = new Date().getFullYear();
  const baseStudies = [
    filterByAssayTypes(["DISCRIMINATING_CONCENTRATION_BIOASSAY"]),
    filterByInsecticideClass("PYRETHROIDS")
  ].reduce((studies, filter) => studies.filter(filter), group);
  let filteredStudies = baseStudies.filter(
    filterByYearRange([currentYear - 3, currentYear - 1])
  );
  if (filteredStudies.length === 0) {
    const maxYear = R.reduce(
      R.max,
      0,
      baseStudies.map(study => parseInt(study.YEAR_START))
    );
    filteredStudies = baseStudies.filter(
      study => maxYear === parseInt(study.YEAR_START)
    );
  }
  return filteredStudies;
}

function meetsCriteria1(group: any[]) {
  let filteredStudies = filterByCriteria1(group);
  if (filteredStudies.length === 0) return;
  return R.any(study => study.MORTALITY_ADJUSTED < 0.9, filteredStudies);
}

function meetsCriteria2(group: any[]) {
  let filteredStudies = filterByCriteria1(group);
  if (filteredStudies.length === 0) return;
  return R.any(
    study => study.MORTALITY_ADJUSTED >= 0.1 && study.MORTALITY_ADJUSTED <= 0.8,
    filteredStudies
  );
}
function meetsCriteria3(group: any[]) {
  const filteredStudies = [
    filterByAssayTypes([
      "SYNERGIST-INSECTICIDE_BIOASSAY",
      "BIOCHEMICAL_ASSAY",
      "MOLECULAR_ASSAY"
    ]),
    filterByType("MONO_OXYGENASES")
  ].reduce((studies, filter) => studies.filter(filter), group);
  if (filteredStudies.length === 0) return;
  return R.any(study => study.MECHANISM_STATUS === "DETECTED", filteredStudies);
}
export const studySelector = (group: any[], mapType: PreventionMapType) => {
  switch (mapType) {
    case PreventionMapType.PBO_DEPLOYMENT:
      const criteria1 = meetsCriteria1(group);
      const criteria2 = meetsCriteria2(group);
      const criteria3 = meetsCriteria3(group);
      const pboDeploymentStatus =
        criteria1 && criteria2 && criteria3
          ? PboDeploymentStatus.ELIGIBLE
          : R.any(v => v == false, [criteria1, criteria2, criteria3])
          ? PboDeploymentStatus.NOT_ELIGIBLE
          : PboDeploymentStatus.NOT_ENOUGH_DATA;
      return {
        ...group[0],
        PBO_DEPLOYMENT_CRITERIA_1: criteria1,
        PBO_DEPLOYMENT_CRITERIA_2: criteria2,
        PBO_DEPLOYMENT_CRITERIA_3: criteria3,
        PBO_DEPLOYMENT_STATUS: pboDeploymentStatus
      };
    default:
      return group[0];
  }
};
