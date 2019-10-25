import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { State, TreatmentMapType, TreatmentState } from "../types";
import { TreatmentResponse } from "../../types/Treatment";

const initialState: TreatmentState = Object.freeze({
  studies: [],
  filters: {
    mapType: TreatmentMapType.TREATMENT_FAILURE,
    plasmodiumSpecies: "P._FALCIPARUM",
    drug: "DRUG_AL"
  }
});

function updateFilter<T>(key: string, value: T, def?: T) {
  return (state: TreatmentState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        [key]: value || def
      }
    };
  };
}

function updateMapType(mapType: TreatmentMapType) {
  return updateFilter("mapType", mapType, TreatmentMapType.TREATMENT_FAILURE);
}

function updatePlasmodiumSpecies(plasmodiumSpecies: string) {
  return updateFilter("plasmodiumSpecies", plasmodiumSpecies, "P._FALCIPARUM");
}

function updateDrug(drug: string) {
  return updateFilter("drug", drug, "DRUG_AL");
}

export default createReducer<TreatmentState>(initialState, {
  [ActionTypeEnum.FetchTreatmentStudiesSuccess]: (
    response: TreatmentResponse
  ) => R.assoc("studies", response.features.map(feature => feature.attributes)),
  [ActionTypeEnum.SetTreatmentMapType]: updateMapType,
  [ActionTypeEnum.SetPlasmodiumSpecies]: updatePlasmodiumSpecies,
  [ActionTypeEnum.SetDrug]: updateDrug
});

export const selectTreatmentState = (state: State) => state.treatment;

export const selectTreatmentStudies = createSelector(
  selectTreatmentState,
  R.prop("studies")
);

export const selectTreatmentFilters = createSelector(
  selectTreatmentState,
  R.prop("filters")
);
