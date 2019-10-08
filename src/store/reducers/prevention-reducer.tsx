import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { PreventionMapType, PreventionState, State } from "../types";
import { PreventionResponse } from "../../types/Prevention";

const initialState: PreventionState = Object.freeze({
  studies: [],
  filters: {
    mapType: PreventionMapType.RESISTANCE_STATUS,
    insecticideClass: "PYRETHROIDS",
    insecticideTypes: [],
    type: null,
    species: []
  }
});

function updatePreventionMapType(mapType: PreventionMapType) {
  return (state: PreventionState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        mapType: mapType || PreventionMapType.RESISTANCE_STATUS
      }
    };
  };
}

function updateInsecticideClass(insecticideClass: string) {
  return (state: PreventionState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        insecticideClass: insecticideClass || "PYRETHROIDS"
      }
    };
  };
}

function updateInsecticideTypes(insecticideTypes: string[]) {
  return (state: PreventionState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        insecticideTypes: insecticideTypes || []
      }
    };
  };
}

function updateType(type: string) {
  return (state: PreventionState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        type
      }
    };
  };
}

function updateSpecies(species: string[]) {
  return (state: PreventionState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        species: species || []
      }
    };
  };
}

export default createReducer<PreventionState>(initialState, {
  [ActionTypeEnum.FetchPreventionStudiesSuccess]: (
    response: PreventionResponse
  ) => R.assoc("studies", response.features.map(feature => feature.attributes)),
  [ActionTypeEnum.SetPreventionMapType]: updatePreventionMapType,
  [ActionTypeEnum.SetInsecticideClass]: updateInsecticideClass,
  [ActionTypeEnum.SetInsecticideTypes]: updateInsecticideTypes,
  [ActionTypeEnum.SetType]: updateType,
  [ActionTypeEnum.SetSpecies]: updateSpecies
});

export const selectPreventionState = (state: State) => state.prevention;

export const selectPreventionStudies = createSelector(
  selectPreventionState,
  R.prop("studies")
);

export const selectPreventionFilters = createSelector(
  selectPreventionState,
  R.prop("filters")
);
