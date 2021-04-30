import { InvasiveRepository } from "../repositories/InvasiveRepository";
import { FutureData } from "../common/FutureData";
import { InvasiveStudy } from "../entities/InvasiveStudy";

export class GetInvasiveStudiesUseCase {
    constructor(private treatmentRepository: InvasiveRepository) { }

    execute(): FutureData<InvasiveStudy[]> {
        return this.treatmentRepository.getStudies();
    }
}