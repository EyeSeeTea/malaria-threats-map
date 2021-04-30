import { PreventionRepository } from "../repositories/PreventionRepository";
import { FutureData } from "../common/FutureData";
import { PreventionStudy } from "../entities/PreventionStudy";

export class GetPreventionStudiesUseCase {
    constructor(private preventionRepository: PreventionRepository) { }

    execute(): FutureData<PreventionStudy[]> {
        return this.preventionRepository.getStudies();
    }
}