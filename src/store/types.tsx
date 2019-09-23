import { MalariaState } from "../malaria/reducer";
import { PreventionState } from "../malaria/prevention/reducer";
import { DiagnosisState } from "../malaria/diagnosis/reducer";
import { TreatmentState } from "../malaria/treatment/reducer";
import { InvasiveState } from "../malaria/invasive/reducer";
import { TranslationsState } from "../malaria/translations/reducer";
import { CountryLayerState } from "./reducers/country-layer-reducer";

export interface State {
  malaria: MalariaState;
  prevention: PreventionState;
  diagnosis: DiagnosisState;
  treatment: TreatmentState;
  invasive: InvasiveState;
  translations: TranslationsState;
  countryLayer: CountryLayerState;
}
