export enum ActionTypeEnum {
  MalariaSetAny = "malaria/SET_ANY",
  MalariaSetTheme = "malaria/SET_THEME",
  MalariaLogEvent = "malaria/LOG_EVENT",
  MalariaSetRegion = "malaria/SET_REGION",
  MalariaSetFilters = "malaria/SET_FILTERS",
  MalariaToogleEndemicityLayer = "malaria/TOGGLE_ENDEMICITY_LAYER",
  MalariaSetCountryMode = "malaria/SET_COUNTRY_MODE",
  MalariaSetStoryMode = "malaria/SET_STORY_MODE",
  MalariaSetStoryModeStep = "malaria/SET_STORY_MODE_STEP",
  MalariaSetInitialDialogOpen = "malaria/SET_INITIAL_DIALOG_OPEN",
  SetFiltersOpen = "malaria/SET_FILTERS_OPEN",
  SetFiltersMode = "malaria/SET_FILTERS_MODE",
  SetSelection = "malaria/SET_SELECTION",
  SetMobileOptionsOpen = "malaria/SET_MOBILE_OPTIONS_OPEN",
  UpdateZoom = "malaria/UPDATE_ZOOM",
  SetZoom = "malaria/SET_ZOOM",
  UpdateBounds = "malaria/UPDATE_BOUNDS",
  SetBounds = "malaria/SET_BOUNDS",
  SetTourOpen = "malaria/SET_TOUR_OPEN",
  SetTourStep = "malaria/SET_TOUR_STEP",

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
  SetPreventionFilteredStudies = "prevention/SET_FILTER_STUDIES",

  SetDiagnosisMapType = "prevention/SET_DIAGNOSIS_MAP_TYPE",

  FetchDiagnosisStudiesRequest = "diagnosis/FETCH_DIAGNOSIS_STUDIES_REQUEST",
  FetchDiagnosisStudiesSuccess = "diagnosis/FETCH_DIAGNOSIS_STUDIES_SUCCESS",
  FetchDiagnosisStudiesError = "diagnosis/FETCH_DIAGNOSIS_STUDIES_ERROR",

  SetSurveyTypes = "diagnosis/SET_DIAGNOSIS_SURVEY_TYPES",
  SetPatientType = "diagnosis/SET_DIAGNOSIS_PATIENT_TYPE",
  SetDeletionType = "diagnosis/SET_DIAGNOSIS_DELETION_TYPE",
  SetDiagnosisFilteredStudies = "diagnosis/SET_FILTER_STUDIES",

  FetchTreatmentStudiesRequest = "treatment/FETCH_TREATMENT_STUDIES_REQUEST",
  FetchTreatmentStudiesSuccess = "treatment/FETCH_TREATMENT_STUDIES_SUCCESS",
  FetchTreatmentStudiesError = "treatment/FETCH_TREATMENT_STUDIES_ERROR",

  SetTreatmentMapType = "treatment/SET_TREATMENT_MAP_TYPE",
  SetPlasmodiumSpecies = "treatment/SET_TREATMENT_PLASMODIUM_SPECIES",
  SetDrug = "treatment/SET_TREATMENT_DRUG",
  SetMolecularMarker = "treatment/SET_MOLECULAR_MARKER",
  SetTreatmentFilteredStudies = "treatment/SET_FILTER_STUDIES",

  FetchInvasiveStudiesRequest = "invasive/FETCH_INVASIVE_STUDIES_REQUEST",
  FetchInvasiveStudiesSuccess = "invasive/FETCH_INVASIVE_STUDIES_SUCCESS",
  FetchInvasiveStudiesError = "invasive/FETCH_INVASIVE_STUDIES_ERROR",

  SetInvasiveMapType = "invasive/SET_INVASIVE_MAP_TYPE",
  SetInvasiveVectorSpecies = "invasive/SET_INVASIVE_VECTOR_SPECIES",
  SetInvasiveFilteredStudies = "invasive/SET_FILTER_STUDIES",

  FetchTranslationsRequest = "translations/FETCH_TRANSLATIONS_REQUEST",
  FetchTranslationsSuccess = "translations/FETCH_TRANSLATIONS_SUCCESS",
  FetchTranslationsError = "translations/FETCH_TRANSLATIONS_ERROR",

  FetchCountryLayerRequest = "layers/FETCH_COUNTRY_LAYER_REQUEST",
  FetchCountryLayerSuccess = "layers/FETCH_COUNTRY_LAYER_SUCCESS",
  FetchCountryLayerError = "layers/FETCH_COUNTRY_LAYER_ERROR"
}
