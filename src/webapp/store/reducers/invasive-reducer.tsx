import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { InvasiveMapType, InvasiveState, State } from "../types";
import { InvasiveResponse } from "../../types/Invasive";
import { PreventionStudy } from "../../types/Prevention";

const initialState: InvasiveState = Object.freeze({
  studies: [],
  error: null,
  loading: false,
  filteredStudies: [],
  filters: {
    mapType: InvasiveMapType.VECTOR_OCCURANCE,
    vectorSpecies: []
  }
});

function updateSpecies(vectorSpecies: string[]) {
  return updateFilter("vectorSpecies", vectorSpecies, []);
}

function updateFilter<T>(key: string, value: T, def?: T) {
  return (state: InvasiveState) => {
    return {
      ...state,
      filters: {
        ...state.filters,
        [key]: value || def
      }
    };
  };
}

export default createReducer<InvasiveState>(initialState, {
  [ActionTypeEnum.FetchInvasiveStudiesRequest]: () => state => ({
    ...state,
    loading: true
  }),
  [ActionTypeEnum.FetchInvasiveStudiesSuccess]: (
    response: InvasiveResponse
  ) => state => ({
    ...state,
    loading: false,
    studies: response.features.map(feature => feature.attributes)
  }),
  [ActionTypeEnum.FetchInvasiveStudiesError]: () => state => ({
    ...state,
    error: "There was a problem loading studies",
    loading: false
  }),
  [ActionTypeEnum.SetInvasiveVectorSpecies]: updateSpecies,
  [ActionTypeEnum.SetInvasiveFilteredStudies]: (
    filteredStudies: PreventionStudy[]
  ) => R.assoc("filteredStudies", filteredStudies)
});

export const selectInvasiveState = (state: State) => state.invasive;

export const selectInvasiveStudies = createSelector(
  selectInvasiveState,
  R.prop("studies")
);

export const selectInvasiveStudiesLoading = createSelector(
  selectInvasiveState,
  R.prop("loading")
);

export const selectInvasiveStudiesError = createSelector(
  selectInvasiveState,
  R.prop("error")
);

export const selectFilteredInvasiveStudies = createSelector(
  selectInvasiveState,
  R.prop("filteredStudies")
);

export const selectInvasiveFilters = createSelector(
  selectInvasiveState,
  R.prop("filters")
);
