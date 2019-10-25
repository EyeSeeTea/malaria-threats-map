import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { State, TranslationsState } from "../types";
import { TranslationResponse } from "../../types/Translation";

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

export const selectAssayTypes = createSelector(
  selectFields,
  R.prop("ASSAY_TYPE")
);

export const selectTypes = createSelector(
  selectFields,
  R.prop("TYPE")
);

export const selectSynergistTypes = createSelector(
  selectFields,
  R.prop("SYNERGIST_TYPE")
);

export const selectSpecies = createSelector(
  selectFields,
  R.prop("SPECIES")
);

export const selectSurveyTypes = createSelector(
  selectFields,
  R.prop("SURVEY_TYPE")
);

export const selectPatientType = createSelector(
  selectFields,
  R.prop("PATIENT_TYPE")
);

export const selectCountries = createSelector(
  selectTranslationsState,
  state => {
    const { COUNTRY_NAME } = R.groupBy(R.path(["FIELD"]), state.translations);
    return COUNTRY_NAME;
  }
);

export const selectPlasmodiumSpecies = createSelector(
  selectFields,
  R.prop("PLASMODIUM_SPECIES")
);

export const selectDrugs = createSelector(
  selectFields,
  R.prop("DRUG_NAME")
);
