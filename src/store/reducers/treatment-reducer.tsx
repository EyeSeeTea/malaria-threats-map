import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { State, TreatmentMapType, TreatmentState } from "../types";
import { TreatmentResponse, TreatmentStudy } from "../../types/Treatment";
import { selectDiagnosisState } from "./diagnosis-reducer";

const initialState: TreatmentState = Object.freeze({
  studies: [],
  error: null,
  loading: false,
  filteredStudies: [],
  filters: {
    mapType: TreatmentMapType.TREATMENT_FAILURE,
    plasmodiumSpecies: "P._FALCIPARUM",
    drug: "DRUG_AL",
    molecularMarker: 1
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

function updateMolecularMarker(molecularMarker: number) {
  return updateFilter("molecularMarker", molecularMarker, 1);
}
function groupStudies(response: TreatmentResponse) {
  const allStudies: TreatmentStudy[] = response.features.map(
    feature => feature.attributes
  );
  const filtered255Studies = allStudies.filter(
    study => study.DimensionID === 255 || study.DimensionID === 256
  );
  return filtered255Studies.map(study => ({
    ...study,
    groupStudies: allStudies.filter(
      relatedStudy =>
        relatedStudy.DimensionID === 257 && relatedStudy.K13_CODE === study.Code
    )
  }));
}

export default createReducer<TreatmentState>(initialState, {
  [ActionTypeEnum.FetchTreatmentStudiesRequest]: () => state => ({
    ...state,
    loading: true
  }),
  [ActionTypeEnum.FetchTreatmentStudiesSuccess]: (
    response: TreatmentResponse
  ) => state => ({
    ...state,
    loading: false,
    studies: groupStudies(response)
  }),
  [ActionTypeEnum.FetchTreatmentStudiesError]: () => state => ({
    ...state,
    error: "There was a problem loading studies",
    loading: false
  }),
  [ActionTypeEnum.SetTreatmentMapType]: updateMapType,
  [ActionTypeEnum.SetPlasmodiumSpecies]: updatePlasmodiumSpecies,
  [ActionTypeEnum.SetDrug]: updateDrug,
  [ActionTypeEnum.SetMolecularMarker]: updateMolecularMarker,
  [ActionTypeEnum.SetTreatmentFilteredStudies]: (
    filteredStudies: TreatmentStudy[]
  ) => R.assoc("filteredStudies", filteredStudies)
});

export const selectTreatmentState = (state: State) => state.treatment;

export const selectTreatmentStudies = createSelector(
  selectTreatmentState,
  R.prop("studies")
);

export const selectTreatmentStudiesLoading = createSelector(
  selectTreatmentState,
  R.prop("loading")
);

export const selectTreatmentStudiesError = createSelector(
  selectTreatmentState,
  R.prop("error")
);

export const selectFilteredTreatmentStudies = createSelector(
  selectTreatmentState,
  R.prop("filteredStudies")
);

export const selectTreatmentFilters = createSelector(
  selectTreatmentState,
  R.prop("filters")
);
