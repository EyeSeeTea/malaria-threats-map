import { FutureData } from "../common/FutureData";
import { DiagnosisStudy } from "../entities/DiagnosisStudy";

export interface DiagnosisRepository {
    getStudies(): FutureData<DiagnosisStudy[]>
}