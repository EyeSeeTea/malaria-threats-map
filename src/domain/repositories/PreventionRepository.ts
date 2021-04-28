import { FutureData } from "../common/FutureData";
import { PreventionStudy } from "../entities/PreventionStudy";

export interface PreventionRepository {
    getStudies(): FutureData<PreventionStudy[]>;
}