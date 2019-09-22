import * as R from "ramda";
import { ActionTypeEnum } from "../../store/actions";
import { createReducer } from "../../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../../store/types";
import { PreventionResponse, PreventionStudy } from "../../types/Prevention";

export enum PreventionMapType {
  RESISTANCE_STATUS,
  INTENSITY_STATUS,
  RESISTANCE_MECHANISM,
  LEVEL_OF_INVOLVEMENT
}

export interface PreventionFilters {
  mapType: PreventionMapType;
}

export interface PreventionState {
  studies: PreventionStudy[];
  filters: PreventionFilters;
}

const initialState: PreventionState = Object.freeze({
  studies: [],
  filters: {
    mapType: PreventionMapType.RESISTANCE_STATUS
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

export default createReducer<PreventionState>(initialState, {
  [ActionTypeEnum.FetchPreventionStudiesSuccess]: (
    response: PreventionResponse
  ) => R.assoc("studies", response.features.map(feature => feature.attributes)),
  [ActionTypeEnum.SetPreventionMapType]: updatePreventionMapType
});

export const selectPreventionState = (state: State) => state.prevention;

export const selectPreventionStudies = createSelector(
  selectPreventionState,
  R.prop("studies")
);

export const selectFilters = createSelector(
  selectPreventionState,
  R.prop("filters")
);
