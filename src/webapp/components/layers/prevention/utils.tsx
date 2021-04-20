import React from "react";
import resistanceStatusSymbols from "./ResistanceStatus/symbols";
import intensityStatusSymbols from "./IntensityStatus/symbols";
import resistanceMechanismSymbols from "./ResistanceMechanisms/symbols";
import levelOfInvolvementSymbols from "./Involvement/symbols";
import PboDeploymentSymbols, {
  PboDeploymentStatus,
} from "./PboDeployment/PboDeploymentSymbols";
import { default as ResistanceStatusLegend } from "./ResistanceStatus/legend";
import { default as IntensityStatusLegend } from "./IntensityStatus/legend";
import { default as ResistanceMechanismsLegend } from "./ResistanceMechanisms/legend";
import { PreventionFilters, PreventionMapType } from "../../../store/types";
import PboDeploymentLegend from "./PboDeployment/PboDeploymentLegend";
import * as R from "ramda";
import {
  filterByAssayTypes,
  filterByInsecticideClass,
  filterByType,
  filterByYearRange,
} from "../studies-filters";
import CountrySymbols from "./Countries/PreventionCountrySymbols";
import PreventionCountryLegend from "./Countries/PreventionCountryLegend";
import LevelOfInvolvementLegend from "./Involvement/LevelOfInvolvementLegend";
import PboDeploymentCountriesLegend from "./PboDeployment/PboDeploymentCountriesLegend";

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
    if (
      countryMode &&
      preventionFilters.mapType === PreventionMapType.PBO_DEPLOYMENT
    ) {
      return <PboDeploymentCountriesLegend />;
    } else {
      return <PreventionCountryLegend />;
    }
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
    filterByInsecticideClass("PYRETHROIDS"),
  ].reduce((studies, filter) => studies.filter(filter), group);
  let filteredStudies = baseStudies.filter(
    filterByYearRange([currentYear - 3, currentYear - 1])
  );
  if (filteredStudies.length === 0) {
    const maxYear = R.reduce(
      R.max,
      0,
      baseStudies.map((study) => parseInt(study.YEAR_START))
    );
    filteredStudies = baseStudies.filter(
      (study) => maxYear === parseInt(study.YEAR_START)
    );
  }
  return filteredStudies;
}

export function meetsCriteria1(group: any[], criteria: any) {
  let filteredStudies = filterByCriteria1(group);
  const groupedStudies = R.groupBy(R.prop("SPECIES"), filteredStudies);
  Object.entries(groupedStudies).forEach(([species, studies]) => {
    if (!criteria[species]) {
      criteria[species] = {};
    }
    criteria[species].criteria1 = R.any(
      (study) => study.MORTALITY_ADJUSTED < 0.9,
      studies
    );
  });
  if (filteredStudies.length === 0) return;
  return R.any((study) => study.MORTALITY_ADJUSTED < 0.9, filteredStudies);
}

export function meetsCriteria2(group: any[], criteria: any) {
  let filteredStudies = filterByCriteria1(group);
  const groupedStudies = R.groupBy(R.prop("SPECIES"), filteredStudies);
  Object.entries(groupedStudies).forEach(([species, studies]) => {
    if (!criteria[species]) {
      criteria[species] = {};
    }
    criteria[species].criteria2 = R.any(
      (study) =>
        study.MORTALITY_ADJUSTED >= 0.1 && study.MORTALITY_ADJUSTED <= 0.8,
      studies
    );
  });

  if (filteredStudies.length === 0) return;
  return R.any(
    (study) =>
      study.MORTALITY_ADJUSTED >= 0.1 && study.MORTALITY_ADJUSTED <= 0.8,
    filteredStudies
  );
}
function meetsCriteria3(group: any[], criteria: any) {
  const filteredStudies = [
    filterByAssayTypes([
      "SYNERGIST-INSECTICIDE_BIOASSAY",
      "BIOCHEMICAL_ASSAY",
      "MOLECULAR_ASSAY",
    ]),
    filterByType("MONO_OXYGENASES"),
  ].reduce((studies, filter) => studies.filter(filter), group);
  const groupedStudies = R.groupBy(R.prop("SPECIES"), filteredStudies);
  Object.entries(groupedStudies).forEach(([species, studies]) => {
    if (!criteria[species]) {
      criteria[species] = {};
    }
    criteria[species].criteria3 = R.any(
      (study) => study.MECHANISM_STATUS === "DETECTED",
      studies
    );
  });
  if (filteredStudies.length === 0) return;
  return R.any(
    (study) => study.MECHANISM_STATUS === "DETECTED",
    filteredStudies
  );
}

