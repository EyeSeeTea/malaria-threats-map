import { FutureData } from "../common/FutureData";
import { TreatmentStudy } from "../entities/TreatmentStudy";

export interface TreatmentRepository {
    getStudies(): FutureData<TreatmentStudy[]>;
}
