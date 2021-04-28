import { TreatmentRepository } from "../repositories/TreatmentRepository";
import { FutureData } from "../common/FutureData";
import { TreatmentStudy } from "../entities/TreatmentStudy";

export class GetTreatmentStudiesUseCase {
    constructor(private treatmentRepository: TreatmentRepository) {}

    execute(): FutureData<TreatmentStudy[]> {
        return this.treatmentRepository.getStudies();
    }
}