const filterByMostRecentYear = (group: any[]) => {
  const sortedStudies = R.sortBy((study) => -parseInt(study.YEAR_START), group);
  // We filter all studies conducted that year.
  return R.filter(
    (study) =>
      parseInt(study.YEAR_START) === parseInt(sortedStudies[0].YEAR_START),
    group
  );
};

function getByMostRecentYearAndMortalityAdjusted(group: any[]) {
  const filteredStudies = filterByMostRecentYear(group);
  // We sort remaining records by MORTALITY_ADJUSTED
  const filteredSortedStudies = R.sortBy(
    (study) => parseFloat(study.MORTALITY_ADJUSTED),
    filteredStudies
  );
  return filteredSortedStudies[0];
}

const ResistanceIntensityOrder: { [value: string]: number } = {
  NA: 0,
  COULD_NOT_BE_RELIABLY_ASSESSED: 0,
  SUSCEPTIBLE: 1,
  LOW_INTENSITY: 2,
  MODERATE_INTENSITY: 3,
  MODERATE_TO_HIGH_INTENSITY: 4,
  HIGH_INTENSITY: 5,
};

function getByMostRecentYearAndResistanceIntensity(group: any[]) {
  const filteredStudies = filterByMostRecentYear(group);
  // We sort remaining records by RESISTANCE INTENSITY
  const filteredSortedStudies = R.sortBy(
    (study) => -ResistanceIntensityOrder[study.RESISTANCE_INTENSITY] || 0,
    filteredStudies
  );
  return filteredSortedStudies[0];
}

const ResistanceMechanismOrder: { [value: string]: number } = {
  NA: 0,
  NOT_DETECTED: 0,
  DETECTED: 1,
};

function getByMostRecentYearAndResistanceMechanism(group: any[]) {
  const filteredStudies = filterByMostRecentYear(group);
  // We sort remaining records by RESISTANCE INTENSITY
  const filteredSortedStudies = R.sortBy(
    (study) => -ResistanceMechanismOrder[study.MECHANISM_STATUS] || 0,
    filteredStudies
  );
  return filteredSortedStudies[0];
}

const InvolvementOrder: { [value: string]: number } = {
  COULD_NOT_BE_RELIABLY_ASSESSED: 0,
  NO_INVOLVEMENT: 0,
  PARTIAL_INVOLVEMENT: 1,
  FULL_INVOLVEMENT: 2,
};

function getByMostRecentYearAndInvolvement(group: any[]) {
  const filteredStudies = filterByMostRecentYear(group);
  // We sort remaining records by RESISTANCE INTENSITY
  const filteredSortedStudies = R.sortBy(
    (study) => -InvolvementOrder[study.MECHANISM_PROXY] || 0,
    filteredStudies
  );
  return filteredSortedStudies[0];
}

export function evaluateDeploymentStatus(group: any[]) {
  let criteria = {};
  meetsCriteria1(group, criteria);
  meetsCriteria2(group, criteria);
  meetsCriteria3(group, criteria);
  const criterias = Object.entries(criteria);
  let pboDeploymentStatus;
  if (criterias.length === 0) {
    pboDeploymentStatus = PboDeploymentStatus.NO_DATA;
  } else if (
    R.any(
      (c: any) => c.criteria1 && c.criteria2 && c.criteria3,
      R.values(criteria)
    )
  ) {
    pboDeploymentStatus = PboDeploymentStatus.ELIGIBLE;
  } else if (
    R.any(
      (c: any) =>
        c.criteria1 === false || c.criteria2 === false || c.criteria3 === false,
      R.values(criteria)
    )
  ) {
    pboDeploymentStatus = PboDeploymentStatus.NOT_ELIGIBLE;
  } else {
    pboDeploymentStatus = PboDeploymentStatus.NOT_ENOUGH_DATA;
  }
  return { criteria, pboDeploymentStatus };
}

export const studySelector = (group: any[], mapType: PreventionMapType) => {
  switch (mapType) {
    case PreventionMapType.RESISTANCE_STATUS:
      return getByMostRecentYearAndMortalityAdjusted(group);
    case PreventionMapType.INTENSITY_STATUS:
      return getByMostRecentYearAndResistanceIntensity(group);
    case PreventionMapType.RESISTANCE_MECHANISM:
      return getByMostRecentYearAndResistanceMechanism(group);
    case PreventionMapType.LEVEL_OF_INVOLVEMENT:
      return getByMostRecentYearAndInvolvement(group);
    case PreventionMapType.PBO_DEPLOYMENT:
      let { criteria, pboDeploymentStatus } = evaluateDeploymentStatus(group);
      return {
        ...group[0],
        criteria,
        PBO_DEPLOYMENT_STATUS: pboDeploymentStatus,
      };
    default:
      return group[0];
  }
};
