import React from "react";
import { TreatmentFilters, TreatmentMapType } from "../../../store/types";
import TreatmentFailureLeyend from "./TreatmentFailure/TreatmentFailureLegend";
import treatmentLayerSymbols from "./TreatmentFailure/treatmentLayerSymbols";
import * as R from "ramda";
import { TREATMENT_FAILURE_STATUS } from "./TreatmentFailure/utils";
import TreatmentCountryLegend from "./Countries/TreatmentCountryLegend";
import treatmentCountrySymbols from "./Countries/treatment-country-symbols";

export const resolveMapTypeSymbols = (
  treatmentFilters: TreatmentFilters,
  countryMode: boolean
) => {
  if (countryMode) {
    return treatmentCountrySymbols;
  }
  switch (treatmentFilters.mapType) {
    case TreatmentMapType.TREATMENT_FAILURE:
      return treatmentLayerSymbols;
    default:
      return <span />;
  }
};

export const resolveMapTypeLegend = (
  treatmentFilters: TreatmentFilters,
  countryMode: boolean
) => {
  if (countryMode) {
    return <TreatmentCountryLegend />;
  }
  switch (treatmentFilters.mapType) {
    case TreatmentMapType.TREATMENT_FAILURE:
      return <TreatmentFailureLeyend />;
    default:
      return <span />;
  }
};

const filterByMostRecentYear = (group: any[]) => {
  const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), group);
  // We filter all studies conducted that year.
  return R.filter(
    study =>
      parseInt(study.YEAR_START) === parseInt(sortedStudies[0].YEAR_START),
    group
  );
};

const resolveStatus = (percentage: number) => {
  if (percentage > 0.2) {
    return TREATMENT_FAILURE_STATUS.HIGH;
  } else if (percentage > 0.1 && percentage <= 0.2) {
    return TREATMENT_FAILURE_STATUS.MEDIUM_HIGH;
  } else if (percentage > 0.05 && percentage <= 0.1) {
    return TREATMENT_FAILURE_STATUS.MEDIUM;
  } else if (percentage <= 0.05) {
    return TREATMENT_FAILURE_STATUS.LOW;
  }
  return TREATMENT_FAILURE_STATUS.UNKNOWN;
};

function getByMostRecentYearAndTreatmentFailure(group: any[]) {
  const enrichedGroup = group.map(study => ({
    ...study,
    TREATMENT_FAILURE:
      study.TREATMENT_FAILURE_PP !== "NA"
        ? study.TREATMENT_FAILURE_PP
        : study.TREATMENT_FAILURE_KM
  }));
  const filteredStudies = filterByMostRecentYear(enrichedGroup);
  // We sort remaining records by RESISTANCE INTENSITY
  const filteredSortedStudies = R.sortBy(
    study => -study.TREATMENT_FAILURE,
    filteredStudies
  );
  return {
    ...filteredSortedStudies[0],
    TREATMENT_FAILURE_STATUS: resolveStatus(
      filteredSortedStudies[0].TREATMENT_FAILURE
    )
  };
}

export const studySelector = (group: any[], mapType: TreatmentMapType) => {
  switch (mapType) {
    case TreatmentMapType.TREATMENT_FAILURE:
      return getByMostRecentYearAndTreatmentFailure(group);
    default:
      return group[0];
  }
};
