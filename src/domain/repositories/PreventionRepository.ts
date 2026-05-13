import { FutureData } from "../common/FutureData";
import { PreventionStudy } from "../entities/PreventionStudy";

export interface PreventionRepository {
    getStudies(): FutureData<PreventionStudy[]>;
    getResistanceStatusTypeStudies(): FutureData<PreventionStudy[]>;
    getResistanceIntensityTypeStudies(): FutureData<PreventionStudy[]>;
    getResistanceMechanismTypeStudies(): FutureData<PreventionStudy[]>;
    getSynergistEffectTypeStudies(): FutureData<PreventionStudy[]>;
}
