import { FutureData } from "../common/FutureData";
import { DiagnosisStudy } from "../entities/DiagnosisStudy";
import { DiagnosisRepository } from "../repositories/DiagnosisRepository";

export class GetDiagnosisStudiesUseCase {
    constructor(private diagnosisRepository: DiagnosisRepository) { }

    execute(): FutureData<DiagnosisStudy[]> {
        return this.diagnosisRepository.getStudies();
    }
}