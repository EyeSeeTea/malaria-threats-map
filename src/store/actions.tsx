import { ActionType } from "typesafe-actions";
import * as malariaActions from "../malaria/actions";

export enum ActionTypeEnum {
  MalariaSetTitle = "malaria/SET_TITLE",
  MalariaSetTheme = "malaria/SET_THEME",
  MalariaSetFilters = "malaria/SET_FILTERS",
  MalariaToogleEndemicityLayer = "malaria/TOGGLE_ENDEMICITY_LAYER",

  FetchPreventionStudiesRequest = "prevention/FETCH_PREVENTION_STUDIES_REQUEST",
  FetchPreventionStudiesSuccess = "prevention/FETCH_PREVENTION_STUDIES_SUCCESS",
  FetchPreventionStudiesError = "prevention/FETCH_PREVENTION_STUDIES_ERROR",

  FetchDiagnosisStudiesRequest = "diagnosis/FETCH_DIAGNOSIS_STUDIES_REQUEST",
  FetchDiagnosisStudiesSuccess = "diagnosis/FETCH_DIAGNOSIS_STUDIES_SUCCESS",
  FetchDiagnosisStudiesError = "diagnosis/FETCH_DIAGNOSIS_STUDIES_ERROR",

  FetchTreatmentStudiesRequest = "treatment/FETCH_TREATMENT_STUDIES_REQUEST",
  FetchTreatmentStudiesSuccess = "treatment/FETCH_TREATMENT_STUDIES_SUCCESS",
  FetchTreatmentStudiesError = "treatment/FETCH_TREATMENT_STUDIES_ERROR",

  FetchInvasiveStudiesRequest = "invasive/FETCH_INVASIVE_STUDIES_REQUEST",
  FetchInvasiveStudiesSuccess = "invasive/FETCH_INVASIVE_STUDIES_SUCCESS",
  FetchInvasiveStudiesError = "invasive/FETCH_INVASIVE_STUDIES_ERROR",

  FetchTranslationsRequest = "translations/FETCH_TRANSLATIONS_REQUEST",
  FetchTranslationsSuccess = "translations/FETCH_TRANSLATIONS_SUCCESS",
  FetchTranslationsError = "translations/FETCH_TRANSLATIONS_ERROR"
}

export type MalariaAction = ActionType<typeof malariaActions>;
