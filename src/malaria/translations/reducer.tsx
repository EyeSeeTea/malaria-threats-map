import * as R from "ramda";
import { ActionTypeEnum } from "../../store/actions";
import { createReducer } from "../../store/reducer-utils";
import { createSelector } from "reselect";
import { State } from "../../store/types";
import { Translation, TranslationResponse } from "../../types/Translation";

export interface TranslationsState {
  translations: Translation[];
  loading: boolean;
  fields: any;
}

const initialState: TranslationsState = Object.freeze({
  translations: [],
  loading: false,
  fields: {}
});

export default createReducer<TranslationsState>(initialState, {
  [ActionTypeEnum.FetchTranslationsRequest]: () => R.assoc("loading", true),
  [ActionTypeEnum.FetchTranslationsSuccess]: (response: TranslationResponse) =>
    R.mergeLeft({
      translations: response.features.map(feature => feature.attributes),
      loading: false,
      fields: R.groupBy(
        R.path(["FIELD"]),
        response.features.map(feature => feature.attributes)
      )
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

export const selectFields = createSelector(
  selectTranslationsState,
  R.prop("fields")
);

export const selectInsecticideClasses = createSelector(
  selectFields,
  R.prop("INSECTICIDE_CLASS")
);

export const selectInsecticideTypes = createSelector(
  selectFields,
  R.prop("INSECTICIDE_TYPE")
);

export const selectTypes = createSelector(
  selectFields,
  R.prop("TYPE")
);

export const selectSpecies = createSelector(
  selectFields,
  R.prop("SPECIES")
);

export const selectCountries = createSelector(
  selectTranslationsState,
  state => {
    const { COUNTRY_NAME } = R.groupBy(R.path(["FIELD"]), state.translations);
    return COUNTRY_NAME;
  }
);
