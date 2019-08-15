import * as R from "ramda";
import { ActionTypeEnum } from "../../store/actions";
import { createReducer } from "../../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../../store/types";
import { Translation, TranslationResponse } from "../../types/Translation";

export interface TranslationsState {
  translations: Translation[];
  loading: boolean;
}

const initialState: TranslationsState = Object.freeze({
  translations: [],
  loading: false
});

export default createReducer<TranslationsState>(initialState, {
  [ActionTypeEnum.FetchTranslationsRequest]: () => R.assoc("loading", true),
  [ActionTypeEnum.FetchTranslationsSuccess]: (response: TranslationResponse) =>
    R.mergeLeft({
      translations: response.features.map(feature => feature.attributes),
      loading: false
    }),
  [ActionTypeEnum.FetchTranslationsError]: () => R.assoc("loading", false)
});

export const selectTranslationsState = (state: State) => state.translations;

export const selectTranslations = createSelector(
  selectTranslationsState,
  R.prop("translations")
);

export const selectTranslationsAreLoading = createSelector(
  selectTranslationsState,
  R.prop("loading")
);
