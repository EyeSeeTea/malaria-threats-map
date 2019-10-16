export enum ActionTypeEnum {
  MalariaSetAny = "malaria/SET_ANY",
  MalariaSetTheme = "malaria/SET_THEME",
  MalariaSetRegion = "malaria/SET_REGION",
  MalariaSetFilters = "malaria/SET_FILTERS",
  MalariaToogleEndemicityLayer = "malaria/TOGGLE_ENDEMICITY_LAYER",

  FetchPreventionStudiesRequest = "prevention/FETCH_PREVENTION_STUDIES_REQUEST",
  FetchPreventionStudiesSuccess = "prevention/FETCH_PREVENTION_STUDIES_SUCCESS",
  FetchPreventionStudiesError = "prevention/FETCH_PREVENTION_STUDIES_ERROR",

  SetPreventionMapType = "prevention/SET_PREVENTION_MAP_TYPE",
  SetInsecticideClass = "prevention/SET_INSECTICIDE_CLASS",
  SetInsecticideTypes = "prevention/SET_INSECTICIDE_TYPES",
  SetType = "prevention/SET_TYPE",
  SetSynergistTypes = "prevention/SET_SYNERGIST_TYPES",
  SetSpecies = "prevention/SET_SPECIES",
  SetAssayTypes = "prevention/SET_ASSAY_TYPES",

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
  FetchTranslationsError = "translations/FETCH_TRANSLATIONS_ERROR",

  FetchCountryLayerRequest = "layers/FETCH_COUNTRY_LAYER_REQUEST",
  FetchCountryLayerSuccess = "layers/FETCH_COUNTRY_LAYER_SUCCESS",
  FetchCountryLayerError = "layers/FETCH_COUNTRY_LAYER_ERROR"
}
