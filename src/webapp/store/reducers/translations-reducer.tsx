import * as R from "ramda";
import { ActionTypeEnum } from "../actions";
import { createReducer } from "../reducer-utils";
import { createSelector } from "reselect";
import { State, TranslationsState } from "../types";
import { TranslationResponse } from "../../types/Translation";

const initialState: TranslationsState = Object.freeze({
    translations: [],
    loading: false,
    fields: {},
});

export default createReducer<TranslationsState>(initialState, {
    [ActionTypeEnum.FetchTranslationsRequest]: () => R.assoc("loading", true),
    [ActionTypeEnum.FetchTranslationsSuccess]: (response: TranslationResponse) =>
        R.mergeLeft({
            translations: response.features.map(feature => feature.attributes),
            loading: false,
            fields: R.groupBy(
                R.prop("FIELD"),
                response.features.map(feature => feature.attributes)
            ),
        }),
    [ActionTypeEnum.FetchTranslationsError]: () => R.assoc("loading", false),
});

const selectTranslationsState = (state: State) => state.translations;

export const selectTranslations = createSelector(selectTranslationsState, state => state.translations);

export const selectTranslationsAreLoading = createSelector(selectTranslationsState, state => state.loading);

const selectFields = createSelector(selectTranslationsState, state => state.fields);

export const selectInsecticideClasses = createSelector(selectFields, state => state.INSECTICIDE_CLASS || []);

export const selectInsecticideTypes = createSelector(selectFields, state => state.INSECTICIDE_TYPE || []);

export const selectAssayTypes = createSelector(selectFields, state => state.ASSAY_TYPE || []);

export const selectTypes = createSelector(selectFields, state => state.TYPE || []);

export const selectProxyTypes = createSelector(selectFields, state => state.PROXY_TYPE || []);

export const selectSpecies = createSelector(selectFields, state => state.SPECIES || []);

export const selectSurveyTypes = createSelector(selectFields, state => state.SURVEY_TYPE || []);

export const selectPatientType = createSelector(selectFields, state => state.PATIENT_TYPE || []);

export const selectCountries = createSelector(selectTranslationsState, state => {
    const { COUNTRY_NAME = [] } = R.groupBy(R.path(["FIELD"]), state.translations);
    return COUNTRY_NAME;
});

export const selectPlasmodiumSpecies = createSelector(selectFields, state => state.PLASMODIUM_SPECIES || []);

export const selectDrugs = createSelector(selectFields, state => state.DRUG_NAME || []);

export const selectSubRegions = createSelector(selectFields, state => state.SUBREGION || []);
export const selectRegions = createSelector(selectFields, state => state.REGION_FULL || []);
