import { MalariaState } from "../malaria/reducer";
import { PreventionState } from "../malaria/prevention/reducer";
import { DiagnosisState } from "../malaria/diagnosis/reducer";
import { TreatmentState } from "../malaria/treatment/reducer";
import { InvasiveState } from "../malaria/invasive/reducer";

export interface State {
  malaria: MalariaState;
  prevention: PreventionState;
  diagnosis: DiagnosisState;
  treatment: TreatmentState;
  invasive: InvasiveState;
}
